"""add emotion and cover_image to tracks"""

from alembic import op
import sqlalchemy as sa


revision = "0002_track_emotion_cover"
down_revision = "0001_init"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "tracks",
        sa.Column("emotion", sa.String(length=20), nullable=False, server_default="calm"),
    )
    op.add_column(
        "tracks",
        sa.Column("cover_image", sa.Text(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("tracks", "cover_image")
    op.drop_column("tracks", "emotion")
