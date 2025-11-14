# Example 122: Raw Application Call with Manual Argument Encoding

This example demonstrates how to make raw application calls with manually encoded arguments, providing fine-grained control over the low-level ABI encoding process. This is an advanced pattern useful for debugging, testing, and scenarios requiring custom encoding.

## Core Concept

In AlgoKit Utils, there are **two ways** to call smart contract methods:

1. **High-level ABI method calls** (`.addAppCallMethodCall()`): Automatic encoding and decoding
2. **Low-level raw calls** (`.addAppCall()`): Manual encoding and decoding

This example focuses on **raw application calls**, where you:

1. **Calculate the method selector**: First 4 bytes of keccak256(method signature)
2. **Manually encode arguments**: Using `algosdk.encodeUint64()`, ABI string encoding, etc.
3. **Create raw app call**: Pass encoded bytes in `args` array
4. **Use `.execute()` instead of `.send()`**: Different return type handling
5. **Manually decode results**: Extract and decode from transaction logs

Key characteristics:
- **Full control over encoding**: Specify exact byte representation
- **Method selector required**: Must calculate and provide selector
- **Manual ABI encoding**: Use algosdk encoding functions
- **Log-based results**: Decode return values from logs
- **Useful for debugging**: Understand low-level protocol behavior

## What This Example Shows

This example demonstrates:

1. **Deploying a TEAL contract**: Smart contract with `doMath(uint64,uint64,string)uint64` method
2. **Calculating method selectors**: From method signature to 4-byte selector
3. **Manual argument encoding**: Using `algosdk.encodeUint64()` and ABI string encoding
4. **Creating transaction groups**: Combining raw app calls with payments
5. **Decoding results from logs**: Extracting and parsing ABI return values

## Transaction Group Structure

```
Group of 2 transactions:
┌─────────────────────────────────────────┐
│ [0] Payment Transaction                 │
│     From: sender                        │
│     To: sender                          │
│     Amount: 0 microALGOs               │
│     Purpose: Part of atomic group       │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ [1] Raw App Call Transaction            │
│     Method: doMath(uint64,uint64,string)│
│     Args (raw bytes):                   │
│       [0] 76a7ef33 (method selector)    │
│       [1] 0000000000000005 (uint64: 5)  │
│       [2] 0000000000000003 (uint64: 3)  │
│       [3] 000373756d (string: "sum")    │
│     Returns: 8 (via logs)               │
└─────────────────────────────────────────┘
```

## Method Selector Calculation

### What is a Method Selector?

A **method selector** is the first 4 bytes of the keccak256 hash of the method signature. It uniquely identifies which method to call.

### Calculation Process

```typescript
// Step 1: Define the method
const doMathMethod = new algosdk.ABIMethod({
  name: 'doMath',
  args: [
    { type: 'uint64', name: 'a', desc: 'First number' },
    { type: 'uint64', name: 'b', desc: 'Second number' },
    { type: 'string', name: 'op', desc: 'Operation' },
  ],
  returns: { type: 'uint64', desc: 'Result' },
})

// Step 2: Get the signature
const signature = doMathMethod.getSignature()
// Result: "doMath(uint64,uint64,string)uint64"

// Step 3: Get the selector (first 4 bytes of keccak256)
const methodSelector = doMathMethod.getSelector()
// Result: Uint8Array([0x76, 0xa7, 0xef, 0x33])
```

### Manual Calculation (if needed)

```typescript
import { createHash } from 'crypto'

function calculateSelector(signature: string): Uint8Array {
  const hash = createHash('sha3-256').update(signature).digest()
  return hash.subarray(0, 4)
}

const selector = calculateSelector('doMath(uint64,uint64,string)uint64')
// Result: Uint8Array([0x76, 0xa7, 0xef, 0x33])
```

## Argument Encoding

### ABI Encoding Types

Different ABI types require different encoding:

