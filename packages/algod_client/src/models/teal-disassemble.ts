import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
} from '@algorandfoundation/algokit-common'

export type TealDisassemble = {
  /**
   * disassembled Teal code
   */
  result: string
}

export const TealDisassembleMeta: ObjectModelMetadata = {
  name: 'TealDisassemble',
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
