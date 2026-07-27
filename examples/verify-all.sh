#!/bin/bash

# verify-all.sh - Run all example verification scripts
# Exit with non-zero code if any example suite fails

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Example suites to run
SUITES=(
    "abi"
    "algod_client"
    "algorand_client"
    "common"
    "indexer_client"
    "kmd_client"
    "signing"
    "testing"
    "transact"
)

echo "========================================"
echo "Examples Verification Suite"
echo "========================================"
echo ""

PASSED=0
FAILED=0
FAILED_SUITES=()

for suite in "${SUITES[@]}"; do
    echo "----------------------------------------"
    echo "Running $suite examples..."
    echo "----------------------------------------"

    if [ ! -d "$suite" ]; then
        echo -e "${RED}FAILED${NC} (directory not found)"
        FAILED=$((FAILED + 1))
        FAILED_SUITES+=("$suite")
        continue
    fi

    if [ ! -f "$suite/verify-all.sh" ]; then
        echo -e "${RED}FAILED${NC} (verify-all.sh not found)"
        FAILED=$((FAILED + 1))
        FAILED_SUITES+=("$suite")
        continue
    fi

    if (cd "$suite" && ./verify-all.sh); then
        PASSED=$((PASSED + 1))
    else
        FAILED=$((FAILED + 1))
        FAILED_SUITES+=("$suite")
    fi

    echo ""
done

echo "========================================"
echo "Overall Results: ${PASSED} suites passed, ${FAILED} suites failed"
echo "========================================"

if [ $FAILED -gt 0 ]; then
    echo ""
    echo -e "${RED}Failed suites:${NC}"
    for failed in "${FAILED_SUITES[@]}"; do
        echo "  - $failed"
    done
    exit 1
fi

echo ""
echo -e "${GREEN}All example suites passed!${NC}"
exit 0
