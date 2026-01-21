// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/logging'

import {
  type Logger as _Logger,
  consoleLogger as _consoleLogger,
  infoConsoleLogger as _infoConsoleLogger,
  verboseConsoleLogger as _verboseConsoleLogger,
  warningConsoleLogger as _warningConsoleLogger,
  nullLogger as _nullLogger,
} from '../logging'

/** @deprecated Import from `@algorandfoundation/algokit-utils/logging` instead */
export type Logger = _Logger

/** @deprecated Import from `@algorandfoundation/algokit-utils/logging` instead */
export const consoleLogger = _consoleLogger

/** @deprecated Import from `@algorandfoundation/algokit-utils/logging` instead */
export const infoConsoleLogger = _infoConsoleLogger

/** @deprecated Import from `@algorandfoundation/algokit-utils/logging` instead */
export const verboseConsoleLogger = _verboseConsoleLogger

/** @deprecated Import from `@algorandfoundation/algokit-utils/logging` instead */
export const warningConsoleLogger = _warningConsoleLogger

/** @deprecated Import from `@algorandfoundation/algokit-utils/logging` instead */
export const nullLogger = _nullLogger
