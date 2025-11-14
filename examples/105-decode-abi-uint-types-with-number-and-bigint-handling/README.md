# Decode ABI Uint Types with Number and BigInt Handling

This example demonstrates how to decode all valid ABI uint types (uint8 through uint512) and understand when values are returned as JavaScript `number` vs `bigint` based on bit length.

## Key Concepts

- **ABI Uint Types**: All valid unsigned integer types from uint8 to uint512 (in 8-bit increments)
- **JavaScript Safe Integer Boundary**: The critical 53-bit threshold (2^53 - 1)
- **Automatic Type Conversion**: How AlgoKit Utils automatically chooses the appropriate type
- **Type Safety**: Understanding return types for correct TypeScript usage

## What This Example Shows

This example decodes all 64 valid ABI uint types and demonstrates:

1. **Complete Type Coverage**: Decode every valid uint type (uint8, uint16, uint24, ..., uint512)
2. **Type Boundary**: Where the transition from `number` to `bigint` occurs (53 bits)
3. **Practical Examples**: How to work with both number and bigint values
4. **Boundary Comparison**: uint48 (last `number`) vs uint56 (first `bigint`)

## Why This Matters

JavaScript has a fundamental limitation: the `number` type can only safely represent integers up to 2^53 - 1 (9,007,199,254,740,991). Beyond this value, precision is lost.

For Algorand smart contracts that work with large numbers (like microAlgos in uint64), using `bigint` is essential for accuracy.

## Quick Start

### Prerequisites

```bash
npm install
```

### Run the Example

```bash
npm start
```

## Code Walkthrough

### 1. Import ABI Decoding Functions

```typescript
import { getABIDecodedValue } from '@algorandfoundation/algokit-utils/types/app-arc56'
import { ABIUintType } from 'algosdk'
```

### 2. Generate All Valid Uint Bit Lengths

```typescript
// ABI uint types must be multiples of 8: uint8, uint16, ..., uint512
const validBitLengths = Array.from({ length: 64 }, (_, i) => (i + 1) * 8)
// Results in: [8, 16, 24, 32, 40, 48, 56, 64, ..., 512]
```

### 3. Decode Each Type and Check Return Type

```typescript
validBitLengths.forEach((bitLength) => {
  // Create ABI type and encode value 1
  const abiType = new ABIUintType(bitLength)
  const encoded = abiType.encode(1)

  // Decode the value back
  const decoded = getABIDecodedValue(encoded, `uint${bitLength}`, {})

  // Check if it's number or bigint
  const expectedType = bitLength < 53 ? 'number' : 'bigint'
  const actualType = typeof decoded

  console.log(`uint${bitLength}: ${decoded} (${actualType})`)
})
```

### 4. Practical Examples

#### Example 1: uint32 (Returns number)

```typescript
const uint32Type = new ABIUintType(32)
const encodedUint32 = uint32Type.encode(42)
const decodedUint32 = getABIDecodedValue(encodedUint32, 'uint32', {})

console.log(typeof decodedUint32) // 'number'
console.log(decodedUint32 + 8)    // 50 - normal arithmetic works
```

#### Example 2: uint64 (Returns bigint)

```typescript
const uint64Type = new ABIUintType(64)
const encodedUint64 = uint64Type.encode(1000000000000)
const decodedUint64 = getABIDecodedValue(encodedUint64, 'uint64', {})

console.log(typeof decodedUint64) // 'bigint'
console.log(decodedUint64 + 8n)   // 1000000000008n - need BigInt arithmetic
```

## Expected Output

```
=== ABI Uint Type Decoding Example ===

JavaScript safe integer range: -(2^53 - 1) to (2^53 - 1)
Threshold: uint types < 53 bits → number, >= 53 bits → bigint

Decoding uint types across all valid bit lengths:
==================================================

uint  8:  1 (number) ✓
uint 16:  1 (number) ✓
uint 24:  1 (number) ✓
uint 32:  1 (number) ✓
uint 40:  1 (number) ✓
uint 48:  1 (number) ✓  ← Last uint as number
uint 56:  1 (bigint) ✓  ← First uint as bigint
uint 64:  1 (bigint) ✓
uint 72:  1 (bigint) ✓
...
uint512:  1 (bigint) ✓

Detailed examples:
------------------

Example 1: uint32 (32 bits < 53 bits)
  Encoded value: 42
  Decoded value: 42
  Type: number
  Can use arithmetic: 42 + 8 = 50

Example 2: uint64 (64 bits >= 53 bits)
  Encoded value: 1000000000000
  Decoded value: 1000000000000
  Type: bigint
  Can use BigInt arithmetic: 1000000000000 + 8n = 1000000000008

Example 3: Boundary between number and bigint
  uint48 (48 bits): type = number ← last uint as number
  uint56 (56 bits): type = bigint ← first uint as bigint

=== Example Complete ===
Key takeaway: Always check the bit length of uint types to know
whether to expect number or bigint in your TypeScript code.
```

## Understanding the Type Boundary

### The 53-Bit Threshold

