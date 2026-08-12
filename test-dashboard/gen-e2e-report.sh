#!/bin/sh
REPORT=/test-results/e2e/report.html
mkdir -p /test-results/e2e
cd /app/e2e

RAW=$(NO_COLOR=1 FORCE_COLOR=0 npx playwright test --config=playwright.docker.config.ts 2>&1) || true
TIMESTAMP=$(TZ=Asia/Ho_Chi_Minh date '+%Y-%m-%d %H:%M:%S GMT+7')

node -e "
var fs = require('fs');
var raw = process.argv[1];
var timestamp = process.argv[2];
var report = process.argv[3];

var lines = raw.split('\n');
var tests = [];
lines.forEach(function(l) {
  var m = l.match(/^\s*[✓✗×·]\s+\d+\s+(.+?)(?:\s+\(\d+|$)/);
  if (m) {
    var ok = l.indexOf('✓') !== -1 || l.indexOf('·') !== -1;
    tests.push({ ok: ok, name: m[1].trim() });
  }
});

var passed = tests.filter(function(t) { return t.ok; }).length;
var failed = tests.filter(function(t) { return !t.ok; }).length;
var total = passed + failed;

var status, color, icon;
if (failed > 0) { status = 'FAILED'; color = '#ef4444'; icon = '&#x2717;'; }
else if (passed > 0) { status = 'PASSED'; color = '#4ade80'; icon = '&#x2713;'; }
else { status = 'ERROR'; color = '#f59e0b'; icon = '&#x26A0;'; }

var esc = function(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
var items = tests.map(function(t) {
  return '<li class=\"' + (t.ok ? 'ok' : 'ko') + '\">' + esc(t.name) + '</li>';
}).join('\n');

var html = '<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><style>' +
  'body{font-family:monospace;background:#0d1117;color:#e6edf3;padding:16px}' +
  '.s{font-size:1.5rem;font-weight:bold;color:' + color + ';margin-bottom:4px}' +
  '.t{color:#8b949e;font-size:.85rem;margin-bottom:16px}' +
  '.summary{color:#a0c4ff;margin-bottom:12px}' +
  'ul{list-style:none;padding:0;margin:0}li{padding:2px 0}' +
  'li.ok::before{content:\"\\\\2713 \";color:#4ade80}' +
  'li.ko::before{content:\"\\\\2717 \";color:#ef4444}' +
  '</style></head><body>' +
  '<div class=\"s\">' + icon + ' E2E Tests: ' + status + '</div>' +
  '<div class=\"t\">Last run: ' + timestamp + '</div>' +
  '<div class=\"summary\">' + passed + '/' + total + ' passed' + (failed ? ', ' + failed + ' failed' : '') + '</div>' +
  '<ul>' + items + '</ul></body></html>';

fs.writeFileSync(report, html);
" "$RAW" "$TIMESTAMP" "$REPORT"
