import type { PrimitiveModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

/**
 * TxType is the type of the transaction written to the ledger
 */
export type TxType = string

export const TxTypeMeta: PrimitiveModelMetadata = {
  name: 'TxType',
  kind: 'primitive',
  codec: stringCodec,
}
