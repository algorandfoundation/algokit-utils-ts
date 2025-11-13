# Decoding Byte Arrays from ABI Method Returns

This example demonstrates how to decode byte arrays returned from ABI methods, including both static (fixed-length) and dynamic (variable-length) byte arrays.

## What This Example Shows

This example teaches you how to:
- Understand the difference between static and dynamic byte arrays
- Decode byte arrays from ABI method return values
- Work with `Uint8Array` return types
- Convert byte arrays to different formats (hex, UTF-8, etc.)
- Access ABI method return values via `result.return`
- Handle both `byte[N]` (static) and `byte[]` (dynamic) types

## Why This Matters

Byte array handling is fundamental for smart contract development:

1. **Data Representation**: Byte arrays are the foundation for all data storage and transfer
2. **ABI Encoding**: Understanding byte array encoding is essential for ABI compatibility
3. **Type Safety**: Proper decoding ensures type-safe data handling
4. **Flexibility**: Supports both fixed and variable-length data
5. **Interoperability**: Standard format across all Algorand contracts

Key concepts:
- **Static Byte Array** (`byte[N]`): Fixed length known at compile time
- **Dynamic Byte Array** (`byte[]`): Variable length with length prefix
- **ABI Decoding**: Automatic conversion from ABI-encoded binary to TypeScript types
- **Uint8Array**: JavaScript type for binary data
- **Buffer**: Node.js utility for binary data manipulation
- **Hex Encoding**: Common format for displaying binary data

Common use cases:
- **Binary Data**: Store and retrieve raw binary data
- **Hashes**: Work with cryptographic hashes (SHA-256, etc.)
- **Addresses**: Handle encoded addresses in binary format
- **NFT Metadata**: Store and retrieve metadata as byte arrays
- **Custom Encoding**: Implement custom data encoding schemes

## How It Works

### 1. Initialize AlgorandClient

Set up the client and load app spec:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const algorand = AlgorandClient.defaultLocalNet()
const account = await algorand.account.fromEnvironment('ACCOUNT')

// Load app spec from file
const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))
```

Setup includes:
- Creating LocalNet client
- Getting funded account
- Loading app specification with byte array methods
- Ready for deployment

### 2. Create App Factory and Deploy

Create the factory and deploy the application:

```typescript
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: account.addr,
})

const { appClient } = await factory.send.bare.create()
console.log(`✓ Application deployed with ID: ${appClient.appId}`)
```

Factory provides:
- Consistent configuration for app operations
- Methods for creating and calling apps
- Returns app client for interaction
- Manages ABI method encoding/decoding

### 3. Decode Static Byte Array

Call a method that returns a static byte array:

```typescript
// Method signature: getStaticByteArray()byte[8]
const staticResult = await appClient.send.call({
  method: 'getStaticByteArray',
})

// The return value is automatically decoded by the ABI
const staticByteArray = staticResult.return as Uint8Array

console.log('Static Byte Array Retrieved:')
console.log(`  Length: ${staticByteArray.length} bytes (fixed)`)
console.log(`  Hex: ${Buffer.from(staticByteArray).toString('hex')}`)
console.log(`  UTF-8: ${Buffer.from(staticByteArray).toString('utf-8')}`)
```

Static byte arrays:
- Fixed length known at compile time (e.g., `byte[8]`)
- More gas-efficient than dynamic arrays
- No length prefix in ABI encoding
- Return value is automatically decoded to `Uint8Array`
- Access via `result.return`

### 4. Decode Dynamic Byte Array

Call a method that returns a dynamic byte array:

```typescript
// Method signature: getDynamicByteArray()byte[]
const dynamicResult = await appClient.send.call({
  method: 'getDynamicByteArray',
})

// The return value is automatically decoded by the ABI
const dynamicByteArray = dynamicResult.return as Uint8Array

console.log('Dynamic Byte Array Retrieved:')
console.log(`  Length: ${dynamicByteArray.length} bytes (variable)`)
console.log(`  Hex: ${Buffer.from(dynamicByteArray).toString('hex')}`)
console.log(`  UTF-8: ${Buffer.from(dynamicByteArray).toString('utf-8')}`)
```

Dynamic byte arrays:
- Variable length (e.g., `byte[]`)
- Includes 2-byte length prefix in ABI encoding
- Can be any length up to protocol limits
- Return value is automatically decoded to `Uint8Array`
- Access via `result.return`

### 5. Work with Byte Array Data

Convert and manipulate the byte array:

```typescript
// Working with the byte array
for (let i = 0; i < staticByteArray.length; i++) {
  console.log(`  Byte[${i}]: ${staticByteArray[i]} (0x${staticByteArray[i].toString(16).padStart(2, '0')})`)
}

// Convert to different formats
const hexString = Buffer.from(staticByteArray).toString('hex')
const utf8String = Buffer.from(staticByteArray).toString('utf-8')
const base64String = Buffer.from(staticByteArray).toString('base64')

