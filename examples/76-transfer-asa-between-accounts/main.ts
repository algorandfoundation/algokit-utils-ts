import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

/**
 * Example: Transfer Algorand Standard Assets (ASAs) Between Accounts
 * 
 * This example demonstrates:
 * 1. Creating a test asset
 * 2. Opting in a recipient account to receive the asset
 * 3. Transferring assets from one account to another
 * 4. Verifying balances after the transfer
 */

async function transferAsaExample() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get a dispenser account with funds
  const dispenser = await algorand.account.localNetDispenser()
  
  // Create two accounts: sender and receiver
  const senderAccount = await algorand.account.random()
  const receiverAccount = await algorand.account.random()

  // Fund both accounts with initial ALGOs
  console.log('Funding accounts...')
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: senderAccount.addr,
    amount: algo(10),
  })
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: receiverAccount.addr,
    amount: algo(1),
  })
  console.log('✓ Accounts funded')
  
  // Create a test asset (ASA) with 100 units
  console.log('\nCreating test asset...')
  const assetCreate = await algorand.send.assetCreate({
    sender: senderAccount.addr,
    total: 100n,
    decimals: 0,
    assetName: 'Test Asset',
    unitName: 'TEST',
  })
  const assetId = BigInt(assetCreate.confirmation.assetIndex!)
  console.log(`✓ Asset created with ID: ${assetId}`)
  
  // Step 1: Receiver must opt-in to receive the asset
  console.log('\nOpting in receiver account to asset...')
  await algorand.send.assetOptIn({
    sender: receiverAccount.addr,
    assetId
  })
  console.log('✓ Receiver successfully opted in')
  
  // Step 2: Transfer 5 units of the asset from sender to receiver
  console.log('\nTransferring 5 units of asset...')
  await algorand.send.assetTransfer({
    sender: senderAccount.addr,
    receiver: receiverAccount.addr,
    assetId,
    amount: 5n,
    note: `Transfer 5 assets with id ${assetId}`,
  })
  console.log('✓ Transfer complete')

  // Step 3: Verify the balances
  console.log('\nVerifying balances...')
  const receiverInfo = await algorand.asset.getAccountInformation(receiverAccount.addr, assetId)
  console.log(`  Receiver balance: ${receiverInfo.balance} units`)

  const senderInfo = await algorand.asset.getAccountInformation(senderAccount.addr, assetId)
  console.log(`  Sender balance: ${senderInfo.balance} units`)
  
  // Verify the transfer was successful
  if (receiverInfo.balance === 5n && senderInfo.balance === 95n) {
    console.log('\n✅ Asset transfer successful!')
    console.log('   - Receiver has 5 units')
    console.log('   - Sender has 95 units remaining')
  }
}

// Run the example
transferAsaExample()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })