import type { ModelMetadata } from '../core/model-runtime'

/**
 * TransactionParams contains the parameters that help a client construct
 * a new transaction.
 */
export type TransactionParams = {
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

export const TransactionParamsMeta: ModelMetadata = {
  name: 'TransactionParams',
  kind: 'object',
  fields: [
    {
      name: 'consensusVersion',
      wireKey: 'consensus-version',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'fee',
      wireKey: 'fee',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'genesisHash',
      wireKey: 'genesis-hash',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'genesisId',
      wireKey: 'genesis-id',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'lastRound',
      wireKey: 'last-round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'minFee',
      wireKey: 'min-fee',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
  ],
}