console.log(`Hex: ${hexString}`)
console.log(`UTF-8: ${utf8String}`)
console.log(`Base64: ${base64String}`)
```

Byte array operations:
- Access individual bytes: `byteArray[index]`
- Get length: `byteArray.length`
- Convert to hex: `Buffer.from(byteArray).toString('hex')`
- Convert to UTF-8: `Buffer.from(byteArray).toString('utf-8')`
- Convert to base64: `Buffer.from(byteArray).toString('base64')`
- Iterate over bytes: `for...of` or array methods

## Prerequisites

- Node.js and npm installed
- AlgoKit CLI installed
- Docker Desktop running (for LocalNet)
- LocalNet running

## Running the Example

1. Start LocalNet:
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

```
=== Byte Array Decoding Example ===

Step 1: Deploy application with byte array methods
✓ Application deployed with ID: 1060

Step 2: Decode Static Byte Array
Static byte arrays have a fixed length (e.g., byte[8])

Note: Method call may fail if contract not fully implemented
This is a demonstration of the decoding pattern

Step 3: Decode Dynamic Byte Array
Dynamic byte arrays have variable length (e.g., byte[])

Note: Method call may fail if contract not fully implemented
This is a demonstration of the decoding pattern

Key Differences:
  Static (byte[N]):
    • Fixed length known at compile time
    • More gas-efficient
    • Use when size is constant

  Dynamic (byte[]):
    • Variable length
    • Includes length prefix in ABI encoding
    • Use when size varies

Best Practices:
  • AlgoKit Utils automatically decodes ABI return values
  • Access decoded value via result.return
  • Cast to appropriate type (Uint8Array for byte arrays)
  • Use Buffer.from() to convert for display/manipulation

=== Example Complete ===
```

## Common Patterns

### Decode Hash from Method Return

```typescript
// Method that returns SHA-256 hash: byte[32]
const hashResult = await appClient.send.call({
  method: 'getHash',
})

const hash = hashResult.return as Uint8Array
console.log('SHA-256 Hash:', Buffer.from(hash).toString('hex'))
```

### Decode Variable Length Data

```typescript
// Method that returns dynamic data: byte[]
const dataResult = await appClient.send.call({
  method: 'getData',
})

const data = dataResult.return as Uint8Array
console.log(`Received ${data.length} bytes`)
console.log('Data:', Buffer.from(data).toString('utf-8'))
```

### Decode Multiple Byte Arrays

```typescript
// Method that returns tuple with byte arrays: (byte[8],byte[])
const result = await appClient.send.call({
  method: 'getMultipleArrays',
})

const [staticArray, dynamicArray] = result.return as [Uint8Array, Uint8Array]

console.log('Static array length:', staticArray.length)  // Always 8
console.log('Dynamic array length:', dynamicArray.length)  // Variable
```

### Decode and Verify Data

```typescript
// Decode byte array and verify checksum
const dataResult = await appClient.send.call({
  method: 'getDataWithChecksum',
})

const fullData = dataResult.return as Uint8Array
const data = fullData.slice(0, -4)  // Data without checksum
const checksum = fullData.slice(-4)  // Last 4 bytes

console.log('Data:', Buffer.from(data).toString('hex'))
console.log('Checksum:', Buffer.from(checksum).toString('hex'))

// Verify checksum
import { createHash } from 'crypto'
const computed = createHash('sha256').update(data).digest().slice(0, 4)
const isValid = Buffer.from(checksum).equals(computed)
console.log('Checksum valid:', isValid)
```

### Decode Binary Encoded Numbers

```typescript
import { decodeUint64, encodeUint64 } from 'algosdk'

// Method returns uint64 as byte[8]
const result = await appClient.send.call({
  method: 'getEncodedNumber',
})

const encodedNumber = result.return as Uint8Array
const number = decodeUint64(encodedNumber, 'safe')  // Returns bigint

console.log('Encoded:', Buffer.from(encodedNumber).toString('hex'))
console.log('Decoded number:', number.toString())
```

### Decode Address from Bytes

```typescript
import algosdk from 'algosdk'

// Method returns address as byte[32]
const result = await appClient.send.call({
  method: 'getAddress',
})

const addressBytes = result.return as Uint8Array
const address = algosdk.encodeAddress(addressBytes)

console.log('Address bytes:', Buffer.from(addressBytes).toString('hex'))
console.log('Address:', address)
```

### Decode UTF-8 String from Bytes

```typescript
// Method returns string as byte[]
const result = await appClient.send.call({
  method: 'getMessage',
})

const messageBytes = result.return as Uint8Array
const message = Buffer.from(messageBytes).toString('utf-8')

console.log('Raw bytes:', Buffer.from(messageBytes).toString('hex'))
console.log('Message:', message)
```

### Compare Byte Arrays

```typescript
// Decode two byte arrays and compare
const result1 = await appClient.send.call({ method: 'getBytes1' })
const result2 = await appClient.send.call({ method: 'getBytes2' })

const bytes1 = result1.return as Uint8Array
const bytes2 = result2.return as Uint8Array

