import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { numberCodec } from '@algorandfoundation/algokit-common'

/**
 * Represents a \[apls\] local-state or \[apgs\] global-state schema. These schemas determine how much storage may be used in a local-state or global-state for an application. The more space used, the larger minimum balance must be maintained in the account holding the data.
 */
export type StateSchema = {
  /**
   * Maximum number of TEAL uints that may be stored in the key/value store.
   */
  numUints: number

  /**
   * Maximum number of TEAL byte slices that may be stored in the key/value store.
   */
  numByteSlices: number
}

export const StateSchemaMeta: ObjectModelMetadata<StateSchema> = {
  name: 'StateSchema',
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
