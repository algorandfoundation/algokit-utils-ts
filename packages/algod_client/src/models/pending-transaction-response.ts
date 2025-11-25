import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bigIntCodec,
  ArrayCodec,
  bytesArrayCodec,
  ObjectModelCodec,
  ArrayModelCodec,
} from '@algorandfoundation/algokit-common'
import type { SignedTransaction } from '@algorandfoundation/algokit-transact'
import { SignedTransactionMeta } from '@algorandfoundation/algokit-transact'
import type { AccountStateDelta } from './account-state-delta'
import { AccountStateDeltaMeta } from './account-state-delta'
import type { StateDelta } from './state-delta'
import { StateDeltaMeta } from './state-delta'

/**
 * Details about a pending transaction. If the transaction was recently confirmed, includes confirmation details like the round and reward details.
 */
export type PendingTransactionResponse = {
  /**
   * The asset index if the transaction was found and it created an asset.
   */
  assetId?: bigint

  /**
   * The application index if the transaction was found and it created an application.
   */
  appId?: bigint

  /**
   * Rewards in microalgos applied to the close remainder to account.
   */
  closeRewards?: bigint

  /**
   * Closing amount for the transaction.
   */
  closingAmount?: bigint

  /**
   * The number of the asset's unit that were transferred to the close-to address.
   */
  assetClosingAmount?: bigint

  /**
   * The round where this transaction was confirmed, if present.
   */
  confirmedRound?: bigint

  /**
   * Indicates that the transaction was kicked out of this node's transaction pool (and specifies why that happened).  An empty string indicates the transaction wasn't kicked out of this node's txpool due to an error.
   */
  poolError: string

  /**
   * Rewards in microalgos applied to the receiver account.
   */
  receiverRewards?: bigint

  /**
   * Rewards in microalgos applied to the sender account.
   */
  senderRewards?: bigint

  /**
   * Local state key/value changes for the application being executed by this transaction.
   */
  localStateDelta?: AccountStateDelta[]
  globalStateDelta?: StateDelta

  /**
   * Logs for the application being executed by this transaction.
   */
  logs?: Uint8Array[]

  /**
   * Inner transactions produced by application execution.
   */
  innerTxns?: PendingTransactionResponse[]

  /**
   * The raw signed transaction.
   */
  txn: SignedTransaction
}

export const PendingTransactionResponseMeta: ObjectModelMetadata = {
  name: 'PendingTransactionResponse',
  kind: 'object',
  fields: [
    {
      name: 'assetId',
      wireKey: 'asset-index',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'appId',
      wireKey: 'application-index',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'closeRewards',
      wireKey: 'close-rewards',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'closingAmount',
      wireKey: 'closing-amount',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'assetClosingAmount',
      wireKey: 'asset-closing-amount',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'confirmedRound',
      wireKey: 'confirmed-round',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'poolError',
      wireKey: 'pool-error',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'receiverRewards',
      wireKey: 'receiver-rewards',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'senderRewards',
      wireKey: 'sender-rewards',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'localStateDelta',
      wireKey: 'local-state-delta',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(AccountStateDeltaMeta)),
    },
    {
      name: 'globalStateDelta',
      wireKey: 'global-state-delta',
      optional: true,
      codec: new ArrayModelCodec(StateDeltaMeta),
    },
    {
      name: 'logs',
      wireKey: 'logs',
      optional: true,
      codec: bytesArrayCodec,
    },
    {
      name: 'innerTxns',
      wireKey: 'inner-txns',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(() => PendingTransactionResponseMeta)),
    },
    {
      name: 'txn',
      wireKey: 'txn',
      optional: false,
      codec: new ObjectModelCodec(SignedTransactionMeta),
    },
  ],
}
