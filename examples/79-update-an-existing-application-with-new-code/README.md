# Update an Existing Application with New Code

This example demonstrates how to update an existing Algorand smart contract application with new code by changing deploy-time parameters, which modifies the bytecode and triggers an automatic update through AlgoKit Utils' idempotent deployment system.

## Overview

AlgoKit Utils provides an idempotent deployment system that automatically detects when your application code has changed and performs updates as needed. This example shows:
- How to deploy an updatable application
- How changing deploy-time parameters updates the bytecode
- How to track the operation performed (create vs update)
- How app ID and address are preserved during updates
- How to verify update rounds and confirm successful updates

## Key Concepts

### Idempotent Deployment

AlgoKit Utils' `factory.deploy()` method is idempotent, meaning:
- **First call**: Creates the application if it doesn't exist
- **Subsequent calls with same code**: Does nothing (no unnecessary transactions)
- **Subsequent calls with changed code**: Automatically updates the application

This makes deployments safe and predictable in CI/CD pipelines.

### Update Detection

The deployment system detects updates by comparing:
1. **Approval program bytecode** - The main application logic
2. **Clear program bytecode** - The opt-out logic
3. **Global/local state schema** - Storage requirements

When any of these change, an update is automatically triggered.

### Deploy-Time Parameters

TEAL templates can contain placeholders like `TMPL_VALUE` that are replaced at deployment time:
- These parameters are compiled into the bytecode
- Changing parameter values changes the bytecode
- Changed bytecode triggers update detection
- This is a simple way to force updates or modify program constants

### Operation Tracking

The deployment result includes an `operationPerformed` field:
- `'create'` - New application was created
- `'update'` - Existing application was updated
- `'replace'` - Application was deleted and recreated
- `'nothing'` - No changes detected, no operation performed

### Round Tracking

Applications track both creation and update rounds:
- `createdRound` - The round when the app was first created (preserved across updates)
- `updatedRound` - The round when the last update occurred
- These can be used for versioning and audit trails

## Code Examples

### Example 1: Basic Update with Deploy-Time Parameters

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './client'

const algorand = AlgorandClient.defaultLocalNet()
const deployer = await algorand.account.localNetDispenser()

// Get app factory instance
const factory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: deployer.addr,
})

// Deploy initial version with VALUE=42
const { result: createdApp } = await factory.deploy({
  createParams: {
    method: 'create_abi',
    args: { input: 'Initial deployment v1.0' },
  },
  deployTimeParams: {
    VALUE: 42, // Initial value
  },
  updatable: true, // Must be true to allow updates
  deletable: true,
})

console.log(`App created with ID: ${createdApp.appId}`)
console.log(`Operation: ${createdApp.operationPerformed}`) // 'create'

// Update by changing deploy-time parameter
const { result: updatedApp } = await factory.deploy({
  deployTimeParams: {
    VALUE: 100, // Changed from 42
  },
  onUpdate: 'update',
})

console.log(`Operation: ${updatedApp.operationPerformed}`) // 'update'
console.log(`Same app ID: ${updatedApp.appId === createdApp.appId}`) // true
```

### Example 2: Tracking Rounds

```typescript
// Initial deployment
const { result: v1 } = await factory.deploy({
  deployTimeParams: { VALUE: 10 },
  updatable: true,
})

console.log(`Created at round: ${v1.createdRound}`)
console.log(`Updated at round: ${v1.updatedRound}`)
// createdRound and updatedRound are the same on initial creation

// First update
const { result: v2 } = await factory.deploy({
  deployTimeParams: { VALUE: 20 },
  onUpdate: 'update',
})

console.log(`Created at round: ${v2.createdRound}`) // Same as v1
console.log(`Updated at round: ${v2.updatedRound}`) // New round
console.log(`Rounds different: ${v2.updatedRound !== v2.createdRound}`) // true
```

### Example 3: Conditional Deployment

```typescript
const { result } = await factory.deploy({
  deployTimeParams: { VALUE: 50 },
  onUpdate: 'update',
  updatable: true,
})

