// TODO: These types will be replaced by the OAS generated types when available

import { Transaction } from '@algorandfoundation/algokit-transact'

export type TransactionParams = {
  /** ConsensusVersion indicates the consensus protocol version as of LastRound. */
  consensusVersion: string

  /** Fee is the suggested transaction fee
   * Fee is in units of micro-Algos per byte.
   * Fee may fall to zero but transactions must still have a fee of
   * at least MinTxnFee for the current network protocol.
   */
  fee: bigint

  /** GenesisHash is the hash of the genesis block. */
  genesisHash: Uint8Array

  /** GenesisID is an ID listed in the genesis block. */
  genesisId: string

  /** LastRound indicates the last round seen */
  lastRound: bigint

  /** The minimum transaction fee (not per byte) required for the txn to validate for the current network protocol. */
  minFee: bigint
}

// Resource population types based on Rust implementation
export type BoxReference = {
  app: bigint
  name: Uint8Array
}

export type AssetHoldingReference = {
  asset: bigint
  account: string
}

export type ApplicationLocalReference = {
  app: bigint
  account: string
}

export type SimulateUnnamedResourcesAccessed = {
  accounts?: string[]
  apps?: bigint[]
  assets?: bigint[]
  boxes?: BoxReference[]
  extraBoxRefs?: number
  appLocals?: ApplicationLocalReference[]
  assetHoldings?: AssetHoldingReference[]
}

export type SimulateTransactionResult = {
  txnResult: {
    innerTxns?: PendingTransactionResponse[]
  }
  unnamedResourcesAccessed?: SimulateUnnamedResourcesAccessed
}

export type PendingTransactionResponse = {
  txn: {
    transaction: Transaction
  }
  innerTxns?: PendingTransactionResponse[]
  logs?: Uint8Array[]
  poolError?: string
  confirmedRound?: bigint
  assetIndex?: bigint
  applicationIndex?: bigint
}

export type SimulateResponse = {
  txnGroups: Array<{
    txnResults: SimulateTransactionResult[]
    unnamedResourcesAccessed?: SimulateUnnamedResourcesAccessed
    failureMessage?: string
    failedAt?: number[]
  }>
}
