# Create and Call an Application

This example demonstrates the basic, streamlined workflow of creating an Algorand application and then calling an ABI method on it. This is the foundational pattern for interacting with smart contracts on Algorand.

## What This Example Shows

This example teaches you how to:
- Set up AlgorandClient for LocalNet
- Load an app spec from a JSON file
- Create an app factory
- Deploy an application with deploy-time parameters
- Call an ABI method on the deployed app
- Access and display return values

## Why This Matters

This example provides the essential foundation for Algorand smart contract development:

1. **Fundamental Pattern**: Create-then-call is the most common workflow
2. **Quick Start**: Minimal setup to get started with smart contracts
3. **Return Value Handling**: Learn how to work with ABI return values
4. **Clear Steps**: Straightforward progression from creation to interaction
5. **Practical Foundation**: Building block for more complex applications

Key concepts:
- **App Factory**: Creates app instances with consistent configuration
- **Bare Create**: Deploys app without calling an ABI method during creation
- **ABI Methods**: Type-safe method calls with automatic encoding/decoding
- **Return Values**: Decoded results from method execution
- **Deploy-Time Parameters**: Template variables substituted during deployment

Common use cases:
- **Getting Started**: First steps with Algorand smart contracts
- **Basic Testing**: Quick way to test app creation and method calls
- **Learning**: Understanding the fundamental workflow
- **Prototyping**: Rapid testing of smart contract logic
- **Integration**: Starting point for app integration

## How It Works

### 1. Initialize and Setup

Initialize the client and load the app spec:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const algorand = AlgorandClient.defaultLocalNet()
const account = await algorand.account.fromEnvironment('ACCOUNT')

// Load app spec
const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))
```

Setup includes:
- Creating LocalNet client
- Getting a funded account
- Loading app specification
- Ready for deployment

### 2. Create App Factory

Create a factory with the app spec:

```typescript
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: account.addr,
})
```

Factory provides:
- Consistent configuration
- Methods for creating apps
- Returns app clients for interaction
- Manages deployment parameters

### 3. Deploy the Application

Create the application with deploy-time parameters:

```typescript
const { result, appClient } = await factory.send.bare.create({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,  // App can be updated
    TMPL_DELETABLE: 1,  // App can be deleted
    TMPL_VALUE: 1,      // Custom parameter for your app logic
  },
})

console.log('App ID:', appClient.appId.toString())
console.log('App Address:', appClient.appAddress.toString())
console.log('Transaction ID:', result.txIds[0])
```

Deployment:
- Uses bare create (no ABI method called during creation)
- Substitutes deploy-time parameters into TEAL
- Returns transaction result and app client
- App client is bound to the specific app instance

### 4. Call ABI Method

Invoke a method on the deployed app:

```typescript
const callResult = await appClient.send.call({
  method: 'call_abi',
  args: ['test'],
})

console.log('Transaction ID:', callResult.txIds[0])
```

Method call:
- Specifies method name from app spec
- Provides arguments (automatically encoded)
- Returns result with decoded return value
- Each call is a separate transaction

### 5. Access Return Value

Display the decoded return value:

```typescript
if (callResult.return) {
  console.log('Decoded value:', callResult.return)
  console.log('✓ Successfully decoded')
} else {
  console.log('⚠️  Method returned no value')
}
```

Return values:
- Automatically decoded from ABI format
- Type matches method signature
- Check for undefined before using
- Access via `callResult.return`

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
Account address: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA

--- Step 1: Create the application ---
App created by YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA with ID 1045 via transaction V44GQLNLSRA726LX223LZN6JBNGVMUQKY3QRJV5YWJRNYTMJJZQA
Application created successfully!
  App ID: 1045
  App Address: XGQU4CTZMHF4CKQIUYMH6SM6PFXBOQY4MMTCNMCDIAO2U6TSEXNYFVJPKI
  Transaction ID: V44GQLNLSRA726LX223LZN6JBNGVMUQKY3QRJV5YWJRNYTMJJZQA

--- Step 2: Call an ABI method on the app ---
Method call successful!
  Transaction ID: 7JUWEUMP6ISCRV26NEXPHATZ4H732KLB626243Q72HIIPIZCQEGA

Return value from ABI method:
  Decoded value: Hello, test
  ✓ Successfully decoded

--- Summary ---
This example showed the basic pattern:
  1. Create an app factory with app spec
  2. Call factory.send.bare.create() with deploy-time parameters
  3. Call appClient.send.call() with method name and arguments
  4. Access return values from the method call

✅ Example completed successfully
```

