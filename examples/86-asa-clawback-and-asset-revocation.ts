import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * Example: ASA Clawback and Asset Revocation
 *
 * This example demonstrates:
 * 1. Creating an asset with clawback capability
 * 2. Distributing assets to accounts
 * 3. Using clawback to revoke assets from one account and send to another
 * 4. Verifying balances throughout the process
 *
 * Clawback is essential for:
 * - Regulated assets (securities tokens)
 * - Compliance requirements
 * - Asset recovery scenarios
 * - Correcting erroneous transfers
 */

async function asaClawbackExample() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a dispenser account with funds
  const dispenser = await algorand.account.localNetDispenser()

  // Create three accounts:
  // 1. Asset creator (also the clawback address)
  // 2. Account to have assets clawed back from
  // 3. Account to receive the clawed back assets
  const creatorAccount = algorand.account.random()
  const clawbackFromAccount = algorand.account.random()
  const receiverAccount = algorand.account.random()

  // Fund all accounts
  console.log('Funding accounts...')
  await algorand.account.ensureFunded(creatorAccount, dispenser, (10).algos())
  await algorand.account.ensureFunded(clawbackFromAccount, dispenser, (1).algos())
  await algorand.account.ensureFunded(receiverAccount, dispenser, (1).algos())

  // Create an asset with clawback capability
  // The creator account is set as the clawback address
  console.log('\nCreating asset with clawback capability...')
  const assetCreate = await algorand.send.assetCreate({
    sender: creatorAccount.addr,
    total: 100n,
    decimals: 0,
    assetName: 'Regulated Asset',
    unitName: 'REG',
    clawback: creatorAccount.addr, // Enable clawback with creator as clawback address
  })
  const assetId = BigInt(assetCreate.confirmation.assetIndex!)
  console.log(`Asset created with ID: ${assetId}`)
  console.log(`Clawback address: ${creatorAccount.addr}`)

  // Both accounts must opt-in to receive the asset
  console.log('\nOpting in accounts to asset...')
  await algorand.send.assetOptIn({
    sender: clawbackFromAccount.addr,
    assetId
  })
  await algorand.send.assetOptIn({
    sender: receiverAccount.addr,
    assetId
  })
  console.log('Both accounts opted in')

  // Transfer 5 units to the clawbackFrom account
  console.log('\nTransferring 5 units to clawbackFrom account...')
  await algorand.send.assetTransfer({
    sender: creatorAccount.addr,
    receiver: clawbackFromAccount.addr,
    assetId,
    amount: 5n,
  })

  const clawbackFromInfoBefore = await algorand.asset.getAccountInformation(clawbackFromAccount.addr, assetId)
  console.log(`ClawbackFrom account balance: ${clawbackFromInfoBefore.balance} units`)

  // Now use clawback to revoke assets from clawbackFromAccount and send to receiverAccount
  console.log('\nExecuting clawback: revoking 5 units from clawbackFrom account...')
  await algorand.send.assetTransfer({
    sender: creatorAccount.addr,        // Clawback address (asset creator)
    receiver: receiverAccount.addr,     // Where the clawed back assets go
    assetId,
    amount: 5n,
    clawbackTarget: clawbackFromAccount.addr, // Account to clawback from
  })
  console.log('Clawback executed')

  // Verify final balances
  console.log('\nVerifying final balances...')
  const receiverInfo = await algorand.asset.getAccountInformation(receiverAccount.addr, assetId)
  console.log(`Receiver balance: ${receiverInfo.balance} units`)

  const clawbackFromInfo = await algorand.asset.getAccountInformation(clawbackFromAccount.addr, assetId)
  console.log(`ClawbackFrom balance: ${clawbackFromInfo.balance} units`)

  const creatorInfo = await algorand.asset.getAccountInformation(creatorAccount.addr, assetId)
  console.log(`Creator balance: ${creatorInfo.balance} units`)

  // Verify the clawback was successful
  if (receiverInfo.balance === 5n && clawbackFromInfo.balance === 0n && creatorInfo.balance === 95n) {
    console.log('\n✅ Clawback successful!')
    console.log('   - 5 units revoked from clawbackFrom account')
    console.log('   - 5 units transferred to receiver account')
    console.log('   - Creator retains 95 units')
  }
}

// Run the example
asaClawbackExample().catch(console.error)
