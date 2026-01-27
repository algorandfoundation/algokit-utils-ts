// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/app-manager'

import {
  type AppInformation as _AppInformation,
  type BoxIdentifier as _BoxIdentifier,
  type BoxReference as _BoxReference,
  type BoxValueRequestParams as _BoxValueRequestParams,
  type BoxValuesRequestParams as _BoxValuesRequestParams,
  AppManager as _AppManager,
} from '../app-manager'

/** @deprecated Import from `@algorandfoundation/algokit-utils/app-manager` instead */
export type AppInformation = _AppInformation

/** @deprecated Import from `@algorandfoundation/algokit-utils/app-manager` instead */
export type BoxIdentifier = _BoxIdentifier

/** @deprecated Import from `@algorandfoundation/algokit-utils/app-manager` instead */
export type BoxReference = _BoxReference

/** @deprecated Import from `@algorandfoundation/algokit-utils/app-manager` instead */
export type BoxValueRequestParams = _BoxValueRequestParams

/** @deprecated Import from `@algorandfoundation/algokit-utils/app-manager` instead */
export type BoxValuesRequestParams = _BoxValuesRequestParams

/** @deprecated Import from `@algorandfoundation/algokit-utils/app-manager` instead */
export const AppManager = _AppManager
/** @deprecated Import from `@algorandfoundation/algokit-utils/app-manager` instead */
export type AppManager = _AppManager
