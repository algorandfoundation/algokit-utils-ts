import algosdk from 'algosdk'
import { MultisigAccount, SigningAccount, TransactionSignerAccount } from './account'
import { AccountManager } from './account-manager'
import { AlgorandClientInterface } from './algorand-client-interface'
import { AlgorandClientTransactionCreator } from './algorand-client-transaction-creator'
import { AlgorandClientTransactionSender } from './algorand-client-transaction-sender'
import { AppDeployer } from './app-deployer'
import { AppManager } from './app-manager'
import { AssetManager } from './asset-manager'
import { AlgoSdkClients, ClientManager } from './client-manager'
import AlgoKitComposer from './composer'
import { AlgoConfig } from './network-client'
import Account = algosdk.Account
import LogicSigAccount = algosdk.LogicSigAccount

/**
 * A client that brokers easy access to Algorand functionality.
 */
export class AlgorandClient implements AlgorandClientInterface {
  private _clientManager: ClientManager
  private _accountManager: AccountManager
  private _appManager: AppManager
  private _appDeployer: AppDeployer
  private _assetManager: AssetManager
  private _transactionSender: AlgorandClientTransactionSender
  private _transactionCreator: AlgorandClientTransactionCreator

  private _cachedSuggestedParams?: algosdk.SuggestedParams
  private _cachedSuggestedParamsExpiry?: Date
  private _cachedSuggestedParamsTimeout: number = 3_000 // three seconds

  private _defaultValidityWindow: number | undefined = undefined

  private constructor(config: AlgoConfig | AlgoSdkClients) {
    this._clientManager = new ClientManager(config, this)
    this._accountManager = new AccountManager(this._clientManager)
    this._appManager = new AppManager(this._clientManager.algod)
    this._assetManager = new AssetManager(this._clientManager.algod, () => this.newGroup())
    this._transactionSender = new AlgorandClientTransactionSender(() => this.newGroup(), this._assetManager, this._appManager)
    this._transactionCreator = new AlgorandClientTransactionCreator(() => this.newGroup())
    this._appDeployer = new AppDeployer(this._appManager, this._transactionSender, this._clientManager.indexerIfPresent)
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

  /** Methods for interacting with apps. */
  public get app() {
    return this._appManager
  }

  /** Methods for deploying apps and managing app deployment metadata. */
  public get appDeployer() {
    return this._appDeployer
  }

  /** Start a new `AlgoKitComposer` transaction group */
  public newGroup() {
    return new AlgoKitComposer({
      algod: this.client.algod,
      getSigner: (addr: string) => this.account.getSigner(addr),
      getSuggestedParams: () => this.getSuggestedParams(),
      defaultValidityWindow: this._defaultValidityWindow,
      appManager: this._appManager,
    })
  }

  /**
   * Methods for sending a single transaction.
   */
  public get send() {
    return this._transactionSender
  }

  /**
   * Methods for building transactions
   */
  public get transactions() {
    return this._transactionCreator
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
