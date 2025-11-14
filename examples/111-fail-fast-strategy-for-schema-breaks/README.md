# Fail-Fast Strategy for Schema Breaks

This example demonstrates how to use `onSchemaBreak='fail'` to prevent accidental schema changes during app deployment. This is crucial for production environments where schema changes should be intentional and carefully planned.

## Key Concepts

- **Schema Breaks**: Changes to storage requirements (global/local state) that are incompatible
- **Fail-Fast Strategy**: Stop deployment immediately when schema changes are detected
- **Production Safety**: Prevent destructive changes that could lose user data
- **Explicit Control**: Require intentional action for schema modifications

## What This Example Shows

This example demonstrates a two-phase deployment:

1. **Initial Deployment** - Deploy an app with specific schema (1 globalInt, 1 globalByteSlice)
2. **Attempted Schema Change** - Try to deploy with changed schema (2 globalInts) using `onSchemaBreak='fail'`

When the schema change is detected, AlgoKit Utils:
- Detects the schema break (globalInts: 1 → 2)
- Sees that `onSchemaBreak='fail'` is set
- Throws an error **before** sending any transactions
- Leaves the original app completely unchanged

## What is a Schema Break?

A **schema break** occurs when you try to change the storage schema of an existing app. Algorand apps have fixed storage schemas that cannot be modified after creation:

### Schema Components

- **globalInts**: Number of uint64 values in global state
- **globalByteSlices**: Number of byte array values in global state
- **localInts**: Number of uint64 values in local state (per user)
- **localByteSlices**: Number of byte array values in local state (per user)
- **extraProgramPages**: Number of additional program pages (beyond the first 2KB)

### Types of Schema Breaks

Any change to these values is a breaking change:

```typescript
// ❌ Schema breaks (incompatible changes)
globalInts: 1 → 2    // Increasing
globalInts: 2 → 1    // Decreasing
localByteSlices: 0 → 1  // Adding
extraProgramPages: 0 → 1  // Changing pages
```

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

### 1. Deploy Initial App with Schema

```typescript
const metadata = {
  name: 'MyApp',
  version: '1.0',
  deletable: true,
  updatable: true,
}

const deployment1 = {
  sender: deployer.addr,
  metadata: metadata,
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,           // 1 uint64 in global state
      globalByteSlices: 1,     // 1 byte array in global state
      localInts: 0,            // No local state
      localByteSlices: 0,
    },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
}

const result1 = await algorand.appDeployer.deploy(deployment1)
// App created successfully with schema locked in
```

### 2. Attempt Deployment with Schema Break

```typescript
const deployment2 = {
  sender: deployer.addr,
  metadata: metadata, // Same name - identifies same app
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 2,           // ❌ Changed from 1 to 2!
      globalByteSlices: 1,     // Same as before
      localInts: 0,
      localByteSlices: 0,
    },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
  onSchemaBreak: 'fail' as const, // ⚠️ Fail if schema changes
}

try {
  await algorand.appDeployer.deploy(deployment2)
  console.log('ERROR: Should have failed!')
} catch (error: any) {
  console.log('✅ Deployment blocked!')
  // Error: Schema break detected and onSchemaBreak=Fail, stopping deployment
}
```

### 3. Verify Original App Unchanged

```typescript
const appInfo = await algorand.client.algod
  .getApplicationByID(Number(result1.appId))
  .do()

console.log('Global Ints:', appInfo.params.globalStateSchema?.numUint) // Still 1
console.log('Global ByteSlices:', appInfo.params.globalStateSchema?.numByteSlice) // Still 1
```

## Expected Output

```
Deployer account: 76T77LDN4DIDRPXC6UFTBCFAOSF5RTJDCAVBOGJHVCRMHF7KIVLCRCEXNA

=== Step 1: Deploying Initial App Version ===

App MyApp not found; deploying app with version 1.0.
App created with ID 1013
✅ App deployed successfully
   App ID: 1013n
   Schema: globalInts=1, globalByteSlices=1
   Version: 1.0

=== Step 2: Attempting Deployment with Schema Break ===

New schema: globalInts=2, globalByteSlices=1 (breaking change!)
Strategy: onSchemaBreak="fail"

Existing app MyApp found with app id 1013 and version 1.0.
Detected a breaking app schema change in app 1013:
  from: { globalInts: 1, globalByteSlices: 1, ... }
  to:   { globalInts: 2, globalByteSlices: 1, ... }

✅ Deployment failed as expected!

=== Error Details ===
Schema break detected and onSchemaBreak=Fail, stopping deployment.
If you want to try deleting and recreating the app then re-run with onSchemaBreak=ReplaceApp

=== What Happened ===
1. Deployer detected the schema change (globalInts: 1 → 2)
2. onSchemaBreak was set to "fail"
3. Deployment was stopped immediately before any changes
4. Original app remains unchanged

=== Verification ===

✅ Original app is unchanged
   App ID: 1013n
   Global State Schema:
     - Ints: 1
     - ByteSlices: 1
```

