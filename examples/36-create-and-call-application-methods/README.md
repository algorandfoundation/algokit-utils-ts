# Create and Call Application Methods

This example demonstrates the fundamental workflow of creating an Algorand application and then calling ABI methods on it. This is one of the most common patterns you'll use when working with Algorand smart contracts.

## What This Example Shows

This example teaches you how to:
- Create an app factory from an app spec
- Deploy an application using `factory.send.bare.create()`
- Get an app client for interacting with the deployed app
- Call ABI methods on the app using `appClient.send.call()`
- Work with return values from ABI methods
- Chain create and call operations in a workflow

## Why This Matters

Understanding the create-then-call workflow is essential for Algorand development:

1. **Common Pattern**: Most apps are created then called in separate transactions
2. **State Management**: Call methods to initialize or modify app state after creation
3. **Return Values**: ABI methods can return typed values for processing
4. **App Client**: Provides a typed interface for interacting with your app
5. **Workflow Building**: Foundation for complex multi-step operations

Key concepts:
- **App Factory**: Reusable configuration for creating app instances
- **Bare Create**: Creates app without calling an ABI method (using raw approval/clear programs)
- **App Client**: Instance-specific client for calling methods on a deployed app
- **ABI Methods**: Type-safe method calls with encoded arguments and decoded returns
- **Method Call**: Invokes app logic and potentially modifies state
- **Return Values**: Decoded results from ABI method execution

Common use cases:
- **Two-Step Deployment**: Create app, then initialize state with method call
- **Query State**: Read app state by calling getter methods
- **Execute Logic**: Invoke app logic that modifies global or local state
- **Workflow Chaining**: Combine create and multiple calls in sequence
- **Testing**: Verify app behavior by creating and calling in tests

## How It Works

### 1. Initialize AlgorandClient

Set up the client for LocalNet:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()
```

Client initialization:
- Connects to LocalNet algod and indexer
- Uses default LocalNet configuration
- Provides access to app factory methods
- Handles network communication

### 2. Load App Spec

Load the app specification that defines ABI methods:

```typescript
import * as path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))
```

App spec contains:
- TEAL source code or compiled bytecode
- ABI method definitions
- State schema requirements
- Template variables for deployment

### 3. Create App Factory

Create a factory for deploying and interacting with the app:

```typescript
const testAccount = await algorand.account.fromEnvironment('ACCOUNT')

const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: testAccount.addr,
})
```

Factory provides:
- Consistent configuration across operations
- Methods for creating app instances
- Returns app clients for interaction
- Type-safe method calls (when using typed factories)

### 4. Create the Application

Deploy the application using bare create:

```typescript
const { result, appClient } = await factory.send.bare.create({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,  // App can be updated
    TMPL_DELETABLE: 1,  // App can be deleted
    TMPL_VALUE: 1,      // Initial value parameter
  },
})

console.log('App ID:', appClient.appId.toString())
console.log('App Address:', appClient.appAddress.toString())
console.log('Transaction ID:', result.txIds[0])
```

Bare create:
- Deploys app without calling an ABI method
- Uses raw approval and clear programs from app spec
- Substitutes deploy-time parameters into TEAL
- Returns both result (transaction data) and appClient (for future calls)
- App client is bound to the specific app instance

### 5. Call ABI Method

Invoke an ABI method on the deployed app:

```typescript
const callResult = await appClient.send.call({
  method: 'call_abi',
  args: ['test'], // Method arguments
})

if (callResult.return) {
  console.log('Return value:', callResult.return)
  console.log('Transaction ID:', callResult.txIds[0])
}
```

Method call:
- `method` specifies which ABI method to call (must be defined in app spec)
- `args` provides the arguments (automatically encoded to ABI format)
- Returns transaction result with decoded return value
- Return value type matches the ABI method signature
- Each call is a separate transaction

### 6. Work with Return Values

Access and use return values:

```typescript
if (callResult.return) {
  // Return value is automatically decoded from ABI format
  console.log(`Method returned: "${callResult.return}"`)

  // Use the value in your application logic
  const greeting = callResult.return as string
  console.log(greeting.toUpperCase())
}
```

Return values:
- Automatically decoded based on ABI method signature
- Type is inferred from app spec (when available)
- `undefined` if method has no return value
- Access via `callResult.return`

## ABI Method Example

This example calls a `call_abi` method defined in the app spec:

### TEAL Implementation (Conceptual)

```python
@abi_method
def call_abi(input: abi.String) -> abi.String:
    """Returns a greeting with the input value"""
    return abi.String("Hello, " + input.get())
