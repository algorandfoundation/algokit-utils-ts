import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { Application } from './application'
import { ApplicationMeta } from './application'

export type ApplicationResponse = {
  application?: Application

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint
}

export const ApplicationResponseMeta: ObjectModelMetadata<ApplicationResponse> = {
  name: 'ApplicationResponse',
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
