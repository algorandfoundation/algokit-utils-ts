# Update Application Using ABI Method

This example demonstrates how to update an existing Algorand application using a custom ABI method that executes during the update process, allowing for data migrations, validation logic, and state transformations.

## Overview

When updating smart contracts on Algorand, you can call a custom ABI method as part of the update transaction. This method can:
- Perform data migrations between schema versions
- Validate that upgrade conditions are met
- Transform or initialize new state variables
- Return status information about the migration
- Access both old and new application state

## Key Concepts

### Application Updates

Applications on Algorand can be updated if they were deployed with the `updatable` flag set to `true`. An update replaces the approval and clear programs while preserving:
- The application ID
- Global and local state data
- The application's address
- Asset and account opt-ins

### Update ABI Methods

An **update ABI method** is a contract method with the action hint `UpdateApplication`. When deploying updates through AlgoKit Utils, you can:
- Call this method during the update transaction
- Pass arguments to guide the migration
- Receive return values with migration status
- Execute complex migration logic on-chain

### Deploy-Time Parameters

TEAL templates can have placeholders (e.g., `TMPL_VALUE`) that are replaced at deployment time. When updating applications:
- You must provide the same template parameters on each deploy
- Changing template values creates a new bytecode version
- This triggers the update detection in idempotent deployments

## Code Examples

### Example 1: Complete Update Workflow

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './client'

const algorand = AlgorandClient.defaultLocalNet()
const deployer = await algorand.account.localNetDispenser()

// Get app factory instance
const factory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: deployer.addr,
})

// Deploy initial version using create_abi method
const { result: createdApp } = await factory.deploy({
  createParams: {
    method: 'create_abi',
    args: { input: 'Initial deployment v1.0' },
  },
  deployTimeParams: {
    VALUE: 42, // Template parameter
  },
  updatable: true,
  deletable: true,
})

console.log(`App created with ID: ${createdApp.appId}`)
console.log(`Create returned: "${createdApp.return}"`)

// Update app using update_abi method
const { result: updatedApp } = await factory.deploy({
  onUpdate: 'update',
  updateParams: {
    method: 'update_abi',
    args: { input: 'Migrating to v2.0 - schema changes applied' },
  },
  deployTimeParams: {
    VALUE: 100, // Changed value forces update
  },
})

console.log(`Update returned: "${updatedApp.return}"`)
// Output: "Migrating to v2.0 - schema changes applied"
```

### Example 2: Conditional Update Logic

In your Algorand smart contract (Python example):

```python
@app.update(allow_actions=['UpdateApplication'])
def update_abi(self, input: String) -> String:
    # Verify the sender is authorized
    assert Txn.sender == Global.creator_address, "unauthorized"

    # Perform migration logic
    if self.version < 2:
        # Migrate from v1 to v2
        self.new_field = Bytes("")
        self.version = UInt64(2)

    # Return confirmation
    return input
```

### Example 3: Multiple Sequential Updates

```typescript
// Initial deployment
const { result: v1App } = await factory.deploy({
  createParams: {
    method: 'create_abi',
    args: { input: 'Version 1.0' },
  },
  deployTimeParams: { VALUE: 10 },
  updatable: true,
})

// First update: v1 -> v2
const { result: v2App } = await factory.deploy({
  onUpdate: 'update',
  updateParams: {
    method: 'update_abi',
    args: { input: 'Migrating v1 -> v2: add user profiles' },
  },
  deployTimeParams: { VALUE: 20 }, // Triggers update
})

// Second update: v2 -> v3
const { result: v3App } = await factory.deploy({
  onUpdate: 'update',
  updateParams: {
    method: 'update_abi',
    args: { input: 'Migrating v2 -> v3: add analytics' },
  },
  deployTimeParams: { VALUE: 30 }, // Triggers another update
})

console.log(`Version progression:`)
console.log(`  v1: ${v1App.return}`)
console.log(`  v2: ${v2App.return}`)
console.log(`  v3: ${v3App.return}`)
```

### Example 4: Update with State Migration

```typescript
// Update that performs state transformation
const { result } = await factory.deploy({
  onUpdate: 'update',
  updateParams: {
    method: 'migrate_state',
    args: {
      oldSchemaVersion: 1,
      newSchemaVersion: 2,
      migrationData: 'convert_old_format_to_new',
    },
  },
  deployTimeParams: { VALUE: 50 },
})

