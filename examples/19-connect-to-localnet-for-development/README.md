# Connect to LocalNet for Development

This example demonstrates how to connect to LocalNet for local development and testing. LocalNet provides a complete Algorand blockchain environment running on your machine, perfect for rapid development without network fees or delays.

## What This Example Shows

This example teaches you how to:

- Connect to LocalNet using `AlgorandClient.defaultLocalNet()`
- Verify the connection by checking node status
- Access network parameters and configuration
- Understand LocalNet's role in development workflow
- Check consensus version and blockchain state

## Why This Matters

LocalNet is essential for efficient Algorand development:

1. **Fast Iteration**: Instant block times for rapid testing
2. **Zero Cost**: No transaction fees, unlimited testing
3. **Complete Control**: Full control over blockchain state
4. **Offline Development**: No internet connection required
5. **Safe Experimentation**: Test without risking real assets

Key concepts:

- **LocalNet**: Local Algorand blockchain running in Docker
- **AlgorandClient.defaultLocalNet()**: Convenient method to connect
- **Node Status**: Real-time information about blockchain state
- **Network Parameters**: Configuration details for transactions

Common use cases:

- **Smart Contract Development**: Test contracts before deployment
- **DApp Development**: Build applications without TestNet delays
- **Integration Testing**: Test complete workflows end-to-end
- **Learning**: Learn Algorand development safely
- **Debugging**: Full access to blockchain state for debugging

## How It Works

The example demonstrates connecting to LocalNet and verifying the connection:

### 1. Create LocalNet Client

Connect to LocalNet with a single line:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()
```

`AlgorandClient.defaultLocalNet()` automatically configures:

- **Server**: http://localhost:4001
- **Authentication token**: LocalNet default token
- **All clients**: algod, indexer, and KMD

No manual configuration needed!

### 2. Access Algod Client

Get the algod client for blockchain operations:

```typescript
const algod = algorand.client.algod
```

The algod client is your primary interface to the blockchain for:

- Submitting transactions
- Reading blockchain state
- Querying accounts
- Getting network information

### 3. Check Node Status

Verify LocalNet is running and get blockchain state:

```typescript
const status = await algod.status().do()

console.log(`Last Round: ${status.lastRound}`)
console.log(`Last Consensus Version: ${status.lastVersion}`)
console.log(`Time Since Last Round: ${status.timeSinceLastRound}ms`)
```

Status information includes:

- **Last Round**: Current blockchain height
- **Consensus Version**: Protocol version being used
- **Time Since Last Round**: How long since last block
- **Next Version Info**: Upcoming protocol upgrades

This is a good health check to ensure LocalNet is operational.

### 4. Get Network Parameters

Retrieve transaction parameters:

```typescript
const params = await algod.getTransactionParams().do()

console.log(`Genesis ID: ${params.genesisID}`)
console.log(`Min Fee: ${params.minFee} microAlgos`)
```

Network parameters include:

- **Genesis ID**: Unique identifier for this network
- **Genesis Hash**: Initial block hash
- **Min Fee**: Minimum transaction fee (1000 microAlgos on LocalNet)

These parameters are used when constructing transactions.

## LocalNet vs Other Networks

Understanding when to use each network:

**LocalNet (Development)**:

- Fastest development iteration
- No network delays
- Free transactions
- Full control over state
- Offline development
- Use: Development and unit testing

**TestNet (Testing)**:

- Public test network
- Free test ALGO
- Real network conditions
- Multi-developer testing
- Use: Integration testing before production

**MainNet (Production)**:

- Real ALGO with value
- Production transactions
- Public blockchain
- Use: Live applications

## Development Workflow

Typical LocalNet development workflow:

1. **Start LocalNet**: `algokit localnet start`
2. **Develop locally**: Fast iteration on LocalNet
3. **Test on TestNet**: Validate in real network conditions
4. **Deploy to MainNet**: Launch production application

## Prerequisites

- Node.js and npm installed
- AlgoKit installed (`pip install algokit` or `pipx install algokit`)
- Docker installed and running
- LocalNet running (`algokit localnet start`)

## Running the Example

1. Start LocalNet:

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

4. (Optional) Stop LocalNet when done:
   ```bash
   algokit localnet stop
   ```

## Expected Output

```
=== Connect to LocalNet for Development ===

1. Connecting to LocalNet...
  ✓ LocalNet client created successfully
    - Server: http://localhost:4001
    - Default configuration for local development

2. Checking LocalNet status...
  ✓ Successfully connected to LocalNet!

  LocalNet Status:
    - Last Round: 0
    - Last Consensus Version: https://github.com/algorandfoundation/specs/tree/953304de35264fc3ef91bcd05c123242015eeaed
    - Next Consensus Version: https://github.com/algorandfoundation/specs/tree/953304de35264fc3ef91bcd05c123242015eeaed
    - Next Version Round: 1
    - Next Version Supported: true
    - Time Since Last Round: 0ms
    - Catchup Time: 0ms

3. Getting network parameters...
  ✓ Network parameters retrieved

  Network Parameters:
    - Genesis ID: dockernet-v1
    - Genesis Hash: 40,178,34,29,54,10,28,150,82,109,75,16,199,194,235,155,189,171,85,108,84,31,78,45,97,140,71,39,226,208,100,195
    - Min Fee: 1000 microAlgos

=== Summary ===
✅ LocalNet connection successful!

You can now use this client for:
  • Deploying and testing smart contracts
  • Creating and managing accounts
  • Submitting transactions
  • Testing application workflows

=== Key Takeaways ===
• Use AlgorandClient.defaultLocalNet() for local development
• LocalNet runs on http://localhost:4001
• Start LocalNet with: algokit localnet start
• LocalNet is perfect for fast, free development
```

## Troubleshooting

**Error: Connection refused**

- Make sure LocalNet is running: `algokit localnet start`
- Check Docker is running: `docker ps`
- Verify port 4001 is available

**LocalNet not starting**

- Check Docker daemon is running
- Free up system resources
- Try resetting: `algokit localnet reset`

**Slow performance**

- Allocate more resources to Docker
- Close unnecessary applications
- Check available disk space

## Useful LocalNet Commands

- **Start**: `algokit localnet start`
- **Stop**: `algokit localnet stop`
- **Reset**: `algokit localnet reset` (clears all state)
- **Status**: `algokit localnet status`
- **Explore**: `algokit explore` (web UI for LocalNet)

## Key Takeaways

- Use `AlgorandClient.defaultLocalNet()` for local development
- LocalNet provides a complete blockchain environment locally
- Perfect for fast, free development and testing
- No manual configuration required
- Runs on http://localhost:4001 by default
- Start LocalNet with `algokit localnet start`
- LocalNet includes algod, indexer, and KMD services
- Instant block times for rapid iteration
- Zero transaction fees for unlimited testing
- Full control over blockchain state
- Reset state anytime with `algokit localnet reset`
- Use LocalNet for development, TestNet for testing, MainNet for production
