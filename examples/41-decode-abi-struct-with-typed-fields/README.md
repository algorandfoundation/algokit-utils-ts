# Decode ABI Struct with Typed Fields

This example demonstrates how to encode and decode ABI structs containing multiple typed fields, such as uint16 and string, which are common patterns when working with Algorand smart contract data.

## What This Example Shows

This example teaches you how to:
- Define ABI tuple types for structs using `algosdk.ABIType.from()`
- Encode TypeScript values into ABI-encoded binary data
- Decode ABI-encoded data back into TypeScript values
- Work with BigInt types for uint values
- Understand ABI tuple representation of structs
- Convert between tuples and interface types

## Why This Matters

ABI encoding/decoding is essential for smart contract interactions:

1. **Type Safety**: Ensures data matches expected contract types
2. **Interoperability**: Standard encoding format across all Algorand contracts
3. **Complex Types**: Handle structs, arrays, and nested types
4. **Return Values**: Decode method return values from contracts
5. **Data Validation**: Verify data structure before sending to contracts

Key concepts:
- **ABI (Application Binary Interface)**: Standard for encoding/decoding data
- **Tuple Type**: ABI representation of structs as `(type1,type2,...)`
- **ABIType.from()**: Creates encoder/decoder from type string
- **BigInt**: JavaScript type for large integers (uint16, uint64, etc.)
- **Encode**: Convert TypeScript values to binary ABI format
- **Decode**: Convert binary ABI data to TypeScript values

Common use cases:
- **Return Value Decoding**: Parse complex return values from ABI methods
- **State Reading**: Decode app state stored in structs
- **Transaction Arguments**: Encode complex arguments for method calls
- **Off-Chain Processing**: Work with contract data in TypeScript
- **Data Validation**: Verify data structure before contract calls

## How It Works

### 1. Define ABI Tuple Type

Create an ABI type definition for your struct:

```typescript
import algosdk from 'algosdk'

// Define the TypeScript interface
interface User {
  userId: bigint  // uint16 decodes to bigint
  name: string
}

// Define the ABI type for a struct (tuple) containing uint16 and string
// In ABI, a struct is represented as a tuple: (uint16,string)
const userTupleType = algosdk.ABIType.from('(uint16,string)')
```

Type definition:
- Use `ABIType.from()` with type string
- Struct = tuple in ABI: `(type1,type2,...)`
- Supports all ABI types: uint, string, address, byte[], etc.
- Creates encoder and decoder methods

### 2. Encode Values

Convert TypeScript values to ABI-encoded binary:

```typescript
// Create a user with userId=1 and name="Alice"
const user1Values: [number | bigint, string] = [1, 'Alice']

// Encode the values
const encodedData = userTupleType.encode(user1Values)

console.log('Encoded data (hex):', Buffer.from(encodedData).toString('hex'))
// Output: 000100040005416c696365
```

Encoding:
- Pass values as tuple array matching type order
- Numbers automatically converted to correct ABI format
- Returns `Uint8Array` with binary encoded data
- Can pass either `number` or `bigint` for uint types

### 3. Decode Data

Convert ABI-encoded binary back to TypeScript values:

```typescript
// Decode the ABI-encoded data back into a tuple
const decodedTuple = userTupleType.decode(encodedData) as [bigint, string]

// Convert tuple to User object
const decoded: User = {
  userId: decodedTuple[0],
  name: decodedTuple[1],
}

console.log('Decoded struct:')
console.log(`  userId: ${decoded.userId} (type: ${typeof decoded.userId})`)
console.log(`  name: "${decoded.name}" (type: ${typeof decoded.name})`)
```

Decoding:
- Returns tuple array in same order as type definition
- uint16 decodes to `bigint` (not `number`)
- Can map tuple to interface for cleaner code
- Type cast for TypeScript type safety

### 4. Type Verification

Verify decoded types:

```typescript
console.log('Type verification:')
console.log(`  userId is bigint: ${typeof decoded.userId === 'bigint'}`)  // true
console.log(`  name is string: ${typeof decoded.name === 'string'}`)      // true
```

Type checking:
- uint types always decode to `bigint`
- string types decode to `string`
- Use `typeof` to verify types at runtime
- Essential for type safety validation

## Prerequisites

- Node.js and npm installed
- Basic understanding of ABI encoding

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
=== ABI Struct Decoding Example ===

