# Converting ABI Byte Arrays to Uint8Array

This example demonstrates how to work with ABI byte arrays and convert them to Uint8Array format using AlgoSDK. Understanding ABI byte array handling is essential when working with Algorand smart contracts that exchange binary data.

## What This Example Shows

This example teaches you how to:
- Create and use ABIArrayStaticType for fixed-length byte arrays
- Create and use ABIArrayDynamicType for variable-length byte arrays
- Encode JavaScript arrays to ABI-encoded Uint8Array format
- Decode ABI-encoded bytes back to Uint8Array
- Work with Uint8Array values directly
- Convert hex strings to byte arrays for ABI encoding

## Why This Matters

ABI byte array handling is crucial for smart contract development:

1. **Binary Data Exchange**: Smart contracts often work with binary data
2. **Type Safety**: ABI ensures correct data formats
3. **Efficient Storage**: Byte arrays are space-efficient
4. **Interoperability**: Standard format for data exchange
5. **Smart Contract Arguments**: Many methods accept byte array parameters

Key concepts:
- **ABIByteType**: Represents a single byte in ABI
- **ABIArrayStaticType**: Fixed-length array of a specific type
- **ABIArrayDynamicType**: Variable-length array of a specific type
- **Uint8Array**: JavaScript's typed array for bytes (0-255)
- **ABI Encoding**: Standard format for data serialization

Common use cases:
- **Hash Values**: Passing hashes to smart contracts
- **Signatures**: Encoding cryptographic signatures
- **Binary Data**: Storing arbitrary binary data
- **Asset Metadata**: Encoding metadata as bytes
- **Cross-Chain Data**: Exchanging data between systems

## How It Works

The example demonstrates four scenarios for working with ABI byte arrays:

### 1. Static Byte Array Conversion

Convert a fixed-length array to Uint8Array:

```typescript
import { ABIByteType, ABIArrayStaticType } from 'algosdk'

// Create a static array type: byte[4]
const byteType = new ABIByteType()
const staticArrayType = new ABIArrayStaticType(byteType, 4)

// Encode a JavaScript array
const staticValue = [1, 2, 3, 4]
const staticEncoded = staticArrayType.encode(staticValue)
console.log(staticEncoded)  // Uint8Array(4) [1, 2, 3, 4]

// Decode it back
const staticDecoded = staticArrayType.decode(staticEncoded)
console.log(Array.from(staticDecoded))  // [1, 2, 3, 4]
```

**Static arrays** have a fixed length defined at compile time:
- Type notation: `byte[N]` where N is the fixed length
- All elements must fit within the specified length
- Efficient for known-size data

### 2. Dynamic Byte Array Conversion

Convert a variable-length array to Uint8Array:

```typescript
import { ABIArrayDynamicType } from 'algosdk'

// Create a dynamic array type: byte[]
const dynamicArrayType = new ABIArrayDynamicType(byteType)

// Encode a variable-length array
const dynamicValue = [10, 20, 30, 40, 50]
const dynamicEncoded = dynamicArrayType.encode(dynamicValue)
console.log(dynamicEncoded)  // Uint8Array [0, 5, 10, 20, 30, 40, 50]

// Decode it back
const dynamicDecoded = dynamicArrayType.decode(dynamicEncoded)
console.log(Array.from(dynamicDecoded))  // [10, 20, 30, 40, 50]
```

**Dynamic arrays** can have variable lengths:
- Type notation: `byte[]`
- Length is encoded as part of the data (first 2 bytes)
- Flexible for unknown-size data

### 3. Working with Uint8Array Directly

You can encode/decode Uint8Array values:

```typescript
// Create a Uint8Array directly
const uint8Value = new Uint8Array([5, 6, 7])

// Encode it
const uint8ArrayType = new ABIArrayStaticType(byteType, 3)
const uint8Encoded = uint8ArrayType.encode(uint8Value)

// Decode it back
const uint8Decoded = uint8ArrayType.decode(uint8Encoded)
console.log(Array.from(uint8Decoded))  // [5, 6, 7]
```

### 4. Practical Example: Hex to Byte Array

Convert hex-encoded data to ABI byte arrays:

```typescript
function hexToBytes(hex: string): number[] {
  const bytes: number[] = []
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16))
  }
  return bytes
}

const hexString = '48656c6c6f'  // "Hello" in hex
const hexBytes = hexToBytes(hexString)
// [72, 101, 108, 108, 111]

const hexArrayType = new ABIArrayDynamicType(byteType)
const hexEncoded = hexArrayType.encode(hexBytes)
const hexDecoded = hexArrayType.decode(hexEncoded) as Uint8Array

console.log(String.fromCharCode(...hexDecoded))  // "Hello"
```

## Static vs Dynamic Arrays

Understanding when to use each type:

### Static Arrays (`byte[N]`)

**Use when:**
- You know the exact length ahead of time
- Working with fixed-size data (hashes, signatures)
- Performance is critical (no length encoding overhead)

**Examples:**
```typescript
// SHA-256 hash (always 32 bytes)
const hashType = new ABIArrayStaticType(byteType, 32)

// Ed25519 signature (always 64 bytes)
const signatureType = new ABIArrayStaticType(byteType, 64)

// Fixed-size identifier (4 bytes)
const idType = new ABIArrayStaticType(byteType, 4)
```

