import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

/**
 * This example demonstrates how to construct an application call transaction
 * that includes box storage references. Box references are required when
 * your smart contract needs to access box storage during execution.
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function constructTransactionWithBoxes() {
  console.log('=== Construct Application Call Transaction with Box References ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account from the LocalNet dispenser
  const testAccount = await algorand.account.fromEnvironment('LOCALNET')
  console.log(`1. Using account: ${testAccount.addr}\n`)

  // Load the testing app spec
  const appSpec = JSON.parse(
    readFileSync(join(__dirname, 'artifacts', 'application.json'), 'utf-8'),
  )

  // Step 1: Create and deploy the app
  console.log('2. Creating app...')
  const appFactory = algorand.client.getAppFactory({
    appSpec: appSpec,
    defaultSender: testAccount.addr,
  })

  const { appClient } = await appFactory.send.bare.create({
    deployTimeParams: {
      UPDATABLE: 0,
      DELETABLE: 0,
      VALUE: 1,
    },
  })

  console.log(`  ✓ App created with ID: ${appClient.appId}`)
  console.log()

  // Step 2: Send a call with box references
  console.log('3. Calling method with box references...')

  /**
   * Box references tell the application which boxes it can access during execution.
   * - appId: 0 refers to the current application (the one being called)
   * - name: The name of the box to reference (string or Uint8Array)
   */
  const call = await appClient.send.call({
    method: 'call_abi',
    args: ['test'],
    boxReferences: [
      {
        appId: appClient.appId,  // Reference the current app
        name: 'box1'             // Box name as string
      },
      {
        appId: appClient.appId,
        name: 'box2'             // You can reference multiple boxes
      }
    ],
  })

  console.log('  ✓ Transaction sent successfully')
  console.log(`  ✓ Transaction ID: ${call.transaction.txID()}`)
  console.log()

  // Step 3: Explain box references
  console.log('  Box references included in transaction:')
  console.log(`    Box 1:`)
  console.log(`      appId: ${appClient.appId}`)
  console.log(`      name: "box1"`)
  console.log(`    Box 2:`)
  console.log(`      appId: ${appClient.appId}`)
  console.log(`      name: "box2"`)
  console.log()

  // Step 4: Demonstrate different box reference formats
  console.log('4. Box reference formats:')
  console.log('  You can specify box names as:')
  console.log('    • Strings: { appId: 0, name: "myBox" }')
  console.log('    • Uint8Array: { appId: 0, name: new TextEncoder().encode("myBox") }')
  console.log('    • Reference boxes from other apps: { appId: 123, name: "box" }')
  console.log()

  console.log('=== Summary ===')
  console.log('✅ Successfully demonstrated box reference construction!')
  console.log()
  console.log('Key points:')
  console.log('  • Box references are required when contracts access box storage')
  console.log('  • Specify boxes using the boxReferences parameter')
  console.log('  • You can reference multiple boxes in a single transaction')
  console.log('  • Box names can be strings or Uint8Array')
  console.log('  • Box references tell the AVM which boxes can be accessed')
  console.log()
  console.log('=== Key Takeaways ===')
  console.log('• Use boxReferences parameter to specify box storage access')
  console.log('• Provide appId and name for each box reference')
  console.log('• Multiple boxes can be referenced in one transaction')
  console.log('• Box references are essential for box storage operations')
}

// Run the example
constructTransactionWithBoxes().catch(console.error)
