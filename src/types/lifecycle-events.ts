// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/lifecycle-events'

import {
  EventType as _EventType,
  type EventDataMap as _EventDataMap,
} from '../lifecycle-events'

/** @deprecated Import from `@algorandfoundation/algokit-utils/lifecycle-events` instead */
export const EventType = _EventType
/** @deprecated Import from `@algorandfoundation/algokit-utils/lifecycle-events` instead */
export type EventType = _EventType

/** @deprecated Import from `@algorandfoundation/algokit-utils/lifecycle-events` instead */
export type EventDataMap = _EventDataMap
