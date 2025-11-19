import algosdk from 'algosdk'

/**
 * This example demonstrates how to decode ABI-encoded data into complex types.
 * Specifically, it shows decoding a struct containing a uint16 and a string,
 * which is a common pattern when working with smart contract data.
 */

// Define the structure type definition
// Note: uint16 decodes to bigint in algosdk
interface User {
  userId: bigint
  name: string
}

function main() {
  console.log('=== ABI Struct Decoding Example ===')
  console.log()

  // Define the ABI type for a struct (tuple) containing uint16 and string
  // In ABI, a struct is represented as a tuple: (uint16,string)
  const userTupleType = algosdk.ABIType.from('(uint16,string)')

  // Example 1: Encode and decode a User struct
  console.log('Example 1: Encoding and decoding a User struct')
  console.log('-----------------------------------------------')

  // Create a user with userId=1 and name="Alice"
  const user1Values: [number | bigint, string] = [1, 'Alice']

  // Encode the values
  const encodedData = userTupleType.encode(user1Values)

  console.log('Original values:', user1Values)
  console.log('Encoded data (hex):', Buffer.from(encodedData).toString('hex'))
  console.log('Encoded data (bytes):', Array.from(encodedData))
  console.log()

  // Decode the ABI-encoded data back into a tuple
  const decodedTuple = userTupleType.decode(encodedData) as [bigint, string]

  // Convert tuple to User object
  const decoded: User = {
    userId: decodedTuple[0],
    name: decodedTuple[1],
  }

  console.log('Decoded struct:')
  console.log(`  userId: ${decoded.userId} (type: ${typeof decoded.userId})`)
  console.log(`  name: "${decoded.name}" (type: ${typeof decoded.name})`)
  console.log()

  // Verify the types are correct
  console.log('Type verification:')
  console.log(`  userId is bigint: ${typeof decoded.userId === 'bigint'}`)
  console.log(`  name is string: ${typeof decoded.name === 'string'}`)
  console.log()

  // Example 2: Decode another User struct with different values
  console.log('Example 2: Encoding and decoding another User struct')
  console.log('-----------------------------------------------------')

  const user2Values: [number | bigint, string] = [42, 'Bob']
  const encodedData2 = userTupleType.encode(user2Values)

  console.log('Original values:', user2Values)
  console.log('Encoded data (hex):', Buffer.from(encodedData2).toString('hex'))
  console.log()

  const decodedTuple2 = userTupleType.decode(encodedData2) as [bigint, string]
  const decoded2: User = {
    userId: decodedTuple2[0],
    name: decodedTuple2[1],
  }

  console.log('Decoded struct:')
  console.log(`  userId: ${decoded2.userId}`)
  console.log(`  name: "${decoded2.name}"`)
  console.log()

  // Example 3: Using BigInt values
  console.log('Example 3: Using BigInt values for userId')
  console.log('------------------------------------------')

  // You can also pass BigInt directly
  const user3Values: [number | bigint, string] = [100n, 'Charlie']
  const encodedData3 = userTupleType.encode(user3Values)

  console.log('Original values:', user3Values)
  console.log('Encoded data (hex):', Buffer.from(encodedData3).toString('hex'))
  console.log()

  const decodedTuple3 = userTupleType.decode(encodedData3) as [bigint, string]
  const decoded3: User = {
    userId: decodedTuple3[0],
    name: decodedTuple3[1],
  }

  console.log('Decoded struct:')
  console.log(`  userId: ${decoded3.userId} (type: ${typeof decoded3.userId})`)
  console.log(`  name: "${decoded3.name}"`)
  console.log()

  console.log('=== Example Complete ===')
  console.log('ABI encoding/decoding allows type-safe interaction with smart contract data.')
  console.log('Structs are represented as tuples: (type1,type2,...)')
  console.log('algosdk provides ABIType.from() to create type encoders/decoders.')
}

main()
