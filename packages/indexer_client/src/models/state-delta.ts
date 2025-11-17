import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { EvalDeltaKeyValue } from './eval-delta-key-value'
import { EvalDeltaKeyValueMeta } from './eval-delta-key-value'

/**
 * Application state delta.
 */
export type StateDelta = EvalDeltaKeyValue[]

export const StateDeltaMeta: ModelMetadata = {
  name: 'StateDelta',
  kind: 'array',
  arrayCodec: new ArrayCodec(new ModelCodec(EvalDeltaKeyValueMeta)),
}
