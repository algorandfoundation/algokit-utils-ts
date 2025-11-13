import algosdk from 'algosdk'
import * as algokit from '@algorandfoundation/algokit-utils'
import appSpec from './contract.json'

/**
 * This example demonstrates how to replace an existing Algorand application
 * using custom ABI methods for both the delete and create operations.
 * This allows you to pass specific arguments and capture return values
 * during the replacement process.
 */

async function replaceAppWithABI() {
  // Setup clients for LocalNet
  const algodClient = algokit.getAlgoClient(
    algokit.getAlgoNodeConfig('algod', 'localnet')
  )
  const indexer = algokit.getAlgoClient(
    algokit.getAlgoNodeConfig('indexer', 'localnet')
  )

  // Get a test account with funds
  const account = await algokit.getLocalNetDispenserAccount(algodClient)

  console.log('Account address:', account.addr)
  console.log('\n--- Step 1: Deploy initial app ---')

  // Create an app client that can find existing apps by creator and name
  const client = algokit.getAppClient(
    {
      resolveBy: 'creatorAndName',
      app: appSpec,
      sender: account,
      creatorAddress: account.addr,
      findExistingUsing: indexer,
    },
    algodClient
  )

  // Deploy the first version of the app with VALUE=1
  // allowDelete: true is required for the app to be deletable later
  const createdApp = await client.deploy({
    version: '1.0',
    deployTimeParams: {
      VALUE: 1,
    },
    allowDelete: true,
    sendParams: { populateAppCallResources: false },
  })

  console.log('Initial app created:')
  console.log('  App ID:', createdApp.appId)
  console.log('  App Address:', createdApp.appAddress)
  console.log('  Operation:', createdApp.operationPerformed)

  console.log('\n--- Step 2: Replace the app using ABI methods ---')

  // Deploy again with onUpdate: 'replace'
  // Use custom ABI methods for both delete and create operations
  const replacedApp = await client.deploy({
    version: '1.0',
    deployTimeParams: {
      VALUE: 2,
    },
    onUpdate: 'replace',
    // Custom ABI method for creating the new app
    createArgs: {
      method: 'create_abi',
      methodArgs: ['arg_io'], // Arguments passed to the create method
    },
    // Custom ABI method for deleting the old app
    deleteArgs: {
      method: 'delete_abi',
      methodArgs: ['arg2_io'], // Arguments passed to the delete method
    },
    sendParams: { populateAppCallResources: false },
  })

  console.log('App replaced with ABI methods:')
  console.log('  New App ID:', replacedApp.appId)
  console.log('  New App Address:', replacedApp.appAddress)
  console.log('  Operation:', replacedApp.operationPerformed)
  console.log('  Old App ID (deleted):', createdApp.appId)

  // Verify the replacement
  if (replacedApp.appId > createdApp.appId) {
    console.log('\n✓ Replacement successful: New app ID is greater than old app ID')
  }

  // Check return values from ABI methods
  console.log('\nABI Method Return Values:')
  if (replacedApp.return?.returnValue) {
    console.log('  Create method returned:', replacedApp.return.returnValue)
  }
  if (replacedApp.deleteReturn?.returnValue) {
    console.log('  Delete method returned:', replacedApp.deleteReturn.returnValue)
  }

  // Check delete result
  if (replacedApp.deleteResult) {
    console.log('\nDelete operation details:')
    console.log('  Deleted app ID:', replacedApp.deleteResult.transaction.applicationCall?.appIndex?.toString())
    console.log('  Transaction ID:', replacedApp.deleteResult.transaction.txID())
    console.log('  On Complete:', algosdk.OnApplicationComplete[replacedApp.deleteResult.transaction.applicationCall?.onComplete || 0])
  }

  console.log('\n--- Summary ---')
  console.log('Using ABI methods during replacement allows you to:')
  console.log('  • Pass custom arguments to create and delete operations')
  console.log('  • Capture and use return values from both operations')
  console.log('  • Execute custom cleanup logic during deletion')
  console.log('  • Initialize the new app with specific data during creation')
}

// Run the example
replaceAppWithABI().catch(console.error)
