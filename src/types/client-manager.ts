import algosdk from 'algosdk'
import { SuggestedParamsWithMinFee } from 'algosdk/dist/types/types/transactions/base'
import { AlgoHttpClientWithRetry } from './algo-http-client-with-retry'
import { AppLookup } from './app'
import {
  AppDetails,
  AppDetailsBase,
  AppSpecAppDetailsBase,
  ApplicationClient,
  ResolveAppByCreatorAndNameBase,
  ResolveAppByIdBase,
} from './app-client'
import { TestNetDispenserApiClient, TestNetDispenserApiClientParams } from './dispenser-client'
import { AlgoClientConfig, AlgoConfig } from './network-client'
import Kmd = algosdk.Kmd
import Indexer = algosdk.Indexer
import Algodv2 = algosdk.Algodv2
import IntDecoding = algosdk.IntDecoding

/** Clients from algosdk that interact with the official Algorand APIs */
export interface AlgoSdkClients {
  /** Algod client, see https://developer.algorand.org/docs/rest-apis/algod/ */
  algod: algosdk.Algodv2
  /** Optional indexer client, see https://developer.algorand.org/docs/rest-apis/indexer/ */
  indexer?: algosdk.Indexer
  /** Optional KMD client, see https://developer.algorand.org/docs/rest-apis/kmd/ */
  kmd?: algosdk.Kmd
}

/** Details of the current network. */
export interface NetworkDetails {
  /** Whether or not the network is TestNet. */
  isTestNet: boolean
  /** Whether or not the network is MainNet. */
  isMainNet: boolean
  /** Whether or not the network is LocalNet. */
  isLocalNet: boolean
  /** The genesis ID of the current network. */
  genesisId: string
  /** The base64 genesis hash of the current network. */
  genesisHash: string
}

/** Exposes access to various API clients. */
export class ClientManager {
  private _algod: algosdk.Algodv2
  private _indexer?: algosdk.Indexer
  private _kmd?: algosdk.Kmd

  /**
   * algosdk clients or config for interacting with the official Algorand APIs.
   * @param clientsOrConfig The clients or config to use
   * @example Algod client only
   * ```typescript
   * const clientManager = new ClientManager({ algod: algodClient })
   * ```
   * @example All clients
   * ```typescript
   * const clientManager = new ClientManager({ algod: algodClient, indexer: indexerClient, kmd: kmdClient })
   * ```
   * @example Algod config only
   * ```typescript
   * const clientManager = new ClientManager({ algodConfig })
   * ```
   * @example All client configs
   * ```typescript
   * const clientManager = new ClientManager({ algodConfig, indexerConfig, kmdConfig })
   * ```
   */
  constructor(clientsOrConfig: AlgoConfig | AlgoSdkClients) {
    const _clients =
      'algod' in clientsOrConfig
        ? clientsOrConfig
        : {
            algod: ClientManager.getAlgodClient(clientsOrConfig.algodConfig),
            indexer: clientsOrConfig.indexerConfig ? ClientManager.getIndexerClient(clientsOrConfig.indexerConfig) : undefined,
            kmd: clientsOrConfig.kmdConfig ? ClientManager.getKmdClient(clientsOrConfig.kmdConfig) : undefined,
          }
    this._algod = _clients.algod
    this._indexer = _clients.indexer
    this._kmd = _clients.kmd
  }

  /** Returns an algosdk Algod API client. */
  public get algod(): algosdk.Algodv2 {
    return this._algod
  }

  /** Returns an algosdk Indexer API client or throws an error if it's not been provided. */
  public get indexer(): algosdk.Indexer {
    if (!this._indexer) throw new Error('Attempt to use Indexer client in AlgoKit instance with no Indexer configured')
    return this._indexer
  }

  /** Returns an algosdk KMD API client or throws an error if it's not been provided. */
  public get kmd(): algosdk.Kmd {
    if (!this._kmd) throw new Error('Attempt to use Kmd client in AlgoKit instance with no Kmd configured')
    return this._kmd
  }

