# Example 124: Replace App with Schema-Breaking Changes

This example demonstrates how to handle schema-breaking changes in Algorand applications. When you need to increase storage requirements, Algorand's protocol restrictions require deleting the old app and creating a new one with the updated schema.

## Core Concept

**Schema-breaking changes** occur when you attempt to increase the storage allocation of an existing application. Algorand's blockchain design prevents updating an app to require more storage because:

1. **User consent**: Accounts that opted into an app allocated specific storage
2. **Cost implications**: Increasing storage would increase costs without user consent
3. **Protocol protection**: Prevents developers from unilaterally imposing storage costs
4. **Immutability principle**: Storage commitments are part of the app's contract

When you need more storage:

1. **Cannot update in place**: Algorand rejects updates that increase schema
2. **Must delete and recreate**: Delete old app, create new app with larger schema
3. **New app ID**: The recreated app gets a completely new identifier
4. **State reset**: All global and local state is lost in the process
5. **User re-opt-in required**: Users must opt into the new app

Key characteristics:
- **Storage increases are blocked**: Cannot update to add more uints or byte slices
- **Storage decreases are allowed**: Can reduce storage during updates
- **Delete-and-recreate pattern**: Standard solution for schema increases
- **Breaking change**: Results in new app ID and lost state
- **Planning is critical**: Over-allocate storage initially when possible

## What This Example Shows

This example demonstrates:

1. **Creating an app with initial schema**: Deploy with specific storage allocation
2. **Understanding schema restrictions**: What changes are blocked by the protocol
3. **Deleting the old application**: Removing the app to enable recreation
4. **Creating app with increased schema**: Deploy new app with more storage
5. **Verifying the replacement**: Confirm new app ID and schema changes

## Storage Schema Structure

```
Application Storage Schema:
┌─────────────────────────────────────┐
│ Global State Schema                 │
│   - globalInts: 2                   │
│   - globalByteSlices: 1             │
│                                     │
│ Used for: App-wide state           │
│ Allocated once per app              │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Local State Schema                  │
│   - localInts: 1                    │
│   - localByteSlices: 0              │
│                                     │
│ Used for: Per-user state           │
│ Allocated per opted-in account      │
└─────────────────────────────────────┘
```

### Schema Change Scenarios

```
Scenario 1: Schema Increase (BLOCKED)
┌─────────────────────────────────────┐
│ Original:  globalInts: 2            │
│ Desired:   globalInts: 3            │
│ Result:    ❌ UPDATE REJECTED       │
│ Solution:  Delete + Recreate        │
└─────────────────────────────────────┘

Scenario 2: Schema Decrease (ALLOWED)
┌─────────────────────────────────────┐
│ Original:  globalInts: 3            │
│ Desired:   globalInts: 2            │
│ Result:    ✅ UPDATE SUCCEEDS       │
│ Solution:  Normal update            │
└─────────────────────────────────────┘

Scenario 3: Schema Same (ALLOWED)
┌─────────────────────────────────────┐
│ Original:  globalInts: 2            │
│ Desired:   globalInts: 2            │
│ Result:    ✅ UPDATE SUCCEEDS       │
│ Solution:  Normal update            │
└─────────────────────────────────────┘
```

## Key API Pattern

The pattern for replacing an app with schema-breaking changes:

```typescript
// Step 1: Deploy initial app with original schema
const appResult1 = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram,
  clearStateProgram,
  schema: {
    globalInts: 2,           // Original allocation
    globalByteSlices: 1,
    localInts: 1,
    localByteSlices: 0,
  },
})

const appId1 = appResult1.appId
console.log('Initial app ID:', appId1)

// Step 2: Delete old app
await algorand.send.appDelete({
  sender: deployer.addr,
  appId: appId1,
})

// Step 3: Create new app with increased schema
const appResult2 = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: updatedProgram,
  clearStateProgram,
  schema: {
    globalInts: 3,           // INCREASED (was 2)
    globalByteSlices: 1,
    localInts: 1,
    localByteSlices: 2,      // INCREASED (was 0)
  },
})

const appId2 = appResult2.appId
console.log('New app ID:', appId2)
console.log('App IDs are different:', appId1 !== appId2) // true
```

