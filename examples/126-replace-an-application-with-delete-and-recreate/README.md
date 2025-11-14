# Replace an Application with Delete and Recreate

This example demonstrates how to replace an existing Algorand application by deleting the old version and creating a new one with updated logic and schema.

## Core Concept

When you need to make changes to an Algorand application that cannot be handled by a regular update, the delete-and-recreate pattern provides a solution. This pattern is necessary when:

1. **Schema-breaking changes**: Increasing storage requirements (global/local ints or byte slices)
2. **Major logic redesign**: Complete overhaul of app behavior
3. **Adding required state**: New global state that all instances need
4. **Fundamental behavior changes**: Changes that should be explicit to users

The trade-off is that you get a completely new app with a different ID, requiring updates to all references and user re-opt-ins.

## When Delete-and-Recreate is Required

### Schema-Breaking Changes

Algorand **does not allow** increasing storage schema via update:

```typescript
// ❌ This FAILS - cannot increase storage via update
await algorand.send.appUpdate({
  appId: existingAppId,
  approvalProgram: newProgram,
  schema: {
    globalInts: 2,  // Was 1 - INCREASE NOT ALLOWED
    global ByteSlices: 1,
  },
})
// Error: schema increase not permitted
```

**Why**: Each account that opts into an app allocates storage. Increasing storage would require all opted-in accounts to pay more, which could happen without their consent. Algorand prevents this by blocking storage increases.

**Solution**: Delete and recreate

```typescript
// ✅ This WORKS - delete old app, create new one
await algorand.send.appDelete({ appId: oldAppId })

const newApp = await algorand.send.appCreate({
  approvalProgram: newProgram,
  schema: {
    globalInts: 2,  // Can now use larger schema
    globalByteSlices: 1,
  },
})
// New app with new ID and larger schema
```

### Major Logic Redesign

When completely redesigning app logic, updates might leave incompatible state:

```typescript
// V1: Simple counter
byte "counter"
app_global_get
int 1
+
app_global_put

// V2: Counter with rate limiting (incompatible state structure)
byte "counter"
byte "last_increment_time"
byte "rate_limit"
// Old apps don't have last_increment_time or rate_limit!
```

**Solution**: Fresh app with clean state initialization ensures compatibility.

### Adding Required State

Updates cannot retroactively add state to existing apps:

```typescript
// V1: No admin tracking
// (app deployed without admin state)

// V2: Needs admin
byte "admin"
app_global_get  // Returns 0 for old apps!
txn Sender
==
assert  // Fails for old apps without admin set
```

**Solution**: New app initializes with all required state from the start.

## Key API Pattern

### 1. Deploy Initial App (Version 1.0)

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

const algorand = AlgorandClient.defaultLocalNet()
const deployer = await algorand.account.localNetDispenser()

// Deploy version 1.0
const appResult1 = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: approvalProgramV1,
  clearStateProgram: clearProgram,
  schema: {
    globalInts: 1,        // Version 1.0 schema
    globalByteSlices: 1,
    localInts: 0,
    localByteSlices: 0,
  },
})

const appId1 = appResult1.appId
console.log('Version 1.0 App ID:', appId1)
```

### 2. Delete Old App

```typescript
// Delete version 1.0
await algorand.send.appDelete({
  sender: deployer.addr,
  appId: appId1,
})

console.log('Version 1.0 deleted')
```

**Important**: The app must allow deletion in its TEAL code:

```teal
// Handle delete
txn OnCompletion
int DeleteApplication
==
bnz handle_delete

handle_delete:
// Check authorization if needed
// byte "admin"
// app_global_get
// txn Sender
// ==
// assert

int 1  // Approve deletion
return
```

### 3. Create New App (Version 2.0)

```typescript
// Create version 2.0 with increased schema
const appResult2 = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: approvalProgramV2,
  clearStateProgram: clearProgram,
  schema: {
    globalInts: 2,        // INCREASED from 1
    globalByteSlices: 1,
    localInts: 0,
    localByteSlices: 0,
  },
})