## Understanding onSchemaBreak Strategies

The `onSchemaBreak` parameter controls what happens when a schema change is detected:

### onSchemaBreak='fail' (This Example)

```typescript
{
  onSchemaBreak: 'fail'
}
```

**Behavior**:
- Throws an error immediately
- No transactions are sent to the network
- Original app remains unchanged
- Deployment stops completely

**Use When**:
- Production deployments
- Schema changes require manual approval
- You want to prevent accidental schema modifications
- CI/CD pipelines should halt on unexpected changes

**Advantages**:
- ✅ Safest option
- ✅ No risk of data loss
- ✅ Forces explicit decision-making
- ✅ Clear error messages

**Disadvantages**:
- ❌ Requires manual intervention
- ❌ Cannot automatically handle schema evolution

### onSchemaBreak='replace'

```typescript
{
  onSchemaBreak: 'replace'
}
```

**Behavior**:
- Deletes the old app
- Creates a new app with the new schema
- Results in a new app ID
- **All stored data is lost**

**Use When**:
- Development environments
- App ID can change
- Data loss is acceptable
- Starting fresh is desired

**Advantages**:
- ✅ Allows schema changes
- ✅ Automatic handling
- ✅ Clean slate

**Disadvantages**:
- ❌ **Data loss** - all global and local state deleted
- ❌ New app ID - need to update references
- ❌ Requires `deletable: true` in original deployment

### onSchemaBreak='append'

```typescript
{
  onSchemaBreak: 'append'
}
```

**Behavior**:
- Creates a new app instance with new schema
- Leaves the existing app unchanged
- Results in multiple apps with same name

**Use When**:
- Blue-green deployments
- Running multiple versions
- Gradual migration needed
- Testing new schema in production

**Advantages**:
- ✅ No data loss
- ✅ Both apps continue running
- ✅ Allows gradual migration

**Disadvantages**:
- ❌ Multiple apps to manage
- ❌ Need to handle app selection
- ❌ Resource consumption

## Production Use Cases

### 1. CI/CD Pipeline with Schema Protection

```typescript
// deploy.ts - Production deployment script
async function deployToProduction(appCode: string, schema: Schema) {
  const deployment = {
    sender: productionAccount.addr,
    metadata: {
      name: 'MyApp',
      version: process.env.VERSION,
      updatable: false,
      deletable: false,
    },
    createParams: {
      sender: productionAccount.addr,
      approvalProgram: appCode,
      clearStateProgram: clearCode,
      schema: schema,
    },
    updateParams: { sender: productionAccount.addr },
    deleteParams: { sender: productionAccount.addr },
    onSchemaBreak: 'fail', // ⚠️ Never auto-replace in production
  }

  try {
    const result = await algorand.appDeployer.deploy(deployment)
    console.log('✅ Deployed:', result.appId)
  } catch (error: any) {
    if (error.message.includes('Schema break')) {
      console.error('❌ Schema change detected!')
      console.error('   This requires manual review and approval.')
      console.error('   Please:')
      console.error('   1. Review the schema changes')
      console.error('   2. Plan data migration if needed')
      console.error('   3. Use explicit replace script if intentional')
      process.exit(1)
    }
    throw error
  }
}
```

### 2. Pre-Deployment Validation

