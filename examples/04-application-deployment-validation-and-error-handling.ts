import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * This example demonstrates the validation that occurs during app deployment
 * when deploy-time controls (updatability/deletability) are requested but the
 * required template variables are missing from the TEAL code.
 *
 * TMPL_UPDATABLE: Required when metadata.updatable is set
 * TMPL_DELETABLE: Required when metadata.deletable is set
 *
 * These template variables allow the deployer to set updatability and deletability
 * at deploy-time rather than hardcoding them in the TEAL contract.
 */
async function demonstrateValidationErrors() {
  console.log('Application Deployment Validation Example')
  console.log('==========================================')

  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account with funds from the LocalNet dispenser
  const deployer = await algorand.account.dispenserFromEnvironment()
  console.log('\nDeployer account:', deployer.addr)

  // Read the clear state program (used for all examples)
  const clearProgram = fs.readFileSync(
    path.join(__dirname, 'artifacts', 'clear.teal'),
    'utf8'
  )

  // Example 1: Missing TMPL_UPDATABLE
  console.log('\n--- Example 1: Missing TMPL_UPDATABLE ---')
  try {
    // This approval program does NOT contain TMPL_UPDATABLE
    const approvalWithoutUpdatable = `#pragma version 8
// This contract is missing TMPL_UPDATABLE template variable
int 1
return`

    const deploymentWithoutUpdatable = {
      metadata: {
        name: 'AppWithoutUpdatable',
        version: '1.0.0',
        updatable: true,  // ❌ Requesting updatability but TMPL_UPDATABLE is missing!
        deletable: false,
      },
      createParams: {
        sender: deployer.addr,
        approvalProgram: approvalWithoutUpdatable,
        clearStateProgram: clearProgram,
        schema: {
          globalInts: 1,
          globalByteSlices: 1,
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

    console.log('Attempting to deploy with updatable=true but no TMPL_UPDATABLE in code...')
    await algorand.appDeployer.deploy(deploymentWithoutUpdatable)

    console.log('❌ ERROR: Should have thrown an error!')
  } catch (error) {
    if (error instanceof Error) {
      console.log('✅ Caught expected error:')
      console.log('   Message:', error.message)
      if (error.message.includes('TMPL_UPDATABLE')) {
        console.log('   ✓ Error correctly identifies missing TMPL_UPDATABLE')
      }
    }
  }

  // Example 2: Missing TMPL_DELETABLE
  console.log('\n--- Example 2: Missing TMPL_DELETABLE ---')
  try {
    // This approval program does NOT contain TMPL_DELETABLE
    const approvalWithoutDeletable = `#pragma version 8
// This contract is missing TMPL_DELETABLE template variable
int 1
return`

    const deploymentWithoutDeletable = {
      metadata: {
        name: 'AppWithoutDeletable',
        version: '1.0.0',
        deletable: true,  // ❌ Requesting deletability but TMPL_DELETABLE is missing!
      },
      createParams: {
        sender: deployer.addr,
        approvalProgram: approvalWithoutDeletable,
        clearStateProgram: clearProgram,
        schema: {
          globalInts: 1,
          globalByteSlices: 1,
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

    console.log('Attempting to deploy with deletable=true but no TMPL_DELETABLE in code...')
    await algorand.appDeployer.deploy(deploymentWithoutDeletable)

    console.log('❌ ERROR: Should have thrown an error!')
  } catch (error) {
    if (error instanceof Error) {
      console.log('✅ Caught expected error:')
      console.log('   Message:', error.message)
      if (error.message.includes('TMPL_DELETABLE')) {
        console.log('   ✓ Error correctly identifies missing TMPL_DELETABLE')
      }
    }
  }

  // Example 3: Correct usage with template variables
  console.log('\n--- Example 3: Correct Usage with Template Variables ---')
  try {
    // This approval program INCLUDES both template variables in intcblock
    const approvalWithTemplates = `#pragma version 8
intcblock 0 1 TMPL_UPDATABLE TMPL_DELETABLE
txn ApplicationID
intc_0 // 0
==
bnz create
txn OnCompletion
intc_1 // UpdateApplication
==
bnz update
txn OnCompletion
pushint 5 // DeleteApplication
==
bnz delete
intc_1 // 1
return
create:
intc_1 // 1
return
update:
intc_2 // TMPL_UPDATABLE
return
delete:
intc_3 // TMPL_DELETABLE
return`

    const correctDeployment = {
      metadata: {
        name: 'CorrectApp',
        version: '1.0.0',
        updatable: true,
        deletable: true,
      },
      createParams: {
        sender: deployer.addr,
        approvalProgram: approvalWithTemplates,
        clearStateProgram: clearProgram,
        schema: {
          globalInts: 1,
          globalByteSlices: 1,
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

    console.log('Deploying with proper template variables...')
    const result = await algorand.appDeployer.deploy(correctDeployment)
    console.log('✅ Deployment successful!')
    console.log('   App ID:', result.appId.toString())
    console.log('   Updatable:', result.updatable)
    console.log('   Deletable:', result.deletable)
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }

  console.log('\n==========================================')
  console.log('Key Takeaways:')
  console.log('1. Include TMPL_UPDATABLE when metadata.updatable is true')
  console.log('2. Include TMPL_DELETABLE when metadata.deletable is true')
  console.log('3. The SDK validates template variables before deployment')
  console.log('4. Template variables enable deploy-time control configuration')
}

// Run the example
demonstrateValidationErrors()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Example failed:', error)
    process.exit(1)
  })