switch (result.operationPerformed) {
  case 'create':
    console.log('✓ New application created')
    console.log(`  App ID: ${result.appId}`)
    console.log(`  Created at round: ${result.createdRound}`)
    break

  case 'update':
    console.log('✓ Existing application updated')
    console.log(`  App ID: ${result.appId}`)
    console.log(`  Updated at round: ${result.updatedRound}`)
    break

  case 'nothing':
    console.log('ℹ️  No changes detected')
    console.log(`  App ID: ${result.appId}`)
    break
}
```

### Example 4: Idempotent Deployment

```typescript
// Deploy with VALUE=42
await factory.deploy({
  deployTimeParams: { VALUE: 42 },
  updatable: true,
})
// Output: "App created with ID: 1234"

// Deploy again with same VALUE=42
await factory.deploy({
  deployTimeParams: { VALUE: 42 },
  onUpdate: 'update',
})
// Output: "No detected changes in app, nothing to do."
// No transaction sent, no fees incurred

// Deploy with VALUE=100 (changed!)
await factory.deploy({
  deployTimeParams: { VALUE: 100 },
  onUpdate: 'update',
})
// Output: "App 1234 updated via transaction ABC..."
// Update performed because bytecode changed
```

### Example 5: Multiple Deploy-Time Parameters

```typescript
// Initial deployment with multiple parameters
const { result: createdApp } = await factory.deploy({
  deployTimeParams: {
    VALUE: 42,
    MAX_USERS: 1000,
    FEATURE_FLAG: 1,
  },
  updatable: true,
})

// Update only one parameter
const { result: updatedApp } = await factory.deploy({
  deployTimeParams: {
    VALUE: 42,        // Unchanged
    MAX_USERS: 1000,  // Unchanged
    FEATURE_FLAG: 0,  // Changed - disables feature
  },
  onUpdate: 'update',
})

console.log(`Operation: ${updatedApp.operationPerformed}`) // 'update'
```

## Best Practices

### 1. Always Set `updatable: true` for Applications That Need Updates

**Good** - Allows future updates:
```typescript
const { result } = await factory.deploy({
  updatable: true, // ✓ Can update later
  deletable: true,
})
```

**Avoid** - Immutable applications cannot be updated:
```typescript
// BAD: Once deployed, this app can NEVER be updated!
const { result } = await factory.deploy({
  updatable: false, // ✗ Permanent - no updates allowed
})
```

### 2. Use `onUpdate: 'update'` on Initial Deployment

This makes your deployment idempotent from the start:

```typescript
// Good - Works whether app exists or not
const { result } = await factory.deploy({
  onUpdate: 'update', // ✓ Updates existing app or creates new one
  updatable: true,
})

// Also works but less idempotent
const { result } = await factory.deploy({
  // No onUpdate specified on first deploy
  updatable: true,
})
// This will fail if app already exists
```

### 3. Provide Consistent Deploy-Time Parameters

```typescript
// Store parameters in a config object
const deployConfig = {
  VALUE: 42,
  MAX_USERS: 1000,
}

// Initial deployment
await factory.deploy({
  deployTimeParams: deployConfig,
  updatable: true,
})

// Update - must provide all parameters again
await factory.deploy({
  deployTimeParams: {
    ...deployConfig,
    VALUE: 100, // Only change what's needed
  },
  onUpdate: 'update',
})
```

**Important**: You must provide the same set of deploy-time parameter keys on each deployment, even if only some values change.

### 4. Check Operation Performed

Always verify what operation was actually performed:

```typescript
const { result } = await factory.deploy({
  deployTimeParams: { VALUE: 50 },
  onUpdate: 'update',
})

