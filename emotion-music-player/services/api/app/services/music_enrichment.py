from __future__ import annotations

from pathlib import Path
from typing import Optional
import hashlib
import math

import librosa
import numpy as np
from mutagen.id3 import ID3, APIC, ID3NoHeaderError


EMOTION_CODES = [
    "happy",
    "sad",
    "focus",
    "healing",
    "relax",
    "lonely",
    "energetic",
    "sleep",
]

EMOTION_LABELS_VI = {
    "happy": "Vui vẻ",
    "sad": "Buồn",
    "focus": "Tập trung",
    "healing": "Chữa lành",
    "relax": "Thư giãn",
    "lonely": "Cô đơn",
    "energetic": "Năng động",
    "sleep": "Dễ ngủ",
}

EMOTION_ALIASES = {
    "vui vẻ": "happy",
    "vui ve": "happy",
    "happy": "happy",

    "buồn": "sad",
    "buon": "sad",
    "sad": "sad",

    "tập trung": "focus",
    "tap trung": "focus",
    "focus": "focus",

    "chữa lành": "healing",
    "chua lanh": "healing",
    "healing": "healing",

    "thư giãn": "relax",
    "thu gian": "relax",
    "relax": "relax",

    "cô đơn": "lonely",
    "co don": "lonely",
    "lonely": "lonely",

    "năng động": "energetic",
    "nang dong": "energetic",
    "energetic": "energetic",

    "dễ ngủ": "sleep",
    "de ngu": "sleep",
    "sleep": "sleep",
}

DEFAULT_COVER_IMAGE = "/images/default-cover.png"

def _to_scalar(value) -> float:
    arr = np.asarray(value)
    if arr.size == 0:
        return 0.0
    return float(arr.reshape(-1)[0])


