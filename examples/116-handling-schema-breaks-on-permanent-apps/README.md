# Handling Schema Breaks on Permanent Apps

This example demonstrates what happens when you attempt to replace a permanent (non-deletable) app with a schema-breaking change, highlighting the critical importance of planning schema design upfront for permanent applications.

## Key Concepts

### Permanent Apps

A **permanent app** is one that cannot be deleted after deployment. This is controlled by:

1. **Metadata Flag**: Setting `deletable: false` in the app metadata
2. **TEAL Template**: The `TMPL_DELETABLE` template variable is set to 0
3. **Logic Enforcement**: The approval program returns 0 (fails) for `DeleteApplication` transactions

Permanent apps provide:
- **Immutability**: Guarantee that the app will always exist on the blockchain
- **Trust**: Users know the app cannot be removed
- **Permanence**: Critical for applications requiring guaranteed availability

### The Problem with Schema Breaks

When a permanent app encounters a schema-breaking change:
- The `replace` strategy requires deleting the old app first
- But permanent apps cannot be deleted (TMPL_DELETABLE=0)
- Therefore, the replacement fails
- **The schema is locked in permanently**

This makes schema design critically important for permanent apps.

## Code Walkthrough

### Setup: Initialize Client and Account

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { LogicError } from '@algorandfoundation/algokit-utils/types/logic-error'

async function main() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a deployer account
  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (10).algos())
```

### Step 1: Deploy a Permanent App

```typescript
// Define TEAL programs with template variables
const approvalProgram = `#pragma version 10
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

const metadata = {
  name: 'PermanentApp',
  version: '1.0',
  deletable: false, // This makes the app permanent
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
}

const result1 = await algorand.appDeployer.deploy(deployment1)
console.log('App ID:', result1.appId)
console.log('Deletable:', result1.deletable) // false
```

**What happens:**
- App is created with `deletable: false`
- AlgoKit Utils automatically sets `TMPL_DELETABLE=0` during compilation
- The approval program will reject any delete attempts
- The app is now **permanent** on the blockchain

### Step 2: Attempt Schema-Breaking Replacement

```typescript
const deployment2 = {
  sender: deployer.addr,
  metadata: {
    ...metadata,
    version: '2.0',
  },
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 2, // Schema break: increased from 1 to 2
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
  onSchemaBreak: 'replace' as const, // Try to replace the app
  onUpdate: 'update' as const,
}

try {
  await algorand.appDeployer.deploy(deployment2)
  console.log('❌ Unexpected: Deployment should have failed!')
} catch (error: any) {
  console.log('✅ Deployment failed as expected!')

  // Parse the logic error for more details
  const logicError = LogicError.parseLogicError(error)
  if (logicError) {
    console.log('Transaction ID:', logicError.txId)
    console.log('Program Counter:', logicError.pc)
    console.log('Message:', logicError.msg)
  }
}
```

**What happens:**
1. Deployer detects existing permanent app
2. Detects schema break: globalInts 1 → 2
3. `onSchemaBreak='replace'` tells it to delete and recreate
4. Attempts to delete the app
5. **Delete transaction is rejected** by the approval program (TMPL_DELETABLE=0)
6. Deployment fails with a logic error
7. Original app remains unchanged

### Step 3: Verify Original App Exists

```typescript
// Verify the original app still exists
const appInfo = await algorand.app.getById(result1.appId)
console.log('Original permanent app still exists')
console.log('App ID:', result1.appId)
console.log('Global Ints:', 1) // Schema unchanged
```

The permanent app remains on the blockchain with its original schema, proving that permanent apps cannot be replaced.

## Understanding Permanent Apps and Schema Breaks

### Why Permanent Apps Cannot Be Replaced

The `replace` strategy requires two steps:

1. **Delete the old app** → ❌ Fails for permanent apps
2. **Create a new app** → Never reached

