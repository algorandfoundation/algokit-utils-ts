import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'

const HealthCheckDataMeta: ObjectModelMetadata = { name: 'HealthCheckDataMeta', kind: 'object', fields: [] }

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

export const HealthCheckMeta: ObjectModelMetadata = {
  name: 'HealthCheck',
  kind: 'object',
  fields: [
    {
      name: 'version',
      wireKey: 'version',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'data',
      wireKey: 'data',
      optional: true,
      nullable: false,
      codec: new ModelCodec(HealthCheckDataMeta),
    },
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'isMigrating',
      wireKey: 'is-migrating',
      optional: false,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'dbAvailable',
      wireKey: 'db-available',
      optional: false,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'errors',
      wireKey: 'errors',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(stringCodec),
    },
  ],
}
