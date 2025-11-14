# Fail-Fast Deployment Strategy with onUpdate='fail'

This example demonstrates how to implement a fail-fast deployment strategy using `onUpdate='fail'`. This pattern is crucial for production environments where you want to prevent accidental app updates.

## Key Concepts

- **Fail-Fast Strategy**: Deployment stops immediately if an existing app is detected
- **Safety First**: No transactions are sent when deployment fails
- **Production Safety**: Prevents accidental overwrites of deployed applications
- **Explicit Updates**: Forces developers to be intentional about app updates

## What This Example Shows

This example demonstrates a two-phase deployment:

1. **Initial Deployment** - Deploy an app for the first time (succeeds)
2. **Attempted Update** - Try to deploy again with `onUpdate='fail'` (fails as expected)

When the second deployment is attempted, AlgoKit Utils:
- Detects an existing app with the same metadata
- Sees that `onUpdate='fail'` is set
- Throws an error **before** sending any transactions
- Provides a clear error message explaining what happened

## Quick Start

### Prerequisites

1. Start AlgoKit LocalNet:
   ```bash
   algokit localnet start
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Run the Example

```bash
npm start
```

## Code Walkthrough

### 1. Define App Metadata

```typescript
const metadata = {
  name: 'MyProductionApp',
  version: '1.0',
  updatable: true,
  deletable: false,
}
```

The metadata is used to identify the app across deployments.

### 2. Initial Deployment (Succeeds)

```typescript
const deployment1 = {
  sender: deployer.addr,
  metadata: metadata,
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram1,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
}

const result1 = await algorand.appDeployer.deploy(deployment1)
// App created successfully!
```

### 3. Second Deployment with onUpdate='fail' (Fails)

```typescript
const deployment2 = {
  sender: deployer.addr,
  metadata: metadata, // Same metadata - identifies same app
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram2, // Different code
    clearStateProgram: clearProgram,
    schema: { /* same schema */ },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
  onUpdate: 'fail' as const, // ⚠️ Fail if update is detected
}

try {
  await algorand.appDeployer.deploy(deployment2)
  console.log('ERROR: Should have failed!')
} catch (error: any) {
  console.log('✅ Deployment failed as expected')
  // Error: Update detected and onUpdate=Fail, stopping deployment.
}
```

## Expected Output

```
Deployer account: EMYJQSMP3KXHQ3DNZO2CEVMOQRYLBL6DLE6HWP7JHLNSZDKRZQEI4XRZ6E

=== Initial App Deployment ===

App MyProductionApp not found; deploying app with version 1.0.
App created by EMYJQSMP3KXHQ3DNZO2CEVMOQRYLBL6DLE6HWP7JHLNSZDKRZQEI4XRZ6E with ID 1009
✅ Initial deployment successful
   Operation: create
   App ID: 1009n
   Version: 1.0

=== Attempting Deployment with onUpdate="fail" ===
This will fail because an app with the same name already exists.

Existing app MyProductionApp found with app id 1009 and version 1.0.
Detected a TEAL update in app 1009
✅ Deployment failed as expected (onUpdate="fail")

=== Error Details ===
Error message: Update detected and onUpdate=Fail, stopping deployment. Try a different onUpdate value to not fail.

This error indicates that:
  • An existing app with the same metadata was found
  • The onUpdate parameter was set to "fail"
  • The deployment was stopped before any transaction was sent
