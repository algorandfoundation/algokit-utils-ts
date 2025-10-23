import type { ModelMetadata } from '../core/model-runtime'

/**
 * The logged messages from an app call along with the app ID and outer transaction ID. Logs appear in the same order that they were emitted.
 */
export type AppCallLogs = {
  /**
   * An array of logs
   */
  logs: Uint8Array[]

  /**
   * The application from which the logs were generated
   */
  appId: bigint

  /**
   * The transaction ID of the outer app call that lead to these logs
   */
  txId: string
}

export const AppCallLogsMeta: ModelMetadata = {
  name: 'AppCallLogs',
  kind: 'object',
  fields: [
    {
      name: 'logs',
      wireKey: 'logs',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar', isBytes: true } },
    },
    {
      name: 'appId',
      wireKey: 'application-index',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'txId',
      wireKey: 'txId',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
