// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/client-manager'

import {
  type AlgoSdkClients as _AlgoSdkClients,
  type ClientAppFactoryParams as _ClientAppFactoryParams,
  type ClientResolveAppClientByCreatorAndNameParams as _ClientResolveAppClientByCreatorAndNameParams,
  type ClientAppClientParams as _ClientAppClientParams,
  type ClientAppClientByNetworkParams as _ClientAppClientByNetworkParams,
  type ClientTypedAppClientByCreatorAndNameParams as _ClientTypedAppClientByCreatorAndNameParams,
  type ClientTypedAppClientParams as _ClientTypedAppClientParams,
  type ClientTypedAppClientByNetworkParams as _ClientTypedAppClientByNetworkParams,
  type ClientTypedAppFactoryParams as _ClientTypedAppFactoryParams,
  type TypedAppClient as _TypedAppClient,
  type TypedAppFactory as _TypedAppFactory,
  ClientManager as _ClientManager,
} from '../client-manager'

/** @deprecated Import from `@algorandfoundation/algokit-utils/client-manager` instead */
export type AlgoSdkClients = _AlgoSdkClients

/** @deprecated Import from `@algorandfoundation/algokit-utils/client-manager` instead */
export type ClientAppFactoryParams = _ClientAppFactoryParams

/** @deprecated Import from `@algorandfoundation/algokit-utils/client-manager` instead */
export type ClientResolveAppClientByCreatorAndNameParams = _ClientResolveAppClientByCreatorAndNameParams

/** @deprecated Import from `@algorandfoundation/algokit-utils/client-manager` instead */
export type ClientAppClientParams = _ClientAppClientParams

/** @deprecated Import from `@algorandfoundation/algokit-utils/client-manager` instead */
export type ClientAppClientByNetworkParams = _ClientAppClientByNetworkParams

/** @deprecated Import from `@algorandfoundation/algokit-utils/client-manager` instead */
export type ClientTypedAppClientByCreatorAndNameParams = _ClientTypedAppClientByCreatorAndNameParams

/** @deprecated Import from `@algorandfoundation/algokit-utils/client-manager` instead */
export type ClientTypedAppClientParams = _ClientTypedAppClientParams

/** @deprecated Import from `@algorandfoundation/algokit-utils/client-manager` instead */
export type ClientTypedAppClientByNetworkParams = _ClientTypedAppClientByNetworkParams

/** @deprecated Import from `@algorandfoundation/algokit-utils/client-manager` instead */
export type ClientTypedAppFactoryParams = _ClientTypedAppFactoryParams

/** @deprecated Import from `@algorandfoundation/algokit-utils/client-manager` instead */
export type TypedAppClient<TClient> = _TypedAppClient<TClient>

/** @deprecated Import from `@algorandfoundation/algokit-utils/client-manager` instead */
export type TypedAppFactory<TClient> = _TypedAppFactory<TClient>

/** @deprecated Import from `@algorandfoundation/algokit-utils/client-manager` instead */
export const ClientManager = _ClientManager
/** @deprecated Import from `@algorandfoundation/algokit-utils/client-manager` instead */
export type ClientManager = _ClientManager