if (result.operationPerformed === 'update') {
  console.log('✓ Update successful')
  console.log(`  Updated at round: ${result.updatedRound}`)
} else if (result.operationPerformed === 'nothing') {
  console.log('ℹ️  No changes detected - app already up to date')
} else if (result.operationPerformed === 'create') {
  console.log('✓ New app created')
  console.log(`  Created at round: ${result.createdRound}`)
}
```

### 5. Preserve App ID and Address

```typescript
// Initial deployment
const { result: createdApp } = await factory.deploy({
  updatable: true,
})

const originalAppId = createdApp.appId
const originalAddress = createdApp.appAddress

// After update
const { result: updatedApp } = await factory.deploy({
  deployTimeParams: { VALUE: 100 },
  onUpdate: 'update',
})

// Verify preservation
console.log(`App ID preserved: ${updatedApp.appId === originalAppId}`) // true
console.log(`Address preserved: ${updatedApp.appAddress === originalAddress}`) // true
```

This is crucial because:
- Users who opted into the app remain opted in
- Assets owned by the app are preserved
- The app's address doesn't change

### 6. Use Version Tracking

```typescript
async function deployVersion(
  factory: TestingAppFactory,
  version: number
) {
  const { result } = await factory.deploy({
    deployTimeParams: {
      VALUE: version * 100, // Different bytecode per version
    },
    onUpdate: 'update',
    updatable: true,
  })

  console.log(`Version ${version} deployment:`)
  console.log(`  Operation: ${result.operationPerformed}`)
  console.log(`  App ID: ${result.appId}`)

  if (result.operationPerformed === 'update') {
    console.log(`  Updated at round: ${result.updatedRound}`)
  } else if (result.operationPerformed === 'create') {
    console.log(`  Created at round: ${result.createdRound}`)
  }

  return result
}

// Deploy version progression
const v1 = await deployVersion(factory, 1)
const v2 = await deployVersion(factory, 2)
const v3 = await deployVersion(factory, 3)
```

## Common Use Cases

### 1. CI/CD Deployments

```typescript
async function cicdDeploy(
  factory: TestingAppFactory,
  buildNumber: number
) {
  console.log(`Deploying build ${buildNumber}...`)

  const { result } = await factory.deploy({
    deployTimeParams: {
      VALUE: buildNumber,
    },
    onUpdate: 'update', // Idempotent - safe to run multiple times
    updatable: true,
  })

  if (result.operationPerformed === 'nothing') {
    console.log('✓ Already deployed - no changes needed')
    return 'skipped'
  }

  if (result.operationPerformed === 'update') {
    console.log(`✓ Updated app ${result.appId} at round ${result.updatedRound}`)
    return 'updated'
  }

  if (result.operationPerformed === 'create') {
    console.log(`✓ Created app ${result.appId} at round ${result.createdRound}`)
    return 'created'
  }
}
```

### 2. Environment-Specific Deployments

```typescript
async function deployToEnvironment(
  factory: TestingAppFactory,
  env: 'dev' | 'staging' | 'production'
) {
  const envValues = {
    dev: 10,
    staging: 50,
    production: 100,
  }

  const { result } = await factory.deploy({
    deployTimeParams: {
      VALUE: envValues[env],
    },
    onUpdate: 'update',
    updatable: env !== 'production', // Production is immutable
    deletable: env === 'dev', // Only dev can be deleted
  })

  console.log(`${env.toUpperCase()} deployment:`)
  console.log(`  App ID: ${result.appId}`)
  console.log(`  Operation: ${result.operationPerformed}`)
  console.log(`  Updatable: ${env !== 'production'}`)

  return result
}

