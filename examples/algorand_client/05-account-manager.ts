/**
 * Example: Account Manager
 *
 * This example demonstrates how to use the account manager to create, import,
 * and manage accounts including:
 * - algorand.account.random() to generate a new random account
 * - algorand.account.fromMnemonic() to import from 25-word mnemonic
 * - algorand.account.fromEnvironment() to load from env var
 * - algorand.account.fromKmd() to get account from KMD wallet
 * - algorand.account.multisig() to create a multisig account
 * - algorand.account.logicsig() to create a logic signature account
 * - algorand.account.rekeyed() to create a rekeyed account reference
 * - algorand.account.getInformation() to fetch account details from network
 * - algorand.account.ensureFunded() to ensure account has minimum balance
 * - algorand.account.ensureFundedFromEnvironment() for dispenser funding
 *
 * Prerequisites:
 * - LocalNet running (via `algokit localnet start`)
 */

import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import { MultisigMetadata } from '@algorandfoundation/algokit-utils/transact'
import {
  formatAlgo,
  formatBytes,
  loadTealSource,
  printError,
  printHeader,
  printInfo,
  printStep,
  printSuccess,
  shortenAddress,
} from '../shared/utils.js'

async function main() {
  printHeader('Account Manager Example')

  // Initialize client and verify LocalNet is running
  const algorand = AlgorandClient.defaultLocalNet()

  try {
    await algorand.client.algod.status()
    printSuccess('Connected to LocalNet')
  } catch (error) {
    printError(`Failed to connect to LocalNet: ${error instanceof Error ? error.message : String(error)}`)
    printInfo('Make sure LocalNet is running (e.g., algokit localnet start)')
    return
  }

  // Step 1: Generate a random account with algorand.account.random()
  printStep(1, 'Generate random account with algorand.account.random()')
  printInfo('random() creates a new account with a randomly generated keypair')
  printInfo('The account is automatically registered with its signer in AccountManager')

  const randomAccount = algorand.account.random()

  printInfo(`\nRandom account created:`)
  printInfo(`  addr (Address object): ${randomAccount.addr.toString()}`)
  printInfo(`  toString(): ${randomAccount.toString()} (same as addr.toString())`)
  printInfo(`  publicKey: ${formatBytes(randomAccount.publicKey)}`)
  printInfo(`  signer: [TransactionSigner function] - automatically registered`)

  printSuccess('Generated random account')

  // Step 2: Import account from 25-word mnemonic with algorand.account.fromMnemonic()
  printStep(2, 'Import account from mnemonic with algorand.account.fromMnemonic()')
  printInfo('fromMnemonic() loads an account from a 25-word mnemonic secret')
  printInfo('WARNING: Never commit mnemonics to source control!')

  // Generate a test mnemonic for demo purposes
  // In practice, you would load this from environment variables or secure storage
  const { mnemonicFromSeed } = await import('@algorandfoundation/algokit-algo25')

  // Create a random 32-byte seed and generate a mnemonic from it
  const randomSeed = crypto.getRandomValues(new Uint8Array(32))
  const demoMnemonic = mnemonicFromSeed(randomSeed)

  printInfo(`\nExample mnemonic (first 5 words): "${demoMnemonic.split(' ').slice(0, 5).join(' ')}..."`)

  // Import using the mnemonic
  const mnemonicAccount = algorand.account.fromMnemonic(demoMnemonic)

  printInfo(`\nMnemonic account imported:`)
  printInfo(`  addr: ${shortenAddress(mnemonicAccount.addr.toString())}`)
  printInfo(`  signer: [TransactionSigner function] - ready for signing`)

  printSuccess('Imported account from mnemonic')

  // Step 3: Load account from environment with algorand.account.fromEnvironment()
  printStep(3, 'Load account from environment with algorand.account.fromEnvironment()')
  printInfo('fromEnvironment() loads account based on environment variable conventions:')
  printInfo('')
  printInfo('Non-LocalNet convention:')
  printInfo('  - Loads {NAME}_MNEMONIC as mnemonic secret')
  printInfo('  - Optionally loads {NAME}_SENDER for rekeyed accounts')
  printInfo('')
  printInfo('LocalNet convention:')
  printInfo('  - Creates/retrieves a KMD wallet named {NAME}')
  printInfo('  - Auto-funds with 1000 ALGO by default')

  // On LocalNet, this will create a wallet named "DEMO" and fund it
  const envAccount = await algorand.account.fromEnvironment('DEMO', algo(10))

  printInfo(`\nEnvironment account loaded (LocalNet wallet "DEMO"):`)
  printInfo(`  addr: ${shortenAddress(envAccount.addr.toString())}`)

  // Verify it was funded
  const envInfo = await algorand.account.getInformation(envAccount.addr)
  printInfo(`  balance: ${formatAlgo(envInfo.balance)}`)

  printSuccess('Loaded account from environment')

  // Step 4: Get account from KMD wallet with algorand.account.fromKmd()
  printStep(4, 'Get account from KMD wallet with algorand.account.fromKmd()')
  printInfo('fromKmd() retrieves an account from a KMD wallet by name')
  printInfo('Optional predicate filter to find specific accounts')

  // Get an account from the default LocalNet wallet
  const kmdAccount = await algorand.account.fromKmd(
    'unencrypted-default-wallet',
    (a) => a.status !== 'Offline' && a.amount > 1_000_000_000, // Filter: online accounts with > 1000 ALGO
  )

  printInfo(`\nKMD account retrieved:`)
  printInfo(`  addr: ${shortenAddress(kmdAccount.addr.toString())}`)
  printInfo(`  wallet: unencrypted-default-wallet`)

  const kmdInfo = await algorand.account.getInformation(kmdAccount.addr)
  printInfo(`  balance: ${formatAlgo(kmdInfo.balance)}`)

  printSuccess('Retrieved account from KMD wallet')

  // Step 5: Create a multisig account with algorand.account.multisig()
  printStep(5, 'Create multisig account with algorand.account.multisig()')
  printInfo('multisig() creates a multisig account from multiple sub-signers')
  printInfo('Requires: version, threshold (min signatures), and participant addresses')

  // Create 3 accounts for the multisig
  const msig1 = algorand.account.random()
  const msig2 = algorand.account.random()
  const msig3 = algorand.account.random()

  const multisigParams: MultisigMetadata = {
    version: 1, // Multisig version (always 1)
    threshold: 2, // Require 2 of 3 signatures
    addrs: [msig1.addr, msig2.addr, msig3.addr], // Participant addresses (order matters!)
  }

  // Create multisig with 2 sub-signers (accounts 1 and 2)
  const multisigAccount = algorand.account.multisig(multisigParams, [msig1, msig2])

  printInfo(`\nMultisig account created:`)
  printInfo(`  addr: ${shortenAddress(multisigAccount.addr.toString())}`)
  printInfo(`  version: ${multisigParams.version}`)
  printInfo(`  threshold: ${multisigParams.threshold} of ${multisigParams.addrs.length}`)
  printInfo(`  participants:`)
  printInfo(`    1: ${shortenAddress(msig1.addr.toString())}`)
  printInfo(`    2: ${shortenAddress(msig2.addr.toString())}`)
  printInfo(`    3: ${shortenAddress(msig3.addr.toString())}`)
  printInfo(`  signer: [MultisigSigner function] - signs with accounts 1 and 2`)

  printSuccess('Created multisig account')

  // Step 6: Create a logic signature account with algorand.account.logicsig()
  printStep(6, 'Create logic signature account with algorand.account.logicsig()')
  printInfo('logicsig() creates an account backed by a compiled TEAL program')
  printInfo('The program defines the conditions under which transactions are approved')

  // Load TEAL program that always approves (for demo purposes only!)
  // In production, use meaningful logic that validates transactions
  const tealSource = loadTealSource('always-approve.teal')

  // Compile the TEAL program using algorand.app.compileTeal()
  const compileResult = await algorand.app.compileTeal(tealSource)
  const program = compileResult.compiledBase64ToBytes

  // Create the logic signature account
  const logicsigAccount = algorand.account.logicsig(program)

  printInfo(`\nLogic signature account created:`)
  printInfo(`  addr: ${shortenAddress(logicsigAccount.addr.toString())}`)
  printInfo(`  program hash: ${logicsigAccount.addr.toString().slice(0, 16)}...`)
  printInfo(`  program size: ${program.length} bytes`)
  printInfo(`  signer: [LogicSigSigner function] - evaluates TEAL program`)
  printInfo('')
  printInfo('Note: Logic sig address is derived from the program hash')
  printInfo('Anyone can send transactions from this address if the program approves')

  printSuccess('Created logic signature account')

  // Step 7: Create a rekeyed account reference with algorand.account.rekeyed()
  printStep(7, 'Create rekeyed account with algorand.account.rekeyed()')
  printInfo('rekeyed() creates a reference to an account that has been rekeyed')
  printInfo('The "sender" is the original address, but signing uses a different account')

  // Create an account that will be the "auth" account (the one that signs)
  const authAccount = algorand.account.random()

  // Create a rekeyed reference: sender = randomAccount, but auth = authAccount
  const rekeyedAccount = algorand.account.rekeyed(randomAccount.addr, authAccount)

  printInfo(`\nRekeyed account reference created:`)
  printInfo(`  sender addr: ${shortenAddress(rekeyedAccount.addr.toString())}`)
  printInfo(`  auth account: ${shortenAddress(authAccount.addr.toString())}`)
  printInfo(`  signer: Uses authAccount's signer`)
  printInfo('')
  printInfo('Use case: After rekeying account A to account B,')
  printInfo('transactions from A are signed by B\'s private key')

  printSuccess('Created rekeyed account reference')

  // Step 8: Fetch account information with algorand.account.getInformation()
  printStep(8, 'Fetch account info with algorand.account.getInformation()')
  printInfo('getInformation() fetches current account status from the network')
  printInfo('Returns balance, min balance, rewards, opted-in assets/apps, and more')

  // Get the dispenser account to demonstrate
  const dispenser = await algorand.account.dispenserFromEnvironment()
  const accountInfo = await algorand.account.getInformation(dispenser.addr)

  printInfo(`\nAccount information for dispenser:`)
  printInfo(`  address: ${shortenAddress(accountInfo.address.toString())}`)
  printInfo(`  balance: ${formatAlgo(accountInfo.balance)}`)
  printInfo(`  minBalance: ${formatAlgo(accountInfo.minBalance)}`)
  printInfo(`  spendable: ${formatAlgo(accountInfo.balance.microAlgo - accountInfo.minBalance.microAlgo)} (balance - minBalance)`)
  printInfo(`  pendingRewards: ${formatAlgo(accountInfo.pendingRewards)}`)
  printInfo(`  totalRewards: ${formatAlgo(accountInfo.rewards)}`)
  printInfo(`  status: ${accountInfo.status}`)
  printInfo(`  validAsOfRound: ${accountInfo.validAsOfRound}`)
  printInfo(`  totalAppsOptedIn: ${accountInfo.totalAppsOptedIn}`)
  printInfo(`  totalAssetsOptedIn: ${accountInfo.totalAssetsOptedIn}`)
  printInfo(`  totalCreatedApps: ${accountInfo.totalCreatedApps}`)
  printInfo(`  totalCreatedAssets: ${accountInfo.totalCreatedAssets}`)
  if (accountInfo.authAddr) {
    printInfo(`  authAddr (rekey): ${accountInfo.authAddr}`)
  }

  printSuccess('Fetched account information')

  // Step 9: Ensure account is funded with algorand.account.ensureFunded()
  printStep(9, 'Ensure account is funded with algorand.account.ensureFunded()')
  printInfo('ensureFunded() funds an account to have a minimum spending balance')
  printInfo('Only sends funds if needed (idempotent)')
  printInfo('minSpendingBalance is the balance ABOVE the minimum balance requirement')

  // Create a new account to fund
  const accountToFund = algorand.account.random()

  printInfo(`\nNew account: ${shortenAddress(accountToFund.addr.toString())}`)

  // Check initial balance
  const beforeInfo = await algorand.account.getInformation(accountToFund.addr)
  printInfo(`Initial balance: ${formatAlgo(beforeInfo.balance)}`)

  // Ensure it has at least 5 ALGO to spend
  const fundResult = await algorand.account.ensureFunded(
    accountToFund.addr,
    dispenser.addr,
    algo(5), // Minimum spending balance (above min balance requirement)
  )

  if (fundResult) {
    printInfo(`\nFunding transaction:`)
    printInfo(`  txId: ${fundResult.transactionId}`)
    printInfo(`  amountFunded: ${formatAlgo(fundResult.amountFunded)}`)
  } else {
    printInfo(`No funding needed - account already has sufficient balance`)
  }

  // Check new balance
  const afterInfo = await algorand.account.getInformation(accountToFund.addr)
  printInfo(`New balance: ${formatAlgo(afterInfo.balance)}`)
  printInfo(`Min balance: ${formatAlgo(afterInfo.minBalance)}`)
  printInfo(`Spendable: ${formatAlgo(afterInfo.balance.microAlgo - afterInfo.minBalance.microAlgo)}`)

  // Call again to show it's idempotent
  const fundResult2 = await algorand.account.ensureFunded(accountToFund.addr, dispenser.addr, algo(5))

  if (!fundResult2) {
    printInfo(`\nSecond call: No funding needed (idempotent)`)
  }

  printSuccess('Demonstrated ensureFunded()')

  // Step 10: Ensure funded from environment with algorand.account.ensureFundedFromEnvironment()
  printStep(10, 'Ensure funded from environment with algorand.account.ensureFundedFromEnvironment()')
  printInfo('ensureFundedFromEnvironment() uses the dispenser from environment variables')
  printInfo('On LocalNet: uses default LocalNet dispenser')
  printInfo('On other networks: uses DISPENSER_MNEMONIC env var')

  // Create another account to fund
  const accountToFund2 = algorand.account.random()

  printInfo(`\nNew account: ${shortenAddress(accountToFund2.addr.toString())}`)

  // Fund using environment dispenser
  const envFundResult = await algorand.account.ensureFundedFromEnvironment(
    accountToFund2.addr,
    algo(2), // Minimum spending balance
    { minFundingIncrement: algo(5) }, // But fund at least 5 ALGO when funding
  )

  if (envFundResult) {
    printInfo(`\nFunding from environment:`)
    printInfo(`  txId: ${envFundResult.transactionId}`)
    printInfo(`  amountFunded: ${formatAlgo(envFundResult.amountFunded)}`)
    printInfo(`  Note: minFundingIncrement(5) > minSpendingBalance(2)`)
  }

  const afterInfo2 = await algorand.account.getInformation(accountToFund2.addr)
  printInfo(`Final balance: ${formatAlgo(afterInfo2.balance)}`)

  printSuccess('Demonstrated ensureFundedFromEnvironment()')

  // Step 11: Account properties summary
  printStep(11, 'Account properties summary')
  printInfo('All account types share common properties:')
  printInfo('')
  printInfo('addr (Address):')
  printInfo('  - The Address object containing the account address')
  printInfo('  - Use .toString() to get the 58-character string representation')
  printInfo('')
  printInfo('publicKey (Uint8Array):')
  printInfo('  - The 32-byte public key')
  printInfo('  - Used for cryptographic operations')
  printInfo('')
  printInfo('signer (TransactionSigner):')
  printInfo('  - Function that signs transaction groups')
  printInfo('  - Automatically used when sending transactions')
  printInfo('')
  printInfo('Different account types may have additional properties:')
  printInfo('  - MultisigAccount: .account.params (multisig metadata)')
  printInfo('  - LogicSigAccount: .account (underlying logic sig)')
  printInfo('  - Rekeyed: .account (underlying auth account)')

  // Demonstrate accessing properties
  printInfo(`\nExample - Random account properties:`)
  printInfo(`  randomAccount.addr: ${randomAccount.addr}`)
  printInfo(`  randomAccount.toString(): ${randomAccount.toString()}`)
  printInfo(`  randomAccount.publicKey: Uint8Array(${randomAccount.publicKey.length})`)
  printInfo(`  randomAccount.signer: [Function]`)

  printInfo(`\nExample - Multisig account properties:`)
  printInfo(`  multisigAccount.addr: ${shortenAddress(multisigAccount.addr.toString())}`)
  printInfo(`  multisigAccount.account.params: { version: 1, threshold: 2, addrs: [...] }`)

  printSuccess('Account properties summary complete')

  // Step 12: Summary
  printStep(12, 'Summary')
  printInfo('Account creation methods:')
  printInfo('')
  printInfo('random():')
  printInfo('  - Generates new random keypair')
  printInfo('  - Account is automatically tracked for signing')
  printInfo('  - Returns Address & AddressWithSigners')
  printInfo('')
  printInfo('fromMnemonic(mnemonic, sender?):')
  printInfo('  - Imports from 25-word mnemonic')
  printInfo('  - Optional sender for rekeyed accounts')
  printInfo('  - Returns AddressWithTransactionSigner')
  printInfo('')
  printInfo('fromEnvironment(name, fundWith?):')
  printInfo('  - LocalNet: creates/gets KMD wallet, auto-funds')
  printInfo('  - Other: loads {NAME}_MNEMONIC env var')
  printInfo('  - Returns AddressWithTransactionSigner')
  printInfo('')
  printInfo('fromKmd(walletName, predicate?, sender?):')
  printInfo('  - Gets account from KMD wallet by name')
  printInfo('  - Optional predicate to filter accounts')
  printInfo('  - Returns AddressWithTransactionSigner')
  printInfo('')
  printInfo('multisig(params, subSigners):')
  printInfo('  - Creates multisig from sub-signers')
  printInfo('  - Returns Address & AddressWithTransactionSigner')
  printInfo('')
  printInfo('logicsig(program, args?):')
  printInfo('  - Creates logic signature account')
  printInfo('  - Returns Address & AddressWithTransactionSigner')
  printInfo('')
  printInfo('rekeyed(sender, authAccount):')
  printInfo('  - Creates rekeyed account reference')
  printInfo('  - Returns Address & AddressWithTransactionSigner')
  printInfo('')
  printInfo('Account operations:')
  printInfo('')
  printInfo('getInformation(address):')
  printInfo('  - Fetches account details from network')
  printInfo('  - Returns AccountInformation with balance, etc.')
  printInfo('')
  printInfo('ensureFunded(accountToFund, dispenser, minSpending):')
  printInfo('  - Funds account to have min spending balance')
  printInfo('  - Idempotent - only funds if needed')
  printInfo('')
  printInfo('ensureFundedFromEnvironment(accountToFund, minSpending):')
  printInfo('  - Same as ensureFunded but uses env dispenser')
  printInfo('  - LocalNet: default dispenser, Other: DISPENSER_MNEMONIC')

  printSuccess('Account Manager example completed!')
}

main().catch((error) => {
  printError(`Unhandled error: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
