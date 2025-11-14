# Replace Application with Custom ABI Methods

This example demonstrates using custom ABI methods for application creation and deletion instead of bare calls.

## Core Concept

When creating or deleting an Algorand application, you have two options:

1. **Bare Calls**: Simple creation/deletion with no arguments or return values
2. **ABI Methods**: Custom methods that can accept arguments, execute complex logic, and return values

This example shows how to use custom ABI methods during the application lifecycle, enabling:
- Initialization with configuration parameters
- Validation during setup
- Capturing return values from creation/deletion
- Executing complex setup/cleanup logic
- Auditable application lifecycle events

## Why Use Custom ABI Methods?

### Bare App Creation
```typescript
// Simple bare creation - no customization
await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram,
  clearStateProgram,
  schema: { ... },
})
```

**Limitations**:
- ❌ No initialization arguments
- ❌ No return values
- ❌ No custom setup logic
- ❌ Cannot validate configuration

### ABI Method App Creation
```typescript
// Custom ABI creation with arguments and return values
const createResult = await algorand
  .newGroup()
  .addAppCreateMethodCall({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram,
    schema: { ... },
    method: createAbiMethod,  // Define custom ABI method
    args: ['Hello from ABI create!'],  // Pass arguments
  })
  .send()

// Capture return value
const returnValue = createResult.returns?.[0]?.returnValue
console.log('Created:', returnValue)  // "Created successfully"
```

**Benefits**:
- ✅ Pass initialization arguments
- ✅ Return confirmation values
- ✅ Execute complex setup logic in TEAL
- ✅ Validate configuration on-chain
- ✅ Type-safe parameter passing
- ✅ Capture creation metadata

## Key API Pattern

### 1. Define ABI Methods

```typescript
import algosdk from 'algosdk'

// Define custom create method
const createAbiMethod = new algosdk.ABIMethod({
  name: 'create_abi',
  args: [{
    type: 'string',
    name: 'init_msg',
    desc: 'Initialization message'
  }],
  returns: {
    type: 'string',
    desc: 'Creation confirmation'
  },
})

// Define custom delete method
const deleteAbiMethod = new algosdk.ABIMethod({
  name: 'delete_abi',
  args: [{
    type: 'string',
    name: 'cleanup_msg',
    desc: 'Cleanup message'
  }],
  returns: {
    type: 'string',
    desc: 'Deletion confirmation'
  },
})
```

### 2. Implement TEAL Logic

```teal
#pragma version 10

// Check for ABI method calls FIRST (before checking ApplicationID)
txn NumAppArgs
int 0
>
bnz check_method_calls

// No app args, check if it's a bare creation
txn ApplicationID
int 0
==
bnz handle_create

// Handle regular delete
txn OnCompletion
int DeleteApplication
==
bnz handle_delete

// Default: approve
int 1
return

check_method_calls:
// Check which ABI method is being called
txn ApplicationArgs 0
method "create_abi(string)string"
==
bnz method_create_abi

txn ApplicationArgs 0
method "delete_abi(string)string"
==
bnz method_delete_abi

// Unknown method, reject
int 0
return

method_create_abi:
// Get the input argument (skip length prefix)
txn ApplicationArgs 1
extract 2 0

// Store it in global state
byte "init_value"
swap
app_global_put

// Store status
byte "status"
byte "created_abi"
app_global_put

// Return ABI response
byte "Created successfully"
dup
len
itob
extract 6 2
swap
concat
byte 0x151f7c75  // ABI return prefix
swap
concat
log

int 1
return

method_delete_abi:
// Get the input argument
txn ApplicationArgs 1
extract 2 0

// Log the cleanup message
byte "Cleanup with: "
swap
concat
log

// Return ABI response
byte "Deleted successfully"
dup
len
itob
extract 6 2
swap
concat
byte 0x151f7c75  // ABI return prefix
swap
concat
log

int 1
return
```

**Important TEAL Pattern**:
- Check for `NumAppArgs > 0` BEFORE checking `ApplicationID == 0`
- This allows ABI methods to work during creation
- Without this, creation always jumps to bare creation handler

### 3. Create App with Custom ABI Method

