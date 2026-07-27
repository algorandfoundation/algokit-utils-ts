// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/updatable-config'

import {
  type Config as _Config,
  UpdatableConfig as _UpdatableConfig,
} from '../updatable-config'

/** @deprecated Import from `@algorandfoundation/algokit-utils/updatable-config` instead */
export type Config = _Config

/** @deprecated Import from `@algorandfoundation/algokit-utils/updatable-config` instead */
export const UpdatableConfig = _UpdatableConfig
/** @deprecated Import from `@algorandfoundation/algokit-utils/updatable-config` instead */
export type UpdatableConfig = _UpdatableConfig
