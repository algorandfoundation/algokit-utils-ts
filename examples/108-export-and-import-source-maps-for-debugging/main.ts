import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to export and import source maps for better error debugging.
 * 
 * Source maps allow you to:
 * - See the exact TEAL source code that caused an error
 * - Get meaningful stack traces with source context
 * - Share debugging information between client instances
 * - Preserve source maps across serialization/deserialization
 * 
 * Without source maps, errors show generic messages like "assert failed pc=885"
 * With source maps, you see the actual source code line that caused the error
 */

async function demonstrateSourceMaps() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get or create a test account
  const testAccount = await algorand.account.fromEnvironment('TEST_ACCOUNT')
  
  console.log('Test account address:', testAccount.addr)
  
  // Deploy or get an existing app client
  // This should be a contract with source maps included
  const appId = 123n // Replace with your deployed app ID
  const appSpec = {} // Replace with your app spec
  
  const originalClient = algorand.client.getAppClientById({
    appId: appId,
    defaultSender: testAccount.addr,
    appSpec: appSpec,
  })
  
  console.log('\n📦 Exporting source maps from original client...')
  
  // Export source maps from the original client
  // This contains the mapping from bytecode to source code
  const sourceMaps = originalClient.exportSourceMaps()
  
  console.log('✅ Source maps exported successfully')
  console.log('Source map data size:', JSON.stringify(sourceMaps).length, 'bytes')
  
  // Create a new client instance (simulating a fresh client or different context)
  console.log('\n🔧 Creating new client instance without source maps...')
  
  const newClient = algorand.client.getAppClientById({
    appId: appId,
    defaultSender: testAccount.addr,
    appSpec: appSpec,
  })
  
  // First, try calling an error method WITHOUT source maps imported
  console.log('\n❌ Attempting to trigger error WITHOUT source maps...')
  try {
    await newClient.send.call({
      method: 'error', // This method intentionally fails
    })
  } catch (error: any) {
    console.log('\nError caught (without source maps):')
    console.log('  Message:', error.message || 'Unknown error')
    console.log('  Stack trace:', error.stack ? 'Generic - contains "assert failed"' : 'No stack')
    // Without source maps, the error is less helpful
  }
  
  // Now import the source maps into the new client
  console.log('\n📥 Importing source maps into new client...')
  
  // Source maps can be serialized and deserialized (e.g., saved to file, sent over network)
  const serializedSourceMaps = JSON.parse(JSON.stringify(sourceMaps))
  newClient.importSourceMaps(serializedSourceMaps)
  
  console.log('✅ Source maps imported successfully')
  
  // Now try the same error WITH source maps imported
  console.log('\n❌ Attempting to trigger error WITH source maps...')
  try {
    await newClient.send.call({
      method: 'error', // This method intentionally fails
    })
  } catch (error: any) {
    console.log('\nError caught (with source maps):')
    console.log('  Message:', error.message || 'Unknown error')
    
    // With source maps, we get detailed error information
    if (error.led) {
      console.log('\n📍 Error Details:')
      console.log('  Program Counter (PC):', error.led.pc)
      console.log('  Transaction ID:', error.led.txId)
      console.log('  Error Message:', error.led.msg)
      
      if (error.led.traces && error.led.traces.length > 0) {
        console.log('  Number of traces:', error.led.traces.length)
      }
    }
    
    // The stack trace now includes source code context
    if (error.stack) {
      console.log('\n📄 Stack Trace with Source Context:')
      console.log(error.stack)
      console.log('\n✨ Notice the source code context with "<--- Error" marker!')
    }
  }
  
  console.log('\n💡 Key Takeaways:')
  console.log('  - Source maps can be exported and imported between client instances')
  console.log('  - They can be serialized (e.g., saved to file or sent over network)')
  console.log('  - Importing source maps provides much better error messages')
  console.log('  - Error messages include exact TEAL source code and line numbers')
  console.log('  - This is invaluable for debugging smart contract issues')
}

// Run the example
demonstratSourceMaps()
  .then(() => {
    console.log('\n✨ Example completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Example failed:', error)
    process.exit(1)
  })