```typescript
// uint64: 8-byte big-endian integer
const arg1 = algosdk.encodeUint64(5)
// Result: Uint8Array([0, 0, 0, 0, 0, 0, 0, 5])

const arg2 = algosdk.encodeUint64(3)
// Result: Uint8Array([0, 0, 0, 0, 0, 0, 0, 3])

// string: 2-byte length prefix + UTF-8 bytes
const str = "sum"
const length = new Uint8Array([0, str.length]) // 2-byte length
const bytes = new TextEncoder().encode(str)
const arg3 = new Uint8Array([...length, ...bytes])
// Result: Uint8Array([0, 3, 115, 117, 109])
// Or use base64: Uint8Array.from(Buffer.from('AANzdW0=', 'base64'))

// address: 32-byte public key
const addressArg = algosdk.decodeAddress(address).publicKey

// bool: single byte (0 or 1)
const boolArg = new Uint8Array([1]) // true

// byte[]: length prefix + bytes
const bytesArg = new Uint8Array([0, bytes.length, ...bytes])
```

## Key API Pattern

The pattern for raw application calls with manual encoding:

```typescript
// Step 1: Calculate method selector
const method = new algosdk.ABIMethod({
  name: 'doMath',
  args: [
    { type: 'uint64', name: 'a' },
    { type: 'uint64', name: 'b' },
    { type: 'string', name: 'op' },
  ],
  returns: { type: 'uint64' },
})

const methodSelector = method.getSelector()

// Step 2: Manually encode each argument
const arg1 = algosdk.encodeUint64(5)
const arg2 = algosdk.encodeUint64(3)
const arg3 = Uint8Array.from(Buffer.from('AANzdW0=', 'base64')) // "sum"

// Step 3: Create raw app call with encoded arguments
const result = await algorand
  .newGroup()
  .addAppCall({
    sender: sender.addr,
    appId: appId,
    args: [
      methodSelector, // First arg is always the method selector
      arg1,           // Then the encoded arguments
      arg2,
      arg3,
    ],
  })
  .execute() // Note: .execute() not .send()

// Step 4: Manually decode result from logs
const logData = Buffer.from(result.confirmations[1].logs[0])
const returnPrefix = logData.subarray(0, 4) // 0x151f7c75
const resultBytes = logData.subarray(4, 12)
const resultValue = algosdk.decodeUint64(resultBytes, 'safe')
```

Key points:
- **Method selector first**: Always the first element in `args` array
- **Manual encoding**: Use algosdk encoding functions for each argument
- **Use `.execute()`**: Raw calls return different type than `.send()`
- **Decode from logs**: Results are in transaction logs, not return values

## Step-by-Step Breakdown

### Step 1: Deploy Smart Contract

```typescript
const approvalProgram = `#pragma version 10
// Method: doMath(uint64,uint64,string)uint64

txn ApplicationID
int 0
==
bnz create

// Check method selector
txn ApplicationArgs 0
method "doMath(uint64,uint64,string)uint64"
==
bnz do_math

int 0
return

do_math:
// Get the two numbers (args 1 and 2)
txn ApplicationArgs 1
btoi
txn ApplicationArgs 2
btoi

// Get the operation (arg 3) - ABI encoded string
// ABI string format: 2-byte length prefix + string bytes
txn ApplicationArgs 3
extract 2 0  // Skip the 2-byte length prefix
byte "sum"
==
bnz operation_sum

int 0
b encode_result

operation_sum:
+

encode_result:
// Encode as ABI uint64
itob
byte 0x151f7c75 // ABI return prefix
swap
concat
log
int 1
return

create:
int 1
return`
```

### Step 2: Calculate Method Selector

```typescript
const doMathMethod = new algosdk.ABIMethod({
  name: 'doMath',
  args: [
    { type: 'uint64', name: 'a', desc: 'First number' },
    { type: 'uint64', name: 'b', desc: 'Second number' },
    { type: 'string', name: 'op', desc: 'Operation' },
  ],
  returns: { type: 'uint64', desc: 'Result' },
})

const methodSelector = doMathMethod.getSelector()
console.log('Method signature:', doMathMethod.getSignature())
// Output: "doMath(uint64,uint64,string)uint64"

console.log('Method selector (hex):', Buffer.from(methodSelector).toString('hex'))
// Output: "76a7ef33"
```

