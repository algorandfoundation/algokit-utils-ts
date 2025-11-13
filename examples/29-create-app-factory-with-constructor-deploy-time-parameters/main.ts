import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

/**
 * This example demonstrates how to configure deploy-time parameters
 * (TEAL template variables) in the factory constructor for cleaner,
 * reusable deployments.
 *
 * Deploy-time parameters let you customize your smart contract at
 * deployment without changing the TEAL code.
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('=== Create App Factory with Constructor Deploy-Time Parameters ===\n')

// Example 1: Create Factory with Pre-configured Parameters
console.log('1. Creating App Factory with Deploy-Time Parameters')
console.log('   Setting up factory with pre-configured template variables...\n')

const algorand = AlgorandClient.defaultLocalNet()

// Get account
const account = await algorand.account.fromEnvironment('ACCOUNT')
console.log(`   Using account: ${account.addr}`)

// Load the app spec
const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))

// Create factory with deploy-time parameters configured in constructor
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: account.addr,
  // Deploy-time parameters configured at factory creation
  // These will be applied to all deployments unless overridden
  deployTimeParams: {
    TMPL_UPDATABLE: 1,  // Make apps updatable by default
    TMPL_DELETABLE: 1,  // Make apps deletable by default
    TMPL_VALUE: 100,    // Custom parameter for the contract
  },
})

console.log('   Factory created with pre-configured parameters:')
console.log('     UPDATABLE: 1 (apps will be updatable)')
console.log('     DELETABLE: 1 (apps will be deletable)')
console.log('     VALUE: 100 (custom parameter)')
console.log()

// Example 2: Deploy Application Using Factory
console.log('2. Deploying Application with Factory Defaults')
console.log('   Notice: No need to specify deployTimeParams again...\n')

const app1 = await factory.send.bare.create()

console.log('   Application 1 deployed successfully!')
console.log(`   App ID: ${app1.appClient.appId}`)
console.log(`   App Address: ${app1.appClient.appAddress}`)
console.log(`   Transaction ID: ${app1.result.txIds[0]}`)
console.log()

// Verify the factory's parameters were applied
console.log('   Verifying factory parameters were applied...')
const appInfo1 = await algorand.client.algod.getApplicationByID(Number(app1.appClient.appId)).do()
const value1 = appInfo1.params.globalState?.find((s: any) => Buffer.from(s.key, 'base64').toString() === 'value')?.value?.uint || 0
console.log(`   Global state "value": ${value1}`)
console.log()

// Example 3: Factory Configuration Verification
console.log('3. Verifying Factory Configuration')
console.log('   Checking that factory settings were applied...\n')

console.log('   Factory was configured with:')
console.log('     - UPDATABLE: 1 ✓')
console.log('     - DELETABLE: 1 ✓')
console.log('     - VALUE: 100 ✓')
console.log()

console.log('   All deployments from this factory will inherit these settings.')
console.log('   This eliminates the need to repeat parameters for each deployment.')
console.log()

// Example 4: Override Factory Parameters for Specific Deployment
console.log('4. Overriding Factory Parameters for Specific Deployment')
console.log('   Deploying with custom VALUE parameter...\n')

// Deploy app with overridden TMPL_VALUE parameter
const app4 = await factory.send.bare.create({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,  // Inherited from factory
    TMPL_DELETABLE: 1,  // Inherited from factory
    TMPL_VALUE: 42, // Override just this parameter
  },
})

console.log(`   Application 4 deployed: ${app4.appClient.appId}`)
console.log('   Parameter override:')
console.log('     VALUE: 42 (overridden)')
console.log('     UPDATABLE: 1 (from factory)')
console.log('     DELETABLE: 1 (from factory)')
console.log()

// Verify the override worked
const appInfo4 = await algorand.client.algod.getApplicationByID(Number(app4.appClient.appId)).do()
const value4 = appInfo4.params.globalState?.find((s: any) => Buffer.from(s.key, 'base64').toString() === 'value')?.value?.uint || 0
console.log(`   Verified VALUE in global state: ${value4}`)
console.log()

// Example 5: Benefits of Factory Pattern
console.log('5. Benefits of Factory with Constructor Parameters')
console.log('   Understanding the advantages...\n')

console.log('   ✓ Reusability: Configure once, deploy many times')
console.log('   ✓ Consistency: All apps share the same settings')
console.log('   ✓ Flexibility: Override specific parameters when needed')
console.log('   ✓ Clean Code: No repetition of configuration')
console.log('   ✓ Error Prevention: Centralized configuration reduces mistakes')
console.log()

console.log('   Example use case:')
console.log('   You could create an "immutable factory" with UPDATABLE=0, DELETABLE=0')
console.log('   for production apps, and a "mutable factory" with UPDATABLE=1, DELETABLE=1')
console.log('   for development apps.')
console.log()

console.log('=== Summary ===')
console.log('✅ Successfully demonstrated app factory with constructor parameters!\n')

console.log('Key concepts:')
console.log('  • Factory pre-configured with deployTimeParams')
console.log('  • All deployments inherit factory configuration')
console.log('  • Individual deployments can override specific parameters')
console.log('  • Useful for deploying multiple apps with consistent settings')
console.log('  • Reduces code duplication and configuration errors')
console.log()

console.log('=== Key Takeaways ===')
console.log('• Use deployTimeParams in factory constructor for reusable configuration')
console.log('• Deploy multiple apps without repeating parameters')
console.log('• Override parameters per-deployment when needed')
console.log('• Create specialized factories (e.g., immutable factory)')
console.log('• Cleaner code with less repetition')
