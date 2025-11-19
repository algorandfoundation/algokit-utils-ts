import { AlgorandClient } from '@algorandfoundation/algokit-utils'

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

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a deployer account
  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (10).algos())

  console.log('Deployer account:', deployer.addr.toString())
  console.log()

  console.log('=== Initial App Deployment ===')
  console.log()

  // Define app metadata
  const metadata = {
    name: 'MyProductionApp',
    version: '1.0',
    updatable: true,
    deletable: false,
  }

  // Define approval program (version 1)
  const approvalProgram1 = `#pragma version 10
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

  // Define clear state program
  const clearProgram = `#pragma version 10
int 1`

  // Deploy the initial version
  const deployment1 = {
    sender: deployer.addr,
    metadata: metadata,
    createParams: {
      sender: deployer.addr,
      approvalProgram: approvalProgram1,
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

  console.log('✅ Initial deployment successful')
  console.log('   Operation:', result1.operationPerformed)
  console.log('   App ID:', result1.appId)
  console.log('   App Address:', result1.appAddress.toString())
  console.log('   Version:', result1.version)
  if ('transaction' in result1) {
    console.log('   Transaction ID:', result1.transaction.txID())
  }
  console.log()

  // Wait for indexer to catch up (if available)
  await new Promise((resolve) => setTimeout(resolve, 2000))

  console.log('=== Attempting Deployment with onUpdate="fail" ===')
  console.log('This will fail because an app with the same name already exists.')
  console.log()

  // Define approval program (version 2 - different code)
  const approvalProgram2 = `#pragma version 10
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

  // Attempt to deploy again with onUpdate='fail'
  const deployment2 = {
    sender: deployer.addr,
    metadata: metadata, // Same metadata as before
    createParams: {
      sender: deployer.addr,
      approvalProgram: approvalProgram2, // Different code
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
    // Setting onUpdate='fail' means deployment will error if app exists
    onUpdate: 'fail' as const,
  }

  try {
    await algorand.appDeployer.deploy(deployment2)

    // We should never reach this line
    console.log('❌ ERROR: Deployment should have failed but succeeded!')
  } catch (error: any) {
    console.log('✅ Deployment failed as expected (onUpdate="fail")')
    console.log()
    console.log('=== Error Details ===')
    console.log('Error message:', error.message)
    console.log()

    // Check the specific error message
    if (error.message.includes('Update detected and onUpdate=Fail')) {
      console.log('This error indicates that:')
      console.log('  • An existing app with the same metadata was found')
      console.log('  • The onUpdate parameter was set to "fail"')
      console.log('  • The deployment was stopped before any transaction was sent')
    }
  }
  console.log()

  console.log('=== Understanding onUpdate Strategies ===')
  console.log()
  console.log('The onUpdate parameter controls behavior when an existing app is detected:')
  console.log()
  console.log('  • onUpdate="fail" (used here):')
  console.log('    - Immediately stops deployment with an error')
  console.log('    - No transactions are sent to the network')
  console.log('    - Use in strict production environments')
  console.log('    - Prevents accidental updates')
  console.log()
  console.log('  • onUpdate="update":')
  console.log('    - Updates the existing app with new code')
  console.log('    - Requires updatable=true in original deployment')
  console.log('    - Use for controlled app version upgrades')
  console.log()
  console.log('  • onUpdate="replace":')
  console.log('    - Deletes the old app and creates a new one')
  console.log('    - Requires deletable=true in original deployment')
  console.log('    - Use when app ID can change')
  console.log()
  console.log('  • onUpdate="append":')
  console.log('    - Creates a new app instance (doesn\'t update existing)')
  console.log('    - Use when you want multiple versions running')
  console.log()

  console.log('=== Use Cases for onUpdate="fail" ===')
  console.log()
  console.log('1. Production deployment pipelines:')
  console.log('   • Prevent accidental overwrites of production apps')
  console.log('   • Require explicit manual intervention for updates')
  console.log()
  console.log('2. Immutable deployment requirements:')
  console.log('   • Enforce that apps are never updated after initial deployment')
  console.log('   • Audit compliance scenarios')
  console.log()
  console.log('3. Testing and validation:')
  console.log('   • Ensure deployment scripts are idempotent')
  console.log('   • Catch configuration errors before they reach production')
  console.log()

  console.log('✨ Example completed successfully!')
}

// Run the example
failFastDeployment().catch(console.error)
