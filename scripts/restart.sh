#!/usr/bin/env bash
# Kill whatever holds the dev port(s), then restart the site.
# Next.js serves the client, server and the API route (app/api/contact)
# from one process, so a single `next dev` restarts everything.
cd "$(dirname "$0")/.." || exit 1

PORTS="${PORTS:-3000}"

for port in $PORTS; do
  pids=$(lsof -ti tcp:"$port" -sTCP:LISTEN 2>/dev/null)
  if [ -n "$pids" ]; then
    echo "Stopping process(es) on port $port: $pids"
    kill $pids 2>/dev/null
    sleep 1
    pids=$(lsof -ti tcp:"$port" -sTCP:LISTEN 2>/dev/null)
    [ -n "$pids" ] && kill -9 $pids 2>/dev/null
  fi
done

echo "Starting site on port ${PORTS%% *}..."
exec npm run dev -- -p "${PORTS%% *}"