```

## Understanding onUpdate Strategies

The `onUpdate` parameter controls what happens when an existing app is detected:

### onUpdate='fail' (This Example)

```typescript
{
  onUpdate: 'fail'
}
```

**Behavior**:
- Throws an error immediately
- No transactions are sent to the network
- Deployment stops before any changes

**Use When**:
- Production environments
- You want to prevent accidental updates
- Updates require manual approval
- Strict deployment pipelines

### onUpdate='update'

```typescript
{
  onUpdate: 'update'
}
```

**Behavior**:
- Updates the existing app with new TEAL code
- Keeps the same app ID
- Requires `updatable: true` in original deployment

**Use When**:
- Controlled version upgrades
- App ID must remain constant
- Gradual rollouts

### onUpdate='replace'

```typescript
{
  onUpdate: 'replace'
}
```

**Behavior**:
- Deletes the old app
- Creates a new app (new app ID)
- Requires `deletable: true` in original deployment

**Use When**:
- App ID can change
- Breaking changes to storage schema
- Fresh start needed

### onUpdate='append'

```typescript
{
  onUpdate: 'append'
}
```

**Behavior**:
- Creates a new app instance
- Leaves the existing app unchanged
- Results in multiple apps with same name

**Use When**:
- Blue-green deployments
- Running multiple versions simultaneously
- A/B testing different versions

## Production Use Cases

### 1. CI/CD Pipeline Safety

```typescript
// deploy.ts - Production deployment script
async function deployToProduction(appCode: string) {
  const deployment = {
    sender: productionAccount.addr,
    metadata: {
      name: 'MyApp',
      version: process.env.VERSION, // e.g., from git tag
      updatable: false, // Production apps are immutable
      deletable: false,
    },
    createParams: {
      sender: productionAccount.addr,
      approvalProgram: appCode,
      clearStateProgram: clearCode,
      schema: { /* ... */ },
    },
    updateParams: { sender: productionAccount.addr },
    deleteParams: { sender: productionAccount.addr },
    onUpdate: 'fail', // ⚠️ Never auto-update production
  }

  try {
    const result = await algorand.appDeployer.deploy(deployment)
    console.log('✅ App deployed:', result.appId)
  } catch (error: any) {
    if (error.message.includes('onUpdate=Fail')) {
      console.error('❌ App already exists! Manual intervention required.')
      console.error('   To update: change version or use explicit update script')
      process.exit(1)
    }
    throw error
  }
}
```

### 2. Immutable Deployments with Audit Trail

```typescript
// Enforce immutability for compliance
async function deployImmutableApp(config: AppConfig) {
  const metadata = {
    name: config.name,
    version: generateVersionFromGit(), // SHA or semantic version
    updatable: false, // Cannot be updated
    deletable: false, // Cannot be deleted
  }

  const deployment = {
    sender: config.sender,
    metadata,
    createParams: { /* ... */ },
    updateParams: { sender: config.sender },
    deleteParams: { sender: config.sender },
    onUpdate: 'fail', // Enforce one-time deployment
  }

  try {
    const result = await algorand.appDeployer.deploy(deployment)

    // Log to audit trail
    await auditLog.record({
      action: 'APP_DEPLOYED',
      appId: result.appId,
      version: metadata.version,
      timestamp: new Date(),
      deployer: config.sender,
    })

    return result
  } catch (error: any) {
    if (error.message.includes('onUpdate=Fail')) {
      // Attempt to deploy existing app - compliance violation
      await auditLog.record({
        action: 'DEPLOYMENT_BLOCKED',
        reason: 'App already exists - immutability enforced',
        attemptedVersion: metadata.version,
        timestamp: new Date(),
      })
    }
    throw error
  }
}
```

### 3. Staged Deployment with Gating

```typescript
// Require approval to update production
async function stagedDeployment(environment: 'staging' | 'production') {
  const metadata = {
    name: `MyApp-${environment}`,
    version: '1.0',
    updatable: environment === 'staging', // Only staging is updatable
    deletable: false,
  }

  const onUpdate = environment === 'production' ? 'fail' : 'update'

  const deployment = {
    sender: accounts[environment].addr,
    metadata,
    createParams: { /* ... */ },
    updateParams: { sender: accounts[environment].addr },
    deleteParams: { sender: accounts[environment].addr },
    onUpdate, // Production fails, staging updates
  }

  const result = await algorand.appDeployer.deploy(deployment)

  if (environment === 'production' && result.operationPerformed === 'create') {
    console.log('✅ New production app deployed!')
    console.log('   Staging tested version is now live')
    console.log('   App ID:', result.appId)
  }

  return result
}
```

### 4. Deployment Validation Script

```typescript
// Verify deployment configuration before running
async function validateDeployment(config: DeploymentConfig) {
  // Dry-run with onUpdate='fail' to check for conflicts
  const deployment = {
    sender: config.sender,
    metadata: config.metadata,
    createParams: { /* ... */ },
    updateParams: { sender: config.sender },
    deleteParams: { sender: config.sender },
    onUpdate: 'fail',
  }

  try {
    // This will throw if app exists
    await algorand.appDeployer.deploy(deployment)
    console.log('✅ Deployment will create a new app')
    return { isNew: true }
  } catch (error: any) {
    if (error.message.includes('onUpdate=Fail')) {
      console.log('⚠️  App already exists')
      console.log('   Name:', config.metadata.name)
      console.log('   Version:', config.metadata.version)
      console.log('   Action: Deployment will fail unless:')
      console.log('     • Version is changed')
      console.log('     • onUpdate strategy is changed')
      console.log('     • App name is changed')
      return { isNew: false, exists: true }
    }
    throw error
  }
}
```

## Best Practices

### 1. Use Semantic Versioning

```typescript
// ✅ Good: Semantic versioning
const metadata = {
  name: 'MyApp',
  version: '2.1.0', // Major.Minor.Patch
  updatable: false,
  deletable: false,
}
```

### 2. Never Hardcode onUpdate in Production Scripts

```typescript
// ✅ Good: Environment-based configuration
const onUpdate = process.env.ALLOW_UPDATE === 'true' ? 'update' : 'fail'

