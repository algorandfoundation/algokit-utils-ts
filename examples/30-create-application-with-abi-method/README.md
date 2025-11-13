# Create Application with ABI Method

This example demonstrates how to create an Algorand application using an ABI method for initialization. This approach provides more flexibility than bare application creation by allowing custom initialization logic, parameter passing, and return value handling.

## What This Example Shows

This example teaches you how to:
- Create an application using an ABI method instead of bare creation
- Pass arguments to the create method during deployment
- Receive and verify return values from the ABI create method
- Use the app factory's typed interface for deployment
- Obtain a ready-to-use app client after creation
- Leverage custom initialization logic in your smart contract

## Why This Matters

ABI methods for app creation provide significant advantages:

1. **Custom Initialization**: Execute setup logic when the app is created
2. **Parameter Passing**: Configure your app with deployment-time values
3. **Return Value Handling**: Confirm successful initialization with return values
4. **Type Safety**: ABI provides type-safe method calls
5. **Flexibility**: More control over the deployment process than bare creation

Key concepts:
- **ABI Create Method**: Smart contract method with `CREATE` OnCompletion action
- **create_abi**: Method name in the contract for ABI-based creation
- **Method Arguments**: Parameters passed to the create method during deployment
- **Return Values**: Data returned from the create method for verification
- **App Factory**: Factory pattern for creating applications with ABI methods
- **App Client**: Ready-to-use client for interacting with the deployed app

Common use cases:
- **State Initialization**: Set up initial global/local state during creation
- **Parameter Validation**: Verify deployment parameters are valid
- **Access Control**: Establish permissions during deployment
- **Complex Setup**: Perform multi-step initialization logic
- **Confirmation**: Return values to confirm successful deployment

## How It Works

The example demonstrates seven scenarios for ABI-based app creation:

### 1. Setting Up AlgorandClient and Account

Initialize the client and get a funded account:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()

// Get a funded deployer account
const deployer = await algorand.account.fromEnvironment('DEPLOYER')
console.log(`Deployer account: ${deployer.addr}`)
```

The deployer account:
- Used to create the application
- Pays for the creation transaction
- Becomes the application creator
- Can be stored in environment variables

### 2. Loading Application Specification

Load the app spec containing the ABI methods:

```typescript
import { readFileSync } from 'fs'
import * as path from 'path'

const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))

console.log(`Contract name: ${appSpec.contract.name}`)
console.log(`Methods available: ${appSpec.contract.methods.length}`)
```

The app spec includes:
- Contract ABI with method signatures
- TEAL approval and clear programs
- Method call configurations
- State schema definitions

### 3. Creating App Factory

Create a factory from the app spec:

```typescript
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: deployer.addr,
})
```

The factory:
- Provides typed interface for app creation
- Manages deployment process
- Returns app client after creation
- Handles ABI method calls

### 4. Deploying Application with ABI Create Method

Create the application using an ABI method:

```typescript
const { result, appClient } = await factory.send.create({
  method: 'create_abi',
  args: ['initialization_value'],
  deployTimeParams: {
    TMPL_UPDATABLE: 1,  // Make app updatable
    TMPL_DELETABLE: 1,  // Make app deletable
    TMPL_VALUE: 100,    // Custom value
  },
})

console.log(`App ID: ${appClient.appId}`)
console.log(`App Address: ${appClient.appAddress}`)
console.log(`Transaction ID: ${result.txIds[0]}`)
```

The deployment:
- Calls `create_abi` method defined in the contract
- Passes `'initialization_value'` as an argument
- Substitutes TEAL template variables
- Returns result and ready-to-use app client

**Method vs Bare Creation:**
- `factory.send.create({ method: 'create_abi', args: [...] })` - ABI method creation
- `factory.send.bare.create()` - Bare creation (no ABI method)

### 5. Accessing Return Value from Create Method

Inspect the value returned by the ABI method:

```typescript
if (result.return) {
  console.log(`Type: ${typeof result.return}`)
  console.log(`Value: "${result.return}"`)

  // Verify the return value matches what we sent
  if (result.return === 'initialization_value') {
    console.log('✓ Return value matches input!')
  }
}
```

Return values:
- Confirm successful initialization
- Can contain computed values
- Type-safe based on ABI signature
- Available immediately after deployment

### 6. Inspecting Transaction Details

Review the creation transaction:

```typescript
console.log(`Transaction ID: ${result.txIds[0]}`)
console.log(`Confirmed Round: ${result.confirmations?.[0]?.confirmedRound}`)
console.log(`Sender: ${deployer.addr}`)
```

Transaction details include:
- Transaction ID for tracking
- Confirmed round number
- Sender address (creator)
- Transaction group information

### 7. Using the App Client

The factory returns a ready-to-use app client:

```typescript
console.log(`App ID: ${appClient.appId}`)
console.log(`App Address: ${appClient.appAddress}`)