const appId2 = appResult2.appId
console.log('Version 2.0 App ID:', appId2)
console.log('IDs are different:', appId1 !== appId2)  // true
```

### 4. Verify Replacement

```typescript
// Verify old app is gone
try {
  await algorand.client.algod.getApplicationByID(Number(appId1)).do()
  console.log('❌ Old app still exists')
} catch (error) {
  if (error.message.includes('application does not exist')) {
    console.log('✅ Old app successfully deleted')
  }
}

// Verify new app exists
const appInfo2 = await algorand.client.algod.getApplicationByID(Number(appId2)).do()
console.log('✅ New app exists with ID:', appId2)
console.log('Schema:', appInfo2.params.globalStateSchema)
```

## Transaction Flow

```
1. Initial Deployment (V1.0)
   ├─ Deploy app with schema: {globalInts: 1, globalByteSlices: 1}
   ├─ App created with ID 1052
   ├─ Global state: {version: "1.0", value: 100}
   └─ App is live

2. Time Passes (App in use)
   ├─ Users opt-in
   ├─ Transactions executed
   └─ State accumulates

3. Need for Schema Increase Identified
   ├─ Version 2.0 requires globalInts: 2
   ├─ Cannot update (schema increase not allowed)
   └─ Decision: Delete and recreate

4. Replacement Process
   ├─ Step 1: Delete old app
   │  ├─ Send DeleteApplication transaction
   │  ├─ TEAL approves deletion
   │  ├─ App 1052 removed from chain
   │  └─ All state lost
   │
   ├─ Step 2: Create new app
   │  ├─ Send CreateApplication transaction
   │  ├─ Use new schema: {globalInts: 2, globalByteSlices: 1}
   │  ├─ App created with ID 1055 (NEW ID)
   │  └─ Global state: {version: "2.0", value: 200, multiplier: 3}
   │
   └─ Step 3: Update references
      ├─ Update frontend to use app ID 1055
      ├─ Update backend services
      ├─ Notify users to opt-in to new app
      └─ Update documentation

5. Post-Replacement
   ├─ Old app ID 1052 does not exist
   ├─ New app ID 1055 is live
   ├─ Users must re-opt-in
   └─ Fresh state (old state not preserved)
```

## Trade-offs

### Consequences (What You Lose)

| Consequence | Impact | Mitigation |
|------------|--------|------------|
| **New App ID** | All references must be updated | Update frontend, backend, docs, smart contracts |
| **Lost Global State** | All app data is reset | Read state before delete, write to new app |
| **Lost Local State** | All user data is reset | Export user data, provide migration tool |
| **Users Must Re-Opt-In** | User friction, potential drop-off | Announce migration, provide incentives, guide users |
| **Broken References** | Other apps/contracts break | Identify dependencies, coordinate updates |
| **Asset Loss Risk** | App account assets lost if not transferred | Transfer ALL assets before deletion |

### Benefits (What You Gain)

| Benefit | Value |
|---------|-------|
| **Increased Schema** | Only way to get more storage |
| **Clean State** | No legacy data or technical debt |
| **Complete Redesign** | Freedom to restructure everything |
| **Explicit Versioning** | Different app ID signals major change |
| **Fresh Start** | Remove accumulated bugs/issues |

## Example Output

Running this example produces:

```
=== Replace Application with Delete and Recreate ===

Using deployer account: <address>

=== Step 1: Deploy Initial App (Version 1.0) ===
Features:
  - Version: 1.0
  - Value: 100
  - Schema: 1 global uint, 1 global byte slice
  - Methods: get_value

✅ Version 1.0 deployed successfully!
   App ID: 1052n
   App Address: <app_address_1>

Global State (Version 1.0):
   value: 100
   version: 1.0

Testing get_value method on Version 1.0...
   Returned value: 100

=== Step 2: Replace App (Delete V1.0, Create V2.0) ===
New features in Version 2.0:
  - Version: 2.0
  - Value: 200 (different default)
  - Schema: 2 global uints, 1 global byte slice (INCREASED)
  - Methods: get_value, get_multiplied_value (NEW)

