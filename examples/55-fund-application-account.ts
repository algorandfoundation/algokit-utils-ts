import { algo, AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import appSpecJson from './artifacts/TestingApp.json'


/**
 * Example: Fund Application Account
 *
 * This example demonstrates how to fund an application's account with ALGOs.
 * Applications need funds to cover minimum balance requirements for their state storage,
 * such as global state, local state, and box storage.
 *
 * Key concepts:
 * - Application accounts have their own Algorand address
 * - Applications need ALGO to cover minimum balance requirements
 * - fundAppAccount() is a convenient method to send payment to app address
 */
async function main() {
  console.log('=== Fund Application Account Example ===')
  console.log()

  /**
   * Step 1: Initialize AlgorandClient and get test account
   */
  console.log('1. Initializing AlgorandClient and account...')
  const algorand = AlgorandClient.defaultLocalNet()
  const testAccount = await algorand.account.fromEnvironment('ACCOUNT')
  console.log(`   Using account: ${testAccount.addr}`)
  console.log()

  /**
   * Step 2: Deploy an application
   *
   * We need an application to demonstrate funding its account.
   */
  console.log('2. Deploying application...')

  const appSpec = appSpecJson as AppSpec

  const appFactory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: testAccount.addr,
  })

  // Provide deploy-time parameters for template variables
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

  /**
   * Step 3: Check initial application account balance
   */
  console.log('3. Checking initial application account balance...')
  const initialInfo = await algorand.account.getInformation(appClient.appAddress)
  console.log(`   Initial balance: ${initialInfo.balance.algo} ALGO`)
  console.log()

  /**
   * Step 4: Fund the application account
   *
   * The fundAppAccount() method is a convenience method that sends a payment
   * transaction from the sender to the application's address.
   */
  console.log('4. Funding application account...')
  const fundAmount = algo(2) // Fund with 2 ALGO

  console.log(`   Funding amount: ${fundAmount.algo} ALGO (${fundAmount.microAlgo} microAlgos)`)

  const result = await appClient.fundAppAccount({
    amount: fundAmount,
  })

  console.log(`   Transaction ID: ${result.txIds[0]}`)
  console.log(`   Confirmed in round: ${result.confirmation?.confirmedRound}`)
  console.log()

  /**
   * Step 5: Verify the new balance
   */
  console.log('5. Verifying updated application account balance...')
  const updatedInfo = await algorand.account.getInformation(appClient.appAddress)
  console.log(`   New balance: ${updatedInfo.balance.algo} ALGO`)
  console.log(`   Increase: ${Number(updatedInfo.balance.microAlgo - initialInfo.balance.microAlgo) / 1_000_000} ALGO`)
  console.log()

  console.log('✅ Successfully funded application account!')
  console.log()
  console.log('📝 Key Takeaways:')
  console.log('   • Applications have their own account address')
  console.log('   • Application accounts need ALGO for minimum balance requirements')
  console.log('   • fundAppAccount() sends a payment to the application address')
  console.log('   • Useful for covering costs of box storage, inner transactions, etc.')
}

// Run the example
main().catch(console.error)