```typescript
const createResult = await algorand
  .newGroup()
  .addAppCreateMethodCall({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram,
    schema: {
      globalInts: 0,
      globalByteSlices: 2,  // For status and init_value
      localInts: 0,
      localByteSlices: 0,
    },
    method: createAbiMethod,
    args: ['Hello from ABI create!'],
  })
  .send()

// Extract app ID from confirmations
const appId = createResult.confirmations[0].applicationIndex!

// Get return value
const createReturnValue = createResult.returns?.[0]?.returnValue
console.log('create_abi returned:', createReturnValue)
```

### 4. Delete App with Custom ABI Method

```typescript
const deleteResult = await algorand
  .newGroup()
  .addAppDeleteMethodCall({
    sender: deployer.addr,
    appId: appId,
    method: deleteAbiMethod,
    args: ['Goodbye from ABI delete!'],
  })
  .send()

// Get return value
const deleteReturnValue = deleteResult.returns?.[0]?.returnValue
console.log('delete_abi returned:', deleteReturnValue)
```

## Transaction Flow

### ABI Method Creation Flow

```
1. User → AlgorandClient.newGroup()
   └─ Creates transaction group composer

2. User → .addAppCreateMethodCall({...})
   ├─ Builds application creation transaction
   ├─ Sets approval and clear programs
   ├─ Defines schema
   ├─ Encodes method selector + arguments
   │  └─ Method selector: first 4 bytes of keccak256("create_abi(string)string")
   │  └─ Argument: ABI-encoded string
   └─ Sets OnCompletion to NoOp (0)

3. User → .send()
   ├─ Signs transaction with deployer account
   ├─ Submits to network
   └─ Waits for confirmation

4. Network → TEAL Execution
   ├─ Checks NumAppArgs > 0 (true, we have method args)
   ├─ Branches to check_method_calls
   ├─ Matches method selector to "create_abi(string)string"
   ├─ Branches to method_create_abi
   ├─ Extracts string argument
   ├─ Stores in global state
   ├─ Formats ABI return value
   └─ Logs return value

5. Network → AlgorandClient
   ├─ Confirms transaction in block
   ├─ Returns PendingTransactionResponse
   │  ├─ applicationIndex: 1043n
   │  ├─ globalStateDelta: [status, init_value]
   │  └─ logs: [ABI return value]
   └─ Returns SendTransactionResult
      ├─ confirmations[0].applicationIndex
      ├─ returns[0].returnValue (decoded from logs)
      └─ txIds[0]

6. User → Receives Result
   ├─ appId: 1043n
   ├─ returnValue: "Created successfully"
   └─ globalState: { status: "created_abi", init_value: "Hello from ABI create!" }
```

### ABI Method Deletion Flow

```
1. User → AlgorandClient.newGroup()
   └─ Creates transaction group composer

2. User → .addAppDeleteMethodCall({...})
   ├─ Builds application call transaction
   ├─ Sets appId to existing application
   ├─ Encodes method selector + arguments
   │  └─ Method selector: first 4 bytes of keccak256("delete_abi(string)string")
   │  └─ Argument: ABI-encoded string
   └─ Sets OnCompletion to DeleteApplication (5)

3. User → .send()
   ├─ Signs transaction
   └─ Submits to network

4. Network → TEAL Execution
   ├─ Checks NumAppArgs > 0 (true)
   ├─ Branches to check_method_calls
   ├─ Matches method selector to "delete_abi(string)string"
   ├─ Branches to method_delete_abi
   ├─ Extracts string argument
   ├─ Logs cleanup message with argument
   ├─ Formats ABI return value
   ├─ Logs return value
   └─ Returns 1 (approve)

5. Network → Deletes Application
   ├─ Removes global state
   ├─ Frees storage
   └─ App no longer exists

6. User → Receives Result
   ├─ returnValue: "Deleted successfully"
   ├─ txId: "VLSG..."
   └─ App is deleted
```

## Understanding ABI Return Values

### How ABI Returns Work

ABI methods return values by logging them in a specific format:

```teal
// Return format: ABI_RETURN_PREFIX + length_prefix + value
byte 0x151f7c75      // ABI return hash prefix
byte "Created successfully"
dup
len                  // Get string length
itob                 // Convert to bytes
extract 6 2          // Get 2-byte length prefix
swap                 // Put length before value
concat               // Combine: length + value
swap                 // Put prefix first
concat               // Final: 0x151f7c75 + length + value
log                  // Log it
```

