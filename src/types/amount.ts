// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/amount'

import { AlgoAmount as _AlgoAmount } from '../amount'

/** @deprecated Import from `@algorandfoundation/algokit-utils/amount` instead */
export const AlgoAmount = _AlgoAmount
/** @deprecated Import from `@algorandfoundation/algokit-utils/amount` instead */
export type AlgoAmount = _AlgoAmount
