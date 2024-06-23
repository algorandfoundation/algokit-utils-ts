import algosdk from 'algosdk'
import { Config } from '../config'
import { MultisigAccount, SigningAccount, TransactionSignerAccount } from './account'
import { AccountManager } from './account-manager'
import { AssetManager } from './asset-manager'
import { AlgoSdkClients, ClientManager } from './client-manager'
import AlgokitComposer, { AssetCreateParams, AssetOptOutParams, ExecuteParams, MethodCallParams } from './composer'
import { AlgoConfig } from './network-client'
import { ConfirmedTransactionResult, SendAtomicTransactionComposerResults } from './transaction'
import Transaction = algosdk.Transaction
import Account = algosdk.Account
import LogicSigAccount = algosdk.LogicSigAccount

/** Result from sending a single transaction. */
export type SendSingleTransactionResult = SendAtomicTransactionComposerResults & ConfirmedTransactionResult

/**
 * A client that brokers easy access to Algorand functionality.
 */
export class AlgorandClient {
  private _clientManager: ClientManager
  private _accountManager: AccountManager
  private _assetManager: AssetManager

  private _cachedSuggestedParams?: algosdk.SuggestedParams
  private _cachedSuggestedParamsExpiry?: Date
  private _cachedSuggestedParamsTimeout: number = 3_000 // three seconds

  private _defaultValidityWindow: number = 10

  private constructor(config: AlgoConfig | AlgoSdkClients) {
    this._clientManager = new ClientManager(config)
    this._accountManager = new AccountManager(this._clientManager)
    this._assetManager = new AssetManager(this._clientManager)
  }

  /**
   * Sets the default validity window for transactions.
   * @param validityWindow The number of rounds between the first and last valid rounds
   * @returns The `AlgorandClient` so method calls can be chained
   */
  public setDefaultValidityWindow(validityWindow: number) {
    this._defaultValidityWindow = validityWindow
    return this
  }

  /**
   * Sets the default signer to use if no other signer is specified.
   * @param signer The signer to use, either a `TransactionSigner` or a `TransactionSignerAccount`
   * @returns The `AlgorandClient` so method calls can be chained
   */
  public setDefaultSigner(signer: algosdk.TransactionSigner | TransactionSignerAccount): AlgorandClient {
    this._accountManager.setDefaultSigner(signer)
    return this
  }

  /**
   * Tracks the given account for later signing.
   * @param account The account to register, which can be a `TransactionSignerAccount` or
   *  a `algosdk.Account`, `algosdk.LogicSigAccount`, `SigningAccount` or `MultisigAccount`
   * @example
   * ```typescript
   * const accountManager = AlgorandClient.mainnet()
   *  .setSignerFromAccount(algosdk.generateAccount())
   *  .setSignerFromAccount(new algosdk.LogicSigAccount(program, args))
   *  .setSignerFromAccount(new SigningAccount(mnemonic, sender))
   *  .setSignerFromAccount(new MultisigAccount({version: 1, threshold: 1, addrs: ["ADDRESS1...", "ADDRESS2..."]}, [account1, account2]))
   *  .setSignerFromAccount({addr: "SENDERADDRESS", signer: transactionSigner})
   * ```
   * @returns The `AlgorandClient` so method calls can be chained
   */
  public setSignerFromAccount(
    account: TransactionSignerAccount | TransactionSignerAccount | Account | LogicSigAccount | SigningAccount | MultisigAccount,
  ) {
    this._accountManager.setSignerFromAccount(account)
    return this
  }

  /**
   * Tracks the given account for later signing.
   * @param sender The sender address to use this signer for
   * @param signer The signer to sign transactions with for the given sender
   * @returns The `AlgorandClient` so method calls can be chained
   */
  public setSigner(sender: string, signer: algosdk.TransactionSigner) {
    this._accountManager.setSigner(sender, signer)
    return this
  }

