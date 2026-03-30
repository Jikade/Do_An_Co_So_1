import os
from pathlib import Path

import psycopg2

DB_HOST = "localhost"
DB_NAME = "emotion_music"
DB_USER = "postgres"
DB_PASSWORD = "postgres"

BASE_DIR = Path(__file__).resolve().parents[1]
MP3_DIR = BASE_DIR / "data" / "mp3"


def format_title(filename: str) -> str:
    name = os.path.splitext(filename)[0]
    return name.replace("_", " ").replace("-", " ").title()


def main():
    if not MP3_DIR.exists():
        print(f"Khong tim thay folder mp3: {MP3_DIR}")
        return

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

        title = format_title(filename)
        artist = "Unknown Artist"
        audio_url = f"http://localhost:8000/media/{filename}"
        duration = 180000

        cur.execute(
            "SELECT id FROM tracks WHERE audio_url = %s",
            (audio_url,),
        )
        exists = cur.fetchone()

        if exists:
            skipped += 1
            continue

        cur.execute(
            """
            INSERT INTO tracks (title, artist, audio_url, duration)
            VALUES (%s, %s, %s, %s)
            """,
            (title, artist, audio_url, duration),
        )
        inserted += 1

    conn.commit()
    cur.close()
    conn.close()

    print(f"Inserted: {inserted}")
    print(f"Skipped: {skipped}")


if __name__ == "__main__":
    main()