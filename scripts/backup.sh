#!/bin/bash

# SynapZ AI - Database Backup Script

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="synapz_backup_${TIMESTAMP}.sql"

echo "📦 Creating backup..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup PostgreSQL database
docker compose exec -T postgres pg_dump -U synapz synapz_db > "${BACKUP_DIR}/${BACKUP_FILE}"

# Compress backup
gzip "${BACKUP_DIR}/${BACKUP_FILE}"

echo "✅ Backup created: ${BACKUP_DIR}/${BACKUP_FILE}.gz"

# Keep only last 7 backups
find "$BACKUP_DIR" -name "synapz_backup_*.sql.gz" -mtime +7 -delete

echo "🧹 Cleaned old backups (kept last 7 days)"
