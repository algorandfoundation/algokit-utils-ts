# ABI Byte Array Conversions

This example demonstrates how to convert ABI byte arrays to Uint8Array format using a conversion utility similar to the one used internally by AlgoKit Utils. This is essential when working with smart contract return values that contain byte arrays.

## Overview

When Algorand smart contracts return complex data structures, ABI-encoded values often contain byte arrays represented as JavaScript number arrays (`number[]`). Converting these to `Uint8Array` makes them more suitable for:
- Binary data manipulation
- Working with cryptographic functions
- Passing to other JavaScript APIs that expect typed arrays
- Reducing memory footprint

This example shows:
1. Converting nested byte arrays (e.g., `byte[2][]`)
2. Selective conversion (only byte arrays are converted, other types remain unchanged)
3. Handling tuples with mixed types
4. Recursive conversion of complex nested structures

## Key Concepts

### ABI Byte Arrays vs Other Array Types

It's crucial to distinguish between:

**Byte arrays** (`byte`, `byte[N]`, `byte[]`) - Should be converted to `Uint8Array`:
```typescript
byte[2]      // Static byte array with 2 elements
byte[]       // Dynamic byte array
byte[2][]    // Dynamic array of static byte arrays
```

**Other arrays** (`uint8[3]`, `uint64[]`, etc.) - Should remain as number arrays:
```typescript
uint8[3]     // NOT a byte array, despite uint8
uint64[]     // Array of unsigned 64-bit integers
```

### How convertAbiByteArrays Works

The function recursively processes ABI values:
1. Checks if the type contains any byte arrays
2. If it's a byte array type (`byte[]` or `byte[N]`), converts to `Uint8Array`
3. If it's another array type, recursively processes each element
4. If it's a tuple, recursively processes each field
5. All other types remain unchanged

## Code Examples

### Example 1: Nested Byte Arrays

```typescript
import algosdk from 'algosdk'

const { ABIByteType, ABIArrayStaticType, ABIArrayDynamicType } = algosdk

// Define the ABI type: byte[2][] (dynamic array of static byte arrays)
const byteType = new ABIByteType()
const innerArrayType = new ABIArrayStaticType(byteType, 2)
const outerArrayType = new ABIArrayDynamicType(innerArrayType)

// Input: nested JavaScript arrays
const nestedValue = [
  [1, 2],
  [3, 4],
  [5, 6],
]

// Convert to Uint8Array format
const nestedResult = convertAbiByteArrays(nestedValue, outerArrayType)

// Result: Array of Uint8Array instances
console.log(nestedResult[0])  // Uint8Array(2) [ 1, 2 ]
console.log(nestedResult[1])  // Uint8Array(2) [ 3, 4 ]
console.log(nestedResult[2])  // Uint8Array(2) [ 5, 6 ]
```

### Example 2: Non-Byte Arrays Remain Unchanged

```typescript
import algosdk from 'algosdk'

const { ABIUintType, ABIArrayStaticType } = algosdk

// Define the ABI type: uint8[3] (NOT a byte array)
const uintType = new ABIUintType(8)
const uintArrayType = new ABIArrayStaticType(uintType, 3)

// Input: regular number array
const uintValue = [1, 2, 3]

// Convert - remains unchanged because it's not a byte array
const uintResult = convertAbiByteArrays(uintValue, uintArrayType)

console.log(uintResult)  // [1, 2, 3] - still a number array
```

### Example 3: Tuples with Mixed Types

```typescript
import algosdk from 'algosdk'

const {
  ABIByteType,
  ABIArrayStaticType,
  ABIBoolType,
  ABITupleType,
} = algosdk

// Define the ABI type: (byte[2], bool, byte[3])
const byteType = new ABIByteType()
const byteArray2Type = new ABIArrayStaticType(byteType, 2)
const byteArray3Type = new ABIArrayStaticType(byteType, 3)
const boolType = new ABIBoolType()
const tupleType = new ABITupleType([byteArray2Type, boolType, byteArray3Type])

// Input: tuple with byte arrays and a boolean
const tupleValue = [[1, 2], true, [3, 4, 5]]

// Convert - only byte arrays are converted to Uint8Array
const tupleResult = convertAbiByteArrays(tupleValue, tupleType)

console.log(tupleResult[0])  // Uint8Array(2) [ 1, 2 ]
console.log(tupleResult[1])  // true (unchanged)
console.log(tupleResult[2])  // Uint8Array(3) [ 3, 4, 5 ]
```