if (result.return === 'migration_success') {
  console.log('✓ State successfully migrated to new schema')
}
```

## Best Practices

### 1. Always Set `updatable: true` for Upgradeable Apps

**Good** - Apps that need updates:
```typescript
const { result } = await factory.deploy({
  updatable: true, // Allows future updates
  deletable: true,
})
```

**Avoid** - Immutable apps can't be updated:
```typescript
// BAD: Once deployed, this app can NEVER be updated
const { result } = await factory.deploy({
  updatable: false, // Permanent!
})
```

### 2. Validate Update Conditions On-Chain

```python
@app.update(allow_actions=['UpdateApplication'])
def update_abi(self, version_tag: String) -> String:
    # Verify authorization
    assert Txn.sender == Global.creator_address, "unauthorized"

    # Verify upgrade path is valid
    current_version = self.version.value
    assert current_version < 10, "max version reached"

    # Perform migration
    self.version.value = current_version + 1

    return String("updated to ") + version_tag
```

### 3. Use Idempotent Deployments

```typescript
// AlgoKit Utils deployment is idempotent by default
// It only updates if bytecode actually changed

const factory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: deployer.addr,
})

// First call: creates app
await factory.deploy({ updatable: true })

// Second call with same code: does nothing
await factory.deploy({ updatable: true })
// Output: "No detected changes in app, nothing to do."

// Third call with different code: updates app
await factory.deploy({
  updatable: true,
  deployTimeParams: { VALUE: 999 }, // Changed!
})
// Output: "App 1234 updated via transaction ABC..."
```

### 4. Provide Deploy-Time Parameters Consistently

```typescript
// IMPORTANT: Must provide same template params on each deploy

// Initial deployment
await factory.deploy({
  deployTimeParams: {
    VALUE: 42,
    MAX_USERS: 1000,
  },
})

// Update - MUST provide same template params
await factory.deploy({
  onUpdate: 'update',
  updateParams: { method: 'update_abi', args: { input: 'v2' } },
  deployTimeParams: {
    VALUE: 42,      // Same params...
    MAX_USERS: 1000, // ...required here
  },
})
```

### 5. Return Meaningful Status from Update Methods

```python
@app.update(allow_actions=['UpdateApplication'])
def update_abi(self, migration_type: String) -> String:
    if migration_type == String("schema_v2"):
        # Perform v2 migration
        self.new_field = Bytes(b"default")
        return String("migrated_to_schema_v2")

    elif migration_type == String("add_feature_x"):
        # Add feature X
        self.feature_x_enabled = UInt64(1)
        return String("feature_x_enabled")

    return String("unknown_migration")
```

```typescript
// Check the return value
const { result } = await factory.deploy({
  onUpdate: 'update',
  updateParams: {
    method: 'update_abi',
    args: { migration_type: 'schema_v2' },
  },
})

if (result.return === 'migrated_to_schema_v2') {
  console.log('✓ Successfully migrated to schema v2')
} else {
  console.log('⚠️  Unexpected migration result:', result.return)
}
```

## Common Use Cases

### 1. Schema Version Migration

```typescript
async function migrateToSchemaV3(
  factory: TestingAppFactory,
  currentVersion: number
) {
  console.log(`Migrating from schema v${currentVersion} to v3...`)

  const { result } = await factory.deploy({
    onUpdate: 'update',
    updateParams: {
      method: 'migrate_schema',
      args: {
        fromVersion: currentVersion,
        toVersion: 3,
        migrationSteps: JSON.stringify({
          addFields: ['user_tier', 'last_activity'],
          removeFields: ['deprecated_flag'],
          transformData: true,
        }),
      },
    },
    deployTimeParams: { VALUE: 300 },
  })

  console.log(`Migration result: ${result.return}`)
}
```

### 2. Feature Flag Rollout

```typescript
async function enableFeature(
  factory: TestingAppFactory,
  featureName: string
) {
  const { result } = await factory.deploy({
    onUpdate: 'update',
    updateParams: {
      method: 'toggle_feature',
      args: {
        feature: featureName,
        enabled: true,
      },
    },
    deployTimeParams: { VALUE: Math.floor(Date.now() / 1000) }, // Force update
  })

  if (result.return === `${featureName}_enabled`) {
    console.log(`✓ Feature "${featureName}" is now active`)
    return true
  }
  return false
}
```

### 3. Emergency Pause/Unpause

```typescript
async function setPauseState(
  factory: TestingAppFactory,
  paused: boolean
) {
  const action = paused ? 'pause' : 'unpause'

  const { result } = await factory.deploy({
    onUpdate: 'update',
    updateParams: {
      method: 'emergency_control',
      args: { action },
    },
    deployTimeParams: { VALUE: Date.now() }, // Force update
  })

  console.log(`✓ Application ${action}d: ${result.return}`)
}

// Emergency pause
await setPauseState(factory, true)

