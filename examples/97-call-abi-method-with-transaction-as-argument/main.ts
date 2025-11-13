import { AlgorandClient, AppManager } from '@algorandfoundation/algokit-utils'
import { microAlgo } from '@algorandfoundation/algokit-utils/amount'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to call an ABI method that accepts a transaction
 * as one of its arguments. This enables powerful transaction composition patterns
 * where the smart contract can verify and react to other transactions in the same
 * atomic group.
 */

// Sample app spec with call_abi_txn method that accepts a transaction argument
const appSpec = {
  hints: {
    call_abi_txn: {
      call_config: {
        no_op: 'CALL',
      },
    },
  },
  contract: {
    name: 'TransactionCompositionApp',
    methods: [
      {
        name: 'call_abi_txn',
        args: [
          { type: 'txn', name: 'payment_txn' },  // Transaction argument
          { type: 'string', name: 'message' },
        ],
        returns: { type: 'string' },
      },
    ],
  },
  state: {
    global: {
      num_byte_slices: 0,
      num_uints: 0,
    },
    local: {
      num_byte_slices: 0,
      num_uints: 0,
    },
  },
  schema: {
    global: {
      declared: {},
      reserved: {},
    },
    local: {
      declared: {},
      reserved: {},
    },
  },
  source: {
    approval: 'I3ByYWdtYSB2ZXJzaW9uIDEw',
    clear: 'I3ByYWdtYSB2ZXJzaW9uIDEw',
  },
  bare_call_config: {
    no_op: 'CREATE',
    opt_in: 'NEVER',
    close_out: 'NEVER',
    update_application: 'NEVER',
    delete_application: 'NEVER',
  },
  template_variables: {
    UPDATABLE: { type: 'uint64' },
    DELETABLE: { type: 'uint64' },
    VALUE: { type: 'uint64' },
  },
}

async function callABIMethodWithTransactionArgument() {
  // Initialize AlgorandClient for LocalNet
  const algod = new algosdk.Algodv2('a' + 'a'.repeat(63), 'http://localhost', 4001)
  const algorand = AlgorandClient.fromClients({ algod })

  // Get a test account from the LocalNet dispenser
  const testAccount = await algorand.account.fromEnvironment('LOCALNET')
  console.log(`Using account: ${testAccount.addr}`)

  // Step 1: Create and deploy the app
  console.log('\nCreating app...')
  const appClient = algorand.client.getAppClient({
    resolveBy: 'id',
    app: appSpec,
    sender: testAccount,
    id: 0,
  })

  const createResult = await appClient.create({
    deployTimeParams: {
      UPDATABLE: 1,
      DELETABLE: 1,
      VALUE: 1,
    },
  })

  console.log(`App created with ID: ${createResult.appId}`)

  // Step 2: Create a payment transaction to pass as an argument
  const paymentAmount = microAlgo(Math.ceil(Math.random() * 10000))
  console.log(`\nCreating payment transaction for ${paymentAmount.microAlgo} microAlgos`)
  
  const paymentTxn = await algorand.createTransaction.payment({
    sender: testAccount.addr,
    receiver: testAccount.addr,
    amount: paymentAmount,
  })

  // Step 3: Call the ABI method with the transaction as an argument
  console.log('\nCalling ABI method with transaction argument...')
  
  /**
   * When you pass a transaction as a methodArg, AlgoKit Utils will:
   * 1. Automatically group the transactions together atomically
   * 2. Handle the ABI encoding for the transaction reference
   * 3. Sign and send both transactions as a group
   */
  const result = await appClient.call({
    method: 'call_abi_txn',
    methodArgs: [
      paymentTxn,  // Pass the payment transaction as the first argument
      'test',      // String message as second argument
    ],
  })

  // Step 4: Process the results
  console.log('Transaction group sent successfully!')
  console.log(`Number of transactions in group: ${result.transactions.length}`)
  console.log(`Transaction IDs: ${result.txIds.join(', ')}`)

  // Step 5: Extract and display the ABI return value
  if (result.confirmations && result.confirmations[1]) {
    const abiMethod = appClient.getABIMethod('call_abi_txn')
    if (abiMethod) {
      const returnValue = AppManager.getABIReturn(
        result.confirmations[1],
        abiMethod
      )
      
      if (returnValue?.returnValue) {
        console.log(`\nReturn value: ${returnValue.returnValue}`)
        console.log(`Expected format: "Sent ${paymentAmount.microAlgo}. test"`)
      }
    }
  }

  console.log('\n✅ Example completed successfully!')
}

// Run the example
callABIMethodWithTransactionArgument().catch(console.error)
