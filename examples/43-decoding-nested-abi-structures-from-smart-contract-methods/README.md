# Decoding Nested ABI Structures from Smart Contract Methods

This example demonstrates how to work with complex nested data structures using ABI encoding and decoding, including nested structs (tuples) and nested arrays.

## What This Example Shows

This example teaches you how to:
- Encode and decode nested struct/tuple types
- Work with multi-level nested structures
- Handle nested byte arrays (`byte[][]`)
- Use fixed-size nested arrays (`byte[N][]`)
- Define complex ABI type strings
- Access nested data in decoded structures

## Why This Matters

Understanding nested structures is crucial for advanced smart contract development:

1. **Complex Data Models**: Real-world applications often need nested data structures
2. **Efficient Encoding**: ABI provides compact representation for complex data
3. **Type Safety**: Proper typing ensures correct data handling at all nesting levels
4. **Interoperability**: Standard format for exchanging complex data with contracts
5. **Flexibility**: Supports arbitrary nesting depth and complexity

Key concepts:
- **Nested Tuples**: Tuples containing other tuples: `(uint64,(uint64,string))`
- **Nested Arrays**: Arrays of arrays: `byte[][]`, `uint64[][]`
- **Fixed-Size Nested**: Arrays of fixed-size elements: `byte[32][]`
- **Mixed Nesting**: Combining tuples and arrays: `(uint64,byte[][])`
- **Deep Nesting**: Multiple levels: `(uint64,(uint64,(string,uint64)))`
- **ABI Type String**: Compact notation for complex types

Common use cases:
- **Hierarchical Data**: Organization structures, tree data
- **Grouped Results**: Multiple related values returned together
- **Batch Operations**: Arrays of complex items
- **Metadata**: Nested configuration and settings
- **Events**: Complex event data with multiple nested fields

## How It Works

### 1. Nested Struct (Tuple) Encoding

Define and work with nested tuple types:

```typescript
import algosdk from 'algosdk'

// Define nested struct type: outer contains inner
// Inner struct: (uint64,string) represents { id: bigint, name: string }
// Outer struct: (uint64,(uint64,string)) represents { count: bigint, inner: { id: bigint, name: string } }
const nestedStructType = algosdk.ABIType.from('(uint64,(uint64,string))')

// Create nested structure
const nestedData: [number | bigint, [number | bigint, string]] = [
  42,        // outer.count
  [1, 'Alice']  // inner: { id: 1, name: "Alice" }
]

// Encode
const encoded = nestedStructType.encode(nestedData)
console.log('Encoded (hex):', Buffer.from(encoded).toString('hex'))
```

Nested struct features:
- Inner tuple is embedded in outer tuple
- Type string uses nested parentheses: `(type1,(type2,type3))`
- Encoding is flat but logically structured
- Decoding reconstructs the nested structure

### 2. Decode Nested Struct

Extract values from nested structure:

```typescript
// Decode back to nested structure
const decoded = nestedStructType.decode(encoded) as [bigint, [bigint, string]]

console.log('Decoded nested structure:')
console.log(`  Outer count: ${decoded[0]}`)
console.log(`  Inner id: ${decoded[1][0]}`)
console.log(`  Inner name: "${decoded[1][1]}"`)

// Access nested properties
const outerCount = decoded[0]            // 42n
const innerId = decoded[1][0]            // 1n
const innerName = decoded[1][1]          // "Alice"
```

Decoding features:
- Returns nested tuple structure
- Use array indexing to access nested values: `decoded[1][0]`
- Type cast for TypeScript type safety
- uint values decode to `bigint`

### 3. Triple Nested Structure

Work with multiple nesting levels:

```typescript
// Define triple nested: (uint64,(uint64,(string,uint64)))
const tripleNestedType = algosdk.ABIType.from('(uint64,(uint64,(string,uint64)))')

const tripleNested: [number | bigint, [number | bigint, [string, number | bigint]]] = [
  100,           // level 1
  [200, ['deep', 300]]  // level 2 and 3
]

const encodedTriple = tripleNestedType.encode(tripleNested)
const decodedTriple = tripleNestedType.decode(encodedTriple) as [bigint, [bigint, [string, bigint]]]

console.log('Triple nested decoded:')
console.log(`  Level 1: ${decodedTriple[0]}`)                    // 100n
console.log(`  Level 2: ${decodedTriple[1][0]}`)                 // 200n
console.log(`  Level 3 string: "${decodedTriple[1][1][0]}"`)     // "deep"
console.log(`  Level 3 number: ${decodedTriple[1][1][1]}`)       // 300n
```

