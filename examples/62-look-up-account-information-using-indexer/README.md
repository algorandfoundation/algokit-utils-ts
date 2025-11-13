# Look Up Account Information Using Indexer

This example demonstrates how to retrieve account information from the Algorand Indexer by address. The indexer provides efficient queries over blockchain data, making it ideal for applications that need to look up historical account information or search across multiple accounts.

## What This Example Shows

This example teaches you how to:
- Connect to the Algorand Indexer
- Wait for the indexer to synchronize with the blockchain
- Look up account information by address using the indexer
- Access and display comprehensive account details
- Handle indexer synchronization delays properly

## Why This Matters

Using the indexer for account lookups is essential for production applications:

1. **Efficient Queries**: Indexer provides optimized database queries for blockchain data
2. **Historical Data**: Access historical account state, not just current state
3. **Search Capabilities**: Find accounts by various criteria (balance, apps, assets)
4. **Reduced Load**: Offload queries from algod to the indexer service
5. **Rich Information**: Get detailed account information in a single query
6. **Scalability**: Handle high-volume account lookups efficiently

Key concepts:
- **Indexer**: A service that indexes blockchain data for efficient querying
- **Account Lookup**: Retrieving account information by address
- **Synchronization**: Indexer may lag slightly behind the blockchain
- **Account Information**: Balance, status, rewards, apps, assets, and more
- **Polling Pattern**: Retry queries until indexer catches up

Common scenarios:
- Wallet applications displaying account information
- Block explorers showing account details
- Analytics dashboards tracking account metrics
- Applications verifying account balances
- Portfolio trackers monitoring multiple accounts
- Tax reporting tools retrieving transaction history

## How It Works

### 1. Initialize AlgorandClient

Set up the client with LocalNet configuration:

```typescript
import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

// Initialize AlgorandClient for LocalNet
const algorand = AlgorandClient.defaultLocalNet()
```

Client setup:
- `defaultLocalNet()` connects to LocalNet algod and indexer
- Automatically configured with correct URLs and tokens
- Provides access to both blockchain and indexer services
- No additional configuration needed for LocalNet

### 2. Create and Fund a Test Account

Create a new account and fund it to make it visible to the indexer:

```typescript
// Get dispenser account for funding
const dispenser = await algorand.account.localNetDispenser()

// Create a new test account
const testAccount = await algorand.account.random()
console.log(`Created test account: ${testAccount.addr}`)

// Fund the test account
await algorand.send.payment({
  sender: dispenser.addr,
  receiver: testAccount.addr,
  amount: algo(5),
})
console.log(`Funded account with 5 ALGO`)
```

Account creation:
- `localNetDispenser()` gets the LocalNet funding account
- `random()` creates a new random account
- Payment transaction funds the account with 5 ALGO
- Funded account becomes visible on the blockchain
- Transaction is recorded and will be indexed

### 3. Wait for Indexer Synchronization

Implement a polling pattern to wait for the indexer to catch up:

```typescript
async function waitForIndexerSync(
  indexer: algosdk.Indexer,
  address: string,
  maxAttempts: number = 20
): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await indexer.lookupAccountByID(address).do()
      console.log('✓ Indexer has caught up!')
      return
    } catch (error) {
      console.log(`   Waiting for indexer to sync... (attempt ${i + 1}/${maxAttempts})`)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  throw new Error('Indexer did not catch up in time')
}

// Use the helper function
await waitForIndexerSync(algorand.client.indexer, testAccount.addr.toString())
```

Synchronization details:
- Indexer may lag a few seconds behind algod
- Poll with retries until account is found
- 2-second delay between attempts (configurable)
- Maximum 20 attempts (40 seconds total)
- Throws error if account not found in time
- Essential for reliable indexer queries

### 4. Look Up Account Information

Query the indexer for account details:

```typescript
// Look up the account information using the indexer
const accountInfo = await algorand.client.indexer.lookupAccountByID(testAccount.addr.toString()).do()

console.log('=== Account Information ===')
console.log(`Address: ${accountInfo.account.address}`)
console.log(`Balance: ${accountInfo.account.amount} microAlgos`)
console.log(`Status: ${accountInfo.account.status}`)
console.log(`Round: ${accountInfo.currentRound}`)
```

Query details:
- `lookupAccountByID()` queries by account address
- `.do()` executes the query
- Returns comprehensive account information
- Includes current round for data freshness
- Account object contains all details

