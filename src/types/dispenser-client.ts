// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/dispenser-client'

import {
  type DispenserFundResponse as _DispenserFundResponse,
  type DispenserLimitResponse as _DispenserLimitResponse,
  type TestNetDispenserApiClientParams as _TestNetDispenserApiClientParams,
  TestNetDispenserApiClient as _TestNetDispenserApiClient,
} from '../dispenser-client'

/** @deprecated Import from `@algorandfoundation/algokit-utils/dispenser-client` instead */
export type DispenserFundResponse = _DispenserFundResponse

/** @deprecated Import from `@algorandfoundation/algokit-utils/dispenser-client` instead */
export type DispenserLimitResponse = _DispenserLimitResponse

/** @deprecated Import from `@algorandfoundation/algokit-utils/dispenser-client` instead */
export type TestNetDispenserApiClientParams = _TestNetDispenserApiClientParams

/** @deprecated Import from `@algorandfoundation/algokit-utils/dispenser-client` instead */
export const TestNetDispenserApiClient = _TestNetDispenserApiClient
/** @deprecated Import from `@algorandfoundation/algokit-utils/dispenser-client` instead */
export type TestNetDispenserApiClient = _TestNetDispenserApiClient