### Dynamic Arrays (`byte[]`)

**Use when:**
- Length varies at runtime
- Working with variable-size data (messages, metadata)
- Need flexibility over efficiency

**Examples:**
```typescript
const dynamicType = new ABIArrayDynamicType(byteType)

// Variable-length message
const message = Array.from(new TextEncoder().encode('Variable length'))

// Metadata of unknown size
const metadata = [/* variable number of bytes */]

// User input that varies in length
const userInput = [/* user-provided bytes */]
```

## Prerequisites

- Node.js and npm installed
- No network connection required (this is a standalone utility example)

## Running the Example

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the example:
   ```bash
   npm start
   ```

## Expected Output

```
=== Converting ABI Byte Arrays to Uint8Array ===

1. Static Byte Array Conversion (byte[4])
   Converting a fixed-length array of bytes...

   Original value: [1, 2, 3, 4]
   Type: byte[4]
   Encoded: 1,2,3,4
   Is Uint8Array: true
   Decoded: [1, 2, 3, 4]
   Decoded is Uint8Array: false

2. Dynamic Byte Array Conversion (byte[])
   Converting a variable-length array of bytes...

   Original value: [10, 20, 30, 40, 50]
   Type: byte[]
   Encoded: 0,5,10,20,30,40,50
   Is Uint8Array: true
   Decoded: [10, 20, 30, 40, 50]
   Decoded is Uint8Array: false

3. Working with Uint8Array Directly
   Encoding and decoding Uint8Array values...

   Original Uint8Array: [5, 6, 7]
   Encoded: 5,6,7
   Is Uint8Array: true
   Decoded: [5, 6, 7]
   Decoded is Uint8Array: false

4. Practical Example: Hex String to Byte Array
   Converting hex-encoded data to ABI byte array...

   Hex string: 48656c6c6f
   As bytes: [72, 101, 108, 108, 111]
   As text: Hello
   Encoded: 0,5,72,101,108,108,111
   Decoded: [72, 101, 108, 108, 111]
   Back to text: Hello

=== Summary ===
✅ Successfully demonstrated ABI byte array conversions!

Key points:
  • ABIArrayStaticType for fixed-length byte arrays (byte[N])
  • ABIArrayDynamicType for variable-length byte arrays (byte[])
  • encode() converts JavaScript arrays to Uint8Array
  • decode() converts encoded bytes back to Uint8Array
  • Both static and dynamic arrays are supported

=== Key Takeaways ===
• Use ABIByteType with array types for byte array handling
• Static arrays have fixed length, dynamic arrays are variable
• ABI encoding/decoding preserves byte array data
• Decoded byte arrays are returned as Uint8Array instances
```

## Common Patterns

### Encoding a Hash Value

```typescript
// SHA-256 hash is always 32 bytes
const hashType = new ABIArrayStaticType(new ABIByteType(), 32)

const hash = new Uint8Array([
  0xde, 0xad, 0xbe, 0xef, /* ... 32 bytes total ... */
])

const encodedHash = hashType.encode(hash)
// Pass encodedHash to smart contract method
```

### Encoding Variable-Length Data

```typescript
const dynamicType = new ABIArrayDynamicType(new ABIByteType())

// Convert string to bytes
const text = 'Hello, Algorand!'
const textBytes = Array.from(new TextEncoder().encode(text))

const encoded = dynamicType.encode(textBytes)
// Pass encoded to smart contract
```

### Decoding Contract Return Values

```typescript
// Smart contract returns byte[32]
const returnType = new ABIArrayStaticType(new ABIByteType(), 32)

const contractReturn = /* bytes from contract */
const decoded = returnType.decode(contractReturn) as Uint8Array

// Work with the decoded bytes
console.log(`Hash: ${Buffer.from(decoded).toString('hex')}`)
```

## Integration with Smart Contracts

### Passing Byte Arrays as Arguments

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()

// Prepare byte array argument
const hashValue = new Uint8Array(32)  // Your hash data

// Call smart contract method with byte array
await appClient.send.call({
  method: 'processHash',
  args: [hashValue],  // AlgoKit handles ABI encoding
})
```

### Decoding Byte Array Returns

```typescript
// Call method that returns byte[]
const result = await appClient.send.call({
  method: 'getData',
  args: [],
})

// The return value is automatically decoded
const data = result.return as Uint8Array
console.log(`Received ${data.length} bytes`)
```

## Key Takeaways

- Use `ABIArrayStaticType` for fixed-length byte arrays (`byte[N]`)
- Use `ABIArrayDynamicType` for variable-length byte arrays (`byte[]`)
- `encode()` converts JavaScript arrays to ABI-encoded Uint8Array
- `decode()` converts ABI-encoded bytes back to usable format
- Static arrays are more efficient but require known length
- Dynamic arrays include length encoding (2 bytes) as prefix
- AlgoSDK handles all the ABI encoding/decoding details
- Uint8Array is JavaScript's standard way to work with binary data
- Decoded values can be used directly in your application logic
- Proper byte array handling is essential for smart contract interaction
- Consider using static arrays for known-size data (hashes, signatures)
- Use dynamic arrays when size is unknown or varies at runtime

