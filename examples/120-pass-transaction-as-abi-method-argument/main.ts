import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algokit from '@algorandfoundation/algokit-utils'
import { AppManager } from '@algorandfoundation/algokit-utils/types/app-manager'
import { getArc56Method } from '@algorandfoundation/algokit-utils/types/app-spec'
// Import your generated typed client
import { YourAppClient } from './artifacts/YourAppClient'

/**
 * This example demonstrates how to pass a transaction as an argument to an ABI method.
 * When you pass a transaction as an ABI argument, the SDK automatically creates an
 * atomic transaction group, ensuring both transactions execute together or not at all.
 */

async function main() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get account from KMD (or use your own account)
  const sender = await algorand.account.fromEnvironment('SENDER')
  
  console.log('Creating a payment transaction to pass as an argument...')
  
  // Create a payment transaction that will be passed as an argument
  const paymentTxn = await algorand.createTransaction.payment({
    sender: sender.addr,
    receiver: sender.addr,
    amount: algokit.microAlgo(5000), // 5000 microAlgos
  })
  
  console.log(`Payment transaction created for ${paymentTxn.payment?.amount} microAlgos`)
  
  // Initialize your app client (assumes you have a deployed app)
  const appClient = new YourAppClient(
    {
      resolveBy: 'id',
      id: YOUR_APP_ID, // Replace with your deployed app ID
      sender,
    },
    algorand.client.algod
  )
  
  console.log('Calling ABI method with transaction argument...')
  
  // Call the ABI method with the transaction as an argument
  // The SDK will automatically create an atomic transaction group
  const result = await appClient.send.call({
    method: 'call_abi_txn',
    args: [paymentTxn, 'test'],
  })
  
  console.log('Transaction group confirmed!')
  console.log(`Number of transactions in group: ${result.transactions.length}`)
  console.log(`Return value: ${result.return}`)
  
  // Extract the ABI return value from the confirmation
  if (result.confirmations && result.confirmations[1]) {
    const returnValue = AppManager.getABIReturn(
      result.confirmations[1],
      getArc56Method('call_abi_txn', appClient.appSpec)
    )
    console.log(`ABI Return Value: ${returnValue?.returnValue}`)
  }
  
  console.log('\nExample completed successfully!')
  console.log('The payment transaction and app call were executed atomically.')
}

main().catch(console.error)