# Search Transactions with Filters and Pagination

This example demonstrates how to use the **Algorand Indexer** to search for historical transactions using filters and pagination. The indexer is a powerful tool for querying blockchain data, enabling you to build transaction monitoring systems, analytics platforms, wallet applications, and audit tools.

Understanding how to effectively query the indexer is crucial for any application that needs to:
- Track transaction history for accounts
- Monitor specific types of transactions
- Filter by sender/receiver roles
- Handle large result sets efficiently
- Deal with indexer lag on LocalNet

## Core Concept

The **Algorand Indexer** is a separate service that indexes all blockchain data for efficient searching. It provides a REST API for querying historical transactions, accounts, assets, and applications.

Unlike the algod node (which focuses on current state and new transactions), the indexer:
- **Indexes historical data**: All transactions, not just recent ones
- **Provides complex queries**: Filter by type, address, round range, etc.
- **Supports pagination**: Handle large result sets efficiently
- **May lag behind**: Indexer catches up asynchronously with the blockchain

This example demonstrates how to:
1. Send multiple payment transactions from different accounts
2. Wait for the indexer to catch up and index the transactions
3. Search for transactions with specific filters (type, address role, sender)
4. Implement retry logic to handle indexer lag
5. Verify that filters work correctly

## What This Example Shows

