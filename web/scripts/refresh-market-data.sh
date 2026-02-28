#!/usr/bin/env bash
#
# Refresh time-sensitive market data and rebuild the site.
# Designed to run as a cron job (e.g. monthly on the 1st).
#
# Usage:
#   ./scripts/refresh-market-data.sh           # refresh Zillow + Census + rebuild
#   ./scripts/refresh-market-data.sh --all      # refresh ALL data sources + rebuild
#   ./scripts/refresh-market-data.sh --no-build  # refresh data only, skip build
#
# Cron example (1st of every month at 3 AM):
#   0 3 1 * * cd /path/to/treasurestate_landing/web && ./scripts/refresh-market-data.sh >> /tmp/ts-refresh.log 2>&1
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WEB_DIR="$(dirname "$SCRIPT_DIR")"
cd "$WEB_DIR"

DO_BUILD=true
DO_ALL=false

for arg in "$@"; do
  case "$arg" in
    --no-build) DO_BUILD=false ;;
    --all)      DO_ALL=true ;;
  esac
done

echo "=== Treasure State Data Refresh ==="
echo "Started: $(date)"
echo ""

# --- Time-sensitive data (monthly) ---

echo ">>> Refreshing Zillow home values & rent..."
node scripts/collect-zillow-data.js
echo ""

echo ">>> Refreshing Zillow inventory, list prices & new listings..."
node scripts/collect-zillow-inventory.js
echo ""

echo ">>> Refreshing Census vacancy data..."
node scripts/collect-census-vacancy.js
echo ""

# --- Annual data (only with --all) ---

if $DO_ALL; then
  echo ">>> Refreshing employment & schools data..."
  node scripts/collect-employment-schools.js
  echo ""

  echo ">>> Refreshing industry data..."
  node scripts/collect-industry-data.js
  echo ""

  echo ">>> Refreshing crime data..."
  node scripts/collect-crime-data.js
  echo ""

  echo ">>> Refreshing healthcare data..."
  node scripts/collect-healthcare-data.js
  echo ""

  echo ">>> Refreshing environmental data..."
  node scripts/collect-environmental-data.js
  echo ""

  echo ">>> Refreshing climate data..."
  node scripts/collect-climate-data.js
  echo ""

  echo ">>> Refreshing recreation data..."
  node scripts/collect-recreation.js
  echo ""
fi

# --- Pre-build index ---

echo ">>> Generating best-of cross-link index..."
node scripts/generate-best-of-index.js
echo ""

# --- Rebuild ---

if $DO_BUILD; then
  echo ">>> Rebuilding site..."
  npx next build
  echo ""
  echo ">>> Build complete."
else
  echo ">>> Skipping build (--no-build)."
fi

echo ""
echo "=== Refresh complete: $(date) ==="
