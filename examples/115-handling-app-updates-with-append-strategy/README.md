# Handling App Updates with Append Strategy

This example demonstrates how to use the 'append' strategy when deploying apps. The append strategy creates a new app instead of updating or replacing the existing one, making it ideal for blue-green deployments and gradual migrations.

## Key Concepts

### Append Strategy

The **append strategy** is a deployment pattern where new app versions are created alongside existing ones rather than updating or replacing them. This provides:

- **Zero-downtime deployments**: Old app continues running while new version is deployed
- **Blue-green deployments**: Multiple versions coexist, allowing traffic routing
- **Gradual migrations**: Users can be migrated incrementally to the new version
- **Quick rollbacks**: Simply switch traffic back to the old app ID
- **A/B testing**: Test new versions in production without affecting existing users

### Two Use Cases for Append

The append strategy can be used in two scenarios:

1. **Schema Breaks** (`onSchemaBreak='append'`): When storage schema or extra pages change
2. **Code Updates** (`onUpdate='append'`): When TEAL code or template values change

Both create a new app, but they're triggered by different types of changes.

## Code Walkthrough

### Setup: Initialize Client and Account

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

async function demonstrateAppendStrategies() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a deployer account
  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (10).algos())
```

This sets up the Algorand client and creates a funded deployer account.

### Example 1: Schema Break with onSchemaBreak='append'

#### Step 1: Deploy Initial App

```typescript
// Define TEAL programs with template variables
const approvalProgram1 = `#pragma version 10
txn ApplicationID
int 0
==
bnz create

// Handle UpdateApplication
txn OnCompletion
int UpdateApplication
==
bnz handle_update

// Handle DeleteApplication
txn OnCompletion
int DeleteApplication
==
bnz handle_delete

int 1
return

handle_update:
int TMPL_UPDATABLE
return

handle_delete:
int TMPL_DELETABLE
return

create:
int 1
return`

const clearProgram = `#pragma version 10
int 1`

const metadata1 = {
  name: 'MyApp',
  version: '1.0',
  updatable: true,
  deletable: true,
}

