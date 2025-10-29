import type { ModelMetadata } from '../core/model-runtime'

/**
 * Stores the global information associated with an application.
 */
export type ApplicationLogData = {
  /**
   * Transaction ID
   */
  txid: string

  /**
   * Logs for the application being executed by the transaction.
   */
  logs: Uint8Array[]
}

export const ApplicationLogDataMeta: ModelMetadata = {
  name: 'ApplicationLogData',
  kind: 'object',
  fields: [
    {
      name: 'txid',
      wireKey: 'txid',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'logs',
      wireKey: 'logs',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar', isBytes: true } },
    },
  ],
}
