# Configure Indexer Client from Environment Variables

This example demonstrates how to configure an Indexer client using environment variables for querying blockchain data across different environments. The Indexer is essential for accessing historical blockchain data, transactions, accounts, and assets.

## What This Example Shows

This example teaches you how to:
- Configure Indexer client using environment variables (INDEXER_SERVER, INDEXER_PORT, INDEXER_TOKEN)
- Use `AlgorandClient.fromEnvironment()` to create a client with indexer
- Verify connectivity by testing the Indexer connection
- Create custom Indexer clients using `algosdk.Indexer`
- Understand network-specific configurations (LocalNet, TestNet, MainNet)

## Why This Matters

Configuring Indexer via environment variables is important for several reasons:

1. **Historical Data Access**: Query past transactions, account states, and application history
2. **Environment Flexibility**: Different indexer configurations for dev, test, and production
3. **Network Switching**: Easy configuration for LocalNet, TestNet, and MainNet
4. **Production Ready**: Industry standard for configuration management

Key concepts:
- **Indexer**: Service that indexes blockchain data for fast queries
- **Environment Variables**: INDEXER_SERVER, INDEXER_PORT, and INDEXER_TOKEN
- **Health Check**: Verify indexer connectivity and current round
- **Network-Specific Config**: Different settings for different networks

Common use cases:
- **Transaction History**: Query all transactions for an account
- **Asset Lookup**: Find information about Algorand Standard Assets
- **Account Balances**: Get current and historical balance information
- **Application State**: Query smart contract state and history
- **Block Explorer**: Build tools to explore blockchain data

## How It Works

The example demonstrates three scenarios for Indexer client configuration:

### 1. Configure from Environment Variables

Set the required environment variables and create a client:

```typescript
// Set environment variables (typically done in .env file or deployment config)
process.env.INDEXER_SERVER = 'http://localhost'
process.env.INDEXER_PORT = '8980'
process.env.INDEXER_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

// Create client from environment
const algorand = AlgorandClient.fromEnvironment()

// Get indexer client
const indexerClient = algorand.client.indexer

// Test connection
const health = await indexerClient.makeHealthCheck().do()
console.log(`Round: ${health.round}`)
```

This is the recommended pattern for production applications.

### 2. Indexer Capabilities

The Indexer allows you to query various types of blockchain data:

- **Account Information**: Get account balances, assets, and applications
- **Transaction Search**: Find transactions by sender, receiver, type, etc.
- **Asset Information**: Look up ASA details and holders
- **Application State**: Query smart contract global and local state
- **Block Information**: Access block data and transactions

### 3. Custom Indexer Client

You can create a custom indexer client directly:

```typescript
const customIndexerClient = new algosdk.Indexer(
  process.env.INDEXER_TOKEN!,
  process.env.INDEXER_SERVER!,
  process.env.INDEXER_PORT!
)

// Use it directly
const health = await customIndexerClient.makeHealthCheck().do()
```

This approach gives you more control over client configuration.

## Environment Variable Format

The three required environment variables are:

- **INDEXER_SERVER**: The URL of the Indexer service
- **INDEXER_PORT**: The port number
- **INDEXER_TOKEN**: The authentication token (or empty for public nodes)

### Network-Specific Configurations

**LocalNet (Development):**
```bash
INDEXER_SERVER=http://localhost
INDEXER_PORT=8980
INDEXER_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

**TestNet:**
```bash
INDEXER_SERVER=https://testnet-idx.algonode.cloud
INDEXER_PORT=443
INDEXER_TOKEN=
```

**MainNet:**
```bash
INDEXER_SERVER=https://mainnet-idx.algonode.cloud
INDEXER_PORT=443
INDEXER_TOKEN=
```

Note: Public Algonode services don't require a token, so INDEXER_TOKEN can be empty.

## Prerequisites

- Node.js and npm installed
- AlgoKit installed (for LocalNet)
- Docker installed (for LocalNet)

## Running the Example

1. Start LocalNet (optional, example sets env vars):
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
=== Indexer Client Configuration Example ===

1. Configuring Indexer client with environment variables:
  ✓ AlgorandClient created successfully from environment variables
  ✓ Successfully connected to Indexer:
    - Server: http://localhost:8980
    - Token: aaaaaaaaaa...
    - Round: 27

2. Indexer capabilities:
  The Indexer allows you to:
    • Query account information and balances
    • Search for transactions by various criteria
    • Look up asset information
    • Retrieve application state and history
    • Access block information

3. Creating custom Indexer client:
  ✓ Custom Indexer client created successfully:
    - Round: 27

=== Environment Setup Tips ===
For LocalNet (development):
  INDEXER_SERVER=http://localhost
  INDEXER_PORT=8980
  INDEXER_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

For TestNet:
  INDEXER_SERVER=https://testnet-idx.algonode.cloud
  INDEXER_PORT=443
  INDEXER_TOKEN= (leave empty for public nodes)

For MainNet:
  INDEXER_SERVER=https://mainnet-idx.algonode.cloud
  INDEXER_PORT=443
  INDEXER_TOKEN= (leave empty for public nodes)

=== Key Takeaways ===
• Set INDEXER_SERVER, INDEXER_PORT, and INDEXER_TOKEN environment variables
• Use AlgorandClient.fromEnvironment() to create client with indexer
• Indexer is essential for querying historical blockchain data
• This pattern works great for different deployment environments
• You can also create custom indexer clients with algosdk.Indexer
```

## Key Takeaways

- Use environment variables for Indexer client configuration
- Three required variables: INDEXER_SERVER, INDEXER_PORT, INDEXER_TOKEN
- `AlgorandClient.fromEnvironment()` automatically configures indexer
- Indexer is essential for querying historical blockchain data
- Public nodes (Algonode) don't require authentication tokens
- Network-specific configurations make switching between networks easy
- Custom clients can be created with `algosdk.Indexer` when needed
- Use `makeHealthCheck()` to verify indexer connectivity
- Indexer enables powerful blockchain data queries
- This pattern works seamlessly with CI/CD pipelines
