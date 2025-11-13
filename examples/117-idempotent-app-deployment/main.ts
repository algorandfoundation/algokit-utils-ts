import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { Config } from '@algorandfoundation/algokit-utils/types/config'
import algosdk from 'algosdk'

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
  // Configure AlgoKit
  Config.configure({ debug: true })

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get a test account with funds
  const account = await algorand.account.fromEnvironment('DEPLOYER')
  console.log('Using account:', account.addr)
  console.log('Initial balance:', algosdk.microalgosToAlgos(await algorand.client.algod.accountInformation(account.addr).do().then(info => info.amount)), 'ALGO')

  // Define simple TEAL programs
  const approvalProgram = `#pragma version 8
// Simple approval program
int 1
return`

  const clearProgram = `#pragma version 8
// Simple clear state program
int 1
return`

  // Define deployment parameters
  const metadata = {
    name: 'IdempotentApp',
    version: '1.0.0',
    deletable: true,
    updatable: true,
  }

  const deploymentParams = {
    sender: account,
    approvalProgram: approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalUints: 1,
      globalByteSlices: 1,
      localUints: 0,
      localByteSlices: 0,
    },
    metadata: metadata,
  }

  // Step 1: Initial deployment
  console.log('\n=== FIRST DEPLOYMENT ===')
  console.log('Deploying app with:')
  console.log('  - Name:', metadata.name)
  console.log('  - Version:', metadata.version)
  console.log('  - Schema: globalUints=1, globalByteSlices=1')
  
  const initialDeployment = await algorand.appDeployer.deploy(deploymentParams)
  
  console.log('\n✅ Initial deployment completed')
  console.log('   Transaction created:', 'transaction' in initialDeployment ? 'Yes' : 'No')
  if ('transaction' in initialDeployment) {
    console.log('   Transaction ID:', initialDeployment.transaction.txID())
  }
  console.log('   App ID:', initialDeployment.appId)
  console.log('   App Address:', initialDeployment.appAddress)
  console.log('   Created Round:', initialDeployment.createdRound)
  console.log('   Updated Round:', initialDeployment.updatedRound)
  console.log('   Version:', initialDeployment.version)
  console.log('   Deletable:', initialDeployment.deletable)
  console.log('   Updatable:', initialDeployment.updatable)

  // Wait for indexer to catch up
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Get balance after first deployment
  const balanceAfterFirst = algosdk.microalgosToAlgos(
    await algorand.client.algod.accountInformation(account.addr).do().then(info => info.amount)
  )
  console.log('\n   Balance after first deployment:', balanceAfterFirst, 'ALGO')

  // Step 2: Second deployment with identical parameters
  console.log('\n=== SECOND DEPLOYMENT (IDENTICAL PARAMETERS) ===')
  console.log('Deploying the exact same app again...')
  
  const secondDeployment = await algorand.appDeployer.deploy(deploymentParams)
  
  console.log('\n✅ Second deployment completed')
  console.log('   Transaction created:', 'transaction' in secondDeployment ? 'Yes' : 'No')
  console.log('   App ID:', secondDeployment.appId)
  console.log('   App Address:', secondDeployment.appAddress)
  console.log('   Created Round:', secondDeployment.createdRound)
  console.log('   Updated Round:', secondDeployment.updatedRound)
  console.log('   Version:', secondDeployment.version)
  console.log('   Deletable:', secondDeployment.deletable)
  console.log('   Updatable:', secondDeployment.updatable)

  // Get balance after second deployment
  const balanceAfterSecond = algosdk.microalgosToAlgos(
    await algorand.client.algod.accountInformation(account.addr).do().then(info => info.amount)
  )
  console.log('\n   Balance after second deployment:', balanceAfterSecond, 'ALGO')

  // Step 3: Analysis
  console.log('\n=== IDEMPOTENCY ANALYSIS ===')
  
  const hasTransaction = 'transaction' in secondDeployment
  console.log('\n📊 Comparison:')
  console.log('   Same App ID:', initialDeployment.appId === secondDeployment.appId ? '✅' : '❌')
  console.log('   Same App Address:', initialDeployment.appAddress === secondDeployment.appAddress ? '✅' : '❌')
  console.log('   Same Version:', initialDeployment.version === secondDeployment.version ? '✅' : '❌')
  console.log('   Created Round:', initialDeployment.createdRound === secondDeployment.createdRound ? '✅ Same' : '❌ Different')
  console.log('   Updated Round:', initialDeployment.updatedRound === secondDeployment.updatedRound ? '✅ Same (no update)' : '❌ Different')
  console.log('   Transaction Created:', hasTransaction ? '❌ Yes (unexpected)' : '✅ No (optimized!)')
  console.log('   Balance Changed:', balanceAfterFirst === balanceAfterSecond ? '✅ No (no fees)' : '❌ Yes')

  console.log('\n💡 Key Insights:')
  console.log('   1. The deployer detected no changes between deployments')
  console.log('   2. No transaction was created (saving time and fees)')
  console.log('   3. The same app information was returned')
  console.log('   4. This behavior is called "idempotency"')
  
  console.log('\n🎯 Benefits:')
  console.log('   ✅ Safe to run deployment scripts multiple times')
  console.log('   ✅ No unnecessary blockchain transactions')
  console.log('   ✅ Cost savings (no transaction fees)')
  console.log('   ✅ Faster deployment cycles')
  console.log('   ✅ Perfect for CI/CD automation')
  
  console.log('\n🔧 When Updates Occur:')
  console.log('   - When approval or clear program changes')
  console.log('   - When schema changes (within allowed bounds)')
  console.log('   - When version number changes')
  console.log('   - When metadata changes')
}

main().catch(console.error)