from collections.abc import Generator
import os
from pathlib import Path

import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

os.environ["APP_ENV"] = "test"
load_dotenv(Path(__file__).resolve().parents[2] / ".test.env", override=True)

from server.database import Base, get_db
from server.features.login.token_model import seed_login_tokens
from server.main import app


@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    session = sessionmaker(bind=engine, autoflush=False, autocommit=False)()
    seed_login_tokens(session)

    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(engine)
        engine.dispose()


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    app.state.db_session_factory = lambda: db_session
    app.state.skip_database_initialization = True
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    del app.state.db_session_factory
    del app.state.skip_database_initialization
