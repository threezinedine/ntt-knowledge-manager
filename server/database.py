from collections.abc import Generator
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

import server.config

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


def initialize_database() -> None:
    from server.features.login.token_model import seed_login_tokens

    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_login_tokens(db)
