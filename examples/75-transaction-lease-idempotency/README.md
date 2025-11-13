# Transaction Lease Idempotency

This example demonstrates how to use transaction leases to ensure transaction uniqueness and prevent duplicate operations in Algorand.

## Overview

Transaction leases are a powerful mechanism in Algorand that prevent duplicate transactions from being confirmed. A lease is a 32-byte value that, when specified, ensures that no other transaction with the same lease from the same sender can be accepted until the current transaction leaves the transaction pool (typically 1000 rounds).

## Key Concepts

### What is a Transaction Lease?

A lease creates a temporary lock that prevents overlapping transactions:
- **Duration**: Leases remain active for approximately 1000 rounds (~50 minutes on MainNet)
- **Scope**: Leases are sender-specific (same lease can be used by different senders)
- **Format**: Can be specified as a string or Uint8Array (32 bytes)
- **Purpose**: Ensures transaction uniqueness and idempotency

### Why Use Leases?

1. **Prevent Double-Spending**: Ensure a payment isn't accidentally sent twice
2. **Idempotent Operations**: Build retry-safe operations in distributed systems
3. **Transaction Uniqueness**: Guarantee only one specific operation executes
4. **Distributed Systems**: Coordinate operations across multiple services

## Code Examples

### Example 1: String Lease for Payments

```typescript
import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()
const sender = await algorand.account.localNetDispenser()
const receiver = await algorand.account.random()

// Use unique lease values per run to avoid conflicts with previous runs
const runId = Date.now()

// First payment with string lease
const result1 = await algorand.send.payment({
  sender: sender.addr,
  receiver: receiver.addr,
  amount: algo(1),
  lease: `test-${runId}`, // String lease with unique run ID
})

console.log(`✓ First payment successful: ${result1.transaction.txID()}`)

// Attempting duplicate payment with same lease (will fail)
try {
  await algorand.send.payment({
    sender: sender.addr,
    receiver: receiver.addr,
    amount: algo(2),
    lease: `test-${runId}`, // Same lease - rejected!
  })
} catch (error) {
  console.log('✓ Duplicate payment rejected (expected)')
  // Error: transaction using an overlapping lease
}
```

### Example 2: Byte Array Lease

```typescript
// Create a unique byte array lease by encoding runId
const runId = Date.now()
const leaseBytes = new Uint8Array(8)
const view = new DataView(leaseBytes.buffer)
view.setBigUint64(0, BigInt(runId), false) // Use runId as the lease value

const result = await algorand.send.payment({
  sender: sender.addr,
  receiver: receiver.addr,
  amount: algo(1),
  lease: leaseBytes, // Byte array lease with unique run ID
})

// Attempting duplicate with same byte array lease (will fail)
try {
  await algorand.send.payment({
    sender: sender.addr,
    receiver: receiver.addr,
    amount: algo(2),
    lease: leaseBytes, // Same lease value
  })
} catch (error) {
  console.log('✓ Duplicate rejected: byte array lease works identically to string')
}
```

### Example 3: Asset Transfer with Lease

Leases work with all transaction types, including asset transfers:

```typescript
// Create and configure asset
const assetCreate = await algorand.send.assetCreate({
  sender: sender.addr,
  total: 100n,
  assetName: 'Test Asset',
})
const assetId = BigInt(assetCreate.confirmation.assetIndex!)

// Opt-in to asset
await algorand.send.assetOptIn({
  sender: receiver.addr,
  assetId: assetId,
})

// Use unique lease value per run
const runId = Date.now()

// First asset transfer with lease
const transfer1 = await algorand.send.assetTransfer({
  sender: sender.addr,
  receiver: receiver.addr,
  assetId: assetId,
  amount: 1n,
  lease: `asset-test-${runId}`,
})

// Attempting duplicate asset transfer (will fail)
try {
  await algorand.send.assetTransfer({
    sender: sender.addr,
    receiver: receiver.addr,
    assetId: assetId,
    amount: 2n,
    lease: `asset-test-${runId}`, // Same lease - rejected!
  })
} catch (error) {
  console.log('✓ Duplicate asset transfer rejected')
}
```

## Best Practices

### 1. Use Descriptive Lease Values

**Good** - Descriptive and unique:
```typescript
const orderId = 'order-12345'
await algorand.send.payment({
  lease: `payment-${orderId}`,
  // ... other params
})
```

**Avoid** - Generic or reused values:
```typescript
await algorand.send.payment({
  lease: 'payment', // Too generic, will conflict
  // ... other params
})
```

### 2. Handle Lease Errors Gracefully

```typescript
async function sendIdempotentPayment(params: PaymentParams) {
  try {
    const result = await algorand.send.payment({
      ...params,
      lease: `payment-${params.orderId}`,
    })
    return { success: true, txId: result.transaction.txID() }
  } catch (error) {
    if (error.message.includes('overlapping lease')) {
      // Payment already in progress or recently completed
      return { success: false, reason: 'duplicate-prevented' }
    }
    throw error
  }
}
```

### 3. Lease Naming Conventions

Establish consistent patterns for lease values:

```typescript
// Order-based leases
const orderLease = `order-${orderId}-payment`

// User action leases
const withdrawLease = `withdraw-${userId}-${timestamp}`

// Idempotency key leases
const idempotencyLease = `api-request-${requestId}`
```

### 4. Time-Based Lease Strategies

