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

## Docker

```bash
docker compose -f compose.dev.yaml up --build
docker compose -f compose.prod.yaml up --build
```
