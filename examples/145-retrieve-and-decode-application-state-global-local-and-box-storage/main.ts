import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { ABIUintType } from 'algosdk'
import * as algokit from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to retrieve and decode different types of
 * application state: global state, local state, and box storage.
 * 
 * Prerequisites:
 * - AlgoKit installed and LocalNet running
 * - A deployed smart contract with state management methods
 */

async function retrieveApplicationState() {
  // Initialize AlgorandClient to connect to LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const algod = algorand.client.algod
  const indexer = algorand.client.indexer

  // Get a test account with funds
  const testAccount = await algorand.account.localNetDispenser()

  console.log('Deploying smart contract...')
  // Note: Replace this with your actual contract deployment
  // const { client } = await deploy(testAccount, algod, indexer)
  // For this example, assume 'client' is your typed application client
  
  // ==========================================
  // GLOBAL STATE MANAGEMENT
  // ==========================================
  console.log('\n=== Working with Global State ===')
  
  // Set global state values with different types
  // int1=1, int2=2, bytes1='asdf', bytes2=[1,2,3,4]
  await client.call({ 
    method: 'set_global', 
    methodArgs: [1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])] 
  })
  
  // Retrieve global state
  const globalState = await client.getGlobalState()
  
  console.log('Global State Keys:', Object.keys(globalState).sort())
  console.log('int1:', globalState.int1.value) // Expected: 1n
  console.log('int2:', globalState.int2.value) // Expected: 2n
  console.log('bytes1:', globalState.bytes1.value) // Expected: 'asdf'
  console.log('bytes2 (raw):', globalState.bytes2.valueRaw) // Expected: Uint8Array([1, 2, 3, 4])
  
  // ==========================================
  // LOCAL STATE MANAGEMENT
  // ==========================================
  console.log('\n=== Working with Local State ===')
  
  // First, opt into the application to enable local state
  await client.optIn({ method: 'opt_in', methodArgs: [] })
  console.log('Account opted into application')
  
  // Set local state values
  await client.call({ 
    method: 'set_local', 
    methodArgs: [1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])] 
  })
  
  // Retrieve local state for the test account
  const localState = await client.getLocalState(testAccount)
  
  console.log('Local State Keys:', Object.keys(localState).sort())
  console.log('local_int1:', localState.local_int1.value) // Expected: 1n
  console.log('local_int2:', localState.local_int2.value) // Expected: 2n
  console.log('local_bytes1:', localState.local_bytes1.value) // Expected: 'asdf'
  console.log('local_bytes2 (raw):', localState.local_bytes2.valueRaw) // Expected: Uint8Array([1, 2, 3, 4])
  
  // ==========================================
  // BOX STORAGE MANAGEMENT
  // ==========================================
  console.log('\n=== Working with Box Storage ===')
  
  // Define box names
  const boxName1 = new Uint8Array([0, 0, 0, 1])
  const boxName1Base64 = Buffer.from(boxName1).toString('base64')
  const boxName2 = new Uint8Array([0, 0, 0, 2])
  const boxName2Base64 = Buffer.from(boxName2).toString('base64')
  
  // Fund the app account to pay for box storage
  await client.fundAppAccount(algokit.algo(1))
  console.log('App account funded for box storage')
  
  // Create box 1 with string value
  await client.call({
    method: 'set_box',
    methodArgs: [boxName1, 'value1'],
    boxes: [boxName1],
  })
  console.log('Box 1 created with value: "value1"')
  
  // Create box 2 with string value
  await client.call({
    method: 'set_box',
    methodArgs: [boxName2, 'value2'],
    boxes: [boxName2],
  })
  console.log('Box 2 created with value: "value2"')
  
  // Retrieve all box values
  const boxValues = await client.getBoxValues()
  console.log('\nAll boxes:', boxValues.map((b) => b.name.nameBase64))
  
  // Find and display box 1 value
  const box1 = boxValues.find((b) => b.name.nameBase64 === boxName1Base64)
  console.log('Box 1 value:', Buffer.from(box1!.value).toString()) // 'value1'
  
  // Retrieve a specific box value
  const box1Value = await client.getBoxValue(boxName1)
  console.log('Box 1 value (direct):', Buffer.from(box1Value).toString())
  
  // Find and display box 2 value
  const box2 = boxValues.find((b) => b.name.nameBase64 === boxName2Base64)
  console.log('Box 2 value:', Buffer.from(box2!.value).toString()) // 'value2'
  
  // ==========================================
  // ABI-TYPED BOX VALUES
  // ==========================================
  console.log('\n=== Working with ABI-Typed Box Values ===')
  
  // Store an ABI-encoded uint32 value in box 1
  const expectedValue = 1234524352
  await client.call({
    method: 'set_box',
    methodArgs: [boxName1, new ABIUintType(32).encode(expectedValue)],
    boxes: [boxName1],
  })
  console.log(`Box 1 updated with ABI uint32 value: ${expectedValue}`)
  
  // Retrieve and decode box values using ABI type
  const boxes = await client.getBoxValuesFromABIType(
    new ABIUintType(32), 
    (n) => n.nameBase64 === boxName1Base64
  )
  console.log('Number of matching boxes:', boxes.length)
  console.log('Decoded value:', Number(boxes[0].value)) // Expected: 1234524352
  
  // Retrieve a single box value and decode it using ABI type
  const box1AbiValue = await client.getBoxValueFromABIType(boxName1, new ABIUintType(32))
  console.log('Box 1 decoded uint32:', Number(box1AbiValue)) // Expected: 1234524352
  
  console.log('\n✅ Successfully retrieved and decoded all application state types!')
}

// Run the example
retrieveApplicationState().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