// Deploy to each environment
await deployToEnvironment(factory, 'dev')
await deployToEnvironment(factory, 'staging')
await deployToEnvironment(factory, 'production')
```

### 3. Feature Rollout with Bytecode Changes

```typescript
async function rolloutFeature(
  factory: TestingAppFactory,
  featureEnabled: boolean
) {
  const { result } = await factory.deploy({
    deployTimeParams: {
      VALUE: featureEnabled ? 1 : 0,
    },
    onUpdate: 'update',
  })

  if (result.operationPerformed === 'update') {
    console.log(`✓ Feature ${featureEnabled ? 'enabled' : 'disabled'}`)
    console.log(`  Updated at round: ${result.updatedRound}`)
  } else if (result.operationPerformed === 'nothing') {
    console.log(`ℹ️  Feature already ${featureEnabled ? 'enabled' : 'disabled'}`)
  }

  return result
}

// Enable feature
await rolloutFeature(factory, true)

// Later: disable feature
await rolloutFeature(factory, false)
```

### 4. Audit Trail with Round Tracking

```typescript
interface DeploymentRecord {
  appId: bigint
  version: number
  operation: string
  createdRound?: bigint
  updatedRound?: bigint
  timestamp: number
}

async function deployWithAudit(
  factory: TestingAppFactory,
  version: number
): Promise<DeploymentRecord> {
  const { result } = await factory.deploy({
    deployTimeParams: { VALUE: version },
    onUpdate: 'update',
    updatable: true,
  })

  const record: DeploymentRecord = {
    appId: result.appId,
    version,
    operation: result.operationPerformed,
    timestamp: Date.now(),
  }

  if (result.operationPerformed === 'create') {
    record.createdRound = result.createdRound
  } else if (result.operationPerformed === 'update') {
    record.createdRound = result.createdRound
    record.updatedRound = result.updatedRound
  }

  console.log('Deployment Record:', JSON.stringify(record, null, 2))

  return record
}

// Track deployments
const deployments = []
deployments.push(await deployWithAudit(factory, 1))
deployments.push(await deployWithAudit(factory, 2))
deployments.push(await deployWithAudit(factory, 3))

