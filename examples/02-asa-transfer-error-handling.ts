import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates common error scenarios when transferring Algorand Standard Assets (ASAs).
 * It covers three important error cases:
 * 1. Transferring to a receiver that hasn't opted into the asset
 * 2. Transferring from a sender that hasn't opted into the asset
 * 3. Attempting to transfer a non-existent asset
 */

async function main() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get test accounts from LocalNet
  const dispenser = await algorand.account.dispenserFromEnvironment()
  const creator = algorand.account.random()

  // Fund the creator account
  await algorand.send.payment({
    sender: dispenser,
    receiver: creator.addr,
    amount: (10).algo(),
  })

  console.log('=== ASA Transfer Error Handling Examples ===')
  console.log()

  // Create a test asset
  console.log('Creating test asset...')
  const assetCreate = await algorand.send.assetCreate({
    sender: creator,
    total: 100n,
    decimals: 0,
    assetName: 'Test Asset',
    unitName: 'TEST',
  })
  const assetId = BigInt(assetCreate.confirmation.assetIndex!)
  console.log(`✓ Asset created with ID: ${assetId}`)
  console.log()

  // ========================================
  // Example 1: Transfer to non-opted-in receiver
  // ========================================
  console.log('--- Example 1: Transfer to Non-Opted-In Receiver ---')

  // Create a new receiver account that hasn't opted in
  const receiver1 = algorand.account.random()

  // Fund the receiver with initial ALGO
  await algorand.send.payment({
    sender: dispenser,
    receiver: receiver1.addr,
    amount: (1).algo(),
  })
  console.log(`Receiver account created: ${receiver1.addr}`)

  try {
    // Attempt to transfer asset to non-opted-in receiver
    // This will fail because the receiver must opt-in first
    await algorand.send.assetTransfer({
      sender: creator,
      receiver: receiver1.addr,
      assetId: assetId,
      amount: 1n,
    })

    console.log('❌ Transfer should have failed but succeeded')
  } catch (e: unknown) {
    // This error is expected - receiver must opt-in before receiving assets
    const error = e as Error
    console.log(`✓ Error caught as expected: ${error.name}`)
    console.log(`✓ Error message: ${error.message.substring(0, 100)}...`)

    if (error.message.includes('receiver error: must optin')) {
      console.log('✓ Confirmed: Receiver must opt-in before receiving assets')
    }
  }
  console.log()

  // ========================================
  // Example 2: Transfer from non-opted-in sender
  // ========================================
  console.log('--- Example 2: Transfer from Non-Opted-In Sender ---')

  // Create a new sender account that hasn't opted into the asset
  const sender2 = algorand.account.random()

  // Fund the sender with initial ALGO
  await algorand.send.payment({
    sender: dispenser,
    receiver: sender2.addr,
    amount: (1).algo(),
  })
  console.log(`Sender account created: ${sender2.addr}`)

  // Create a receiver that HAS opted in
  const receiver2 = algorand.account.random()
  await algorand.send.payment({
    sender: dispenser,
    receiver: receiver2.addr,
    amount: (1).algo(),
  })

  // Receiver opts into the asset
  await algorand.send.assetOptIn({
    sender: receiver2,
    assetId: assetId,
  })
  console.log(`✓ Receiver opted into asset ${assetId}`)

  try {
    // Attempt to transfer from a sender that hasn't opted into the asset
    // This will fail because sender doesn't have the asset
    await algorand.send.assetTransfer({
      sender: sender2,
      receiver: receiver2.addr,
      assetId: assetId,
      amount: 1n,
    })

    console.log('❌ Transfer should have failed but succeeded')
  } catch (e: unknown) {
    // This error is expected - sender must own/be opted into the asset
    const error = e as Error
    console.log(`✓ Error caught as expected: ${error.name}`)
    console.log(`✓ Error message: ${error.message.substring(0, 100)}...`)

    if (error.message.includes('balance 0 below min 1') || error.message.includes('underflow on subtracting')) {
      console.log('✓ Confirmed: Sender must have the asset balance to transfer')
    }
  }
  console.log()

  // ========================================
  // Example 3: Transfer non-existent asset
  // ========================================
  console.log('--- Example 3: Transfer Non-Existent Asset ---')

  // Create sender and receiver accounts
  const sender3 = algorand.account.random()
  const receiver3 = algorand.account.random()

  // Fund both accounts
  await algorand.send.payment({
    sender: dispenser,
    receiver: sender3.addr,
    amount: (1).algo(),
  })
  await algorand.send.payment({
    sender: dispenser,
    receiver: receiver3.addr,
    amount: (1).algo(),
  })
  console.log('Sender and receiver accounts created and funded')

  try {
    // Attempt to transfer an asset that doesn't exist (asset ID 999999)
    // This will fail because the asset ID is invalid
    const nonExistentAssetId = 999999n
    await algorand.send.assetTransfer({
      sender: sender3,
      receiver: receiver3.addr,
      assetId: nonExistentAssetId,
      amount: 5n,
    })

    console.log('❌ Transfer should have failed but succeeded')
  } catch (e: unknown) {
    // This error is expected - asset doesn't exist
    const error = e as Error
    console.log(`✓ Error caught as expected: ${error.name}`)
    console.log(`✓ Error message: ${error.message.substring(0, 100)}...`)

    if (error.message.includes('asset') && error.message.includes('missing from')) {
      console.log('✓ Confirmed: Cannot transfer non-existent assets')
    }
  }
  console.log()

  // ========================================
  // Summary
  // ========================================
  console.log('=== Summary ===')
  console.log('This example demonstrated three common ASA transfer errors:')
  console.log('1. Receiver must opt-in before receiving assets')
  console.log('2. Sender must opt-in to assets they want to transfer')
  console.log('3. Asset ID must reference an existing asset')
  console.log()
  console.log('Key Takeaways:')
  console.log('- Always ensure both sender and receiver are opted into the asset')
  console.log('- Validate asset IDs before attempting transfers')
  console.log('- Implement proper error handling in production code')
  console.log('- Use try-catch blocks to gracefully handle transfer failures')
}

main()
  .then(() => {
    console.log('\n✓ All error handling examples completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Unexpected error:', error)
    process.exit(1)
  })
