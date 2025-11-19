import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates account rekeying functionality.
 *
 * Rekeying allows you to change the private key that controls an account
 * WITHOUT changing the account's address. This is useful for:
 * - Key rotation for security purposes
 * - Transferring account control while maintaining the same address
 * - Implementing multi-signature or smart signature authorization
 */
async function rekeyAccount() {
  // Create an Algorand client connected to LocalNet for testing
  const algorand = AlgorandClient.defaultLocalNet()

  // Get dispenser account for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create and fund the original account
  const originalAccount = await algorand.account.random()
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: originalAccount.addr,
    amount: algo(10), // Fund with 10 ALGO
  })

  console.log('Original account address:', originalAccount.addr.toString())
  console.log('Original account can sign transactions with its own private key')

  // Create a second account that will become the new authorization for the first account
  const newAuthAccount = await algorand.account.random()
  console.log('New authorization account address:', newAuthAccount.addr.toString())

  // Perform the rekey operation
  // After this, originalAccount's address stays the same, but newAuthAccount's
  // private key must be used to sign transactions FROM originalAccount
  console.log('\nRekeying the original account to be controlled by the new account...')

  await algorand.send.payment({
    sender: originalAccount.addr,
    receiver: originalAccount.addr,
    amount: algo(0), // Zero-amount payment for rekey
    rekeyTo: newAuthAccount.addr,
    signer: originalAccount,
    note: 'Rekey for security purposes',
  })

  console.log('Rekey successful!')
  console.log('The original account address is still:', originalAccount.addr.toString())
  console.log('But it must now use the new authorization account to sign transactions')

  // Verify the rekey was successful by sending a transaction
  // Notice: sender is originalAccount, but signer is newAuthAccount
  console.log('\nVerifying rekey by sending a payment from the rekeyed account...')

  const txn = await algorand.send.payment({
    sender: originalAccount.addr, // The account address that's sending (unchanged)
    receiver: originalAccount.addr, // Sending to itself for demonstration
    amount: algo(0.001),
    signer: newAuthAccount, // Must use the NEW account's signer after rekey!
  })

  console.log('Payment successful! Transaction ID:', txn.transaction.txID())
  console.log('\nThis confirms the rekey worked:')
  console.log('- Transaction was sent FROM the original account address')
  console.log('- But it was SIGNED by the new authorization account')
  console.log("\nNote: If you tried to sign with the original account's key, it would fail!")
}

// Run the example
rekeyAccount().catch(console.error)