### 5. Access Account Properties

The indexer returns rich account information:

```typescript
// Basic information
console.log(`Address: ${accountInfo.account.address}`)
console.log(`Balance: ${accountInfo.account.amount} microAlgos`)
console.log(`Status: ${accountInfo.account.status}`) // Online/Offline

// Rewards information
console.log(`Pending Rewards: ${accountInfo.account.pendingRewards} microAlgos`)
console.log(`Reward Base: ${accountInfo.account.rewardBase}`)

// Application information
console.log(`Total Apps Opted In: ${accountInfo.account.totalAppsOptedIn}`)
console.log(`Total Created Apps: ${accountInfo.account.totalCreatedApps}`)

// Asset information
console.log(`Total Assets Opted In: ${accountInfo.account.totalAssetsOptedIn}`)
console.log(`Total Created Assets: ${accountInfo.account.totalCreatedAssets}`)

// Data freshness
console.log(`Round: ${accountInfo.currentRound}`)
```

Available properties:
- `address` - Account address (string)
- `amount` - Balance in microAlgos (bigint)
- `status` - Online or Offline
- `pendingRewards` - Accumulated pending rewards (bigint)
- `rewardBase` - Reward tracking (number)
- `totalAppsOptedIn` - Number of apps opted into
- `totalCreatedApps` - Number of apps created
- `totalAssetsOptedIn` - Number of assets opted into
- `totalCreatedAssets` - Number of assets created
- `currentRound` - Indexer's current round (number)

### 6. Verify Account Information

Confirm the lookup returned the correct account:

```typescript
// Verify the account address matches
if (accountInfo.account.address === testAccount.addr.toString()) {
  console.log('\n✓ Account successfully verified!')
} else {
  console.log('\n✗ Account address mismatch!')
}
```

Verification:
- Compare returned address with expected address
- Ensures query returned correct account
- Detects any query errors
- Good practice for production code

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
Created test account: ESCOINJUPFRXAAVIWW5DCY5IMQ63W2YAF2SOJZ35EV7AC5Q3GYIU3AP6GM

Funding test account...
Sending 5000000 µALGO from L3T2BF5MPTEEDGCSVW7CZXTS5VDKUIANU75SZWVET75N3TPCLTCMNE3LIE to ESCOINJUPFRXAAVIWW5DCY5IMQ63W2YAF2SOJZ35EV7AC5Q3GYIU3AP6GM via transaction M7IBDAI5XMT2GU6R6RYOGM2OTRNJDGPUWSRU3MR4DHMX5UUHUN6Q
Funded account with 5 ALGO

Waiting for indexer to synchronize...
   Waiting for indexer to sync... (attempt 1/20)
   Waiting for indexer to sync... (attempt 2/20)
   ...
✓ Indexer has caught up!

Looking up account information...

=== Account Information ===
Address: ESCOINJUPFRXAAVIWW5DCY5IMQ63W2YAF2SOJZ35EV7AC5Q3GYIU3AP6GM
Balance: 5000000 microAlgos (5 ALGO)
Status: Offline
Round: 91
Pending Rewards: 0 microAlgos
Reward Base: 0
Total Apps Opted In: 0
Total Assets Opted In: 0
Total Created Apps: 0
Total Created Assets: 0

✓ Account successfully verified!
```

## Common Patterns

### Basic Account Lookup

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

async function lookupAccount(address: string) {
  const algorand = AlgorandClient.defaultLocalNet()

  // Look up account by address
  const accountInfo = await algorand.client.indexer
    .lookupAccountByID(address)
    .do()

  console.log(`Balance: ${accountInfo.account.amount} microAlgos`)
  console.log(`Status: ${accountInfo.account.status}`)

  return accountInfo
}
```

### Lookup with Error Handling

```typescript
async function safeAccountLookup(address: string) {
  const algorand = AlgorandClient.defaultLocalNet()

  try {
    const accountInfo = await algorand.client.indexer
      .lookupAccountByID(address)
      .do()

    return {
      success: true,
      account: accountInfo.account,
      round: accountInfo.currentRound,
    }
  } catch (error) {
    console.error(`Failed to look up account: ${error.message}`)
    return {
      success: false,
      error: error.message,
    }
  }
}
```

### Check Account Exists

