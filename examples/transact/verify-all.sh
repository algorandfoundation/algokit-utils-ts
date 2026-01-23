#!/bin/bash

# verify-all.sh - Run all transact examples and verify they work
# Exit with non-zero code if any example fails

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Array of example directories in order
EXAMPLES=(
    "01-payment-transaction"
    "02-payment-close"
    "03-asset-create"
    "04-asset-transfer"
    "05-asset-freeze"
    "06-asset-clawback"
    "07-atomic-group"
    "08-atomic-swap"
    "09-single-sig"
    "10-multisig"
    "11-logic-sig"
    "12-fee-calculation"
    "13-encoding-decoding"
    "14-app-call"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "Transact Examples Verification Script"
echo "========================================"
echo ""

PASSED=0
FAILED=0
FAILED_EXAMPLES=()

for example in "${EXAMPLES[@]}"; do
    echo -n "Running $example... "

    if [ ! -d "$example" ]; then
        echo -e "${RED}FAILED${NC} (directory not found)"
        FAILED=$((FAILED + 1))
        FAILED_EXAMPLES+=("$example")
        continue
    fi

    if [ ! -f "$example/index.ts" ]; then
        echo -e "${RED}FAILED${NC} (index.ts not found)"
        FAILED=$((FAILED + 1))
        FAILED_EXAMPLES+=("$example")
        continue
    fi

    # Run the example and capture output/exit code
    if npx tsx "$example/index.ts" > /dev/null 2>&1; then
        echo -e "${GREEN}PASSED${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}FAILED${NC}"
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
