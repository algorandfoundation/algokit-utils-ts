import { SuggestedParams } from '@algorandfoundation/algokit-algod-client'
import { Address, ReadableAddress } from '@algorandfoundation/algokit-common'
import { AddressWithTransactionSigner, MultisigAccount } from '@algorandfoundation/algokit-transact'
import type { Account } from '@algorandfoundation/sdk'
import * as algosdk from '@algorandfoundation/sdk'
import { LogicSigAccount } from '@algorandfoundation/sdk'
import { SigningAccount } from './account'
import { AccountManager } from './account-manager'
import { AlgorandClientTransactionCreator } from './algorand-client-transaction-creator'
import { AlgorandClientTransactionSender } from './algorand-client-transaction-sender'
import { AppDeployer } from './app-deployer'
import { AppManager } from './app-manager'
import { AssetManager } from './asset-manager'
import { AlgoSdkClients, ClientManager } from './client-manager'
import { ErrorTransformer, TransactionComposer, TransactionComposerConfig } from './composer'
import { AlgoConfig } from './network-client'

/**
 * A client that brokers easy access to Algorand functionality.
 */
export class AlgorandClient {
  private _clientManager: ClientManager
  private _accountManager: AccountManager
  private _appManager: AppManager
  private _appDeployer: AppDeployer
  private _assetManager: AssetManager
  private _transactionSender: AlgorandClientTransactionSender
  private _transactionCreator: AlgorandClientTransactionCreator

  private _cachedSuggestedParams?: SuggestedParams
  private _cachedSuggestedParamsExpiry?: Date
  private _cachedSuggestedParamsTimeout: number = 3_000 // three seconds

  private _defaultValidityWindow: bigint | undefined = undefined

  /**
   * A set of error transformers to use when an error is caught in simulate or execute
   * `registerErrorTransformer` and `unregisterErrorTransformer` can be used to add and remove
   * error transformers from the set.
   */
  private _errorTransformers: Set<ErrorTransformer> = new Set()