```typescript
// Validate schema before attempting deployment
async function validateSchemaChange(
  newSchema: Schema,
  appId: bigint
): Promise<SchemaValidationResult> {
  // Get current app info
  const appInfo = await algorand.client.algod
    .getApplicationByID(Number(appId))
    .do()

  const currentSchema = {
    globalInts: appInfo.params.globalStateSchema?.numUint || 0,
    globalByteSlices: appInfo.params.globalStateSchema?.numByteSlice || 0,
    localInts: appInfo.params.localStateSchema?.numUint || 0,
    localByteSlices: appInfo.params.localStateSchema?.numByteSlice || 0,
  }

  // Check for breaking changes
  const hasBreaks =
    newSchema.globalInts !== currentSchema.globalInts ||
    newSchema.globalByteSlices !== currentSchema.globalByteSlices ||
    newSchema.localInts !== currentSchema.localInts ||
    newSchema.localByteSlices !== currentSchema.localByteSlices

  if (hasBreaks) {
    return {
      isValid: false,
      breaks: {
        from: currentSchema,
        to: newSchema,
      },
      recommendation: 'Schema break detected. Review and use explicit replace if intentional.',
    }
  }

  return { isValid: true }
}
```

### 3. Controlled Schema Migration

```typescript
// Explicit schema migration with data backup
async function migrateAppSchema(
  appId: bigint,
  newSchema: Schema,
  newCode: string
) {
  console.log('Starting controlled schema migration...')

  // Step 1: Backup current state
  console.log('1. Backing up current state...')
  const stateBackup = await backupAppState(appId)

  // Step 2: Verify backup
  console.log('2. Verifying backup...')
  await verifyBackup(stateBackup)

  // Step 3: Delete old app
  console.log('3. Deleting old app...')
  const oldAppClient = new AppClient({ algorand, appId, defaultSender })
  await oldAppClient.send.delete.bare({})

  // Step 4: Create new app with new schema
  console.log('4. Creating new app with updated schema...')
  const deployment = {
    sender: deployer.addr,
    metadata: {
      name: 'MyApp',
      version: '2.0', // Increment version
      updatable: false,
      deletable: false,
    },
    createParams: {
      sender: deployer.addr,
      approvalProgram: newCode,
      clearStateProgram: clearCode,
      schema: newSchema,
    },
    updateParams: { sender: deployer.addr },
    deleteParams: { sender: deployer.addr },
  }

  const result = await algorand.appDeployer.deploy(deployment)

  // Step 5: Restore data (if possible)
  console.log('5. Restoring data...')
  await restoreAppState(result.appId, stateBackup)

  console.log('✅ Migration complete!')
  console.log('   Old App ID:', appId)
  console.log('   New App ID:', result.appId)

  return result
}
```

### 4. Multi-Environment Configuration

```typescript
// Different strategies for different environments
function getSchemaBreakStrategy(
  environment: 'local' | 'testnet' | 'mainnet'
): 'fail' | 'replace' | 'append' {
  switch (environment) {
    case 'local':
      return 'replace' // Allow schema changes in local dev
    case 'testnet':
      return 'append' // Create new instances in testnet
    case 'mainnet':
      return 'fail' // Strict safety in production
  }
}

async function deploy(environment: string, appCode: string, schema: Schema) {
  const strategy = getSchemaBreakStrategy(environment as any)

  const deployment = {
    sender: accounts[environment].addr,
    metadata: {
      name: `MyApp-${environment}`,
      version: '1.0',
      updatable: environment !== 'mainnet',
      deletable: environment !== 'mainnet',
    },
    createParams: {
      sender: accounts[environment].addr,
      approvalProgram: appCode,
      clearStateProgram: clearCode,
      schema: schema,
    },
    updateParams: { sender: accounts[environment].addr },
    deleteParams: { sender: accounts[environment].addr },
    onSchemaBreak: strategy,
  }

  return await algorand.appDeployer.deploy(deployment)
}
```

## Best Practices

### 1. Plan Schema from the Start

```typescript
// ✅ Good: Plan schema carefully
interface AppState {
  totalSupply: bigint // uint64 - 1 globalInt
  assetId: bigint // uint64 - needs another globalInt
  paused: boolean // Can be stored in a uint64 - 1 more globalInt
  metadata: string // byte[] - 1 globalByteSlice
}

const schema = {
  globalInts: 3, // Plan for all uint64 fields
  globalByteSlices: 1, // Plan for all byte[] fields
  localInts: 0,
  localByteSlices: 0,
}

// ❌ Bad: Minimal schema that will need changes
const schema = {
  globalInts: 1, // Only planning for current needs
  globalByteSlices: 0,
  localInts: 0,
  localByteSlices: 0,
}
```

### 2. Over-Allocate for Future Needs