// ❌ Bad: Hardcoded 'update' in production
const onUpdate = 'update' // Dangerous!
```

### 3. Log All Deployment Attempts

```typescript
// ✅ Good: Comprehensive logging
try {
  const result = await algorand.appDeployer.deploy(deployment)
  logger.info('Deployment succeeded', {
    appId: result.appId,
    operation: result.operationPerformed,
    version: result.version,
  })
} catch (error: any) {
  logger.error('Deployment failed', {
    error: error.message,
    metadata: deployment.metadata,
    onUpdate: deployment.onUpdate,
  })
  throw error
}
```

### 4. Provide Clear Error Messages

```typescript
// ✅ Good: Helpful error context
catch (error: any) {
  if (error.message.includes('onUpdate=Fail')) {
    console.error('\n❌ Deployment Failed: App Already Exists\n')
    console.error('The app has already been deployed with these settings:')
    console.error(`  Name: ${metadata.name}`)
    console.error(`  Version: ${metadata.version}\n`)
    console.error('To deploy anyway, you can:')
    console.error('  1. Change the version number')
    console.error('  2. Use onUpdate="update" (requires updatable=true)')
    console.error('  3. Use onUpdate="replace" (requires deletable=true)')
    console.error('  4. Use onUpdate="append" (creates new instance)\n')
    process.exit(1)
  }
}
```

## Common Pitfalls

### 1. Forgetting to Change Version

```typescript
// ❌ Bad: Same version on every deploy
const metadata = {
  name: 'MyApp',
  version: '1.0', // Always the same!
  updatable: false,
  deletable: false,
}
// This will fail on second deployment with onUpdate='fail'

// ✅ Good: Version from environment/git
const metadata = {
  name: 'MyApp',
  version: process.env.VERSION || generateVersionFromGit(),
  updatable: false,
  deletable: false,
}
```

### 2. Using onUpdate='fail' with updatable=false

```typescript
// This combination means you can NEVER update the app
const metadata = {
  name: 'MyApp',
  version: '1.0',
  updatable: false, // Cannot be updated
  deletable: false, // Cannot be deleted
}

const deployment = {
  // ...
  metadata,
  onUpdate: 'fail', // Prevents automatic updates
}
// Result: App is truly immutable - can never be changed!
```

This is intentional for certain use cases (compliance, immutability requirements) but should be used carefully.

### 3. Not Handling the Error

```typescript
// ❌ Bad: Error crashes the process
await algorand.appDeployer.deploy(deployment)

// ✅ Good: Handle the error gracefully
try {
  await algorand.appDeployer.deploy(deployment)
} catch (error: any) {
  if (error.message.includes('onUpdate=Fail')) {
    // App exists - expected in some scenarios
    console.log('App already deployed')
    return existingAppId
  }
  throw error
}
```

## Comparison with Other Strategies

| Strategy | Behavior | Network Txns | App ID | Use Case |
|----------|----------|--------------|--------|----------|
| `fail` | Throws error | 0 | N/A | Production safety, CI/CD |
| `update` | Updates code | 1 | Same | Controlled upgrades |
| `replace` | Delete + Create | 2 | New | Breaking changes |
| `append` | Creates new | 1 | New | Multi-version deployments |

## Learn More

- [Example 111: Deploy App with Update Strategy](../111-deploy-app-with-update-strategy/) - Using `onUpdate='update'`
- [Example 106: Deploy App with Replacement Strategy](../106-deploy-app-with-replacement-strategy/) - Using `onUpdate='replace'`
- [Example 107: Deploy New Algorand Application](../107-deploy-new-algorand-application/) - Basic deployment
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [App Deployment Architecture Decision](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md)
