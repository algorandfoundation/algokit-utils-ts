import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bigIntCodec, bytesCodec } from '@algorandfoundation/algokit-common'

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

export const BoxReferenceMeta: ObjectModelMetadata<BoxReference> = {
  name: 'BoxReference',
  kind: 'object',
  fields: [
    {
      name: 'app',
      wireKey: 'app',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'name',
      wireKey: 'name',
      optional: false,
      codec: bytesCodec,
    },
  ],
}
