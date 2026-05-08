from __future__ import annotations

import math
import re
from collections import Counter
from dataclasses import dataclass
from functools import lru_cache

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from app.schemas.lyrics_mood import (
    LanguageCode,
    LyricsMoodItem,
    LyricsMoodResponse,
    MoodSignal,
)


SECTION_RE = re.compile(r"\[[^\]]+\]")
WORD_RE = re.compile(r"[a-zA-Z']+")


@dataclass(frozen=True)
class MoodProfile:
    keywords: frozenset[str]
    phrases: frozenset[str] = frozenset()


MOOD_PROFILES: dict[str, MoodProfile] = {
    "sad": MoodProfile(
        keywords=frozenset(
            {
                "sad",
                "cry",
                "cries",
                "crying",
                "tears",
                "pain",
                "hurt",
                "broken",
                "goodbye",
                "miss",
                "lost",
                "dark",
                "empty",
                "rain",
                "sorrow",
                "blue",
                "depressed",
                "down",
                "falling",
            }
        ),
        phrases=frozenset(
            {
                "broken heart",
                "miss you",
                "without you",
                "say goodbye",
                "tears fall",
            }
        ),
    ),
    "romantic": MoodProfile(
        keywords=frozenset(
            {
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
                "romance",
                "beautiful",
                "angel",
                "sweet",
            }
        ),
        phrases=frozenset(
            {
                "i love you",
                "love you",
                "hold me",
                "in your arms",
                "my heart",
                "be with you",
            }
        ),
    ),
    "happy": MoodProfile(
        keywords=frozenset(
            {
                "happy",
                "joy",
                "smile",
                "laugh",
                "bright",
                "sunshine",
                "alive",
                "celebrate",
                "good",
                "free",
                "fun",
                "golden",
                "beautiful",
                "wonderful",
                "dance",
            }
        ),
        phrases=frozenset(
            {
                "feel good",
                "good time",
                "best day",
                "so happy",
                "we are free",
            }
        ),
    ),
    "energetic": MoodProfile(
        keywords=frozenset(
            {
                "fire",
                "wild",
                "dance",
                "party",
                "beat",
                "run",
                "jump",
                "loud",
                "power",
                "fast",
                "rave",
                "bass",
                "tonight",
                "move",
                "shake",
                "electric",
            }
        ),
        phrases=frozenset(
            {
                "all night",
                "turn it up",
                "on the floor",
                "feel the beat",
                "let's go",
            }
        ),
    ),
    "chill": MoodProfile(
        keywords=frozenset(
            {
                "calm",
                "slow",
                "quiet",
                "ocean",
                "breeze",
                "softly",
                "easy",
                "mellow",
                "peace",
                "dream",
                "sleep",
                "moon",
                "night",
                "float",
                "gentle",
            }
        ),
        phrases=frozenset(
            {
                "take it slow",
                "easy now",
                "softly now",
                "quiet night",
                "by the ocean",
            }
        ),
    ),
    "angry": MoodProfile(
        keywords=frozenset(
            {
                "hate",
                "rage",
                "fight",
                "burn",
                "blame",
                "revenge",
                "scream",
                "mad",
                "enemy",
                "war",
                "blood",
                "violence",
                "liar",
                "betray",
                "break",
            }
        ),
        phrases=frozenset(
            {
                "i hate",
                "fight back",
                "burn it down",
                "scream out",
                "no mercy",
            }
        ),
    ),
    "hopeful": MoodProfile(
        keywords=frozenset(
            {
                "hope",
                "rise",
                "stronger",
                "tomorrow",
                "believe",
                "light",
                "survive",
                "fly",
                "dreams",
                "better",
                "healing",
                "faith",
                "future",
                "start",
                "again",
            }
        ),
        phrases=frozenset(
            {
                "new day",
                "rise again",
                "better days",
                "keep going",
                "hold on",
                "see the light",
            }
        ),
    ),
    "lonely": MoodProfile(
        keywords=frozenset(
            {
                "lonely",
                "alone",
                "nobody",
                "silence",
                "empty",
                "distant",
                "away",
                "isolate",
                "waiting",
                "cold",
                "missing",
            }
        ),
        phrases=frozenset(
            {
                "all alone",
                "no one",
                "by myself",
                "far away",
                "empty room",
            }
        ),
    ),
}


@lru_cache(maxsize=1)
def _get_vader_analyzer() -> SentimentIntensityAnalyzer:
    return SentimentIntensityAnalyzer()


def _clean_lyrics(lyrics: str) -> str:
    text = SECTION_RE.sub(" ", lyrics.lower())
    text = text.replace("’", "'")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def _tokenize(text: str) -> list[str]:
    tokens: list[str] = []

    for raw_token in WORD_RE.findall(text):
        token = raw_token.strip("'").lower()
        if len(token) > 1:
            tokens.append(token)

    return tokens


def _score_profile(
    profile: MoodProfile,
    token_counts: Counter[str],
    text: str,
) -> tuple[float, list[str]]:
    score = 0.0
    matched: list[str] = []

    for keyword in profile.keywords:
        count = token_counts.get(keyword, 0)
        if count > 0:
            score += min(count, 4) * 1.0
            matched.append(keyword)

    for phrase in profile.phrases:
        if phrase in text:
            score += 2.5
            matched.append(phrase)

    return score, sorted(set(matched))