  private _getNetworkPromise: Promise<SuggestedParamsWithMinFee> | undefined
  /**
   * Get details about the current network.
   * @example Getting genesis ID
   * ```typescript
   * const network = await networkClient.network()
   * const genesisId = network.genesisId
   * ```
   * @returns The current network details
   */
  public async network(): Promise<NetworkDetails> {
    if (!this._getNetworkPromise) {
      this._getNetworkPromise = this._algod.getTransactionParams().do()
    }

    const params = await this._getNetworkPromise
    return {
      isTestNet: ['testnet-v1.0', 'testnet-v1', 'testnet'].includes(params.genesisID),
      isMainNet: ['mainnet-v1.0', 'mainnet-v1', 'mainnet'].includes(params.genesisID),
      isLocalNet: params.genesisID === 'devnet-v1' || params.genesisID === 'sandnet-v1' || params.genesisID === 'dockernet-v1',
      genesisId: params.genesisID,
      genesisHash: params.genesisHash,
    }
  }

  /**
   * Returns true if the current network is LocalNet.
   * @returns True if the current network is LocalNet.
   */
  public async isLocalNet() {
    return (await this.network()).isLocalNet
  }

  /**
   * Returns true if the current network is TestNet.
   * @returns True if the current network is TestNet.
   */
  public async isTestNet() {
    return (await this.network()).isTestNet
  }

  /**
   * Returns true if the current network is MainNet.
   * @returns True if the current network is MainNet.
   */
  public async isMainNet() {
    return (await this.network()).isMainNet
  }

  /**
   * Returns a TestNet Dispenser API client.
   *
   * Refer to [docs](https://github.com/algorandfoundation/algokit/blob/main/docs/testnet_api.md) on guidance to obtain an access token.
   *
   * @param params An object containing parameters for the TestNetDispenserApiClient class.
   * @example
   * const client = clientManager.getTestNetDispenser(
   *     {
   *       authToken: 'your_auth_token',
   *       requestTimeout: 15,
   *     }
   * )
   *
   * @returns An instance of the TestNetDispenserApiClient class.
   */
  public getTestNetDispenser(params: TestNetDispenserApiClientParams) {
    return new TestNetDispenserApiClient(params)
  }

  /**
   * Returns a TestNet Dispenser API client, loading the auth token from `process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN`.
   *
   * Refer to [docs](https://github.com/algorandfoundation/algokit/blob/main/docs/testnet_api.md) on guidance to obtain an access token.
   *
   * @param params An object containing parameters for the TestNetDispenserApiClient class.
   * @example
   * const client = clientManager.getTestNetDispenserFromEnvironment(
   *     {
   *       requestTimeout: 15,
   *     }
   * )
   *
   * @returns An instance of the TestNetDispenserApiClient class.
   */
  public getTestNetDispenserFromEnvironment(params?: Omit<TestNetDispenserApiClientParams, 'authToken'>) {
    return new TestNetDispenserApiClient(params ? { ...params, authToken: '' } : undefined)
  }

  /**
   * Returns a new `ApplicationClient` client, resolving the app by creator address and name.
   * @param details The details to resolve the app by creator address and name
   * @param cachedAppLookup A cached app lookup that matches a name to on-chain details; either this is needed or indexer is required to be passed in to this manager on construction.
   * @returns The `ApplicationClient`
   */
  public getAppClientByCreatorAndName(details: AppClientByCreatorAndNameDetails, cachedAppLookup?: AppLookup) {
    return new ApplicationClient(
      { ...details, resolveBy: 'creatorAndName', findExistingUsing: cachedAppLookup ?? this.indexer },
      this._algod,
    )
  }

  /**
   * Returns a new `ApplicationClient` client, resolving the app by app ID.
   * @param details The details to resolve the app by ID
   * @returns The `ApplicationClient`
   */
  public getAppClientById(details: AppClientByIdDetails) {
    return new ApplicationClient({ ...details, resolveBy: 'id' }, this._algod)
  }

  /**
   * Returns a new typed client, resolving the app by creator address and name.
   * @param typedClient The typed client type to use
   * @param details The details to resolve the app by creator address and name
   * @param cachedAppLookup A cached app lookup that matches a name to on-chain details; either this is needed or indexer is required to be passed in to this manager on construction.
   * @example Use name in ARC-32 app spec
   * ```typescript
   * const appClient = algorand.client.getTypedAppClientByCreatorAndName(MyContractClient, {
   *   creatorAddress: "CREATORADDRESS",
   *   sender: alice,
   * })
   * ```
   * @example Specify name
   * ```typescript
   * const appClient = algorand.client.getTypedAppClientByCreatorAndName(MyContractClient, {
   *   creatorAddress: "CREATORADDRESS",
   *   name: "contract-name",
   *   sender: alice,
   * })
   * ```
   * @returns The typed client instance
   */
  public getTypedAppClientByCreatorAndName<TClient>(
    typedClient: TypedAppClient<TClient>,
    details: TypedAppClientByCreatorAndNameDetails,
    cachedAppLookup?: AppLookup,
  ) {
    return new typedClient({ ...details, resolveBy: 'creatorAndName', findExistingUsing: cachedAppLookup ?? this.indexer }, this._algod)
  }

