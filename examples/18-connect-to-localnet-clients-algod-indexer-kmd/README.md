# Connect to LocalNet Clients (Algod, Indexer, KMD)

This example demonstrates how to connect to all LocalNet services (algod, indexer, and KMD) for local development and testing. LocalNet provides a complete Algorand blockchain environment running on your local machine via Docker.

## What This Example Shows

This example teaches you how to:
- Connect to LocalNet using `AlgorandClient.defaultLocalNet()`
- Access the algod client for blockchain operations
- Access the indexer client for querying blockchain data
- Access the KMD client for wallet management
- Verify connectivity to all three services
- List available KMD wallets

## Why This Matters

LocalNet is essential for Algorand development:

1. **Complete Development Environment**: All services in one place
2. **No Network Fees**: Free transactions for unlimited testing
3. **Fast Iteration**: Instant block times for rapid development
4. **Full Control**: Reset state, configure parameters, test scenarios
5. **Offline Development**: No internet connection required

Key concepts:
- **Algod**: Main API for submitting transactions and querying blockchain state
- **Indexer**: Searchable database for historical blockchain data
- **KMD (Key Management Daemon)**: Manages wallets and private keys
- **LocalNet**: Local Algorand network running in Docker containers

Common use cases:
- **Smart Contract Development**: Test smart contracts locally
- **DApp Development**: Build applications without TestNet delays
- **Integration Testing**: Test complete application workflows
- **Learning**: Experiment safely without real ALGO
- **Debugging**: Full access to debug information and state

## How It Works

The example demonstrates connecting to all three LocalNet services:

### 1. Create LocalNet Client

Create an AlgorandClient configured for LocalNet:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()
```

`AlgorandClient.defaultLocalNet()` automatically configures:
- **Algod**: http://localhost:4001
- **Indexer**: http://localhost:8980
- **KMD**: http://localhost:4002

All with the correct authentication tokens for LocalNet.

### 2. Access Algod Client

Algod is the main API for blockchain operations:

```typescript
const algod = algorand.client.algod

// Verify connection
const status = await algod.status().do()
console.log(`Last Round: ${status.lastRound}`)
console.log(`Time Since Last Round: ${status.timeSinceLastRound}ms`)
```

Use algod to:
- Submit transactions
- Query blockchain state
- Get account information
- Check network status
- Read blocks

### 3. Access Indexer Client

Indexer provides searchable access to blockchain data:

```typescript
const indexer = algorand.client.indexer

// Verify connection
const health = await indexer.makeHealthCheck().do()
console.log(`Round: ${health.round}`)
```

Use indexer to:
- Query transaction history
- Search accounts and assets
- Look up application state
- Access historical data
- Build analytics

### 4. Access KMD Client

KMD manages wallets and private keys:

```typescript
const kmd = algorand.client.kmd

// List available wallets
const wallets = await kmd.listWallets()
console.log(`Found ${wallets.wallets.length} wallet(s)`)
wallets.wallets.forEach((wallet) => {
  console.log(`  • ${wallet.name}`)
})
```

Use KMD to:
- Manage wallets
- List wallet accounts
- Sign transactions
- Export/import keys
- Secure key storage

### 5. All Clients in One

The AlgorandClient provides convenient access to all three:

```typescript
const algorand = AlgorandClient.defaultLocalNet()

// All clients readily available
const algod = algorand.client.algod
const indexer = algorand.client.indexer
const kmd = algorand.client.kmd
```

No need to configure each client separately!

## LocalNet Services

LocalNet runs these services in Docker containers:

**Algod (Port 4001)**:
- Main blockchain node
- Transaction submission
- State queries
- Block production

**Indexer (Port 8980)**:
- Historical data indexing
- Transaction search
- Account queries
- Asset lookups

**KMD (Port 4002)**:
- Wallet management
- Key storage
- Transaction signing
- Account creation

**Default Wallets**:
LocalNet includes pre-funded wallets:
- `unencrypted-default-wallet`: Main development wallet
- Other wallets for testing multi-account scenarios

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
=== Connect to LocalNet Clients (Algod, Indexer, KMD) ===

1. Creating LocalNet client configuration...
  ✓ LocalNet client created successfully

2. Testing algod client connection...
  ✓ Successfully connected to LocalNet algod client
    - Server: http://localhost:4001
    - Last Round: 27
    - Time Since Last Round: 909059411499ms

3. Testing indexer client connection...
  ✓ Successfully connected to LocalNet indexer client
    - Server: http://localhost:8980
    - Indexer is healthy and ready for queries
    - Round: 27

4. Testing KMD client connection...
  ✓ Successfully connected to LocalNet KMD client
    - Server: http://localhost:4002
    - Found 8 wallet(s):
      • 21ae14f5-eb78-4aae-b301-d465ad59276e
      • 3279d74f-66b5-4b39-80dd-cd0ad01e3490
      • 4a3709b6-7ce0-42e4-a788-b34836e2d04d
      • 5a91ff5c-5ffb-442e-83d8-c46997118846
      • ALICE
      • DISPENSER
      • d7b781c6-77e4-4b58-ab54-a54c6e888cf3
      • unencrypted-default-wallet

=== Summary ===
✅ All LocalNet clients connected successfully!

You can now use these clients for:
  • algod: Submit transactions, query blockchain state
  • indexer: Search and query historical blockchain data
  • kmd: Manage wallets and sign transactions

=== Key Takeaways ===
• Use AlgorandClient.defaultLocalNet() to connect to LocalNet
• Access clients via algorand.client.algod, .indexer, and .kmd
• LocalNet must be running: algokit localnet start
• Default ports: algod (4001), indexer (8980), kmd (4002)
```

## Troubleshooting

**Error: Connection refused**
- Make sure LocalNet is running: `algokit localnet start`
- Check Docker is running: `docker ps`

**Error: Container not found**
- Reset LocalNet: `algokit localnet reset`
- Start fresh: `algokit localnet start`

**Slow performance**
- Allocate more resources to Docker
- Close unnecessary applications
- Check system resource usage

## Key Takeaways

- Use `AlgorandClient.defaultLocalNet()` to connect to LocalNet services
- All three clients (algod, indexer, KMD) are automatically configured
- Access clients via `algorand.client.algod`, `.indexer`, and `.kmd`
- LocalNet must be running before connecting
- Default ports: algod (4001), indexer (8980), kmd (4002)
- LocalNet includes pre-funded wallets for testing
- Perfect for local development and testing
- No network fees or TestNet delays
- Full control over blockchain state
- Start LocalNet with `algokit localnet start`
- Stop LocalNet with `algokit localnet stop`
- Reset LocalNet state with `algokit localnet reset`
