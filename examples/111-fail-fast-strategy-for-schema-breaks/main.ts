import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates the fail-fast strategy for schema breaks.
 *
 * When onSchemaBreak='fail', the deployment will immediately stop if a schema
 * break is detected, preventing accidental destructive changes in production.
 *
 * This is the safest option for production deployments where schema changes
 * should be intentional and carefully planned.
 */

async function main() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a deployer account
  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (10).algos())

  console.log('Deployer account:', deployer.addr.toString())
  console.log()

  // Define simple TEAL programs with TMPL_UPDATABLE and TMPL_DELETABLE
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

  // Step 1: Deploy initial version of the app
  console.log('=== Step 1: Deploying Initial App Version ===')
  console.log()

  const metadata = {
    name: 'MyApp',
    version: '1.0',
    deletable: true,
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

  const result1 = await algorand.appDeployer.deploy(deployment1)
  console.log('✅ App deployed successfully')
  console.log('   App ID:', result1.appId)
  console.log('   App Address:', result1.appAddress.toString())
  console.log('   Schema: globalInts=1, globalByteSlices=1')
  console.log('   Version:', result1.version)
  console.log()

  // Wait for indexer to catch up
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Step 2: Attempt to deploy with schema-breaking change and onSchemaBreak='fail'
  console.log('=== Step 2: Attempting Deployment with Schema Break ===')
  console.log()
  console.log('New schema: globalInts=2, globalByteSlices=1 (breaking change!)')
  console.log('Strategy: onSchemaBreak="fail"')
  console.log()

  const deployment2 = {
    sender: deployer.addr,
    metadata: metadata,
    createParams: {
      sender: deployer.addr,
      approvalProgram: approvalProgram,
      clearStateProgram: clearProgram,
      schema: {
        globalInts: 2, // Schema break: changed from 1 to 2
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
    onSchemaBreak: 'fail' as const, // Fail immediately on schema break
  }

  try {
    await algorand.appDeployer.deploy(deployment2)
    console.log('❌ This should not happen - deployment should have failed!')
  } catch (error: any) {
    console.log('✅ Deployment failed as expected!')
    console.log()
    console.log('=== Error Details ===')
    console.log(error.message)
    console.log()

    console.log('=== What Happened ===')
    console.log('1. Deployer detected the schema change (globalInts: 1 → 2)')
    console.log('2. onSchemaBreak was set to "fail"')
    console.log('3. Deployment was stopped immediately before any changes')
    console.log('4. Original app remains unchanged')
    console.log()

    console.log('=== Use Cases for onSchemaBreak="fail" ===')
    console.log('• Production deployments where changes should be explicit')
    console.log('• CI/CD pipelines that should halt on unexpected changes')
    console.log('• Safety mechanism to prevent accidental schema modifications')
    console.log()

    console.log('=== Alternatives ===')
    console.log('• onSchemaBreak="replace": Delete and recreate the app (data loss!)')
    console.log('• onSchemaBreak="append": Create a new app instance')
    console.log()
  }

  // Verify the original app is unchanged
  console.log('=== Verification ===')
  console.log()
  const appInfo = await algorand.client.algod.getApplicationByID(Number(result1.appId)).do()
  console.log('✅ Original app is unchanged')
  console.log('   App ID:', result1.appId)
  console.log('   Global State Schema:')
  console.log('     - Ints:', appInfo.params.globalStateSchema?.numUint || 0)
  console.log('     - ByteSlices:', appInfo.params.globalStateSchema?.numByteSlice || 0)
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
