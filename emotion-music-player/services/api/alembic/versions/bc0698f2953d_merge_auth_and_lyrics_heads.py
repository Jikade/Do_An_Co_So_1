"""merge auth and lyrics heads"""

revision = 'bc0698f2953d'
down_revision = ('0003_auth_google_users', '0003_add_track_lyrics')
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass