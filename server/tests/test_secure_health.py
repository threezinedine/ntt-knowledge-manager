import os

from fastapi.testclient import TestClient


def test_secure_health_requires_a_login_token(client: TestClient) -> None:
    response = client.get("/secure-health")

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid login token"}


def test_secure_health_rejects_an_unknown_login_token(client: TestClient) -> None:
    response = client.get(
        "/secure-health", headers={"Authorization": "Bearer unknown-token"}
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid login token"}


def test_secure_health_accepts_a_known_login_token(client: TestClient) -> None:
    response = client.get(
        "/secure-health", headers={"Authorization": f"Bearer {os.environ['FIX_TOKEN']}"}
    )

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
