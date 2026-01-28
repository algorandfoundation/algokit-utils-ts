// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/account'

import {
  DISPENSER_ACCOUNT as _DISPENSER_ACCOUNT,
  type AccountAssetInformation as _AccountAssetInformation,
  type AccountInformation as _AccountInformation,
  type TransactionSignerAccount as _TransactionSignerAccount,
} from '../account'

/** @deprecated Import from `@algorandfoundation/algokit-utils/account` instead */
export const DISPENSER_ACCOUNT = _DISPENSER_ACCOUNT

/** @deprecated Import from `@algorandfoundation/algokit-utils/account` instead */
export type AccountInformation = _AccountInformation

/** @deprecated Import from `@algorandfoundation/algokit-utils/account` instead */
export type AccountAssetInformation = _AccountAssetInformation

/** @deprecated Import from `@algorandfoundation/algokit-utils/account` instead */
export type TransactionSignerAccount = _TransactionSignerAccount
