# Deploy New Algorand Application

This example demonstrates the complete workflow for deploying a new Algorand smart contract application using AlgoKit Utils v9.1.2.

## Key Concepts

- **AlgorandClient**: Main entry point for interacting with Algorand
- **Typed App Factory**: Type-safe contract deployment and interaction
- **Deploy-Time Parameters**: Template variables set at deployment time
- **App Metadata**: Retrieving application information from the blockchain
- **Method Calls**: Interacting with deployed applications

## What This Example Shows

1. Connecting to LocalNet
2. Creating and funding a deployer account
3. Getting a typed app factory
4. Deploying an application with deploy-time parameters
5. Retrieving app information from the blockchain
6. Calling methods on the deployed application

## Code Walkthrough

### Initialize Algorand Client

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

const algorand = AlgorandClient.defaultLocalNet()
```

Use `AlgorandClient.defaultLocalNet()` to connect to a LocalNet instance. For other networks:

- `AlgorandClient.testNet()` - Connect to TestNet
- `AlgorandClient.mainNet()` - Connect to MainNet
- `AlgorandClient.fromEnvironment()` - Use environment variables

### Create and Fund Deployer Account

```typescript
const dispenser = await algorand.account.localNetDispenser()
const deployer = algorand.account.random()

await algorand.account.ensureFunded(
  deployer,
  dispenser,
  (10).algos()
)

console.log('Deployer account:', deployer.addr.toString())
```

**Key points**:
- `account.random()` creates a new random account
- `localNetDispenser()` gets the LocalNet dispenser (faucet)
- `ensureFunded()` ensures the account has sufficient funds
- `.toString()` converts Address objects to base32 strings

### Get Typed App Factory

```typescript
const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: deployer.addr,
})
```

**What is a Typed App Factory?**
- Provides type-safe access to contract methods
- Generated from your contract's ABI
- Handles TEAL compilation and transaction construction
- Validates method arguments at compile time

### Deploy the Application

```typescript
const { appClient, result } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,  // Make the app updatable
    TMPL_DELETABLE: 1,  // Make the app deletable
    TMPL_VALUE: 42,     // Set a custom template value
  },
})

console.log('App ID:', appClient.appId)
console.log('App Address:', appClient.appAddress.toString())
console.log('Transaction ID:', result.txIds[0])
```

**Deploy-Time Parameters**:
- `TMPL_UPDATABLE`: Whether the app can be updated (0 or 1)
- `TMPL_DELETABLE`: Whether the app can be deleted (0 or 1)
- `TMPL_VALUE`: Custom template variable (depends on your contract)

**What You Get Back**:
- `appClient`: Typed client for interacting with your app
- `result`: Transaction result including transaction IDs
- `appClient.appId`: The application ID (used to reference the app)
- `appClient.appAddress`: The application's account address

### Retrieve App Information

```typescript
const appInfo = await algorand.client.algod
  .getApplicationByID(Number(appClient.appId))
  .do()

console.log('Creator:', appInfo.params.creator.toString())
console.log('Approval Program Size:', appInfo.params.approvalProgram.length, 'bytes')
console.log('Clear Program Size:', appInfo.params.clearStateProgram.length, 'bytes')
console.log('Global State Schema:')
console.log('  Uints:', appInfo.params.globalStateSchema?.numUint || 0)
console.log('  Bytes:', appInfo.params.globalStateSchema?.numByteSlice || 0)
console.log('Local State Schema:')
console.log('  Uints:', appInfo.params.localStateSchema?.numUint || 0)
console.log('  Bytes:', appInfo.params.localStateSchema?.numByteSlice || 0)
```

**Application Information Available**:
- `creator`: The account that created the app
- `approvalProgram`: The compiled approval program bytecode
- `clearStateProgram`: The compiled clear state program bytecode
- `globalStateSchema`: Storage allocation for global state
- `localStateSchema`: Storage allocation for per-user state

**Important**: Always use `.toString()` when printing Address objects to get readable base32 strings.

### Call Methods on the Deployed App

```typescript
const callResult = await appClient.send.callAbi({
  args: {
    value: 'Hello from deployed app',
  },
})

