import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bigIntCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { Application } from './application'
import { ApplicationMeta } from './application'

export type SearchForApplications = {
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

export const SearchForApplicationsMeta: ObjectModelMetadata = {
  name: 'SearchForApplications',
  kind: 'object',
  fields: [
    {
      name: 'applications',
      wireKey: 'applications',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(ApplicationMeta)),
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
