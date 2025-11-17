import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec } from '@algorandfoundation/algokit-common'

/**
 * VersionsResponse is the response to `GET /versions`
 * friendly:VersionsResponse
 */
export type VersionsResponse = {
  versions?: string[]
}

export const VersionsResponseMeta: ModelMetadata = {
  name: 'VersionsResponse',
  kind: 'object',
  fields: [
    {
      name: 'versions',
      wireKey: 'versions',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(stringCodec),
    },
  ],
}
