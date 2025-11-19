import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import appSpecJson from './artifacts/TestingApp.json'

/**
 * This example demonstrates how to construct transactions with box references
 * without immediately executing them. This is useful when you need to inspect
 * or modify transactions before sending, or when building complex transaction groups.
 */

async function constructTransactionWithBoxes() {
  console.log('=== Construct Transaction with Box References ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account from the LocalNet dispenser
  const testAccount = await algorand.account.fromEnvironment('LOCALNET')
  console.log(`1. Using account: ${testAccount.addr}\n`)

  // Load the testing app spec
  const appSpec = appSpecJson as AppSpec

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

  // Step 2: Method 1 - Explicit Box Reference Format
  console.log('3. Method 1: Explicit Box Reference Format')
  console.log('   Constructing transaction with explicit box references...')

  /**
   * Explicit format: Specify both appId and name
   * - appId: The application that owns the box (use appClient.appId for current app)
   * - name: The box name as a string or Uint8Array
   */
  const transactionWithExplicitBoxRef = await appClient.createTransaction.call({
    method: 'call_abi',
    args: ['test'],
    boxReferences: [
      {
        appId: appClient.appId,  // Explicit appId for current app
        name: 'box1'              // Box name as string
      }
    ],
  })

  console.log('  ✓ Transaction constructed successfully')
  console.log()

  // Inspect the constructed transaction
  console.log('  Transaction details:')
  console.log(`    App ID: ${appClient.appId}`)
  console.log(`    Method: call_abi`)
  console.log(`    Box references: Explicit format with appId and name`)
  console.log(`      Format: { appId: ${appClient.appId}, name: 'box1' }`)
  console.log()

  // Step 3: Method 2 - Shorthand Box Reference Format
  console.log('4. Method 2: Shorthand Box Reference Format')
  console.log('   Constructing transaction with shorthand box references...')

  /**
   * Shorthand format: Just provide the box name as a string
   * This automatically assumes the current application (appClient.appId)
   */
  const transactionWithShorthandBoxRef = await appClient.createTransaction.call({
    method: 'call_abi',
    args: ['test'],
    boxReferences: ['box1'],  // Shorthand: just the box name
  })

  console.log('  ✓ Transaction constructed successfully')
  console.log()

  console.log('  Transaction details:')
  console.log(`    App ID: ${appClient.appId}`)
  console.log(`    Method: call_abi`)
  console.log(`    Box references: Shorthand format (name only)`)
  console.log(`      Format: 'box1'`)
  console.log()

  // Step 4: Demonstrate multiple box references
  console.log('5. Multiple Box References')
  console.log('   Constructing transaction with multiple boxes...')

  const transactionWithMultipleBoxes = await appClient.createTransaction.call({
    method: 'call_abi',
    args: ['test'],
    boxReferences: [
      { appId: appClient.appId, name: 'box1' },
      { appId: appClient.appId, name: 'box2' },
      'box3',  // Mixing explicit and shorthand formats
    ],
  })

  console.log('  ✓ Transaction constructed successfully')
  console.log()

  console.log('  Transaction details:')
  console.log(`    App ID: ${appClient.appId}`)
  console.log(`    Method: call_abi`)
  console.log(`    Box references: 3 boxes`)
  console.log(`      Box 1: { appId: ${appClient.appId}, name: 'box1' } (explicit)`)
  console.log(`      Box 2: { appId: ${appClient.appId}, name: 'box2' } (explicit)`)
  console.log(`      Box 3: 'box3' (shorthand)`)
  console.log()

  // Step 5: Compare formats
  console.log('6. Box Reference Format Comparison')
  console.log()
  console.log('  Explicit format:')
  console.log('    boxReferences: [{ appId: 1234, name: "myBox" }]')
  console.log('    • Use when: Referencing boxes from specific apps')
  console.log('    • Advantage: Full control over which app owns the box')
  console.log()
  console.log('  Shorthand format:')
  console.log('    boxReferences: ["myBox"]')
  console.log('    • Use when: Referencing boxes in the current app')
  console.log('    • Advantage: More concise and readable')
  console.log()
  console.log('  You can mix both formats in the same transaction!')
  console.log()

  console.log('=== Summary ===')
  console.log('✅ Successfully demonstrated transaction construction with box references!')
  console.log()
  console.log('Key points:')
  console.log('  • createTransaction.call() constructs without executing')
  console.log('  • Explicit format: { appId, name } for full control')
  console.log('  • Shorthand format: just the name string for current app')
  console.log('  • Both formats can be mixed in the same transaction')
  console.log('  • Multiple box references can be included')
  console.log('  • Use send.call() when ready to execute the transaction')
  console.log()
  console.log('=== Key Takeaways ===')
  console.log('• Use createTransaction.call() to construct without sending')
  console.log('• Explicit format gives full control over appId and name')
  console.log('• Shorthand format is convenient for current app boxes')
  console.log('• Inspect constructed transactions before sending')
  console.log('• Use send.call() when ready to execute the transaction')
}

// Run the example
constructTransactionWithBoxes().catch(console.error)
