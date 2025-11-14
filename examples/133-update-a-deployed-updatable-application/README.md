# Update a Deployed Updatable Application

This example demonstrates the complete workflow of deploying an **updatable application** and then updating it with new code while preserving the app ID and state.

## Core Concept

An **updatable application** is a smart contract that can have its approval and clear state programs replaced with new versions. This is different from deploying a new application:

| Aspect | Create New App | Update Existing App |
|--------|---------------|---------------------|
| **App ID** | Generates new ID | Keeps same ID |
| **App Address** | Generates new address | Keeps same address |
| **State** | Starts fresh | Preserved |
| **OnCompletion** | NoOp (0) | UpdateApplication (4) |
| **Use Case** | First deployment | Bug fixes, new features |

This example shows:
1. Deploying an initial version (v1.0) of an application
2. Using the application and building up some state
3. Updating the application with new code (v2.0)
4. Verifying the app ID stays the same and state is preserved
5. Understanding how update transactions execute

## What This Example Shows

### 1. Deploying the Initial Version

```typescript
// Helper function creates TEAL with template substitution
function createApprovalProgram(version: string): string {
  return `#pragma version 10

txn ApplicationID
int 0
==
bnz create

txn OnCompletion
int 4  // UpdateApplication
==
bnz handle_update

// ... method routing logic

create:
byte "version"
byte "${version}"  // Template substitution
app_global_put

byte "counter"
int 0
app_global_put

int 1
return

handle_update:
// Approve the update
int 1
return`
}

// Create and deploy v1.0
const approvalProgramV1 = createApprovalProgram('1.0')

const createResult = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: approvalProgramV1,
  clearStateProgram: clearProgram,
  schema: {
    globalInts: 1,
    globalByteSlices: 1,
    localInts: 0,
    localByteSlices: 0,
  },
})

const appId = createResult.appId
```

This creates a new application with:
- A version string in global state ("1.0")
- A counter initialized to 0
- Methods: `get_version()`, `get_counter()`, `increment()`

### 2. Using the Application (v1.0)

```typescript
// Get version
const versionResult = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId,
    method: getVersionMethod,
    args: [],
  })
  .send()

// Returns: "1.0"

// Increment counter multiple times
for (let i = 0; i < 3; i++) {
  await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: incrementMethod,
      args: [],
    })
    .send()
}

// Global state now shows:
//   version: "1.0"
//   counter: 3
```

### 3. Updating the Application

```typescript
// Create new TEAL code with version 2.0
const approvalProgramV2 = createApprovalProgram('2.0')

// Update the application
const updateResult = await algorand.send.appUpdate({
  sender: deployer.addr,
  appId,
  approvalProgram: approvalProgramV2,
  clearStateProgram: clearProgram,
})

// ✅ Update successful!
// App ID remains the same
// App address remains the same
```

### 4. What Happens During an Update

This is the key concept to understand:

**Update transactions execute using the OLD approval program, not the new one.**

When `appUpdate()` is called:

1. The transaction is created with `OnCompletion = UpdateApplication (4)`
2. The **OLD** approval program executes to validate the update
3. If the old program approves (returns 1), the update proceeds
4. The new approval and clear programs replace the old ones
5. State is preserved (unless the old program modifies it during validation)

In our TEAL code:

```teal
handle_update:
// This code runs during the update transaction
// But it's the OLD code running, not the new code!

// Approve the update
int 1
return
```

