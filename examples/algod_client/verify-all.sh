#!/bin/bash

# verify-all.sh - Run all algod_client examples and verify they work
# Exit with non-zero code if any example fails

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Array of example directories in order
EXAMPLES=(
    "01-node-health-status"
    "02-version-genesis"
    "03-ledger-supply"
    "04-account-info"
    "05-transaction-params"
    "06-send-transaction"
    "07-pending-transactions"
    "08-block-data"
    "09-asset-info"
    "10-application-info"
    "11-application-boxes"
    "12-teal-compile"
    "13-simulation"
    "14-state-deltas"
    "15-transaction-proof"
    "16-lightblock-proof"
    "17-state-proof"
    "18-devmode-timestamp"
    "19-sync-round"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "Algod Client Examples Verification Script"
echo "========================================"
echo ""

PASSED=0
FAILED=0
FAILED_EXAMPLES=()

for example in "${EXAMPLES[@]}"; do
    echo -n "Running $example... "

    if [ ! -f "$example.ts" ]; then
        echo -e "${RED}FAILED${NC} ($example.ts not found)"
        FAILED=$((FAILED + 1))
        FAILED_EXAMPLES+=("$example")
        continue
    fi

    # Run the example and capture output/exit code
    if OUTPUT=$(npx tsx "$example.ts" 2>&1); then
        echo -e "${GREEN}PASSED${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}FAILED${NC}"
        echo "$OUTPUT"
        FAILED=$((FAILED + 1))
        FAILED_EXAMPLES+=("$example")
    fi
done

echo ""
echo "========================================"
echo "Results: ${PASSED} passed, ${FAILED} failed"
echo "========================================"

if [ $FAILED -gt 0 ]; then
    echo ""
    echo -e "${RED}Failed examples:${NC}"
    for failed in "${FAILED_EXAMPLES[@]}"; do
        echo "  - $failed"
    done
    exit 1
fi

echo ""
echo -e "${GREEN}All examples passed!${NC}"
exit 0
