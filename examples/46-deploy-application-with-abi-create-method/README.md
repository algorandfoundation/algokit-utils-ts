# Deploy Application with ABI Create Method

This example demonstrates how to deploy a smart contract application using an ABI create method that can execute initialization logic and return values during deployment.

## What This Example Shows

This example teaches you how to:
- Deploy applications using ABI create methods instead of bare creation
- Pass arguments to create methods for initialization logic
- Get return values from create operations
- Work with deploy-time parameters during ABI creation
- Verify successful deployment with return value confirmation
- Use factory pattern for creating apps with ABI methods

## Why This Matters

ABI create methods provide enhanced initialization capabilities during deployment:

1. **Initialization Logic**: Execute custom setup code during app creation
2. **Return Values**: Get confirmation or status information from creation
3. **Argument Passing**: Pass parameters to control how app is initialized
4. **Type Safety**: ABI methods provide typed arguments and return values
5. **Validation**: Perform checks and validations during creation
6. **Auditability**: Return values can be logged for tracking deployments

Key concepts:
- **ABI Create Method**: Method with `no_op: 'CREATE'` call config
- **Deploy-Time Parameters**: Template variables (TMPL_*) set at deployment
- **Return Values**: ABI methods can return data during creation
- **Factory Pattern**: Consistent configuration for app operations
- **Method Arguments**: Pass initialization data to create method

Common use cases:
- **Initial Configuration**: Set up state variables during creation
- **Access Control**: Verify deployment parameters and permissions
- **Logging**: Return confirmation messages for audit trails
- **Validation**: Check prerequisites before completing creation
- **Multi-Step Setup**: Execute multiple initialization operations

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
- Loading app specification with create method
- Ready for deployment

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
- Methods for creating and calling apps
- Returns app client for interaction
- Manages ABI method encoding/decoding

### 3. Deploy Application with ABI Create Method

Deploy with an ABI method and deploy-time parameters:

```typescript
const deployTimeParams = {
  TMPL_UPDATABLE: 1,
  TMPL_DELETABLE: 1,
  TMPL_VALUE: 42,
}

const { appClient, result } = await factory.send.create({
  method: 'create_abi',
  args: ['initialization_complete'],
  deployTimeParams,
})

console.log(`✓ App created with ID: ${appClient.appId}`)
console.log(`  App address: ${appClient.appAddress}`)
console.log(`  Transaction ID: ${result.txIds[0]}`)
```

Creation process:
- Uses ABI method `create_abi`
- Passes argument `'initialization_complete'` for setup
- Applies deploy-time parameters
- Method executes initialization logic
- Returns confirmation message
- App is created after method completes

Deploy-time parameters:
- `TMPL_UPDATABLE`: Controls whether app can be updated (0=no, 1=yes)
- `TMPL_DELETABLE`: Controls whether app can be deleted (0=no, 1=yes)
- `TMPL_VALUE`: Example parameter (contract-specific)
- Must use `TMPL_` prefix
- Set at creation, cannot be changed

### 4. Check Return Value

Access the return value from the create method:

```typescript
console.log(`✓ Create method returned: "${result.return}"`)
```

Return value:
- `result.return`: The decoded return value from ABI method
- Matches method signature (string in this case)
- Useful for confirming successful initialization
- Can contain setup status or configuration info

### 5. Verify Deployment

Confirm the app was successfully deployed:

```typescript
const appInfo = await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()
console.log('✓ App exists on blockchain')
console.log(`  Creator: ${appInfo.params.creator}`)
```

Verification confirms:
- App is deployed successfully
- App ID is valid
- Creator matches expected account
- App is ready for operations

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
=== Deploy Application with ABI Create Method ===

Test account address: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA

Step 1: Deploying application with ABI create method...
✓ App created with ID: 1070
  App address: XETMOAHJSRNPS6E6432UJQ3IQNLORX3NI3GAKJVZS33WS4B4FV7QAF4JKA
  Transaction ID: JEICGDYUWUVOQ4EO3QOFPJNQ3ODJEDJQVEXQ4GPTK4UBEEYQF3SQ

Step 2: Checking return value from create method...
✓ Create method returned: "initialization_complete"

Step 3: Verifying app was deployed...
✓ App exists on blockchain
  Creator: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA

✅ Example completed successfully
```

## Common Patterns

### Create with Initialization Arguments

```typescript
// Method that accepts initialization parameters
const { appClient, result } = await factory.send.create({
  method: 'create_abi',
  args: ['admin_mode'],
  deployTimeParams,
})

