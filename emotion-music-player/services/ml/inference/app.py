from __future__ import annotations

import os
import re
import unicodedata
from functools import lru_cache
from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel, Field

try:
    import torch
    from transformers import AutoModelForSequenceClassification, AutoTokenizer
except Exception:  # Cho phép service chạy bằng rule-based khi chưa cài transformers/torch.
    torch = None
    AutoModelForSequenceClassification = None
    AutoTokenizer = None

try:
    from underthesea import word_tokenize
except Exception:
    word_tokenize = None

app = FastAPI(title="Vietnamese Emotion ML Service", version="2.0.0")

TARGET_EMOTIONS = ("happy", "sad", "angry", "relaxed")
MODEL_NAME = os.getenv("EMOTION_MODEL_NAME", "visolex/phobert-emotion")
ENABLE_TRANSFORMERS = os.getenv("ENABLE_TRANSFORMERS", "1") != "0"

VALENCE_AROUSAL = {
    "happy": (0.86, 0.65),
    "sad": (0.20, 0.32),
    "angry": (0.18, 0.86),
    "relaxed": (0.66, 0.25),
}

LABEL_ALIASES = {
    "anger": "angry",
    "angry": "angry",
    "disgust": "angry",
    "fear": "angry",
    "sadness": "sad",
    "sad": "sad",
    "negative": "sad",
    "neg": "sad",
    "enjoyment": "happy",
    "joy": "happy",
    "happy": "happy",
    "positive": "happy",
    "pos": "happy",
    "surprise": "happy",
    "other": "relaxed",
    "neutral": "relaxed",
    "neu": "relaxed",
    "calm": "relaxed",
    "relax": "relaxed",
    "relaxed": "relaxed",
}

LEXICON = {
    "happy": [
        "vui", "vui vẻ", "hanh phuc", "hạnh phúc", "tuyệt", "tốt", "thích", "yêu đời",
        "yeu doi", "hào hứng", "hao hung", "phấn khởi", "phan khoi", "may mắn", "may man",
    ],
    "sad": [
        "buồn", "buon", "cô đơn", "co don", "mệt", "mệt mỏi", "met moi", "khóc", "khoc",
        "chán", "chan", "tệ", "te", "áp lực", "ap luc", "đau lòng", "dau long", "kiệt sức",
        "kiet suc", "trống rỗng", "trong rong", "tổn thương", "ton thuong",
    ],
    "angry": [
        "tức", "tuc", "giận", "gian", "bực", "buc", "cáu", "cau", "khó chịu", "kho chiu",
        "phẫn nộ", "phan no", "ghét", "ghet", "điên", "dien", "nóng máu", "nong mau",
    ],
    "relaxed": [
        "thư giãn", "thu gian", "bình yên", "binh yen", "êm", "êm dịu", "em diu", "chill",
        "ổn", "on", "thoải mái", "thoai mai", "nhẹ nhàng", "nhe nhang", "an yên", "an yen",
    ],
}


class PredictRequest(BaseModel):
    user_id: int | None = None
    face_frame: str | None = None
    voice_clip: str | None = None
    text: str | None = None


class RecommendRequest(BaseModel):
    user_id: int
    emotion_state: dict[str, Any]
    limit: int = Field(default=10, ge=1, le=30)


def _strip_accents(value: str) -> str:
    normalized = unicodedata.normalize("NFD", value)
    return "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")


def _clean(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower().strip())


def _normalize_label(label: str | None) -> str:
    if label is None:
        return "relaxed"
    raw = str(label).lower().replace("label_", "").strip()
    return LABEL_ALIASES.get(raw, raw if raw in TARGET_EMOTIONS else "relaxed")


def _normalize_scores(scores: dict[str, float]) -> dict[str, float]:
    total = sum(max(0.0, float(v)) for v in scores.values()) or 1.0
    return {emotion: round(max(0.0, float(scores.get(emotion, 0.0))) / total, 4) for emotion in TARGET_EMOTIONS}


