# Update Application Using ABI Method

This example demonstrates how to update a smart contract application using an ABI method with custom migration logic, and how to access the newly compiled approval program after the update.

## Overview

When updating Algorand smart contracts, calling an ABI method during the update transaction enables sophisticated migration workflows. This example shows how to:
- Deploy an application with deploy-time parameters
- Update the application using a custom ABI method
- Access the compiled approval program after update
- Verify the update was successful

## Key Concepts

### ABI Update Methods

An ABI update method is executed as part of the `UpdateApplication` transaction. These methods can:
- Validate upgrade conditions before applying the update
- Perform data migrations between schema versions
- Return confirmation messages or migration status
- Access and modify application state during the update

### Deploy-Time Parameters

TEAL templates use placeholders like `TMPL_VALUE` that are replaced at deployment time. When updating:
- Must provide deploy-time parameters on each deployment
- Changing parameter values changes the bytecode
- Changed bytecode triggers update detection in idempotent deployments

### Compiled Approval Program

After an update, AlgoKit Utils provides access to the `compiledApproval` property:
- Contains the newly compiled TEAL approval program
- Useful for verification and auditing
- Confirms the bytecode was successfully updated

## Code Examples

### Example 1: Basic Update with ABI Method

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './client'

const algorand = AlgorandClient.defaultLocalNet()
const deployer = await algorand.account.localNetDispenser()

// Get app factory instance
const factory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: deployer.addr,
})

// Deploy initial version
const { result: createdApp, appClient } = await factory.deploy({
  createParams: {
    method: 'create_abi',
    args: { input: 'Initial deployment v1.0' },
  },
  deployTimeParams: {
    VALUE: 42,
  },
  updatable: true,
  deletable: true,
})

console.log(`App created with ID: ${createdApp.appId}`)

// Update using ABI method
const { result: updateResult } = await factory.deploy({
  onUpdate: 'update',
  updateParams: {
    method: 'update_abi',
    args: { input: 'Migrating to v2.0' },
  },
  deployTimeParams: {
    VALUE: 100, // Changed to trigger update
  },
})

console.log(`Update returned: "${updateResult.return}"`)
console.log(`Compiled: ${updateResult.compiledApproval ? 'Yes' : 'No'}`)
```

### Example 2: Verifying Compiled Approval Program

```typescript
// Perform update and access compiled bytecode
const { result } = await factory.deploy({
  onUpdate: 'update',
  updateParams: {
    method: 'update_abi',
    args: { input: 'Schema v3 migration' },
  },
  deployTimeParams: { VALUE: 200 },
})

// Access the compiled approval program
if (result.compiledApproval) {
  console.log('Approval program details:')
  console.log(`  Hash: ${result.compiledApproval.compiledHash}`)
  console.log(`  Base64: ${result.compiledApproval.compiledBase64ToBytes}`)
  
  // You can use this for verification or auditing
  const approvalHash = result.compiledApproval.compiledHash
  console.log(`✓ Update verified with hash: ${approvalHash}`)
}
```

### Example 3: Conditional Update Based on Return Value

```typescript
async function safeUpdate(
  factory: TestingAppFactory,
  migrationData: string
) {
  const { result } = await factory.deploy({
    onUpdate: 'update',
    updateParams: {
      method: 'update_abi',
      args: { input: migrationData },
    },
    deployTimeParams: { VALUE: Date.now() },
  })

  // Check if update was successful based on return value
  if (result.return === migrationData) {
    console.log('✓ Update successful, migration data confirmed')
    return result
  } else {
    throw new Error(`Update failed: expected "${migrationData}" but got "${result.return}"`)
  }
}
```

### Example 4: Accessing Operation Details

```typescript
const { result } = await factory.deploy({
  onUpdate: 'update',
  updateParams: {
    method: 'update_abi',
    args: { input: 'Production deployment v5.0' },
  },
  deployTimeParams: { VALUE: 500 },
})

// Access detailed operation information
console.log('Update Details:')
console.log(`  Operation: ${result.operationPerformed}`) // 'update'
console.log(`  App ID: ${result.appId}`)
console.log(`  App Address: ${result.appAddress}`)
console.log(`  Return Value: ${result.return}`)
console.log(`  Transaction ID: ${result.transaction?.txID()}`)
console.log(`  Compiled: ${result.compiledApproval ? 'Yes' : 'No'}`)
```

## Best Practices

### 1. Always Verify Compiled Approval

**Good** - Check compilation status:
```typescript
const { result } = await factory.deploy({
  onUpdate: 'update',
  updateParams: { method: 'update_abi', args: { input: 'v2' } },
  deployTimeParams: { VALUE: 100 },
})

if (!result.compiledApproval) {
  throw new Error('Update failed: approval program not compiled')
}

console.log('✓ Approval program successfully compiled')
```

**Avoid** - Assuming update succeeded:
```typescript
// BAD: No verification
const { result } = await factory.deploy({ ... })
// Update might have failed!
```

### 2. Use Meaningful Return Values

In your smart contract, return actionable information:

```python
@app.update(allow_actions=['UpdateApplication'])
def update_abi(self, input: String) -> String:
    # Perform migration
    if self.schema_version < 2:
        migrate_to_v2()
        self.schema_version = UInt64(2)
        return String("migrated_v1_to_v2")
    
    return String("already_v2")
```

```typescript
const { result } = await factory.deploy({
  onUpdate: 'update',
  updateParams: { method: 'update_abi', args: { input: 'migrate' } },
})

