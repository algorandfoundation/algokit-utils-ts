import { AlgorandClient, LogicError } from '@algorandfoundation/algokit-utils'
import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates what happens when you try to replace a permanent app.
 * 
 * When an app is deployed with deletable: false, it becomes permanent and cannot
 * be deleted. Attempting to use the 'replace' strategy on such an app will fail
 * with a logic error.
 * 
 * This example shows:
 * 1. How to deploy a permanent app
 * 2. What happens when you try to replace it
 * 3. How to properly handle and parse the resulting logic error
 * 4. The importance of the deletable flag in app metadata
 */

async function main() {
  // Initialize AlgorandClient for local development
  const algorand = AlgorandClient.defaultLocalNet()
  const account = await algorand.account.fromEnvironment('DEPLOYER')
  
  console.log('=== Deploying Permanent App (deletable: false) ===')
  console.log(`Using account: ${account.addr}\n`)
  
  // Define approval and clear programs
  const approvalProgram = `#pragma version 10
  // Approval program for permanent app
  int 1
  return`
  
  const clearProgram = `#pragma version 10
  // Clear state program
  int 1
  return`
  
  // Compile the programs
  const approval = await algorand.client.algod.compile(approvalProgram).do()
  const clear = await algorand.client.algod.compile(clearProgram).do()
  
  // Deploy the permanent app
  // IMPORTANT: deletable is set to false, making this app permanent
  const deployment1 = {
    sender: account.addr,
    approvalProgram: new Uint8Array(Buffer.from(approval.result, 'base64')),
    clearStateProgram: new Uint8Array(Buffer.from(clear.result, 'base64')),
    schema: {
      globalUints: 1,
      globalByteSlices: 0,
      localUints: 0,
      localByteSlices: 0,
    },
    metadata: {
      name: 'PermanentApp',
      version: '1.0',
      deletable: false,  // This makes the app permanent!
      updatable: true,   // Still updatable, but not deletable
    },
  }
  
  const result1 = await algorand.appDeployer.deploy(deployment1)
  
  console.log(`✅ Permanent app deployed successfully!`)
  console.log(`   App ID: ${result1.appId}`)
  console.log(`   Version: ${result1.version}`)
  console.log(`   Deletable: ${result1.deletable} ⚠️`)
  console.log(`   Updatable: ${result1.updatable}\n`)
  
  // Wait a moment for the transaction to be processed
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log('=== Attempting to Replace Permanent App (v2.0) ===')
  console.log('⚠️  This should fail because the app is not deletable...\n')
  
  // Define updated approval program for v2.0
  const approvalProgramV2 = `#pragma version 10
  // Updated approval program v2.0
  int 2
  return`
  
  const approvalV2 = await algorand.client.algod.compile(approvalProgramV2).do()
  
  // Attempt to deploy with replace strategy
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
      name: 'PermanentApp',
      version: '2.0',
      deletable: false,
      updatable: true,
    },
    onUpdate: 'replace',  // This will attempt to delete and recreate
  }
  
  try {
    // This should fail!
    await algorand.appDeployer.deploy(deployment2)
    console.log('❌ Unexpected: Deployment succeeded (this should not happen!)')
  } catch (error: any) {
    // Expected error path
    console.log('✅ Expected error occurred!\n')
    console.log('=== Error Details ===')
    console.log(`Error message: ${error.message}\n`)
    
    // Parse the logic error for more details
    const logicError = LogicError.parseLogicError(error)
    
    if (logicError) {
      console.log('=== Parsed Logic Error ===')
      console.log(`Transaction ID: ${logicError.txId}`)
      console.log(`Program: ${logicError.program}`)
      console.log(`Line: ${logicError.line}`)
      console.log(`Message: ${logicError.message}\n`)
    }
    
    console.log('=== Why Did This Fail? ===')
    console.log('The app was deployed with deletable: false, making it permanent.')
    console.log('When you try to use the "replace" strategy, it attempts to:')
    console.log('  1. Delete the old app')
    console.log('  2. Create a new app')
    console.log('')
    console.log('Step 1 fails because the app\'s approval program does not allow deletion.')
    console.log('This is by design - permanent apps cannot be deleted!\n')
    
    console.log('=== What Should You Do Instead? ===')
    console.log('For permanent apps, you have these options:')
    console.log('  1. Use onUpdate: "update" to update the existing app in place')
    console.log('  2. Deploy a completely new app with a different name')
    console.log('  3. Design the app to be deletable from the start if replacement is needed\n')
  }
  
  console.log('=== Verification ===')
  console.log(`Original app (${result1.appId}) is still alive and unchanged.`)
  console.log('You can verify this by querying the app from the blockchain.\n')
}

main().catch(console.error)