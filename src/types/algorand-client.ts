import algosdk from 'algosdk'
import { getAlgoNodeConfig, getConfigFromEnvOrDefaults, getDefaultLocalNetConfig } from '../network-client'
import { TransactionSignerAccount } from './account'
import { AccountManager } from './account-manager'
import { AlgoSdkClients, ClientManager } from './client-manager'
import AlgokitComposer, {
  AppCallParams,
  AssetConfigParams,
  AssetCreateParams,
  AssetDestroyParams,
  AssetFreezeParams,
  AssetOptInParams,
  AssetTransferParams,
  KeyRegParams,
  MethodCallParams,
  PayTxnParams,
} from './composer'
import { AlgoConfig } from './network-client'
import { SendAtomicTransactionComposerResults, SendTransactionFrom } from './transaction'

async function unwrapSingleSendResult(results: Promise<SendAtomicTransactionComposerResults>) {
  const result = await results

  return {
    // Last item covers when a group is created by an app call with ABI transaction parameters
    transaction: result.transactions[result.transactions.length - 1],
    confirmation: result.confirmations![result.confirmations!.length - 1],
    txId: result.txIds[0],
    ...result,
  }
}

/** A client that brokers easy access to Algorand functionality. */
export default class AlgorandClient {
  private _clientManager: ClientManager
  private _accountManager: AccountManager

  private _cachedSuggestedParams?: algosdk.SuggestedParams
  private _cachedSuggestedParamsExpiry?: Date
  private _cachedSuggestedParamsTimeout: number = 3_000 // three seconds

  private constructor(config: AlgoConfig | AlgoSdkClients) {
    this._clientManager = new ClientManager(config)
    this._accountManager = new AccountManager(this._clientManager)
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
    return new AlgokitComposer(
      this.client.algod,
      (addr: string) => this.account.getSigner(addr),
      () => this.getSuggestedParams(),
    )
  }

  /**
   * Methods for sending a transaction
   */
  send = {
    payment: (params: PayTxnParams) => {
      return unwrapSingleSendResult(this.newGroup().addPayment(params).execute())
    },
    assetCreate: (params: AssetCreateParams) => {
      return unwrapSingleSendResult(this.newGroup().addAssetCreate(params).execute())
    },
    assetConfig: (params: AssetConfigParams) => {
      return unwrapSingleSendResult(this.newGroup().addAssetConfig(params).execute())
    },
    assetFreeze: (params: AssetFreezeParams) => {
      return unwrapSingleSendResult(this.newGroup().addAssetFreeze(params).execute())
    },
    assetDestroy: (params: AssetDestroyParams) => {
      return unwrapSingleSendResult(this.newGroup().addAssetDestroy(params).execute())
    },
    assetTransfer: (params: AssetTransferParams) => {
      return unwrapSingleSendResult(this.newGroup().addAssetTransfer(params).execute())
    },
    appCall: (params: AppCallParams) => {
      return unwrapSingleSendResult(this.newGroup().addAppCall(params).execute())
    },
    keyReg: (params: KeyRegParams) => {
      return unwrapSingleSendResult(this.newGroup().addKeyReg(params).execute())
    },
    methodCall: (params: MethodCallParams) => {
      return unwrapSingleSendResult(this.newGroup().addMethodCall(params).execute())
    },
    assetOptIn: (params: AssetOptInParams) => {
      return unwrapSingleSendResult(this.newGroup().addAssetOptIn(params).execute())
    },
  }

  /**
   * Methods for building transactions
   */
  transactions = {
    payment: async (params: PayTxnParams) => {
      return (await this.newGroup().addPayment(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    assetCreate: async (params: AssetCreateParams) => {
      return (await this.newGroup().addAssetCreate(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    assetConfig: async (params: AssetConfigParams) => {
      return (await this.newGroup().addAssetConfig(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    assetFreeze: async (params: AssetFreezeParams) => {
      return (await this.newGroup().addAssetFreeze(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    assetDestroy: async (params: AssetDestroyParams) => {
      return (await this.newGroup().addAssetDestroy(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    assetTransfer: async (params: AssetTransferParams) => {
      return (await this.newGroup().addAssetTransfer(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    appCall: async (params: AppCallParams) => {
      return (await this.newGroup().addAppCall(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    keyReg: async (params: KeyRegParams) => {
      return (await this.newGroup().addKeyReg(params).buildGroup()).map((ts) => ts.txn)[0]
    },
    methodCall: async (params: MethodCallParams) => {
      return (await this.newGroup().addMethodCall(params).buildGroup()).map((ts) => ts.txn)
    },
    assetOptIn: async (params: AssetOptInParams) => {
      return (await this.newGroup().addAssetOptIn(params).buildGroup()).map((ts) => ts.txn)[0]
    },
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