JavaScript's `number` type uses double-precision floating-point format (IEEE 754), which has:
- **53 bits** for the significand (mantissa)
- This means integers from -(2^53 - 1) to (2^53 - 1) can be represented exactly

Beyond this range, precision is lost:

```typescript
console.log(9007199254740992 === 9007199254740993) // true (!!)
// Both numbers are beyond safe integer range, become same value
```

### Type Mapping for ABI Uint Types

| ABI Type | Bits | Max Value | JavaScript Type | Reason |
|----------|------|-----------|-----------------|--------|
| uint8 | 8 | 255 | `number` | < 53 bits |
| uint16 | 16 | 65,535 | `number` | < 53 bits |
| uint24 | 24 | 16,777,215 | `number` | < 53 bits |
| uint32 | 32 | 4,294,967,295 | `number` | < 53 bits |
| uint40 | 40 | 1,099,511,627,775 | `number` | < 53 bits |
| **uint48** | **48** | **281,474,976,710,655** | **`number`** | **< 53 bits (last safe)** |
| **uint56** | **56** | **72,057,594,037,927,935** | **`bigint`** | **≥ 53 bits (first unsafe)** |
| uint64 | 64 | 18,446,744,073,709,551,615 | `bigint` | ≥ 53 bits |
| ... | ... | ... | `bigint` | ≥ 53 bits |
| uint512 | 512 | 2^512 - 1 | `bigint` | ≥ 53 bits |

## Working with Both Types

### Using number (uint8 - uint48)

```typescript
// ✅ Good: Standard arithmetic
const value = getABIDecodedValue(encoded, 'uint32', {})
const result = value + 100          // Works fine
const doubled = value * 2           // Works fine
const comparison = value > 1000     // Works fine
```

### Using bigint (uint56 - uint512)

```typescript
// ✅ Good: BigInt arithmetic
const value = getABIDecodedValue(encoded, 'uint64', {})
const result = value + 100n         // Note the 'n' suffix
const doubled = value * 2n          // All operators need BigInt
const comparison = value > 1000n    // Comparisons need BigInt too

// ❌ Bad: Mixing types
const bad = value + 100             // Error: Cannot mix BigInt and number
const bad2 = value * 2              // Error: Cannot mix BigInt and number
```

### Type Guards for Safe Usage

```typescript
function processUintValue(value: number | bigint, bitLength: number) {
  if (typeof value === 'number') {
    // Safe to use number arithmetic
    console.log('Processing as number:', value + 1)
  } else {
    // Must use BigInt arithmetic
    console.log('Processing as bigint:', value + 1n)
  }
}
```

## Common Use Cases

### 1. Working with Asset Amounts (uint64)

```typescript
import { getABIDecodedValue } from '@algorandfoundation/algokit-utils/types/app-arc56'
import { ABIUintType } from 'algosdk'

// Asset amounts are uint64 (always bigint)
const uint64Type = new ABIUintType(64)
const encoded = uint64Type.encode(1000000) // 1 Algo in microAlgos
const amount = getABIDecodedValue(encoded, 'uint64', {})

// Must use BigInt arithmetic
const fee = 1000n // 0.001 Algo
const total = amount + fee // 1001000n

console.log(`Total: ${total} microAlgos`)
```

### 2. Decoding App Call Results

```typescript
// Smart contract returns uint64 balance
const result = await appClient.send.getBalance({ args: {} })

// Result is bigint - use BigInt operations
if (result.return > 1000000n) {
  console.log('Balance exceeds 1 Algo')
}

// Convert to Algos for display (loses precision for large values)
const algos = Number(result.return) / 1_000_000
console.log(`Balance: ${algos.toFixed(6)} Algos`)
```

### 3. Working with Timestamps (uint64)

```typescript
// Algorand timestamps are uint64
const uint64Type = new ABIUintType(64)
const currentTime = BigInt(Math.floor(Date.now() / 1000))
const encoded = uint64Type.encode(currentTime)
const decoded = getABIDecodedValue(encoded, 'uint64', {})

// Calculate time differences with BigInt
const oneDay = 86400n
const tomorrow = decoded + oneDay

console.log(`Current: ${decoded}`)
console.log(`Tomorrow: ${tomorrow}`)
```

### 4. Type-Safe Function Signatures

```typescript
// Define function with proper return types
function decodeAmount(encoded: Uint8Array): bigint {
  return getABIDecodedValue(encoded, 'uint64', {}) as bigint
}

function decodeCounter(encoded: Uint8Array): number {
  return getABIDecodedValue(encoded, 'uint32', {}) as number
}

// Usage is now type-safe
const amount = decodeAmount(encodedAmount)
const counter = decodeCounter(encodedCounter)

const newAmount = amount + 1000n  // ✅ BigInt arithmetic
const newCounter = counter + 1    // ✅ Number arithmetic
```

## Best Practices

### 1. Know Your Data Types

```typescript
// ✅ Good: Explicit about expected types
function handleBalance(balance: bigint) {
  return balance + 1000n
}

// ❌ Bad: Ambiguous type handling
function handleBalance(balance: any) {
  return balance + 1000 // May fail at runtime
}
```

