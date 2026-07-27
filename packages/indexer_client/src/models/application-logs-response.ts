import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, bigIntCodec, ArrayCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { ApplicationLogData } from './application-log-data'
import { ApplicationLogDataMeta } from './application-log-data'

export type ApplicationLogsResponse = {
  /**
   * \[appidx\] application index.
   */
  applicationId: bigint

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
  logData?: ApplicationLogData[]
}

export const ApplicationLogsResponseMeta: ObjectModelMetadata<ApplicationLogsResponse> = {
  name: 'ApplicationLogsResponse',
  kind: 'object',
  fields: [
    {
      name: 'applicationId',
      wireKey: 'application-id',
      optional: false,
      codec: bigIntCodec,
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
    {
      name: 'logData',
      wireKey: 'log-data',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(ApplicationLogDataMeta)),
    },
  ],
}
