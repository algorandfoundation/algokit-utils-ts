# Create Algorand Application with Deploy-Time Parameters

This example demonstrates how to create an Algorand application with deploy-time parameters (also called template variables). These parameters are substituted into the smart contract code during compilation, allowing you to customize immutable contract values at deployment time.

## Key Concepts

- **Deploy-Time Parameters**: Template variables in TEAL code that are replaced during compilation
- **Template Variables**: Placeholders like `TMPL_UPDATABLE`, `TMPL_DELETABLE`, `TMPL_VALUE`
- **Immutable Configuration**: Values set at deployment that cannot change afterward
- **App Factory**: Typed factory for creating and managing application instances
- **Bare Call**: Create an app without calling an ABI method (just the constructor)

## What This Example Shows

1. Setting up an AlgorandClient and creating accounts
2. Getting a typed app factory with a default sender
3. Creating an application with deploy-time parameters
4. Verifying the app was created with the correct ID and address
5. Understanding how deploy-time parameters work

## Code Walkthrough

### Initialize Client and Account

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

const creator = algorand.account.random()
await algorand.account.ensureFunded(creator, dispenser, (5).algos())
```

Create an AlgorandClient for LocalNet and fund a creator account with enough ALGOs to deploy the application.

### Get Typed App Factory

```typescript
const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: creator.addr,
})
```

Get a typed app factory that uses the TestingAppFactory client (generated from your smart contract). The `defaultSender` sets who will send transactions by default.

### Create App with Deploy-Time Parameters

```typescript
const { appClient, result } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1, // 1 = updatable, 0 = not updatable
    TMPL_DELETABLE: 1, // 1 = deletable, 0 = not deletable
    TMPL_VALUE: 42,    // Custom parameter value
  },
})
```

**Key points**:
- `send.create.bare()`: Creates the app without calling an ABI method
- `deployTimeParams`: Object containing template variable values
- The SDK compiles the TEAL code with these values substituted
- Returns both the `appClient` for future operations and the `result` with app ID

### Verify Creation

```typescript
const appId = BigInt(result.appId)
const appAddress = getApplicationAddress(appId)

console.log('App ID:', appId)
console.log('App Address:', appAddress)
```

Extract the app ID from the result and calculate the app's address using algosdk's `getApplicationAddress()`.

## API Patterns (AlgoKit Utils v9.1.2)

### Get Typed App Factory

```typescript
const appFactory = algorand.client.getTypedAppFactory(AppFactory, {
  defaultSender: senderAddress,
  // Optional: other default parameters
})
```

### Create App with Deploy-Time Parameters

```typescript
const { appClient, result } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_PARAM1: value1,
    TMPL_PARAM2: value2,
  },
})

// Access the app ID
const appId = BigInt(result.appId)

// Use the app client for future operations
await appClient.send.someMethod({ args: [...] })
```

### Deploy-Time Parameters Object

```typescript
interface DeployTimeParams {
  [key: string]: number | string | bigint
}

// Example:
const params = {
  TMPL_UPDATABLE: 1,      // number
  TMPL_DELETABLE: 0,      // number
  TMPL_VALUE: 42n,        // bigint
  TMPL_NAME: 'MyApp',     // string
}
```

### Create with ABI Method

If your contract has an ABI create method:

```typescript
const { appClient, result } = await appFactory.send.create.createMethod({
  args: {
    // ABI method arguments
  },
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
  },
})
```

## Common Use Cases

### Configurable Update/Delete Permissions

Control whether apps can be modified after deployment:

```typescript
// Production app - not updatable or deletable
const { appClient: prodApp } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 0,
    TMPL_DELETABLE: 0,
    TMPL_VALUE: 100,
  },
})

