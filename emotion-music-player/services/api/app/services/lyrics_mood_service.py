from __future__ import annotations

import math
import re
from collections import Counter
from functools import lru_cache

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from app.schemas.lyrics_mood import LyricsMoodResponse, LyricsMoodResult, LanguageCode


TIME_TAG_RE = re.compile(r"\d{1,2}:\d{2}(?:\.\d+)?")
BRACKET_RE = re.compile(r"\[[^\]]*\]")
WORD_RE = re.compile(r"[a-zA-Z']+")


MOOD_KEYWORDS: dict[str, set[str]] = {
    "relax": {
        "calm",
        "quiet",
        "peace",
        "breathe",
        "slow",
        "soft",
        "gentle",
        "dream",
        "moon",
        "ocean",
        "night",
        "sleep",
        "float",
        "easy",
    },
    "happy": {
        "happy",
        "smile",
        "joy",
        "laugh",
        "sunshine",
        "bright",
        "dance",
        "fun",
        "party",
        "celebrate",
        "alive",
        "good",
        "free",
        "beautiful",
    },
    "sad": {
        "sad",
        "cry",
        "crying",
        "tears",
        "hurt",
        "pain",
        "broken",
        "goodbye",
        "miss",
        "lost",
        "lonely",
        "alone",
        "empty",
        "rain",
        "blue",
        "dark",
    },
    "angry": {
        "angry",
        "hate",
        "rage",
        "fight",
        "scream",
        "burn",
        "revenge",
        "enemy",
        "war",
        "blame",
        "liar",
        "betray",
        "mad",
        "break",
    },
    "focus": {
        "focus",
        "work",
        "mind",
        "deep",
        "steady",
        "control",
        "strong",
        "rise",
        "drive",
        "goal",
        "keep",
        "move",
        "forward",
        "power",
    },
    "romantic": {
        "love",
        "lover",
        "heart",
        "kiss",
        "baby",
        "darling",
        "forever",
        "touch",
        "hold",
        "together",
        "mine",
        "yours",
        "sweet",
        "beautiful",
    },
}


MOOD_PHRASES: dict[str, set[str]] = {
    "relax": {
        "take it slow",
        "quiet night",
        "easy now",
    },
    "happy": {
        "feel good",
        "good time",
        "best day",
    },
    "sad": {
        "miss you",
        "without you",
        "broken heart",
        "say goodbye",
    },
    "angry": {
        "i hate",
        "fight back",
        "burn it down",
    },
    "focus": {
        "keep going",
        "move forward",
        "stay strong",
    },
    "romantic": {
        "i love you",
        "love you",
        "my heart",
        "hold me",
        "be with you",
    },
}


@lru_cache(maxsize=1)
def get_sentiment_analyzer() -> SentimentIntensityAnalyzer:
    return SentimentIntensityAnalyzer()


def clean_lyrics(lyrics: str) -> str:
    text = lyrics.lower()
    text = TIME_TAG_RE.sub(" ", text)
    text = BRACKET_RE.sub(" ", text)
    text = text.replace("♪", " ")
    text = text.replace("’", "'")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def tokenize(text: str) -> list[str]:
    return [
        word.strip("'").lower()
        for word in WORD_RE.findall(text)
        if len(word.strip("'")) > 1
    ]


def score_keywords(
    mood: str,
    text: str,
    token_counter: Counter[str],
) -> tuple[float, list[str]]:
    score = 0.0
    matched: list[str] = []

    for keyword in MOOD_KEYWORDS[mood]:
        count = token_counter.get(keyword, 0)
        if count:
            score += min(count, 4)
            matched.append(keyword)

    for phrase in MOOD_PHRASES.get(mood, set()):
        if phrase in text:
            score += 2.5
            matched.append(phrase)

    return score, sorted(set(matched))


def apply_sentiment_bonus(
    scores: dict[str, float],
    matched: dict[str, list[str]],
    sentiment: float,
) -> None:
    if sentiment <= -0.25:
        scores["sad"] += abs(sentiment) * 5
        matched["sad"].append("negative sentiment")

    if sentiment <= -0.45:
        scores["angry"] += abs(sentiment) * 2

    if sentiment >= 0.25:
        scores["happy"] += sentiment * 4
        scores["focus"] += sentiment * 1.2
        matched["happy"].append("positive sentiment")

    if sentiment >= 0.15:
        scores["romantic"] += sentiment * 1.5


def confidence_from_score(score: float, max_score: float) -> int:
    if score <= 0 or max_score <= 0:
        return 0

    absolute = 1 - math.exp(-score / 5)
    relative = score / max_score
    confidence = 100 * absolute * (0.65 + 0.35 * relative)

    return max(1, min(98, round(confidence)))


def analyze_lyrics_mood(
    lyrics: str,
    language: LanguageCode = "en",
    top_k: int = 3,
) -> LyricsMoodResponse:
    text = clean_lyrics(lyrics)
    tokens = tokenize(text)

    if len(tokens) < 3:
        raise ValueError("Lyrics quá ngắn để phân tích mood")

    sentiment_scores = get_sentiment_analyzer().polarity_scores(text[:7000])
    sentiment = round(float(sentiment_scores["compound"]), 3)

    token_counter = Counter(tokens)

    raw_scores: dict[str, float] = {}
    matched_keywords: dict[str, list[str]] = {}

    for mood in MOOD_KEYWORDS:
        score, matched = score_keywords(mood, text, token_counter)
        raw_scores[mood] = score
        matched_keywords[mood] = matched

    apply_sentiment_bonus(raw_scores, matched_keywords, sentiment)

    max_score = max(raw_scores.values(), default=0)

    if max_score <= 0:
        return LyricsMoodResponse(
            moods=[
                LyricsMoodResult(
                    mood="relax",
                    confidence=45,
                    matched_keywords=[],
                    sentiment=sentiment,
                )
            ],
            language=language,
        )

    results: list[LyricsMoodResult] = []

    for mood, score in raw_scores.items():
        confidence = confidence_from_score(score, max_score)

        if confidence >= 25:
            results.append(
                LyricsMoodResult(
                    mood=mood,
                    confidence=confidence,
                    matched_keywords=sorted(set(matched_keywords[mood]))[:10],
                    sentiment=sentiment,
                )
            )

    results.sort(key=lambda item: item.confidence, reverse=True)

    return LyricsMoodResponse(
        moods=results[:top_k],
        language=language,
    )