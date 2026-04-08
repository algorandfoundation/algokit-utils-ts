#!/bin/bash

# verify-all.sh - Run all algod_client examples and verify they work
# Exit with non-zero code if any example fails

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Array of example files in order
EXAMPLES=(
    "01-node-health-status.ts"
    "02-version-genesis.ts"
    "03-ledger-supply.ts"
    "04-account-info.ts"
    "05-transaction-params.ts"
    "06-send-transaction.ts"
    "07-pending-transactions.ts"
    "08-block-data.ts"
    "09-asset-info.ts"
    "10-application-info.ts"
    "11-application-boxes.ts"
    "12-teal-compile.ts"
    "13-simulation.ts"
    "14-state-deltas.ts"
    "15-transaction-proof.ts"
    "16-lightblock-proof.ts"
    "17-state-proof.ts"
    "18-devmode-timestamp.ts"
    "19-sync-round.ts"
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

    if [ ! -f "$example" ]; then
        echo -e "${RED}FAILED${NC} (file not found)"
        FAILED=$((FAILED + 1))
        FAILED_EXAMPLES+=("$example")
        continue
    fi

    # Run the example and capture output/exit code
    if OUTPUT=$(pnpm run example "$example" 2>&1); then
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
echo -e "${GREEN}All Algod Client examples passed!${NC}"
exit 0
