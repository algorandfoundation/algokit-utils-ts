// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/indexer'

import {
  type LookupAssetHoldingsOptions as _LookupAssetHoldingsOptions,
  ApplicationOnComplete as _ApplicationOnComplete,
  SignatureType as _SignatureType,
  AccountStatus as _AccountStatus,
} from '../indexer'

/** @deprecated Import from `@algorandfoundation/algokit-utils/indexer` instead */
export type LookupAssetHoldingsOptions = _LookupAssetHoldingsOptions

/** @deprecated Import from `@algorandfoundation/algokit-utils/indexer` instead */
export const ApplicationOnComplete = _ApplicationOnComplete
/** @deprecated Import from `@algorandfoundation/algokit-utils/indexer` instead */
export type ApplicationOnComplete = _ApplicationOnComplete

/** @deprecated Import from `@algorandfoundation/algokit-utils/indexer` instead */
export const SignatureType = _SignatureType
/** @deprecated Import from `@algorandfoundation/algokit-utils/indexer` instead */
export type SignatureType = _SignatureType

/** @deprecated Import from `@algorandfoundation/algokit-utils/indexer` instead */
export const AccountStatus = _AccountStatus
/** @deprecated Import from `@algorandfoundation/algokit-utils/indexer` instead */
export type AccountStatus = _AccountStatus
