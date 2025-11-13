# Create an Algorand Application

This example demonstrates how to create (deploy) a new Algorand application from scratch using TEAL source code. This is a foundational example for deploying smart contracts on Algorand.

## What This Example Shows

This example teaches you how to:
- Define TEAL approval and clear state programs
- Configure state schema (storage requirements)
- Create an application using `algorand.send.appCreate`
- Access the dispenser account for funding
- Verify the app ID and derive the app address
- Confirm the transaction on-chain

## Why This Matters

Creating applications from scratch is fundamental to Algorand development:

1. **Smart Contract Deployment**: Foundation for all on-chain logic
2. **State Management**: Configure global and local storage requirements
3. **TEAL Programming**: Write and deploy TEAL source code
4. **App Address Derivation**: Understand how app addresses are calculated
5. **Transaction Confirmation**: Verify successful deployment

Key concepts:
- **Approval Program**: TEAL code that runs for all app calls
- **Clear State Program**: TEAL code that runs when accounts opt out
- **State Schema**: Defines storage requirements (ints and byte slices)
- **Global State**: Storage shared across all accounts
- **Local State**: Per-account storage (requires opt-in)
- **App ID**: Unique identifier assigned when app is created
- **App Address**: Deterministic address derived from app ID

Common use cases:
- **Smart Contracts**: Deploy business logic to the blockchain
- **DeFi Applications**: Automated market makers, lending protocols
- **NFT Minting**: Create NFT minting applications
- **Governance**: On-chain voting and governance systems
- **Testing**: Deploy test contracts to LocalNet

## How It Works

### 1. Initialize AlgorandClient and Get Dispenser Account

Set up the client and get a funded account:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()

// Get a funded test account from the LocalNet dispenser
const sender = await algorand.account.dispenserFromEnvironment()
console.log('Deploying application from account:', sender.addr.toString())
```

The dispenser account:
- Automatically funded with ALGO on LocalNet
- Used to pay for transaction fees
- Becomes the creator of the application
- Available via `dispenserFromEnvironment()` method

### 2. Define TEAL Programs

Create approval and clear state programs:

```typescript
// Simple approval program that always approves
const approvalProgram = `#pragma version 8
int 1
return`

// Simple clear state program that always succeeds
const clearStateProgram = `#pragma version 8
int 1
return`
```

TEAL programs:
- Written in TEAL (Transaction Execution Approval Language)
- Approval program: Runs for all app interactions
- Clear state program: Runs when accounts opt out
- Must return 1 (true) to approve, 0 (false) to reject
- Automatically compiled by the API when passed as strings

### 3. Configure State Schema

Define storage requirements:

```typescript
const schema = {
  globalInts: 1,       // Number of global uint64 values
  globalByteSlices: 1, // Number of global byte slice values
  localInts: 0,        // Number of local uint64 values per account
  localByteSlices: 0,  // Number of local byte slice values per account
}
```

State schema:
- **globalInts**: Global integer storage slots (uint64)
- **globalByteSlices**: Global byte array storage slots (up to 128 bytes)
- **localInts**: Local integer storage per opted-in account
- **localByteSlices**: Local byte array storage per opted-in account
- Cannot be increased after creation (only decreased with updates)
- Affects minimum balance requirements

### 4. Create the Application

Deploy the application:

```typescript
const app = await algorand.send.appCreate({
  sender: sender.addr,
  approvalProgram: approvalProgram,
  clearStateProgram: clearStateProgram,
  schema: schema,
})

console.log('App ID:', app.appId.toString())
console.log('App Address:', app.appAddress.toString())
console.log('Transaction ID:', app.txIds[0])
console.log('Confirmation Round:', app.confirmations?.[0]?.confirmedRound)
```

The `appCreate` method:
- Accepts TEAL source code as strings (auto-compiled)
- Can also accept compiled bytecode as Uint8Array
- Returns app ID, app address, and transaction details
- Sender becomes the application creator
- Creator can update/delete app (if not made immutable/permanent)

### 5. Verify App Address

Confirm the app address is correctly derived:

```typescript
import algosdk from 'algosdk'

const expectedAddress = algosdk.getApplicationAddress(app.appId).toString()
const actualAddress = app.appAddress.toString()
console.log('App address verification:', actualAddress === expectedAddress ? 'PASSED' : 'FAILED')
```

App address verification:
- App addresses are deterministically derived from app IDs
- Use `algosdk.getApplicationAddress()` to calculate
- Addresses must be converted to strings for comparison
- App address is a regular Algorand address
- Can receive ALGO and assets like any account

## State Schema Details

### Global State
- Shared across all users
- Stored in the application itself
- Accessible by all transactions
- Example: Total supply, protocol parameters

### Local State
- Per-account storage
- Requires account to opt in
- Isolated between accounts
- Example: User balances, user preferences

### Storage Costs

Minimum balance increases based on schema:
- **Global state**: 100,000 microALGOs per schema (int or byte slice)
- **Local state**: Each opted-in account pays for its local storage
- **Extra pages**: 100,000 microALGOs per extra program page

## Prerequisites

- Node.js and npm installed
- AlgoKit CLI installed
- Docker Desktop running (for LocalNet)
- LocalNet running

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

## Expected Output

```
Deploying application from account: L3T2BF5MPTEEDGCSVW7CZXTS5VDKUIANU75SZWVET75N3TPCLTCMNE3LIE

Creating application...
App created by L3T2BF5MPTEEDGCSVW7CZXTS5VDKUIANU75SZWVET75N3TPCLTCMNE3LIE with ID 1033 via transaction JP7MZ3ZISXJFAIOXV5SCJYRCV5BPVRXKLSSOOB75HXN6W6X6B4LA

