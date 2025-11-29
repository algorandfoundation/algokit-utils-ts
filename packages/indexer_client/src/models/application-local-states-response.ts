import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, bigIntCodec, ArrayCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { ApplicationLocalState } from './application-local-state'
import { ApplicationLocalStateMeta } from './application-local-state'

export type ApplicationLocalStatesResponse = {
  appsLocalStates: ApplicationLocalState[]

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
}

export const ApplicationLocalStatesResponseMeta: ObjectModelMetadata<ApplicationLocalStatesResponse> = {
  name: 'ApplicationLocalStatesResponse',
  kind: 'object',
  fields: [
    {
      name: 'appsLocalStates',
      wireKey: 'apps-local-states',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(ApplicationLocalStateMeta)),
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'nextToken',
      wireKey: 'next-token',
      optional: true,
      codec: stringCodec,
    },
  ],
}
