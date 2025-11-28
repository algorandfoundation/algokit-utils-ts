import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { Application } from './application'
import { ApplicationMeta } from './application'

export type LookupApplicationById = {
  application?: Application

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint
}

export const LookupApplicationByIdMeta: ObjectModelMetadata<LookupApplicationById> = {
  name: 'LookupApplicationById',
  kind: 'object',
  fields: [
    {
      name: 'application',
      wireKey: 'application',
      optional: true,
      codec: new ObjectModelCodec(ApplicationMeta),
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      codec: bigIntCodec,
    },
  ],
}
