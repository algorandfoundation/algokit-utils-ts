# Example 117: Idempotent App Deployment

This example demonstrates the idempotent nature of AlgoKit Utils' app deployer. When you deploy an app with identical parameters multiple times, the deployer intelligently detects that nothing has changed and skips unnecessary operations, avoiding blockchain transactions and costs.

## Core Concept

**Idempotency** is a property where an operation can be performed multiple times without changing the result beyond the initial application. In the context of app deployment:

- First deployment with specific parameters → Creates the app
- Second deployment with **identical** parameters → No operation (detects no changes)
- Third deployment with **identical** parameters → No operation (still detects no changes)

This is crucial for:
- **CI/CD pipelines** that may run multiple times
- **Development workflows** with frequent redeployments
- **Infrastructure-as-code** scenarios requiring declarative deployments
- **Deployment automation** without manual intervention

## What This Example Shows

This example demonstrates:

1. **First Deployment**: Creating an app with specific metadata, TEAL programs, and schema
2. **Second Deployment**: Deploying with identical parameters
3. **Idempotency Verification**: Confirming no transaction was created on the second deployment
4. **Cost Analysis**: Showing that balance remains unchanged (no fees on second deployment)
5. **Comparison**: Detailed comparison of both deployment results

## Key Components

### 1. App Metadata

```typescript
const metadata = {
  name: 'IdempotentApp',
  version: '1.0.0',
  deletable: true,
  updatable: true,
}
```

The deployer uses metadata to:
- Identify existing apps by name and creator
- Track versions for update detection
- Determine if updates/deletes are allowed

### 2. Deployment Parameters

```typescript
const deploymentParams = {
  sender: deployer.addr,
  metadata: metadata,
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 1,
      localInts: 0,
      localByteSlices: 0,
    },
  },
  updateParams: {
    sender: deployer.addr,
  },
  deleteParams: {
    sender: deployer.addr,
  },
}
```

### 3. First Deployment

```typescript
const initialDeployment = await algorand.appDeployer.deploy(deploymentParams)

// Result:
// - Operation: 'create'
// - App ID: New app ID
// - Transaction created: Yes
// - Fees charged: Yes
```

### 4. Second Deployment (Identical Parameters)

```typescript
const secondDeployment = await algorand.appDeployer.deploy(deploymentParams)

// Result:
// - Operation: 'nothing'
// - App ID: Same as first deployment
// - Transaction created: No
// - Fees charged: No
```

## Deployment Detection Logic

The app deployer detects existing apps using:

1. **App Name**: From metadata
2. **Creator Address**: From deployment sender
3. **Indexer Query**: Searches for apps created by the sender

If an existing app is found:
- Compare TEAL programs (approval and clear state)
- Compare schema requirements
- Compare version numbers
- Compare metadata

If everything matches → **No operation** (idempotent)
If something differs → **Update or replace** (as configured)

## When Updates Occur

The deployer will create a transaction when:

### 1. TEAL Program Changes

```typescript
// First deployment
approvalProgram: `#pragma version 10
int 1
return`

// Second deployment with different program
approvalProgram: `#pragma version 10
int 2  // Changed!
return`

// Result: Update transaction created
```

### 2. Schema Changes (Within Bounds)

```typescript
// First deployment
schema: {
  globalInts: 1,
  globalByteSlices: 1,
  localInts: 0,
  localByteSlices: 0,
}

// Second deployment with compatible schema change
schema: {
  globalInts: 2,  // Increased (non-breaking if no decrease)
  globalByteSlices: 1,
  localInts: 0,
  localByteSlices: 0,
}

// Result: May update or fail depending on strategy
```

### 3. Version Number Changes

```typescript
// First deployment
metadata: {
  name: 'IdempotentApp',
  version: '1.0.0',
}

// Second deployment with different version
metadata: {
  name: 'IdempotentApp',
  version: '2.0.0',  // Changed!
}

// Result: Update transaction created
```

### 4. Metadata Changes

```typescript
// First deployment
metadata: {
  name: 'IdempotentApp',
  version: '1.0.0',
  updatable: true,
  deletable: true,
}

// Second deployment with different metadata
metadata: {
  name: 'IdempotentApp',
  version: '1.0.0',
  updatable: false,  // Changed!
  deletable: true,
}

// Result: Update transaction may be created
```

