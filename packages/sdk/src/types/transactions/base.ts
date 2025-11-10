import { SuggestedParams } from '@algorandfoundation/algokit-algod-client'
import {
  AccessReference,
  BoxReference,
  HoldingReference,
  LocalsReference,
  OnApplicationComplete,
  TransactionType,
} from '@algorandfoundation/algokit-transact'
import { Address } from '../../encoding/address.js'
import { HeartbeatProof } from '../../heartbeat.js'
import { StateProof, StateProofMessage } from '../../stateproof.js'

/**
 * Parameters for resource references in application transactions
 */
export interface ApplicationCallReferenceParams {
  /**
   * A grouping of the asset index and address of the account
   */
  holdings?: HoldingReference[]

  /** A grouping of the application index and address of the account
   */
  locals?: LocalsReference[]

  /**
   * If true, use the foreign accounts, apps, assets, boxes, holdings, and locals fields to construct the access list
   */
  convertToAccess?: boolean
}

/**
 * Contains payment transaction parameters.
 *
 * The full documentation is available at:
 * https://developer.algorand.org/docs/get-details/transactions/transactions/#payment-transaction
 */
export interface PaymentTransactionParams {
  /**
   * Algorand address of recipient
   */
  receiver: string | Address

  /**
   * Integer amount to send, in microAlgos. Must be nonnegative.
   */
  amount: number | bigint

  /**
   * Optional, indicates the sender will close their account and the remaining balance will transfer
   * to this account
   */
  closeRemainderTo?: string | Address
}

/**
 * Contains key registration transaction parameters
 *
 * The full documentation is available at:
 * https://developer.algorand.org/docs/get-details/transactions/transactions/#key-registration-transaction
 */
export interface KeyRegistrationTransactionParams {
  /**
   * 32-byte voting key. For key deregistration, leave undefined
   */
  voteKey?: Uint8Array

  /**
   * 32-byte selection key. For key deregistration, leave undefined
   */
  selectionKey?: Uint8Array

  /**
   * 64-byte state proof key. For key deregistration, leave undefined
   */
  stateProofKey?: Uint8Array

  /**
   * First round on which voting keys are valid
   */
  voteFirst?: number | bigint

  /**
   * Last round on which voting keys are valid
   */
  voteLast?: number | bigint

  /**
   * The dilution fo the 2-level participation key
   */
  voteKeyDilution?: number | bigint

  /**
   * Set this value to true to mark this account as nonparticipating.
   *
   * All new Algorand accounts are participating by default. This means they earn rewards.
   */
  nonParticipation?: boolean
}

/**
 * Contains asset configuration transaction parameters.
 *
 * The full documentation is available at:
 * https://developer.algorand.org/docs/get-details/transactions/transactions/#asset-configuration-transaction
 */
export interface AssetConfigurationTransactionParams {
  /**
   * Asset index uniquely specifying the asset
   */
  assetIndex?: number | bigint

  /**
   * Total supply of the asset
   */
  total?: number | bigint

  /**
   * Integer number of decimals for asset unit calcuation
   */
  decimals?: number | bigint

  /**
   * Whether asset accounts should default to being frozen
   */
  defaultFrozen?: boolean

  /**
   * The Algorand address in charge of reserve, freeze, clawback, destruction, etc.
   */
  manager?: string | Address

  /**
   * The Algorand address representing asset reserve
   */
  reserve?: string | Address

  /**
   * The Algorand address with power to freeze/unfreeze asset holdings
   */
  freeze?: string | Address

  /**
   * The Algorand address with power to revoke asset holdings
   */
  clawback?: string | Address

  /**
   * Unit name for this asset
   */
  unitName?: string

  /**
   * Name for this asset
   */
  assetName?: string

  /**
   * URL relating to this asset
   */
  assetURL?: string

  /**
   * Uint8Array containing a hash commitment with respect to the asset. Must be exactly 32 bytes long.
   */
  assetMetadataHash?: Uint8Array
}

/**
 * Contains asset transfer transaction parameters.
 *
 * The full documentation is available at:
 * https://developer.algorand.org/docs/get-details/transactions/transactions/#asset-transfer-transaction
 */
export interface AssetTransferTransactionParams {
  /**
   * Asset index uniquely specifying the asset
   */
  assetIndex: number | bigint

  /**
   * String representation of Algorand address – if provided, and if "sender" is
   * the asset's revocation manager, then deduct from "assetSender" rather than "sender"
   */
  assetSender?: string | Address

  /**
   * The Algorand address of recipient
   */
  receiver: string | Address

  /**
   * Integer amount to send
   */
  amount: number | bigint

  /**
   * Close out remaining asset balance of the sender to this account
   */
  closeRemainderTo?: string | Address
}

/**
 * Contains asset freeze transaction parameters.
 *
 * The full documentation is available at:
 * https://developer.algorand.org/docs/get-details/transactions/transactions/#asset-freeze-transaction
 */
export interface AssetFreezeTransactionParams {
  /**
   * Asset index uniquely specifying the asset
   */
  assetIndex: number | bigint

  /**
   * Algorand address being frozen or unfrozen
   */
  freezeTarget: string | Address

