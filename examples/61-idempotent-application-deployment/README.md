# Idempotent Application Deployment

This example demonstrates idempotent application deployment using AlgoKit Utils. Idempotent deployment means you can safely run the deployment multiple times - it will create the app if it doesn't exist, or reuse/update it if it does. This is essential for automated deployments and CI/CD pipelines.

## What This Example Shows

This example teaches you how to:
- Deploy applications idempotently using the app factory
- Configure deployment behavior with `onUpdate` and `onSchemaBreak`
- Handle deploy-time template parameters
- Control updatability and deletability flags
- Detect what operation was performed (create, update, replace, nothing)
- Verify deployed application properties
- Test deployed applications work correctly

## Why This Matters

Idempotent deployment is crucial for production applications:

1. **CI/CD Pipelines**: Run deployment scripts safely in automation
2. **No Errors on Re-run**: Deployment succeeds even if app already exists
3. **Automatic Updates**: Detects when code changes and updates accordingly
4. **Safe Iteration**: Develop and test without manual cleanup
5. **Infrastructure as Code**: Declare desired state, let SDK handle it
6. **Reproducible Deployments**: Same script works on fresh and existing environments

Key concepts:
- **Idempotency**: Running operation multiple times has same effect as once
- **Operation Detection**: Know what happened (created, updated, or nothing)
- **Deploy-Time Parameters**: Template variables substituted during deployment
- **Update Strategies**: Control how code/schema changes are handled
- **Deployment Metadata**: Access app ID, address, compiled programs, confirmations

Common scenarios:
- Running deployment script multiple times during development
- Automated deployments in staging/production environments
- CI/CD pipeline deploying on every commit
- Testing deployment process without side effects
- Recovering from partial deployments
- Updating existing apps with new code

## How It Works

### 1. Initialize Client and Account

Set up AlgorandClient and get a funded deployer account:

```typescript
import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import { getApplicationAddress } from 'algosdk'
import appSpec from './artifacts/HelloWorld.arc56.json' with { type: 'json' }

const algorand = AlgorandClient.defaultLocalNet()
const deployer = await algorand.account.fromEnvironment('DEPLOYER', algo(10))
console.log(`Using deployer account: ${deployer.addr}`)
```

Setup details:
- `AlgorandClient.defaultLocalNet()` connects to LocalNet
- `fromEnvironment()` gets/creates account with name 'DEPLOYER'
- `algo(10)` ensures account has 10 ALGO for deployment costs
- Same deployer account should be used for idempotency

### 2. Create App Factory

Create a factory instance with your app specification:

```typescript
const factory = algorand.client.getAppFactory({
  appSpec: appSpec as any,
  defaultSender: deployer.addr,
})
```

Factory configuration:
- `appSpec` is ARC-56 application specification
- `defaultSender` is the account that will deploy
- Factory handles app creation, updates, and method calls
- Same factory can deploy multiple instances

### 3. First Deployment (Create)

Deploy the application for the first time:

```typescript
console.log('1. First Deployment (should CREATE)')

const { result: app } = await factory.deploy({
  onUpdate: 'update',        // Update if code changes
  onSchemaBreak: 'replace',  // Replace if schema changes
  updatable: true,           // Allow future updates
  deletable: true,           // Allow deletion
  deployTimeParams: {
    VALUE: 1,                // Template parameter
  },
})

console.log(`Operation: ${app.operationPerformed}`)  // "create"
console.log(`App ID: ${app.appId}`)
console.log(`App Address: ${app.appAddress}`)
```

First deployment behavior:
- No existing app found, so creates new one
- `operationPerformed` will be `"create"`
- Returns app ID and app address
- Compiled approval and clear programs available
- Confirmation includes transaction details

Deploy options explained:
- `onUpdate: 'update'` - If app exists with different code, update it
- `onUpdate: 'replace'` - If app exists with different code, delete and recreate
- `onUpdate: 'fail'` - If app exists with different code, throw error
- `onSchemaBreak: 'replace'` - If schema changed, delete and recreate
- `onSchemaBreak: 'fail'` - If schema changed, throw error
- `updatable: true` - Set updatable flag in app creation
- `deletable: true` - Set deletable flag in app creation

### 4. Verify Application Properties

Verify the deployed application has expected properties:

```typescript
// Verify address matches expected address for app ID
const expectedAddress = getApplicationAddress(app.appId)
console.log(`Address verification: ${app.appAddress.toString() === expectedAddress.toString() ? 'PASSED' : 'FAILED'}`)

// Check compiled programs are available
console.log(`Approval Program: ${app.compiledApproval ? 'Compiled' : 'Not available'}`)
console.log(`Clear Program: ${app.compiledClear ? 'Compiled' : 'Not available'}`)
```

