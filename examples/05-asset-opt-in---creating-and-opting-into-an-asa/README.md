# Asset Opt-In - Creating and Opting Into an ASA

This example demonstrates how to create an Algorand Standard Asset (ASA) and opt an account into holding that asset, which is required before any account can receive or hold ASAs.

## What This Example Shows

This example teaches you how to:
- Create a new Algorand Standard Asset (ASA)
- Perform an asset opt-in transaction for an account
- Verify the opt-in by querying account asset information
- Understand that asset creators are automatically opted in during creation

## Why This Matters

Asset opt-in is a fundamental security feature of Algorand Standard Assets:

1. **Security**: Prevents unwanted assets from being sent to your account without your consent
2. **User Control**: Accounts explicitly choose which assets they want to hold
3. **Spam Prevention**: Protects users from receiving spam tokens
4. **Required Step**: You must opt-in before receiving any ASA

Understanding asset opt-in is crucial because:
- **Transfers fail without opt-in**: Attempting to send an ASA to an account that hasn't opted in will result in an error
- **Minimum balance requirement**: Each opt-in increases your account's minimum ALGO balance by 0.1 ALGO
- **Explicit consent**: Users have full control over which assets they accept
- **Creator exception**: Asset creators are automatically opted in when they create the asset

Common scenarios:
- Token airdrops require users to opt-in before receiving tokens
- NFT marketplaces require buyers to opt-in before purchasing
- DeFi protocols require users to opt-in to liquidity pool tokens

## How It Works

The example demonstrates the three-step process:

### 1. Create an Asset
```typescript
const assetCreateResult = await algorand.send.assetCreate({
  sender: alice,
  total: 1n, // Total supply
})
const assetId = assetCreateResult.assetId
```

The creator (alice) is automatically opted in during asset creation.

### 2. Opt-In to the Asset
```typescript
await algorand.send.assetOptIn({
  sender: alice,
  assetId: assetId,
})
```

Note: In this example, alice is both the creator and the opt-in account. The creator is already opted in, but this demonstrates the explicit opt-in process that other accounts would need to perform.

### 3. Verify the Opt-In
```typescript
const assetInfo = await algod.accountAssetInformation(alice.addr, Number(assetId)).do()
console.log(`Asset ID: ${assetInfo.assetHolding.assetId}`)
console.log(`Balance: ${assetInfo.assetHolding.amount}`)
console.log(`Is Frozen: ${assetInfo.assetHolding.isFrozen}`)
```

After opting in, you can query the account's asset information to verify the opt-in was successful.

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
Creating a new Algorand Standard Asset (ASA)...
✓ Asset created with ID: [asset-id]

Opting account into the asset...
✓ Account [address] successfully opted into asset [asset-id]

Asset Information:
  Asset ID: [asset-id]
  Balance: 1
  Is Frozen: false

✓ Asset opt-in completed successfully!
```

## Key Takeaways

- Asset opt-in is required before an account can receive or hold any ASA
- The opt-in process involves sending a 0-amount asset transfer transaction to yourself
- Asset creators are automatically opted in during asset creation
- Each asset opt-in increases your account's minimum ALGO balance by 0.1 ALGO
- You can verify an opt-in by querying account asset information using `algod.accountAssetInformation()`
- Attempting to send an ASA to an account that hasn't opted in will fail with a "receiver error: must optin" message
- Asset opt-in is a security feature that gives users control over which assets they accept