## Benefits of Idempotent Deployment

### 1. Safe CI/CD Pipelines

```yaml
# GitHub Actions example
- name: Deploy Algorand App
  run: npx tsx deploy.ts
  # Safe to run multiple times!
  # Won't create duplicate apps or waste fees
```

### 2. No Unnecessary Costs

```
First run:  10.100000 ALGO → 10.099000 ALGO (0.001 ALGO fee)
Second run: 10.099000 ALGO → 10.099000 ALGO (0 ALGO fee)  ✅
Third run:  10.099000 ALGO → 10.099000 ALGO (0 ALGO fee)  ✅
```

### 3. Faster Deployment Cycles

```
First deployment:  ~2-3 seconds (transaction + confirmation)
Second deployment: ~0.5 seconds (detection only, no transaction)  ✅
```

### 4. Declarative Infrastructure

```typescript
// deployment.ts - Run this anytime, as many times as needed
await algorand.appDeployer.deploy({
  metadata: { name: 'MyApp', version: '1.0.0' },
  createParams: { /* ... */ },
})

// The deployer ensures the desired state matches actual state
// No manual "check if exists" logic needed!
```

## Comparison Output

The example includes a detailed comparison:

```
Comparison:
   Same App ID: ✅
   Same App Address: ✅
   Same Version: ✅
   Created Round: ✅ Same
   Updated Round: ✅ Same (no update)
   Operation Performed: ✅ Nothing (optimized!)
   Balance Changed: ✅ No (no fees)
```

## Best Practices

### 1. Use Consistent Metadata

```typescript
// ✅ Good: Consistent metadata across deployments
const metadata = {
  name: 'MyApp',
  version: '1.0.0',
  updatable: true,
  deletable: true,
}
```

### 2. Version Bump for Intentional Updates

```typescript
// When you want to update the app:
const metadata = {
  name: 'MyApp',
  version: '1.1.0',  // Increment version
  updatable: true,
  deletable: true,
}
```

### 3. Use Environment-Specific Names

```typescript
// Development
const metadata = {
  name: 'MyApp-dev',
  version: '1.0.0',
}

// Production
const metadata = {
  name: 'MyApp-prod',
  version: '1.0.0',
}

// Different names = different apps = no conflicts
```

### 4. Leverage in CI/CD

```typescript
// deploy.ts
async function deploy() {
  const algorand = AlgorandClient.defaultLocalNet()

  // This script can run multiple times safely
  const result = await algorand.appDeployer.deploy({
    metadata: { name: 'MyApp', version: process.env.VERSION },
    createParams: { /* ... */ },
  })

  if (result.operationPerformed === 'nothing') {
    console.log('✅ App already up to date')
  } else {
    console.log('✅ App deployed:', result.operationPerformed)
  }
}
```

### 5. Handle Different Environments

```typescript
async function deploy(environment: 'dev' | 'prod') {
  const algorand = environment === 'prod'
    ? AlgorandClient.mainnet()
    : AlgorandClient.testnet()

  const deployer = await algorand.account.fromEnvironment(
    `${environment.toUpperCase()}_DEPLOYER`
  )

  await algorand.appDeployer.deploy({
    sender: deployer.addr,
    metadata: {
      name: `MyApp-${environment}`,
      version: '1.0.0',
    },
    createParams: { /* ... */ },
  })
}
```

## Common Scenarios

### Scenario 1: Accidental Re-run

```typescript
// User accidentally runs deploy script twice
await deployApp()  // Creates app
await deployApp()  // Does nothing (idempotent) ✅

// Without idempotency:
// - Would create duplicate app
// - Waste transaction fees
// - Cause confusion about which app to use
```

### Scenario 2: CI/CD Pipeline Retry

```yaml
# GitHub Actions
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: npm run deploy
        # If this step fails and retries, idempotency ensures
        # we don't create duplicate apps or waste fees
```

### Scenario 3: Team Development

```typescript
// Developer A deploys
await deployApp()  // Creates app with ID 1001

// Developer B (same creator account) deploys same code
await deployApp()  // Uses existing app 1001 (idempotent) ✅

// Without idempotency:
// - Would create app with ID 1002
// - Team would have 2 identical apps
// - Confusion about which one to use
```

