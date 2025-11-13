# Bulk Asset Opt-In and Opt-Out

This example demonstrates how to efficiently opt into and opt out of multiple assets in bulk. This is essential for managing account state, cleaning up asset holdings, and reclaiming minimum balance ALGOs locked by asset opt-ins.

## Key Concepts

- **Bulk Opt-In**: Efficiently opt into multiple assets in a single operation
- **Bulk Opt-Out**: Efficiently opt out of multiple assets to reclaim minimum balance
- **Automatic Batching**: SDK handles transaction group limits automatically
- **Minimum Balance Reclaim**: Each opt-out frees 0.1 ALGO minimum balance
- **Account Cleanup**: Remove unwanted asset holdings efficiently

## What This Example Shows

1. Creating 20 test assets on LocalNet
2. Bulk opting into all 20 assets (in 2 transaction groups)
3. Viewing account state after opt-in (balance, min balance, asset count)
4. Bulk opting out of all 20 assets (in 2 transaction groups)
5. Viewing account state after opt-out to see reclaimed balance
6. Calculating the net balance change from the operation

## Code Walkthrough

### Initialize and Fund Account

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()
const assetHolder = algorand.account.random()

await algorand.send.payment({
  sender: dispenser.addr,
  receiver: assetHolder.addr,
  amount: (3).algos(),
})
```

Create a new account and fund it with 3 ALGOs to cover:
- Base minimum balance: 0.1 ALGO
- 20 asset opt-ins: 2.0 ALGOs (20 × 0.1)
- Transaction fees: ~0.04 ALGOs (20 opt-ins + 20 opt-outs)

### Create Test Assets

```typescript
const assetIds: bigint[] = []

for (let i = 1; i <= 20; i++) {
  const assetCreate = await algorand.send.assetCreate({
    sender: dispenser.addr,
    total: 1000n,
    decimals: 0,
    assetName: `Test Token ${i}`,
    unitName: `TT${i}`,
  })
  assetIds.push(BigInt(assetCreate.confirmation.assetIndex!))
}
```

Create 20 test assets with names and unit names for easy identification.

### Bulk Opt-In

```typescript
await algorand.asset.bulkOptIn(assetHolder, assetIds, { validityWindow: 100 })
```

Opts into all 20 assets at once. The SDK:
1. Creates 20 opt-in transactions
2. Batches them into groups of 16 (max per atomic group)
3. Signs all transactions with the asset holder's account
4. Sends 2 transaction groups (16 + 4 assets)
5. Waits for all confirmations

### Check State After Opt-In

```typescript
const accountInfoAfterOptIn = await algorand.account.getInformation(assetHolder.addr)
console.log(`  Balance: ${accountInfoAfterOptIn.balance.algos} ALGO`)
console.log(`  Total assets opted in: ${accountInfoAfterOptIn.totalAssetsOptedIn}`)
console.log(`  Min balance: ${accountInfoAfterOptIn.minBalance.algos} ALGO`)
```

View the account's:
- **Balance**: Available ALGOs (reduced by minimum balance requirements)
- **Total Assets Opted In**: Should be 20
- **Min Balance**: ~2.1 ALGOs (base 0.1 + 20 × 0.1)

### Bulk Opt-Out

```typescript
await algorand.asset.bulkOptOut(assetHolder, assetIds, { validityWindow: 100 })
```

Opts out of all 20 assets at once. Requirements:
- Account must have zero balance of each asset
- Automatically creates opt-out transactions (0 amount transfers to creator)
- Batches into groups like opt-in

### Check State After Opt-Out

```typescript
const accountInfoAfterOptOut = await algorand.account.getInformation(assetHolder.addr)
console.log(`  Balance: ${accountInfoAfterOptOut.balance.algos} ALGO`)
console.log(`  Total assets opted in: ${accountInfoAfterOptOut.totalAssetsOptedIn}`)
```

After opt-out:
- **Total Assets Opted In**: Should be 0
- **Balance**: Increased by ~2 ALGOs (reclaimed minimum balance minus fees)
- **Min Balance**: Back to 0.1 ALGO (base only)

### Calculate Balance Reclaimed

```typescript
const balanceChange = accountInfoAfterOptOut.balance.microAlgo - accountInfoAfterOptIn.balance.microAlgo
console.log(`Balance change: +${Number(balanceChange) / 1_000_000} ALGO`)
```

Shows the net balance change:
- **Reclaimed**: 2.0 ALGOs (20 × 0.1)
- **Fees**: ~0.02 ALGOs (20 transactions × 0.001)
- **Net**: ~1.98 ALGOs

## API Patterns (AlgoKit Utils v9.1.2)

### Bulk Opt-In

```typescript
await algorand.asset.bulkOptIn(
  account,              // Account object with signer
  assetIds,            // bigint[] - Array of asset IDs
  { validityWindow: 100 }  // Optional parameters
)
```

### Bulk Opt-Out

```typescript
await algorand.asset.bulkOptOut(
  account,              // Account object with signer
  assetIds,            // bigint[] - Array of asset IDs
  { validityWindow: 100 }  // Optional parameters
)
```

### Check Account State

```typescript
const accountInfo = await algorand.account.getInformation(address)

