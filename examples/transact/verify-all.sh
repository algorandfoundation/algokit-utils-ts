#!/bin/bash

# Verification script for all transact examples
# Runs each example (01-14) and reports success/failure

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
PASSED=0
FAILED=0
FAILED_EXAMPLES=()

# Examples to run in order
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

echo ""
echo "========================================"
echo "  Running All Transaction Examples"
echo "========================================"
echo ""

for example in "${EXAMPLES[@]}"; do
  echo -n "Running $example... "

  if [ -f "$example/index.ts" ]; then
    if npx tsx "$example/index.ts" > /dev/null 2>&1; then
      echo -e "${GREEN}PASSED${NC}"
      ((PASSED++))
    else
      echo -e "${RED}FAILED${NC}"
      ((FAILED++))
      FAILED_EXAMPLES+=("$example")
    fi
  else
    echo -e "${YELLOW}SKIPPED (no index.ts)${NC}"
  fi
done

echo ""
echo "========================================"
echo "  Summary"
echo "========================================"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"

if [ $FAILED -gt 0 ]; then
  echo ""
  echo "Failed examples:"
  for ex in "${FAILED_EXAMPLES[@]}"; do
    echo -e "  - ${RED}$ex${NC}"
  done
  echo ""
  exit 1
fi

echo ""
echo -e "${GREEN}All examples passed!${NC}"
echo ""
exit 0
