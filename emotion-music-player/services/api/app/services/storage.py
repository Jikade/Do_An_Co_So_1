import base64
import os
import uuid
from pathlib import Path


TMP_DIR = Path("/tmp/emotion-music-player")
TMP_DIR.mkdir(parents=True, exist_ok=True)


def save_base64_file(base64_content: str, suffix: str) -> str:
    file_name = f"{uuid.uuid4().hex}{suffix}"
    file_path = TMP_DIR / file_name

    with open(file_path, "wb") as f:
        f.write(base64.b64decode(base64_content))

    return str(file_path)


def remove_file(file_path: str) -> None:
    if file_path and os.path.exists(file_path):
        os.remove(file_path)