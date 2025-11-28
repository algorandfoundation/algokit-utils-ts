import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { BoxDescriptor } from './box-descriptor'
import { BoxDescriptorMeta } from './box-descriptor'

export type BoxesResponse = {
  boxes: BoxDescriptor[]
}

export const BoxesResponseMeta: ObjectModelMetadata<BoxesResponse> = {
  name: 'BoxesResponse',
  kind: 'object',
  fields: [
    {
      name: 'boxes',
      wireKey: 'boxes',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(BoxDescriptorMeta)),
    },
  ],
}
