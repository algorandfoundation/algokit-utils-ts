import { TransactionParams } from '@algorandfoundation/algod-client'
import * as algosdk from '../sdk'
import { AlgoHttpClientWithRetry } from './algo-http-client-with-retry'
import { type AlgorandClient } from './algorand-client'
import { AppClient, AppClientParams, ResolveAppClientByCreatorAndName } from './app-client'
import { AppFactory, AppFactoryParams } from './app-factory'
import { TestNetDispenserApiClient, TestNetDispenserApiClientParams } from './dispenser-client'
import { Expand } from './expand'
import { AlgoClientConfig, AlgoConfig, NetworkDetails, genesisIdIsLocalNet } from './network-client'
import Kmd = algosdk.Kmd
import Indexer = algosdk.Indexer
import Algodv2 = algosdk.Algodv2

/** Clients from algosdk that interact with the official Algorand APIs */
export interface AlgoSdkClients {
  /** Algod client, see https://dev.algorand.co/reference/rest-apis/algod/ */
  algod: algosdk.Algodv2
  /** Optional indexer client, see https://dev.algorand.co/reference/rest-apis/indexer */
  indexer?: algosdk.Indexer
  /** Optional KMD client, see https://dev.algorand.co/reference/rest-apis/kmd/ */
  kmd?: algosdk.Kmd
}

/** Params to get an app factory from `ClientManager`. */
export type ClientAppFactoryParams = Expand<Omit<AppFactoryParams, 'algorand'>>

/** Params to get an app client by creator address and name from `ClientManager`. */
export type ClientResolveAppClientByCreatorAndNameParams = Expand<Omit<ResolveAppClientByCreatorAndName, 'algorand'>>

/** Params to get an app client by ID from `ClientManager`. */
export type ClientAppClientParams = Expand<Omit<AppClientParams, 'algorand'>>

/** Params to get an app client by network from `ClientManager`. */
export type ClientAppClientByNetworkParams = Expand<Omit<AppClientParams, 'algorand' | 'appId'>>

/** Params to get a typed app client by creator address and name from `ClientManager`. */
export type ClientTypedAppClientByCreatorAndNameParams = Expand<Omit<ResolveAppClientByCreatorAndName, 'algorand' | 'appSpec'>>

/** Params to get a typed app client by ID from `ClientManager`. */
export type ClientTypedAppClientParams = Expand<Omit<AppClientParams, 'algorand' | 'appSpec'>>

/** Params to get a typed app client by network from `ClientManager`. */
export type ClientTypedAppClientByNetworkParams = Expand<Omit<AppClientParams, 'algorand' | 'appSpec' | 'appId'>>

/** Params to get a typed app factory from `ClientManager`. */
export type ClientTypedAppFactoryParams = Expand<Omit<AppFactoryParams, 'algorand' | 'appSpec'>>

/** Exposes access to various API clients. */
export class ClientManager {
  private _algod: algosdk.Algodv2
  private _indexer?: algosdk.Indexer
  private _kmd?: algosdk.Kmd
  private _algorand?: AlgorandClient

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
  constructor(clientsOrConfig: AlgoConfig | AlgoSdkClients, algorandClient?: AlgorandClient) {
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
    this._algorand = algorandClient
  }

  /**
   * Returns an algosdk Algod API client.
   * @returns The Algod client
   */
  public get algod(): algosdk.Algodv2 {
    return this._algod
  }

  /**
   * Returns an algosdk Indexer API client or throws an error if it's not been provided.
   * @returns The Indexer client
   * @throws Error if no Indexer client is configured
   */
  public get indexer(): algosdk.Indexer {
    if (!this._indexer) throw new Error('Attempt to use Indexer client in AlgoKit instance with no Indexer configured')
    return this._indexer
  }

  /**
   * Returns an algosdk Indexer API client or `undefined` if it's not been provided.
   * @returns The Indexer client or `undefined`
   */
  public get indexerIfPresent(): algosdk.Indexer | undefined {
    return this._indexer
  }

  /**
   * Returns an algosdk KMD API client or throws an error if it's not been provided.
   * @returns The KMD client
   * @throws Error if no KMD client is configured
   */
  public get kmd(): algosdk.Kmd {
    if (!this._kmd) throw new Error('Attempt to use Kmd client in AlgoKit instance with no Kmd configured')
    return this._kmd
  }

