# ASA Transfer Error Handling

This example demonstrates how to properly handle common errors when transferring Algorand Standard Assets (ASAs), helping you build robust asset applications with comprehensive error handling.

## What This Example Shows

This example teaches you how to:
- Handle errors when transferring to a receiver that hasn't opted into an asset
- Handle errors when transferring from a sender without asset balance
- Handle errors when attempting to transfer non-existent assets
- Use try-catch blocks for graceful error handling in asset operations

## Why This Matters

Proper error handling for ASA transfers is crucial because:

1. **User Experience**: Graceful error messages help users understand what went wrong
2. **Security**: Prevents transaction failures that could leave funds in inconsistent states
3. **Debugging**: Clear error handling makes development and troubleshooting easier
4. **Production Readiness**: Robust error handling is essential for production applications

Common scenarios where these errors occur:
- **Receiver not opted in**: User tries to send assets to someone who hasn't accepted that asset type
- **Sender insufficient balance**: Attempting to transfer more assets than owned
- **Invalid asset ID**: Referencing assets that don't exist or have been deleted

Understanding these error patterns helps you:
- Implement proper validation before transactions
- Provide helpful error messages to users
- Build recovery flows for failed transactions

## How It Works

The example demonstrates three error scenarios:

### 1. Receiver Not Opted In
```typescript
await algorand.send.assetTransfer({
  sender: creator,
  receiver: notOptedInAccount.addr,
  assetId: assetId,
  amount: 1n,
})
// Throws: "receiver error: must optin"
```

### 2. Sender Without Asset Balance
```typescript
await algorand.send.assetTransfer({
  sender: accountWithoutAsset,
  receiver: optedInAccount.addr,
  assetId: assetId,
  amount: 1n,
})
// Throws: "balance 0 below min 1" or "underflow on subtracting"
```

### 3. Non-Existent Asset
```typescript
await algorand.send.assetTransfer({
  sender: account,
  receiver: otherAccount.addr,
  assetId: 999999n, // doesn't exist
  amount: 1n,
})
// Throws: "asset 999999 missing from"
```

## Prerequisites

- AlgoKit installed
- Docker installed (for LocalNet)
- Node.js and npm

## Running the Example

1. Start LocalNet:
   ```bash
   algokit localnet start
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the example:
   ```bash
   npm start
   ```

## Expected Output

```
=== ASA Transfer Error Handling Examples ===

Creating test asset...
✓ Asset created with ID: [asset-id]

--- Example 1: Transfer to Non-Opted-In Receiver ---
Receiver account created: [address]
✓ Error caught as expected: URLTokenBaseHTTPError
✓ Error message: [error details]
✓ Confirmed: Receiver must opt-in before receiving assets

--- Example 2: Transfer from Non-Opted-In Sender ---
Sender account created: [address]
✓ Receiver opted into asset [asset-id]
✓ Error caught as expected: URLTokenBaseHTTPError
✓ Error message: [error details]
✓ Confirmed: Sender must have the asset balance to transfer

--- Example 3: Transfer Non-Existent Asset ---
Sender and receiver accounts created and funded
✓ Error caught as expected: URLTokenBaseHTTPError
✓ Error message: [error details]
✓ Confirmed: Cannot transfer non-existent assets

✓ All error handling examples completed successfully!
```

## Key Takeaways

- Always check if both sender and receiver are opted into the asset before transferring
- Use try-catch blocks to handle `URLTokenBaseHTTPError` exceptions from asset transfers
- Check error messages for specific patterns like "must optin", "balance", or "missing from"
- Implement validation logic in your application to prevent these errors before submitting transactions
- The receiver must explicitly opt-in to an asset before they can receive it (this is a security feature)
- Asset creators are automatically opted in when they create the asset