def _add_score(
    scores: dict[str, float],
    matched_keywords: dict[str, list[str]],
    mood: str,
    amount: float,
    signal: str | None = None,
) -> None:
    scores[mood] = scores.get(mood, 0.0) + amount

    if signal:
        matched_keywords.setdefault(mood, []).append(signal)


def _apply_sentiment_adjustments(
    scores: dict[str, float],
    matched_keywords: dict[str, list[str]],
    token_counts: Counter[str],
    text: str,
    sentiment: dict[str, float],
) -> None:
    compound = sentiment["compound"]
    positive = sentiment["pos"]
    negative = sentiment["neg"]

    if compound <= -0.2:
        _add_score(scores, matched_keywords, "sad", abs(compound) * 5.5, "negative sentiment")
        _add_score(scores, matched_keywords, "lonely", abs(compound) * 2.2, "negative sentiment")

    if compound >= 0.2:
        _add_score(scores, matched_keywords, "happy", compound * 4.5, "positive sentiment")
        _add_score(scores, matched_keywords, "hopeful", compound * 2.2, "positive sentiment")

    if positive >= 0.3:
        _add_score(scores, matched_keywords, "happy", positive * 3.0, "high positive tone")

    if negative >= 0.28:
        _add_score(scores, matched_keywords, "sad", negative * 2.0, "high negative tone")

    romantic_words = {"love", "heart", "kiss", "baby", "darling", "forever"}
    if any(token_counts.get(word, 0) > 0 for word in romantic_words):
        _add_score(scores, matched_keywords, "romantic", 2.0, "romantic vocabulary")

    anger_words = {"hate", "rage", "fight", "scream", "revenge", "enemy", "betray"}
    if any(token_counts.get(word, 0) > 0 for word in anger_words):
        _add_score(scores, matched_keywords, "angry", 2.8, "anger vocabulary")

    energy_words = {"party", "dance", "beat", "fire", "wild", "jump", "bass", "move"}
    if any(token_counts.get(word, 0) > 0 for word in energy_words):
        _add_score(scores, matched_keywords, "energetic", 2.4, "energy vocabulary")

    if text.count("!") >= 3:
        _add_score(scores, matched_keywords, "energetic", 1.5, "exclamation intensity")

    loneliness_words = {"alone", "lonely", "nobody", "silence", "empty"}
    if any(token_counts.get(word, 0) > 0 for word in loneliness_words):
        _add_score(scores, matched_keywords, "lonely", 2.0, "loneliness vocabulary")


def _confidence_from_score(score: float, max_score: float) -> int:
    if score <= 0:
        return 0

    absolute_strength = 1 - math.exp(-score / 5.0)
    relative_strength = score / max_score if max_score > 0 else 0
    confidence = 100 * absolute_strength * (0.65 + 0.35 * relative_strength)

    return max(1, min(98, round(confidence)))


def analyze_lyrics_mood(
    lyrics: str,
    language: LanguageCode = "en",
    top_k: int = 3,
) -> LyricsMoodResponse:
    text = _clean_lyrics(lyrics)
    tokens = _tokenize(text)

    if len(tokens) < 3:
        raise ValueError("Lyrics quá ngắn để phân tích mood")

    effective_language: LanguageCode = "en" if language == "auto" else language

    # Hiện tại ưu tiên tiếng Anh. Với tiếng Việt có thể mở rộng bằng cách
    # thêm profile keyword tiếng Việt hoặc thay VADER bằng model HuggingFace/PhoBERT.
    sentiment = _get_vader_analyzer().polarity_scores(text[:7000])

    raw_scores: dict[str, float] = {}
    matched_keywords: dict[str, list[str]] = {}

    token_counts = Counter(tokens)

    for mood, profile in MOOD_PROFILES.items():
        score, matches = _score_profile(profile, token_counts, text)
        raw_scores[mood] = score
        matched_keywords[mood] = matches

    _apply_sentiment_adjustments(
        scores=raw_scores,
        matched_keywords=matched_keywords,
        token_counts=token_counts,
        text=text,
        sentiment=sentiment,
    )

    max_score = max(raw_scores.values(), default=0.0)

    if max_score <= 0.2:
        neutral_confidence = max(35, round((1 - abs(sentiment["compound"])) * 70))
        return LyricsMoodResponse(
            language=effective_language,
            moods=[
                LyricsMoodItem(
                    mood="neutral",
                    confidence=neutral_confidence,
                    signals=MoodSignal(
                        sentiment=round(sentiment["compound"], 3),
                        keyword_hits=0,
                        matched_keywords=[],
                    ),
                )
            ],
        )

    results: list[LyricsMoodItem] = []

    for mood, score in raw_scores.items():
        confidence = _confidence_from_score(score, max_score)

        if confidence < 30:
            continue

        unique_matches = sorted(set(matched_keywords.get(mood, [])))

        results.append(
            LyricsMoodItem(
                mood=mood,
                confidence=confidence,
                signals=MoodSignal(
                    sentiment=round(sentiment["compound"], 3),
                    keyword_hits=len(unique_matches),
                    matched_keywords=unique_matches[:12],
                ),
            )
        )

    results.sort(key=lambda item: item.confidence, reverse=True)

    return LyricsMoodResponse(
        language=effective_language,
        moods=results[:top_k],
    )