### Step 3: Manually Encode Arguments

```typescript
// Encode uint64 arguments
const arg1 = algosdk.encodeUint64(5)
const arg2 = algosdk.encodeUint64(3)

// Encode string argument with ABI length prefix
const arg3 = Uint8Array.from(Buffer.from('AANzdW0=', 'base64'))
// Decodes to: [0, 3, 115, 117, 109] = 2-byte length (3) + "sum"

console.log('Argument 1 (uint64: 5):', Array.from(arg1))
// Output: [0, 0, 0, 0, 0, 0, 0, 5]

console.log('Argument 2 (uint64: 3):', Array.from(arg2))
// Output: [0, 0, 0, 0, 0, 0, 0, 3]

console.log('Argument 3 (string: "sum"):', Array.from(arg3))
// Output: [0, 3, 115, 117, 109]
```

### Step 4: Create Raw App Call

```typescript
const result = await algorand
  .newGroup()
  // Optional: Add other transactions to the group
  .addPayment({
    sender: sender.addr,
    receiver: sender.addr,
    amount: (0).microAlgo(),
  })
  // Add raw app call with manual encoding
  .addAppCall({
    sender: sender.addr,
    appId: appId,
    args: [
      methodSelector, // Method selector
      arg1,           // First argument
      arg2,           // Second argument
      arg3,           // Third argument
    ],
  })
  .execute() // Use .execute() for raw calls
```

### Step 5: Decode Result from Logs

```typescript
// Get the log from the app call transaction
const logData = Buffer.from(result.confirmations[1].logs[0])

// ABI return format: 4-byte prefix + encoded value
const returnPrefix = logData.subarray(0, 4).toString('hex')
// Output: "151f7c75" (standard ABI return prefix)

// Decode the uint64 result
const resultBytes = logData.subarray(4, 12)
const resultValue = algosdk.decodeUint64(resultBytes, 'safe')

console.log('Result value:', resultValue)
// Output: 8 (5 + 3)
```

## Use Cases

### 1. Debugging ABI Encoding Issues

When ABI method calls fail, use raw calls to test encoding:

```typescript
// Test if your encoding matches what the contract expects
const methodSelector = method.getSelector()
const testArg = algosdk.encodeUint64(42)

await algorand
  .newGroup()
  .addAppCall({
    appId: appId,
    args: [methodSelector, testArg],
  })
  .execute()
// If this works, your encoding is correct
```

### 2. Low-Level Protocol Testing

Test smart contract behavior at the protocol level:

```typescript
// Send malformed arguments to test contract validation
const invalidArg = new Uint8Array([0xFF, 0xFF]) // Invalid uint64

try {
  await algorand
    .newGroup()
    .addAppCall({
      appId: appId,
      args: [methodSelector, invalidArg],
    })
    .execute()
} catch (error) {
  console.log('Contract correctly rejected invalid argument')
}
```

### 3. Custom Encoding Schemes

Implement encoding not supported by ABI:

```typescript
// Custom packed encoding for efficiency
const packedArgs = new Uint8Array(16)
const view = new DataView(packedArgs.buffer)
view.setUint64(0, 5n)   // First 8 bytes
view.setUint64(8, 3n)   // Next 8 bytes

await algorand
  .newGroup()
  .addAppCall({
    appId: appId,
    args: [methodSelector, packedArgs],
  })
  .execute()
```

### 4. Building Development Tools

Create tools that need fine-grained control:

```typescript
// Contract explorer that decodes method calls
function exploreContract(appId: bigint) {
  const methods = getContractMethods(appId)

  for (const method of methods) {
    const selector = method.getSelector()
    console.log(`Method: ${method.name}`)
    console.log(`Selector: ${Buffer.from(selector).toString('hex')}`)

    // Test call with dummy arguments
    const args = method.args.map(arg => encodeDefaultValue(arg.type))
    testRawCall(appId, selector, args)
  }
}
```

### 5. Performance Optimization

When you need maximum control over bytes:

