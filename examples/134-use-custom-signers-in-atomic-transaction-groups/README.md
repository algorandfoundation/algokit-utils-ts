# Use Custom Signers in Atomic Transaction Groups

This example demonstrates how to use **custom transaction signers** to control signing behavior in atomic transaction groups, including using different signers for different transactions.

## Core Concept

A **TransactionSigner** is a function that signs transactions in an atomic group. Custom signers allow you to:

- Intercept signing operations for logging or auditing
- Apply custom validation logic before signing
- Handle multi-party transactions where different accounts sign different transactions
- Implement custom approval workflows (e.g., for wallet UIs)
- Debug transaction signing issues
- Mock signing behavior for testing

**Signature:**
```typescript
type TransactionSigner = (
  txnGroup: Transaction[],
  indexesToSign: number[]
) => Promise<Uint8Array[]>
```

This example shows 4 different patterns:
1. **Logging Signer** - Intercepts and logs all signing operations
2. **Multi-Party Signer** - Different accounts sign different transactions
3. **Conditional Signer** - Applies validation logic based on transaction content
4. **Debug Signer** - Detailed logging for troubleshooting

## What This Example Shows

### 1. Logging Signer (Example 1)

Intercepts signing operations to log what's being signed:

```typescript
const loggingSigner: TransactionSigner = (transactionGroup, indexesToSign) => {
  console.log('🔐 Custom signer called!')
  console.log(`   Transaction group size: ${transactionGroup.length}`)
  console.log(`   Indexes to sign: ${indexesToSign.join(', ')}`)

  // Log transaction types
  indexesToSign.forEach((idx) => {
    const txn = transactionGroup[idx]
    console.log(`   Transaction ${idx}: ${txn.type}`)
  })

  // After logging, delegate to the actual signer
  return deployer.signer(transactionGroup, indexesToSign)
}

// Use the logging signer for the whole group
const result = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId,
    method: acceptPaymentMethod,
    args: [payment1, 'test-note'],
    signer: loggingSigner,  // Custom signer for all transactions
  })
  .send()
```

**Output:**
```
🔐 Custom signer called!
   Transaction group size: 2
   Indexes to sign: 0, 1
   Transaction 0: pay
   Transaction 1: appl
```

**Use cases:**
- Wallet integrations - log what users are signing
- Auditing - track all signing operations
- Testing - verify signing behavior

### 2. Multi-Party Transactions (Example 2)

Different accounts sign different transactions in the same atomic group:

```typescript
// Create second account
const secondAccount = algorand.account.random()

// Fund it
await algorand.send.payment({
  sender: deployer.addr,
  receiver: secondAccount.addr,
  amount: microAlgos(500_000),
})

// Build atomic group with different signers
const result = await algorand
  .newGroup()
  .addPayment({
    sender: deployer.addr,
    receiver: secondAccount.addr,
    amount: microAlgos(1000),
    // No signer specified - uses deployer's default signer
  })
  .addPayment({
    sender: secondAccount.addr,
    receiver: deployer.addr,
    amount: microAlgos(500),
    signer: secondAccount.signer,  // Explicitly specify second account's signer
  })
  .send()
```

**How it works:**
1. First payment from deployer - signed by deployer's default signer
2. Second payment from secondAccount - signed by secondAccount's custom signer
3. Both transactions in the same atomic group
4. Group succeeds only if both signers sign correctly

**Use cases:**
- Escrow transactions
- Atomic swaps between different parties
- Multi-signature workflows
- Payment splitting

### 3. Conditional Signer (Example 3)

Apply different logic based on transaction content:

```typescript
const conditionalSigner: TransactionSigner = (transactionGroup, indexesToSign) => {
  console.log('🔐 Conditional signer analyzing transactions...')

  indexesToSign.forEach((idx) => {
    const txn = transactionGroup[idx]

    if (txn.type === 'pay') {
      const payTxn = txn as algosdk.Transaction
      const amount = payTxn.amount || 0

      console.log(`   Payment transaction: ${amount} microAlgos`)

      if (amount > 10000) {
        console.log('   ⚠️  High-value payment - requiring additional approval')
        // In a real app, you might show a confirmation dialog here
      } else {
        console.log('   ✓ Low-value payment - auto-approved')
      }
    } else if (txn.type === 'appl') {
      console.log('   Application call - verifying...')
      console.log('   ✓ App call approved')
    }
  })

  // Delegate to actual signer after validation
  return deployer.signer(transactionGroup, indexesToSign)
}

// Use conditional signer
const result = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId,
    method: acceptPaymentMethod,
    args: [payment3, 'high-value-test'],
    signer: conditionalSigner,
  })
  .send()
```