console.log('Created with mode:', result.return)
```

### Create with Configuration Object

```typescript
// Method that accepts structured configuration
const config = {
  maxUsers: 100,
  feeBps: 500,
  paused: false,
}

const { appClient, result } = await factory.send.create({
  method: 'initializeWithConfig',
  args: [config.maxUsers, config.feeBps, config.paused],
  deployTimeParams,
})

console.log('Configuration applied:', result.return)
```

### Create with Validation

```typescript
// Method that validates deployment parameters
try {
  const { appClient, result } = await factory.send.create({
    method: 'validateAndCreate',
    args: [minDeposit, maxWithdrawal],
    deployTimeParams,
  })

  console.log('Validation passed:', result.return)
} catch (error) {
  console.error('Validation failed:', error.message)
}
```

### Create with Multiple Initializations

```typescript
// Method that performs multi-step initialization
const { appClient, result } = await factory.send.create({
  method: 'fullInitialization',
  args: [ownerAddress, tokenId, initialSupply],
  deployTimeParams,
})

// Returns summary of initialization steps
const summary = result.return as string
console.log('Initialization summary:', summary)
```

### Create with Asset References

```typescript
// Method that initializes with asset references
const { appClient, result } = await factory.send.create({
  method: 'createWithAssets',
  args: [assetId1, assetId2],
  deployTimeParams,
})

console.log('Assets registered:', result.return)
```

### Create with Access Control

```typescript
// Method that sets up access control during creation
const adminAddress = 'ADMIN_ADDRESS_HERE'

const { appClient, result } = await factory.send.create({
  method: 'createWithAdmin',
  args: [adminAddress],
  deployTimeParams,
})

console.log('Admin set to:', result.return)
```

### Create with Error Handling

```typescript
// Handle various creation failure scenarios
try {
  const { appClient, result } = await factory.send.create({
    method: 'create_abi',
    args: ['initialization_data'],
    deployTimeParams,
  })

  console.log('Create successful:', result.return)
} catch (error: any) {
  if (error.message.includes('already exists')) {
    console.error('Error: App already deployed')
  } else if (error.message.includes('invalid parameter')) {
    console.error('Error: Invalid initialization parameters')
  } else {
    console.error('Create failed:', error.message)
  }
}
```

### Create with Version Tracking

```typescript
// Method that tracks app version during creation
const version = '1.0.0'

const { appClient, result } = await factory.send.create({
  method: 'createWithVersion',
  args: [version],
  deployTimeParams,
})

console.log('Version deployed:', result.return)
```

### Create with State Initialization

```typescript
// Method that initializes global state during creation
const { appClient, result } = await factory.send.create({
  method: 'initializeState',
  args: [initialValue1, initialValue2, initialString],
  deployTimeParams,
})

console.log('State initialized:', result.return)

// Verify state was set
const globalState = await appClient.getGlobalState()
console.log('Global state:', globalState)
```

### Create with Return Data Parsing

```typescript
// Method that returns structured data
const { appClient, result } = await factory.send.create({
  method: 'createWithMetadata',
  args: ['v1.0'],
  deployTimeParams,
})

