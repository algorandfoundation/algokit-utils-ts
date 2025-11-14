import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { LogicError } from '@algorandfoundation/algokit-utils/types/logic-error'

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

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a deployer account
  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (10).algos())

  console.log('=== Deploying Permanent App (deletable: false) ===')
  console.log('Using account:', deployer.addr.toString())
  console.log()

  // Define approval and clear programs with TMPL_UPDATABLE and TMPL_DELETABLE
  const approvalProgram = `#pragma version 10
txn ApplicationID
int 0
==
bnz create

// Handle UpdateApplication
txn OnCompletion
int UpdateApplication
==
bnz handle_update

// Handle DeleteApplication
txn OnCompletion
int DeleteApplication
==
bnz handle_delete

int 1
return

handle_update:
int TMPL_UPDATABLE
return

handle_delete:
int TMPL_DELETABLE
return

create:
int 1
return`

  const clearProgram = `#pragma version 10
int 1`

  // Deploy the permanent app
  // IMPORTANT: deletable is set to false, making this app permanent
  const deployment1 = {
    sender: deployer.addr,
    metadata: {
      name: 'PermanentApp',
      version: '1.0',
      deletable: false, // This makes the app permanent!
      updatable: true, // Still updatable, but not deletable
    },
    createParams: {
      sender: deployer.addr,
      approvalProgram: approvalProgram,
      clearStateProgram: clearProgram,
      schema: {
        globalInts: 1,
        globalByteSlices: 0,
        localInts: 0,
        localByteSlices: 0,
      },
    },
    updateParams: {
      sender: deployer.addr,
    },
    deleteParams: {
      sender: deployer.addr,
    },
  }

  const result1 = await algorand.appDeployer.deploy(deployment1)

  console.log('✅ Permanent app deployed successfully!')
  console.log('   App ID:', result1.appId)
  console.log('   Version:', result1.version)
  console.log('   Deletable:', result1.deletable, '⚠️')
  console.log('   Updatable:', result1.updatable)
  console.log()

  // Wait for indexer to catch up
  await new Promise((resolve) => setTimeout(resolve, 2000))

  console.log('=== Attempting to Replace Permanent App (v2.0) ===')
  console.log('⚠️  This should fail because the app is not deletable...')
  console.log()

  // Define updated approval program for v2.0
  const approvalProgramV2 = `#pragma version 10
txn ApplicationID
int 0
==
bnz create

// Handle UpdateApplication
txn OnCompletion
int UpdateApplication
==
bnz handle_update

// Handle DeleteApplication
txn OnCompletion
int DeleteApplication
==
bnz handle_delete

int 1
return

handle_update:
int TMPL_UPDATABLE
return

handle_delete:
int TMPL_DELETABLE
return

create:
// Version 2.0
int 2
return`

  // Attempt to deploy with replace strategy
  const deployment2 = {
    sender: deployer.addr,
    metadata: {
      name: 'PermanentApp',
      version: '2.0',
      deletable: false,
      updatable: true,
    },
    createParams: {
      sender: deployer.addr,
      approvalProgram: approvalProgramV2,
      clearStateProgram: clearProgram,
      schema: {
        globalInts: 1,
        globalByteSlices: 0,
        localInts: 0,
        localByteSlices: 0,
      },
    },
    updateParams: {
      sender: deployer.addr,
    },
    deleteParams: {
      sender: deployer.addr,
    },
    onUpdate: 'replace' as const, // This will attempt to delete and recreate
  }

  try {
    // This should fail!
    await algorand.appDeployer.deploy(deployment2)
    console.log('❌ Unexpected: Deployment succeeded (this should not happen!)')
  } catch (error: any) {
    // Expected error path
    console.log('✅ Expected error occurred!')
    console.log()
    console.log('=== Error Details ===')
    console.log('Error message:', error.message.split('\n')[0])
    console.log()

    // Parse the logic error for more details
    const logicError = LogicError.parseLogicError(error)

    if (logicError) {
      console.log('=== Parsed Logic Error ===')
      console.log('Transaction ID:', logicError.txId)
      console.log('Program Counter:', logicError.pc)
      console.log('Message:', logicError.msg)
      console.log('Description:', logicError.desc)
      console.log()
    }

    console.log('=== Why Did This Fail? ===')
    console.log('The app was deployed with deletable: false, making it permanent.')
    console.log('When you try to use the "replace" strategy, it attempts to:')
    console.log('  1. Delete the old app')
    console.log('  2. Create a new app')
    console.log()
    console.log('Step 1 fails because the app\'s approval program does not allow deletion.')
    console.log('This is by design - permanent apps cannot be deleted!')
    console.log()

    console.log('=== What Should You Do Instead? ===')
    console.log('For permanent apps, you have these options:')
    console.log('  1. Use onUpdate: "update" to update the existing app in place')
    console.log('  2. Deploy a completely new app with a different name')
    console.log('  3. Design the app to be deletable from the start if replacement is needed')
    console.log()
  }

  console.log('=== Verification ===')
  console.log('Original app', result1.appId, 'is still alive and unchanged.')
  console.log('You can verify this by querying the app from the blockchain.')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
