# Transfer ASA Between Accounts

This example demonstrates how to transfer Algorand Standard Assets (ASAs) between accounts, including the required opt-in process and balance verification.

## Overview

Transferring ASAs (Algorand Standard Assets) between accounts is a fundamental operation in Algorand applications. Unlike ALGO transfers, ASA transfers require the recipient to first opt-in to the asset before they can receive it. This example shows the complete workflow.

## Key Concepts

### Algorand Standard Assets (ASAs)

ASAs are on-chain assets native to the Algorand blockchain. They can represent:
- Fungible tokens (cryptocurrencies, stablecoins)
- Non-fungible tokens (NFTs, unique items)
- Security tokens
- Real-world assets

### Asset Opt-In Requirement

Before an account can receive an ASA, it must **opt-in** to that asset. This is a security feature that:
- Prevents spam assets from being sent to accounts
- Gives users control over which assets they hold
- Requires a minimum balance increase for each opted-in asset

### Asset Transfer Process

1. **Create or identify the asset**: The asset must exist on the blockchain
2. **Receiver opts in**: The receiving account opts into the asset
3. **Transfer the asset**: The sender transfers a specified amount
4. **Verify balances**: Confirm the transfer was successful

## Code Examples

### Example 1: Complete Asset Transfer Workflow

```typescript
import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

// Create sender and receiver accounts
const sender = await algorand.account.random()
const receiver = await algorand.account.random()

// Fund both accounts
await algorand.send.payment({
  sender: dispenser.addr,
  receiver: sender.addr,
  amount: algo(10),
})
await algorand.send.payment({
  sender: dispenser.addr,
  receiver: receiver.addr,
  amount: algo(1), // Needs ALGOs for minimum balance and fees
})

// Create an asset
const assetCreate = await algorand.send.assetCreate({
  sender: sender.addr,
  total: 100n,
  decimals: 0,
  assetName: 'Test Asset',
  unitName: 'TEST',
})
const assetId = BigInt(assetCreate.confirmation.assetIndex!)

// Receiver opts in to the asset
await algorand.send.assetOptIn({
  sender: receiver.addr,
  assetId
})

// Transfer 5 units to receiver
await algorand.send.assetTransfer({
  sender: sender.addr,
  receiver: receiver.addr,
  assetId,
  amount: 5n,
})

// Verify balances
const receiverInfo = await algorand.asset.getAccountInformation(receiver.addr, assetId)
console.log(`Receiver balance: ${receiverInfo.balance}`) // 5

const senderInfo = await algorand.asset.getAccountInformation(sender.addr, assetId)
console.log(`Sender balance: ${senderInfo.balance}`) // 95
```

### Example 2: Transfer with Transaction Note

```typescript
// Transfer with a descriptive note
await algorand.send.assetTransfer({
  sender: sender.addr,
  receiver: receiver.addr,
  assetId,
  amount: 10n,
  note: `Payment for order #12345`,
})
```

### Example 3: Transferring All Asset Holdings

```typescript
// Get sender's current balance
const senderInfo = await algorand.asset.getAccountInformation(sender.addr, assetId)
const totalBalance = senderInfo.balance

// Transfer entire balance
await algorand.send.assetTransfer({
  sender: sender.addr,
  receiver: receiver.addr,
  assetId,
  amount: totalBalance,
})
```

## Best Practices

### 1. Always Check Opt-In Status

**Good** - Verify opt-in before attempting transfer:
```typescript
async function safeTransfer(
  algorand: AlgorandClient,
  sender: string,
  receiver: string,
  assetId: bigint,
  amount: bigint
) {
  try {
    // Check if receiver has opted in
    const receiverInfo = await algorand.asset.getAccountInformation(receiver, assetId)

    // If we get here, receiver has opted in
    return await algorand.send.assetTransfer({
      sender,
      receiver,
      assetId,
      amount,
    })
  } catch (error) {
    // Receiver hasn't opted in
    throw new Error(`Receiver ${receiver} must opt-in to asset ${assetId} first`)
  }
}
```

**Avoid** - Assuming receiver has opted in:
```typescript
// BAD: This will fail if receiver hasn't opted in
await algorand.send.assetTransfer({
  sender: sender.addr,
  receiver: receiver.addr,
  assetId,
  amount: 10n,
})
```

### 2. Ensure Sufficient Balance

```typescript
async function validateAndTransfer(
  algorand: AlgorandClient,
  sender: string,
  receiver: string,
  assetId: bigint,
  amount: bigint
) {
  // Check sender's balance
  const senderInfo = await algorand.asset.getAccountInformation(sender, assetId)

  if (senderInfo.balance < amount) {
    throw new Error(
      `Insufficient balance. Has ${senderInfo.balance}, needs ${amount}`
    )
  }

  // Proceed with transfer
  return await algorand.send.assetTransfer({
    sender,
    receiver,
    assetId,
    amount,
  })
}
```

### 3. Handle Minimum Balance Requirements

```typescript
// Receiver needs ALGOs for:
// 1. Minimum balance increase (0.1 ALGO per asset opted in)
// 2. Transaction fees