console.log('Transaction ID:', callResult.txIds[0])
console.log('Returned value:', callResult.return)
// Output: Hello, Hello from deployed app
```

**Method Calling Patterns**:
- Use `appClient.send.methodName()` to call methods
- Pass arguments in the `args` object
- Access return values via `result.return`
- Transaction IDs available in `result.txIds`

## API Patterns (AlgoKit Utils v9.1.2)

### Creating an App Client from Scratch

```typescript
// 1. Get a typed app factory
const appFactory = algorand.client.getTypedAppFactory(YourAppFactory, {
  defaultSender: yourAccount.addr,
})

// 2. Deploy the app
const { appClient, result } = await appFactory.send.create.bare({
  deployTimeParams: {
    // Your template parameters here
  },
})

// 3. Use the appClient to interact with the app
const methodResult = await appClient.send.yourMethod({
  args: { /* your arguments */ },
})
```

### Connecting to an Existing App

```typescript
// If you already know the app ID
const appClient = algorand.client.getTypedAppFactory(YourAppFactory, {
  defaultSender: yourAccount.addr,
  appId: 1234n, // The existing app ID
})

// Now you can call methods
const result = await appClient.send.yourMethod({
  args: { /* your arguments */ },
})
```

### Different Creation Methods

```typescript
// 1. Bare creation (no ABI method)
await appFactory.send.create.bare({
  deployTimeParams: { /* params */ },
})

// 2. Create with ABI method
await appFactory.send.create.createAbi({
  args: { /* constructor arguments */ },
  deployTimeParams: { /* params */ },
})
```

## Deploy-Time Parameters Explained

### What Are Deploy-Time Parameters?

Deploy-time parameters are template variables in your TEAL code that are replaced with actual values during deployment. They allow you to customize your contract without changing the source code.

### Common Deploy-Time Parameters

```typescript
deployTimeParams: {
  // Standard parameters
  TMPL_UPDATABLE: 1,  // 1 = updatable, 0 = permanent
  TMPL_DELETABLE: 1,  // 1 = deletable, 0 = permanent

  // Custom parameters (depends on your contract)
  TMPL_VALUE: 42,          // Numeric value
  TMPL_OWNER: 'ABC...',    // Address as string
  TMPL_FEE_RATE: 100,      // Basis points (e.g., 1%)
  TMPL_MIN_BALANCE: 1000,  // Minimum balance in microAlgos
}
```

### In Your TEAL Code

```teal
// approval.teal
#pragma version 10

// Template variables are replaced at deployment time
int TMPL_VALUE
int 42
==
assert

// TMPL_UPDATABLE and TMPL_DELETABLE control lifecycle
```

### Updatable vs. Deletable

```typescript
// Production app (permanent)
deployTimeParams: {
  TMPL_UPDATABLE: 0,  // Cannot be updated
  TMPL_DELETABLE: 0,  // Cannot be deleted
}

// Development app (flexible)
deployTimeParams: {
  TMPL_UPDATABLE: 1,  // Can be updated
  TMPL_DELETABLE: 1,  // Can be deleted
}

