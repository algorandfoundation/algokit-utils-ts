import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { lookupAccountCreatedApplicationByAddress } from '@algorandfoundation/algokit-utils/types/indexer-lookup'
import * as algokit from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to look up all applications created by a specific account
 * using the Algorand indexer with pagination support.
 * 
 * Use case: Discover and manage applications deployed by users or manage multi-app deployments.
 */

async function main() {
  // Initialize the AlgorandClient for LocalNet
  const algorand = AlgorandClient.testNet() // or AlgorandClient.mainNet() for production
  
  // Get the creator account (the account that will deploy apps)
  const testAccount = await algorand.account.fromEnvironment('CREATOR_ACCOUNT')
  
  // Create a second account for comparison
  const secondAccount = await algorand.account.fromEnvironment('SECOND_ACCOUNT')
  
  console.log('Creator account:', testAccount.addr)
  console.log('Second account:', secondAccount.addr)
  
  // Load your application spec (replace with your actual app spec)
  // For this example, assume you have a contract with deploy-time parameters
  const appSpec = {
    // Your app spec JSON here
    // This would typically be loaded from a JSON file:
    // const appSpec = JSON.parse(fs.readFileSync('path/to/app-spec.json', 'utf-8'))
  }
  
  // Create an app factory with deploy-time parameters
  const factory = algorand.client.getAppFactory({
    appSpec: appSpec,
    defaultSender: testAccount,
    deletable: false,
    updatable: false,
    deployTimeParams: { VALUE: 1 },
  })
  
  console.log('\nDeploying applications...')
  
  // Deploy first application with default deploy-time parameters
  const { result: app1 } = await factory.send.bare.create()
  console.log('App 1 created with ID:', app1.appId)
  
  // Deploy second application with different deploy-time parameters
  const { result: app2 } = await factory.send.bare.create({ 
    deployTimeParams: { VALUE: 2 } 
  })
  console.log('App 2 created with ID:', app2.appId)
  
  // Deploy a third application from a different account (for comparison)
  await factory.send.bare.create({ sender: secondAccount })
  console.log('App 3 created from second account')
  
  // Wait for indexer to catch up (indexer has eventual consistency)
  console.log('\nWaiting for indexer to index the transactions...')
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // Look up all applications created by the test account with pagination
  console.log('\nLooking up applications created by:', testAccount.addr)
  const apps = await lookupAccountCreatedApplicationByAddress(
    algorand.client.indexer,
    testAccount.addr,
    true, // includeAll: include deleted apps
    1     // paginationLimit: number of results per page
  )
  
  // Display the results
  console.log('\nApplications created by test account:')
  const appIds = apps.map((a) => BigInt(a.id)).sort()
  appIds.forEach((id) => {
    console.log(`  - App ID: ${id}`)
  })
  
  console.log('\nExpected app IDs:', [app1.appId, app2.appId].sort())
  console.log('Retrieved app IDs:', appIds)
  console.log('\nNote: The third app created by secondAccount should not appear in this list.')
}

main().catch(console.error)