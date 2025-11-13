import { AlgorandClient } from '@algorandfoundry/algokit-utils'
import { consoleLogger } from '@algorandfoundry/algokit-utils/types/logging'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to update an existing updatable application.
 * 
 * Key concepts:
 * - Deploy an initial version of an updatable app
 * - Deploy an update with new code and version metadata
 * - The same app ID is maintained across updates
 * - Using onUpdate='update' to perform the update operation
 */

async function updateDeployedApp() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  algorand.setLogger(consoleLogger)

  // Get a test account with funds from LocalNet
  const sender = await algorand.account.localNet.dispenser()

  console.log('=== Deploying Initial Version of Updatable App ===')
  
  // Define initial app metadata with updatable flag set to true
  const initialMetadata = {
    name: 'MyUpdatableApp',
    version: '1.0',
    updatable: true,
    deletable: false,
  }

  // Deploy the initial version
  const deployment1 = {
    sender: sender.addr,
    metadata: initialMetadata,
    // In a real scenario, you would provide your approval and clear programs
    approvalProgram: await getApprovalProgram(1), // Version 1 code
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
    console.log(`  Created Round: ${result1.createdRound}`)
    console.log(`  Transaction ID: ${result1.transaction.txID()}`)
  }

  // Wait for indexer to catch up
  await new Promise(resolve => setTimeout(resolve, 2000))

  console.log('\n=== Deploying Update (Version 2.0) ===')

  // Define updated metadata with new version
  const updatedMetadata = {
    ...initialMetadata,
    version: '2.0',
  }

  // Deploy the update with new code
  const deployment2 = {
    sender: sender.addr,
    metadata: updatedMetadata,
    approvalProgram: await getApprovalProgram(2), // Version 2 code (different)
    clearStateProgram: await getClearProgram(),
    schema: {
      globalUints: 1,
      globalByteSlices: 0,
      localUints: 0,
      localByteSlices: 0,
    },
    // Specify onUpdate='update' to update the existing app
    onUpdate: 'update' as const,
  }

  const result2 = await algorand.appDeployer.deploy(deployment2)

  if ('transaction' in result2 && result2.confirmation) {
    console.log(`✓ Update deployment successful`)
    console.log(`  App ID: ${result2.appId} (same as before: ${result1.appId === result2.appId})`)
    console.log(`  Version: ${result2.version}`)
    console.log(`  Updated Round: ${result2.updatedRound}`)
    console.log(`  Transaction ID: ${result2.transaction.txID()}`)
    console.log(`\n  Metadata:`)    
    console.log(`    - Updatable: ${result2.updatable}`)
    console.log(`    - Deletable: ${result2.deletable}`)
    console.log(`    - Deleted: ${result2.deleted}`)
  }

  console.log('\n=== Summary ===')
  console.log(`The app was successfully updated from v${result1.version} to v${result2.version}`)
  console.log(`The app ID remained constant: ${result2.appId}`)
  console.log(`This demonstrates idempotent deployment with update capability.`)
}

/**
 * Helper function to generate approval program
 * In a real application, this would load your TEAL code or compiled program
 */
async function getApprovalProgram(version: number): Promise<Uint8Array> {
  // Simple approval program that stores a value (version) in global state
  const tealCode = `#pragma version 10
  txn ApplicationID
  int 0
  ==
  bnz create
  
  txn OnCompletion
  int UpdateApplication
  ==
  bnz update
  
  int 1
  return
  
  create:
  byte "version"
  int ${version}
  app_global_put
  int 1
  return
  
  update:
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
updateDeployedApp().catch(console.error)