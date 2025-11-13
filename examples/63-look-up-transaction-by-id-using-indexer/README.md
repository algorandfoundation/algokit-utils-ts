# Look Up Transaction by ID Using Indexer

This example demonstrates how to retrieve and verify a specific transaction from the blockchain using its transaction ID with the Algorand Indexer. Looking up transactions is essential for tracking payments, verifying deliveries, and auditing blockchain activity.

## What This Example Shows

This example teaches you how to:
- Send a payment transaction to the blockchain
- Wait for the indexer to catch up and index the transaction
- Look up a transaction by its ID using the indexer
- Access detailed transaction information
- Verify transaction details match expectations
- Confirm transaction was successfully recorded

## Why This Matters

Transaction lookup is fundamental for blockchain applications:

1. **Payment Verification**: Confirm payments were received
2. **Transaction Tracking**: Monitor transaction status and confirmations
3. **Audit Trail**: Retrieve historical transaction data for auditing
4. **Dispute Resolution**: Verify transaction details in case of disputes
5. **Receipt Generation**: Create receipts with transaction proof
6. **Integration Testing**: Verify your application's transactions work correctly

Key concepts:
- **Transaction ID**: Unique identifier for each transaction
- **Indexer Lookup**: Efficient query for transaction data
- **Transaction Details**: Sender, receiver, amount, round, timestamp
- **Confirmation**: Round number where transaction was confirmed
- **Indexer Lag**: Small delay before transactions appear in indexer

Common scenarios:
- E-commerce verifying customer payments
- Wallets displaying transaction history
- Payment processors tracking transfers
- Accounting systems recording blockchain transactions
- Auditors verifying financial records
- Applications generating transaction receipts

## How It Works

### 1. Initialize Client and Accounts

Set up AlgorandClient and create test accounts:

```typescript
import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

// Initialize AlgorandClient for LocalNet
const algorand = AlgorandClient.defaultLocalNet()

// Get dispenser account for funding
const dispenser = await algorand.account.localNetDispenser()

// Create test accounts
const sender = await algorand.account.random()
const receiver = await algorand.account.random()
```

Setup details:
- `defaultLocalNet()` connects to LocalNet
- `localNetDispenser()` gets funding account
- `random()` creates new random accounts
- Test accounts simulate real-world scenarios

### 2. Fund and Send Transaction

Fund the sender and send a payment transaction:

```typescript
// Fund the sender account
console.log('Funding sender account...')
await algorand.send.payment({
  sender: dispenser.addr,
  receiver: sender.addr,
  amount: algo(10),
})

// Send a payment transaction
console.log('Sending test transaction...')
const result = await algorand.send.payment({
  sender: sender.addr,
  receiver: receiver.addr,
  amount: algo(1),
  signer: sender,
})

const txId = result.transaction.txID()
console.log(`Transaction sent with ID: ${txId}`)
console.log(`First valid round: ${result.transaction.firstValid}`)
```

Transaction details:
- First transaction funds sender with 10 ALGO
- Second transaction sends 1 ALGO to receiver
- `txID()` returns the transaction identifier
- `firstValid` is the first round where transaction is valid
- Transaction ID is used for later lookup

### 3. Wait for Indexer to Index Transaction

Implement polling to wait for the indexer:

```typescript
console.log('\nWaiting for indexer to index the transaction...')
let txnInfo
const maxAttempts = 20

for (let i = 0; i < maxAttempts; i++) {
  try {
    txnInfo = await algorand.client.indexer.lookupTransactionByID(txId).do()
    console.log('✓ Transaction indexed!')
    break
  } catch (error) {
    console.log(`   Waiting for indexer... (attempt ${i + 1}/${maxAttempts})`)
    await new Promise(resolve => setTimeout(resolve, 2000))
    if (i === maxAttempts - 1) {
      throw new Error('Transaction not indexed in time')
    }
  }
}
```

