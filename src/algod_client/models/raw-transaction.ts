import type { ModelMetadata } from '../core/model-runtime'

export type RawTransaction = {
  /**
   * encoding of the transaction hash.
   */
  txId: string
}

export const RawTransactionMeta: ModelMetadata = {
  name: 'RawTransaction',
  kind: 'object',
  fields: [
    {
      name: 'txId',
      wireKey: 'txId',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
