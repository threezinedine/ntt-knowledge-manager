FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

FROM node:20-slim AS client-development

WORKDIR /app/client

COPY client/package.json client/package-lock.json ./
RUN npm ci

COPY .dev.env /app/.env

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM node:20-slim AS client-build

WORKDIR /app/client

COPY client/package.json client/package-lock.json ./
RUN npm ci

COPY .prod.env /app/.env
COPY client ./
RUN npm run build:web

FROM base AS server-development

COPY .dev.env ./.env

EXPOSE 8000

CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

FROM base AS server-production

COPY .prod.env ./.env
COPY server ./server
COPY --from=client-build /app/client/dist ./server/static

EXPOSE 8000

CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000"]