✅ Application created successfully!
App ID: 1033
App Address: MRWI7SAIE55JQT3UDYKV2G7DVAS32BYTEGBZ265WPMSNJCDF5ONYS5FKGU
Transaction ID: JP7MZ3ZISXJFAIOXV5SCJYRCV5BPVRXKLSSOOB75HXN6W6X6B4LA
Confirmation Round: 33n

✓ App address verification: PASSED

Example completed successfully
```

## Common Patterns

### Creating App with More Complex Schema

```typescript
// App with more storage requirements
const schema = {
  globalInts: 5,       // Store 5 global uint64 values
  globalByteSlices: 3, // Store 3 global byte arrays
  localInts: 2,        // Each account stores 2 uint64 values
  localByteSlices: 1,  // Each account stores 1 byte array
}

const app = await algorand.send.appCreate({
  sender: sender.addr,
  approvalProgram: complexApprovalProgram,
  clearStateProgram: clearStateProgram,
  schema: schema,
})
```

### Creating App with Extra Program Pages

```typescript
// For programs larger than 2KB
const app = await algorand.send.appCreate({
  sender: sender.addr,
  approvalProgram: largeApprovalProgram,
  clearStateProgram: clearStateProgram,
  schema: schema,
  extraProgramPages: 3, // Allow up to 8KB total (2KB + 3*2KB)
})
```

### Creating App with OnComplete Action

```typescript
// Create and opt in simultaneously
const app = await algorand.send.appCreate({
  sender: sender.addr,
  approvalProgram: approvalProgram,
  clearStateProgram: clearStateProgram,
  schema: schema,
  onComplete: algosdk.OnApplicationComplete.OptInOC,
})
```

### Using Compiled Bytecode

```typescript
// If you have pre-compiled TEAL
const approvalCompiled = await algorand.app.compileTeal(approvalProgram)
const clearCompiled = await algorand.app.compileTeal(clearStateProgram)

const app = await algorand.send.appCreate({
  sender: sender.addr,
  approvalProgram: approvalCompiled.compiledBase64ToBytes,
  clearStateProgram: clearCompiled.compiledBase64ToBytes,
  schema: schema,
})
```

### Reading App Information After Creation

```typescript
const app = await algorand.send.appCreate({
  sender: sender.addr,
  approvalProgram: approvalProgram,
  clearStateProgram: clearStateProgram,
  schema: schema,
})

// Get full app information from the chain
const appInfo = await algorand.client.algod
  .getApplicationByID(Number(app.appId))
  .do()

console.log('Creator:', appInfo.params.creator)
console.log('Global state schema:', appInfo.params.globalStateSchema)
console.log('Local state schema:', appInfo.params.localStateSchema)
```

## Best Practices

1. **Define Minimal Schema**
   ```typescript
   // Good: Only allocate what you need
   const schema = {
     globalInts: 2,       // Exactly what we need
     globalByteSlices: 1,
     localInts: 0,        // No local state needed
     localByteSlices: 0,
   }

   // Avoid: Over-allocating storage
   const schema = {
     globalInts: 64,      // Way more than needed
     globalByteSlices: 64,
     localInts: 16,
     localByteSlices: 16,
   }
   ```

2. **Use Version Pragmas**
   ```typescript
   // Good: Specify TEAL version
   const approvalProgram = `#pragma version 8
   int 1
   return`

   // Avoid: Omitting version (may cause issues)
   const approvalProgram = `int 1
   return`
   ```

3. **Test Locally First**
   ```typescript
   // Good: Test on LocalNet
   const algorand = AlgorandClient.defaultLocalNet()
   const app = await algorand.send.appCreate({...})

   // Then deploy to TestNet
   const algorandTestNet = AlgorandClient.testNet()
   const prodApp = await algorandTestNet.send.appCreate({...})
   ```

4. **Handle Addresses as Strings**
   ```typescript
   // Good: Convert to string for comparison
   const expectedAddress = algosdk.getApplicationAddress(app.appId).toString()
   const actualAddress = app.appAddress.toString()
   console.log('Match:', actualAddress === expectedAddress)

   // Avoid: Comparing Address objects
   console.log('Match:', app.appAddress === algosdk.getApplicationAddress(app.appId))
   ```

5. **Store App ID for Future Use**
   ```typescript
   const app = await algorand.send.appCreate({...})

   // Store app ID for future interactions
   const appId = app.appId
   console.log(`Deployed app: ${appId}`)

   // Use it later
   await algorand.send.appCall({
     sender: sender.addr,
     appId: appId,
     args: [/* ... */],
   })
   ```

## Key Takeaways

- Use `algorand.send.appCreate()` to deploy smart contracts
- TEAL source code can be passed as strings (auto-compiled)
- State schema defines storage requirements and cannot be increased later
- Global state is shared; local state is per-account
- App addresses are deterministically derived from app IDs
- Use `dispenserFromEnvironment()` to get funded LocalNet accounts
- Schema property names: `globalInts`, `globalByteSlices`, `localInts`, `localByteSlices`
- Sender must be an address string, not an account object
- Convert Address objects to strings for comparisons and display
- Access confirmations via `app.confirmations?.[0]`
- The creator can update/delete the app by default (unless made immutable/permanent)
- Minimum balance requirements increase with schema complexity
- Test on LocalNet before deploying to TestNet or MainNet

This example provides the foundation for all Algorand smart contract development, showing the basic steps needed to deploy any application to the blockchain.