  /**
   * true if freezeTarget should be frozen, false if freezeTarget should be allowed to transact
   */
  frozen: boolean
}

/**
 * Contains application call transaction parameters.
 *
 * The full documentation is available at:
 * https://developer.algorand.org/docs/get-details/transactions/transactions/#application-call-transaction
 */
export interface ApplicationCallTransactionParams {
  /**
   * A unique application ID
   */
  appIndex: number | bigint

  /**
   * What application should do once the program has been run
   */
  onComplete: OnApplicationComplete

  /**
   * Restricts number of ints in per-user local state
   */
  numLocalInts?: number | bigint

  /**
   * Restricts number of byte slices in per-user local state
   */
  numLocalByteSlices?: number | bigint

  /**
   * Restricts number of ints in global state
   */
  numGlobalInts?: number | bigint

  /**
   * Restricts number of byte slices in global state
   */
  numGlobalByteSlices?: number | bigint

  /**
   * The compiled TEAL that approves a transaction
   */
  approvalProgram?: Uint8Array

  /**
   * The compiled TEAL program that runs when clearing state
   */
  clearProgram?: Uint8Array

  /**
   * Array of Uint8Array, any additional arguments to the application
   */
  appArgs?: Uint8Array[]

  /**
   * Array of Address strings, any additional accounts to supply to the application
   */
  accounts?: Array<string | Address>

  /**
   * Array of int, any other apps used by the application, identified by index
   */
  foreignApps?: Array<number | bigint>

  /**
   * Array of int, any assets used by the application, identified by index
   */
  foreignAssets?: Array<number | bigint>

  /**
   * Int representing extra pages of memory to rent during an application create transaction.
   */
  extraPages?: number | bigint

  /**
   * A grouping of the app ID and name of the box in an Uint8Array
   */
  boxes?: BoxReference[]

  /**
   * Resources accessed by the application
   */
  access?: AccessReference[]

  /**
   * The lowest application version for which this transaction should immediately fail.
   * 0 indicates that no version check should be performed.
   */
  rejectVersion?: number | bigint
}

/**
 * Contains state proof transaction parameters.
 */
export interface StateProofTransactionParams {
  /*
   * Uint64 identifying a particular configuration of state proofs.
   */
  stateProofType?: number | bigint

  /**
   * The state proof.
   */
  stateProof?: StateProof

  /**
   * The state proof message.
   */
  message?: StateProofMessage
}

/**
 * Contains heartbeat transaction parameters.
 */
export interface HeartbeatTransactionParams {
  /*
   * Account address this txn is proving onlineness for
   */
  address: Address

  /**
   * Signature using HeartbeatAddress's partkey, thereby showing it is online.
   */
  proof: HeartbeatProof

  /**
   * The block seed for the this transaction's firstValid block.
   */
  seed: Uint8Array

  /**
   * Must match the hbAddress account's current VoteID
   */
  voteID: Uint8Array

  /**
   * Must match hbAddress account's current KeyDilution.
   */
  keyDilution: bigint
}

/**
 * A full list of all available transaction parameters
 *
 * The full documentation is available at:
 * https://developer.algorand.org/docs/get-details/transactions/transactions/#common-fields-header-and-type
 */
export interface TransactionParams {
  /**
   * Transaction type
   */
  type: TransactionType

  /**
   * Algorand address of sender
   */
  sender: string | Address

  /**
   * Optional, arbitrary data to be included in the transaction's note field
   */
  note?: Uint8Array

  /**
   * Optional, 32-byte lease to associate with this transaction.
   *
   * The sender cannot send another transaction with the same lease until the last round of original
   * transaction has passed.
   */
  lease?: Uint8Array

  /**
   * The Algorand address that will be used to authorize all future transactions from the sender, if provided.
   */
  rekeyTo?: string | Address

  /**
   * Suggested parameters relevant to the network that will accept this transaction
   */
  suggestedParams: SuggestedParams

  /**
   * Payment transaction parameters. Only set if type is TransactionType.pay
   */
  paymentParams?: PaymentTransactionParams

  /**
   * Key registration transaction parameters. Only set if type is TransactionType.keyreg
   */
  keyregParams?: KeyRegistrationTransactionParams

  /**
   * Asset configuration transaction parameters. Only set if type is TransactionType.acfg
   */
  assetConfigParams?: AssetConfigurationTransactionParams

  /**
   * Asset transfer transaction parameters. Only set if type is TransactionType.axfer
   */
  assetTransferParams?: AssetTransferTransactionParams

  /**
   * Asset freeze transaction parameters. Only set if type is TransactionType.afrz
   */
  assetFreezeParams?: AssetFreezeTransactionParams

  /**
   * Application call transaction parameters. Only set if type is TransactionType.appl
   */
  appCallParams?: ApplicationCallTransactionParams

  /**
   * State proof transaction parameters. Only set if type is TransactionType.stpf
   */
  stateProofParams?: StateProofTransactionParams

  /**
   * Heartbeat transaction parameters. Only set if type is TransactionType.hb
   */
  heartbeatParams?: HeartbeatTransactionParams
}
