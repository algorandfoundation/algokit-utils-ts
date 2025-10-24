import type { ModelMetadata } from '../core/model-runtime'
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
      type: { kind: 'array', item: { kind: 'model', meta: () => BoxDescriptorMeta } },
    },
  ],
}
