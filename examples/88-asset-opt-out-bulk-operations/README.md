# Asset Opt-Out Bulk Operations

This example demonstrates how to **opt out of multiple assets** in bulk to free up minimum balance requirements. On Algorand, each asset opt-in increases an account's minimum balance by **0.1 ALGO**, so opting out when assets are no longer needed can free up locked funds.

## Overview

### Asset Opt-In and Minimum Balance

On Algorand:
- Each account has a **minimum balance requirement** (currently 0.1 ALGO base)
- **Each asset opt-in adds 0.1 ALGO** to the minimum balance
- **Each app opt-in adds 0.1 ALGO** to the minimum balance
- The minimum balance is **locked** and cannot be spent

### Asset Opt-Out Requirements

To opt out of an asset, the account must:
1. **Have zero balance** of that asset
2. **Not be the asset creator** (creator cannot opt out)
3. **Not be frozen** for that asset (if freeze is enabled)

### When to Use Bulk Opt-Out

- **Free up minimum balance**: Recover locked ALGO from unused assets
- **Account cleanup**: Remove assets no longer needed
- **Reduce transaction overhead**: Fewer assets = faster account lookups
- **Prepare for account closure**: Must opt out of all assets before closing account

## Code Walkthrough

### Step 1: Initialize and Create Accounts

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

// Create asset creator account
const creator = algorand.account.random()
await algorand.account.ensureFunded(creator, dispenser, (10).algos())

// Create account that will opt in/out
const account = algorand.account.random()
await algorand.account.ensureFunded(account, dispenser, (1).algos())
```

**Key Points**:
- Creator account creates the assets
- Test account will opt in/out of assets
- Both accounts need ALGO for transaction fees

### Step 2: Create Test Assets with Zero Balance

```typescript
console.log('Creating test assets...')
const assetCreate1 = await algorand.send.assetCreate({
  sender: creator.addr,
  total: 0n, // Zero total means no one will have any balance
  decimals: 0,
  assetName: 'Test Asset 1',
})
const assetId1 = BigInt(assetCreate1.confirmation.assetIndex!)

const assetCreate2 = await algorand.send.assetCreate({
  sender: creator.addr,
  total: 0n,
  decimals: 0,
  assetName: 'Test Asset 2',
})
const assetId2 = BigInt(assetCreate2.confirmation.assetIndex!)

const assetIds = [assetId1, assetId2]
console.log(`Created assets with IDs: ${assetId1}, ${assetId2}`)
```

**Why Zero Total**:
- Creating assets with `total: 0n` ensures no units exist
- This guarantees the test account will have zero balance
- Zero balance is required for opt-out

### Step 3: Check Account State Before Opt-In

```typescript
const accountInfoBefore = await algorand.account.getInformation(account.addr)
console.log(`Account assets opted in before: ${accountInfoBefore.totalAssetsOptedIn}`)
```

**Account Information**:
- `totalAssetsOptedIn`: Number of assets the account has opted into
- Initially 0 for new accounts

### Step 4: Bulk Opt-In

```typescript
console.log(`Opting into ${assetIds.length} assets...`)
await algorand.asset.bulkOptIn(account, assetIds, { validityWindow: 100 })

const accountInfoAfterOptIn = await algorand.account.getInformation(account.addr)
console.log(`Account assets opted in after opt-in: ${accountInfoAfterOptIn.totalAssetsOptedIn}`)
```

**What `bulkOptIn` Does**:
1. Creates an asset transfer transaction for each asset (with 0 amount)
2. Groups all transactions together
3. Submits as an atomic group
4. Each opt-in increases minimum balance by 0.1 ALGO

**Parameters**:
- `account`: The account opting in
- `assetIds`: Array of asset IDs to opt into
- `{ validityWindow: 100 }`: Transaction is valid for 100 rounds

### Step 5: Bulk Opt-Out

```typescript
console.log(`Opting out of ${assetIds.length} assets...`)
await algorand.asset.bulkOptOut(account, assetIds, { validityWindow: 100 })

