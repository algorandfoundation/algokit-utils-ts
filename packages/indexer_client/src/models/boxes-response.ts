import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bigIntCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { BoxDescriptor } from './box-descriptor'
import { BoxDescriptorMeta } from './box-descriptor'

export type BoxesResponse = {
  /**
   * \[appidx\] application index.
   */
  applicationId: bigint
  boxes: BoxDescriptor[]

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
}

export const BoxesResponseMeta: ObjectModelMetadata<BoxesResponse> = {
  name: 'BoxesResponse',
  kind: 'object',
  fields: [
    {
      name: 'applicationId',
      wireKey: 'application-id',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'boxes',
      wireKey: 'boxes',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(BoxDescriptorMeta)),
    },
    {
      name: 'nextToken',
      wireKey: 'next-token',
      optional: true,
      codec: stringCodec,
    },
  ],
}
