# Single Asset Opt-In and Opt-Out

Demonstrates the complete flow of opting into and out of a single asset, including verification of account asset holdings.

## What This Example Shows

1. **Asset Creation** - Creating a test asset with specific properties
2. **Account Setup** - Creating and funding a new account
3. **Pre-Opt-In Check** - Verifying asset count before opt-in
4. **Asset Opt-In** - Opting an account into an asset
5. **Post-Opt-In Verification** - Confirming the opt-in succeeded
6. **Asset Opt-Out** - Removing an asset from an account
7. **Post-Opt-Out Verification** - Confirming the opt-out succeeded

## Why This Matters

Asset opt-in/out is essential for:
- **Asset Reception**: Accounts must opt-in before receiving assets
- **Balance Management**: Managing which assets an account holds
- **Minimum Balance**: Each asset increases min balance by 0.1 ALGO
- **Security**: Prevents unsolicited asset spam
- **Cleanup**: Opt-out reduces minimum balance requirements
- **Portfolio Management**: Controlling which assets you want to hold

## How It Works

### 1. Create Test Asset

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const testAccount = await algorand.account.localNetDispenser()

const assetCreate = await algorand.send.assetCreate({
  sender: testAccount.addr,
  total: 1000n,
  decimals: 0,
  assetName: 'Demo Asset',
  unitName: 'DEMO',
})

const assetId = BigInt(assetCreate.confirmation.assetIndex!)
```

**Why**: Create an asset to demonstrate opt-in/out functionality.

### 2. Create and Fund Account

```typescript
const secondAccount = await algorand.account.random()

await algorand.send.payment({
  sender: testAccount.addr,
  receiver: secondAccount.addr,
  amount: algo(1),
})
```

**Why**: New account needs funds for transaction fees and increased minimum balance.

### 3. Check Assets Before Opt-In

```typescript
const accountInfoBefore = await algorand.account.getInformation(secondAccount.addr)
const assetsBefore = accountInfoBefore.assets?.length || 0
console.log(`Assets opted in: ${assetsBefore}`) // 0
```

**Why**: Verify account starts with no asset holdings.

### 4. Opt-In to Asset

```typescript
await algorand.send.assetOptIn({
  sender: secondAccount.addr,
  assetId: assetId,
})
```

**Key Point**: This is required before the account can receive this asset.

### 5. Verify Opt-In

```typescript
const accountInfoAfterOptIn = await algorand.account.getInformation(secondAccount.addr)
const assetsAfterOptIn = accountInfoAfterOptIn.assets?.length || 0
console.log(`Assets opted in: ${assetsAfterOptIn}`) // 1
```

**Why**: Confirm the asset was added to the account's holdings.

### 6. Opt-Out of Asset

```typescript
await algorand.send.assetOptOut({
  sender: secondAccount.addr,
  assetId: assetId,
  creator: testAccount.addr,
  ensureZeroBalance: true,
})
```

**Important**: Only works when asset balance is zero.

### 7. Verify Opt-Out

```typescript
const accountInfoAfterOptOut = await algorand.account.getInformation(secondAccount.addr)
const assetsAfterOptOut = accountInfoAfterOptOut.assets?.length || 0
console.log(`Assets opted in: ${assetsAfterOptOut}`) // 0
```

**Why**: Confirm the asset was removed from holdings.

## Prerequisites

- AlgoKit installed
- Docker Desktop (for LocalNet)
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
=== Single Asset Opt-In and Opt-Out Example ===

Step 1: Creating a test asset...
✓ Created asset with ID: 1158

Step 2: Creating a second account...
✓ Created and funded account: FN7TRQIF5FQMMME6JIBTUDCFVJUKE4AHNFDEVKWIMYP3TZ34AU6TNXYJU4

Step 3: Checking account info before opt-in...
Assets opted in: 0

Step 4: Opting into the asset...
✓ Successfully opted into asset 1158

Step 5: Verifying opt-in...
Assets opted in: 1
✓ Opt-in confirmed

Step 6: Opting out of the asset...
✓ Successfully opted out of asset 1158

Step 7: Verifying opt-out...
Assets opted in: 0
✓ Opt-out confirmed

=== Summary ===
• Asset opt-in allows an account to hold and receive an asset
• Asset opt-out removes the asset from the account (requires zero balance)
• Each opted-in asset increases the minimum balance requirement by 0.1 ALGO
• Opt-out is only possible when the asset balance is zero

✅ Example completed successfully
```