```typescript
// Pre-encode arguments for batch processing
const preEncodedCalls = Array.from({ length: 100 }, (_, i) => ({
  selector: methodSelector,
  args: [
    algosdk.encodeUint64(i),
    algosdk.encodeUint64(i * 2),
    encodeString('multiply'),
  ],
}))

// Execute batch with minimal overhead
for (const call of preEncodedCalls) {
  await algorand
    .newGroup()
    .addAppCall({
      appId: appId,
      args: [call.selector, ...call.args],
    })
    .execute()
}
```

## Comparison: ABI Method Call vs Raw Call

| Aspect | ABI Method Call | Raw Call |
|--------|----------------|----------|
| **Encoding** | Automatic | Manual |
| **Method Selector** | Automatic | Must provide |
| **Type Safety** | TypeScript types | No type checking |
| **Return Values** | Parsed automatically | Manual decoding |
| **API Method** | `.addAppCallMethodCall()` | `.addAppCall()` |
| **Execution** | `.send()` | `.execute()` |
| **Error Messages** | Detailed | Generic |
| **Use Case** | Production code | Debugging, testing |
| **Complexity** | Low | High |
| **Control** | Limited | Full |

### Code Comparison

**High-level ABI method call:**
```typescript
const result = await algorand
  .newGroup()
  .addAppCallMethodCall({
    appId: appId,
    method: doMathMethod,
    args: [5, 3, "sum"], // Automatic encoding
  })
  .send()

// Return value automatically parsed
const returnValue = result.returns?.[0]?.returnValue
console.log('Result:', returnValue) // 8
```

**Low-level raw call (this example):**
```typescript
const methodSelector = doMathMethod.getSelector()
const arg1 = algosdk.encodeUint64(5)    // Manual encoding
const arg2 = algosdk.encodeUint64(3)    // Manual encoding
const arg3 = encodeString("sum")        // Manual encoding

const result = await algorand
  .newGroup()
  .addAppCall({
    appId: appId,
    args: [methodSelector, arg1, arg2, arg3],
  })
  .execute()

// Manual decoding from logs
const logData = Buffer.from(result.confirmations[1].logs[0])
const resultBytes = logData.subarray(4, 12)
const returnValue = algosdk.decodeUint64(resultBytes, 'safe')
console.log('Result:', returnValue) // 8
```

## Smart Contract Implementation

### TEAL Contract with ABI Method

```teal
#pragma version 10

txn ApplicationID
int 0
==
bnz create

// doMath(uint64,uint64,string)uint64
txn ApplicationArgs 0
method "doMath(uint64,uint64,string)uint64"
==
bnz do_math

int 0
return

do_math:
// Get the two numbers (args 1 and 2)
txn ApplicationArgs 1
btoi
txn ApplicationArgs 2
btoi

// Get the operation (arg 3)
// ABI string has 2-byte length prefix
txn ApplicationArgs 3
extract 2 0  // Skip length prefix
byte "sum"
==
bnz operation_sum

// Default: return 0
int 0
b encode_result

operation_sum:
// Add the two numbers
+

encode_result:
// Encode as ABI uint64
itob
byte 0x151f7c75 // ABI return prefix
swap
concat
log
int 1
return

create:
int 1
return
```

### Key TEAL Concepts

**1. Method Selector Matching:**
```teal
txn ApplicationArgs 0
method "doMath(uint64,uint64,string)uint64"
==
```

**2. Accessing Arguments:**
```teal
txn ApplicationArgs 1  // First argument (after selector)
txn ApplicationArgs 2  // Second argument
txn ApplicationArgs 3  // Third argument
```

**3. Decoding ABI String:**
```teal
txn ApplicationArgs 3
extract 2 0  // Skip 2-byte length prefix
```

**4. Encoding Return Value:**
```teal
// Result is on stack
itob                    // Convert to bytes
byte 0x151f7c75         // ABI return prefix
swap
concat
log                     // Write to logs
```

## ABI Return Prefix

All ABI return values include a **4-byte prefix**: `0x151f7c75`

