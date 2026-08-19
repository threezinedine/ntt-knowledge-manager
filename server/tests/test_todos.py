import os

from fastapi.testclient import TestClient


def auth() -> dict[str, str]:
    return {"Authorization": f"Bearer {os.environ['FIX_TOKEN']}"}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def make_category(client: TestClient, name: str = "Work", color: str = "#ff0000") -> dict:
    r = client.post("/api/todos/categories", json={"name": name, "color": color}, headers=auth())
    assert r.status_code == 201
    return r.json()


def make_period_type(client: TestClient, **kwargs) -> dict:
    body = {"name": "Custom daily", "kind": "interval", "interval_days": 1, **kwargs}
    r = client.post("/api/todos/period-types", json=body, headers=auth())
    assert r.status_code == 201
    return r.json()


def make_template(client: TestClient, **kwargs) -> dict:
    body = {"title": "Morning routine", **kwargs}
    r = client.post("/api/todos/templates", json=body, headers=auth())
    assert r.status_code == 201
    return r.json()


def make_task(client: TestClient, **kwargs) -> dict:
    body = {"title": "Buy milk", **kwargs}
    r = client.post("/api/todos/tasks", json=body, headers=auth())
    assert r.status_code == 201
    return r.json()


# ---------------------------------------------------------------------------
# PeriodType tests
# ---------------------------------------------------------------------------

def test_list_period_types_returns_list(client: TestClient) -> None:
    # in-memory test DB has no seed rows; just check the endpoint works
    make_period_type(client, name="Daily", kind="interval", interval_days=1)
    make_period_type(client, name="Every Tuesday", kind="weekly", days_of_week=[1])
    r = client.get("/api/todos/period-types", headers=auth())
    assert r.status_code == 200
    names = [p["name"] for p in r.json()]
    assert "Daily" in names
    assert "Every Tuesday" in names


def test_create_interval_period_type(client: TestClient) -> None:
    pt = make_period_type(client, name="Every 5 days", kind="interval", interval_days=5)
    assert pt["kind"] == "interval"
    assert pt["interval_days"] == 5
    assert pt["is_custom"] is True


def test_create_weekly_period_type(client: TestClient) -> None:
    pt = make_period_type(client, name="Mon+Wed", kind="weekly", days_of_week=[0, 2])
    assert pt["kind"] == "weekly"
    assert pt["days_of_week"] == [0, 2]


def test_create_weekly_times_per_occurrence(client: TestClient) -> None:
    pt = make_period_type(client, name="3x Tuesday", kind="weekly", days_of_week=[1], times_per_occurrence=3)
    assert pt["times_per_occurrence"] == 3


def test_create_period_type_invalid_kind(client: TestClient) -> None:
    r = client.post("/api/todos/period-types", json={"name": "bad", "kind": "monthly"}, headers=auth())
    assert r.status_code == 422


def test_create_interval_without_interval_days(client: TestClient) -> None:
    r = client.post("/api/todos/period-types", json={"name": "bad", "kind": "interval"}, headers=auth())
    assert r.status_code == 422


def test_create_weekly_without_days(client: TestClient) -> None:
    r = client.post("/api/todos/period-types", json={"name": "bad", "kind": "weekly"}, headers=auth())
    assert r.status_code == 422


def test_update_period_type(client: TestClient) -> None:
    pt = make_period_type(client)
    r = client.patch(f"/api/todos/period-types/{pt['id']}", json={"name": "Renamed"}, headers=auth())
    assert r.status_code == 200
    assert r.json()["name"] == "Renamed"


def test_delete_period_type(client: TestClient) -> None:
    pt = make_period_type(client)
    r = client.delete(f"/api/todos/period-types/{pt['id']}", headers=auth())
    assert r.status_code == 204
    assert client.get(f"/api/todos/period-types/{pt['id']}", headers=auth()).status_code == 404


def test_period_types_require_auth(client: TestClient) -> None:
    assert client.get("/api/todos/period-types").status_code == 401
    assert client.post("/api/todos/period-types", json={}).status_code == 401


# ---------------------------------------------------------------------------
# Category tests
# ---------------------------------------------------------------------------

def test_create_category(client: TestClient) -> None:
    cat = make_category(client, "Health", "#00ff00")
    assert cat["name"] == "Health"
    assert cat["color"] == "#00ff00"
    assert "id" in cat


