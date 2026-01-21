// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/logic-error'

import {
  type LogicErrorDetails as _LogicErrorDetails,
  LogicError as _LogicError,
} from '../logic-error'

/** @deprecated Import from `@algorandfoundation/algokit-utils/logic-error` instead */
export type LogicErrorDetails = _LogicErrorDetails

/** @deprecated Import from `@algorandfoundation/algokit-utils/logic-error` instead */
export const LogicError = _LogicError
/** @deprecated Import from `@algorandfoundation/algokit-utils/logic-error` instead */
export type LogicError = _LogicError