```typescript
async function accountExists(address: string): Promise<boolean> {
  const algorand = AlgorandClient.defaultLocalNet()

  try {
    await algorand.client.indexer.lookupAccountByID(address).do()
    return true
  } catch (error) {
    return false
  }
}

const exists = await accountExists('SOME_ADDRESS')
console.log(`Account exists: ${exists}`)
```

### Get Account Balance

```typescript
async function getAccountBalance(address: string): Promise<bigint> {
  const algorand = AlgorandClient.defaultLocalNet()

  const accountInfo = await algorand.client.indexer
    .lookupAccountByID(address)
    .do()

  return accountInfo.account.amount
}

const balance = await getAccountBalance('SOME_ADDRESS')
console.log(`Balance: ${balance} microAlgos`)
```

### Wait for Minimum Balance

```typescript
async function waitForMinimumBalance(
  address: string,
  minimumMicroAlgos: bigint,
  maxAttempts: number = 20
): Promise<void> {
  const algorand = AlgorandClient.defaultLocalNet()

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const accountInfo = await algorand.client.indexer
        .lookupAccountByID(address)
        .do()

      if (accountInfo.account.amount >= minimumMicroAlgos) {
        console.log('✓ Minimum balance reached!')
        return
      }

      console.log(`Current balance: ${accountInfo.account.amount}, waiting...`)
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.log(`Waiting for account... (attempt ${i + 1}/${maxAttempts})`)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  throw new Error('Minimum balance not reached in time')
}

await waitForMinimumBalance('SOME_ADDRESS', 1000000n) // Wait for 1 ALGO
```

### Monitor Multiple Accounts

```typescript
async function monitorAccounts(addresses: string[]) {
  const algorand = AlgorandClient.defaultLocalNet()

  const results = await Promise.all(
    addresses.map(async (address) => {
      try {
        const accountInfo = await algorand.client.indexer
          .lookupAccountByID(address)
          .do()

        return {
          address,
          balance: accountInfo.account.amount,
          status: accountInfo.account.status,
          round: accountInfo.currentRound,
        }
      } catch (error) {
        return {
          address,
          error: error.message,
        }
      }
    })
  )

  return results
}

const accounts = [
  'ADDRESS1',
  'ADDRESS2',
  'ADDRESS3',
]

const status = await monitorAccounts(accounts)
console.log('Account status:', status)
```

### Get Detailed Account Summary

```typescript
interface AccountSummary {
  address: string
  balance: {
    microAlgos: bigint
    algos: number
  }
  status: string
  rewards: {
    pending: bigint
    base: number
  }
  apps: {
    optedIn: number
    created: number
  }
  assets: {
    optedIn: number
    created: number
  }
  round: number
}

async function getAccountSummary(address: string): Promise<AccountSummary> {
  const algorand = AlgorandClient.defaultLocalNet()

  const accountInfo = await algorand.client.indexer
    .lookupAccountByID(address)
    .do()

  const microAlgos = accountInfo.account.amount

  return {
    address: accountInfo.account.address,
    balance: {
      microAlgos,
      algos: Number(microAlgos) / 1_000_000,
    },
    status: accountInfo.account.status,
    rewards: {
      pending: accountInfo.account.pendingRewards,
      base: accountInfo.account.rewardBase,
    },
    apps: {
      optedIn: accountInfo.account.totalAppsOptedIn,
      created: accountInfo.account.totalCreatedApps,
    },
    assets: {
      optedIn: accountInfo.account.totalAssetsOptedIn,
      created: accountInfo.account.totalCreatedAssets,
    },
    round: accountInfo.currentRound,
  }
}

const summary = await getAccountSummary('SOME_ADDRESS')
console.log('Account summary:', JSON.stringify(summary, null, 2))
```

## Best Practices

1. **Always Wait for Indexer Synchronization**
   ```typescript
   // Good: Wait for indexer to catch up
   async function reliableLookup(address: string) {
     await waitForIndexerSync(indexer, address)
     const accountInfo = await indexer.lookupAccountByID(address).do()
     return accountInfo
   }

   // Avoid: Immediate lookup may fail
   async function unreliableLookup(address: string) {
     // May fail if indexer hasn't indexed yet
     const accountInfo = await indexer.lookupAccountByID(address).do()
     return accountInfo
   }
   ```

