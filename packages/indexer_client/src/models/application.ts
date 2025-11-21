import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { ApplicationParams } from './application-params'
import { ApplicationParamsMeta } from './application-params'

/**
 * Application index and its parameters
 */
export type Application = {
  /**
   * application index.
   */
  id: bigint

  /**
   * Whether or not this application is currently deleted.
   */
  deleted?: boolean

  /**
   * Round when this application was created.
   */
  createdAtRound?: bigint

  /**
   * Round when this application was deleted.
   */
  deletedAtRound?: bigint
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
      name: 'deleted',
      wireKey: 'deleted',
      optional: true,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'createdAtRound',
      wireKey: 'created-at-round',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'deletedAtRound',
      wireKey: 'deleted-at-round',
      optional: true,
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
