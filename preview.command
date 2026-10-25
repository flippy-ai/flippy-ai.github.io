#!/bin/bash
# FlippyAI website preview — double-click me.
# Serves the folder over HTTP (so fonts/JS behave like a real site) and opens it.

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=47999

echo "=================================================="
echo " FlippyAI website preview"
echo "=================================================="
echo
echo " folder : $DIR"
echo " serving: http://127.0.0.1:$PORT"
echo
echo " Press Ctrl-C in this window to stop the server."
echo

# open the browser once the server is actually listening
(
  for i in $(seq 1 20); do
    if curl -fsS --max-time 1 "http://127.0.0.1:$PORT/" >/dev/null 2>&1; then
      open "http://127.0.0.1:$PORT/"
      break
    fi
    sleep 0.4
  done
) &

cd "$DIR" && exec python3 -m http.server "$PORT" --bind 127.0.0.1