// Access properties
console.log(accountInfo.balance.algos)         // Balance in ALGOs
console.log(accountInfo.balance.microAlgo)     // Balance in microAlgos
console.log(accountInfo.minBalance.algos)      // Minimum balance
console.log(accountInfo.totalAssetsOptedIn)    // Number of assets opted in
console.log(accountInfo.assets)                // Array of asset holdings
```

### AlgoAmount Properties

```typescript
// AlgoAmount has convenient properties
const amount = accountInfo.balance

console.log(amount.algos)       // Value in ALGOs (number)
console.log(amount.microAlgo)   // Value in microAlgos (bigint)
console.log(amount.toString())  // String representation
```

## Common Use Cases

### Portfolio Cleanup

Clean up test or unwanted asset holdings:
```typescript
const unwantedAssetIds = await getUnwantedAssets(account.addr)
await algorand.asset.bulkOptOut(account, unwantedAssetIds)
// Reclaims 0.1 ALGO per asset
```

### Temporary Asset Holdings

Opt into assets for a transaction, then clean up:
```typescript
// Opt in to receive assets
await algorand.asset.bulkOptIn(account, assetIds)

// Perform operations with the assets
await doSomethingWithAssets()

// Transfer assets away
await transferAssetsToOtherAccount()

// Clean up to reclaim minimum balance
await algorand.asset.bulkOptOut(account, assetIds)
```

### Account Reset

Reset an account to minimal state:
```typescript
const accountInfo = await algorand.account.getInformation(account.addr)
const allAssetIds = accountInfo.assets?.map(a => BigInt(a.assetId)) || []

if (allAssetIds.length > 0) {
  // Transfer all assets to another account first
  await transferAllAssets(account, recipientAddr, allAssetIds)

  // Then opt out to reclaim balance
  await algorand.asset.bulkOptOut(account, allAssetIds)
}
```

### Seasonal Asset Management

Periodically clean up unused assets:
```typescript
const lastUsedMap = await getAssetLastUsedDates(account.addr)
const inactiveAssets = assetIds.filter(id => {
  const lastUsed = lastUsedMap.get(id)
  return lastUsed && daysSince(lastUsed) > 90
})

if (inactiveAssets.length > 0) {
  await algorand.asset.bulkOptOut(account, inactiveAssets)
  console.log(`Reclaimed ${inactiveAssets.length * 0.1} ALGOs`)
}
```

## Important Considerations

### Opt-Out Requirements

You can only opt out of an asset if:
1. **Zero Balance**: Account has 0 units of the asset
2. **Not Frozen**: Asset is not frozen for the account
3. **Valid Asset**: Asset still exists on the blockchain

### Balance Calculation

```typescript
// Minimum balance breakdown for 20 assets:
// Base: 0.1 ALGO
// Assets: 20 × 0.1 = 2.0 ALGOs
// Total: 2.1 ALGOs

// After opt-out:
// Base: 0.1 ALGO
// Assets: 0 × 0.1 = 0 ALGOs
// Total: 0.1 ALGO

