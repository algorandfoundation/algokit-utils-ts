# Retrieve and Decode Application State

This example demonstrates comprehensive techniques for retrieving and decoding application state in Algorand smart contracts. You'll learn how to work with different encoding formats (UTF-8, hex, base64) and decode ABI-encoded values from global state, local state, and box storage.

## Overview

This example focuses on the practical aspects of retrieving and decoding application state data:

- **Retrieve** state from global state, local state, and box storage
- **Decode** bytes to multiple formats (string, hex, base64)
- **Parse** ABI-encoded values with type safety
- **Interpret** different data types stored on-chain

### What Makes This Different from Example 144?

While Example 144 focuses on the full lifecycle (set and retrieve), this example emphasizes:
- Multiple decoding formats for the same data
- ABI type decoding techniques
- Practical data interpretation patterns
- Working with raw bytes and encoded values

## Key Concepts

### State Retrieval APIs

```typescript
// Global State: Retrieved via app info
const appInfo = await algorand.app.getById(appId)
const globalState = appInfo.params.globalState

// Local State: Retrieved via account info
const accountInfo = await algorand.account.getInformation(address)
const localState = accountInfo.appsLocalState

// Box Storage: Retrieved via box APIs
const boxes = await algorand.app.getBoxNames(appId)
const boxValue = await algorand.app.getBoxValue(appId, boxName)
```

### Decoding Techniques

#### 1. String Decoding

```typescript
const bytes = Buffer.from(value.bytes)
const asString = bytes.toString('utf8')  // "hello"
```

#### 2. Hex Decoding

```typescript
const bytes = Buffer.from(value.bytes)
const asHex = bytes.toString('hex')  // "68656c6c6f"
```

#### 3. Base64 Decoding

```typescript
const bytes = Buffer.from(value.bytes)
const asBase64 = bytes.toString('base64')  // "aGVsbG8="
```

#### 4. ABI Type Decoding

```typescript
const abiType = new ABIUintType(32)
const decodedValue = abiType.decode(boxValue)  // 1234567890
```

## Example Walkthrough

### Step 1: Set Up Test Data

The example first deploys a contract and populates it with test data:

```typescript
// Deploy contract with state schemas
const createResult = await algorand.send.appCreate({
  approvalProgram: approvalCompiled.compiledBase64ToBytes,
  clearStateProgram: clearCompiled.compiledBase64ToBytes,
  schema: {
    globalInts: 2,
    globalByteSlices: 2,
    localInts: 2,
    localByteSlices: 2,
  },
})

// Set global state
await algorand.send.appCallMethodCall({
  method: setGlobalMethod,
  args: [42, 100, 'hello', new Uint8Array([1, 2, 3, 4])],
})

// Opt in and set local state
await algorand.newGroup().addAppCall({
  onComplete: algosdk.OnApplicationComplete.OptInOC,
}).send()

await algorand.send.appCallMethodCall({
  method: setLocalMethod,
  args: [11, 22, 'world', new Uint8Array([5, 6, 7, 8])],
})

// Create box storage
await algorand.send.appCallMethodCall({
  method: setBoxMethod,
  args: [boxName, Buffer.from('test-value')],
  boxReferences: [{ appId: 0n, name: boxName }],
})
```

### Step 2: Decode Global State

Retrieve and decode global state values:

```typescript
const appInfo = await algorand.app.getById(appId)
const globalState = appInfo.params.globalState

for (const kv of globalState) {
  const key = Buffer.from(kv.key).toString()
  const value = kv.value

  if (value.uint !== undefined) {
    console.log(`${key}: ${value.uint} (type: uint64)`)
  } else if (value.bytes) {
    const bytes = Buffer.from(value.bytes)
    console.log(`${key}: "${bytes.toString('utf8')}" (hex: ${bytes.toString('hex')})`)
  }
}
```

Output:
```
int1: 42 (type: uint64)
int2: 100 (type: uint64)
bytes1: "hello" (hex: 68656c6c6f, type: bytes)
bytes2: "" (hex: 01020304, type: bytes)
```

### Step 3: Decode Local State

Retrieve and decode local state for an account:

```typescript
const accountInfo = await algorand.account.getInformation(address)
const appsLocalState = accountInfo.appsLocalState
const appLocalState = appsLocalState.find(app => app.id === appId)
const localStateKvs = appLocalState.keyValue

for (const kv of localStateKvs) {
  const key = Buffer.from(kv.key).toString()
  const value = kv.value

  if (value.uint !== undefined) {
    console.log(`${key}: ${value.uint} (type: uint64)`)
  } else if (value.bytes) {
    const bytes = Buffer.from(value.bytes)
    console.log(`${key}: "${bytes.toString('utf8')}" (hex: ${bytes.toString('hex')})`)
  }
}
```

Output:
```
local_int1: 11 (type: uint64)
local_int2: 22 (type: uint64)
local_bytes1: "world" (hex: 776f726c64, type: bytes)
local_bytes2: "" (hex: 05060708, type: bytes)
```

