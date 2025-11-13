# Asset Opt-Out Error Handling

This example demonstrates **error handling for asset opt-out operations**. It shows how AlgoKit Utils validates opt-out requests and provides clear error messages when operations fail.

## Overview

This example covers two common error scenarios:
1. **Attempting to opt out of assets not opted into**
2. **Attempting to opt out of assets with non-zero balances**

### Why This Matters

- **Prevents wasted transaction fees**: Validation happens before submission
- **Clear error messages**: Know exactly why operations fail
- **Atomic operations**: Bulk operations validate all assets together

## Example 89 Complete ✅

Successfully fixed and tested. The example demonstrates proper error handling patterns for asset opt-out operations.

### Changes Made:
1. Removed unused `Account` import from algosdk
2. Fixed dispenser call to use `localNetDispenser()` directly
3. Changed `bulkOptIn/bulkOptOut` calls from passing `account.addr` to passing `account` object

### Key Patterns Demonstrated:
- Error handling with try-catch
- Validation of opt-in status
- Validation of zero balance requirement
- Atomic bulk operations

## Learn More

- [Algorand ASA Documentation](https://developer.algorand.org/docs/get-details/asa/)
- [AlgoKit Utils TypeScript Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
