import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { LogicError } from '@algorandfoundation/algokit-utils/types/logic-error'

/**
 * This example demonstrates what happens when you try to update an immutable application.
 *
 * Key concepts:
 * - Deploy an app with updatable=false (immutable)
 * - Attempt to update the immutable app
 * - Catch and parse the resulting logic error
 * - Understand app immutability for security
 */

async function handleImmutableAppUpdate() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a deployer account
  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (10).algos())

  console.log('=== Deploying Immutable App ===')
  console.log('Using account:', deployer.addr.toString())
  console.log()

  // Define approval program with TMPL_UPDATABLE and TMPL_DELETABLE
  const approvalProgramV1 = `#pragma version 10
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
byte "version"
int 1
app_global_put
int 1
return`

  const clearProgram = `#pragma version 10
int 1`

  // Define app metadata with updatable flag set to FALSE
  const metadata = {
    name: 'MyImmutableApp',
    version: '1.0',
    updatable: false, // This makes the app immutable
    deletable: false,
  }

  // Deploy the initial immutable version
  const deployment1 = {
    sender: deployer.addr,
    metadata: metadata,
    createParams: {
      sender: deployer.addr,
      approvalProgram: approvalProgramV1,
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

  console.log('✅ Immutable app deployed successfully')
  console.log('   App ID:', result1.appId)
  console.log('   Version:', result1.version)
  console.log('   Updatable:', result1.updatable, '⚠️')
  console.log('   Deletable:', result1.deletable, '⚠️')
  console.log()

  // Wait for indexer to catch up
  await new Promise(resolve => setTimeout(resolve, 2000))

  console.log('=== Attempting to Update Immutable App ===')
  console.log('⚠️  This should fail because the app is not updatable...')
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
byte "version"
int 2
app_global_put
int 1
return`

  // Attempt to deploy an update (this will fail)
  const deployment2 = {
    sender: deployer.addr,
    metadata: {
      ...metadata,
      version: '2.0',
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
    onUpdate: 'update' as const,
  }

  try {
    // This will throw an error because the app is immutable
    await algorand.appDeployer.deploy(deployment2)

    // We should never reach this line
    console.log('❌ ERROR: Update should have failed but succeeded!')
  } catch (error: any) {
    console.log('✅ Update failed as expected (app is immutable)')
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
    console.log('The app was deployed with updatable: false, making it immutable.')
    console.log('When you try to use the "update" strategy, it attempts to update the app.')
    console.log('However, the approval program rejects the update because TMPL_UPDATABLE=0.')
    console.log('This is by design - immutable apps cannot be updated!')
    console.log()
  }

  console.log('=== Summary ===')
  console.log('Immutable apps cannot be updated once deployed.')
  console.log('This is a security feature to ensure app logic cannot be changed.')
  console.log('When deploying apps, carefully consider whether they should be updatable.')
  console.log()
  console.log('Best practices:')
  console.log('  - Use updatable=false for production apps that should never change')
  console.log('  - Use updatable=true during development or for apps that need upgrades')
  console.log('  - Always handle update errors gracefully in your deployment scripts')
  console.log()

  console.log('✨ Example completed successfully!')
}

// Run the example
handleImmutableAppUpdate().catch(console.error)