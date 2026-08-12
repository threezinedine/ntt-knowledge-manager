#!/bin/sh
set -eu

mkdir -p /test-results/e2e
cd /app/e2e
npm install
npx playwright install --with-deps chromium
sh /scripts/gen-e2e-report.sh

while true; do
    if [ -f /test-results/e2e/.trigger ]; then
        rm -f /test-results/e2e/.trigger
        sh /scripts/gen-e2e-report.sh
    fi
    sleep 2
done