Example 1: Encoding and decoding a User struct
-----------------------------------------------
Original values: [ 1, 'Alice' ]
Encoded data (hex): 000100040005416c696365
Encoded data (bytes): [
    0,  1,   0,   4,  0,
    5, 65, 108, 105, 99,
  101
]

Decoded struct:
  userId: 1 (type: bigint)
  name: "Alice" (type: string)

Type verification:
  userId is bigint: true
  name is string: true

Example 2: Encoding and decoding another User struct
-----------------------------------------------------
Original values: [ 42, 'Bob' ]
Encoded data (hex): 002a00040003426f62

Decoded struct:
  userId: 42
  name: "Bob"

Example 3: Using BigInt values for userId
------------------------------------------
Original values: [ 100n, 'Charlie' ]
Encoded data (hex): 006400040007436861726c6965

Decoded struct:
  userId: 100 (type: bigint)
  name: "Charlie"

=== Example Complete ===
ABI encoding/decoding allows type-safe interaction with smart contract data.
Structs are represented as tuples: (type1,type2,...)
algosdk provides ABIType.from() to create type encoders/decoders.
```

## Common Patterns

### Decoding Method Return Values

```typescript
// After calling an ABI method that returns (uint64,string)
const returnType = algosdk.ABIType.from('(uint64,string)')

// Assume we got encoded data from method call
const encodedReturn = methodResult.return // Some Uint8Array

// Decode it
const [count, message] = returnType.decode(encodedReturn) as [bigint, string]

console.log(`Count: ${count}, Message: ${message}`)
```

### Working with Multiple Structs

```typescript
interface Transaction {
  txId: bigint
  amount: bigint
  memo: string
}

const txType = algosdk.ABIType.from('(uint64,uint64,string)')

// Encode multiple transactions
const tx1 = txType.encode([1n, 100n, 'Payment'])
const tx2 = txType.encode([2n, 200n, 'Transfer'])

// Decode them
const decoded1 = txType.decode(tx1) as [bigint, bigint, string]
const decoded2 = txType.decode(tx2) as [bigint, bigint, string]
```

### Nested Structs

```typescript
// Struct containing another struct: (uint64,(string,uint16))
const nestedType = algosdk.ABIType.from('(uint64,(string,uint16))')

const data = nestedType.encode([
  42n,
  ['Alice', 25]
])

const [id, [name, age]] = nestedType.decode(data) as [bigint, [string, bigint]]
console.log(`ID: ${id}, Name: ${name}, Age: ${age}`)
```

### Arrays of Structs

```typescript
// Array of structs: (uint16,string)[]
const arrayType = algosdk.ABIType.from('(uint16,string)[]')

const users = arrayType.encode([
  [1, 'Alice'],
  [2, 'Bob'],
  [3, 'Charlie']
])

const decodedUsers = arrayType.decode(users) as Array<[bigint, string]>
decodedUsers.forEach(([id, name]) => {
  console.log(`User ${id}: ${name}`)
})
```

### Converting Tuples to Interfaces

```typescript
// Helper function to convert tuple to interface
function tupleToUser(tuple: [bigint, string]): User {
  return {
    userId: tuple[0],
    name: tuple[1]
  }
}

// Usage
const encodedData = userTupleType.encode([1, 'Alice'])
const tuple = userTupleType.decode(encodedData) as [bigint, string]
const user = tupleToUser(tuple)

console.log(user.userId, user.name)
```

### Handling Optional Fields

```typescript
// Use uint64 with 0 for optional/null
interface Config {
  enabled: bigint  // 0 = false, 1 = true
  maxValue: bigint // 0 = not set
  description: string
}

const configType = algosdk.ABIType.from('(uint64,uint64,string)')

const data = configType.encode([
  1n,  // enabled
  0n,  // maxValue not set
  'Default config'
])

const [enabled, maxValue, description] = configType.decode(data) as [bigint, bigint, string]

if (enabled > 0n) {
  console.log('Config is enabled')
}

