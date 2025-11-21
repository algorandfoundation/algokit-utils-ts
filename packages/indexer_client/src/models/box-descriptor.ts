import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * Box descriptor describes an app box without a value.
 */
export type BoxDescriptor = {
  /**
   * Base64 encoded box name
   */
  name: Uint8Array
}

export const BoxDescriptorMeta: ObjectModelMetadata = {
  name: 'BoxDescriptor',
  kind: 'object',
  fields: [
    {
      name: 'name',
      wireKey: 'name',
      optional: false,
      nullable: false,
      codec: bytesCodec,
    },
  ],
}
