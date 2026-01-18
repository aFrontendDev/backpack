#!/bin/sh
set -e

# Restore database from R2 if it exists
litestream restore -if-replica-exists -config /etc/litestream.yml /data/database.db

# Run the app with Litestream replication
exec litestream replicate -exec "node ./dist/server/entry.mjs" -config /etc/litestream.yml
