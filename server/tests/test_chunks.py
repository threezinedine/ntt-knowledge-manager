import os

from fastapi.testclient import TestClient


def auth_header() -> dict[str, str]:
    return {"Authorization": f"Bearer {os.environ['FIX_TOKEN']}"}


def add_chunk(client: TestClient, content: str = "make a decision") -> dict:
    resp = client.post("/api/chunks", json={"content": content}, headers=auth_header())
    assert resp.status_code == 201
    return resp.json()


def test_add_chunk(client: TestClient) -> None:
    data = add_chunk(client)
    assert data["content"] == "make a decision"
    assert data["vietnamese"] == ""
    assert data["visit_times"] == 0
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_add_duplicate_increments_visit_times(client: TestClient) -> None:
    add_chunk(client, "on the other hand")
    data = add_chunk(client, "on the other hand")
    assert data["visit_times"] == 1


def test_add_chunk_strips_whitespace(client: TestClient) -> None:
    resp = client.post(
        "/api/chunks", json={"content": "  take it easy  "}, headers=auth_header()
    )
    assert resp.status_code == 201
    assert resp.json()["content"] == "take it easy"


def test_add_chunk_empty_content_rejected(client: TestClient) -> None:
    resp = client.post("/api/chunks", json={"content": "   "}, headers=auth_header())
    assert resp.status_code == 422


def test_get_chunk_increments_visit_times(client: TestClient) -> None:
    chunk = add_chunk(client)
    resp = client.get(f"/api/chunks/{chunk['id']}", headers=auth_header())
    assert resp.status_code == 200
    assert resp.json()["visit_times"] == 1


def test_get_chunk_not_found(client: TestClient) -> None:
    resp = client.get("/api/chunks/9999", headers=auth_header())
    assert resp.status_code == 404


def test_list_chunks(client: TestClient) -> None:
    add_chunk(client, "make a decision")
    add_chunk(client, "on the other hand")
    resp = client.get("/api/chunks", headers=auth_header())
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 2
    assert len(data["items"]) == 2


def test_list_chunks_search(client: TestClient) -> None:
    add_chunk(client, "make a decision")
    add_chunk(client, "on the other hand")
    resp = client.get("/api/chunks?q=decision", headers=auth_header())
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["items"][0]["content"] == "make a decision"


def test_list_chunks_sort_most_visited(client: TestClient) -> None:
    add_chunk(client, "make a decision")
    chunk2 = add_chunk(client, "on the other hand")
    # visit chunk2 twice more
    client.get(f"/api/chunks/{chunk2['id']}", headers=auth_header())
    client.get(f"/api/chunks/{chunk2['id']}", headers=auth_header())

    resp = client.get("/api/chunks?sort=most_visited", headers=auth_header())
    assert resp.status_code == 200
    assert resp.json()["items"][0]["content"] == "on the other hand"


def test_list_chunks_pagination(client: TestClient) -> None:
    for i in range(5):
        add_chunk(client, f"chunk number {i}")
    resp = client.get("/api/chunks?limit=3&offset=0", headers=auth_header())
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 5
    assert len(data["items"]) == 3


def test_update_chunk_vietnamese(client: TestClient) -> None:
    chunk = add_chunk(client)
    resp = client.patch(
        f"/api/chunks/{chunk['id']}",
        json={"vietnamese": "đưa ra quyết định"},
        headers=auth_header(),
    )
    assert resp.status_code == 200
    assert resp.json()["vietnamese"] == "đưa ra quyết định"


def test_update_chunk_content(client: TestClient) -> None:
    chunk = add_chunk(client, "old content")
    resp = client.patch(
        f"/api/chunks/{chunk['id']}",
        json={"content": "new content"},
        headers=auth_header(),
    )
    assert resp.status_code == 200
    assert resp.json()["content"] == "new content"


def test_update_chunk_not_found(client: TestClient) -> None:
    resp = client.patch(
        "/api/chunks/9999", json={"vietnamese": "test"}, headers=auth_header()
    )
    assert resp.status_code == 404


def test_delete_chunk(client: TestClient) -> None:
    chunk = add_chunk(client)
    resp = client.delete(f"/api/chunks/{chunk['id']}", headers=auth_header())
    assert resp.status_code == 204

    resp = client.get(f"/api/chunks/{chunk['id']}", headers=auth_header())
    assert resp.status_code == 404


def test_delete_chunk_not_found(client: TestClient) -> None:
    resp = client.delete("/api/chunks/9999", headers=auth_header())
    assert resp.status_code == 404


def test_requires_auth(client: TestClient) -> None:
    assert client.get("/api/chunks").status_code == 401
    assert client.post("/api/chunks", json={"content": "x"}).status_code == 401
    assert client.get("/api/chunks/1").status_code == 401
    assert client.patch("/api/chunks/1", json={}).status_code == 401
    assert client.delete("/api/chunks/1").status_code == 401
