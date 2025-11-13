import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to pass a transaction as an argument to a smart contract method.
 * This pattern is useful when your contract needs to verify or process transaction details.
 */

async function transactionAsArgumentExample() {
  // Initialize AlgorandClient - connects to your Algorand node
  const algorand = AlgorandClient.defaultLocalNet()

  // Get account from LocalNet
  const alice = (await algorand.account.localNetDispenser()).account

  // Deploy or reference your application
  // For this example, assume we have an app with a 'txnArg' method that accepts a transaction
  const appId = 1234 // Replace with your actual app ID

  // Get the ABI method definition
  // In a real scenario, you'd import this from your contract's ABI JSON
  const txnArgMethod = new algosdk.ABIMethod({
    name: 'txnArg',
    args: [{ type: 'txn', name: 'payment', desc: 'Payment transaction to process' }],
    returns: { type: 'address', desc: 'Sender address from the transaction' },
  })

  console.log('Creating a transaction group with a payment transaction as a method argument...')

  // Create a transaction group where:
  // 1. A payment transaction is added to the group
  // 2. An app call method references that payment transaction as an argument
  const txnResult = await algorand
    .newGroup()
    // Add a payment transaction to the group
    .addPayment({
      sender: alice.addr,
      receiver: alice.addr,
      amount: AlgoAmount.MicroAlgo(0),
      note: new Uint8Array([1]),
    })
    // Add an app call that references a payment transaction as an argument
    .addAppCallMethodCall({
      sender: alice.addr,
      appId: appId,
      method: txnArgMethod,
      // Create a transaction to pass as an argument
      // Note: This transaction is created but not sent separately - it's passed as data
      args: [
        algorand.createTransaction.payment({
          sender: alice.addr,
          receiver: alice.addr,
          amount: AlgoAmount.MicroAlgo(0),
        }),
      ],
    })
    .send()

  console.log('\nTransaction group sent successfully!')
  console.log(`Transaction ID: ${txnResult.txIds[0]}`)

  // Access the return value from the method call
  if (txnResult.returns && txnResult.returns.length > 0) {
    const returnValue = txnResult.returns[0].returnValue?.valueOf()
    console.log(`\nMethod return value: ${returnValue}`)
    console.log(`Expected: ${alice.addr}`)
    console.log(`Match: ${returnValue === alice.addr}`)
  }

  console.log('\nKey takeaways:')
  console.log('- Transactions can be passed as arguments to ABI method calls')
  console.log('- Use algorand.createTransaction to create transaction objects for arguments')
  console.log('- The transaction is included in the group but processed by the smart contract')
  console.log('- This pattern enables contracts to verify and process transaction details')
  console.log('- Common use cases: escrow validation, payment verification, multi-step workflows')
}

// Run the example
transactionAsArgumentExample().catch(console.error)