This means:
- ✅ The TEAL bytecode is replaced with v2.0 code
- ✅ Future method calls use the v2.0 code
- ❌ Global state `version` still shows "1.0" (wasn't updated)

**Why doesn't the version in global state change?**

The version string in global state was set to "1.0" during creation. During the bare update:
- The `handle_update` branch executes (from OLD code)
- It just returns 1 to approve - doesn't modify state
- So `version` remains "1.0"

The TEAL code now has `byte "2.0"` in the `create` branch, but that only runs on creation, not updates.

### 5. Verification After Update

```typescript
// Read application info
const appInfo = await algorand.client.algod.getApplicationByID(Number(appId)).do()

// Global state:
//   version: "1.0" (unchanged - see explanation above)
//   counter: 3 (preserved from v1.0!)

// App ID: same as before
// App address: same as before

// The TEAL code is now v2.0, but you can't see this from state
// You'd need to compare the bytecode to verify the update
```

### 6. Testing the Updated Application

```typescript
// Call methods on the updated app
const counterResult = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId,
    method: getCounterMethod,
    args: [],
  })
  .send()

// Returns: 3n (preserved!)

// Increment works with the new code
const incrementResult = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId,
    method: incrementMethod,
    args: [],
  })
  .send()

// Returns: 4n (working!)

// ✅ The application logic is now running v2.0 code
// ✅ State was preserved across the update
```

## API Reference

### `appCreate()` Method

Creates a new application:

```typescript
const createResult = await algorand.send.appCreate({
  sender: deployerAddress,
  approvalProgram: tealCode,       // Approval program (TEAL string or compiled bytes)
  clearStateProgram: clearCode,    // Clear state program
  schema: {
    globalInts: 1,                 // Number of uint64 values in global state
    globalByteSlices: 1,           // Number of byte slices in global state
    localInts: 0,                  // Number of uint64 values in local state
    localByteSlices: 0,            // Number of byte slices in local state
  },
  onComplete: OnApplicationComplete.NoOpOC,  // Optional, defaults to NoOp
  note: optionalNote,              // Optional note
  extraFee: optionalExtraFee,      // Optional extra fee
  lease: optionalLease,            // Optional lease
  rekeyTo: optionalRekeyAddress,   // Optional rekey
})

// Returns:
// {
//   appId: bigint,              // The created app ID
//   appAddress: string,         // The app's Algorand address
//   txIds: string[],            // Transaction IDs
//   // ... other fields
// }
```

### `appUpdate()` Method

Updates an existing application:

```typescript
const updateResult = await algorand.send.appUpdate({
  sender: deployerAddress,         // Must be the creator (or rekeyed account)
  appId: existingAppId,            // App ID to update
  approvalProgram: newTealCode,    // New approval program
  clearStateProgram: newClearCode, // New clear state program
  note: optionalNote,              // Optional note
  lease: optionalLease,            // Optional lease
  rekeyTo: optionalRekeyAddress,   // Optional rekey
})

// Returns:
// {
//   txIds: string[],            // Transaction IDs
//   // ... other fields
// }
```

**Important:** Only the creator can update the application (unless the creator has been rekeyed).

## Bare Updates vs. ABI Update Methods

### Bare Update (This Example)

```typescript
await algorand.send.appUpdate({
  sender: deployer.addr,
  appId,
  approvalProgram: newProgram,
  clearStateProgram: newClear,
})
```

**Characteristics:**
- Simple and straightforward
- Only replaces code, doesn't modify state
- OLD code executes to validate the update
- Suitable when you just need to swap code

### ABI Update Method (Example 131)

```typescript
const updateMethod = new algosdk.ABIMethod({
  name: 'update_version',
  args: [{ type: 'string', name: 'new_version' }],
  returns: { type: 'string' },
})

await algorand
  .newGroup()
  .addAppUpdateMethodCall({
    sender: deployer.addr,
    appId,
    approvalProgram: newProgram,
    clearStateProgram: newClear,
    method: updateMethod,
    args: ['2.0'],
  })
  .send()
```

**Characteristics:**
- Type-safe arguments
- Can modify state during update
- Can perform validation logic
- Can run migration code
- Better for complex updates

**When to use each:**

| Use Case | Bare Update | ABI Update Method |
|----------|-------------|-------------------|
| Simple code swap | ✓ | |
| Bug fix with no state changes | ✓ | |
| Add new methods | ✓ | |
| Update configuration in state | | ✓ |
| Migrate data format | | ✓ |
| Validate update parameters | | ✓ |
| Log update events | | ✓ |

## Updatable vs. Immutable Applications

### Making Apps Updatable

By default, applications are updatable by their creator:

```typescript
const createResult = await algorand.send.appCreate({
  sender: creator.addr,
  // ... other parameters
})

// Creator can update:
await algorand.send.appUpdate({
  sender: creator.addr,  // Must be the same address
  appId: createResult.appId,
  approvalProgram: newCode,
  clearStateProgram: newClear,
})
```

### Making Apps Immutable

To make an application immutable (cannot be updated):

**Option 1: Update to reject all future updates**

```teal
#pragma version 10

txn OnCompletion
int 4  // UpdateApplication
==
bnz reject_update

// ... rest of logic

reject_update:
int 0  // Reject all updates
return
```

After deploying this code, no further updates are possible.

**Option 2: Delete the creator's authority**

```typescript
// Rekey the creator to a zero address (irreversible!)
await algorand.send.appUpdate({
  sender: creator.addr,
  appId,
  approvalProgram: finalCode,
  clearStateProgram: finalClear,
  rekeyTo: algosdk.ALGORAND_ZERO_ADDRESS,  // Can never update again!
})
```

**Option 3: Multi-sig or governance-controlled updates**

```typescript
// Create app with a multi-sig account
const multisig = algosdk.multisigAddress({
  version: 1,
  threshold: 2,
  addrs: [addr1, addr2, addr3],
})

const createResult = await algorand.send.appCreate({
  sender: multisig,
  // ... parameters
})

// Updates now require 2 of 3 signatures
```

## Common Use Cases

### 1. Bug Fixes

**Scenario:** Production app has a logic bug that needs fixing

```typescript
// Original code has a bug
const buggyCode = `// ... logic with bug`

await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: buggyCode,
  clearStateProgram: clearCode,
  schema: mySchema,
})