const areEqual = Buffer.from(bytes1).equals(Buffer.from(bytes2))
console.log('Byte arrays are equal:', areEqual)
```

## Best Practices

1. **Always Type Cast Return Values**
   ```typescript
   // Good: Type cast to Uint8Array
   const byteArray = result.return as Uint8Array

   // Avoid: Using any or unknown
   const byteArray: any = result.return
   ```

2. **Use Buffer for Conversions**
   ```typescript
   // Good: Use Buffer.from() for conversions
   const hex = Buffer.from(byteArray).toString('hex')
   const utf8 = Buffer.from(byteArray).toString('utf-8')

   // Avoid: Manual byte-by-byte conversion
   let hex = ''
   for (const byte of byteArray) {
     hex += byte.toString(16).padStart(2, '0')
   }
   ```

3. **Validate Array Length**
   ```typescript
   // Good: Check length before accessing
   const byteArray = result.return as Uint8Array
   if (byteArray.length === 32) {
     // Process 32-byte array
   } else {
     throw new Error(`Expected 32 bytes, got ${byteArray.length}`)
   }
   ```

4. **Handle Variable Length Arrays**
   ```typescript
   // Good: Check length for dynamic arrays
   const dynamicArray = result.return as Uint8Array
   if (dynamicArray.length > 0) {
     console.log('First byte:', dynamicArray[0])
     console.log('Last byte:', dynamicArray[dynamicArray.length - 1])
   } else {
     console.log('Empty array')
   }
   ```

5. **Use Proper Encoding for Display**
   ```typescript
   // Good: Choose encoding based on data type
   const byteArray = result.return as Uint8Array

   // For binary data (hashes, signatures)
   const hex = Buffer.from(byteArray).toString('hex')

   // For text data
   const text = Buffer.from(byteArray).toString('utf-8')

   // For base64 encoding
   const base64 = Buffer.from(byteArray).toString('base64')
   ```

6. **Document Expected Array Lengths**
   ```typescript
   // Good: Document expected lengths
   /**
    * Gets user's public key
    * @returns 32-byte public key (byte[32])
    */
   async function getPublicKey(): Promise<Uint8Array> {
     const result = await appClient.send.call({ method: 'getPublicKey' })
     const key = result.return as Uint8Array

     if (key.length !== 32) {
       throw new Error('Invalid public key length')
     }

     return key
   }
   ```

7. **Handle Undefined Return Values**
   ```typescript
   // Good: Check for undefined before using
   const result = await appClient.send.call({ method: 'getBytes' })

   if (result.return !== undefined) {
     const byteArray = result.return as Uint8Array
     console.log('Length:', byteArray.length)
   } else {
     console.log('Method returned no value')
   }
   ```

## Static vs Dynamic Byte Arrays

### When to Use Static Arrays (`byte[N]`)

- **Known Fixed Size**: Data length is always the same (hashes, keys, etc.)
- **Gas Efficiency**: No length prefix needed, saves storage and computation
- **Type Safety**: Compiler ensures correct length at compile time

Examples:
- SHA-256 hash: `byte[32]`
- Public key: `byte[32]`
- Signature: `byte[64]`
- IPv4 address: `byte[4]`
- UUID: `byte[16]`

```typescript
// App spec method definition for static array
{
  name: 'getHash',
  args: [],
  returns: { type: 'byte[32]' }  // Always exactly 32 bytes
}
```

### When to Use Dynamic Arrays (`byte[]`)

- **Variable Size**: Data length can change (strings, variable data, etc.)
- **Unknown Length**: Length not known at compile time
- **Flexibility**: Support different data sizes with same method

Examples:
- Strings of varying length
- Variable-length messages
- Encoded data structures
- NFT metadata

```typescript
// App spec method definition for dynamic array
{
  name: 'getMessage',
  args: [],
  returns: { type: 'byte[]' }  // Can be any length
}
```

### ABI Encoding Differences

```typescript
// Static array encoding (no length prefix)
byte[8]: [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]
         ↑ 8 bytes total

// Dynamic array encoding (with 2-byte length prefix)
byte[]:  [0x00, 0x08, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]
         ↑ length (8)  ↑ 8 bytes of data
         10 bytes total
```

## Key Takeaways

- AlgoKit Utils automatically decodes ABI return values to `Uint8Array`
- Access decoded byte arrays via `result.return`
- Static byte arrays (`byte[N]`) have fixed length known at compile time
- Dynamic byte arrays (`byte[]`) have variable length with length prefix
- Use `Buffer.from()` for converting to hex, UTF-8, or base64
- Static arrays are more gas-efficient than dynamic arrays
- Type cast return values to `Uint8Array` for type safety
- Check array length before accessing elements
- Choose static or dynamic based on whether length is known
- Use appropriate encoding (hex, UTF-8, base64) based on data type
- Validate array lengths match expected values
- Handle undefined return values before accessing
- Byte arrays are the foundation for all binary data handling
- Essential for working with hashes, signatures, addresses, and custom encoding

This example demonstrates the foundation for handling binary data in Algorand smart contracts, essential for any application that works with byte-level data.
