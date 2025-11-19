import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates the idempotent nature of the app deployer.
 *
 * When you deploy an app with identical parameters multiple times, the deployer
 * intelligently detects that nothing has changed and skips the deployment,
 * avoiding unnecessary transactions and costs.
 *
 * This is especially useful for:
 * - CI/CD pipelines that may run multiple times
 * - Development workflows with frequent deployments
 * - Infrastructure-as-code scenarios where you want declarative deployments
 */

async function main() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a deployer account
  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (10).algos())

  console.log('=== Idempotent App Deployment ===')
  console.log('Using account:', deployer.addr.toString())

  const initialBalance = await algorand.account.getInformation(deployer.addr)
  console.log('Initial balance:', initialBalance.balance.algos.toFixed(6), 'ALGO')
  console.log()

  // Define simple TEAL programs with template variables
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

  // Define deployment parameters
  const metadata = {
    name: 'IdempotentApp',
    version: '1.0.0',
    deletable: true,
    updatable: true,
  }

  const deploymentParams = {
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

  // Step 1: Initial deployment
  console.log('=== FIRST DEPLOYMENT ===')
  console.log('Deploying app with:')
  console.log('  - Name:', metadata.name)
  console.log('  - Version:', metadata.version)
  console.log('  - Schema: globalInts=1, globalByteSlices=1')
  console.log()

  const initialDeployment = await algorand.appDeployer.deploy(deploymentParams)

  console.log('✅ Initial deployment completed')
  console.log('   Operation:', initialDeployment.operationPerformed)
  console.log('   App ID:', initialDeployment.appId.toString())
  console.log('   App Address:', initialDeployment.appAddress.toString())
  console.log('   Created Round:', initialDeployment.createdRound.toString())
  console.log('   Updated Round:', initialDeployment.updatedRound.toString())
  console.log('   Version:', initialDeployment.version)
  console.log('   Deletable:', initialDeployment.deletable)
  console.log('   Updatable:', initialDeployment.updatable)

  // Wait for indexer to catch up
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Get balance after first deployment
  const balanceAfterFirst = await algorand.account.getInformation(deployer.addr)
  console.log()
  console.log('   Balance after first deployment:', balanceAfterFirst.balance.algos.toFixed(6), 'ALGO')
  console.log()

  // Step 2: Second deployment with identical parameters
  console.log('=== SECOND DEPLOYMENT (IDENTICAL PARAMETERS) ===')
  console.log('Deploying the exact same app again...')
  console.log()

  const secondDeployment = await algorand.appDeployer.deploy(deploymentParams)

  console.log('✅ Second deployment completed')
  console.log('   Operation:', secondDeployment.operationPerformed)
  console.log('   App ID:', secondDeployment.appId.toString())
  console.log('   App Address:', secondDeployment.appAddress.toString())
  console.log('   Created Round:', secondDeployment.createdRound.toString())
  console.log('   Updated Round:', secondDeployment.updatedRound.toString())
  console.log('   Version:', secondDeployment.version)
  console.log('   Deletable:', secondDeployment.deletable)
  console.log('   Updatable:', secondDeployment.updatable)

  // Get balance after second deployment
  const balanceAfterSecond = await algorand.account.getInformation(deployer.addr)
  console.log()
  console.log('   Balance after second deployment:', balanceAfterSecond.balance.algos.toFixed(6), 'ALGO')
  console.log()

  // Step 3: Analysis
  console.log('=== IDEMPOTENCY ANALYSIS ===')
  console.log()

  const noOperationPerformed = secondDeployment.operationPerformed === 'nothing'
  console.log('Comparison:')
  console.log('   Same App ID:', initialDeployment.appId === secondDeployment.appId ? '✅' : '❌')
  console.log('   Same App Address:', initialDeployment.appAddress === secondDeployment.appAddress ? '✅' : '❌')
  console.log('   Same Version:', initialDeployment.version === secondDeployment.version ? '✅' : '❌')
  console.log('   Created Round:', initialDeployment.createdRound === secondDeployment.createdRound ? '✅ Same' : '❌ Different')
  console.log('   Updated Round:', initialDeployment.updatedRound === secondDeployment.updatedRound ? '✅ Same (no update)' : '❌ Different')
  console.log('   Operation Performed:', noOperationPerformed ? '✅ Nothing (optimized!)' : '❌ ' + secondDeployment.operationPerformed)
  console.log(
    '   Balance Changed:',
    balanceAfterFirst.balance.microAlgos === balanceAfterSecond.balance.microAlgos ? '✅ No (no fees)' : '❌ Yes',
  )
  console.log()

  console.log('Key Insights:')
  console.log('   1. The deployer detected no changes between deployments')
  console.log('   2. No transaction was created (saving time and fees)')
  console.log('   3. The same app information was returned')
  console.log('   4. This behavior is called "idempotency"')
  console.log()

  console.log('Benefits:')
  console.log('   ✅ Safe to run deployment scripts multiple times')
  console.log('   ✅ No unnecessary blockchain transactions')
  console.log('   ✅ Cost savings (no transaction fees)')
  console.log('   ✅ Faster deployment cycles')
  console.log('   ✅ Perfect for CI/CD automation')
  console.log()

  console.log('When Updates Occur:')
  console.log('   - When approval or clear program changes')
  console.log('   - When schema changes (within allowed bounds)')
  console.log('   - When version number changes')
  console.log('   - When metadata changes')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