const deployment1 = {
  sender: deployer.addr,
  metadata: metadata1,
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram1,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,           // 1 global integer slot
      globalByteSlices: 0,
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

const result1 = await algorand.appDeployer.deploy(deployment1)
console.log(`App ID: ${result1.appId}`)
```

**What happens:**
- Creates app "MyApp" version 1.0 with 1 global int slot
- Returns operation: `'create'`
- App is now deployed and operational

#### Step 2: Deploy with Schema Break

```typescript
const deployment2 = {
  sender: deployer.addr,
  metadata: metadata1,              // Same name and version
  onSchemaBreak: 'append' as const, // Key: Use append strategy
  onUpdate: 'update' as const,
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram1,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 2,          // BREAKING CHANGE: Different schema
      globalByteSlices: 1,    // BREAKING CHANGE: Added byte slices
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

const result2 = await algorand.appDeployer.deploy(deployment2)
console.log(`Old app ID: ${result1.appId}`)  // e.g., 1044
console.log(`New app ID: ${result2.appId}`)  // e.g., 1045
```

**What happens:**
1. Deployer detects existing app with ID 1044
2. Detects schema break: globalInts 1 → 2, globalByteSlices 0 → 1
3. `onSchemaBreak='append'` tells it to create a new app
4. Creates new app with ID 1045 (different from 1044)
5. **Both apps now exist and are operational**
6. Returns operation: `'create'`

**Key insight:** The old app (1044) continues running while the new app (1045) is created. This allows for gradual migration of users and data.

### Example 2: Version Update with onUpdate='append'

#### Step 1: Deploy Version 1.0

```typescript
// TEAL with template variable
const approvalProgram2 = `#pragma version 10
txn ApplicationID
int 0
==
bnz create

// Handle UpdateApplication
txn OnCompletion
int UpdateApplication
==
bnz handle_update

// Handle DeleteApplication
txn OnCompletion
int DeleteApplication
==
bnz handle_delete

int TMPL_VALUE
return

handle_update:
int TMPL_UPDATABLE
return

handle_delete:
int TMPL_DELETABLE
return

create:
int TMPL_VALUE
return`

const metadata3 = {
  name: 'MyVersionedApp',
  version: '1.0',
  updatable: true,
  deletable: true,
}

const deployment3 = {
  sender: deployer.addr,
  metadata: metadata3,
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram2,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 0,
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
  deployTimeParams: {
    VALUE: 1,  // Template parameter
  },
}

const result3 = await algorand.appDeployer.deploy(deployment3)
console.log(`Version 1.0 app ID: ${result3.appId}`)
```

**What happens:**
- Creates "MyVersionedApp" version 1.0 with VALUE=1
- Returns operation: `'create'`

#### Step 2: Deploy Version 2.0 with Append

```typescript
const metadata4 = {
  name: 'MyVersionedApp',
  version: '2.0',         // New version
  updatable: true,
  deletable: true,
}

const deployment4 = {
  sender: deployer.addr,
  metadata: metadata4,
  onUpdate: 'append' as const,  // Key: Use append strategy
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram2,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 0,
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
  deployTimeParams: {
    VALUE: 3,  // Different template value
  },
}

const result4 = await algorand.appDeployer.deploy(deployment4)
console.log(`Version 1.0 app ID: ${result3.appId}`)  // e.g., 1046
console.log(`Version 2.0 app ID: ${result4.appId}`)  // e.g., 1047
```

**What happens:**
1. Deployer finds existing app (1046) with version 1.0
2. Detects TEAL update (VALUE: 1 → 3)
3. `onUpdate='append'` tells it to create a new app
4. Creates new app with ID 1047 (different from 1046)
5. **Both versions now exist and are operational**
6. Returns operation: `'create'`

**Key insight:** Version 1.0 (1046) continues running while version 2.0 (1047) is deployed. This enables blue-green deployment patterns.

## Understanding Append vs Other Strategies

### Strategy Comparison

| Strategy | Schema Break | Code Update | Result | Old App |
|----------|-------------|-------------|--------|---------|
| `'fail'` | Throws error | Throws error | Deployment fails | Unchanged |
| `'update'` | Throws error | Updates in place | App updated | Replaced |
| `'append'` | Creates new app | Creates new app | New app created | Remains running |
| `'replace'` | Deletes & creates | Deletes & creates | New app created | Deleted |

### When to Use Each Strategy

#### Use `onSchemaBreak='append'` when:
- You have users with opted-in local state
- You need to migrate data gradually
- You want zero-downtime deployments
- You need to test the new schema in production first

**Example:**
```typescript
const deployment = {
  // ...
  onSchemaBreak: 'append' as const,
}
```

#### Use `onUpdate='append'` when:
- Deploying new code versions
- Testing A/B scenarios
- Performing blue-green deployments
- Need quick rollback capability

**Example:**
```typescript
const deployment = {
  // ...
  onUpdate: 'append' as const,
}
```

#### Use `onSchemaBreak='fail'` when:
- In production, want to be alerted to schema changes
- Need manual review before creating new apps
- Want explicit control over deployments

#### Use `onSchemaBreak='replace'` when:
- In test/dev environments
- No existing state to preserve
- Want automatic cleanup of old apps
- App is marked as deletable

## Blue-Green Deployment Pattern

The append strategy enables classic blue-green deployments:

### 1. Deploy New Version (Green)

```typescript
const deployment = {
  sender: deployer.addr,
  metadata: {
    name: 'MyApp',
    version: '2.0',
    updatable: true,
    deletable: true,
  },
  onUpdate: 'append' as const,  // Creates new app
  createParams: { /* ... */ },
  updateParams: { /* ... */ },
  deleteParams: { /* ... */ },
}

const result = await algorand.appDeployer.deploy(deployment)
// Old app (blue): 1044 - still receiving traffic
// New app (green): 1045 - ready to receive traffic
```

### 2. Route Traffic to New Version

In your application, switch the app ID:

```typescript
// Before: Use old app
const appId = 1044

// After: Switch to new app
const appId = 1045  // Start routing traffic here
```

### 3. Monitor and Verify

Monitor the new app for issues. If problems arise, quickly rollback:

```typescript
// Rollback: Switch back to old app
const appId = 1044  // Instant rollback
```

### 4. Clean Up Old Version

Once confident, optionally delete the old app:

```typescript
await algorand.send.appDelete({
  sender: deployer.addr,
  appId: 1044,  // Delete old app
})
```

## Gradual Migration Strategy

For apps with existing users, use append for gradual migration:

### Step 1: Deploy New App

```typescript
const deployment = {
  sender: deployer.addr,
  metadata: {
    name: 'MyApp',
    version: '2.0',
    updatable: true,
    deletable: true,
  },
  onSchemaBreak: 'append' as const,
  onUpdate: 'update' as const,
  createParams: {
    sender: deployer.addr,
    approvalProgram: newApprovalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 2,  // New schema
      globalByteSlices: 1,
      localInts: 0,
      localByteSlices: 0,
    },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
}

const newApp = await algorand.appDeployer.deploy(deployment)
// Old app: 1044
// New app: 1045
```

### Step 2: Migrate Users Gradually

```typescript
// Route 10% of users to new app
function getAppId(userId: string): bigint {
  const hash = hashUserId(userId)
  if (hash % 10 === 0) {
    return 1045n  // 10% to new app
  }
  return 1044n    // 90% to old app
}

// Later: Route 50% to new app
function getAppId(userId: string): bigint {
  const hash = hashUserId(userId)
  if (hash % 2 === 0) {
    return 1045n  // 50% to new app
  }
  return 1044n    // 50% to old app
}

// Finally: Route 100% to new app
function getAppId(userId: string): bigint {
  return 1045n  // All users to new app
}
```

### Step 3: Clean Up Old App

Once all users are migrated:

```typescript
// Delete old app
await algorand.send.appDelete({
  sender: deployer.addr,
  appId: 1044n,
})
```

## Common Scenarios

### Scenario 1: Adding Features Without Downtime

**Problem**: Need to add a new feature that changes the schema.

**Solution**:
```typescript
// Deploy v1
const v1Result = await algorand.appDeployer.deploy({
  sender: deployer.addr,
  metadata: { name: 'MyApp', version: '1.0', updatable: true, deletable: true },
  createParams: {
    sender: deployer.addr,
    approvalProgram: v1Program,
    clearStateProgram: clearProgram,
    schema: { globalInts: 1, globalByteSlices: 0, localInts: 0, localByteSlices: 0 },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
})

// Deploy v2 with new feature
const v2Result = await algorand.appDeployer.deploy({
  sender: deployer.addr,
  metadata: { name: 'MyApp', version: '2.0', updatable: true, deletable: true },
  onSchemaBreak: 'append' as const,
  onUpdate: 'update' as const,
  createParams: {
    sender: deployer.addr,
    approvalProgram: v2Program,
    clearStateProgram: clearProgram,
    schema: { globalInts: 2, globalByteSlices: 1, localInts: 0, localByteSlices: 0 },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
})

// v1 (1044) and v2 (1045) both running
// Users continue using v1 while v2 is tested
```

### Scenario 2: A/B Testing New Algorithms

**Problem**: Want to test a new algorithm against the current one.

**Solution**:
```typescript
// Deploy variant A
const variantA = await algorand.appDeployer.deploy({
  sender: deployer.addr,
  metadata: { name: 'MyApp', version: '1.0-A', updatable: true, deletable: true },
  createParams: {
    sender: deployer.addr,
    approvalProgram: algorithmAProgram,
    clearStateProgram: clearProgram,
    schema: { globalInts: 1, globalByteSlices: 0, localInts: 0, localByteSlices: 0 },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
  deployTimeParams: { ALGORITHM: 1 },
})

// Deploy variant B
const variantB = await algorand.appDeployer.deploy({
  sender: deployer.addr,
  metadata: { name: 'MyApp', version: '1.0-B', updatable: true, deletable: true },
  onUpdate: 'append' as const,
  createParams: {
    sender: deployer.addr,
    approvalProgram: algorithmBProgram,
    clearStateProgram: clearProgram,
    schema: { globalInts: 1, globalByteSlices: 0, localInts: 0, localByteSlices: 0 },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
  deployTimeParams: { ALGORITHM: 2 },
})

// Split traffic 50/50
function getAppId(userId: string): bigint {
  return hashUserId(userId) % 2 === 0 ? variantA.appId : variantB.appId
}
```

### Scenario 3: Testing in Production

**Problem**: Want to test new version with real data before committing.

**Solution**:
```typescript
// Deploy production v1
const prod = await algorand.appDeployer.deploy({
  sender: deployer.addr,
  metadata: { name: 'ProdApp', version: '1.0', updatable: true, deletable: true },
  createParams: { /* ... */ },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
})

// Deploy test v2 alongside
const test = await algorand.appDeployer.deploy({
  sender: deployer.addr,
  metadata: { name: 'ProdApp', version: '2.0-test', updatable: true, deletable: true },
  onUpdate: 'append' as const,
  createParams: { /* ... new version ... */ },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
})

// Route only test users to v2
function getAppId(userId: string, isTestUser: boolean): bigint {
  return isTestUser ? test.appId : prod.appId
}
```

## Best Practices

### 1. Track App IDs

Keep a record of which app IDs correspond to which versions:

```typescript
const appRegistry = {
  'MyApp': {
    'v1.0': 1044n,
    'v2.0': 1045n,
    'v3.0': 1046n,
  },
}

// Use in application
const currentVersion = 'v2.0'
const appId = appRegistry['MyApp'][currentVersion]
```

### 2. Implement Health Checks

Before routing traffic to a new app, verify it's working:

```typescript
async function healthCheck(appId: bigint): Promise<boolean> {
  try {
    const appInfo = await algorand.app.getById(appId)
    // Verify app is accessible

    // Test a simple call
    const result = await algorand.send.appCall({
      sender: testAccount.addr,
      appId: appId,
      // ... test call parameters
    })

    return true
  } catch (error) {
    console.error(`Health check failed for app ${appId}:`, error)
    return false
  }
}

// Deploy new app
const newApp = await algorand.appDeployer.deploy(deployment)

// Verify before routing traffic
if (await healthCheck(newApp.appId)) {
  console.log('New app is healthy, switching traffic')
  currentAppId = newApp.appId
} else {
  console.log('New app failed health check, keeping old app')
}
```

### 3. Monitor Both Apps

During transition, monitor metrics for both apps:

```typescript
interface AppMetrics {
  appId: bigint
  requestCount: number
  errorRate: number
  avgLatency: number
}

async function compareMetrics(oldAppId: bigint, newAppId: bigint) {
  const oldMetrics = await getMetrics(oldAppId)
  const newMetrics = await getMetrics(newAppId)

  console.log('Old app metrics:', oldMetrics)
  console.log('New app metrics:', newMetrics)

  if (newMetrics.errorRate > oldMetrics.errorRate * 1.5) {
    console.warn('New app has higher error rate, consider rollback')
  }
}
```

### 4. Cleanup Strategy

Define a cleanup strategy for old apps:

```typescript
interface CleanupPolicy {
  keepVersions: number  // How many versions to keep
  minAge: number        // Minimum age in days before deletion
}

async function cleanupOldApps(
  appName: string,
  policy: CleanupPolicy
) {
  const versions = appRegistry[appName]
  const sortedVersions = Object.entries(versions)
    .sort((a, b) => b[0].localeCompare(a[0]))  // Sort by version descending

  // Keep the most recent versions
  const toDelete = sortedVersions.slice(policy.keepVersions)

  for (const [version, appId] of toDelete) {
    const appAge = await getAppAge(appId)
    if (appAge >= policy.minAge) {
      console.log(`Deleting old app ${version} (${appId})`)
      await algorand.send.appDelete({
        sender: deployer.addr,
        appId: appId,
      })
    }
  }
}
```

### 5. Document Version Changes

Maintain a changelog for app versions:

```typescript
const changelog = {
  'v2.0': {
    appId: 1045n,
    changes: [
      'Added new global state variable',
      'Increased schema: globalInts 1 → 2',
      'Updated calculation algorithm',
    ],
    deployedAt: '2024-01-15',
    deployedBy: 'deployer-account-address',
  },
  'v1.0': {
    appId: 1044n,
    changes: ['Initial deployment'],
    deployedAt: '2024-01-01',
    deployedBy: 'deployer-account-address',
  },
}
```

## Common Pitfalls

### 1. Forgetting to Update App ID in Application

**Problem**: Deployed new app but application still uses old app ID.

**Solution**:
```typescript
// ❌ Hardcoded app ID
const appId = 1044n

// ✅ Use configuration/environment variable
const appId = BigInt(process.env.APP_ID || '1044')

// ✅ Use app registry
const appId = appRegistry['MyApp']['v2.0']
```

### 2. Not Handling State Migration

**Problem**: New app has different schema, but data wasn't migrated.

**Solution**:
```typescript
// After deploying new app, migrate state
async function migrateState(oldAppId: bigint, newAppId: bigint) {
  // Read state from old app
  const oldState = await algorand.app.getGlobalState(oldAppId)

  // Transform and write to new app
  await algorand.send.appCall({
    sender: deployer.addr,
    appId: newAppId,
    // ... set state in new app
  })
}
```

### 3. Both Apps Modifying Shared Resources

**Problem**: Old and new apps both try to modify the same box storage or external state.

**Solution**:
```typescript
// Use version-specific box names
const boxName = `state-v${version}`

// Or include app ID in external keys
const externalKey = `${appId}-${dataKey}`
```

### 4. Not Testing Rollback Procedure

**Problem**: Rollback is needed but hasn't been tested.

**Solution**:
```typescript
// Test rollback in staging
async function testRollback() {
  // Deploy new version
  const newApp = await algorand.appDeployer.deploy(newDeployment)

  // Switch to new app
  currentAppId = newApp.appId

  // Verify it works
  await runIntegrationTests(currentAppId)

  // Test rollback
  const oldAppId = 1044n
  currentAppId = oldAppId

  // Verify old app still works
  await runIntegrationTests(currentAppId)

  console.log('✅ Rollback tested successfully')
}
```

### 5. Accumulating Too Many App Instances

**Problem**: Creating many app versions without cleaning up old ones.

**Solution**:
```typescript
// Implement automatic cleanup
async function deployWithCleanup(deployment: any) {
  // Deploy new app
  const result = await algorand.appDeployer.deploy(deployment)

  // Clean up old apps (keep last 3 versions)
  await cleanupOldApps(deployment.metadata.name, {
    keepVersions: 3,
    minAge: 7,  // 7 days
  })

  return result
}
```

## Running the Example

### Prerequisites

1. **Start LocalNet**:
   ```bash
   algokit localnet start
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

### Execute

```bash
npx tsx main.ts
```

### Expected Output

```
=== App Deployment with Append Strategies ===
Using account: <ADDRESS>

Example 1: Schema Break with onSchemaBreak="append"
-----------------------------------------------------

Deploying initial app with schema: globalInts=1, globalByteSlices=0
✅ Created app with ID: 1044
   Operation: create
   Version: 1.0

Deploying with schema break (globalInts=2, globalByteSlices=1)
Using onSchemaBreak="append" strategy
✅ Created NEW app with ID: 1045
   Operation: create
   Old app ID: 1044 (still exists)
   New app ID: 1045
   Both apps are now running simultaneously!

Example 2: Version Update with onUpdate="append"
--------------------------------------------------

Deploying app version 1.0 with VALUE=1
✅ Created app with ID: 1046
   Version: 1.0

Deploying version 2.0 with VALUE=3 and onUpdate="append"
✅ Created NEW app with ID: 1047
   Operation: create
   Version 1.0 app ID: 1046 (still running)
   Version 2.0 app ID: 1047 (newly created)

=== Summary ===
The append strategy allows you to:
  1. Keep old apps running while deploying new versions
  2. Perform gradual migrations by routing traffic between versions
  3. Rollback quickly by switching back to the old app
  4. Test new versions in production without replacing the old version

✨ Example completed successfully!
```

## Key Takeaways

1. **Append creates new apps**: Both `onSchemaBreak='append'` and `onUpdate='append'` create new app instances
2. **Old apps remain**: Original apps continue running and are not modified or deleted
3. **Different app IDs**: Each deployment creates a unique app ID
4. **Zero downtime**: New apps are created while old apps serve traffic
5. **Manual cleanup**: Old apps must be manually deleted when no longer needed
6. **Blue-green pattern**: Perfect for blue-green deployments and gradual migrations
7. **A/B testing**: Enables running multiple versions simultaneously
8. **Quick rollback**: Simply switch back to the old app ID if issues arise

## Related Examples

- [114-handle-schema-breaking-changes-with-extra-pages](../114-handle-schema-breaking-changes-with-extra-pages) - Schema break detection and handling
- [111-fail-fast-strategy-for-schema-breaks](../111-fail-fast-strategy-for-schema-breaks) - Using fail strategy
- [112-handle-errors-when-replacing-permanent-apps](../112-handle-errors-when-replacing-permanent-apps) - Using replace strategy
- [10-appclient-create-and-call](../10-appclient-create-and-call) - Basic app deployment

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [App Deployment Guide](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/docs/capabilities/app-deploy.md)
- [Blue-Green Deployment Pattern](https://martinfowler.com/bliki/BlueGreenDeployment.html)
- [Algorand Smart Contract Guidelines](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/guidelines/)
