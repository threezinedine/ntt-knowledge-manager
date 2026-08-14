import base64
import io
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
    assert data["avatar"] == ""


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


def _png_1x1() -> bytes:
    """Minimal valid 1x1 PNG."""
    return base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAB"
        "Nl7BcQAAAABJRU5ErkJggg=="
    )


def test_upload_avatar(client: TestClient) -> None:
    data = _png_1x1()
    response = client.post(
        "/api/settings/avatar",
        files={"file": ("avatar.png", io.BytesIO(data), "image/png")},
        headers=auth_header(),
    )

    assert response.status_code == 200
    body = response.json()
    assert body["avatar"].startswith("data:image/png;base64,")


def test_get_avatar_returns_image(client: TestClient) -> None:
    data = _png_1x1()
    client.post(
        "/api/settings/avatar",
        files={"file": ("avatar.png", io.BytesIO(data), "image/png")},
        headers=auth_header(),
    )

    response = client.get("/api/settings/avatar", headers=auth_header())

    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert response.content == data


def test_get_avatar_returns_404_when_not_set(client: TestClient) -> None:
    response = client.get("/api/settings/avatar", headers=auth_header())

    assert response.status_code == 404


def test_delete_avatar(client: TestClient) -> None:
    data = _png_1x1()
    client.post(
        "/api/settings/avatar",
        files={"file": ("avatar.png", io.BytesIO(data), "image/png")},
        headers=auth_header(),
    )

    response = client.delete("/api/settings/avatar", headers=auth_header())

    assert response.status_code == 200
    assert response.json()["avatar"] == ""


def test_upload_avatar_rejects_invalid_type(client: TestClient) -> None:
    response = client.post(
        "/api/settings/avatar",
        files={"file": ("file.txt", io.BytesIO(b"hello"), "text/plain")},
        headers=auth_header(),
    )

    assert response.status_code == 400


def test_settings_avatar_in_get(client: TestClient) -> None:
    data = _png_1x1()
    client.post(
        "/api/settings/avatar",
        files={"file": ("avatar.png", io.BytesIO(data), "image/png")},
        headers=auth_header(),
    )

    response = client.get("/api/settings", headers=auth_header())

    assert response.status_code == 200
    assert response.json()["avatar"].startswith("data:image/png;base64,")
