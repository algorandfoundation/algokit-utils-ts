import { AlgorandClient } from '@algorandfoundry/algokit-utils'
import { consoleLogger } from '@algorandfoundry/algokit-utils/types/logging'
import algosdk from 'algosdk'

/**
 * This example demonstrates the fail-fast deployment strategy using onUpdate='fail'.
 * 
 * Key concepts:
 * - Deploy an initial version of an app
 * - Attempt to deploy again with onUpdate='fail'
 * - Deployment stops immediately when an existing app is detected
 * - Useful for strict CI/CD pipelines that should never update production apps
 */

async function failFastDeployment() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  algorand.setLogger(consoleLogger)

  // Get a test account with funds from LocalNet
  const sender = await algorand.account.localNet.dispenser()

  console.log('=== Initial App Deployment ===')
  
  // Define app metadata
  const metadata = {
    name: 'MyProductionApp',
    version: '1.0',
    updatable: true,
    deletable: false,
  }

  // Deploy the initial version
  const deployment1 = {
    sender: sender.addr,
    metadata: metadata,
    approvalProgram: await getApprovalProgram(1),
    clearStateProgram: await getClearProgram(),
    schema: {
      globalUints: 1,
      globalByteSlices: 0,
      localUints: 0,
      localByteSlices: 0,
    },
  }

  const result1 = await algorand.appDeployer.deploy(deployment1)

  if ('transaction' in result1) {
    console.log(`✓ Initial deployment successful`)
    console.log(`  App ID: ${result1.appId}`)
    console.log(`  Version: ${result1.version}`)
    console.log(`  Transaction ID: ${result1.transaction.txID()}`)
  }

  // Wait for indexer to catch up
  await new Promise(resolve => setTimeout(resolve, 2000))

  console.log('\n=== Attempting Deployment with onUpdate=\'fail\' ===')
  console.log('This will fail because an app with the same name already exists.\n')

  // Attempt to deploy again with onUpdate='fail'
  const deployment2 = {
    sender: sender.addr,
    metadata: metadata, // Same metadata as before
    approvalProgram: await getApprovalProgram(2), // Different code
    clearStateProgram: await getClearProgram(),
    schema: {
      globalUints: 1,
      globalByteSlices: 0,
      localUints: 0,
      localByteSlices: 0,
    },
    // Setting onUpdate='fail' means deployment will error if app exists
    onUpdate: 'fail' as const,
  }

  try {
    await algorand.appDeployer.deploy(deployment2)
    
    // We should never reach this line
    console.log('❌ ERROR: Deployment should have failed but succeeded!')
  } catch (error: any) {
    console.log('✓ Deployment failed as expected (onUpdate=\'fail\')')
    console.log(`\n=== Error Details ===')
    console.log(`Error message: ${error.message}`)
    
    // Check the specific error message
    if (error.message.includes('Update detected and onUpdate=Fail')) {
      console.log('\nThis error indicates that:')
      console.log('  - An existing app with the same metadata was found')
      console.log('  - The onUpdate parameter was set to \'fail\'')
      console.log('  - The deployment was stopped before any transaction was sent')
    }
  }

  console.log('\n=== Understanding onUpdate Strategies ===')
  console.log('\nThe onUpdate parameter controls behavior when an existing app is detected:\n')
  console.log('  • onUpdate="fail" (used here):')
  console.log('    - Immediately stops deployment with an error')
  console.log('    - No transactions are sent to the network')
  console.log('    - Use in strict production environments')
  console.log('    - Prevents accidental updates\n')
  console.log('  • onUpdate="update":')
  console.log('    - Updates the existing app with new code')
  console.log('    - Requires updatable=true in original deployment')
  console.log('    - Use for controlled app version upgrades\n')
  console.log('  • onUpdate="replace":')
  console.log('    - Deletes the old app and creates a new one')
  console.log('    - Requires deletable=true in original deployment')
  console.log('    - Use when app ID can change\n')
  console.log('  • onUpdate="append":')
  console.log('    - Creates a new app instance (doesn\'t update existing)')
  console.log('    - Use when you want multiple versions running\n')

  console.log('=== Use Cases for onUpdate="fail" ===')
  console.log('\n1. Production deployment pipelines:')
  console.log('   - Prevent accidental overwrites of production apps')
  console.log('   - Require explicit manual intervention for updates\n')
  console.log('2. Immutable deployment requirements:')
  console.log('   - Enforce that apps are never updated after initial deployment')
  console.log('   - Audit compliance scenarios\n')
  console.log('3. Testing and validation:')
  console.log('   - Ensure deployment scripts are idempotent')
  console.log('   - Catch configuration errors before they reach production')
}

/**
 * Helper function to generate approval program
 */
async function getApprovalProgram(version: number): Promise<Uint8Array> {
  const tealCode = `#pragma version 10
  txn ApplicationID
  int 0
  ==
  bnz create
  
  int 1
  return
  
  create:
  byte "version"
  int ${version}
  app_global_put
  int 1
  return`
  
  const client = algosdk.makeApplicationClient(
    algosdk.algodClient('http://localhost', 4001, 'a'.repeat(64))
  )
  const compiled = await algosdk.compileProgram(client, tealCode)
  return compiled.compiledProgram
}

/**
 * Helper function to generate clear state program
 */
async function getClearProgram(): Promise<Uint8Array> {
  const tealCode = `#pragma version 10
  int 1`
  
  const client = algosdk.makeApplicationClient(
    algosdk.algodClient('http://localhost', 4001, 'a'.repeat(64))
  )
  const compiled = await algosdk.compileProgram(client, tealCode)
  return compiled.compiledProgram
}

// Run the example
failFastDeployment().catch(console.error)