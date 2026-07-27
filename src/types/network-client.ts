// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/network-client'

import {
  type AlgoClientConfig as _AlgoClientConfig,
  type AlgoConfig as _AlgoConfig,
  type NetworkDetails as _NetworkDetails,
  genesisIdIsLocalNet as _genesisIdIsLocalNet,
} from '../network-client'

/** @deprecated Import from `@algorandfoundation/algokit-utils/network-client` instead */
export type AlgoClientConfig = _AlgoClientConfig

/** @deprecated Import from `@algorandfoundation/algokit-utils/network-client` instead */
export type AlgoConfig = _AlgoConfig

/** @deprecated Import from `@algorandfoundation/algokit-utils/network-client` instead */
export type NetworkDetails = _NetworkDetails

/** @deprecated Import from `@algorandfoundation/algokit-utils/network-client` instead */
export const genesisIdIsLocalNet = _genesisIdIsLocalNet
