import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to replace an existing Algorand app with a new one.
 * 
 * When you need to deploy a new version of your app but prefer complete replacement
 * over updating the existing app, you can use the 'replace' strategy. This will:
 * 1. Delete the old app (if it's deletable)
 * 2. Create a new app with the updated code and metadata
 * 
 * This is useful when:
 * - You want a clean slate with a new app ID
 * - The changes are too significant for an update
 * - You want to reset all global/local state
 */

async function main() {
  // Initialize AlgorandClient for local development
  const algorand = AlgorandClient.defaultLocalNet()
  const account = await algorand.account.fromEnvironment('DEPLOYER')
  
  console.log('=== Deploying Initial App (v1.0) ===')
  console.log(`Using account: ${account.addr}\n`)
  
  // Define approval and clear programs for v1.0
  const approvalProgramV1 = `#pragma version 10
  // Simple approval program v1.0
  int 1
  return`
  
  const clearProgram = `#pragma version 10
  // Clear state program
  int 1
  return`
  
  // Compile the programs
  const approvalV1 = await algorand.client.algod.compile(approvalProgramV1).do()
  const clear = await algorand.client.algod.compile(clearProgram).do()
  
  // Deploy the first version of the app
  // Set deletable: true so we can replace it later
  const deployment1 = {
    sender: account.addr,
    approvalProgram: new Uint8Array(Buffer.from(approvalV1.result, 'base64')),
    clearStateProgram: new Uint8Array(Buffer.from(clear.result, 'base64')),
    schema: {
      globalUints: 1,
      globalByteSlices: 0,
      localUints: 0,
      localByteSlices: 0,
    },
    metadata: {
      name: 'MyApp',
      version: '1.0',
      deletable: true,  // Important: must be deletable to allow replacement
      updatable: true,
    },
  }
  
  const result1 = await algorand.appDeployer.deploy(deployment1)
  
  console.log(`✅ Initial deployment successful!`)
  console.log(`   App ID: ${result1.appId}`)
  console.log(`   Version: ${result1.version}`)
  console.log(`   Operation: ${result1.operationPerformed}`)
  console.log(`   Deletable: ${result1.deletable}`)
  console.log(`   Updatable: ${result1.updatable}\n`)
  
  // Wait a moment for the transaction to be processed
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log('=== Deploying Replacement App (v2.0) ===')
  
  // Define updated approval program for v2.0
  const approvalProgramV2 = `#pragma version 10
  // Updated approval program v2.0 with changes
  int 2
  return`
  
  const approvalV2 = await algorand.client.algod.compile(approvalProgramV2).do()
  
  // Deploy the replacement app
  // Use onUpdate: 'replace' to delete old app and create new one
  const deployment2 = {
    sender: account.addr,
    approvalProgram: new Uint8Array(Buffer.from(approvalV2.result, 'base64')),
    clearStateProgram: new Uint8Array(Buffer.from(clear.result, 'base64')),
    schema: {
      globalUints: 1,
      globalByteSlices: 0,
      localUints: 0,
      localByteSlices: 0,
    },
    metadata: {
      name: 'MyApp',
      version: '2.0',
      deletable: true,
      updatable: true,
    },
    onUpdate: 'replace',  // This triggers the replacement strategy
  }
  
  const result2 = await algorand.appDeployer.deploy(deployment2)
  
  console.log(`✅ Replacement deployment successful!`)
  console.log(`   New App ID: ${result2.appId}`)
  console.log(`   Old App ID: ${result1.appId}`)
  console.log(`   App IDs are different: ${result2.appId !== result1.appId}`)
  console.log(`   Version: ${result2.version}`)
  console.log(`   Operation: ${result2.operationPerformed}`)
  
  // Check if the old app was deleted
  if (result2.deleteResult) {
    console.log(`   ✅ Old app was deleted successfully`)
    console.log(`   Delete transaction ID: ${result2.deleteResult.transaction.txID()}\n`)
  }
  
  console.log('=== Summary ===')
  console.log(`The replacement strategy allows you to:`)
  console.log(`1. Delete the old app (App ID: ${result1.appId})`)
  console.log(`2. Create a new app (App ID: ${result2.appId})`)
  console.log(`3. Start fresh with new state and a new app ID`)
  console.log(`\nNote: The old app must be deletable for this to work!`)
}

main().catch(console.error)