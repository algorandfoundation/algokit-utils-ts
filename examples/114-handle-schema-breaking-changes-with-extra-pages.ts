import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to handle schema breaking changes,
 * specifically when extra program pages are needed.
 *
 * Key concepts:
 * - Detecting schema breaks (extra pages requirement)
 * - Using onSchemaBreak='fail' to prevent breaking updates
 * - Using onSchemaBreak='append' to create a new app when schema breaks
 * - Understanding deployment strategies for breaking changes
 */

async function handleSchemaBreakExample() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a deployer account
  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (10).algos())

  console.log('=== Step 1: Deploy Small Application (No Extra Pages) ===')
  console.log('Using account:', deployer.addr.toString())
  console.log()

  // Define a small approval program (fits in one page)
  const smallApprovalProgram = `#pragma version 10
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

  // Deploy small app (no extra pages)
  const deployment1 = {
    sender: deployer.addr,
    metadata: {
      name: 'TestApp',
      version: '1.0',
      updatable: true,
      deletable: true,
    },
    createParams: {
      sender: deployer.addr,
      approvalProgram: smallApprovalProgram,
      clearStateProgram: clearProgram,
      schema: {
        globalInts: 1,
        globalByteSlices: 0,
        localInts: 0,
        localByteSlices: 0,
      },
      extraProgramPages: 0, // No extra pages needed
    },
    updateParams: {
      sender: deployer.addr,
    },
    deleteParams: {
      sender: deployer.addr,
    },
  }

  const result1 = await algorand.appDeployer.deploy(deployment1)

  console.log('✅ Small app created successfully')
  console.log('   App ID:', result1.appId)
  console.log('   Version:', result1.version)
  console.log('   Operation:', result1.operationPerformed)
  console.log('   Extra Pages: 0')
  console.log()

  // Wait for indexer to catch up
  await new Promise((resolve) => setTimeout(resolve, 2000))

  console.log('=== Step 2: Attempt Schema Breaking Change ===')
  console.log('We will change the global storage schema, which is a breaking change.')
  console.log()

  // Define approval program with different schema requirements
  const updatedApprovalProgram = `#pragma version 10
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

  // Attempt 1: Deploy with onSchemaBreak='fail' (should fail)
  const deployment2 = {
    sender: deployer.addr,
    metadata: {
      name: 'TestApp',
      version: '2.0',
      updatable: true,
      deletable: true,
    },
    createParams: {
      sender: deployer.addr,
      approvalProgram: updatedApprovalProgram,
      clearStateProgram: clearProgram,
      schema: {
        globalInts: 2, // Changed from 1 to 2 - BREAKING CHANGE!
        globalByteSlices: 0,
        localInts: 0,
        localByteSlices: 0,
      },
      extraProgramPages: 1, // Also adding extra page
    },
    updateParams: {
      sender: deployer.addr,
    },
    deleteParams: {
      sender: deployer.addr,
    },
    onSchemaBreak: 'fail' as const,
    onUpdate: 'update' as const,
  }

  console.log('--- Attempt 1: Using onSchemaBreak="fail" (will fail) ---')
  console.log('Attempting schema break: globalInts 1 → 2, extraProgramPages 0 → 1')
  console.log()
  try {
    await algorand.appDeployer.deploy(deployment2)
    console.log('❌ Unexpected: Update should have failed')
  } catch (error: any) {
    console.log('✅ Expected error caught!')
    console.log()
    console.log('=== Error Details ===')
    console.log('Error message:', error.message.split('\n')[0])
    console.log()
    console.log('=== Why Did This Fail? ===')
    console.log('Schema break detected!')
    console.log('  • Global storage changed: globalInts 1 → 2')
    console.log('  • Extra pages changed: 0 → 1')
    console.log('The deployment was stopped to prevent breaking changes.')
    console.log()
    console.log('Schema breaks affect:')
    console.log('  • Storage requirements (can\'t shrink existing state)')
    console.log('  • Minimum balance requirements (more Algos needed)')
    console.log('  • Existing state compatibility')
    console.log()
  }

  console.log('--- Attempt 2: Using onSchemaBreak="append" (will create new app) ---')
  console.log('Same schema break but with append strategy')
  console.log()
  // This time, allow creating a new app when schema breaks
  const deployment3 = {
    sender: deployer.addr,
    metadata: {
      name: 'TestApp',
      version: '2.0',
      updatable: true,
      deletable: true,
    },
    createParams: {
      sender: deployer.addr,
      approvalProgram: updatedApprovalProgram,
      clearStateProgram: clearProgram,
      schema: {
        globalInts: 2, // Changed from 1 to 2
        globalByteSlices: 0,
        localInts: 0,
        localByteSlices: 0,
      },
      extraProgramPages: 1, // Extra page
    },
    updateParams: {
      sender: deployer.addr,
    },
    deleteParams: {
      sender: deployer.addr,
    },
    onSchemaBreak: 'append' as const,
    onUpdate: 'update' as const,
  }

  const result2 = await algorand.appDeployer.deploy(deployment3)

  console.log()
  console.log('✅ New app created successfully!')
  console.log('   Operation:', result2.operationPerformed)
  console.log('   New App ID:', result2.appId)
  console.log('   Original App ID:', result1.appId)
  console.log('   App IDs different:', result1.appId !== result2.appId)
  console.log()

  console.log('=== Summary ===')
  console.log('Schema break handling strategies:')
  console.log('  • onSchemaBreak="fail": Prevents deployment when schema breaks')
  console.log('  • onSchemaBreak="append": Creates a new app instance')
  console.log('  • onSchemaBreak="replace": Deletes old app and creates new one')
  console.log()
  console.log('Schema breaks include:')
  console.log('  • Changes to global/local storage schema')
  console.log('  • Changes to extra program pages')
  console.log('  • These affect minimum balance and resource requirements')
  console.log('  • Existing state may be incompatible with new schema')
  console.log()

  console.log('✨ Example completed successfully!')
}

// Run the example
handleSchemaBreakExample().catch(console.error)