Key points:
- **Delete first**: Old app must be removed before creating replacement
- **New app ID**: Replacement app gets a completely new identifier
- **Update all references**: Frontend, smart contracts must use new app ID
- **Migrate state**: Must manually copy important state to new app

## Step-by-Step Breakdown

### Step 1: Deploy Initial Application

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const deployer = await algorand.account.localNetDispenser()

const approvalProgram = `#pragma version 10
txn ApplicationID
int 0
==
bnz create

// Handle updates and deletes
txn OnCompletion
int UpdateApplication
==
bnz handle_update

txn OnCompletion
int DeleteApplication
==
bnz handle_delete

int 1
return

create:
byte "version"
byte "1.0"
app_global_put
int 1
return

handle_update:
int 1  // Allow updates
return

handle_delete:
int 1  // Allow deletion (critical for replacement!)
return`

const appResult1 = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram,
  clearStateProgram,
  schema: {
    globalInts: 2,
    globalByteSlices: 1,
    localInts: 1,
    localByteSlices: 0,
  },
})

console.log('Initial deployment successful')
console.log('App ID:', appResult1.appId)
```

### Step 2: Understand the Limitation

```typescript
// This would be REJECTED by the protocol:
// await algorand.send.appUpdate({
//   sender: deployer.addr,
//   appId: appResult1.appId,
//   approvalProgram: newProgram,
//   clearStateProgram,
//   // Even if we wanted to increase schema here,
//   // appUpdate doesn't support schema changes at all
// })

// The only way to increase schema is to delete and recreate
```

### Step 3: Delete the Old Application

```typescript
// Delete the old app (requires deletable TEAL logic)
await algorand.send.appDelete({
  sender: deployer.addr,
  appId: appResult1.appId,
})

console.log('Old app deleted')

// Verify deletion
try {
  await algorand.client.algod.getApplicationByID(Number(appResult1.appId)).do()
  console.log('ERROR: App still exists!')
} catch (error) {
  if (error.message.includes('application does not exist')) {
    console.log('✓ Deletion confirmed')
  }
}
```

### Step 4: Create New App with Increased Schema

```typescript
const approvalProgramV2 = `#pragma version 10
// Updated program with version 2.0
txn ApplicationID
int 0
==
bnz create

// ... same handlers ...

create:
byte "version"
byte "2.0"  // Updated version
app_global_put
int 1
return

// ... rest of handlers ...
`

const appResult2 = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: approvalProgramV2,
  clearStateProgram,
  schema: {
    globalInts: 3,        // INCREASED from 2
    globalByteSlices: 1,  // Unchanged
    localInts: 1,         // Unchanged
    localByteSlices: 2,   // INCREASED from 0
  },
})

console.log('New app created successfully')
console.log('New App ID:', appResult2.appId)
console.log('Old App ID:', appResult1.appId)
console.log('IDs are different:', appResult2.appId !== appResult1.appId)
```

### Step 5: Verify the Replacement

```typescript
// Fetch new app info
const appInfo = await algorand.client.algod
  .getApplicationByID(Number(appResult2.appId))
  .do()

console.log('New app global schema:', appInfo.params['global-state-schema'])
console.log('New app local schema:', appInfo.params['local-state-schema'])

// Confirm old app no longer exists
try {
  await algorand.client.algod
    .getApplicationByID(Number(appResult1.appId))
    .do()
  console.log('❌ Old app still exists')
} catch (error) {
  console.log('✅ Old app successfully deleted')
}
```

## Use Cases

### 1. Growing Application Features

App needs more storage as features are added:

```typescript
// Phase 1: Launch with minimal schema
await algorand.send.appCreate({
  schema: {
    globalInts: 2,      // Just for counters
    globalByteSlices: 1, // Just for name
    localInts: 1,       // User balance
    localByteSlices: 0,
  },
})