// After discovering the bug, deploy a fix
const fixedCode = `// ... logic with bug fixed`

await algorand.send.appUpdate({
  sender: deployer.addr,
  appId,
  approvalProgram: fixedCode,
  clearStateProgram: clearCode,
})

// ✅ App ID unchanged
// ✅ Users don't need to change anything
// ✅ State preserved
```

### 2. Adding New Features

**Scenario:** Add a new method to an existing app

```typescript
// v1: Only has increment() and get_counter()
const v1Code = `// ... methods: increment, get_counter`

const createResult = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: v1Code,
  clearStateProgram: clearCode,
  schema: mySchema,
})

// v2: Add decrement() method
const v2Code = `// ... methods: increment, decrement, get_counter`

await algorand.send.appUpdate({
  sender: deployer.addr,
  appId: createResult.appId,
  approvalProgram: v2Code,
  clearStateProgram: clearCode,
})

// ✅ Existing users can still call increment() and get_counter()
// ✅ New users can also call decrement()
```

### 3. Changing Business Logic

**Scenario:** Update fee percentage or limits

```typescript
// v1: 1% fee
function createProgram(feeBps: number) {
  return `#pragma version 10

method_swap:
// Calculate fee
txna ApplicationArgs 1
btoi
int ${feeBps}  // 100 for 1%
*
int 10000
/
// ... process swap with fee
`
}

// Deploy with 1% fee
const v1 = createProgram(100)
await algorand.send.appCreate({ /* ... */ approvalProgram: v1 })

// Update to 0.5% fee
const v2 = createProgram(50)
await algorand.send.appUpdate({ /* ... */ approvalProgram: v2 })

// ✅ All future swaps use 0.5% fee
// ✅ No need to migrate to a new contract
```

### 4. Optimizing Performance

**Scenario:** Optimize TEAL code to reduce execution cost

```typescript
// v1: Inefficient code
const v1 = `// ... unoptimized logic with redundant operations`

await algorand.send.appCreate({ /* ... */ approvalProgram: v1 })

// v2: Optimized code
const v2 = `// ... optimized logic, fewer operations`

await algorand.send.appUpdate({ /* ... */ approvalProgram: v2 })

// ✅ Same functionality, lower costs
```

### 5. Gradual Rollout

**Scenario:** Test changes on a single app before rolling out widely

```typescript
// Deploy test app with new logic
const testApp = await algorand.send.appCreate({ /* ... v2 code */ })

// Test thoroughly on testApp
// ...

// Once confident, update production app
await algorand.send.appUpdate({
  appId: productionAppId,
  approvalProgram: v2Code,  // Same code as testApp
  // ...
})

