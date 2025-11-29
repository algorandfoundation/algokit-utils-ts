import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, bigIntCodec, booleanCodec, stringArrayCodec, RecordCodec, unknownCodec } from '@algorandfoundation/algokit-common'

/**
 * A health check response.
 */
export type HealthCheck = {
  /**
   * Current version.
   */
  version: string
  data?: Record<string, unknown>
  round: bigint
  isMigrating: boolean
  dbAvailable: boolean
  message: string
  errors?: string[]
}

export const HealthCheckMeta: ObjectModelMetadata<HealthCheck> = {
  name: 'HealthCheck',
  kind: 'object',
  fields: [
    {
      name: 'version',
      wireKey: 'version',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'data',
      wireKey: 'data',
      optional: true,
      codec: new RecordCodec(unknownCodec),
    },
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'isMigrating',
      wireKey: 'is-migrating',
      optional: false,
      codec: booleanCodec,
    },
    {
      name: 'dbAvailable',
      wireKey: 'db-available',
      optional: false,
      codec: booleanCodec,
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'errors',
      wireKey: 'errors',
      optional: true,
      codec: stringArrayCodec,
    },
  ],
}
