# Connect to MainNet Indexer Using AlgoNode

This example demonstrates how to connect to Algorand MainNet indexer using AlgoNode's free public infrastructure. The indexer is essential for querying historical blockchain data, searching transactions, and accessing account information on the production network.

## What This Example Shows

This example teaches you how to:
- Connect to MainNet indexer using `AlgorandClient.mainNet()`
- Use AlgoNode's free public infrastructure
- Verify the indexer connection with a health check
- Access the indexer client for querying blockchain data
- Understand what the indexer is used for

## Why This Matters

The MainNet indexer is crucial for production applications:

1. **Historical Data Access**: Query past transactions and account states
2. **Production Ready**: Connect to live MainNet for real applications
3. **No Infrastructure**: No need to run your own indexer
4. **Free Access**: AlgoNode provides free public indexer access
5. **Reliable Service**: High availability for production use

Key concepts:
- **MainNet**: Algorand's production blockchain with real ALGO
- **Indexer**: Searchable database of blockchain data
- **AlgoNode**: Free public infrastructure provider
- **Health Check**: Verify service availability and current state

Common use cases:
- **Block Explorers**: Display blockchain data and transaction history
- **Wallet Applications**: Show transaction history and balances
- **Analytics**: Analyze on-chain data and trends
- **DApps**: Query historical data for application features
- **Portfolio Trackers**: Track assets and account activity

## How It Works

The example demonstrates connecting to MainNet indexer and verifying the connection:

### 1. Create MainNet Client

Connect to MainNet using AlgoNode:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.mainNet()
```

`AlgorandClient.mainNet()` automatically configures:
- **Algod**: https://mainnet-api.algonode.cloud:443
- **Indexer**: https://mainnet-idx.algonode.cloud:443
- **No authentication required**

Both algod and indexer clients are ready to use!

### 2. Access Indexer Client

Get the indexer client for querying data:

```typescript
const indexer = algorand.client.indexer
```

The indexer client provides methods to:
- Search transactions by various criteria
- Look up account information
- Query asset details
- Access application state
- Retrieve block information

### 3. Verify Connection

Perform a health check to verify connectivity:

```typescript
const health = await indexer.makeHealthCheck().do()

console.log(`Current Round: ${health.round}`)
console.log(`Version: ${health.version}`)
```

The health check returns:
- **Round**: Current blockchain round the indexer has processed
- **Version**: Indexer software version

This confirms the indexer is operational and up-to-date.

## Indexer Capabilities

The indexer enables powerful blockchain queries:

**Transaction Queries**:
- Search by sender, receiver, or transaction ID
- Filter by type, round range, or date
- Access transaction notes and logs

**Account Queries**:
- Get account balances and information
- List account transactions
- Find opted-in assets and applications

**Asset Queries**:
- Look up asset details and configuration
- Find asset holders
- Track asset transactions

**Application Queries**:
- Query global and local state
- Access application history
- Find application transactions

**Block Queries**:
- Retrieve block information
- Access block transactions
- Query historical blocks

## MainNet vs TestNet vs LocalNet

Understanding which indexer to use:

**MainNet Indexer**:
- Production blockchain data
- Real ALGO and real transactions
- Use for live applications
- Critical for production features

**TestNet Indexer**:
- Test network data
- Free test ALGO
- Use for testing before production
- Safe environment for development

**LocalNet Indexer**:
- Local blockchain data
- Complete control over state
- Use for development
- Fastest for iteration

## Prerequisites

- Node.js and npm installed
- Internet connection (to connect to AlgoNode)

## Running the Example

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the example:
   ```bash
   npm start
   ```

No additional setup required - AlgoNode is publicly accessible!

## Expected Output

```
=== Connect to MainNet Indexer Using AlgoNode ===

1. Creating MainNet client using AlgoNode...
  ✓ MainNet client created successfully
    - Indexer: https://mainnet-idx.algonode.cloud:443
    - Using AlgoNode public infrastructure

2. Verifying indexer connection...
  ✓ Successfully connected to MainNet indexer!

  Indexer Health:
    - Current Round: 55496680
    - Version: 3.9.0

=== Summary ===
✅ Connection verified - ready to query blockchain data!

You can now use the indexer to:
  • Query transaction history
  • Search for accounts and their balances
  • Look up asset information
  • Retrieve application state
  • Access historical blockchain data

=== Key Takeaways ===
• Use AlgorandClient.mainNet() to connect to MainNet
• AlgoNode provides free public indexer access
• No authentication required for public AlgoNode services
• Indexer is essential for querying historical data
```

## Using the Indexer

After connecting, you can query blockchain data:

```typescript
// Search for transactions
const txns = await indexer
  .searchForTransactions()
  .address('YOUR_ADDRESS')
  .do()

// Look up account information
const account = await indexer
  .lookupAccountByID('YOUR_ADDRESS')
  .do()

// Get asset information
const asset = await indexer
  .lookupAssetByID(YOUR_ASSET_ID)
  .do()

// Query application state
const app = await indexer
  .lookupApplications(YOUR_APP_ID)
  .do()
```

## AlgoNode Service

AlgoNode provides:
- **Free Access**: No API keys or authentication
- **High Availability**: Reliable production-ready service
- **Both APIs**: Algod and indexer services
- **Multiple Networks**: MainNet, TestNet support
- **Community Service**: Maintained for Algorand ecosystem

## Key Takeaways

- Use `AlgorandClient.mainNet()` to connect to MainNet indexer
- AlgoNode provides free, public indexer access at https://mainnet-idx.algonode.cloud:443
- No authentication or API keys required
- Indexer is essential for querying historical blockchain data
- Health check verifies indexer connectivity and current state
- Use indexer to search transactions, accounts, assets, and applications
- Perfect for production applications needing blockchain data
- AlgoNode offers reliable, high-availability service
- Both algod and indexer clients are configured automatically
- MainNet indexer contains real production blockchain data
- Ideal for block explorers, wallets, and analytics applications
