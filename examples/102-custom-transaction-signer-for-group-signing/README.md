# Custom Transaction Signer for Group Signing

This example demonstrates how to implement a custom TransactionSigner to control signing logic for transaction groups. Custom signers are essential for wallet integrations, auditing, and implementing custom signing workflows.

## Key Concepts

- **TransactionSigner**: Interface from algosdk for signing transactions
- **Transaction Groups**: Multiple transactions executed atomically
- **Custom Signing Logic**: Intercepting and controlling transaction signing
- **Signer Delegation**: Wrapping default signers with custom behavior
- **Index Tracking**: Identifying which transactions in a group need signing

## What This Example Shows

1. Creating a custom TransactionSigner implementation
2. Tracking which transactions are being signed in a group
3. Adding custom logic before delegating to default signers
4. Using custom signers with ABI method calls
5. Understanding transaction group signing patterns

## Code Walkthrough

### Initialize and Create Accounts

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

const alice = algorand.account.random()
const bob = algorand.account.random()

await algorand.account.ensureFunded(alice, dispenser, (5).algos())
await algorand.account.ensureFunded(bob, dispenser, (2).algos())
```

Set up the Algorand client and create funded accounts for testing.

### Deploy Application

```typescript
const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: alice.addr,
})

const { appClient } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 100,
  },
})
```

Deploy an application that accepts transaction arguments in its ABI methods.

### Create a Transaction for Group

```typescript
const paymentAmount = (0.5).algos()
const paymentTxn = await algorand.createTransaction.payment({
  sender: alice.addr,
  receiver: bob.addr,
  amount: paymentAmount,
})
```

Create a payment transaction that will be passed as an argument to the ABI method.

### Implement Custom TransactionSigner

```typescript
let signedIndexes: number[] = []
let signerCallCount = 0

const customSigner: TransactionSigner = (txnGroup, indexesToSign) => {
  signerCallCount++
  console.log(`Custom signer called (call #${signerCallCount})`)
  console.log(`Transaction group size: ${txnGroup.length}`)
  console.log(`Indexes to sign: [${indexesToSign.join(', ')}]`)

  // Store the indexes for tracking
  signedIndexes = indexesToSign

  // In a real implementation, you might:
  // - Show a wallet UI prompt
  // - Apply signing policies (amount limits, whitelists)
  // - Log to an audit system
  // - Add rate limiting
  // - Require additional authentication

  // Delegate to the default signer for actual signing
  return alice.signer(txnGroup, indexesToSign)
}
```

**Key points**:
- The `TransactionSigner` function receives the full transaction group
- `indexesToSign` specifies which transactions in the group this signer should sign
- You can add any custom logic before delegating to the actual signer
- Must return an array of signed transactions

### Use Custom Signer with ABI Call

```typescript
const result = await appClient.send.callAbiTxn({
  args: {
    txn: { txn: paymentTxn, signer: customSigner },
    value: 'Signed with custom signer!',
  },
})
```

**Important**: When passing a transaction argument to an ABI method, you can specify a custom signer for that transaction. The SDK will use this signer when signing the transaction group.

## API Patterns (AlgoKit Utils v9.1.2)

### TransactionSigner Interface

```typescript
type TransactionSigner = (
  txnGroup: Transaction[],
  indexesToSign: number[]
) => Promise<Uint8Array[]>

// Parameters:
// - txnGroup: Array of all transactions in the group
// - indexesToSign: Array of indexes this signer should sign

// Returns:
// - Promise<Uint8Array[]>: Array of signed transaction bytes
```

### Creating a Custom Signer

```typescript
import { TransactionSigner } from 'algosdk'

const customSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  // Your custom logic here
  console.log(`Signing ${indexesToSign.length} transactions`)

  // Delegate to default signer
  return defaultAccount.signer(txnGroup, indexesToSign)
}
```

### Using Custom Signer with Transactions

```typescript
// Option 1: As part of transaction argument
await appClient.send.methodName({
  args: {
    txn: {
      txn: transaction,
      signer: customSigner
    },
  },
})

// Option 2: As account signer
const accountWithCustomSigner = {
  addr: account.addr,
  signer: customSigner,
}

await algorand.send.payment({
  sender: accountWithCustomSigner.addr,
  receiver: recipient.addr,
  amount: (1).algos(),
})
```

### Accessing Default Signer

```typescript
// From a SigningAccount
const defaultSigner = account.signer

