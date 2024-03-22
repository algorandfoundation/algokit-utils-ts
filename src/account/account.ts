import algosdk from 'algosdk'
import { Config } from '../config'
import { getOrCreateKmdWalletAccount } from '../localnet/get-or-create-kmd-wallet-account'
import { isLocalNet } from '../localnet/is-localnet'
import { getSenderAddress } from '../transaction/transaction'
import { AccountInformation, MultisigAccount, SigningAccount, TransactionSignerAccount } from '../types/account'
import { AlgoAmount } from '../types/amount'
import { SendTransactionFrom } from '../types/transaction'
import { getAccountConfigFromEnvironment } from './get-account-config-from-environment'
import { mnemonicAccount } from './mnemonic-account'
import AccountInformationModel = algosdk.modelsv2.Account
import Account = algosdk.Account
import Algodv2 = algosdk.Algodv2
import Kmd = algosdk.Kmd
import MultisigMetadata = algosdk.MultisigMetadata
import TransactionSigner = algosdk.TransactionSigner

/**
 * Returns an account wrapper that supports partial or full multisig signing.
 * @param multisigParams The parameters that define the multisig account
 * @param signingAccounts The signers that are currently present
 * @returns A multisig account wrapper
 */
export function multisigAccount(multisigParams: MultisigMetadata, signingAccounts: (Account | SigningAccount)[]) {
  return new MultisigAccount(multisigParams, signingAccounts)
}

/**
 * Returns an account wrapper that supports a rekeyed account.
 * @param signer The account, with private key loaded, that is signing
 * @param sender The address of the rekeyed account that will act as a sender
 * @returns The SigningAccount wrapper
 */
export function rekeyedAccount(signer: Account, sender: string) {
  return new SigningAccount(signer, sender)
}

/**
 * Returns an account wrapper that supports a transaction signer with associated sender address.
 * @param signer The transaction signer
 * @param sender The address of sender account
 * @returns The SigningAccount wrapper
 */
export function transactionSignerAccount(signer: TransactionSigner, sender: string): TransactionSignerAccount {
  return { addr: sender, signer }
}

/** Returns a new, random Algorand account with secret key loaded.
 *
 * This is a wrapper around algosdk.generateAccount to provide a more friendly/obvious name.
 *
 */
export function randomAccount(): Account {
  // This method is confusingly named, so this function provides a more dev friendly "wrapper" name
  return algosdk.generateAccount()
}

/**
 * Returns an Algorand account with private key loaded by convention from environment variables based on the given name identifier.
 *
 * Note: This function expects to run in a Node.js environment.
 *
 * ## Convention:
 * * **Non-LocalNet:** will load process.env['\{NAME\}_MNEMONIC'] as a mnemonic secret; **Note: Be careful how the mnemonic is handled**,
 *  never commit it into source control and ideally load it via a secret storage service rather than the file system.
 *   If process.env['\{NAME\}_SENDER'] is defined then it will use that for the sender address (i.e. to support rekeyed accounts)
 * * **LocalNet:** will load the account from a KMD wallet called \{NAME\} and if that wallet doesn't exist it will create it and fund the account for you
 *
 * This allows you to write code that will work seamlessly in production and local development (LocalNet) without manual config locally (including when you reset the LocalNet).
 *
 * @example Default
 *
 * If you have a mnemonic secret loaded into `process.env.MY_ACCOUNT_MNEMONIC` then you can call the following to get that private key loaded into an account object:
 * ```typescript
 * const account = await mnemonicAccountFromEnvironment('MY_ACCOUNT', algod)
 * ```
 *
 * If that code runs against LocalNet then a wallet called `MY_ACCOUNT` will automatically be created with an account that is automatically funded with 1000 (default) ALGOs from the default LocalNet dispenser.
 * If not running against LocalNet then it will use proces.env.MY_ACCOUNT_MNEMONIC as the private key and (if present) process.env.MY_ACCOUNT_SENDER as the sender address.
 *
 * @param account The details of the account to get, either the name identifier (string) or an object with:
 *   * `name`: string: The name identifier of the account
 *   * `fundWith`: The amount to fund the account with when it gets created (when targeting LocalNet), if not specified then 1000 Algos will be funded from the dispenser account
 * @param algod An algod client
 * @param kmdClient An optional KMD client to use to create an account (when targeting LocalNet), if not specified then a default KMD client will be loaded from environment variables
 * @returns The requested account with private key loaded from the environment variables or when targeting LocalNet from KMD (idempotently creating and funding the account)
 */
