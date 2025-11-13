# Asset Opt-In Single Asset

This example demonstrates how to opt a single account into an asset using the `bulkOptIn` method. While the method name includes "bulk", it works perfectly for opting into a single asset as well.

## What This Example Shows

This example teaches you how to:
- Use the `algorand.asset.bulkOptIn()` method to opt into a single asset
- Verify account state before and after asset opt-in
- Check how many assets an account has opted into using `totalAssetsOptedIn`
- Understand that opt-in is required before an account can hold any ASA

## Why This Matters

Understanding single asset opt-in is important because:

1. **Bulk Operations**: The `bulkOptIn` method can handle both single and multiple assets efficiently
2. **State Verification**: You can verify opt-in success by checking account information
3. **Minimum Balance Impact**: Each opt-in increases the account's minimum ALGO balance requirement
4. **Asset Management**: Essential for applications that need to manage asset holdings

Common use cases:
- **DApp Onboarding**: Automatically opt users into required tokens
- **Asset Management**: Prepare accounts to receive specific assets
- **Multi-Asset Applications**: Opt into multiple tokens in a single transaction
- **State Tracking**: Monitor which assets an account has opted into

The `bulkOptIn` method is preferred over individual `assetOptIn` calls because:
- It can handle single or multiple assets with the same API
- More efficient when opting into multiple assets
- Consistent interface across your application
- Built-in validity window support

## How It Works

The example demonstrates the complete opt-in flow:

### 1. Create a Test Asset
```typescript
const assetCreate = await algorand.send.assetCreate({
  sender: creator,
  total: 1000n,
  decimals: 0,
  assetName: 'Test Asset',
})
const assetId = BigInt(assetCreate.confirmation.assetIndex!)
```

### 2. Check Account State Before Opt-In
```typescript
const accountInfoBefore = await algorand.account.getInformation(account.addr)
console.log(`Account assets opted in before: ${accountInfoBefore.totalAssetsOptedIn}`)
// Output: 0
```

### 3. Opt Into the Asset
```typescript
await algorand.asset.bulkOptIn(account, [assetId], { validityWindow: 100 })
```

Even though it's called `bulkOptIn`, passing a single asset ID in the array works perfectly.

### 4. Verify the Opt-In
```typescript
const accountInfoAfter = await algorand.account.getInformation(account.addr)
console.log(`Account assets opted in after: ${accountInfoAfter.totalAssetsOptedIn}`)
// Output: 1
```

The `totalAssetsOptedIn` field increments from 0 to 1, confirming the opt-in was successful.

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
Creating test asset...
Asset created with ID: 1003
Account assets opted in before: 0

Opting account into asset 1003...
Successfully opted into asset 1003
Account assets opted in after: 1

✅ Asset opt-in successful!
```

## Key Takeaways

- Use `algorand.asset.bulkOptIn()` for both single and multiple asset opt-ins
- The method accepts an array of asset IDs, even if you're only opting into one asset
- You can verify opt-in success by checking `totalAssetsOptedIn` in account information
- Each asset opt-in increases the account's minimum balance by 0.1 ALGO
- The `validityWindow` parameter controls how many rounds the transaction remains valid
- `bulkOptIn` is more efficient than multiple individual `assetOptIn` calls
- Account information is retrieved using `algorand.account.getInformation(address)`
- The opt-in transaction must be signed by the account that is opting in
