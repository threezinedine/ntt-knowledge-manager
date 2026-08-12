import html
import os
import re
import subprocess
import sys
from datetime import datetime, timezone, timedelta

ANSI_RE = re.compile(r"\x1b\[[0-9;]*[a-zA-Z]")

TEMPLATE = """<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
body{{font-family:monospace;background:#0d1117;color:#e6edf3;padding:16px}}
.s{{font-size:1.5rem;font-weight:bold;color:{color};margin-bottom:4px}}
.t{{color:#8b949e;font-size:.85rem;margin-bottom:16px}}
.summary{{color:#a0c4ff;margin-bottom:12px}}
.pass{{color:#4ade80}}.fail{{color:#ef4444}}
ul{{list-style:none;padding:0;margin:0}}
li{{padding:2px 0}}
li.ok::before{{content:"\\2713 ";color:#4ade80}}
li.ko::before{{content:"\\2717 ";color:#ef4444}}
</style></head><body>
<div class="s">{status_icon} {title}: {status}</div>
<div class="t">Last run: {timestamp}</div>
<div class="summary">{summary}</div>
<ul>{items}</ul>
</body></html>"""


def parse_pytest(raw: str):
    lines = raw.strip().splitlines()
    tests = []
    for line in lines:
        m = re.match(r"(.+?)\s+(PASSED|FAILED)\s+\[", line)
        if m:
            name = m.group(1).strip()
            if "::" in name:
                name = name.split("::")[-1]
            tests.append((m.group(2) == "PASSED", name))

    passed = sum(1 for ok, _ in tests if ok)
    failed = sum(1 for ok, _ in tests if not ok)

    summary_line = ""
    for line in reversed(lines):
        if re.search(r"\d+ passed", line) or re.search(r"\d+ failed", line):
            summary_line = line.strip()
            break

    return passed, failed, tests, summary_line


def parse_vitest(raw: str):
    tests = []
    for line in raw.splitlines():
        m = re.match(r"\s*([✓✗×])\s+(.+?)(?:\s+\(\d+\s+test)", line)
        if m:
            ok = m.group(1) == "✓"
            tests.append((ok, m.group(2).strip()))

    summary_line = ""
    for line in raw.splitlines():
        if "Tests" in line and ("passed" in line or "failed" in line):
            summary_line = re.sub(r"\s+", " ", line).strip()
            break

    passed = sum(1 for ok, _ in tests if ok)
    failed = sum(1 for ok, _ in tests if not ok)
    return passed, failed, tests, summary_line


def parse_playwright(raw: str):
    tests = []
    for line in raw.splitlines():
        m = re.match(r"\s*[✓✗×·]\s+\d+\s+(.+?)(?:\s+\(\d+)", line)
        if not m:
            m = re.match(r"\s*[✓✗×·]\s+\d+\s+(.+)", line)
        if m:
            ok = "✓" in line or "·" in line
            tests.append((ok, m.group(1).strip()))

    summary_line = ""
    for line in raw.splitlines():
        if re.search(r"\d+ (passed|failed)", line):
            summary_line = re.sub(r"\s+", " ", line).strip()
            break

    passed = sum(1 for ok, _ in tests if ok)
    failed = sum(1 for ok, _ in tests if not ok)
    return passed, failed, tests, summary_line


CONFIGS = {
    "server": {
        "title": "Server Tests",
        "cmd": ["python", "-m", "pytest", "server/tests", "--tb=no", "-v"],
        "parser": parse_pytest,
    },
    "client": {
        "title": "Client Tests",
        "cmd": ["npx", "vitest", "run"],
        "cwd": "/app/client",
        "parser": parse_vitest,
    },
    "e2e": {
        "title": "E2E Tests",
        "cmd": ["npx", "playwright", "test", "--config=playwright.dev.config.ts"],
        "cwd": "/app/e2e",
        "parser": parse_playwright,
    },
}


def run(suite: str):
    cfg = CONFIGS[suite]
    report = f"/test-results/{suite}/report.html"
    os.makedirs(os.path.dirname(report), exist_ok=True)

    result = subprocess.run(
        cfg["cmd"],
        capture_output=True,
        text=True,
        cwd=cfg.get("cwd"),
        env={**os.environ, "FORCE_COLOR": "0", "NO_COLOR": "1"},
    )

    raw = ANSI_RE.sub("", result.stdout + result.stderr)
    passed, failed, tests, summary_line = cfg["parser"](raw)
    total = passed + failed

    if failed > 0:
        status, color, icon = "FAILED", "#ef4444", "&#x2717;"
    elif passed > 0:
        status, color, icon = "PASSED", "#4ade80", "&#x2713;"
    else:
        status, color, icon = "ERROR", "#f59e0b", "&#x26A0;"

    summary = f"{passed}/{total} passed"
    if failed:
        summary += f", {failed} failed"

    items = ""
    for ok, name in tests:
        cls = "ok" if ok else "ko"
        items += f'<li class="{cls}">{html.escape(name)}</li>\n'

    with open(report, "w") as f:
        f.write(
            TEMPLATE.format(
                title=cfg["title"],
                status=status,
                status_icon=icon,
                color=color,
                timestamp=datetime.now(timezone(timedelta(hours=7))).strftime("%Y-%m-%d %H:%M:%S GMT+7"),
                summary=summary,
                items=items,
            )
        )


if __name__ == "__main__":
    run(sys.argv[1])
