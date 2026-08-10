from collections.abc import Generator
import os
from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

import server.config  # pyright: ignore[reportUnusedImport]  # side-effect: loads env vars before DATABASE_URL

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./knowledge_manager.db")


class Base(DeclarativeBase):
    pass


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _alembic_config() -> Config:
    root = Path(__file__).resolve().parent.parent
    cfg = Config(str(root / "alembic.ini"))
    # resolve the script location absolutely so it works regardless of cwd
    cfg.set_main_option("script_location", str(root / "server" / "migrations"))
    return cfg


def _stamp_pre_alembic_database() -> None:
    """Bring a pre-existing (unversioned) database under Alembic's control.

    Databases created by ``create_all`` before Alembic was introduced have no
    ``alembic_version`` table. Stamp them at the revision matching their
    on-disk schema so the subsequent ``upgrade`` only applies the migrations
    that are actually missing.
    """
    inspector = inspect(engine)
    table_names = set(inspector.get_table_names())
    if "alembic_version" in table_names or not table_names:
        return

    column_names = {column["name"] for column in inspector.get_columns("nodes")}
    target = "0002" if "parent_node_id" in column_names else "0001"
    command.stamp(_alembic_config(), target)


def initialize_database() -> None:
    from server.features.login.token_model import seed_login_tokens

    _stamp_pre_alembic_database()
    command.upgrade(_alembic_config(), "head")
    with SessionLocal() as db:
        seed_login_tokens(db)
