import algosdk from 'algosdk'
import { AccountConfig, SigningAccount } from '../types/account'
import { AccountManager } from '../types/account-manager'
import { AlgoAmount } from '../types/amount'
import { ClientManager } from '../types/client-manager'
import { getAccountConfigFromEnvironment } from './get-account-config-from-environment'
import Account = algosdk.Account
import Algodv2 = algosdk.Algodv2
import Kmd = algosdk.Kmd

/**  @deprecated use `algorandClient.account.fromEnvironment()` instead
 *
 * Returns an Algorand account with private key loaded by convention based on the given name identifier.
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
 * If you have a mnemonic secret loaded into `process.env.ACCOUNT_MNEMONIC` then you can call the following to get that private key loaded into an account object:
 * ```typescript
 * const account = await getAccount('ACCOUNT', algod)
 * ```
 *
 * If that code runs against LocalNet then a wallet called `ACCOUNT` will automatically be created with an account that is automatically funded with 1000 (default) Algos from the default LocalNet dispenser.
 *
 * @param account The details of the account to get, either the name identifier (string) or an object with:
 *   * `name`: The name identifier of the account
 *   * `fundWith`: The amount to fund the account with when it gets created (when targeting LocalNet), if not specified then 1000 Algos will be funded from the dispenser account
 * @param algod An algod client
 * @param kmdClient An optional KMD client to use to create an account (when targeting LocalNet), if not specified then a default KMD client will be loaded from environment variables
 * @returns The requested account with private key loaded from the environment variables or when targeting LocalNet from KMD (idempotently creating and funding the account)
 */
export async function getAccount(
  account: { name: string; fundWith?: AlgoAmount } | string,
  algod: Algodv2,
  kmdClient?: Kmd,
): Promise<Account | SigningAccount>

/**  @deprecated use `algorandClient.account.fromEnvironment()` instead
 * Returns an Algorand account with private key loaded by convention based on the given name identifier.
 *
 * Note: This function expects to run in a Node.js environment.
 *
 * @example Default
 *
 * If you have a mnemonic secret loaded into `process.env.ACCOUNT_MNEMONIC` then you can call the following to get that private key loaded into an account object:
 * ```typescript
 * const account = await getAccount({config: getAccountConfigFromEnvironment('ACCOUNT')}, algod)
 * ```
 *
 * If that code runs against LocalNet then a wallet called `ACCOUNT` will automatically be created with an account that is automatically funded with 1000 (default) Algos from the default LocalNet dispenser.
 *
 * @param account The details of the account to get, an object with:
 *   * `config`: Account configuration. To get from environment use getAccountConfigFromEnvironment(accountName)
 *   * `fundWith`: The amount to fund the account with when it gets created (when targeting LocalNet), if not specified then 1000 Algos will be funded from the dispenser account
 * @param algod An algod client
 * @param kmdClient An optional KMD client to use to create an account (when targeting LocalNet), if not specified then a default KMD client will be loaded from environment variables
 * @returns The requested account with private key loaded from the environment variables or when targeting LocalNet from KMD (idempotently creating and funding the account)
 */
export async function getAccount(
  account: { config: AccountConfig; fundWith?: AlgoAmount },
  algod: Algodv2,
  kmdClient?: Kmd,
): Promise<Account | SigningAccount>

/**  @deprecated use `algorandClient.account.fromEnvironment()` instead
 * Returns an Algorand account with private key loaded by convention based on the given name identifier.
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
 * If you have a mnemonic secret loaded into `process.env.ACCOUNT_MNEMONIC` then you can call the following to get that private key loaded into an account object:
 * ```typescript
 * const account = await getAccount({config: getAccountConfigFromEnvironment('ACCOUNT')}, algod)
 * ```
 *
 * If that code runs against LocalNet then a wallet called `ACCOUNT` will automatically be created with an account that is automatically funded with 1000 (default) Algos from the default LocalNet dispenser.
 *
 * @param account The details of the account to get, either the name identifier (string) or an object with:
 *   * `config`: Account configuration. To get from environment use getAccountConfigFromEnvironment(accountName) OR
 *   * `name`: string: The name identifier of the account (deprecated)
 *   And optionally
 *   * `fundWith`: The amount to fund the account with when it gets created (when targeting LocalNet), if not specified then 1000 Algos will be funded from the dispenser account
 * @param algod An algod client
 * @param kmdClient An optional KMD client to use to create an account (when targeting LocalNet), if not specified then a default KMD client will be loaded from environment variables
 * @returns The requested account with private key loaded from the environment variables or when targeting LocalNet from KMD (idempotently creating and funding the account)
 */
export async function getAccount(
  account: { name: string; fundWith?: AlgoAmount } | { config: AccountConfig; fundWith?: AlgoAmount } | string,
  algod: Algodv2,
  kmdClient?: Kmd,
): Promise<Account | SigningAccount> {
  let name: string
  let fundWith: AlgoAmount | undefined = undefined
  let config: AccountConfig

  if (typeof account === 'string') {
    name = account
    config = getAccountConfigFromEnvironment(name)
  } else if ('name' in account) {
    name = account.name
    config = getAccountConfigFromEnvironment(name)
    fundWith = account.fundWith
  } else if ('config' in account) {
    config = account.config
    name = config.accountName
    fundWith = account.fundWith
  } else {
    throw new Error('Missing name or account config')
  }

  return (await new AccountManager(new ClientManager({ algod, kmd: kmdClient })).fromEnvironment(name, fundWith)).account
}