// Phase 2: Need to add leaderboard and achievements
// Requires: +1 globalInt, +2 localInts, +1 localByteSlice
// Solution: Delete and recreate with larger schema
```

### 2. Underestimated Storage Requirements

Initial design didn't allocate enough storage:

```typescript
// Original (insufficient):
globalInts: 3  // Only storing: count, total, max

// Needed (after feature analysis):
globalInts: 7  // Need: count, total, max, min, avg, median, mode

// Must delete and recreate to get 7 global ints
```

### 3. Adding New User Features

Local state needs increase for per-user features:

```typescript
// Original local state
localInts: 1,         // balance
localByteSlices: 0

// New requirements (user profiles):
localInts: 3,         // balance, level, xp
localByteSlices: 2    // username, avatar_url

// Must replace app for users to opt into new schema
```

### 4. Protocol Upgrade

New protocol version requires additional state:

```typescript
// V1 protocol
globalInts: 5,
globalByteSlices: 2

// V2 protocol (enhanced features)
globalInts: 8,        // +3 for new consensus params
globalByteSlices: 4   // +2 for new metadata

// Replacement required, coordinate with all users
```

### 5. Fixing Schema Design Mistakes

Discovered inefficient storage allocation:

```typescript
// Mistake: Using byte slices for small values
globalInts: 2,
globalByteSlices: 5  // Overkill for small data

// Better design: Use ints for efficiency
globalInts: 7,       // Store efficiently as uints
globalByteSlices: 2  // Only for actual strings

// Replace to optimize storage costs
```

## Schema Change Types

### Breaking Changes (Require Replacement)

```typescript
// ❌ Increasing global uints
{ globalInts: 2 } → { globalInts: 3 }

// ❌ Increasing global byte slices
{ globalByteSlices: 1 } → { globalByteSlices: 2 }

// ❌ Increasing local uints
{ localInts: 1 } → { localInts: 2 }

// ❌ Increasing local byte slices
{ localByteSlices: 0 } → { localByteSlices: 1 }
```

### Non-Breaking Changes (Update Allowed)

```typescript
// ✅ Decreasing global uints
{ globalInts: 3 } → { globalInts: 2 }

// ✅ Decreasing global byte slices
{ globalByteSlices: 2 } → { globalByteSlices: 1 }

// ✅ Keeping schema the same
{ globalInts: 2 } → { globalInts: 2 }

// ✅ Changing TEAL logic (schema unchanged)
approvalProgram: program_v1 → program_v2
```

## Important Considerations

### Consequences of Replacement

```
⚠️  State Loss:
   • All global state is RESET to empty
   • All local state is LOST for all users
   • Any state migration must be done manually

⚠️  User Impact:
   • Users must OPT-IN again to new app
   • All previous opt-ins are invalid
   • Local balances/data lost unless migrated

⚠️  Integration Breaking:
   • App ID changes (update all references!)
   • Smart contracts calling old app will fail
   • Frontend must update to new app ID
   • Off-chain indexes must be updated

⚠️  Operational Overhead:
   • Coordinate migration with users
   • Handle dual-app transition period
   • Migrate critical global state
   • Update documentation and integrations
```

### Benefits of Replacement

```
✅  Capabilities:
   • Get the increased storage you need
   • Can redesign state structure completely
   • Opportunity to optimize storage layout
   • Remove technical debt from v1

✅  Fresh Start:
   • Clean state without legacy data
   • Updated schema matches current needs
   • Simplified state management
   • Better organized storage
