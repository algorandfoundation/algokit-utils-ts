import type { ModelMetadata } from '../core/model-runtime'
import type { TealKeyValue } from './teal-key-value'
import { TealKeyValueMeta } from './teal-key-value'

/**
 * Represents a key-value store for use in an application.
 */
export type TealKeyValueStore = TealKeyValue[]

export const TealKeyValueStoreMeta: ModelMetadata = {
  name: 'TealKeyValueStore',
  kind: 'array',
  arrayItems: { kind: 'model', meta: () => TealKeyValueMeta },
}
