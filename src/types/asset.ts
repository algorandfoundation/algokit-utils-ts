import algosdk from 'algosdk'
import { AlgoAmount } from './amount'
import { SendTransactionFrom, SendTransactionParams, TransactionNote } from './transaction'
import SuggestedParams = algosdk.SuggestedParams

/** @deprecated Parameters for `createAsset` call. */
export interface CreateAssetParams extends SendTransactionParams {
  /** The account to create the asset.
   *
   * This account automatically is opted in to the asset and holds all units after creation. */
  creator: SendTransactionFrom

  /** The total number of base (decimal) units of the asset to create.
   * If decimal is, say, 2, then for every 100 `total` there would be 1 whole unit.
   * This field can only be specified upon asset creation.
   */
  total: number | bigint

  /** The number of digits to use after the decimal point when displaying the asset.
   * If 0, the asset is not divisible.
   * If 1, the base unit of the asset is in tenths.
   * If 2, the base unit of the asset is in hundredths.
   * If 3, the base unit of the asset is in thousandths, and so on up to 19 decimal places.
   * This field can only be specified upon asset creation.
   */
  decimals: number

  /** The optional name of the asset. Max size if 32 bytes. This field can only be specified upon asset creation. */
  name?: string
  /** The optional name of the unit of this asset. Max size is 8 bytes. This field can only be specified upon asset creation. */
  unit?: string
  /** Specifies an optional URL where more information about the asset can be retrieved. Max size is 96 bytes.
   * This field can only be specified upon asset creation.
   */
  url?: string
  /** This field is intended to be a 32-byte hash of some metadata that is relevant to your asset and/or asset holders.
   * The format of this metadata is up to the application. This field can only be specified upon asset creation.
   */
  metadataHash?: string | Uint8Array
  /** The optional account that can manage the configuration of the asset and destroy it.
   * If not set at asset creation or subsequently set to empty by the manager the asset becomes immutable.
   */
  manager?: string | SendTransactionFrom
  /** The optional account that holds the reserve (non-minted) units of the asset. This address has no specific authority in the protocol itself and is informational.
   * Some standards like [ARC-19](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0019.md) rely on this field to hold meaningful data.
   * It is used in the case where you want to signal to holders of your asset that the non-minted units of the asset reside in an account that is different from the default creator account.
   * If not set at asset creation or subsequently set to empty by the manager the field is permanently empty.
   */
  reserveAccount?: string | SendTransactionFrom
  /** The optional account that can be used to freeze holdings of this asset. If empty, freezing is not permitted.
   * If not set at asset creation or subsequently set to empty by the manager the field is permanently empty.
   */
  freezeAccount?: string | SendTransactionFrom
  /** The optional account that can clawback holdings of this asset. If empty, clawback is not permitted.
   * If not set at asset creation or subsequently set to empty by the manager the field is permanently empty.
   */
  clawbackAccount?: string | SendTransactionFrom
  /** Whether to freeze holdings for this asset by default. If `true` then for anyone apart from the creator to hold the asset it needs to be unfrozen per account using `freeze`. Defaults to `false`. */
  frozenByDefault?: boolean

  /** Optional transaction parameters */
  transactionParams?: SuggestedParams
  /** The (optional) transaction note */
  note?: TransactionNote
  /** An (optional) [transaction lease](https://developer.algorand.org/articles/leased-transactions-securing-advanced-smart-contract-design/) to apply */
  lease?: string | Uint8Array
}

/** @deprecated Parameters for `assetOptIn` call. */
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

/** @deprecated Parameters for `assetOptOut` call. */
export interface AssetOptOutParams extends AssetOptInParams {
  /** The address of the creator account for the asset; if unspecified then it looks it up using algod */
  assetCreatorAddress?: string
  /** Whether or not to validate the account has a zero-balance before issuing the opt-out; default = true */
  ensureZeroBalance?: boolean
}

/** @deprecated Parameters for `assetBulkOptIn` / `assetBulkOptOut` call. */
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