  /**
   * Sets a cache value to use for suggested params.
   * @param suggestedParams The suggested params to use
   * @param until A date until which to cache, or if not specified then the timeout is used
   * @returns The `AlgorandClient` so method calls can be chained
   */
  public setSuggestedParams(suggestedParams: algosdk.SuggestedParams, until?: Date) {
    this._cachedSuggestedParams = suggestedParams
    this._cachedSuggestedParamsExpiry = until ?? new Date(+new Date() + this._cachedSuggestedParamsTimeout)
    return this
  }

  /**
   * Sets the timeout for caching suggested params.
   * @param timeout The timeout in milliseconds
   * @returns The `AlgorandClient` so method calls can be chained
   */
  public setSuggestedParamsTimeout(timeout: number) {
    this._cachedSuggestedParamsTimeout = timeout
    return this
  }

  /** Get suggested params for a transaction (either cached or from algod if the cache is stale or empty) */
  public async getSuggestedParams(): Promise<algosdk.SuggestedParams> {
    if (this._cachedSuggestedParams && (!this._cachedSuggestedParamsExpiry || this._cachedSuggestedParamsExpiry > new Date())) {
      return {
        ...this._cachedSuggestedParams,
      }
    }

    this._cachedSuggestedParams = await this._clientManager.algod.getTransactionParams().do()
    this._cachedSuggestedParamsExpiry = new Date(new Date().getTime() + this._cachedSuggestedParamsTimeout)

    return {
      ...this._cachedSuggestedParams,
    }
  }

  /** Get clients, including algosdk clients and app clients. */
  public get client() {
    return this._clientManager
  }

  /** Get or create accounts that can sign transactions. */
  public get account() {
    return this._accountManager
  }

  /** Methods for interacting with assets. */
  public get asset() {
    return this._assetManager
  }

  /** Start a new `AlgokitComposer` transaction group */
  public newGroup() {
    return new AlgokitComposer({
      algod: this.client.algod,
      getSigner: (addr: string) => this.account.getSigner(addr),
      getSuggestedParams: () => this.getSuggestedParams(),
      defaultValidityWindow: this._defaultValidityWindow,
    })
  }

  private _send<T>(
    c: (c: AlgokitComposer) => (params: T) => AlgokitComposer,
    log?: {
      preLog?: (params: T, transaction: Transaction) => string
      postLog?: (params: T, result: SendSingleTransactionResult) => string
    },
  ): (params: T & ExecuteParams) => Promise<SendSingleTransactionResult> {
    return async (params) => {
      const composer = this.newGroup()

      // Ensure `this` is properly populated
      c(composer).apply(composer, [params])

      if (log?.preLog) {
        const transaction = (await composer.build()).transactions.at(-1)!.txn
        Config.getLogger(params?.suppressLog).debug(log.preLog(params, transaction))
      }

      const rawResult = await composer.execute(params)
      const result = {
        // Last item covers when a group is created by an app call with ABI transaction parameters
        transaction: rawResult.transactions[rawResult.transactions.length - 1],
        confirmation: rawResult.confirmations![rawResult.confirmations!.length - 1],
        txId: rawResult.txIds[0],
        ...rawResult,
      }

      if (log?.postLog) {
        Config.getLogger(params?.suppressLog).debug(log.postLog(params, result))
      }

      return result
    }
  }

