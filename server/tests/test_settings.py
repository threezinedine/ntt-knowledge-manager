import os

from fastapi.testclient import TestClient


def auth_header() -> dict[str, str]:
    return {"Authorization": f"Bearer {os.environ['FIX_TOKEN']}"}


def test_get_settings_returns_defaults(client: TestClient) -> None:
    response = client.get("/api/settings", headers=auth_header())

    assert response.status_code == 200
    data = response.json()
    assert data["theme"] == "light"
    assert data["nickname"] == ""


def test_update_theme_to_dark(client: TestClient) -> None:
    response = client.patch(
        "/api/settings",
        json={"theme": "dark"},
        headers=auth_header(),
    )

    assert response.status_code == 200
    assert response.json()["theme"] == "dark"


def test_update_theme_to_light(client: TestClient) -> None:
    client.patch(
        "/api/settings",
        json={"theme": "dark"},
        headers=auth_header(),
    )

    response = client.patch(
        "/api/settings",
        json={"theme": "light"},
        headers=auth_header(),
    )

    assert response.status_code == 200
    assert response.json()["theme"] == "light"


def test_get_settings_reflects_update(client: TestClient) -> None:
    client.patch(
        "/api/settings",
        json={"theme": "dark"},
        headers=auth_header(),
    )

    response = client.get("/api/settings", headers=auth_header())

    assert response.status_code == 200
    assert response.json()["theme"] == "dark"


def test_update_with_invalid_theme_returns_422(client: TestClient) -> None:
    response = client.patch(
        "/api/settings",
        json={"theme": "blue"},
        headers=auth_header(),
    )

    assert response.status_code == 422


def test_settings_requires_auth(client: TestClient) -> None:
    assert client.get("/api/settings").status_code == 401
    assert client.patch("/api/settings", json={"theme": "dark"}).status_code == 401


def test_patch_with_empty_body_returns_current_settings(client: TestClient) -> None:
    response = client.patch(
        "/api/settings",
        json={},
        headers=auth_header(),
    )

    assert response.status_code == 200
    assert response.json()["theme"] == "light"


def test_update_nickname(client: TestClient) -> None:
    response = client.patch(
        "/api/settings",
        json={"nickname": "Alice"},
        headers=auth_header(),
    )

    assert response.status_code == 200
    assert response.json()["nickname"] == "Alice"


def test_get_settings_reflects_nickname_update(client: TestClient) -> None:
    client.patch(
        "/api/settings",
        json={"nickname": "Bob"},
        headers=auth_header(),
    )

    response = client.get("/api/settings", headers=auth_header())

    assert response.status_code == 200
    assert response.json()["nickname"] == "Bob"