This prefix indicates:
- The bytes following are an ABI-encoded return value
- The contract executed successfully
- The result can be decoded according to the return type

```typescript
// Checking for valid ABI return
const logData = Buffer.from(result.confirmations[1].logs[0])
const prefix = logData.subarray(0, 4).toString('hex')

if (prefix === '151f7c75') {
  console.log('✓ Valid ABI return')
  // Decode the value
  const value = logData.subarray(4)
} else {
  console.log('✗ Invalid or non-ABI return')
}
```

## Best Practices

### 1. Always Validate Method Selectors

```typescript
// Ensure selector matches contract expectation
const calculatedSelector = method.getSelector()
const expectedSelector = new Uint8Array([0x76, 0xa7, 0xef, 0x33])

if (!arraysEqual(calculatedSelector, expectedSelector)) {
  throw new Error('Method selector mismatch!')
}
```

### 2. Document Encoding Format

```typescript
/**
 * Encode arguments for doMath method
 * @param a - First number (uint64)
 * @param b - Second number (uint64)
 * @param op - Operation string ("sum", "sub", "mul", "div")
 * @returns Array of encoded arguments
 */
function encodeDoMathArgs(a: number, b: number, op: string): Uint8Array[] {
  return [
    algosdk.encodeUint64(a),
    algosdk.encodeUint64(b),
    encodeABIString(op),
  ]
}
```

### 3. Handle Encoding Errors

```typescript
try {
  const arg = algosdk.encodeUint64(value)
} catch (error) {
  console.error('Failed to encode uint64:', error)
  throw new Error(`Invalid uint64 value: ${value}`)
}
```

### 4. Verify Decoded Values

```typescript
const resultValue = algosdk.decodeUint64(resultBytes, 'safe')

// Validate result is in expected range
if (resultValue < 0 || resultValue > Number.MAX_SAFE_INTEGER) {
  throw new Error(`Result out of range: ${resultValue}`)
}
```

### 5. Use Helper Functions

```typescript
// ABI string encoding helper
function encodeABIString(str: string): Uint8Array {
  const bytes = new TextEncoder().encode(str)
  const length = new Uint8Array(2)
  new DataView(length.buffer).setUint16(0, bytes.length)
  return new Uint8Array([...length, ...bytes])
}

// ABI string decoding helper
function decodeABIString(encoded: Uint8Array): string {
  const length = new DataView(encoded.buffer).getUint16(0)
  const bytes = encoded.subarray(2, 2 + length)
  return new TextDecoder().decode(bytes)
}
```

## Common Pitfalls

### 1. Forgetting Method Selector

```typescript
// ❌ Wrong: Missing method selector
await algorand
  .newGroup()
  .addAppCall({
    args: [arg1, arg2, arg3], // Missing selector!
  })
  .execute()

// ✅ Correct: Selector is first argument
await algorand
  .newGroup()
  .addAppCall({
    args: [methodSelector, arg1, arg2, arg3],
  })
  .execute()
```

### 2. Using `.send()` Instead of `.execute()`

```typescript
// ❌ Wrong: .send() for raw calls
const result = await algorand
  .newGroup()
  .addAppCall({ args: [...] })
  .send() // Wrong method!

// ✅ Correct: .execute() for raw calls
const result = await algorand
  .newGroup()
  .addAppCall({ args: [...] })
  .execute()
```

### 3. Incorrect String Encoding

```typescript
// ❌ Wrong: Missing length prefix
const str = "sum"
const arg = new TextEncoder().encode(str)
// Results in: [115, 117, 109]

// ✅ Correct: Include 2-byte length prefix
const bytes = new TextEncoder().encode(str)
const length = new Uint8Array([0, bytes.length])
const arg = new Uint8Array([...length, ...bytes])
// Results in: [0, 3, 115, 117, 109]
```

### 4. Wrong Endianness

```typescript
// ❌ Wrong: Little-endian
const buffer = new ArrayBuffer(8)
const view = new DataView(buffer)
view.setUint32(0, 5, true) // true = little-endian

// ✅ Correct: Big-endian (network byte order)
const arg = algosdk.encodeUint64(5)
// Or manually:
view.setUint32(4, 5, false) // false = big-endian
```

