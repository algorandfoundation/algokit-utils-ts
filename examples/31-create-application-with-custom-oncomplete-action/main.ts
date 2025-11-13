import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to create an Algorand application
 * with a custom OnComplete action during creation.
 *
 * OnComplete actions allow you to specify what happens when the
 * transaction completes. The default is NoOp, but you can also:
 * - OptIn: Opt into the app during creation
 * - CloseOut: Not valid for creation
 * - DeleteApplication: Not valid for creation
 * - UpdateApplication: Not valid for creation
 *
 * This example uses OptIn to combine app creation and opt-in
 * into a single transaction, saving fees and reducing complexity.
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('=== Create Application with Custom OnComplete Action ===\n')

// Example 1: Initialize AlgorandClient and Account
console.log('1. Setting Up AlgorandClient and Account')
console.log('   Connecting to LocalNet...\n')

const algorand = AlgorandClient.defaultLocalNet()

// Get a funded creator account
const creator = await algorand.account.fromEnvironment('CREATOR')
console.log(`   Creator account: ${creator.addr}`)
console.log()

// Example 2: Load Application Specification
console.log('2. Loading Application Specification')
console.log('   Reading app spec...\\n')

const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))

console.log('   App spec loaded successfully')
console.log(`   Contract name: ${appSpec.contract.name}`)
console.log()

// Example 3: Create App Factory
console.log('3. Creating App Factory')
console.log('   Getting app factory from spec...\\n')

const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: creator.addr,
})

console.log('   Factory created successfully')
console.log()

// Example 4: Create Application with OptIn OnComplete Action
console.log('4. Creating Application with OptIn OnComplete Action')
console.log('   Using OptIn to combine creation and opt-in...\\n')

// Create the application with OptIn OnComplete action
// This opts the creator into the app during creation in a single transaction
const { result, appClient } = await factory.send.bare.create({
  onComplete: algosdk.OnApplicationComplete.OptInOC,
  updatable: true,
  deletable: true,
  deployTimeParams: {
    VALUE: 1,
  },
})

console.log('   ✓ Application created with OptIn action!')
console.log(`   App ID: ${appClient.appId}`)
console.log(`   App Address: ${appClient.appAddress}`)
console.log(`   Transaction ID: ${result.txIds[0]}`)
console.log()

// Example 5: Verify OnComplete Action
console.log('5. Verifying OnComplete Action')
console.log('   Checking that OptIn was used...\\n')

// Check the OnComplete from the transaction
const onComplete = result.transactions[0].applicationCall?.onComplete

console.log('   📋 Transaction Details:')
console.log(`   OnComplete: ${onComplete === algosdk.OnApplicationComplete.OptInOC ? 'OptIn ✓' : 'Other'}`)
console.log(`   OnComplete Value: ${onComplete}`)
console.log(`   Expected Value: ${algosdk.OnApplicationComplete.OptInOC}`)
console.log()

// Example 6: Verify Account Opted In
console.log('6. Verifying Account Opted In')
console.log('   Checking that creator is opted into the app...\\n')

// Get account info to verify opt-in
const accountInfo = await algorand.client.algod.accountInformation(creator.addr).do()
const optedInApps = accountInfo.appsLocalState || []
const isOptedIn = optedInApps.some((app: any) => app.id === appClient.appId)

console.log(`   Creator opted in: ${isOptedIn ? '✓ YES' : '✗ NO'}`)
console.log(`   Total apps opted into: ${accountInfo.totalAppsOptedIn}`)
if (isOptedIn) {
  console.log()
  console.log('   The creator is now opted into the application!')
  console.log('   This happened automatically during creation using OptIn OnComplete.')
  console.log('   No separate opt-in transaction was needed!')
}
console.log()

// Example 7: Understanding OnComplete Actions
console.log('7. Understanding OnComplete Actions')
console.log('   Available OnComplete actions during creation...\\n')

console.log('   Valid for creation:')
console.log('   • NoOp (0): Default, just create the app')
console.log('   • OptIn (1): Create and opt the sender into the app')
console.log()

console.log('   Invalid for creation:')
console.log('   • CloseOut (2): Cannot close out during creation')
console.log('   • UpdateApplication (4): Cannot update during creation')
console.log('   • DeleteApplication (5): Cannot delete during creation')
console.log()

console.log('=== Summary ===')
console.log('✅ Successfully created application with OptIn OnComplete action!\n')

console.log('Key points:')
console.log('  • Used OptIn OnComplete action during creation')
console.log('  • Creator automatically opted into the app')
console.log('  • Single transaction for both creation and opt-in')
console.log('  • Saves transaction fees compared to separate transactions')
console.log('  • Useful for apps that require immediate opt-in')
console.log()

console.log('=== Key Takeaways ===')
console.log('• OnComplete actions control what happens when transaction completes')
console.log('• OptIn during creation combines two operations into one')
console.log('• Only NoOp and OptIn are valid for creation')
console.log('• Use algosdk.OnApplicationComplete enum for type safety')
console.log('• Verify opt-in status by checking account\'s apps-local-state')
