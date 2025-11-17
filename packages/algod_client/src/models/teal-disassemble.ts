import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

export type TealDisassemble = {
  /**
   * disassembled Teal code
   */
  result: string
}

export const TealDisassembleMeta: ModelMetadata = {
  name: 'TealDisassemble',
  kind: 'object',
  fields: [
    {
      name: 'result',
      wireKey: 'result',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