Deep nesting:
- Supports arbitrary depth
- Each level accessed via additional index: `[1][1][0]`
- Type string mirrors structure depth
- Maintain consistent types at all levels

### 4. Nested Byte Arrays

Work with arrays of byte arrays:

```typescript
// Define nested byte array type: byte[][]
const nestedByteArrayType = algosdk.ABIType.from('byte[][]')

// Create array of three byte arrays
const byteArrays = [
  new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]),  // "Hello"
  new Uint8Array([0x57, 0x6f, 0x72, 0x6c, 0x64]),  // "World"
  new Uint8Array([0x41, 0x42, 0x43])                // "ABC"
]

const encoded = nestedByteArrayType.encode(byteArrays)

// Decode back to array of byte arrays
const decoded = nestedByteArrayType.decode(encoded) as Uint8Array[]

console.log('Decoded byte arrays:')
decoded.forEach((arr, i) => {
  console.log(`  Array ${i}: ${Buffer.from(arr).toString('utf-8')}`)
})
```

Nested arrays:
- `byte[][]` = array of dynamic byte arrays
- Each element can have different length
- Outer array can be any length
- Access elements via standard array indexing

### 5. Fixed-Size Nested Arrays

Work with arrays of fixed-size elements:

```typescript
// Define array of fixed-size byte arrays: byte[3][]
const fixedSizeNestedType = algosdk.ABIType.from('byte[3][]')

// Create array of 3-byte arrays
const fixedSizeArrays = [
  new Uint8Array([0x01, 0x02, 0x03]),
  new Uint8Array([0x04, 0x05, 0x06]),
  new Uint8Array([0x07, 0x08, 0x09])
]

const encodedFixed = fixedSizeNestedType.encode(fixedSizeArrays)
const decodedFixed = fixedSizeNestedType.decode(encodedFixed) as Uint8Array[]

console.log('Decoded fixed-size byte arrays:')
decodedFixed.forEach((arr, i) => {
  console.log(`  Array ${i}: [${Array.from(arr).map(b => `0x${b.toString(16).padStart(2, '0')}`).join(', ')}]`)
})
```

Fixed-size nesting:
- `byte[3][]` = array of 3-byte arrays
- Each element must be exactly 3 bytes
- More efficient than dynamic arrays
- Outer array can still be dynamic

## Prerequisites

- Node.js and npm installed
- Basic understanding of ABI encoding
- Familiarity with TypeScript array types

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
=== Nested ABI Structure Decoding Examples ===

=== Decoding Nested Structs ===

Example 1: Encoding nested struct
----------------------------------
Original nested structure: [ 42, [ 1, 'Alice' ] ]
Encoded (hex): 000000000000002a000a0000000000000001000a0005416c696365

Decoded nested structure:
  Outer count: 42 (type: bigint)
  Inner id: 1 (type: bigint)
  Inner name: "Alice" (type: string)

Example 2: Triple nested structure
-----------------------------------
Triple nested decoded:
  Level 1: 100
  Level 2: 200
  Level 3 string: "deep"
  Level 3 number: 300

=== Decoding Nested Byte Arrays ===

Example 1: Array of byte arrays (byte[][])
-------------------------------------------
Original byte arrays:
  Array 0: Hello (5 bytes)
  Array 1: World (5 bytes)
  Array 2: ABC (3 bytes)

Encoded (hex): 00030006000d0014000548656c6c6f0005576f726c640003414243

Decoded byte arrays:
  Array 0: Hello (5 bytes)
    Hex: 48656c6c6f
  Array 1: World (5 bytes)
    Hex: 576f726c64
  Array 2: ABC (3 bytes)
    Hex: 414243

Example 2: Fixed-size nested arrays (byte[3][])
------------------------------------------------
Decoded fixed-size byte arrays:
  Array 0: [0x01, 0x02, 0x03]
  Array 1: [0x04, 0x05, 0x06]
  Array 2: [0x07, 0x08, 0x09]

=== Example Complete ===
ABI encoding/decoding supports arbitrarily nested structures.
Use algosdk.ABIType.from() with nested type strings like:
  - Nested tuples: (uint64,(uint64,string))
  - Nested arrays: byte[][]
  - Mixed: (uint64,byte[][],(string,uint64))
```

## Common Patterns

### Decode Nested Return Value from Method

```typescript
// Method that returns nested structure: (uint64,(address,uint64))
const result = await appClient.send.call({
  method: 'getNestedData',
})

const decoded = result.return as [bigint, [string, bigint]]
const [outerValue, [address, innerValue]] = decoded