  /**
   * Returns a new typed client, resolving the app by app ID.
   * @param typedClient The typed client type to use
   * @param details The details to resolve the app by ID
   * @example
   * ```typescript
   * const appClient = algorand.client.getTypedAppClientById(MyContractClient, {
   *   id: 12345,
   *   sender: alice,
   * })
   * ```
   * @returns The typed client instance
   */
  public getTypedAppClientById<TClient>(typedClient: TypedAppClient<TClient>, details: TypedAppClientByIdDetails) {
    return new typedClient({ ...details, resolveBy: 'id' }, this._algod)
  }

  /**
   * Retrieve client configurations from environment variables when defined or get defaults (expects to be called from a Node.js environment)
   *
   * If `process.env.ALGOD_SERVER` is defined it will use that along with optional `process.env.ALGOD_PORT` and `process.env.ALGOD_TOKEN`.
   *
   * If `process.env.INDEXER_SERVER` is defined it will use that along with optional `process.env.INDEXER_PORT` and `process.env.INDEXER_TOKEN`.
   *
   * If either aren't defined it will use the default LocalNet config, noting if `process.env.ALGOD_SERVER` is specified, but
   * `process.env.INDEXER_SERVER` isn't then it will leave indexer as `undefined`.
   *
   * It will return a KMD configuration that uses `process.env.KMD_PORT` (or port 4002) if `process.env.ALGOD_SERVER` is defined,
   * otherwise it will use the default LocalNet config unless it detects testnet or mainnet.
   * @example
   * ```typescript
   * const config = ClientManager.getConfigFromEnvironmentOrLocalNet()
   * ```
   * @returns The config for algod, indexer and kmd
   */
  public static getConfigFromEnvironmentOrLocalNet(): AlgoConfig {
    if (!process || !process.env) {
      throw new Error('Attempt to get default client configuration from a non Node.js context; supply the config instead')
    }
    const algodConfig = !process.env.ALGOD_SERVER
      ? ClientManager.getDefaultLocalNetConfig('algod')
      : ClientManager.getAlgodConfigFromEnvironment()

    const indexerConfig = !process.env.INDEXER_SERVER
      ? ClientManager.getDefaultLocalNetConfig('indexer')
      : !process.env.ALGOD_SERVER
        ? ClientManager.getIndexerConfigFromEnvironment()
        : undefined

    return {
      algodConfig,
      indexerConfig,
      kmdConfig: process.env.ALGOD_SERVER
        ? process.env.ALGOD_SERVER.includes('mainnet') || process.env.ALGOD_SERVER.includes('testnet')
          ? undefined
          : { ...algodConfig, port: process?.env?.KMD_PORT ?? '4002' }
        : ClientManager.getDefaultLocalNetConfig('kmd'),
    }
  }

  /** Retrieve the algod configuration from environment variables (expects to be called from a Node.js environment)
   *
   * Expects `process.env.ALGOD_SERVER` to be defined, and you can also specify `process.env.ALGOD_PORT` and `process.env.ALGOD_TOKEN`.
   */
  public static getAlgodConfigFromEnvironment(): AlgoClientConfig {
    if (!process || !process.env) {
      throw new Error('Attempt to get default algod configuration from a non Node.js context; supply the config instead')
    }

    if (!process.env.ALGOD_SERVER) {
      throw new Error('Attempt to get default algod configuration without specifying ALGOD_SERVER in the environment variables')
    }

    return {
      server: process.env.ALGOD_SERVER,
      port: process.env.ALGOD_PORT,
      token: process.env.ALGOD_TOKEN,
    }
  }

