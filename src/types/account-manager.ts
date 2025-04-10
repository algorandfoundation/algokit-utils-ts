import algosdk, { Address } from 'algosdk'
import { Config } from '../config'
import { calculateFundAmount, memoize } from '../util'
import { AccountInformation, DISPENSER_ACCOUNT, MultisigAccount, SigningAccount, TransactionSignerAccount } from './account'
import { AlgoAmount } from './amount'
import { ClientManager } from './client-manager'
import { CommonTransactionParams, TransactionComposer } from './composer'
import { TestNetDispenserApiClient } from './dispenser-client'
import { KmdAccountManager } from './kmd-account-manager'
import { SendParams, SendSingleTransactionResult } from './transaction'
import LogicSigAccount = algosdk.LogicSigAccount
import Account = algosdk.Account
import TransactionSigner = algosdk.TransactionSigner

const address = (address: string | Address) => (typeof address === 'string' ? Address.fromString(address) : address)

/** Result from performing an ensureFunded call. */
export interface EnsureFundedResult {
  /** The transaction ID of the transaction that funded the account. */
  transactionId: string
  /** The amount that was sent to the account. */
  amountFunded: AlgoAmount
}

/**
 * Returns a `TransactionSigner` for the given account that can sign a transaction.
 * This function has memoization, so will return the same transaction signer for a given account.
 * @param account An account that can sign a transaction
 * @returns A transaction signer
 * @example
 * ```typescript
 * const signer = getAccountTransactionSigner(account)
 * ```
 */
export const getAccountTransactionSigner = memoize(function (
  account: TransactionSignerAccount | Account | SigningAccount | LogicSigAccount | MultisigAccount,
): TransactionSigner {
  return 'signer' in account
    ? account.signer
    : 'lsig' in account
      ? algosdk.makeLogicSigAccountTransactionSigner(account)
      : algosdk.makeBasicAccountTransactionSigner(account)
})

/** Creates and keeps track of signing accounts that can sign transactions for a sending address. */
export class AccountManager {
  private _clientManager: ClientManager
  private _kmdAccountManager: KmdAccountManager
  private _accounts: { [address: string]: TransactionSignerAccount } = {}
  private _defaultSigner?: algosdk.TransactionSigner

  /**
   * Create a new account manager.
   * @param clientManager The ClientManager client to use for algod and kmd clients
   * @example Create a new account manager
   * ```typescript
   * const accountManager = new AccountManager(clientManager)
   * ```
   */
  constructor(clientManager: ClientManager) {
    this._clientManager = clientManager
    this._kmdAccountManager = new KmdAccountManager(clientManager)
  }

  private _getComposer(getSuggestedParams?: () => Promise<algosdk.SuggestedParams>) {
    return new TransactionComposer({
      algod: this._clientManager.algod,
      getSigner: this.getSigner.bind(this),
      getSuggestedParams: getSuggestedParams ?? (() => this._clientManager.algod.getTransactionParams().do()),
    })
  }

  /**
   * KMD account manager that allows you to easily get and create accounts using KMD.
   * @returns The `KmdAccountManager` instance.
   * @example
   * ```typescript
   * const kmdManager = accountManager.kmd;
   * ```
   */
  public get kmd() {
    return this._kmdAccountManager
  }

  /**
   * Sets the default signer to use if no other signer is specified.
   *
   * If this isn't set an a transaction needs signing for a given sender
   * then an error will be thrown from `getSigner` / `getAccount`.
   * @param signer The signer to use, either a `TransactionSigner` or a `TransactionSignerAccount`
   * @example
   * ```typescript
   * const signer = accountManager.random() // Can be anything that returns a `algosdk.TransactionSigner` or `TransactionSignerAccount`
   * accountManager.setDefaultSigner(signer)
   *
   * // When signing a transaction, if there is no signer registered for the sender then the default signer will be used
   * const signer = accountManager.getSigner("SENDERADDRESS")
   * ```
   * @returns The `AccountManager` so method calls can be chained
   */
  public setDefaultSigner(signer: algosdk.TransactionSigner | TransactionSignerAccount): AccountManager {
    this._defaultSigner = 'signer' in signer ? signer.signer : signer
    return this
  }

