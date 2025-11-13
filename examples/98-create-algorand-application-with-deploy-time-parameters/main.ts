import * as algokit from '@algorandfoundation/algokit-utils'
import { getApplicationAddress } from 'algosdk'

/**
 * Demonstrates creating an Algorand application with deploy-time parameters.
 * 
 * This example shows two approaches:
 * 1. Passing deploy-time parameters in the create() method
 * 2. Passing deploy-time parameters in the client constructor
 */
async function main() {
  // Initialize AlgoKit with LocalNet
  const localnet = await algokit.getLocalNetDispenserAccount(
    algokit.getAlgoClient(),
    algokit.getAlgoIndexerClient()
  )
  const algod = algokit.getAlgoClient()
  const indexer = algokit.getAlgoIndexerClient()
  const testAccount = localnet

  // Load your app spec (replace with your actual app spec)
  // This should be imported from your contract's artifacts
  const appSpec = {
    // Your app specification here
    // Typically generated from your smart contract
  } as algokit.AppSpec

  console.log('\n=== Approach 1: Deploy-time parameters in create() method ===')
  
  // Create an app client that resolves by creator and name
  const client1 = algokit.getAppClient(
    {
      resolveBy: 'creatorAndName',
      app: appSpec,
      sender: testAccount,
      creatorAddress: testAccount.addr,
      findExistingUsing: indexer,
    },
    algod,
  )

  // Create the app with deploy-time parameters
  // Deploy-time parameters are template variables that get substituted during compilation
  const app1 = await client1.create({
    deployTimeParams: {
      // The TMPL_ prefix is automatically stripped
      TMPL_UPDATABLE: 0,  // Set if the app can be updated
      DELETABLE: 0,       // Set if the app can be deleted
      VALUE: 1,           // Custom app parameter
    },
  })

  console.log('App created successfully!')
  console.log('- App ID:', app1.appId)
  console.log('- App Address:', app1.appAddress)
  console.log('- Expected Address:', getApplicationAddress(app1.appId).toString())
  console.log('- Application Index:', app1.confirmation?.applicationIndex?.toString())
  console.log('- Compiled Approval Program:', app1.compiledApproval ? 'Present' : 'Missing')

  console.log('\n=== Approach 2: Deploy-time parameters in constructor ===')
  
  // Alternative approach: set deploy-time params in the constructor
  const client2 = algokit.getAppClient(
    {
      resolveBy: 'id',
      app: appSpec,
      sender: testAccount,
      id: 0,  // 0 means create a new app
      deployTimeParams: {
        UPDATABLE: 0,
        DELETABLE: 0,
        VALUE: 1,
      },
    },
    algod,
  )

  // Create the app without needing to pass params again
  const app2 = await client2.create()

  console.log('App created with constructor params!')
  console.log('- App ID:', app2.appId)
  console.log('- App Address:', app2.appAddress)

  console.log('\n=== Summary ===')
  console.log('Both approaches successfully created apps with deploy-time parameters.')
  console.log('Choose the approach that best fits your application architecture:')
  console.log('- Method params: Better for dynamic parameters')
  console.log('- Constructor params: Better for consistent parameters across operations')
}

main().catch(console.error)