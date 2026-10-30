#!/usr/bin/env bash
# Runs after Claude edits a file: quick typecheck + lint once the app exists.
# Never blocks the session; prints problems so Claude sees and fixes them.
[ -f package.json ] || exit 0
[ -d node_modules ] || exit 0
out=$(npx --no-install tsc --noEmit 2>&1 | tail -20)
[ -n "$out" ] && echo "Typecheck issues:" && echo "$out"
npm run -s lint --if-present 2>&1 | tail -20
exit 0
