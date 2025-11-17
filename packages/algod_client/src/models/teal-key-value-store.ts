import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { TealKeyValue } from './teal-key-value'
import { TealKeyValueMeta } from './teal-key-value'

/**
 * Represents a key-value store for use in an application.
 */
export type TealKeyValueStore = TealKeyValue[]

export const TealKeyValueStoreMeta: ModelMetadata = {
  name: 'TealKeyValueStore',
  kind: 'array',
  arrayCodec: new ArrayCodec(new ModelCodec(TealKeyValueMeta)),
}