def test_create_duplicate_category(client: TestClient) -> None:
    make_category(client, "Work")
    r = client.post("/api/todos/categories", json={"name": "Work"}, headers=auth())
    assert r.status_code == 409


def test_create_empty_category_name(client: TestClient) -> None:
    r = client.post("/api/todos/categories", json={"name": "  "}, headers=auth())
    assert r.status_code == 422


def test_list_categories(client: TestClient) -> None:
    make_category(client, "A")
    make_category(client, "B")
    r = client.get("/api/todos/categories", headers=auth())
    assert r.status_code == 200
    assert len(r.json()) == 2


def test_update_category(client: TestClient) -> None:
    cat = make_category(client)
    r = client.patch(f"/api/todos/categories/{cat['id']}", json={"color": "#0000ff"}, headers=auth())
    assert r.status_code == 200
    assert r.json()["color"] == "#0000ff"


def test_delete_category(client: TestClient) -> None:
    cat = make_category(client)
    assert client.delete(f"/api/todos/categories/{cat['id']}", headers=auth()).status_code == 204
    assert client.get(f"/api/todos/categories/{cat['id']}", headers=auth()).status_code == 404


def test_categories_require_auth(client: TestClient) -> None:
    assert client.get("/api/todos/categories").status_code == 401


# ---------------------------------------------------------------------------
# TaskTemplate tests
# ---------------------------------------------------------------------------

def test_create_template(client: TestClient) -> None:
    tmpl = make_template(client, description="Do 10 push-ups", priority="high")
    assert tmpl["title"] == "Morning routine"
    assert tmpl["priority"] == "high"
    assert tmpl["is_active"] is True
    assert tmpl["categories"] == []


def test_create_template_with_categories(client: TestClient) -> None:
    cat = make_category(client)
    tmpl = make_template(client, category_ids=[cat["id"]])
    assert len(tmpl["categories"]) == 1
    assert tmpl["categories"][0]["id"] == cat["id"]


def test_create_template_with_period_type(client: TestClient) -> None:
    pt = make_period_type(client)
    tmpl = make_template(client, period_type_id=pt["id"])
    assert tmpl["period_type_id"] == pt["id"]


def test_create_template_empty_title(client: TestClient) -> None:
    r = client.post("/api/todos/templates", json={"title": "  "}, headers=auth())
    assert r.status_code == 422


def test_create_template_invalid_category(client: TestClient) -> None:
    r = client.post("/api/todos/templates", json={"title": "T", "category_ids": [9999]}, headers=auth())
    assert r.status_code == 422


def test_list_templates(client: TestClient) -> None:
    make_template(client, title="A")
    make_template(client, title="B")
    r = client.get("/api/todos/templates", headers=auth())
    assert r.status_code == 200
    assert r.json()["total"] == 2


def test_list_templates_active_only(client: TestClient) -> None:
    tmpl = make_template(client, title="Active")
    make_template(client, title="Inactive")
    client.patch(f"/api/todos/templates/{tmpl['id']}", json={"is_active": False}, headers=auth())
    r = client.get("/api/todos/templates?active_only=true", headers=auth())
    assert r.json()["total"] == 1


def test_update_template_categories(client: TestClient) -> None:
    cat1 = make_category(client, "Cat1")
    cat2 = make_category(client, "Cat2")
    tmpl = make_template(client, category_ids=[cat1["id"]])
    r = client.patch(
        f"/api/todos/templates/{tmpl['id']}",
        json={"category_ids": [cat2["id"]]},
        headers=auth(),
    )
    assert r.status_code == 200
    assert r.json()["categories"][0]["id"] == cat2["id"]


def test_delete_template(client: TestClient) -> None:
    tmpl = make_template(client)
    assert client.delete(f"/api/todos/templates/{tmpl['id']}", headers=auth()).status_code == 204


def test_spawn_task_from_template(client: TestClient) -> None:
    cat = make_category(client)
    tmpl = make_template(client, description="Desc", priority="high", category_ids=[cat["id"]])
    r = client.post(f"/api/todos/templates/{tmpl['id']}/spawn", headers=auth())
    assert r.status_code == 201
    task = r.json()
    assert task["title"] == tmpl["title"]
    assert task["priority"] == "high"
    assert task["template_id"] == tmpl["id"]
    assert len(task["categories"]) == 1


def test_templates_require_auth(client: TestClient) -> None:
    assert client.get("/api/todos/templates").status_code == 401