Deleting Version 1.0...
   ✅ Version 1.0 deleted

Verifying deletion...
   ✅ Confirmed: Version 1.0 no longer exists

Creating Version 2.0...
✅ Version 2.0 deployed successfully!
   App ID: 1055n
   App Address: <app_address_2>

Comparison:
   Old App ID: 1052n
   New App ID: 1055n
   IDs are different: ✅ YES

Global State (Version 2.0):
   multiplier: 3
   value: 200
   version: 2.0

Testing NEW method get_multiplied_value on Version 2.0...
   Returned value (200 * 3): 600
```

This demonstrates:
- Version 1.0 deployed with schema (1 uint, 1 byte slice)
- Version 1.0 working correctly (get_value returns 100)
- Successful deletion of Version 1.0
- Version 2.0 created with increased schema (2 uints, 1 byte slice)
- Different app IDs (1052 vs 1055)
- New method working (get_multiplied_value returns 600)
- Fresh state (value is 200, not 100 from V1)

## Best Practices

### 1. Plan Schema with Buffer Space

**Bad**: Allocate exact storage needed
```typescript
// ❌ Need exactly 2 uints
schema: {
  globalInts: 2,  // No room for growth
  globalByteSlices: 1,
}
```

**Good**: Over-allocate for future growth
```typescript
// ✅ Need 2 uints, allocate 5
schema: {
  globalInts: 5,  // Room to add 3 more without replacement
  globalByteSlices: 3,  // Room to add 2 more byte slices
}
```

**Why**: Avoid forced replacements later. Unused storage costs nothing at runtime, only during opt-in minimum balance calculation.

### 2. Transfer Assets Before Deletion

App accounts can hold ALGOs and ASAs. These are **permanently lost** if not transferred before deletion.

```typescript
// Before deleting app
const appAddress = algosdk.getApplicationAddress(appId)
const appInfo = await algorand.client.algod.accountInformation(appAddress).do()

console.log('App account balance:', appInfo.amount, 'microALGOs')
console.log('App account assets:', appInfo.assets)

// Transfer ALGOs out
if (appInfo.amount > 100000) {  // Leave minimum balance
  await algorand.send.payment({
    sender: appAddress,  // Signed by app logic
    receiver: treasuryAddress,
    amount: appInfo.amount - 100000,
    // App logic must approve this payment
  })
}

// Transfer ASAs out
for (const asset of appInfo.assets || []) {
  await algorand.send.assetTransfer({
    sender: appAddress,
    receiver: treasuryAddress,
    assetId: asset['asset-id'],
    amount: asset.amount,
    // App logic must approve this transfer
  })
}

// Now safe to delete
await algorand.send.appDelete({ appId })
```

### 3. Coordinate with Users

Provide clear communication and migration path:

```typescript
// 1. Announce migration
console.log('App will be replaced on 2025-12-01')
console.log('Old app ID: 1052')
console.log('New app ID: 1055 (after migration)')

// 2. Provide migration timeline
console.log('Timeline:')
console.log('  2025-11-15: New app created (parallel operation)')
console.log('  2025-11-20: Migration tool available')
console.log('  2025-12-01: Old app deleted')

// 3. Guide users
console.log('Migration steps:')
console.log('  1. Opt-in to new app (ID 1055)')
console.log('  2. Run migration tool to transfer state')
console.log('  3. Verify migration successful')
console.log('  4. Close out of old app (ID 1052)')
```

### 4. Migrate Critical State

Don't lose important data:

```typescript
// Read state from old app
const oldAppInfo = await algorand.client.algod
  .getApplicationByID(Number(oldAppId))
  .do()
const oldGlobalState = parseGlobalState(oldAppInfo.params.globalState)

console.log('Preserving state:', oldGlobalState)

// Delete old app
await algorand.send.appDelete({ appId: oldAppId })

// Create new app
const newApp = await algorand.send.appCreate({
  approvalProgram: newProgramV2,
  clearStateProgram: clearProgram,
  schema: newSchema,
})

