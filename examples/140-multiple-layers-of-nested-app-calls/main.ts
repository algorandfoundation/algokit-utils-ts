import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import { AppCallMethodCall } from '@algorandfoundation/algokit-utils/types/composer'
import algosdk from 'algosdk'

/**
 * This example demonstrates multiple layers of nested method calls.
 * 
 * Scenario: Call a method that takes a method call argument,
 * which itself takes another method call argument that has a transaction argument.
 * 
 * This shows the deepest level of method composition supported,
 * useful for extremely complex multi-step dApp operations.
 * 
 * Structure:
 * Level 1 (outer): methodArg(methodCall)
 *   └─ Level 2 (middle): methodArg(methodCall)
 *        └─ Level 3 (inner): txnArg(payment)
 */

async function multiLayerNestedCallsExample() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get or create an account to use as sender
  const alice = algorand.account.fromEnvironment('ALICE', algosdk.generateAccount())
  
  console.log('Setting up multi-layer nested method call example...')
  console.log('Sender address:', alice.addr)
  
  // Ensure alice has funds
  await algorand.send.payment({
    sender: algorand.account.localNetDispenser(),
    receiver: alice.addr,
    amount: AlgoAmount.Algos(10),
  })
  
  // NOTE: You need to deploy your smart contract and get the appId
  // For this example, we assume you have a contract with these methods:
  // - txnArg(txn: transaction): returns sender address
  // - methodArg(method_call): returns app ID
  
  // Replace this with your actual deployed app ID
  const appId = 123456 // TODO: Replace with actual app ID
  
  // Get the ABI method definitions from your contract client
  // In a real scenario, you would import your generated app client
  // For example: import { YourAppClient } from './artifacts/YourApp.client'
  // const appClient = new YourAppClient({ sender: alice, resolveBy: 'id', id: appId }, algorand.client.algod)
  // const txnArgMethod = appClient.appClient.getABIMethod('txnArg')!
  // const methodArgMethod = appClient.appClient.getABIMethod('methodArg')!
  
  console.log('\nStep 1: Create the innermost method call (Level 3) with a payment transaction')
  
  // Level 3 (innermost): Method that takes a transaction argument
  const txnArg2Call: AppCallMethodCall = {
    sender: alice.addr,
    appId: appId,
    method: txnArgMethod, // Replace with actual method
    note: 'txnArg2Call',
    args: [
      algorand.createTransaction.payment({
        sender: alice.addr,
        receiver: alice.addr,
        amount: AlgoAmount.MicroAlgo(1),
      })
    ],
  }
  
  console.log('Level 3 configured: txnArg with payment transaction (amount: 1 microAlgo)')
  
  console.log('\nStep 2: Create the middle method call (Level 2) that takes Level 3 as an argument')
  
  // Level 2 (middle): Method that takes the innermost method call as an argument
  const txnArg1Call: AppCallMethodCall = {
    sender: alice.addr,
    appId: appId,
    method: methodArgMethod, // Replace with actual method
    note: 'txnArg1Call',
    args: [txnArg2Call],
  }
  
  console.log('Level 2 configured: methodArg taking Level 3 as argument')
  
  console.log('\nStep 3: Create the outermost method call (Level 1) that takes Level 2 as an argument')
  
  // Level 1 (outermost): Build and send the transaction group
  const nestedTxnArgRes = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: alice.addr,
      appId: appId,
      note: 'nestedTxnArgRes',
      method: methodArgMethod, // Replace with actual method
      args: [txnArg1Call],
    })
    .send()
  
  console.log('\nTransaction group sent successfully!')
  console.log('Transaction IDs:', nestedTxnArgRes.txIds)
  
  // Extract and display the return values from all three levels
  if (nestedTxnArgRes.returns) {
    console.log('\nReturn values from nested calls:')
    
    const firstReturn = nestedTxnArgRes.returns[0]?.returnValue?.valueOf()
    const secondReturn = nestedTxnArgRes.returns[1]?.returnValue?.valueOf()
    const thirdReturn = nestedTxnArgRes.returns[2]?.returnValue?.valueOf()
    
    console.log('- Level 3 return (sender from txnArg):', firstReturn)
    console.log('- Level 2 return (app ID from methodArg):', secondReturn)
    console.log('- Level 1 return (app ID from methodArg):', thirdReturn)
  }
  
  console.log('\nMulti-layer nested method call example completed successfully!')
  console.log('This demonstrates the full depth of method composition capabilities.')
}

// Run the example
multiLayerNestedCallsExample().catch(console.error)