// Use app client for further interactions
await appClient.send.call({ method: "call_abi", args: ["test"] })
await appClient.send.update({ method: "update_abi", args: ["update"] })
await appClient.send.delete({ method: "delete_abi", args: ["delete"] })
```

The app client:
- Pre-configured with app ID and address
- Ready for method calls immediately
- Provides typed interface for methods
- Handles transaction building automatically

## ABI Create Method in Smart Contract

The `create_abi` method in the smart contract:

```python
@abimethod(create="require")
def create_abi(self, input: String) -> String:
    """
    Called when the app is created via ABI method.
    Performs initialization logic and returns a value.
    """
    # Custom initialization logic here
    # Could set up state, validate inputs, etc.

    return input  # Echo back the input for verification
```

Method characteristics:
- `create="require"` means it can only be called during creation
- Takes parameters for initialization
- Can execute complex setup logic
- Returns values for verification

## Prerequisites

- Node.js and npm installed
- AlgoKit CLI installed
- Docker Desktop running (for LocalNet)
- Funded test account

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
=== Create Application with ABI Method ===

1. Setting Up AlgorandClient and Account
   Connecting to LocalNet...

   Deployer account: <account-address>

2. Loading Application Specification
   Reading app spec with create_abi method...

   App spec loaded successfully
   Contract name: TestingApp
   Methods available: 15

3. Creating App Factory
   Getting app factory from spec...

   Factory created successfully

4. Deploying Application with ABI Create Method
   Calling create_abi method during deployment...

App created by <account-address> with ID 1009 via transaction <txn-id>
   ✓ Application created successfully!
   App ID: 1009
   App Address: <app-address>
   Transaction ID: <txn-id>

5. Accessing Return Value from Create Method
   Inspecting the value returned by create_abi...

   📤 Method Return Value:
   Type: string
   Value: "initialization_value"

   ✓ Return value matches input!
   The create_abi method echoed back our initialization value.

6. Inspecting Transaction Details
   Reviewing the creation transaction...

   📋 Transaction Details:
   Transaction ID: <txn-id>
   Confirmed Round: 9
   Sender: <account-address>

7. Using the App Client
   The factory returns an app client ready to use...

   App Client Properties:
   App ID: 1009
   App Address: <app-address>
   Ready for method calls: ✓

   You can now use appClient.send to call other methods:
   - appClient.send.call({ method: "call_abi", args: [...] })
   - appClient.send.update({ method: "update_abi", args: [...] })
   - appClient.send.delete({ method: "delete_abi", args: [...] })

=== Summary ===
✅ Successfully created application with ABI method!

Key points:
  • Used create_abi method for custom initialization
  • Passed arguments during creation ("initialization_value")
  • Received and verified return value
  • Obtained ready-to-use app client
  • ABI methods provide type-safe, flexible deployment

=== Key Takeaways ===
• ABI create methods allow custom initialization logic
• Pass parameters to setup your app during deployment
• Return values confirm successful initialization
• More flexible than bare app creation
• Factory returns appClient ready for further interactions
```

## Common Patterns

### State Initialization During Creation

```typescript
// Create app with initial state setup
const { result, appClient } = await factory.send.create({
  method: 'create_with_state',
  args: [
    initialOwner,
    maxSupply,
    startTime,
  ],
  deployTimeParams: {
    TMPL_UPDATABLE: 0,  // Immutable
    TMPL_DELETABLE: 0,  // Permanent
  },
})

// Verify initial state was set correctly
const globalState = await appClient.getGlobalState()
console.log(`Owner: ${globalState.owner}`)
console.log(`Max Supply: ${globalState.maxSupply}`)
```