export async function mnemonicAccountFromEnvironment(
  account: string | { name: string; fundWith?: AlgoAmount },
  algod: Algodv2,
  kmdClient?: Kmd,
): Promise<Account | SigningAccount> {
  const { name, fundWith } = typeof account === 'string' ? { name: account, fundWith: undefined } : account

  // todo: When eventually removing this method, inline it here
  const config = getAccountConfigFromEnvironment(name)

  if (config.accountMnemonic) {
    const signer = mnemonicAccount(config.accountMnemonic)
    const sender = config.senderAddress
    if (sender) {
      Config.logger.debug(`Using rekeyed account ${signer.addr} for sender ${sender} for ${name} account`)
      return new SigningAccount(signer, sender)
    } else {
      return signer
    }
  }

  if (await isLocalNet(algod)) {
    return await getOrCreateKmdWalletAccount({ name, fundWith }, algod, kmdClient)
  }

  throw new Error(`Missing environment variable ${name.toUpperCase()}_MNEMONIC when looking for account ${name}`)
}

/** Returns an account's address as a byte array
 *
 * @param account Either an account (with private key loaded) or the string address of an account
 */
export function getAccountAddressAsUint8Array(account: SendTransactionFrom | string) {
  return algosdk.decodeAddress(typeof account === 'string' ? account : getSenderAddress(account)).publicKey
}

/** Returns the string address of an Algorand account from a base64 encoded version of the underlying byte array of the address public key
 *
 * @param addressEncodedInB64 The base64 encoded version of the underlying byte array of the address public key
 */
export function getAccountAddressAsString(addressEncodedInB64: string): string {
  return algosdk.encodeAddress(Buffer.from(addressEncodedInB64, 'base64'))
}

/**
 * Returns the given sender account's current status, balance and spendable amounts.
 *
 * @example
 * ```typescript
 * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
 * const accountInfo = await account.getInformation(address);
 * ```
 *
 * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/#get-v2accountsaddress)
 * @param sender The address of the sender/account to look up
 * @returns The account information
 */
export async function getAccountInformation(sender: string | SendTransactionFrom, algod: Algodv2): Promise<AccountInformation> {
  const account = AccountInformationModel.from_obj_for_encoding(
    await algod.accountInformation(typeof sender === 'string' ? sender : getSenderAddress(sender)).do(),
  )

  return {
    ...account,
    // None of these can practically overflow 2^53
    amount: Number(account.amount),
    amountWithoutPendingRewards: Number(account.amountWithoutPendingRewards),
    minBalance: Number(account.minBalance),
    pendingRewards: Number(account.pendingRewards),
    rewards: Number(account.rewards),
    round: Number(account.round),
    totalAppsOptedIn: Number(account.totalAppsOptedIn),
    totalAssetsOptedIn: Number(account.totalAssetsOptedIn),
    totalCreatedApps: Number(account.totalCreatedApps),
    totalCreatedAssets: Number(account.totalCreatedAssets),
    appsTotalExtraPages: account.appsTotalExtraPages ? Number(account.appsTotalExtraPages) : undefined,
    rewardBase: account.rewardBase ? Number(account.rewardBase) : undefined,
    totalBoxBytes: account.totalBoxBytes ? Number(account.totalBoxBytes) : undefined,
    totalBoxes: account.totalBoxes ? Number(account.totalBoxes) : undefined,
  }
}

export async function getAccountAssetInformation(sender: string | SendTransactionFrom, assetId: bigint, algod: Algodv2) {
  const info = await algod.accountAssetInformation(typeof sender === 'string' ? sender : getSenderAddress(sender), Number(assetId)).do()

  return {
    balance: BigInt(info['asset-holding']['amount']),
    frozen: info['asset-holding']['is-frozen'] === 'true',
    round: BigInt(info['round']),
  }
}
