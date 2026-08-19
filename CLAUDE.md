# Knowledge Manager

A full-stack knowledge management app with a FastAPI backend and React + Electron frontend. Features include node-based knowledge graphs, vocabulary/dictionary lookup, user settings, and authentication.

## Architecture

- **Server** (`server/`): Python/FastAPI, SQLAlchemy ORM, Alembic migrations, SQLite database
- **Client** (`client/`): React 19, TypeScript, Vite, SCSS modules, Zustand state management, Electron desktop shell
- **E2E tests** (`e2e/`): Playwright
- **Test Dashboard** (`test-dashboard/`): HTML report generation for server, client, and e2e tests
- **Nginx** (`nginx/`): Reverse proxy configs for dev and e2e environments

### Server structure
- `server/main.py` — FastAPI app, route registration, CORS, static file serving
- `server/database.py` — SQLAlchemy engine, session factory, Alembic initialization
- `server/config.py` — Environment loading (uses `APP_ENV` to select `.test.env` or `.env`)
- `server/features/login/` — Authentication: token-based login, `require_login` middleware
- `server/features/node/` — Knowledge nodes: CRUD, hierarchical parent-child relationships
- `server/features/settings/` — User settings: key-value store
- `server/features/vocabulary/` — Vocabulary manager: word lookup via dictionary API, search tracking, CRUD
- `server/migrations/versions/` — Alembic migration files (numbered `0001_` through `0005_`)
- `server/tests/` — pytest tests using in-memory SQLite

### Client structure
- `client/src/components/` — Reusable UI components (button, editor, list, modal, stateless-graph, stateless-navbar, stateless-dictionary, stateless-dropdown, tab-space, toast-message, toggle-button)
- `client/src/features/` — Stateful feature modules:
  - `auth/` — Authentication store, API calls, protected route component
  - `navbar/` — Navigation bar component
  - `theme/` — Theme provider, store, hooks, utilities
  - `dictionary/` — Dictionary/vocabulary API integration and store
  - `settings/` — Settings API and store
  - `avatar-upload/` — Avatar upload API, component, and store
  - `toast/` — Toast notification system with store
- `client/src/pages/` — Page components: home, login, workspace, settings, not-found
- `client/src/icons/` — SVG icon components (add, error, info, speaker, success, warn)
- `client/src/components/stateless-graph/engine/` — Canvas-based graph rendering engine with tween animations
- Routing: hash-based (`window.location.hash`), implemented in `App.tsx`

### API routes
All routes are prefixed with `/api`:
- `GET /api/health` — Health check (public)
- `GET /api/secure-health` — Authenticated health check
- `/api/login/` — Login token endpoints
- `/api/nodes/` — Knowledge node CRUD
- `/api/settings/` — User settings CRUD
- `/api/vocabulary/` — Vocabulary CRUD with dictionary lookup

## Development

### Server
```bash
# Run server (dev)
uvicorn server.main:app --reload

# Run server tests
./run-tests.sh              # one-shot
./run-tests.sh --watch      # watch mode (uses watchfiles)

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
npm run app          # Electron production build
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

### Test Dashboard
```bash
cd test-dashboard
./run-server-tests.sh   # generate server test report
./run-client-tests.sh   # generate client test report
./run-e2e-tests.sh      # generate e2e test report
python serve.py          # serve dashboard at localhost
```

### Database migrations
```bash
# Create new migration (number sequentially: 0006_, 0007_, etc.)
.venv/bin/alembic revision -m "description"
# Apply migrations (also runs automatically on server startup)
.venv/bin/alembic upgrade head
```

Current migrations: initial schema → parent_node_id → settings table → settings value to text → vocabulary table

## Conventions

### Commit messages
Format: `[type] description` — types: `feature`, `test`, `refactor`, `setup`, `fix`, `bugfix`

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

### Client feature pattern
Each feature module contains:
```
feature-name/
  index.ts               # re-export
  apis/                  # API call functions
  store/                 # Zustand store
  components/            # Feature-specific components
  hooks/                 # Custom hooks (optional)
  utils/                 # Utility functions (optional)
```

### Server feature pattern
Each server feature module contains:
```
feature-name/
  __init__.py
  feature-name.py        # FastAPI router with endpoints
  model.py               # SQLAlchemy model
  schemas.py             # Pydantic request/response schemas
```

### Server test pattern
Tests use an in-memory SQLite database via the `db_session` and `client` fixtures in `server/tests/conftest.py`. The `APP_ENV=test` env var loads `.test.env`.

### Environment files
- `.dev.env` — local development (copied from `.example.dev.env`)
- `.test.env` — test suite
- `.prod.env` — production
- `.e2e.env` — e2e test configuration

### Key env vars
- `DATABASE_URL` — SQLAlchemy connection string
- `VITE_API_URL` — API base URL for the client
- `FIX_TOKEN` — Fixed login token
- `ALLOWED_ORIGINS` — CORS origins (defaults to localhost:5173)
- `APP_ENV` — Environment selector (`test` for test suite)

### Key dependencies
- **Server**: FastAPI, SQLAlchemy 2.0, Alembic, python-dotenv, httpx
- **Client**: React 19, Zustand, CodeMirror 6 (with vim mode), marked (Markdown), lucide-react (icons), SASS
- **Client dev**: Vite 8, Vitest, Storybook 10, oxlint, Electron 40, TypeScript 6
