import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to send a payment transaction in Algos
 * and verify the transaction was successful.
 *
 * Payment transactions are the foundation of value transfer on Algorand.
 */
async function sendAlgoPayment() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a funded test account from dispenser
  const dispenser = await algorand.account.localNetDispenser()
  const testAccount = await algorand.account.random()

  // Fund test account
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: testAccount.addr,
    amount: algo(10),
  })

  // Create a new random account to receive the payment
  const secondAccount = await algorand.account.random()

  console.log('Account Information:')
  console.log(`  Sender: ${testAccount.addr.toString()}`)
  console.log(`  Receiver: ${secondAccount.addr.toString()}`)

  console.log('\nSending 5 Algos...')

  // Send a payment transaction of 5 Algos
  const result = await algorand.send.payment({
    sender: testAccount.addr,
    receiver: secondAccount.addr,
    amount: algo(5), // Send 5 ALGO
    note: 'Transfer 5 Algos',
  })

  console.log('\n✓ Payment transaction sent successfully!')
  console.log(`  Transaction ID: ${result.transaction.txID()}`)
  console.log(`  Confirmed in round: ${result.confirmation.confirmedRound}`)

  // Display transaction details
  console.log('\nTransaction Details:')
  console.log(`  Amount: ${Number(algo(5).microAlgo)} microAlgos (5 Algos)`)
  console.log(`  Sender: ${testAccount.addr.toString()}`)
  console.log(`  Receiver: ${secondAccount.addr.toString()}`)

  // Get the receiver's account information to verify the balance
  console.log('\nVerifying receiver balance...')
  const accountInfo = await algorand.account.getInformation(secondAccount.addr)

  console.log('\nReceiver Account Information:')
  console.log(`  Address: ${accountInfo.address}`)
  console.log(`  Balance: ${accountInfo.balance} microAlgos (${Number(accountInfo.balance) / 1_000_000} Algos)`)
  const minBalance = accountInfo.minBalance ?? 100000
  console.log(`  Min Balance: ${minBalance} microAlgos`)

  // Verify the balance matches what we sent (5 Algos = 5,000,000 microAlgos)
  if (Number(accountInfo.balance) === 5_000_000) {
    console.log('\n✓ Payment verified! Receiver has the correct balance.')
  } else {
    console.log('\n⚠ Warning: Balance mismatch detected.')
    console.log(`  Expected: 5,000,000 microAlgos`)
    console.log(`  Actual: ${accountInfo.balance} microAlgos`)
  }

  console.log('\n✓ Payment transaction example completed!')
}

// Run the example
sendAlgoPayment()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