Synchronization logic:
- Indexer may lag a few seconds behind blockchain
- Poll with retries until transaction is found
- 2-second delay between attempts (configurable)
- Maximum 20 attempts (40 seconds total)
- Throws error if not indexed in time
- Essential for reliable transaction lookups

### 4. Access Transaction Information

Display detailed transaction information:

```typescript
console.log('\n=== Transaction Information ===')
console.log(`Transaction ID: ${txnInfo!.transaction.id}`)
console.log(`Current Round: ${txnInfo!.currentRound}`)
console.log(`Sender: ${txnInfo!.transaction.sender}`)
console.log(`Receiver: ${txnInfo!.transaction.paymentTransaction!.receiver}`)
console.log(`Amount: ${txnInfo!.transaction.paymentTransaction!.amount} microAlgos`)
console.log(`Round Time: ${txnInfo!.transaction.roundTime}`)
console.log(`Confirmed Round: ${txnInfo!.transaction.confirmedRound}`)
```

Available properties:
- `transaction.id` - Transaction ID (string)
- `currentRound` - Indexer's current round (number)
- `transaction.sender` - Sender address (string)
- `transaction.paymentTransaction.receiver` - Receiver address (string)
- `transaction.paymentTransaction.amount` - Amount in microAlgos (number)
- `transaction.roundTime` - Unix timestamp of block (number)
- `transaction.confirmedRound` - Round where confirmed (number)

### 5. Verify Transaction Details

Confirm the transaction was recorded correctly:

```typescript
// Verify the transaction was found correctly
if (txnInfo!.transaction.id === txId) {
  console.log('\n✓ Transaction successfully verified!')
} else {
  console.log('\n✗ Transaction ID mismatch!')
}

// Verify the current round is at or after the first valid round
if (txnInfo!.currentRound >= result.transaction.firstValid) {
  console.log('✓ Transaction confirmed on the blockchain')
}
```

Verification checks:
- Compare returned ID with expected ID
- Ensures lookup returned correct transaction
- Check current round vs first valid round
- Confirms transaction was confirmed
- Good practice for production applications

## Prerequisites

- AlgoKit installed and AlgoKit LocalNet running
- Node.js and npm installed
- AlgoKit Utils TypeScript (`@algorandfoundation/algokit-utils`) v9.1.2+
- algosdk v3.5.2+

## Running the Example

1. Start AlgoKit LocalNet:
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
Funding sender account...
Sending 10000000 µALGO from L3T2BF5MPTEEDGCSVW7CZXTS5VDKUIANU75SZWVET75N3TPCLTCMNE3LIE to JUFM4PMZMQJPZ3JHFN7INBXPG5C4YX6NLF7S2QUWHEI5VMMNJYUZCMIN64 via transaction 5HOGRVGWCW5EQCWPHEAF3MZR3PTXWZMMNTEIBDPR43LVPRGFBBCA
Sending test transaction...
Sending 1000000 µALGO from JUFM4PMZMQJPZ3JHFN7INBXPG5C4YX6NLF7S2QUWHEI5VMMNJYUZCMIN64 to DTBXZTLE3DJIVLH7UUN55DBE2RQIVE3RZ6SWK3SQEXPZV6HOGLMJMQXT54 via transaction MO3CK5BUCNK26TECU4AQH3VUDKTBCP26NMS6QW52J4GSOTTYMYEA
Transaction sent with ID: MO3CK5BUCNK26TECU4AQH3VUDKTBCP26NMS6QW52J4GSOTTYMYEA
First valid round: 94

Waiting for indexer to index the transaction...
   Waiting for indexer... (attempt 1/20)
   Waiting for indexer... (attempt 2/20)
   Waiting for indexer... (attempt 3/20)
   Waiting for indexer... (attempt 4/20)
   Waiting for indexer... (attempt 5/20)
✓ Transaction indexed!

