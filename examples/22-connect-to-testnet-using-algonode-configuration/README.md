# Connect to TestNet Using AlgoNode

This example demonstrates how to connect to Algorand TestNet using AlgoNode's free public infrastructure. TestNet is the testing blockchain where you can experiment with free test ALGO before deploying to MainNet.

## What This Example Shows

This example teaches you how to:
- Connect to TestNet using `AlgorandClient.testNet()`
- Access both algod and indexer clients for TestNet
- Verify connections with status checks
- Get transaction parameters for TestNet
- Understand when to use TestNet vs MainNet vs LocalNet

## Why This Matters

TestNet is crucial for safe application development:

1. **Risk-Free Testing**: Test with free ALGO that has no value
2. **Real Network Conditions**: Test on a public network like MainNet
3. **No Infrastructure**: No need to run your own TestNet node
4. **Free Access**: AlgoNode provides free public access
5. **Production Validation**: Final testing before MainNet deployment

Key concepts:
- **TestNet**: Algorand's public test blockchain
- **Test ALGO**: Free cryptocurrency for testing (no real value)
- **AlgoNode**: Free public infrastructure provider
- **Dispenser**: Service that provides free test ALGO

Common use cases:
- **Integration Testing**: Test complete application workflows
- **Smart Contract Testing**: Deploy and test contracts safely
- **Multi-User Testing**: Test with multiple accounts
- **Pre-Production Validation**: Final testing before MainNet
- **Learning**: Practice without financial risk

## How It Works

The example demonstrates connecting to TestNet and verifying both algod and indexer:

### 1. Create TestNet Client

Connect to TestNet with a single line:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.testNet()
```

`AlgorandClient.testNet()` automatically configures:
- **Algod**: https://testnet-api.algonode.cloud:443
- **Indexer**: https://testnet-idx.algonode.cloud:443
- **No authentication required**

Both clients are ready for TestNet testing!

### 2. Access Both Clients

Get algod and indexer clients:

```typescript
const algod = algorand.client.algod
const indexer = algorand.client.indexer
```

Use algod for:
- Submitting test transactions
- Deploying smart contracts
- Querying account balances

Use indexer for:
- Searching transaction history
- Querying historical data
- Looking up accounts and assets

### 3. Verify Algod Connection

Check TestNet algod status:

```typescript
const status = await algod.status().do()

console.log(`Last Round: ${status.lastRound}`)
console.log(`Time Since Last Round: ${status.timeSinceLastRound}ms`)
```

TestNet status shows:
- **Last Round**: Current blockchain height (57M+ on TestNet)
- **Time Since Last Round**: Block production time
- Confirms connection to TestNet algod

### 4. Verify Indexer Connection

Check TestNet indexer health:

```typescript
const health = await indexer.makeHealthCheck().do()

console.log(`Current Round: ${health.round}`)
console.log(`Version: ${health.version}`)
```

Indexer health confirms:
- Indexer is operational
- Current synced round
- Indexer software version

### 5. Get Transaction Parameters

Retrieve TestNet transaction parameters:

```typescript
const params = await algod.getTransactionParams().do()

console.log(`Genesis ID: ${params.genesisID}`)
console.log(`Min Fee: ${params.minFee} microAlgos`)
```

TestNet parameters:
- **Genesis ID**: "testnet-v1.0" for TestNet
- **Min Fee**: 1000 microAlgos (same as MainNet)
- Required for constructing TestNet transactions

## Getting Test ALGO

To use TestNet, you need test ALGO from the dispenser:

**TestNet Dispenser**:
- URL: https://bank.testnet.algorand.network/
- Provides free test ALGO
- No registration required
- Use for testing transactions

**Using AlgoKit**:
```bash
# Fund an account with test ALGO
algokit dispense testnet -a YOUR_ADDRESS
```

## TestNet vs MainNet vs LocalNet

Understanding which network to use:

**LocalNet (Development)**:
- Fastest iteration
- Complete control
- Offline development
- Use: Initial development

**TestNet (Testing)**:
- Public test network
- Free test ALGO
- Real network conditions
- Use: Integration testing

**MainNet (Production)**:
- Real ALGO with value
- Production blockchain
- Live applications
- Use: Production deployment

## Development Workflow

Typical testing workflow:

1. **Develop on LocalNet**: Fast iteration and debugging
2. **Test on TestNet**: Validate with real network conditions
3. **Get test ALGO**: Use dispenser for testing
4. **Run integration tests**: Test complete workflows
5. **Deploy to MainNet**: Launch production application

## Prerequisites

- Node.js and npm installed
- Internet connection (to connect to AlgoNode)
- (Optional) Test ALGO from dispenser for transactions

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
=== Connect to TestNet Using AlgoNode ===

1. Connecting to Algorand TestNet via AlgoNode...
  ✓ Successfully connected to TestNet
    - Algod: https://testnet-api.algonode.cloud:443
    - Indexer: https://testnet-idx.algonode.cloud:443
    - Using AlgoNode public infrastructure

2. Verifying algod connection...
  ✓ Algod connection verified

  Network Status:
    - Last Round: 57457382
    - Time Since Last Round: 676114212ms

3. Verifying indexer connection...
  ✓ Indexer connection verified

  Indexer Health:
    - Current Round: 57457382
    - Version: 3.9.0

4. Fetching transaction parameters...
  ✓ Transaction parameters retrieved

  Transaction Parameters:
    - Genesis ID: testnet-v1.0
    - Min Fee: 1000 microAlgos

=== Summary ===
✅ Successfully connected to TestNet!

You can now use TestNet to:
  • Test your applications with free test ALGO
  • Deploy and test smart contracts
  • Practice transactions without risk
  • Get test ALGO from the dispenser
  • Validate before deploying to MainNet

=== Key Takeaways ===
• Use AlgorandClient.testNet() to connect to TestNet
• AlgoNode provides free public access
• TestNet uses free test ALGO (no real value)
• Perfect for testing before MainNet deployment
```

## TestNet Best Practices

### Testing Strategy

1. **Start Simple**: Test basic transactions first
2. **Incremental Complexity**: Add features gradually
3. **Edge Cases**: Test error conditions
4. **Performance**: Test under load
5. **Final Validation**: Complete end-to-end testing

### Common TestNet Uses

- **Smart Contract Deployment**: Test contracts before MainNet
- **Transaction Testing**: Verify transaction logic
- **Multi-Signature**: Test multi-sig workflows
- **Asset Creation**: Test ASA creation and transfers
- **Application Testing**: Validate DApp functionality

### Important Notes

- TestNet may be reset periodically
- Test ALGO has no monetary value
- Network conditions may differ from MainNet
- Use TestNet for all pre-production testing
- Always test thoroughly before MainNet deployment

## Key Takeaways

- Use `AlgorandClient.testNet()` to connect to TestNet via AlgoNode
- TestNet provides free test ALGO for safe testing
- AlgoNode offers free public access at https://testnet-api.algonode.cloud:443
- No authentication required for public AlgoNode services
- Genesis ID for TestNet is "testnet-v1.0"
- Both algod and indexer clients are configured automatically
- Perfect for integration testing and pre-production validation
- Get free test ALGO from https://bank.testnet.algorand.network/
- TestNet simulates real network conditions without financial risk
- Always test on TestNet before deploying to MainNet
- TestNet may be reset, so don't rely on persistent data
- Ideal for learning, testing, and validating applications