const accountInfoAfterOptOut = await algorand.account.getInformation(account.addr)
console.log(`Account assets opted in after opt-out: ${accountInfoAfterOptOut.totalAssetsOptedIn}`)
```

**What `bulkOptOut` Does**:
1. Creates an asset transfer transaction for each asset
2. Sets `closeRemainderTo` to the asset creator (opts out)
3. Groups all transactions together
4. Submits as an atomic group
5. Each opt-out frees 0.1 ALGO from minimum balance

**Critical Requirement**: Account must have **zero balance** of each asset or the transaction will fail.

### Step 6: Verify Success

```typescript
if (accountInfoAfterOptOut.totalAssetsOptedIn === 0) {
  console.log('✅ Successfully freed up minimum balance by opting out!')
  console.log('The account no longer holds any asset opt-ins.')
  console.log('Each opt-out freed 0.1 ALGO from the minimum balance requirement.')
}
```

**Results**:
- `totalAssetsOptedIn` returns to 0
- Minimum balance reduced by 0.2 ALGO (2 assets × 0.1 ALGO each)

## API Patterns (AlgoKit Utils v9.1.2)

### Bulk Opt-In

```typescript
await algorand.asset.bulkOptIn(
  account: SigningAccount,
  assetIds: bigint[],
  options?: {
    validityWindow?: number,
    maxFee?: AlgoAmount,
    suppressLog?: boolean,
  }
)
```

**Returns**: Transaction result with group ID and individual transaction IDs

### Bulk Opt-Out

```typescript
await algorand.asset.bulkOptOut(
  account: SigningAccount,
  assetIds: bigint[],
  options?: {
    validityWindow?: number,
    maxFee?: AlgoAmount,
    suppressLog?: boolean,
  }
)
```

**Returns**: Transaction result with group ID and individual transaction IDs

### Get Account Information

```typescript
const info = await algorand.account.getInformation(address: string)
console.log(info.totalAssetsOptedIn) // Number of assets
console.log(info.minBalance)         // Minimum balance in microAlgos
console.log(info.amount)             // Current balance in microAlgos
```

### Single Asset Opt-In

For a single asset:

```typescript
await algorand.send.assetOptIn({
  sender: account.addr,
  assetId: assetId,
})
```

### Single Asset Opt-Out

For a single asset:

```typescript
await algorand.send.assetOptOut({
  sender: account.addr,
  assetId: assetId,
})
```

## Minimum Balance Calculation

```typescript
// Base minimum balance
const baseMinimum = 0.1 ALGO

// Per asset
const perAsset = 0.1 ALGO

// Per app opted into
const perApp = 0.1 ALGO

// Per app created (varies by schema)
const perAppCreated = 0.1 ALGO + (schema bytes × 0.05 ALGO) + (schema ints × 0.0285 ALGO)

// Total minimum balance
const totalMinimum = baseMinimum + (numAssets × perAsset) + (numApps × perApp) + appCreationCosts
```

## Running This Example

```bash
# Install dependencies
npm install

# Ensure AlgoKit LocalNet is running
algokit localnet start

# Run the example
npm start
```

**Expected Output**:
```
Creating test assets...
Created assets with IDs: 1293, 1294

Account assets opted in before: 0

Opting into 2 assets...
Successfully opted in for assets 1293, 1294
Account assets opted in after opt-in: 2

Opting out of 2 assets...
Successfully opted out of assets 1293, 1294
Account assets opted in after opt-out: 0

✅ Successfully freed up minimum balance by opting out!
The account no longer holds any asset opt-ins.
Each opt-out freed 0.1 ALGO from the minimum balance requirement.
```

## Common Use Cases

### 1. Cleanup Before Account Closure

```typescript
// Get all assets the account is opted into
const accountInfo = await algorand.account.getInformation(account.addr)
const assetIds = accountInfo.assets.map(a => BigInt(a['asset-id']))

