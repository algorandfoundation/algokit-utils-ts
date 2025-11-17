import { numberCodec } from '@algorandfoundation/algokit-common'
import type { ModelMetadata } from '../core/model-runtime'

/**
 * Specifies maximums on the number of each type that may be stored.
 *
 * This is a TEST version using the new codec-based metadata system (V2)
 */
export type ApplicationStateSchemaV2 = {
  /**
   * \[nui\] num of uints.
   */
  numUint: number

  /**
   * \[nbs\] num of byte slices.
   */
  numByteSlice: number
}

export const ApplicationStateSchemaV2Meta: ModelMetadata = {
  name: 'ApplicationStateSchemaV2',
  kind: 'object',
  fields: [
    {
      name: 'numUint',
      wireKey: 'num-uint',
      codec: numberCodec,
      optional: false,
      nullable: false,
    },
    {
      name: 'numByteSlice',
      wireKey: 'num-byte-slice',
      codec: numberCodec,
      optional: false,
      nullable: false,
    },
  ],
}
