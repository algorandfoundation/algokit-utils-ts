# Replace an Application Using ABI Methods

This example demonstrates how to atomically replace an Algorand application by using custom ABI methods for both the delete and create operations. This pattern allows you to pass specific arguments to both operations and capture their return values, enabling custom cleanup and initialization logic.

## Overview

When replacing an application, you typically delete the old app and create a new one. By using ABI methods for these operations, you can:
- Pass custom arguments to both delete and create methods
- Capture and process return values from both operations
- Execute custom cleanup logic during deletion
- Initialize the new app with specific data during creation
- Perform both operations atomically in a single transaction group

This example shows the complete flow of replacing an application with two different versions, each with distinct logic.

## What You'll Learn

- Creating ABI methods for app creation and deletion (`create_abi`, `delete_abi`)
- Using `addAppDeleteMethodCall` and `addAppCreateMethodCall` together
- Passing arguments to ABI methods during replacement
- Capturing return values from both delete and create operations
- Atomic app replacement in a transaction group
- Verifying the old app is deleted and new app is created

## Key Concepts

### ABI Methods for App Lifecycle

Standard app creation and deletion don't allow custom arguments or return values. ABI methods provide this flexibility:

```typescript
// Standard delete - no arguments or return value
await algorand.send.appDelete({ appId, sender })

// ABI delete - with arguments and return value
await algorand.newGroup().addAppDeleteMethodCall({
  appId,
  sender,
  method: deleteAbiMethod,  // ABIMethod instance
  args: ['custom_arg'],     // Your custom arguments
})
```

### Transaction Group Structure

The replacement creates an atomic transaction group:

```
Transaction 0: Delete old app (delete_abi method)
Transaction 1: Create new app (create_abi method)
```

Both transactions succeed or fail together, ensuring atomic replacement.

### ABI Method Definitions

The contract defines methods with specific signatures:

```json
{
  "name": "create_abi",
  "args": [{ "type": "string", "name": "input" }],
  "returns": { "type": "string" }
}
```

In your TypeScript code, convert to `ABIMethod` instances:

```typescript
const createAbiMethod = new algosdk.ABIMethod(methodSpec)
```

## Example Walkthrough

### Step 1: Load Contract Specification

The example uses a contract specification (contract.json) that defines:
- `create_abi(string)string`: Method called during app creation
- `delete_abi(string)string`: Method called during app deletion

Both methods accept a string argument and return a string value.

### Step 2: Deploy Initial Application (Version 1)

Deploy the first version of the app with pre-compiled bytecode:

```typescript
const createResult = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: approvalV1Bytecode,  // Version 1 code
  clearStateProgram: clearBytecode,
  schema: { globalInts: 1, globalByteSlices: 0, ... },
})
```

Version 1 stores `version: 1` in global state.

### Step 3: Replace Application Using ABI Methods

Replace the app atomically by deleting the old one and creating a new one:

```typescript
const deleteAbiMethod = new algosdk.ABIMethod(
  appSpec.contract.methods.find((m) => m.name === 'delete_abi')!
)
const createAbiMethod = new algosdk.ABIMethod(
  appSpec.contract.methods.find((m) => m.name === 'create_abi')!
)

const replaceResult = await algorand
  .newGroup()
  .addAppDeleteMethodCall({
    sender: deployer.addr,
    appId: oldAppId,
    method: deleteAbiMethod,
    args: ['arg2_io'],  // Passed to delete_abi
  })
  .addAppCreateMethodCall({
    sender: deployer.addr,
    approvalProgram: approvalV2Bytecode,  // Version 2 code
    clearStateProgram: clearBytecode,
    schema: { globalInts: 1, globalByteSlices: 0, ... },
    method: createAbiMethod,
    args: ['arg_io'],  // Passed to create_abi
  })
  .send()
```

**Key Points:**
- Both operations are in a single atomic group
- Arguments are passed to both methods
- Return values are captured in `replaceResult.returns`

### Step 4: Verify Replacement Results

Extract information from the replacement result:

```typescript
// Get new app ID
const newAppId = replaceResult.confirmations?.[1]?.applicationIndex

// Get transaction IDs
const deleteThxId = replaceResult.txIds[0]
const createTxId = replaceResult.txIds[1]

// Get return values
const deleteReturn = replaceResult.returns[0].returnValue?.valueOf()  // 'arg2_io'
const createReturn = replaceResult.returns[1].returnValue?.valueOf()  // 'arg_io'
```

### Step 5: Verify Old App Is Deleted

Confirm the old app no longer exists:

```typescript
try {
  await algorand.app.getById(oldAppId)
  console.log('Old app still exists (unexpected)')
} catch (error) {
  console.log('Old app successfully deleted')
}
```

## Running the Example

### Prerequisites

