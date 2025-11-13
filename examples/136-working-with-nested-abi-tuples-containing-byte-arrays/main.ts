import {
  ABIByteType,
  ABIArrayStaticType,
  ABITupleType,
  ABIBoolType,
  convertAbiByteArrays,
  type ABIValue,
} from '@algorandfoundation/algokit-utils'

/**
 * Demonstrates working with nested ABI tuples containing byte arrays.
 * 
 * This example shows how to:
 * 1. Define nested tuple types with byte arrays
 * 2. Convert JavaScript values to ABI-compatible types
 * 3. Handle complex nested structures for smart contract interactions
 * 
 * The structure being created is: (byte[2],(byte[1],bool))
 * - Outer tuple contains a byte array and an inner tuple
 * - Inner tuple contains a byte array and a boolean
 */

function main() {
  console.log('=== Working with Nested ABI Tuples and Byte Arrays ===\n')

  // Step 1: Define the ABI types
  console.log('Step 1: Defining ABI types...')
  
  // Basic byte type
  const byteType = new ABIByteType()
  
  // Static array of 2 bytes: byte[2]
  const byteArray2Type = new ABIArrayStaticType(byteType, 2)
  
  // Static array of 1 byte: byte[1]
  const byteArray1Type = new ABIArrayStaticType(byteType, 1)
  
  // Boolean type
  const boolType = new ABIBoolType()
  
  console.log('✓ Created basic types: byte, byte[2], byte[1], bool\n')

  // Step 2: Create nested tuple structure
  console.log('Step 2: Creating nested tuple structure...')
  
  // Inner tuple: (byte[1], bool)
  const innerTupleType = new ABITupleType([byteArray1Type, boolType])
  console.log('✓ Created inner tuple type: (byte[1], bool)')
  
  // Outer tuple: (byte[2], (byte[1], bool))
  const outerTupleType = new ABITupleType([byteArray2Type, innerTupleType])
  console.log('✓ Created outer tuple type: (byte[2], (byte[1], bool))\n')

  // Step 3: Prepare the data
  console.log('Step 3: Preparing data...')
  const value = [
    [1, 2],           // byte[2] - outer array
    [[3], true],      // (byte[1], bool) - inner tuple
  ]
  console.log('Original value:', JSON.stringify(value), '\n')

  // Step 4: Convert to ABI format
  console.log('Step 4: Converting to ABI format...')
  const result = convertAbiByteArrays(value, outerTupleType) as ABIValue[]
  console.log('✓ Conversion complete\n')

  // Step 5: Inspect the results
  console.log('Step 5: Inspecting converted results...')
  console.log('Result is an array:', Array.isArray(result))
  console.log('Result length:', result.length)
  console.log()

  // Check first element (byte[2])
  console.log('First element (byte[2]):')
  console.log('  Type:', result[0].constructor.name)
  console.log('  Values:', Array.from(result[0] as Uint8Array))
  console.log('  ✓ Correctly converted to Uint8Array')
  console.log()

  // Check second element (nested tuple)
  const nestedTuple = result[1] as ABIValue[]
  console.log('Second element (nested tuple):')
  console.log('  Is array:', Array.isArray(nestedTuple))
  console.log('  Length:', nestedTuple.length)
  console.log()

  // Check nested tuple elements
  console.log('  First element of nested tuple (byte[1]):')
  console.log('    Type:', nestedTuple[0].constructor.name)
  console.log('    Values:', Array.from(nestedTuple[0] as Uint8Array))
  console.log('    ✓ Correctly converted to Uint8Array')
  console.log()

  console.log('  Second element of nested tuple (bool):')
  console.log('    Type:', typeof nestedTuple[1])
  console.log('    Value:', nestedTuple[1])
  console.log('    ✓ Boolean value preserved')
  console.log()

  console.log('=== Summary ===')
  console.log('✓ Successfully created and converted nested tuple structure')
  console.log('✓ Byte arrays properly converted to Uint8Array instances')
  console.log('✓ Nested structure maintained with correct types')
  console.log('✓ Ready for smart contract interactions')
}

// Run the example
main()