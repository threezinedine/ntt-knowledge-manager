import os

from fastapi.testclient import TestClient

AUTH = {"Authorization": f"Bearer {os.environ['FIX_TOKEN']}"}


def create_node(
    client: TestClient, title: str, **overrides: object
) -> dict[str, object]:
    response = client.post("/nodes", headers=AUTH, json={"title": title, **overrides})
    assert response.status_code == 201
    return response.json()


def test_nodes_require_login(client: TestClient) -> None:
    assert client.get("/nodes").status_code == 401
    assert client.post("/nodes", json={"title": "X"}).status_code == 401


def test_create_node_with_metadata(client: TestClient) -> None:
    response = client.post(
        "/nodes",
        headers=AUTH,
        json={
            "title": "Alpha",
            "node_type": "idea",
            "metadata": {"color": "red"},
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Alpha"
    assert data["node_type"] == "idea"
    assert data["metadata"] == {"color": "red"}
    assert "id" in data


def test_list_nodes(client: TestClient) -> None:
    create_node(client, "Alpha")
    create_node(client, "Beta")

    response = client.get("/nodes", headers=AUTH)

    assert response.status_code == 200
    assert [node["title"] for node in response.json()] == ["Alpha", "Beta"]


def test_get_node(client: TestClient) -> None:
    node = create_node(client, "Alpha")

    response = client.get(f"/nodes/{node['id']}", headers=AUTH)

    assert response.status_code == 200
    assert response.json()["title"] == "Alpha"


def test_get_missing_node_404(client: TestClient) -> None:
    response = client.get("/nodes/999", headers=AUTH)

    assert response.status_code == 404
    assert response.json() == {"detail": "Node not found"}


def test_node_map_requires_login(client: TestClient) -> None:
    assert client.get("/nodes/map").status_code == 401


def test_node_map_returns_outgoing_relations(client: TestClient) -> None:
    alpha = create_node(client, "Alpha")
    beta = create_node(client, "Beta")
    relation = client.post(
        f"/nodes/{alpha['id']}/relations",
        headers=AUTH,
        json={"target_node_id": beta["id"], "relation_type": "references"},
    ).json()

    response = client.get("/nodes/map", headers=AUTH)

    assert response.status_code == 200
    data = response.json()
    by_name = {item["nodeName"]: item for item in data}
    assert by_name["Alpha"]["nodeId"] == alpha["id"]
    assert by_name["Alpha"]["map"] == {
        str(beta["id"]): {
            "relationId": relation["id"],
            "relationName": "references",
        }
    }
    assert by_name["Beta"]["map"] == {}


def test_update_node_metadata(client: TestClient) -> None:
    node = create_node(client, "Alpha")

    response = client.patch(
        f"/nodes/{node['id']}",
        headers=AUTH,
        json={"metadata": {"color": "blue"}, "content": "hello"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["metadata"] == {"color": "blue"}
    assert data["content"] == "hello"
    assert data["title"] == "Alpha"


def test_delete_node(client: TestClient) -> None:
    node = create_node(client, "Alpha")

    response = client.delete(f"/nodes/{node['id']}", headers=AUTH)

    assert response.status_code == 204
    assert client.get(f"/nodes/{node['id']}", headers=AUTH).status_code == 404


def test_create_child_node(client: TestClient) -> None:
    parent = create_node(client, "Root")

    child = create_node(client, "Child", parent_node_id=parent["id"])

    assert child["parent_node_id"] == parent["id"]


def test_create_node_with_missing_parent_404(client: TestClient) -> None:
    response = client.post(
        "/nodes", headers=AUTH, json={"title": "Orphan", "parent_node_id": 999}
    )

    assert response.status_code == 404


def test_update_node_parent(client: TestClient) -> None:
    parent = create_node(client, "Root")
    child = create_node(client, "Child")

    response = client.patch(
        f"/nodes/{child['id']}",
        headers=AUTH,
        json={"parent_node_id": parent["id"]},
    )

    assert response.status_code == 200
    assert response.json()["parent_node_id"] == parent["id"]


def test_clear_node_parent(client: TestClient) -> None:
    parent = create_node(client, "Root")
    child = create_node(client, "Child", parent_node_id=parent["id"])

    response = client.patch(
        f"/nodes/{child['id']}", headers=AUTH, json={"clear_parent": True}
    )

    assert response.status_code == 200
    assert response.json()["parent_node_id"] is None


def test_node_cannot_be_its_own_parent(client: TestClient) -> None:
    node = create_node(client, "Alpha")

    response = client.patch(
        f"/nodes/{node['id']}",
        headers=AUTH,
        json={"parent_node_id": node["id"]},
    )

    assert response.status_code == 400


def test_node_parent_cycle_rejected(client: TestClient) -> None:
    root = create_node(client, "Root")
    child = create_node(client, "Child", parent_node_id=root["id"])

    response = client.patch(
        f"/nodes/{root['id']}",
        headers=AUTH,
        json={"parent_node_id": child["id"]},
    )

    assert response.status_code == 400


def test_deleting_a_node_detaches_its_children(client: TestClient) -> None:
    parent = create_node(client, "Root")
    child = create_node(client, "Child", parent_node_id=parent["id"])

    client.delete(f"/nodes/{parent['id']}", headers=AUTH)

    response = client.get(f"/nodes/{child['id']}", headers=AUTH)
    assert response.json()["parent_node_id"] is None


def test_create_and_list_relations(client: TestClient) -> None:
    alpha = create_node(client, "Alpha")
    beta = create_node(client, "Beta")

    response = client.post(
        f"/nodes/{alpha['id']}/relations",
        headers=AUTH,
        json={
            "target_node_id": beta["id"],
            "relation_type": "references",
            "metadata": {"weight": 3},
        },
    )

    assert response.status_code == 201
    relation = response.json()
    assert relation["source_node_id"] == alpha["id"]
    assert relation["target_node_id"] == beta["id"]
    assert relation["relation_type"] == "references"
    assert relation["metadata"] == {"weight": 3}

    # the relation is visible from either endpoint node
    assert len(client.get(f"/nodes/{alpha['id']}/relations", headers=AUTH).json()) == 1
    assert len(client.get(f"/nodes/{beta['id']}/relations", headers=AUTH).json()) == 1


def test_self_relation_rejected(client: TestClient) -> None:
    alpha = create_node(client, "Alpha")

    response = client.post(
        f"/nodes/{alpha['id']}/relations",
        headers=AUTH,
        json={"target_node_id": alpha["id"]},
    )

    assert response.status_code == 400


def test_relation_to_missing_node_404(client: TestClient) -> None:
    alpha = create_node(client, "Alpha")

    response = client.post(
        f"/nodes/{alpha['id']}/relations",
        headers=AUTH,
        json={"target_node_id": 999},
    )

    assert response.status_code == 404


def test_update_relation_metadata(client: TestClient) -> None:
    alpha = create_node(client, "Alpha")
    beta = create_node(client, "Beta")
    relation = client.post(
        f"/nodes/{alpha['id']}/relations",
        headers=AUTH,
        json={"target_node_id": beta["id"], "metadata": {"weight": 1}},
    ).json()

    response = client.patch(
        f"/nodes/relations/{relation['id']}",
        headers=AUTH,
        json={"relation_type": "related", "metadata": {"weight": 9}},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["relation_type"] == "related"
    assert data["metadata"] == {"weight": 9}


def test_delete_relation(client: TestClient) -> None:
    alpha = create_node(client, "Alpha")
    beta = create_node(client, "Beta")
    relation = client.post(
        f"/nodes/{alpha['id']}/relations",
        headers=AUTH,
        json={"target_node_id": beta["id"]},
    ).json()

    response = client.delete(f"/nodes/relations/{relation['id']}", headers=AUTH)

    assert response.status_code == 204
    assert len(client.get(f"/nodes/{alpha['id']}/relations", headers=AUTH).json()) == 0


def test_deleting_a_node_removes_its_relations(client: TestClient) -> None:
    alpha = create_node(client, "Alpha")
    beta = create_node(client, "Beta")
    client.post(
        f"/nodes/{alpha['id']}/relations",
        headers=AUTH,
        json={"target_node_id": beta["id"]},
    )

    client.delete(f"/nodes/{alpha['id']}", headers=AUTH)

    assert len(client.get(f"/nodes/{beta['id']}/relations", headers=AUTH).json()) == 0
