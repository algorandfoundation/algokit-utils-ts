import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algokit from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to compose transaction groups where different
 * transactions are signed by different accounts. This is essential for:
 * - Multi-party operations (escrow, atomic swaps, etc.)
 * - Complex DApp workflows involving multiple users
 * - Smart contracts that require transactions from specific accounts
 */

async function multiAccountTransactionGroupExample() {
  // Initialize AlgoKit and get clients
  const algorand = AlgorandClient.defaultLocalNet()
  const algod = algorand.client.algod
  const indexer = algorand.client.indexer

  // Get the main application account (deployer)
  const appAccount = await algorand.account.localNetDispenser()
  console.log(`App account address: ${appAccount.addr}`)

  // Create and fund a second account that will sign a transaction in the group
  console.log('\nCreating and funding second signer account...')
  const secondSigner = algorand.account.random()
  
  // Fund the second account
  await algorand.send.payment({
    sender: appAccount.addr,
    receiver: secondSigner.addr,
    amount: algokit.algo(1),
  })
  console.log(`Second signer address: ${secondSigner.addr}`)
  console.log('Second signer account funded with 1 ALGO')

  // Deploy or get an existing application
  console.log('\nDeploying application...')
  const { client } = await deployYourApp(appAccount, algod, indexer)

  // Create a payment transaction from the second signer
  // This transaction will be included in the group but signed by the second account
  console.log('\nCreating payment transaction from second signer...')
  const paymentTxn = await algorand.createTransaction.payment({
    sender: secondSigner.addr,
    receiver: secondSigner.addr,
    amount: algokit.microAlgo(5000),
  })

  console.log('Calling ABI method with multi-account transaction group...')
  console.log('  - App call will be signed by app account')
  console.log('  - Payment transaction will be signed by second signer')

  // Call the ABI method, passing the transaction with its signer
  // The framework will automatically handle signing each transaction with the appropriate signer
  const result = await client.call({
    method: 'call_abi_txn',
    methodArgs: [
      // Pass both the transaction and its signer as an object
      { transaction: paymentTxn, signer: secondSigner },
      'test'
    ],
    sender: appAccount.addr, // The app call itself is signed by appAccount
  })

  console.log('\n✅ Transaction group successfully sent!')
  console.log(`Total transactions in group: ${result.transactions.length}`)
  console.log('\nTransaction details:')
  result.transactions.forEach((txn, idx) => {
    console.log(`  [${idx}] Type: ${txn.type}, ID: ${txn.txID()}`)
  })

  console.log('\nKey takeaway: Different transactions in the group were signed by different accounts')
  console.log('  - Transaction 0 (app call): Signed by app account')
  console.log('  - Transaction 1 (payment): Signed by second signer')
}

// Helper function placeholder - replace with your actual app deployment
async function deployYourApp(account: any, algod: any, indexer: any) {
  // This is a placeholder - implement your actual app deployment logic
  // The app should have a method like:
  // call_abi_txn(txn: Transaction, note: string) -> void
  throw new Error('Implement your app deployment logic here')
}

// Run the example
multiAccountTransactionGroupExample().catch(console.error)