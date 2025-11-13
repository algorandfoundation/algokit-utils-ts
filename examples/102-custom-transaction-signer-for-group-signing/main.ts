import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TransactionSigner } from 'algosdk'
import * as algokit from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to implement a custom TransactionSigner
 * to control signing logic for transaction groups. This is useful for:
 * - Wallet integrations that need custom signing workflows
 * - Tracking which transactions are being signed
 * - Implementing conditional signing logic
 */

async function customTransactionSignerExample() {
  // Initialize AlgoKit and get clients
  const algorand = AlgorandClient.defaultLocalNet()
  const algod = algorand.client.algod
  const indexer = algorand.client.indexer

  // Get a test account
  const testAccount = await algorand.account.localNetDispenser()

  console.log('Setting up application client...')
  
  // Deploy or get an existing application that has a method accepting transaction arguments
  // For this example, assume we have a client for an app with 'call_abi_txn' method
  // Replace this with your actual app deployment/client creation
  const { client } = await deployYourApp(testAccount, algod, indexer)

  // Create a payment transaction to pass as an argument
  const txn = await algorand.createTransaction.payment({
    sender: testAccount.addr,
    receiver: testAccount.addr,
    amount: algokit.microAlgo(5000),
  })

  console.log('Created payment transaction to use as method argument')

  // Track which transaction indexes are being signed
  let signedIndexes: number[] = []

  // Implement a custom TransactionSigner
  // This signer wraps the default signer but tracks which indexes are signed
  const customSigner: TransactionSigner = (txnGroup, indexesToSign) => {
    console.log(`Custom signer called to sign transactions at indexes: ${indexesToSign}`)
    
    // Store the indexes for logging/tracking
    signedIndexes = indexesToSign
    
    // Delegate to the default signer for actual signing
    // In a real wallet, you might show UI prompts, apply policies, etc.
    return algokit.getSenderTransactionSigner(testAccount)(txnGroup, indexesToSign)
  }

  console.log('Calling ABI method with custom signer...')

  // Call the ABI method with transaction argument and custom signer
  const result = await client.call({
    method: 'call_abi_txn',
    methodArgs: [txn, 'test'],
    sender: { addr: testAccount.addr, signer: customSigner },
  })

  console.log('\nTransaction group signed successfully!')
  console.log(`Signed transaction indexes: ${signedIndexes}`)
  console.log(`Total transactions in group: ${result.transactions.length}`)
  console.log(`Transaction IDs: ${result.transactions.map(t => t.txID()).join(', ')}`)

  // The custom signer signed all transactions in the group (indexes [0, 1])
  // Index 0: The ABI call transaction
  // Index 1: The payment transaction passed as an argument
  console.log('\nCustom signer successfully tracked and signed all transactions in the group')
}

// Helper function placeholder - replace with your actual app deployment
async function deployYourApp(account: any, algod: any, indexer: any) {
  // This is a placeholder - implement your actual app deployment logic
  // The app should have a method like:
  // call_abi_txn(txn: Transaction, note: string) -> void
  throw new Error('Implement your app deployment logic here')
}

// Run the example
customTransactionSignerExample().catch(console.error)