  private _getNetworkPromise: Promise<TransactionParams> | undefined
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
      this._getNetworkPromise = this._algod.transactionParams()
    }

    const params = await this._getNetworkPromise
    return {
      isTestNet: ['testnet-v1.0', 'testnet-v1', 'testnet'].includes(params.genesisId ?? 'unknown'),
      isMainNet: ['mainnet-v1.0', 'mainnet-v1', 'mainnet'].includes(params.genesisId ?? 'unknown'),
      isLocalNet: ClientManager.genesisIdIsLocalNet(params.genesisId ?? 'unknown'),
      genesisId: params.genesisId ?? 'unknown',
      genesisHash: params.genesisHash ? Buffer.from(params.genesisHash).toString('base64') : 'unknown',
    }
  }

  /**
   * Returns true if the given network genesisId is associated with a LocalNet network.
   * @param genesisId The network genesis ID
   * @returns Whether the given genesis ID is associated with a LocalNet network
   * @example
   * ```typescript
   * const isLocalNet = ClientManager.genesisIdIsLocalNet('testnet-v1.0')
   * ```
   */
  public static genesisIdIsLocalNet(genesisId: string) {
    return genesisIdIsLocalNet(genesisId)
  }

  /**
   * Returns true if the current network is LocalNet.
   * @returns True if the current network is LocalNet.
   * @example
   * ```typescript
   * const isLocalNet = await clientManager.isLocalNet()
   * ```
   */
  public async isLocalNet() {
    return (await this.network()).isLocalNet
  }

  /**
   * Returns true if the current network is TestNet.
   * @returns True if the current network is TestNet.
   * @example
   * ```typescript
   * const isTestNet = await clientManager.isTestNet()
   * ```
   */
  public async isTestNet() {
    return (await this.network()).isTestNet
  }

  /**
   * Returns true if the current network is MainNet.
   * @returns True if the current network is MainNet.
   * @example
   * ```typescript
   * const isMainNet = await clientManager.isMainNet()
   * ```
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
   * Returns a new `AppFactory` client
   * @param params The parameters to create the app factory
   * @example Basic example
   * ```typescript
   * const factory = clientManager.getAppFactory({
   *   appSpec: '{/* ARC-56 or ARC-32 compatible JSON *\/}',
   * })
   * ```
   * @example Advanced example
   * ```typescript
   * const factory = clientManager.getAppFactory({
   *   appSpec: parsedAppSpec_AppSpec_or_Arc56Contract,
   *   defaultSender: "SENDERADDRESS",
   *   appName: "OverriddenAppName",
   *   version: "2.0.0",
   *   updatable: true,
   *   deletable: false,
   *   deployTimeParams: { ONE: 1, TWO: 'value' }
   * })
   * ```
   * @returns The `AppFactory` instance
   */
  public getAppFactory(params: ClientAppFactoryParams) {
    if (!this._algorand) {
      throw new Error('Attempt to get app factory from a ClientManager without an Algorand client')
    }

    return new AppFactory({ ...params, algorand: this._algorand })
  }

  /**
   * Returns a new `AppClient` client for managing calls and state for an ARC-32/ARC-56 app.
   * This method resolves the app ID by looking up the creator address and name
   * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
   * @param params The parameters to create the app client
   * @example Basic
   * ```typescript
   * const appClient = clientManager.getAppClientByCreatorAndName({
   *   appSpec: '{/* ARC-56 or ARC-32 compatible JSON *\}',
   *   // appId resolved by looking for app ID of named app by this creator
   *   creatorAddress: 'CREATORADDRESS',
   * })
   * ```
   * @returns The `AppClient` instance
   */
  public getAppClientByCreatorAndName(params: ClientResolveAppClientByCreatorAndNameParams) {
    if (!this._algorand) {
      throw new Error('Attempt to get app client from a ClientManager without an Algorand client')
    }

    return AppClient.fromCreatorAndName({
      ...params,
      algorand: this._algorand,
    })
  }

  /**
   * Returns a new `AppClient` client for managing calls and state for an ARC-32/ARC-56 app.
   * @param params The parameters to create the app client
   * @example Basic
   * ```typescript
   * const appClient = clientManager.getAppClientById({
   *   appSpec: '{/* ARC-56 or ARC-32 compatible JSON *\}',
   *   appId: 12345n,
   * })
   * ```
   * @returns The `AppClient` instance
   */
  public getAppClientById(params: ClientAppClientParams) {
    if (!this._algorand) {
      throw new Error('Attempt to get app client from a ClientManager without an Algorand client')
    }
    return new AppClient({ ...params, algorand: this._algorand })
  }

  /**
   * Returns a new `AppClient` client for managing calls and state for an ARC-56 app.
   * This method resolves the app ID for the current network based on
   * pre-determined network-specific app IDs specified in the ARC-56 app spec.
   *
   * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
   * @param params The parameters to create the app client
   * @example Basic
   * ```typescript
   * const appClient = clientManager.getAppClientByNetwork({
   *   appSpec: '{/* ARC-56 or ARC-32 compatible JSON *\}',
   *   // appId resolved by using ARC-56 spec to find app ID for current network
   * })
   * ```
   * @returns The `AppClient` instance
   */
  public async getAppClientByNetwork(params: ClientAppClientByNetworkParams) {
    if (!this._algorand) {
      throw new Error('Attempt to get app client from a ClientManager without an Algorand client')
    }
    return AppClient.fromNetwork({ ...params, algorand: this._algorand })
  }

  /**
   * Returns a new typed client, resolving the app by creator address and name.
   * @param typedClient The typed client type to use
   * @param params The params to resolve the app by creator address and name
   * @example Use name in ARC-32 / ARC-56 app spec
   * ```typescript
   * const appClient = clientManager.getTypedAppClientByCreatorAndName(MyContractClient, {
   *   creatorAddress: "CREATORADDRESS",
   *   defaultSender: alice,
   * })
   * ```
   * @example Specify name
   * ```typescript
   * const appClient = clientManager.getTypedAppClientByCreatorAndName(MyContractClient, {
   *   creatorAddress: "CREATORADDRESS",
   *   name: "contract-name",
   *   defaultSender: alice,
   * })
   * ```
   * @returns The typed client instance
   */
  public async getTypedAppClientByCreatorAndName<TClient extends TypedAppClient<InstanceType<TClient>>>(
    typedClient: TClient,
    params: ClientTypedAppClientByCreatorAndNameParams,
  ) {
    if (!this._algorand) {
      throw new Error('Attempt to get app client from a ClientManager without an Algorand client')
    }

    return typedClient.fromCreatorAndName({ ...params, algorand: this._algorand })
  }

  /**
   * Returns a new typed client, resolving the app by app ID.
   * @param typedClient The typed client type to use
   * @param params The params to resolve the app by ID
   * @example
   * ```typescript
   * const appClient = clientManager.getTypedAppClientById(MyContractClient, {
   *   appId: 12345n,
   *   defaultSender: alice,
   * })
   * ```
   * @returns The typed client instance
   */
  public getTypedAppClientById<TClient extends TypedAppClient<InstanceType<TClient>>>(
    typedClient: TClient,
    params: ClientTypedAppClientParams,
  ) {
    if (!this._algorand) {
      throw new Error('Attempt to get app client from a ClientManager without an Algorand client')
    }

    return new typedClient({ ...params, algorand: this._algorand })
  }

  /**
   * Returns a new typed client, resolves the app ID for the current network based on
   * pre-determined network-specific app IDs specified in the ARC-56 app spec.
   *
   * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
   * @param typedClient The typed client type to use
   * @param params The params to resolve the app by network
   * @example
   * ```typescript
   * const appClient = clientManager.getTypedAppClientByNetwork(MyContractClient, {
   *   defaultSender: alice,
   * })
   * ```
   * @returns The typed client instance
   */
  public getTypedAppClientByNetwork<TClient extends TypedAppClient<InstanceType<TClient>>>(
    typedClient: TClient,
    params?: ClientTypedAppClientByNetworkParams,
  ) {
    if (!this._algorand) {
      throw new Error('Attempt to get app client from a ClientManager without an Algorand client')
    }

    return typedClient.fromNetwork({ ...params, algorand: this._algorand })
  }

  /**
   * Returns a new typed app factory.
   * @param typedFactory The typed factory type to use
   * @param params The params to resolve the factory by
   * @example
   * ```typescript
   * const appFactory = clientManager.getTypedAppFactory(MyContractClient, {
   *   sender: alice,
   * })
   * ```
   * @returns The typed client instance
   */
  public getTypedAppFactory<TClient>(typedFactory: TypedAppFactory<TClient>, params?: ClientTypedAppFactoryParams) {
    if (!this._algorand) {
      throw new Error('Attempt to get app factory from a ClientManager without an Algorand client')
    }

    return new typedFactory({ ...params, algorand: this._algorand })
  }

  /**
   * Retrieve client configurations from environment variables when defined or get defaults (expects to be called from a Node.js environment)
   *
   * If both `process.env.INDEXER_SERVER` and `process.env.ALGOD_SERVER` is defined it will use both along with optional `process.env.ALGOD_PORT`, `process.env.ALGOD_TOKEN`, `process.env.INDEXER_PORT` and `process.env.INDEXER_TOKEN`.
   *
   * If only `process.env.ALGOD_SERVER` is defined it will use this along with optional `process.env.ALGOD_PORT` and `process.env.ALGOD_TOKEN` and leave indexer as `undefined`.
   *
   * If only `process.env.INDEXER_SERVER` is defined it will use the default (LocalNet) configuration for both algod and indexer.
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
    const [algodConfig, indexerConfig, kmdConfig] = process.env.ALGOD_SERVER
      ? [
          ClientManager.getAlgodConfigFromEnvironment(),
          process.env.INDEXER_SERVER ? ClientManager.getIndexerConfigFromEnvironment() : undefined,
          !process.env.ALGOD_SERVER.includes('mainnet') && !process.env.ALGOD_SERVER.includes('testnet')
            ? { ...ClientManager.getAlgodConfigFromEnvironment(), port: process?.env?.KMD_PORT ?? '4002' }
            : undefined,
        ]
      : [
          ClientManager.getDefaultLocalNetConfig('algod'),
          ClientManager.getDefaultLocalNetConfig('indexer'),
          ClientManager.getDefaultLocalNetConfig('kmd'),
        ]

    return {
      algodConfig,
      indexerConfig,
      kmdConfig,
    }
  }

  /**
   * Retrieve the algod configuration from environment variables (expects to be called from a Node.js environment)
   *
   * Expects `process.env.ALGOD_SERVER` to be defined, and you can also specify `process.env.ALGOD_PORT` and `process.env.ALGOD_TOKEN`.
   * @returns The Algod client configuration
   * @throws Error if `process.env.ALGOD_SERVER` is not defined
   * @example
   * ```typescript
   * const config = ClientManager.getAlgodConfigFromEnvironment()
   * ```
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
   * @returns The Indexer client configuration
   * @throws Error if `process.env.INDEXER_SERVER` is not defined
   * @example
   * ```typescript
   * const config = ClientManager.getIndexerConfigFromEnvironment()
   * ```
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
   * @returns The AlgoNode client configuration
   * @example
   * ```typescript
   * const config = ClientManager.getAlgoNodeConfig('testnet', 'algod')
   * ```
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
   * @returns The LocalNet client configuration
   * @example
   * ```typescript
   * const config = ClientManager.getDefaultLocalNetConfig('algod')
   * ```
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
   * @returns The Algod client
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
    const baseUrl = port !== undefined ? `${server}:${port}` : server

    const tokenHeader: algosdk.TokenHeader = typeof token === 'string' ? { 'X-Algo-API-Token': token } : (token ?? {})

    return new algosdk.Algodv2({
      baseUrl: baseUrl,
      headers: { ...tokenHeader },
    })
  }

  /**
   * Returns an algod SDK client that automatically retries on idempotent calls loaded from environment variables (expects to be called from a Node.js environment).
   *
   * @returns The Algod client
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
   * @returns The Indexer client
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
   */
  public static getIndexerClient(config: AlgoClientConfig): Indexer {
    const { token, server, port } = config
    const tokenHeader = typeof token === 'string' ? { 'X-Indexer-API-Token': token } : (token ?? {})
    const httpClientWithRetry = new AlgoHttpClientWithRetry(tokenHeader, server, port)
    return new Indexer(httpClientWithRetry)
  }

  /**
   * Returns an indexer SDK client that automatically retries on idempotent calls loaded from environment variables (expects to be called from a Node.js environment).
   *
   * @returns The Indexer client
   * @example
   *
   *  ```typescript
   *  // Uses process.env.INDEXER_SERVER, process.env.INDEXER_PORT and process.env.INDEXER_TOKEN
   *  const indexer = ClientManager.getIndexerClientFromEnvironment()
   *  await indexer.makeHealthCheck().do()
   *  ```
   */
  public static getIndexerClientFromEnvironment(): Indexer {
    return ClientManager.getIndexerClient(ClientManager.getIndexerConfigFromEnvironment())
  }

  /**
   * Returns a KMD SDK client.
   *
   * KMD client allows you to export private keys, which is useful to (for instance) get the default account in a LocalNet network.
   *
   * @param config The config for the client
   * @returns The KMD client
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
   * @returns The KMD client
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
  new (params: Omit<AppClientParams, 'appSpec'>): TClient
  fromNetwork(params: Omit<AppClientParams, 'appId' | 'appSpec'>): Promise<TClient>
  fromCreatorAndName(params: Omit<ResolveAppClientByCreatorAndName, 'appSpec'>): Promise<TClient>
}

/**
 * Interface to identify a typed factory that can be used to create and deploy an application.
 */
export interface TypedAppFactory<TClient> {
  new (params: Omit<AppFactoryParams, 'appSpec'>): TClient
}