```

### ABI Signature

```json
{
  "name": "call_abi",
  "args": [
    {
      "name": "input",
      "type": "string"
    }
  ],
  "returns": {
    "type": "string"
  }
}
```

### TypeScript Call

```typescript
const result = await appClient.send.call({
  method: 'call_abi',
  args: ['test'],  // Encoded as ABI string
})

console.log(result.return)  // "Hello, test" (decoded from ABI string)
```

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
Step 1: Create the application
  Deploying with bare create (no ABI method)...
App created by YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA with ID 1042 via transaction 6X3G3UHYG6NHOF7X42S4KNOPLALBNX7Y4PGXHRQZROSIEIZUNA5A
✓ Application created successfully!
  App ID: 1042
  App Address: I2P3EB7Z5SBNJDZ2RXUGAMQKA6KRDFGT53AHGEDEPSYP7JR6P655PCVYYI
  Transaction ID: 6X3G3UHYG6NHOF7X42S4KNOPLALBNX7Y4PGXHRQZROSIEIZUNA5A

Step 2: Call an ABI method on the application
  Calling call_abi method with argument "test"...

✓ Method call successful!
  Method: call_abi
  Input argument: "test"
  Return value: "Hello, test"
  Transaction ID: EUZUMMQA2YC46LMKKZKRHNMFPTJSCULZ2JCTVMGOCKWSHFBMTO3Q

ℹ️  Key Concepts:
  • factory.send.bare.create(): Creates app without calling an ABI method
  • appClient: Client for interacting with your specific app
  • appClient.send.call(): Invokes ABI methods on the deployed app
  • return: Contains the decoded return value from the ABI method

📝 Common Use Cases:
  • Initialize app state after creation
  • Query app state with read-only methods
  • Execute app logic that modifies state
  • Chain multiple method calls in a workflow

✅ Example completed successfully
```

## Common Patterns

### Create and Initialize

```typescript
// Create app
const { result, appClient } = await factory.send.bare.create({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 0,
  },
})

// Initialize state with method call
await appClient.send.call({
  method: 'initialize',
  args: [100, 'My App'],
})
```

### Query State After Creation

```typescript
// Create app
const { appClient } = await factory.send.bare.create({
  deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 42 },
})

// Query current state
const stateResult = await appClient.send.call({
  method: 'get_value',
  args: [],
})

console.log('Current value:', stateResult.return)  // 42
```

### Multiple Method Calls

```typescript
// Create app
const { appClient } = await factory.send.bare.create({
  deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 0 },
})

// Call multiple methods in sequence
await appClient.send.call({
  method: 'set_admin',
  args: [adminAccount.addr],
})

await appClient.send.call({
  method: 'set_fee',
  args: [5],  // 5% fee
})

await appClient.send.call({
  method: 'enable',
  args: [],
})

console.log('App configured and enabled')
```

### Handle Different Return Types

```typescript
// String return
const greetingResult = await appClient.send.call({
  method: 'get_greeting',
  args: ['Alice'],
})
const greeting = greetingResult.return as string
console.log(greeting)

// Number return
const countResult = await appClient.send.call({
  method: 'get_count',
  args: [],
})
const count = countResult.return as bigint
console.log(`Count: ${count}`)

// Boolean return
const statusResult = await appClient.send.call({
  method: 'is_active',
  args: [],
})
const isActive = statusResult.return as boolean
console.log(`Active: ${isActive}`)
```

### Conditional Method Calls

