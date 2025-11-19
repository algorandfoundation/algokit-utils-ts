import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

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
 * 3. Understanding the difference between account address and signing authority
 */

async function createAppWithRekey() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create and fund the account that will be rekeyed
  const originalAccount = algorand.account.random()
  await algorand.account.ensureFunded(originalAccount, dispenser, (5).algos())

  console.log('Original account address:', originalAccount.addr.toString())
  console.log('Original account has funds and signing authority')
  console.log()

  // Create a new random account that will become the signing authority
  const newAuthority = algorand.account.random()
  console.log('New authority address:', newAuthority.addr.toString())
  console.log('This account will become the signing authority after rekey')
  console.log()

  console.log('ℹ️  After rekeying:')
  console.log(`  - Transactions FROM ${originalAccount.addr.toString().slice(0, 8)}...`)
  console.log(`  - Must be SIGNED BY ${newAuthority.addr.toString().slice(0, 8)}...`)
  console.log()

  // Get the typed app factory
  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: originalAccount.addr,
  })

  console.log('Creating application and rekeying account...')

  // Create the application with a rekey operation
  // The rekeyTo parameter delegates signing authority to the new account
  const { appClient, result } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 100,
    },
    rekeyTo: newAuthority.addr, // This is the key parameter for rekeying
  })

  const appId = BigInt(result.appId)

  console.log()
  console.log('✅ Application created and account rekeyed!')
  console.log('App ID:', appId)
  console.log('App Address:', result.appAddress)
  console.log('Transaction ID:', result.txIds[0])
  console.log()

  // Now the originalAccount is rekeyed to newAuthority
  // To use the original account, we need to create a rekeyed account object
  console.log('=== Testing Rekeyed Account ===')
  console.log()
  const rekeyedAccount = algorand.account.rekeyed(originalAccount.addr, newAuthority)

  console.log('Created rekeyed account object:')
  console.log('  - Address (sender):', rekeyedAccount.addr.toString())
  console.log('  - Signing authority:', newAuthority.addr.toString())
  console.log()

  // Send a payment transaction using the rekeyed account
  // This transaction is FROM the original account address
  // but SIGNED by the new authority
  console.log('Sending payment from rekeyed account...')
  const payment = await algorand.send.payment({
    amount: (0.1).algos(),
    sender: rekeyedAccount.addr,
    receiver: dispenser.addr,
  })

  console.log()
  console.log('✅ Payment transaction successful!')
  console.log('Transaction ID:', payment.txIds[0])
  console.log()

  console.log('✓ This proves the rekey worked:')
  console.log(`  - Transaction was FROM: ${originalAccount.addr.toString().slice(0, 8)}...`)
  console.log(`  - But SIGNED BY: ${newAuthority.addr.toString().slice(0, 8)}...`)
  console.log()

  console.log('⚠️  Important Security Note:')
  console.log(`  - All future transactions from ${originalAccount.addr.toString().slice(0, 8)}...`)
  console.log(`  - Must be signed using ${newAuthority.addr.toString().slice(0, 8)}...`)
  console.log('  - The original signing key can NO LONGER authorize transactions')
  console.log('  - The account address remains the same, only the signing authority changed')
  console.log()

  console.log('✅ Example completed successfully!')
}

// Run the example
createAppWithRekey().catch(console.error)
