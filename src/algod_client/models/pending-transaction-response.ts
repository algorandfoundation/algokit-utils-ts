import type { ModelMetadata } from '../core/model-runtime'
import type { SignedTransaction } from '@algorandfoundation/algokit-transact'
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

export const PendingTransactionResponseMeta: ModelMetadata = {
  name: 'PendingTransactionResponse',
  kind: 'object',
  fields: [
    {
      name: 'assetId',
      wireKey: 'asset-index',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'appId',
      wireKey: 'application-index',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'closeRewards',
      wireKey: 'close-rewards',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'closingAmount',
      wireKey: 'closing-amount',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'assetClosingAmount',
      wireKey: 'asset-closing-amount',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'confirmedRound',
      wireKey: 'confirmed-round',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'poolError',
      wireKey: 'pool-error',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'receiverRewards',
      wireKey: 'receiver-rewards',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'senderRewards',
      wireKey: 'sender-rewards',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'localStateDelta',
      wireKey: 'local-state-delta',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => AccountStateDeltaMeta } },
    },
    {
      name: 'globalStateDelta',
      wireKey: 'global-state-delta',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => StateDeltaMeta },
    },
    {
      name: 'logs',
      wireKey: 'logs',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar', isBytes: true } },
    },
    {
      name: 'innerTxns',
      wireKey: 'inner-txns',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => PendingTransactionResponseMeta } },
    },
    {
      name: 'txn',
      wireKey: 'txn',
      optional: false,
      nullable: false,
      type: { kind: 'codec', codecKey: 'SignedTransaction' },
    },
  ],
}
