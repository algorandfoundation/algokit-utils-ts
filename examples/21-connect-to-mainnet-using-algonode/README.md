# Connect to MainNet Using AlgoNode

This example demonstrates how to connect to Algorand MainNet using AlgoNode's free public infrastructure. MainNet is the production blockchain where real ALGO transactions occur, and AlgoNode makes it easy to connect without running your own node.

## What This Example Shows

This example teaches you how to:
- Connect to MainNet using `AlgorandClient.mainNet()`
- Access the algod client for blockchain operations
- Verify the connection with network status checks
- Get transaction parameters for MainNet
- Understand the difference between development and production networks

## Why This Matters

Connecting to MainNet is essential for production applications:

1. **Production Access**: Connect to the live blockchain with real ALGO
2. **No Infrastructure**: No need to run your own MainNet node
3. **Free Access**: AlgoNode provides free public API access
4. **Production Ready**: High availability for production applications
5. **Easy Setup**: Single line of code to connect

Key concepts:
- **MainNet**: Algorand's production blockchain with real value
- **AlgoNode**: Free public infrastructure provider
- **Algod**: Main API for blockchain operations
- **Production vs Development**: Real transactions vs testing

Common use cases:
- **Production DApps**: Deploy applications to MainNet
- **Wallet Applications**: Manage real ALGO and assets
- **Payment Systems**: Process real ALGO transactions
- **Asset Management**: Work with real Algorand Standard Assets
- **Smart Contracts**: Deploy and interact with production contracts

## How It Works

The example demonstrates connecting to MainNet and verifying the connection:

### 1. Create MainNet Client

Connect to MainNet with a single line:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.mainNet()
```

`AlgorandClient.mainNet()` automatically configures:
- **Algod**: https://mainnet-api.algonode.cloud:443
- **Indexer**: https://mainnet-idx.algonode.cloud:443
- **No authentication required**

Both clients are ready for production use!

### 2. Access Algod Client

Get the algod client for blockchain operations:

```typescript
const algod = algorand.client.algod
```

The algod client is your interface to MainNet for:
- Submitting transactions with real ALGO
- Querying account balances
- Reading blockchain state
- Getting network information
- Deploying smart contracts

### 3. Check Network Status

Verify MainNet connection and get current state:

```typescript
const status = await algod.status().do()

console.log(`Last Round: ${status.lastRound}`)
console.log(`Time Since Last Round: ${status.timeSinceLastRound}ms`)
console.log(`Last Version: ${status.lastVersion}`)
```

Network status provides:
- **Last Round**: Current blockchain height (55M+ on MainNet)
- **Time Since Last Round**: How long since last block
- **Last Version**: Current consensus protocol version
- **Catchup Time**: Node synchronization status

This confirms you're connected to the live MainNet!

### 4. Get Transaction Parameters

Retrieve parameters needed for transactions:

```typescript
const params = await algod.getTransactionParams().do()

console.log(`Genesis ID: ${params.genesisID}`)
console.log(`Min Fee: ${params.minFee} microAlgos`)
console.log(`Consensus Version: ${params.consensusVersion}`)
```

Transaction parameters include:
- **Genesis ID**: "mainnet-v1.0" for MainNet
- **Genesis Hash**: Unique identifier for MainNet
- **Min Fee**: Minimum transaction fee (1000 microAlgos)
- **Consensus Version**: Protocol version

These parameters are required when constructing MainNet transactions.

## MainNet vs TestNet vs LocalNet

Understanding which network to use:

**MainNet (Production)**:
- Real ALGO with real value
- Production transactions
- Use for live applications
- High security requirements
- This example

**TestNet (Testing)**:
- Free test ALGO (no value)
- Test before MainNet
- Use `AlgorandClient.testNet()`
- Safe for experimentation

**LocalNet (Development)**:
- Local development network
- Fastest iteration
- Use `AlgorandClient.defaultLocalNet()`
- Full control over state

## Important Considerations

### Production Checklist

Before deploying to MainNet:
1. **Test Thoroughly**: Test on TestNet first
2. **Security Review**: Audit smart contracts
3. **Error Handling**: Handle all error cases
4. **Rate Limits**: Be aware of AlgoNode rate limits
5. **Transaction Costs**: Real ALGO costs real money
6. **Backup Keys**: Secure private key management

### AlgoNode Rate Limits

AlgoNode provides free access but has rate limits:
- Suitable for most applications
- For high-volume production apps, consider:
  - Running your own node
  - Using a paid API service
  - Implementing request caching

### Security Best Practices

When working with MainNet:
- **Never commit private keys** to version control
- **Use environment variables** for sensitive data
- **Test transactions** on TestNet first
- **Start with small amounts** when testing
- **Implement proper error handling**
- **Monitor transaction costs**

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
=== Connect to MainNet Using AlgoNode ===

1. Connecting to Algorand MainNet via AlgoNode...
  ✓ Successfully connected to MainNet
    - Algod: https://mainnet-api.algonode.cloud:443
    - Using AlgoNode public infrastructure

2. Fetching network status...
  ✓ Network status retrieved

  Network Information:
    - Last Round: 55496729
    - Time Since Last Round: 2713986061ms
    - Catchup Time: 0ms
    - Last Version: https://github.com/algorandfoundation/specs/tree/953304de35264fc3ef91bcd05c123242015eeaed

3. Fetching transaction parameters...
  ✓ Transaction parameters retrieved

  Transaction Parameters:
    - Genesis ID: mainnet-v1.0
    - Genesis Hash: 192,97,196,216,252,29,189,222,210,215,96,75,228,86,142,63,109,4,25,135,172,55,189,228,182,32,181,171,57,36,138,223
    - Min Fee: 1000 microAlgos
    - Consensus Version: https://github.com/algorandfoundation/specs/tree/953304de35264fc3ef91bcd05c123242015eeaed

=== Summary ===
✅ Successfully connected to Algorand MainNet!

You can now use this client to:
  • Query account balances and information
  • Submit transactions to MainNet
  • Read application and asset data
  • Monitor blockchain activity

=== Key Takeaways ===
• Use AlgorandClient.mainNet() to connect to MainNet
• AlgoNode provides free public API access
• No authentication required for public AlgoNode services
• MainNet contains real ALGO with real value

Note: For production applications with high request volumes,
consider running your own node or using a rate-limited API service.
```

## Development to Production Workflow

Typical workflow from development to production:

1. **Develop on LocalNet**: Fast iteration, no costs
2. **Test on TestNet**: Validate with test ALGO
3. **Deploy to MainNet**: Launch production application
4. **Monitor**: Track transactions and errors
5. **Maintain**: Update and optimize as needed

## Key Takeaways

- Use `AlgorandClient.mainNet()` to connect to Algorand MainNet
- AlgoNode provides free public algod access at https://mainnet-api.algonode.cloud:443
- No authentication or API keys required for basic usage
- MainNet contains real ALGO with real monetary value
- Always test on TestNet before deploying to MainNet
- Genesis ID for MainNet is "mainnet-v1.0"
- Minimum transaction fee is 1000 microAlgos (0.001 ALGO)
- Both algod and indexer clients are configured automatically
- Perfect for production applications, wallets, and DApps
- Consider rate limits for high-volume applications
- Implement proper security practices for production
- AlgoNode offers reliable, high-availability service