### 5. Not Handling ABI String Length Prefix in TEAL

```teal
# ❌ Wrong: Comparing with length prefix included
txn ApplicationArgs 3
byte "sum"  # This is [115, 117, 109]
==          # But arg is [0, 3, 115, 117, 109]

# ✅ Correct: Skip length prefix first
txn ApplicationArgs 3
extract 2 0  # Skip 2-byte prefix
byte "sum"
==
```

## Error Handling

### Transaction Rejection

```typescript
try {
  const result = await algorand
    .newGroup()
    .addAppCall({
      appId: appId,
      args: [methodSelector, ...encodedArgs],
    })
    .execute()
} catch (error) {
  if (error.message.includes('logic eval error')) {
    console.error('Contract rejected the call')
    console.error('Check argument encoding and contract logic')
  } else if (error.message.includes('invalid ApplicationArgs')) {
    console.error('Invalid argument format')
  } else {
    console.error('Unexpected error:', error)
  }
}
```

### Decoding Errors

```typescript
try {
  const logData = Buffer.from(result.confirmations[1].logs[0])

  // Check for ABI return prefix
  if (logData.subarray(0, 4).toString('hex') !== '151f7c75') {
    throw new Error('Invalid ABI return format')
  }

  // Decode value
  const resultBytes = logData.subarray(4, 12)
  const resultValue = algosdk.decodeUint64(resultBytes, 'safe')

} catch (error) {
  console.error('Failed to decode result:', error)
  console.error('Log data:', logData?.toString('hex'))
}
```

## When to Use Raw Calls

### ✅ Use Raw Calls When:

1. **Debugging encoding issues**: Test specific byte sequences
2. **Low-level protocol testing**: Validate contract behavior
3. **Custom encoding requirements**: Non-standard encoding schemes
4. **Building development tools**: Need fine-grained control
5. **Performance optimization**: Pre-encode for batch processing
6. **Learning ABI internals**: Understand encoding mechanism

### ❌ Don't Use Raw Calls When:

1. **Production application code**: Use ABI method calls instead
2. **Simple use cases**: Automatic encoding is sufficient
3. **Type safety is important**: Raw calls bypass type checking
4. **Team lacks low-level knowledge**: Increases maintenance burden
5. **No specific requirement**: Prefer higher-level API

## Related Examples

- [Example 120: Pass Transaction as ABI Method Argument](../120-pass-transaction-as-abi-method-argument/README.md) - Transaction arguments with ABI
- [Example 121: Pass Transaction as Method Argument](../121-pass-transaction-as-method-argument/README.md) - Multi-transaction groups
- [Example 24: Method Calls with ABI](../24-method-calls-with-abi/README.md) - High-level ABI method calls
- [Example 25: Method Calls with Transaction Args](../25-method-calls-with-transaction-args/README.md) - Combining patterns

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
1. Deploy a smart contract with `doMath` method
2. Calculate the method selector from the signature
3. Manually encode three arguments (two uint64s and a string)
4. Create a transaction group with a payment and raw app call
5. Execute the group atomically
6. Decode the result from logs
7. Display the result: 8 (5 + 3)
8. Show comparison between ABI method calls and raw calls

## Key Takeaways

1. **Raw calls provide full control**: Direct access to low-level encoding
2. **Method selectors are required**: First 4 bytes of method signature hash
3. **Manual encoding is necessary**: Use algosdk encoding functions
4. **Results come from logs**: Must manually decode return values
5. **Use `.execute()` not `.send()`**: Different return type handling
6. **ABI strings have length prefix**: 2 bytes for length, then UTF-8 bytes
7. **Prefer ABI method calls**: Use raw calls only when necessary
8. **Useful for debugging**: Understanding encoding issues
9. **Building blocks for tools**: Fine-grained control for development tools
10. **Educational value**: Learn how ABI encoding works under the hood

This pattern is essential for **advanced AlgoKit Utils usage**, enabling low-level control when you need it while understanding when to use high-level APIs!
