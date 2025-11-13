import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import { getApplicationAddress } from 'algosdk'
import appSpec from './artifacts/HelloWorld.arc56.json' with { type: 'json' }

/**
 * This example demonstrates how to retrieve a specific value from box storage by key.
 * It shows how to:
 * - Create multiple boxes with different keys
 * - Retrieve a specific box value using its key
 * - Handle cases where a box doesn't exist
 *
 * This builds on box storage concepts by focusing on targeted retrieval
 * rather than listing all boxes.
 */

async function main() {
  console.log('=== Retrieve Box Value by Key Example ===\n')

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
    amount: algo(1), // Fund app account for multiple boxes
  })
  console.log('✓ App account funded for box storage')

  // Step 2: Create multiple boxes with different keys
  console.log('\nStep 2: Creating boxes with different keys...')
  const appClient = factory.getAppClientById({ appId: app.appId })

  // Note: The HelloWorld contract's set_box expects byte[4] (exactly 4 bytes)
  // So we use numeric keys encoded as 4 bytes

  // Create box with key 1 (representing user 1)
  const key1 = new Uint8Array([0, 0, 0, 1])
  await appClient.send.call({
    method: 'set_box',
    args: [key1, 'User 1: Alice, balance=100'],
  })
  console.log('✓ Box created with key [0, 0, 0, 1] for User 1')

  // Create box with key 2 (representing user 2)
  const key2 = new Uint8Array([0, 0, 0, 2])
  await appClient.send.call({
    method: 'set_box',
    args: [key2, 'User 2: Bob, balance=200'],
  })
  console.log('✓ Box created with key [0, 0, 0, 2] for User 2')

  // Create box with key 100 (representing config)
  const key100 = new Uint8Array([0, 0, 0, 100])
  await appClient.send.call({
    method: 'set_box',
    args: [key100, 'Config: fee=1000'],
  })
  console.log('✓ Box created with key [0, 0, 0, 100] for config')

  // Step 3: Retrieve specific box values by key
  console.log('\nStep 3: Retrieving box values by specific keys...')

  try {
    // Retrieve User 1's data
    console.log('\nRetrieving box with key [0, 0, 0, 1]...')
    const box1 = await algorand.client.algod.getApplicationBoxByName(app.appId, key1).do()
    const value1 = Buffer.from(box1.value).toString('utf-8')
    console.log(`  ✓ Found: ${value1}`)

    // Retrieve User 2's data
    console.log('\nRetrieving box with key [0, 0, 0, 2]...')
    const box2 = await algorand.client.algod.getApplicationBoxByName(app.appId, key2).do()
    const value2 = Buffer.from(box2.value).toString('utf-8')
    console.log(`  ✓ Found: ${value2}`)

    // Retrieve config data
    console.log('\nRetrieving box with key [0, 0, 0, 100]...')
    const box100 = await algorand.client.algod.getApplicationBoxByName(app.appId, key100).do()
    const value100 = Buffer.from(box100.value).toString('utf-8')
    console.log(`  ✓ Found: ${value100}`)

    // Try to retrieve a box that doesn't exist
    console.log('\nTrying to retrieve non-existent box with key [0, 0, 0, 99]...')
    try {
      const key99 = new Uint8Array([0, 0, 0, 99])
      await algorand.client.algod.getApplicationBoxByName(app.appId, key99).do()
      console.log('  ✗ Unexpected: Box found')
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        console.log('  ✓ Box not found (expected)')
      } else {
        throw error
      }
    }

    console.log('\n=== Summary ===')
    console.log('Successfully retrieved specific box values by key!')
    console.log('getApplicationBoxByName() allows direct access to box values without')
    console.log('listing all boxes first, making it efficient for targeted lookups.')
  } catch (error) {
    console.error('Error retrieving boxes:', error)
    throw error
  }
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
