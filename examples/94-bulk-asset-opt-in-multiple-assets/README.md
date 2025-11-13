# Bulk Asset Opt-In Multiple Assets

This example demonstrates how to efficiently opt an account into multiple assets at once using the bulk opt-in method. This is much more efficient than individual opt-in transactions and automatically handles batching when the number of assets exceeds transaction group limits.

## Key Concepts

- **Bulk Opt-In**: Opt into multiple assets in a single operation
- **Automatic Batching**: SDK automatically splits assets into multiple groups when needed
- **Minimum Balance**: Each asset opt-in increases minimum balance by 0.1 ALGO
- **Transaction Groups**: Uses atomic transaction groups for reliable batch processing
- **Account State**: Verify opt-in status using account information

## What This Example Shows

1. Creating 20 test assets on LocalNet
2. Funding an account with sufficient ALGOs for multiple opt-ins
3. Using `algorand.asset.bulkOptIn()` to opt into all 20 assets
4. Automatic batching into multiple transaction groups (max 16 per group)
5. Verifying all opt-ins completed successfully

## Code Walkthrough

### Initialize and Fund Account

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()
const account = algorand.account.random()

await algorand.send.payment({
  sender: dispenser.addr,
  receiver: account.addr,
  amount: (3).algos(),
})
```

Fund the account with 3 ALGOs. Each asset opt-in requires 0.1 ALGO minimum balance increase, so 20 opt-ins need at least 2 ALGOs plus transaction fees.

### Create Test Assets

```typescript
const assetIds: bigint[] = []

for (let i = 0; i < 20; i++) {
  const assetCreate = await algorand.send.assetCreate({
    sender: dispenser.addr,
    total: 1000n,
    decimals: 0,
    assetName: `Test Asset ${i + 1}`,
  })
  const assetId = BigInt(assetCreate.confirmation.assetIndex!)
  assetIds.push(assetId)
}
```

Create 20 test assets and collect their IDs. In production, you would receive these asset IDs from an external source.

### Bulk Opt-In

```typescript
await algorand.asset.bulkOptIn(account, assetIds, { validityWindow: 100 })
```

This single call:
1. Creates opt-in transactions for all 20 assets
2. Automatically batches them into groups (16 assets per group max)
3. Signs all transactions
4. Sends them to the network
5. Waits for confirmation

**Result**: 2 transaction groups are created (16 assets + 4 assets) due to the 16-transaction limit per atomic group.

### Verify Opt-Ins

```typescript
const accountInfoAfter = await algorand.account.getInformation(account.addr)
console.log(`Account total assets opted in: ${accountInfoAfter.totalAssetsOptedIn}`)
```

Check that all opt-ins succeeded by querying the account's total assets opted in count.

## API Patterns (AlgoKit Utils v9.1.2)

### Bulk Opt-In Method
```typescript
await algorand.asset.bulkOptIn(
  account,              // Account (with signer)
  assetIds,            // bigint[] - Array of asset IDs
  { validityWindow: 100 }  // Optional parameters
)
```

### Single Asset Opt-In (for comparison)
```typescript
await algorand.send.assetOptIn({
  sender: account.addr,
  assetId: assetId,
})
```

### Check Account Asset Holdings
```typescript
const accountInfo = await algorand.account.getInformation(account.addr)

// Total assets opted in
console.log(accountInfo.totalAssetsOptedIn)

// Iterate through specific holdings
accountInfo.assets?.forEach(asset => {
  console.log(`Asset ID: ${asset.assetId}, Amount: ${asset.amount}`)
})
```

### Create Multiple Assets
```typescript
const assetIds: bigint[] = []

for (let i = 0; i < 20; i++) {
  const result = await algorand.send.assetCreate({
    sender: creator.addr,
    total: 1000n,
    decimals: 0,
    assetName: `Asset ${i}`,
  })
  assetIds.push(BigInt(result.confirmation.assetIndex!))
}
```

## How Automatic Batching Works

### Transaction Group Limit

Algorand supports maximum 16 transactions per atomic group. When opting into more than 16 assets, the SDK automatically:

1. **Splits the assets**: Divides asset IDs into batches of 16
2. **Creates multiple groups**: Each batch becomes a separate transaction group
3. **Sends sequentially**: Groups are sent one after another
4. **Waits for confirmation**: Each group is confirmed before the next is sent

### Example: 20 Assets

- **Batch 1**: Assets 1-16 (16 opt-in transactions)
- **Batch 2**: Assets 17-20 (4 opt-in transactions)

Both batches are atomic within themselves, but sent as separate groups.

### Example: 50 Assets

- **Batch 1**: Assets 1-16
- **Batch 2**: Assets 17-32
- **Batch 3**: Assets 33-48
- **Batch 4**: Assets 49-50

## Minimum Balance Requirements

Each asset opt-in increases an account's minimum balance by **0.1 ALGO (100,000 microAlgos)**.

### Calculation

```typescript
const requiredBalance = numberOfAssets * 0.1 + baseMinBalance + fees

