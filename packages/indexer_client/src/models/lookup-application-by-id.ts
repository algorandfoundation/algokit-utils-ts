import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { Application } from './application'
import { ApplicationMeta } from './application'

export type LookupApplicationById = {
  application?: Application

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint
}

export const LookupApplicationByIdMeta: ObjectModelMetadata = {
  name: 'LookupApplicationById',
  kind: 'object',
  fields: [
    {
      name: 'application',
      wireKey: 'application',
      optional: true,
      nullable: false,
      codec: new ModelCodec(ApplicationMeta),
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
  ],
}