```typescript
// ✅ Good: Leave room for growth
const schema = {
  globalInts: 5, // Using 3, but planning for 5
  globalByteSlices: 2, // Using 1, but planning for 2
  localInts: 0,
  localByteSlices: 0,
}

// This allows adding fields later without schema breaks
// Trade-off: Slightly higher minimum balance requirement
```

### 3. Use onSchemaBreak='fail' in Production

```typescript
// ✅ Good: Explicit safety in production
const isProduction = process.env.NODE_ENV === 'production'

const deployment = {
  // ...
  onSchemaBreak: isProduction ? 'fail' : 'replace',
}

// ❌ Bad: Same strategy everywhere
const deployment = {
  // ...
  onSchemaBreak: 'replace', // Dangerous in production!
}
```

### 4. Document Schema Decisions

```typescript
/**
 * App Schema Design
 *
 * Global State:
 * - globalInts: 4
 *   [0] totalSupply: Total token supply
 *   [1] circulatingSupply: Currently circulating
 *   [2] lastUpdateTime: Last state update timestamp
 *   [3] reserved: Reserved for future use
 *
 * - globalByteSlices: 2
 *   [0] adminAddress: Admin account address
 *   [1] reserved: Reserved for future use
 *
 * Local State: None (stateless tokens)
 *
 * Extra Pages: 0 (2KB sufficient)
 */
const schema = {
  globalInts: 4,
  globalByteSlices: 2,
  localInts: 0,
  localByteSlices: 0,
}
```

## Common Pitfalls

### 1. Not Planning for Schema Growth

```typescript
// ❌ Bad: Minimal schema
const schema = {
  globalInts: 1, // Only what I need now
  globalByteSlices: 0,
  localInts: 0,
  localByteSlices: 0,
}
// Later: Need to add a field → schema break!

// ✅ Good: Room for growth
const schema = {
  globalInts: 4, // Current + future needs
  globalByteSlices: 2,
  localInts: 0,
  localByteSlices: 0,
}
```

### 2. Using 'replace' in Production

```typescript
// ❌ Bad: Auto-replace in production
const deployment = {
  // ...
  onSchemaBreak: 'replace', // Data loss in production!
}

// ✅ Good: Fail-fast in production
const deployment = {
  // ...
  onSchemaBreak: 'fail', // Manual review required
}
```

### 3. Not Handling Errors

```typescript
// ❌ Bad: Let it crash
await algorand.appDeployer.deploy(deployment)

// ✅ Good: Handle schema break errors
try {
  await algorand.appDeployer.deploy(deployment)
} catch (error: any) {
  if (error.message.includes('Schema break')) {
    console.log('Schema change detected - manual review required')
    // Log details, notify team, etc.
  }
  throw error
}
```

### 4. Forgetting Minimum Balance Impact

```typescript
// More schema = higher minimum balance requirement
// Each globalInt: ~28,500 microAlgos
// Each globalByteSlice: ~50,000 microAlgos

// ❌ Bad: Excessive over-allocation
const schema = {
  globalInts: 64, // 64 * 28,500 = ~1.8 Algos!
  globalByteSlices: 16, // 16 * 50,000 = ~0.8 Algos!
  // Total: ~2.6 Algos minimum balance!
  localInts: 0,
  localByteSlices: 0,
}

// ✅ Good: Balanced allocation
const schema = {
  globalInts: 8, // Reasonable headroom
  globalByteSlices: 4, // Balanced
  localInts: 0,
  localByteSlices: 0,
}
```

## Comparison of Strategies

| Strategy | Behavior | Data Loss | App ID | Use Case |
|----------|----------|-----------|--------|----------|
| `fail` | Throws error | None | Same | Production safety |
| `replace` | Delete + Create | **Yes** | New | Development, testing |
| `append` | Create new instance | None | New | Multi-version deployments |

## Learn More

- [Example 110: Fail-Fast Deployment with onUpdate='fail'](../110-fail-fast-deployment-strategy-with-onupdatefail/) - Similar concept for code updates
- [Example 106: Deploy App with Replacement Strategy](../106-deploy-app-with-replacement-strategy/) - Using `onSchemaBreak='replace'`
- [Example 107: Deploy New Algorand Application](../107-deploy-new-algorand-application/) - Basic deployment
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [App Deployment Architecture](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md)
- [Algorand Smart Contract Storage](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#modifying-state-in-smart-contract)