const MIN_BALANCE_FOR_OPT_IN = algo(0.1)
const TRANSACTION_FEE = algo(0.001)

// Ensure receiver has enough ALGOs before opt-in
await algorand.send.payment({
  sender: dispenser.addr,
  receiver: receiver.addr,
  amount: MIN_BALANCE_FOR_OPT_IN + TRANSACTION_FEE,
})

// Now receiver can opt in
await algorand.send.assetOptIn({
  sender: receiver.addr,
  assetId,
})
```

### 4. Use Descriptive Transaction Notes

```typescript
// Good: Descriptive notes help with tracking and debugging
await algorand.send.assetTransfer({
  sender: sender.addr,
  receiver: receiver.addr,
  assetId,
  amount: 100n,
  note: `Invoice #INV-2024-001 | 100 USDC payment`,
})
```

## Common Use Cases

### 1. Token Distribution

```typescript
async function distributeTokens(
  algorand: AlgorandClient,
  sender: string,
  recipients: string[],
  assetId: bigint,
  amountPerRecipient: bigint
) {
  console.log(`Distributing ${amountPerRecipient} tokens to ${recipients.length} recipients`)

  for (const recipient of recipients) {
    try {
      // Verify opt-in
      await algorand.asset.getAccountInformation(recipient, assetId)

      // Transfer tokens
      await algorand.send.assetTransfer({
        sender,
        receiver: recipient,
        assetId,
        amount: amountPerRecipient,
        note: `Token distribution batch`,
      })

      console.log(`✓ Transferred to ${recipient}`)
    } catch (error) {
      console.error(`✗ Failed for ${recipient}:`, error.message)
    }
  }
}
```

### 2. Marketplace Asset Purchase

```typescript
async function purchaseAsset(
  algorand: AlgorandClient,
  buyer: string,
  seller: string,
  assetId: bigint,
  assetAmount: bigint,
  price: bigint
) {
  // 1. Buyer pays seller in ALGOs
  await algorand.send.payment({
    sender: buyer,
    receiver: seller,
    amount: price,
    note: `Payment for ${assetAmount} units of asset ${assetId}`,
  })

  // 2. Seller transfers asset to buyer
  await algorand.send.assetTransfer({
    sender: seller,
    receiver: buyer,
    assetId,
    amount: assetAmount,
    note: `Delivery for payment`,
  })

  console.log(`✓ Purchase complete: ${assetAmount} units for ${price} µALGO`)
}
```

### 3. Asset Exchange/Swap

```typescript
async function swapAssets(
  algorand: AlgorandClient,
  party1: string,
  party2: string,
  asset1: bigint,
  amount1: bigint,
  asset2: bigint,
  amount2: bigint
) {
  // Both parties must have opted in to both assets

  // Party 1 sends asset1 to Party 2
  await algorand.send.assetTransfer({
    sender: party1,
    receiver: party2,
    assetId: asset1,
    amount: amount1,
  })

  // Party 2 sends asset2 to Party 1
  await algorand.send.assetTransfer({
    sender: party2,
    receiver: party1,
    assetId: asset2,
    amount: amount2,
  })

  console.log('✓ Asset swap complete')
}
```

### 4. Batch Transfer Verification

```typescript
async function batchTransferWithVerification(
  algorand: AlgorandClient,
  sender: string,
  transfers: Array<{ receiver: string; amount: bigint }>,
  assetId: bigint
) {
  const results = []

  for (const transfer of transfers) {
    // Get balance before
    const beforeInfo = await algorand.asset.getAccountInformation(
      transfer.receiver,
      assetId
    )
    const balanceBefore = beforeInfo.balance

    // Execute transfer
    await algorand.send.assetTransfer({
      sender,
      receiver: transfer.receiver,
      assetId,
      amount: transfer.amount,
    })

    // Get balance after
    const afterInfo = await algorand.asset.getAccountInformation(
      transfer.receiver,
      assetId
    )
    const balanceAfter = afterInfo.balance

    // Verify
    const expectedBalance = balanceBefore + transfer.amount
    const verified = balanceAfter === expectedBalance

    results.push({
      receiver: transfer.receiver,
      verified,
      balanceBefore,
      balanceAfter,
    })
  }

  return results
}
```

## Asset Transfer Details

### Minimum Balance Impact

Each asset an account opts into increases the minimum balance requirement:
- **Per ASA opt-in**: 0.1 ALGO (100,000 µALGO)
- **Transaction fee**: 0.001 ALGO (1,000 µALGO)

```typescript
// Calculate required balance for receiver
const assetsToOptIn = 3
const minBalanceRequired = algo(0.1 * assetsToOptIn)
const feesRequired = algo(0.001 * assetsToOptIn)
const totalRequired = minBalanceRequired + feesRequired

