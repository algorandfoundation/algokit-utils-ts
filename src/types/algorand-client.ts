// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/algorand-client'

import { AlgorandClient as _AlgorandClient } from '../algorand-client'

/** @deprecated Import from `@algorandfoundation/algokit-utils/algorand-client` instead */
export const AlgorandClient = _AlgorandClient
/** @deprecated Import from `@algorandfoundation/algokit-utils/algorand-client` instead */
export type AlgorandClient = _AlgorandClient