// ✅ Tested changes deployed to production
```

## Security Considerations

### 1. Verify Updatability Requirements

**Before deployment**, decide if your app should be updatable:

✅ **Updatable** when:
- Development/testing phase
- Expecting to add features
- Might need bug fixes
- Business logic may change

❌ **Immutable** when:
- High-value financial contracts
- Completed and thoroughly tested
- Trust is critical (users need guarantees)
- No expected changes

### 2. Update Authorization

By default, only the creator can update. Consider:

```teal
#pragma version 10

txn OnCompletion
int 4  // UpdateApplication
==
bnz handle_update

// ... rest of logic

handle_update:
// Option 1: Only creator can update (default Algorand behavior)
// No extra check needed - Algorand enforces this

// Option 2: Multiple authorized updaters
txn Sender
byte "{{ADMIN_1_ADDRESS}}"
==
txn Sender
byte "{{ADMIN_2_ADDRESS}}"
==
||
assert

int 1
return

// Option 3: Governance vote required
// Check global state for vote approval
byte "update_approved"
app_global_get
assert

int 1
return
```

### 3. State Schema Compatibility

**Problem:** Updated code expects different state schema

```typescript
// v1: Uses 1 global int, 1 global byte slice
schema: {
  globalInts: 1,
  globalByteSlices: 1,
  localInts: 0,
  localByteSlices: 0,
}

// v2: Needs 2 global ints
// ❌ This will fail! Schema is fixed at creation
```

**Solution:** Plan schema ahead of time

```typescript
// Initial deployment: Allocate extra space for future use
schema: {
  globalInts: 5,        // Reserve space for future features
  globalByteSlices: 3,  // Reserve space
  localInts: 2,
  localByteSlices: 2,
}

// Unused state still costs (minimum balance)
// But allows future updates without migration
```

### 4. Testing Updates

Always test updates thoroughly:

```typescript
// 1. Deploy v1 to test network
const testV1 = await algorand.send.appCreate({ /* v1 */ })

// 2. Build up realistic state
// ... interact with the app

// 3. Update to v2
await algorand.send.appUpdate({ appId: testV1.appId, /* v2 */ })

// 4. Verify everything still works
// ... test all methods
// ... verify state is correct

// 5. Only after thorough testing, update production
await algorand.send.appUpdate({ appId: prodAppId, /* v2 */ })
```

### 5. Audit Trail

Consider logging updates:

```typescript
// In your app, emit events for updates
method_handle_update:
// Log update event
byte "Updated to version: "
byte "{{NEW_VERSION}}"
concat
log

// Approve update
int 1
return
```

Then monitor logs:

```typescript
const appCalls = await algorand.client.indexer
  .searchForTransactions()
  .applicationID(appId)
  .txType('appl')
  .do()

// Filter for UpdateApplication transactions
const updates = appCalls.transactions.filter(
  tx => tx['on-completion'] === 'update'
)

// Review update history
updates.forEach(update => {
  console.log(`Updated in round ${update['confirmed-round']}`)
  console.log(`By ${update.sender}`)
  // Check logs for version info
})
```

## Best Practices

### 1. Version Your Deployments

✅ **Good:**
```typescript
const versions = {
  '1.0': createProgram({ /* v1.0 config */ }),
  '1.1': createProgram({ /* v1.1 config */ }),
  '2.0': createProgram({ /* v2.0 config */ }),
}

// Deploy v1.0
await algorand.send.appCreate({ approvalProgram: versions['1.0'] })

// Update to v1.1
await algorand.send.appUpdate({ approvalProgram: versions['1.1'] })

// Clear versioning and config
```

❌ **Bad:**
```typescript
// Magic code with no version tracking
await algorand.send.appCreate({ approvalProgram: someCode })
await algorand.send.appUpdate({ approvalProgram: otherCode })
// What version is deployed? Unknown!
```

### 2. Document What Changed

✅ **Good:**
```typescript
/**
 * v2.0 Changes:
 * - Fixed integer overflow in transfer() method (line 45)
 * - Added new pause() method for emergency stops
 * - Optimized loop in calculate_reward() (30% gas savings)
 * - Updated fee from 1% to 0.5%
 */