console.log(`Receiver needs ${totalRequired} µALGO to opt into ${assetsToOptIn} assets`)
```

### Transaction Fees

Standard ASA transfers cost 0.001 ALGO (1,000 µALGO) in transaction fees.

### Asset Clawback and Freeze

Some assets may have special properties:
- **Clawback**: Asset creator can revoke assets from any holder
- **Freeze**: Asset creator can freeze assets in specific accounts

Check asset configuration before transfers:
```typescript
const assetInfo = await algorand.client.algod.getAssetByID(Number(assetId)).do()

if (assetInfo.params.clawback) {
  console.log('⚠️  This asset has clawback enabled')
}

if (assetInfo.params.freeze) {
  console.log('⚠️  This asset has freeze enabled')
}
```

## Error Handling

### Common Transfer Errors

```typescript
async function robustAssetTransfer(
  algorand: AlgorandClient,
  sender: string,
  receiver: string,
  assetId: bigint,
  amount: bigint
) {
  try {
    return await algorand.send.assetTransfer({
      sender,
      receiver,
      assetId,
      amount,
    })
  } catch (error) {
    const errorMsg = error.message

    if (errorMsg.includes('asset not opted in')) {
      throw new Error(`Receiver must opt-in to asset ${assetId} first`)
    }

    if (errorMsg.includes('insufficient balance')) {
      const senderInfo = await algorand.asset.getAccountInformation(sender, assetId)
      throw new Error(
        `Insufficient balance: has ${senderInfo.balance}, needs ${amount}`
      )
    }

    if (errorMsg.includes('asset is frozen')) {
      throw new Error(`Asset ${assetId} is frozen for this account`)
    }

    if (errorMsg.includes('minimum balance')) {
      throw new Error('Sender does not have enough ALGOs for minimum balance')
    }

    throw error
  }
}
```

## Running This Example

```bash
# Ensure LocalNet is running
algokit localnet start

# Install and run
npm install
npm start
```

**Expected Output**:
```
Funding accounts...
✓ Accounts funded

Creating test asset...
✓ Asset created with ID: 1193

Opting in receiver account to asset...
✓ Receiver successfully opted in

Transferring 5 units of asset...
✓ Transfer complete

Verifying balances...
  Receiver balance: 5 units
  Sender balance: 95 units

✅ Asset transfer successful!
   - Receiver has 5 units
   - Sender has 95 units remaining

✅ Example completed successfully
```

## Related Concepts

- **Asset Creation**: [71-single-asset-opt-in-and-opt-out](../71-single-asset-opt-in-and-opt-out)
- **Asset Opt-In**: Required before receiving assets
- **Balance Verification**: Using `algorand.asset.getAccountInformation()`
- **Transaction Notes**: Adding metadata to transfers

## Learn More

- [Algorand ASA Documentation](https://developer.algorand.org/docs/get-details/asa/)
- [Asset Transfer Reference](https://developer.algorand.org/docs/get-details/transactions/transactions/#asset-transfer-transaction)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
