#!/bin/sh
set -eu

mkdir -p /test-results/client
cd /app/client
npm install
sh /scripts/gen-client-report.sh

while true; do
    TRIGGERED=false

    if [ -f /test-results/client/.trigger ]; then
        rm -f /test-results/client/.trigger
        TRIGGERED=true
    fi

    if find src -newer /test-results/client/report.html \( -name '*.ts' -o -name '*.tsx' \) 2>/dev/null | grep -q .; then
        TRIGGERED=true
    fi

    if [ "$TRIGGERED" = true ]; then
        sh /scripts/gen-client-report.sh
    fi

    sleep 2
done