### Example 4: Working with Smart Contract Return Values

```typescript
import algosdk from 'algosdk'

// Assume a contract returns (byte[32], uint64, byte[])
// Define the return type
const hashType = new algosdk.ABIArrayStaticType(new algosdk.ABIByteType(), 32)
const uint64Type = new algosdk.ABIUintType(64)
const datumType = new algosdk.ABIArrayDynamicType(new algosdk.ABIByteType())
const returnType = new algosdk.ABITupleType([hashType, uint64Type, datumType])

// Raw return value (decoded ABI value)
const rawReturnValue = [
  [/* 32 bytes as numbers */],
  12345,
  [/* variable length bytes as numbers */],
]

// Convert byte arrays to Uint8Array
const converted = convertAbiByteArrays(rawReturnValue, returnType)

// Now you can work with typed arrays
const hash = converted[0] as Uint8Array    // 32-byte hash
const count = converted[1] as number       // number unchanged
const data = converted[2] as Uint8Array    // variable-length data
```

## Best Practices

### 1. Always Specify the Correct ABI Type

```typescript
// Good - Correct type specification
const byteType = new algosdk.ABIByteType()
const byteArrayType = new algosdk.ABIArrayStaticType(byteType, 32)
const result = convertAbiByteArrays(value, byteArrayType)

// Bad - Wrong type will not convert
const uintType = new algosdk.ABIUintType(8)  // ✗ Not a byte type!
const wrongType = new algosdk.ABIArrayStaticType(uintType, 32)
const result = convertAbiByteArrays(value, wrongType)  // Won't convert
```

### 2. Use Typed Arrays for Binary Operations

```typescript
import algosdk from 'algosdk'
import crypto from 'crypto'

const byteArrayType = new algosdk.ABIArrayDynamicType(new algosdk.ABIByteType())

// Convert to Uint8Array for crypto operations
const data = convertAbiByteArrays([1, 2, 3, 4, 5], byteArrayType) as Uint8Array

// Now you can use it with crypto functions
const hash = crypto.createHash('sha256').update(data).digest()
```

### 3. Handle Return Values from Contracts

```typescript
import algosdk from 'algosdk'

async function processContractReturn(
  rawValue: any,
  returnTypeString: string
) {
  // Parse the ABI type
  const returnType = algosdk.ABIType.from(returnTypeString)

  // Decode if needed (if rawValue is bytes)
  const decoded = typeof rawValue === 'string' || rawValue instanceof Uint8Array
    ? returnType.decode(rawValue)
    : rawValue

  // Convert byte arrays
  const converted = convertAbiByteArrays(decoded, returnType)

  return converted
}

// Usage
const result = await processContractReturn(
  contractReturnValue,
  '(byte[32],uint64,byte[])'
)
```

### 4. Type Assertions for TypeScript

```typescript
import algosdk from 'algosdk'

const tupleType = new algosdk.ABITupleType([
  new algosdk.ABIArrayStaticType(new algosdk.ABIByteType(), 32),
  new algosdk.ABIUintType(64),
])

const value = [[/* 32 bytes */], 12345]
const result = convertAbiByteArrays(value, tupleType) as [Uint8Array, number]

// Now TypeScript knows the types
const hash: Uint8Array = result[0]
const count: number = result[1]
```

## Common Use Cases

### 1. Processing Cryptographic Hashes

```typescript
import algosdk from 'algosdk'

// Contract returns a SHA-256 hash as byte[32]
const hashType = new algosdk.ABIArrayStaticType(new algosdk.ABIByteType(), 32)

const rawHash = [/* 32 bytes as numbers */]
const hash = convertAbiByteArrays(rawHash, hashType) as Uint8Array

// Display as hex string
const hexHash = '0x' + Array.from(hash)
  .map(b => b.toString(16).padStart(2, '0'))
  .join('')

console.log(hexHash)  // 0x1234567890abcdef...
```

### 2. Extracting Data from Complex Structures

```typescript
import algosdk from 'algosdk'

// Smart contract returns: (address, (byte[32], uint64, byte[]))
const returnType = new algosdk.ABITupleType([
  algosdk.ABIType.from('address'),
  new algosdk.ABITupleType([
    new algosdk.ABIArrayStaticType(new algosdk.ABIByteType(), 32),
    new algosdk.ABIUintType(64),
    new algosdk.ABIArrayDynamicType(new algosdk.ABIByteType()),
  ]),
])

const rawValue = [
  'AAAA...', // address
  [
    [/* 32 bytes */],
    timestamp,
    [/* metadata bytes */],
  ],
]

const converted = convertAbiByteArrays(rawValue, returnType) as [
  string,
  [Uint8Array, number, Uint8Array]
]

// Extract fields
const address = converted[0]
const [hash, timestamp, metadata] = converted[1]
```

