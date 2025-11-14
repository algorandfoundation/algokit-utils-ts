# Smart Contract Deployment with ABI Method Call

This example demonstrates how to deploy a smart contract using an **ABI method call** for initialization during creation, rather than using bare contract creation.

## Core Concept

When deploying smart contracts on Algorand, you have two options for the initial creation transaction:

1. **Bare Creation**: Deploy the contract with no arguments or method calls during creation
2. **ABI Creation Method**: Deploy the contract by calling a specific ABI method during creation, passing typed arguments

Using an ABI creation method provides several advantages:
- **Type Safety**: Arguments are validated and encoded according to the ABI specification
- **Clear Interface**: The creation method signature documents what arguments are required
- **Return Values**: The creation method can return values that confirm initialization
- **Better Errors**: Invalid arguments are caught early with clear error messages

This example creates a smart contract with a `create(string,uint64)string` method that:
- Takes a contract name (string) and initial value (uint64) as arguments
- Stores these values in global state along with the creator's address
- Returns a success message confirming initialization

## What This Example Shows

### 1. Defining an ABI Creation Method

```typescript
const createMethod = new algosdk.ABIMethod({
  name: 'create',
  args: [
    { type: 'string', name: 'name' },
    { type: 'uint64', name: 'initial_value' },
  ],
  returns: { type: 'string' },
})
```

This defines the method signature for the creation call. The ABI method specifies:
- Method name: `create`
- Arguments: `string name` and `uint64 initial_value`
- Return type: `string`

### 2. Deploying with an ABI Creation Method

```typescript
const createResult = await algorand
  .newGroup()
  .addAppCreateMethodCall({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 2,
      localInts: 0,
      localByteSlices: 0,
    },
    method: createMethod,
    args: ['MyContract', 100],
  })
  .send()
```

The `addAppCreateMethodCall` combines contract creation with an ABI method call:
- `method`: The ABI method definition
- `args`: Type-safe arguments that match the method signature
- Other parameters are the same as bare creation (approval program, schema, etc.)

### 3. Receiving Return Values from Creation

```typescript
if (createResult.returns && createResult.returns.length > 0) {
  const returnValue = createResult.returns[0]
  console.log('Return value:', returnValue.returnValue)
  // Output: "Contract 'MyContract' initialized successfully"
}
```

The creation method can return values, which are automatically decoded by the SDK.

### 4. TEAL Implementation for ABI Creation

The TEAL code needs to:
1. Detect creation transactions (`txn ApplicationID == 0`)
2. Check for ABI method calls during creation
3. Verify the method selector matches the expected signature
4. Decode ABI-encoded arguments
5. Process the arguments and initialize state
6. Return an ABI-encoded result

```teal
method_create:
// Extract arguments:
// - ApplicationArgs[1]: ABI-encoded string name (2-byte length + string)
// - ApplicationArgs[2]: ABI-encoded uint64 initial_value (8 bytes)

// Decode and store the name in global state
txna ApplicationArgs 1
extract 2 0  // Skip first 2 bytes (length prefix), get rest
byte "name"
swap
app_global_put

// Store the initial value in global state
byte "value"
txna ApplicationArgs 2
btoi
app_global_put

// Store the creator address
byte "creator"
txn Sender
app_global_put

// Return success message with ABI encoding
// ... (build and encode return string)
```

### 5. Verifying Initialized State

After creation, you can verify that the contract was properly initialized:

```typescript
const appInfo = await algorand.client.algod.getApplicationByID(Number(appId)).do()
const globalState = appInfo.params.globalState || []

// Outputs:
//   name: "MyContract"
//   creator: LEFKTDT7HUYSP6KCYTFEXGFM3QJ7ZUYOSCZKGVSUEYZC2DOL3H7VAQ45LQ
//   value: 100
```

## Common Use Cases

### 1. Named Contract Initialization

Deploy a contract with a name and symbol, similar to token standards:

```typescript
const createMethod = new algosdk.ABIMethod({
  name: 'create',
  args: [
    { type: 'string', name: 'name' },
    { type: 'string', name: 'symbol' },
  ],
  returns: { type: 'void' },
})

await algorand
  .newGroup()
  .addAppCreateMethodCall({
    sender: deployer.addr,
    // ... other params
    method: createMethod,
    args: ['My Token', 'MTK'],
  })
  .send()
```

### 2. Access Control Setup

Set the contract owner/admin during creation:

```typescript
const createMethod = new algosdk.ABIMethod({
  name: 'create',
  args: [
    { type: 'address', name: 'admin' },
  ],
  returns: { type: 'void' },
})

await algorand
  .newGroup()
  .addAppCreateMethodCall({
    sender: deployer.addr,
    // ... other params
    method: createMethod,
    args: [adminAddress],
  })
  .send()
```

### 3. Configuration with Validation

Initialize contract configuration with validation, returning a success indicator:

```typescript
const createMethod = new algosdk.ABIMethod({
  name: 'create',
  args: [
    { type: 'uint64', name: 'min_value' },
    { type: 'uint64', name: 'max_value' },
  ],
  returns: { type: 'bool' },
})

const result = await algorand
  .newGroup()
  .addAppCreateMethodCall({
    sender: deployer.addr,
    // ... other params
    method: createMethod,
    args: [100, 1000],
  })
  .send()

// Check if validation passed
console.log('Initialization successful:', result.returns[0].returnValue)
```

### 4. Complex Multi-Parameter Setup

Initialize a contract with multiple configuration parameters:

```typescript
const createMethod = new algosdk.ABIMethod({
  name: 'create',
  args: [
    { type: 'string', name: 'name' },
    { type: 'uint64', name: 'max_supply' },
    { type: 'address', name: 'admin' },
    { type: 'bool', name: 'paused' },
  ],
  returns: { type: 'string' },
})

await algorand
  .newGroup()
  .addAppCreateMethodCall({
    sender: deployer.addr,
    // ... other params
    method: createMethod,
    args: ['MyContract', 1000000, adminAddr, false],
  })
  .send()
```

### 5. Initialization with Return Values

Get computed values or IDs back from the creation method:

```typescript
const createMethod = new algosdk.ABIMethod({
  name: 'create',
  args: [
    { type: 'uint64', name: 'initial_supply' },
  ],
  returns: { type: 'uint64' },  // Returns actual allocated supply
})

const result = await algorand
  .newGroup()
  .addAppCreateMethodCall({
    sender: deployer.addr,
    // ... other params
    method: createMethod,
    args: [1000000],
  })
  .send()

const allocatedSupply = result.returns[0].returnValue
console.log('Allocated supply:', allocatedSupply)
```

## API Reference

### `addAppCreateMethodCall(params)`

Creates and sends an application creation transaction with an ABI method call.

**Parameters:**
- `sender` (string): Address of the account creating the application
- `approvalProgram` (string | Uint8Array): TEAL approval program code
- `clearStateProgram` (string | Uint8Array): TEAL clear state program code
- `schema` (object): Global and local state schema
  - `globalInts` (number): Number of global uint64 values
  - `globalByteSlices` (number): Number of global byte slice values
  - `localInts` (number): Number of local uint64 values
  - `localByteSlices` (number): Number of local byte slice values
- `method` (ABIMethod): The ABI method to call during creation
- `args` (Array): Arguments matching the method signature
- `onComplete` (optional): Application call on complete action (defaults to NoOp)
- `extraPages` (optional): Number of extra program pages (0-3)
- `note` (optional): Transaction note
- `lease` (optional): Transaction lease
- `rekeyTo` (optional): Rekey account to this address

**Returns:**
- `SendAtomicTransactionComposerResults` containing:
  - `txIds`: Array of transaction IDs
  - `confirmations`: Array of pending transaction confirmations
  - `returns`: Array of ABI method return values (if applicable)
  - `groupId`: The group ID of the atomic transaction group