  /**
   * Retrieve the indexer configuration from environment variables (expects to be called from a Node.js environment).
   *
   * Expects `process.env.INDEXER_SERVER` to be defined, and you can also specify `process.env.INDEXER_PORT` and `process.env.INDEXER_TOKEN`.
   */
  public static getIndexerConfigFromEnvironment(): AlgoClientConfig {
    if (!process || !process.env) {
      throw new Error('Attempt to get default indexer configuration from a non Node.js context; supply the config instead')
    }

    if (!process.env.INDEXER_SERVER) {
      throw new Error('Attempt to get default indexer configuration without specifying INDEXER_SERVER in the environment variables')
    }

    return {
      server: process.env.INDEXER_SERVER,
      port: process.env.INDEXER_PORT,
      token: process.env.INDEXER_TOKEN,
    }
  }

  /** Returns the Algorand configuration to point to the free tier of the AlgoNode service.
   *
   * @param network Which network to connect to - TestNet or MainNet
   * @param config Which algod config to return - Algod or Indexer
   */
  public static getAlgoNodeConfig(network: 'testnet' | 'mainnet', config: 'algod' | 'indexer'): AlgoClientConfig {
    return {
      server: `https://${network}-${config === 'algod' ? 'api' : 'idx'}.algonode.cloud/`,
      port: 443,
    }
  }

  /** Returns the Algorand configuration to point to the default LocalNet.
   *
   * @param configOrPort Which algod config to return - algod, kmd, or indexer OR a port number
   */
  public static getDefaultLocalNetConfig(configOrPort: 'algod' | 'indexer' | 'kmd' | number): AlgoClientConfig {
    return {
      server: `http://localhost`,
      port: configOrPort === 'algod' ? 4001 : configOrPort === 'indexer' ? 8980 : configOrPort === 'kmd' ? 4002 : configOrPort,
      token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    }
  }

  /**
   * Returns an algod SDK client that automatically retries on idempotent calls.
   *
   * @param config The config of the client
   * @example AlgoNode (testnet)
   * ```typescript
   *  const algod = ClientManager.getAlgodClient(ClientManager.getAlgoNodeConfig('testnet', 'algod'))
   *  await algod.healthCheck().do()
   * ```
   * @example AlgoNode (mainnet)
   * ```typescript
   *  const algod = ClientManager.getAlgodClient(ClientManager.getAlgoNodeConfig('mainnet', 'algod'))
   *  await algod.healthCheck().do()
   * ```
   * @example Custom (e.g. default LocalNet)
   * ```typescript
   *  const algod = ClientManager.getAlgodClient({server: 'http://localhost', port: '4001', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
   *  await algod.healthCheck().do()
   * ```
   */
  public static getAlgodClient(config: AlgoClientConfig): Algodv2 {
    const { token, server, port } = config
    const tokenHeader = typeof token === 'string' ? { 'X-Algo-API-Token': token } : token ?? {}
    const httpClientWithRetry = new AlgoHttpClientWithRetry(tokenHeader, server, port)
    return new algosdk.Algodv2(httpClientWithRetry, server)
  }

  /**
   * Returns an algod SDK client that automatically retries on idempotent calls loaded from environment variables (expects to be called from a Node.js environment).
   *
   * @example
   *  ```typescript
   *  // Uses process.env.ALGOD_SERVER, process.env.ALGOD_PORT and process.env.ALGOD_TOKEN
   *  const algod = ClientManager.getAlgodClientFromEnvironment()
   *  await algod.healthCheck().do()
   *  ```
   */
  public static getAlgodClientFromEnvironment(): Algodv2 {
    return ClientManager.getAlgodClient(ClientManager.getAlgodConfigFromEnvironment())
  }

