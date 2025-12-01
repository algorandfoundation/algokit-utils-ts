import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, bytesArrayCodec } from '@algorandfoundation/algokit-common'

/**
 * Stores the global information associated with an application.
 */
export type ApplicationLogData = {
  /**
   * Transaction ID
   */
  txId: string

  /**
   * Logs for the application being executed by the transaction.
   */
  logs: Uint8Array[]
}

export const ApplicationLogDataMeta: ObjectModelMetadata<ApplicationLogData> = {
  name: 'ApplicationLogData',
  kind: 'object',
  fields: [
    {
      name: 'txId',
      wireKey: 'txid',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'logs',
      wireKey: 'logs',
      optional: false,
      codec: bytesArrayCodec,
    },
  ],
}