if (result.return === 'migrated_v1_to_v2') {
  console.log('✓ Successfully migrated from v1 to v2')
} else if (result.return === 'already_v2') {
  console.log('ℹ️  Already on v2, no migration needed')
}
```

### 3. Keep Deploy-Time Parameters Consistent

```typescript
// Store parameters in a configuration object
const deployConfig = {
  VALUE: 42,
  MAX_USERS: 1000,
  FEATURE_FLAG: 1,
}

// Initial deployment
await factory.deploy({
  createParams: { method: 'create_abi', args: { input: 'v1' } },
  deployTimeParams: deployConfig,
  updatable: true,
})

// Update with modified parameters
await factory.deploy({
  onUpdate: 'update',
  updateParams: { method: 'update_abi', args: { input: 'v2' } },
  deployTimeParams: {
    ...deployConfig,
    VALUE: 100, // Only change what's needed
  },
})
```

### 4. Handle Update Errors Gracefully

```typescript
async function robustUpdate(
  factory: TestingAppFactory,
  migrationData: string
) {
  try {
    const { result } = await factory.deploy({
      onUpdate: 'update',
      updateParams: {
        method: 'update_abi',
        args: { input: migrationData },
      },
      deployTimeParams: { VALUE: Date.now() },
    })

    // Verify update
    if (!result.compiledApproval) {
      throw new Error('Approval program not compiled')
    }

    if (result.operationPerformed !== 'update') {
      console.warn(`⚠️  No update performed: ${result.operationPerformed}`)
    }

    return result
  } catch (error) {
    console.error('Update failed:', error.message)
    
    // Implement rollback or recovery strategy
    throw error
  }
}
```

## Common Use Cases

### 1. Version Migration with Verification

```typescript
async function migrateToVersion(
  factory: TestingAppFactory,
  targetVersion: number
) {
  console.log(`Migrating to version ${targetVersion}...`)

  const { result } = await factory.deploy({
    onUpdate: 'update',
    updateParams: {
      method: 'update_abi',
      args: { input: `migrate_to_v${targetVersion}` },
    },
    deployTimeParams: {
      VALUE: targetVersion * 100,
    },
  })

  // Verify compilation
  if (!result.compiledApproval) {
    throw new Error('Migration failed: program not compiled')
  }

  // Verify return value
  const expected = `migrated_to_v${targetVersion}`
  if (result.return !== expected) {
    throw new Error(`Migration returned unexpected value: ${result.return}`)
  }

  console.log(`✓ Successfully migrated to version ${targetVersion}`)
  console.log(`  Approval hash: ${result.compiledApproval.compiledHash}`)

  return result
}
```

### 2. Progressive Rollout with Approval Tracking

```typescript
async function progressiveRollout(factory: TestingAppFactory) {
  const versions = [
    { version: '2.0-alpha', value: 200 },
    { version: '2.0-beta', value: 210 },
    { version: '2.0-stable', value: 220 },
  ]

  const deployments = []

  for (const { version, value } of versions) {
    console.log(`Deploying ${version}...`)

    const { result } = await factory.deploy({
      onUpdate: 'update',
      updateParams: {
        method: 'update_abi',
        args: { input: version },
      },
      deployTimeParams: { VALUE: value },
    })

    deployments.push({
      version,
      appId: result.appId,
      hash: result.compiledApproval?.compiledHash,
      timestamp: Date.now(),
    })

    console.log(`✓ ${version} deployed`)
    console.log(`  Hash: ${result.compiledApproval?.compiledHash}`)
  }

  // Log deployment history
  console.log('\nDeployment History:')
  deployments.forEach(d => {
    console.log(`  ${d.version}: ${d.hash}`)
  })

  return deployments
}
```

### 3. Feature Flag Deployment

```typescript
async function deployFeatureFlag(
  factory: TestingAppFactory,
  featureName: string,
  enabled: boolean
) {
  const value = enabled ? 1 : 0

  const { result } = await factory.deploy({
    onUpdate: 'update',
    updateParams: {
      method: 'update_abi',
      args: { input: `feature_${featureName}_${enabled ? 'on' : 'off'}` },
    },
    deployTimeParams: {
      VALUE: Date.now(), // Force update
      [`FEATURE_${featureName.toUpperCase()}`]: value,
    },
  })

  if (result.compiledApproval) {
    console.log(`✓ Feature "${featureName}" ${enabled ? 'enabled' : 'disabled'}`)
    console.log(`  Compiled hash: ${result.compiledApproval.compiledHash}`)
  }

  return result
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
Creating an updatable application...
✓ App created with ID: 1202
  App is updatable and can be upgraded with new logic

Updating the app with ABI method...
✓ Update method returned: "Migrating to v2.0"
  New approval program compiled: Yes
  App successfully updated with new logic!

✅ Example completed successfully
   - App was created with deploy-time parameters
   - App was updated using an ABI method
   - Update method returned migration confirmation
```

## Related Concepts

- **App Factory Pattern**: Using typed factories for deployment
- **Idempotent Deployment**: Automatic update detection
- **TEAL Templates**: Deploy-time parameter substitution
- **ARC-56 Specifications**: Contract interface definitions
- **App Updates**: [77-update-application-using-abi-method](../77-update-application-using-abi-method)

## Learn More

- [Algorand Application Update](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#update-smart-contract)
- [AlgoKit Utils App Deployment](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/docs/capabilities/app-deploy.md)
- [ARC-56 Application Specification](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0056.md)
