import type { ModelMetadata } from '../core/model-runtime'
import type { AccountStateDelta } from './account-state-delta'
import { AccountStateDeltaMeta } from './account-state-delta'
import type { StateDelta } from './state-delta'
import { StateDeltaMeta } from './state-delta'
import type { TransactionApplication } from './transaction-application'
import { TransactionApplicationMeta } from './transaction-application'
import type { TransactionAssetConfig } from './transaction-asset-config'
import { TransactionAssetConfigMeta } from './transaction-asset-config'
import type { TransactionAssetFreeze } from './transaction-asset-freeze'
import { TransactionAssetFreezeMeta } from './transaction-asset-freeze'
import type { TransactionAssetTransfer } from './transaction-asset-transfer'
import { TransactionAssetTransferMeta } from './transaction-asset-transfer'
import type { TransactionHeartbeat } from './transaction-heartbeat'
import { TransactionHeartbeatMeta } from './transaction-heartbeat'
import type { TransactionKeyreg } from './transaction-keyreg'
import { TransactionKeyregMeta } from './transaction-keyreg'
import type { TransactionPayment } from './transaction-payment'
import { TransactionPaymentMeta } from './transaction-payment'
import type { TransactionSignature } from './transaction-signature'
import { TransactionSignatureMeta } from './transaction-signature'
import type { TransactionStateProof } from './transaction-state-proof'
import { TransactionStateProofMeta } from './transaction-state-proof'

/**
 * Contains all fields common to all transactions and serves as an envelope to all transactions type. Represents both regular and inner transactions.
 *
 * Definition:
 * data/transactions/signedtxn.go : SignedTxn
 * data/transactions/transaction.go : Transaction
 */
export type Transaction = {
  applicationTransaction?: TransactionApplication
  assetConfigTransaction?: TransactionAssetConfig
  assetFreezeTransaction?: TransactionAssetFreeze
  assetTransferTransaction?: TransactionAssetTransfer
  stateProofTransaction?: TransactionStateProof
  heartbeatTransaction?: TransactionHeartbeat

  /**
   * \[sgnr\] this is included with signed transactions when the signing address does not equal the sender. The backend can use this to ensure that auth addr is equal to the accounts auth addr.
   */
  authAddr?: string

  /**
   * \[rc\] rewards applied to close-remainder-to account.
   */
  closeRewards?: bigint

  /**
   * \[ca\] closing amount for transaction.
   */
  closingAmount?: bigint

  /**
   * Round when the transaction was confirmed.
   */
  confirmedRound?: bigint

  /**
   * Specifies an application index (ID) if an application was created with this transaction.
   */
  createdApplicationIndex?: bigint

  /**
   * Specifies an asset index (ID) if an asset was created with this transaction.
   */
  createdAssetIndex?: bigint

  /**
   * \[fee\] Transaction fee.
   */
  fee: bigint

  /**
   * \[fv\] First valid round for this transaction.
   */
  firstValid: number

  /**
   * \[gh\] Hash of genesis block.
   */
  genesisHash?: Uint8Array

  /**
   * \[gen\] genesis block ID.
   */
  genesisId?: string

  /**
   * \[grp\] Base64 encoded byte array of a sha512/256 digest. When present indicates that this transaction is part of a transaction group and the value is the sha512/256 hash of the transactions in that group.
   */
  group?: Uint8Array

  /**
   * Transaction ID
   */
  id?: string

  /**
   * Offset into the round where this transaction was confirmed.
   */
  intraRoundOffset?: bigint
  keyregTransaction?: TransactionKeyreg

  /**
   * \[lv\] Last valid round for this transaction.
   */
  lastValid: number

  /**
   * \[lx\] Base64 encoded 32-byte array. Lease enforces mutual exclusion of transactions.  If this field is nonzero, then once the transaction is confirmed, it acquires the lease identified by the (Sender, Lease) pair of the transaction until the LastValid round passes.  While this transaction possesses the lease, no other transaction specifying this lease can be confirmed.
   */
  lease?: Uint8Array

  /**
   * \[note\] Free form data.
   */
  note?: Uint8Array
  paymentTransaction?: TransactionPayment

  /**
   * \[rr\] rewards applied to receiver account.
   */
  receiverRewards?: bigint

  /**
   * \[rekey\] when included in a valid transaction, the accounts auth addr will be updated with this value and future signatures must be signed with the key represented by this address.
   */
  rekeyTo?: string

  /**
   * Time when the block this transaction is in was confirmed.
   */
  roundTime?: bigint

  /**
   * \[snd\] Sender's address.
   */
  sender: string

  /**
   * \[rs\] rewards applied to sender account.
   */
  senderRewards?: bigint
  signature?: TransactionSignature

  /**
   * \[type\] Indicates what type of transaction this is. Different types have different fields.
   *
   * Valid types, and where their fields are stored:
   * * \[pay\] payment-transaction
   * * \[keyreg\] keyreg-transaction
   * * \[acfg\] asset-config-transaction
   * * \[axfer\] asset-transfer-transaction
   * * \[afrz\] asset-freeze-transaction
   * * \[appl\] application-transaction
   * * \[stpf\] state-proof-transaction
   * * \[hb\] heartbeat-transaction
   */
  txType: 'pay' | 'keyreg' | 'acfg' | 'axfer' | 'afrz' | 'appl' | 'stpf' | 'hb'

  /**
   * \[ld\] Local state key/value changes for the application being executed by this transaction.
   */
  localStateDelta?: AccountStateDelta[]
  globalStateDelta?: StateDelta

  /**
   * \[lg\] Logs for the application being executed by this transaction.
   */
  logs?: Uint8Array[]

  /**
   * Inner transactions produced by application execution.
   */
  innerTxns?: Transaction[]
}