The SDK automatically:
1. Scans transaction logs for the ABI return prefix
2. Extracts the returned value
3. Decodes it according to the method's return type
4. Provides it in `result.returns[0].returnValue`

### Accessing Return Values

```typescript
const result = await algorand
  .newGroup()
  .addAppCreateMethodCall({ method, args, ... })
  .send()

// Option 1: Access decoded return value
const returnValue = result.returns?.[0]?.returnValue
console.log(returnValue)  // "Created successfully" (string)

// Option 2: Check for decode errors
if (result.returns?.[0]?.decodeError) {
  console.error('Failed to decode return value:',
                result.returns[0].decodeError)
}

// Option 3: Access raw logs
const logs = result.confirmations[0].logs
console.log('Raw logs:', logs)  // [Uint8Array]
```

## Use Cases for Custom ABI Methods

### 1. Initialization with Configuration

**Scenario**: Deploy a token contract with admin, supply, and fee rate

```typescript
const method = new algosdk.ABIMethod({
  name: 'create_with_config',
  args: [
    { type: 'address', name: 'admin' },
    { type: 'uint64', name: 'initial_supply' },
    { type: 'uint64', name: 'fee_basis_points' },
  ],
  returns: { type: 'bool' },
})

await algorand
  .newGroup()
  .addAppCreateMethodCall({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram,
    schema: { ... },
    method,
    args: [
      adminAddress,
      1000000n,  // 1M tokens
      250n,      // 2.5% fee
    ],
  })
  .send()
```

**Benefits**:
- All configuration in one atomic transaction
- On-chain validation of admin address
- Immediate readiness after creation

### 2. Cleanup with State Migration

**Scenario**: Delete old app while pointing to replacement

```typescript
const method = new algosdk.ABIMethod({
  name: 'delete_with_migration',
  args: [
    { type: 'uint64', name: 'new_app_id' },
    { type: 'bool', name: 'migration_complete' },
  ],
  returns: { type: '(uint64,uint64)' },  // (old_balance, final_round)
})

const result = await algorand
  .newGroup()
  .addAppDeleteMethodCall({
    sender: deployer.addr,
    appId: oldAppId,
    method,
    args: [newAppId, true],
  })
  .send()

const [oldBalance, finalRound] = result.returns[0].returnValue
console.log(`Migrated from app ${oldAppId} to ${newAppId}`)
console.log(`Final balance: ${oldBalance}, Round: ${finalRound}`)
```

**Benefits**:
- Record migration metadata
- Verify migration completed before deletion
- Return final state for auditing

### 3. Conditional Creation with Validation

**Scenario**: Create app only if requirements are met

```typescript
const method = new algosdk.ABIMethod({
  name: 'create_if_valid',
  args: [
    { type: 'uint64', name: 'required_version' },
    { type: 'uint64[]', name: 'feature_flags' },
    { type: 'address', name: 'dependency_app' },
  ],
  returns: { type: 'string' },
})

// TEAL validates:
// - Version compatibility
// - Dependency app exists
// - Feature flags are valid
// Returns configuration summary or rejects

const result = await algorand
  .newGroup()
  .addAppCreateMethodCall({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram,
    schema: { ... },
    method,
    args: [
      2n,  // version
      [1n, 4n, 7n],  // enabled features
      dependencyAppAddress,
    ],
  })
  .send()

console.log('Configuration:', result.returns[0].returnValue)
```

**Benefits**:
- On-chain validation at creation time
- Immediate feedback if requirements not met
- Prevent invalid deployments

### 4. Auditable Deletion with Reasons

**Scenario**: Track why and when apps are deleted

```typescript
const method = new algosdk.ABIMethod({
  name: 'delete_with_audit',
  args: [
    { type: 'string', name: 'reason' },
    { type: 'address', name: 'requester' },
    { type: 'uint64', name: 'timestamp' },
  ],
  returns: { type: '(string,uint64)' },  // (reason, final_balance)
})

const result = await algorand
  .newGroup()
  .addAppDeleteMethodCall({
    sender: deployer.addr,
    appId,
    method,
    args: [
      'Contract expired',
      requesterAddress,
      BigInt(Date.now() / 1000),
    ],
  })
  .send()

const [reason, finalBalance] = result.returns[0].returnValue
console.log(`Deleted because: ${reason}`)
console.log(`Final balance: ${finalBalance}`)
```

