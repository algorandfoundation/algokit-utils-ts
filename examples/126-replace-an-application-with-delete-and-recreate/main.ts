import algosdk from 'algosdk'
import * as algokit from '@algorandfoundation/algokit-utils'
import appSpec from './contract.json'

/**
 * This example demonstrates how to replace an existing Algorand application
 * by deleting it and creating a new one. This is useful when you need to make
 * schema-breaking changes that cannot be handled by a regular update.
 */

async function replaceApp() {
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
  })

  console.log('Initial app created:')
  console.log('  App ID:', createdApp.appId)
  console.log('  App Address:', createdApp.appAddress)
  console.log('  Operation:', createdApp.operationPerformed)

  console.log('\n--- Step 2: Replace the app with a new version ---')

  // Deploy again with onUpdate: 'replace'
  // This will delete the old app and create a new one with VALUE=2
  const replacedApp = await client.deploy({
    version: '1.0',
    deployTimeParams: {
      VALUE: 2,
    },
    onUpdate: 'replace',
  })

  console.log('App replaced:')
  console.log('  New App ID:', replacedApp.appId)
  console.log('  New App Address:', replacedApp.appAddress)
  console.log('  Operation:', replacedApp.operationPerformed)
  console.log('  Old App ID (deleted):', createdApp.appId)

  // Verify the replacement
  if (replacedApp.appId > createdApp.appId) {
    console.log('\n✓ Replacement successful: New app ID is greater than old app ID')
  }

  // Check delete result
  if (replacedApp.deleteResult) {
    console.log('\nDelete operation details:')
    console.log('  Deleted app ID:', replacedApp.deleteResult.transaction.applicationCall?.appIndex?.toString())
    console.log('  Transaction ID:', replacedApp.deleteResult.transaction.txID())
    console.log('  On Complete:', algosdk.OnApplicationComplete[replacedApp.deleteResult.transaction.applicationCall?.onComplete || 0])
  }

  console.log('\n--- Summary ---')
  console.log('The replace strategy is useful when:')
  console.log('  • Making schema-breaking changes (e.g., changing global/local state)')
  console.log('  • Completely redesigning app logic')
  console.log('  • Starting fresh with a new app instance')
  console.log('\nNote: The old app must have allowDelete: true for replacement to work')
}

// Run the example
replaceApp().catch(console.error)