### 3. Comparing Byte Arrays

```typescript
import algosdk from 'algosdk'

function byteArraysEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

const byteArrayType = new algosdk.ABIArrayStaticType(new algosdk.ABIByteType(), 32)

const value1 = new Array(32).fill(0)
const value2 = new Array(32).fill(0)

const arr1 = convertAbiByteArrays(value1, byteArrayType) as Uint8Array
const arr2 = convertAbiByteArrays(value2, byteArrayType) as Uint8Array

console.log(byteArraysEqual(arr1, arr2))  // true
```

## Understanding the Implementation

The `convertAbiByteArrays` function in this example is based on the internal AlgoKit Utils implementation:

```typescript
function convertAbiByteArrays(value: any, type: algosdk.ABIType): any {
  // Return value as is if the type doesn't have any bytes or if it's already an Uint8Array
  if (!type.toString().includes('byte') || value instanceof Uint8Array) {
    return value
  }

  // Handle byte arrays (byte[N] or byte[])
  if (
    (type instanceof ABIArrayStaticType || type instanceof ABIArrayDynamicType) &&
    (type as any).childType instanceof ABIByteType &&
    Array.isArray(value)
  ) {
    return new Uint8Array(value as number[])
  }

  // Handle other arrays (for nested structures)
  if ((type instanceof ABIArrayStaticType || type instanceof ABIArrayDynamicType) && Array.isArray(value)) {
    const result = []
    for (let i = 0; i < value.length; i++) {
      result.push(convertAbiByteArrays(value[i], (type as any).childType))
    }
    return result
  }

  // Handle tuples (for nested structures)
  if (type instanceof ABITupleType && Array.isArray(value)) {
    const result = []
    const childTypes = (type as any).childTypes
    for (let i = 0; i < value.length && i < childTypes.length; i++) {
      result.push(convertAbiByteArrays(value[i], childTypes[i]))
    }
    return result
  }

  // For other types, return the value as is
  return value
}
```

**Key Points**:
1. Early exit if type doesn't contain 'byte' or value is already Uint8Array
2. Direct conversion for byte arrays (checks child type is ABIByteType)
3. Recursive processing for other arrays and tuples
4. Non-byte types pass through unchanged

## Running This Example

```bash
# Install dependencies
npm install

# Run the example
npm start
```

**Expected Output**:
```
=== ABI Byte Array Conversions Demo ===

Example 1: Converting nested byte arrays (byte[2][])
---------------------------------------------------
Input: [[1,2],[3,4],[5,6]]
Output: Array of Uint8Array instances
  [0]: [ 1, 2 ]
  [1]: [ 3, 4 ]
  [2]: [ 5, 6 ]

Example 2: Non-byte arrays (uint8[3]) are not converted
--------------------------------------------------------
Input: [1,2,3]
Output: [1,2,3]
Note: The array remains unchanged because uint8[] is not a byte[] type

Example 3: Converting tuples with byte arrays (byte[2],bool,byte[3])
---------------------------------------------------------------------
Input: [[1,2],true,[3,4,5]]
Output:
  [0] (byte[2]): [ 1, 2 ]
  [1] (bool): true
  [2] (byte[3]): [ 3, 4, 5 ]
Note: Only the byte arrays are converted; the boolean remains unchanged

=== Key Takeaways ===
1. convertAbiByteArrays() recursively converts byte[] types to Uint8Array
2. Other ABI types (uint, bool, etc.) remain unchanged
3. Works with nested structures (arrays of arrays, tuples)
4. Useful for preparing data for smart contract interactions
5. AlgoKit Utils uses this internally when decoding contract return values
```

## Related Concepts

- **ABI Encoding/Decoding**: Converting between binary and JavaScript representations
- **Smart Contract Interactions**: Calling methods and processing return values
- **Typed Arrays**: JavaScript's `Uint8Array` for binary data
- **ARC-4**: The Algorand ABI specification

## Learn More

- [Algorand ABI Specification (ARC-4)](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0004.md)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [JavaScript Typed Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- [algosdk ABI Types](https://algorand.github.io/js-algorand-sdk/)
