import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bigIntCodec, booleanCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
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

export const ApplicationMeta: ObjectModelMetadata<Application> = {
  name: 'Application',
  kind: 'object',
  fields: [
    {
      name: 'id',
      wireKey: 'id',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'deleted',
      wireKey: 'deleted',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'createdAtRound',
      wireKey: 'created-at-round',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'deletedAtRound',
      wireKey: 'deleted-at-round',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'params',
      wireKey: 'params',
      optional: false,
      codec: new ObjectModelCodec(ApplicationParamsMeta),
    },
  ],
}
