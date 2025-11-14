import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to perform account rekeying operations.
 *
 * Account rekeying allows one account to be controlled by another account's keys,
 * which is useful for:
 * - Key rotation and security upgrades
 * - Account recovery mechanisms
 * - Multi-signature and custody solutions
 * - Transferring control without changing the account address
 *
 * Key concepts:
 * - Original account address remains the same
 * - Auth address (authorization address) points to the controlling account
 * - Transactions for the rekeyed account must be signed by the auth account
 */

async function main() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  console.log('Creating two accounts for rekeying demonstration...\n')

  // Get dispenser account for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Step 1: Create the account that will be rekeyed
  // This account needs funds to pay for the rekey transaction
  const originalAccount = await algorand.account.random()
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: originalAccount.addr,
    amount: algo(1), // 1 ALGO
  })
  console.log(`Original account address: ${originalAccount.addr}`)

  // Step 2: Create the account that will become the new authority
  // This account also needs some funds for future transactions
  const newAuthAccount = await algorand.account.random()
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: newAuthAccount.addr,
    amount: algo(0.1), // 0.1 ALGO
  })
  console.log(`New auth account address: ${newAuthAccount.addr}\n`)

  // Step 3: Rekey the original account to be controlled by the new auth account
  console.log('Rekeying account...')
  await algorand.send.payment({
    sender: originalAccount.addr,
    receiver: originalAccount.addr,
    amount: algo(0),
    rekeyTo: newAuthAccount.addr,
    signer: originalAccount,
  })
  console.log('Rekey transaction completed!\n')

  // Step 4: Retrieve and display the account information
  const accountInfo = await algorand.account.getInformation(originalAccount.addr)

  console.log('Account information after rekeying:')
  console.log(`- Account address: ${accountInfo.address}`)

  // The auth address will be in the authAddr property
  const authAddr = accountInfo.authAddr
  console.log(`- Auth address (controlling account): ${authAddr || 'None'}\n`)

  // Verify the rekeying was successful
  // Convert both to strings for comparison since one might be an Address object
  if (authAddr && authAddr.toString() === newAuthAccount.addr.toString()) {
    console.log('✓ Rekeying successful!')
    console.log('\nThe original account is now controlled by the new auth account.')
    console.log('All future transactions from the original account must be signed')
    console.log("by the new auth account's private key.")
  } else {
    console.log('✗ Rekeying failed - auth address does not match')
  }
}

main().catch(console.error)
