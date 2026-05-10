from __future__ import annotations

import re
import unicodedata
from typing import Any

import requests

from app.core.config import settings

TARGET_EMOTIONS = ("happy", "sad", "angry", "relaxed")

LEXICON = {
    "happy": [
        "vui", "vui vẻ", "hanh phuc", "hạnh phúc", "tuyệt", "tốt", "hay quá",
        "thích", "yeu doi", "yêu đời", "hao hung", "hào hứng", "phan khoi", "phấn khởi",
    ],
    "sad": [
        "buồn", "buon", "cô đơn", "co don", "mệt", "mệt mỏi", "met moi", "khóc",
        "chán", "chan", "tệ", "te", "đau lòng", "dau long", "tổn thương", "ton thuong",
        "kiệt sức", "kiet suc", "áp lực", "ap luc", "trống rỗng", "trong rong",
    ],
    "angry": [
        "tức", "tuc", "giận", "gian", "bực", "buc", "cáu", "cau", "khó chịu", "kho chiu",
        "phẫn nộ", "phan no", "ghét", "ghet", "điên", "dien", "nóng máu", "nong mau",
    ],
    "relaxed": [
        "thư giãn", "thu gian", "bình yên", "binh yen", "êm", "em", "chill", "ổn", "on",
        "thoải mái", "thoai mai", "nhẹ nhàng", "nhe nhang", "an yên", "an yen", "tĩnh", "tinh",
    ],
}

LABEL_ALIASES = {
    "joy": "happy",
    "enjoyment": "happy",
    "positive": "happy",
    "pos": "happy",
    "happy": "happy",
    "sadness": "sad",
    "negative": "sad",
    "neg": "sad",
    "sad": "sad",
    "anger": "angry",
    "angry": "angry",
    "disgust": "angry",
    "fear": "angry",
    "neutral": "relaxed",
    "neu": "relaxed",
    "other": "relaxed",
    "relax": "relaxed",
    "relaxed": "relaxed",
    "calm": "relaxed",
}

VALENCE_AROUSAL = {
    "happy": (0.86, 0.65),
    "sad": (0.20, 0.32),
    "angry": (0.18, 0.86),
    "relaxed": (0.66, 0.25),
}


def _strip_accents(value: str) -> str:
    normalized = unicodedata.normalize("NFD", value)
    return "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")


def _clean_text(text: str) -> str:
    lowered = text.lower().strip()
    lowered = re.sub(r"\s+", " ", lowered)
    return lowered


def _normalize_label(label: str | None) -> str:
    if not label:
        return "relaxed"
    raw = str(label).lower().replace("label_", "").strip()
    return LABEL_ALIASES.get(raw, raw if raw in TARGET_EMOTIONS else "relaxed")


def _lexicon_probabilities(text: str) -> dict[str, float]:
    raw = _clean_text(text)
    folded = _strip_accents(raw)
    scores = {emotion: 0.10 for emotion in TARGET_EMOTIONS}

    for emotion, words in LEXICON.items():
        for word in words:
            token = _clean_text(word)
            folded_token = _strip_accents(token)
            if token in raw or folded_token in folded:
                # Cụm từ dài thường có ý nghĩa mạnh hơn một từ đơn.
                scores[emotion] += 1.0 + min(len(token.split()), 3) * 0.25

    # Một số phủ định thường gặp để tránh gán happy quá cao.
    if any(phrase in raw or _strip_accents(phrase) in folded for phrase in ["không vui", "khong vui", "chẳng vui", "chang vui"]):
        scores["happy"] *= 0.35
        scores["sad"] += 1.0

    total = sum(scores.values()) or 1.0
    return {emotion: round(score / total, 4) for emotion, score in scores.items()}


def _probabilities_from_label(label: str, confidence: float, text: str | None = None) -> dict[str, float]:
    emotion = _normalize_label(label)
    confidence = max(0.0, min(float(confidence or 0.55), 0.98))
    remainder = max(0.0, 1.0 - confidence)
    probabilities = {item: remainder / (len(TARGET_EMOTIONS) - 1) for item in TARGET_EMOTIONS}
    probabilities[emotion] = confidence

    if text:
        lexical = _lexicon_probabilities(text)
        probabilities = {
            item: probabilities[item] * 0.72 + lexical[item] * 0.28
            for item in TARGET_EMOTIONS
        }

    total = sum(probabilities.values()) or 1.0
    return {item: round(probabilities[item] / total, 4) for item in TARGET_EMOTIONS}


def _normalize_probabilities(raw: dict[str, Any] | None, text: str | None = None) -> dict[str, float]:
    raw = raw or {}
    candidates = raw.get("probabilities") or raw.get("scores") or raw.get("emotion_scores") or {}

    probabilities = {item: 0.0 for item in TARGET_EMOTIONS}
    if isinstance(candidates, dict):
        for label, score in candidates.items():
            emotion = _normalize_label(str(label))
            if emotion in probabilities:
                try:
                    probabilities[emotion] += float(score)
                except (TypeError, ValueError):
                    pass

    if sum(probabilities.values()) <= 0:
        return _probabilities_from_label(
            str(raw.get("label") or raw.get("emotion") or "relaxed"),
            float(raw.get("confidence") or 0.55),
            text=text,
        )

    if text:
        lexical = _lexicon_probabilities(text)
        probabilities = {
            item: probabilities[item] * 0.82 + lexical[item] * 0.18
            for item in TARGET_EMOTIONS
        }

    total = sum(probabilities.values()) or 1.0
    return {item: round(probabilities[item] / total, 4) for item in TARGET_EMOTIONS}


def _fallback_emotion(data: dict[str, Any]) -> dict[str, Any]:
    text = str(data.get("text") or "")
    probabilities = _lexicon_probabilities(text)
    label = max(probabilities, key=probabilities.get)
    valence, arousal = VALENCE_AROUSAL[label]
    confidence = probabilities[label]
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
            }
        },
    }


def predict_emotion(data: dict[str, Any]) -> dict[str, Any]:
    text = str(data.get("text") or "")
    try:
        response = requests.post(
            f"{settings.ML_SERVICE_URL}/predict",
            json=data,
            timeout=settings.REQUEST_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        result = response.json()
        probabilities = _normalize_probabilities(result, text=text)
        label = max(probabilities, key=probabilities.get)
        valence, arousal = VALENCE_AROUSAL[label]
        return {
            **result,
            "label": label,
            "valence": float(result.get("valence", valence)),
            "arousal": float(result.get("arousal", arousal)),
            "confidence": probabilities[label],
            "probabilities": probabilities,
        }
    except Exception:
        return _fallback_emotion(data)
