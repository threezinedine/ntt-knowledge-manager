#!/usr/bin/env sh
set -eu

MODE=${1:-dev}

case "$MODE" in
dev | prod)
    shift || true
    ;;
*)
    echo "Usage: ./run-e2e.sh [dev|prod] [Playwright arguments...]" >&2
    exit 2
    ;;
esac

cd e2e
npm run "test:$MODE" -- "$@"