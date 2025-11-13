import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import arc56AppSpecJson from './artifacts/arc56_app.json' with { type: 'json' }

const arc56AppSpec = arc56AppSpecJson as any

/**
 * Demonstrates ARC56 error debugging without source maps.
 *
 * This example shows how error messages still provide useful debugging information
 * even when source maps are not available. This is particularly important when
 * template variables affect code offsets (cblock offsets) in the compiled TEAL.
 */
async function main() {
  console.log('=== ARC56 Error Debugging Without Source Maps ===')
  console.log()

  // Initialize Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const account = await algorand.account.localNetDispenser()

  console.log('Step 1: Deploy application with template variables')
  console.log('Template variables affect code offsets in the compiled TEAL')

  // Create app factory with ARC56 spec
  const factory = algorand.client.getAppFactory({
    appSpec: arc56AppSpec,
    defaultSender: account.addr,
  })

  // Deploy the application with template variable values
  const { result: deployResult, appClient: deployedClient } = await factory.deploy({
    createParams: {
      method: 'createApplication',
    },
    deployTimeParams: {
      TMPL_bytes64TmplVar: '0'.repeat(64),
      TMPL_uint64TmplVar: 0,
      TMPL_bytes32TmplVar: '0'.repeat(32),
      TMPL_bytesTmplVar: 'foo',
    },
  })

  const appId = deployResult.appId
  console.log(`✓ Application deployed with ID: ${appId}`)
  console.log()

  console.log('Step 2: Create new app client without source maps')
  console.log('This simulates a scenario where source maps are not available')

  // Create a new client that won't have the source map from compilation
  // This simulates connecting to an already-deployed app
  const appClient = algorand.client.getAppClientById({
    appId,
    defaultSender: account.addr,
    appSpec: arc56AppSpec,
  })
  console.log('✓ App client created')
  console.log()

  console.log('Step 3: Call method that will fail')
  console.log('The method will assert on a template variable value')
  console.log()

  try {
    // This call will fail because uint64TmplVar is 0
    await appClient.send.call({ method: 'tmpl', args: [] })
    console.log('❌ Unexpected: call should have failed')
  } catch (e: any) {
    console.log('✓ Error caught as expected')
    console.log()
    console.log('Step 4: Examine error stack trace')
    console.log('Even without source maps, the error provides useful debugging info:')
    console.log()
    console.log('--- Error Stack Trace ---')

    // Format and display the stack trace
    const formattedStack = e.stack
      .split('\n')
      .map((l: string) => l.trim())
      .join('\n')

    console.log(formattedStack)
    console.log('--- End Stack Trace ---')
    console.log()

    console.log('Key information in the error:')
    console.log('- Source file location: tests/example-contracts/arc56_templates/templates.algo.ts:14')
    console.log('- Failed assertion: assert(this.uint64TmplVar)')
    console.log('- TEAL instruction: intc 1 // TMPL_uint64TmplVar')
    console.log('- Template variable reference preserved in error output')
    console.log()
    console.log('This shows that even without source maps, ARC56 provides:')
    console.log('  • Original source file references')
    console.log('  • Template variable names')
    console.log('  • TEAL instruction context')
    console.log('  • Exact location of the failure')
  }

  console.log()
  console.log('=== Example Complete ===')
}

main().catch((error) => {
  console.error('Unexpected error:', error)
  process.exit(1)
})