### `ABIMethod` Constructor

Creates an ABI method definition.

**Parameters:**
- `name` (string): Method name
- `args` (Array): Array of argument definitions
  - Each arg: `{ type: string, name?: string, desc?: string }`
  - Type can be: `uint64`, `string`, `address`, `bool`, `byte[]`, tuples, arrays, etc.
- `returns` (object): Return type definition
  - `{ type: string, desc?: string }`
  - Type `void` means no return value
- `desc` (optional, string): Method description

**Example:**
```typescript
const method = new algosdk.ABIMethod({
  name: 'create',
  args: [
    { type: 'string', name: 'name', desc: 'Contract name' },
    { type: 'uint64', name: 'value', desc: 'Initial value' },
  ],
  returns: { type: 'string', desc: 'Success message' },
  desc: 'Initialize the contract with name and value',
})
```

## ABI Encoding in TEAL

When using ABI method calls, arguments are automatically encoded by the SDK:

### String Encoding
Strings are encoded as:
1. 2-byte length prefix (big-endian uint16)
2. UTF-8 string bytes

Example: "MyContract" (10 characters) → `0x000A4D79436F6E7472616374`

In TEAL, decode with:
```teal
txna ApplicationArgs 1  // Get encoded string
extract 2 0             // Skip 2-byte length prefix
```

### Number Encoding
uint64 values are encoded as 8-byte big-endian integers.

Example: 100 → `0x0000000000000064`

In TEAL, decode with:
```teal
txna ApplicationArgs 2  // Get encoded uint64
btoi                    // Convert bytes to integer
```

### Return Value Encoding
Return values must be ABI-encoded and logged:

For strings:
```teal
// Assuming string is on stack
dup
len
itob
extract 6 2             // Get last 2 bytes for uint16 length
swap
concat
byte 0x151f7c75         // ABI return prefix
swap
concat
log
```

For uint64:
```teal
// Assuming uint64 is on stack
itob
byte 0x151f7c75         // ABI return prefix
swap
concat
log
```

## What Happens Under the Hood

When you call `addAppCreateMethodCall`:

1. **Method Selector Computation**: The SDK computes a 4-byte selector from the method signature
   - Signature: `"create(string,uint64)string"`
   - Selector: First 4 bytes of SHA-512/256 hash of the signature

2. **Argument Encoding**: Arguments are ABI-encoded according to their types
   - `"MyContract"` → `0x000A4D79436F6E7472616374` (length + bytes)
   - `100` → `0x0000000000000064` (8-byte big-endian)

3. **Transaction Construction**: An application create transaction is built with:
   - `ApplicationArgs[0]`: Method selector (4 bytes)
   - `ApplicationArgs[1]`: First argument (ABI-encoded string)
   - `ApplicationArgs[2]`: Second argument (ABI-encoded uint64)
   - Plus standard app creation fields (approval program, schema, etc.)

4. **TEAL Execution**: The contract's TEAL code:
   - Checks if `ApplicationID == 0` (creation)
   - Verifies `ApplicationArgs[0]` matches expected method selector
   - Decodes arguments from `ApplicationArgs[1]`, `ApplicationArgs[2]`, etc.
   - Processes initialization logic
   - ABI-encodes return value and logs it

5. **Return Value Decoding**: The SDK:
   - Reads the transaction logs
   - Finds the ABI-encoded return value
   - Decodes it according to the method's return type
   - Makes it available in `result.returns`

## Best Practices

### 1. Use Descriptive Method Names and Signatures

✅ **Good:**
```typescript
const method = new algosdk.ABIMethod({
  name: 'create',
  args: [
    { type: 'string', name: 'contract_name', desc: 'Human-readable contract name' },
    { type: 'uint64', name: 'initial_value', desc: 'Starting counter value' },
  ],
  returns: { type: 'string', desc: 'Initialization confirmation message' },
})
```