// Later: unpause
await setPauseState(factory, false)
```

### 4. Multi-Stage Deployment

```typescript
async function deployWithStaging(factory: TestingAppFactory) {
  // Stage 1: Deploy to dev
  console.log('Stage 1: Deploying to development...')
  const { result: dev } = await factory.deploy({
    createParams: { method: 'create_abi', args: { input: 'dev' } },
    updatable: true,
  })

  // Stage 2: Run tests, then promote to staging
  console.log('Stage 2: Promoting to staging...')
  const { result: staging } = await factory.deploy({
    onUpdate: 'update',
    updateParams: {
      method: 'update_abi',
      args: { input: 'staging - validated in dev' },
    },
    deployTimeParams: { VALUE: 200 },
  })

  // Stage 3: Final promotion to production
  console.log('Stage 3: Promoting to production...')
  const { result: prod } = await factory.deploy({
    onUpdate: 'update',
    updateParams: {
      method: 'update_abi',
      args: { input: 'production - fully validated' },
    },
    deployTimeParams: { VALUE: 300 },
  })

  console.log('Deployment pipeline complete:')
  console.log(`  Dev:        ${dev.return}`)
  console.log(`  Staging:    ${staging.return}`)
  console.log(`  Production: ${prod.return}`)
}
```

## Understanding Deploy Operations

### Operation Types

When calling `factory.deploy()`, the result includes an `operationPerformed` field:

```typescript
const { result } = await factory.deploy({ ... })

switch (result.operationPerformed) {
  case 'create':
    console.log('Created new app with ID:', result.appId)
    break

  case 'update':
    console.log('Updated existing app:', result.appId)
    console.log('Update method returned:', result.return)
    break

  case 'replace':
    console.log('Replaced app (deleted old, created new)')
    break

  case 'nothing':
    console.log('No changes detected, app unchanged')
    break
}
```

### Update Detection

AlgoKit Utils detects updates by comparing:
1. **Approval program bytecode** - Main application logic
2. **Clear program bytecode** - Opt-out logic
3. **Global/local state schema** - Storage requirements

Changes in any of these trigger an update.

### Forcing Updates

To force an update even with unchanged logic:

```typescript
// Method 1: Change a deploy-time parameter
await factory.deploy({
  deployTimeParams: {
    VALUE: Date.now(), // Always different
  },
})

// Method 2: Use onUpdate: 'replace'
await factory.deploy({
  onUpdate: 'replace', // Deletes and recreates
})
```

## Error Handling

### Common Update Errors

```typescript
async function safeUpdate(factory: TestingAppFactory, migrationData: string) {
  try {
    const { result } = await factory.deploy({
      onUpdate: 'update',
      updateParams: {
        method: 'update_abi',
        args: { input: migrationData },
      },
      deployTimeParams: { VALUE: 100 },
    })

    return result
  } catch (error) {
    const errorMsg = error.message

    if (errorMsg.includes('not updatable')) {
      throw new Error('Application was deployed with updatable=false')
    }

    if (errorMsg.includes('unauthorized')) {
      throw new Error('Only the creator can update this application')
    }

    if (errorMsg.includes('global state schema exceeds')) {
      throw new Error('Update requires more global state than allocated')
    }

    if (errorMsg.includes('logic eval error')) {
      throw new Error('Update method logic failed - check migration code')
    }

    throw error
  }
}
```

### Rollback Strategy

```typescript
// Save current app info before update
const appId = 1234
const oldInfo = await algorand.client.algod.getApplicationByID(appId).do()
const oldApprovalProgram = oldInfo.params['approval-program']

try {
  // Attempt update
  const { result } = await factory.deploy({
    onUpdate: 'update',
    updateParams: { method: 'update_abi', args: { input: 'v2' } },
  })

  console.log('✓ Update successful')
} catch (error) {
  console.error('✗ Update failed:', error.message)

  // Manual rollback (if you saved the old bytecode)
  console.log('Consider rolling back to previous version')
  // Note: Automatic rollback requires you to have saved previous programs
}
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
Deploying initial application version...
✓ App created with ID: 1202
  App address: KTQP...CM6S75BX4
  Create method returned: "Initial deployment v1.0"

Updating application using update_abi method...
✓ Update completed!
  Operation: update
  App ID (preserved): 1202
  Update method returned: "Migrating to v2.0 - schema changes applied"

Updating again with different migration data...
✓ Second update completed!
  Update method returned: "Upgrading to v3.0 - new features added"

✅ Application updated successfully using ABI methods!
```

## Related Concepts

- **App Factory Pattern**: [66-replace-an-existing-application](../66-replace-an-existing-application)
- **Idempotent Deployment**: Automatically detects when updates are needed
- **TEAL Templates**: Deploy-time parameter substitution
- **ARC-56 Specifications**: Contract interface definitions
- **State Management**: [31-global-and-local-state-in-smart-contracts](../31-global-and-local-state-in-smart-contracts)

## Learn More

- [Algorand Application Update](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#update-smart-contract)
- [AlgoKit Utils App Deployment](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/docs/capabilities/app-deploy.md)
- [ARC-56 Application Specification](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0056.md)
