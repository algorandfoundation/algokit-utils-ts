import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { Config } from '@algorandfoundation/algokit-utils/types/config'
import algosdk from 'algosdk'

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
  // Configure AlgoKit
  Config.configure({ debug: true })

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get a test account with funds
  const account = await algorand.account.fromEnvironment('DEPLOYER')
  console.log('Using account:', account.addr)

  // Define simple TEAL programs
  const approvalProgram = `#pragma version 8
// Simple approval program
int 1
return`

  const clearProgram = `#pragma version 8
// Simple clear state program  
int 1
return`

  // Step 1: Deploy initial version of the app
  console.log('\n--- Step 1: Deploying initial app version ---')
  
  const metadata = {
    name: 'MyApp',
    version: '1.0',
    deletable: true,
    updatable: true,
  }

  const deployment1 = {
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

  const result1 = await algorand.appDeployer.deploy(deployment1)
  console.log('✅ App deployed successfully')
  console.log('   App ID:', result1.appId)
  console.log('   App Address:', result1.appAddress)
  console.log('   Schema: globalUints=1, globalByteSlices=1')
  console.log('   Version:', result1.version)

  // Wait for indexer to catch up
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Step 2: Attempt to deploy with schema-breaking change and onSchemaBreak='fail'
  console.log('\n--- Step 2: Attempting deployment with schema break ---')
  console.log('   New schema: globalUints=2, globalByteSlices=1 (breaking change!)')
  console.log('   Strategy: onSchemaBreak="fail"')
  
  const deployment2 = {
    sender: account,
    approvalProgram: approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalUints: 2,  // Schema break: changed from 1 to 2
      globalByteSlices: 1,
      localUints: 0,
      localByteSlices: 0,
    },
    metadata: metadata,
    onSchemaBreak: 'fail',  // Fail immediately on schema break
  }

  try {
    await algorand.appDeployer.deploy(deployment2)
    console.log('❌ This should not happen - deployment should have failed!')
  } catch (error: any) {
    console.log('\n❌ Deployment failed as expected!')
    console.log('\n📋 Error Details:')
    console.log('   ', error.message)
    
    console.log('\n💡 What happened:')
    console.log('   1. Deployer detected the schema change (globalUints: 1 -> 2)')
    console.log('   2. onSchemaBreak was set to "fail"')
    console.log('   3. Deployment was stopped immediately before any changes')
    console.log('   4. Original app remains unchanged')
    
    console.log('\n✅ Use Cases for onSchemaBreak="fail":')
    console.log('   - Production deployments where changes should be explicit')
    console.log('   - CI/CD pipelines that should halt on unexpected changes')
    console.log('   - Safety mechanism to prevent accidental schema modifications')
    
    console.log('\n🔄 Alternatives:')
    console.log('   - onSchemaBreak="replace": Delete and recreate the app (data loss!)')
    console.log('   - onSchemaBreak="append": Only allow adding storage (safer)')
  }

  // Verify the original app is unchanged
  console.log('\n--- Verification ---')
  const appInfo = await algorand.client.algod.getApplicationByID(result1.appId).do()
  console.log('✅ Original app is unchanged')
  console.log('   App ID:', result1.appId)
  console.log('   Global State Schema:')
  console.log('     - Uints:', appInfo.params['global-state-schema'].uints)
  console.log('     - ByteSlices:', appInfo.params['global-state-schema']['byte-slices'])
}

main().catch(console.error)