import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bigIntCodec,
  bytesCodec,
} from '@algorandfoundation/algokit-common'

/**
 * TransactionParams contains the parameters that help a client construct
 * a new transaction.
 */
export type TransactionParametersResponse = {
  /**
   * ConsensusVersion indicates the consensus protocol version
   * as of LastRound.
   */
  consensusVersion: string

  /**
   * Fee is the suggested transaction fee
   * Fee is in units of micro-Algos per byte.
   * Fee may fall to zero but transactions must still have a fee of
   * at least MinTxnFee for the current network protocol.
   */
  fee: bigint

  /**
   * GenesisHash is the hash of the genesis block.
   */
  genesisHash: Uint8Array

  /**
   * GenesisID is an ID listed in the genesis block.
   */
  genesisId: string

  /**
   * LastRound indicates the last round seen
   */
  lastRound: bigint

  /**
   * The minimum transaction fee (not per byte) required for the
   * txn to validate for the current network protocol.
   */
  minFee: bigint
}

export const TransactionParametersResponseMeta: ObjectModelMetadata<TransactionParametersResponse> = {
  name: 'TransactionParametersResponse',
  kind: 'object',
  fields: [
    {
      name: 'consensusVersion',
      wireKey: 'consensus-version',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'fee',
      wireKey: 'fee',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'genesisHash',
      wireKey: 'genesis-hash',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'genesisId',
      wireKey: 'genesis-id',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'lastRound',
      wireKey: 'last-round',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'minFee',
      wireKey: 'min-fee',
      optional: false,
      codec: bigIntCodec,
    },
  ],
}
