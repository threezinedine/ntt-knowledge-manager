import os
from typing import Any
from unittest.mock import patch

from fastapi.testclient import TestClient

MOCK_DICT_RESPONSE: dict[str, Any] = {
    "phonetic": "/əˈbæn.dən/",
    "audio_url": "https://api.dictionaryapi.dev/media/pronunciations/en/abandon-us.mp3",
    "meanings": [
        {
            "partOfSpeech": "verb",
            "definitions": [
                {
                    "definition": "To give up or relinquish control of",
                    "example": "They abandoned the project.",
                },
                {
                    "definition": "To leave behind or desert",
                },
            ],
        },
        {
            "partOfSpeech": "noun",
            "definitions": [
                {
                    "definition": "A yielding to natural impulses",
                },
            ],
        },
    ],
    "oald_link": "https://en.wiktionary.org/wiki/abandon",
}


def auth_header() -> dict[str, str]:
    return {"Authorization": f"Bearer {os.environ['FIX_TOKEN']}"}


def mock_fetch(_word: str) -> dict[str, object] | None:
    return dict(MOCK_DICT_RESPONSE)


def add_word(client: TestClient, word: str = "abandon") -> dict[str, object]:
    with patch(
        "server.features.vocabulary.vocabulary.fetch_word", side_effect=mock_fetch
    ):
        resp = client.post(
            "/api/vocabulary", json={"word": word}, headers=auth_header()
        )
    return resp.json()


def test_add_word_fetches_dictionary_data(client: TestClient) -> None:
    with patch(
        "server.features.vocabulary.vocabulary.fetch_word", side_effect=mock_fetch
    ) as mock:
        response = client.post(
            "/api/vocabulary", json={"word": "abandon"}, headers=auth_header()
        )

    assert response.status_code == 201
    data = response.json()
    assert data["word"] == "abandon"
    assert data["phonetic"] == "/əˈbæn.dən/"
    assert data["audio_url"].endswith(".mp3")
    assert len(data["meanings"]) == 2
    assert data["meanings"][0]["partOfSpeech"] == "verb"
    assert len(data["meanings"][0]["definitions"]) == 2
    assert data["search_times"] == 0
    mock.assert_called_once_with("abandon")


def test_add_duplicate_word_increments_search_times(client: TestClient) -> None:
    add_word(client, "abandon")

    response = client.post(
        "/api/vocabulary", json={"word": "abandon"}, headers=auth_header()
    )

    assert response.status_code == 201
    data = response.json()
    assert data["word"] == "abandon"
    assert data["search_times"] == 1
    assert len(data["search_history"]) == 1
    assert "searched_at" in data["search_history"][0]


def test_add_duplicate_increments_multiple_times(client: TestClient) -> None:
    add_word(client, "abandon")

    for _ in range(3):
        client.post("/api/vocabulary", json={"word": "abandon"}, headers=auth_header())

    response = client.get("/api/vocabulary", headers=auth_header())
    items = response.json()["items"]
    assert len(items) == 1
    assert items[0]["search_times"] == 3
    assert len(items[0]["search_history"]) == 3


def test_add_word_normalizes_to_lowercase(client: TestClient) -> None:
    with patch(
        "server.features.vocabulary.vocabulary.fetch_word", side_effect=mock_fetch
    ) as mock:
        response = client.post(
            "/api/vocabulary", json={"word": "  Abandon  "}, headers=auth_header()
        )

    assert response.status_code == 201
    assert response.json()["word"] == "abandon"
    mock.assert_called_once_with("abandon")


def test_add_empty_word_returns_422(client: TestClient) -> None:
    response = client.post(
        "/api/vocabulary", json={"word": "  "}, headers=auth_header()
    )
    assert response.status_code == 422


def test_add_word_dictionary_failure_returns_502(client: TestClient) -> None:
    with patch("server.features.vocabulary.vocabulary.fetch_word", return_value=None):
        response = client.post(
            "/api/vocabulary", json={"word": "xyznotaword"}, headers=auth_header()
        )

    assert response.status_code == 502


def test_list_vocabulary_paginated(client: TestClient) -> None:
    for w in ["apple", "banana", "cherry", "date", "elderberry"]:
        add_word(client, w)

    response = client.get(
        "/api/vocabulary",
        params={"limit": 2, "offset": 0, "sort": "alpha"},
        headers=auth_header(),
    )

    data = response.json()
    assert data["total"] == 5
    assert len(data["items"]) == 2
    assert data["items"][0]["word"] == "apple"

    page2 = client.get(
        "/api/vocabulary",
        params={"limit": 2, "offset": 2, "sort": "alpha"},
        headers=auth_header(),
    ).json()
    assert page2["items"][0]["word"] == "cherry"


def test_list_vocabulary_search(client: TestClient) -> None:
    for w in ["apple", "application", "banana"]:
        add_word(client, w)

    response = client.get("/api/vocabulary", params={"q": "app"}, headers=auth_header())
    assert response.json()["total"] == 2


def test_list_vocabulary_sort_most_searched(client: TestClient) -> None:
    add_word(client, "apple")
    add_word(client, "banana")

    for _ in range(3):
        client.post("/api/vocabulary", json={"word": "banana"}, headers=auth_header())

    response = client.get(
        "/api/vocabulary",
        params={"sort": "most_searched"},
        headers=auth_header(),
    )
    items = response.json()["items"]
    assert items[0]["word"] == "banana"
    assert items[0]["search_times"] == 3


def test_get_vocabulary_increments_search_times(client: TestClient) -> None:
    created = add_word(client)
    vocab_id = created["id"]

    resp1 = client.get(f"/api/vocabulary/{vocab_id}", headers=auth_header())
    assert resp1.json()["search_times"] == 1
    assert len(resp1.json()["search_history"]) == 1

    resp2 = client.get(f"/api/vocabulary/{vocab_id}", headers=auth_header())
    assert resp2.json()["search_times"] == 2
    assert len(resp2.json()["search_history"]) == 2
    assert (
        resp2.json()["search_history"][0]["searched_at"]
        >= resp2.json()["search_history"][1]["searched_at"]
    )


def test_get_vocabulary_not_found(client: TestClient) -> None:
    response = client.get("/api/vocabulary/999", headers=auth_header())
    assert response.status_code == 404


def test_update_vocabulary(client: TestClient) -> None:
    created = add_word(client)
    vocab_id = created["id"]

    response = client.patch(
        f"/api/vocabulary/{vocab_id}",
        json={"vietnamese_meaning": "tu bo, bo roi"},
        headers=auth_header(),
    )

    assert response.status_code == 200
    assert response.json()["vietnamese_meaning"] == "tu bo, bo roi"
    assert response.json()["word"] == "abandon"


def test_delete_vocabulary(client: TestClient) -> None:
    created = add_word(client)
    vocab_id = created["id"]

    response = client.delete(f"/api/vocabulary/{vocab_id}", headers=auth_header())
    assert response.status_code == 204

    response = client.get(f"/api/vocabulary/{vocab_id}", headers=auth_header())
    assert response.status_code == 404


def test_vocabulary_requires_auth(client: TestClient) -> None:
    response = client.get("/api/vocabulary")
    assert response.status_code == 401
