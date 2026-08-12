import os

from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from server.features.login.token_model import LoginToken


def test_login_tokens_are_seeded(db_session: Session) -> None:
    tokens = db_session.scalars(select(LoginToken.token)).all()

    assert tokens == [os.environ["FIX_TOKEN"]]


def test_known_login_token_is_valid(client: TestClient) -> None:
    response = client.get(f"/api/login-tokens/{os.environ['FIX_TOKEN']}")
    print(os.environ["FIX_TOKEN"])

    assert response.status_code == 200
    assert response.json() == {"valid": True}


def test_unknown_login_token_is_invalid(client: TestClient) -> None:
    response = client.get("/api/login-tokens/unknown-token")

    assert response.status_code == 200
    assert response.json() == {"valid": False}
