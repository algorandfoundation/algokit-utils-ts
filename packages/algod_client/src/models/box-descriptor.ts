import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bytesCodec,
} from '@algorandfoundation/algokit-common'

/**
 * Box descriptor describes a Box.
 */
export type BoxDescriptor = {
  /**
   * Base64 encoded box name
   */
  name: Uint8Array
}

export const BoxDescriptorMeta: ObjectModelMetadata<BoxDescriptor> = {
  name: 'BoxDescriptor',
  kind: 'object',
  fields: [
    {
      name: 'name',
      wireKey: 'name',
      optional: false,
      codec: bytesCodec,
    },
  ],
}
