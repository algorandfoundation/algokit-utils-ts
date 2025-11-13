import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { Config } from '@algorandfoundation/algokit-utils/types/config'
import algosdk from 'algosdk'

/**
 * This example demonstrates what happens when you try to replace a permanent app
 * (deletable: false) with a schema-breaking change.
 *
 * Key Learning: Permanent apps cannot be deleted and replaced, even with onSchemaBreak='replace'.
 * You must design your schema correctly from the start for permanent applications.
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
// Simple approval program with global state
int 1
return`

  const clearProgram = `#pragma version 8
// Simple clear state program
int 1
return`

  // Step 1: Deploy a permanent app (deletable: false)
  console.log('\n--- Step 1: Deploying permanent app ---')
  
  const metadata = {
    name: 'PermanentApp',
    version: '1.0',
    deletable: false,  // This makes the app permanent
    updatable: true,
  }

  const deployment1 = {
    sender: account,
    approvalProgram: approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalUints: 1,
      globalByteSlices: 0,
      localUints: 0,
      localByteSlices: 0,
    },
    metadata: metadata,
  }

  const result1 = await algorand.appDeployer.deploy(deployment1)
  console.log('✅ Permanent app deployed successfully')
  console.log('   App ID:', result1.appId)
  console.log('   App Address:', result1.appAddress)
  console.log('   Created Round:', result1.createdRound)
  console.log('   Deletable:', result1.deletable)

  // Wait for indexer to catch up
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Step 2: Attempt to deploy with schema-breaking change and onSchemaBreak='replace'
  console.log('\n--- Step 2: Attempting schema-breaking replacement ---')
  console.log('   Breaking schema by changing globalUints: 1 -> 2')
  console.log('   Using onSchemaBreak: "replace"')
  
  const deployment2 = {
    sender: account,
    approvalProgram: approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalUints: 2,  // Schema break: increased from 1 to 2
      globalByteSlices: 0,
      localUints: 0,
      localByteSlices: 0,
    },
    metadata: {
      ...metadata,
      version: '2.0',
    },
    onSchemaBreak: 'replace',  // Try to replace the app
  }

  try {
    await algorand.appDeployer.deploy(deployment2)
    console.log('❌ This should not happen - deployment should have failed!')
  } catch (error: any) {
    console.log('\n❌ Deployment failed as expected!')
    console.log('   Error:', error.message)
    
    // Parse the logic error for more details
    if (error.message.includes('logic eval error')) {
      console.log('\n📋 Analysis:')
      console.log('   - The app is marked as permanent (deletable: false)')
      console.log('   - Schema breaks require deleting and recreating the app')
      console.log('   - Permanent apps cannot be deleted')
      console.log('   - Therefore, schema-breaking changes are not possible')
      console.log('\n💡 Key Takeaway:')
      console.log('   Design your schema carefully for permanent apps!')
      console.log('   Once deployed as permanent, the schema cannot be changed.')
    }
  }

  // Verify the original app still exists
  console.log('\n--- Verification ---')
  const appInfo = await algorand.client.algod.getApplicationByID(result1.appId).do()
  console.log('✅ Original permanent app still exists')
  console.log('   App ID:', result1.appId)
  console.log('   Global State Schema - Uints:', appInfo.params['global-state-schema'].uints)
}

main().catch(console.error)