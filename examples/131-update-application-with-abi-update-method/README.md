# Update Application with ABI Update Method

This example demonstrates how to **update an existing smart contract application** using an ABI method call during the update transaction.

## Core Concept

After deploying a smart contract to Algorand, you may need to update its logic to fix bugs, add features, or improve performance. Application updates allow you to:

- **Replace Programs**: Deploy new approval and clear state programs
- **Maintain Identity**: Keep the same app ID and app address
- **Preserve State**: Retain all existing global and local state
- **Validate Updates**: Optionally call an ABI method during update for validation or migration
- **Control Access**: Only the creator (or rekey authority) can perform updates

Using an **ABI update method** provides additional benefits:
- **Type Safety**: Pass typed arguments during the update
- **Validation**: Verify update conditions before accepting new code
- **Migration**: Perform state transformations or cleanup
- **Auditing**: Log update events with detailed information
- **Confirmation**: Return values to confirm successful updates

This example shows the complete update workflow:
1. Creating an initial application (v1.0)
2. Updating it with new logic (v2.0) using an ABI method
3. Verifying the update preserved app identity and state
4. Testing new features added in the update

## What This Example Shows

### 1. Creating the Initial Application

```typescript
const createResult = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: approvalProgramV1,
  clearStateProgram: clearProgram,
  schema: {
    globalInts: 1,
    globalByteSlices: 2,
    localInts: 0,
    localByteSlices: 0,
  },
})

const appId = createResult.appId
const appAddress = algosdk.getApplicationAddress(appId)
```

The initial v1.0 application:
- Stores a version string ("1.0") in global state
- Stores a value (100) in global state
- Provides `get_version()` and `get_value()` methods
- Supports updates via `update_version(string)` ABI method

### 2. Updating with an ABI Method

```typescript
const updateVersionMethod = new algosdk.ABIMethod({
  name: 'update_version',
  args: [{ type: 'string', name: 'new_version' }],
  returns: { type: 'string' },
})

const updateResult = await algorand
  .newGroup()
  .addAppUpdateMethodCall({
    sender: deployer.addr,
    appId,
    approvalProgram: approvalProgramV2,
    clearStateProgram: clearProgram,
    method: updateVersionMethod,
    args: ['2.0'],
  })
  .send()
```

The `addAppUpdateMethodCall` method:
- Replaces the approval and clear state programs
- Calls the specified ABI method during the update transaction
- Sets `OnCompletion` to `UpdateApplication` automatically
- Passes type-safe arguments to the update method
- Returns the method's return value

### 3. Receiving Return Values from Update

```typescript
if (updateResult.returns && updateResult.returns.length > 0) {
  const returnValue = updateResult.returns[0]
  console.log('Value:', returnValue.returnValue)
  // Output: "Successfully updated to version: 2.0"
}
```

The update method can return values to confirm the update or provide migration results.

### 4. TEAL Implementation for Updates

The TEAL code needs to handle both regular calls and updates:

```teal
// Check for update transactions
txn OnCompletion
int 4  // UpdateApplication
==
bnz handle_update

handle_update:
// Check if this is an ABI method call update
txn NumAppArgs
int 0
>
bnz abi_update

// Bare update (no ABI method)
int 1
return

abi_update:
// Verify the ABI method selector
txn ApplicationArgs 0
method "update_version(string)string"
==
bnz method_update_version

// Unknown update method
int 0
return

method_update_version:
// Extract new version from arguments
txna ApplicationArgs 1
extract 2 0  // Skip ABI length prefix

// Update version in global state
byte "version"
swap
app_global_put

// Return success message
// ... (encode and log ABI return value)
int 1
return
```

### 5. Verifying the Update

After updating, you can verify the changes:

```typescript
// App ID and address unchanged
console.log('App ID:', appId)  // Still 1173n
console.log('App Address:', appAddress)  // Still the same

// State preserved and updated
const appInfo = await algorand.client.algod.getApplicationByID(Number(appId)).do()
// Shows:
//   version: "2.0" (updated)
//   value: 100 (preserved)
//   creator: <address> (preserved)
```

### 6. Testing New Features