// Upgradeable production app
deployTimeParams: {
  TMPL_UPDATABLE: 1,  // Can be updated for bug fixes
  TMPL_DELETABLE: 0,  // Cannot be deleted (permanent)
}
```

## Complete Deployment Example

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

async function deployNewApp() {
  // 1. Connect to network
  const algorand = AlgorandClient.defaultLocalNet()

  // 2. Setup accounts
  const dispenser = await algorand.account.localNetDispenser()
  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (10).algos())

  console.log('Deployer:', deployer.addr.toString())

  // 3. Get typed app factory
  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: deployer.addr,
  })

  // 4. Deploy the app
  console.log('Deploying application...')
  const { appClient, result } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 42,
    },
  })

  console.log('✅ Deployed!')
  console.log('  App ID:', appClient.appId)
  console.log('  App Address:', appClient.appAddress.toString())
  console.log('  Transaction:', result.txIds[0])

  // 5. Verify deployment
  const appInfo = await algorand.client.algod
    .getApplicationByID(Number(appClient.appId))
    .do()

  console.log('Creator:', appInfo.params.creator.toString())
  console.log('Approval Size:', appInfo.params.approvalProgram.length, 'bytes')

  // 6. Test the app
  console.log('Testing app...')
  const callResult = await appClient.send.callAbi({
    args: { value: 'Hello!' },
  })

  console.log('✅ Method called!')
  console.log('  Result:', callResult.return)

  return appClient
}

// Run it
deployNewApp().catch(console.error)
```

## Understanding App IDs and Addresses

### App ID

```typescript
const appId = appClient.appId  // bigint (e.g., 1234n)
```

- **What it is**: Unique identifier for your application
- **When created**: Assigned when the app is deployed
- **Never changes**: Same app ID for the lifetime of the app
- **Used for**: Referencing the app in transactions and queries

### App Address

```typescript
const appAddress = appClient.appAddress  // Address object
const appAddressString = appClient.appAddress.toString()
```

- **What it is**: The application's account address
- **Derived from**: The app ID (deterministic conversion)
- **Used for**: Sending Algos or assets to the app
- **Important**: Convert to string with `.toString()` for printing

### Usage Examples

```typescript
// Query app by ID
const appInfo = await algorand.client.algod
  .getApplicationByID(Number(appClient.appId))
  .do()

// Fund the app's account
await algorand.send.payment({
  sender: funder.addr,
  receiver: appClient.appAddress,
  amount: (1).algos(),
})

// Store app reference
const appReference = {
  id: appClient.appId,
  address: appClient.appAddress.toString(),
}
```

## Common Deployment Patterns

### Pattern 1: Development Deployment

```typescript
// Quick iteration during development
const { appClient } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,  // Can update for bug fixes
    TMPL_DELETABLE: 1,  // Can delete and redeploy
    TMPL_VALUE: testValue,
  },
})
```

### Pattern 2: Production Deployment

```typescript
// Secure production deployment
const { appClient } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 0,  // Immutable (cannot be changed)
    TMPL_DELETABLE: 0,  // Permanent (cannot be deleted)
    TMPL_VALUE: productionValue,
  },
})

// Log for records
console.log('PRODUCTION APP ID:', appClient.appId)
console.log('PRODUCTION APP ADDRESS:', appClient.appAddress.toString())
```

### Pattern 3: Upgradeable Production Deployment

```typescript
// Upgradeable but not deletable
const { appClient } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,  // Can update for critical fixes
    TMPL_DELETABLE: 0,  // Cannot delete (permanent)
    TMPL_VALUE: productionValue,
  },
})

// Later, you can update the app
await appClient.send.update.bare({
  approvalProgram: newApprovalProgram,
  clearProgram: newClearProgram,
})
```

### Pattern 4: Environment-Based Deployment

```typescript
const isDevelopment = process.env.NODE_ENV === 'development'

const { appClient } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: isDevelopment ? 1 : 0,
    TMPL_DELETABLE: isDevelopment ? 1 : 0,
    TMPL_VALUE: isDevelopment ? 100 : 42,
  },
})
```

## Method Calling Patterns

### Calling Methods with Arguments

```typescript
// Method with single argument
const result = await appClient.send.setValue({
  args: { value: 42 },
})

// Method with multiple arguments
const result = await appClient.send.doMath({
  args: {
    a: 10,
    b: 20,
    operation: 'add',
  },
})

// Method with no arguments
const result = await appClient.send.getValue({
  args: {},
})
```

### Accessing Return Values