Available properties:
- `app.appId` - Application ID (number)
- `app.appAddress` - Application account address (string)
- `app.operationPerformed` - What happened: 'create', 'update', 'replace', or 'nothing'
- `app.compiledApproval` - Compiled approval program (CompiledTeal)
- `app.compiledClear` - Compiled clear program (CompiledTeal)
- `app.confirmation` - Transaction confirmation with round info

### 5. Second Deployment (Idempotent)

Deploy again with same parameters - should detect existing app:

```typescript
console.log('2. Second Deployment (should be unchanged)')

const { result: app2 } = await factory.deploy({
  onUpdate: 'update',
  onSchemaBreak: 'replace',
  updatable: true,
  deletable: true,
  deployTimeParams: {
    VALUE: 1,  // Same value as before
  },
})

console.log(`Operation: ${app2.operationPerformed}`)  // "nothing"
console.log(`App ID: ${app2.appId}`)
console.log(`Same App ID: ${app.appId === app2.appId ? 'YES ✓' : 'NO ✗'}`)
```

Idempotent behavior:
- Factory detects existing app with same code
- No changes needed, so `operationPerformed` is `"nothing"`
- Returns same app ID as first deployment
- No blockchain transaction needed
- Saves costs and time

### 6. Test the Deployed Application

Verify the application works by calling a method:

```typescript
console.log('3. Testing the Deployed Application')

const appClient = factory.getAppClientById({ appId: app.appId })
const callResult = await appClient.send.call({
  method: 'call_abi',
  args: ['World'],
})

console.log(`Method returned: ${callResult.return}`)  // "Hello, World"
```

Testing deployed app:
- Get app client by ID from factory
- Call methods to verify functionality
- Check return values match expectations
- Confirms deployment was successful

## Prerequisites

- AlgoKit installed and AlgoKit LocalNet running
- Node.js and npm installed
- AlgoKit Utils TypeScript (`@algorandfoundation/algokit-utils`) v9.1.2+
- algosdk v3.5.2+

## Running the Example

1. Start AlgoKit LocalNet:
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
=== Idempotent Application Deployment ===

Using deployer account: <address>

1. First Deployment (should CREATE)
   Deploying TestingApp application...
   ✅ Operation: create
   App ID: 1089
   App Address: <app-address>
   ✓ Address verification: PASSED
   Approval Program: Compiled
   Clear Program: Compiled

2. Second Deployment (should be unchanged)
   Deploying same app again...
   ✅ Operation: nothing
   App ID: 1089
   Same App ID as first deployment: YES ✓

3. Testing the Deployed Application
   Calling call_abi("World") method...
   ✅ Method returned: Hello, World

=== Summary ===
✓ First deployment created the application
✓ Second deployment detected existing app (idempotent)
✓ Application is functional and callable

💡 Key Benefits of Idempotent Deployment:
   • Safe to run deployment scripts multiple times
   • No errors if app already exists
   • Automatic detection of updates needed
   • Perfect for CI/CD pipelines and automation
```

## Common Patterns

### Basic Idempotent Deployment

```typescript
import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import appSpec from './artifacts/app.arc56.json' with { type: 'json' }

async function deploy() {
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.fromEnvironment('DEPLOYER', algo(10))

  const factory = algorand.client.getAppFactory({
    appSpec: appSpec as any,
    defaultSender: deployer.addr,
  })

  const { result: app } = await factory.deploy({
    onUpdate: 'update',      // Auto-update on code changes
    onSchemaBreak: 'replace', // Recreate on schema changes
    updatable: true,
    deletable: true,
  })

  console.log(`Operation: ${app.operationPerformed}`)
  console.log(`App ID: ${app.appId}`)

  return app
}
```

### Deploy with Template Parameters

```typescript
const { result: app } = await factory.deploy({
  onUpdate: 'update',
  onSchemaBreak: 'replace',
  updatable: true,
  deletable: true,
  deployTimeParams: {
    VALUE: 42,              // Replaces TMPL_VALUE in TEAL
    ADMIN_ADDRESS: adminAccount.addr,  // Replaces TMPL_ADMIN_ADDRESS
  },
})

console.log(`Deployed with VALUE=42, operation: ${app.operationPerformed}`)
```

### Handle Different Operations

```typescript
const { result: app } = await factory.deploy({
  onUpdate: 'update',
  onSchemaBreak: 'replace',
  updatable: true,
  deletable: true,
})