The v2.0 update adds a new `increment()` method that wasn't in v1.0:

```typescript
const incrementMethod = new algosdk.ABIMethod({
  name: 'increment',
  args: [],
  returns: { type: 'uint64' },
})

const incrementResult = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId,
    method: incrementMethod,
    args: [],
  })
  .send()

// New value: 101n (incremented from 100)
```

## Common Use Cases

### 1. Bug Fixes with Validation

Update the contract to fix a bug, validating the fix during update:

```typescript
const updateMethod = new algosdk.ABIMethod({
  name: 'update_with_fix',
  args: [{ type: 'string', name: 'fix_description' }],
  returns: { type: 'bool' },
})

const updateResult = await algorand
  .newGroup()
  .addAppUpdateMethodCall({
    sender: deployer.addr,
    appId,
    approvalProgram: fixedProgram,
    clearStateProgram: clearProgram,
    method: updateMethod,
    args: ['Fixed overflow vulnerability in calculation'],
  })
  .send()

// Returns true if fix was applied successfully
```

### 2. State Migration

Perform state transformations during the update:

```typescript
const migrateMethod = new algosdk.ABIMethod({
  name: 'migrate_to_v2',
  args: [],
  returns: { type: 'string' },
})

// Update method in TEAL:
// - Reads old state format
// - Transforms to new format
// - Returns migration summary

const result = await algorand
  .newGroup()
  .addAppUpdateMethodCall({
    sender: deployer.addr,
    appId,
    approvalProgram: v2Program,
    clearStateProgram: clearProgram,
    method: migrateMethod,
    args: [],
  })
  .send()

// Returns: "Migrated 15 accounts to new format"
```

### 3. Feature Addition with Configuration

Add new features and configure them during update:

```typescript
const addFeatureMethod = new algosdk.ABIMethod({
  name: 'add_feature',
  args: [
    { type: 'string', name: 'feature_name' },
    { type: 'bool', name: 'enabled' },
  ],
  returns: { type: 'string' },
})

const result = await algorand
  .newGroup()
  .addAppUpdateMethodCall({
    sender: deployer.addr,
    appId,
    approvalProgram: enhancedProgram,
    clearStateProgram: clearProgram,
    method: addFeatureMethod,
    args: ['premium_access', true],
  })
  .send()

// Returns: "Feature 'premium_access' enabled"
```

### 4. Version Tracking

Track version history in global state:

```typescript
const updateWithVersionMethod = new algosdk.ABIMethod({
  name: 'update_version',
  args: [
    { type: 'string', name: 'new_version' },
    { type: 'string', name: 'changelog' },
  ],
  returns: { type: 'string' },
})

const result = await algorand
  .newGroup()
  .addAppUpdateMethodCall({
    sender: deployer.addr,
    appId,
    approvalProgram: newProgram,
    clearStateProgram: clearProgram,
    method: updateWithVersionMethod,
    args: ['2.1.0', 'Added multi-signature support'],
  })
  .send()

// Update method stores version and changelog
```

### 5. Conditional Updates

Only allow updates if certain conditions are met:

```typescript
const conditionalUpdateMethod = new algosdk.ABIMethod({
  name: 'update_if_safe',
  args: [{ type: 'uint64', name: 'min_balance' }],
  returns: { type: 'bool' },
})

// TEAL checks:
// - App balance meets minimum
// - No pending transactions
// - Safety checks pass

const result = await algorand
  .newGroup()
  .addAppUpdateMethodCall({
    sender: deployer.addr,
    appId,
    approvalProgram: safeProgram,
    clearStateProgram: clearProgram,
    method: conditionalUpdateMethod,
    args: [1000000],  // Require 1 ALGO minimum
  })
  .send()

// Returns true if update was safe and applied
```

## API Reference

### `addAppUpdateMethodCall(params)`

Updates an existing application with new programs and calls an ABI method.

