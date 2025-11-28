import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
} from '@algorandfoundation/algokit-common'

/**
 * Specifies maximums on the number of each type that may be stored.
 */
export type ApplicationStateSchema = {
  /**
   * \[nui\] num of uints.
   */
  numUint: number

  /**
   * \[nbs\] num of byte slices.
   */
  numByteSlice: number
}

export const ApplicationStateSchemaMeta: ObjectModelMetadata<ApplicationStateSchema> = {
  name: 'ApplicationStateSchema',
  kind: 'object',
  fields: [
    {
      name: 'numUint',
      wireKey: 'num-uint',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'numByteSlice',
      wireKey: 'num-byte-slice',
      optional: false,
      codec: numberCodec,
    },
  ],
}
