import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import { AppCallMethodCall } from '@algorandfoundation/algokit-utils/types/composer'
import algosdk from 'algosdk'

/**
 * This example demonstrates parallel nested method calls with transaction arguments.
 * 
 * Scenario: Call a method that accepts multiple method call arguments,
 * each of which has its own transaction argument.
 * 
 * This is useful for complex multi-step operations where you need to
 * compose multiple parallel contract interactions in a single atomic group.
 * 
 * Structure:
 * doubleNestedTxnArg(arg1, methodCall1, arg2, methodCall2)
 *   ├─ methodCall1: txnArg(payment1)
 *   └─ methodCall2: txnArg(payment2)
 */

async function parallelNestedCallsExample() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get or create an account to use as sender
  const alice = algorand.account.fromEnvironment('ALICE', algosdk.generateAccount())
  
  console.log('Setting up parallel nested method call example...')
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
  // - doubleNestedTxnArg(arg1, method1, arg2, method2): processes both method calls
  
  // Replace this with your actual deployed app ID
  const appId = 123456 // TODO: Replace with actual app ID
  
  // Get the ABI method definitions from your contract client
  // In a real scenario, you would import your generated app client
  // For example: import { YourAppClient } from './artifacts/YourApp.client'
  // const appClient = new YourAppClient({ sender: alice, resolveBy: 'id', id: appId }, algorand.client.algod)
  // const txnArgMethod = appClient.appClient.getABIMethod('txnArg')!
  // const doubleNestedMethod = appClient.appClient.getABIMethod('doubleNestedTxnArg')!
  
  console.log('\nStep 1: Create the first nested method call with a payment transaction (0 microAlgo)')
  
  // First nested method call with its own transaction argument
  const firstTxnCall: AppCallMethodCall = {
    sender: alice,
    appId: appId,
    method: txnArgMethod, // Replace with actual method
    args: [
      algorand.createTransaction.payment({
        sender: alice,
        receiver: alice,
        amount: AlgoAmount.MicroAlgo(0),
      })
    ],
  }
  
  console.log('First nested call configured: txnArg with payment of 0 microAlgo')
  
  console.log('\nStep 2: Create the second nested method call with a different payment transaction (1 microAlgo)')
  
  // Second nested method call with its own transaction argument and a note to differentiate it
  const secondTxnCall: AppCallMethodCall = {
    sender: alice,
    appId: appId,
    method: txnArgMethod, // Replace with actual method
    args: [
      algorand.createTransaction.payment({
        sender: alice,
        receiver: alice,
        amount: AlgoAmount.MicroAlgo(1),
      })
    ],
    note: new Uint8Array([1]), // Adding a note to differentiate this call
  }
  
  console.log('Second nested call configured: txnArg with payment of 1 microAlgo and custom note')
  
  console.log('\nStep 3: Create the parent method call that takes both nested calls as arguments')
  
  // Build and send the transaction group with parallel nested method calls
  const doubleNestedTxnArgRes = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: alice,
      appId: appId,
      method: doubleNestedMethod, // Replace with actual method
      // Pass both nested method calls as separate arguments
      // undefined values are placeholders for other arguments the method might need
      args: [undefined, firstTxnCall, undefined, secondTxnCall],
    })
    .send()
  
  console.log('\nTransaction group sent successfully!')
  console.log('Transaction IDs:', doubleNestedTxnArgRes.txIds)
  
  // Extract and display the return values
  if (doubleNestedTxnArgRes.returns) {
    console.log('\nReturn values from parallel nested calls:')
    
    const firstReturn = doubleNestedTxnArgRes.returns[0]?.returnValue?.valueOf()
    const secondReturn = doubleNestedTxnArgRes.returns[1]?.returnValue?.valueOf()
    const thirdReturn = doubleNestedTxnArgRes.returns[2]?.returnValue?.valueOf()
    
    console.log('- First nested call return (sender from first txnArg):', firstReturn)
    console.log('- Second nested call return (sender from second txnArg):', secondReturn)
    console.log('- Parent method return (app ID):', thirdReturn)
  }
  
  console.log('\nParallel nested method call example completed successfully!')
  console.log('This demonstrates how to compose multiple nested calls in parallel within a single method.')
}

// Run the example
parallelNestedCallsExample().catch(console.error)