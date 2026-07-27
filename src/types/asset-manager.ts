// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/asset-manager'

import {
  type BulkAssetOptInOutResult as _BulkAssetOptInOutResult,
  type AssetInformation as _AssetInformation,
  AssetManager as _AssetManager,
} from '../asset-manager'

/** @deprecated Import from `@algorandfoundation/algokit-utils/asset-manager` instead */
export type BulkAssetOptInOutResult = _BulkAssetOptInOutResult

/** @deprecated Import from `@algorandfoundation/algokit-utils/asset-manager` instead */
export type AssetInformation = _AssetInformation

/** @deprecated Import from `@algorandfoundation/algokit-utils/asset-manager` instead */
export const AssetManager = _AssetManager
/** @deprecated Import from `@algorandfoundation/algokit-utils/asset-manager` instead */
export type AssetManager = _AssetManager