```typescript
// Method that returns a value
const result = await appClient.send.callAbi({
  args: { value: 'Hello' },
})

console.log('Returned:', result.return)
// Output: Hello, Hello

// Method that returns multiple values
const result = await appClient.send.getStats({
  args: {},
})

console.log('Count:', result.return[0])
console.log('Sum:', result.return[1])
```

### Transaction Details

```typescript
const result = await appClient.send.callAbi({
  args: { value: 'Hello' },
})

// Transaction IDs
console.log('Transaction ID:', result.txIds[0])

// For atomic transactions (multiple txns)
console.log('All Transaction IDs:', result.txIds)

// Confirmation info
console.log('Confirmed Round:', result.confirmations?.[0]?.confirmedRound)
```

### Custom Transaction Parameters

```typescript
// Specify custom sender
const result = await appClient.send.callAbi({
  sender: otherAccount.addr,
  args: { value: 'Hello' },
})

// Specify custom fee
const result = await appClient.send.callAbi({
  args: { value: 'Hello' },
  staticFee: (2000).microAlgos(),
})

// Add note
const result = await appClient.send.callAbi({
  args: { value: 'Hello' },
  note: new TextEncoder().encode('My note'),
})
```

## Error Handling

### Deployment Errors

```typescript
try {
  const { appClient } = await appFactory.send.create.bare({
    deployTimeParams: { /* params */ },
  })
  console.log('✅ Deployed:', appClient.appId)
} catch (error: any) {
  if (error.message.includes('overspend')) {
    console.error('❌ Insufficient funds for deployment')
  } else if (error.message.includes('logic eval error')) {
    console.error('❌ TEAL logic error during deployment')
    console.error('Stack trace:', error.stack)
  } else {
    console.error('❌ Deployment failed:', error.message)
  }
}
```

### Method Call Errors

```typescript
try {
  const result = await appClient.send.callAbi({
    args: { value: 'Hello' },
  })
  console.log('✅ Success:', result.return)
} catch (error: any) {
  if (error.message.includes('assert failed')) {
    console.error('❌ Contract assertion failed')
    // AlgoKit Utils provides enhanced error messages
    // with TEAL stack traces and line numbers
    console.error('Details:', error.message)
  } else if (error.message.includes('budget exceeded')) {
    console.error('❌ Opcode budget exceeded')
  } else {
    console.error('❌ Method call failed:', error.message)
  }
}
```

## Best Practices

### 1. Always Use Type-Safe Clients

```typescript
// ✅ Good: Type-safe with generated client
import { TestingAppFactory } from './artifacts/TestingApp/client'
const appClient = algorand.client.getTypedAppFactory(TestingAppFactory)

// ❌ Bad: Untyped, error-prone
const appClient = algorand.client.getAppClient({ appId: 1234n })
```

### 2. Convert Addresses to Strings for Display

```typescript
// ✅ Good: Readable base32 string
console.log('Creator:', appInfo.params.creator.toString())
console.log('App Address:', appClient.appAddress.toString())

// ❌ Bad: Prints object representation
console.log('Creator:', appInfo.params.creator)
// Output: Address { publicKey: Uint8Array(...) }
```

### 3. Store App IDs for Reuse

```typescript
// ✅ Good: Save app ID for later use
const { appClient } = await appFactory.send.create.bare({ /* params */ })

// Save to config file
await fs.writeFile('app-config.json', JSON.stringify({
  appId: appClient.appId.toString(),
  appAddress: appClient.appAddress.toString(),
}))

// Later, reconnect to the app
const config = JSON.parse(await fs.readFile('app-config.json', 'utf-8'))
const existingClient = algorand.client.getTypedAppFactory(TestingAppFactory, {
  appId: BigInt(config.appId),
})
```

### 4. Set Appropriate Lifecycle Flags

```typescript
// Development
deployTimeParams: {
  TMPL_UPDATABLE: 1,
  TMPL_DELETABLE: 1,
}

// Production
deployTimeParams: {
  TMPL_UPDATABLE: 0,  // Or 1 if you need upgrade capability
  TMPL_DELETABLE: 0,  // Almost always 0 in production
}
```