console.log(`Outer: ${outerValue}`)
console.log(`Address: ${address}`)
console.log(`Inner: ${innerValue}`)
```

### Nested Array of Structs

```typescript
// Array of structs: (uint64,string)[]
const arrayOfStructsType = algosdk.ABIType.from('(uint64,string)[]')

const data = [
  [1n, 'Alice'],
  [2n, 'Bob'],
  [3n, 'Charlie']
]

const encoded = arrayOfStructsType.encode(data)
const decoded = arrayOfStructsType.decode(encoded) as Array<[bigint, string]>

decoded.forEach(([id, name]) => {
  console.log(`ID: ${id}, Name: ${name}`)
})
```

### Complex Mixed Structure

```typescript
// Mixed structure: (uint64,byte[][],(string,uint64))
const complexType = algosdk.ABIType.from('(uint64,byte[][],(string,uint64))')

const complexData: [number | bigint, Uint8Array[], [string, number | bigint]] = [
  42,
  [
    new Uint8Array([0x01, 0x02]),
    new Uint8Array([0x03, 0x04, 0x05])
  ],
  ['metadata', 100]
]

const encoded = complexType.encode(complexData)
const decoded = complexType.decode(encoded) as [bigint, Uint8Array[], [string, bigint]]

console.log('Decoded complex structure:')
console.log(`  Number: ${decoded[0]}`)
console.log(`  Byte arrays count: ${decoded[1].length}`)
console.log(`  Metadata: ${decoded[2][0]}, ${decoded[2][1]}`)
```

### Deeply Nested Structure

```typescript
// Four levels deep: (uint64,(string,(uint64,(byte[],uint64))))
const deepType = algosdk.ABIType.from('(uint64,(string,(uint64,(byte[],uint64))))')

// Create deeply nested data
const deepData: [number | bigint, [string, [number | bigint, [Uint8Array, number | bigint]]]] = [
  1,
  ['level2', [
    2,
    [new Uint8Array([0x03]), 3]
  ]]
]

const encoded = deepType.encode(deepData)
const decoded = deepType.decode(encoded) as [bigint, [string, [bigint, [Uint8Array, bigint]]]]

console.log(`Level 1: ${decoded[0]}`)
console.log(`Level 2: ${decoded[1][0]}`)
console.log(`Level 3: ${decoded[1][1][0]}`)
console.log(`Level 4 bytes: ${Buffer.from(decoded[1][1][1][0]).toString('hex')}`)
console.log(`Level 4 number: ${decoded[1][1][1][1]}`)
```

### Array of Arrays

```typescript
// Uint64 arrays nested: uint64[][]
const arrayOfArraysType = algosdk.ABIType.from('uint64[][]')

const data = [
  [1n, 2n, 3n],
  [4n, 5n],
  [6n, 7n, 8n, 9n]
]

const encoded = arrayOfArraysType.encode(data)
const decoded = arrayOfArraysType.decode(encoded) as bigint[][]

decoded.forEach((arr, i) => {
  console.log(`Array ${i}: [${arr.join(', ')}]`)
})
```

### Struct with Multiple Nested Arrays

```typescript
// Structure: (uint64,byte[][],string[])
const structWithArraysType = algosdk.ABIType.from('(uint64,byte[][],string[])')

const data: [number | bigint, Uint8Array[], string[]] = [
  42,
  [
    new Uint8Array([0x01]),
    new Uint8Array([0x02, 0x03])
  ],
  ['hello', 'world']
]

const encoded = structWithArraysType.encode(data)
const decoded = structWithArraysType.decode(encoded) as [bigint, Uint8Array[], string[]]

console.log(`Number: ${decoded[0]}`)
console.log(`Byte arrays: ${decoded[1].length}`)
console.log(`Strings: ${decoded[2].join(', ')}`)
```

### Helper Function for Nested Access

```typescript
// Helper to safely access nested values
function getNestedValue<T>(obj: any, path: number[]): T {
  return path.reduce((current, index) => current[index], obj)
}