switch (app.operationPerformed) {
  case 'create':
    console.log('✓ Created new application')
    // Perform initial setup
    break
  case 'update':
    console.log('✓ Updated existing application')
    // Handle migration if needed
    break
  case 'replace':
    console.log('✓ Replaced application (schema changed)')
    // State was reset, reinitialize
    break
  case 'nothing':
    console.log('✓ Application unchanged')
    // No action needed
    break
}
```

### Conservative Deployment (Fail on Changes)

```typescript
// Fail if app exists with different code (safer for production)
const { result: app } = await factory.deploy({
  onUpdate: 'fail',         // Don't auto-update, fail instead
  onSchemaBreak: 'fail',    // Don't replace, fail instead
  updatable: false,         // Make immutable
  deletable: false,         // Make permanent
})

// This will throw if:
// - App exists with different code (onUpdate: fail)
// - App exists with different schema (onSchemaBreak: fail)
// Good for immutable production deployments
```

### CI/CD Pipeline Deployment

```typescript
async function deployForCICD() {
  try {
    const algorand = AlgorandClient.defaultLocalNet()

    // Use consistent deployer account for idempotency
    const deployer = await algorand.account.fromEnvironment('DEPLOYER', algo(10))

    const factory = algorand.client.getAppFactory({
      appSpec: appSpec as any,
      defaultSender: deployer.addr,
    })

    console.log('Deploying application...')

    const { result: app } = await factory.deploy({
      onUpdate: 'update',       // Auto-update on new commits
      onSchemaBreak: 'replace',  // Handle schema changes
      updatable: true,
      deletable: true,
    })

    console.log(`✅ Deployment successful: ${app.operationPerformed}`)
    console.log(`App ID: ${app.appId}`)

    // Save app ID for later use
    await saveAppIdToConfig(app.appId)

    // Run smoke tests
    await verifyDeployment(factory, app.appId)

    return app
  } catch (error) {
    console.error('❌ Deployment failed:', error.message)
    process.exit(1)
  }
}

async function verifyDeployment(factory, appId) {
  const appClient = factory.getAppClientById({ appId })

  // Call a method to verify app works
  const result = await appClient.send.call({
    method: 'healthCheck',
    args: [],
  })

  if (result.return === 'OK') {
    console.log('✓ Smoke test passed')
  } else {
    throw new Error('Smoke test failed')
  }
}
```

### Multi-Environment Deployment

```typescript
async function deployToEnvironment(env: 'dev' | 'staging' | 'prod') {
  const algorand = env === 'prod'
    ? AlgorandClient.mainNet()
    : env === 'staging'
    ? AlgorandClient.testNet()
    : AlgorandClient.defaultLocalNet()

  // Different deployer per environment
  const deployerName = `DEPLOYER_${env.toUpperCase()}`
  const deployer = await algorand.account.fromEnvironment(deployerName, algo(10))

  const factory = algorand.client.getAppFactory({
    appSpec: appSpec as any,
    defaultSender: deployer.addr,
  })

  // Production is immutable, dev/staging updatable
  const { result: app } = await factory.deploy({
    onUpdate: env === 'prod' ? 'fail' : 'update',
    onSchemaBreak: env === 'prod' ? 'fail' : 'replace',
    updatable: env !== 'prod',
    deletable: env !== 'prod',
    deployTimeParams: {
      ENV: env,
    },
  })

  console.log(`Deployed to ${env}: ${app.operationPerformed}`)
  return app
}
```

## Best Practices

1. **Use Consistent Deployer Account**
   ```typescript
   // Good: Same account name for idempotency
   const deployer = await algorand.account.fromEnvironment('DEPLOYER', algo(10))

   // Avoid: Different accounts break idempotency
   // Each account would create a separate app
   const deployer1 = await algorand.account.fromEnvironment('ACCOUNT1', algo(10))
   const deployer2 = await algorand.account.fromEnvironment('ACCOUNT2', algo(10))
   ```

2. **Choose Appropriate Update Strategy**
   ```typescript
   // Good: Auto-update in development
   const { result: devApp } = await factory.deploy({
     onUpdate: 'update',       // Convenient for iteration
     onSchemaBreak: 'replace',
   })

   // Good: Fail-safe in production
   const { result: prodApp } = await factory.deploy({
     onUpdate: 'fail',         // Explicit update required
     onSchemaBreak: 'fail',    // Prevent accidental changes
   })
   ```

3. **Handle All Operation Types**
   ```typescript
   // Good: React to what happened
   const { result: app } = await factory.deploy(config)

   if (app.operationPerformed === 'create') {
     await initializeApp(app.appId)
   } else if (app.operationPerformed === 'replace') {
     await migrateState(app.appId)
   }

   // Avoid: Assuming operation type
   await initializeApp(app.appId)  // Fails if app already initialized
   ```

4. **Test Idempotency**
   ```typescript
   // Good: Verify deployment is truly idempotent
   async function testIdempotency() {
     const { result: app1 } = await factory.deploy(config)
     const { result: app2 } = await factory.deploy(config)
     const { result: app3 } = await factory.deploy(config)

     assert(app1.appId === app2.appId)
     assert(app2.appId === app3.appId)
     assert(app2.operationPerformed === 'nothing')
     assert(app3.operationPerformed === 'nothing')
   }
   ```

5. **Use Deploy-Time Parameters Wisely**
   ```typescript
   // Good: Use for environment config
   const { result: app } = await factory.deploy({
     deployTimeParams: {
       ADMIN_ADDRESS: adminAccount.addr,
       MAX_SUPPLY: 1_000_000,
       NETWORK: 'mainnet',
     },
   })

   // Avoid: Hardcoding values that vary by environment
   // Use deployTimeParams instead
   ```

6. **Save App ID for Later Use**
   ```typescript
   // Good: Persist app ID
   const { result: app } = await factory.deploy(config)

   await fs.writeFile('.env.deployed', `APP_ID=${app.appId}\n`)
   console.log(`App ID ${app.appId} saved to .env.deployed`)

   // Later: Reuse the app
   const appId = parseInt(process.env.APP_ID)
   const appClient = factory.getAppClientById({ appId })
   ```

7. **Verify Deployment Success**
   ```typescript
   // Good: Test deployed app
   const { result: app } = await factory.deploy(config)

   // Verify properties
   assert(app.appId > 0)
   assert(app.appAddress)
   assert(app.compiledApproval)

   // Verify functionality
   const appClient = factory.getAppClientById({ appId: app.appId })
   const result = await appClient.send.call({ method: 'test', args: [] })
   assert(result.return === 'OK')

   console.log('✓ Deployment verified')
   ```

## Understanding Deploy Operations

### Operation Types

The `operationPerformed` field tells you what happened:

```
Operation: "create"
- App did not exist
- New app was created
- App ID is new
- Initial state is empty
- Action: Perform initial setup

