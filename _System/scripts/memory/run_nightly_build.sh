#!/usr/bin/env bash
# Meru Nightly Build Automation (P1-S1-01, P1-S1-02, P1-S1-05)
set -euo pipefail

VAULT_ROOT="/Volumes/madara/2026/twc-vault"
LOG_DIR="$VAULT_ROOT/_System/memory/logs"
DATE_TAG=$(date +%Y-%m-%d)
BUILD_LOG="$LOG_DIR/build-$DATE_TAG.log"
VENV_PYTHON="$VAULT_ROOT/.venv-meru/bin/python3"
UPDATE_SCRIPT="$VAULT_ROOT/_System/scripts/memory/update_index.py"

mkdir -p "$LOG_DIR"

echo "[$(date)] --- STARTING MERU NIGHTLY BUILD ---" | tee -a "$BUILD_LOG"

# 1. Vault Integrity Check (P1-S1-07)
echo "[$(date)] Running vault integrity check..." | tee -a "$BUILD_LOG"
INTEGRITY_SCRIPT="$VAULT_ROOT/_System/scripts/validate_vault_integrity.py"
if python3 "$INTEGRITY_SCRIPT" >> "$BUILD_LOG" 2>&1; then
    echo "Integrity check PASSED." | tee -a "$BUILD_LOG"
else
    echo "WARNING: Vault integrity check found broken links. See build log for details." | tee -a "$BUILD_LOG"
    # We continue the build but log the warning
fi

# 2. Disk Space Check (P1-S1-05)
echo "[$(date)] Checking disk space on /Volumes/madara..." | tee -a "$BUILD_LOG"
AVAILABLE_GB=$(df -g /Volumes/madara | tail -1 | awk '{print $4}')
THRESHOLD_GB=10

if [ "$AVAILABLE_GB" -lt "$THRESHOLD_GB" ]; then
    echo "CRITICAL ERROR: Disk space on /Volumes/madara is low ($AVAILABLE_GB GB). Aborting build." | tee -a "$BUILD_LOG"
    exit 1
fi
echo "Disk space OK: $AVAILABLE_GB GB available." | tee -a "$BUILD_LOG"

# 2. Run Incremental Update (P1-S1-01)
echo "[$(date)] Running incremental index update..." | tee -a "$BUILD_LOG"
if "$VENV_PYTHON" "$UPDATE_SCRIPT" >> "$BUILD_LOG" 2>&1; then
    echo "[$(date)] Build SUCCESS." | tee -a "$BUILD_LOG"
else
    echo "[$(date)] Build FAILED. Check logs for details." | tee -a "$BUILD_LOG"
    exit 1
fi

# 3. Backup Index (P1-S1-10)
BACKUP_DIR="/Volumes/madara/2026/samskara/_backups/memory"
echo "[$(date)] Backing up index to $BACKUP_DIR..." | tee -a "$BUILD_LOG"
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/meru-index-$DATE_TAG.tar.gz" \
    -C "$VAULT_ROOT/_System" memory/vault.faiss memory/meta.json memory/embeddings.npy memory/index_stats.json memory/file_hashes.json
echo "Backup complete: meru-index-$DATE_TAG.tar.gz" | tee -a "$BUILD_LOG"

# 4. Stats Summary
STATS_FILE="$VAULT_ROOT/_System/memory/index_stats.json"
SUMMARY="Build Status Unknown"
if [ -f "$STATS_FILE" ]; then
    echo "Latest Index Stats:" | tee -a "$BUILD_LOG"
    cat "$STATS_FILE" | tee -a "$BUILD_LOG"
    SUMMARY=$(cat "$STATS_FILE" | jq -r '"Files: \(.file_count), Chunks: \(.chunk_count)"' || echo "Stats parse error")
fi

# 4. Notifications (P1-S1-06)
if [ -n "${MERU_WEBHOOK_URL:-}" ]; then
    echo "[$(date)] Sending notification..." | tee -a "$BUILD_LOG"
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"✅ *Meru Nightly Build Complete*\\n*Vault*: $DATE_TAG\\n*Stats*: $SUMMARY\\n*Log*: $BUILD_LOG\"}" \
        "$MERU_WEBHOOK_URL" >> "$BUILD_LOG" 2>&1
fi

echo "[$(date)] --- NIGHTLY BUILD COMPLETE ---" | tee -a "$BUILD_LOG"