export const TransactionMeta: ModelMetadata = {
  name: 'Transaction',
  kind: 'object',
  fields: [
    {
      name: 'applicationTransaction',
      wireKey: 'application-transaction',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => TransactionApplicationMeta },
    },
    {
      name: 'assetConfigTransaction',
      wireKey: 'asset-config-transaction',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => TransactionAssetConfigMeta },
    },
    {
      name: 'assetFreezeTransaction',
      wireKey: 'asset-freeze-transaction',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => TransactionAssetFreezeMeta },
    },
    {
      name: 'assetTransferTransaction',
      wireKey: 'asset-transfer-transaction',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => TransactionAssetTransferMeta },
    },
    {
      name: 'stateProofTransaction',
      wireKey: 'state-proof-transaction',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => TransactionStateProofMeta },
    },
    {
      name: 'heartbeatTransaction',
      wireKey: 'heartbeat-transaction',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => TransactionHeartbeatMeta },
    },
    {
      name: 'authAddr',
      wireKey: 'auth-addr',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
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
      name: 'confirmedRound',
      wireKey: 'confirmed-round',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'createdApplicationIndex',
      wireKey: 'created-application-index',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'createdAssetIndex',
      wireKey: 'created-asset-index',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'fee',
      wireKey: 'fee',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'firstValid',
      wireKey: 'first-valid',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'genesisHash',
      wireKey: 'genesis-hash',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'genesisId',
      wireKey: 'genesis-id',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'group',
      wireKey: 'group',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'id',
      wireKey: 'id',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'intraRoundOffset',
      wireKey: 'intra-round-offset',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'keyregTransaction',
      wireKey: 'keyreg-transaction',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => TransactionKeyregMeta },
    },
    {
      name: 'lastValid',
      wireKey: 'last-valid',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'lease',
      wireKey: 'lease',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'note',
      wireKey: 'note',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'paymentTransaction',
      wireKey: 'payment-transaction',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => TransactionPaymentMeta },
    },
    {
      name: 'receiverRewards',
      wireKey: 'receiver-rewards',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'rekeyTo',
      wireKey: 'rekey-to',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'roundTime',
      wireKey: 'round-time',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'sender',
      wireKey: 'sender',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'senderRewards',
      wireKey: 'sender-rewards',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'signature',
      wireKey: 'signature',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => TransactionSignatureMeta },
    },
    {
      name: 'txType',
      wireKey: 'tx-type',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
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
      type: { kind: 'array', item: { kind: 'model', meta: () => TransactionMeta } },
    },
  ],
}
