import os
import sys
from pathlib import Path
from urllib.parse import urlparse, unquote

import psycopg2
from psycopg2.extras import RealDictCursor, Json

BASE_DIR = Path(__file__).resolve().parents[1]
API_DIR = BASE_DIR / "services" / "api"

if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

from app.services.music_enrichment import enrich_track_payload


def build_file_path(audio_url: str) -> str:
    path = urlparse(audio_url).path
    filename = Path(unquote(path)).name
    return f"/data/mp3/{filename}"


def main():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("Thiếu DATABASE_URL")

    conn = psycopg2.connect(database_url)
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT id, audio_url, emotion, cover_image
                FROM tracks
            """)
            rows = cur.fetchall()

        updated = 0

        for row in rows:
            try:
                file_path = build_file_path(row["audio_url"])

                payload = enrich_track_payload(
                    file_path,
                    {
                        "emotion": row.get("emotion"),
                        "cover_image": row.get("cover_image"),
                    },
                    force_reclassify=True,
                )

                with conn.cursor() as cur:
                    cur.execute(
                        """
                        UPDATE tracks
                        SET emotion = %s,
                            emotion_scores = %s,
                            cover_image = %s
                        WHERE id = %s
                        """,
                        (
                            payload["emotion"],
                            Json(payload["emotion_scores"]),
                            payload["cover_image"],
                            row["id"],
                        ),
                    )
                updated += 1
            except Exception as exc:
                print(f"Skip track id={row['id']}: {exc}")

        conn.commit()
        print(f"Updated: {updated}")
    finally:
        conn.close()


if __name__ == "__main__":
    main()