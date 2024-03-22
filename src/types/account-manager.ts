import algosdk from 'algosdk'
import { getAccountInformation, mnemonicAccountFromEnvironment, multisigAccount, randomAccount, rekeyedAccount } from '../account/account'
import { getDispenserAccount } from '../account/get-dispenser-account'
import { mnemonicAccount } from '../account/mnemonic-account'
import { getKmdWalletAccount } from '../localnet/get-kmd-wallet-account'
import { getLocalNetDispenserAccount } from '../localnet/get-localnet-dispenser-account'
import { getSenderAddress, getSenderTransactionSigner } from '../transaction/transaction'
import { AccountInformation, SigningAccount, TransactionSignerAccount } from './account'
import { AlgoAmount } from './amount'
import { ClientManager } from './client-manager'
import { SendTransactionFrom } from './transaction'

/** Creates and keeps track of signing accounts against sending addresses. */
export class AccountManager {
  private _clientManager: ClientManager
  private _accounts: { [address: string]: TransactionSignerAccount } = {}
  private _defaultSigner?: algosdk.TransactionSigner

  /**
   * Create a new account creator
   * @param algod The algod client to use
   * @param kmd The optional kmd client to use
   */
  constructor(clientManager: ClientManager) {
    this._clientManager = clientManager
  }

  /**
   * Sets the default signer to use if no other signer is specified.
   * @param signer The signer to use, either a `TransactionSigner` or a `TransactionSignerAccount`
   * @returns The `AccountManager` so method calls can be chained
   */
  public withDefaultSigner(signer: algosdk.TransactionSigner | TransactionSignerAccount): AccountManager {
    this._defaultSigner = 'signer' in signer ? signer.signer : signer
    return this
  }

  /**
   * Records the given account against the address of the account for later retrieval and returns a `TransactionSignerAccount`.
   * @param account The account to use.
   * @returns A `TransactionSignerAccount` for the given account.
   */
  private signerAccount<T extends SendTransactionFrom>(account: T): TransactionSignerAccount & { account: T } {
    const acc = {
      addr: getSenderAddress(account),
      signer: getSenderTransactionSigner(account),
    }
    this._accounts[acc.addr] = acc
    return { ...acc, account }
  }

  /**
   * Tracks the given account for later signing.
   * @param account The account to register
   * @returns The AccountCreator instance for method chaining
   */
  public withAccount(account: TransactionSignerAccount | SendTransactionFrom) {
    const acc =
      'signer' in account && 'addr' in account ? account : { signer: getSenderTransactionSigner(account), addr: getSenderAddress(account) }
    this._accounts[acc.addr] = acc
    return this
  }

  /**
   * Tracks the given account for later signing.
   * @param sender The sender address to use this signer for
   * @param signer The signer to sign transactions with for the given sender
   * @returns The AccountCreator instance for method chaining
   */
  public withSigner(sender: string, signer: algosdk.TransactionSigner) {
    this._accounts[sender] = { addr: sender, signer }
    return this
  }

  /**
   * Returns the `TransactionSigner` for the given sender address.
   *
   * If no signer has been registered for that address then the default signer is used if registered.
   *
   * @param sender The sender address
   * @returns The `TransactionSigner` or throws an error if not found
   */
  public getSigner(sender: string): algosdk.TransactionSigner {
    const signer = this._accounts[sender]?.signer ?? this._defaultSigner
    if (!signer) throw new Error(`No signer found for address ${sender}`)
    return signer
  }

