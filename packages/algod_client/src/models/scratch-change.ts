import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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

export const ScratchChangeMeta: ObjectModelMetadata = {
  name: 'ScratchChange',
  kind: 'object',
  fields: [
    {
      name: 'slot',
      wireKey: 'slot',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'newValue',
      wireKey: 'new-value',
      optional: false,
      nullable: false,
      codec: new ModelCodec(AvmValueMeta),
    },
  ],
}
