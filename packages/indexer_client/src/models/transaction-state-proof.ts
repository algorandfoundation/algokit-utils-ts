import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { IndexerStateProofMessage } from './indexer-state-proof-message'
import { IndexerStateProofMessageMeta } from './indexer-state-proof-message'
import type { StateProofFields } from './state-proof-fields'
import { StateProofFieldsMeta } from './state-proof-fields'

/**
 * Fields for a state proof transaction.
 *
 * Definition:
 * data/transactions/stateproof.go : StateProofTxnFields
 */
export type TransactionStateProof = {
  /**
   * \[sptype\] Type of the state proof. Integer representing an entry defined in protocol/stateproof.go
   */
  stateProofType?: bigint
  stateProof?: StateProofFields
  message?: IndexerStateProofMessage
}

export const TransactionStateProofMeta: ModelMetadata = {
  name: 'TransactionStateProof',
  kind: 'object',
  fields: [
    {
      name: 'stateProofType',
      wireKey: 'state-proof-type',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'stateProof',
      wireKey: 'state-proof',
      optional: true,
      nullable: false,
      codec: new ModelCodec(StateProofFieldsMeta),
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      nullable: false,
      codec: new ModelCodec(IndexerStateProofMessageMeta),
    },
  ],
}
