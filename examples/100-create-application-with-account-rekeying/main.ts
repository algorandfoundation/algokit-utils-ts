import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates account rekeying during application creation.
 * 
 * Account rekeying allows you to delegate signing authority from one account
 * to another. This is useful for:
 * - Security: Rotating keys without changing the account address
 * - Multisig: Delegating authority to a multisig account
 * - Smart contracts: Allowing a contract to control an account
 * 
 * This example shows:
 * 1. Creating an application with a rekey operation
 * 2. Using the rekeyed account for subsequent transactions
 */

async function createAppWithRekey() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a funded test account from the LocalNet dispenser
  const originalAccount = await algorand.account.localNet.dispenser()
  console.log('Original account address:', originalAccount.addr)

  // Create a new random account that will become the signing authority
  const newAuthority = algorand.account.random()
  console.log('New authority address:', newAuthority.addr)
  console.log('\nℹ️  After rekeying, transactions from', originalAccount.addr)
  console.log('   must be signed by', newAuthority.addr)

  // For this example, we'll use simple TEAL programs
  const approvalProgram = `
#pragma version 8
int 1
return
  `

  const clearStateProgram = `
#pragma version 8
int 1
return
  `

  // Compile the programs
  const approvalCompiled = await algorand.app.compileTeal(approvalProgram)
  const clearCompiled = await algorand.app.compileTeal(clearStateProgram)

  // Define the state schema
  const schema = {
    globalUints: 1,
    globalByteSlices: 1,
    localUints: 0,
    localByteSlices: 0,
  }

  console.log('\nCreating application and rekeying account...')

  // Create the application with a rekey operation
  // The rekeyTo parameter delegates signing authority to the new account
  const app = await algorand.send.appCreate({
    approvalProgram: approvalCompiled,
    clearStateProgram: clearCompiled,
    schema: schema,
    sender: originalAccount,
    rekeyTo: newAuthority, // This is the key parameter for rekeying
  })

  console.log('\n✅ Application created and account rekeyed!')
  console.log('App ID:', app.appId.toString())
  console.log('Transaction ID:', app.txIds[0])

  // Now the originalAccount is rekeyed to newAuthority
  // To use the original account, we need to create a rekeyed account object
  console.log('\nTesting rekeyed account...')
  const rekeyedAccount = algorand.account.rekeyed(originalAccount, newAuthority)
  console.log('Rekeyed account created - it uses:')
  console.log('  - Address:', originalAccount.addr, '(for sender/from)')
  console.log('  - Signing key:', newAuthority.addr, '(for authorization)')

  // Send a payment transaction using the rekeyed account
  // This transaction is FROM the original account address
  // but SIGNED by the new authority
  console.log('\nSending transaction from rekeyed account...')
  const payment = await algorand.send.payment({
    amount: (0).algo(), // Zero-amount payment for demonstration
    sender: rekeyedAccount,
    receiver: originalAccount.addr,
  })

  console.log('\n✅ Payment transaction successful!')
  console.log('Transaction ID:', payment.txIds[0])
  console.log('\n✓ This proves the rekey worked - the transaction was:')
  console.log('  - Sent FROM:', originalAccount.addr)
  console.log('  - Signed BY:', newAuthority.addr)

  console.log('\n⚠️  Important: From now on, all transactions from', originalAccount.addr)
  console.log('   must be signed using', newAuthority.addr)
  console.log('   The original signing key can no longer authorize transactions.')
}

// Run the example
createAppWithRekey()
  .then(() => console.log('\nExample completed successfully'))
  .catch((error) => {
    console.error('Error:', error.message)
    process.exit(1)
  })