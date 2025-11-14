import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory, TestingAppClient } from './artifacts/TestingApp/client'

/**
 * This example demonstrates how to export and import source maps for debugging.
 *
 * Source maps provide the mapping between compiled TEAL bytecode and the original
 * source code. They enable:
 * - Enhanced error messages with source code context
 * - TEAL stack traces showing exactly where errors occurred
 * - Sharing debugging information between client instances
 * - Preserving source maps across serialization/deserialization
 *
 * Key concepts:
 * - Exporting source maps from an app client
 * - Serializing source maps (e.g., saving to file or sending over network)
 * - Importing source maps into a new client instance
 * - Comparing error messages with and without source maps
 */

async function demonstrateSourceMaps() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a test account
  const testAccount = algorand.account.random()
  await algorand.account.ensureFunded(testAccount, dispenser, (5).algos())

  console.log('Test account address:', testAccount.addr.toString())
  console.log()

  console.log('=== Deploying Application with Source Maps ===')
  console.log()

  // Deploy the TestingApp which has an error() method that always fails
  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: testAccount.addr,
  })

  const { appClient: originalClient } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 100,
    },
  })

  console.log('✅ App deployed successfully!')
  console.log('App ID:', originalClient.appId)
  console.log()

  console.log('=== Exporting Source Maps ===')
  console.log()
  console.log('Source maps contain the mapping from bytecode to source code.')
  console.log('They enable detailed error messages with TEAL source context.')
  console.log()

  // Export source maps from the original client
  // This captures the mapping between bytecode positions and source code
  // Access through the underlying appClient property
  const sourceMaps = originalClient.appClient.exportSourceMaps()

  console.log('✅ Source maps exported successfully')
  console.log('Source map data size:', JSON.stringify(sourceMaps).length, 'bytes')
  console.log()

  console.log('Source maps can be:')
  console.log('  • Saved to a file for later use')
  console.log('  • Sent over a network to another service')
  console.log('  • Stored in a database')
  console.log('  • Shared between different client instances')
  console.log()

  // Simulate serialization/deserialization (e.g., saving to file and reading back)
  console.log('=== Simulating Serialization ===')
  console.log()
  console.log('Serializing source maps to JSON...')
  const serializedSourceMaps = JSON.stringify(sourceMaps)
  console.log('Serialized size:', serializedSourceMaps.length, 'bytes')
  console.log()

  console.log('Deserializing source maps from JSON...')
  const deserializedSourceMaps = JSON.parse(serializedSourceMaps)
  console.log('✅ Source maps successfully serialized and deserialized')
  console.log()

  console.log('=== Creating New Client Without Source Maps ===')
  console.log()
  console.log('This simulates a fresh client instance that does not have source maps.')
  console.log()

  // Create a new client instance without source maps
  // This simulates a fresh client or a different context (e.g., different service)
  // We create a new TestingAppClient pointing to the same app ID
  const newClient = new TestingAppClient({
    algorand: algorand,
    appId: originalClient.appId,
    defaultSender: testAccount.addr,
  })

  console.log('✅ New client created (without source maps)')
  console.log()

  console.log('=== Comparing Errors: Without Source Maps ===')
  console.log()
  console.log('Attempting to trigger an error WITHOUT source maps imported...')
  console.log()

  try {
    // Call the error() method which intentionally fails
    await newClient.send.error({ args: [] })

    // This line should never be reached
    console.log('❌ ERROR: Method should have failed but succeeded!')
  } catch (error: any) {
    console.log('✅ Error caught (as expected)')
    console.log()
    console.log('Error message WITHOUT source maps:')
    console.log('─────────────────────────────────────────')
    console.log(error.message.split('\n')[0]) // Show first line only
    console.log('─────────────────────────────────────────')
    console.log()
    console.log('Note: Error message is still enhanced by AlgoKit Utils,')
    console.log('      but would be even better with explicit source maps.')
    console.log()
  }

  console.log('=== Importing Source Maps into New Client ===')
  console.log()
  console.log('Now importing the source maps we exported earlier...')
  console.log()

  // Import the deserialized source maps into the new client
  // Access through the underlying appClient property
  newClient.appClient.importSourceMaps(deserializedSourceMaps)

  console.log('✅ Source maps imported successfully')
  console.log()

  console.log('=== Comparing Errors: With Source Maps ===')
  console.log()
  console.log('Attempting to trigger the same error WITH source maps imported...')
  console.log()

  try {
    // Call the error() method again, now with source maps
    await newClient.send.error({ args: [] })

    // This line should never be reached
    console.log('❌ ERROR: Method should have failed but succeeded!')
  } catch (error: any) {
    console.log('✅ Error caught (as expected)')
    console.log()
    console.log('Error message WITH source maps:')
    console.log('─────────────────────────────────────────')
    console.log(error.message.split('\n')[0]) // Show first line only
    console.log('─────────────────────────────────────────')
    console.log()

    // Show TEAL stack trace if available
    if (error.stack && error.stack.includes('<--- Error')) {
      console.log('TEAL Stack Trace:')
      console.log('─────────────────────────────────────────')

      // Extract the relevant part of the stack trace
      const stackLines = error.stack.split('\n')
      const errorLineIndex = stackLines.findIndex((line: string) => line.includes('<--- Error'))

      if (errorLineIndex !== -1) {
        // Show 3 lines before, the error line, and 3 lines after
        const startIndex = Math.max(0, errorLineIndex - 3)
        const endIndex = Math.min(stackLines.length, errorLineIndex + 4)
        const contextLines = stackLines.slice(startIndex, endIndex)

        console.log(contextLines.join('\n'))
      }
      console.log('─────────────────────────────────────────')
      console.log()
      console.log('✨ Notice the "<--- Error" marker showing exactly where the failure occurred!')
      console.log()
    }

    console.log('With source maps imported, errors include:')
    console.log('  • TEAL source code context')
    console.log('  • Exact line where the error occurred (marked with "<--- Error")')
    console.log('  • Program counter (PC) and bytecode information')
    console.log('  • Human-readable error messages')
    console.log()
  }

  console.log('=== Understanding Source Maps ===')
  console.log()

  console.log('What are source maps?')
  console.log('  • A mapping from compiled bytecode positions to source code lines')
  console.log('  • Generated during TEAL compilation')
  console.log('  • Included in the app client automatically after deployment')
  console.log()

  console.log('Why export/import source maps?')
  console.log('  • Share debugging info between services')
  console.log('  • Preserve source maps across client restarts')
  console.log('  • Debug production issues without redeploying')
  console.log('  • Enable better error reporting in production')
  console.log()

  console.log('When to use source map export/import?')
  console.log('  ✅ Backend services that need to debug contract errors')
  console.log('  ✅ Error monitoring/logging systems')
  console.log('  ✅ CI/CD pipelines that deploy and test contracts')
  console.log('  ✅ Production environments with centralized error tracking')
  console.log()

  console.log('=== Example Completed Successfully ===')
  console.log()

  console.log('Key Takeaways:')
  console.log('  • Use appClient.exportSourceMaps() to extract source maps')
  console.log('  • Source maps can be serialized with JSON.stringify()')
  console.log('  • Use appClient.importSourceMaps() to load source maps')
  console.log('  • Source maps enable detailed TEAL stack traces with error markers')
  console.log('  • This is invaluable for debugging smart contract issues')
}

// Run the example
demonstrateSourceMaps().catch(console.error)
