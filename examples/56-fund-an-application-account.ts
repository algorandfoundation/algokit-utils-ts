import { algo, AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import { TransactionType } from 'algosdk'
import appSpecJson from './artifacts/TestingApp.json'


/**
 * This example demonstrates how to fund an application account.
 *
 * Applications need funding for:
 * - Minimum balance requirements (100,000 microAlgos base)
 * - Box storage (2,500 + 400 per byte microAlgos)
 * - Creating assets (100,000 microAlgos per asset)
 * - Sending inner transactions (transaction fees)
 * - Holding algos for various operations
 */

async function main() {
  console.log('=== Fund an Application Account ===')
  console.log()

  // Initialize the AlgorandClient for LocalNet
  console.log('1. Initializing AlgorandClient...')
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account with funds
  const testAccount = await algorand.account.fromEnvironment('ACCOUNT')
  console.log(`   Using account: ${testAccount.addr}`)
  console.log()

  // Deploy an application
  console.log('2. Deploying application...')

  const appSpec = appSpecJson as AppSpec

  const appFactory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: testAccount.addr,
  })

  const deployTimeParams = {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 42,
  }

  const { appClient } = await appFactory.send.bare.create({
    deployTimeParams,
  })

  console.log(`   Application deployed with ID: ${appClient.appId}`)
  console.log(`   Application address: ${appClient.appAddress}`)
  console.log()

  // Check the app account balance before funding
  console.log('3. Checking app account balance before funding...')
  const accountInfoBefore = await algorand.account.getInformation(appClient.appAddress)
  console.log(`   Balance: ${accountInfoBefore.balance.algo} ALGO (${accountInfoBefore.balance.microAlgo} microAlgos)`)
  console.log()

  // Define the amount to fund
  const fundAmount = algo(0.2) // 200,000 microAlgos = 0.2 Algos
  console.log('4. Funding app account...')
  console.log(`   Funding amount: ${fundAmount.algo} ALGO (${fundAmount.microAlgo} microAlgos)`)

  // Fund the application account
  const result = await appClient.fundAppAccount({
    amount: fundAmount,
  })

  console.log(`   Transaction ID: ${result.txIds[0]}`)
  console.log(`   Confirmed in round: ${result.confirmation?.confirmedRound}`)
  console.log()

  // Verify the transaction details
  console.log('5. Verifying transaction details...')
  console.log(`   Transaction type: ${result.transaction.type}`)

  if (result.transaction.type === TransactionType.pay) {
    console.log('   ✓ Transaction type is payment')
  }

  const receiver = result.transaction.payment?.receiver?.toString()
  if (receiver === appClient.appAddress.toString()) {
    console.log('   ✓ Receiver is the application address')
  }

  const sender = result.transaction.sender.toString()
  if (sender === testAccount.addr.toString()) {
    console.log('   ✓ Sender is the test account')
  }
  console.log()

  // Check the app account balance after funding
  console.log('6. Checking app account balance after funding...')
  const accountInfoAfter = await algorand.account.getInformation(appClient.appAddress)
  console.log(`   Balance: ${accountInfoAfter.balance.algo} ALGO (${accountInfoAfter.balance.microAlgo} microAlgos)`)

  const increase = Number(accountInfoAfter.balance.microAlgo - accountInfoBefore.balance.microAlgo)
  console.log(`   Balance increased by: ${increase} microAlgos (${increase / 1_000_000} ALGO)`)
  console.log()

  console.log('✅ App account funded successfully!')
  console.log()
  console.log('📝 Use cases for funding app accounts:')
  console.log('   • Minimum balance: 100,000 microAlgos for app existence')
  console.log('   • Box storage: 2,500 + 400 per byte microAlgos')
  console.log('   • Asset creation: 100,000 microAlgos per asset')
  console.log('   • Inner transactions: Need sufficient balance for fees')
  console.log('   • Application logic: Holding algos for various operations')
}

main().catch(console.error)