=== Transaction Information ===
Transaction ID: MO3CK5BUCNK26TECU4AQH3VUDKTBCP26NMS6QW52J4GSOTTYMYEA
Current Round: 96
Sender: JUFM4PMZMQJPZ3JHFN7INBXPG5C4YX6NLF7S2QUWHEI5VMMNJYUZCMIN64
Receiver: DTBXZTLE3DJIVLH7UUN55DBE2RQIVE3RZ6SWK3SQEXPZV6HOGLMJMQXT54
Amount: 1000000 microAlgos
Round Time: 1762984933
Confirmed Round: 96

✓ Transaction successfully verified!
✓ Transaction confirmed on the blockchain
```

## Common Patterns

### Basic Transaction Lookup

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

async function lookupTransaction(txId: string) {
  const algorand = AlgorandClient.defaultLocalNet()

  // Look up transaction by ID
  const txnInfo = await algorand.client.indexer
    .lookupTransactionByID(txId)
    .do()

  console.log(`Transaction found:`)
  console.log(`  ID: ${txnInfo.transaction.id}`)
  console.log(`  Round: ${txnInfo.transaction.confirmedRound}`)

  return txnInfo
}
```

### Lookup with Retry Logic

```typescript
async function reliableLookup(txId: string, maxAttempts = 20) {
  const algorand = AlgorandClient.defaultLocalNet()

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const txnInfo = await algorand.client.indexer
        .lookupTransactionByID(txId)
        .do()
      return txnInfo
    } catch (error) {
      if (i === maxAttempts - 1) {
        throw new Error(`Transaction ${txId} not found after ${maxAttempts} attempts`)
      }
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
}

const txnInfo = await reliableLookup('SOME_TX_ID')
```

### Verify Payment Transaction

```typescript
async function verifyPayment(
  txId: string,
  expectedSender: string,
  expectedReceiver: string,
  expectedAmount: bigint
): Promise<boolean> {
  const algorand = AlgorandClient.defaultLocalNet()

  try {
    const txnInfo = await algorand.client.indexer
      .lookupTransactionByID(txId)
      .do()

    const payment = txnInfo.transaction.paymentTransaction
    if (!payment) {
      console.log('Not a payment transaction')
      return false
    }

    const verified =
      txnInfo.transaction.sender === expectedSender &&
      payment.receiver === expectedReceiver &&
      payment.amount === expectedAmount

    if (verified) {
      console.log('✓ Payment verified successfully')
    } else {
      console.log('✗ Payment details do not match')
    }

    return verified
  } catch (error) {
    console.error('Transaction not found:', error.message)
    return false
  }
}

// Usage
const isValid = await verifyPayment(
  'SOME_TX_ID',
  'SENDER_ADDRESS',
  'RECEIVER_ADDRESS',
  1000000n // 1 ALGO
)
```

### Get Transaction Receipt

```typescript
interface TransactionReceipt {
  id: string
  sender: string
  receiver: string
  amount: number
  timestamp: number
  round: number
  confirmed: boolean
}

async function getTransactionReceipt(txId: string): Promise<TransactionReceipt> {
  const algorand = AlgorandClient.defaultLocalNet()

  const txnInfo = await algorand.client.indexer
    .lookupTransactionByID(txId)
    .do()

  const payment = txnInfo.transaction.paymentTransaction!

  return {
    id: txnInfo.transaction.id,
    sender: txnInfo.transaction.sender,
    receiver: payment.receiver,
    amount: payment.amount,
    timestamp: txnInfo.transaction.roundTime,
    round: txnInfo.transaction.confirmedRound,
    confirmed: true,
  }
}

const receipt = await getTransactionReceipt('SOME_TX_ID')
console.log('Receipt:', JSON.stringify(receipt, null, 2))
```

### Wait for Transaction Confirmation

```typescript
async function waitForTransaction(txId: string, maxWaitSeconds = 60): Promise<boolean> {
  const algorand = AlgorandClient.defaultLocalNet()
  const maxAttempts = Math.ceil(maxWaitSeconds / 2)

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const txnInfo = await algorand.client.indexer
        .lookupTransactionByID(txId)
        .do()

      if (txnInfo.transaction.confirmedRound) {
        console.log(`✓ Transaction confirmed in round ${txnInfo.transaction.confirmedRound}`)
        return true
      }
    } catch (error) {
      // Transaction not yet indexed
    }

    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  console.log(`✗ Transaction not confirmed within ${maxWaitSeconds} seconds`)
  return false
}

const confirmed = await waitForTransaction('SOME_TX_ID', 30)
```