❌ **Bad:**
```typescript
const method = new algosdk.ABIMethod({
  name: 'c',
  args: [
    { type: 'string' },
    { type: 'uint64' },
  ],
  returns: { type: 'string' },
})
```

**Why:** Clear names and descriptions make the contract interface self-documenting and easier to use.

### 2. Return Meaningful Values

✅ **Good:**
```typescript
returns: { type: 'string', desc: 'Success message with contract details' }
// Returns: "Contract 'MyContract' initialized successfully"
```

✅ **Also Good:**
```typescript
returns: { type: 'uint64', desc: 'Actual allocated supply after validation' }
// Returns: 950000 (if requested 1000000 but capped at 950000)
```

❌ **Bad:**
```typescript
returns: { type: 'void' }
// No feedback on initialization status
```

**Why:** Return values provide immediate feedback and can include computed values or confirmation messages.

### 3. Validate Arguments in TEAL

Always validate arguments before using them:

```teal
method_create:
// Validate that initial_value is within acceptable range
txna ApplicationArgs 2
btoi
dup
int 0
>
assert  // Must be positive

dup
int 1000000
<=
assert  // Must not exceed maximum

// ... proceed with initialization
```

**Why:** Early validation provides clear errors and prevents invalid contract states.

### 4. Initialize All Required State

Ensure all global state fields are initialized during creation:

✅ **Good:**
```teal
// Initialize all state variables
byte "name"
// ... set name
app_global_put

byte "value"
// ... set value
app_global_put

byte "creator"
txn Sender
app_global_put

byte "initialized"
int 1
app_global_put
```

❌ **Bad:**
```teal
// Only initialize some fields
byte "value"
// ... set value
app_global_put
// Missing: name, creator, initialized flag
```

**Why:** Uninitialized state can lead to unexpected behavior or vulnerabilities.

### 5. Handle ABI Encoding Correctly

When storing ABI-encoded arguments, decode them first:

✅ **Good:**
```teal
// Decode the ABI string before storing
txna ApplicationArgs 1
extract 2 0             // Remove 2-byte length prefix
byte "name"
swap
app_global_put
```

❌ **Bad:**
```teal
// Store ABI-encoded value directly
txna ApplicationArgs 1  // Contains length prefix!
byte "name"
swap
app_global_put
```

**Why:** Storing the length prefix with the string causes display issues and wastes storage.

### 6. Provide Fallback for Bare Creation

Consider supporting both ABI and bare creation:

```teal
handle_creation:
txn NumAppArgs
int 0
>
bnz abi_create

// Bare creation - use default values
byte "name"
byte "Unnamed Contract"
app_global_put

byte "value"
int 0
app_global_put

int 1
return

abi_create:
// Handle ABI method calls
// ...
```

**Why:** Allows flexibility in deployment methods and supports both patterns.

### 7. Document the Method Signature

Include the full method signature in comments and documentation:

```typescript
/**
 * Creation method for the smart contract
 *
 * Signature: create(string,uint64)string
 *
 * @param name - Human-readable contract name (max 32 bytes)
 * @param initial_value - Starting counter value (must be 0-1000000)
 * @returns Success message confirming initialization
 */
const createMethod = new algosdk.ABIMethod({
  name: 'create',
  args: [
    { type: 'string', name: 'name' },
    { type: 'uint64', name: 'initial_value' },
  ],
  returns: { type: 'string' },
})
```

**Why:** Makes the interface clear for other developers and tools.

## Common Pitfalls

### 1. Forgetting to Decode ABI Arguments

**Problem:**
```teal
// Storing ABI-encoded string with length prefix
txna ApplicationArgs 1
byte "name"
swap
app_global_put
```

**Result:** The stored value includes the 2-byte length prefix, causing display issues.

**Solution:**
```teal
// Decode by skipping the length prefix
txna ApplicationArgs 1
extract 2 0
byte "name"
swap
app_global_put
```

### 2. Incorrect Return Value Encoding

**Problem:**
```teal
// Missing ABI return prefix
byte "Success"
log
```