### 2. Use Type Assertions After Decoding

```typescript
// ✅ Good: Assert the type you expect
const value = getABIDecodedValue(encoded, 'uint64', {}) as bigint
const newValue = value + 100n

// ❌ Bad: Assume without checking
const value = getABIDecodedValue(encoded, 'uint64', {})
const newValue = value + 100 // Runtime error!
```

### 3. Handle Both Cases in Generic Functions

```typescript
// ✅ Good: Handle both number and bigint
function formatUint(value: number | bigint, decimals?: number): string {
  if (typeof value === 'bigint') {
    // Convert to number if small enough, or use string representation
    if (value <= BigInt(Number.MAX_SAFE_INTEGER)) {
      return Number(value).toLocaleString()
    }
    return value.toString()
  }
  return value.toLocaleString()
}
```

### 4. Be Careful with Conversions

```typescript
// ✅ Good: Check range before converting
function bigintToNumber(value: bigint): number {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error('Value too large for safe conversion to number')
  }
  return Number(value)
}

// ❌ Bad: Unsafe conversion
function bigintToNumber(value: bigint): number {
  return Number(value) // May lose precision!
}
```

### 5. Document Expected Types

```typescript
/**
 * Calculates total balance including fees
 * @param balance - Account balance in microAlgos (uint64, returns bigint)
 * @param fees - Total fees in microAlgos (uint64, returns bigint)
 * @returns Total amount in microAlgos as bigint
 */
function calculateTotal(balance: bigint, fees: bigint): bigint {
  return balance + fees
}
```

## Common Pitfalls

### 1. Forgetting the 'n' Suffix

```typescript
// ❌ Bad: Missing 'n' suffix
const value = getABIDecodedValue(encoded, 'uint64', {}) as bigint
const result = value + 1000 // Error!

// ✅ Good: Use 'n' suffix for BigInt literals
const result = value + 1000n
```

### 2. Mixing Types in Arithmetic

```typescript
// ❌ Bad: Cannot mix number and bigint
const amount = 1000000n
const fee = 1000
const total = amount + fee // Error!

// ✅ Good: Convert to same type
const total = amount + BigInt(fee)
// or
const total = Number(amount) + fee // Only if amount is small enough!
```

### 3. Unsafe Type Conversions

```typescript
// ❌ Bad: Converting large bigint to number loses precision
const largeValue = 9007199254740993n
const asNumber = Number(largeValue) // Precision lost!

// ✅ Good: Check range before converting
if (largeValue <= BigInt(Number.MAX_SAFE_INTEGER)) {
  const asNumber = Number(largeValue)
} else {
  // Keep as bigint or use string representation
  console.log(largeValue.toString())
}
```

### 4. Using Wrong Type in Comparisons

```typescript
const value = getABIDecodedValue(encoded, 'uint64', {}) as bigint

// ❌ Bad: Comparing bigint to number
if (value > 1000) { // Works, but inconsistent
  // ...
}

// ✅ Good: Use consistent types
if (value > 1000n) {
  // ...
}
```

## Reference: All Valid ABI Uint Types

Valid ABI uint types are in 8-bit increments from 8 to 512:

```typescript
[
  'uint8',   'uint16',  'uint24',  'uint32',  'uint40',  'uint48',  // number
  'uint56',  'uint64',  'uint72',  'uint80',  'uint88',  'uint96',  // bigint
  'uint104', 'uint112', 'uint120', 'uint128', 'uint136', 'uint144',
  'uint152', 'uint160', 'uint168', 'uint176', 'uint184', 'uint192',
  'uint200', 'uint208', 'uint216', 'uint224', 'uint232', 'uint240',
  'uint248', 'uint256', 'uint264', 'uint272', 'uint280', 'uint288',
  'uint296', 'uint304', 'uint312', 'uint320', 'uint328', 'uint336',
  'uint344', 'uint352', 'uint360', 'uint368', 'uint376', 'uint384',
  'uint392', 'uint400', 'uint408', 'uint416', 'uint424', 'uint432',
  'uint440', 'uint448', 'uint456', 'uint464', 'uint472', 'uint480',
  'uint488', 'uint496', 'uint504', 'uint512'
]
```

## TypeScript Type Definitions

For type safety in your code:

```typescript
// Type for decoded uint values
type DecodedUint<T extends string> =
  T extends `uint${infer N extends number}`
    ? N extends 8 | 16 | 24 | 32 | 40 | 48
      ? number
      : bigint
    : never

// Usage
type Uint32Value = DecodedUint<'uint32'> // number
type Uint64Value = DecodedUint<'uint64'> // bigint
```

## Learn More

- [Example 97: Decode ABI Types from Raw Bytes](../97-decode-abi-types-from-raw-bytes/) - General ABI decoding
- [Example 98: Encode ABI Types to Raw Bytes](../98-encode-abi-types-to-raw-bytes/) - ABI encoding
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand ABI Specification](https://arc.algorand.foundation/ARCs/arc-0004)
- [JavaScript BigInt Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- [Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)
