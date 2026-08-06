/* eslint-disable no-console -- examples print their results to demonstrate output */
/**
 * Demonstrates creating, funding, signing with and rekeying accounts via the AccountManager.
 *
 * This maps to the Concepts -> Accounts docs page. Each marked region is
 * rendered into the page via RemoteCode, so the code shown in the docs is real,
 * executed code. It covers creating accounts (random, mnemonic, environment,
 * KMD), funding them from a dispenser, registering and overriding signers,
 * building a multisig account, and rekeying an account.
 *
 * Prerequisites: a running LocalNet (`algokit localnet start`).
 * Run with: tsx --tsconfig examples/tsconfig.json examples/concepts/accounts.algo.ts
 */

import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import { AccountManager } from '@algorandfoundation/algokit-utils/types/account-manager'
import { KmdAccountManager } from '@algorandfoundation/algokit-utils/types/kmd-account-manager'
import { MultisigAccount, SigningAccount } from '@algorandfoundation/algokit-utils/types/account'

// A throwaway 25-word mnemonic used only to demonstrate account recovery.
// Never commit a real mnemonic to source control — load it from the
// environment or a secret store instead.
const EXAMPLE_MNEMONIC =
  'clap worry canvas hammer kangaroo seed elephant alien online mouse razor add ' +
  'tomorrow arch segment coconut argue month ensure strike fish nice blood about city'

/** Selects an online, well-funded KMD account, such as the default dispenser. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the KMD account shape is untyped
function isFundedDispenser(account: Record<string, any>): boolean {
  return account.status !== 'Offline' && account.amount > 1_000_000_000
}

async function main() {
  const algorand = AlgorandClient.defaultLocalNet()

  // Set the suggested params cache timeout to 0 to avoid 'transaction already in
  // ledger' errors when this example sends otherwise-identical transactions.
  algorand.setSuggestedParamsCacheTimeout(0)

  // example: ACCOUNT_MANAGER
  const accountManager = new AccountManager(algorand.client)
  // example: ACCOUNT_MANAGER

  if (!accountManager) throw new Error('Expected an AccountManager instance')

  // --- Create accounts ---

  // example: RANDOM_ACCOUNT
  const randomAccount = algorand.account.random()
  // example: RANDOM_ACCOUNT

  // example: FROM_MNEMONIC
  const mnemonicAccount = algorand.account.fromMnemonic(EXAMPLE_MNEMONIC)
  // example: FROM_MNEMONIC

  // example: FROM_ENVIRONMENT
  // On LocalNet this idempotently creates and funds a KMD wallet named
  // "MY_ACCOUNT"; against TestNet/MainNet it loads MY_ACCOUNT_MNEMONIC from
  // the environment, so the same code runs everywhere.
  const envAccount = await algorand.account.fromEnvironment('MY_ACCOUNT', algo(10))
  // example: FROM_ENVIRONMENT

  // example: FROM_KMD
  const kmdAccount = await algorand.account.fromKmd('MY_ACCOUNT')
  // example: FROM_KMD

  if (!mnemonicAccount.addr.toString()) throw new Error('Expected an address on the mnemonic account')
  if (envAccount.addr.toString() !== kmdAccount.addr.toString()) {
    throw new Error(`Expected the environment and KMD accounts to resolve to the same address`)
  }

  // --- KMD account management ---

  // example: KMD_ACCOUNT_MANAGER
  const kmdAccountManager = new KmdAccountManager(algorand.client)
  // example: KMD_ACCOUNT_MANAGER

  // example: KMD_MANAGER_METHODS
  // Load an account from a named wallet, filtering with a predicate
  const dispenserAccount = await kmdAccountManager.getWalletAccount('unencrypted-default-wallet', isFundedDispenser)
  // A dedicated method for the default LocalNet dispenser
  const localNetDispenserAccount = await kmdAccountManager.getLocalNetDispenserAccount()
  // Idempotently get-or-create a named account, funding it on creation
  const created = await kmdAccountManager.getOrCreateWalletAccount('account1', algo(2))
  // example: KMD_MANAGER_METHODS

  if (!dispenserAccount) throw new Error('Expected to find a funded account in the default wallet')
  if (!localNetDispenserAccount) throw new Error('Expected a LocalNet dispenser account')
  if (!created) throw new Error('Expected to get or create account1')

  // --- Fund accounts ---

  // example: DISPENSER
  // The pre-funded default LocalNet dispenser account
  const localNetDispenser = await algorand.account.localNetDispenser()
  // A dispenser configured via environment variables (falls back to LocalNet)
  const dispenser = await algorand.account.dispenserFromEnvironment()
  // example: DISPENSER

  if (!dispenser) throw new Error('Expected a dispenser account')

  // example: ENSURE_FUNDED
  await algorand.account.ensureFunded(randomAccount.addr, localNetDispenser.addr, algo(10))
  // example: ENSURE_FUNDED

  // example: ENSURE_FUNDED_FROM_ENVIRONMENT
  await algorand.account.ensureFundedFromEnvironment(randomAccount.addr, algo(10))
  // example: ENSURE_FUNDED_FROM_ENVIRONMENT

  const randomAccountInfo = await algorand.account.getInformation(randomAccount.addr)
  if (randomAccountInfo.balance.algo < 10) {
    throw new Error(`Expected ${randomAccount.addr} to hold at least 10 ALGO, but it has ${randomAccountInfo.balance.algo}`)
  }

  // Accounts used by the signing, multisig and rekeying sections below.
  const accountA = algorand.account.random()
  const accountB = algorand.account.random()
  const accountC = algorand.account.random()
  for (const account of [accountA, accountB, accountC]) {
    await algorand.account.ensureFunded(account.addr, localNetDispenser.addr, algo(10))
  }

  // --- Keys & signing ---

  // example: SET_DEFAULT_SIGNER
  algorand.account.setDefaultSigner(accountA.signer)
  // example: SET_DEFAULT_SIGNER

  // example: REGISTER_SIGNERS
  algorand.account.setSignerFromAccount(accountA).setSignerFromAccount(accountB).setSignerFromAccount(accountC)
  // example: REGISTER_SIGNERS

  // example: GET_SIGNER
  const signer = algorand.account.getSigner(accountA.addr)
  // example: GET_SIGNER

  if (!signer) throw new Error(`Expected a signer for ${accountA.addr}`)

  // example: OVERRIDE_SIGNER
  // Build an unsigned transaction and pass the signer explicitly when adding it
  // to a group, overriding the signer registered for the sender.
  const paymentTxn = await algorand.createTransaction.payment({
    sender: accountA.addr,
    receiver: accountB.addr,
    amount: algo(1),
    note: 'Payment from A to B',
  })
  await algorand.newGroup().addTransaction(paymentTxn, accountA.signer).send()
  // example: OVERRIDE_SIGNER

  // --- Multisig ---

  // example: MULTISIG
  // A 2-of-3 multisig account: any 2 of the 3 members can authorise a transaction.
  // All 3 make up the account's address, but only the 2 keys passed as
  // signingAccounts are loaded — enough to meet the threshold.
  const multisigAccount = algorand.account.multisig({ version: 1, threshold: 2, addrs: [accountA.addr, accountB.addr, accountC.addr] }, [
    accountA.account,
    accountB.account,
  ])

  // A multisig account must be funded to initialise its state on the ledger
  await algorand.account.ensureFunded(multisigAccount.addr, localNetDispenser.addr, algo(10))

  // Send a payment from the multisig account. The required number of signatures
  // is collected automatically from the signing accounts provided above.
  await algorand.send.payment({ sender: multisigAccount.addr, receiver: accountA.addr, amount: algo(1) })
  // example: MULTISIG

  // --- Rekeying ---

  // example: REKEY_ACCOUNT
  // Rekey accountA so that accountB's key now authorises its transactions.
  // Passing a signing account for rekeyTo registers it as accountA's signer.
  await algorand.account.rekeyAccount(accountA.addr, accountB)

  // accountA is still the sender, but accountB's key now signs automatically.
  const result = await algorand.send.payment({ sender: accountA.addr, receiver: accountB.addr, amount: algo(1) })
  // example: REKEY_ACCOUNT

  console.log(`Created and funded account ${randomAccount.addr}`)
  console.log(`Multisig account ${multisigAccount.addr} sent a payment`)
  console.log(`Rekeyed accountA; payment confirmed in ${result.txIds[0]}`)
}

/**
 * TestNet Dispenser API examples.
 *
 * These require TestNet and an `ALGOKIT_DISPENSER_ACCESS_TOKEN`, so they are not
 * run by the LocalNet harness — `main()` never calls this function. They exist
 * so the docs can render them as real, snippet-marked code.
 */