**Output:**
```
🔐 Conditional signer analyzing transactions...
   Payment transaction: 15000 microAlgos
   ⚠️  High-value payment - requiring additional approval
   Application call - verifying...
   ✓ App call approved
```

**Use cases:**
- Risk assessment - flag high-value transactions
- Compliance - enforce business rules
- Approval workflows - require additional confirmation
- Rate limiting - track transaction frequency

### 4. Debug Signer (Example 4)

Detailed logging for troubleshooting:

```typescript
const debugSigner: TransactionSigner = (transactionGroup, indexesToSign) => {
  console.log('🔍 Debug Signer - Transaction Details:')
  console.log(`   Group ID: ${transactionGroup[0].group ? algosdk.encodeAddress(transactionGroup[0].group) : 'none'}`)
  console.log(`   Group size: ${transactionGroup.length}`)
  console.log(`   Signing indexes: ${indexesToSign.join(', ')}\n`)

  transactionGroup.forEach((txn, idx) => {
    const isSigning = indexesToSign.includes(idx)
    console.log(`   Transaction ${idx}:`)
    console.log(`     Type: ${txn.type}`)

    // Handle different ways sender can be represented
    const sender = txn.from || txn.sender
    if (sender) {
      const senderAddr = typeof sender === 'string'
        ? sender
        : algosdk.encodeAddress(sender.publicKey)
      console.log(`     Sender: ${senderAddr}`)
    }

    console.log(`     Fee: ${txn.fee} microAlgos`)
    console.log(`     Signing: ${isSigning ? 'YES' : 'NO'}`)

    if (txn.type === 'pay' && txn.payment) {
      console.log(`     Receiver: ${typeof txn.payment.receiver === 'string' ? txn.payment.receiver : algosdk.encodeAddress(txn.payment.receiver.publicKey)}`)
      console.log(`     Amount: ${txn.payment.amount} microAlgos`)
    } else if (txn.type === 'appl' && txn.applicationCall) {
      console.log(`     App ID: ${txn.applicationCall.appId}`)
      console.log(`     App Args: ${txn.applicationCall.appArgs?.length || 0}`)
    }
    console.log()
  })

  return deployer.signer(transactionGroup, indexesToSign)
}
```

**Output:**
```
🔍 Debug Signer - Transaction Details:
   Group ID: ZNPJC5GSFL54Z6Q6NB6VNPDDEH6R65NJ42QSLYXR6CIMINHG7TTEASKLZM
   Group size: 2
   Signing indexes: 0, 1

   Transaction 0:
     Type: pay
     Sender: LEFKTDT7HUYSP6KCYTFEXGFM3QJ7ZUYOSCZKGVSUEYZC2DOL3H7VAQ45LQ
     Fee: 1000 microAlgos
     Signing: YES
     Receiver: LEFKTDT7HUYSP6KCYTFEXGFM3QJ7ZUYOSCZKGVSUEYZC2DOL3H7VAQ45LQ
     Amount: 4000 microAlgos

   Transaction 1:
     Type: appl
     Sender: LEFKTDT7HUYSP6KCYTFEXGFM3QJ7ZUYOSCZKGVSUEYZC2DOL3H7VAQ45LQ
     Fee: 1000 microAlgos
     Signing: YES
     App ID: 1583
     App Args: 2
```

**Use cases:**
- Development - understand transaction structure
- Debugging - diagnose signing issues
- Testing - verify transaction composition
- Documentation - generate transaction logs

## API Reference

### Creating a Custom Signer

```typescript
import type { TransactionSigner } from 'algosdk'

const customSigner: TransactionSigner = (
  transactionGroup: Transaction[],
  indexesToSign: number[]
) => {
  // 1. Inspect the transactions
  console.log(`Signing ${indexesToSign.length} transactions`)

  // 2. Apply custom logic
  indexesToSign.forEach((idx) => {
    const txn = transactionGroup[idx]
    // Validate, log, or modify signing behavior
  })

  // 3. Delegate to actual signer
  return actualSigner(transactionGroup, indexesToSign)
}
```