**Parameters:**
- `sender` (string): Address of the account performing the update (must be creator)
- `appId` (bigint): Application ID to update
- `approvalProgram` (string | Uint8Array): New TEAL approval program
- `clearStateProgram` (string | Uint8Array): New TEAL clear state program
- `method` (ABIMethod): The ABI method to call during update
- `args` (Array): Arguments matching the method signature
- `note` (optional, Uint8Array): Transaction note
- `lease` (optional, Uint8Array): Transaction lease
- `rekeyTo` (optional, string): Rekey account to this address

**Returns:**
- `SendAtomicTransactionComposerResults` containing:
  - `txIds`: Array of transaction IDs
  - `confirmations`: Array of pending transaction confirmations
  - `returns`: Array of ABI method return values (if applicable)
  - `groupId`: The group ID of the atomic transaction group

**Important:**
- Only the application creator can update (unless rekeyed)
- The update transaction sets `OnCompletion` to `UpdateApplication` (value 4)
- Schema cannot be changed after creation
- All existing global and local state is preserved

### Update Transaction Anatomy

An update transaction with ABI method call includes:

```typescript
{
  type: 'appl',  // Application call
  sender: '<creator-address>',
  appId: <app-id>,
  onCompletion: 4,  // UpdateApplication
  approvalProgram: '<new-approval-program>',
  clearStateProgram: '<new-clear-program>',
  appArgs: [
    '<method-selector>',  // 4-byte ABI method selector
    '<arg1>',             // ABI-encoded argument 1
    '<arg2>',             // ABI-encoded argument 2
    // ...
  ]
}
```

## What Happens Under the Hood

When you call `addAppUpdateMethodCall`:

1. **Method Selector Computation**: SDK computes the 4-byte selector from `"update_version(string)string"`

2. **Argument Encoding**: Arguments are ABI-encoded
   - `"2.0"` → `0x000232.30` (length + UTF-8 bytes)

3. **Transaction Construction**: An update transaction is built with:
   - `OnCompletion`: `UpdateApplication` (4)
   - `ApplicationArgs[0]`: Method selector
   - `ApplicationArgs[1]`: ABI-encoded argument
   - `ApprovalProgram`: New compiled approval program
   - `ClearStateProgram`: New compiled clear program

4. **TEAL Execution**: The **old** approval program runs:
   - Checks `OnCompletion == 4` (update)
   - Verifies method selector matches
   - Decodes and processes arguments
   - Performs validation or migration
   - Approves the update (returns 1)
   - Logs ABI-encoded return value

5. **Program Replacement**: If TEAL approves:
   - New approval program replaces old one
   - New clear program replaces old one
   - App ID and address stay the same
   - All state is preserved

6. **Return Value Decoding**: SDK:
   - Reads transaction logs
   - Finds ABI-encoded return value
   - Decodes according to method's return type
   - Makes available in `result.returns`

## Best Practices

### 1. Always Implement Update Logic in TEAL

✅ **Good:**
```teal
// Handle updates explicitly
txn OnCompletion
int 4  // UpdateApplication
==
bnz handle_update

handle_update:
// Validate who can update
txn Sender
byte "creator"
app_global_get
==
assert  // Only creator can update

int 1
return
```

❌ **Bad:**
```teal
// No update handling - defaults to approval
// Anyone could update if they get creator access
```

**Why:** Explicit update handling prevents unauthorized updates and allows validation.

### 2. Validate Update Conditions

✅ **Good:**
```teal
method_update_version:
// Check app isn't paused
byte "paused"
app_global_get
int 0
==
assert  // Must not be paused

// Check minimum balance
global CurrentApplicationAddress
balance
int 1000000  // 1 ALGO
>=
assert  // Must have minimum balance

// Proceed with update
// ...
```

❌ **Bad:**
```teal
method_update_version:
// No validation - accept any update
int 1
return
```

**Why:** Validation ensures updates happen only when safe and appropriate.

### 3. Preserve Critical State

✅ **Good:**
```teal
method_migrate:
// Read existing value
byte "total_supply"
app_global_get

// Transform if needed
// ... migration logic

// Store in new format
byte "supply_v2"
swap
app_global_put

// Keep original as backup
byte "total_supply_backup"
byte "total_supply"
app_global_get
app_global_put
```