// Reclaimed: 2.0 ALGOs
// Fees: ~0.02 ALGOs (20 opt-out transactions)
// Net gain: ~1.98 ALGOs
```

### Transaction Fees

- Each opt-in: 0.001 ALGO
- Each opt-out: 0.001 ALGO
- 20 assets: 0.040 ALGO total fees

### Batching Behavior

- Max 16 transactions per atomic group
- 20 assets = 2 groups (16 + 4)
- 50 assets = 4 groups (16 + 16 + 16 + 2)
- Each group is atomic within itself

### Error Handling

```typescript
try {
  await algorand.asset.bulkOptOut(account, assetIds)
} catch (error) {
  console.error('Bulk opt-out failed:', error)

  // Check which assets still have balances
  const accountInfo = await algorand.account.getInformation(account.addr)
  accountInfo.assets?.forEach(asset => {
    if (asset.amount > 0) {
      console.log(`Asset ${asset.assetId} has balance: ${asset.amount}`)
    }
  })
}
```

### Before Opt-Out Checklist

1. **Verify zero balances**: Ensure account has 0 of each asset
2. **Transfer assets first**: Move any held assets to another account
3. **Check frozen status**: Ensure assets aren't frozen
4. **Consider timing**: Opt-out in low-traffic periods to avoid rate limiting

## Expected Output

```
=== Bulk Asset Opt-In and Opt-Out Example ===

Creating and funding asset holder account...
Asset holder account created: 7CSTBIFU5VREGKV3RGASVZTFL3ZJSRECEGITZXMOXLFYOFE4DAYSV3UASA

Creating 20 test assets...
Created asset 1 with ID: 1410
Created asset 2 with ID: 1411
...
Created asset 20 with ID: 1429

Total assets created: 20

Performing bulk opt-in for 20 assets...
(This automatically batches transactions into groups as needed)
✓ Bulk opt-in completed successfully!

Account info after bulk opt-in:
  Address: 7CSTBIFU5VREGKV3RGASVZTFL3ZJSRECEGITZXMOXLFYOFE4DAYSV3UASA
  Balance: 0.98 ALGO
  Total assets opted in: 20
  Min balance: 2.1 ALGO

Performing bulk opt-out for 20 assets...
(This will reclaim the minimum balance held by asset holdings)
✓ Bulk opt-out completed successfully!

Account info after bulk opt-out:
  Address: 7CSTBIFU5VREGKV3RGASVZTFL3ZJSRECEGITZXMOXLFYOFE4DAYSV3UASA
  Balance: 2.96 ALGO
  Total assets opted in: 0
  Min balance: 0.1 ALGO

Balance change: +1.98 ALGO (reclaimed minimum balance minus fees)
✓ Successfully cleaned up all asset holdings!
```

## Running the Example

### Prerequisites
1. Start AlgoKit LocalNet:
   ```bash
   algokit localnet start
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Execute
```bash
npm start
```

The example will:
1. Create and fund a new account
2. Create 20 test assets
3. Bulk opt-in to all assets
4. Show account state with assets
5. Bulk opt-out of all assets
6. Show account state after cleanup
7. Display the reclaimed balance

## Key Differences: Opt-In vs Opt-Out

### Bulk Opt-In
- **Purpose**: Enable account to receive assets
- **Effect**: Increases minimum balance by 0.1 ALGO per asset
- **Cost**: Transaction fees only (~0.001 ALGO per asset)
- **Balance Change**: Negative (locks up ALGOs)

### Bulk Opt-Out
- **Purpose**: Remove asset holdings and reclaim minimum balance
- **Effect**: Decreases minimum balance by 0.1 ALGO per asset
- **Cost**: Transaction fees only (~0.001 ALGO per asset)
- **Balance Change**: Positive (frees up ALGOs)
- **Requirement**: Must have zero balance of each asset

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand Asset Opt-In](https://developer.algorand.org/docs/get-details/asa/)
- [Account Minimum Balance](https://developer.algorand.org/docs/get-details/accounts/#minimum-balance)
- [Transaction Groups](https://developer.algorand.org/docs/get-details/atomic_transfers/)
