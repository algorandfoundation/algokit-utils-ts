import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bigIntCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * BoxReference names a box by its name and the application ID it belongs to.
 */
export type BoxReference = {
  /**
   * Application ID to which the box belongs, or zero if referring to the called application.
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
