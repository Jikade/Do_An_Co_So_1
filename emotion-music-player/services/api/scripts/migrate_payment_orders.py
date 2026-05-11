import os
import sys

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from sqlalchemy import text

from app.db.session import engine, SessionLocal

# Quan trọng: import model PaymentOrder để SQLAlchemy đăng ký relationship trong User
from app.models.payment_order import PaymentOrder  # noqa: F401
from app.models.user import User

from app.core.security import hash_password


ADMIN_EMAIL = "admin@gmail.com"
ADMIN_PASSWORD = "admin123"


def run_migration():
    with engine.begin() as connection:
        connection.execute(
            text(
                """
                ALTER TABLE users
                ADD COLUMN IF NOT EXISTS role VARCHAR(32) NOT NULL DEFAULT 'user';
                """
            )
        )

        connection.execute(
            text(
                """
                ALTER TABLE users
                ADD COLUMN IF NOT EXISTS is_vip BOOLEAN NOT NULL DEFAULT FALSE;
                """
            )
        )

        connection.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS payment_orders (
                    id SERIAL PRIMARY KEY,
                    order_code VARCHAR(255) NOT NULL,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    user_email VARCHAR(255) NOT NULL,
                    package_name VARCHAR(64) NOT NULL DEFAULT 'VIP PRO',
                    amount INTEGER NOT NULL DEFAULT 1000,
                    qr_url TEXT NOT NULL,
                    status VARCHAR(32) NOT NULL DEFAULT 'pending',
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    approved_at TIMESTAMPTZ NULL
                );
                """
            )
        )

        connection.execute(
            text(
                """
                CREATE INDEX IF NOT EXISTS ix_payment_orders_order_code
                ON payment_orders(order_code);
                """
            )
        )

        connection.execute(
            text(
                """
                CREATE INDEX IF NOT EXISTS ix_payment_orders_user_email
                ON payment_orders(user_email);
                """
            )
        )

        connection.execute(
            text(
                """
                CREATE INDEX IF NOT EXISTS ix_payment_orders_status
                ON payment_orders(status);
                """
            )
        )


def seed_admin():
    db = SessionLocal()

    try:
        admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()

        if admin:
            admin.password_hash = hash_password(ADMIN_PASSWORD)
            admin.name = "Admin"
            admin.role = "admin"
            admin.is_vip = True
        else:
            admin = User(
                email=ADMIN_EMAIL,
                password_hash=hash_password(ADMIN_PASSWORD),
                name="Admin",
                auth_provider="local",
                role="admin",
                is_vip=True,
            )
            db.add(admin)

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    run_migration()
    seed_admin()
    print("Migration completed successfully.")