  /**
   * Methods for sending a single transaction.
   */
  public send = {
    /**
     * Send a payment transaction to transfer Algos between accounts.
     * @param params The parameters for the payment transaction
     * @example Basic example
     * ```typescript
     * const result = await algorandClient.send.payment({
     *  sender: 'SENDERADDRESS',
     *  receiver: 'RECEIVERADDRESS',
     *  amount: (4).algos(),
     * })
     * ```
     * @example Advanced example
     * ```typescript
     * const result = await algorandClient.send.payment({
     *   amount: (4).algos(),
     *   receiver: 'RECEIVERADDRESS',
     *   sender: 'SENDERADDRESS',
     *   closeRemainderTo: 'CLOSEREMAINDERTOADDRESS',
     *   lease: 'lease',
     *   note: 'note',
     *   // Use this with caution, it's generally better to use algorand.account.rekeyAccount
     *   rekeyTo: 'REKEYTOADDRESS',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     *   // Signer only needed if you want to provide one,
     *   //  generally you'd register it with AlgorandClient
     *   //  against the sender and not need to pass it in
     *   signer: transactionSigner,
     *   maxRoundsToWaitForConfirmation: 5,
     *   suppressLog: true,
     * })
     * ```
     *
     * @returns The result of the transaction and the transaction that was sent
     */
    payment: this._send((c) => c.addPayment, {
      preLog: (params, transaction) =>
        `Sending ${params.amount.microAlgos} µAlgos from ${params.sender} to ${params.receiver} via transaction ${transaction.txID()}`,
    }),
    /**
     * Create a new Algorand Standard Asset.
     *
     * The account that sends this transaction will automatically be
     * opted in to the asset and will hold all units after creation.
     *
     * @param params The parameters for the asset creation transaction
     *
     * @example Basic example
     * ```typescript
     * await algorand.send.assetCreate({sender: "CREATORADDRESS", total: 100n})
     * ```
     * @example Advanced example
     * ```typescript
     * await algorand.send.assetCreate({
     *   sender: 'CREATORADDRESS',
     *   total: 100n,
     *   decimals: 2,
     *   assetName: 'asset',
     *   unitName: 'unit',
     *   url: 'url',
     *   metadataHash: 'metadataHash',
     *   defaultFrozen: false,
     *   manager: 'MANAGERADDRESS',
     *   reserve: 'RESERVEADDRESS',
     *   freeze: 'FREEZEADDRESS',
     *   clawback: 'CLAWBACKADDRESS',
     *   lease: 'lease',
     *   note: 'note',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     *   // Signer only needed if you want to provide one,
     *   //  generally you'd register it with AlgorandClient
     *   //  against the sender and not need to pass it in
     *   signer: transactionSigner,
     *   maxRoundsToWaitForConfirmation: 5,
     *   suppressLog: true,
     * })
     * ```
     * @returns The result of the transaction and the transaction that was sent
     */
    assetCreate: async (params: AssetCreateParams & ExecuteParams) => {
      const result = await this._send((c) => c.addAssetCreate, {
        postLog: (params, result) =>
          `Created asset${params.assetName ? ` ${params.assetName}` : ''}${params.unitName ? ` (${params.unitName})` : ''} with ${params.total} units and ${params.decimals ?? 0} decimals created by ${params.sender} with ID ${result.confirmation.assetIndex} via transaction ${result.txIds.at(-1)}`,
      })(params)
      return { ...result, assetId: BigInt(result.confirmation.assetIndex ?? 0) }
    },
    /**
     * Configure an existing Algorand Standard Asset.
     *
     * **Note:** The manager, reserve, freeze, and clawback addresses
     * are immutably empty if they are not set. If manager is not set then
     * all fields are immutable from that point forward.
     *
     * @param params The parameters for the asset config transaction
     *
     * @example Basic example
     * ```typescript
     * await algorand.send.assetConfig({sender: "MANAGERADDRESS", assetId: 123456n, manager: "MANAGERADDRESS" })
     * ```
     * @example Advanced example
     * ```typescript
     * await algorand.send.assetCreate({
     *   sender: 'MANAGERADDRESS',
     *   assetId: 123456n,
     *   manager: 'MANAGERADDRESS',
     *   reserve: 'RESERVEADDRESS',
     *   freeze: 'FREEZEADDRESS',
     *   clawback: 'CLAWBACKADDRESS',
     *   lease: 'lease',
     *   note: 'note',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     *   // Signer only needed if you want to provide one,
     *   //  generally you'd register it with AlgorandClient
     *   //  against the sender and not need to pass it in
     *   signer: transactionSigner,
     *   maxRoundsToWaitForConfirmation: 5,
     *   suppressLog: true,
     * })
     * ```
     * @returns The result of the transaction and the transaction that was sent
     */
    assetConfig: this._send((c) => c.addAssetConfig, {
      preLog: (params, transaction) => `Configuring asset with ID ${params.assetId} via transaction ${transaction.txID()}`,
    }),
    /**
     * Freeze or unfreeze an Algorand Standard Asset for an account.
     *
     * @param params The parameters for the asset freeze transaction
     *
     * @example Basic example
     * ```typescript
     * await algorand.send.assetFreeze({sender: "MANAGERADDRESS", assetId: 123456n, account: "ACCOUNTADDRESS", frozen: true })
     * ```
     * @example Advanced example
     * ```typescript
     * await algorand.send.assetFreeze({
     *   sender: 'MANAGERADDRESS',
     *   assetId: 123456n,
     *   account: 'ACCOUNTADDRESS',
     *   frozen: true,
     *   lease: 'lease',
     *   note: 'note',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     *   // Signer only needed if you want to provide one,
     *   //  generally you'd register it with AlgorandClient
     *   //  against the sender and not need to pass it in
     *   signer: transactionSigner,
     *   maxRoundsToWaitForConfirmation: 5,
     *   suppressLog: true,
     * })
     * ```
     * @returns The result of the transaction and the transaction that was sent
     */
    assetFreeze: this._send((c) => c.addAssetFreeze, {
      preLog: (params, transaction) => `Freezing asset with ID ${params.assetId} via transaction ${transaction.txID()}`,
    }),
    /**
     * Destroys an Algorand Standard Asset.
     *
     * Created assets can be destroyed only by the asset manager account.
     * All of the assets must be owned by the creator of the asset before
     * the asset can be deleted.
     *
     * @param params The parameters for the asset destroy transaction
     *
     * @example Basic example
     * ```typescript
     * await algorand.send.assetDestroy({sender: "MANAGERADDRESS", assetId: 123456n })
     * ```
     * @example Advanced example
     * ```typescript
     * await algorand.send.assetDestroy({
     *   sender: 'MANAGERADDRESS',
     *   assetId: 123456n,
     *   lease: 'lease',
     *   note: 'note',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     *   // Signer only needed if you want to provide one,
     *   //  generally you'd register it with AlgorandClient
     *   //  against the sender and not need to pass it in
     *   signer: transactionSigner,
     *   maxRoundsToWaitForConfirmation: 5,
     *   suppressLog: true,
     * })
     * ```
     * @returns The result of the transaction and the transaction that was sent
     */
    assetDestroy: this._send((c) => c.addAssetDestroy, {
      preLog: (params, transaction) => `Destroying asset with ID ${params.assetId} via transaction ${transaction.txID()}`,
    }),
    /**
     * Transfer an Algorand Standard Asset.
     *
     * @param params The parameters for the asset transfer transaction
     *
     * @example Basic example
     * ```typescript
     * await algorand.send.assetTransfer({sender: "HOLDERADDRESS", assetId: 123456n, amount: 1n, receiver: "RECEIVERADDRESS" })
     * ```
     * @example Advanced example (with clawback)
     * ```typescript
     * await algorand.send.assetTransfer({
     *   sender: 'CLAWBACKADDRESS',
     *   assetId: 123456n,
     *   amount: 1n,
     *   receiver: 'RECEIVERADDRESS',
     *   clawbackTarget: 'HOLDERADDRESS',
     *   // This field needs to be used with caution
     *   closeAssetTo: 'ADDRESSTOCLOSETO'
     *   lease: 'lease',
     *   note: 'note',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     *   // Signer only needed if you want to provide one,
     *   //  generally you'd register it with AlgorandClient
     *   //  against the sender and not need to pass it in
     *   signer: transactionSigner,
     *   maxRoundsToWaitForConfirmation: 5,
     *   suppressLog: true,
     * })
     * ```
     * @returns The result of the transaction and the transaction that was sent
     */
    assetTransfer: this._send((c) => c.addAssetTransfer, {
      preLog: (params, transaction) =>
        `Transferring ${params.amount} units of asset with ID ${params.assetId} from ${params.sender} to ${params.receiver} via transaction ${transaction.txID()}`,
    }),
    /**
     * Opt an account into an Algorand Standard Asset.
     *
     * @param params The parameters for the asset opt-in transaction
     *
     * @example Basic example
     * ```typescript
     * await algorand.send.assetOptIn({sender: "SENDERADDRESS", assetId: 123456n })
     * ```
     * @example Advanced example
     * ```typescript
     * await algorand.send.assetOptIn({
     *   sender: 'SENDERADDRESS',
     *   assetId: 123456n,
     *   lease: 'lease',
     *   note: 'note',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     *   // Signer only needed if you want to provide one,
     *   //  generally you'd register it with AlgorandClient
     *   //  against the sender and not need to pass it in
     *   signer: transactionSigner,
     *   maxRoundsToWaitForConfirmation: 5,
     *   suppressLog: true,
     * })
     * ```
     * @returns The result of the transaction and the transaction that was sent
     */
    assetOptIn: this._send((c) => c.addAssetOptIn, {
      preLog: (params, transaction) =>
        `Opting in ${params.sender} to asset with ID ${params.assetId} via transaction ${transaction.txID()}`,
    }),
    /**
     * Opt an account out of an Algorand Standard Asset.
     *
     * *Note:* If the account has a balance of the asset,
     * it will not be able to opt-out unless `ensureZeroBalance`
     * is set to `false` (but then the account will lose the assets).
     *
     * @param params The parameters for the asset opt-out transaction
     *
     * @example Basic example (without creator)
     * ```typescript
     * await algorand.send.assetOptOut({sender: "SENDERADDRESS", assetId: 123456n, ensureZeroBalance: true })
     * ```
     * @example Basic example (with creator)
     * ```typescript
     * await algorand.send.assetOptOut({sender: "SENDERADDRESS", creator: "CREATORADDRESS", assetId: 123456n, ensureZeroBalance: true })
     * ```
     * @example Advanced example
     * ```typescript
     * await algorand.send.assetOptOut({
     *   sender: 'SENDERADDRESS',
     *   assetId: 123456n,
     *   creator: 'CREATORADDRESS',
     *   ensureZeroBalance: true,
     *   lease: 'lease',
     *   note: 'note',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     *   // Signer only needed if you want to provide one,
     *   //  generally you'd register it with AlgorandClient
     *   //  against the sender and not need to pass it in
     *   signer: transactionSigner,
     *   maxRoundsToWaitForConfirmation: 5,
     *   suppressLog: true,
     * })
     * ```
     * @returns The result of the transaction and the transaction that was sent
     */
    assetOptOut: async (
      params: Omit<AssetOptOutParams, 'creator'> & {
        /** Optional asset creator account address; if not specified it will be retrieved from algod */
        creator?: string
        /** Whether or not to check if the account has a zero balance first or not.
         *
         * If this is set to `true` and the account has an asset balance it will throw an error.
         *
         * If this is set to `false` and the account has an asset balance it will lose those assets to the asset creator.
         */
        ensureZeroBalance: boolean
      } & ExecuteParams,
    ) => {
      if (params.ensureZeroBalance) {
        let balance = 0n
        try {
          const accountAssetInfo = await this.account.getAssetInformation(params.sender, params.assetId)
          balance = accountAssetInfo.balance
        } catch (e) {
          throw new Error(`Account ${params.sender} is not opted-in to Asset ${params.assetId}; can't opt-out.`)
        }
        if (balance !== 0n) {
          throw new Error(`Account ${params.sender} does not have a zero balance for Asset ${params.assetId}; can't opt-out.`)
        }
      }

      params.creator = params.creator ?? (await this.asset.getById(params.assetId)).creator

      return await this._send((c) => c.addAssetOptOut, {
        preLog: (params, transaction) =>
          `Opting ${params.sender} out of asset with ID ${params.assetId} to creator ${params.creator} via transaction ${transaction.txID()}`,
      })(params as AssetOptOutParams & ExecuteParams)
    },
    /**
     * Call a smart contract.
     *
     * Note: you may prefer to use `algorandClient.client` to get an app client for more advanced functionality.
     */
    appCall: this._send((c) => c.addAppCall),
    /**
     * Call a smart contract ABI method.
     *
     * Note: you may prefer to use `algorandClient.client` to get an app client for more advanced functionality.
     */
    methodCall: this._send((c) => c.addMethodCall),
    /** Register an online key. */
    onlineKeyRegistration: this._send((c) => c.addOnlineKeyRegistration, {
      preLog: (params, transaction) => `Registering online key for ${params.sender} via transaction ${transaction.txID()}`,
    }),
  }