```bash
# Start LocalNet
algokit localnet start

# Verify algod is running
curl http://localhost:4001/versions

# Install dependencies
npm install
```

### Execute

```bash
npm start
```

### Expected Output

```
=== Replace an Application Using ABI Methods ===

Using deployer account: RZG...PM

=== STEP 1: Loading Contract Specification ===

✅ Contract specification loaded
   Contract name: ReplaceApp
   Methods: create_abi, delete_abi

=== STEP 2: Deploying Initial Application ===

Deploying initial app (version 1)...
✅ Initial app deployed with ID: 1007n
   Global state "version": 1

=== STEP 3: Replacing Application Using ABI Methods ===

This will:
  1. Call delete_abi(string) on the old app with argument "arg2_io"
  2. Call create_abi(string) on the new app with argument "arg_io"
  3. Deploy version 2 of the app with updated code

Executing app replacement...
✅ App replacement successful!

=== STEP 4: Verifying Replacement Results ===

New app ID: 1008n

Transaction IDs:
  Delete transaction: X5DA...YSQ
  Create transaction: 7X7J...FQ

Return values:
  delete_abi returned: arg2_io
  create_abi returned: arg_io

=== STEP 5: Verifying Old App Is Deleted ===

✅ Old app successfully deleted
   App ID 1007n no longer exists on chain

=== Summary ===

✨ Example completed successfully!
```

## Common Use Cases

### 1. Application Versioning with Migration

Replace an app and migrate data during the transition:

```typescript
await algorand
  .newGroup()
  .addAppDeleteMethodCall({
    appId: oldAppId,
    method: deleteAbiMethod,
    args: [migrationDataHash],  // Pass migration data
  })
  .addAppCreateMethodCall({
    approvalProgram: newVersion,
    method: createAbiMethod,
    args: [migrationDataHash],  // Initialize with migrated data
  })
  .send()
```

### 2. Contract Architecture Change

Replace an app with breaking changes that can't be handled by update:

```typescript
// Old app: Uses global state for storage
// New app: Uses boxes for storage (breaking change)

const replaceResult = await algorand
  .newGroup()
  .addAppDeleteMethodCall({
    appId: oldAppId,
    method: deleteAbiMethod,
    args: ['cleanup_old_state'],
  })
  .addAppCreateMethodCall({
    approvalProgram: newBoxBasedApp,
    method: createAbiMethod,
    args: ['initialize_boxes'],
  })
  .send()
```

### 3. Cleanup and Initialization

Perform custom cleanup during deletion and initialization during creation:

```typescript
await algorand
  .newGroup()
  .addAppDeleteMethodCall({
    appId: oldAppId,
    method: deleteAbiMethod,
    args: ['return_funds_to_creator'],  // Custom cleanup logic
  })
  .addAppCreateMethodCall({
    approvalProgram: newApp,
    method: createAbiMethod,
    args: ['setup_with_config'],  // Custom initialization
  })
  .send()
```

### 4. Capture Return Values for Verification

Use return values to verify the replacement was successful:

```typescript
const result = await algorand
  .newGroup()
  .addAppDeleteMethodCall({
    appId: oldAppId,
    method: deleteAbiMethod,
    args: ['compute_final_state_hash'],
  })
  .addAppCreateMethodCall({
    approvalProgram: newApp,
    method: createAbiMethod,
    args: ['verify_state_hash'],
  })
  .send()

const oldStateHash = result.returns[0].returnValue?.valueOf()
const newStateHash = result.returns[1].returnValue?.valueOf()

if (oldStateHash === newStateHash) {
  console.log('State successfully migrated')
}
```

## Contract Implementation

### TEAL Contract Structure

The contract must implement both `create_abi` and `delete_abi` methods:

```teal
#pragma version 8

txn NumAppArgs
int 0
==
bnz main_bare_create

txna ApplicationArgs 0
pushbytes 0x9d523040 // "create_abi(string)string"
==
bnz main_create_abi

txna ApplicationArgs 0
pushbytes 0x271b4ee9 // "delete_abi(string)string"
==
bnz main_delete_abi

err

main_delete_abi:
txn OnCompletion
int 5 // DeleteApplication
==
assert
callsub delete_abi_impl
int 1
return

main_create_abi:
txn OnCompletion
int 0 // NoOp
==
txn ApplicationID
int 0
==
&&
assert
callsub create_abi_impl
int 1
return

// Implementation details...
```

### ABI Method Signatures

In your contract.json:

```json
{
  "contract": {
    "methods": [
      {
        "name": "create_abi",
        "args": [{ "type": "string", "name": "input" }],
        "returns": { "type": "string" }
      },
      {
        "name": "delete_abi",
        "args": [{ "type": "string", "name": "input" }],
        "returns": { "type": "string" }
      }
    ]
  },
  "hints": {
    "create_abi(string)string": {
      "call_config": { "no_op": "CREATE" }
    },
    "delete_abi(string)string": {
      "call_config": { "delete_application": "CALL" }
    }
  }
}
```

