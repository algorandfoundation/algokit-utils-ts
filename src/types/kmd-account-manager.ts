// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/kmd-account-manager'

import { KmdAccountManager as _KmdAccountManager } from '../kmd-account-manager'

/** @deprecated Import from `@algorandfoundation/algokit-utils/kmd-account-manager` instead */
export const KmdAccountManager = _KmdAccountManager
/** @deprecated Import from `@algorandfoundation/algokit-utils/kmd-account-manager` instead */
export type KmdAccountManager = _KmdAccountManager
