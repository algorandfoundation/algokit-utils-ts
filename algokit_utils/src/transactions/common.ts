import { SignedTransaction, Transaction } from '@algorandfoundation/algokit-transact'
import {
  AppCallComposerTransaction,
  AppCallMethodCallComposerTransaction,
  AppCreateCallComposerTransaction,
  AppCreateMethodCallComposerTransaction,
  AppDeleteCallComposerTransaction,
  AppDeleteMethodCallComposerTransaction,
  AppUpdateCallComposerTransaction,
  AppUpdateMethodCallComposerTransaction,
  ProcessedAppCallMethodCallComposerTransaction,
  ProcessedAppCreateMethodCallComposerTransaction,
  ProcessedAppDeleteMethodCallComposerTransaction,
  ProcessedAppUpdateMethodCallComposerTransaction,
} from './app-call'
import { AssetConfigComposerTransaction, AssetCreateComposerTransaction, AssetDestroyComposerTransaction } from './asset-config'
import { AssetFreezeComposerTransaction, AssetUnfreezeComposerTransaction } from './asset-freeze'
import {
  AssetClawbackComposerTransaction,
  AssetOptInComposerTransaction,
  AssetOptOutComposerTransaction,
  AssetTransferComposerTransaction,
} from './asset-transfer'
import {
  NonParticipationKeyRegistrationComposerTransaction,
  OfflineKeyRegistrationComposerTransaction,
  OnlineKeyRegistrationComposerTransaction,
} from './key-registration'
import { AccountCloseComposerTransaction, PaymentComposerTransaction } from './payment'

export type TransactionComposerTransaction = { type: ComposerTransactionType.Transaction; data: Transaction }
export type TransactionWithSignerComposerTransaction = { type: ComposerTransactionType.TransactionWithSigner; data: TransactionWithSigner }

export type TransactionHeader = {
  /**
   * The account that authorized the transaction.
   *
   * Fees are deducted from this account.
   */
  sender: string

  /**
   * Optional transaction fee in microALGO.
   *
   * When not set, the fee will be interpreted as 0 by the network.
   */
  fee?: bigint

  /**
   * First round for when the transaction is valid.
   */
  firstValid: bigint

  /**
   * Last round for when the transaction is valid.
   *
   * After this round, the transaction will be expired.
   */
  lastValid: bigint

  /**
   * Hash of the genesis block of the network.
   *
   * Used to identify which network the transaction is for.
   */
  genesisHash?: Uint8Array

  /**
   * Genesis ID of the network.
   *
   * A human-readable string used alongside genesis hash to identify the network.
   */
  genesisId?: string

  /**
   * Optional user-defined note field.
   *
   * Can contain arbitrary data up to 1KB in size.
   */
  note?: Uint8Array

  /**
   * Optional authorized account for future transactions.
   *
   * If set, only this account will be used for transaction authorization going forward.
   * Reverting back control to the original address must be done by setting this field to
   * the original address.
   */
  rekeyTo?: string

  /**
   * Optional lease value to enforce mutual transaction exclusion.
   *
   * When a transaction with a non-empty lease field is confirmed, the lease is acquired.
   * A lease X is acquired by the sender, generating the (sender, X) lease.
   * The lease is kept active until the last_valid round of the transaction has elapsed.
   * No other transaction sent by the same sender can be confirmed until the lease expires.
   */
  lease?: Uint8Array

  /**
   * Optional group ID for atomic transaction grouping.
   *
   * Transactions with the same group ID must execute together or not at all.
   */
  group?: Uint8Array
}

/** Common parameters used across all transaction types */
export type CommonTransactionParams = {
  /** The address of the account sending the transaction. */
  sender: string
  /** A signer used to sign transaction(s); if not specified then
   *  an attempt will be made to find a registered signer for the
   *  given `sender` or use a default signer (if configured).
   */
  signer?: TransactionSigner
  /** Change the signing key of the sender to the given address.
   *
   * **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying).
   */
  rekeyTo?: string
  /** Note to attach to the transaction. Max of 1000 bytes. */
  note?: Uint8Array
  /** Prevent multiple transactions with the same lease being included within the validity window.
   *
   * A [lease](https://dev.algorand.co/concepts/transactions/leases)
   *  enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios).
   */
  lease?: Uint8Array
  /** The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. */
  staticFee?: bigint
  /** The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees. */
  extraFee?: bigint
  /** Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. */
  maxFee?: bigint
  /** How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. */
  validityWindow?: number
  /**
   * Set the first round this transaction is valid.
   * If left undefined, the value from algod will be used.
   *
   * We recommend you only set this when you intentionally want this to be some time in the future.
   */
  firstValidRound?: bigint
  /** The last round this transaction is valid. It is recommended to use `validityWindow` instead. */
  lastValidRound?: bigint
}

export enum ComposerTransactionType {
  Transaction,
  TransactionWithSigner,
  Payment,
  AccountClose,
  AssetTransfer,
  AssetOptIn,
  AssetOptOut,
  AssetClawback,
  AssetCreate,
  AssetConfig,
  AssetDestroy,
  AssetFreeze,
  AssetUnfreeze,
  AppCall,
  AppCreateCall,
  AppUpdateCall,
  AppDeleteCall,
  AppCallMethodCall,
  AppCreateMethodCall,
  AppUpdateMethodCall,
  AppDeleteMethodCall,
  OnlineKeyRegistration,
  OfflineKeyRegistration,
  NonParticipationKeyRegistration,
}

export type MethodCallComposerTransaction =
  | AppCallMethodCallComposerTransaction
  | AppCreateMethodCallComposerTransaction
  | AppUpdateMethodCallComposerTransaction
  | AppDeleteMethodCallComposerTransaction

export type ProcessedMethodCallComposerTransaction =
  | ProcessedAppCallMethodCallComposerTransaction
  | ProcessedAppCreateMethodCallComposerTransaction
  | ProcessedAppUpdateMethodCallComposerTransaction
  | ProcessedAppDeleteMethodCallComposerTransaction

type CommonAbstractedComposerTransaction =
  | PaymentComposerTransaction
  | AccountCloseComposerTransaction
  | AssetTransferComposerTransaction
  | AssetOptInComposerTransaction
  | AssetOptOutComposerTransaction
  | AssetClawbackComposerTransaction
  | AssetCreateComposerTransaction
  | AssetConfigComposerTransaction
  | AssetDestroyComposerTransaction
  | AssetFreezeComposerTransaction
  | AssetUnfreezeComposerTransaction
  | AppCallComposerTransaction
  | AppCreateCallComposerTransaction
  | AppUpdateCallComposerTransaction
  | AppDeleteCallComposerTransaction
  | OnlineKeyRegistrationComposerTransaction
  | OfflineKeyRegistrationComposerTransaction
  | NonParticipationKeyRegistrationComposerTransaction

export type AbstractedComposerTransaction = CommonAbstractedComposerTransaction | MethodCallComposerTransaction

export type ProcessedAbstractedComposerTransaction = CommonAbstractedComposerTransaction | ProcessedMethodCallComposerTransaction

export interface TransactionWithSigner {
  transaction: Transaction
  signer: TransactionSigner
}

export interface TransactionSigner {
  signTransactions(transactions: Transaction[], indices: number[]): Promise<SignedTransaction[]>
  signTransaction(transaction: Transaction): Promise<SignedTransaction>
}

export interface SignerGetter {
  getSigner(address: string): TransactionSigner
}
