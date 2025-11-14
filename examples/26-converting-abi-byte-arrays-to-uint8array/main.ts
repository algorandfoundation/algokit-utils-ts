import { ABIByteType, ABIArrayStaticType, ABIArrayDynamicType } from 'algosdk'

/**
 * This example demonstrates how to work with ABI byte arrays and convert them
 * to Uint8Array format. This is useful when working with Algorand smart contracts
 * that use ABI encoding for byte data.
 */

console.log('=== Converting ABI Byte Arrays to Uint8Array ===\n')

// Example 1: Convert a static byte array (byte[4]) to Uint8Array
console.log('1. Static Byte Array Conversion (byte[4])')
console.log('   Converting a fixed-length array of bytes...\n')

// Create a static array type of bytes with length 4: byte[4]
const byteType = new ABIByteType()
const staticArrayType = new ABIArrayStaticType(byteType, 4)

// Define a simple byte array as a JavaScript array
const staticValue = [1, 2, 3, 4]
console.log(`   Original value: [${staticValue.join(', ')}]`)
console.log(`   Type: ${staticArrayType.toString()}`)

// Encode the value using ABI encoding
const staticEncoded = staticArrayType.encode(staticValue)
console.log(`   Encoded: ${staticEncoded}`)
console.log(`   Is Uint8Array: ${staticEncoded instanceof Uint8Array}`)

// Decode it back
const staticDecoded = staticArrayType.decode(staticEncoded)
const staticDecodedArray = staticDecoded instanceof Uint8Array ? staticDecoded : new Uint8Array(staticDecoded as number[])
console.log(`   Decoded: [${Array.from(staticDecodedArray).join(', ')}]`)
console.log(`   Decoded is Uint8Array: ${staticDecoded instanceof Uint8Array}`)
console.log()

// Example 2: Convert a dynamic byte array (byte[]) to Uint8Array
console.log('2. Dynamic Byte Array Conversion (byte[])')
console.log('   Converting a variable-length array of bytes...\n')

// Create a dynamic array type of bytes: byte[]
const dynamicArrayType = new ABIArrayDynamicType(byteType)

// Define a dynamic-length byte array
const dynamicValue = [10, 20, 30, 40, 50]
console.log(`   Original value: [${dynamicValue.join(', ')}]`)
console.log(`   Type: ${dynamicArrayType.toString()}`)

// Encode the value
const dynamicEncoded = dynamicArrayType.encode(dynamicValue)
console.log(`   Encoded: ${dynamicEncoded}`)
console.log(`   Is Uint8Array: ${dynamicEncoded instanceof Uint8Array}`)

// Decode it back
const dynamicDecoded = dynamicArrayType.decode(dynamicEncoded)
const dynamicDecodedArray = dynamicDecoded instanceof Uint8Array ? dynamicDecoded : new Uint8Array(dynamicDecoded as number[])
console.log(`   Decoded: [${Array.from(dynamicDecodedArray).join(', ')}]`)
console.log(`   Decoded is Uint8Array: ${dynamicDecoded instanceof Uint8Array}`)
console.log()

// Example 3: Working with existing Uint8Array
console.log('3. Working with Uint8Array Directly')
console.log('   Encoding and decoding Uint8Array values...\n')

// Create a Uint8Array directly
const uint8Value = new Uint8Array([5, 6, 7])
console.log(`   Original Uint8Array: [${Array.from(uint8Value).join(', ')}]`)

// Create type for 3 bytes
const uint8ArrayType = new ABIArrayStaticType(byteType, 3)

// Encode the Uint8Array
const uint8Encoded = uint8ArrayType.encode(uint8Value)
console.log(`   Encoded: ${uint8Encoded}`)
console.log(`   Is Uint8Array: ${uint8Encoded instanceof Uint8Array}`)

// Decode it back
const uint8Decoded = uint8ArrayType.decode(uint8Encoded)
const uint8DecodedArray = uint8Decoded instanceof Uint8Array ? uint8Decoded : new Uint8Array(uint8Decoded as number[])
console.log(`   Decoded: [${Array.from(uint8DecodedArray).join(', ')}]`)
console.log(`   Decoded is Uint8Array: ${uint8Decoded instanceof Uint8Array}`)
console.log()

// Example 4: Practical use case - Converting hex string to byte array
console.log('4. Practical Example: Hex String to Byte Array')
console.log('   Converting hex-encoded data to ABI byte array...\n')

function hexToBytes(hex: string): number[] {
  const bytes: number[] = []
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16))
  }
  return bytes
}

const hexString = '48656c6c6f'  // "Hello" in hex
const hexBytes = hexToBytes(hexString)
console.log(`   Hex string: ${hexString}`)
console.log(`   As bytes: [${hexBytes.join(', ')}]`)
console.log(`   As text: ${String.fromCharCode(...hexBytes)}`)

// Create dynamic array type for variable length
const hexArrayType = new ABIArrayDynamicType(byteType)
const hexEncoded = hexArrayType.encode(hexBytes)
const hexDecoded = hexArrayType.decode(hexEncoded)
const hexDecodedArray = hexDecoded instanceof Uint8Array ? hexDecoded : new Uint8Array(hexDecoded as number[])

console.log(`   Encoded: ${hexEncoded}`)
console.log(`   Decoded: [${Array.from(hexDecodedArray).join(', ')}]`)
console.log(`   Back to text: ${String.fromCharCode(...hexDecodedArray)}`)
console.log()

console.log('=== Summary ===')
console.log('✅ Successfully demonstrated ABI byte array conversions!')
console.log()
console.log('Key points:')
console.log('  • ABIArrayStaticType for fixed-length byte arrays (byte[N])')
console.log('  • ABIArrayDynamicType for variable-length byte arrays (byte[])')
console.log('  • encode() converts JavaScript arrays to Uint8Array')
console.log('  • decode() converts encoded bytes back to Uint8Array')
console.log('  • Both static and dynamic arrays are supported')
console.log()
console.log('=== Key Takeaways ===')
console.log('• Use ABIByteType with array types for byte array handling')
console.log('• Static arrays have fixed length, dynamic arrays are variable')
console.log('• ABI encoding/decoding preserves byte array data')
console.log('• Decoded byte arrays are returned as Uint8Array instances')