## Common Patterns

### Simple Create and Call

```typescript
// Minimal setup
const algorand = AlgorandClient.defaultLocalNet()
const account = await algorand.account.fromEnvironment('ACCOUNT')

// Load and create
const appSpec = JSON.parse(readFileSync('artifacts/application.json', 'utf-8'))
const factory = algorand.client.getAppFactory({ appSpec, defaultSender: account.addr })

// Deploy
const { appClient } = await factory.send.bare.create({
  deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 1 },
})

// Call
const result = await appClient.send.call({
  method: 'call_abi',
  args: ['test'],
})

console.log('Result:', result.return)
```

### Check Return Value Type

```typescript
const result = await appClient.send.call({
  method: 'get_greeting',
  args: ['Alice'],
})

// Type-safe handling
if (result.return !== undefined) {
  const greeting = result.return as string
  console.log(greeting.toUpperCase())
}
```

### Multiple Sequential Calls

```typescript
// Create once
const { appClient } = await factory.send.bare.create({
  deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 0 },
})

// Call multiple times
const result1 = await appClient.send.call({ method: 'initialize', args: [] })
const result2 = await appClient.send.call({ method: 'set_value', args: [42] })
const result3 = await appClient.send.call({ method: 'get_value', args: [] })

console.log('Final value:', result3.return)
```

### Error Handling

```typescript
try {
  const { appClient } = await factory.send.bare.create({
    deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 1 },
  })

  const result = await appClient.send.call({
    method: 'call_abi',
    args: ['test'],
  })

  console.log('Success:', result.return)
} catch (error) {
  console.error('Failed:', error.message)
}
```

## Best Practices

1. **Always Check Return Values**
   ```typescript
   // Good
   if (result.return !== undefined) {
     console.log('Value:', result.return)
   }

   // Avoid
   console.log(result.return.toString())  // May error if undefined
   ```

2. **Use Descriptive Console Output**
   ```typescript
   // Good
   console.log('--- Step 1: Create the application ---')
   console.log('Application created successfully!')
   console.log('  App ID:', appClient.appId.toString())

   // Clear, organized output helps debugging
   ```

3. **Store App Client for Reuse**
   ```typescript
   // Good
   const { appClient } = await factory.send.bare.create({ ... })
   await appClient.send.call({ method: 'method1', args: [] })
   await appClient.send.call({ method: 'method2', args: [] })

   // Avoid
   // Creating new factory/client for each call
   ```

4. **Handle Errors Gracefully**
   ```typescript
   // Good
   createAndCallApp()
     .then(() => {
       console.log('✅ Example completed successfully')
       process.exit(0)
     })
     .catch((error) => {
       console.error('❌ Error:', error.message)
       process.exit(1)
     })
   ```

5. **Use Deploy-Time Parameters Correctly**
   ```typescript
   // Good: TMPL_ prefix for template variables
   deployTimeParams: {
     TMPL_UPDATABLE: 1,
     TMPL_DELETABLE: 1,
     TMPL_VALUE: 42,
   }

   // Names must match TEAL template variables
   ```

## Comparison with Example 36

Both examples demonstrate create-then-call, with slight differences:

**Example 36 (Detailed):**
- More comprehensive documentation
- Detailed explanations of each step
- More patterns and use cases
- Focus on education

**Example 37 (Streamlined):**
- Simpler, more concise code
- Clearer step-by-step output
- Focus on the essential workflow
- Better for quick reference

Use Example 36 for learning, Example 37 for quick implementation.

## Key Takeaways

- Create-then-call is the fundamental Algorand smart contract pattern
- Use `factory.send.bare.create()` to deploy applications
- Use `appClient.send.call()` to invoke ABI methods
- Return values are automatically decoded from ABI format
- Always check if return value is undefined before using
- Deploy-time parameters use TMPL_ prefix
- App client is bound to the specific app instance
- Each method call is a separate transaction
- Store app client for multiple method calls
- Clear console output helps with debugging and understanding

This example provides a clean, straightforward foundation for creating and calling Algorand smart contracts.
