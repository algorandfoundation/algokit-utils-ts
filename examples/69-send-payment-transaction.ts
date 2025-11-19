import { AlgorandClient, algo, microAlgo } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates a basic payment transaction.
 *
 * Payment transactions are the most fundamental operation on Algorand.
 * They transfer ALGO from one account to another.
 *
 * Key concepts:
 * - The sender pays the transaction fee (typically 1000 microAlgo = 0.001 ALGO)
 * - The receiver gets exactly the amount specified
 * - Balances can be checked before and after to verify the transaction
 */

async function basicPaymentExample() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  console.log('=== Basic Payment Transaction Example ===')
  console.log()

  // Create two accounts: Alice (sender) and Bob (receiver)
  const alice = await algorand.account.random()
  const bob = await algorand.account.random()

  console.log(`Alice's address: ${alice.addr.toString()}`)
  console.log(`Bob's address: ${bob.addr.toString()}`)
  console.log()

  // Fund Alice with some ALGO from the dispenser
  const dispenser = await algorand.account.localNetDispenser()
  console.log('Funding Alice with 10 ALGO...')
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: alice.addr,
    amount: algo(10), // 10 ALGO
  })

  // Fund Bob with some ALGO (so the account exists)
  console.log('Funding Bob with 5 ALGO...')
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: bob.addr,
    amount: algo(5), // 5 ALGO
  })
  console.log()

  // Get balances before the payment
  const alicePreInfo = await algorand.account.getInformation(alice.addr)
  const bobPreInfo = await algorand.account.getInformation(bob.addr)
  const alicePreBalance = alicePreInfo.balance
  const bobPreBalance = bobPreInfo.balance

  console.log('Balances before payment:')
  console.log(`  Alice: ${alicePreBalance.toLocaleString()} microAlgo (${Number(alicePreBalance) / 1_000_000} ALGO)`)
  console.log(`  Bob:   ${bobPreBalance.toLocaleString()} microAlgo (${Number(bobPreBalance) / 1_000_000} ALGO)`)
  console.log()

  // Send 1 microAlgo from Alice to Bob
  console.log('Sending 1 microAlgo from Alice to Bob...')
  const paymentResult = await algorand.send.payment({
    sender: alice.addr,
    receiver: bob.addr,
    amount: microAlgo(1), // 1 microAlgo
  })

  console.log(`✓ Payment transaction confirmed in round ${paymentResult.confirmation.confirmedRound}`)
  console.log(`  Transaction ID: ${paymentResult.transaction.txID()}`)
  console.log()

  // Get balances after the payment
  const alicePostInfo = await algorand.account.getInformation(alice.addr)
  const bobPostInfo = await algorand.account.getInformation(bob.addr)
  const alicePostBalance = alicePostInfo.balance
  const bobPostBalance = bobPostInfo.balance

  console.log('Balances after payment:')
  console.log(`  Alice: ${alicePostBalance.toLocaleString()} microAlgo (${Number(alicePostBalance) / 1_000_000} ALGO)`)
  console.log(`  Bob:   ${bobPostBalance.toLocaleString()} microAlgo (${Number(bobPostBalance) / 1_000_000} ALGO)`)
  console.log()

  // Calculate and display the changes
  const aliceChange = Number(alicePostBalance) - Number(alicePreBalance)
  const bobChange = Number(bobPostBalance) - Number(bobPreBalance)
  const fee = 1000 // Standard transaction fee

  console.log('Balance changes:')
  console.log(`  Alice: ${aliceChange} microAlgo (sent 1 + paid ${fee} fee = -${fee + 1} total)`)
  console.log(`  Bob:   +${bobChange} microAlgo (received)`)
  console.log()

  // Verify the transaction
  const expectedAliceBalance = Number(alicePreBalance) - 1 - fee
  const expectedBobBalance = Number(bobPreBalance) + 1

  if (Number(alicePostBalance) === expectedAliceBalance &&
      Number(bobPostBalance) === expectedBobBalance) {
    console.log('✓ Payment successful! Balances updated correctly.')
    console.log('✓ Transaction fee of 1000 microAlgo (0.001 ALGO) was paid by sender.')
  } else {
    console.log('✗ Unexpected balance change!')
    console.log(`  Expected Alice: ${expectedAliceBalance}, Got: ${alicePostBalance}`)
    console.log(`  Expected Bob: ${expectedBobBalance}, Got: ${bobPostBalance}`)
  }
}

// Run the example
basicPaymentExample()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