## Key Concepts

### Asset Opt-In

Before an account can receive or hold an asset, it must explicitly opt-in:

```typescript
await algorand.send.assetOptIn({
  sender: accountAddress,
  assetId: assetId,
})
```

**Effects**:
- Adds asset to account's holdings with 0 balance
- Increases minimum balance by 100,000 microAlgo (0.1 ALGO)
- Allows account to receive this asset
- Account can check balance of this asset

### Asset Opt-Out

Removes an asset from an account's holdings:

```typescript
await algorand.send.assetOptOut({
  sender: accountAddress,
  assetId: assetId,
  creator: creatorAddress,
  ensureZeroBalance: true,
})
```

**Requirements**:
- Asset balance must be exactly 0
- Reduces minimum balance by 100,000 microAlgo
- Sends any remaining balance back to creator
- Account can no longer receive this asset

### Checking Asset Holdings

```typescript
const accountInfo = await algorand.account.getInformation(address)
const assetCount = accountInfo.assets?.length || 0
const specificAsset = accountInfo.assets?.find(a => a['asset-id'] === assetId)

console.log(`Total assets: ${assetCount}`)
console.log(`Asset balance: ${specificAsset?.amount || 0}`)
```

### Minimum Balance Calculation

```
Base minimum: 100,000 microAlgo (0.1 ALGO)
Per asset: +100,000 microAlgo (+0.1 ALGO)

Examples:
- 0 assets: 100,000 microAlgo (0.1 ALGO)
- 1 asset:  200,000 microAlgo (0.2 ALGO)
- 5 assets: 600,000 microAlgo (0.6 ALGO)
```

## Common Patterns

### 1. Opt-In Before Receiving

```typescript
// Creator wants to send asset to recipient
const recipientAccount = await algorand.account.random()

// Fund recipient for minimum balance + fees
await algorand.send.payment({
  sender: creator.addr,
  receiver: recipientAccount.addr,
  amount: algo(0.3), // 0.1 base + 0.1 asset + 0.1 buffer
})

// Recipient opts in
await algorand.send.assetOptIn({
  sender: recipientAccount.addr,
  assetId: assetId,
})

// Now creator can send asset
await algorand.send.assetTransfer({
  sender: creator.addr,
  receiver: recipientAccount.addr,
  assetId: assetId,
  amount: 100n,
})
```

### 2. Check Balance Before Opt-Out

```typescript
async function safeOptOut(
  algorand: AlgorandClient,
  account: Account,
  assetId: bigint,
  creator: string
) {
  const accountInfo = await algorand.account.getInformation(account.addr)
  const asset = accountInfo.assets?.find(a => a['asset-id'] === Number(assetId))

  if (!asset) {
    console.log('Not opted in to this asset')
    return
  }

  if (asset.amount > 0) {
    throw new Error(`Cannot opt-out: balance is ${asset.amount}, must be 0`)
  }

  await algorand.send.assetOptOut({
    sender: account.addr,
    assetId: assetId,
    creator: creator,
    ensureZeroBalance: true,
  })

  console.log('✓ Successfully opted out')
}
```

### 3. Batch Opt-In to Multiple Assets

```typescript
async function optInToMultipleAssets(
  algorand: AlgorandClient,
  account: Account,
  assetIds: bigint[]
) {
  for (const assetId of assetIds) {
    await algorand.send.assetOptIn({
      sender: account.addr,
      assetId: assetId,
    })
    console.log(`✓ Opted in to asset ${assetId}`)
  }

  console.log(`✓ Opted in to ${assetIds.length} assets`)
}

await optInToMultipleAssets(algorand, account, [1001n, 1002n, 1003n])
```

### 4. List All Opted-In Assets

```typescript
async function listOptedInAssets(
  algorand: AlgorandClient,
  address: string
) {
  const accountInfo = await algorand.account.getInformation(address)
  const assets = accountInfo.assets || []

  console.log(`\nAccount has ${assets.length} assets:`)
  
  for (const asset of assets) {
    console.log(`  Asset ID: ${asset['asset-id']}`)
    console.log(`    Balance: ${asset.amount}`)
    console.log(`    Frozen: ${asset['is-frozen'] || false}`)
  }
}
```

## Best Practices

### 1. Always Check Balance Before Opt-Out