  /**
   * Returns an indexer SDK client that automatically retries on idempotent calls
   *
   * @param config The config of the client
   * @param overrideIntDecoding Override the default int decoding for responses, uses MIXED by default to avoid lost precision for big integers
   * @example AlgoNode (testnet)
   * ```typescript
   *  const indexer = ClientManager.getIndexerClient(ClientManager.getAlgoNodeConfig('testnet', 'indexer'))
   *  await indexer.makeHealthCheck().do()
   * ```
   * @example AlgoNode (mainnet)
   * ```typescript
   *  const indexer = ClientManager.getIndexerClient(ClientManager.getAlgoNodeConfig('mainnet', 'indexer'))
   *  await indexer.makeHealthCheck().do()
   * ```
   * @example Custom (e.g. default LocalNet, although we recommend loading this into a .env and using the Default option instead)
   * ```typescript
   *  const indexer = ClientManager.getIndexerClient({server: 'http://localhost', port: '8980', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
   *  await indexer.makeHealthCheck().do()
   * ```
   * @example Override int decoding for responses
   * ```typescript
   *  const indexer = ClientManager.getIndexerClient(config, IntDecoding.BIGINT)
   * ```
   */
  public static getIndexerClient(config: AlgoClientConfig, overrideIntDecoding?: IntDecoding): Indexer {
    const { token, server, port } = config
    const tokenHeader = typeof token === 'string' ? { 'X-Indexer-API-Token': token } : token ?? {}
    const httpClientWithRetry = new AlgoHttpClientWithRetry(tokenHeader, server, port)
    const indexer = new Indexer(httpClientWithRetry)
    // Use mixed int decoding by default so bigints don't have lost precision
    indexer.setIntEncoding(overrideIntDecoding ?? IntDecoding.MIXED)
    return indexer
  }

  /**
   * Returns an indexer SDK client that automatically retries on idempotent calls loaded from environment variables (expects to be called from a Node.js environment).
   *
   * @param overrideIntDecoding Override the default int decoding for responses, uses MIXED by default to avoid lost precision for big integers
   * @example
   *
   *  ```typescript
   *  // Uses process.env.INDEXER_SERVER, process.env.INDEXER_PORT and process.env.INDEXER_TOKEN
   *  const indexer = ClientManager.getIndexerClientFromEnvironment()
   *  await indexer.makeHealthCheck().do()
   *  ```
   */
  public static getIndexerClientFromEnvironment(overrideIntDecoding?: IntDecoding): Indexer {
    return ClientManager.getIndexerClient(ClientManager.getIndexerConfigFromEnvironment(), overrideIntDecoding)
  }

  /**
   * Returns a KMD SDK client.
   *
   * KMD client allows you to export private keys, which is useful to (for instance) get the default account in a LocalNet network.
   *
   * @param config The config for the client
   * @example Custom (e.g. default LocalNet, although we recommend loading this into a .env and using the Default option instead)
   * ```typescript
   *  const kmd = ClientManager.getKmdClient({server: 'http://localhost', port: '4002', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
   * ```
   */
  public static getKmdClient(config: AlgoClientConfig): Kmd {
    const { token, server, port } = config
    return new Kmd(token as string, server, port)
  }

  /**
   * Returns a KMD SDK client that automatically retries on idempotent calls loaded from environment variables (expects to be called from a Node.js environment).
   *
   * @example
   *  ```typescript
   *  // Uses process.env.ALGOD_SERVER, process.env.KMD_PORT (or if not specified: port 4002) and process.env.ALGOD_TOKEN
   *  const kmd = ClientManager.getKmdClientFromEnvironment()
   *  ```
   */
  public static getKmdClientFromEnvironment(): Kmd {
    // We can only use Kmd on the LocalNet otherwise it's not exposed so this makes some assumptions
    // (e.g. same token and server as algod and port 4002 by default)
    return ClientManager.getKmdClient({ ...ClientManager.getAlgodConfigFromEnvironment(), port: process?.env?.KMD_PORT ?? '4002' })
  }
}

/**
 * Interface to identify a typed client that can be used to interact with an application.
 */
export interface TypedAppClient<TClient> {
  new (details: AppDetails, algod: algosdk.Algodv2): TClient
}

/**
 * Details to resolve an app client by creator address and name.
 */
export type AppClientByCreatorAndNameDetails = AppSpecAppDetailsBase &
  AppDetailsBase &
  Omit<ResolveAppByCreatorAndNameBase, 'findExistingUsing'>

/**
 * Details to resolve a typed app creator address and name.
 */
export type TypedAppClientByCreatorAndNameDetails = AppDetailsBase & Omit<ResolveAppByCreatorAndNameBase, 'findExistingUsing'>

/**
 * Details to resolve an app client by app ID.
 */
export type AppClientByIdDetails = AppSpecAppDetailsBase & AppDetailsBase & ResolveAppByIdBase

/**
 * Details to resolve a typed app by app ID.
 */
export type TypedAppClientByIdDetails = AppDetailsBase & ResolveAppByIdBase
