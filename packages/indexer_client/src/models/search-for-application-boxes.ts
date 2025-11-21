import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { BoxDescriptor } from './box-descriptor'
import { BoxDescriptorMeta } from './box-descriptor'

export type SearchForApplicationBoxes = {
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

export const SearchForApplicationBoxesMeta: ObjectModelMetadata = {
  name: 'SearchForApplicationBoxes',
  kind: 'object',
  fields: [
    {
      name: 'applicationId',
      wireKey: 'application-id',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'boxes',
      wireKey: 'boxes',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(BoxDescriptorMeta)),
    },
    {
      name: 'nextToken',
      wireKey: 'next-token',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