// Development app - updatable and deletable
const { appClient: devApp } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 100,
  },
})
```

### Contract Configuration Values

Set immutable configuration values at deployment:

```typescript
const { appClient } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_MAX_USERS: 1000,
    TMPL_FEE_PERCENTAGE: 5,
    TMPL_MIN_STAKE: 100000000, // 100 ALGO in microAlgos
  },
})
```

### Multi-Environment Deployments

Deploy the same contract with different parameters per environment:

```typescript
function getDeployParams(environment: 'dev' | 'staging' | 'prod') {
  const baseParams = {
    TMPL_VALUE: 42,
  }

  switch (environment) {
    case 'dev':
      return { ...baseParams, TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1 }
    case 'staging':
      return { ...baseParams, TMPL_UPDATABLE: 1, TMPL_DELETABLE: 0 }
    case 'prod':
      return { ...baseParams, TMPL_UPDATABLE: 0, TMPL_DELETABLE: 0 }
  }
}

const { appClient } = await appFactory.send.create.bare({
  deployTimeParams: getDeployParams('prod'),
})
```

### Address Template Parameters

Include addresses in deploy-time parameters:

```typescript
const treasuryAddress = 'TREASURY...'
const adminAddress = 'ADMIN...'

const { appClient } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_TREASURY: treasuryAddress,
    TMPL_ADMIN: adminAddress,
  },
})
```

## Important Considerations

### Template Variable Naming

```typescript
// In your TEAL code, template variables typically use TMPL_ prefix:
// TMPL_UPDATABLE
// TMPL_DELETABLE
// TMPL_VALUE

// When passing deploy-time params, you can include or omit TMPL_ prefix:
deployTimeParams: {
  TMPL_UPDATABLE: 1,  // With prefix
  DELETABLE: 1,       // Without prefix (SDK handles both)
  TMPL_VALUE: 42,     // With prefix
}
```

**Note**: The SDK is flexible with naming, but it's best to match your contract's template variable names exactly.

### Value Types

Deploy-time parameters can be:
- **Numbers**: `TMPL_VALUE: 42`
- **BigInts**: `TMPL_LARGE_VALUE: 1000000n`
- **Strings**: `TMPL_NAME: 'MyApp'`
- **Addresses**: `TMPL_ADMIN: 'ABC123...'`

### Immutability

**Critical**: Deploy-time parameters are **immutable** after deployment. Once the app is created, these values cannot change unless:
1. The app is updatable (`TMPL_UPDATABLE: 1`)
2. You deploy a new version with different parameters

### Compilation Process

```typescript
// What happens when you create an app:
// 1. SDK loads the TEAL template from your app spec
// 2. SDK substitutes template variables with your deploy-time params
// 3. SDK compiles the substituted TEAL code
// 4. SDK submits the compiled program in the create transaction
```

### App Factory vs App Client

```typescript
// App Factory: Used to CREATE new apps
const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: creator.addr,
})
const { appClient, result } = await appFactory.send.create.bare({ ... })

// App Client: Used to INTERACT with existing apps
// (automatically returned from create, or get it separately)
await appClient.send.someMethod({ args: [...] })
```

### Error Handling

```typescript
try {
  const { appClient, result } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 42,
    },
  })
} catch (error) {
  // Common errors:
  // - Missing required template variables
  // - Invalid parameter types
  // - Insufficient balance for app creation
  // - Template variable type mismatch
  console.error('Failed to create app:', error)
}
```

### Required vs Optional Parameters

```typescript
// Your contract may require certain template variables
// Check your contract's template_variables section:

// Required parameters (must provide):
const { appClient } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,  // Required
    TMPL_DELETABLE: 1,  // Required
    TMPL_VALUE: 42,     // Required
  },
})

// Missing required parameter will cause compilation error
const { appClient } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    // Missing TMPL_DELETABLE - ERROR!
  },
})
```

## Expected Output

```
Creator address: RY7YXIBBLE36VNQBJ7HLOZ6ICM6XLW6AX3LQMCYS7LOPCOZQVQX2JK3XXE

=== Creating Application with Deploy-Time Parameters ===

✅ App created successfully!
App ID: 1609n
App Address: BYGJRWM2PAJUSTMPJEHAJWQVKK3LYHTU6IDTKSK23JHKSS2JVJTEHVPJVA

Deploy-time parameters used:
  TMPL_UPDATABLE: 1 (app is updatable)
  TMPL_DELETABLE: 1 (app is deletable)
  TMPL_VALUE: 42 (custom value)