  private _transaction<T>(c: (c: AlgokitComposer) => (params: T) => AlgokitComposer): (params: T) => Promise<Transaction> {
    return async (params: T) => {
      const composer = this.newGroup()
      const result = await c(composer).apply(composer, [params]).build()
      return result.transactions.map((ts) => ts.txn)[0]
    }
  }

  /**
   * Methods for building transactions
   */
  public transactions = {
    /**
     * Create a payment transaction to transfer Algos between accounts.
     * @param params The parameters for the payment transaction
     * @example Basic example
     * ```typescript
     * const result = await algorandClient.send.payment({
     *  sender: 'SENDERADDRESS',
     *  receiver: 'RECEIVERADDRESS',
     *  amount: (4).algos(),
     * })
     * ```
     * @example Advanced example
     * ```typescript
     * const result = await algorandClient.send.payment({
     *   amount: (4).algos(),
     *   receiver: 'RECEIVERADDRESS',
     *   sender: 'SENDERADDRESS',
     *   closeRemainderTo: 'CLOSEREMAINDERTOADDRESS',
     *   lease: 'lease',
     *   note: 'note',
     *   // Use this with caution, it's generally better to use algorand.account.rekeyAccount
     *   rekeyTo: 'REKEYTOADDRESS',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     * })
     * ```
     *
     * @returns The payment transaction
     */
    payment: this._transaction((c) => c.addPayment),
    /** Create a create Algorand Standard Asset transaction.
     *
     * The account that sends this transaction will automatically be
     * opted in to the asset and will hold all units after creation.
     *
     * @param params The parameters for the asset creation transaction
     *
     * @example Basic example
     * ```typescript
     * await algorand.transaction.assetCreate({sender: "CREATORADDRESS", total: 100n})
     * ```
     * @example Advanced example
     * ```typescript
     * await algorand.transaction.assetCreate({
     *   sender: 'CREATORADDRESS',
     *   total: 100n,
     *   decimals: 2,
     *   assetName: 'asset',
     *   unitName: 'unit',
     *   url: 'url',
     *   metadataHash: 'metadataHash',
     *   defaultFrozen: false,
     *   manager: 'MANAGERADDRESS',
     *   reserve: 'RESERVEADDRESS',
     *   freeze: 'FREEZEADDRESS',
     *   clawback: 'CLAWBACKADDRESS',
     *   lease: 'lease',
     *   note: 'note',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     * })
     * ```
     * @returns The asset create transaction
     */
    assetCreate: this._transaction((c) => c.addAssetCreate),
    /** Create an asset config transaction to reconfigure an existing Algorand Standard Asset.
     *
     * **Note:** The manager, reserve, freeze, and clawback addresses
     * are immutably empty if they are not set. If manager is not set then
     * all fields are immutable from that point forward.
     *
     * @param params The parameters for the asset config transaction
     *
     * @example Basic example
     * ```typescript
     * await algorand.transaction.assetConfig({sender: "MANAGERADDRESS", assetId: 123456n, manager: "MANAGERADDRESS" })
     * ```
     * @example Advanced example
     * ```typescript
     * await algorand.transaction.assetCreate({
     *   sender: 'MANAGERADDRESS',
     *   assetId: 123456n,
     *   manager: 'MANAGERADDRESS',
     *   reserve: 'RESERVEADDRESS',
     *   freeze: 'FREEZEADDRESS',
     *   clawback: 'CLAWBACKADDRESS',
     *   lease: 'lease',
     *   note: 'note',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     * })
     * ```
     * @returns The asset config transaction
     */
    assetConfig: this._transaction((c) => c.addAssetConfig),
    /** Create an Algorand Standard Asset freeze transaction.
     *
     * @param params The parameters for the asset freeze transaction
     *
     * @example Basic example
     * ```typescript
     * await algorand.transaction.assetFreeze({sender: "MANAGERADDRESS", assetId: 123456n, account: "ACCOUNTADDRESS", frozen: true })
     * ```
     * @example Advanced example
     * ```typescript
     * await algorand.transaction.assetFreeze({
     *   sender: 'MANAGERADDRESS',
     *   assetId: 123456n,
     *   account: 'ACCOUNTADDRESS',
     *   frozen: true,
     *   lease: 'lease',
     *   note: 'note',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     * })
     * ```
     * @returns The asset freeze transaction
     */
    assetFreeze: this._transaction((c) => c.addAssetFreeze),
    /** Create an Algorand Standard Asset destroy transaction.
     *
     * Created assets can be destroyed only by the asset manager account.
     * All of the assets must be owned by the creator of the asset before
     * the asset can be deleted.
     *
     * @param params The parameters for the asset destroy transaction
     *
     * @example Basic example
     * ```typescript
     * await algorand.transaction.assetDestroy({sender: "MANAGERADDRESS", assetId: 123456n })
     * ```
     * @example Advanced example
     * ```typescript
     * await algorand.transaction.assetDestroy({
     *   sender: 'MANAGERADDRESS',
     *   assetId: 123456n,
     *   lease: 'lease',
     *   note: 'note',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     * })
     * ```
     * @returns The asset destroy transaction
     */
    assetDestroy: this._transaction((c) => c.addAssetDestroy),
    /** Create an Algorand Standard Asset transfer transaction.
     *
     * @param params The parameters for the asset transfer transaction
     *
     * @example Basic example
     * ```typescript
     * await algorand.transaction.assetTransfer({sender: "HOLDERADDRESS", assetId: 123456n, amount: 1n, receiver: "RECEIVERADDRESS" })
     * ```
     * @example Advanced example (with clawback)
     * ```typescript
     * await algorand.transaction.assetTransfer({
     *   sender: 'CLAWBACKADDRESS',
     *   assetId: 123456n,
     *   amount: 1n,
     *   receiver: 'RECEIVERADDRESS',
     *   clawbackTarget: 'HOLDERADDRESS',
     *   // This field needs to be used with caution
     *   closeAssetTo: 'ADDRESSTOCLOSETO'
     *   lease: 'lease',
     *   note: 'note',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     * })
     * ```
     * @returns The result of the asset transfer transaction
     */
    assetTransfer: this._transaction((c) => c.addAssetTransfer),
    /** Create an Algorand Standard Asset opt-in transaction.
     *
     * @param params The parameters for the asset opt-in transaction
     *
     * @example Basic example
     * ```typescript
     * await algorand.transaction.assetOptIn({sender: "SENDERADDRESS", assetId: 123456n })
     * ```
     * @example Advanced example
     * ```typescript
     * await algorand.transaction.assetOptIn({
     *   sender: 'SENDERADDRESS',
     *   assetId: 123456n,
     *   lease: 'lease',
     *   note: 'note',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     * })
     * ```
     * @returns The asset opt-in transaction
     */
    assetOptIn: this._transaction((c) => c.addAssetOptIn),
    /** Create an asset opt-out transaction.
     *
     * *Note:* If the account has a balance of the asset,
     * it will lose those assets
     *
     * @param params The parameters for the asset opt-out transaction
     *
     * @example Basic example
     * ```typescript
     * await algorand.transaction.assetOptOut({sender: "SENDERADDRESS", creator: "CREATORADDRESS", assetId: 123456n })
     * ```
     * @example Advanced example
     * ```typescript
     * await algorand.transaction.assetOptIn({
     *   sender: 'SENDERADDRESS',
     *   assetId: 123456n,
     *   creator: 'CREATORADDRESS',
     *   ensureZeroBalance: true,
     *   lease: 'lease',
     *   note: 'note',
     *   // You wouldn't normally set this field
     *   firstValidRound: 1000n,
     *   validityWindow: 10,
     *   extraFee: (1000).microAlgos(),
     *   staticFee: (1000).microAlgos(),
     *   // Max fee doesn't make sense with extraFee AND staticFee
     *   //  already specified, but here for completeness
     *   maxFee: (3000).microAlgos(),
     * })
     * ```
     * @returns The asset opt-out transaction
     */
    assetOptOut: this._transaction((c) => c.addAssetOptOut),
    /** Create an application call transaction. */
    appCall: this._transaction((c) => c.addAppCall),
    /** Create an application call with ABI method call transaction. */
    methodCall: async (params: MethodCallParams) => {
      return (await this.newGroup().addMethodCall(params).build()).transactions.map((ts) => ts.txn)
    },
    /** Create an online key registration transaction. */
    onlineKeyRegistration: this._transaction((c) => c.addOnlineKeyRegistration),
  }