// Opt out of all assets with zero balance
const zeroBalanceAssets = accountInfo.assets
  .filter(a => a.amount === 0n)
  .map(a => BigInt(a['asset-id']))

await algorand.asset.bulkOptOut(account, zeroBalanceAssets)

// Now can close the account
await algorand.send.payment({
  sender: account,
  receiver: otherAccount.addr,
  amount: (0).algos(),
  closeRemainderTo: otherAccount.addr,
})
```

### 2. Free Up Minimum Balance for New Operations

```typescript
// User wants to opt into a new app but doesn't have enough minimum balance
// First, identify unused assets (zero balance)
const accountInfo = await algorand.account.getInformation(account.addr)
const unusedAssets = accountInfo.assets
  .filter(a => a.amount === 0n)
  .map(a => BigInt(a['asset-id']))

// Opt out to free minimum balance
if (unusedAssets.length > 0) {
  await algorand.asset.bulkOptOut(account, unusedAssets)
  console.log(`Freed ${unusedAssets.length × 0.1} ALGO from minimum balance`)
}

// Now can opt into the app
await appClient.send.optIn.optIn({ args: [] })
```

### 3. Portfolio Management

```typescript
// Remove all assets with zero balance from portfolio
const accountInfo = await algorand.account.getInformation(account.addr)
const emptyAssets = accountInfo.assets
  .filter(asset => asset.amount === 0n && !asset.isFrozen)
  .map(asset => BigInt(asset['asset-id']))

if (emptyAssets.length > 0) {
  console.log(`Cleaning up ${emptyAssets.length} empty assets...`)
  await algorand.asset.bulkOptOut(account, emptyAssets)
}
```

## Important Considerations

### 1. Cannot Opt Out if Balance > 0

```typescript
// This will FAIL if balance > 0
await algorand.asset.bulkOptOut(account, [assetId])
// Error: transaction rejected by the network: asset [...] has non-zero balance
```

**Solution**: Transfer all assets to another account first:

```typescript
// First, transfer all assets to another account
await algorand.send.assetTransfer({
  sender: account,
  receiver: recipientAddr,
  assetId: assetId,
  amount: balance,
})

// Now can opt out
await algorand.send.assetOptOut({
  sender: account,
  assetId: assetId,
})
```

### 2. Creator Cannot Opt Out

The asset creator cannot opt out of their own asset:

```typescript
// This will FAIL
await algorand.asset.bulkOptOut(creatorAccount, [creatorAssetId])
// Error: cannot close asset ID [...] because it was created by this account
```

### 3. Frozen Assets

If an account is frozen for an asset, they cannot opt out:

```typescript
// Check if frozen before opting out
const assetInfo = await algorand.asset.getAccountInformation(account.addr, assetId)
if (assetInfo.frozen) {
  console.log('Cannot opt out: account is frozen for this asset')
}
```

### 4. Atomic Groups

Both `bulkOptIn` and `bulkOptOut` create atomic transaction groups:
- All transactions succeed or all fail
- Maximum 16 transactions per group (can opt in/out of up to 16 assets at once)
- For more than 16 assets, split into multiple batches

## Key Takeaways

1. **Opt-Out Requires Zero Balance**: Cannot opt out if you hold any units of the asset
2. **Frees Minimum Balance**: Each opt-out frees 0.1 ALGO
3. **Use Bulk Operations**: More efficient than individual opt-outs
4. **Creator Exception**: Asset creators cannot opt out of their own assets
5. **Check Before Opt-Out**: Verify balance is zero and account isn't frozen
6. **Maximum 16 Per Group**: Split larger batches into multiple calls
7. **Account Cleanup**: Essential for closing accounts or freeing funds

## Learn More

- [Algorand ASA Documentation](https://developer.algorand.org/docs/get-details/asa/)
- [Minimum Balance Requirements](https://developer.algorand.org/docs/get-details/accounts/#minimum-balance)
- [Asset Opt-In/Out](https://developer.algorand.org/docs/get-details/asa/#opt-in-to-an-asset)
- [AlgoKit Utils TypeScript Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