// Parse tuple return value: (uint64,string)
const [appVersion, status] = result.return as [bigint, string]
console.log(`App version: ${appVersion}`)
console.log(`Status: ${status}`)
```

## Best Practices

1. **Use Descriptive Method Names**
   ```typescript
   // Good: Clear method name
   const { appClient, result } = await factory.send.create({
     method: 'initializeWithConfig',
     args: [config],
   })

   // Avoid: Generic name
   const { appClient, result } = await factory.send.create({
     method: 'create_abi',
     args: [config],
   })
   ```

2. **Validate Return Values**
   ```typescript
   // Good: Check return value
   const { appClient, result } = await factory.send.create({
     method: 'create_abi',
     args: ['initialization_complete'],
     deployTimeParams,
   })

   if (result.return !== 'initialization_complete') {
     throw new Error('Initialization did not complete successfully')
   }
   ```

3. **Document Initialization Parameters**
   ```typescript
   // Good: Document what parameters do
   /**
    * Creates app with initial configuration
    * @param maxUsers - Maximum number of users (uint64)
    * @param adminAddress - Address of admin account
    * @returns Confirmation message with setup summary
    */
   const { appClient, result } = await factory.send.create({
     method: 'initializeApp',
     args: [1000, adminAddress],
     deployTimeParams,
   })
   ```

4. **Handle Creation Errors**
   ```typescript
   // Good: Catch and handle errors appropriately
   try {
     const { appClient, result } = await factory.send.create({
       method: 'create_abi',
       args: ['init'],
       deployTimeParams,
     })
     console.log('Create successful')
   } catch (error: any) {
     console.error('Create failed:', error.message)
     // Handle error appropriately
   }
   ```

5. **Use Type-Safe Arguments**
   ```typescript
   // Good: Type-safe arguments
   const initMessage = 'initialization_complete'
   const { appClient, result } = await factory.send.create({
     method: 'create_abi',
     args: [initMessage],
     deployTimeParams,
   })

   // Avoid: Magic strings or wrong types
   const { appClient, result } = await factory.send.create({
     method: 'create_abi',
     args: [123],  // Wrong type - expects string
     deployTimeParams,
   })
   ```

6. **Verify Deployment Parameters**
   ```typescript
   // Good: Check parameters before deployment
   const deployTimeParams = {
     TMPL_UPDATABLE: 1,
     TMPL_DELETABLE: 1,
     TMPL_VALUE: 42,
   }

   // Validate parameters
   if (deployTimeParams.TMPL_VALUE < 0) {
     throw new Error('TMPL_VALUE must be positive')
   }

   const { appClient, result } = await factory.send.create({
     method: 'create_abi',
     args: ['init'],
     deployTimeParams,
   })
   ```

7. **Log Deployment Details**
   ```typescript
   // Good: Log comprehensive deployment info
   const { appClient, result } = await factory.send.create({
     method: 'create_abi',
     args: ['initialization_complete'],
     deployTimeParams,
   })

   console.log('Deployment completed:')
   console.log(`  App ID: ${appClient.appId}`)
   console.log(`  App Address: ${appClient.appAddress}`)
   console.log(`  Transaction: ${result.txIds[0]}`)
   console.log(`  Return Value: ${result.return}`)
   console.log(`  Deploy Params:`, deployTimeParams)
   ```

## ABI Create Methods

### Method Configuration

Create methods must be configured in the app spec:

```json
{
  "contract": {
    "methods": [
      {
        "name": "create_abi",
        "args": [
          {
            "type": "string",
            "name": "init_message"
          }
        ],
        "returns": {
          "type": "string"
        }
      }
    ]
  },
  "hints": {
    "create_abi": {
      "call_config": {
        "no_op": "CREATE"
      }
    }
  }
}
```

Key configuration:
- **Method Definition**: Defines arguments and return type
- **Call Config**: `no_op: "CREATE"` marks it as a create method
- **Arguments**: Can be any ABI types
- **Return Type**: Can be any ABI type

### Create Method Patterns

**Simple Confirmation**:
```typescript
// Method: create_abi(string)string
const { result } = await factory.send.create({
  method: 'create_abi',
  args: ['initialized'],
  deployTimeParams,
})
// Returns: string confirmation message
```

**With Configuration**:
```typescript
// Method: createWithConfig(uint64,uint64,bool)string
const { result } = await factory.send.create({
  method: 'createWithConfig',
  args: [100, 500, false],
  deployTimeParams,
})
// Returns: configuration summary
```

**With Validation**:
```typescript
// Method: validateAndCreate(string,uint64)bool
const { result } = await factory.send.create({
  method: 'validateAndCreate',
  args: ['admin', 12345],
  deployTimeParams,
})
const success = result.return as boolean
```

## Bare Create vs ABI Create

### Bare Create

```typescript
// Simple create without arguments or return value
const { appClient } = await factory.send.bare.create({
  deployTimeParams,
})
```

Use bare create when:
- No initialization logic needed
- No arguments required
- No return value needed
- Simple deployment

### ABI Create

```typescript
// Create with arguments and return value
const { appClient, result } = await factory.send.create({
  method: 'create_abi',
  args: ['initialization_complete'],
  deployTimeParams,
})
console.log('Returned:', result.return)
```

Use ABI create when:
- Need to pass arguments
- Want return values
- Require initialization logic
- Need type safety
- Want confirmation messages

## Key Takeaways

- ABI create methods allow passing arguments and getting return values during deployment
- Access return value via `result.return`
- Create methods execute initialization logic during app creation
- Deploy-time parameters control app configuration
- Transaction ID available via `result.txIds[0]`
- Create methods must have `no_op: 'CREATE'` in call config
- Factory pattern simplifies app creation and management
- Use meaningful return values for deployment confirmation
- Always handle creation errors appropriately
- Verify deployment was successful by checking return values
- Type-safe arguments prevent deployment errors
- Document initialization parameters for clarity

This example demonstrates advanced application deployment with custom initialization logic, essential for applications that need proper setup and configuration during creation.