  private constructor(config: AlgoConfig | AlgoSdkClients) {
    this._clientManager = new ClientManager(config, this)
    this._accountManager = new AccountManager(this._clientManager)
    this._appManager = new AppManager(this._clientManager.algod)
    this._assetManager = new AssetManager(this._clientManager.algod, (config) => this.newGroup(config))
    this._transactionSender = new AlgorandClientTransactionSender((config) => this.newGroup(config), this._assetManager, this._appManager)
    this._transactionCreator = new AlgorandClientTransactionCreator((config) => this.newGroup(config))
    this._appDeployer = new AppDeployer(this._appManager, this._transactionSender, this._clientManager.indexerIfPresent)
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
   * Sets the default signer to use if no other signer is specified.
   * @param signer The signer to use, either a `TransactionSigner` or a `AddressWithSigner`
   * @returns The `AlgorandClient` so method calls can be chained
   * @example
   * ```typescript
   * const signer = new SigningAccount(account, account.addr)
   * const algorand = AlgorandClient.mainNet().setDefaultSigner(signer)
   * ```
   */
  public setDefaultSigner(signer: algosdk.TransactionSigner | AddressWithTransactionSigner): AlgorandClient {
    this._accountManager.setDefaultSigner(signer)
    return this
  }

  /**
   * Tracks the given account (object that encapsulates an address and a signer) for later signing.
   * @param account The account to register, which can be a `AddressWithSigner` or
   *  a `algosdk.Account`, `algosdk.LogicSigAccount`, `SigningAccount` or `MultisigAccount`
   * @example
   * ```typescript
   * const accountManager = AlgorandClient.mainNet()
   *  .setSignerFromAccount(algosdk.generateAccount())
   *  .setSignerFromAccount(new algosdk.LogicSigAccount(program, args))
   *  .setSignerFromAccount(new SigningAccount(account, sender))
   *  .setSignerFromAccount(new MultisigAccount({version: 1, threshold: 1, addrs: ["ADDRESS1...", "ADDRESS2..."]}, [account1, account2]))
   *  .setSignerFromAccount({addr: "SENDERADDRESS", signer: transactionSigner})
   * ```
   * @returns The `AlgorandClient` so method calls can be chained
   */
  public setSignerFromAccount(account: AddressWithTransactionSigner | Account | LogicSigAccount | SigningAccount | MultisigAccount) {
    this._accountManager.setSignerFromAccount(account)
    return this
  }

  /**
   * Tracks the given signer against the given sender for later signing.
   * @param sender The sender address to use this signer for
   * @param signer The signer to sign transactions with for the given sender
   * @returns The `AlgorandClient` so method calls can be chained
   * @example
   * ```typescript
   * const signer = new SigningAccount(account, account.addr)
   * const algorand = AlgorandClient.mainNet().setSigner(signer.addr, signer.signer)
   * ```
   */
  public setSigner(sender: string | Address, signer: algosdk.TransactionSigner) {
    this._accountManager.setSigner(sender, signer)
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
  public setSuggestedParamsCache(suggestedParams: SuggestedParams, until?: Date) {
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
  public async getSuggestedParams(): Promise<SuggestedParams> {
    if (this._cachedSuggestedParams && (!this._cachedSuggestedParamsExpiry || this._cachedSuggestedParamsExpiry > new Date())) {
      return {
        ...this._cachedSuggestedParams,
      }
    }

    this._cachedSuggestedParams = await this._clientManager.algod.suggestedParams()
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
    return this._clientManager
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
  public newGroup(composerConfig?: TransactionComposerConfig) {
    return new TransactionComposer({
      algod: this.client.algod,
      getSigner: (addr: ReadableAddress) => this.account.getSigner(addr),
      getSuggestedParams: () => this.getSuggestedParams(),
      defaultValidityWindow: this._defaultValidityWindow,
      appManager: this._appManager,
      errorTransformers: [...this._errorTransformers],
      composerConfig: composerConfig,
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

  // Static methods to create an `AlgorandClient`

  /**
   * Creates an `AlgorandClient` pointing at default LocalNet ports and API token.
   * @returns An instance of the `AlgorandClient`.
   * @example
   * const algorand = AlgorandClient.defaultLocalNet();
   */
  public static defaultLocalNet() {
    return new AlgorandClient({
      algodConfig: ClientManager.getDefaultLocalNetConfig('algod'),
      indexerConfig: ClientManager.getDefaultLocalNetConfig('indexer'),
      kmdConfig: ClientManager.getDefaultLocalNetConfig('kmd'),
    })
  }

  /**
   * Creates an `AlgorandClient` pointing at TestNet using AlgoNode.
   * @returns An instance of the `AlgorandClient`.
   * @example
   * const algorand = AlgorandClient.testNet();
   */
  public static testNet() {
    return new AlgorandClient({
      algodConfig: ClientManager.getAlgoNodeConfig('testnet', 'algod'),
      indexerConfig: ClientManager.getAlgoNodeConfig('testnet', 'indexer'),
      kmdConfig: undefined,
    })
  }

  /**
   * Creates an `AlgorandClient` pointing at MainNet using AlgoNode.
   * @returns An instance of the `AlgorandClient`.
   * @example
   * const algorand = AlgorandClient.mainNet();
   */
  public static mainNet() {
    return new AlgorandClient({
      algodConfig: ClientManager.getAlgoNodeConfig('mainnet', 'algod'),
      indexerConfig: ClientManager.getAlgoNodeConfig('mainnet', 'indexer'),
      kmdConfig: undefined,
    })
  }

  /**
   * Creates an `AlgorandClient` pointing to the given client(s).
   * @param clients The clients to use.
   * @returns An instance of the `AlgorandClient`.
   * @example
   * const algorand = AlgorandClient.fromClients({ algod, indexer, kmd });
   */
  public static fromClients(clients: AlgoSdkClients) {
    return new AlgorandClient(clients)
  }

  /**
   * Creates an `AlgorandClient` loading the configuration from environment variables.
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
   * @returns An instance of the `AlgorandClient`.
   * @example
   * const client = AlgorandClient.fromEnvironment();
   */
  public static fromEnvironment() {
    return new AlgorandClient(ClientManager.getConfigFromEnvironmentOrLocalNet())
  }

  /**
   * Creates  an `AlgorandClient` from the given config.
   * @param config The config to use.
   * @returns An instance of the `AlgorandClient`.
   * @example
   * const client = AlgorandClient.fromConfig({ algodConfig, indexerConfig, kmdConfig });
   */
  public static fromConfig(config: AlgoConfig) {
    return new AlgorandClient(config)
  }
}
