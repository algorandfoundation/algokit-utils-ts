import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { numberCodec } from '@algorandfoundation/algokit-common'

/**
 * Specifies maximums on the number of each type that may be stored.
 */
export type ApplicationStateSchema = {
  /**
   * number of uints.
   */
  numUints: number

  /**
   * number of byte slices.
   */
  numByteSlices: number
}

export const ApplicationStateSchemaMeta: ObjectModelMetadata<ApplicationStateSchema> = {
  name: 'ApplicationStateSchema',
  kind: 'object',
  fields: [
    {
      name: 'numUints',
      wireKey: 'num-uint',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'numByteSlices',
      wireKey: 'num-byte-slice',
      optional: false,
      codec: numberCodec,
    },
  ],
}
