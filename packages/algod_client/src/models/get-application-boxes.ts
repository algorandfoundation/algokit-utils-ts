import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { BoxDescriptor } from './box-descriptor'
import { BoxDescriptorMeta } from './box-descriptor'

export type GetApplicationBoxes = {
  boxes: BoxDescriptor[]
}

export const GetApplicationBoxesMeta: ObjectModelMetadata = {
  name: 'GetApplicationBoxes',
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
