import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to rekey an account during an application opt-in.
 * Rekeying allows you to change the spending authority of an account to a different key,
 * which is useful for security patterns like key rotation and multi-sig setups.
 */

async function rekeyAccountDuringOptIn() {
  console.log('=== Rekey Account During Application Opt-In ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account with funds from the dispenser
  const dispenser = await algorand.account.localNetDispenser()
  const testAccount = algorand.account.random()

  console.log('Setting up accounts...')

  // Fund the test account
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: testAccount.addr,
    amount: (10).algos(),
  })

  // Create a random account to rekey to
  const rekeyTarget = algorand.account.random()

  console.log('Original account address:', testAccount.addr)
  console.log('Rekey target address:', rekeyTarget.addr)
  console.log()

  // Deploy a simple smart contract that allows opt-in
  console.log('Deploying smart contract...')

  const approvalProgram = `#pragma version 10

txn ApplicationID
int 0
==
bnz create

// Handle opt-in
txn OnCompletion
int OptIn
==
bnz handle_opt_in

// Reject other calls (including update and delete)
int 0
return

create:
int 1
return

handle_opt_in:
// Accept all opt-ins
int 1
return`

  const clearProgram = `#pragma version 10
int 1
return`

  const appResult = await algorand.send.appCreate({
    sender: testAccount.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 0,
      localInts: 1,
      localByteSlices: 0,
    },
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
  })

  const appId = appResult.appId
  console.log('✅ Application deployed')
  console.log('   App ID:', appId)
  console.log('   App Address:', algosdk.getApplicationAddress(appId))
  console.log()

  // Check account info before rekeying
  const accountInfoBefore = await algorand.account.getInformation(testAccount.addr)
  console.log('Account info before rekeying:')
  console.log('   Address:', accountInfoBefore.address)
  console.log('   Auth Address:', accountInfoBefore.authAddr || '(none - using original key)')
  console.log('   Balance:', accountInfoBefore.balance.microAlgo, 'microALGOs')
  console.log()

  // Opt-in to the application and rekey the account in the same transaction
  console.log('Opting in to application and rekeying account...')

  await algorand.send.appCall({
    sender: testAccount.addr,
    appId: appId,
    onComplete: algosdk.OnApplicationComplete.OptInOC,
    rekeyTo: rekeyTarget.addr, // This parameter rekeys the account to the new address
  })

  console.log('✅ Opt-in successful and account rekeyed!')
  console.log()

  // Check account info after rekeying
  const accountInfoAfter = await algorand.account.getInformation(testAccount.addr)
  console.log('Account info after rekeying:')
  console.log('   Address:', accountInfoAfter.address)
  console.log('   Auth Address:', accountInfoAfter.authAddr)
  console.log('   Balance:', accountInfoAfter.balance.microAlgo, 'microALGOs')
  console.log()

  console.log('⚠️  Important: The account address remains', testAccount.addr)
  console.log('   but all future transactions must be signed by', rekeyTarget.addr)
  console.log()

  // Create a rekeyed account object that can be used for transactions
  // This combines the original address with the new signing authority
  const rekeyedAccount = algorand.account.rekeyed(testAccount.addr, rekeyTarget)

  console.log('Testing rekeyed account by sending a payment...')

  // Send a payment using the rekeyed account
  // The transaction is sent FROM testAccount.addr but signed WITH rekeyTarget's key
  const paymentResult = await algorand.send.payment({
    sender: rekeyedAccount.addr,
    receiver: dispenser.addr,
    amount: (0.001).algos(),
    note: new TextEncoder().encode('Payment from rekeyed account'),
  })

  console.log('✅ Payment transaction successful!')
  console.log('   Transaction ID:', paymentResult.txIds[0])
  console.log('   Sent from address:', testAccount.addr)
  console.log('   Signed by:', rekeyTarget.addr)
  console.log()

  // Demonstrate what happens if you try to use the original key
  console.log('What happens if you try to use the original key?')
  console.log('   The SDK will still work if you pass the original account object')
  console.log('   because it contains both the address and the original signing key.')
  console.log('   However, on-chain, the account has been rekeyed!')
  console.log()

  console.log('To verify rekeying worked, check the auth-addr field above.')
  console.log('The auth-addr now points to the rekey target, proving the rekey succeeded.')
  console.log()

  console.log('=== Key Takeaways ===\n')
  console.log('✓ Rekeying changes the signing authority without changing the address')
  console.log('✓ You can rekey during any transaction (opt-in, payment, app call, etc.)')
  console.log('✓ Use algorand.account.rekeyed() to create a rekeyed account object')
  console.log('✓ The rekeyed account maintains the original address but uses the new key')
  console.log('✓ All balances, assets, and app state remain at the original address')
  console.log('✓ Useful for key rotation, security upgrades, and multi-sig patterns')
  console.log()

  console.log('✨ Example completed successfully!')
}

// Run the example
rekeyAccountDuringOptIn().catch(console.error)