```typescript
// Replace strategy flow:
onSchemaBreak: 'replace'
↓
Detect schema break
↓
Attempt DELETE transaction
↓
Approval program checks TMPL_DELETABLE (= 0 for permanent apps)
↓
Returns 0 (reject)
↓
Transaction fails
↓
New app is never created
```

### Schema Break Detection

Schema breaks occur when:

```typescript
// Breaking changes
globalInts: 1 → 2        // Adding slots
globalInts: 2 → 1        // Removing slots
globalByteSlices: 0 → 1  // Adding slots
localInts: 0 → 1         // Adding slots
extraProgramPages: 0 → 1 // Adding pages
```

### Permanent vs Deletable Apps

| Aspect | Permanent App | Deletable App |
|--------|--------------|---------------|
| Metadata | `deletable: false` | `deletable: true` |
| TMPL_DELETABLE | 0 | 1 |
| DeleteApplication | Always fails | Can succeed |
| Schema changes | Impossible with replace | Possible with replace |
| Existence | Guaranteed permanent | Can be removed |
| Use cases | DeFi, critical apps | Dev/test, upgradeable apps |

## Alternative Strategies for Permanent Apps

When you need to change the schema of a permanent app, you have these options:

### Option 1: Use Append Strategy

Create a new app alongside the old one:

```typescript
const deployment = {
  sender: deployer.addr,
  metadata: {
    name: 'PermanentApp',
    version: '2.0',
    deletable: false,
    updatable: true,
  },
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 2, // Different schema
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
  onSchemaBreak: 'append' as const, // Create new app instead
  onUpdate: 'update' as const,
}

const result = await algorand.appDeployer.deploy(deployment)
// result.appId will be a NEW app ID (different from original)
// Both apps now exist and are permanent
```

**Pros:**
- Old app continues functioning
- Gradual migration possible
- Users can choose which version to use