// For 20 assets:
// 20 * 0.1 = 2.0 ALGOs
// Base min balance: 0.1 ALGO
// Fees: ~0.002 ALGO per transaction
// Total: ~2.14 ALGOs
```

### Funding Formula

```typescript
const numAssets = 20
const requiredAmount = (numAssets * 0.1 + 0.5).algos()  // Add buffer for fees

await algorand.send.payment({
  sender: dispenser.addr,
  receiver: account.addr,
  amount: requiredAmount,
})
```

## Common Use Cases

### NFT Marketplace

Users need to opt into multiple NFTs before purchasing:
```typescript
const nftIds = await marketplace.getAvailableNFTs()
await algorand.asset.bulkOptIn(userAccount, nftIds, { validityWindow: 100 })
```

### Token Portfolio

Opt into multiple tokens for a DeFi portfolio:
```typescript
const tokenIds = [
  1234n,  // USDC
  5678n,  // USDT
  9012n,  // ALGO-LP
  // ... more tokens
]
await algorand.asset.bulkOptIn(account, tokenIds)
```

### Airdrop Preparation

Prepare accounts to receive multiple airdropped tokens:
```typescript
const airdropAssets = await fetchAirdropAssets()
await algorand.asset.bulkOptIn(account, airdropAssets)
```

### Asset Collection

Opt into a full collection of assets:
```typescript
const collectionAssets = await getCollectionAssets(collectionId)
const assetIds = collectionAssets.map(a => BigInt(a.id))
await algorand.asset.bulkOptIn(account, assetIds)
```

## Important Considerations

### Minimum Balance

- Ensure account has sufficient balance before bulk opt-in
- Each opt-in locks 0.1 ALGO in the account
- Account cannot go below minimum balance

### Transaction Fees

- Each opt-in transaction costs 0.001 ALGO (1000 microAlgos)
- 20 opt-ins = 20 transactions = 0.02 ALGO in fees
- Budget for fees when funding the account

### Batching Behavior

- SDK automatically handles batching
- Each batch is atomic (all-or-nothing within the batch)
- If one batch fails, subsequent batches won't be sent
- Check `totalAssetsOptedIn` to verify completion

### Performance

- Bulk opt-in is significantly faster than individual opt-ins
- Individual: 20 API calls + 20 confirmations = ~60 seconds
- Bulk: 2 batches + 2 confirmations = ~6 seconds

### Validity Window

The `validityWindow` parameter sets how long transactions are valid:
```typescript
await algorand.asset.bulkOptIn(account, assetIds, {
  validityWindow: 100  // Valid for 100 rounds (~5 minutes)
})
```

## Expected Output

```
Creating 20 test assets...
Created asset Test Asset 1 with 1000 units and 0 decimals created by L3T2BF5M... with ID 1390 via transaction 4SBOU...
Created asset 1 with ID: 1390
Created asset 2 with ID: 1391
...
Created asset 20 with ID: 1409

Account assets opted in before: 0

Opting account into 20 assets...
Successfully opted in 7CSTBIFU... for assets 1390, 1391, ..., 1405 with transaction IDs CJUSQS..., V6K453...
  Grouped under +uzjDH... in round 391.
Successfully opted in 7CSTBIFU... for assets 1406, 1407, 1408, 1409 with transaction IDs IPRF6Y..., YC3EJE...
  Grouped under LaAyx1... in round 392.
Successfully opted into 20 assets
Account total assets opted in: 20

✅ Bulk asset opt-in successful!
The account is now opted into all 20 assets and can receive them.
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
1. Create a new random account
2. Fund it with 3 ALGOs
3. Create 20 test assets
4. Bulk opt-in to all 20 assets (in 2 batches)
5. Verify all opt-ins succeeded

## Comparison: Bulk vs Individual

### Individual Opt-Ins (Inefficient)
```typescript
// DON'T DO THIS
for (const assetId of assetIds) {
  await algorand.send.assetOptIn({
    sender: account.addr,
    assetId: assetId,
  })
}
// Takes ~60 seconds for 20 assets
```

### Bulk Opt-In (Efficient)
```typescript
// DO THIS INSTEAD
await algorand.asset.bulkOptIn(account, assetIds)
// Takes ~6 seconds for 20 assets
```

## Error Handling

```typescript
try {
  await algorand.asset.bulkOptIn(account, assetIds)
} catch (error) {
  console.error('Bulk opt-in failed:', error)

  // Check which assets were successfully opted in
  const accountInfo = await algorand.account.getInformation(account.addr)
  const optedInCount = accountInfo.totalAssetsOptedIn

  if (optedInCount < assetIds.length) {
    console.log(`Only ${optedInCount} of ${assetIds.length} opt-ins succeeded`)
    // Handle partial success
  }
}
```

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand Asset Opt-In](https://developer.algorand.org/docs/get-details/asa/)
- [Transaction Groups](https://developer.algorand.org/docs/get-details/atomic_transfers/)
- [Account Minimum Balance](https://developer.algorand.org/docs/get-details/accounts/#minimum-balance)