❌ **Bad:**
```teal
method_migrate:
// Delete old state without backup
byte "total_supply"
app_global_del

// Hope new logic works
```

**Why:** Preserving state prevents data loss and allows rollback if needed.

### 4. Return Meaningful Update Confirmations

✅ **Good:**
```typescript
returns: { type: 'string', desc: 'Detailed update summary' }
// Returns: "Updated to v2.0: migrated 42 accounts, added 3 features"
```

❌ **Bad:**
```typescript
returns: { type: 'void' }
// No confirmation of what happened
```

**Why:** Return values provide immediate feedback on update success and details.

### 5. Test Updates on TestNet First

✅ **Good:**
```typescript
// 1. Deploy v1.0 to TestNet
// 2. Test update to v2.0 on TestNet
// 3. Verify all functionality works
// 4. Deploy to MainNet only after TestNet success
```

❌ **Bad:**
```typescript
// Deploy directly to MainNet and update in production
```

**Why:** Testing prevents catastrophic failures on MainNet.

### 6. Document Update Methods

✅ **Good:**
```typescript
/**
 * Update method: update_version
 *
 * Signature: update_version(string)string
 *
 * Called during application updates to validate and record version change.
 *
 * @param new_version - Semantic version string (e.g., "2.0.0")
 * @returns Success message with version confirmation
 *
 * Validation:
 * - Version must be higher than current
 * - App must not be paused
 * - Caller must be creator
 *
 * State changes:
 * - Updates "version" global state
 * - Logs update event
 */
const updateMethod = new algosdk.ABIMethod({
  name: 'update_version',
  args: [{ type: 'string', name: 'new_version' }],
  returns: { type: 'string' },
})
```

❌ **Bad:**
```typescript
const updateMethod = new algosdk.ABIMethod({
  name: 'update_version',
  args: [{ type: 'string' }],
  returns: { type: 'string' },
})
```

**Why:** Documentation helps other developers understand update requirements.

### 7. Use Unique Transaction Notes

When making multiple similar calls, add unique notes to avoid transaction ID collisions:

✅ **Good:**
```typescript
const result1 = await algorand
  .newGroup()
  .addAppCallMethodCall({
    // ... params
    note: new TextEncoder().encode('check-version-v2'),
  })
  .send()

const result2 = await algorand
  .newGroup()
  .addAppCallMethodCall({
    // ... params
    note: new TextEncoder().encode('check-value-v2'),
  })
  .send()
```

❌ **Bad:**
```typescript
// Same parameters, no note differentiation
const result1 = await algorand.newGroup().addAppCallMethodCall({...}).send()
const result2 = await algorand.newGroup().addAppCallMethodCall({...}).send()
// Error: transaction already in ledger
```

**Why:** Identical transactions generate the same transaction ID, causing collisions.

## Common Pitfalls

### 1. Forgetting Update Permissions

**Problem:**
```teal
// No update handling in TEAL
txn ApplicationID
int 0
>
return
```

**Result:** Default approval allows anyone to update if they have access.

**Solution:**
```teal
txn OnCompletion
int 4  // UpdateApplication
==
bnz handle_update

handle_update:
txn Sender
global CreatorAddress
==
assert  // Only creator can update
int 1
return
```

### 2. Breaking State Compatibility

**Problem:**
```typescript
// v2.0 changes state key names
// Old: "total_supply"
// New: "supply"
```

**Result:** Existing state under "total_supply" becomes inaccessible.

**Solution:**
```teal
// Migration method reads old key, copies to new key
byte "supply"
byte "total_supply"
app_global_get
app_global_put
```

### 3. Schema Mismatch

**Problem:**
```typescript
// v1.0 schema
schema: {
  globalInts: 1,
  globalByteSlices: 2,
}

// v2.0 tries to use 3 byte slices
// TEAL: app_global_put for 3rd byte slice
```

**Result:** Transaction fails with "store exceeds schema".

**Solution:** Schema is fixed at creation. Design with future needs in mind or use composite values.

### 4. No Version Tracking

**Problem:**
```typescript
// No version info in state
// Can't tell which version is deployed
```

**Result:** Unclear which features are available.