  // Static methods to create an `AlgorandClient`

  /**
   * Returns an `AlgorandClient` pointing at default LocalNet ports and API token.
   * @returns The `AlgorandClient`
   */
  public static defaultLocalNet() {
    return new AlgorandClient({
      algodConfig: ClientManager.getDefaultLocalNetConfig('algod'),
      indexerConfig: ClientManager.getDefaultLocalNetConfig('indexer'),
      kmdConfig: ClientManager.getDefaultLocalNetConfig('kmd'),
    })
  }

  /**
   * Returns an `AlgorandClient` pointing at TestNet using AlgoNode.
   * @returns The `AlgorandClient`
   */
  public static testNet() {
    return new AlgorandClient({
      algodConfig: ClientManager.getAlgoNodeConfig('testnet', 'algod'),
      indexerConfig: ClientManager.getAlgoNodeConfig('testnet', 'indexer'),
      kmdConfig: undefined,
    })
  }

  /**
   * Returns an `AlgorandClient` pointing at MainNet using AlgoNode.
   * @returns The `AlgorandClient`
   */
  public static mainNet() {
    return new AlgorandClient({
      algodConfig: ClientManager.getAlgoNodeConfig('mainnet', 'algod'),
      indexerConfig: ClientManager.getAlgoNodeConfig('mainnet', 'indexer'),
      kmdConfig: undefined,
    })
  }