def _lexicon_scores(text: str) -> dict[str, float]:
    raw = _clean(text)
    folded = _strip_accents(raw)
    scores = {emotion: 0.10 for emotion in TARGET_EMOTIONS}

    for emotion, words in LEXICON.items():
        for word in words:
            token = _clean(word)
            folded_token = _strip_accents(token)
            if token in raw or folded_token in folded:
                scores[emotion] += 1.0 + min(len(token.split()), 3) * 0.25

    if any(phrase in raw or _strip_accents(phrase) in folded for phrase in ["không vui", "khong vui", "chẳng vui", "chang vui"]):
        scores["happy"] *= 0.35
        scores["sad"] += 1.0

    return _normalize_scores(scores)


@lru_cache(maxsize=1)
def _load_transformer():
    if not ENABLE_TRANSFORMERS or torch is None or AutoTokenizer is None or AutoModelForSequenceClassification is None:
        return None, None
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=False)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
    model.eval()
    return tokenizer, model


def _prepare_text_for_phobert(text: str) -> str:
    # PhoBERT thường tốt hơn khi văn bản đã được tách từ. Nếu underthesea chưa cài,
    # vẫn dùng raw text để service không bị chết khi chạy local.
    if word_tokenize is None:
        return text
    try:
        return word_tokenize(text, format="text")
    except Exception:
        return text


def _transformer_scores(text: str) -> dict[str, float] | None:
    tokenizer, model = _load_transformer()
    if tokenizer is None or model is None or torch is None:
        return None

    prepared_text = _prepare_text_for_phobert(text)
    inputs = tokenizer(
        prepared_text,
        return_tensors="pt",
        truncation=True,
        max_length=256,
        padding=True,
    )

    with torch.no_grad():
        outputs = model(**inputs)
        probabilities = torch.softmax(outputs.logits, dim=-1)[0].detach().cpu().tolist()

    id2label = getattr(model.config, "id2label", {}) or {}
    scores = {emotion: 0.0 for emotion in TARGET_EMOTIONS}

    for index, probability in enumerate(probabilities):
        label = id2label.get(index, str(index))
        emotion = _normalize_label(label)
        scores[emotion] += float(probability)

    return _normalize_scores(scores)


def analyze_text(text: str) -> dict[str, Any]:
    lexical = _lexicon_scores(text)
    transformer = _transformer_scores(text)

    if transformer is None:
        probabilities = lexical
        model_source = "lexicon-fallback"
    else:
        # Transformer là nguồn chính, lexicon tiếng Việt giúp xử lý các câu ngắn/ít ngữ cảnh.
        mixed = {
            emotion: transformer[emotion] * 0.78 + lexical[emotion] * 0.22
            for emotion in TARGET_EMOTIONS
        }
        probabilities = _normalize_scores(mixed)
        model_source = MODEL_NAME

    label = max(probabilities, key=probabilities.get)
    confidence = probabilities[label]
    valence, arousal = VALENCE_AROUSAL[label]

    return {
        "label": label,
        "valence": valence,
        "arousal": arousal,
        "confidence": confidence,
        "probabilities": probabilities,
        "per_modality": {
            "text": {
                "label": label,
                "confidence": confidence,
                "probabilities": probabilities,
                "model": model_source,
            }
        },
    }


@app.get("/health")
def health():
    tokenizer, model = _load_transformer()
    return {
        "status": "healthy",
        "model": MODEL_NAME if tokenizer is not None and model is not None else "lexicon-fallback",
        "target_emotions": TARGET_EMOTIONS,
    }


@app.post("/predict")
def predict(payload: PredictRequest):
    text = payload.text or ""
    return analyze_text(text)


@app.post("/recommend")
def recommend(payload: RecommendRequest):
    # Recommendation chính đã đặt ở backend API vì API có quyền đọc database tracks.
    # Endpoint này giữ lại để không phá contract cũ.
    emotion = payload.emotion_state.get("label") or payload.emotion_state.get("emotion") or "relaxed"
    return {
        "tracks": [],
        "rationale": f"Recommendation is handled by API database layer for emotion={emotion}.",
    }
