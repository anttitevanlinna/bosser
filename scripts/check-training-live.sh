#!/usr/bin/env bash
# Live check of bosser.consulting/training/ (moved from agents102.bosser.consulting).
# Article pages fetch raw markdown, so content/*.md must come back as markdown, not Jekyll HTML.
set -u
cd "$(dirname "$0")/.."
B=https://bosser.consulting/training
fail=0
ok() { printf 'ok   %s\n' "$1"; }
no() { printf 'FAIL %s\n' "$1"; fail=1; }
for p in / article.html check/ readiness/ curriculum/ privacy.html wardley-saas.html; do
  [ "$(curl -s -o /dev/null -w '%{http_code}' "$B/${p#/}")" = 200 ] && ok "$p" || no "$p"
done
for f in docs/training/content/*.md; do
  u="$B/content/$(basename "$f")"
  head -1 <(curl -s "$u") | grep -q '^---$' && ok "raw md $(basename "$f")" || no "raw md $(basename "$f") (served as HTML/404: Jekyll?)"
done
exit $fail