// Call the default signer
const signedTxns = await defaultSigner(txnGroup, indexesToSign)
```

## Common Use Cases

### Wallet Integration with User Confirmation

```typescript
const walletSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  // Show UI dialog to user
  const approved = await showWalletPrompt({
    message: `Sign ${indexesToSign.length} transactions?`,
    transactions: txnGroup.filter((_, i) => indexesToSign.includes(i)),
  })

  if (!approved) {
    throw new Error('User rejected transaction signing')
  }

  // User approved, proceed with signing
  return userAccount.signer(txnGroup, indexesToSign)
}
```

### Amount Limit Policy

```typescript
const limitedSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  // Check amount limits
  for (const index of indexesToSign) {
    const txn = txnGroup[index]

    if (txn.type === 'pay' && txn.amount > 10_000_000) {
      throw new Error(`Transaction exceeds limit: ${txn.amount} microAlgos`)
    }
  }

  return account.signer(txnGroup, indexesToSign)
}
```

### Audit Logging

```typescript
const auditSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  // Log to audit system
  await auditLog.record({
    timestamp: new Date(),
    account: account.addr,
    transactionCount: indexesToSign.length,
    groupId: txnGroup[0].group ? Buffer.from(txnGroup[0].group).toString('base64') : undefined,
  })

  return account.signer(txnGroup, indexesToSign)
}
```

### Address Whitelist

```typescript
const whitelistSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  const allowedAddresses = new Set([
    'ADDRESS1...',
    'ADDRESS2...',
    'ADDRESS3...',
  ])

  // Check all recipients are whitelisted
  for (const index of indexesToSign) {
    const txn = txnGroup[index]

    if (txn.type === 'pay') {
      const receiver = algosdk.encodeAddress(txn.to.publicKey)
      if (!allowedAddresses.has(receiver)) {
        throw new Error(`Recipient ${receiver} is not whitelisted`)
      }
    }
  }

  return account.signer(txnGroup, indexesToSign)
}
```

### Rate Limiting

```typescript
class RateLimitedSigner {
  private signingHistory: Date[] = []
  private maxSigningsPerMinute = 10

  createSigner(account: SigningAccount): TransactionSigner {
    return async (txnGroup: Transaction[], indexesToSign: number[]) => {
      // Clean old entries (older than 1 minute)
      const oneMinuteAgo = new Date(Date.now() - 60000)
      this.signingHistory = this.signingHistory.filter(d => d > oneMinuteAgo)

      // Check rate limit
      if (this.signingHistory.length >= this.maxSigningsPerMinute) {
        throw new Error('Rate limit exceeded. Please wait before signing more transactions.')
      }

      // Record this signing
      this.signingHistory.push(new Date())

      return account.signer(txnGroup, indexesToSign)
    }
  }
}

const rateLimiter = new RateLimitedSigner()
const rateLimitedSigner = rateLimiter.createSigner(account)
```

### Multi-Signature Coordinator

```typescript
const multiSigCoordinator: TransactionSigner = async (txnGroup, indexesToSign) => {
  console.log('Collecting signatures from multiple parties...')

  // Collect signatures from first signer
  const signatures1 = await signer1(txnGroup, indexesToSign)

  // Collect signatures from second signer
  const signatures2 = await signer2(txnGroup, indexesToSign)

  // Combine signatures (implementation depends on multisig scheme)
  return combineMultisigSignatures(signatures1, signatures2, indexesToSign)
}
```

### Testing/Mock Signer

```typescript
const mockSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  console.log('[TEST] Would sign transactions:', indexesToSign)

  // In tests, you might want to use the default signer
  // or return mock signatures
  if (process.env.NODE_ENV === 'test') {
    return testAccount.signer(txnGroup, indexesToSign)
  }

  throw new Error('Mock signer: Not in test mode')
}
```

## Important Considerations

### Transaction Signer Contract

```typescript
// MUST return signed transactions for all indexes in indexesToSign
// MUST return them in the same order as indexesToSign
// MUST return Promise<Uint8Array[]>

const signer: TransactionSigner = async (txnGroup, indexesToSign) => {
  const signedTxns: Uint8Array[] = []

  for (const index of indexesToSign) {
    // Sign transaction at this index
    const signedTxn = txnGroup[index].signTxn(privateKey)
    signedTxns.push(signedTxn)
  }

  return signedTxns
}
```

### Understanding indexesToSign

```typescript
// If txnGroup has 3 transactions: [txn0, txn1, txn2]
// And indexesToSign is [0, 2]
// Then you must sign txn0 and txn2, but NOT txn1