**Result:** SDK cannot decode the return value, throws an error.

**Solution:**
```teal
// Properly encode with ABI prefix
byte "Success"
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
```

### 3. Schema Too Small for Initialized State

**Problem:**
```typescript
schema: {
  globalInts: 0,        // Not enough!
  globalByteSlices: 1,  // Not enough!
}
```

**Result:** Transaction fails with "store GlobalStateKey X exceeds schema X".

**Solution:** Count all state variables in TEAL:
```typescript
schema: {
  globalInts: 1,        // For "value"
  globalByteSlices: 2,  // For "name" and "creator"
}
```

### 4. Wrong Argument Order

**Problem:**
```typescript
args: [100, 'MyContract']  // Swapped!
```

**Result:** ABI encoding mismatch, transaction fails.

**Solution:** Match the order in the method definition:
```typescript
args: ['MyContract', 100]  // Correct order: string first, uint64 second
```

### 5. Missing Method Selector Verification in TEAL

**Problem:**
```teal
// Accept any method call during creation
bnz method_create
```

**Result:** Any method selector is accepted, potential security issue.

**Solution:**
```teal
// Verify the exact method selector
txn ApplicationArgs 0
method "create(string,uint64)string"
==
bnz method_create

// Unknown method
int 0
return
```

### 6. Not Checking Method Argument Count

**Problem:**
```teal
// Assume ApplicationArgs always has required count
txna ApplicationArgs 2  // Might not exist!
```

**Result:** Runtime error if fewer arguments are provided.

**Solution:**
```teal
// Verify argument count first
txn NumAppArgs
int 3  // Method selector + 2 arguments
==
assert

// Now safe to access arguments
```

### 7. Mismatched Return Type

**Problem:**
```typescript
returns: { type: 'uint64' }  // Defined as uint64
```

```teal
// But returning a string in TEAL
byte "Success"
// ... encode as string and log
```

**Result:** SDK fails to decode the return value correctly.

**Solution:** Ensure TEAL return type matches the ABI method definition:
```typescript
returns: { type: 'string' }  // Match TEAL implementation
```

## Comparison: ABI Creation vs Bare Creation

| Aspect | ABI Creation | Bare Creation |
|--------|-------------|---------------|
| **Type Safety** | ✅ Arguments are typed and validated | ❌ No argument validation |
| **Argument Encoding** | ✅ Automatic ABI encoding | ❌ Manual encoding required |
| **Return Values** | ✅ Can return typed values | ❌ No return values |
| **Interface Clarity** | ✅ Self-documenting signature | ❌ Must read TEAL code |
| **Error Messages** | ✅ Clear type mismatch errors | ❌ Generic TEAL errors |
| **TEAL Complexity** | ⚠️ Must handle ABI encoding | ✅ Simpler TEAL code |
| **Flexibility** | ⚠️ Fixed argument structure | ✅ Any argument structure |
| **Tool Support** | ✅ Better IDE/tool support | ⚠️ Limited tool support |

## When to Use ABI Creation Methods

**Use ABI creation methods when:**
- You need type-safe initialization with validated arguments
- You want clear, self-documenting contract interfaces
- You need to return confirmation or computed values from creation
- You're building contracts that will be used by other developers
- You want better error messages and development experience

**Use bare creation when:**
- You need maximum flexibility in argument structure
- You're working with legacy contracts or specific patterns
- You want simpler TEAL code without ABI encoding complexity
- Your contract doesn't require initialization arguments

## Related Examples

- **Example 24**: Basic ABI method calls (non-creation)
- **Example 25**: ABI method calls with complex transaction arguments
- **Example 129**: Simulating transaction groups (including ABI calls)
- **Example 122**: Raw application calls with manual argument encoding

## Resources

- [Algorand ABI Specification](https://arc.algorand.foundation/ARCs/arc-0004)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand Smart Contract Guidelines](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/guidelines/)
- [TEAL Opcodes Reference](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/)
