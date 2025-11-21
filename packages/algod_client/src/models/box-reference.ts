import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * References a box of an application.
 */
export type BoxReference = {
  /**
   * Application ID which this box belongs to
   */
  app: bigint

  /**
   * Base64 encoded box name
   */
  name: Uint8Array
}

export const BoxReferenceMeta: ObjectModelMetadata = {
  name: 'BoxReference',
  kind: 'object',
  fields: [
    {
      name: 'app',
      wireKey: 'app',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'name',
      wireKey: 'name',
      optional: false,
      nullable: false,
      codec: bytesCodec,
    },
  ],
}