const signer: TransactionSigner = async (txnGroup, indexesToSign) => {
  console.log(`Total transactions in group: ${txnGroup.length}`)
  console.log(`Transactions I need to sign: ${indexesToSign.length}`)

  // Only sign the specified indexes
  return account.signer(txnGroup, indexesToSign)
}
```

### Error Handling

```typescript
const errorHandlingSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  try {
    // Validate before signing
    validateTransactions(txnGroup, indexesToSign)

    // Sign transactions
    return await account.signer(txnGroup, indexesToSign)
  } catch (error) {
    // Log error for debugging
    console.error('Signing failed:', error)

    // Rethrow to prevent transaction submission
    throw new Error(`Transaction signing failed: ${error.message}`)
  }
}
```

### Asynchronous Operations

```typescript
const asyncSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  // You can perform async operations before signing
  await checkBalances(account.addr)
  await validateWithBackend(txnGroup)
  await requestUserApproval()

  // Then sign
  return account.signer(txnGroup, indexesToSign)
}
```

### State Management

```typescript
class StatefulSigner {
  private transactionCount = 0

  createSigner(account: SigningAccount): TransactionSigner {
    return async (txnGroup: Transaction[], indexesToSign: number[]) => {
      this.transactionCount += indexesToSign.length
      console.log(`Total transactions signed: ${this.transactionCount}`)

      return account.signer(txnGroup, indexesToSign)
    }
  }
}
```

### Security Considerations

```typescript
const secureSigner: TransactionSigner = async (txnGroup, indexesToSign) => {
  // ⚠️ SECURITY CHECKS ⚠️

  // 1. Verify transaction recipients
  for (const index of indexesToSign) {
    const txn = txnGroup[index]
    if (txn.type === 'pay') {
      // Check recipient is expected
      verifyRecipient(algosdk.encodeAddress(txn.to.publicKey))
    }
  }

  // 2. Check amounts don't exceed limits
  const totalAmount = txnGroup
    .filter((_, i) => indexesToSign.includes(i))
    .filter(txn => txn.type === 'pay')
    .reduce((sum, txn) => sum + (txn.amount || 0), 0)

  if (totalAmount > MAX_AMOUNT) {
    throw new Error('Total amount exceeds maximum')
  }

  // 3. Verify no rekeying
  for (const index of indexesToSign) {
    if (txnGroup[index].reKeyTo) {
      throw new Error('Rekeying not allowed')
    }
  }

  return account.signer(txnGroup, indexesToSign)
}
```

## Expected Output

```
Alice address: KKR7RTGNQMG4DGHCI6LNHXQGYFGX3RHUKQ7U6AOSYMC2CLQANULDJENNGA
Bob address: DL5KRSUBAHRCWI4Z7GKKBNYBQIWXDYTHYTX6EWL6VFHRX2SS5W3GE25WWQ

=== Deploying Application ===

✅ App deployed successfully!
App ID: 1632n

=== Creating Payment Transaction ===

Payment amount: 0.5 ALGOs (500000 microAlgos)
From: Alice → To: Bob

=== Calling ABI Method with Custom Signer ===

Method: callAbiTxn(txn: PayTxn, value: string)
This will create a transaction group:
  [0] Payment transaction (passed as argument)
  [1] App call transaction (ABI method call)

📝 Custom signer called (call #1)
   Transaction group size: 2
   Indexes to sign: [0]

✅ Transaction group signed and sent successfully!

=== Transaction Group Details ===

Group ID: XLa1E4tFIZ3wPGY31n77Dor7ceeg8v6nQxqkeIqRTss=
Total transactions in group: 2

Transaction 0:
  Transaction ID: COSYBTX22JM44W7E347HKWRV35RR6IR42F6RCIGAOQM7TMLUZPTQ
  Type: Payment
  Details: Payment of 0.5 ALGOs from Alice to Bob

Transaction 1:
  Transaction ID: CCVQGHTL5E5IIAK4ML3GBU4NIDLIFZYFFWUMTWECF5P665VXNM4A
  Type: Application Call
  Details: App call to method 'callAbiTxn'

=== Custom Signer Results ===

Signer was called: 1 time(s)
Signed transaction indexes: [0]

💡 Key Takeaways:
  • The custom signer was invoked to sign the transaction group
  • It tracked which transactions needed signing
  • It delegated to the default signer for actual signing
  • All transactions were atomically grouped and submitted

✅ Example completed successfully!
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
1. Create and fund test accounts (Alice and Bob)
2. Deploy a test application
3. Create a payment transaction
4. Implement a custom transaction signer
5. Call an ABI method with the custom signer
6. Track and display which transactions were signed

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand Transaction Signing](https://developer.algorand.org/docs/get-details/transactions/signatures/)
- [Transaction Groups](https://developer.algorand.org/docs/get-details/atomic_transfers/)
- [Algosdk TransactionSigner](https://algorand.github.io/js-algorand-sdk/)
- [ABI Method Calls](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#application-calls-with-abi)