**Cons:**
- Must manage multiple app IDs
- Old app remains on blockchain (can't be deleted)
- Users must manually migrate

### Option 2: Deploy with Different Name

Create a completely new app:

```typescript
const newDeployment = {
  sender: deployer.addr,
  metadata: {
    name: 'PermanentAppV2', // Different name
    version: '1.0',
    deletable: false,
    updatable: true,
  },
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 2, // New schema
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
}

const newResult = await algorand.appDeployer.deploy(newDeployment)
// Completely new app with new name
```

**Pros:**
- Clear distinction between versions
- No confusion with old app

**Cons:**
- Old app still exists (permanent)
- Users must update to new app ID
- More apps on blockchain

### Option 3: Plan Schema Upfront (Best Practice)

Reserve extra schema slots from the start:

```typescript
const metadata = {
  name: 'PermanentApp',
  version: '1.0',
  deletable: false,
  updatable: true,
}

const deployment = {
  sender: deployer.addr,
  metadata: metadata,
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 5,        // Reserve extra slots for future use
      globalByteSlices: 3,  // Better than creating new apps later
      localInts: 2,
      localByteSlices: 1,
    },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
}
```

**Pros:**
- Flexibility for future updates
- No need to create new apps
- Code updates work without schema breaks

**Cons:**
- Higher initial minimum balance
- May waste resources if slots unused

## Best Practices

### 1. Plan Schema Carefully for Permanent Apps

**For permanent apps, design your schema with future growth in mind:**

```typescript
// ❌ Don't do this for permanent apps
schema: {
  globalInts: 1,  // Exactly what's needed now
  globalByteSlices: 0,
}

// ✅ Do this for permanent apps
schema: {
  globalInts: 4,        // 1 used, 3 reserved for future
  globalByteSlices: 2,  // 0 used, 2 reserved for future
}
```

Calculate the trade-off:
- **Cost**: Higher minimum balance (more Algos locked)
- **Benefit**: Flexibility for future updates without creating new apps

### 2. Document Schema Usage

```typescript
schema: {
  globalInts: 5,        // 1=counter, 2=timestamp, 3-5=reserved
  globalByteSlices: 3,  // 1=creator, 2=name, 3=reserved
  localInts: 2,         // 1=balance, 2=reserved
  localByteSlices: 1,   // 1=status
}
```

Clear documentation helps future developers understand what's available.

### 3. Test Schema Changes Before Permanent Deployment

```typescript
// First deploy as deletable for testing
const testMetadata = {
  name: 'TestApp',
  version: '1.0',
  deletable: true,  // Allow deletion during testing
  updatable: true,
}

// Test schema changes
const testDeployment2 = {
  sender: deployer.addr,
  metadata: { ...testMetadata, version: '2.0' },
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 2,  // Test the new schema
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
  onSchemaBreak: 'replace' as const,  // Works because deletable=true
  onUpdate: 'update' as const,
}

// Once tested and confirmed, deploy as permanent
const finalMetadata = {
  name: 'ProdApp',
  version: '1.0',
  deletable: false,  // Now make it permanent
  updatable: true,
}
```

### 4. Use Fail Strategy to Detect Schema Issues

```typescript
const deployment = {
  sender: deployer.addr,
  metadata: metadata,
  createParams: { /* ... */ },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
  onSchemaBreak: 'fail' as const,  // Alert on schema breaks
  onUpdate: 'update' as const,
}

try {
  await algorand.appDeployer.deploy(deployment)
} catch (error: any) {
  if (error.message.includes('Schema break detected')) {
    console.warn('Schema break detected for permanent app!')
    console.warn('Manual intervention required - cannot replace')
    // Handle manually: deploy new app with append strategy
  }
}
```

### 5. Implement Migration Strategy

If you must migrate from a permanent app:

```typescript
class PermanentAppMigration {
  async migrate(
    oldAppId: bigint,
    newAppId: bigint,
    users: string[]
  ) {
    console.log('Migrating from permanent app...')

    // 1. Deploy new app with append strategy
    console.log('New app created:', newAppId)
    console.log('Old app still exists:', oldAppId)

    // 2. Copy state from old app to new app
    await this.copyGlobalState(oldAppId, newAppId)

    // 3. Migrate users gradually
    for (const user of users) {
      await this.migrateUser(user, oldAppId, newAppId)
    }

    // 4. Update application to point to new app ID
    console.log('Migration complete')
    console.log('Note: Old app still exists (permanent)')
  }

  async copyGlobalState(oldAppId: bigint, newAppId: bigint) {
    // Read state from old app
    const oldState = await algorand.app.getGlobalState(oldAppId)

    // Write to new app
    // ... implementation depends on your app logic
  }

  async migrateUser(user: string, oldAppId: bigint, newAppId: bigint) {
    // Opt user into new app
    // Copy user's local state if needed
    // ... implementation depends on your app logic
  }
}
```

## Common Scenarios

### Scenario 1: Accidentally Made App Permanent

**Problem**: Deployed app as permanent but need to change schema.

**Solution**: Use append strategy to create new app:

```typescript
// Original permanent app
const permanentApp = {
  metadata: { name: 'MyApp', version: '1.0', deletable: false, updatable: true },
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram,
    clearStateProgram: clearProgram,
    schema: { globalInts: 1, globalByteSlices: 0, localInts: 0, localByteSlices: 0 },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
}

const result1 = await algorand.appDeployer.deploy(permanentApp)

// Need to change schema - use append
const newApp = {
  metadata: { name: 'MyApp', version: '2.0', deletable: false, updatable: true },
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram,
    clearStateProgram: clearProgram,
    schema: { globalInts: 2, globalByteSlices: 0, localInts: 0, localByteSlices: 0 },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
  onSchemaBreak: 'append' as const,
  onUpdate: 'update' as const,
}

const result2 = await algorand.appDeployer.deploy(newApp)
// result2.appId is different from result1.appId
// Both apps exist and are permanent
```

### Scenario 2: Need More Storage for Permanent App

**Problem**: Permanent app needs more global state but schema is locked.

**Solution**: Use box storage instead:

```typescript
// Instead of changing global state schema
// Use box storage (no schema break)
await algorand.send.appCall({
  sender: deployer.addr,
  appId: permanentAppId,
  boxReferences: [{ appIndex: 0, name: new Uint8Array(Buffer.from('extra_data')) }],
  // Create box to store additional data
})
```

**Pros:**
- No schema break
- Can add storage dynamically
- No need for new app

**Cons:**
- Different API for accessing data
- Additional MBR costs per box

### Scenario 3: Permanent DeFi Protocol Needs Upgrade

**Problem**: DeFi protocol is permanent but needs new features requiring more storage.

**Solution**: Proxy pattern with upgradeable implementation:

```typescript
// Permanent proxy (never changes)
const proxyMetadata = {
  name: 'DeFiProxy',
  version: '1.0',
  deletable: false,  // Proxy is permanent
  updatable: false,  // Proxy logic never changes
}

// Stores implementation app ID in global state
const proxyProgram = `
// Proxy delegates all calls to implementation app
// Reads implementation app ID from global state
// Forwards all calls
`

// Upgradeable implementation (can be replaced)
const implMetadata = {
  name: 'DeFiImpl',
  version: '1.0',
  deletable: true,   // Can be replaced
  updatable: true,
}

// Deploy proxy (permanent)
const proxy = await algorand.appDeployer.deploy({
  metadata: proxyMetadata,
  createParams: { /* proxy program */ },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
})

// Deploy implementation
const impl = await algorand.appDeployer.deploy({
  metadata: implMetadata,
  createParams: { /* implementation program with more storage */ },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
})

// Proxy stores impl app ID - can be updated later
```

## Common Pitfalls

### 1. Not Checking Deletable Flag Before Replace

**Problem**: Attempting to replace without checking if app is permanent.

**Solution**:
```typescript
// Check before attempting replace
const appInfo = await algorand.app.getById(appId)
const metadata = JSON.parse(
  new TextDecoder().decode(
    await algorand.app.getBoxValue(appId, 'metadata')
  )
)

if (!metadata.deletable) {
  console.warn('App is permanent - cannot use replace strategy')
  // Use append instead
}
```

### 2. Making All Apps Permanent by Default

**Problem**: Setting `deletable: false` for all apps during development.

**Solution**:
```typescript
// Use environment-based configuration
const isProduction = process.env.NODE_ENV === 'production'
const isMainnet = process.env.NETWORK === 'mainnet'

const metadata = {
  name: 'MyApp',
  version: '1.0',
  // Only permanent in production on mainnet
  deletable: !(isProduction && isMainnet),
  updatable: true,
}
```

### 3. Not Reserving Enough Schema Slots

**Problem**: Permanent app with minimal schema runs out of space.

**Solution**:
```typescript
// Calculate future needs
const currentNeeds = {
  globalInts: 1,
  globalByteSlices: 0,
}

const estimatedFuture = {
  globalInts: 4,        // Reserve 3 extra
  globalByteSlices: 2,  // Reserve 2 extra
}

// Use estimated future for permanent apps
const schema = metadata.deletable ? currentNeeds : estimatedFuture
```

### 4. Not Handling Replace Failures

**Problem**: Replace strategy fails but error isn't handled gracefully.

**Solution**:
```typescript
try {
  await algorand.appDeployer.deploy({
    // ...
    onSchemaBreak: 'replace' as const,
  })
} catch (error: any) {
  const logicError = LogicError.parseLogicError(error)

  if (logicError && error.message.includes('rejected by ApprovalProgram')) {
    console.log('Replace failed - app is likely permanent')
    console.log('Retrying with append strategy...')

    // Retry with append
    const result = await algorand.appDeployer.deploy({
      // ...
      onSchemaBreak: 'append' as const,
    })

    console.log('Created new app:', result.appId)
  } else {
    throw error
  }
}
```

### 5. Forgetting Apps Are Permanent Forever

**Problem**: Deploying test apps as permanent, cluttering the blockchain.

**Solution**:
```typescript
// Never make test apps permanent
if (isTestEnvironment) {
  if (metadata.deletable === false) {
    throw new Error('Test apps should not be permanent!')
  }
}

// Add safeguards
function validatePermanentDeployment(metadata: AppMetadata) {
  if (!metadata.deletable) {
    console.warn('⚠️  WARNING: Deploying PERMANENT app')
    console.warn('⚠️  This app can NEVER be deleted from the blockchain')
    console.warn('⚠️  Schema changes will require creating new apps')
    console.warn('⚠️  Are you sure? (This is your last chance!)')

    // Require manual confirmation for permanent deployments
  }
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
=== Handling Schema Breaks on Permanent Apps ===
Using account: <ADDRESS>

=== Step 1: Deploying Permanent App ===
✅ Permanent app deployed successfully
   App ID: 1060n
   App Address: <ADDRESS>
   Version: 1.0
   Deletable: false ⚠️

=== Step 2: Attempting Schema-Breaking Replacement ===
Breaking schema by changing globalInts: 1 → 2
Using onSchemaBreak="replace" strategy

✅ Deployment failed as expected!

=== Error Details ===
Error message: Error resolving execution info via simulate in transaction 1: transaction <TXID>: transaction rejected by ApprovalProgram

=== Parsed Logic Error ===
Transaction ID: <TXID>
Program Counter: <PC>
Message: <MSG>
Description: <DESC>

=== Why Did This Fail? ===
The app was deployed with deletable: false, making it permanent.
Schema breaks with "replace" strategy require:
  1. Delete the old app
  2. Create a new app

However:
  • Permanent apps cannot be deleted (TMPL_DELETABLE=0)
  • The delete transaction was rejected by the approval program
  • Therefore, the replacement failed

=== Verification ===
✅ Original permanent app still exists
   App ID: 1060n
   Global Ints: 1
   Schema unchanged: still has 1 global int

=== Key Takeaways ===
For permanent apps (deletable: false):
  • Design your schema correctly from the start
  • Schema-breaking changes cannot be applied
  • onSchemaBreak="replace" will fail
  • onSchemaBreak="append" creates a new app instead
  • Consider reserving extra schema slots for future use

✨ Example completed successfully!
```

## Key Takeaways

1. **Permanent apps cannot be deleted**: Once `deletable: false`, it's permanent on the blockchain
2. **Schema is locked**: Schema-breaking changes cannot be applied with replace strategy
3. **Replace fails**: `onSchemaBreak='replace'` will always fail for permanent apps
4. **Use append instead**: `onSchemaBreak='append'` creates a new app alongside the old one
5. **Plan ahead**: Reserve extra schema slots for permanent apps from the start
6. **Parse errors**: Use `LogicError.parseLogicError()` to understand why deletion failed
7. **Consider alternatives**: Box storage, proxy patterns, or new apps for schema changes
8. **Test first**: Deploy as deletable during testing, permanent only for final production

## Related Examples

- [112-handle-errors-when-replacing-permanent-apps](../112-handle-errors-when-replacing-permanent-apps) - Related example on permanent app errors
- [113-handle-failed-update-of-immutable-application](../113-handle-failed-update-of-immutable-application) - Immutable app updates
- [114-handle-schema-breaking-changes-with-extra-pages](../114-handle-schema-breaking-changes-with-extra-pages) - Schema breaks with extra pages
- [115-handling-app-updates-with-append-strategy](../115-handling-app-updates-with-append-strategy) - Using append strategy
- [111-fail-fast-strategy-for-schema-breaks](../111-fail-fast-strategy-for-schema-breaks) - Fail strategy for schema breaks

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [App Deployment Guide](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/docs/capabilities/app-deploy.md)
- [LogicError API Reference](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/docs/code/modules/types_logic_error.md)
- [Algorand Smart Contract Guidelines](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/guidelines/)