The app client is ready for method calls.
Example: await appClient.send.methodName({ args: [...] })

✅ Example completed successfully!
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
1. Create and fund a creator account
2. Get a typed app factory for TestingApp
3. Create the app with deploy-time parameters
4. Display the app ID and address
5. Show which parameters were used

## Smart Contract Template Variables

### In Your TEAL Code

Template variables appear in your TEAL source:

```teal
// Approval program
#pragma version 10

// Template variables
int TMPL_UPDATABLE
int TMPL_DELETABLE
int TMPL_VALUE

// Use template variables in logic
txn ApplicationID
int 0
==
bnz create_app

// Update logic
txn OnCompletion
int UpdateApplication
==
bnz update_app

update_app:
  // Check if updatable
  int TMPL_UPDATABLE
  return

create_app:
  // Store the configured value
  byte "value"
  int TMPL_VALUE
  app_global_put
  int 1
  return
```

### In Your Arc-32 App Spec

Template variables are declared in the app spec:

```json
{
  "template_variables": {
    "TMPL_UPDATABLE": {
      "type": "uint64"
    },
    "TMPL_DELETABLE": {
      "type": "uint64"
    },
    "TMPL_VALUE": {
      "type": "uint64"
    }
  }
}
```

## Debugging Deploy-Time Parameters

### Check What Parameters Are Expected

```typescript
// Read the app factory's template variables
const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: creator.addr,
})

// The TypeScript types will show you what parameters are expected
// Look at the AppFactory type definition for deployTimeParams
```

### Verify Parameter Substitution

After deployment, you can verify the parameters were applied correctly by:

```typescript
// 1. Call a method that returns the configured value
const result = await appClient.send.getValue()
console.log('Configured value:', result.return)

// 2. Read global state
const globalState = await algorand.app.getGlobalState(appId)
console.log('Global state:', globalState)

// 3. Try to update/delete the app
try {
  await appClient.send.update.bare({ ... })
  console.log('App is updatable')
} catch {
  console.log('App is not updatable')
}
```

### Test Different Parameter Combinations

```typescript
const testConfigs = [
  { TMPL_UPDATABLE: 0, TMPL_DELETABLE: 0, TMPL_VALUE: 100 },
  { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 0, TMPL_VALUE: 200 },
  { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 300 },
]

for (const config of testConfigs) {
  const { appClient, result } = await appFactory.send.create.bare({
    deployTimeParams: config,
  })
  console.log(`Created app ${result.appId} with config:`, config)
}
```

## Advanced Patterns

### Conditional Parameter Generation

```typescript
function generateDeployParams(options: {
  environment: 'dev' | 'prod'
  maxUsers: number
  feeBasisPoints: number
}) {
  return {
    TMPL_UPDATABLE: options.environment === 'dev' ? 1 : 0,
    TMPL_DELETABLE: options.environment === 'dev' ? 1 : 0,
    TMPL_MAX_USERS: options.maxUsers,
    TMPL_FEE_BASIS_POINTS: options.feeBasisPoints,
  }
}

const { appClient } = await appFactory.send.create.bare({
  deployTimeParams: generateDeployParams({
    environment: 'prod',
    maxUsers: 10000,
    feeBasisPoints: 250, // 2.5%
  }),
})
```

### Factory Pattern for Multiple Deployments

```typescript
async function deployApp(
  algorand: AlgorandClient,
  creator: Account,
  params: DeployTimeParams
) {
  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: creator.addr,
  })

  const { appClient, result } = await appFactory.send.create.bare({
    deployTimeParams: params,
  })

  return { appClient, appId: BigInt(result.appId) }
}

// Deploy multiple instances
const app1 = await deployApp(algorand, creator, { TMPL_VALUE: 100 })
const app2 = await deployApp(algorand, creator, { TMPL_VALUE: 200 })
const app3 = await deployApp(algorand, creator, { TMPL_VALUE: 300 })
```

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [TEAL Template Variables](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/)
- [Arc-32 Application Specification](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0032.md)
- [Smart Contract Deployment](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/)
- [Application Addresses](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#application-address)
