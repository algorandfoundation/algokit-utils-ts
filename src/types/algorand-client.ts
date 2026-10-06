import algosdk, { Address, Algodv2 } from 'algosdk'
import type { AccountManager } from './account-manager'
import { AlgorandClientTransactionCreator } from './algorand-client-transaction-creator'
import { AlgorandClientTransactionSender } from './algorand-client-transaction-sender'
import type { AppDeployer } from './app-deployer'
import type { AppManager } from './app-manager'
import type { AssetManager } from './asset-manager'
import type { AlgoSdkClients, ClientManager } from './client-manager'
import { ErrorTransformer, TransactionComposer } from './composer'
import { InterfaceOf } from './instance-of'

type AlgorandClientConfig = Partial<AlgoSdkClients> & {
  clientManager?: Partial<InterfaceOf<ClientManager>>
  accountManager?: Partial<InterfaceOf<AccountManager>>
  appManager?: Partial<InterfaceOf<AppManager>>
  assetManager?: Partial<InterfaceOf<AssetManager>>
  appDeployer?: Partial<InterfaceOf<AppDeployer>>
}

/**
 * A client that brokers easy access to Algorand functionality.
 */
export class AlgorandClient {
  private _clientManager: Partial<InterfaceOf<ClientManager>>
  private _accountManager: Partial<InterfaceOf<AccountManager>>
  private _appManager: Partial<InterfaceOf<AppManager>>
  private _appDeployer: Partial<InterfaceOf<AppDeployer>>
  private _assetManager: Partial<InterfaceOf<AssetManager>>
  private _transactionSender: AlgorandClientTransactionSender
  private _transactionCreator: AlgorandClientTransactionCreator

  private _cachedSuggestedParams?: algosdk.SuggestedParams
  private _cachedSuggestedParamsExpiry?: Date
  private _cachedSuggestedParamsTimeout: number = 3_000 // three seconds

  private _defaultValidityWindow: bigint | undefined = undefined

  private _algod: Algodv2

  /**
   * A set of error transformers to use when an error is caught in simulate or execute
   * `registerErrorTransformer` and `unregisterErrorTransformer` can be used to add and remove
   * error transformers from the set.
   */
  private _errorTransformers: Set<ErrorTransformer> = new Set()

  private constructor(config: AlgorandClientConfig) {
    const algod = config.algod ?? config.clientManager?.algod

    if (algod === undefined) {
      throw new Error('An algod client must be provided in the config or clientManager')
    }

    this._algod = algod
    this._clientManager = config.clientManager ?? {}
    this._accountManager = config.accountManager ?? {}
    this._appManager = config.appManager ?? {}
    this._assetManager = config.assetManager ?? {}
    this._transactionSender = new AlgorandClientTransactionSender(() => this.newGroup(), this._algod)
    this._transactionCreator = new AlgorandClientTransactionCreator(() => this.newGroup())
    this._appDeployer = config.appDeployer ?? {}
  }

  /**
   * Sets the default validity window for transactions.
   * @param validityWindow The number of rounds between the first and last valid rounds
   * @returns The `AlgorandClient` so method calls can be chained
   * @example
   * ```typescript
   * const algorand = AlgorandClient.mainNet().setDefaultValidityWindow(1000);
   * ```
   */
  public setDefaultValidityWindow(validityWindow: number | bigint) {
    this._defaultValidityWindow = BigInt(validityWindow)
    return this
  }

  /**
   * Sets a cache value to use for suggested transaction params.
   * @param suggestedParams The suggested params to use
   * @param until A date until which to cache, or if not specified then the timeout is used
   * @returns The `AlgorandClient` so method calls can be chained
   * @example
   * ```typescript
   * const algorand = AlgorandClient.mainNet().setSuggestedParamsCache(suggestedParams, new Date(+new Date() + 3_600_000))
   * ```
   */
  public setSuggestedParamsCache(suggestedParams: algosdk.SuggestedParams, until?: Date) {
    this._cachedSuggestedParams = suggestedParams
    this._cachedSuggestedParamsExpiry = until ?? new Date(+new Date() + this._cachedSuggestedParamsTimeout)
    return this
  }