### 1. **Setting Up Test Accounts**
Creates three accounts to demonstrate filtering:
- **Test Account 1**: Main sender (we'll search for transactions from this account)
- **Test Account 2**: Secondary sender (we'll filter out transactions from this account)
- **Receiver Account**: Receives all payments

### 2. **Sending Test Transactions**
Sends three payment transactions:
- Transaction 1: 100,000 microAlgos from testAccount → receiver
- Transaction 2: 200,000 microAlgos from testAccount → receiver
- Transaction 3: 300,000 microAlgos from secondAccount → receiver (should be filtered out)

### 3. **Searching with Filters**
Queries the indexer for transactions matching:
- **Transaction type**: Payment (`txType: 'pay'`)
- **Address role**: Sender (`addressRole: 'sender'`)
- **Specific address**: testAccount's address

This should return only transactions 1 and 2 (from testAccount), not transaction 3 (from secondAccount).

### 4. **Handling Indexer Lag**
Implements retry logic because the indexer may take time to index new transactions, especially on LocalNet:
- Queries the indexer repeatedly (up to 10 attempts)
- Waits 1 second between attempts
- Continues until finding at least 2 transactions or reaching max attempts
- Provides feedback on progress

### 5. **Verifying Results**
Confirms that:
- All expected transactions were found (transactions 1 and 2)
- No unexpected transactions were returned (transaction 3 was filtered out)
- The filters worked correctly

## The Indexer Query

The core of this example is the `searchTransactions` function:

```typescript
import { AlgorandClient, searchTransactions, microAlgos } from '@algorandfoundation/algokit-utils'

const searchResults = await searchTransactions(
  algorand.client.indexer,
  (s) =>
    s
      .txType('pay')              // Filter by transaction type: payment
      .addressRole('sender')       // Filter by address role: sender
      .address(testAccount.addr),  // Filter by specific sender address
  10  // Page size/limit (max results per query)
)
```

This query returns:
```typescript
{
  currentRound: number,        // Current indexer round (indexer state)
  transactions: Array<{        // Matching transactions
    id: string,               // Transaction ID
    sender: string,           // Sender address
    txType: string,           // Transaction type ('pay')
    confirmedRound: number,   // Round when confirmed
    paymentTransaction: {     // Payment-specific details
      receiver: string,       // Receiver address
      amount: number,         // Amount in microAlgos
    }
  }>,
  nextToken?: string           // Pagination token for next page
}
```

## Available Filters

The indexer supports many filters for refining your search:

### 1. Transaction Type (`txType`)
Filter by transaction type:
```typescript
.txType('pay')     // Payment transactions
.txType('keyreg')  // Key registration
.txType('acfg')    // Asset configuration
.txType('axfer')   // Asset transfer
.txType('afrz')    // Asset freeze
.txType('appl')    // Application call
```

### 2. Address Role (`addressRole`)
Specify how the address is involved:
```typescript
.addressRole('sender')        // Address is the sender
.addressRole('receiver')      // Address is the receiver
.addressRole('freeze-target') // Address is the freeze target
```

### 3. Address (`address`)
Filter by a specific address:
```typescript
.address(accountAddr)  // Transactions involving this address
```

When combined with `addressRole`, this filters by specific role.

### 4. Application ID (`applicationID`)
Filter by application:
```typescript
.applicationID(appId)  // Transactions calling this app
```

### 5. Round Range (`minRound`, `maxRound`)
Filter by round range:
```typescript
.minRound(1000)   // Transactions from round 1000 onwards
.maxRound(2000)   // Transactions up to round 2000
```

### 6. Pagination (`nextToken`)
For retrieving subsequent pages:
```typescript
.nextToken(token)  // Get next page of results
```

## Pagination Strategy

For large result sets, use pagination to retrieve results in chunks:

```typescript
let nextToken: string | undefined = undefined
const allTransactions = []

do {
  const results = await searchTransactions(
    indexer,
    (s) => {
      let query = s.address(accountAddr)
      if (nextToken) {
        query = query.nextToken(nextToken)
      }
      return query
    },
    100  // Page size
  )

  allTransactions.push(...results.transactions)
  nextToken = results.nextToken
} while (nextToken)

console.log(`Total transactions: ${allTransactions.length}`)
```

**Why pagination matters:**
- Indexer limits results per query (default: 100)
- Large accounts may have thousands of transactions
- Pagination reduces memory usage and improves performance
- Enables progressive loading in UIs

## Handling Indexer Lag

The indexer indexes blockchain data asynchronously, which means:
- **On MainNet/TestNet**: Usually catches up within seconds
- **On LocalNet**: May take longer or have limited functionality
- **After sending transactions**: Need to wait before querying

This example implements retry logic to handle lag:

```typescript
let searchResults = await searchTransactions(
  algorand.client.indexer,
  (s) => s.txType('pay').addressRole('sender').address(testAccount.addr),
  10
)

let attempts = 1
const maxAttempts = 10

while (attempts < maxAttempts && searchResults.transactions.length < 2) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log(`   Attempt ${attempts}: Found ${searchResults.transactions.length} transactions, retrying...`)

  searchResults = await searchTransactions(
    algorand.client.indexer,
    (s) => s.txType('pay').addressRole('sender').address(testAccount.addr),
    10
  )

  attempts++
}

if (searchResults.transactions.length >= 2) {
  console.log(`   ✅ Found ${searchResults.transactions.length} transactions after ${attempts} attempt(s)`)
} else {
  console.log(`   ⚠️  Only found ${searchResults.transactions.length} transactions after ${attempts} attempts`)
  console.log('   Note: Indexer may need more time on LocalNet')
}
```

## Common Use Cases

### 1. Account Transaction History
Display all transactions for a user account:
```typescript
const results = await searchTransactions(
  indexer,
  (s) => s.address(accountAddr)
)
```

### 2. Payments Sent by Account
Show only outgoing payments:
```typescript
const results = await searchTransactions(
  indexer,
  (s) => s
    .txType('pay')
    .addressRole('sender')
    .address(accountAddr)
)
```

### 3. Payments Received by Account
Show only incoming payments:
```typescript
const results = await searchTransactions(
  indexer,
  (s) => s
    .txType('pay')
    .addressRole('receiver')
    .address(accountAddr)
)
```

### 4. Application Calls
Find all calls to a specific application:
```typescript
const results = await searchTransactions(
  indexer,
  (s) => s
    .txType('appl')
    .applicationID(appId)
)
```

### 5. Transactions in Round Range
Query specific time period:
```typescript
const results = await searchTransactions(
  indexer,
  (s) => s
    .minRound(1000)
    .maxRound(2000)
)
```

### 6. Payment Tracking for Merchants
Monitor incoming payments to verify customer payments:
```typescript
const results = await searchTransactions(
  indexer,
  (s) => s
    .txType('pay')
    .addressRole('receiver')
    .address(merchantAddr)
    .minRound(lastCheckedRound)
)

// Verify each payment
for (const txn of results.transactions) {
  if (txn.paymentTransaction?.amount >= expectedAmount) {
    console.log(`Payment received: ${txn.id}`)
  }
}
```

### 7. Asset Transfer Monitoring
Track transfers of a specific ASA:
```typescript
const results = await searchTransactions(
  indexer,
  (s) => s
    .txType('axfer')
    .assetID(assetId)
)
```

### 8. Compliance and Auditing
Generate transaction reports for regulatory purposes:
```typescript
const startRound = 1000
const endRound = 2000

const results = await searchTransactions(
  indexer,
  (s) => s
    .address(accountAddr)
    .minRound(startRound)
    .maxRound(endRound)
)

// Generate audit report
console.log(`Audit Report for ${accountAddr}`)
console.log(`Period: Rounds ${startRound} - ${endRound}`)
console.log(`Total transactions: ${results.transactions.length}`)
```

## Best Practices

### ✅ 1. Wait for Indexer to Catch Up
The indexer may lag behind the current blockchain state:
```typescript
// ❌ BAD: Query immediately after sending transaction
await algorand.send.payment({ ... })
const results = await searchTransactions(...)  // May not find transaction yet

// ✅ GOOD: Add delay or retry logic
await algorand.send.payment({ ... })
await new Promise(resolve => setTimeout(resolve, 2000))  // Wait 2 seconds
const results = await searchTransactions(...)
```

**Or implement retry logic:**
```typescript
let attempts = 0
let results

do {
  results = await searchTransactions(...)
  if (results.transactions.length > 0) break
  await new Promise(resolve => setTimeout(resolve, 1000))
  attempts++
} while (attempts < 10)
```

### ✅ 2. Use Specific Filters
Narrow down results with multiple filters to reduce data transfer:
```typescript
// ❌ BAD: Query all transactions, filter in code
const allResults = await searchTransactions(indexer, (s) => s)
const filtered = allResults.transactions.filter(t => t.txType === 'pay')

// ✅ GOOD: Use indexer filters
const results = await searchTransactions(
  indexer,
  (s) => s
    .txType('pay')
    .addressRole('sender')
    .address(accountAddr)
)
```

### ✅ 3. Implement Pagination for Large Result Sets
Don't try to load all results at once:
```typescript
// ❌ BAD: Single query with very large limit
const results = await searchTransactions(indexer, (s) => s.address(addr), 10000)

// ✅ GOOD: Use pagination
let nextToken: string | undefined = undefined
const allTransactions = []

do {
  const results = await searchTransactions(
    indexer,
    (s) => {
      let query = s.address(addr)
      if (nextToken) query = query.nextToken(nextToken)
      return query
    },
    100  // Reasonable page size
  )

  allTransactions.push(...results.transactions)
  nextToken = results.nextToken
} while (nextToken)
```

### ✅ 4. Handle Indexer Unavailability
The indexer may not be available on all networks:
```typescript
// ✅ GOOD: Wrap in try/catch
try {
  const results = await searchTransactions(indexer, ...)
  // Process results
} catch (error) {
  console.error('Indexer unavailable:', error)
  // Fallback: Use algod to get account info instead
}
```

### ✅ 5. Optimize Round Ranges
Limit round ranges to reduce search scope:
```typescript
// ❌ BAD: Search all history
const results = await searchTransactions(indexer, (s) => s.address(addr))

// ✅ GOOD: Limit to recent rounds
const currentRound = (await algod.status().do()).lastRound
const results = await searchTransactions(
  indexer,
  (s) => s
    .address(addr)
    .minRound(currentRound - 1000)  // Last ~1 hour
)
```

### ✅ 6. Check Indexer State
Verify indexer is caught up before relying on results:
```typescript
const results = await searchTransactions(indexer, ...)
console.log(`Indexer current round: ${results.currentRound}`)

// Compare with algod round
const algodStatus = await algod.status().do()
console.log(`Algod current round: ${algodStatus.lastRound}`)

if (results.currentRound < algodStatus.lastRound - 10) {
  console.warn('Indexer is behind by more than 10 rounds')
}
```

### ✅ 7. Use Meaningful Page Sizes
Choose page sizes based on your use case:
```typescript
// UI with infinite scroll
await searchTransactions(indexer, ..., 20)  // Small pages, fast initial load

// Batch processing/analytics
await searchTransactions(indexer, ..., 100)  // Larger pages, fewer requests

// Don't exceed indexer limits (usually 100 or 1000)
```

## Common Pitfalls

### ❌ Pitfall 1: Not Waiting for Indexer
```typescript
// ❌ WRONG: Query immediately after sending transaction
const result = await algorand.send.payment({ ... })
const search = await searchTransactions(...)  // Transaction not indexed yet!

// ✅ CORRECT: Wait or implement retry logic
const result = await algorand.send.payment({ ... })
await new Promise(resolve => setTimeout(resolve, 2000))
const search = await searchTransactions(...)
```

### ❌ Pitfall 2: Incorrect Property Names
```typescript
// ❌ WRONG: Using kebab-case (old API style)
const amount = txn['payment-transaction']?.amount

// ✅ CORRECT: Use camelCase (v9.1.2 API)
const amount = txn.paymentTransaction?.amount
const round = txn.confirmedRound
const type = txn.txType
```

### ❌ Pitfall 3: Forgetting to Fund Receiver
```typescript
// ❌ WRONG: Send to unfunded account
await algorand.send.payment({
  sender: testAccount.addr,
  receiver: receiver.addr,  // Receiver has 0 balance
  amount: microAlgos(100_000),  // Error: below minimum balance!
})

// ✅ CORRECT: Fund receiver first
await algorand.send.payment({
  sender: dispenser.addr,
  receiver: receiver.addr,
  amount: microAlgos(1_000_000),  // Fund with 1 ALGO
})

// Now can receive payments
await algorand.send.payment({
  sender: testAccount.addr,
  receiver: receiver.addr,
  amount: microAlgos(100_000),  // Works!
})
```

### ❌ Pitfall 4: Not Handling Empty Results
```typescript
// ❌ WRONG: Assume results always exist
const firstTx = results.transactions[0]  // May be undefined!
const amount = firstTx.paymentTransaction.amount  // Error!

// ✅ CORRECT: Check for results
if (results.transactions.length > 0) {
  const firstTx = results.transactions[0]
  const amount = firstTx.paymentTransaction?.amount
  console.log(`Amount: ${amount}`)
} else {
  console.log('No transactions found')
}
```

### ❌ Pitfall 5: Loading All Results at Once
```typescript
// ❌ WRONG: Try to load everything in one query
const results = await searchTransactions(indexer, (s) => s.address(addr), 999999)
// May hit indexer limits or timeout

// ✅ CORRECT: Use pagination
let nextToken: string | undefined = undefined
do {
  const results = await searchTransactions(
    indexer,
    (s) => {
      let query = s.address(addr)
      if (nextToken) query = query.nextToken(nextToken)
      return query
    },
    100
  )

  // Process this page
  processTransactions(results.transactions)

  nextToken = results.nextToken
} while (nextToken)
```

### ❌ Pitfall 6: Logging Address Objects
```typescript
// ❌ WRONG: Log address object directly
console.log('Sender:', testAccount.addr)
// Output: Address { publicKey: Uint8Array(32) [ 142, 78, ... ] }

// ✅ CORRECT: Convert to string
console.log('Sender:', testAccount.addr.toString())
// Output: Sender: ABC123...XYZ
```

## Understanding Indexer Response

The indexer returns transaction data in this format:

```typescript
interface SearchTransactionsResult {
  currentRound: number           // Current round in indexer
  nextToken?: string             // Pagination token for next page
  transactions: Array<{
    id: string                   // Transaction ID
    sender: string               // Sender address
    txType: string               // Transaction type ('pay', 'appl', etc.)
    confirmedRound: number       // Round when confirmed
    roundTime?: number           // Unix timestamp of block
    fee: number                  // Transaction fee in microAlgos
    note?: string                // Transaction note (base64)

    // Payment-specific (if txType === 'pay')
    paymentTransaction?: {
      receiver: string           // Receiver address
      amount: number             // Amount in microAlgos
      closeAmount?: number       // Close remainder amount
    }

    // Application-specific (if txType === 'appl')
    applicationTransaction?: {
      applicationId: number      // Application ID
      onCompletion: string       // On-completion action
      applicationArgs?: string[] // Application arguments
    }

    // Asset transfer-specific (if txType === 'axfer')
    assetTransferTransaction?: {
      assetId: number            // Asset ID
      amount: number             // Transfer amount
      receiver: string           // Receiver address
    }

    // And more fields for other transaction types...
  }>
}
```

## Running the Example

### Prerequisites
1. **AlgoKit installed**: `brew install algorand/tap/algokit` (or see [installation guide](https://github.com/algorandfoundation/algokit-cli#install))
2. **Docker installed**: Required for LocalNet
3. **Node.js installed**: Version 18 or higher

### Setup
```bash
# Start LocalNet with indexer
algokit localnet start

# Verify indexer is running
curl http://localhost:8980/health
```

### Install Dependencies
```bash
npm install
```

### Run the Example
```bash
npm start
```

## Expected Output

The example will:

1. **Create and fund accounts**:
   ```
   Setting up test accounts...
      Test Account 1 (main sender): ABC123...
      Test Account 2 (secondary sender): DEF456...
      Receiver Account: GHI789...

   Funding test accounts...
      ✅ Accounts funded successfully
   ```

2. **Send test transactions**:
   ```
   Sending test transactions...
      Transaction 1: TX1ABC...
         From: testAccount
         Amount: 100,000 microAlgos
      Transaction 2: TX2DEF...
         From: testAccount
         Amount: 200,000 microAlgos
      Transaction 3: TX3GHI...
         From: secondAccount
         Amount: 300,000 microAlgos
   ```

3. **Wait for indexer** (with retry logic):
   ```
   Waiting for indexer to catch up and index transactions...
      Attempt 1: Found 0 transactions, retrying...
      Attempt 2: Found 2 transactions, retrying...
      ✅ Found 2 transactions after 2 attempt(s)
   ```

4. **Display search results**:
   ```
   === Search Results ===
   Indexer State:
      Current Round: 1234
      Transactions Found: 2

   Transaction Details:

      Transaction 1:
         ID: TX1ABC...
         Sender: ABC123...
         Receiver: GHI789...
         Amount: 100000 microAlgos
         Round: 1230
         Type: pay

      Transaction 2:
         ID: TX2DEF...
         Sender: ABC123...
         Receiver: GHI789...
         Amount: 200000 microAlgos
         Round: 1231
         Type: pay
   ```

5. **Verify filters worked**:
   ```
   === Verification ===
   Expected Transactions:
      Transaction 1: TX1ABC... (from testAccount)
      Transaction 2: TX2DEF... (from testAccount)

   Found Transactions:
      Transaction 1: TX1ABC...
      Transaction 2: TX2DEF...

   Excluded Transactions:
      Transaction 3: TX3GHI... (from secondAccount - filtered out)

   Results:
      ✅ Search filters working correctly!
      ✅ Found exactly the transactions from testAccount
      ✅ Filtered out transactions from secondAccount
   ```

6. **Educational content** explaining filters, pagination, and best practices

**Note**: On LocalNet, the indexer may take longer to catch up or may not find all transactions even after multiple attempts. This is expected behavior and demonstrates the importance of implementing retry logic in production applications.

## Key Takeaways

1. **Indexer is separate from algod** - It provides historical data, not just current state
2. **Filters are powerful** - Combine `txType`, `addressRole`, `address`, round ranges, etc.
3. **Pagination is essential** - Don't try to load thousands of results at once
4. **Indexer may lag** - Always implement retry logic or delays
5. **Use camelCase properties** - In v9.1.2: `paymentTransaction`, `confirmedRound`, `txType`
6. **Fund receiver accounts** - Algorand requires 100,000 microAlgos minimum balance
7. **Convert addresses to strings** - Use `.toString()` for clean logging
8. **Check indexer state** - Compare `currentRound` with algod's round to verify indexer is caught up

## Related Examples

- **127-retrieve-latest-app-when-multiple-apps-have-same-name**: Using indexer to query applications
- **126-replace-an-application-with-delete-and-recreate**: Understanding app lifecycle and indexer queries

## Production Considerations

When deploying to MainNet or TestNet:

1. **Indexer Performance**: MainNet/TestNet indexers are usually faster and more reliable than LocalNet
2. **Rate Limits**: Public indexers may have rate limits; consider running your own or using a service
3. **Error Handling**: Always wrap indexer calls in try/catch and handle unavailability gracefully
4. **Caching**: Cache results when possible to reduce indexer load
5. **Pagination**: Implement proper pagination for large datasets
6. **Monitoring**: Monitor indexer lag and alert if it falls too far behind
7. **Fallbacks**: Have a fallback strategy if indexer is unavailable (e.g., use algod for recent transactions)

## Example Details

```json
{
  "example_id": "128-search-transactions-with-filters-and-pagination",
  "title": "Search Transactions with Filters and Pagination",
  "summary": "Demonstrates how to search for transactions using the Algorand Indexer with filters (transaction type, address role) and pagination support.",
  "language": "typescript",
  "complexity": "moderate",
  "use_case_category": "transaction management",
  "specific_use_case": "Search for transactions with specific criteria using the indexer with retry logic to handle indexer lag",
  "target_users": [
    "SDK developers",
    "Application developers",
    "Transaction monitoring systems",
    "Analytics platforms",
    "Wallet developers"
  ],
  "features_tested": [
    "searchTransactions",
    "transaction filtering by type",
    "transaction filtering by address role",
    "pagination",
    "indexer retry logic"
  ],
  "feature_tags": [
    "indexer",
    "transaction-search",
    "pagination",
    "filtering",
    "payment-transaction",
    "address-role",
    "retry-logic",
    "indexer-lag"
  ]
}
```
