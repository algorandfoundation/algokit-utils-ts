import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algokit from '@algorandfoundation/algokit-utils'
import { ABIUintType } from 'algosdk'
import { TestAppClient } from './artifacts/TestApp/client' // Adjust import based on your app

/**
 * Example: Retrieve Application State
 * 
 * This example demonstrates comprehensive state management including:
 * 1. Reading and decoding global state
 * 2. Reading and decoding local state (per-account)
 * 3. Working with box storage (raw and ABI-encoded values)
 */
async function retrieveAppState() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.fromEnvironment()
  
  // Get a test account
  const testAccount = await algorand.account.fromEnvironment('TEST_ACCOUNT')
  
  console.log('\n--- Retrieve Application State Example ---\n')
  
  // Assume we have a deployed app client
  const client = new TestAppClient(
    {
      sender: testAccount,
      resolveBy: 'id',
      id: 0, // Your app ID
    },
    algorand.client.algod
  )
  
  // ========================================
  // 1. GLOBAL STATE EXAMPLE
  // ========================================
  console.log('\n1. Working with Global State:')
  console.log('Setting global state values...')
  
  // Set global state with various data types
  await client.send.call({ 
    method: 'set_global', 
    args: [1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])] 
  })
  
  // Retrieve global state
  const globalState = await client.getGlobalState()
  
  console.log('\nGlobal State Retrieved:')
  console.log(`  int1: ${globalState.int1?.value}`)
  console.log(`  int2: ${globalState.int2?.value}`)
  console.log(`  bytes1 (string): ${globalState.bytes1?.value}`)
  console.log(`  bytes2 (raw): [${globalState.bytes2?.valueRaw}]`)
  console.log(`  Available keys: ${Object.keys(globalState).sort().join(', ')}`)
  
  // ========================================
  // 2. LOCAL STATE EXAMPLE
  // ========================================
  console.log('\n\n2. Working with Local State:')
  console.log('Opting in to the application...')
  
  // Opt-in is required before setting local state
  await client.send.optIn({ method: 'opt_in' })
  
  console.log('Setting local state values...')
  await client.send.call({ 
    method: 'set_local', 
    args: [1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])] 
  })
  
  // Retrieve local state for the test account
  const localState = await client.getLocalState(testAccount.addr)
  
  console.log('\nLocal State Retrieved:')
  console.log(`  local_int1: ${localState.local_int1?.value}`)
  console.log(`  local_int2: ${localState.local_int2?.value}`)
  console.log(`  local_bytes1 (string): ${localState.local_bytes1?.value}`)
  console.log(`  local_bytes2 (raw): [${localState.local_bytes2?.valueRaw}]`)
  console.log(`  Available keys: ${Object.keys(localState).sort().join(', ')}`)
  
  // ========================================
  // 3. BOX STORAGE EXAMPLE
  // ========================================
  console.log('\n\n3. Working with Box Storage:')
  
  // Define box names
  const boxName1 = new Uint8Array([0, 0, 0, 1])
  const boxName1Base64 = Buffer.from(boxName1).toString('base64')
  const boxName2 = new Uint8Array([0, 0, 0, 2])
  const boxName2Base64 = Buffer.from(boxName2).toString('base64')
  
  // Fund the app account to cover box storage minimum balance
  console.log('Funding app account for box storage...')
  await client.fundAppAccount({ amount: algokit.algo(1) })
  
  // Create boxes with string values
  console.log('Creating boxes with string values...')
  await client.send.call({
    method: 'set_box',
    args: [boxName1, 'value1'],
    boxReferences: [boxName1],
  })
  await client.send.call({
    method: 'set_box',
    args: [boxName2, 'value2'],
    boxReferences: [boxName2],
  })
  
  // Retrieve all box values
  const boxValues = await client.getBoxValues()
  console.log(`\nTotal boxes found: ${boxValues.length}`)
  
  // Retrieve a specific box value
  const box1Value = await client.getBoxValue(boxName1)
  console.log(`\nBox 1 (${boxName1Base64}):`, Buffer.from(box1Value).toString())
  
  const box1 = boxValues.find((b) => b.name.nameBase64 === boxName1Base64)
  const box2 = boxValues.find((b) => b.name.nameBase64 === boxName2Base64)
  console.log(`Box 2 (${boxName2Base64}):`, Buffer.from(box2!.value).toString())
  
  // ========================================
  // 4. BOX STORAGE WITH ABI TYPES
  // ========================================
  console.log('\n\n4. Working with ABI-Encoded Box Values:')
  
  const expectedValue = 1234524352
  console.log(`Setting box with ABI-encoded uint32 value: ${expectedValue}`)
  
  // Set box with ABI-encoded value
  await client.send.call({
    method: 'set_box',
    args: [boxName1, new ABIUintType(32).encode(expectedValue)],
    boxReferences: [boxName1],
  })
  
  // Retrieve and decode box value using ABI type
  const boxes = await client.getBoxValuesFromABIType(
    new ABIUintType(32), 
    (n) => n.nameBase64 === boxName1Base64
  )
  
  const box1AbiValue = await client.getBoxValueFromABIType(boxName1, new ABIUintType(32))
  
  console.log(`\nABI-Decoded box value: ${Number(box1AbiValue)}`)
  console.log(`Filtered boxes count: ${boxes.length}`)
  console.log(`First box decoded value: ${Number(boxes[0].value)}`)
  
  console.log('\n✅ Successfully demonstrated all state retrieval methods!')
}

// Run the example
retrieveAppState().catch(console.error)