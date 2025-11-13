import algosdk from 'algosdk'

/**
 * This example demonstrates how to decode complex nested data structures
 * using ABI encoding/decoding.
 *
 * It covers:
 * - Nested structs (struct containing another struct)
 * - Nested tuples with multiple levels
 * - Nested byte arrays (arrays of byte arrays)
 * - Complex ABI type definitions
 */

function decodeNestedStructExample() {
  console.log('=== Decoding Nested Structs ===')
  console.log()

  // Define nested struct type: outer contains inner
  // Inner struct: (uint64,string) represents { id: bigint, name: string }
  // Outer struct: (uint64,(uint64,string)) represents { count: bigint, inner: { id: bigint, name: string } }
  const nestedStructType = algosdk.ABIType.from('(uint64,(uint64,string))')

  // Example 1: Encode nested struct
  console.log('Example 1: Encoding nested struct')
  console.log('----------------------------------')

  // Create nested structure: outer with count=42, inner with id=1 and name="Alice"
  const nestedData: [number | bigint, [number | bigint, string]] = [
    42,        // outer.count
    [1, 'Alice']  // inner: { id: 1, name: "Alice" }
  ]

  const encoded = nestedStructType.encode(nestedData)

  console.log('Original nested structure:', nestedData)
  console.log('Encoded (hex):', Buffer.from(encoded).toString('hex'))
  console.log()

  // Decode back to nested structure
  const decoded = nestedStructType.decode(encoded) as [bigint, [bigint, string]]

  console.log('Decoded nested structure:')
  console.log(`  Outer count: ${decoded[0]} (type: ${typeof decoded[0]})`)
  console.log(`  Inner id: ${decoded[1][0]} (type: ${typeof decoded[1][0]})`)
  console.log(`  Inner name: "${decoded[1][1]}" (type: ${typeof decoded[1][1]})`)
  console.log()

  // Example 2: Triple nested structure
  console.log('Example 2: Triple nested structure')
  console.log('-----------------------------------')

  // Define triple nested: (uint64,(uint64,(string,uint64)))
  const tripleNestedType = algosdk.ABIType.from('(uint64,(uint64,(string,uint64)))')

  const tripleNested: [number | bigint, [number | bigint, [string, number | bigint]]] = [
    100,           // level 1
    [200, ['deep', 300]]  // level 2 and 3
  ]

  const encodedTriple = tripleNestedType.encode(tripleNested)
  const decodedTriple = tripleNestedType.decode(encodedTriple) as [bigint, [bigint, [string, bigint]]]

  console.log('Triple nested decoded:')
  console.log(`  Level 1: ${decodedTriple[0]}`)
  console.log(`  Level 2: ${decodedTriple[1][0]}`)
  console.log(`  Level 3 string: "${decodedTriple[1][1][0]}"`)
  console.log(`  Level 3 number: ${decodedTriple[1][1][1]}`)
  console.log()
}

function decodeNestedByteArraysExample() {
  console.log('=== Decoding Nested Byte Arrays ===')
  console.log()

  // Define nested byte array type: byte[][]
  // This is an array of byte arrays
  const nestedByteArrayType = algosdk.ABIType.from('byte[][]')

  // Example 1: Array of byte arrays
  console.log('Example 1: Array of byte arrays (byte[][])')
  console.log('-------------------------------------------')

  // Create array of three byte arrays
  const byteArrays = [
    new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]),  // "Hello"
    new Uint8Array([0x57, 0x6f, 0x72, 0x6c, 0x64]),  // "World"
    new Uint8Array([0x41, 0x42, 0x43])                // "ABC"
  ]

  const encoded = nestedByteArrayType.encode(byteArrays)

  console.log('Original byte arrays:')
  byteArrays.forEach((arr, i) => {
    console.log(`  Array ${i}: ${Buffer.from(arr).toString('utf-8')} (${arr.length} bytes)`)
  })
  console.log()
  console.log('Encoded (hex):', Buffer.from(encoded).toString('hex'))
  console.log()

  // Decode back to array of byte arrays
  const decoded = nestedByteArrayType.decode(encoded) as Uint8Array[]

  console.log('Decoded byte arrays:')
  decoded.forEach((arr, i) => {
    console.log(`  Array ${i}: ${Buffer.from(arr).toString('utf-8')} (${arr.length} bytes)`)
    console.log(`    Hex: ${Buffer.from(arr).toString('hex')}`)
  })
  console.log()

  // Example 2: Fixed-size nested arrays
  console.log('Example 2: Fixed-size nested arrays (byte[3][])')
  console.log('------------------------------------------------')

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
  console.log()
}

function main() {
  console.log('=== Nested ABI Structure Decoding Examples ===')
  console.log()

  // Example 1: Nested Structs
  decodeNestedStructExample()

  // Example 2: Nested Byte Arrays
  decodeNestedByteArraysExample()

  console.log('=== Example Complete ===')
  console.log('ABI encoding/decoding supports arbitrarily nested structures.')
  console.log('Use algosdk.ABIType.from() with nested type strings like:')
  console.log('  - Nested tuples: (uint64,(uint64,string))')
  console.log('  - Nested arrays: byte[][]')
  console.log('  - Mixed: (uint64,byte[][],(string,uint64))')
}

main()