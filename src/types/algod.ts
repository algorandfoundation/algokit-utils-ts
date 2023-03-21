import { EncodedSignedTransaction } from 'algosdk'

/** The response from the pending transaction API @see https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2transactionspendingtxid */
export interface PendingTransactionResponse {
  /**
   * The application index if the transaction was found and it created an
   * application.
   */
  'application-index'?: number
  /**
   * The number of the asset's unit that were transferred to the close-to address.
   */
  'asset-closing-amount'?: number
  /**
   * The asset index if the transaction was found and it created an asset.
   */
  'asset-index'?: number
  /**
   * Rewards in microalgos applied to the close remainder to account.
   */
  'close-rewards'?: number
  /**
   * Closing amount for the transaction.
   */
  'closing-amount'?: number
  /**
   * The round where this transaction was confirmed, if present.
   */
  'confirmed-round'?: number
  /**
   * (gd) Global state key/value changes for the application being executed by this
   * transaction.
   */
  'global-state-delta'?: Record<string, EvalDelta>[]
  /**
   * Inner transactions produced by application execution.
   */
  'inner-txns'?: PendingTransactionResponse[]
  /**
   * (ld) Local state key/value changes for the application being executed by this
   * transaction.
   */
  'local-state-delta'?: Record<string, EvalDelta>[]
  /**
   * (lg) Logs for the application being executed by this transaction.
   */
  logs?: Uint8Array[]
  /** Indicates that the transaction was kicked out of this node's transaction pool (and specifies why that happened).
   * An empty string indicates the transaction wasn't kicked out of this node's txpool due to an error. */
  'pool-error': string
  /**
   * Rewards in µALGOs applied to the receiver account.
   */
  'receiver-rewards'?: number
  /**
   * Rewards in µALGOs applied to the sender account.
   */
  'sender-rewards'?: number
  /**
   * The raw signed transaction.
   */
  txn: EncodedSignedTransaction
}

/** Represents a TEAL value delta @see https://developer.algorand.org/docs/rest-apis/algod/v2/#evaldelta */
export interface EvalDelta {
  action: number
  bytes: string
  uint: number
}

/** The response from the application API @see https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2applicationsapplication-id */
export interface ApplicationResponse {
  id: number
  params: ApplicationParams
}

/** Stores the global information associated with an application @see https://developer.algorand.org/docs/rest-apis/algod/v2/#applicationparams */
export interface ApplicationParams {
  /** Address of the account that created the app */
  creator: string
  /** Base64 encoded TEAL approval program */
  'approval-program': string
  /** Base64 encoded TEAL clear state program */
  'clear-state-program': string
  /** The amount of extra program pages available to this app. */
  'extra-program-pages'?: number
  /** Current global state values */
  'global-state'?: { key: string; value: TealValue }[]
  /** Global state schema */
  'global-state-schema'?: ApplicationStateSchema
  /** Local state schema */
  'local-state-schema'?: ApplicationStateSchema
}

/**
 * Represents a TEAL value @see https://developer.algorand.org/docs/rest-apis/algod/v2/#tealvalue
 */
export type TealValue =
  | {
      /**
       * (tt) value type. Value `1` refers to **bytes**, value `2` refers to **uint**
       */
      type: 1
      /**
       * (tb) bytes value.
       */
      bytes: string
    }
  | {
      /**
       * (tt) value type. Value `1` refers to **bytes**, value `2` refers to **uint**
       */
      type: 2

      /**
       * (ui) uint value.
       */
      uint: number | bigint
    }

/** Specifies maximums on the number of each type that may be stored @see https://developer.algorand.org/docs/rest-apis/algod/v2/#applicationstateschema */
export interface ApplicationStateSchema {
  /** [nbs] num of byte slices */
  'num-byte-slice': number
  /** [nui] num of uints */
  'num-uint': number
}
