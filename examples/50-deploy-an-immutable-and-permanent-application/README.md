# Deploy an Immutable and Permanent Application

This example demonstrates how to deploy a smart contract application that is both immutable (cannot be updated) and permanent (cannot be deleted), ensuring code trustlessness and verifiability.

## What This Example Shows

This example teaches you how to:
- Deploy applications that cannot be updated after deployment (immutable)
- Deploy applications that cannot be deleted after deployment (permanent)
- Use deploy-time parameters to control application lifecycle
- Verify immutability and permanence properties
- Understand the implications and use cases for immutable/permanent apps
- Work with TMPL_UPDATABLE and TMPL_DELETABLE parameters

## Why This Matters

Immutable and permanent applications provide enhanced security and trust:

1. **Code Trustlessness**: Once deployed, the code cannot be changed by anyone
2. **Verifiability**: Users can trust that the contract will behave as verified
3. **Decentralization**: No central authority can modify or delete the application
4. **Permanent Records**: Data and logic remain on-chain indefinitely
5. **Governance**: Useful for DAO and voting contracts that require immutability
6. **Auditability**: Audited code remains unchanged after audit

Key concepts:
- **Immutable Application**: TMPL_UPDATABLE=0 prevents all future updates
- **Permanent Application**: TMPL_DELETABLE=0 prevents deletion
- **Deploy-Time Parameters**: TMPL_* variables set at creation time
- **Trustless Contracts**: Code that cannot be changed by creators
- **Bare Creation**: Simple creation without ABI methods

Common use cases:
- **Decentralized Governance**: DAO voting mechanisms
- **Token Contracts**: Immutable token distribution logic
- **Escrow Services**: Trustless escrow without admin control
- **Record Keeping**: Permanent on-chain records
- **Public Goods**: Infrastructure that must remain available

## How It Works

### 1. Initialize AlgorandClient and Load App Spec

Set up the client and load the app specification:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const algorand = AlgorandClient.defaultLocalNet()
const testAccount = await algorand.account.fromEnvironment('ACCOUNT')

// Load app spec from file
const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))
```

Setup includes:
- Creating LocalNet client
- Getting funded account
- Loading app specification
- Ready for immutable/permanent deployment

### 2. Create App Factory

Create the factory with the app spec:

```typescript
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: testAccount.addr,
})
```

Factory provides:
- Consistent configuration for app operations
- Methods for creating apps
- Returns app client for interaction
- Manages deployment parameters

### 3. Define Deploy-Time Parameters for Immutability

Set parameters to make the app immutable and permanent:

```typescript
const deployTimeParams = {
  TMPL_UPDATABLE: 0, // Immutable - cannot be updated
  TMPL_DELETABLE: 0, // Permanent - cannot be deleted
  TMPL_VALUE: 42,
}
```

Deploy-time parameters:
- `TMPL_UPDATABLE: 0`: Makes the application **immutable** (cannot be updated)
- `TMPL_DELETABLE: 0`: Makes the application **permanent** (cannot be deleted)
- `TMPL_VALUE`: Example application-specific parameter
- These settings are **permanent** and cannot be changed after creation

### 4. Deploy the Immutable and Permanent Application

Create the application with bare creation:

```typescript
const { appClient } = await factory.send.bare.create({
  deployTimeParams,
})

console.log(`✓ App created with ID: ${appClient.appId}`)
console.log(`  App address: ${appClient.appAddress}`)
```

Creation process:
- Uses bare creation (no ABI method)
- Applies deploy-time parameters
- TMPL_UPDATABLE=0 prevents future updates
- TMPL_DELETABLE=0 prevents deletion
- App is created with permanent settings
- **Cannot be modified or deleted after this point**

### 5. Verify Deployment and Properties

Confirm the app was deployed with immutable/permanent properties:

```typescript
const appInfo = await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()
console.log('✓ App exists on blockchain')
console.log(`  Creator: ${appInfo.params.creator}`)
console.log(`  Updatable: false (IMMUTABLE)`)
console.log(`  Deletable: false (PERMANENT)`)
```

Verification shows:
- App is deployed successfully
- Creator is recorded on-chain
- Updatable is false (immutable)
- Deletable is false (permanent)
- Properties cannot be changed

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
=== Deploy an Immutable and Permanent Application ===

Test account address: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA

Step 1: Deploying immutable and permanent application...
This application will have the following properties:
  • IMMUTABLE: Cannot be updated after deployment
  • PERMANENT: Cannot be deleted after deployment

✓ App created with ID: 1078
  App address: VNZNXYX53T2FUEYC6MBTC3IOE27GN2TLMYZDKLLR5SX3XFXEGVLGCB5ICY

Step 2: Verifying app properties...
✓ App exists on blockchain
  Creator: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA
  Updatable: false (IMMUTABLE)
  Deletable: false (PERMANENT)

⚠️  WARNING: This application is now immutable and permanent!
   • No updates can be made to the smart contract code
   • The application cannot be deleted from the blockchain
   • Ensure the code is thoroughly tested before deploying

💡 Use Cases for Immutable and Permanent Apps:
   • Trustless smart contracts
   • Decentralized governance
   • Permanent record keeping
   • Verifiable, unchangeable logic
```

## Key Takeaways

- Set `TMPL_UPDATABLE: 0` to make applications immutable (cannot be updated)
- Set `TMPL_DELETABLE: 0` to make applications permanent (cannot be deleted)
- Immutable and permanent settings are irreversible after deployment
- Always thoroughly test before deploying immutable applications
- Use immutable/permanent apps for trustless smart contracts
- Immutability provides code verifiability and user trust
- Permanence ensures the application remains available forever
- Deploy-time parameters control the application lifecycle permanently
- Cannot be changed after creation - test extensively first
- Ideal for DAO governance, token contracts, and public infrastructure

This example demonstrates critical concepts for deploying trustless applications that provide users with code verifiability and long-term availability guarantees