For operations that should be retriable after a certain time:

```typescript
// Include timestamp for time-limited uniqueness
const dailyLease = `daily-reward-${userId}-${today}`

// Or use round number for block-based uniqueness
const currentRound = await algorand.client.algod.status().do()
const roundLease = `action-${userId}-${currentRound.lastRound}`
```

## Common Use Cases

### 1. Preventing Double Payments

```typescript
async function processPayment(orderId: string, amount: bigint) {
  try {
    return await algorand.send.payment({
      sender: merchantAccount.addr,
      receiver: customerAccount.addr,
      amount: algo(amount),
      lease: `refund-${orderId}`,
    })
  } catch (error) {
    if (error.message.includes('overlapping lease')) {
      console.log(`Refund for order ${orderId} already processed`)
      return null
    }
    throw error
  }
}
```

### 2. Idempotent API Operations

```typescript
app.post('/transfer', async (req, res) => {
  const { requestId, recipient, amount } = req.body

  try {
    const result = await algorand.send.payment({
      sender: apiAccount.addr,
      receiver: recipient,
      amount: algo(amount),
      lease: `api-${requestId}`, // Idempotency key as lease
    })

    res.json({ txId: result.transaction.txID() })
  } catch (error) {
    if (error.message.includes('overlapping lease')) {
      // Return cached result or 409 Conflict
      res.status(409).json({ error: 'Request already processed' })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
})
```

### 3. Distributed System Coordination

```typescript
class DistributedPaymentService {
  async executePayment(jobId: string, params: PaymentParams) {
    const lease = `job-${jobId}`

    try {
      const result = await algorand.send.payment({
        ...params,
        lease: lease,
      })

      await this.recordSuccess(jobId, result.transaction.txID())
      return result
    } catch (error) {
      if (error.message.includes('overlapping lease')) {
        // Another instance is processing this job
        console.log(`Job ${jobId} already being processed`)
        return await this.waitForCompletion(jobId)
      }
      throw error
    }
  }
}
```

### 4. Batch Processing with Lease Safety

```typescript
async function processBatch(items: PaymentItem[]) {
  const results = await Promise.allSettled(
    items.map(async (item) => {
      try {
        return await algorand.send.payment({
          sender: item.sender,
          receiver: item.receiver,
          amount: algo(item.amount),
          lease: `batch-${item.id}`,
        })
      } catch (error) {
        if (error.message.includes('overlapping lease')) {
          return { skipped: true, id: item.id }
        }
        throw error
      }
    })
  )

  return {
    successful: results.filter(r => r.status === 'fulfilled'),
    skipped: results.filter(r => r.value?.skipped),
    failed: results.filter(r => r.status === 'rejected'),
  }
}
```

## Lease Behavior

### Lease Lifetime

- Leases remain active while the transaction is in the pool
- Typically ~1000 rounds (approximately 50 minutes on MainNet)
- After confirmation or expiry, the lease can be reused

### Lease Scope

- Leases are **sender-specific**: Different senders can use the same lease value
- Same lease from same sender = rejected
- Same lease from different senders = allowed

### Lease Comparison

```typescript
// These are equivalent:
lease: 'test'
lease: new Uint8Array(Buffer.from('test'))

// These are different:
lease: 'test'
lease: 'test2'
```

## Error Handling

When a lease collision occurs, you'll receive an error like:

```
TransactionPool.Remember: transaction TXID using an overlapping lease
(sender, lease):(ADDRESS, LEASE_VALUE)
```

Handle this appropriately:

```typescript
function isLeaseError(error: Error): boolean {
  return error.message.includes('overlapping lease')
}

async function retryablePayment(params: PaymentParams) {
  const maxRetries = 3
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      return await algorand.send.payment(params)
    } catch (error) {
      if (isLeaseError(error) && attempt < maxRetries - 1) {
        console.log(`Lease conflict, waiting before retry ${attempt + 1}/${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, 5000))
        attempt++
      } else {
        throw error
      }
    }
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
=== Transaction Lease Idempotency Demo ===

1. STRING LEASE EXAMPLE
✓ First payment successful
✓ Second payment rejected (expected behavior)
  → Lease prevents duplicate transaction

2. BYTE ARRAY LEASE EXAMPLE
✓ First payment successful
✓ Second payment rejected (expected behavior)
  → Byte array lease works the same as string lease

3. ASSET TRANSFER LEASE EXAMPLE
✓ Asset created
✓ First asset transfer successful
✓ Second asset transfer rejected (expected behavior)
  → Leases work for asset transfers too

KEY TAKEAWAYS:
• Leases prevent duplicate transactions during their validity period
• Both string and byte array formats are supported
• Leases work with all transaction types
• Use leases to build idempotent operations in distributed systems
```

## Related Concepts

- **Payment Transactions**: [69-send-payment-transaction](../69-send-payment-transaction)
- **Asset Transfers**: [71-single-asset-opt-in-and-opt-out](../71-single-asset-opt-in-and-opt-out)
- **Transaction Management**: Understanding Algorand transaction lifecycle
- **Idempotency**: Building retry-safe distributed systems

## Learn More

- [Algorand Developer Portal - Transactions](https://developer.algorand.org/docs/get-details/transactions/)
- [Transaction Reference - Leases](https://developer.algorand.org/docs/get-details/transactions/transactions/#lease)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
