import algosdk, { Account, Algodv2, Kmd } from 'algosdk'
import { AlgoAmount } from './algo-amount'
import { AlgoKitConfig } from './config'
import { getLocalNetDispenserAccount, getOrCreateKmdWalletAccount } from './localnet'
import { isLocalNet } from './network-client'
import { SigningAccount } from './transaction'
import { transferAlgos } from './transfer'

/**
 * The account name identifier used for fund dispensing in test environments
 */
export const DISPENSER_ACCOUNT = 'DISPENSER'

/** Returns an Algorand account with secret key loaded (i.e. that can sign transactions) by taking the mnemonic secret.
 *
 * This is a wrapper around algosdk.mnemonicToSecretKey to provide a more friendly/obvious name.
 *
 * @param mnemonicSecret The mnemonic secret representing the private key of an account; **Note: Be careful how the mnemonic is handled**,
 *  never commit it into source control and ideally load it from the environment (ideally via a secret storage service) rather than the file system.
 */
export function getAccountFromMnemonic(mnemonicSecret: string): Account {
  // This method is confusingly named, so this function provides a more dev friendly "wrapper" name
  return algosdk.mnemonicToSecretKey(mnemonicSecret)
}

/**
 * Returns an Algorand account with private key loaded by convention based on the given name identifier.
 *
 * Note: This function expects to run in a Node.js environment.
 *
 * ## Convention:
 * * **Non-LocalNet:** will load process.env['{NAME}_MNEMONIC'] as a mnemonic secret; **Note: Be careful how the mnemonic is handled**,
 *  never commit it into source control and ideally load it via a secret storage service rather than the file system.
 *   If process.env['{NAME}_SENDER'] is defined then it will use that for the sender address (i.e. to support rekeyed accounts)
 * * **LocalNet:** will load the account from a KMD wallet called {NAME} and if that wallet doesn't exist it will create it and fund the account for you
 *
 * This allows you to write code that will work seamlessly in production and local development (LocalNet) without manual config locally (including when you reset the LocalNet).
 *
 * @example Default
 *
 * If you have a mnemonic secret loaded into `process.env.ACCOUNT_MNEMONIC` then you can call the following to get that private key loaded into an account object:
 * ```
 * const account = await getAccount('ACCOUNT', algod)
 * ```
 *
 * If that code runs against LocalNet then a wallet called `ACCOUNT` will automatically be created with an account that is automatically funded with 1000 (default) ALGOs from the default LocalNet dispenser.
 *
 * @param account The details of the account to get, wither the name identifier (string) or an object with:
 *   * `name`: The name identifier of the account
 *   * `fundWith`: The amount to fund the account with it it gets created (when targeting LocalNet), if not specified then 1000 Algos will be funded from the dispenser account @see {getDispenserAccount}
 * @param algod An algod client
 * @param kmdClient An optional KMD client to use to create an account (when targeting LocalNet), if not specified then a default KMD client will be loaded from environment variables @see {getAlgoKmdClient}
 * @returns The requested account with private key loaded from the environment variables or when targeting LocalNet from KMD (idempotently creating and funding the account)
 */
export async function getAccount(
  account: { name: string; fundWith?: AlgoAmount } | string,
  algod: Algodv2,
  kmdClient?: Kmd,
): Promise<Account | SigningAccount> {
  let name: string
  let fundWith: AlgoAmount | undefined = undefined
  if (typeof account === 'string') {
    name = account
  } else {
    name = account.name
    fundWith = account.fundWith
  }

  if (!process || !process.env) {
    throw new Error('Attempt to get account with private key from a non Node.js context; not supported!')
  }

  const envKey = `${name.toUpperCase()}_MNEMONIC`
  if (process.env[envKey]) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const signer = getAccountFromMnemonic(process.env[envKey]!)
    const senderKey = `${name.toUpperCase()}_SENDER`
    if (process.env[senderKey]) {
      AlgoKitConfig.logger.debug(`Using rekeyed account ${signer.addr} for sender ${process.env[senderKey]} for ${name} account`)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return new SigningAccount(signer, process.env[senderKey]!)
    } else {
      return signer
    }
  }

  if (await isLocalNet(algod)) {
    const account = await getOrCreateKmdWalletAccount({ name, fundWith }, algod, kmdClient)
    process.env[envKey] = algosdk.secretKeyToMnemonic(account.sk)
    return account
  }

  throw `Missing environment variable ${envKey} when looking for account ${name}`
}

/**
 * Parameters for the getTestAccount function.
 */
interface GetTestAccountParams {
  /** Initial funds to ensure the account has */
  initialFunds: AlgoAmount
  /** Whether to suppress the log (which includes a mnemonic) or not (default: do not supress the log) */
  suppressLog?: boolean
}

/**
 * Creates an ephemeral Algorand account for the purposes of testing.
 * Returns a newly created random test account that is funded from the dispenser @see {getDispenserAccount}
 * DO NOT USE THIS TO CREATE A MAINNET ACCOUNT!
 * Note: By default this will log the mnemonic of the account.
 * @param param0 The config for the test account to generate
 * @param algod An algod client
 * @returns The account, with private key loaded
 */
export async function getTestAccount({ suppressLog, initialFunds }: GetTestAccountParams, algod: Algodv2): Promise<Account> {
  const account = algosdk.generateAccount()

  AlgoKitConfig.getLogger(suppressLog).info(
    `New test account created with address '${account.addr}' and mnemonic '${algosdk.secretKeyToMnemonic(account.sk)}'.`,
  )

  // If we are running against LocalNet we can use the default account within it
  //   otherwise use an automation account specified via environment variables and ensure it's populated with ALGOs
  const canFundFromDefaultAccount = await isLocalNet(algod)
  const dispenser = canFundFromDefaultAccount ? await getLocalNetDispenserAccount(algod) : await getAccount(DISPENSER_ACCOUNT, algod)

  await transferAlgos({ from: dispenser, to: account.addr, amount: initialFunds, note: 'Funding test account', suppressLog }, algod)

  const accountInfo = await algod.accountInformation(account.addr).do()

  AlgoKitConfig.getLogger(suppressLog).info('Test account funded; account balance: %d µAlgos', accountInfo.amount)

  return account
}

/** Returns an account's address as a byte array
 *
 * @param account Either an account (with private key loaded) or the string address of an account
 */
export function getAccountAddressAsUint8Array(account: Account | string) {
  return algosdk.decodeAddress(typeof account === 'string' ? account : account.addr).publicKey
}

/** Returns the string address of an Algorand account from a base64 encoded version of the underlying byte array of the address public key
 *
 * @param addressEncodedInB64 The base64 encoded version of the underlying byte array of the address public key
 */
export function getAccountAddressAsString(addressEncodedInB64: string): string {
  return algosdk.encodeAddress(Buffer.from(addressEncodedInB64, 'base64'))
}

/** Returns an account (with private key loaded) that can act as a dispenser
 *
 * If running on Sandbox then it will return the default dispenser account automatically,
 *  otherwise it will load the account mnemonic stored in process.env.DISPENSER_MNEMONIC @see {getAccount}
 *
 * @param algod An algod client
 */
export async function getDispenserAccount(algod: Algodv2) {
  // If we are running against a sandbox we can use the default account within it, otherwise use an automation account specified via environment variables and ensure it's populated with ALGOs
  const canFundFromDefaultAccount = await isLocalNet(algod)
  return canFundFromDefaultAccount ? await getLocalNetDispenserAccount(algod) : await getAccount(DISPENSER_ACCOUNT, algod)
}
