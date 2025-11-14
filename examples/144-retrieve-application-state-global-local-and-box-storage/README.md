# Retrieve Application State (Global, Local, and Box Storage)

This example demonstrates comprehensive state management in Algorand smart contracts, including how to set and retrieve all three types of application state: global state, local state, and box storage. You'll learn how to work with different data types and use ABI encoding for type-safe storage.

## Overview

Algorand smart contracts support three types of persistent storage:

1. **Global State**: Shared across all users, limited by schema size (max 64 key-value pairs)
2. **Local State**: Per-account storage, requires opt-in (max 16 key-value pairs per account)
3. **Box Storage**: Flexible key-value storage with dynamic sizing, requires funding

This example shows how to:
- Deploy an app with global and local state schemas
- Set and retrieve global state (integers and byte arrays)
- Opt into an application to enable local state
- Set and retrieve local state per account
- Fund an app account for box storage
- Create and retrieve boxes with various data types
- Use ABI encoding/decoding for type-safe box values

## What You'll Learn

- Defining state schemas when deploying applications
- Setting global state values using ABI methods
- Opting into applications to use local state
- Setting and retrieving local state for specific accounts
- Funding app accounts to cover box storage minimum balance
- Creating and managing box storage
- Working with ABI-encoded values in boxes
- Decoding box values using ABI types

## Key Concepts

### Global State

Global state is shared across all users of the application:
- Limited to the schema defined at deployment
- Maximum 64 key-value pairs (combined uints and byte slices)
- Persists for the lifetime of the application
- No per-account cost

```typescript
// Deploy with global state schema
await algorand.send.appCreate({
  schema: {
    globalInts: 2,          // 2 uint64 values
    globalByteSlices: 2,    // 2 byte slice values
    // ...
  },
})

// Set global state
await algorand.send.appCallMethodCall({
  method: setGlobalMethod,
  args: [42, 100, 'hello', new Uint8Array([1, 2, 3, 4])],
})

// Retrieve global state
const appInfo = await algorand.app.getById(appId)
const globalState = appInfo.params.globalState
```

### Local State

Local state is per-account storage:
- Requires the account to opt into the application
- Limited to the schema defined at deployment
- Maximum 16 key-value pairs per account
- Account pays for minimum balance

```typescript
// Opt in to the application
await algorand.newGroup().addAppCall({
  appId,
  onComplete: algosdk.OnApplicationComplete.OptInOC,
}).send()

// Set local state
await algorand.send.appCallMethodCall({
  method: setLocalMethod,
  args: [11, 22, 'world', new Uint8Array([5, 6, 7, 8])],
})

// Retrieve local state
const accountInfo = await algorand.account.getInformation(address)
const localState = accountInfo.appsLocalState.find(app => app.id === appId)
```

### Box Storage

Box storage provides flexible key-value storage:
- Dynamic sizing (not limited by schema)
- Requires funding the app account for minimum balance
- Box names and values can be any byte array
- Supports ABI encoding for type safety

```typescript
// Fund app account for box storage
const appAddress = algosdk.getApplicationAddress(appId)
await algorand.send.payment({
  receiver: appAddress,
  amount: microAlgos(200_000), // Minimum balance for boxes
})

// Create a box
await algorand.send.appCallMethodCall({
  method: setBoxMethod,
  args: [boxName, boxValue],
  boxReferences: [{ appId: 0, name: boxName }],
})

// Retrieve boxes
const boxes = await algorand.app.getBoxNames(appId)
const boxValue = await algorand.app.getBoxValue(appId, boxName)
```

##Example Walkthrough

### Step 1: Deploy App with State Schema

Deploy an application with schemas for both global and local state:

```typescript
const createResult = await algorand.send.appCreate({
  sender: deployer.addr,
  approvalProgram: approvalCompiled.compiledBase64ToBytes,
  clearStateProgram: clearCompiled.compiledBase64ToBytes,
  schema: {
    globalInts: 2,
    globalByteSlices: 2,
    localInts: 2,
    localByteSlices: 2,
  },
})
```

The schema defines:
- `globalInts`: Number of uint64 values in global state
- `globalByteSlices`: Number of byte slice values in global state
- `localInts`: Number of uint64 values in local state per account
- `localByteSlices`: Number of byte slice values in local state per account

### Step 2: Set and Retrieve Global State

Set global state values using an ABI method:

```typescript
const setGlobalMethod = new algosdk.ABIMethod({
  name: 'set_global',
  args: [
    { type: 'uint64', name: 'int1' },
    { type: 'uint64', name: 'int2' },
    { type: 'string', name: 'bytes1' },
    { type: 'byte[]', name: 'bytes2' }
  ],
  returns: { type: 'void' }
})

await algorand.send.appCallMethodCall({
  appId,
  method: setGlobalMethod,
  args: [42, 100, 'hello', new Uint8Array([1, 2, 3, 4])],
})
```

Retrieve and display global state:

```typescript
const appInfo = await algorand.app.getById(appId)
const globalState = appInfo.params.globalState

for (const kv of globalState) {
  const key = Buffer.from(kv.key).toString()
  const value = kv.value

  if (value.uint !== undefined) {
    console.log(`${key}: ${value.uint}`)
  } else {
    console.log(`${key}: ${Buffer.from(value.bytes).toString('utf8')}`)
  }
}
```

### Step 3: Opt In and Use Local State

Opt into the application to enable local state:

```typescript
await algorand.newGroup().addAppCall({
  sender: deployer.addr,
  appId,
  onComplete: algosdk.OnApplicationComplete.OptInOC,
}).send()
```

Set local state values:

```typescript
const setLocalMethod = new algosdk.ABIMethod({
  name: 'set_local',
  args: [
    { type: 'uint64', name: 'local_int1' },
    { type: 'uint64', name: 'local_int2' },
    { type: 'string', name: 'local_bytes1' },
    { type: 'byte[]', name: 'local_bytes2' }
  ],
  returns: { type: 'void' }
})

await algorand.send.appCallMethodCall({
  appId,
  method: setLocalMethod,
  args: [11, 22, 'world', new Uint8Array([5, 6, 7, 8])],
})
```

Retrieve local state for an account:

```typescript
const accountInfo = await algorand.account.getInformation(address)
const appsLocalState = accountInfo.appsLocalState
const appLocalState = appsLocalState.find(app => app.id === appId)
const localStateKvs = appLocalState.keyValue

for (const kv of localStateKvs) {
  const key = Buffer.from(kv.key).toString()
  const value = kv.value

  if (value.uint !== undefined) {
    console.log(`${key}: ${value.uint}`)
  } else {
    console.log(`${key}: ${Buffer.from(value.bytes).toString('utf8')}`)
  }
}
```

### Step 4: Work with Box Storage

Fund the app account to cover box storage costs:

```typescript
const appAddress = algosdk.getApplicationAddress(appId)
await algorand.send.payment({
  sender: deployer.addr,
  receiver: appAddress,
  amount: microAlgos(200_000), // 0.2 ALGO for box storage
})
```

Create boxes with string values:

```typescript
const boxName1 = new Uint8Array([0, 0, 0, 1])
const boxName2 = new Uint8Array([0, 0, 0, 2])

const setBoxMethod = new algosdk.ABIMethod({
  name: 'set_box',
  args: [
    { type: 'byte[]', name: 'name' },
    { type: 'byte[]', name: 'value' }
  ],
  returns: { type: 'void' }
})

await algorand.send.appCallMethodCall({
  appId,
  method: setBoxMethod,
  args: [boxName1, Buffer.from('value1')],
  boxReferences: [{ appId: 0, name: boxName1 }],
})
```

Retrieve all boxes:

```typescript
const boxes = await algorand.app.getBoxNames(appId)
console.log(`Total boxes: ${boxes.length}`)

for (const box of boxes) {
  const boxValue = await algorand.app.getBoxValue(appId, box.nameRaw)
  console.log(`${box.nameBase64}: ${Buffer.from(boxValue).toString('utf8')}`)
}
```

### Step 5: Use ABI Encoding for Box Values

Store an ABI-encoded uint32 value in a box:

```typescript
const abiType = new ABIUintType(32)
const encodedValue = abiType.encode(1234567890)

await algorand.send.appCallMethodCall({
  appId,
  method: setBoxMethod,
  args: [boxName1, encodedValue],
  boxReferences: [{ appId: 0, name: boxName1 }],
})
```

Retrieve and decode the ABI value:

```typescript
const box1Value = await algorand.app.getBoxValue(appId, boxName1)
const decodedValue = abiType.decode(box1Value)

console.log(`Decoded value: ${Number(decodedValue)}`) // 1234567890
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
=== Retrieve Application State (Global, Local, and Box Storage) ===

Using deployer account: RZG...PM

=== STEP 1: Loading Contract and Deploying App ===

Deploying app with state schema...
✅ App deployed with ID: 1054n

=== STEP 2: Working with Global State ===

Setting global state values...
  int1: 42
  int2: 100
  bytes1: "hello"
  bytes2: [1, 2, 3, 4]

Global State Retrieved:
  int1: 42
  int2: 100
  bytes1: "hello" (raw: [104, 101, 108, 108, 111])
  bytes2: "" (raw: [1, 2, 3, 4])

=== STEP 3: Working with Local State ===

Opting in to the application...
✅ Opted in successfully

Setting local state values...
  local_int1: 11
  local_int2: 22
  local_bytes1: "world"
  local_bytes2: [5, 6, 7, 8]

Local State Retrieved:
  local_int1: 11
  local_int2: 22
  local_bytes1: "world" (raw: [119, 111, 114, 108, 100])
  local_bytes2: "" (raw: [5, 6, 7, 8])

=== STEP 4: Working with Box Storage ===

Funding app account for box storage...
✅ App account funded

Creating boxes with string values...
  Box AAAAAQ==: "value1"
  Box AAAAAg==: "value2"

Retrieving all boxes...
✅ Total boxes found: 2

Box values:
  AAAAAQ==: "value1"
  AAAAAg==: "value2"

=== STEP 5: Working with ABI-Encoded Box Values ===

Setting box with ABI-encoded uint32 value: 1234567890

Retrieving and decoding ABI box value...
✅ ABI-Decoded box value: 1234567890
   Original value: 1234567890
   Values match: true

✨ Example completed successfully!
```

## Key Takeaways

1. **Three Storage Types**: Global state, local state, and box storage each serve different purposes
2. **Schema Definition**: Global and local state require schema definition at deployment
3. **Opt-In Requirement**: Local state requires accounts to opt into the application
4. **Box Funding**: Box storage requires funding the app account for minimum balance
5. **ABI Encoding**: Use ABI types for type-safe encoding/decoding of complex values
6. **Box References**: Always include box references in transactions that access boxes

## Additional Resources

- [Algorand Smart Contract State](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/state/)
- [Box Storage](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/state/#box-storage)
- [ABI Specification](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/ABI/)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)

## Related Examples

- Example 32: Fund App Account
- Example 24: Method Calls with ABI
- Example 138: Full App Lifecycle (Create, Update, Delete)

---

This example demonstrates production-ready patterns for comprehensive state management in Algorand applications, covering all three types of persistent storage and their appropriate use cases