**Good**:
```typescript
const accountInfo = await algorand.account.getInformation(account.addr)
const asset = accountInfo.assets?.find(a => a['asset-id'] === Number(assetId))

if (asset && asset.amount === 0) {
  await algorand.send.assetOptOut({
    sender: account.addr,
    assetId: assetId,
    creator: creator.addr,
    ensureZeroBalance: true,
  })
}
```

**Avoid**:
```typescript
// Opting out without checking balance
await algorand.send.assetOptOut({
  sender: account.addr,
  assetId: assetId,
  creator: creator.addr,
  ensureZeroBalance: true,
})
// Will fail if balance > 0
```

### 2. Fund Account for Minimum Balance

**Good**:
```typescript
// Calculate needed funds
const numAssets = 3
const minBalanceNeeded = 0.1 + (numAssets * 0.1) // base + assets
const feeBuffer = 0.1

await algorand.send.payment({
  sender: funder.addr,
  receiver: newAccount.addr,
  amount: algo(minBalanceNeeded + feeBuffer),
})

// Now safe to opt-in
for (const assetId of assetIds) {
  await algorand.send.assetOptIn({
    sender: newAccount.addr,
    assetId: assetId,
  })
}
```

**Avoid**:
```typescript
// Insufficient funding
await algorand.send.payment({
  sender: funder.addr,
  receiver: newAccount.addr,
  amount: algo(0.1), // Only base minimum
})

await algorand.send.assetOptIn({
  sender: newAccount.addr,
  assetId: assetId,
})
// Will fail: insufficient balance for increased minimum
```

### 3. Handle Opt-In Errors Gracefully

**Good**:
```typescript
try {
  await algorand.send.assetOptIn({
    sender: account.addr,
    assetId: assetId,
  })
  console.log('✓ Opted in successfully')
} catch (error) {
  if (error.message.includes('already opted in')) {
    console.log('Already opted in to this asset')
  } else if (error.message.includes('below min')) {
    console.error('Insufficient balance for minimum requirement')
  } else {
    throw error
  }
}
```

**Avoid**:
```typescript
// No error handling
await algorand.send.assetOptIn({
  sender: account.addr,
  assetId: assetId,
})
```

### 4. Verify Opt-In Before Transferring

**Good**:
```typescript
async function sendAssetSafely(
  algorand: AlgorandClient,
  sender: Account,
  receiver: string,
  assetId: bigint,
  amount: bigint
) {
  // Check if receiver is opted in
  const receiverInfo = await algorand.account.getInformation(receiver)
  const isOptedIn = receiverInfo.assets?.some(a => a['asset-id'] === Number(assetId))

  if (!isOptedIn) {
    throw new Error('Receiver is not opted in to this asset')
  }

  await algorand.send.assetTransfer({
    sender: sender.addr,
    receiver: receiver,
    assetId: assetId,
    amount: amount,
  })
}
```

**Avoid**:
```typescript
// Sending without checking opt-in status
await algorand.send.assetTransfer({
  sender: sender.addr,
  receiver: receiver,
  assetId: assetId,
  amount: amount,
})
// Will fail if receiver not opted in
```

## Zero Balance Requirement

**Why Opt-Out Requires Zero Balance**:

Opt-out closes the asset holding completely. If there's a balance:
- The balance would be lost
- The creator could lose track of supply
- It could violate asset circulation expectations

**To Opt-Out with Balance**:
```typescript
// First, send entire balance back to creator or another holder
await algorand.send.assetTransfer({
  sender: account.addr,
  receiver: creator.addr,
  assetId: assetId,
  amount: currentBalance,
  closeRemainderTo: creator.addr, // Ensures all goes to creator
})

// Now balance is 0, can opt-out
await algorand.send.assetOptOut({
  sender: account.addr,
  assetId: assetId,
  creator: creator.addr,
  ensureZeroBalance: true,
})
```

## Key Takeaways

1. **Opt-in is required** before an account can receive an asset
2. **Each asset adds 0.1 ALGO** to minimum balance requirement
3. **Opt-out requires zero balance** - transfer assets first
4. **Check opted-in status** with `accountInfo.assets?.length`
5. **Fund accounts sufficiently** for base minimum + asset minimums
6. **Opt-out reduces minimum balance** by 0.1 ALGO per asset
7. **Handle errors gracefully** for already opted-in or insufficient balance
8. **Verify opt-in before transfers** to avoid failed transactions