```

## Why Does Algorand Restrict This?

Algorand's protocol design prevents storage increases for important reasons:

### 1. Minimum Balance Requirements

```typescript
// When user opts into app:
const minBalance = baseMinBalance
  + (localInts × intSize × costPerByte)
  + (localByteSlices × sliceSize × costPerByte)

// If app could increase storage after opt-in:
// User's minimum balance would increase WITHOUT their consent
// This could lock funds or cause account issues
```

### 2. Economic Fairness

- Users committed to specific storage costs when opting in
- Increasing storage unilaterally would be unfair
- Forces developers to plan storage carefully
- Protects users from unexpected balance requirements

### 3. State Bloat Prevention

- Prevents apps from continuously growing state
- Encourages efficient storage design
- Promotes use of box storage for dynamic data
- Keeps blockchain state manageable

## Migration Strategy

### Planning the Migration

```typescript
// 1. Assess current state
const currentState = await getAppGlobalState(oldAppId)
const optedInUsers = await getOptedInAccounts(oldAppId)

// 2. Deploy new app
const newAppId = await deployAppWithIncreasedSchema()

// 3. Migrate critical global state
await migrateGlobalState(currentState, newAppId)

// 4. Notify users
await notifyUsersOfMigration(optedInUsers, oldAppId, newAppId)

// 5. Provide migration tools
await createUserMigrationTools(oldAppId, newAppId)

// 6. Monitor adoption
await trackMigrationProgress(oldAppId, newAppId)

// 7. Delete old app after transition
await deleteOldApp(oldAppId)
```

### State Migration Example

```typescript
// Save state from old app
const oldState = await algorand.app.getGlobalState(oldAppId)

// Deploy new app
const newAppId = await createNewApp()

// Migrate important values
for (const [key, value] of Object.entries(oldState)) {
  await algorand.send.appCall({
    appId: newAppId,
    method: 'setState',
    args: [key, value],
  })
}
```

## Best Practices

### 1. Plan Schema with Buffer Space

```typescript
// ❌ Don't: Allocate exact requirements
schema: {
  globalInts: 2,  // Only what you need today
}

// ✅ Do: Add buffer for future growth
schema: {
  globalInts: 5,  // Need 2, allocate 5 for future
}
```

### 2. Use Box Storage for Dynamic Data

```typescript
// ❌ Don't: Use global state for growing data
globalByteSlices: 20  // For user list (limited!)

// ✅ Do: Use boxes for unlimited growth
globalByteSlices: 2   // Just for config
// Store user data in boxes (no limit)
```

### 3. Version Your State Keys

```typescript
// Makes migration easier
byte "balance_v1"    // Can migrate to balance_v2
byte "config_v2"     // Clear versioning
byte "state_2024"    // Date-based versioning
```

### 4. Make Apps Deletable During Development

```typescript
// Development TEAL
handle_delete:
int 1  // Allow deletion for iteration
return

// Production TEAL (after schema finalized)
handle_delete:
int 0  // Prevent deletion for security
return
```

### 5. Document Schema Decisions

```typescript
/**
 * Schema Design Document
 *
 * Global State (5 uints, 2 byte slices):
 *   - uint[0]: total_users (grows with adoption)
 *   - uint[1]: total_volume (grows continuously)
 *   - uint[2]: fee_collected (grows continuously)
 *   - uint[3-4]: RESERVED for future features
 *   - bytes[0]: admin_address (32 bytes)
 *   - bytes[1]: RESERVED
 *
 * Local State (3 uints, 1 byte slice):
 *   - uint[0]: user_balance
 *   - uint[1]: last_activity_timestamp
 *   - uint[2]: RESERVED
 *   - bytes[0]: user_metadata (64 bytes max)
 *
 * Reserved slots: Plan for 2-year roadmap
 * Review: Quarterly assessment of usage
 */
```

### 6. Test Schema Changes on TestNet

```bash
# Deploy to TestNet first
algokit deploy testnet

# Verify schema works as expected
# Test migration process
# Validate user experience

