import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * This example demonstrates how to call an ABI method with explicit foreign references.
 * Foreign references allow your smart contract to interact with other apps, accounts, and assets.
 *
 * Key concepts:
 * - appReferences: Array of app IDs that the contract will reference
 * - accountReferences: Array of accounts that the contract will access
 * - assetReferences: Array of asset IDs that the contract will use
 * - populateAppCallResources: When false, you must explicitly provide all references
 */

async function callAbiWithForeignReferences() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser account for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create test accounts
  const alice = algorand.account.random()
  await algorand.account.ensureFunded(alice, dispenser, (5).algos())

  const bob = algorand.account.random()
  await algorand.account.ensureFunded(bob, dispenser, (1).algos())

  console.log('Alice address:', alice.addr)
  console.log('Bob address:', bob.addr)
  console.log()

  // Deploy the main app
  console.log('Deploying main app...')
  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: alice.addr,
  })

  const { appClient, result: createResult } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 123,
    },
  })

  const appId = BigInt(createResult.appId)
  console.log('Main app deployed with ID:', appId)
  console.log()

  // Create a second app to reference
  console.log('Deploying second app (foreign app reference)...')
  const { result: foreignAppResult } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 456,
    },
  })
  const foreignAppId = BigInt(foreignAppResult.appId)
  console.log('Foreign app deployed with ID:', foreignAppId)
  console.log()

  // Create an asset to reference
  console.log('Creating asset (foreign asset reference)...')
  const assetCreateResult = await algorand.send.assetCreate({
    sender: alice.addr,
    total: 1000n,
    decimals: 0,
    assetName: 'Test Token',
    unitName: 'TST',
  })
  const assetId = BigInt(assetCreateResult.confirmation.assetIndex!)
  console.log('Asset created with ID:', assetId)
  console.log()

  // Call ABI method with foreign references
  console.log('Calling ABI method with foreign references...')
  console.log('Foreign references:')
  console.log(`  - Foreign app ID: ${foreignAppId}`)
  console.log(`  - Foreign account: ${bob.addr}`)
  console.log(`  - Foreign asset ID: ${assetId}`)
  console.log()

  const result = await appClient.send.callAbiForeignRefs({
    args: [],
    // Explicitly specify foreign app references
    appReferences: [foreignAppId],
    // Explicitly specify foreign account references
    accountReferences: [bob.addr],
    // Explicitly specify foreign asset references
    assetReferences: [assetId],
    // Disable automatic resource population - we're providing everything explicitly
    populateAppCallResources: false,
  })

  console.log('✅ Transaction successful!')
  console.log('Transaction ID:', result.transaction.txID())
  console.log('Return value:', result.return)
  console.log()

  console.log('The contract successfully accessed foreign references:')
  console.log(`  ✓ App ID ${foreignAppId} was accessible`)
  console.log(`  ✓ Account ${bob.addr} was accessible`)
  console.log(`  ✓ Asset ID ${assetId} was accessible`)
}

// Run the example
callAbiWithForeignReferences().catch(console.error)
