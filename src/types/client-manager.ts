import algosdk from 'algosdk'
import { getTestNetDispenserApiClient } from '../dispenser-client'
import { getAlgoClient, getAlgoIndexerClient, getAlgoKmdClient } from '../network-client'
import { AppLookup } from './app'
import {
  AppDetails,
  AppDetailsBase,
  AppSpecAppDetailsBase,
  ApplicationClient,
  ResolveAppByCreatorAndNameBase,
  ResolveAppByIdBase,
} from './app-client'
import { TestNetDispenserApiClientParams } from './dispenser-client'
import { AlgoConfig } from './network-client'

/** Clients from algosdk that interact with the official Algorand APIs */
export interface AlgoSdkClients {
  /** Algod client, see https://developer.algorand.org/docs/rest-apis/algod/ */
  algod: algosdk.Algodv2
  /** Optional indexer client, see https://developer.algorand.org/docs/rest-apis/indexer/ */
  indexer?: algosdk.Indexer
  /** Optional KMD client, see https://developer.algorand.org/docs/rest-apis/kmd/ */
  kmd?: algosdk.Kmd
}

/** Exposes access to various API clients. */
export class ClientManager {
  private _algod: algosdk.Algodv2
  private _indexer?: algosdk.Indexer
  private _kmd?: algosdk.Kmd

  /**
   * algosdk clients or config for interacting with the official Algorand APIs.
   * @param clientsOrConfig The clients or config to use
   */
  constructor(clientsOrConfig: AlgoConfig | AlgoSdkClients) {
    const _clients =
      'algod' in clientsOrConfig
        ? clientsOrConfig
        : {
            algod: getAlgoClient(clientsOrConfig.algodConfig),
            indexer: clientsOrConfig.indexerConfig ? getAlgoIndexerClient(clientsOrConfig.indexerConfig) : undefined,
            kmd: clientsOrConfig.kmdConfig ? getAlgoKmdClient(clientsOrConfig.kmdConfig) : undefined,
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

  /**
   * Returns a TestNet Dispenser API client.
   * Refer to [docs](https://github.com/algorandfoundation/algokit/blob/main/docs/testnet_api.md) on guidance to obtain an access token.
   *
   * @param params An object containing parameters for the TestNetDispenserApiClient class.
   *  Or null if you want the client to load the access token from the environment variable `ALGOKIT_DISPENSER_ACCESS_TOKEN`.
   * @example
   * const client = algokit.getTestNetDispenserApiClient(
   *     {
   *       authToken: 'your_auth_token',
   *       requestTimeout: 15,
   *     }
   * )
   *
   * @returns An instance of the TestNetDispenserApiClient class.
   */
  public getTestNetDispenser(params: TestNetDispenserApiClientParams | null = null) {
    return getTestNetDispenserApiClient(params)
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
   * @returns The typed client instance
   */
  public getTypedAppClientById<TClient>(typedClient: TypedAppClient<TClient>, details: TypedAppClientByIdDetails) {
    return new typedClient({ ...details, resolveBy: 'id' }, this._algod)
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