### Conditional Deployment

```typescript
// Deploy with different parameters based on environment
const isProduction = process.env.NODE_ENV === 'production'

const { result, appClient } = await factory.send.create({
  method: 'create_abi',
  args: [isProduction ? 'PRODUCTION' : 'DEVELOPMENT'],
  deployTimeParams: {
    TMPL_UPDATABLE: isProduction ? 0 : 1,  // Immutable in prod
    TMPL_DELETABLE: isProduction ? 0 : 1,  // Permanent in prod
    TMPL_VALUE: isProduction ? 1000 : 100,
  },
})
```

### Validation During Creation

```typescript
try {
  const { result, appClient } = await factory.send.create({
    method: 'create_with_validation',
    args: [
      configValue,
      ownerAddress,
    ],
  })

  // Check return value to confirm validation passed
  if (result.return?.success) {
    console.log('✓ Validation passed during creation')
  }
} catch (error) {
  console.error('Creation failed validation:', error)
}
```

### Multi-Step Initialization

```typescript
// Create app with complex initialization
const { result, appClient } = await factory.send.create({
  method: 'create_and_initialize',
  args: [
    config.param1,
    config.param2,
    config.param3,
  ],
})

// Return value contains initialization results
const initResults = result.return as {
  stateSetup: boolean
  accessControlConfigured: boolean
  defaultsApplied: boolean
}

console.log('Initialization results:', initResults)
```

### Using Return Values for Setup

```typescript
const { result, appClient } = await factory.send.create({
  method: 'create_abi',
  args: ['setup_data'],
})

// Use return value to configure client
const setupInfo = result.return as string

// Perform additional setup based on return value
if (setupInfo.includes('admin_required')) {
  // Set up admin account
  await appClient.send.optIn({ sender: adminAccount.addr })
}
```

## Best Practices

1. **Use ABI Methods for Complex Initialization**
   ```typescript
   // Good: Custom logic during creation
   await factory.send.create({
     method: 'create_with_setup',
     args: [initialConfig],
   })

   // Avoid: Bare creation + manual setup
   const app = await factory.send.bare.create()
   await app.send.call({ method: 'setup', args: [initialConfig] })
   ```

2. **Validate Return Values**
   ```typescript
   const { result } = await factory.send.create({
     method: 'create_abi',
     args: [initValue],
   })

   if (result.return !== expectedValue) {
     throw new Error('Initialization failed')
   }
   ```

3. **Use Descriptive Method Names**
   ```typescript
   // Good: Clear purpose
   method: 'create_with_admin'
   method: 'create_immutable'
   method: 'create_and_configure'

   // Avoid: Generic names
   method: 'create_abi'
   method: 'init'
   ```

4. **Handle Deployment Errors**
   ```typescript
   try {
     const { result, appClient } = await factory.send.create({
       method: 'create_abi',
       args: [config],
     })
   } catch (error) {
     if (error.message.includes('invalid config')) {
       console.error('Configuration validation failed')
     }
     throw error
   }
   ```

5. **Document Return Value Format**
   ```typescript
   /**
    * Creates app and returns initialization status
    * @returns string - Format: "SUCCESS:{appId}:{timestamp}"
    */
   const { result } = await factory.send.create({
     method: 'create_with_status',
     args: [config],
   })

   const [status, appId, timestamp] = result.return.split(':')
   ```

## Key Takeaways

- ABI create methods allow custom initialization logic during deployment
- Pass parameters to configure your app at creation time
- Return values provide confirmation of successful initialization
- More flexible and type-safe than bare application creation
- Factory returns a ready-to-use app client for immediate interaction
- Use `factory.send.create()` with `method` parameter for ABI creation
- Use `factory.send.bare.create()` for simple bare creation without ABI
- TEAL template variables (deployTimeParams) customize the compiled code
- Return values can contain validation results, computed values, or status info
- App client is pre-configured and ready to call other methods
- Ideal for apps requiring complex setup or validation at deployment
- Type safety from ABI prevents runtime errors

This pattern is essential for deploying applications that require initialization logic, parameter validation, or state setup during the creation transaction.
