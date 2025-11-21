import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { Application } from './application'
import { ApplicationMeta } from './application'

export type LookupAccountCreatedApplications = {
  applications: Application[]

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
}

export const LookupAccountCreatedApplicationsMeta: ObjectModelMetadata = {
  name: 'LookupAccountCreatedApplications',
  kind: 'object',
  fields: [
    {
      name: 'applications',
      wireKey: 'applications',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(ApplicationMeta)),
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
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