// View audit trail
console.log('\nAudit Trail:')
deployments.forEach(d => {
  console.log(`v${d.version}: ${d.operation} at round ${d.updatedRound || d.createdRound}`)
})
```

### 5. Progressive Deployment

```typescript
async function progressiveDeploy(factory: TestingAppFactory) {
  console.log('Starting progressive deployment...\n')

  // Phase 1: Initial deployment
  console.log('Phase 1: Initial deployment (VALUE=10)')
  const { result: phase1 } = await factory.deploy({
    deployTimeParams: { VALUE: 10 },
    updatable: true,
  })
  console.log(`  Operation: ${phase1.operationPerformed}`)
  console.log(`  App ID: ${phase1.appId}\n`)

  // Phase 2: First update
  console.log('Phase 2: First update (VALUE=20)')
  const { result: phase2 } = await factory.deploy({
    deployTimeParams: { VALUE: 20 },
    onUpdate: 'update',
  })
  console.log(`  Operation: ${phase2.operationPerformed}`)
  console.log(`  Updated at round: ${phase2.updatedRound}\n`)

  // Phase 3: Second update
  console.log('Phase 3: Second update (VALUE=30)')
  const { result: phase3 } = await factory.deploy({
    deployTimeParams: { VALUE: 30 },
    onUpdate: 'update',
  })
  console.log(`  Operation: ${phase3.operationPerformed}`)
  console.log(`  Updated at round: ${phase3.updatedRound}\n`)

  console.log('Progressive deployment complete!')
  console.log(`  App ID (consistent): ${phase1.appId}`)
  console.log(`  Created at round: ${phase1.createdRound}`)
  console.log(`  Final update at round: ${phase3.updatedRound}`)
}
```

## Understanding OnUpdate Options

The `onUpdate` parameter controls what happens when an existing app is found:

### `onUpdate: 'update'`

Updates the existing app with new code:
```typescript
await factory.deploy({
  onUpdate: 'update', // Default behavior
})
// If app exists and code changed: updates the app
// If app exists and code unchanged: does nothing
// If app doesn't exist: creates new app
```

### `onUpdate: 'replace'`

Deletes the old app and creates a new one:
```typescript
await factory.deploy({
  onUpdate: 'replace',
})
// If app exists: deletes it and creates new app
// If app doesn't exist: creates new app
// ⚠️  WARNING: Loses all state and app ID changes!
```

### `onUpdate: 'fail'`

Throws an error if app exists and code changed:
```typescript
await factory.deploy({
  onUpdate: 'fail',
})
// If app exists and code changed: throws error
// If app exists and code unchanged: does nothing
// If app doesn't exist: creates new app
```

### `onUpdate: 'append'`

Only for state schema changes (not code updates):
```typescript
await factory.deploy({
  onUpdate: 'append',
})
// Only allows schema expansion, not code changes
```

## Error Handling

### Common Update Errors

```typescript
async function safeUpdate(
  factory: TestingAppFactory,
  newValue: number
) {
  try {
    const { result } = await factory.deploy({
      deployTimeParams: { VALUE: newValue },
      onUpdate: 'update',
    })

    return result
  } catch (error) {
    const errorMsg = error.message

    if (errorMsg.includes('not updatable')) {
      console.error('✗ App was deployed with updatable=false')
      throw new Error('Cannot update immutable application')
    }

    if (errorMsg.includes('unauthorized')) {
      console.error('✗ Only the creator can update this app')
      throw new Error('Update requires creator signature')
    }

    if (errorMsg.includes('global state schema exceeds')) {
      console.error('✗ Update requires more storage than allocated')
      throw new Error('State schema expansion not allowed')
    }

    throw error
  }
}
```

### Verifying Update Success

```typescript
async function verifiedUpdate(
  factory: TestingAppFactory,
  expectedOperation: 'create' | 'update' | 'nothing'
) {
  const { result } = await factory.deploy({
    deployTimeParams: { VALUE: Date.now() },
    onUpdate: 'update',
  })

  if (result.operationPerformed !== expectedOperation) {
    throw new Error(
      `Expected ${expectedOperation} but got ${result.operationPerformed}`
    )
  }

  console.log(`✓ Verified: ${expectedOperation} operation performed`)
  return result
}

// Example usage
await verifiedUpdate(factory, 'create')  // First deployment
await verifiedUpdate(factory, 'update')  // Subsequent update
```

## Running This Example

```bash
# Ensure LocalNet is running
algokit localnet start

# Install and run
npm install
npm start
```

**Expected Output**:
```
Step 1: Deploy initial application with VALUE=42
✓ App created with ID: 1202
  App address: KTQP...CM6S75BX4
  Operation performed: create
  Created at round: 199

Step 2: Update the application with VALUE=100
  (Changing deploy-time parameter updates the bytecode)

✓ Update completed!
  Operation performed: update
  App ID (preserved): 1202
  App address (preserved): KTQP...CM6S75BX4
  Created at round: 199
  Updated at round: 216

✅ Application successfully updated!
   ✓ App ID preserved: true
   ✓ Created round: 199
   ✓ Updated round: 216
   ✓ Rounds are different: true
```

## Related Concepts

- **App Factory Pattern**: Using typed factories for deployment
- **Update with ABI Methods**: [77-update-application-using-abi-method](../77-update-application-using-abi-method)
- **Compiled Approval Access**: [78-update-application-using-abi-method](../78-update-application-using-abi-method)
- **TEAL Templates**: Deploy-time parameter substitution
- **ARC-56 Specifications**: Contract interface definitions
- **Replace Application**: [66-replace-an-existing-application](../66-replace-an-existing-application)

## Learn More

- [Algorand Application Update](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#update-smart-contract)
- [AlgoKit Utils App Deployment](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/docs/capabilities/app-deploy.md)
- [ARC-56 Application Specification](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0056.md)
