/**
 * TransactionParams contains the parameters that help a client construct
 * a new transaction.
 */
export type TransactionParams = {
  /**
   * ConsensusVersion indicates the consensus protocol version
   * as of LastRound.
   */
  consensusVersion: string;

  /**
   * Fee is the suggested transaction fee
   * Fee is in units of micro-Algos per byte.
   * Fee may fall to zero but transactions must still have a fee of
   * at least MinTxnFee for the current network protocol.
   */
  fee: bigint;

  /**
   * GenesisHash is the hash of the genesis block.
   */
  genesisHash: string;

  /**
   * GenesisID is an ID listed in the genesis block.
   */
  genesisId: string;

  /**
   * LastRound indicates the last round seen
   */
  lastRound: bigint;

  /**
   * The minimum transaction fee (not per byte) required for the
   * txn to validate for the current network protocol.
   */
  minFee: bigint;
};
