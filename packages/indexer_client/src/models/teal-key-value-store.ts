import type { ArrayModelMetadata } from '@algorandfoundation/algokit-common'
import { ArrayCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { TealKeyValue } from './teal-key-value'
import { TealKeyValueMeta } from './teal-key-value'

/**
 * Represents a key-value store for use in an application.
 */
export type TealKeyValueStore = TealKeyValue[]

export const TealKeyValueStoreMeta: ArrayModelMetadata = {
  name: 'TealKeyValueStore',
  kind: 'array',
  codec: new ArrayCodec(new ObjectModelCodec(TealKeyValueMeta)),
}