const v2Code = createProgram({ /* ... */ })
```

❌ **Bad:**
```typescript
// Just updated code, no documentation
const newCode = createProgram({ /* ... */ })
```

### 3. Plan for Immutability

✅ **Good:**
```typescript
// Phase 1: Updatable during development
const v1 = createProgram({ allowUpdates: true })
await algorand.send.appCreate({ approvalProgram: v1 })

// ... testing and iteration

// Phase 2: Final version, make immutable
const vFinal = createProgram({ allowUpdates: false })
await algorand.send.appUpdate({ approvalProgram: vFinal })

// ✅ Now locked forever
```

❌ **Bad:**
```typescript
// Deployed as updatable, forgot to lock it
// Leaves security risk open indefinitely
```

### 4. Communicate Updates to Users

✅ **Good:**
```typescript
// Before update:
// - Announce update 1 week in advance
// - Share what's changing
// - Provide testing period on TestNet
// - Document migration if state changes

// After update:
// - Verify update successful
// - Monitor for issues
// - Provide support for any problems
```

### 5. Have a Rollback Plan

✅ **Good:**
```typescript
// Keep previous version readily available
const v1Code = createProgram({ version: '1.0' })
const v2Code = createProgram({ version: '2.0' })

// Update to v2
await algorand.send.appUpdate({ approvalProgram: v2Code })

// If issues found, can rollback to v1
await algorand.send.appUpdate({ approvalProgram: v1Code })

// ✅ Can quickly revert if needed
```

## Common Pitfalls

### 1. Forgetting State Schema is Fixed

**Problem:**
```typescript
// v1 schema
schema: {
  globalInts: 1,
  globalByteSlices: 1,
  localInts: 0,
  localByteSlices: 0,
}

// v2 needs more space
// ❌ Cannot change schema in update!
```

**Solution:**
- Allocate extra space initially
- Or plan to migrate users to a new app

### 2. Breaking Changes Without Migration

**Problem:**
```typescript
// v1: Stores balance as int
byte "balance"
int 1000
app_global_put

// v2: Expects balance as byte slice
byte "balance"
app_global_get
// ❌ This was stored as int, not bytes!
```

**Solution:**
- Use ABI update method to migrate data
- Or maintain backward compatibility

### 3. Not Testing the Update Path

**Problem:**
```typescript
// Tested v1 ✓
// Tested v2 ✓
// Never tested v1 → v2 upgrade! ❌
```

**Solution:**
```typescript
// Test the full workflow
const v1App = await deployV1()
await buildUpState(v1App)
await updateToV2(v1App)
await verifyV2Works(v1App)  // Test with v1's state!
```

### 4. Update Transaction Executes Old Code

**Problem:**
```typescript
// v2 TEAL has:
handle_update:
byte "version"
byte "2.0"
app_global_put
int 1
return

// After update, version still shows "1.0"
// Why? Because the update transaction ran v1 code!
```

**Solution:**
- Use ABI update method to modify state
- Or accept that bare updates don't modify state

### 5. Losing Update Authority

**Problem:**
```typescript
// Accidentally rekey creator
await algorand.send.appUpdate({
  // ...
  rekeyTo: someOtherAddress,
})

// ❌ Can no longer update! Lost control!
```

**Solution:**
- Be very careful with rekey operations
- Use multi-sig for important apps

### 6. Not Considering Minimum Balance

**Problem:**
```typescript
// Add lots of global state in update
// Each key/value pair costs minimum balance
// If app account doesn't have enough funds, update fails!
```

**Solution:**
```typescript
// Fund app account before update if adding state
await algorand.send.payment({
  sender: funder.addr,
  receiver: appAddress,
  amount: microAlgos(100_000),  // Cover new state
})

await algorand.send.appUpdate({ /* ... */ })
```

## Related Examples

- **Example 131**: Update application with ABI update method (shows how to modify state during update)
- **Example 132**: Update application with deploy-time parameters (shows template substitution)
- **Example 130**: Smart contract deployment with ABI creation method

## Resources

- [Algorand Smart Contract Guidelines](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/guidelines/)
- [Application Update Documentation](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#update-application)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [TEAL Language Specification](https://developer.algorand.org/docs/get-details/dapps/avm/teal/specification/)