  /**
   * Records the given account (that can sign) against the address of the provided account for later
   * retrieval and returns a `TransactionSignerAccount` along with the original account in an `account` property.
   */

  private signerAccount<T extends TransactionSignerAccount | Account | SigningAccount | LogicSigAccount | MultisigAccount>(
    account: T,
  ): Address &
    TransactionSignerAccount & {
      /* The underlying account that specified this address. */ account: T
    } {
    const signer = getAccountTransactionSigner(account)
    const acc: TransactionSignerAccount = {
      addr: 'addr' in account ? account.addr : account.address(),
      signer: signer,
    }
    this._accounts[acc.addr.toString()] = acc

    const addressWithAccount = Address.fromString(acc.addr.toString()) as Address & TransactionSignerAccount & { account: T }
    addressWithAccount.account = account
    addressWithAccount.addr = acc.addr
    addressWithAccount.signer = signer
    return addressWithAccount
  }

  /**
   * Tracks the given account for later signing.
   *
   * Note: If you are generating accounts via the various methods on `AccountManager`
   * (like `random`, `fromMnemonic`, `logicsig`, etc.) then they automatically get tracked.
   * @param account The account to register, which can be a `TransactionSignerAccount` or
   *  a `algosdk.Account`, `algosdk.LogicSigAccount`, `SigningAccount` or `MultisigAccount`
   * @example
   * ```typescript
   * const accountManager = new AccountManager(clientManager)
   *  .setSignerFromAccount(algosdk.generateAccount())
   *  .setSignerFromAccount(new algosdk.LogicSigAccount(program, args))
   *  .setSignerFromAccount(new SigningAccount(mnemonic, sender))
   *  .setSignerFromAccount(new MultisigAccount({version: 1, threshold: 1, addrs: ["ADDRESS1...", "ADDRESS2..."]}, [account1, account2]))
   *  .setSignerFromAccount({addr: "SENDERADDRESS", signer: transactionSigner})
   * ```
   * @returns The `AccountManager` instance for method chaining
   */
  public setSignerFromAccount(account: TransactionSignerAccount | Account | LogicSigAccount | SigningAccount | MultisigAccount) {
    this.signerAccount(account)
    return this
  }

  /**
   * Tracks the given `algosdk.TransactionSigner` against the given sender address for later signing.
   * @param sender The sender address to use this signer for
   * @param signer The `algosdk.TransactionSigner` to sign transactions with for the given sender
   * @example
   * ```typescript
   * const accountManager = new AccountManager(clientManager)
   *  .setSigner("SENDERADDRESS", transactionSigner)
   * ```
   * @returns The `AccountManager` instance for method chaining
   */
  public setSigner(sender: string | Address, signer: algosdk.TransactionSigner) {
    this._accounts[address(sender).toString()] = { addr: address(sender), signer }
    return this
  }

  /**
   * Takes all registered signers from the given `AccountManager` and adds them to this `AccountManager`.
   *
   * This is useful for situations where you have multiple contexts you are building accounts in such as unit tests.
   * @param anotherAccountManager Another account manager with signers registered
   * @param overwriteExisting Whether or not to overwrite any signers that have the same sender address with the ones in the other account manager or not (default: true)
   * @returns The `AccountManager` instance for method chaining
   * @example
   * ```typescript
   * accountManager2.setSigners(accountManager1);
   * ```
   */
  public setSigners(anotherAccountManager: AccountManager, overwriteExisting = true) {
    this._accounts = overwriteExisting
      ? { ...this._accounts, ...anotherAccountManager._accounts }
      : { ...anotherAccountManager._accounts, ...this._accounts }
    return this
  }

