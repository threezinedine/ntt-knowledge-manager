# Knowledge Manager Server

## Client

The React web and Electron desktop client lives in `client/`.

```bash
cd client
npm install
npm run build:web
npm run build:desktop
```

Both applications read the shared root `.env`. Choose a local environment file
before running outside Docker:

```bash
cp .dev.env .env
```

Docker development and production images copy `.dev.env` and `.prod.env`,
respectively, to `/app/.env`. Pytest loads only `.test.env`.

## Browser E2E Tests

Playwright lives in the separate `e2e/` workspace. It tests Docker services you
start manually: Vite at `http://localhost:5173` for development and FastAPI at
`http://localhost:8000` for production.

```bash
cd e2e && npm install && npm run install:browsers

docker compose -f compose.dev.yaml up --build
./run-e2e.sh dev

docker compose -f compose.prod.yaml up --build
./run-e2e.sh prod
```

For Docker development, `docker compose -f compose.dev.yaml up --build` starts
Vite at `http://localhost:5173` from the mounted `client/` directory. Production
builds compile the web client and serve it from FastAPI at `http://localhost:8000`.

Development client dependencies are stored in Docker's `client_node_modules`
volume. Initialize or refresh that volume manually when dependencies change:

```bash
docker compose -f compose.dev.yaml run --rm web npm ci
```

## Client Component Tests

Run client component tests locally with:

```bash
cd client && npm run test:component
```

The Docker development stack starts a component-test watcher alongside the API
and Vite. It shares the development client dependencies and does not start Vite:

```bash
docker compose -f compose.dev.yaml up --build
```

Client test files and coverage are excluded from Docker image build contexts.

## Storybook

The development Compose stack also starts Storybook at
`http://localhost:6006` for the components in `client/src/`:

```bash
docker compose -f compose.dev.yaml up --build
```

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

SQLite is managed with **Alembic** migrations. The schema lives in
`server/migrations/versions/`, and on startup the app runs
`alembic upgrade head` automatically (see `server/database.py`). When Alembic
meets a database that was created before migrations existed (no
`alembic_version` table), it stamps the revision that matches the on-disk
schema first, so the upgrade only applies the migrations that are actually
missing.

Generate a new migration after changing a model:

```bash
.venv/bin/alembic revision --autogenerate -m "describe the change"
.venv/bin/alembic upgrade head
```

Review generated revisions in `server/migrations/versions/` before applying
them. Tests are unaffected: they use an isolated in-memory database built
directly from the models.

The API seeds fixed login tokens only when the token table is empty.

## Docker

```bash
docker compose -f compose.dev.yaml up --build
docker compose -f compose.prod.yaml up --build
```
