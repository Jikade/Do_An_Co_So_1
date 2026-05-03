"""init"""

from alembic import op
import sqlalchemy as sa


revision = "0001_init"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_users_id", "users", ["id"])
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "tracks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("artist", sa.String(length=255), nullable=False),
        sa.Column("audio_url", sa.Text(), nullable=False),
        sa.Column("duration", sa.Float(), nullable=False, server_default="0"),
    )
    op.create_index("ix_tracks_id", "tracks", ["id"])

    op.create_table(
        "emotion_events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("label", sa.String(length=100), nullable=False),
        sa.Column("valence", sa.Float(), nullable=False),
        sa.Column("arousal", sa.Float(), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=False),
        sa.Column("source_text", sa.String(length=1000), nullable=True),
        sa.Column("per_modality", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_emotion_events_id", "emotion_events", ["id"])

    op.create_table(
        "interactions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("track_id", sa.Integer(), sa.ForeignKey("tracks.id"), nullable=False),
        sa.Column("action", sa.String(length=50), nullable=False),
        sa.Column("listen_ms", sa.Float(), nullable=False, server_default="0"),
        sa.Column("emotion_state_at_time", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_interactions_id", "interactions", ["id"])

    op.create_table(
        "playlists",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_playlists_id", "playlists", ["id"])
    op.create_index("ix_playlists_user_id", "playlists", ["user_id"])

    op.create_table(
        "playlist_tracks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("playlist_id", sa.Integer(), sa.ForeignKey("playlists.id"), nullable=False),
        sa.Column("track_id", sa.Integer(), sa.ForeignKey("tracks.id"), nullable=False),
        sa.UniqueConstraint("playlist_id", "track_id", name="uq_playlist_track"),
    )
    op.create_index("ix_playlist_tracks_id", "playlist_tracks", ["id"])
    op.create_index("ix_playlist_tracks_playlist_id", "playlist_tracks", ["playlist_id"])
    op.create_index("ix_playlist_tracks_track_id", "playlist_tracks", ["track_id"])


def downgrade() -> None:
    op.drop_index("ix_playlist_tracks_track_id", table_name="playlist_tracks")
    op.drop_index("ix_playlist_tracks_playlist_id", table_name="playlist_tracks")
    op.drop_index("ix_playlist_tracks_id", table_name="playlist_tracks")
    op.drop_table("playlist_tracks")

    op.drop_index("ix_playlists_user_id", table_name="playlists")
    op.drop_index("ix_playlists_id", table_name="playlists")
    op.drop_table("playlists")

    op.drop_index("ix_interactions_id", table_name="interactions")
    op.drop_table("interactions")

    op.drop_index("ix_emotion_events_id", table_name="emotion_events")
    op.drop_table("emotion_events")

    op.drop_index("ix_tracks_id", table_name="tracks")
    op.drop_table("tracks")

    op.drop_index("ix_users_email", table_name="users")
    op.drop_index("ix_users_id", table_name="users")
    op.drop_table("users")