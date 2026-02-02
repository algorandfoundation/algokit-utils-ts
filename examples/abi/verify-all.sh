#!/bin/bash

# verify-all.sh - Run all ABI examples and verify they work
# Exit with non-zero code if any example fails

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Array of example files in order
EXAMPLES=(
    "01-type-parsing.ts"
    "02-primitive-types.ts"
    "03-address-type.ts"
    "04-string-type.ts"
    "05-static-array.ts"
    "06-dynamic-array.ts"
    "07-tuple-type.ts"
    "08-struct-type.ts"
    "09-struct-tuple-conversion.ts"
    "10-bool-packing.ts"
    "11-abi-method.ts"
    "12-avm-types.ts"
    "13-type-guards.ts"
    "14-complex-nested.ts"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "ABI Examples Verification Script"
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
    if OUTPUT=$(npx tsx --tsconfig ../tsconfig.run.json "$example" 2>&1); then
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
echo -e "${GREEN}All ABI examples passed!${NC}"
exit 0
