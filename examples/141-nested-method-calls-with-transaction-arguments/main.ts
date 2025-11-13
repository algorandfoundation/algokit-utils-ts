import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import { AppCallMethodCall } from '@algorandfoundation/algokit-utils/types/composer'
import algosdk from 'algosdk'

/**
 * This example demonstrates nested method calls with transaction arguments.
 * 
 * Scenario: Call a method that takes another method call as an argument,
 * where that nested method call itself takes a transaction as an argument.
 * 
 * This is useful for complex dApp workflows where you need to compose
 * multiple contract interactions in a single atomic group.
 */

async function nestedMethodCallsExample() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get or create an account to use as sender
  const alice = algorand.account.fromEnvironment('ALICE', algosdk.generateAccount())
  
  console.log('Setting up nested method call example...')
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
  // - nestedTxnArg(arg1: any, arg2: method_call): returns app ID
  
  // Replace this with your actual deployed app ID
  const appId = 123456 // TODO: Replace with actual app ID
  
  // Get the ABI method definitions from your contract client
  // In a real scenario, you would import your generated app client
  // For example: import { YourAppClient } from './artifacts/YourApp.client'
  // const appClient = new YourAppClient({ sender: alice, resolveBy: 'id', id: appId }, algorand.client.algod)
  
  // For demonstration, we'll show the structure:
  // const txnArgMethod = appClient.appClient.getABIMethod('txnArg')!
  // const nestedTxnArgMethod = appClient.appClient.getABIMethod('nestedTxnArg')!
  
  console.log('\nStep 1: Create the inner method call with a payment transaction argument')
  
  // Define the inner method call that takes a transaction as an argument
  const txnArgCall: AppCallMethodCall = {
    sender: alice,
    appId: appId,
    method: txnArgMethod, // Replace with actual method from your contract
    // The payment transaction is passed as an argument to the method
    args: [
      algorand.createTransaction.payment({
        sender: alice,
        receiver: alice,
        amount: AlgoAmount.MicroAlgo(0),
      })
    ],
  }
  
  console.log('Inner method call configured: txnArg with payment transaction')
  
  console.log('\nStep 2: Create the outer method call that takes the inner method call as an argument')
  
  // Build and send the transaction group with nested method calls
  const nestedTxnArgRes = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: alice,
      appId: appId,
      method: nestedTxnArgMethod, // Replace with actual method from your contract
      // The first arg is undefined (placeholder), the second is the nested method call
      args: [undefined, txnArgCall],
    })
    .send()
  
  console.log('\nTransaction group sent successfully!')
  console.log('Transaction ID:', nestedTxnArgRes.txIds[0])
  
  // Extract and display the return values
  if (nestedTxnArgRes.returns) {
    const firstReturn = nestedTxnArgRes.returns[0]?.returnValue?.valueOf()
    const secondReturn = nestedTxnArgRes.returns[1]?.returnValue?.valueOf()
    
    console.log('\nReturn values:')
    console.log('- First return (sender from txnArg):', firstReturn)
    console.log('- Second return (app ID from nestedTxnArg):', secondReturn)
  }
  
  console.log('\nNested method call example completed successfully!')
}

// Run the example
nestedMethodCallsExample().catch(console.error)