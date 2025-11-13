# Connect to Algorand Networks Using AlgoNode

This example demonstrates how to connect to Algorand networks using AlgoNode infrastructure. AlgoNode provides free, public API access to MainNet and TestNet, making it easy to connect without running your own node.

## What This Example Shows

This example teaches you how to:
- Connect to Algorand MainNet using AlgoNode
- Connect to Algorand TestNet using AlgoNode
- Access both algod (node) and indexer APIs through AlgoNode
- Use convenient helper methods for network connections
- Understand the differences between MainNet, TestNet, and LocalNet

## Why This Matters

AlgoNode simplifies Algorand development in several ways:

1. **No Infrastructure**: No need to run your own Algorand node
2. **Free Access**: Public, free API access to MainNet and TestNet
3. **High Availability**: Reliable infrastructure maintained by AlgoNode
4. **Complete APIs**: Access to both algod and indexer services
5. **Production Ready**: Suitable for development, testing, and production

Key concepts:
- **AlgorandClient.mainNet()**: Connects to MainNet via AlgoNode
- **AlgorandClient.testNet()**: Connects to TestNet via AlgoNode
- **AlgoNode**: Public infrastructure provider for Algorand networks
- **No Authentication**: AlgoNode public services don't require API keys

Common use cases:
- **DApp Development**: Connect your application to MainNet or TestNet
- **Testing**: Test smart contracts on TestNet before MainNet deployment
- **Production**: Use AlgoNode for production applications
- **Prototyping**: Quick setup without infrastructure overhead

## How It Works

The example demonstrates connecting to different Algorand networks:

### 1. Connect to MainNet

Connect to Algorand MainNet for production transactions:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const mainnet = AlgorandClient.mainNet()

// Test the connection
const status = await mainnet.client.algod.status().do()
const health = await mainnet.client.indexer.makeHealthCheck().do()

console.log(`Current Round: ${status.lastRound}`)
console.log(`Indexer Round: ${health.round}`)
```

`AlgorandClient.mainNet()` creates a client configured with:
- **Algod**: https://mainnet-api.algonode.cloud:443
- **Indexer**: https://mainnet-idx.algonode.cloud:443
- **No authentication required**

MainNet is used for real transactions with real ALGO. Always test thoroughly on TestNet first!

### 2. Connect to TestNet

Connect to Algorand TestNet for testing:

```typescript
const testnet = AlgorandClient.testNet()

// Test the connection
const status = await testnet.client.algod.status().do()
const health = await testnet.client.indexer.makeHealthCheck().do()

console.log(`Current Round: ${status.lastRound}`)
console.log(`Indexer Round: ${health.round}`)
```

`AlgorandClient.testNet()` creates a client configured with:
- **Algod**: https://testnet-api.algonode.cloud:443
- **Indexer**: https://testnet-idx.algonode.cloud:443
- **Free test ALGO available** via dispenser

TestNet is a safe environment for testing with free test ALGO that has no real-world value.

### 3. Network Comparison

Different networks serve different purposes:

**MainNet (Production)**:
- Real ALGO with real value
- Use for production applications
- Test thoroughly before deploying

**TestNet (Testing)**:
- Free test ALGO (no value)
- Use for testing smart contracts
- Get test ALGO from dispenser
- Safe environment for experimentation

**LocalNet (Development)**:
- Runs on your local machine via Docker
- Use `AlgorandClient.defaultLocalNet()` or `.fromEnvironment()`
- Full control over network state
- Fastest for development iteration

### 4. Both APIs Included

Each AlgoNode connection provides both APIs:

```typescript
const mainnet = AlgorandClient.mainNet()

// Algod API - for transactions and blocks
const status = await mainnet.client.algod.status().do()

// Indexer API - for querying historical data
const health = await mainnet.client.indexer.makeHealthCheck().do()
```

- **Algod**: Submit transactions, read blocks, get network status
- **Indexer**: Query transaction history, search accounts, look up assets

## Network Selection Best Practices

Choose the right network for your use case:

1. **Development**: Use LocalNet for fastest iteration
   ```typescript
   const localnet = AlgorandClient.defaultLocalNet()
   ```

2. **Testing**: Use TestNet for integration testing
   ```typescript
   const testnet = AlgorandClient.testNet()
   ```

3. **Production**: Use MainNet for live applications
   ```typescript
   const mainnet = AlgorandClient.mainNet()
   ```

## Prerequisites

- Node.js and npm installed
- Internet connection (to connect to AlgoNode services)

## Running the Example

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the example:
   ```bash
   npm start
   ```

## Expected Output

```
=== Connect to Algorand Networks Using AlgoNode ===

1. Connecting to MainNet via AlgoNode:
  ✓ Successfully connected to MainNet
    - Algod: https://mainnet-api.algonode.cloud:443
    - Indexer: https://mainnet-idx.algonode.cloud:443
    - Current Round: 55496495
    - Indexer Round: 55496495

2. Connecting to TestNet via AlgoNode:
  ✓ Successfully connected to TestNet
    - Algod: https://testnet-api.algonode.cloud:443
    - Indexer: https://testnet-idx.algonode.cloud:443
    - Current Round: 57457094
    - Indexer Round: 57457095

3. Benefits of using AlgoNode:
  • Free, public access to Algorand networks
  • No authentication required
  • High availability and reliability
  • Supports both algod (node) and indexer APIs
  • Perfect for development, testing, and production
  • No need to run your own node infrastructure

4. Network configurations:
  MainNet (Production):
    - Use for real transactions with real ALGO
    - Algod: https://mainnet-api.algonode.cloud:443
    - Indexer: https://mainnet-idx.algonode.cloud:443

  TestNet (Testing):
    - Use for testing with free test ALGO
    - Get test ALGO from dispenser
    - Algod: https://testnet-api.algonode.cloud:443
    - Indexer: https://testnet-idx.algonode.cloud:443

  LocalNet (Development):
    - Use AlgorandClient.defaultLocalNet() or .fromEnvironment()
    - Runs on your local machine via Docker
    - Algod: http://localhost:4001
    - Indexer: http://localhost:8980

=== Key Takeaways ===
• Use AlgorandClient.mainNet() for MainNet connections
• Use AlgorandClient.testNet() for TestNet connections
• AlgoNode provides free, reliable infrastructure
• No authentication required for public AlgoNode services
• Both algod and indexer clients are automatically configured
```

## Key Takeaways

- Use `AlgorandClient.mainNet()` to connect to MainNet via AlgoNode
- Use `AlgorandClient.testNet()` to connect to TestNet via AlgoNode
- AlgoNode provides free, public infrastructure for Algorand networks
- No authentication or API keys required for AlgoNode services
- Both algod and indexer clients are automatically configured
- MainNet is for production with real ALGO
- TestNet is for testing with free test ALGO
- LocalNet is for local development
- Choose the right network for your use case
- AlgoNode eliminates the need to run your own node infrastructure
- Perfect for DApp development, testing, and production applications
