import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to handle schema-breaking changes in Algorand apps.
 * 
 * When you need to change the storage schema (global/local state) of an app,
 * you often cannot update it in place because Algorand doesn't allow certain
 * schema modifications. In these cases, you can use the 'replace' strategy
 * with onSchemaBreak parameter.
 * 
 * This example shows:
 * 1. Deploying an app with an initial schema
 * 2. Attempting to deploy with a schema-breaking change
 * 3. Using onSchemaBreak: 'replace' to handle the situation
 * 4. The old app is deleted and a new one is created
 */

async function main() {
  // Initialize AlgorandClient for local development
  const algorand = AlgorandClient.defaultLocalNet()
  const account = await algorand.account.fromEnvironment('DEPLOYER')
  
  console.log('=== Deploying Initial App with Original Schema ===')
  console.log(`Using account: ${account.addr}\n`)
  
  // Define approval and clear programs
  const approvalProgram = `#pragma version 10
  // Approval program v1.0
  int 1
  return`
  
  const clearProgram = `#pragma version 10
  // Clear state program
  int 1
  return`
  
  // Compile the programs
  const approval = await algorand.client.algod.compile(approvalProgram).do()
  const clear = await algorand.client.algod.compile(clearProgram).do()
  
  // Deploy the first version with initial schema
  const deployment1 = {
    sender: account.addr,
    approvalProgram: new Uint8Array(Buffer.from(approval.result, 'base64')),
    clearStateProgram: new Uint8Array(Buffer.from(clear.result, 'base64')),
    schema: {
      globalUints: 2,        // Initial: 2 global uint values
      globalByteSlices: 1,   // Initial: 1 global byte slice
      localUints: 1,         // Initial: 1 local uint value
      localByteSlices: 0,    // Initial: 0 local byte slices
    },
    metadata: {
      name: 'SchemaApp',
      version: '1.0',
      deletable: true,  // Must be deletable to allow replacement
      updatable: true,
    },
  }
  
  const result1 = await algorand.appDeployer.deploy(deployment1)
  
  console.log(`✅ Initial deployment successful!`)
  console.log(`   App ID: ${result1.appId}`)
  console.log(`   Version: ${result1.version}`)
  console.log(`   Schema (Global): ${deployment1.schema.globalUints} uints, ${deployment1.schema.globalByteSlices} byte slices`)
  console.log(`   Schema (Local): ${deployment1.schema.localUints} uints, ${deployment1.schema.localByteSlices} byte slices\n`)
  
  // Wait a moment for the transaction to be processed
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log('=== Deploying Updated App with Schema-Breaking Changes ===')
  console.log('Schema changes:')
  console.log('  - Global uints: 2 → 3 (adding storage)')
  console.log('  - Local byte slices: 0 → 2 (adding storage)')
  console.log('\nThese changes break the schema and require replacement...\n')
  
  // Deploy with schema-breaking changes
  const deployment2 = {
    sender: account.addr,
    approvalProgram: new Uint8Array(Buffer.from(approval.result, 'base64')),
    clearStateProgram: new Uint8Array(Buffer.from(clear.result, 'base64')),
    schema: {
      globalUints: 3,        // Changed: 2 → 3 (schema breaking!)
      globalByteSlices: 1,   // Unchanged
      localUints: 1,         // Unchanged
      localByteSlices: 2,    // Changed: 0 → 2 (schema breaking!)
    },
    metadata: {
      name: 'SchemaApp',
      version: '2.0',
      deletable: true,
      updatable: true,
    },
    onSchemaBreak: 'replace',  // Handle schema break by replacing the app
  }
  
  const result2 = await algorand.appDeployer.deploy(deployment2)
  
  console.log(`✅ Replacement deployment successful!`)
  console.log(`   New App ID: ${result2.appId}`)
  console.log(`   Old App ID: ${result1.appId}`)
  console.log(`   App IDs are different: ${result2.appId !== result1.appId}`)
  console.log(`   Version: ${result2.version}`)
  console.log(`   Operation: ${result2.operationPerformed}`)
  console.log(`   Schema (Global): ${deployment2.schema.globalUints} uints, ${deployment2.schema.globalByteSlices} byte slices`)
  console.log(`   Schema (Local): ${deployment2.schema.localUints} uints, ${deployment2.schema.localByteSlices} byte slices\n`)
  
  // Check if the old app was deleted
  if (result2.deleteResult) {
    console.log(`   ✅ Old app was deleted as part of replacement`)
    console.log(`   Delete transaction ID: ${result2.deleteResult.transaction.txID()}\n`)
  }
  
  console.log('=== Understanding Schema Changes ===')
  console.log('Schema-breaking changes occur when:')
  console.log('  • You increase the number of global uints')
  console.log('  • You increase the number of global byte slices')
  console.log('  • You increase the number of local uints')
  console.log('  • You increase the number of local byte slices')
  console.log('')
  console.log('⚠️  Algorand does NOT allow updating an app to increase storage!')
  console.log('\nSolutions:')
  console.log('  1. Use onSchemaBreak: "replace" to delete and recreate (as shown here)')
  console.log('  2. Use onSchemaBreak: "fail" to abort the deployment')
  console.log('  3. Design your schema with extra capacity from the start\n')
  
  console.log('=== Important Considerations ===')
  console.log('When replacing an app due to schema changes:')
  console.log('  ⚠️  All global state is lost (reset to empty)')
  console.log('  ⚠️  Users must re-opt-in to the new app')
  console.log('  ⚠️  All local state is lost for all users')
  console.log('  ⚠️  The app gets a new ID (update references!)')
  console.log('  ✅  You get the new schema you need')
  console.log('  ✅  Fresh start with clean state\n')
}

main().catch(console.error)