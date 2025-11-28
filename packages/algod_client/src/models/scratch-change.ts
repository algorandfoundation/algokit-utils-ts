import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { AvmValue } from './avm-value'
import { AvmValueMeta } from './avm-value'

/**
 * A write operation into a scratch slot.
 */
export type ScratchChange = {
  /**
   * The scratch slot written.
   */
  slot: number
  newValue: AvmValue
}

export const ScratchChangeMeta: ObjectModelMetadata<ScratchChange> = {
  name: 'ScratchChange',
  kind: 'object',
  fields: [
    {
      name: 'slot',
      wireKey: 'slot',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'newValue',
      wireKey: 'new-value',
      optional: false,
      codec: new ObjectModelCodec(AvmValueMeta),
    },
  ],
}