if (maxValue === 0n) {
  console.log('Max value not set')
}
```

## Best Practices

1. **Use BigInt for uint Types**
   ```typescript
   // Good: Use bigint in interface
   interface User {
     userId: bigint  // Matches decoded type
     name: string
   }

   // When encoding, can use either number or bigint
   const encoded = userType.encode([1, 'Alice'])      // number works
   const encoded2 = userType.encode([1n, 'Alice'])    // bigint works

   // When decoding, always returns bigint
   const [id, name] = userType.decode(encoded) as [bigint, string]
   ```

2. **Type Cast Decoded Values**
   ```typescript
   // Good: Type cast to expected types
   const decoded = userType.decode(encodedData) as [bigint, string]

   // Avoid: Using any
   const decoded: any = userType.decode(encodedData)
   ```

3. **Create Helper Functions**
   ```typescript
   // Good: Helper for encoding
   function encodeUser(user: User): Uint8Array {
     return userType.encode([user.userId, user.name])
   }

   // Helper for decoding
   function decodeUser(data: Uint8Array): User {
     const [userId, name] = userType.decode(data) as [bigint, string]
     return { userId, name }
   }

   // Usage
   const user = { userId: 1n, name: 'Alice' }
   const encoded = encodeUser(user)
   const decoded = decodeUser(encoded)
   ```

4. **Validate Data Before Encoding**
   ```typescript
   // Good: Validate before encoding
   function encodeUser(user: User): Uint8Array {
     if (user.userId < 0n) {
       throw new Error('userId must be non-negative')
     }
     if (user.name.length === 0) {
       throw new Error('name cannot be empty')
     }
     return userType.encode([user.userId, user.name])
   }
   ```

5. **Handle Encoding Errors**
   ```typescript
   // Good: Wrap in try-catch
   try {
     const encoded = userType.encode([userId, name])
     // Use encoded data
   } catch (error) {
     console.error('Encoding failed:', error.message)
     // Handle error appropriately
   }
   ```

6. **Document Type Mappings**
   ```typescript
   // Good: Document ABI types in comments
   /**
    * User struct: (uint16,string)
    * - userId: uint16 (maps to bigint)
    * - name: string
    */
   interface User {
     userId: bigint
     name: string
   }

   // Keep type string consistent
   const USER_ABI_TYPE = '(uint16,string)'
   const userType = algosdk.ABIType.from(USER_ABI_TYPE)
   ```

7. **Reuse ABIType Instances**
   ```typescript
   // Good: Create once, reuse many times
   const userType = algosdk.ABIType.from('(uint16,string)')

   // Encode multiple users with same type
   const encoded1 = userType.encode([1, 'Alice'])
   const encoded2 = userType.encode([2, 'Bob'])
   const encoded3 = userType.encode([3, 'Charlie'])

   // Avoid: Creating new type each time
   // algosdk.ABIType.from('(uint16,string)').encode(...) // inefficient
   ```

## ABI Type Reference

Common ABI types you can use:

- **Integers**: `uint8`, `uint16`, `uint32`, `uint64` (decode to `bigint`)
- **Strings**: `string` (decode to `string`)
- **Addresses**: `address` (58-character string)
- **Bytes**: `byte[]` (variable length), `byte[N]` (fixed length)
- **Booleans**: `bool` (decode to `boolean`)
- **Tuples**: `(type1,type2,...)` for structs
- **Arrays**: `type[]` for dynamic arrays
- **Fixed Arrays**: `type[N]` for fixed-size arrays

Example type strings:
```typescript
'uint64'                    // Single uint64
'(uint64,string)'           // Struct with two fields
'(uint64,string)[]'         // Array of structs
'(address,uint64,byte[])'   // Complex struct
'uint64[]'                  // Array of uint64
'byte[32]'                  // Fixed 32-byte array
```

## Key Takeaways

- Use `algosdk.ABIType.from()` to create encoder/decoders
- Structs are represented as tuples: `(type1,type2,...)`
- uint types always decode to `bigint`, not `number`
- Encode converts TypeScript values to binary ABI format
- Decode converts binary ABI data back to TypeScript values
- Can pass `number` or `bigint` when encoding uint types
- Always type cast decoded tuples for type safety
- Reuse ABIType instances for better performance
- Create helper functions for cleaner encode/decode operations
- Essential for working with complex smart contract data
- Supports nested structs, arrays, and all ABI types
- Use interfaces to represent struct types in TypeScript
- Validate data before encoding to catch errors early

This example demonstrates the foundation for working with complex typed data in Algorand smart contracts, essential for any application that needs to encode/decode ABI structs.