# ---------------------------------------------------------------------------
# Task tests
# ---------------------------------------------------------------------------

def test_create_task(client: TestClient) -> None:
    task = make_task(client)
    assert task["title"] == "Buy milk"
    assert task["status"] == "todo"
    assert task["priority"] == "medium"
    assert task["completed_at"] is None


def test_create_task_done_sets_completed_at(client: TestClient) -> None:
    task = make_task(client, status="done")
    assert task["completed_at"] is not None


def test_create_task_with_categories(client: TestClient) -> None:
    cat = make_category(client)
    task = make_task(client, category_ids=[cat["id"]])
    assert task["categories"][0]["id"] == cat["id"]


def test_create_task_invalid_status(client: TestClient) -> None:
    r = client.post("/api/todos/tasks", json={"title": "T", "status": "pending"}, headers=auth())
    assert r.status_code == 422


def test_create_task_invalid_priority(client: TestClient) -> None:
    r = client.post("/api/todos/tasks", json={"title": "T", "priority": "urgent"}, headers=auth())
    assert r.status_code == 422


def test_list_tasks(client: TestClient) -> None:
    make_task(client, title="Task A")
    make_task(client, title="Task B")
    r = client.get("/api/todos/tasks", headers=auth())
    assert r.status_code == 200
    assert r.json()["total"] == 2


def test_list_tasks_filter_status(client: TestClient) -> None:
    make_task(client, title="Done task", status="done")
    make_task(client, title="Todo task")
    r = client.get("/api/todos/tasks?status=done", headers=auth())
    assert r.json()["total"] == 1


def test_list_tasks_filter_category(client: TestClient) -> None:
    cat = make_category(client)
    make_task(client, title="Tagged", category_ids=[cat["id"]])
    make_task(client, title="Untagged")
    r = client.get(f"/api/todos/tasks?category_id={cat['id']}", headers=auth())
    assert r.json()["total"] == 1


def test_list_tasks_search(client: TestClient) -> None:
    make_task(client, title="Buy milk")
    make_task(client, title="Exercise")
    r = client.get("/api/todos/tasks?q=milk", headers=auth())
    assert r.json()["total"] == 1


def test_update_task_status_to_done(client: TestClient) -> None:
    task = make_task(client)
    assert task["completed_at"] is None
    r = client.patch(f"/api/todos/tasks/{task['id']}", json={"status": "done"}, headers=auth())
    assert r.status_code == 200
    assert r.json()["completed_at"] is not None


def test_update_task_status_from_done_clears_completed_at(client: TestClient) -> None:
    task = make_task(client, status="done")
    r = client.patch(f"/api/todos/tasks/{task['id']}", json={"status": "todo"}, headers=auth())
    assert r.json()["completed_at"] is None


def test_update_task_categories(client: TestClient) -> None:
    cat = make_category(client)
    task = make_task(client)
    r = client.patch(f"/api/todos/tasks/{task['id']}", json={"category_ids": [cat["id"]]}, headers=auth())
    assert r.json()["categories"][0]["id"] == cat["id"]


def test_get_task_not_found(client: TestClient) -> None:
    assert client.get("/api/todos/tasks/9999", headers=auth()).status_code == 404


def test_delete_task(client: TestClient) -> None:
    task = make_task(client)
    assert client.delete(f"/api/todos/tasks/{task['id']}", headers=auth()).status_code == 204
    assert client.get(f"/api/todos/tasks/{task['id']}", headers=auth()).status_code == 404


def test_delete_category_removes_from_task(client: TestClient) -> None:
    cat = make_category(client)
    task = make_task(client, category_ids=[cat["id"]])
    client.delete(f"/api/todos/categories/{cat['id']}", headers=auth())
    r = client.get(f"/api/todos/tasks/{task['id']}", headers=auth())
    assert r.json()["categories"] == []


def test_delete_template_nullifies_task_template_id(client: TestClient) -> None:
    tmpl = make_template(client)
    task = make_task(client, template_id=tmpl["id"])
    client.delete(f"/api/todos/templates/{tmpl['id']}", headers=auth())
    r = client.get(f"/api/todos/tasks/{task['id']}", headers=auth())
    assert r.json()["template_id"] is None


def test_tasks_require_auth(client: TestClient) -> None:
    assert client.get("/api/todos/tasks").status_code == 401
    assert client.post("/api/todos/tasks", json={}).status_code == 401