**Solution:**
```teal
// Store version during create and update
byte "version"
byte "2.0.0"
app_global_put
```

### 5. Incomplete Update Validation

**Problem:**
```teal
method_update:
// Accept any update
int 1
return
```

**Result:** Potentially unsafe updates get accepted.

**Solution:**
```teal
method_update:
// Verify not paused
byte "paused"
app_global_get
!
assert

// Verify balance sufficient
global CurrentApplicationAddress
balance
int 100000
>=
assert

// Verify caller is creator
txn Sender
global CreatorAddress
==
assert

int 1
return
```

### 6. Not Testing Rollback Scenarios

**Problem:**
```typescript
// Update without considering how to rollback
```

**Result:** Stuck on broken version with no recovery plan.

**Solution:**
```typescript
// Before updating:
// 1. Test rollback on TestNet
// 2. Keep old program code
// 3. Have emergency rollback plan
// 4. Consider multi-sig for updates
```

### 7. Missing Update Notifications

**Problem:**
```teal
method_update:
// Update succeeds but no logs
int 1
return
```

**Result:** No audit trail of updates.

**Solution:**
```teal
method_update:
// Log update event
byte "Updated to version: "
txna ApplicationArgs 1
extract 2 0
concat
log

// Return confirmation
// ... (ABI encode and log)
int 1
return
```

## Update vs. Create vs. Delete

| Aspect | Create | Update | Delete |
|--------|--------|--------|--------|
| **App ID** | Generated (new) | Unchanged | Released (freed) |
| **App Address** | Generated (new) | Unchanged | Released (freed) |
| **Approval Program** | Set initially | Replaced | Removed |
| **Clear Program** | Set initially | Replaced | Removed |
| **Global State** | Initialized | Preserved | Cleared |
| **Local State** | Not yet allocated | Preserved | Must be cleared first |
| **Schema** | Defined | Cannot change | N/A |
| **Creator** | Transaction sender | Cannot change | Must be creator |
| **OnCompletion** | NoOp or OptIn | UpdateApplication (4) | DeleteApplication (5) |
| **ABI Method** | Optional (creation method) | Optional (update method) | Not supported |
| **Reversibility** | Not applicable | Can update again | Permanent |

## When to Use ABI Update Methods

**Use ABI update methods when:**
- You need to validate update prerequisites
- You want to perform state migration or transformation
- You need to log detailed update information
- You want type-safe update parameters
- You need confirmation of update success

**Use bare updates when:**
- No validation or migration is needed
- Update is simple program replacement
- Simpler TEAL code is preferred
- No arguments needed for the update

## Security Considerations

### 1. Access Control

Always verify the updater's identity:
```teal
txn Sender
global CreatorAddress
==
assert  // Only creator can update
```

Consider multi-signature for critical applications:
```teal
// Require 2 of 3 signatures
// ... multi-sig verification logic
```

### 2. State Validation

Verify state integrity before accepting updates:
```teal
// Ensure total supply hasn't changed
byte "total_supply"
app_global_get
int <expected-value>
==
assert
```

### 3. Upgrade Safeguards

Implement safety checks:
```teal
// Prevent updates during active operations
byte "active_operations"
app_global_get
int 0
==
assert  // No active operations

// Require minimum time between updates
byte "last_update"
app_global_get
global LatestTimestamp
swap
-
int 86400  // 24 hours
>=
assert
```

### 4. Emergency Procedures

Plan for emergencies:
- Keep old program code for rollback
- Have multi-sig control for critical apps
- Test updates thoroughly on TestNet
- Monitor application behavior after updates
- Have communication plan for users

## Related Examples

- **Example 130**: Smart contract deployment with ABI creation method
- **Example 24**: Basic ABI method calls (non-creation/update)
- **Example 25**: ABI method calls with transaction arguments
- **Example 129**: Simulating transactions before sending

## Resources

- [Algorand Application Update Documentation](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#update-application)
- [ABI Specification](https://arc.algorand.foundation/ARCs/arc-0004)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [TEAL OnCompletion Values](https://developer.algorand.org/docs/get-details/dapps/avm/teal/specification/#oncomplete)
