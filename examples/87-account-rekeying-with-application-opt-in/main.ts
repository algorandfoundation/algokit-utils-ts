import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * This example demonstrates account rekeying during an application opt-in.
 * 
 * Account rekeying allows you to change the private key that has signing
 * authority for an account, which is useful for:
 * - Security rotation
 * - Multi-sig setups
 * - Key management strategies
 * 
 * This example shows how to:
 * 1. Create and deploy an application
 * 2. Opt into the application while rekeying to a different account
 * 3. Use the rekeyed account to sign transactions
 */

async function main() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser account
  const dispenser = await algorand.account.localNetDispenser()

  // Create the main test account and fund it
  const testAccount = algorand.account.random()
  await algorand.account.ensureFunded(testAccount, dispenser, (10).algos())
  console.log('Main account address:', testAccount.addr)

  // Create a random account to rekey to
  // This account will gain signing authority over the main account
  const rekeyTo = algorand.account.random()
  console.log('Rekey target address:', rekeyTo.addr)

  // Create an app factory with TestingApp
  const factory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: testAccount.addr,
  })

  // Deploy the application
  console.log('\nDeploying application...')
  const { appClient } = await factory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 0,
      TMPL_DELETABLE: 0,
      TMPL_VALUE: 1,
    },
  })
  console.log('Application deployed with ID:', appClient.appId)

  // Opt into the application AND rekey the account in a single transaction
  console.log('\nOpting into application and rekeying account...')
  await appClient.send.optIn.optIn({
    args: [],
    rekeyTo, // Rekey to the new account during opt-in
  })
  console.log('✓ Account opted in and rekeyed successfully')
  console.log('  The testAccount is now controlled by rekeyTo\'s private key')

  // Create a rekeyed account object
  // This represents the original account (testAccount) but uses
  // the private key from rekeyTo for signing
  const rekeyedAccount = algorand.account.rekeyed(testAccount, rekeyTo)
  console.log('\nRekeyed account created:')
  console.log('  Address:', rekeyedAccount.addr, '(original address)')
  console.log('  Signer:', 'rekeyTo private key')

  // Test the rekey by sending a transaction
  // If the rekey didn't work, this will fail
  console.log('\nTesting rekeyed account by sending a payment...')
  const result = await algorand.send.payment({
    amount: (0).algos(), // Zero-amount payment to test signing
    sender: rekeyedAccount,
    receiver: testAccount.addr,
  })
  console.log('✓ Payment successful with transaction ID:', result.txIds[0])
  console.log('\n✓ Account rekeying confirmed working!')
  console.log('The rekeyed account can now sign transactions for the original address.')

  // Important notes
  console.log('\n📝 Important Notes:')
  console.log('  - The account address never changes (still testAccount.addr)')
  console.log('  - Only the signing authority changes (now rekeyTo\'s key)')
  console.log('  - All assets and apps remain at the original address')
  console.log('  - To rekey back, use the rekeyTo account to sign a rekey transaction')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})