### Lookup Multiple Transactions

```typescript
async function lookupMultipleTransactions(txIds: string[]) {
  const algorand = AlgorandClient.defaultLocalNet()

  const results = await Promise.allSettled(
    txIds.map(async (txId) => {
      try {
        const txnInfo = await algorand.client.indexer
          .lookupTransactionByID(txId)
          .do()

        return {
          txId,
          status: 'found' as const,
          sender: txnInfo.transaction.sender,
          round: txnInfo.transaction.confirmedRound,
        }
      } catch (error) {
        return {
          txId,
          status: 'not-found' as const,
          error: error.message,
        }
      }
    })
  )

  return results.map(r => r.status === 'fulfilled' ? r.value : null)
}

const txIds = ['TX_ID_1', 'TX_ID_2', 'TX_ID_3']
const transactions = await lookupMultipleTransactions(txIds)
console.log('Transactions:', transactions)
```

### Check Transaction Type

```typescript
async function getTransactionType(txId: string): Promise<string> {
  const algorand = AlgorandClient.defaultLocalNet()

  const txnInfo = await algorand.client.indexer
    .lookupTransactionByID(txId)
    .do()

  if (txnInfo.transaction.paymentTransaction) {
    return 'payment'
  } else if (txnInfo.transaction.assetTransferTransaction) {
    return 'asset-transfer'
  } else if (txnInfo.transaction.applicationTransaction) {
    return 'application-call'
  } else if (txnInfo.transaction.assetConfigTransaction) {
    return 'asset-config'
  } else if (txnInfo.transaction.assetFreezeTransaction) {
    return 'asset-freeze'
  } else if (txnInfo.transaction.keyRegTransaction) {
    return 'key-registration'
  } else {
    return 'unknown'
  }
}

const type = await getTransactionType('SOME_TX_ID')
console.log(`Transaction type: ${type}`)
```

## Best Practices

1. **Always Wait for Indexer**
   ```typescript
   // Good: Wait for indexer to catch up
   async function safeLookup(txId: string) {
     const maxAttempts = 20
     for (let i = 0; i < maxAttempts; i++) {
       try {
         return await indexer.lookupTransactionByID(txId).do()
       } catch (error) {
         await new Promise(resolve => setTimeout(resolve, 2000))
       }
     }
     throw new Error('Transaction not found')
   }

   // Avoid: Immediate lookup may fail
   const txnInfo = await indexer.lookupTransactionByID(txId).do() // May throw
   ```

2. **Handle Errors Gracefully**
   ```typescript
   // Good: Handle not found errors
   async function lookupOrNull(txId: string) {
     try {
       return await indexer.lookupTransactionByID(txId).do()
     } catch (error) {
       if (error.status === 404) {
         return null // Transaction not found
       }
       throw error // Other errors
     }
   }

   // Avoid: Letting all errors throw
   const txnInfo = await indexer.lookupTransactionByID(txId).do()
   ```

3. **Verify Transaction Details**
   ```typescript
   // Good: Verify all expected details
   const txnInfo = await indexer.lookupTransactionByID(txId).do()

   if (txnInfo.transaction.id !== expectedTxId) {
     throw new Error('Transaction ID mismatch')
   }
   if (txnInfo.transaction.sender !== expectedSender) {
     throw new Error('Sender mismatch')
   }

   // Avoid: Assuming transaction is correct
   const txnInfo = await indexer.lookupTransactionByID(txId).do()
   // Use without verification
   ```

