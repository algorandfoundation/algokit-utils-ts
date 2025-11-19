import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import { getApplicationAddress } from 'algosdk'
import appSpec from './artifacts/TestingApp.json' with { type: 'json' }

/**
 * This example demonstrates how to retrieve box storage organized as a map.
 * Box maps allow smart contracts to store key-value pairs with efficient retrieval.
 * This uses ARC-56 conventions for box storage with prefixes.
 *
 * Box maps are useful for:
 * - Storing large amounts of structured data
 * - Efficient key-value lookups
 * - Organizing related data with prefixes
 */

async function main() {
  console.log('=== Box Map Retrieval Example ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account with funds
  const deployer = await algorand.account.fromEnvironment('DEPLOYER', algo(10))
  console.log(`Using deployer account: ${deployer.addr}`)

  // Create an app factory instance
  const factory = algorand.client.getAppFactory({
    appSpec: appSpec as any,
    defaultSender: deployer.addr,
  })

  // Step 1: Deploy the application
  console.log('\nStep 1: Deploying application with box storage support...')
  const { result: app } = await factory.deploy({
    deployTimeParams: {
      VALUE: 1,
    },
    onUpdate: 'update',
    onSchemaBreak: 'replace',
    deletable: true,
    updatable: true,
  })

  console.log(`✓ App deployed with ID: ${app.appId}`)
  console.log(`  App address: ${app.appAddress}`)

  // Fund the app account to pay for box storage (box MBR)
  const appAddress = getApplicationAddress(app.appId)
  await algorand.send.payment({
    sender: deployer.addr,
    receiver: appAddress,
    amount: algo(0.5), // Fund app account for box storage
  })
  console.log('✓ App account funded for box storage')

  // Step 2: Create box storage using the app method
  console.log('\nStep 2: Creating box storage...')
  const appClient = factory.getAppClientById({ appId: app.appId })

  // Create a box with name "box1" and value "test data"
  await appClient.send.call({
    method: 'set_box',
    args: [new Uint8Array([1, 2, 3, 4]), 'test data'],
  })

  console.log('✓ Box created with key [1, 2, 3, 4] and value "test data"')

  // Step 3: Retrieve box values
  console.log('\nStep 3: Retrieving box values...')

  try {
    // Get all box names for the application
    const boxes = await algorand.client.algod.getApplicationBoxes(app.appId).do()

    console.log(`\n=== Box Storage Contents ===`)
    console.log(`Total boxes: ${boxes.boxes.length}`)

    if (boxes.boxes.length > 0) {
      console.log('\nBox Names:')
      for (const box of boxes.boxes) {
        const boxName = Buffer.from(box.name).toString('hex')
        console.log(`  - Box name (hex): ${boxName}`)

        // Get box value
        const boxValue = await algorand.client.algod.getApplicationBoxByName(app.appId, box.name).do()
        const value = Buffer.from(boxValue.value).toString('utf-8')
        console.log(`    Value: ${value}`)
      }
    }

    console.log('\n✅ Successfully retrieved box storage!')
  } catch (error) {
    console.error('Error retrieving boxes:', error)
  }

  // Step 4: Demonstrate box map concept
  console.log('\n=== Box Map Concept ===')
  console.log('Box maps organize data with prefixes for efficient retrieval:')
  console.log('  - Prefix "user:" for user data (e.g., "user:alice", "user:bob")')
  console.log('  - Prefix "config:" for config data (e.g., "config:fee", "config:limit")')
  console.log('  - This allows filtering and organizing related data together')

  console.log('\nKey Takeaway: Box storage provides efficient key-value storage for smart contracts.')
  console.log('Use getApplicationBoxes() to list all boxes and getApplicationBoxByName() to retrieve values.')
}

main()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