### Using a Custom Signer

**For the entire group:**

```typescript
const result = await algorand
  .newGroup()
  .addPayment({
    sender: account.addr,
    receiver: receiver.addr,
    amount: microAlgos(1000),
  })
  .addAppCallMethodCall({
    sender: account.addr,
    appId,
    method: someMethod,
    args: [],
    signer: customSigner,  // Signs all transactions in the group
  })
  .send()
```

**For specific transactions:**

```typescript
const result = await algorand
  .newGroup()
  .addPayment({
    sender: account1.addr,
    receiver: account2.addr,
    amount: microAlgos(1000),
    // Uses account1's default signer
  })
  .addPayment({
    sender: account2.addr,
    receiver: account1.addr,
    amount: microAlgos(500),
    signer: account2.signer,  // Explicitly specify signer
  })
  .send()
```

### Accessing Account Signers

```typescript
// Get signer from an account
const account = algorand.account.random()
const signer = account.signer

// Use in transaction
.addPayment({
  sender: account.addr,
  receiver: receiver.addr,
  amount: microAlgos(1000),
  signer: signer,
})
```

## Common Use Cases

### 1. Wallet Integration

Display transaction details to users before signing:

```typescript
const walletSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  // Show UI with transaction details
  const userApproved = await showApprovalDialog({
    transactions: txnGroup,
    indexesToSign,
  })

  if (!userApproved) {
    throw new Error('User rejected transaction')
  }

  // User approved - sign the transactions
  return actualSigner(txnGroup, indexesToSign)
}
```

### 2. Hardware Wallet Integration

Delegate signing to a hardware device:

```typescript
const hardwareWalletSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  console.log('Please confirm on your hardware wallet...')

  // Send transactions to hardware wallet
  const signedTxns = await hardwareWallet.signTransactions(
    txnGroup,
    indexesToSign
  )

  return signedTxns
}
```

### 3. Spending Limits

Enforce spending limits per transaction:

```typescript
const spendingLimitSigner: TransactionSigner = (txnGroup, indexesToSign) => {
  const DAILY_LIMIT = 1_000_000 // microAlgos

  let totalSpent = 0

  indexesToSign.forEach((idx) => {
    const txn = txnGroup[idx]
    if (txn.type === 'pay') {
      totalSpent += txn.payment.amount
    }
  })

  if (totalSpent > DAILY_LIMIT) {
    throw new Error(`Transaction exceeds daily limit of ${DAILY_LIMIT}`)
  }

  return actualSigner(txnGroup, indexesToSign)
}
```

### 4. Multi-Signature Workflows

Collect signatures from multiple parties:

```typescript
const multiSigSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  // Collect signatures from required signers
  const signatures = await Promise.all([
    signer1(txnGroup, indexesToSign),
    signer2(txnGroup, indexesToSign),
    signer3(txnGroup, indexesToSign),
  ])

  // Combine signatures (implementation depends on your multi-sig setup)
  return combineSignatures(signatures)
}
```

### 5. Audit Logging

Log all transactions for compliance:

```typescript
const auditSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  // Log to audit trail
  await auditLog.record({
    timestamp: Date.now(),
    user: currentUser,
    transactions: txnGroup,
    indexes: indexesToSign,
  })

  // Sign after logging
  return actualSigner(txnGroup, indexesToSign)
}
```

### 6. Rate Limiting

Prevent too many transactions in a short time:

```typescript
const rateLimiter = new Map<string, number>()

const rateLimitedSigner: TransactionSigner = (txnGroup, indexesToSign) => {
  const sender = algosdk.encodeAddress(txnGroup[0].from.publicKey)
  const now = Date.now()
  const lastTxn = rateLimiter.get(sender) || 0

  if (now - lastTxn < 1000) {  // 1 second cooldown
    throw new Error('Rate limit exceeded - please wait')
  }

  rateLimiter.set(sender, now)
  return actualSigner(txnGroup, indexesToSign)
}
```

### 7. Testing and Mocking

Mock signing behavior for tests:

```typescript
const mockSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  // Return pre-signed transactions for testing
  return indexesToSign.map((idx) => {
    return new Uint8Array([/* mock signed bytes */])
  })
}

// Use in tests
it('should handle signed transactions', async () => {
  const result = await algorand
    .newGroup()
    .addPayment({
      sender: testAccount.addr,
      receiver: receiver.addr,
      amount: microAlgos(1000),
      signer: mockSigner,
    })
    .send()

  expect(result.txIds).toHaveLength(1)
})
```

## Security Considerations

### 1. Validate Before Signing

Always inspect transactions before signing:

```typescript
const secureSigner: TransactionSigner = (txnGroup, indexesToSign) => {
  indexesToSign.forEach((idx) => {
    const txn = txnGroup[idx]

    // Validate sender
    if (txn.from.publicKey !== expectedSender) {
      throw new Error('Unexpected sender')
    }

    // Validate receiver (for payments)
    if (txn.type === 'pay' && txn.payment.receiver !== expectedReceiver) {
      throw new Error('Unexpected receiver')
    }

    // Validate amount
    if (txn.type === 'pay' && txn.payment.amount > maxAmount) {
      throw new Error('Amount exceeds maximum')
    }
  })

  return actualSigner(txnGroup, indexesToSign)
}
```

### 2. Verify Group Integrity

Check that the group hasn't been tampered with:

```typescript
const groupVerifySigner: TransactionSigner = (txnGroup, indexesToSign) => {
  // Verify all transactions have the same group ID
  const groupId = txnGroup[0].group

  if (!groupId) {
    throw new Error('Missing group ID')
  }

  for (const txn of txnGroup) {
    if (!txn.group || !txn.group.equals(groupId)) {
      throw new Error('Group ID mismatch')
    }
  }

  return actualSigner(txnGroup, indexesToSign)
}
```

### 3. Protect Private Keys

Never log or expose private keys:

```typescript
// ❌ BAD - Exposes private key
const badSigner: TransactionSigner = (txnGroup, indexesToSign) => {
  console.log('Private key:', account.sk)  // NEVER DO THIS!
  return actualSigner(txnGroup, indexesToSign)
}

// ✅ GOOD - Only logs public information
const goodSigner: TransactionSigner = (txnGroup, indexesToSign) => {
  console.log('Signing transactions:', indexesToSign)
  console.log('Public address:', account.addr)
  return actualSigner(txnGroup, indexesToSign)
}
```

### 4. Handle Errors Gracefully

Don't expose sensitive information in errors:

```typescript
const errorHandlingSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  try {
    return await actualSigner(txnGroup, indexesToSign)
  } catch (error) {
    // Log error internally
    console.error('Signing failed:', error)

    // Throw user-friendly error
    throw new Error('Failed to sign transaction. Please try again.')
  }
}
```

### 5. Implement Timeout Protection

Prevent hanging on user approval:

```typescript
const timeoutSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  const timeout = 30000 // 30 seconds

  const signingPromise = actualSigner(txnGroup, indexesToSign)
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Signing timeout')), timeout)
  })

  return Promise.race([signingPromise, timeoutPromise]) as Promise<Uint8Array[]>
}
```

## Best Practices

### 1. Keep Signers Focused

Each signer should have a single responsibility:

✅ **Good:**
```typescript
const loggingSigner = createLoggingSigner(actualSigner)
const validatingSigner = createValidatingSigner(loggingSigner)
const rateLimitingSigner = createRateLimitingSigner(validatingSigner)
```

❌ **Bad:**
```typescript
const bloatedSigner = (txnGroup, indexesToSign) => {
  // Doing too much in one signer
  logTransaction()
  validateTransaction()
  checkRateLimit()
  checkSpendingLimit()
  auditLog()
  return actualSigner(txnGroup, indexesToSign)
}
```

### 2. Chain Signers

Compose multiple signers for complex workflows:

```typescript
function createSignerChain(...signers: TransactionSigner[]): TransactionSigner {
  return (txnGroup, indexesToSign) => {
    // Execute signers in sequence
    return signers.reduce(
      (promise, signer) => promise.then(() => signer(txnGroup, indexesToSign)),
      Promise.resolve([] as Uint8Array[])
    )
  }
}

// Use it
const chainedSigner = createSignerChain(
  loggingSigner,
  validatingSigner,
  actualSigner
)
```

### 3. Provide Clear Error Messages

Help users understand what went wrong:

✅ **Good:**
```typescript
if (amount > limit) {
  throw new Error(
    `Transaction amount (${amount} µALGO) exceeds daily limit (${limit} µALGO)`
  )
}
```

❌ **Bad:**
```typescript
if (amount > limit) {
  throw new Error('Error')
}
```

### 4. Document Signer Behavior

Explain what each signer does:

```typescript
/**
 * Creates a signer that enforces spending limits
 *
 * @param dailyLimit - Maximum microAlgos that can be spent per day
 * @param actualSigner - The underlying signer to delegate to
 * @returns A signer that enforces the spending limit
 *
 * @throws Error if the transaction would exceed the daily limit
 *
 * @example
 * const limitedSigner = createSpendingLimitSigner(
 *   1_000_000,  // 1 ALGO daily limit
 *   account.signer
 * )
 */
function createSpendingLimitSigner(
  dailyLimit: number,
  actualSigner: TransactionSigner
): TransactionSigner {
  return (txnGroup, indexesToSign) => {
    // Implementation...
  }
}
```

### 5. Test Thoroughly

Test all code paths in your signers:

```typescript
describe('Custom Signer', () => {
  it('should sign valid transactions', async () => {
    const result = await customSigner(validTxns, [0])
    expect(result).toHaveLength(1)
  })

  it('should reject invalid transactions', async () => {
    await expect(
      customSigner(invalidTxns, [0])
    ).rejects.toThrow('Invalid transaction')
  })

  it('should handle empty index array', async () => {
    const result = await customSigner(validTxns, [])
    expect(result).toHaveLength(0)
  })

  it('should handle multiple transactions', async () => {
    const result = await customSigner(validTxns, [0, 1, 2])
    expect(result).toHaveLength(3)
  })
})
```

## Common Pitfalls

### 1. Forgetting to Delegate

**Problem:**
```typescript
const brokenSigner: TransactionSigner = (txnGroup, indexesToSign) => {
  console.log('Logging...')
  // ❌ Never calls the actual signer!
}
```

**Solution:**
```typescript
const workingSigner: TransactionSigner = (txnGroup, indexesToSign) => {
  console.log('Logging...')
  return actualSigner(txnGroup, indexesToSign)  // ✅ Delegate to actual signer
}
```

### 2. Modifying Transaction Group

**Problem:**
```typescript
const badSigner: TransactionSigner = (txnGroup, indexesToSign) => {
  txnGroup[0].fee = 2000  // ❌ Modifying the group!
  return actualSigner(txnGroup, indexesToSign)
}
```

**Result:** Group ID changes, breaking atomic execution

**Solution:** Don't modify transactions in the signer

### 3. Signing Wrong Indexes

**Problem:**
```typescript
const wrongSigner: TransactionSigner = (txnGroup, indexesToSign) => {
  // ❌ Signing all transactions instead of just indexesToSign
  return actualSigner(txnGroup, [0, 1, 2])
}
```

**Solution:**
```typescript
const correctSigner: TransactionSigner = (txnGroup, indexesToSign) => {
  // ✅ Sign only the specified indexes
  return actualSigner(txnGroup, indexesToSign)
}
```

### 4. Not Handling Async Properly

**Problem:**
```typescript
const asyncSigner: TransactionSigner = (txnGroup, indexesToSign) => {
  // ❌ Not awaiting async operations
  logToDatabase(txnGroup)
  return actualSigner(txnGroup, indexesToSign)
}
```

**Solution:**
```typescript
const asyncSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  // ✅ Await async operations
  await logToDatabase(txnGroup)
  return actualSigner(txnGroup, indexesToSign)
}
```

### 5. Exposing Sensitive Information

**Problem:**
```typescript
const unsafeSigner: TransactionSigner = (txnGroup, indexesToSign) => {
  console.log('Private key:', account.sk)  // ❌ Logged to console!
  return actualSigner(txnGroup, indexesToSign)
}
```

**Solution:** Only log public information

## Related Examples

- **Example 24**: Method calls with ABI (demonstrates ABI method signing)
- **Example 25**: Method calls with transaction arguments
- **Example 133**: Update a deployed updatable application

## Resources

- [Algorand Transaction Groups](https://developer.algorand.org/docs/get-details/atomic_transfers/)
- [AlgoSDK TransactionSigner](https://algorand.github.io/js-algorand-sdk/types/TransactionSigner.html)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
