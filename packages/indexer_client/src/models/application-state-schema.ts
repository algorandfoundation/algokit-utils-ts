import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * Specifies maximums on the number of each type that may be stored.
 */
export type ApplicationStateSchema = {
  /**
   * number of uints.
   */
  numUint: number

  /**
   * number of byte slices.
   */
  numByteSlice: number
}

export const ApplicationStateSchemaMeta: ModelMetadata = {
  name: 'ApplicationStateSchema',
  kind: 'object',
  fields: [
    {
      name: 'numUint',
      wireKey: 'num-uint',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'numByteSlice',
      wireKey: 'num-byte-slice',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
  ],
}
