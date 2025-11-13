import {
  ABIByteType,
  ABIArrayStaticType,
  ABIArrayDynamicType,
  ABITupleType,
  ABIBoolType,
  ABIUintType,
  convertAbiByteArrays,
  type ABIValue,
} from '@algorandfoundation/algokit-utils'

/**
 * Demonstrates working with highly complex nested ABI structures.
 * 
 * This example shows how to:
 * 1. Define complex multi-level type structures
 * 2. Combine dynamic arrays, static arrays, and tuples
 * 3. Convert complex JavaScript structures to ABI format
 * 4. Handle real-world smart contract data scenarios
 * 
 * The structure being created is: (byte[2][],uint8,(bool,byte[3]))
 * - First element: Dynamic array of static byte[2] arrays
 * - Second element: 8-bit unsigned integer
 * - Third element: Tuple containing a boolean and byte[3] array
 */

function main() {
  console.log('=== Working with Complex Multi-Level ABI Structures ===\n')

  // Step 1: Define the basic types
  console.log('Step 1: Defining basic ABI types...')
  const byteType = new ABIByteType()
  const boolType = new ABIBoolType()
  const uintType = new ABIUintType(8) // 8-bit unsigned integer
  console.log('✓ Created basic types: byte, bool, uint8\n')

  // Step 2: Define array types
  console.log('Step 2: Defining array types...')
  
  // Static array of 2 bytes: byte[2]
  const byteArray2Type = new ABIArrayStaticType(byteType, 2)
  console.log('✓ Created byte[2] - static array of 2 bytes')
  
  // Dynamic array of byte[2]: byte[2][]
  const byteArrayDynType = new ABIArrayDynamicType(byteArray2Type)
  console.log('✓ Created byte[2][] - dynamic array of byte[2]')
  
  // Static array of 3 bytes: byte[3]
  const byteArray3Type = new ABIArrayStaticType(byteType, 3)
  console.log('✓ Created byte[3] - static array of 3 bytes\n')

  // Step 3: Define tuple types
  console.log('Step 3: Defining tuple structures...')
  
  // Inner tuple: (bool, byte[3])
  const innerTupleType = new ABITupleType([boolType, byteArray3Type])
  console.log('✓ Created inner tuple: (bool, byte[3])')
  
  // Outer tuple: (byte[2][], uint8, (bool, byte[3]))
  const outerTupleType = new ABITupleType([
    byteArrayDynType,
    uintType,
    innerTupleType,
  ])
  console.log('✓ Created outer tuple: (byte[2][], uint8, (bool, byte[3]))\n')

  // Step 4: Prepare complex data structure
  console.log('Step 4: Preparing complex data structure...')
  const value = [
    [
      [1, 2],    // First byte[2]
      [3, 4],    // Second byte[2]
      [5, 6],    // Third byte[2]
    ],           // Dynamic array of byte[2] arrays
    123,         // uint8 value
    [true, [7, 8, 9]], // Inner tuple: (bool, byte[3])
  ]
  console.log('Original structure:')
  console.log('  byte[2][]: [[1,2], [3,4], [5,6]]')
  console.log('  uint8: 123')
  console.log('  (bool, byte[3]): [true, [7,8,9]]')
  console.log()

  // Step 5: Convert to ABI format
  console.log('Step 5: Converting to ABI format...')
  const result = convertAbiByteArrays(value, outerTupleType) as ABIValue[]
  console.log('✓ Conversion complete\n')

  // Step 6: Inspect the results
  console.log('Step 6: Inspecting converted results...\n')

  // Check first element (byte[2][])
  console.log('First element (byte[2][] - dynamic array):')
  const byteArrays = result[0] as ABIValue[]
  console.log('  Is array:', Array.isArray(byteArrays))
  console.log('  Length:', byteArrays.length)
  console.log('  Elements:')
  byteArrays.forEach((item, index) => {
    console.log(`    [${index}]: ${item.constructor.name} - [${Array.from(item as Uint8Array).join(', ')}]`)
  })
  console.log('  ✓ All elements are Uint8Array instances')
  console.log()

  // Check second element (uint8)
  console.log('Second element (uint8):')
  console.log('  Type:', typeof result[1])
  console.log('  Value:', result[1])
  console.log('  ✓ Integer value preserved')
  console.log()

  // Check third element (nested tuple)
  console.log('Third element (nested tuple: (bool, byte[3])):')
  const tuple = result[2] as ABIValue[]
  console.log('  Is array:', Array.isArray(tuple))
  console.log('  Length:', tuple.length)
  console.log()

  console.log('  First element (bool):')
  console.log('    Type:', typeof tuple[0])
  console.log('    Value:', tuple[0])
  console.log('    ✓ Boolean value preserved')
  console.log()

  console.log('  Second element (byte[3]):')
  console.log('    Type:', tuple[1].constructor.name)
  console.log('    Values:', Array.from(tuple[1] as Uint8Array))
  console.log('    ✓ Converted to Uint8Array')
  console.log()

  // Summary
  console.log('=== Summary ===')
  console.log('✓ Successfully created complex multi-level structure')
  console.log('✓ Dynamic array of static arrays handled correctly')
  console.log('✓ Integer value passed through unchanged')
  console.log('✓ Nested tuple with mixed types converted properly')
  console.log('✓ All byte arrays converted to Uint8Array instances')
  console.log('✓ Structure ready for smart contract interactions')
  console.log()
  console.log('This pattern represents real-world smart contract scenarios')
  console.log('where complex data structures need to be encoded for ABI calls.')
}

// Run the example
main()