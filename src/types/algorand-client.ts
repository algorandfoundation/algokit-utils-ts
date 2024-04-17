import algosdk from 'algosdk'
import { Config } from '..'
import { getAlgoNodeConfig, getConfigFromEnvOrDefaults, getDefaultLocalNetConfig } from '../network-client'
import { TransactionSignerAccount } from './account'
import { AccountManager } from './account-manager'
import { AlgoSdkClients, ClientManager } from './client-manager'
import AlgokitComposer, { ExecuteParams, MethodCallParams } from './composer'
import { AlgoConfig } from './network-client'
import { ConfirmedTransactionResult, SendAtomicTransactionComposerResults, SendTransactionFrom } from './transaction'
import Transaction = algosdk.Transaction

/** Result from sending a single transaction. */
export type SendSingleTransactionResult = SendAtomicTransactionComposerResults & ConfirmedTransactionResult

/** A client that brokers easy access to Algorand functionality.
 *
 * Note: this class is a new Beta feature and may be subject to change.
 *
 * @beta
 */
export class AlgorandClient {
  private _clientManager: ClientManager
  private _accountManager: AccountManager

  private _cachedSuggestedParams?: algosdk.SuggestedParams
  private _cachedSuggestedParamsExpiry?: Date
  private _cachedSuggestedParamsTimeout: number = 3_000 // three seconds

  private _defaultValidityWindow: number = 10

  private constructor(config: AlgoConfig | AlgoSdkClients) {
    this._clientManager = new ClientManager(config)
    this._accountManager = new AccountManager(this._clientManager)
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
   * @param account The account to register
   * @returns The `AlgorandClient` so method calls can be chained
   */
  public setSignerFromAccount(account: TransactionSignerAccount | SendTransactionFrom) {
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
  async getSuggestedParams(): Promise<algosdk.SuggestedParams> {
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

  /** Start a new `AlgokitComposer` transaction group */
  newGroup() {
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
  ): (params: T, config?: ExecuteParams) => Promise<SendSingleTransactionResult> {
    return async (params, config) => {
      const composer = this.newGroup()

      // Ensure `this` is properly populated
      c(composer).apply(composer, [params])

      if (log?.preLog) {
        const transaction = (await composer.build()).transactions.at(-1)!.txn
        Config.getLogger(config?.suppressLog).debug(log.preLog(params, transaction))
      }

      const rawResult = await composer.execute(config)
      const result = {
        // Last item covers when a group is created by an app call with ABI transaction parameters
        transaction: rawResult.transactions[rawResult.transactions.length - 1],
        confirmation: rawResult.confirmations![rawResult.confirmations!.length - 1],
        txId: rawResult.txIds[0],
        ...rawResult,
      }

      if (log?.postLog) {
        Config.getLogger(config?.suppressLog).debug(log.postLog(params, result))
      }

      return result
    }
  }

  /**
   * Methods for sending a single transaction.
   */
  send = {
    /**
     * Send a payment transaction.
     */
    payment: this._send((c) => c.addPayment, {
      preLog: (params, transaction) =>
        `Sending ${params.amount.microAlgos} µALGOs from ${params.sender} to ${params.receiver} via transaction ${transaction.txID()}`,
    }),
    /**
     * Create an asset.
     */
    assetCreate: this._send((c) => c.addAssetCreate, {
      postLog: (params, result) =>
        `Created asset${params.assetName ? ` ${params.assetName} ` : ''}${params.unitName ? ` (${params.unitName}) ` : ''} with ${params.total} units and ${params.decimals ?? 0} decimals created by ${params.sender} with ID ${result.confirmation.assetIndex} via transaction ${result.txIds.at(-1)}`,
    }),
    /**
     * Configure an existing asset.
     */
    assetConfig: this._send((c) => c.addAssetConfig, {
      preLog: (params, transaction) => `Configuring asset with ID ${params.assetId} via transaction ${transaction.txID()}`,
    }),
    /**
     * Freeze or unfreeze an asset.
     */
    assetFreeze: this._send((c) => c.addAssetFreeze, {
      preLog: (params, transaction) => `Freezing asset with ID ${params.assetId} via transaction ${transaction.txID()}`,
    }),
    /**
     * Destroy an asset.
     */
    assetDestroy: this._send((c) => c.addAssetDestroy, {
      preLog: (params, transaction) => `Destroying asset with ID ${params.assetId} via transaction ${transaction.txID()}`,
    }),
    /**
     * Transfer an asset.
     */
    assetTransfer: this._send((c) => c.addAssetTransfer, {
      preLog: (params, transaction) =>
        `Transferring ${params.amount} units of asset with ID ${params.assetId} from ${params.sender} to ${params.receiver} via transaction ${transaction.txID()}`,
    }),
    /**
     * Opt an account into an asset.
     */
    assetOptIn: this._send((c) => c.addAssetOptIn, {
      preLog: (params, transaction) =>
        `Opting in ${params.sender} to asset with ID ${params.assetId} via transaction ${transaction.txID()}`,
    }),
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
  transactions = {
    /** Create a payment transaction. */
    payment: this._transaction((c) => c.addPayment),
    /** Create an asset creation transaction. */
    assetCreate: this._transaction((c) => c.addAssetCreate),
    /** Create an asset config transaction. */
    assetConfig: this._transaction((c) => c.addAssetConfig),
    /** Create an asset freeze transaction. */
    assetFreeze: this._transaction((c) => c.addAssetFreeze),
    /** Create an asset destroy transaction. */
    assetDestroy: this._transaction((c) => c.addAssetDestroy),
    /** Create an asset transfer transaction. */
    assetTransfer: this._transaction((c) => c.addAssetTransfer),
    /** Create an asset opt-in transaction. */
    assetOptIn: this._transaction((c) => c.addAssetOptIn),
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
      algodConfig: getDefaultLocalNetConfig('algod'),
      indexerConfig: getDefaultLocalNetConfig('indexer'),
      kmdConfig: getDefaultLocalNetConfig('kmd'),
    })
  }

  /**
   * Returns an `AlgorandClient` pointing at TestNet using AlgoNode.
   * @returns The `AlgorandClient`
   */
  public static testNet() {
    return new AlgorandClient({
      algodConfig: getAlgoNodeConfig('testnet', 'algod'),
      indexerConfig: getAlgoNodeConfig('testnet', 'indexer'),
      kmdConfig: undefined,
    })
  }

  /**
   * Returns an `AlgorandClient` pointing at MainNet using AlgoNode.
   * @returns The `AlgorandClient`
   */
  public static mainNet() {
    return new AlgorandClient({
      algodConfig: getAlgoNodeConfig('mainnet', 'algod'),
      indexerConfig: getAlgoNodeConfig('mainnet', 'indexer'),
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
   * Retrieve configurations from environment variables when defined or get defaults.
   *
   * Expects to be called from a Node.js environment.
   * @returns The `AlgorandClient`
   */
  public static fromEnvironment() {
    return new AlgorandClient(getConfigFromEnvOrDefaults())
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