### Step 4: Decode Box Storage with Multiple Formats

Retrieve box values and decode them in multiple formats:

```typescript
const boxes = await algorand.app.getBoxNames(appId)

for (const box of boxes) {
  const boxValue = await algorand.app.getBoxValue(appId, box.nameRaw)

  console.log(`Box: ${box.nameBase64}`)
  console.log(`  Name (hex): ${Buffer.from(box.nameRaw).toString('hex')}`)
  console.log(`  Value (string): "${Buffer.from(boxValue).toString('utf8')}"`)
  console.log(`  Value (hex): ${Buffer.from(boxValue).toString('hex')}`)
  console.log(`  Value (base64): ${Buffer.from(boxValue).toString('base64')}`)
  console.log(`  Size: ${boxValue.length} bytes`)
}
```

Output:
```
Box: AAAAAQ==
  Name (hex): 00000001
  Value (string): "test-value"
  Value (hex): 746573742d76616c7565
  Value (base64): dGVzdC12YWx1ZQ==
  Size: 10 bytes
```

### Step 5: Decode ABI-Encoded Box Values

Store and decode ABI-encoded values:

```typescript
// Store ABI-encoded uint32
const abiUint32 = new ABIUintType(32)
await algorand.send.appCallMethodCall({
  method: setBoxMethod,
  args: [boxName2, abiUint32.encode(1234567890)],
  boxReferences: [{ appId: 0n, name: boxName2 }],
})

// Retrieve and decode
const box2Value = await algorand.app.getBoxValue(appId, boxName2)
const box2Decoded = abiUint32.decode(box2Value)

console.log(`Raw bytes (hex): ${Buffer.from(box2Value).toString('hex')}`)
console.log(`Decoded value: ${Number(box2Decoded)}`)
```

Output:
```
Box AAAAAg== (uint32):
  Raw bytes (hex): 499602d2
  Decoded value: 1234567890

Box AAAAAw== (uint64):
  Raw bytes (hex): 891087b8b0347115
  Decoded value: 9876543210123456789
```

## Running the Example

### Prerequisites

```bash
# Start LocalNet
algokit localnet start

# Install dependencies
npm install
```

### Execute

```bash
npm start
```

### Expected Output

```
=== Retrieve and Decode Application State ===

Using deployer account: RZG...PM

Deploying app...
✅ App deployed with ID: 1078n

Setting up test data...
✅ Test data created

=== Decoding Global State ===

Decoding global state values...
  int1: 42 (type: uint64)
  int2: 100 (type: uint64)
  bytes1: "hello" (hex: 68656c6c6f, type: bytes)
  bytes2: "" (hex: 01020304, type: bytes)

=== Decoding Local State ===

Decoding local state values...
  local_int1: 11 (type: uint64)
  local_int2: 22 (type: uint64)
  local_bytes1: "world" (hex: 776f726c64, type: bytes)
  local_bytes2: "" (hex: 05060708, type: bytes)

=== Decoding Box Storage ===

Found 1 box(es)

Box: AAAAAQ==
  Name (hex): 00000001
  Value (string): "test-value"
  Value (hex): 746573742d76616c7565
  Value (base64): dGVzdC12YWx1ZQ==
  Size: 10 bytes

=== Decoding ABI-Encoded Box Values ===

Storing ABI-encoded values...
✅ ABI values stored

Decoding ABI-encoded boxes...
Box AAAAAg== (uint32):
  Raw bytes (hex): 499602d2
  Decoded value: 1234567890

Box AAAAAw== (uint64):
  Raw bytes (hex): 891087b8b0347115
  Decoded value: 9876543210123456789

=== Summary ===

State Retrieval Methods Demonstrated:
  ✅ algorand.app.getById() - Retrieve app info with global state
  ✅ algorand.account.getInformation() - Retrieve account info with local state
  ✅ algorand.app.getBoxNames() - List all boxes for an app
  ✅ algorand.app.getBoxValue() - Retrieve individual box values

Decoding Techniques Demonstrated:
  ✅ Buffer.from(bytes).toString() - Decode bytes to string
  ✅ Buffer.from(bytes).toString("hex") - Decode bytes to hex
  ✅ Buffer.from(bytes).toString("base64") - Decode bytes to base64
  ✅ ABIType.decode() - Decode ABI-encoded values

✨ Example completed successfully!
```

## Common Decoding Patterns

### Pattern 1: Detecting Value Types

```typescript
if (value.uint !== undefined) {
  // Handle uint64 values
  const number = Number(value.uint)
} else if (value.bytes) {
  // Handle byte array values
  const bytes = Buffer.from(value.bytes)
}
```

### Pattern 2: Multi-Format Decoding

```typescript
const bytes = Buffer.from(value.bytes)

// Try as UTF-8 string
const asString = bytes.toString('utf8')

// Get hex representation
const asHex = bytes.toString('hex')

// Get base64 representation
const asBase64 = bytes.toString('base64')

// Display all formats
console.log(`String: "${asString}"`)
console.log(`Hex: ${asHex}`)
console.log(`Base64: ${asBase64}`)
```

