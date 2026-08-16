import os

from fastapi.testclient import TestClient


def auth_header() -> dict[str, str]:
    return {"Authorization": f"Bearer {os.environ['FIX_TOKEN']}"}


def create_word(client: TestClient, **overrides) -> dict:
    payload = {
        "word": "abandon",
        "word_type": "verb",
        "english_meaning": "to leave completely and finally",
        "vietnamese_meaning": "tu bo, bo roi",
        "examples": ["She abandoned her career.", "They abandoned the project."],
        "oald_link": "https://www.oxfordlearnersdictionaries.com/definition/english/abandon",
        **overrides,
    }
    return client.post("/api/vocabulary", json=payload, headers=auth_header()).json()


def test_create_vocabulary(client: TestClient) -> None:
    response = client.post(
        "/api/vocabulary",
        json={
            "word": "abandon",
            "word_type": "verb",
            "english_meaning": "to leave completely and finally",
            "vietnamese_meaning": "tu bo",
            "examples": ["She abandoned the plan."],
            "oald_link": "https://oald.example.com/abandon",
        },
        headers=auth_header(),
    )

    assert response.status_code == 201
    data = response.json()
    assert data["word"] == "abandon"
    assert data["word_type"] == "verb"
    assert data["english_meaning"] == "to leave completely and finally"
    assert data["vietnamese_meaning"] == "tu bo"
    assert data["examples"] == ["She abandoned the plan."]
    assert data["search_times"] == 0
    assert data["id"] is not None


def test_create_duplicate_word_returns_409(client: TestClient) -> None:
    create_word(client)
    response = client.post(
        "/api/vocabulary",
        json={"word": "abandon", "word_type": "verb"},
        headers=auth_header(),
    )

    assert response.status_code == 409


def test_list_vocabulary(client: TestClient) -> None:
    create_word(client, word="apple", word_type="noun")
    create_word(client, word="banana", word_type="noun")
    create_word(client, word="run", word_type="verb")

    response = client.get("/api/vocabulary", headers=auth_header())

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3
    assert len(data["items"]) == 3
    assert data["limit"] == 20
    assert data["offset"] == 0


def test_list_vocabulary_pagination(client: TestClient) -> None:
    for i in range(5):
        create_word(client, word=f"word{i}", word_type="noun")

    page1 = client.get(
        "/api/vocabulary",
        params={"limit": 2, "offset": 0, "sort": "alpha"},
        headers=auth_header(),
    ).json()

    assert page1["total"] == 5
    assert len(page1["items"]) == 2
    assert page1["limit"] == 2
    assert page1["offset"] == 0

    page2 = client.get(
        "/api/vocabulary",
        params={"limit": 2, "offset": 2, "sort": "alpha"},
        headers=auth_header(),
    ).json()

    assert page2["total"] == 5
    assert len(page2["items"]) == 2
    assert page2["offset"] == 2
    assert page1["items"][0]["word"] != page2["items"][0]["word"]

    page3 = client.get(
        "/api/vocabulary",
        params={"limit": 2, "offset": 4, "sort": "alpha"},
        headers=auth_header(),
    ).json()

    assert len(page3["items"]) == 1


def test_list_vocabulary_filter_by_type(client: TestClient) -> None:
    create_word(client, word="apple", word_type="noun")
    create_word(client, word="run", word_type="verb")

    response = client.get(
        "/api/vocabulary", params={"word_type": "noun"}, headers=auth_header()
    )

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["word"] == "apple"


def test_list_vocabulary_search(client: TestClient) -> None:
    create_word(client, word="apple", word_type="noun")
    create_word(client, word="application", word_type="noun")
    create_word(client, word="banana", word_type="noun")

    response = client.get(
        "/api/vocabulary", params={"q": "app"}, headers=auth_header()
    )

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2


def test_list_vocabulary_sort_alpha(client: TestClient) -> None:
    create_word(client, word="cherry", word_type="noun")
    create_word(client, word="apple", word_type="noun")
    create_word(client, word="banana", word_type="noun")

    response = client.get(
        "/api/vocabulary", params={"sort": "alpha"}, headers=auth_header()
    )

    data = response.json()
    assert [v["word"] for v in data["items"]] == ["apple", "banana", "cherry"]


def test_get_vocabulary_increments_search_times(client: TestClient) -> None:
    created = create_word(client)
    vocab_id = created["id"]

    response = client.get(f"/api/vocabulary/{vocab_id}", headers=auth_header())

    assert response.status_code == 200
    assert response.json()["search_times"] == 1

    response = client.get(f"/api/vocabulary/{vocab_id}", headers=auth_header())
    assert response.json()["search_times"] == 2


def test_get_vocabulary_not_found(client: TestClient) -> None:
    response = client.get("/api/vocabulary/999", headers=auth_header())

    assert response.status_code == 404


def test_update_vocabulary(client: TestClient) -> None:
    created = create_word(client)
    vocab_id = created["id"]

    response = client.patch(
        f"/api/vocabulary/{vocab_id}",
        json={
            "vietnamese_meaning": "from bo, bo roi",
            "examples": ["New example."],
        },
        headers=auth_header(),
    )

    assert response.status_code == 200
    data = response.json()
    assert data["vietnamese_meaning"] == "from bo, bo roi"
    assert data["examples"] == ["New example."]
    assert data["word"] == "abandon"


def test_update_vocabulary_not_found(client: TestClient) -> None:
    response = client.patch(
        "/api/vocabulary/999",
        json={"word": "nope"},
        headers=auth_header(),
    )

    assert response.status_code == 404


def test_delete_vocabulary(client: TestClient) -> None:
    created = create_word(client)
    vocab_id = created["id"]

    response = client.delete(f"/api/vocabulary/{vocab_id}", headers=auth_header())
    assert response.status_code == 204

    response = client.get(f"/api/vocabulary/{vocab_id}", headers=auth_header())
    assert response.status_code == 404


def test_delete_vocabulary_not_found(client: TestClient) -> None:
    response = client.delete("/api/vocabulary/999", headers=auth_header())

    assert response.status_code == 404


def test_vocabulary_requires_auth(client: TestClient) -> None:
    response = client.get("/api/vocabulary")
    assert response.status_code == 401