// Write preserved state to new app
for (const [key, value] of Object.entries(oldGlobalState)) {
  if (shouldPreserve(key)) {
    await algorand.send.appCall({
      appId: newApp.appId,
      method: 'set_state',
      args: [key, value],
    })
  }
}
```

### 5. Update All References

Create a checklist:

```typescript
const updateChecklist = [
  '☐ Frontend hardcoded app IDs',
  '☐ Backend service configuration',
  '☐ Smart contracts calling this app',
  '☐ Documentation and tutorials',
  '☐ API specifications',
  '☐ Mobile app configuration',
  '☐ Deployment scripts',
  '☐ Monitoring dashboards',
]

// Automated reference finder
await findAppIdReferences(oldAppId, [
  './src/**/*.ts',
  './contracts/**/*.teal',
  './config/**/*.json',
  './docs/**/*.md',
])
```

### 6. Test on TestNet First

Validate the entire process:

```bash
# 1. Deploy V1 on TestNet
npm run deploy:testnet -- --version=1.0

# 2. Use app for a period
# (Simulate real usage)

# 3. Test migration process
npm run test:migration:testnet

# 4. Validate new app works
npm run test:e2e:testnet -- --app-id=<new_app_id>

# 5. Deploy to MainNet only after validation
npm run deploy:mainnet -- --version=2.0
```

### 7. Consider Alternatives First

Delete-and-recreate should be a last resort:

**Option 1: Box Storage** (Avoids schema limits)
```typescript
// Instead of increasing global state
schema: {
  globalInts: 10,  // Would require replacement
}

// Use boxes for dynamic data
await algorand.send.appCall({
  appId,
  method: 'set_box',
  args: [boxName, boxValue],
  boxReferences: [{ appId, name: boxName }],
})
```

**Option 2: Proxy Pattern** (Stable app ID)
```typescript
// Proxy app (never changes)
const proxyAppId = 1000

// Implementation app (can be replaced)
let implAppId = 2000

// When replacing implementation:
implAppId = 2001  // New implementation
await updateProxyAppReference(proxyAppId, implAppId)
```

## Alternative Strategies

### 1. Updatable Design Pattern

Over-allocate schema from the start:

```typescript
// Initial deployment
schema: {
  globalInts: 10,     // Using 2, have 8 spare
  globalByteSlices: 5, // Using 1, have 4 spare
}
```

Use version flags in state:

```teal
byte "schema_version"
app_global_get
int 1
==
bnz handle_v1

int 2
==
bnz handle_v2

handle_v1:
// V1 logic using 2 uints
return

handle_v2:
// V2 logic using 4 uints (within allocated 10)
return
```

### 2. Proxy Pattern

Main app delegates to implementation:

```teal
// Proxy app (stable ID)
byte "impl_app_id"
app_global_get
btoi

// Delegate call to implementation
itxn_begin
int appl
itxn_field TypeEnum

// Set impl app ID
itxn_field ApplicationID

// Forward args
txna ApplicationArgs 0
itxn_field ApplicationArgs

itxn_submit
```

Replace implementation without changing proxy:

```typescript
// Update proxy to point to new implementation
await algorand.send.appCall({
  appId: proxyAppId,
  method: 'set_implementation',
  args: [newImplAppId],
})
```

### 3. Box Storage for Dynamic Data

Use global state for fixed data, boxes for dynamic:

```typescript
// Fixed data in global state
schema: {
  globalInts: 2,
  globalByteSlices: 1,
}

// Dynamic data in boxes (unlimited)
await algorand.send.appCall({
  appId,
  method: 'create_user_box',
  args: [userId, userData],
  boxReferences: [
    { appId, name: encodeBoxName(userId) }
  ],
})
```

### 4. Multiple App Architecture

Split functionality across apps:

```
App 1: Core logic (rarely changes)
App 2: Feature A (can be replaced)
App 3: Feature B (can be replaced)
```

Replace individual apps without affecting others:

```typescript
// Replace only Feature A
await algorand.send.appDelete({ appId: featureA_v1 })
const featureA_v2 = await algorand.send.appCreate({...})

