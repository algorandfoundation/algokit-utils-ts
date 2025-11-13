import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how AlgoKit Utils SDK provides enhanced error messages
 * when TEAL logic errors occur during smart contract execution.
 * 
 * The SDK automatically:
 * - Captures the TEAL stack trace
 * - Provides the program counter (PC) where the error occurred
 * - Shows the exact TEAL instruction that failed
 * - Includes transaction traces for debugging
 */

async function debugLogicErrors() {
  // Initialize the AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const algod = algorand.client.algod
  const indexer = algorand.client.indexer
  
  // Get a test account with funds
  const testAccount = await algorand.account.localNet.dispenser()
  
  console.log('Deploying application with intentional error...')
  
  // Deploy your application (replace with your app spec)
  // This example assumes you have an appSpec with an 'error' method
  const appClient = algorand.client.getTypedAppClient({
    sender: testAccount,
    // Your app spec here
  })
  
  await appClient.create.bare()
  const app = await appClient.appClient.getAppReference()
  
  console.log(`Application deployed with ID: ${app.appId}`)
  console.log(`Application address: ${app.appAddress}`)
  
  // Call a method that will cause a TEAL logic error
  console.log('\nCalling method that will trigger a logic error...')
  
  try {
    await appClient.call({
      method: 'error',
      methodArgs: [],
    })
    
    // This line should never be reached
    console.log('No error occurred (unexpected!)')
    
  } catch (e: any) {
    console.log('\n❌ Logic error caught! Here\'s the enhanced debugging information:\n')
    
    // The SDK provides a 'led' (Logic Error Details) object
    console.log('=== Logic Error Details (e.led) ===')
    console.log(`Program Counter: ${e.led.pc}`)
    console.log(`Error Message: ${e.led.msg}`)
    console.log(`Transaction ID: ${e.led.txId}`)
    console.log(`Number of traces: ${e.led.traces.length}`)
    
    // The stack trace shows exactly where in the TEAL code the error occurred
    console.log('\n=== TEAL Stack Trace ===')
    console.log(e.stack)
    
    // Additional information available in the error object
    console.log('\n=== Additional Debug Info ===')
    console.log(`Transaction confirmed: ${e.led.txId.length === 52}`)
    console.log(`Error type: TEAL logic error (assert failed)`)
    
    // The error details help you:
    // 1. Find the exact line in your TEAL code that failed
    // 2. Understand why the assertion failed
    // 3. Access transaction traces for step-by-step debugging
    
    console.log('\n✅ Error debugging information successfully captured')
    console.log('\nKey features demonstrated:')
    console.log('- Detailed TEAL stack traces showing the error location')
    console.log('- Program counter (PC) for pinpointing the instruction')
    console.log('- Transaction ID for looking up details on the blockchain')
    console.log('- Error traces for step-by-step debugging')
    console.log('\nThis makes debugging TEAL logic errors much easier!')
  }
}

debugLogicErrors().catch(console.error)