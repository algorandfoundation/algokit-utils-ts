import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { ApplicationParams } from './application-params'
import { ApplicationParamsMeta } from './application-params'

/**
 * Application index and its parameters
 */
export type Application = {
  /**
   * \[appidx\] application index.
   */
  id: bigint
  params: ApplicationParams
}

export const ApplicationMeta: ObjectModelMetadata = {
  name: 'Application',
  kind: 'object',
  fields: [
    {
      name: 'id',
      wireKey: 'id',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'params',
      wireKey: 'params',
      optional: false,
      nullable: false,
      codec: new ModelCodec(ApplicationParamsMeta),
    },
  ],
}
