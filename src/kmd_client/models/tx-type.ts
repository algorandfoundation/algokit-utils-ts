import type { ModelMetadata } from '../core/model-runtime'

/**
 * TxType is the type of the transaction written to the ledger
 */
export type TxType = string

export const TxTypeMeta: ModelMetadata = {
  name: 'TxType',
  kind: 'passthrough',
  passThrough: { kind: 'scalar' },
}