// Usage with deeply nested structure
const decoded = complexType.decode(encoded)
const level3Value = getNestedValue<bigint>(decoded, [1, 1, 0])
console.log(`Deep value: ${level3Value}`)
```

## Best Practices

1. **Type Cast Decoded Nested Structures**
   ```typescript
   // Good: Explicit type casting for nested structure
   const decoded = nestedType.decode(encoded) as [bigint, [bigint, string]]

   // Then destructure for easier access
   const [outer, [innerId, innerName]] = decoded
   ```

2. **Use Descriptive Type Aliases**
   ```typescript
   // Good: Define type aliases for complex structures
   type InnerStruct = [bigint, string]
   type OuterStruct = [bigint, InnerStruct]

   const decoded = nestedType.decode(encoded) as OuterStruct
   const [outerValue, innerStruct] = decoded
   ```

3. **Validate Nested Array Lengths**
   ```typescript
   // Good: Check lengths at each level
   const decoded = nestedArrayType.decode(encoded) as Uint8Array[]

   if (decoded.length > 0) {
     decoded.forEach((arr, i) => {
       if (arr.length > 0) {
         // Process array
       }
     })
   }
   ```

4. **Document Nested Type Strings**
   ```typescript
   // Good: Document the structure
   /**
    * User profile structure: (uint64,(string,uint64,byte[]))
    * - userId: uint64
    * - profile: tuple
    *   - name: string
    *   - age: uint64
    *   - avatar: byte[]
    */
   const userProfileType = algosdk.ABIType.from('(uint64,(string,uint64,byte[]))')
   ```

5. **Create Helper Functions for Common Structures**
   ```typescript
   // Good: Encapsulate encoding/decoding logic
   type UserProfile = {
     userId: bigint
     profile: {
       name: string
       age: bigint
       avatar: Uint8Array
     }
   }

   function encodeUserProfile(user: UserProfile): Uint8Array {
     const type = algosdk.ABIType.from('(uint64,(string,uint64,byte[]))')
     return type.encode([
       user.userId,
       [user.profile.name, user.profile.age, user.profile.avatar]
     ])
   }

   function decodeUserProfile(encoded: Uint8Array): UserProfile {
     const type = algosdk.ABIType.from('(uint64,(string,uint64,byte[]))')
     const [userId, [name, age, avatar]] = type.decode(encoded) as [bigint, [string, bigint, Uint8Array]]

     return {
       userId,
       profile: { name, age, avatar }
     }
   }
   ```

6. **Handle Fixed vs Dynamic Arrays Appropriately**
   ```typescript
   // Good: Choose based on use case
   // Fixed size when length is known: byte[32][]
   const hashArrayType = algosdk.ABIType.from('byte[32][]')

   // Dynamic when length varies: byte[][]
   const dataArrayType = algosdk.ABIType.from('byte[][]')
   ```

7. **Test Nested Structures Thoroughly**
   ```typescript
   // Good: Test encoding and decoding round-trip
   const original = [42n, [1n, 'test']]
   const encoded = nestedType.encode(original)
   const decoded = nestedType.decode(encoded) as [bigint, [bigint, string]]

   console.assert(decoded[0] === original[0], 'Outer value mismatch')
   console.assert(decoded[1][0] === original[1][0], 'Inner id mismatch')
   console.assert(decoded[1][1] === original[1][1], 'Inner name mismatch')
   ```

## ABI Type String Reference

Common nested type patterns:

### Nested Tuples
```typescript
'(uint64,string)'                    // Simple tuple
'(uint64,(uint64,string))'           // Nested tuple
'(uint64,(uint64,(string,uint64)))'  // Triple nested
```

### Nested Arrays
```typescript
'byte[][]'                           // Array of dynamic byte arrays
'byte[32][]'                         // Array of fixed-size byte arrays
'uint64[][]'                         // Array of uint64 arrays
'string[][]'                         // Array of string arrays
```

### Mixed Nesting
```typescript
'(uint64,byte[][])'                  // Tuple with nested array
'(uint64,(string,byte[]))'           // Tuple with nested tuple
'(uint64,string[],byte[][])'         // Tuple with multiple arrays
```

### Complex Structures
```typescript
'(uint64,(string,byte[])[])'         // Tuple with array of tuples
'((uint64,string)[],(byte[],uint64))' // Multiple nested structures
```

## Key Takeaways

- Use `algosdk.ABIType.from()` with nested type strings for complex structures
- Nested tuples use parentheses: `(uint64,(uint64,string))`
- Nested arrays append `[]`: `byte[][]`, `uint64[][]`
- Fixed-size arrays: `byte[N][]` for arrays of N-byte elements
- Access nested values via chained indexing: `decoded[1][0]`
- Type cast decoded values for TypeScript type safety
- uint types always decode to `bigint` at all nesting levels
- Supports arbitrary nesting depth
- Can mix tuples and arrays: `(uint64,byte[][])`
- Create helper functions for complex nested structures
- Document nested type strings clearly
- Test encoding/decoding round-trips thoroughly
- Use type aliases for better code readability
- Validate array lengths at each nesting level

This example demonstrates the foundation for working with complex nested data structures in Algorand smart contracts, essential for advanced applications with hierarchical or grouped data.