  /**
   * Sets the timeout for caching suggested params.
   * @param timeout The timeout in milliseconds
   * @returns The `AlgorandClient` so method calls can be chained
   * @example
   * ```typescript
   * const algorand = AlgorandClient.mainNet().setSuggestedParamsCacheTimeout(10_000)
   * ```
   */
  public setSuggestedParamsCacheTimeout(timeout: number) {
    this._cachedSuggestedParamsTimeout = timeout
    return this
  }

  /**
   * Get suggested params for a transaction (either cached or from algod if the cache is stale or empty)
   * @returns The suggested transaction parameters.
   * @example
   * const params = await AlgorandClient.mainNet().getSuggestedParams();
   */
  public async getSuggestedParams(): Promise<algosdk.SuggestedParams> {
    if (this._cachedSuggestedParams && (!this._cachedSuggestedParamsExpiry || this._cachedSuggestedParamsExpiry > new Date())) {
      return {
        ...this._cachedSuggestedParams,
      }
    }

    this._cachedSuggestedParams = await this._algod.getTransactionParams().do()
    this._cachedSuggestedParamsExpiry = new Date(new Date().getTime() + this._cachedSuggestedParamsTimeout)

    return {
      ...this._cachedSuggestedParams,
    }
  }

  /**
   * Get clients, including algosdk clients and app clients.
   * @returns The `ClientManager` instance.
   * @example
   * const clientManager = AlgorandClient.mainNet().client;
   */
  public get client() {
    return this._clientManager ?? { algod: this._algod }
  }

  /**
   * Get or create accounts that can sign transactions.
   * @returns The `AccountManager` instance.
   * @example
   * const accountManager = AlgorandClient.mainNet().account;
   */
  public get account() {
    return this._accountManager
  }

  /**
   * Methods for interacting with assets.
   * @returns The `AssetManager` instance.
   * @example
   * const assetManager = AlgorandClient.mainNet().asset;
   */
  public get asset() {
    return this._assetManager
  }

  /**
   * Methods for interacting with apps.
   * @returns The `AppManager` instance.
   * @example
   * const appManager = AlgorandClient.mainNet().app;
   */
  public get app() {
    return this._appManager
  }

  /**
   * Methods for deploying apps and managing app deployment metadata.
   * @returns The `AppDeployer` instance.
   * @example
   * const deployer = AlgorandClient.mainNet().appDeployer;
   */
  public get appDeployer() {
    return this._appDeployer
  }

  /**
   * Register a function that will be used to transform an error caught when simulating or executing
   * composed transaction groups made from `newGroup`
   */
  public registerErrorTransformer(transformer: ErrorTransformer) {
    this._errorTransformers.add(transformer)
  }

  public unregisterErrorTransformer(transformer: ErrorTransformer) {
    this._errorTransformers.delete(transformer)
  }

  /** Start a new `TransactionComposer` transaction group
   * @returns A new instance of `TransactionComposer`.
   * @example
   * const composer = AlgorandClient.mainNet().newGroup();
   * const result = await composer.addTransaction(payment).send()
   */
  public newGroup() {
    const errorGetSigner = (addr: string | Address) => {
      throw new Error(`No signer available for address ${addr}`)
    }
    const getSigner = this.account.getSigner ?? errorGetSigner

    return new TransactionComposer({
      algod: this._algod,
      getSigner,
      getSuggestedParams: () => this.getSuggestedParams(),
      defaultValidityWindow: this._defaultValidityWindow,
      errorTransformers: [...this._errorTransformers],
    })
  }

  /**
   * Methods for sending a transaction.
   * @returns The `AlgorandClientTransactionSender` instance.
   * @example
   * const result = await AlgorandClient.mainNet().send.payment({
   *  sender: "SENDERADDRESS",
   *  receiver: "RECEIVERADDRESS",
   *  amount: algo(1)
   * })
   */
  public get send() {
    return this._transactionSender
  }

  /**
   * Methods for creating a transaction.
   * @returns The `AlgorandClientTransactionCreator` instance.
   * @example
   * const payment = await AlgorandClient.mainNet().createTransaction.payment({
   *  sender: "SENDERADDRESS",
   *  receiver: "RECEIVERADDRESS",
   *  amount: algo(1)
   * })
   */
  public get createTransaction() {
    return this._transactionCreator
  }
}
