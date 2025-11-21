import type { PassthroughModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * TxType is the type of the transaction written to the ledger
 */
export type TxType = string

export const TxTypeMeta: PassthroughModelMetadata = {
  name: 'TxType',
  kind: 'passthrough',
  codec: stringCodec,
}
