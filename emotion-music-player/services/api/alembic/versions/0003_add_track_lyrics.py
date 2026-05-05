"""add lyrics to tracks"""

from alembic import op
import sqlalchemy as sa


revision = "0003_add_track_lyrics"
down_revision = "0002_track_emotion_cover"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("tracks", sa.Column("lyrics", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("tracks", "lyrics")