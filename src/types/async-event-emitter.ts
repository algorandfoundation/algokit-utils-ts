// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/async-event-emitter'

import {
  type AsyncEventListener as _AsyncEventListener,
  AsyncEventEmitter as _AsyncEventEmitter,
} from '../async-event-emitter'

/** @deprecated Import from `@algorandfoundation/algokit-utils/async-event-emitter` instead */
export type AsyncEventListener<T = unknown> = _AsyncEventListener<T>

/** @deprecated Import from `@algorandfoundation/algokit-utils/async-event-emitter` instead */
export const AsyncEventEmitter = _AsyncEventEmitter
/** @deprecated Import from `@algorandfoundation/algokit-utils/async-event-emitter` instead */
export type AsyncEventEmitter = _AsyncEventEmitter