// Core and Feature B continue running
```

## When to Use Each Strategy

### Use Delete-and-Recreate When:
- ✅ Schema must increase (no other option)
- ✅ Complete redesign needed
- ✅ Few users (easy to coordinate re-opt-in)
- ✅ App is in development/testing
- ✅ Legacy state is not needed

### Use Update When:
- ✅ Schema stays same or decreases
- ✅ Logic changes are compatible
- ✅ App ID must remain constant
- ✅ Many users (hard to coordinate)
- ✅ State must be preserved

### Use Proxy Pattern When:
- ✅ Frequent updates expected
- ✅ App ID must be stable
- ✅ Comfortable with added complexity
- ✅ Need versioning flexibility

### Use Box Storage When:
- ✅ Data size is unpredictable
- ✅ Per-user storage needed
- ✅ Schema rigidity is a concern
- ✅ Cost of boxes is acceptable

## Common Pitfalls

### 1. Forgetting to Transfer Assets

**Problem**: App account holds 10,000 ALGOs and 100 ASAs

```typescript
// ❌ Delete without transferring assets
await algorand.send.appDelete({ appId })
// Assets are PERMANENTLY LOST
```

**Solution**: Always check and transfer first

```typescript
// ✅ Transfer assets before deletion
const appAddress = algosdk.getApplicationAddress(appId)
const accountInfo = await algorand.client.algod
  .accountInformation(appAddress)
  .do()

// Transfer all assets out
await transferAssetsFromApp(appAddress, treasuryAddress)

// Now safe to delete
await algorand.send.appDelete({ appId })
```

### 2. Not Updating All References

**Problem**: Frontend uses old app ID

```typescript
// Frontend code
const APP_ID = 1052  // Old app ID, no longer exists!

// This will fail
await algorand.send.appCall({ appId: APP_ID, ... })
// Error: application does not exist
```

**Solution**: Centralize app ID configuration

```typescript
// config.ts
export const APP_ID = process.env.REACT_APP_ID || 1055

// Or use a registry
const registry = await fetchAppRegistry()
export const APP_ID = registry.myApp.currentVersion
```

### 3. No User Communication

**Problem**: Users discover the change when transactions fail

**Solution**: Provide advance notice and migration guide

```
Subject: Important: MyApp Upgrade on Dec 1st

We're upgrading MyApp to version 2.0 on December 1st.

Action Required:
1. Opt-in to new app (ID: 1055)
2. Use migration tool: https://myapp.com/migrate
3. Verify your balance transferred

Timeline:
- Nov 15: New app available for opt-in
- Nov 20-30: Parallel operation period
- Dec 1: Old app (ID: 1052) will be deleted

Questions? support@myapp.com
```

### 4. No State Migration Plan

**Problem**: Critical user data lost

**Solution**: Plan and test migration

```typescript
// Migration script
async function migrateState(oldAppId, newAppId) {
  // 1. Export all user data
  const users = await getAllOptedInUsers(oldAppId)
  for (const user of users) {
    const localState = await getUserLocalState(oldAppId, user)
    await saveToBackup(user, localState)
  }

  // 2. After new app created, import data
  for (const user of users) {
    const localState = await loadFromBackup(user)
    await restoreUserState(newAppId, user, localState)
  }

  // 3. Verify migration
  await verifyAllUsersMigrated(oldAppId, newAppId)
}
```

### 5. App Not Deletable

**Problem**: App TEAL rejects deletion

```teal
handle_delete:
// ❌ Always reject
int 0
return
```

**Solution**: Allow deletion with proper authorization

```teal
handle_delete:
// ✅ Check authorization, then approve
byte "admin"
app_global_get
txn Sender
==
assert

int 1
return
```

## Running the Example

```bash
# Install dependencies
npm install

# Start local Algorand network
algokit localnet start

# Run the example
npm start
```

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Application State Schema](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#state)
- [Application Lifecycle](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#the-lifecycle-of-a-smart-contract)
- [Box Storage](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/state/#boxes)