### Pattern 3: ABI Type Safety

```typescript
// Define the expected ABI type
const abiType = new ABIUintType(32)

// Decode with type safety
const decoded = abiType.decode(boxValue)

// Use the decoded value
console.log(`Decoded uint32: ${Number(decoded)}`)
```

### Pattern 4: Iterating Through All Boxes

```typescript
const boxes = await algorand.app.getBoxNames(appId)

for (const box of boxes) {
  const boxValue = await algorand.app.getBoxValue(appId, box.nameRaw)

  // Process box name
  const boxNameHex = Buffer.from(box.nameRaw).toString('hex')
  const boxNameBase64 = box.nameBase64

  // Process box value
  const valueString = Buffer.from(boxValue).toString('utf8')
  const valueHex = Buffer.from(boxValue).toString('hex')

  console.log(`Box ${boxNameBase64} (hex: ${boxNameHex})`)
  console.log(`  Value: "${valueString}" (hex: ${valueHex})`)
}
```

## Use Cases

### 1. Debugging Smart Contract State

Decode state to understand what's stored:

```typescript
// Retrieve and decode all state
const appInfo = await algorand.app.getById(appId)
const globalState = appInfo.params.globalState

console.log('Current Global State:')
for (const kv of globalState) {
  const key = Buffer.from(kv.key).toString()
  const value = kv.value.uint || Buffer.from(kv.value.bytes).toString('hex')
  console.log(`  ${key}: ${value}`)
}
```

### 2. Data Migration

Read state in one format, write in another:

```typescript
// Read existing box with string value
const oldValue = await algorand.app.getBoxValue(appId, boxName)
const stringValue = Buffer.from(oldValue).toString('utf8')

// Convert to ABI-encoded value
const abiType = new ABIUintType(64)
const numericValue = parseInt(stringValue)
const abiEncoded = abiType.encode(numericValue)

// Store new ABI-encoded value
await algorand.send.appCallMethodCall({
  method: setBoxMethod,
  args: [boxName, abiEncoded],
  boxReferences: [{ appId: 0n, name: boxName }],
})
```

### 3. State Export/Reporting

Export state data for analysis:

```typescript
const stateReport = {
  appId: Number(appId),
  globalState: {},
  boxes: [],
}

// Export global state
const appInfo = await algorand.app.getById(appId)
for (const kv of appInfo.params.globalState) {
  const key = Buffer.from(kv.key).toString()
  stateReport.globalState[key] = kv.value.uint || Buffer.from(kv.value.bytes).toString('hex')
}

// Export boxes
const boxes = await algorand.app.getBoxNames(appId)
for (const box of boxes) {
  const boxValue = await algorand.app.getBoxValue(appId, box.nameRaw)
  stateReport.boxes.push({
    name: box.nameBase64,
    value: Buffer.from(boxValue).toString('base64'),
    size: boxValue.length,
  })
}

console.log(JSON.stringify(stateReport, null, 2))
```

## Best Practices

### 1. Always Handle Both Value Types

```typescript
if (value.uint !== undefined) {
  // uint64 path
} else if (value.bytes) {
  // bytes path
} else {
  // Handle unexpected case
  console.warn('Unexpected value type')
}
```

### 2. Use Appropriate Encoding for Data Type

```typescript
// For text data
const text = Buffer.from(bytes).toString('utf8')

// For binary data
const hex = Buffer.from(bytes).toString('hex')

// For transmission
const base64 = Buffer.from(bytes).toString('base64')
```

### 3. Validate ABI Decoding

```typescript
try {
  const decoded = abiType.decode(boxValue)
  console.log('Decoded successfully:', decoded)
} catch (error) {
  console.error('Failed to decode as ABI type:', error)
  // Fall back to hex representation
  console.log('Raw hex:', Buffer.from(boxValue).toString('hex'))
}
```

### 4. Document Expected Formats

```typescript
// Document what format is expected
interface StateSchema {
  // uint64 counter
  counter: bigint

  // UTF-8 encoded name
  name: string

  // Hex-encoded address
  owner: string

  // ABI-encoded uint32 timestamp
  timestamp: number
}
```

## Key Takeaways

1. **Multiple Formats**: Same data can be decoded as string, hex, or base64
2. **Type Detection**: Check `value.uint` vs `value.bytes` to determine type
3. **ABI Safety**: Use ABI types for type-safe encoding/decoding
4. **Buffer Utility**: Node's Buffer class handles all encoding conversions
5. **Box Flexibility**: Boxes can store any byte array, making them versatile

## Additional Resources

- [Algorand State Storage](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/state/)
- [ABI Specification](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/ABI/)
- [Node.js Buffer Documentation](https://nodejs.org/api/buffer.html)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)

## Related Examples

- Example 144: Retrieve Application State (Global, Local, and Box Storage)
- Example 24: Method Calls with ABI
- Example 32: Fund App Account

---

This example demonstrates production-ready patterns for retrieving and decoding application state in multiple formats, essential for debugging, data migration, and state analysis.
