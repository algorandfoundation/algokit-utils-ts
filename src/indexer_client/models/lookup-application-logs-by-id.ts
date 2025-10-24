import type { ModelMetadata } from '../core/model-runtime'
import type { ApplicationLogData } from './application-log-data'
import { ApplicationLogDataMeta } from './application-log-data'

export type LookupApplicationLogsById = {
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

export const LookupApplicationLogsByIdMeta: ModelMetadata = {
  name: 'LookupApplicationLogsById',
  kind: 'object',
  fields: [
    {
      name: 'applicationId',
      wireKey: 'application-id',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'nextToken',
      wireKey: 'next-token',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'logData',
      wireKey: 'log-data',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => ApplicationLogDataMeta } },
    },
  ],
}
