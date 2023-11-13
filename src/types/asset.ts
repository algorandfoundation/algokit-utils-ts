import { SuggestedParams } from 'algosdk'
import { AlgoAmount } from './amount'
import { SendTransactionFrom, SendTransactionParams, TransactionNote } from './transaction'

/** Parameters for `assetOptIn` call. */
export interface AssetOptInParams extends SendTransactionParams {
  /** The account to opt in/out for */
  account: SendTransactionFrom
  /** The ID of the assets to opt in for / out of */
  assetId: number
  /** Optional transaction parameters */
  transactionParams?: SuggestedParams
  /** The (optional) transaction note */
  note?: TransactionNote
  /** An (optional) [transaction lease](https://developer.algorand.org/articles/leased-transactions-securing-advanced-smart-contract-design/) to apply */
  lease?: string | Uint8Array
}

/** Parameters for `assetOptOut` call. */
export interface AssetOptOutParams extends AssetOptInParams {
  /** The address of the creator account for the asset; if unspecified then it looks it up using algod */
  assetCreatorAddress?: string
  /** Whether or not to validate the account has a zero-balance before issuing the opt-out; default = true */
  ensureZeroBalance?: boolean
}

/** Parameters for `assetBulkOptIn` / `assetBulkOptOut` call. */
export interface AssetBulkOptInOutParams {
  /** The account to opt in/out for */
  account: SendTransactionFrom
  /** The IDs of the assets to opt in for / out of */
  assetIds: number[]
  /** Whether or not to validate the opt-in/out is valid before issuing transactions; default = true */
  validateBalances?: boolean
  /** Optional transaction parameters */
  transactionParams?: SuggestedParams
  /** The (optional) transaction note */
  note?: TransactionNote
  /** The maximum fee that you are happy to pay per transaction (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion */
  maxFee?: AlgoAmount
  /** Whether to suppress log messages from transaction send, default: do not suppress */
  suppressLog?: boolean
}
