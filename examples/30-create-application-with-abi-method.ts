import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import appSpecJson from './artifacts/TestingApp.json'

/**
 * This example demonstrates how to create an Algorand application
 * using an ABI method for initialization.
 *
 * Benefits of using ABI methods for app creation:
 * - Custom initialization logic in the smart contract
 * - Pass parameters during creation
 * - Receive return values from the creation method
 * - Type-safe method calls with the ABI
 *
 * This approach is more flexible than bare application creation
 * when you need to set up state or perform logic during deployment.
 */


console.log('=== Create Application with ABI Method ===\n')

// Example 1: Initialize AlgorandClient and Account
console.log('1. Setting Up AlgorandClient and Account')
console.log('   Connecting to LocalNet...\n')

const algorand = AlgorandClient.defaultLocalNet()

// Get a funded deployer account
const deployer = await algorand.account.fromEnvironment('DEPLOYER')
console.log(`   Deployer account: ${deployer.addr}`)
console.log()

// Example 2: Load Application Specification
console.log('2. Loading Application Specification')
console.log('   Reading app spec with create_abi method...\n')


const appSpec = appSpecJson as AppSpec

console.log('   App spec loaded successfully')
console.log(`   Contract name: ${appSpec.contract.name}`)
console.log(`   Methods available: ${appSpec.contract.methods.length}`)
console.log()

// Example 3: Create App Factory
console.log('3. Creating App Factory')
console.log('   Getting app factory from spec...\n')

const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: deployer.addr,
})

console.log('   Factory created successfully')
console.log()

// Example 4: Deploy Application with ABI Create Method
console.log('4. Deploying Application with ABI Create Method')
console.log('   Calling create_abi method during deployment...\n')

// Create the application using an ABI method
// This calls the 'create_abi' method defined in the smart contract
const { result, appClient } = await factory.send.create({
  method: 'create_abi',
  args: ['initialization_value'],
  deployTimeParams: {
    TMPL_UPDATABLE: 1,  // Make app updatable
    TMPL_DELETABLE: 1,  // Make app deletable
    TMPL_VALUE: 100,    // Custom value
  },
})

console.log('   ✓ Application created successfully!')
console.log(`   App ID: ${appClient.appId}`)
console.log(`   App Address: ${appClient.appAddress}`)
console.log(`   Transaction ID: ${result.txIds[0]}`)
console.log()

// Example 5: Access Return Value from ABI Method
console.log('5. Accessing Return Value from Create Method')
console.log('   Inspecting the value returned by create_abi...\n')

if (result.return) {
  console.log('   📤 Method Return Value:')
  console.log(`   Type: ${typeof result.return}`)
  console.log(`   Value: "${result.return}"`)
  console.log()

  // Verify the return value matches what we sent
  if (result.return === 'initialization_value') {
    console.log('   ✓ Return value matches input!')
    console.log('   The create_abi method echoed back our initialization value.')
  }
}
console.log()

// Example 6: Inspect Transaction Details
console.log('6. Inspecting Transaction Details')
console.log('   Reviewing the creation transaction...\n')

console.log('   📋 Transaction Details:')
console.log(`   Transaction ID: ${result.txIds[0]}`)
console.log(`   Confirmed Round: ${result.confirmations?.[0]?.confirmedRound}`)
console.log(`   Sender: ${deployer.addr}`)
console.log()

// Example 7: Using App Client for Future Interactions
console.log('7. Using the App Client')
console.log('   The factory returns an app client ready to use...\n')

console.log('   App Client Properties:')
console.log(`   App ID: ${appClient.appId}`)
console.log(`   App Address: ${appClient.appAddress}`)
console.log(`   Ready for method calls: ✓`)
console.log()

console.log('   You can now use appClient.send to call other methods:')
console.log('   - appClient.send.call({ method: "call_abi", args: [...] })')
console.log('   - appClient.send.update({ method: "update_abi", args: [...] })')
console.log('   - appClient.send.delete({ method: "delete_abi", args: [...] })')
console.log()

console.log('=== Summary ===')
console.log('✅ Successfully created application with ABI method!\n')

console.log('Key points:')
console.log('  • Used create_abi method for custom initialization')
console.log('  • Passed arguments during creation ("initialization_value")')
console.log('  • Received and verified return value')
console.log('  • Obtained ready-to-use app client')
console.log('  • ABI methods provide type-safe, flexible deployment')
console.log()

console.log('=== Key Takeaways ===')
console.log('• ABI create methods allow custom initialization logic')
console.log('• Pass parameters to setup your app during deployment')
console.log('• Return values confirm successful initialization')
console.log('• More flexible than bare app creation')
console.log('• Factory returns appClient ready for further interactions')
