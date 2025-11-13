import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to make a raw application call with manually encoded arguments.
 * This approach gives you fine-grained control over the call parameters and is useful when you need
 * to work directly with the low-level ABI encoding.
 */

async function rawAppCallExample() {
  // Initialize AlgorandClient - connects to your Algorand node
  const algorand = AlgorandClient.defaultLocalNet()

  // Get accounts from LocalNet
  const alice = (await algorand.account.localNetDispenser()).account
  const bob = algosdk.generateAccount()

  // Fund bob's account
  await algorand.send.payment({
    sender: alice.addr,
    receiver: bob.addr,
    amount: AlgoAmount.Algos(10),
  })

  // Deploy a test application (replace this with your actual app deployment)
  // For this example, assume we have an app with a 'doMath' method that takes two uint64s and an operation
  const appId = 1234 // Replace with your actual app ID

  // Get the ABI method selector for 'doMath'
  // In a real scenario, you'd get this from your contract's ABI
  const methodSelector = new Uint8Array([0x15, 0x1f, 0x7c, 0x75]) // Example selector

  console.log('Creating atomic transaction group with payment and raw app call...')

  // Get balances before the transaction
  const alicePreBalance = (await algorand.account.getInformation(alice.addr)).balance
  const bobPreBalance = (await algorand.account.getInformation(bob.addr)).balance

  console.log(`Alice balance before: ${alicePreBalance.microAlgo} microAlgos`)
  console.log(`Bob balance before: ${bobPreBalance.microAlgo} microAlgos`)

  // Create an atomic transaction group with:
  // 1. A payment transaction from Alice to Bob
  // 2. A raw app call with manually encoded arguments
  const result = await algorand
    .newGroup()
    // Add a payment transaction
    .addPayment({
      sender: alice.addr,
      receiver: bob.addr,
      amount: AlgoAmount.MicroAlgo(1),
      note: new Uint8Array([1]),
    })
    // Add a raw app call with manually encoded arguments
    .addAppCall({
      sender: alice.addr,
      appId: appId,
      args: [
        methodSelector, // Method selector (first 4 bytes of method signature hash)
        algosdk.encodeUint64(1), // First argument: uint64 value 1
        algosdk.encodeUint64(2), // Second argument: uint64 value 2
        Uint8Array.from(Buffer.from('AANzdW0=', 'base64')), // Third argument: operation ("sum")
      ],
      note: 'addAppCall',
    })
    .execute()

  console.log('\nTransaction group executed successfully!')
  console.log(`Group ID: ${result.groupId}`)

  // Get balances after the transaction
  const alicePostBalance = (await algorand.account.getInformation(alice.addr)).balance
  const bobPostBalance = (await algorand.account.getInformation(bob.addr)).balance

  console.log(`\nAlice balance after: ${alicePostBalance.microAlgo} microAlgos`)
  console.log(`Bob balance after: ${bobPostBalance.microAlgo} microAlgos`)
  console.log(`Alice paid: ${alicePreBalance.microAlgo - alicePostBalance.microAlgo} microAlgos (includes fees)`)
  console.log(`Bob received: ${bobPostBalance.microAlgo - bobPreBalance.microAlgo} microAlgos`)

  // Check if there are logs from the app call
  if (result.confirmations[1].logs && result.confirmations[1].logs.length > 0) {
    const logData = Buffer.from(result.confirmations[1].logs[0]).toString('hex')
    console.log(`\nApp call log output: ${logData}`)
  }

  console.log('\nKey takeaways:')
  console.log('- Raw app calls give you fine-grained control over arguments')
  console.log('- Method selectors are the first 4 bytes of the method signature hash')
  console.log('- Arguments must be manually encoded using algosdk encoding functions')
  console.log('- Atomic groups ensure all transactions succeed or fail together')
}

// Run the example
rawAppCallExample().catch(console.error)
