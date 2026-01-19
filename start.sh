#!/bin/sh

# Attempt to restore database from R2 (non-fatal if it fails)
echo "Attempting to restore database from backup..."
if litestream restore -if-replica-exists -config /etc/litestream.yml /data/database.db; then
    echo "Database restore completed (or no backup existed)"
else
    echo "Warning: Database restore failed, starting with fresh database"
fi

# Try to run with Litestream replication, fall back to running without it
echo "Starting app with Litestream replication..."
litestream replicate -exec "node ./dist/server/entry.mjs" -config /etc/litestream.yml || {
    echo "Warning: Litestream failed, running app without replication"
    exec node ./dist/server/entry.mjs
}