```typescript
// Create app
const { appClient } = await factory.send.bare.create({
  deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 0 },
})

// Check if initialization needed
const statusResult = await appClient.send.call({
  method: 'is_initialized',
  args: [],
})

if (!statusResult.return) {
  console.log('Initializing app...')
  await appClient.send.call({
    method: 'initialize',
    args: [adminAccount.addr, 100],
  })
  console.log('App initialized')
} else {
  console.log('App already initialized')
}
```

### Error Handling

```typescript
const { appClient } = await factory.send.bare.create({
  deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 0 },
})

try {
  const result = await appClient.send.call({
    method: 'risky_operation',
    args: [someValue],
  })
  console.log('Operation succeeded:', result.return)
} catch (error) {
  console.error('Method call failed:', error)
  // Handle error appropriately
}
```

## Best Practices

1. **Always Check Return Values**
   ```typescript
   // Good: Check if return value exists
   const result = await appClient.send.call({
     method: 'get_value',
     args: [],
   })

   if (result.return !== undefined) {
     console.log('Value:', result.return)
   }

   // Avoid: Assuming return value exists
   console.log(result.return.toString())  // May error if undefined
   ```

2. **Use Appropriate Method Names**
   ```typescript
   // Good: Descriptive method names
   await appClient.send.call({ method: 'initialize_state', args: [...] })
   await appClient.send.call({ method: 'update_admin', args: [...] })
   await appClient.send.call({ method: 'get_balance', args: [...] })

   // Avoid: Generic or unclear names
   await appClient.send.call({ method: 'do_thing', args: [...] })
   await appClient.send.call({ method: 'method1', args: [...] })
   ```

3. **Separate Creation from Initialization**
   ```typescript
   // Good: Clear two-step process
   const { appClient } = await factory.send.bare.create({
     deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 0 },
   })
   console.log('App created')

   await appClient.send.call({
     method: 'initialize',
     args: [initialValue],
   })
   console.log('App initialized')

   // Alternative: Use ABI create method (see example 30)
   const { appClient } = await factory.send.create({
     method: 'create_with_init',
     args: [initialValue],
   })
   ```

4. **Store App Client for Reuse**
   ```typescript
   // Good: Store app client for multiple operations
   const { appClient } = await factory.send.bare.create({
     deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 0 },
   })

   // Use app client multiple times
   await appClient.send.call({ method: 'step1', args: [] })
   await appClient.send.call({ method: 'step2', args: [] })
   await appClient.send.call({ method: 'step3', args: [] })

   // Avoid: Recreating factory for each call
   ```

5. **Handle Different Argument Types**
   ```typescript
   // String argument
   await appClient.send.call({
     method: 'set_name',
     args: ['MyApp'],
   })

   // Number argument (use BigInt for uint64)
   await appClient.send.call({
     method: 'set_value',
     args: [42n],
   })

   // Address argument
   await appClient.send.call({
     method: 'set_admin',
     args: [account.addr],  // Address string
   })

   // Multiple arguments
   await appClient.send.call({
     method: 'configure',
     args: ['MyApp', 100n, account.addr, true],
   })
   ```

6. **Log Transaction IDs for Debugging**
   ```typescript
   // Good: Log transaction IDs for traceability
   const createResult = await factory.send.bare.create({
     deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 0 },
   })
   console.log('Create txn:', createResult.result.txIds[0])

   const callResult = await createResult.appClient.send.call({
     method: 'initialize',
     args: [100],
   })
   console.log('Initialize txn:', callResult.txIds[0])

   // Makes debugging and verification easier
   ```

## Key Takeaways

- Create-then-call is the most common workflow for Algorand apps
- Use `factory.send.bare.create()` to deploy apps without calling ABI methods
- App client provides methods for interacting with the specific app instance
- Call ABI methods using `appClient.send.call({ method, args })`
- Return values are automatically decoded from ABI format
- Check for `undefined` return values before using them
- Each method call is a separate transaction with its own ID
- App ID and app address are available immediately after creation
- Deploy-time parameters are substituted during app creation
- Store app client for multiple subsequent operations
- ABI method signatures are defined in the app spec
- Arguments are automatically encoded to ABI format
- Use appropriate types for arguments (BigInt for uint64, strings for addresses)

This example provides the foundation for the most common Algorand smart contract interaction pattern: creating an app and then calling methods on it.
