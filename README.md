# Knowledge Manager Server

## Local development

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn server.main:app --reload
```

The health endpoint is available at `http://localhost:8000/health`.

Run the FastAPI tests against an in-memory SQLite database with:

```bash
./run-tests.sh
```

Watch the server and test files, rerunning the suite after each Python change:

```bash
./run-tests.sh --watch
```

Add test modules under `server/tests/`; the script discovers and runs the full suite.

## Database

The API stores fixed login tokens in SQLite. On startup, the development and
production app creates the table and seeds it only when the table is empty.
Tests use an isolated in-memory database and seed the fixed tokens for every
test.

## Docker

```bash
docker compose -f compose.dev.yaml up --build
docker compose -f compose.prod.yaml up --build
```
