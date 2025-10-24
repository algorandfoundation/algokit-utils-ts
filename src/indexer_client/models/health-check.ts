import type { ModelMetadata } from '../core/model-runtime'

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

export const HealthCheckMeta: ModelMetadata = {
  name: 'HealthCheck',
  kind: 'object',
  fields: [
    {
      name: 'version',
      wireKey: 'version',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'data',
      wireKey: 'data',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'isMigrating',
      wireKey: 'is-migrating',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'dbAvailable',
      wireKey: 'db-available',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'errors',
      wireKey: 'errors',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
  ],
}