def _clip(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return float(np.clip(value, low, high))


def normalize_emotion(value: Optional[str]) -> str:
    if not value:
        return "relax"
    return EMOTION_ALIASES.get(value.strip().lower(), "relax")


def extract_audio_features(file_path: str) -> dict:
    try:
        print(f"[AUDIO] Dang doc file: {file_path}")
        y, sr = librosa.load(file_path, sr=22050, mono=True, duration=60.0)

        if y.size == 0:
            print(f"[AUDIO] File rong: {file_path}")
            return {
                "tempo": 0.0,
                "energy": 0.0,
                "brightness": 0.0,
                "acousticness": 0.0,
                "instrumentalness": 0.0,
                "valence": 0.0,
                "loudness": -60.0,
            }

        tempo_raw, _ = librosa.beat.beat_track(y=y, sr=sr)
        tempo = _to_scalar(tempo_raw)

        rms = librosa.feature.rms(y=y)[0]
        zcr = librosa.feature.zero_crossing_rate(y)[0]
        centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
        flatness = librosa.feature.spectral_flatness(y=y)[0]

        harmonic, percussive = librosa.effects.hpss(y)
        harmonic_energy = float(np.mean(np.abs(harmonic)))
        percussive_energy = float(np.mean(np.abs(percussive)))

        energy = _clip(float(np.mean(rms)) / 0.20)
        brightness = _clip(float(np.mean(centroid)) / 3500.0)
        activity = _clip(float(np.mean(zcr)) / 0.12)
        noisiness = _clip(float(np.mean(flatness)) / 0.15)

        total_hp = harmonic_energy + percussive_energy
        instrumentalness = _clip((harmonic_energy / total_hp) if total_hp > 0 else 0.0)

        acousticness = _clip(
            (1.0 - energy) * 0.45
            + (1.0 - brightness) * 0.25
            + (1.0 - activity) * 0.20
            + (1.0 - noisiness) * 0.10
        )

        loudness = float(20.0 * math.log10(max(float(np.mean(np.abs(y))), 1e-6)))

        valence = _clip(
            0.40 * energy
            + 0.30 * brightness
            + 0.20 * _clip(tempo / 150.0)
            + 0.10 * (1.0 - noisiness)
        )

        features = {
            "tempo": tempo,
            "energy": energy,
            "brightness": brightness,
            "acousticness": acousticness,
            "instrumentalness": instrumentalness,
            "valence": valence,
            "loudness": loudness,
        }

        print(f"[AUDIO] Features {file_path}: {features}")
        return features

    except Exception as exc:
        print(f"[AUDIO][ERROR] Khong doc duoc {file_path}: {exc}")
        return {
            "tempo": 0.0,
            "energy": 0.0,
            "brightness": 0.0,
            "acousticness": 0.0,
            "instrumentalness": 0.0,
            "valence": 0.0,
            "loudness": -60.0,
        }

def score_emotions(features: dict) -> dict[str, float]:
    tempo = float(features.get("tempo", 0.0))
    energy = float(features.get("energy", 0.0))
    brightness = float(features.get("brightness", 0.0))
    acousticness = float(features.get("acousticness", 0.0))
    instrumentalness = float(features.get("instrumentalness", 0.0))
    valence = float(features.get("valence", 0.0))

    scores = {
        "energetic": (
            0.45 * energy
            + 0.20 * _clip((tempo - 100.0) / 60.0)
            + 0.20 * brightness
            + 0.15 * valence
        ),
        "happy": (
            0.45 * valence
            + 0.25 * energy
            + 0.20 * _clip((tempo - 90.0) / 50.0)
            + 0.10 * brightness
        ),
        "sad": (
            0.45 * (1.0 - valence)
            + 0.25 * (1.0 - energy)
            + 0.20 * _clip((100.0 - tempo) / 60.0)
            + 0.10 * acousticness
        ),
        "lonely": (
            0.35 * (1.0 - valence)
            + 0.25 * acousticness
            + 0.20 * (1.0 - brightness)
            + 0.20 * (1.0 - energy)
        ),
        "relax": (
            0.35 * (1.0 - energy)
            + 0.30 * acousticness
            + 0.20 * _clip((115.0 - tempo) / 60.0)
            + 0.15 * (1.0 - brightness)
        ),
        "healing": (
            0.30 * acousticness
            + 0.25 * (1.0 - energy)
            + 0.20 * valence
            + 0.15 * (1.0 - brightness)
            + 0.10 * _clip((120.0 - tempo) / 60.0)
        ),
        "focus": (
            0.45 * instrumentalness
            + 0.20 * acousticness
            + 0.15 * (1.0 - energy)
            + 0.10 * _clip((120.0 - tempo) / 50.0)
            + 0.10 * (1.0 - abs(valence - 0.5) * 2.0)
        ),
        "sleep": (
            0.40 * (1.0 - energy)
            + 0.25 * acousticness
            + 0.20 * instrumentalness
            + 0.15 * _clip((90.0 - tempo) / 50.0)
        ),
    }

    total = sum(scores.values()) or 1.0
    normalized = {k: round(v / total, 4) for k, v in scores.items()}
    return dict(sorted(normalized.items(), key=lambda item: item[1], reverse=True))


def classify_emotion(features: dict) -> tuple[str, dict[str, float]]:
    scores = score_emotions(features)
    primary = next(iter(scores.keys()))
    top_scores = {k: v for k, v in list(scores.items())[:3]}
    return primary, top_scores


def extract_cover_image(file_path: str, output_dir: str = "/data/images") -> Optional[str]:
    try:
        audio = ID3(file_path)
        cover_tags = [tag for tag in audio.values() if isinstance(tag, APIC)]
        if not cover_tags:
            return None

        apic = cover_tags[0]
        out_dir = Path(output_dir)
        out_dir.mkdir(parents=True, exist_ok=True)

        ext = ".jpg"
        mime = (apic.mime or "").lower()
        if "png" in mime:
            ext = ".png"

        digest = hashlib.md5(file_path.encode("utf-8")).hexdigest()
        out_file = out_dir / f"{digest}{ext}"

        if not out_file.exists():
            out_file.write_bytes(apic.data)

        return f"/images/{out_file.name}"
    except (ID3NoHeaderError, Exception):
        return None


def find_sidecar_cover(file_path: str, image_dir: str = "/data/images") -> Optional[str]:
    stem = Path(file_path).stem
    for ext in [".jpg", ".jpeg", ".png", ".webp"]:
        candidate = Path(image_dir) / f"{stem}{ext}"
        if candidate.exists():
            return f"/images/{candidate.name}"
    return None


def enrich_track_payload(file_path: str, payload: Optional[dict] = None, force_reclassify: bool = True) -> dict:
    data = dict(payload or {})
    data["file_path"] = file_path

    if force_reclassify:
        features = extract_audio_features(file_path)
        primary_emotion, emotion_scores = classify_emotion(features)
        data["emotion"] = primary_emotion
        data["emotion_scores"] = emotion_scores
    else:
        data["emotion"] = normalize_emotion(data.get("emotion"))
        data["emotion_scores"] = data.get("emotion_scores") or {}

    data["cover_image"] = (
        data.get("cover_image")
        or extract_cover_image(file_path)
        or find_sidecar_cover(file_path)
        or DEFAULT_COVER_IMAGE
    )

    data["emotion_label_vi"] = EMOTION_LABELS_VI.get(data["emotion"], data["emotion"])
    return data
    