  /**
   * Returns the `TransactionSigner` for the given sender address, ready to sign a transaction for that sender.
   *
   * If no signer has been registered for that address then the default signer is used if registered and
   * if not then an error is thrown.
   *
   * @param sender The sender address
   * @example
   * ```typescript
   * const signer = accountManager.getSigner("SENDERADDRESS")
   * ```
   * @returns The `TransactionSigner` or throws an error if not found and no default signer is set
   */
  public getSigner(sender: string | Address): algosdk.TransactionSigner {
    const signer = this._accounts[address(sender).toString()]?.signer ?? this._defaultSigner
    if (!signer) throw new Error(`No signer found for address ${sender}`)
    return signer
  }

  /**
   * Returns the `TransactionSignerAccount` for the given sender address.
   *
   * If no signer has been registered for that address then an error is thrown.
   * @param sender The sender address
   * @example
   * ```typescript
   * const sender = accountManager.random()
   * // ...
   * // Returns the `TransactionSignerAccount` for `sender` that has previously been registered
   * const account = accountManager.getAccount(sender)
   * ```
   * @returns The `TransactionSignerAccount` or throws an error if not found
   */
  public getAccount(sender: string | Address): TransactionSignerAccount {
    const account = this._accounts[address(sender).toString()]
    if (!account) throw new Error(`No signer found for address ${sender}`)
    return account
  }

  /**
   * Returns the given sender account's current status, balance and spendable amounts.
   *
   * [Response data schema details](https://dev.algorand.co/reference/rest-apis/algod/#accountinformation)
   * @example
   * ```typescript
   * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const accountInfo = await accountManager.getInformation(address);
   * ```
   *
   * @param sender The account / address to look up
   * @returns The account information
   */
  public async getInformation(sender: string | Address): Promise<AccountInformation> {
    const {
      round,
      lastHeartbeat = undefined,
      lastProposed = undefined,
      address,
      ...account
    } = await this._clientManager.algod.accountInformation(sender).do()

    return {
      ...account,
      // None of the Number types can practically overflow 2^53
      address: Address.fromString(address),
      balance: AlgoAmount.MicroAlgo(Number(account.amount)),
      amountWithoutPendingRewards: AlgoAmount.MicroAlgo(Number(account.amountWithoutPendingRewards)),
      minBalance: AlgoAmount.MicroAlgo(Number(account.minBalance)),
      pendingRewards: AlgoAmount.MicroAlgo(Number(account.pendingRewards)),
      rewards: AlgoAmount.MicroAlgo(Number(account.rewards)),
      validAsOfRound: BigInt(round),
      totalAppsOptedIn: Number(account.totalAppsOptedIn),
      totalAssetsOptedIn: Number(account.totalAssetsOptedIn),
      totalCreatedApps: Number(account.totalCreatedApps),
      totalCreatedAssets: Number(account.totalCreatedAssets),
      appsTotalExtraPages: account.appsTotalExtraPages !== undefined ? Number(account.appsTotalExtraPages) : undefined,
      rewardBase: account.rewardBase !== undefined ? Number(account.rewardBase) : undefined,
      totalBoxBytes: account.totalBoxBytes !== undefined ? Number(account.totalBoxBytes) : undefined,
      totalBoxes: account.totalBoxes !== undefined ? Number(account.totalBoxes) : undefined,
      lastHeartbeatRound: lastHeartbeat !== undefined ? BigInt(lastHeartbeat) : undefined,
      lastProposedRound: lastProposed !== undefined ? BigInt(lastProposed) : undefined,
    }
  }

  /**
   * Tracks and returns an Algorand account with secret key loaded (i.e. that can sign transactions) by taking the mnemonic secret.
   *
   * @example
   * ```typescript
   * const account = accountManager.fromMnemonic("mnemonic secret ...")
   * const rekeyedAccount = accountManager.fromMnemonic("mnemonic secret ...", "SENDERADDRESS...")
   * ```
   * @param mnemonicSecret The mnemonic secret representing the private key of an account; **Note: Be careful how the mnemonic is handled**,
   *  never commit it into source control and ideally load it from the environment (ideally via a secret storage service) rather than the file system.
   * @param sender The optional sender address to use this signer for (aka a rekeyed account)
   * @returns The account
   */
  public fromMnemonic(mnemonicSecret: string, sender?: string | Address) {
    const account = algosdk.mnemonicToSecretKey(mnemonicSecret)
    return this.signerAccount(new SigningAccount(account, sender))
  }

