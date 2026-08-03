#!/usr/bin/env sh
set -eu

if [ -x .venv/bin/python ]; then
	PYTHON=.venv/bin/python
else
	PYTHON=python3
fi

if [ "${1:-}" = "--watch" ]; then
	shift
	if [ "$#" -gt 0 ]; then
		echo "--watch does not accept pytest arguments." >&2
		exit 2
	fi

	"$PYTHON" -m watchfiles --filter python './run-tests.sh' server
	exit $?
fi

"$PYTHON" -m pytest server/tests "$@"