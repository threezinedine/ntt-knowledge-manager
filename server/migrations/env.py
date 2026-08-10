"""Alembic migration environment.

Uses the same DATABASE_URL that the app resolves at startup (via
server.config), and autogenerates against the models registered on
server.database.Base.metadata.
"""

import os
import sys
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from sqlalchemy import create_engine, pool

# make `server` importable regardless of cwd (local CLI / container / prod)
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

import server.config  # noqa: F401  # side-effect: loads env vars before DATABASE_URL
from server.database import Base
import server.features.login.token_model  # noqa: F401  # register tables
import server.features.node.model  # noqa: F401  # register tables

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def get_url() -> str:
    return os.getenv("DATABASE_URL", "sqlite:///./knowledge_manager.db")


def run_migrations_offline() -> None:
    context.configure(
        url=config.get_main_option("sqlalchemy.url") or get_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        render_as_batch=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    url = config.get_main_option("sqlalchemy.url") or get_url()
    connectable = create_engine(url, poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_as_batch=True,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
