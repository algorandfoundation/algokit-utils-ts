import type { ArrayModelMetadata } from '@algorandfoundation/algokit-common'
import {
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { EvalDeltaKeyValue } from './eval-delta-key-value'
import { EvalDeltaKeyValueMeta } from './eval-delta-key-value'

/**
 * Application state delta.
 */
export type StateDelta = EvalDeltaKeyValue[]

export const StateDeltaMeta: ArrayModelMetadata = {
  name: 'StateDelta',
  kind: 'array',
  codec: new ArrayCodec(new ObjectModelCodec(EvalDeltaKeyValueMeta)),
}
