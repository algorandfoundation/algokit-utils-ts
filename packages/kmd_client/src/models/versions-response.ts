import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringArrayCodec } from '@algorandfoundation/algokit-common'

/**
 * VersionsResponse is the response to `GET /versions`
 * friendly:VersionsResponse
 */
export type VersionsResponse = {
  versions?: string[]
}

export const VersionsResponseMeta: ObjectModelMetadata<VersionsResponse> = {
  name: 'VersionsResponse',
  kind: 'object',
  fields: [
    {
      name: 'versions',
      wireKey: 'versions',
      optional: true,
      codec: stringArrayCodec,
    },
  ],
}