  /**
   * Returns the `TransactionSignerAccount` for the given sender address.
   * @param sender The sender address
   * @returns The `TransactionSignerAccount` or throws an error if not found
   */
  public getAccount(sender: string): TransactionSignerAccount {
    const account = this._accounts[sender]
    if (!account) throw new Error(`No signer found for address ${sender}`)
    return account
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
  public async getInformation(sender: string | TransactionSignerAccount): Promise<AccountInformation> {
    return getAccountInformation(sender, this._clientManager.algod)
  }

  /**
   * Tracks and returns an Algorand account with secret key loaded (i.e. that can sign transactions) by taking the mnemonic secret.
   *
   * @example
   * ```typescript
   * const account = await account.fromMnemonic("mnemonic secret ...")
   * const rekeyedAccount = await account.fromMnemonic("mnemonic secret ...", "SENDERADDRESS...")
   * ```
   * @param mnemonicSecret The mnemonic secret representing the private key of an account; **Note: Be careful how the mnemonic is handled**,
   *  never commit it into source control and ideally load it from the environment (ideally via a secret storage service) rather than the file system.
   * @param sender The optional sender address to use this signer for (aka a rekeyed account)
   * @returns The account
   */
  public fromMnemonic = (mnemonicSecret: string, sender?: string) => {
    const account = mnemonicAccount(mnemonicSecret)
    return this.signerAccount(sender ? rekeyedAccount(account, sender) : account)
  }

  /**
   * Tracks and returns an Algorand account with private key loaded by convention from environment variables based on the given name identifier.
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
   * const account = await account.fromEnvironment('MY_ACCOUNT', algod)
   * ```
   *
   * If that code runs against LocalNet then a wallet called `MY_ACCOUNT` will automatically be created with an account that is automatically funded with 1000 (default) ALGOs from the default LocalNet dispenser.
   * If not running against LocalNet then it will use proces.env.MY_ACCOUNT_MNEMONIC as the private key and (if present) process.env.MY_ACCOUNT_SENDER as the sender address.
   *
   * @param name The name identifier of the account
   * @param fundWith The optional amount to fund the account with when it gets created (when targeting LocalNet), if not specified then 1000 Algos will be funded from the dispenser account
   * @returns The account
   */
  public fromEnvironment = async (name: string, fundWith?: AlgoAmount) =>
    this.signerAccount(await mnemonicAccountFromEnvironment({ name, fundWith }, this._clientManager.algod, this._clientManager.kmd))

  /**
   * Tracks and returns an Algorand account with private key loaded from the given KMD wallet (identified by name).
   *
   * @param name: The name of the wallet to retrieve an account from
   * @param predicate: An optional filter to use to find the account (otherwise it will return a random account from the wallet)
   * @param sender The optional sender address to use this signer for (aka a rekeyed account)
   * @example Get default funded account in a LocalNet
   *
   * ```typescript
   * const defaultDispenserAccount = await account.fromKmd('unencrypted-default-wallet',
   *   a => a.status !== 'Offline' && a.amount > 1_000_000_000
   * )
   * ```
   * @returns The account
   */
  public fromKmd = async (
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    predicate?: (account: Record<string, any>) => boolean,
    sender?: string,
  ) => {
    const account = await getKmdWalletAccount({ name, predicate }, this._clientManager.algod, this._clientManager.kmd)
    if (!account) throw new Error(`Unable to find KMD account ${name}${predicate ? ' with predicate' : ''}`)
    return this.signerAccount(sender ? rekeyedAccount(account, sender) : account)
  }

  /**
   * Tracks and returns an account that supports partial or full multisig signing.
   *
   * @example
   * ```typescript
   * const account = await account.multisig({version: 1, threshold: 1, addrs: ["ADDRESS1...", "ADDRESS2..."]},
   *  await account.fromEnvironment('ACCOUNT1'))
   * ```
   * @param multisigParams The parameters that define the multisig account
   * @param signingAccounts The signers that are currently present
   * @returns A multisig account wrapper
   */
  public multisig = (multisigParams: algosdk.MultisigMetadata, signingAccounts: (algosdk.Account | SigningAccount)[]) => {
    return this.signerAccount(multisigAccount(multisigParams, signingAccounts))
  }

  /**
   * Tracks and returns a new, random Algorand account with secret key loaded.
   *
   * @example
   * ```typescript
   * const account = await account.random()
   * ```
   * @returns The account
   */
  public random = () => this.signerAccount(randomAccount())

  /**
   * Returns an account (with private key loaded) that can act as a dispenser.
   *
   * @example
   * ```typescript
   * const account = await account.dispenser()
   * ```
   * If running on LocalNet then it will return the default dispenser account automatically,
   *  otherwise it will load the account mnemonic stored in process.env.DISPENSER_MNEMONIC.
   * @returns The account
   */
  public dispenser = async () => this.signerAccount(await getDispenserAccount(this._clientManager.algod, this._clientManager.kmd))

  /**
   * Returns an Algorand account with private key loaded for the default LocalNet dispenser account (that can be used to fund other accounts).
   *
   * @example
   * ```typescript
   * const account = await account.localNetDispenser()
   * ```
   * @returns The account
   */
  public localNetDispenser = async () =>
    this.signerAccount(await getLocalNetDispenserAccount(this._clientManager.algod, this._clientManager.kmd))
}
