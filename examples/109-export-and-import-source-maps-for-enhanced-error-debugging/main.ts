import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'
import * as algokit from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to export and import source maps for enhanced error debugging.
 * Source maps allow you to see the original TEAL source code in stack traces when errors occur,
 * making it much easier to debug smart contract issues.
 */

async function exportAndImportSourceMaps() {
  // Initialize the AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const algod = algorand.client.algod
  const indexer = algorand.client.indexer
  
  // Get a test account with funds
  const testAccount = await algorand.account.localNet.dispenser()
  
  console.log('Deploying application...')
  
  // Deploy your application (replace with your app spec)
  // This example assumes you have an appSpec with an 'error' method
  const appClient = algorand.client.getTypedAppClient({
    sender: testAccount,
    // Your app spec here
  })
  
  await appClient.create.bare()
  const app = await appClient.appClient.getAppReference()
  
  console.log(`Application deployed with ID: ${app.appId}`)
  
  // Export the source maps from the original client
  console.log('\nExporting source maps from original client...')
  const exportedSourceMaps = appClient.exportSourceMaps()
  console.log('Source maps exported successfully')
  
  // Create a new client instance for the same app (without source maps)
  console.log('\nCreating new app client without source maps...')
  const newClient = algokit.getAppClient(
    {
      resolveBy: 'id',
      id: app.appId,
      sender: testAccount,
      // Your app spec here
    },
    algod,
  )
  
  // Try calling an error method without source maps
  console.log('\nCalling error method without source maps...')
  try {
    await newClient.call({
      method: 'error',
      methodArgs: [],
    })
  } catch (e: any) {
    console.log('Error caught (without source maps):')
    console.log('Stack trace contains:', e.stack.substring(0, 100) + '...')
    console.log('Limited debugging information available')
  }
  
  // Import the source maps into the new client
  console.log('\nImporting source maps into new client...')
  // Serialize and deserialize to simulate real-world scenario (e.g., saving to file)
  newClient.importSourceMaps(JSON.parse(JSON.stringify(exportedSourceMaps)))
  console.log('Source maps imported successfully')
  
  // Try calling the error method again with source maps
  console.log('\nCalling error method with source maps...')
  try {
    await newClient.call({
      method: 'error',
      methodArgs: [],
    })
  } catch (e: any) {
    console.log('\nError caught (with source maps):')
    console.log('Enhanced stack trace:')
    console.log(e.stack)
    console.log('\nError details:')
    console.log(`  Program Counter: ${e.led.pc}`)
    console.log(`  Message: ${e.led.msg}`)
    console.log(`  Transaction ID: ${e.led.txId}`)
    console.log('\nWith source maps, you can see exactly where the error occurred in your TEAL code!')
  }
  
  console.log('\n✅ Source map export and import demonstration complete')
  console.log('\nKey takeaways:')
  console.log('- Export source maps after deployment to preserve debugging information')
  console.log('- Import source maps into new client instances for enhanced error messages')
  console.log('- Source maps show the exact TEAL code location where errors occur')
  console.log('- This is especially useful when debugging production applications')
}

exportAndImportSourceMaps().catch(console.error)