import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates working with nested ABI tuples containing byte arrays
 * in smart contract method calls.
 *
 * Topics covered:
 * 1. Defining ABI methods with nested tuple parameters
 * 2. Passing complex nested structures to smart contracts
 * 3. Receiving and decoding nested tuple return values
 * 4. Working with byte arrays in tuples
 *
 * The example uses this nested structure: (byte[2],(byte[1],bool))
 * - Outer tuple contains a byte array and an inner tuple
 * - Inner tuple contains a byte array and a boolean
 */

async function main() {
  console.log('=== Working with Nested ABI Tuples and Byte Arrays ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr.toString())
  console.log()

  // Deploy a smart contract that works with nested tuples
  console.log('=== Deploying Smart Contract ===\n')

  const approvalProgram = `#pragma version 10

txn ApplicationID
int 0
==
bnz create

// Handle app calls
txn NumAppArgs
int 0
>
bnz check_methods

// Default: approve
int 1
return

create:
// No initialization needed
int 1
return

check_methods:
// Check which ABI method is being called
txn ApplicationArgs 0
method "process_nested_tuple((byte[2],(byte[1],bool)))string"
==
bnz method_process_nested_tuple

// Unknown method
int 0
return

method_process_nested_tuple:
// This method receives a nested tuple: (byte[2],(byte[1],bool))
// The tuple is passed as ApplicationArgs[1]
// We'll extract the values and return a description

// Get the argument (it's at index 1)
txna ApplicationArgs 1

// For this demo, we'll decode the structure and create a response
// Tuple structure: (byte[2],(byte[1],bool))
// Total size: 2 bytes + (1 byte + 1 bool) = 2 + 2 = 4 bytes
// Layout: [byte0, byte1, byte2, bool_as_byte]

// Extract first byte from byte[2]
dup
int 0
int 1
extract3  // Get byte at position 0

// Extract second byte from byte[2]
dig 1     // Bring original arg back
int 1
int 1
extract3  // Get byte at position 1

// Extract byte from inner tuple's byte[1]
dig 2     // Bring original arg back
int 2
int 1
extract3  // Get byte at position 2

// Extract bool from inner tuple
dig 3     // Bring original arg back
int 3
int 1
extract3  // Get bool byte at position 3
btoi      // Convert to int (0 or 1)

// Now we have on stack: [original_arg, byte0, byte1, byte2, bool_int]
// Clean up and create return message
pop       // Remove bool_int
pop       // Remove byte2
pop       // Remove byte1
pop       // Remove byte0
pop       // Remove original_arg

// Return a success message
// In a real contract, you'd process the values
byte "Successfully processed nested tuple with byte arrays and bool!"
dup
len
itob
extract 6 2
swap
concat
byte 0x151f7c75  // ABI return prefix
swap
concat
log

int 1
return`

  const clearProgram = `#pragma version 10
int 1
return`

  const createResult = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 0,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  })

  const appId = createResult.appId
  console.log('✅ Application deployed!')
  console.log('   App ID:', appId)
  console.log()

  // Define the ABI method with nested tuple parameter
  console.log('=== Defining ABI Method ===\n')

  const processNestedTupleMethod = new algosdk.ABIMethod({
    name: 'process_nested_tuple',
    args: [
      {
        type: '(byte[2],(byte[1],bool))', // Nested tuple type
        name: 'nested_data',
      },
    ],
    returns: { type: 'string' },
  })

  console.log('Method signature:', processNestedTupleMethod.getSignature())
  console.log('Parameter type: (byte[2],(byte[1],bool))')
  console.log('  - Outer tuple contains:')
  console.log('    1. byte[2] - static array of 2 bytes')
  console.log('    2. (byte[1],bool) - inner tuple')
  console.log('  - Inner tuple contains:')
  console.log('    1. byte[1] - static array of 1 byte')
  console.log('    2. bool - boolean value')
  console.log()

  // Prepare nested tuple data
  console.log('=== Preparing Nested Tuple Data ===\n')

  // JavaScript representation of the nested tuple
  const nestedTupleValue = [
    [65, 66], // byte[2] - outer array (ASCII 'A', 'B')
    [[67], true], // (byte[1], bool) - inner tuple (ASCII 'C', true)
  ]

  console.log('Nested tuple structure:')
  console.log('  Outer tuple: [byte[2], (byte[1], bool)]')
  console.log('  byte[2]:', nestedTupleValue[0], '(ASCII:', String.fromCharCode(...(nestedTupleValue[0] as number[])) + ')')
  console.log('  Inner tuple:', nestedTupleValue[1])
  console.log('    byte[1]:', nestedTupleValue[1][0], '(ASCII:', String.fromCharCode(...(nestedTupleValue[1][0] as number[])) + ')')
  console.log('    bool:', nestedTupleValue[1][1])
  console.log()

  // Call the method with the nested tuple
  console.log('=== Calling Method with Nested Tuple ===\n')

  const result = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: processNestedTupleMethod,
      args: [nestedTupleValue],
    })
    .send()

  console.log('✅ Method call successful!')
  console.log('   Transaction ID:', result.txIds[0])
  console.log()

  if (result.returns && result.returns.length > 0) {
    const returnValue = result.returns[0].returnValue
    console.log('Return value from contract:')
    console.log(`   "${returnValue}"`)
  }
  console.log()

  // Example with different values
  console.log('=== Testing with Different Values ===\n')

  const nestedTupleValue2 = [
    [72, 105], // byte[2] (ASCII 'H', 'i')
    [[33], false], // (byte[1], bool) (ASCII '!', false)
  ]

  console.log('Second nested tuple:')
  console.log('  byte[2]:', nestedTupleValue2[0], '(ASCII:', String.fromCharCode(...(nestedTupleValue2[0] as number[])) + ')')
  console.log('  Inner tuple:', nestedTupleValue2[1])
  console.log('    byte[1]:', nestedTupleValue2[1][0], '(ASCII:', String.fromCharCode(...(nestedTupleValue2[1][0] as number[])) + ')')
  console.log('    bool:', nestedTupleValue2[1][1])
  console.log()

  const result2 = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: processNestedTupleMethod,
      args: [nestedTupleValue2],
    })
    .send()

  console.log('✅ Second method call successful!')
  console.log('   Transaction ID:', result2.txIds[0])
  console.log()

  if (result2.returns && result2.returns.length > 0) {
    const returnValue = result2.returns[0].returnValue
    console.log('Return value from contract:')
    console.log(`   "${returnValue}"`)
  }
  console.log()

  // Demonstrate working with Uint8Arrays
  console.log('=== Working with Uint8Arrays ===\n')

  console.log('You can also use Uint8Arrays directly:')
  const nestedTupleValue3 = [
    new Uint8Array([88, 89]), // byte[2] (ASCII 'X', 'Y')
    [new Uint8Array([90]), true], // (byte[1], bool) (ASCII 'Z', true)
  ]

  console.log('  byte[2]:', Array.from(nestedTupleValue3[0] as Uint8Array), '(Uint8Array)')
  console.log('  Inner tuple:')
  console.log('    byte[1]:', Array.from(nestedTupleValue3[1][0] as Uint8Array), '(Uint8Array)')
  console.log('    bool:', nestedTupleValue3[1][1])
  console.log()

  const result3 = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: processNestedTupleMethod,
      args: [nestedTupleValue3],
    })
    .send()

  console.log('✅ Third method call successful!')
  console.log('   Transaction ID:', result3.txIds[0])
  console.log()

  // Key takeaways
  console.log('=== Key Takeaways ===\n')
  console.log('✓ Nested tuples can contain byte arrays and other types')
  console.log('✓ JavaScript arrays are automatically converted to ABI format')
  console.log('✓ You can use number arrays or Uint8Arrays for byte arrays')
  console.log('✓ AlgoKit Utils handles ABI encoding/decoding automatically')
  console.log('✓ Nested structures maintain their type information')
  console.log()

  console.log('Common nested tuple patterns:')
  console.log('  • (byte[],uint64) - dynamic byte array with integer')
  console.log('  • (address,(uint64,bool)) - address with nested data')
  console.log('  • ((byte[32],uint64),string) - nested tuple with string')
  console.log('  • (byte[2],(byte[1],bool)) - this example!')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)