## Best Practices

### 1. Always Use Atomic Groups

Never delete and create separately - always use a transaction group:

```typescript
// ✅ Good: Atomic replacement
await algorand
  .newGroup()
  .addAppDeleteMethodCall({ ... })
  .addAppCreateMethodCall({ ... })
  .send()

// ❌ Bad: Non-atomic (could fail between operations)
await algorand.send.appDelete({ ... })
await algorand.send.appCreate({ ... })
```

### 2. Convert to ABIMethod Instances

Always convert method specs to `ABIMethod` instances:

```typescript
// ✅ Good: ABIMethod instance
const method = new algosdk.ABIMethod(methodSpec)

// ❌ Bad: Plain object (will cause errors)
const method = methodSpec
```

### 3. Handle Return Values

Check and validate return values:

```typescript
const result = await algorand.newGroup()...send()

if (result.returns && result.returns.length >= 2) {
  const deleteReturn = result.returns[0].returnValue?.valueOf()
  const createReturn = result.returns[1].returnValue?.valueOf()

  // Validate return values
  if (!deleteReturn || !createReturn) {
    throw new Error('Missing return values')
  }
}
```

### 4. Verify Old App Deletion

Always verify the old app is actually deleted:

```typescript
try {
  await algorand.app.getById(oldAppId)
  throw new Error('Old app was not deleted')
} catch (error) {
  // Expected - app no longer exists
}
```

### 5. Use Pre-compiled Bytecode for Complex Scenarios

For production use with template substitution, pre-compile your TEAL:

```typescript
// Pre-compile with template substitution
const tealWithParams = tealTemplate.replaceAll('TMPL_PARAM', value)
const compiled = await algorand.app.compileTeal(tealWithParams)

// Use compiled bytecode
const result = await algorand.send.appCreate({
  approvalProgram: compiled.compiledBase64ToBytes,
  ...
})
```

## Limitations and Considerations

### Transaction Group Limits

- Maximum 16 transactions per group
- Replacement uses 2 transactions (delete + create)
- Leave room for any additional transactions needed

### App ID Changes

- New app gets a new ID (sequential)
- Update any references to the old app ID
- Consider using app address for external references

### State Migration

- Global state is NOT automatically migrated
- Local state is lost when app is deleted
- Boxes are deleted with the app
- Plan your migration strategy in advance

### Atomicity

- Both operations succeed or both fail
- No partial state (old app deleted but new creation failed)
- Design your methods to be atomic-safe

## Troubleshooting

### "method.txnCount is not a function"

**Problem**: Passing plain method object instead of ABIMethod instance

**Solution**: Convert to ABIMethod:
```typescript
const method = new algosdk.ABIMethod(methodSpec)
```

### "Application does not exist"

**Problem**: Trying to verify old app after deletion

**Solution**: Wrap in try-catch:
```typescript
try {
  await algorand.app.getById(oldAppId)
} catch {
  console.log('App successfully deleted')
}
```

### "Cannot access property 'applicationIndex'"

**Problem**: Incorrect property access on confirmation

**Solution**: Use correct property name:
```typescript
const appId = result.confirmations?.[1]?.applicationIndex
```

### "Transaction rejected: OnCompletion mismatch"

**Problem**: Method call config doesn't match operation

**Solution**: Verify your contract.json hints:
```json
{
  "hints": {
    "create_abi(string)string": {
      "call_config": { "no_op": "CREATE" }  // Must be CREATE
    },
    "delete_abi(string)string": {
      "call_config": { "delete_application": "CALL" }  // Must be CALL
    }
  }
}
```

## Key Takeaways

1. **Custom Lifecycle Methods**: ABI methods enable custom arguments and return values for app creation and deletion
2. **Atomic Replacement**: Transaction groups ensure both operations succeed or fail together
3. **Return Value Capture**: Access return values from both delete and create operations
4. **State Migration**: Plan for state migration since it's not automatic
5. **ABIMethod Instances**: Always convert method specs to ABIMethod instances
6. **Production Ready**: This pattern is used in real applications for versioning and migrations

## Additional Resources

- [Algorand ABI Specification](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/ABI/)
- [Application Lifecycle](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Transaction Groups](https://developer.algorand.org/docs/get-details/atomic_transfers/)

## Related Examples

- Example 138: Full App Lifecycle (Create, Update, Delete)
- Example 141: Nested Method Calls with Transaction Arguments
- Example 142: Parallel Nested Method Calls with Transaction Arguments

---

This example demonstrates production-ready patterns for atomically replacing Algorand applications using custom ABI methods for complete control over the replacement process.