**Benefits**:
- Complete audit trail
- Track who initiated deletion
- Record business reasons
- Capture final state

### 5. Multi-Step Setup with Dependencies

**Scenario**: Initialize app with complex dependencies

```typescript
const method = new algosdk.ABIMethod({
  name: 'create_with_deps',
  args: [
    { type: 'uint64[]', name: 'dependency_app_ids' },
    { type: 'byte[]', name: 'initialization_data' },
    { type: 'address', name: 'oracle_address' },
  ],
  returns: { type: '(bool,string)' },  // (success, status_message)
})

// TEAL validates:
// - All dependency apps exist
// - Oracle is valid
// - Initialization data is well-formed
// Returns setup status

const result = await algorand
  .newGroup()
  .addAppCreateMethodCall({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram,
    schema: { ... },
    method,
    args: [
      [priceOracleAppId, validatorAppId],
      initializationBytes,
      oracleAddress,
    ],
  })
  .send()

const [success, status] = result.returns[0].returnValue
if (success) {
  console.log('Setup complete:', status)
} else {
  console.error('Setup failed:', status)
}
```

**Benefits**:
- Validate complex dependencies
- Atomic multi-step initialization
- Clear success/failure feedback
- No partially initialized state

## Comparison: Bare vs ABI Methods

| Aspect | Bare Calls | ABI Methods |
|--------|-----------|-------------|
| **Arguments** | None | Type-safe arguments |
| **Return Values** | None | Typed return values |
| **Validation** | Limited | Comprehensive on-chain validation |
| **Setup Logic** | Simple state initialization | Complex multi-step setup |
| **Cleanup Logic** | Simple deletion | Custom cleanup with state capture |
| **Cost** | Lower (minimal opcodes) | Higher (encoding + logic) |
| **Type Safety** | None | Full ABI type checking |
| **Audit Trail** | Transaction only | Transaction + return values |
| **Flexibility** | Limited | Highly flexible |
| **Complexity** | Simple to implement | Requires TEAL + ABI knowledge |

## Best Practices

### 1. Always Validate Arguments in TEAL

```teal
method_create_abi:
// Validate admin address is not zero address
txn ApplicationArgs 1
global ZeroAddress
!=
assert  // Reject if admin is zero address

// Validate supply is reasonable
txn ApplicationArgs 2
btoi
int 1000000000  // Max 1B tokens
<
assert

// Continue with initialization...
```

**Why**: On-chain validation prevents invalid deployments and provides immediate feedback.

### 2. Use Return Values for Confirmation

```typescript
const result = await algorand
  .newGroup()
  .addAppCreateMethodCall({ ... })
  .send()

const returnValue = result.returns?.[0]?.returnValue

// Validate return value matches expectations
if (returnValue !== 'Created successfully') {
  throw new Error(`Unexpected creation result: ${returnValue}`)
}
```

**Why**: Return values enable off-chain validation and provide deployment confidence.

### 3. Keep Initialization Atomic

**Bad**:
```typescript
// ❌ Requires follow-up transaction
await algorand.send.appCreate({ ... })  // Bare creation
await algorand.send.appCall({
  method: 'initialize',  // Follow-up initialization
  args: [config]
})
```

**Good**:
```typescript
// ✅ Everything in one transaction
await algorand
  .newGroup()
  .addAppCreateMethodCall({
    method: createWithConfig,
    args: [config],  // Initialize during creation
  })
  .send()
```

**Why**: Atomic initialization prevents partially configured apps and reduces transaction costs.

### 4. Document Cleanup Behavior

```typescript
/**
 * Deletes the application with custom cleanup logic.
 *
 * Cleanup behavior:
 * - Captures final balance and round number
 * - Logs deletion reason and requester
 * - Transfers remaining funds to specified address
 *
 * @param reason - Why the app is being deleted
 * @param requester - Who initiated the deletion
 * @returns Final balance and deletion round
 */
const deleteMethod = new algosdk.ABIMethod({
  name: 'delete_with_cleanup',
  args: [
    { type: 'string', name: 'reason' },
    { type: 'address', name: 'requester' },
  ],
  returns: { type: '(uint64,uint64)' },
})
```

