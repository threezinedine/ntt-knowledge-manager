#!/bin/sh
set -eu
umask 0000

mkdir -p /test-results/server
python /scripts/gen-report.py server

while true; do
    TRIGGERED=false

    if [ -f /test-results/server/.trigger ]; then
        rm -f /test-results/server/.trigger
        TRIGGERED=true
    fi

    if find server -newer /test-results/server/report.html -name '*.py' 2>/dev/null | grep -q .; then
        TRIGGERED=true
    fi

    if [ "$TRIGGERED" = true ]; then
        python /scripts/gen-report.py server
    fi

    sleep 2
done