2. **Handle Indexer Errors Gracefully**
   ```typescript
   // Good: Handle errors with retries
   async function robustLookup(address: string) {
     const maxRetries = 3
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await indexer.lookupAccountByID(address).do()
       } catch (error) {
         if (i === maxRetries - 1) throw error
         await new Promise(resolve => setTimeout(resolve, 1000))
       }
     }
   }

   // Avoid: No error handling
   async function fragile Lookup(address: string) {
     return await indexer.lookupAccountByID(address).do() // Throws on error
   }
   ```

3. **Use Indexer for Queries, Algod for Transactions**
   ```typescript
   // Good: Query via indexer, transact via algod
   const accountInfo = await algorand.client.indexer.lookupAccountByID(address).do()

   if (accountInfo.account.amount < 1000000n) {
     await algorand.send.payment({
       sender: funder.addr,
       receiver: address,
       amount: algo(1),
     })
   }

   // Avoid: Using algod for queries (less efficient)
   const accountInfo = await algorand.client.algod.accountInformation(address).do()
   ```

4. **Cache Account Information When Appropriate**
   ```typescript
   // Good: Cache with TTL
   class AccountCache {
     private cache = new Map<string, { data: any; timestamp: number }>()
     private ttl = 30000 // 30 seconds

     async get(address: string) {
       const cached = this.cache.get(address)
       if (cached && Date.now() - cached.timestamp < this.ttl) {
         return cached.data
       }

       const accountInfo = await indexer.lookupAccountByID(address).do()
       this.cache.set(address, { data: accountInfo, timestamp: Date.now() })
       return accountInfo
     }
   }
   ```

5. **Validate Address Before Lookup**
   ```typescript
   // Good: Validate address format
   async function safeLookup(address: string) {
     if (!algosdk.isValidAddress(address)) {
       throw new Error(`Invalid Algorand address: ${address}`)
     }

     return await indexer.lookupAccountByID(address).do()
   }

   // Avoid: No validation
   async function unsafeLookup(address: string) {
     return await indexer.lookupAccountByID(address).do() // May fail with unclear error
   }
   ```

6. **Check Current Round for Data Freshness**
   ```typescript
   // Good: Verify data freshness
   async function getFreshAccountInfo(address: string) {
     const accountInfo = await indexer.lookupAccountByID(address).do()
     const algodStatus = await algod.status().do()

     const lagRounds = algodStatus['last-round'] - accountInfo.currentRound

     if (lagRounds > 10) {
       console.warn(`Indexer is ${lagRounds} rounds behind`)
     }

     return accountInfo
   }
   ```

7. **Use TypeScript Types for Type Safety**
   ```typescript
   // Good: Type the response
   import type { AccountInformationResponse } from 'algosdk/dist/types/client/v2/indexer/models/types'

   async function typedLookup(address: string): Promise<AccountInformationResponse> {
     return await indexer.lookupAccountByID(address).do()
   }

   // Benefits: Type checking and autocomplete
   const info = await typedLookup('SOME_ADDRESS')
   console.log(info.account.amount) // TypeScript knows this exists
   ```

## Understanding Indexer vs Algod

### When to Use Indexer

Use the indexer for:
- Looking up accounts by address
- Searching for transactions
- Querying assets and applications
- Historical data access
- Complex queries with filters
- High-volume read operations

### When to Use Algod

Use algod for:
- Submitting transactions
- Getting latest blockchain state
- Real-time block monitoring
- Compiling smart contracts
- Transaction simulation
- Pending transaction pool queries

### Indexer Lag

```
Blockchain: Round 100 ─┐
                       ├─ (Small lag)
Indexer:    Round 98  ─┘

Why?
- Indexer processes blocks asynchronously
- Database indexing takes time
- Usually only a few seconds behind
- Must account for lag in applications
```

## Key Takeaways

- The indexer provides efficient queries over blockchain data
- Always wait for indexer synchronization after blockchain operations
- Use polling with retries for reliable indexer queries
- Account information includes balance, status, rewards, apps, and assets
- Indexer may lag slightly behind algod (a few seconds typically)
- Use indexer for queries, algod for transactions
- Handle errors gracefully with retry logic
- Validate addresses before lookup
- Check `currentRound` to verify data freshness
- Cache account information when appropriate
- TypeScript types provide safety and autocomplete
- Essential for wallet apps, block explorers, and analytics

This example demonstrates the foundation of working with the Algorand Indexer for account information. The indexer is a powerful tool for building applications that need to query blockchain data efficiently, making it essential for wallets, block explorers, analytics dashboards, and any application that needs to display or search account information!
