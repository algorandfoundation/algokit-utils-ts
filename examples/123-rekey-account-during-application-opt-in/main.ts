import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'
import { appSpec } from './app-spec' // Import your app specification

/**
 * This example demonstrates how to rekey an account during an application opt-in.
 * Rekeying allows you to change the spending authority of an account to a different key,
 * which is useful for security patterns like key rotation and multi-sig setups.
 */

async function rekeyAccountDuringOptIn() {
  // Initialize AlgoKit and get localnet context
  const localnet = algokit.Config.getConfigFromEnvOrDefaults()
  const algod = algokit.getAlgoClient({
    server: localnet.algodServer,
    token: localnet.algodToken,
    port: localnet.algodPort,
  })
  
  // Get an algorand client for easier account and transaction management
  const algorand = algokit.AlgorandClient.fromClients({ algod })
  
  // Get a test account with funds
  const testAccount = await algokit.getDispenserAccount(algod)
  
  // Create a random account to rekey to
  const rekeyTo = algorand.account.random()
  
  console.log('Original account address:', testAccount.addr)
  console.log('Rekey target address:', rekeyTo.addr)
  
  // Create an app client
  const client = algokit.getAppClient(
    {
      resolveBy: 'id',
      app: appSpec,
      sender: testAccount,
      id: 0,
    },
    algod,
  )
  
  // Create the application
  console.log('\nCreating application...')
  await client.create({
    deployTimeParams: {
      UPDATABLE: 0,
      DELETABLE: 0,
      VALUE: 1,
    },
  })
  console.log('Application created successfully')
  
  // Opt-in to the application and rekey the account in the same transaction
  console.log('\nOpting in to application and rekeying account...')
  await client.optIn({
    method: 'opt_in',
    methodArgs: [],
    rekeyTo, // This parameter rekeys the account to the new address
  })
  console.log('Opt-in successful and account rekeyed')
  
  // Create a rekeyed account object that can be used for transactions
  // This combines the original address with the new signing authority
  const rekeyedAccount = algorand.account.rekeyed(testAccount, rekeyTo)
  
  console.log('\nTesting rekeyed account by sending a payment...')
  
  // Send a payment using the rekeyed account
  // The transaction is sent from testAccount.addr but signed with rekeyTo's key
  const txn = await algorand.send.payment({
    amount: algokit.microAlgos(0), // 0 ALGO payment for testing
    sender: rekeyedAccount,
    receiver: testAccount.addr,
  })
  
  console.log('Payment transaction successful!')
  console.log('Transaction ID:', txn.txId)
  console.log('\nThe account has been successfully rekeyed.')
  console.log('Future transactions from', testAccount.addr, 'must be signed by', rekeyTo.addr)
}

// Run the example
rekeyAccountDuringOptIn().catch(console.error)