**Why**: Clear documentation helps users understand what happens during deletion and prevents surprises.

### 5. Balance Flexibility vs Efficiency

**When to Use Bare Calls**:
- Simple deployments with no configuration
- Cost-sensitive applications
- Apps that don't need initialization logic
- Rapid prototyping

**When to Use ABI Methods**:
- Production deployments with configuration
- Apps requiring validation during setup
- Need for audit trails
- Complex initialization logic
- State migration scenarios

**Hybrid Approach**:
```typescript
// Development: Use bare calls for speed
if (isDevelopment) {
  await algorand.send.appCreate({ ... })
}

// Production: Use ABI methods for safety
if (isProduction) {
  await algorand
    .newGroup()
    .addAppCreateMethodCall({
      method: createWithValidation,
      args: [config],
    })
    .send()
}
```

### 6. Handle Return Value Decode Errors

```typescript
const result = await algorand
  .newGroup()
  .addAppCreateMethodCall({ ... })
  .send()

// Check for decode errors
const returnData = result.returns?.[0]
if (returnData?.decodeError) {
  console.error('Failed to decode return value:', returnData.decodeError)
  console.error('This may indicate a TEAL logic error')

  // Fallback: check if app was created despite decode error
  const appId = result.confirmations[0].applicationIndex
  if (appId) {
    console.log('App was created with ID:', appId)
    // Decide if this is acceptable or requires intervention
  }
}
```

**Why**: ABI return decoding can fail if TEAL doesn't log the return value correctly. Handle this gracefully.

### 7. Use Descriptive Method Names

**Bad**:
```typescript
// ❌ Unclear what this does
const method = new algosdk.ABIMethod({
  name: 'create',
  args: [{ type: 'uint64', name: 'a' }],
  returns: { type: 'bool' },
})
```

**Good**:
```typescript
// ✅ Clear intent and arguments
const method = new algosdk.ABIMethod({
  name: 'create_with_initial_supply',
  args: [{
    type: 'uint64',
    name: 'initial_supply',
    desc: 'Initial token supply in base units'
  }],
  returns: {
    type: 'bool',
    desc: 'True if creation succeeded'
  },
})
```

**Why**: Descriptive names improve code readability and generate better documentation.

## Common Pitfalls

### 1. Wrong TEAL Control Flow

**Problem**: Checking `ApplicationID == 0` before method args causes ABI methods to be skipped during creation

```teal
# ❌ WRONG - ABI create methods won't work
txn ApplicationID
int 0
==
bnz handle_create  # Jumps here immediately, never checks methods!

txn ApplicationArgs 0
method "create_abi(string)string"
==
bnz method_create_abi  # Never reached during creation
```

**Solution**: Check for app args FIRST

```teal
# ✅ CORRECT - Check for method args before ApplicationID
txn NumAppArgs
int 0
>
bnz check_method_calls  # Check methods if args present

# Only do bare creation if no args
txn ApplicationID
int 0
==
bnz handle_create
```

### 2. Incorrect ABI Return Format

**Problem**: Forgetting the return prefix or length encoding

```teal
# ❌ WRONG - Missing ABI return prefix and length
byte "Created successfully"
log
```

**Solution**: Use proper ABI return format

```teal
# ✅ CORRECT - Full ABI return format
byte "Created successfully"
dup
len
itob
extract 6 2          # 2-byte length prefix
swap
concat
byte 0x151f7c75      # ABI return hash
swap
concat
log
```

### 3. Not Handling Optional Return Values

**Problem**: Assuming returns always exist

```typescript
// ❌ Can throw if returns is undefined
const returnValue = result.returns[0].returnValue
```

**Solution**: Use optional chaining

```typescript
// ✅ Safe access with optional chaining
const returnValue = result.returns?.[0]?.returnValue
if (returnValue) {
  console.log('Returned:', returnValue)
} else {
  console.warn('No return value (method may not have logged one)')
}
```

### 4. Wrong App ID Extraction

