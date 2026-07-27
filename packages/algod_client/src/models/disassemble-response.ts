import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

export type DisassembleResponse = {
  /**
   * disassembled Teal code
   */
  result: string
}

export const DisassembleResponseMeta: ObjectModelMetadata<DisassembleResponse> = {
  name: 'DisassembleResponse',
  kind: 'object',
  fields: [
    {
      name: 'result',
      wireKey: 'result',
      optional: false,
      codec: stringCodec,
    },
  ],
}
