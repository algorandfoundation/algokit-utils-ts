import { getABIDecodedValue } from '@algorandfoundation/algokit-utils/types/app-arc56'
import { ABIUintType } from 'algosdk'

/**
 * This example demonstrates how to decode ABI uint types and understand
 * the automatic type conversion between JavaScript number and bigint.
 * 
 * Key insight: JavaScript numbers can safely represent integers up to 2^53 - 1.
 * Therefore:
 * - uint8 through uint48 (< 53 bits) are decoded as number
 * - uint56 through uint512 (>= 53 bits) are decoded as bigint
 */

function main() {
  console.log('=== ABI Uint Type Decoding Example ===')
  console.log()
  console.log('JavaScript safe integer range: -(2^53 - 1) to (2^53 - 1)')
  console.log('Threshold: uint types < 53 bits → number, >= 53 bits → bigint')
  console.log()

  // Generate all valid ABI uint bit lengths (uint8, uint16, uint24, ..., uint512)
  const validBitLengths = Array.from({ length: 64 }, (_, i) => (i + 1) * 8)

  console.log('Decoding uint types across all valid bit lengths:')
  console.log('==================================================')
  console.log()

  // Test decoding for each uint type
  validBitLengths.forEach((bitLength) => {
    // Encode the value 1 using the appropriate uint type
    const abiType = new ABIUintType(bitLength)
    const encoded = abiType.encode(1)

    // Decode the value back
    const decoded = getABIDecodedValue(encoded, `uint${bitLength}`, {})

    // Determine expected type based on bit length
    const expectedType = bitLength < 53 ? 'number' : 'bigint'
    const actualType = typeof decoded
    const typeMatch = expectedType === actualType ? '✓' : '✗'

    console.log(
      `uint${bitLength.toString().padStart(3, ' ')}: ` +
      `${decoded.toString().padStart(2, ' ')} ` +
      `(${actualType.padEnd(6, ' ')}) ${typeMatch}`
    )
  })

  console.log()
  console.log('Detailed examples:')
  console.log('------------------')

  // Example 1: uint32 (will be a number)
  console.log()
  console.log('Example 1: uint32 (32 bits < 53 bits)')
  const uint32Type = new ABIUintType(32)
  const encodedUint32 = uint32Type.encode(42)
  const decodedUint32 = getABIDecodedValue(encodedUint32, 'uint32', {})
  console.log(`  Encoded value: 42`)
  console.log(`  Decoded value: ${decodedUint32}`)
  console.log(`  Type: ${typeof decodedUint32}`)
  console.log(`  Can use arithmetic: ${decodedUint32} + 8 = ${(decodedUint32 as number) + 8}`)

  // Example 2: uint64 (will be a bigint)
  console.log()
  console.log('Example 2: uint64 (64 bits >= 53 bits)')
  const uint64Type = new ABIUintType(64)
  const encodedUint64 = uint64Type.encode(1000000000000)
  const decodedUint64 = getABIDecodedValue(encodedUint64, 'uint64', {})
  console.log(`  Encoded value: 1000000000000`)
  console.log(`  Decoded value: ${decodedUint64}`)
  console.log(`  Type: ${typeof decodedUint64}`)
  console.log(`  Can use BigInt arithmetic: ${decodedUint64} + 8n = ${(decodedUint64 as bigint) + 8n}`)

  // Example 3: Boundary case - uint48 (number) vs uint56 (bigint)
  console.log()
  console.log('Example 3: Boundary between number and bigint')
  const uint48Type = new ABIUintType(48)
  const uint56Type = new ABIUintType(56)
  const encodedUint48 = uint48Type.encode(1)
  const encodedUint56 = uint56Type.encode(1)
  const decodedUint48 = getABIDecodedValue(encodedUint48, 'uint48', {})
  const decodedUint56 = getABIDecodedValue(encodedUint56, 'uint56', {})
  console.log(`  uint48 (48 bits): type = ${typeof decodedUint48} ← last uint as number`)
  console.log(`  uint56 (56 bits): type = ${typeof decodedUint56} ← first uint as bigint`)

  console.log()
  console.log('=== Example Complete ===')
  console.log('Key takeaway: Always check the bit length of uint types to know')
  console.log('whether to expect number or bigint in your TypeScript code.')
}

main()