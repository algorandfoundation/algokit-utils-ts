// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/algo-amount'

import { AlgoAmount as _AlgoAmount } from '../algo-amount'

/** @deprecated Import from `@algorandfoundation/algokit-utils/algo-amount` instead */
export const AlgoAmount = _AlgoAmount
/** @deprecated Import from `@algorandfoundation/algokit-utils/algo-amount` instead */
export type AlgoAmount = _AlgoAmount