### Scenario 4: Deployment Verification

```typescript
// Deploy in CI
await deployApp()

// Later, run verification script
const result = await deployApp()

if (result.operationPerformed === 'nothing') {
  console.log('✅ Deployment verified: No drift detected')
} else {
  console.warn('⚠️  Drift detected: App was modified')
}
```

## Technical Implementation

The app deployer performs these checks:

### 1. Query Existing Apps

```typescript
// Pseudo-code of what happens internally
const existingApps = await indexer.searchForApplications()
  .creator(sender)
  .name(metadata.name)
  .do()
```

### 2. Compare Programs

```typescript
// Compile new programs
const newApprovalCompiled = await algod.compile(approvalProgram).do()
const newClearCompiled = await algod.compile(clearProgram).do()

// Compare with existing
if (existingApp.approvalProgram === newApprovalCompiled.result &&
    existingApp.clearStateProgram === newClearCompiled.result) {
  // Programs match
}
```

### 3. Compare Schema

```typescript
// Compare schema requirements
const schemaMatches =
  existingApp.globalInts === schema.globalInts &&
  existingApp.globalByteSlices === schema.globalByteSlices &&
  existingApp.localInts === schema.localInts &&
  existingApp.localByteSlices === schema.localByteSlices
```

### 4. Compare Metadata

```typescript
// Compare version and other metadata
const metadataMatches =
  existingApp.version === metadata.version &&
  existingApp.updatable === metadata.updatable &&
  existingApp.deletable === metadata.deletable
```

### 5. Decision

```typescript
if (programsMatch && schemaMatches && metadataMatches) {
  return {
    operationPerformed: 'nothing',
    appId: existingApp.id,
    // ... other fields from existing app
  }
} else {
  // Perform update or create new app
}
```

## Troubleshooting

### Issue 1: Expected Update But Got "Nothing"

**Problem**: You changed the code but deployment says "nothing"

**Solution**: Check if you updated the version number

```typescript
// ❌ Version unchanged
metadata: {
  name: 'MyApp',
  version: '1.0.0',  // Same as before
}

// ✅ Version bumped
metadata: {
  name: 'MyApp',
  version: '1.1.0',  // Incremented
}
```

### Issue 2: Multiple Apps with Same Name

**Problem**: Finding multiple apps with the same name

**Solution**: Use unique names per environment

```typescript
// ✅ Environment-specific names
const metadata = {
  name: `MyApp-${process.env.ENVIRONMENT}`,
  version: '1.0.0',
}
```

### Issue 3: Idempotency Not Working Across Accounts

**Problem**: Deploying from different accounts creates new apps

**Explanation**: Idempotency is per creator account

```typescript
// Account A deploys
const deployerA = algorand.account.fromMnemonic('...')
await deploy(deployerA)  // Creates app with creator = A

// Account B deploys same app
const deployerB = algorand.account.fromMnemonic('...')
await deploy(deployerB)  // Creates NEW app with creator = B

// Solution: Use the same deployer account for idempotency
```

## Key Takeaways

1. **Idempotency is automatic**: The app deployer handles it for you
2. **No duplicate apps**: Safe to run deployment scripts multiple times
3. **No wasted fees**: Only creates transactions when changes are detected
4. **Version control**: Use version numbers to trigger intentional updates
5. **Per-creator**: Idempotency is scoped to the creator account
6. **Perfect for CI/CD**: Enables safe, automated deployment pipelines

## Related Examples

- [Example 113: Handle Failed Update of Immutable Application](../113-handle-failed-update-of-immutable-application/README.md) - Understanding immutable apps
- [Example 115: Handling App Updates with Append Strategy](../115-handling-app-updates-with-append-strategy/README.md) - Creating new app instances
- [Example 116: Handling Schema Breaks on Permanent Apps](../116-handling-schema-breaks-on-permanent-apps/README.md) - Dealing with permanent apps

## Running This Example

1. Ensure AlgoKit LocalNet is running:
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

The example will:
1. Create a new app on first deployment (with transaction)
2. Detect no changes on second deployment (no transaction)
3. Display a detailed comparison showing idempotency
4. Confirm balances remained unchanged (no fees on second deployment)

You should see `Operation: nothing` for the second deployment, indicating that idempotency successfully prevented an unnecessary transaction.
