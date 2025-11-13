import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'
import * as fs from 'fs'
import * as path from 'path'

/**
 * This example demonstrates how to deploy a smart contract application
 * using an ABI method call for initialization.
 * 
 * Using ABI methods provides type safety and ensures the correct
 * arguments are passed during contract creation.
 */
async function deploySmartContractWithABI() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get a funded account
  const alice = await algorand.account.fromEnvironment('ALICE')
  
  console.log('Loading application specification...')
  
  // Load the application specification (app spec)
  // The app spec contains the ABI contract definition and TEAL source code
  const appSpecPath = path.join(__dirname, 'application.json')
  const appSpec = JSON.parse(fs.readFileSync(appSpecPath, 'utf-8'))
  
  // Create an ABI contract instance from the app spec
  const contract = new algosdk.ABIContract(appSpec.contract)
  
  console.log(`\nFound creation method: ${contract.getMethodByName('createApplication').name}`)
  
  // Helper function to compile TEAL programs
  async function compileProgram(source: string): Promise<Uint8Array> {
    const algod = algorand.client.algod
    const result = await algod.compile(source).do()
    return new Uint8Array(Buffer.from(result.result, 'base64'))
  }
  
  console.log('\nCompiling approval program...')
  const approvalProgram = await compileProgram(appSpec.source.approval)
  console.log('✓ Approval program compiled')
  
  console.log('Compiling clear state program...')
  const clearStateProgram = await compileProgram(appSpec.source.clear)
  console.log('✓ Clear state program compiled')
  
  console.log('\nDeploying smart contract...')
  
  // Deploy the smart contract using an ABI method call
  const result = await algorand.send.appCreateMethodCall({
    sender: alice,
    method: contract.getMethodByName('createApplication'),
    approvalProgram: approvalProgram,
    clearStateProgram: clearStateProgram,
  })
  
  const appId = result.appId
  console.log(`\n✓ Smart contract deployed successfully!`)
  console.log(`  App ID: ${appId}`)
  console.log(`  Transaction ID: ${result.txIds[0]}`)
  
  // Get application information
  const algod = algorand.client.algod
  const appInfo = await algod.getApplicationByID(Number(appId)).do()
  
  console.log('\nApplication Information:')
  console.log(`  Creator: ${appInfo.params.creator}`)
  console.log(`  Global State Schema: ${appInfo.params['global-state-schema']?.['num-uint']} uints, ${appInfo.params['global-state-schema']?.['num-byte-slice']} byte slices`)
  console.log(`  Local State Schema: ${appInfo.params['local-state-schema']?.['num-uint']} uints, ${appInfo.params['local-state-schema']?.['num-byte-slice']} byte slices`)
  
  console.log('\n✓ Smart contract deployment completed!')
}

// Run the example
deploySmartContractWithABI().catch(console.error)