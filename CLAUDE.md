# Knowledge Manager

A full-stack knowledge management app with a FastAPI backend and React + Electron frontend.

## Architecture

- **Server** (`server/`): Python/FastAPI, SQLAlchemy ORM, Alembic migrations, SQLite database
- **Client** (`client/`): React 19, TypeScript, Vite, SCSS modules, Zustand state management, Electron desktop shell
- **E2E tests** (`e2e/`): Playwright

### Server structure
- `server/main.py` — FastAPI app, route registration, CORS, static file serving
- `server/database.py` — SQLAlchemy engine, session factory, Alembic initialization
- `server/config.py` — Environment loading (`.dev.env`, `.test.env`, `.prod.env`)
- `server/features/<feature>/` — Feature modules (login, node) with routes, models, schemas
- `server/migrations/versions/` — Alembic migration files (numbered `0001_`, `0002_`, etc.)
- `server/tests/` — pytest tests using in-memory SQLite

### Client structure
- `client/src/components/` — Reusable UI components, each in its own directory with `index.tsx`, `*.tsx`, `*.module.scss`, `*.test.tsx`, `*.stories.tsx`
- `client/src/features/` — Stateful feature modules (auth, navbar, theme) with stores, hooks, utils
- `client/src/pages/` — Page components (home, login, workspace, not-found)
- `client/src/components/stateless-graph/engine/` — Canvas-based graph rendering engine

## Development

### Server
```bash
# Run server (dev)
uvicorn server.main:app --reload

# Run server tests
./run-tests.sh              # one-shot
./run-tests.sh --watch      # watch mode

# Run specific test
.venv/bin/python -m pytest server/tests/test_nodes.py -v
```

### Client
```bash
cd client
npm run dev          # Vite dev server (port 5173)
npm run test:component       # Vitest tests
npm run test:component:watch # Vitest watch
npm run storybook    # Storybook (port 6006)
npm run lint         # oxlint
npm run app:dev      # Electron dev mode
```

### Docker
```bash
docker compose -f compose.dev.yaml up   # development
docker compose -f compose.prod.yaml up  # production
```

### E2E
```bash
./run-e2e.sh dev    # against dev environment
./run-e2e.sh prod   # against prod environment
```

### Database migrations
```bash
# Create new migration
.venv/bin/alembic revision -m "description"
# Apply migrations (also runs automatically on server startup)
.venv/bin/alembic upgrade head
```

## Conventions

### Commit messages
Format: `[type] description` — types: `feature`, `test`, `refactor`, `setup`, `fix`

### Client component pattern
Each component lives in its own directory:
```
component-name/
  index.tsx              # re-export
  component-name.tsx     # implementation
  component-name.module.scss
  component-name.test.tsx
  component-name.stories.tsx
```

### Server test pattern
Tests use an in-memory SQLite database via the `db_session` and `client` fixtures in `server/tests/conftest.py`. The `APP_ENV=test` env var loads `.test.env`.

### Environment files
- `.dev.env` — local development
- `.test.env` — test suite
- `.prod.env` — production

### Key env vars
- `DATABASE_URL` — SQLAlchemy connection string
- `VITE_API_URL` — API base URL for the client
- `FIX_TOKEN` — Fixed login token
- `ALLOWED_ORIGINS` — CORS origins (defaults to localhost:5173)
