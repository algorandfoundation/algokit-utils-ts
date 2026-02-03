#!/bin/bash

# verify-all.sh - Run all AlgorandClient examples and verify they work
# Exit with non-zero code if any example fails

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Array of example files in order (01-15)
EXAMPLES=(
    "01-client-instantiation.ts"
    "02-algo-amount.ts"
    "03-signer-config.ts"
    "04-params-config.ts"
    "05-account-manager.ts"
    "06-send-payment.ts"
    "07-send-asset-ops.ts"
    "08-send-app-ops.ts"
    "09-create-transaction.ts"
    "10-transaction-composer.ts"
    "11-asset-manager.ts"
    "12-app-manager.ts"
    "13-app-deployer.ts"
    "14-client-manager.ts"
    "15-error-transformers.ts"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "AlgorandClient Examples Verification Script"
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
    if OUTPUT=$(npm run example -- "$example" 2>&1); then
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
echo -e "${GREEN}All AlgorandClient examples passed!${NC}"
exit 0