  /**
   * Tracks and returns an Algorand account that is a rekeyed version of the given account to a new sender.
   *
   * @example
   * ```typescript
   * const account = accountManager.fromMnemonic("mnemonic secret ...")
   * const rekeyedAccount = accountManager.rekeyed(account, "SENDERADDRESS...")
   * ```
   * @param account The account to use as the signer for this new rekeyed account
   * @param sender The sender address to use as the new sender
   * @returns The account
   */
  public rekeyed(sender: string | Address, account: TransactionSignerAccount) {
    return this.signerAccount({ addr: address(sender), signer: account.signer })
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
   * const account = await accountManager.fromEnvironment('MY_ACCOUNT')
   * ```
   *
   * If that code runs against LocalNet then a wallet called `MY_ACCOUNT` will automatically be created with an account that is automatically funded with 1000 (default) ALGO from the default LocalNet dispenser.
   * If not running against LocalNet then it will use proces.env.MY_ACCOUNT_MNEMONIC as the private key and (if present) process.env.MY_ACCOUNT_SENDER as the sender address.
   *
   * @param name The name identifier of the account
   * @param fundWith The optional amount to fund the account with when it gets created (when targeting LocalNet), if not specified then 1000 ALGO will be funded from the dispenser account
   * @returns The account
   */
  public async fromEnvironment(name: string, fundWith?: AlgoAmount) {
    if (!process || !process.env) {
      throw new Error('Attempt to get account with private key from a non Node.js context; this is not supported!')
    }

    const accountMnemonic = process.env[`${name.toUpperCase()}_MNEMONIC`]
    const sender = process.env[`${name.toUpperCase()}_SENDER`]

    if (accountMnemonic) {
      const signer = algosdk.mnemonicToSecretKey(accountMnemonic)
      return this.signerAccount(new SigningAccount(signer, sender))
    }

    if (await this._clientManager.isLocalNet()) {
      const account = await this._kmdAccountManager.getOrCreateWalletAccount(name, fundWith)
      return this.signerAccount(account.account)
    }

    throw new Error(`Missing environment variable ${name.toUpperCase()}_MNEMONIC when looking for account ${name}`)
  }

  /**
   * Tracks and returns an Algorand account with private key loaded from the given KMD wallet (identified by name).
   *
   * @param name The name of the wallet to retrieve an account from
   * @param predicate An optional filter to use to find the account (otherwise it will return a random account from the wallet)
   * @param sender The optional sender address to use this signer for (aka a rekeyed account)
   * @example Get default funded account in a LocalNet
   *
   * ```typescript
   * const defaultDispenserAccount = await accountManager.fromKmd('unencrypted-default-wallet',
   *   a => a.status !== 'Offline' && a.amount > 1_000_000_000
   * )
   * ```
   * @returns The account
   */
  public async fromKmd(
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    predicate?: (account: Record<string, any>) => boolean,
    sender?: string | Address,
  ) {
    const account = await this._kmdAccountManager.getWalletAccount(name, predicate, sender)
    if (!account) throw new Error(`Unable to find KMD account ${name}${predicate ? ' with predicate' : ''}`)
    return this.signerAccount(account.account)
  }

  /**
   * Tracks and returns an account that supports partial or full multisig signing.
   *
   * @example
   * ```typescript
   * const account = accountManager.multisig({version: 1, threshold: 1, addrs: ["ADDRESS1...", "ADDRESS2..."]},
   *  [(await accountManager.fromEnvironment('ACCOUNT1')).account])
   * ```
   * @param multisigParams The parameters that define the multisig account
   * @param signingAccounts The signers that are currently present
   * @returns A multisig account wrapper
   */
  public multisig(multisigParams: algosdk.MultisigMetadata, signingAccounts: (algosdk.Account | SigningAccount)[]) {
    return this.signerAccount(new MultisigAccount(multisigParams, signingAccounts))
  }

  /**
   * Tracks and returns an account that represents a logic signature.
   *
   * @example
   * ```typescript
   * const account = accountManager.logicsig(program, [new Uint8Array(3, ...)])
   * ```
   * @param program The bytes that make up the compiled logic signature
   * @param args The (binary) arguments to pass into the logic signature
   * @returns A logic signature account wrapper
   */
  public logicsig(program: Uint8Array, args?: Array<Uint8Array>) {
    return this.signerAccount(new LogicSigAccount(program, args))
  }

  /**
   * Tracks and returns a new, random Algorand account with secret key loaded.
   *
   * @example
   * ```typescript
   * const account = accountManager.random()
   * ```
   * @returns The account
   */
  public random() {
    return this.signerAccount(algosdk.generateAccount())
  }

  /**
   * Returns an account (with private key loaded) that can act as a dispenser from
   * environment variables, or against default LocalNet if no environment variables present.
   *
   * Note: requires a Node.js environment to execute.
   *
   * If present, it will load the account mnemonic stored in process.env.DISPENSER_MNEMONIC and optionally
   * process.env.DISPENSER_SENDER if it's a rekeyed account.
   *
   * @example
   * ```typescript
   * const account = await accountManager.dispenserFromEnvironment()
   * ```
   *
   * @returns The account
   */
  public async dispenserFromEnvironment() {
    if (!process || !process.env) {
      throw new Error('Attempt to get dispenser from environment from a non Node.js context; this is not supported!')
    }

    return process.env[`${DISPENSER_ACCOUNT.toUpperCase()}_MNEMONIC`]
      ? await this.fromEnvironment(DISPENSER_ACCOUNT)
      : await this.localNetDispenser()
  }

  /**
   * Returns an Algorand account with private key loaded for the default LocalNet dispenser account (that can be used to fund other accounts).
   *
   * @example
   * ```typescript
   * const account = await accountManager.localNetDispenser()
   * ```
   * @returns The account
   */
  public async localNetDispenser() {
    const dispenser = await this._kmdAccountManager.getLocalNetDispenserAccount()
    return this.signerAccount(dispenser.account)
  }

  /**
   * Rekey an account to a new address.
   *
   * **Note:** Please be careful with this function and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying).
   *
   * @param account The account to rekey
   * @param rekeyTo The account address or signing account of the account that will be used to authorise transactions for the rekeyed account going forward.
   *  If a signing account is provided that will now be tracked as the signer for `account` in this `AccountManager`
   * @param options Any parameters to control the transaction or execution of the transaction
   *
   * @example Basic example (with string addresses)
   * ```typescript
   * await accountManager.rekeyAccount({account: "ACCOUNTADDRESS", rekeyTo: "NEWADDRESS"})
   * ```
   * @example Basic example (with signer accounts)
   * ```typescript
   * await accountManager.rekeyAccount({account: account1, rekeyTo: newSignerAccount})
   * ```
   * @example Advanced example
   * ```typescript
   * await accountManager.rekeyAccount({
   *   account: "ACCOUNTADDRESS",
   *   rekeyTo: "NEWADDRESS",
   *   lease: 'lease',
   *   note: 'note',
   *   firstValidRound: 1000n,
   *   validityWindow: 10,
   *   extraFee: (1000).microAlgo(),
   *   staticFee: (1000).microAlgo(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgo(),
   *   maxRoundsToWaitForConfirmation: 5,
   *   suppressLog: true,
   * })
   * ```
   * @returns The result of the transaction and the transaction that was sent
   */
  async rekeyAccount(
    account: string | Address,
    rekeyTo: string | Address | TransactionSignerAccount,
    options?: Omit<CommonTransactionParams, 'sender'> & SendParams,
  ): Promise<SendSingleTransactionResult> {
    const result = await this._getComposer()
      .addPayment({
        ...options,
        sender: address(account),
        receiver: address(account),
        amount: AlgoAmount.MicroAlgo(0),
        rekeyTo: address(typeof rekeyTo === 'object' && 'addr' in rekeyTo ? rekeyTo.addr : rekeyTo),
      })
      .send(options)

    // If the rekey is a signing account set it as the signer for this account
    if (typeof rekeyTo === 'object' && 'addr' in rekeyTo) {
      this.rekeyed(account, rekeyTo)
    }

    Config.getLogger(options?.suppressLog).info(`Rekeyed ${account} to ${rekeyTo} via transaction ${result.txIds.at(-1)}`)

    return { ...result, transaction: result.transactions.at(-1)!, confirmation: result.confirmations.at(-1)! }
  }

  private async _getEnsureFundedAmount(sender: Address, minSpendingBalance: AlgoAmount, minFundingIncrement?: AlgoAmount) {
    const accountInfo = await this.getInformation(sender)
    const currentSpendingBalance = accountInfo.balance.microAlgo - accountInfo.minBalance.microAlgo

    const amountFunded = calculateFundAmount(minSpendingBalance.microAlgo, currentSpendingBalance, minFundingIncrement?.microAlgo ?? 0n)

    return amountFunded === null ? undefined : AlgoAmount.MicroAlgo(amountFunded)
  }

  /**
   * Funds a given account using a dispenser account as a funding source such that
   * the given account has a certain amount of Algo free to spend (accounting for
   * Algo locked in minimum balance requirement).
   *
   * https://dev.algorand.co/concepts/smart-contracts/costs-constraints#mbr
   *
   * @param accountToFund The account to fund
   * @param dispenserAccount The account to use as a dispenser funding source
   * @param minSpendingBalance The minimum balance of Algo that the account should have available to spend (i.e. on top of minimum balance requirement)
   * @param options Optional parameters to control the funding increment, transaction or execution of the transaction
   * @example Example using AlgorandClient
   * ```typescript
   * // Basic example
   * await accountManager.ensureFunded("ACCOUNTADDRESS", "DISPENSERADDRESS", algokit.algo(1))
   * // With configuration
   * await accountManager.ensureFunded("ACCOUNTADDRESS", "DISPENSERADDRESS", algokit.algo(1),
   *  { minFundingIncrement: algokit.algo(2), fee: (1000).microAlgo(), suppressLog: true }
   * )
   * ```
   * @returns
   * - The result of executing the dispensing transaction and the `amountFunded` if funds were needed.
   * - `undefined` if no funds were needed.
   */
  async ensureFunded(
    accountToFund: string | Address,
    dispenserAccount: string | Address,
    minSpendingBalance: AlgoAmount,
    options?: {
      minFundingIncrement?: AlgoAmount
    } & SendParams &
      Omit<CommonTransactionParams, 'sender'>,
  ): Promise<(SendSingleTransactionResult & EnsureFundedResult) | undefined> {
    const addressToFund = address(accountToFund)

    const amountFunded = await this._getEnsureFundedAmount(addressToFund, minSpendingBalance, options?.minFundingIncrement)
    if (!amountFunded) return undefined

    const result = await this._getComposer()
      .addPayment({
        ...options,
        sender: address(dispenserAccount),
        receiver: addressToFund,
        amount: amountFunded,
      })
      .send(options)

    return {
      ...result,
      transaction: result.transactions[0],
      confirmation: result.confirmations[0],
      transactionId: result.txIds[0],
      amountFunded: amountFunded,
    }
  }

  /**
   * Funds a given account using a dispenser account retrieved from the environment,
   * per the `dispenserFromEnvironment` method, as a funding source such that
   * the given account has a certain amount of Algo free to spend (accounting for
   * Algo locked in minimum balance requirement).
   *
   * **Note:** requires a Node.js environment to execute.
   *
   * The dispenser account is retrieved from the account mnemonic stored in
   * process.env.DISPENSER_MNEMONIC and optionally process.env.DISPENSER_SENDER
   * if it's a rekeyed account, or against default LocalNet if no environment variables present.
   *
   * https://dev.algorand.co/concepts/smart-contracts/costs-constraints#mbr
   *
   * @param accountToFund The account to fund
   * @param minSpendingBalance The minimum balance of Algo that the account should have available to spend (i.e. on top of minimum balance requirement)
   * @param options Optional parameters to control the funding increment, transaction or execution of the transaction
   * @example Example using AlgorandClient
   * ```typescript
   * // Basic example
   * await accountManager.ensureFundedFromEnvironment("ACCOUNTADDRESS", algokit.algo(1))
   * // With configuration
   * await accountManager.ensureFundedFromEnvironment("ACCOUNTADDRESS", algokit.algo(1),
   *  { minFundingIncrement: algokit.algo(2), fee: (1000).microAlgo(), suppressLog: true }
   * )
   * ```
   * @returns
   * - The result of executing the dispensing transaction and the `amountFunded` if funds were needed.
   * - `undefined` if no funds were needed.
   */
  async ensureFundedFromEnvironment(
    accountToFund: string | Address,
    minSpendingBalance: AlgoAmount,
    options?: {
      minFundingIncrement?: AlgoAmount
    } & SendParams &
      Omit<CommonTransactionParams, 'sender'>,
  ): Promise<(SendSingleTransactionResult & EnsureFundedResult) | undefined> {
    const addressToFund = address(accountToFund)
    const dispenserAccount = await this.dispenserFromEnvironment()

    const amountFunded = await this._getEnsureFundedAmount(addressToFund, minSpendingBalance, options?.minFundingIncrement)
    if (!amountFunded) return undefined

    const result = await this._getComposer()
      .addPayment({
        ...options,
        sender: dispenserAccount,
        receiver: addressToFund,
        amount: amountFunded,
      })
      .send(options)

    return {
      ...result,
      transaction: result.transactions[0],
      confirmation: result.confirmations[0],
      transactionId: result.txIds[0],
      amountFunded: amountFunded,
    }
  }

  /**
   * Funds a given account using the TestNet Dispenser API as a funding source such that
   * the account has a certain amount of Algo free to spend (accounting for Algo locked
   * in minimum balance requirement).
   *
   * https://dev.algorand.co/concepts/smart-contracts/costs-constraints#mbr
   *
   * @param accountToFund The account to fund
   * @param dispenserClient The TestNet dispenser funding client
   * @param minSpendingBalance The minimum balance of Algo that the account should have available to spend (i.e. on top of minimum balance requirement)
   * @param options Optional parameters to control the funding increment, transaction or execution of the transaction
   * @example Example using AlgorandClient
   * ```typescript
   * // Basic example
   * await accountManager.ensureFundedFromTestNetDispenserApi("ACCOUNTADDRESS", algorand.client.getTestNetDispenserFromEnvironment(), algokit.algo(1))
   * // With configuration
   * await accountManager.ensureFundedFromTestNetDispenserApi("ACCOUNTADDRESS", algorand.client.getTestNetDispenserFromEnvironment(), algokit.algo(1),
   *  { minFundingIncrement: algokit.algo(2) }
   * )
   * ```
   * @returns
   * - The result of executing the dispensing transaction and the `amountFunded` if funds were needed.
   * - `undefined` if no funds were needed.
   */
  async ensureFundedFromTestNetDispenserApi(
    accountToFund: string | Address,
    dispenserClient: TestNetDispenserApiClient,
    minSpendingBalance: AlgoAmount,
    options?: {
      minFundingIncrement?: AlgoAmount
    },
  ): Promise<EnsureFundedResult | undefined> {
    if (!(await this._clientManager.isTestNet())) {
      throw new Error('Attempt to fund using TestNet dispenser API on non TestNet network.')
    }

    const addressToFund = address(accountToFund)

    const amountFunded = await this._getEnsureFundedAmount(addressToFund, minSpendingBalance, options?.minFundingIncrement)
    if (!amountFunded) return undefined

    const result = await dispenserClient.fund(addressToFund, amountFunded.microAlgo)
    return {
      amountFunded: AlgoAmount.MicroAlgo(result.amount),
      transactionId: result.txId,
    }
  }
}