### 5. Verify Deployment Success

```typescript
const { appClient, result } = await appFactory.send.create.bare({ /* params */ })

// Verify the app was created
const appInfo = await algorand.client.algod
  .getApplicationByID(Number(appClient.appId))
  .do()

console.log('✅ App created by:', appInfo.params.creator.toString())
console.log('✅ Transaction:', result.txIds[0])
```

### 6. Handle Errors Gracefully

```typescript
try {
  const { appClient } = await appFactory.send.create.bare({ /* params */ })
  console.log('✅ Deployed:', appClient.appId)
} catch (error: any) {
  console.error('❌ Deployment failed:', error.message)
  // Log full error for debugging
  console.error('Full error:', error)
  throw error
}
```

## Expected Output

```
Deployer account: 5LMITHP6XXKXLXU3RGQFMU2DV7E6AJJR75QBHSULQWQ5KEY4WT3U6OTASQ

=== Deploying New Application ===

Deploying TestingApp with deploy-time parameters...

App created by 5LMITHP6XXKXLXU3RGQFMU2DV7E6AJJR75QBHSULQWQ5KEY4WT3U6OTASQ with ID 1659 via transaction 263PNFT4OCOI3EEURDGMGEHBPRQUWFYITIGQ3NGT26UO7YJNUDWQ
✅ Application deployed successfully!

=== Deployment Details ===

App ID: 1659n
App Address: YV7NUOP6YXGOM7OW332WKTN3B5DJ5LWF4I2C3BDQOXSHZ6D6HKFA6NQUWA
Transaction ID: 263PNFT4OCOI3EEURDGMGEHBPRQUWFYITIGQ3NGT26UO7YJNUDWQ

Deploy-Time Parameters:
  TMPL_UPDATABLE: 1 (app can be updated)
  TMPL_DELETABLE: 1 (app can be deleted)
  TMPL_VALUE: 42

=== Retrieving App Information ===

On-Chain App Information:
  Creator: 5LMITHP6XXKXLXU3RGQFMU2DV7E6AJJR75QBHSULQWQ5KEY4WT3U6OTASQ
  Approval Program Size: 1498 bytes
  Clear Program Size: 4 bytes
  Global State Schema:
    Uints: 3
    Bytes: 2
  Local State Schema:
    Uints: 2
    Bytes: 2

=== Understanding the Deployment ===

What just happened:
  1. Created a deployer account and funded it
  2. Got a typed app factory for TestingApp
  3. Called create.bare() with deploy-time parameters
  4. AlgoKit Utils compiled the TEAL code
  5. Sent an application creation transaction
  6. Received an app ID and app address

The app is now deployed and ready to use!
You can call its methods using the appClient.

=== Testing the Deployed App ===

Calling the "callAbi" method with value="Hello from deployed app"...
✅ Method call successful!
Transaction ID: Y37U5CCIQFXN6DVAOV4VSIH4S5IZVVA4ATDJ5PRU6FMBRJPXX7SQ
Returned value: Hello, Hello from deployed app

=== Example Completed Successfully ===

Key Takeaways:
  • Use AlgorandClient.defaultLocalNet() to connect to LocalNet
  • Create and fund accounts using account.random() and ensureFunded()
  • Use getTypedAppFactory() to get a typed app factory
  • Deploy with send.create.bare() and deploy-time parameters
  • The result includes appClient for interacting with the app
  • Call methods on the deployed app using appClient.send
```

## Running the Example

### Prerequisites

1. Start AlgoKit LocalNet:
   ```bash
   algokit localnet start
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Execute

```bash
npm start
```

The example will:
1. Create and fund a deployer account
2. Deploy TestingApp with deploy-time parameters
3. Display deployment details (app ID, address, transaction ID)
4. Retrieve and display on-chain app information
5. Call a method on the deployed app to verify it works

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand Application Development](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/)
- [TEAL Template Variables](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#template-variables)
- [Application Lifecycle](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#lifecycle)
