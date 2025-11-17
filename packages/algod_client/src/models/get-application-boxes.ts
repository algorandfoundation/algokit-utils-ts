import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { BoxDescriptor } from './box-descriptor'
import { BoxDescriptorMeta } from './box-descriptor'

export type GetApplicationBoxes = {
  boxes: BoxDescriptor[]
}

export const GetApplicationBoxesMeta: ModelMetadata = {
  name: 'GetApplicationBoxes',
  kind: 'object',
  fields: [
    {
      name: 'boxes',
      wireKey: 'boxes',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(BoxDescriptorMeta)),
    },
  ],
}