Operation: "update"
- App existed with different code
- Code was updated in-place
- App ID unchanged
- State preserved
- Action: No migration needed

Operation: "replace"
- App existed with incompatible schema
- Old app was deleted
- New app was created
- App ID may change
- State was reset
- Action: Reinitialize state

Operation: "nothing"
- App existed with same code
- No changes made
- App ID unchanged
- State unchanged
- Action: Continue using app
```

### Update Strategies

```typescript
// Strategy 1: Permissive (development)
{
  onUpdate: 'update',        // Auto-update code changes
  onSchemaBreak: 'replace',  // Auto-replace on schema changes
  updatable: true,           // Allow future updates
  deletable: true,           // Allow deletion
}
// Good for: Development, testing, iteration

// Strategy 2: Conservative (staging)
{
  onUpdate: 'update',        // Allow updates
  onSchemaBreak: 'fail',     // Fail on schema changes (manual)
  updatable: true,
  deletable: true,
}
// Good for: Staging, pre-production testing

// Strategy 3: Immutable (production)
{
  onUpdate: 'fail',          // Fail on any changes
  onSchemaBreak: 'fail',     // Fail on schema changes
  updatable: false,          // Make immutable
  deletable: false,          // Make permanent
}
// Good for: Production, mainnet deployments
```

## Key Takeaways

- Idempotent deployment means running it multiple times is safe
- First deployment creates the app (`operationPerformed: "create"`)
- Subsequent deployments detect existing app (`operationPerformed: "nothing"`)
- Deploy configuration controls update behavior (`onUpdate`, `onSchemaBreak`)
- Use `deployTimeParams` for template variable substitution
- Control immutability with `updatable` and `deletable` flags
- Always use same deployer account for idempotency
- Check `operationPerformed` to know what happened
- Verify deployment with property checks and test calls
- Essential for CI/CD pipelines and automation
- Save app ID for later use in your application
- Choose update strategy based on environment (dev vs prod)
- Test idempotency by running deployment multiple times

This example demonstrates the foundation of automated Algorand application deployment. Idempotent deployment ensures your deployment scripts work reliably in any environment, whether running for the first time or the hundredth time. This is critical for modern DevOps practices and continuous deployment workflows!
