from typing import Any
import http.server
import json
import os
import urllib.parse

DASHBOARD_DIR = os.path.dirname(os.path.abspath(__file__))
RESULTS_DIR = "/test-results"
SUITES = ("server", "client", "e2e")

PLACEHOLDER = b"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
body{font-family:monospace;background:#0d1117;color:#8b949e;padding:16px;
display:flex;align-items:center;justify-content:center;height:80vh}
</style></head><body>
<div>Waiting for first test run...</div>
</body></html>"""


class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = urllib.parse.unquote(parsed.path)

        if path == "/api/mtimes":
            self._handle_mtimes()
            return

        if path.startswith("/results/"):
            file_path = os.path.join(RESULTS_DIR, path[len("/results/") :])
        elif path == "/" or path == "":
            file_path = os.path.join(DASHBOARD_DIR, "index.html")
        else:
            file_path = os.path.join(DASHBOARD_DIR, path.lstrip("/"))

        file_path = os.path.realpath(file_path)
        is_result = path.startswith("/results/")

        if not os.path.isfile(file_path):
            if is_result and path.endswith(".html"):
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.end_headers()
                self.wfile.write(PLACEHOLDER)
                return
            self.send_error(404)
            return

        self.send_response(200)
        if file_path.endswith(".html"):
            self.send_header("Content-Type", "text/html; charset=utf-8")
        elif file_path.endswith(".css"):
            self.send_header("Content-Type", "text/css")
        elif file_path.endswith(".js"):
            self.send_header("Content-Type", "application/javascript")
        else:
            self.send_header("Content-Type", "application/octet-stream")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.end_headers()

        with open(file_path, "rb") as f:
            self.wfile.write(f.read())

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = urllib.parse.unquote(parsed.path)

        if path == "/api/trigger":
            self._handle_trigger()
            return

        self.send_error(404)

    def _handle_mtimes(self):
        mtimes = {}
        for suite in SUITES:
            report = os.path.join(RESULTS_DIR, suite, "report.html")
            try:
                mtimes[suite] = os.path.getmtime(report)
            except OSError:
                mtimes[suite] = 0

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(json.dumps(mtimes).encode())

    def _handle_trigger(self):
        for suite in SUITES:
            trigger = os.path.join(RESULTS_DIR, suite, ".trigger")
            os.makedirs(os.path.dirname(trigger), exist_ok=True)
            with open(trigger, "w") as f:
                f.write("run")

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"ok":true}')

    def log_message(self, format: str, *args: Any) -> None:
        pass


if __name__ == "__main__":
    server = http.server.HTTPServer(("0.0.0.0", 9090), Handler)
    print("Test dashboard running on http://0.0.0.0:9090")
    server.serve_forever()
