// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/account-manager'

import {  AccountManager as _AccountManager,
  type EnsureFundedResult as _EnsureFundedResult,
  getAccountTransactionSigner as _getAccountTransactionSigner,
} from '../account-manager'

/** @deprecated Import from `@algorandfoundation/algokit-utils/account-manager` instead */
export const AccountManager = _AccountManager
/** @deprecated Import from `@algorandfoundation/algokit-utils/account-manager` instead */
export type AccountManager = _AccountManager

/** @deprecated Import from `@algorandfoundation/algokit-utils/account-manager` instead */
export type EnsureFundedResult = _EnsureFundedResult

/** @deprecated Import from `@algorandfoundation/algokit-utils/account-manager` instead */
export const getAccountTransactionSigner = _getAccountTransactionSigner
