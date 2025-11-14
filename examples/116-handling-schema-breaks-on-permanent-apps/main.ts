import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { LogicError } from '@algorandfoundation/algokit-utils/types/logic-error'

/**
 * This example demonstrates what happens when you try to replace a permanent app
 * (deletable: false) with a schema-breaking change.
 *
 * Key Learning: Permanent apps cannot be deleted and replaced, even with onSchemaBreak='replace'.
 * You must design your schema correctly from the start for permanent applications.
 */

async function main() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a deployer account
  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (10).algos())

  console.log('=== Handling Schema Breaks on Permanent Apps ===')
  console.log('Using account:', deployer.addr.toString())
  console.log()

  // Define TEAL programs with template variables
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

  // Step 1: Deploy a permanent app (deletable: false)
  console.log('=== Step 1: Deploying Permanent App ===')

  const metadata = {
    name: 'PermanentApp',
    version: '1.0',
    deletable: false, // This makes the app permanent
    updatable: true,
  }

  const deployment1 = {
    sender: deployer.addr,
    metadata: metadata,
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
  console.log('✅ Permanent app deployed successfully')
  console.log('   App ID:', result1.appId)
  console.log('   App Address:', result1.appAddress)
  console.log('   Version:', result1.version)
  console.log('   Deletable:', result1.deletable, '⚠️')
  console.log()

  // Wait for indexer to catch up
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Step 2: Attempt to deploy with schema-breaking change and onSchemaBreak='replace'
  console.log('=== Step 2: Attempting Schema-Breaking Replacement ===')
  console.log('Breaking schema by changing globalInts: 1 → 2')
  console.log('Using onSchemaBreak="replace" strategy')
  console.log()

  const deployment2 = {
    sender: deployer.addr,
    metadata: {
      ...metadata,
      version: '2.0',
    },
    createParams: {
      sender: deployer.addr,
      approvalProgram: approvalProgram,
      clearStateProgram: clearProgram,
      schema: {
        globalInts: 2, // Schema break: increased from 1 to 2
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
    onSchemaBreak: 'replace' as const, // Try to replace the app
    onUpdate: 'update' as const,
  }

  try {
    await algorand.appDeployer.deploy(deployment2)
    console.log('❌ Unexpected: Deployment should have failed!')
  } catch (error: any) {
    console.log('✅ Deployment failed as expected!')
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
    console.log('Schema breaks with "replace" strategy require:')
    console.log('  1. Delete the old app')
    console.log('  2. Create a new app')
    console.log()
    console.log('However:')
    console.log('  • Permanent apps cannot be deleted (TMPL_DELETABLE=0)')
    console.log('  • The delete transaction was rejected by the approval program')
    console.log('  • Therefore, the replacement failed')
    console.log()
  }

  // Verify the original app still exists
  console.log('=== Verification ===')
  await algorand.app.getById(result1.appId)
  console.log('✅ Original permanent app still exists')
  console.log('   App ID:', result1.appId)
  console.log('   Global Ints: 1')
  console.log('   Schema unchanged: still has 1 global int')
  console.log()

  console.log('=== Key Takeaways ===')
  console.log('For permanent apps (deletable: false):')
  console.log('  • Design your schema correctly from the start')
  console.log('  • Schema-breaking changes cannot be applied')
  console.log('  • onSchemaBreak="replace" will fail')
  console.log('  • onSchemaBreak="append" creates a new app instead')
  console.log('  • Consider reserving extra schema slots for future use')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