  /**
   * Returns an `AlgorandClient` pointing to the given client(s).
   * @param clients The clients to use
   * @returns The `AlgorandClient`
   */
  public static fromClients(clients: AlgoSdkClients) {
    return new AlgorandClient(clients)
  }

  /**
   * Returns an `AlgorandClient` loading the configuration from environment variables.
   *
   * Retrieve configurations from environment variables when defined or get default LocalNet configuration if they aren't defined.
   *
   * Expects to be called from a Node.js environment.
   *
   * If `process.env.ALGOD_SERVER` is defined it will use that along with optional `process.env.ALGOD_PORT` and `process.env.ALGOD_TOKEN`.
   *
   * If `process.env.INDEXER_SERVER` is defined it will use that along with optional `process.env.INDEXER_PORT` and `process.env.INDEXER_TOKEN`.
   *
   * If either aren't defined it will use the default LocalNet config.
   *
   * It will return a KMD configuration that uses `process.env.KMD_PORT` (or port 4002) if `process.env.ALGOD_SERVER` is defined,
   * otherwise it will use the default LocalNet config unless it detects testnet or mainnet.
   * @returns The `AlgorandClient`
   */
  public static fromEnvironment() {
    return new AlgorandClient(ClientManager.getConfigFromEnvironmentOrLocalNet())
  }

  /**
   * Returns an `AlgorandClient` from the given config.
   * @param config The config to use
   * @returns The `AlgorandClient`
   */
  public static fromConfig(config: AlgoConfig) {
    return new AlgorandClient(config)
  }
}

export default AlgorandClient
