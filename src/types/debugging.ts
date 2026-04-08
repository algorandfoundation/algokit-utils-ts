// Re-exports with deprecation notices for backwards compatibility
// New imports should use '@algorandfoundation/algokit-utils/debugging'

import {
  ALGOKIT_DIR as _ALGOKIT_DIR,
  SOURCES_DIR as _SOURCES_DIR,
  TEAL_FILE_EXT as _TEAL_FILE_EXT,
  TEAL_SOURCEMAP_EXT as _TEAL_SOURCEMAP_EXT,
  DEFAULT_MAX_SEARCH_DEPTH as _DEFAULT_MAX_SEARCH_DEPTH,
  type TealSourceDebugEventData as _TealSourceDebugEventData,
  type TealSourcesDebugEventData as _TealSourcesDebugEventData,
  type AVMTracesEventData as _AVMTracesEventData,
} from '../debugging'

/** @deprecated Import from `@algorandfoundation/algokit-utils/debugging` instead */
export const ALGOKIT_DIR = _ALGOKIT_DIR

/** @deprecated Import from `@algorandfoundation/algokit-utils/debugging` instead */
export const SOURCES_DIR = _SOURCES_DIR

/** @deprecated Import from `@algorandfoundation/algokit-utils/debugging` instead */
export const TEAL_FILE_EXT = _TEAL_FILE_EXT

/** @deprecated Import from `@algorandfoundation/algokit-utils/debugging` instead */
export const TEAL_SOURCEMAP_EXT = _TEAL_SOURCEMAP_EXT

/** @deprecated Import from `@algorandfoundation/algokit-utils/debugging` instead */
export const DEFAULT_MAX_SEARCH_DEPTH = _DEFAULT_MAX_SEARCH_DEPTH

/** @deprecated Import from `@algorandfoundation/algokit-utils/debugging` instead */
export type TealSourceDebugEventData = _TealSourceDebugEventData

/** @deprecated Import from `@algorandfoundation/algokit-utils/debugging` instead */
export type TealSourcesDebugEventData = _TealSourcesDebugEventData

/** @deprecated Import from `@algorandfoundation/algokit-utils/debugging` instead */
export type AVMTracesEventData = _AVMTracesEventData
