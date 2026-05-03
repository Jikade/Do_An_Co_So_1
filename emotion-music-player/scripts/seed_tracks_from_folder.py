import os
import sys
import json
from pathlib import Path

import psycopg2

BASE_DIR = Path(__file__).resolve().parents[1]
API_DIR = BASE_DIR / "services" / "api"

if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

from app.services.music_enrichment import enrich_track_payload

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "emotion_music")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")

MP3_DIR = Path("/data/mp3") if Path("/data/mp3").exists() else BASE_DIR / "data" / "mp3"


def format_title(filename: str) -> str:
    name = os.path.splitext(filename)[0]
    return name.replace("_", " ").replace("-", " ").title()


def main():
    conn = psycopg2.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
    )
    cur = conn.cursor()

    inserted = 0
    skipped = 0

    for filename in sorted(os.listdir(MP3_DIR)):
        if not filename.lower().endswith(".mp3"):
            continue

        file_path = str(MP3_DIR / filename)
        title = format_title(filename)
        artist = "Unknown Artist"
        audio_url = f"http://localhost:8000/media/{filename}"
        duration = 180000

        payload = enrich_track_payload(file_path, {
            "title": title,
            "artist": artist,
            "audio_url": audio_url,
            "duration": duration,
        }, force_reclassify=True)

        cur.execute("SELECT id FROM tracks WHERE audio_url = %s", (audio_url,))
        if cur.fetchone():
            skipped += 1
            continue

        cur.execute(
            """
            INSERT INTO tracks (
                title, artist, audio_url, duration,
                file_path, emotion, emotion_scores, cover_image
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s::jsonb, %s)
            """,
            (
                payload["title"],
                payload["artist"],
                payload["audio_url"],
                payload["duration"],
                payload["file_path"],
                payload["emotion"],
                json.dumps(payload["emotion_scores"], ensure_ascii=False),
                payload["cover_image"],
            ),
        )
        inserted += 1

    conn.commit()
    cur.close()
    conn.close()

    print(f"Inserted: {inserted}")
    print(f"Skipped: {skipped}")


if __name__ == "__main__":
    main()