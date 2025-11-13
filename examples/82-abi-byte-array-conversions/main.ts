import algosdk from 'algosdk'

/**
 * This example demonstrates how to convert ABI byte arrays to Uint8Array format.
 * This conversion is useful when working with smart contract return values that
 * contain byte arrays, as it converts them to a more JavaScript-friendly format.
 *
 * Note: convertAbiByteArrays is an internal AlgoKit Utils function. This example
 * demonstrates the concept by showing what it does and implementing a simple version.
 */

// Import ABI types from algosdk
const {
  ABIByteType,
  ABIArrayStaticType,
  ABIArrayDynamicType,
  ABITupleType,
  ABIBoolType,
  ABIUintType,
  ABIType,
} = algosdk

/**
 * Converts ABI byte arrays to Uint8Array format recursively.
 * Other ABI types remain unchanged.
 *
 * This is a simplified version of the internal AlgoKit Utils function.
 */
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

console.log('=== ABI Byte Array Conversions Demo ===\n')

// Example 1: Convert nested byte arrays (byte[2][])
console.log('Example 1: Converting nested byte arrays (byte[2][])')
console.log('---------------------------------------------------')

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

console.log('Input:', JSON.stringify(nestedValue))

// Convert to Uint8Array format
const nestedResult = convertAbiByteArrays(nestedValue, outerArrayType)

console.log('Output: Array of Uint8Array instances')
nestedResult.forEach((item: any, index: number) => {
  console.log(`  [${index}]:`, Array.from(item as Uint8Array))
})
console.log()

// Example 2: Non-byte arrays remain unchanged
console.log('Example 2: Non-byte arrays (uint8[3]) are not converted')
console.log('--------------------------------------------------------')

// Define the ABI type: uint8[3] (NOT a byte array)
const uintType = new ABIUintType(8)
const uintArrayType = new ABIArrayStaticType(uintType, 3)

// Input: regular number array
const uintValue = [1, 2, 3]

console.log('Input:', JSON.stringify(uintValue))

// Convert - should remain unchanged because it's not a byte array
const uintResult = convertAbiByteArrays(uintValue, uintArrayType)

console.log('Output:', JSON.stringify(uintResult))
console.log('Note: The array remains unchanged because uint8[] is not a byte[] type')
console.log()

// Example 3: Tuples with mixed types including byte arrays
console.log('Example 3: Converting tuples with byte arrays (byte[2],bool,byte[3])')
console.log('---------------------------------------------------------------------')

// Define the ABI type: (byte[2], bool, byte[3])
const byteArray2Type = new ABIArrayStaticType(byteType, 2)
const byteArray3Type = new ABIArrayStaticType(byteType, 3)
const boolType = new ABIBoolType()
const tupleType = new ABITupleType([byteArray2Type, boolType, byteArray3Type])

// Input: tuple with byte arrays and a boolean
const tupleValue = [[1, 2], true, [3, 4, 5]]

console.log('Input:', JSON.stringify(tupleValue))

// Convert - only byte arrays are converted to Uint8Array
const tupleResult = convertAbiByteArrays(tupleValue, tupleType)

console.log('Output:')
console.log('  [0] (byte[2]):', Array.from(tupleResult[0] as Uint8Array))
console.log('  [1] (bool):', tupleResult[1])
console.log('  [2] (byte[3]):', Array.from(tupleResult[2] as Uint8Array))
console.log('Note: Only the byte arrays are converted; the boolean remains unchanged')
console.log()

console.log('=== Key Takeaways ===')
console.log('1. convertAbiByteArrays() recursively converts byte[] types to Uint8Array')
console.log('2. Other ABI types (uint, bool, etc.) remain unchanged')
console.log('3. Works with nested structures (arrays of arrays, tuples)')
console.log('4. Useful for preparing data for smart contract interactions')
console.log('5. AlgoKit Utils uses this internally when decoding contract return values')
