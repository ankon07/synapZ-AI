#!/bin/bash

# SynapZ AI - Database Restore Script

set -e

if [ -z "$1" ]; then
    echo "Usage: ./restore.sh <backup_file.sql.gz>"
    echo ""
    echo "Available backups:"
    ls -1 ./backups/*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE=$1

echo "🔄 Restoring database from ${BACKUP_FILE}..."

# Decompress and restore
gunzip -c "$BACKUP_FILE" | docker compose exec -T postgres psql -U synapz synapz_db

echo "✅ Database restored successfully!"