4. **Check Transaction Type**
   ```typescript
   // Good: Check transaction type before accessing fields
   const txnInfo = await indexer.lookupTransactionByID(txId).do()

   if (txnInfo.transaction.paymentTransaction) {
     console.log(`Payment: ${txnInfo.transaction.paymentTransaction.amount}`)
   } else {
     console.log('Not a payment transaction')
   }

   // Avoid: Assuming transaction type
   const amount = txnInfo.transaction.paymentTransaction.amount // May be undefined
   ```

5. **Use Indexer for Historical Data**
   ```typescript
   // Good: Use indexer for looking up past transactions
   const txnInfo = await algorand.client.indexer
     .lookupTransactionByID(txId)
     .do()

   // Avoid: Using algod for historical data (less efficient)
   const txnInfo = await algorand.client.algod
     .pendingTransactionInformation(txId)
     .do() // Only works for recent transactions
   ```

6. **Store Transaction IDs for Later Lookup**
   ```typescript
   // Good: Save transaction IDs
   const result = await algorand.send.payment({
     sender: sender.addr,
     receiver: receiver.addr,
     amount: algo(1),
     signer: sender,
   })

   const txId = result.transaction.txID()
   await database.save({ txId, timestamp: Date.now() })

   // Later: Look up transaction
   const txnInfo = await indexer.lookupTransactionByID(txId).do()
   ```

7. **Use TypeScript Types**
   ```typescript
   // Good: Type the response
   import type { TransactionResponse } from 'algosdk/dist/types/client/v2/indexer/models/types'

   async function typedLookup(txId: string): Promise<TransactionResponse> {
     return await indexer.lookupTransactionByID(txId).do()
   }

   // Benefits: Type checking and autocomplete
   const info = await typedLookup('TX_ID')
   console.log(info.transaction.sender) // TypeScript knows this exists
   ```

## Understanding Transaction Lookup

### Transaction Lifecycle

```
1. Submit → 2. Pending → 3. Confirmed → 4. Indexed
    |           |             |            |
    |           |             |            └─ Available via indexer
    |           |             └─ Available via algod
    |           └─ In pending pool
    └─ Created

Lookup Methods:
- algod.pendingTransactionInformation(): Recent transactions (pending + confirmed)
- indexer.lookupTransactionByID(): All historical transactions (confirmed only)
```

### Indexer vs Algod

**Use Indexer When:**
- Looking up historical transactions
- Searching transactions by criteria
- Building transaction history displays
- Generating reports and analytics
- Need comprehensive transaction data

**Use Algod When:**
- Checking pending transaction status
- Real-time transaction monitoring
- Need immediate feedback after sending
- Working with very recent transactions

### Transaction Properties

```typescript
// Core properties
transaction.id               // Transaction ID
transaction.sender           // Sender address
transaction.confirmedRound   // Confirmation round
transaction.roundTime        // Block timestamp

// Payment-specific
transaction.paymentTransaction.receiver  // Receiver address
transaction.paymentTransaction.amount    // Amount in microAlgos
transaction.paymentTransaction.closeAmount  // Close amount (if any)

// Application-specific
transaction.applicationTransaction.applicationId  // App ID
transaction.applicationTransaction.accounts  // Referenced accounts

// Asset-specific
transaction.assetTransferTransaction.assetId  // Asset ID
transaction.assetTransferTransaction.amount  // Asset amount
```

## Key Takeaways

- Use the indexer to look up transactions by ID
- Always wait for indexer synchronization with retry logic
- Transaction lookup provides complete transaction details
- Verify transaction details match expectations
- Indexer may lag a few seconds behind the blockchain
- Use indexer for historical data, algod for recent transactions
- Handle errors gracefully (404 = not found)
- Check transaction type before accessing type-specific fields
- Store transaction IDs for later lookup and auditing
- TypeScript types provide safety and autocomplete
- Essential for payment verification and transaction tracking

This example demonstrates the foundation of transaction verification on Algorand. Looking up transactions by ID is essential for building reliable applications that need to verify payments, track transaction status, and provide audit trails. Combined with proper error handling and indexer synchronization, this pattern enables robust transaction tracking in production applications!
