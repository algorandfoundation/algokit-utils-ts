import algosdk from 'algosdk'

/**
 * Demonstrates handling of empty byte arrays in ABI type conversion.
 *
 * This example shows how to:
 * 1. Define zero-length byte array types
 * 2. Encode and decode empty arrays in ABI format
 * 3. Handle edge cases properly for robust smart contract code
 *
 * Edge case handling is crucial for production-ready applications.
 * Empty arrays can occur in various scenarios and must be handled gracefully.
 */

function main() {
  console.log('=== Handling Empty Byte Arrays in ABI Types ===\n')

  // Step 1: Define the empty byte array type
  console.log('Step 1: Defining byte array type...')

  // Create a static array with 0 elements: byte[0]
  const emptyByteArrayType = algosdk.ABIType.from('byte[0]')
  console.log('✓ Created byte[0] - static array with 0 elements')
  console.log('  Type string:', emptyByteArrayType.toString())
  console.log()

  // Step 2: Prepare empty array
  console.log('Step 2: Preparing empty array...')
  const emptyArray: number[] = []
  console.log('Input value:', emptyArray)
  console.log('Array length:', emptyArray.length)
  console.log()

  // Step 3: Encode to ABI format
  console.log('Step 3: Encoding to ABI format...')
  const encoded = emptyByteArrayType.encode(emptyArray)
  console.log('✓ Encoding complete')
  console.log('  Encoded type:', encoded.constructor.name)
  console.log('  Encoded length:', encoded.length, 'bytes')
  console.log('  Encoded value:', Array.from(encoded))
  console.log()

  // Step 4: Decode back from ABI format
  console.log('Step 4: Decoding from ABI format...')
  const decoded = emptyByteArrayType.decode(encoded)
  console.log('✓ Decoding complete')
  console.log('  Decoded type:', decoded.constructor.name)
  console.log('  Decoded length:', (decoded as number[]).length)
  console.log('  Decoded value:', decoded)
  console.log()

  // Step 5: Demonstrate with dynamic byte arrays
  console.log('Step 5: Handling empty dynamic byte arrays...')
  const dynamicByteArrayType = algosdk.ABIType.from('byte[]')
  console.log('✓ Created byte[] - dynamic byte array')
  console.log('  Type string:', dynamicByteArrayType.toString())

  const encodedDynamic = dynamicByteArrayType.encode([])
  console.log('✓ Encoded empty dynamic array')
  console.log('  Encoded length:', encodedDynamic.length, 'bytes')
  console.log('  Encoded value:', Array.from(encodedDynamic))

  const decodedDynamic = dynamicByteArrayType.decode(encodedDynamic)
  console.log('✓ Decoded empty dynamic array')
  console.log('  Decoded length:', (decodedDynamic as number[]).length)
  console.log()

  // Step 6: Demonstrate edge case importance
  console.log('Step 6: Why this matters...\n')
  console.log('Edge cases like empty arrays are important because:')
  console.log('  • Smart contracts may return empty results')
  console.log('  • Optional parameters might be empty')
  console.log('  • Partial data structures may have empty fields')
  console.log('  • Proper handling prevents runtime errors')
  console.log('  • ABI encoding/decoding must handle all valid inputs')
  console.log()

  // Step 7: Common patterns with empty arrays
  console.log('Step 7: Common patterns...\n')

  // Pattern 1: Checking for empty results
  console.log('Pattern 1: Checking for empty results')
  const result = decodedDynamic as number[]
  if (result.length === 0) {
    console.log('  ✓ Detected empty result, using fallback behavior')
  }
  console.log()

  // Pattern 2: Safe array operations
  console.log('Pattern 2: Safe array operations')
  const safeArray = result.length > 0 ? result : [0] // Provide default
  console.log('  ✓ Using safe default value:', safeArray)
  console.log()

  // Summary
  console.log('=== Summary ===')
  console.log('✓ Successfully handled empty byte arrays (byte[0] and byte[])')
  console.log('✓ Encoded and decoded empty arrays correctly')
  console.log('✓ Demonstrated static and dynamic empty arrays')
  console.log('✓ Edge cases handled gracefully')
  console.log('✓ Ready for robust smart contract interactions')
  console.log()
  console.log('Best Practice: Always test edge cases like empty arrays')
  console.log('to ensure your application handles all scenarios correctly.')
}

// Run the example
main()