**Problem**: Trying to access `result.appId` directly (doesn't exist on group results)

```typescript
// ❌ appId doesn't exist on grouped transaction results
const appId = createResult.appId  // undefined!
```

**Solution**: Extract from confirmations

```typescript
// ✅ Extract from confirmation
const appId = createResult.confirmations[0].applicationIndex!
```

### 5. Mismatched Method Signatures

**Problem**: Method signature in TypeScript doesn't match TEAL

```typescript
// TypeScript definition
const method = new algosdk.ABIMethod({
  name: 'create_abi',
  args: [{ type: 'string', name: 'msg' }],
  returns: { type: 'string' },
})

// TEAL uses different signature
method "create_abi(uint64)string"  // ❌ Mismatch!
```

**Solution**: Ensure signatures match exactly

```typescript
// ✅ TypeScript
const method = new algosdk.ABIMethod({
  name: 'create_abi',
  args: [{ type: 'string', name: 'msg' }],
  returns: { type: 'string' },
})

// ✅ TEAL matches TypeScript
method "create_abi(string)string"
```

### 6. Forgetting OnCompletion for Delete

**Problem**: Delete method doesn't set OnCompletion

```teal
# ❌ Method called but app not deleted
method_delete_abi:
// Cleanup logic...
int 1
return
```

The method needs to be called with `OnCompletion = DeleteApplication` in the transaction, but the TEAL just needs to approve (return 1) when it detects this.

```typescript
// ✅ SDK automatically sets OnCompletion
await algorand
  .newGroup()
  .addAppDeleteMethodCall({  // Sets OnCompletion = DeleteApplication
    appId,
    method: deleteMethod,
    args: [...],
  })
  .send()
```

## Security Considerations

### 1. Validate All Inputs

Always validate method arguments in TEAL:

```teal
method_create_abi:
// Validate address argument
txn ApplicationArgs 1
len
int 32
==
assert  // Addresses must be 32 bytes

// Validate uint64 argument is in range
txn ApplicationArgs 2
btoi
int 1000000
<=
assert  // Must not exceed 1M
```

### 2. Prevent Reentrancy

ABI methods can call other apps. Protect against reentrancy:

```teal
// Check if already initialized
byte "initialized"
app_global_get
int 0
==
assert  // Must not be already initialized

// Set initialized flag BEFORE any external calls
byte "initialized"
int 1
app_global_put

// Now safe to make external calls
```

### 3. Limit Gas Costs

Complex ABI methods can be expensive:

```typescript
// Consider splitting into multiple transactions if logic is complex
await algorand
  .newGroup()
  .addAppCreateMethodCall({ method: simpleCreate, args: [...] })
  .send()

// Follow up with additional configuration if needed
await algorand
  .send.appCall({ appId, method: configure, args: [...] })
```

### 4. Sanitize Return Values

Don't return sensitive information:

```teal
# ❌ DON'T return secrets
method_create_abi:
byte "private_key"
app_global_get
log  # Exposes secret!

# ✅ DO return safe confirmations
method_create_abi:
byte "Initialized successfully"
log  # Safe message
```

### 5. Use Authorization Checks

Verify who can call creation/deletion methods:

```teal
method_delete_abi:
// Only admin can delete
byte "admin"
app_global_get
txn Sender
==
assert  // Reject if not admin

// Continue with deletion...
```

## What You'll See

Running this example will output:

```
=== Custom ABI Methods for App Creation and Deletion ===

Using deployer account: <address>

=== Step 1: Create App with Custom ABI Create Method ===

✅ App created using ABI method!
   App ID: 1043n
   App Address: <app_address>

ABI Method Return Value:
   create_abi returned: Created successfully

Global State after creation:
   init_value: Hello from ABI create!
   status: created_abi

=== Step 2: Delete App with Custom ABI Delete Method ===

✅ App deleted using ABI method!
   Delete transaction ID: <txid>

ABI Method Return Value:
   delete_abi returned: Deleted successfully

Verifying app was deleted...
   ✅ App successfully deleted
```

This demonstrates:
- Custom ABI method successfully used for creation
- Arguments passed to initialization ("Hello from ABI create!")
- Return value captured ("Created successfully")
- Global state populated by ABI method (status, init_value)
- Custom ABI method used for deletion
- Return value from deletion ("Deleted successfully")
- App no longer exists after deletion

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
- [ABI Specification](https://arc.algorand.foundation/ARCs/arc-0004)
- [Application Creation](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/)
- [TEAL Documentation](https://developer.algorand.org/docs/get-details/dapps/avm/teal/)
