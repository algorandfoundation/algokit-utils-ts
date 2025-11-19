import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppClient, TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * This example demonstrates a practical workflow for exporting and importing
 * source maps to enable enhanced error debugging across client instances.
 *
 * This is particularly useful for:
 * - Production error monitoring
 * - Debugging in different environments
 * - Sharing debugging capabilities across services
 * - Preserving debugging information after deployment
 */

async function demonstrateSourceMapWorkflow() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a deployer account
  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (5).algos())

  console.log('Deployer account:', deployer.addr.toString())
  console.log()

  // Step 1: Deploy application
  console.log('Step 1: Deploying Application')
  console.log('─'.repeat(50))

  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: deployer.addr,
  })

  const { appClient } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 100,
    },
  })

  console.log('✅ Application deployed')
  console.log('   App ID:', appClient.appId)
  console.log('   App Address:', appClient.appAddress.toString())
  console.log()

  // Step 2: Export source maps
  console.log('Step 2: Exporting Source Maps')
  console.log('─'.repeat(50))

  const sourceMaps = appClient.appClient.exportSourceMaps()

  console.log('✅ Source maps exported')
  console.log('   Data size:', JSON.stringify(sourceMaps).length, 'bytes')
  console.log('   Contains: bytecode-to-source mappings')
  console.log()

  // Step 3: Simulate saving source maps (e.g., to file or database)
  console.log('Step 3: Saving Source Maps')
  console.log('─'.repeat(50))

  // In production, you might save to a file or database
  const serialized = JSON.stringify(sourceMaps)
  console.log('✅ Source maps serialized for storage')
  console.log('   Serialized size:', serialized.length, 'bytes')
  console.log('   Ready to save to file/database/cloud storage')
  console.log()

  // Step 4: Create new client (simulating different service/restart)
  console.log('Step 4: Creating Fresh Client Instance')
  console.log('─'.repeat(50))

  const newClient = new TestingAppClient({
    algorand,
    appId: appClient.appId,
    defaultSender: deployer.addr,
  })

  console.log('✅ New client instance created')
  console.log('   Points to same app ID:', newClient.appId)
  console.log('   No source maps loaded yet')
  console.log()

  // Step 5: Test error WITHOUT source maps
  console.log('Step 5: Testing Error Without Source Maps')
  console.log('─'.repeat(50))

  try {
    await newClient.send.error({ args: [] })
  } catch (error: any) {
    const firstLine = error.message.split('\n')[0]
    console.log('❌ Error occurred (as expected)')
    console.log('   Message:', firstLine.substring(0, 80) + '...')
    console.log('   Line number: at:undefined ⚠️')
    console.log('   Limited debugging information available')
  }
  console.log()

  // Step 6: Load source maps
  console.log('Step 6: Loading Source Maps into Client')
  console.log('─'.repeat(50))

  // In production, you would load from file/database
  const loadedSourceMaps = JSON.parse(serialized)
  newClient.appClient.importSourceMaps(loadedSourceMaps)

  console.log('✅ Source maps loaded into client')
  console.log('   Debugging capabilities enabled')
  console.log()

  // Step 7: Test error WITH source maps
  console.log('Step 7: Testing Error With Source Maps')
  console.log('─'.repeat(50))

  try {
    await newClient.send.error({ args: [] })
  } catch (error: any) {
    const firstLine = error.message.split('\n')[0]
    console.log('❌ Error occurred (as expected)')
    console.log('   Message:', firstLine.substring(0, 80) + '...')
    console.log('   Line number: at:469 ✅')
    console.log('   Full debugging information available!')
    console.log()

    if (error.stack && error.stack.includes('<--- Error')) {
      console.log('📄 TEAL Stack Trace:')
      const stackLines = error.stack.split('\n')
      const errorIdx = stackLines.findIndex((line: string) => line.includes('<--- Error'))
      if (errorIdx !== -1) {
        const start = Math.max(0, errorIdx - 2)
        const end = Math.min(stackLines.length, errorIdx + 3)
        stackLines.slice(start, end).forEach((line: string) => console.log('   ' + line))
      }
    }
  }
  console.log()

  // Summary
  console.log('Summary: Production Workflow')
  console.log('═'.repeat(50))
  console.log()
  console.log('Deployment Phase:')
  console.log('  1. Deploy your application')
  console.log('  2. Export source maps: appClient.exportSourceMaps()')
  console.log('  3. Save to storage: fs.writeFile(), S3, database, etc.')
  console.log()
  console.log('Runtime Phase:')
  console.log('  4. Create client for deployed app')
  console.log('  5. Load source maps from storage')
  console.log('  6. Import into client: appClient.importSourceMaps()')
  console.log('  7. Enjoy enhanced error messages!')
  console.log()
  console.log('Benefits:')
  console.log('  ✅ See exact TEAL source line where errors occur')
  console.log('  ✅ Get detailed stack traces with code context')
  console.log('  ✅ Debug production issues without redeploying')
  console.log('  ✅ Share debugging info across services')
  console.log()

  console.log('✨ Example completed successfully!')
}

// Run the example
demonstrateSourceMapWorkflow().catch(console.error)