export async function testNetDispenserExamples() {
  const algorand = AlgorandClient.testNet()
  const randomAccount = algorand.account.random()

  // example: TESTNET_DISPENSER_ENSURE_FUNDED
  const testNetDispenser = algorand.client.getTestNetDispenserFromEnvironment()

  await algorand.account.ensureFundedFromTestNetDispenserApi(randomAccount.addr, testNetDispenser, algo(10))
  // example: TESTNET_DISPENSER_ENSURE_FUNDED

  // example: TESTNET_DISPENSER_FUND
  // `fund` takes the amount in microAlgo and sends it regardless of the current balance
  await testNetDispenser.fund(randomAccount.addr, algo(10).microAlgo)
  // example: TESTNET_DISPENSER_FUND
}

/**
 * Low-level KMD wallet administration.
 *
 * Creating and renaming wallets is rarely needed and not idempotent across
 * runs, so this is not executed by the harness — it backs the docs snippet.
 */
export async function kmdWalletAdminExample() {
  const algorand = AlgorandClient.defaultLocalNet()

  // example: KMD_WALLET_ADMIN
  // Create a wallet, then rename it using the id returned on creation
  const wallet = await algorand.client.kmd.createWallet('my-wallet', 'password')
  await algorand.client.kmd.renameWallet(wallet.wallet.id, 'password', 'my-renamed-wallet')
  // example: KMD_WALLET_ADMIN
}

/**
 * Registering different underlying account types as signers.
 *
 * Uses illustrative signer objects, so it is not executed by the harness — it
 * backs the docs snippet.
 */
export function registerSignerVariantsExample() {
  const algorand = AlgorandClient.defaultLocalNet()
  const accountA = algorand.account.random()
  const accountB = algorand.account.random()

  // example: SET_SIGNER_FROM_ACCOUNT_TYPES
  // setSignerFromAccount accepts any underlying account type. For a logic
  // signature use algorand.account.logicsig(program, args); setSigner takes a
  // raw sender address and a TransactionSigner.
  algorand.account
    .setSignerFromAccount({ addr: accountA.addr, signer: accountA.signer })
    // Pass a sender address as the second argument for a rekeyed account
    .setSignerFromAccount(new SigningAccount(accountB.account, undefined))
    .setSignerFromAccount(
      new MultisigAccount({ version: 1, threshold: 1, addrs: [accountA.addr, accountB.addr] }, [accountA.account, accountB.account]),
    )
  // example: SET_SIGNER_FROM_ACCOUNT_TYPES
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