# Only then deploy to MainNet
algokit deploy mainnet
```

### 7. Coordinate Major Migrations

```typescript
// Provide ample notice
const migrationDate = new Date('2025-12-01')
await announceSchema Change(migrationDate)

// Offer migration assistance
await provideMigrationGuide()
await createMigrationScript()

// Support dual-app period
await runBothApps(oldAppId, newAppId)

// Gradual cutover
await deprecateOldApp(oldAppId, gracePeriod)
```

## Common Pitfalls

### 1. Forgetting App Must Be Deletable

```typescript
// ❌ Wrong: App can't be deleted
handle_delete:
int 0
return

// Can't delete for replacement!

// ✅ Correct: Allow deletion during development
handle_delete:
int 1
return
```

### 2. Not Planning for Growth

```typescript
// ❌ Don't: Allocate minimum
globalInts: 2  // Exactly what's needed

// Will need replacement soon

// ✅ Do: Allocate with buffer
globalInts: 5  // Room to grow
```

### 3. Forgetting to Update References

```typescript
// ❌ Don't: Keep using old app ID
const appId = 1234  // Old app ID hardcoded!

// ✅ Do: Use configuration
const appId = config.getCurrentAppId()  // Returns new ID after migration
```

### 4. Not Migrating Critical State

```typescript
// ❌ Don't: Just create new app
await createNewApp()
// Old state lost!

// ✅ Do: Migrate important data
await migrateState(oldAppId, newAppId)
```

### 5. Surprising Users

```typescript
// ❌ Don't: Replace without warning
await deleteApp(oldAppId)
await createNewApp()
// Users confused why they're not opted in!

// ✅ Do: Communicate clearly
await notifyUsers(migrationPlan)
await provideTransitionSupport()
```

## Alternatives to Replacement

### 1. Box Storage

Use boxes for data that might grow:

```typescript
// Instead of increasing global byte slices:
// Use boxes for unlimited storage
await algorand.send.appCall({
  method: 'setBox',
  args: ['user_data', userData],
  boxes: [{ appId, name: 'user_data' }],
})
```

### 2. External Storage

Store data off-chain:

```typescript
// Store hash in global state
byte "data_hash"
byte 0x1234... // IPFS hash
app_global_put

// Store actual data on IPFS/Arweave
```

### 3. Multiple Apps Pattern

Split functionality across apps:

```typescript
const mainAppId = 1234    // Core logic
const storageAppId = 5678  // Extra storage
const featureAppId = 9012  // New features
```

## Related Examples

- [Example 29: Template Variables](../29-template-variables/README.md) - TMPL variables in TEAL
- [Example 117: Update Application](../117-update-application/README.md) - Non-breaking updates
- Box storage examples - Using boxes for dynamic storage

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
1. Deploy initial app with schema (2 global uints, 1 global byte slice, 1 local uint, 0 local byte slices)
2. Display app information
3. Explain schema-breaking changes and why they're blocked
4. Delete the old application
5. Create new app with increased schema (3 global uints, 1 global byte slice, 1 local uint, 2 local byte slices)
6. Verify new app has different ID
7. Explain consequences, benefits, and best practices

## Key Takeaways

1. **Schema increases are blocked**: Cannot update app to require more storage
2. **Must delete and recreate**: Only way to increase storage allocation
3. **New app ID**: Replacement app gets completely new identifier
4. **All state lost**: Global and local state reset to empty
5. **Users must re-opt-in**: Previous opt-ins become invalid
6. **Plan with buffer space**: Over-allocate storage initially when possible
7. **Use boxes for dynamic data**: Boxes can grow without schema changes
8. **Migration is complex**: Requires coordination and state migration
9. **Update all references**: Frontend, contracts, docs must use new app ID
10. **Test on TestNet first**: Validate migration process before production

This pattern is essential for **production Algorand applications** where storage needs may evolve over time!
