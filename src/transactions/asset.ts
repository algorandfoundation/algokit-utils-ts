import { Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
import { Address } from '@algorandfoundation/sdk'
import { CommonTransactionParams, TransactionHeader } from './common'

const ensureString = (data?: string | Uint8Array) => {
  if (data === undefined) return undefined
  const encoder = new TextEncoder()
  return typeof data === 'string' ? encoder.encode(data) : data
}

/** Parameters to define an asset create transaction.
 *
 * The account that sends this transaction will automatically be opted in to the asset and will hold all units after creation.
 */
export type AssetCreateParams = CommonTransactionParams & {
  /** The total amount of the smallest divisible (decimal) unit to create.
   *
   * For example, if `decimals` is, say, 2, then for every 100 `total` there would be 1 whole unit.
   *
   * This field can only be specified upon asset creation.
   */
  total: bigint

  /** The amount of decimal places the asset should have.
   *
   * If unspecified then the asset will be in whole units (i.e. `0`).
   *
   * * If 0, the asset is not divisible;
   * * If 1, the base unit of the asset is in tenths;
   * * If 2, the base unit of the asset is in hundredths;
   * * If 3, the base unit of the asset is in thousandths;
   * * and so on up to 19 decimal places.
   *
   * This field can only be specified upon asset creation.
   */
  decimals?: number

  /** The optional name of the asset.
   *
   * Max size is 32 bytes.
   *
   * This field can only be specified upon asset creation.
   */
  assetName?: string

  /** The optional name of the unit of this asset (e.g. ticker name).
   *
   * Max size is 8 bytes.
   *
   * This field can only be specified upon asset creation.
   */
  unitName?: string

  /** Specifies an optional URL where more information about the asset can be retrieved (e.g. metadata).
   *
   * Max size is 96 bytes.
   *
   * This field can only be specified upon asset creation.
   */
  url?: string

  /** 32-byte hash of some metadata that is relevant to your asset and/or asset holders.
   *
   * The format of this metadata is up to the application.
   *
   * This field can only be specified upon asset creation.
   */
  metadataHash?: string | Uint8Array

  /** Whether the asset is frozen by default for all accounts.
   * Defaults to `false`.
   *
   * If `true` then for anyone apart from the creator to hold the
   * asset it needs to be unfrozen per account using an asset freeze
   * transaction from the `freeze` account, which must be set on creation.
   *
   * This field can only be specified upon asset creation.
   */
  defaultFrozen?: boolean

  /** The address of the optional account that can manage the configuration of the asset and destroy it.
   *
   * The configuration fields it can change are `manager`, `reserve`, `clawback`, and `freeze`.
   *
   * If not set (`undefined` or `""`) at asset creation or subsequently set to empty by the `manager` the asset becomes permanently immutable.
   */
  manager?: string | Address

  /**
   * The address of the optional account that holds the reserve (uncirculated supply) units of the asset.
   *
   * This address has no specific authority in the protocol itself and is informational only.
   *
   * Some standards like [ARC-19](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0019.md)
   * rely on this field to hold meaningful data.
   *
   * It can be used in the case where you want to signal to holders of your asset that the uncirculated units
   * of the asset reside in an account that is different from the default creator account.
   *
   * If not set (`undefined` or `""`) at asset creation or subsequently set to empty by the manager the field is permanently empty.
   */
  reserve?: string | Address

  /**
   * The address of the optional account that can be used to freeze or unfreeze holdings of this asset for any account.
   *
   * If empty, freezing is not permitted.
   *
   * If not set (`undefined` or `""`) at asset creation or subsequently set to empty by the manager the field is permanently empty.
   */
  freeze?: string | Address

  /**
   * The address of the optional account that can clawback holdings of this asset from any account.
   *
   * **This field should be used with caution** as the clawback account has the ability to **unconditionally take assets from any account**.
   *
   * If empty, clawback is not permitted.
   *
   * If not set (`undefined` or `""`) at asset creation or subsequently set to empty by the manager the field is permanently empty.
   */
  clawback?: string | Address
}

/** Parameters to define an asset reconfiguration transaction.
 *
 * **Note:** The manager, reserve, freeze, and clawback addresses
 * are immutably empty if they are not set. If manager is not set then
 * all fields are immutable from that point forward.
 */
export type AssetConfigParams = CommonTransactionParams & {
  /** ID of the asset to reconfigure */
  assetId: bigint
  /** The address of the optional account that can manage the configuration of the asset and destroy it.
   *
   * The configuration fields it can change are `manager`, `reserve`, `clawback`, and `freeze`.
   *
   * If not set (`undefined` or `""`) the asset will become permanently immutable.
   */
  manager: string | Address | undefined
  /**
   * The address of the optional account that holds the reserve (uncirculated supply) units of the asset.
   *
   * This address has no specific authority in the protocol itself and is informational only.
   *
   * Some standards like [ARC-19](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0019.md)
   * rely on this field to hold meaningful data.
   *
   * It can be used in the case where you want to signal to holders of your asset that the uncirculated units
   * of the asset reside in an account that is different from the default creator account.
   *
   * If not set (`undefined` or `""`) the field will become permanently empty.
   */
  reserve?: string | Address
  /**
   * The address of the optional account that can be used to freeze or unfreeze holdings of this asset for any account.
   *
   * If empty, freezing is not permitted.
   *
   * If not set (`undefined` or `""`) the field will become permanently empty.
   */
  freeze?: string | Address
  /**
   * The address of the optional account that can clawback holdings of this asset from any account.
   *
   * **This field should be used with caution** as the clawback account has the ability to **unconditionally take assets from any account**.
   *
   * If empty, clawback is not permitted.
   *
   * If not set (`undefined` or `""`) the field will become permanently empty.
   */
  clawback?: string | Address
}

/** Parameters to define an asset freeze transaction. */
export type AssetFreezeParams = CommonTransactionParams & {
  /** The ID of the asset to freeze/unfreeze */
  assetId: bigint
  /** The address of the account to freeze or unfreeze */
  account: string | Address
  /** Whether the assets in the account should be frozen */
  frozen: boolean
}

/** Parameters to define an asset destroy transaction.
 *
 * Created assets can be destroyed only by the asset manager account. All of the assets must be owned by the creator of the asset before the asset can be deleted.
 */
export type AssetDestroyParams = CommonTransactionParams & {
  /** ID of the asset to destroy */
  assetId: bigint
}

/** Parameters to define an asset transfer transaction. */
export type AssetTransferParams = CommonTransactionParams & {
  /** ID of the asset to transfer. */
  assetId: bigint
  /** Amount of the asset to transfer (in smallest divisible (decimal) units). */
  amount: bigint
  /** The address of the account that will receive the asset unit(s). */
  receiver: string | Address
  /** Optional address of an account to clawback the asset from.
   *
   * Requires the sender to be the clawback account.
   *
   * **Warning:** Be careful with this parameter as it can lead to unexpected loss of funds if not used correctly.
   */
  clawbackTarget?: string | Address
  /** Optional address of an account to close the asset position to.
   *
   * **Warning:** Be careful with this parameter as it can lead to loss of funds if not used correctly.
   */
  closeAssetTo?: string | Address
}

/** Parameters to define an asset opt-in transaction. */
export type AssetOptInParams = CommonTransactionParams & {
  /** ID of the asset that will be opted-in to. */
  assetId: bigint
}

/** Parameters to define an asset opt-out transaction. */
export type AssetOptOutParams = CommonTransactionParams & {
  /** ID of the asset that will be opted-out of. */
  assetId: bigint
  /**
   * The address of the asset creator account to close the asset
   *   position to (any remaining asset units will be sent to this account).
   */
  creator: string | Address
}

export const buildAssetCreate = (params: AssetCreateParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    type: TransactionType.AssetConfig,
    assetConfig: {
      assetId: 0n, // Asset creation always uses ID 0
      total: params.total,
      decimals: params.decimals,
      defaultFrozen: params.defaultFrozen,
      assetName: params.assetName,
      unitName: params.unitName,
      url: params.url,
      metadataHash: ensureString(params.metadataHash),
      manager: params.manager?.toString(),
      reserve: params.reserve?.toString(),
      freeze: params.freeze?.toString(),
      clawback: params.clawback?.toString(),
    },
  }
}

export const buildAssetConfig = (params: AssetConfigParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    type: TransactionType.AssetConfig,
    assetConfig: {
      assetId: params.assetId,
      manager: params.manager?.toString(),
      reserve: params.reserve?.toString(),
      freeze: params.freeze?.toString(),
      clawback: params.clawback?.toString(),
    },
  }
}

export const buildAssetFreeze = (params: AssetFreezeParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    type: TransactionType.AssetFreeze,
    assetFreeze: {
      assetId: params.assetId,
      freezeTarget: params.account.toString(),
      frozen: params.frozen,
    },
  }
}

export const buildAssetDestroy = (params: AssetDestroyParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    type: TransactionType.AssetConfig,
    assetConfig: {
      assetId: params.assetId,
    },
  }
}

export const buildAssetTransfer = (params: AssetTransferParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    type: TransactionType.AssetTransfer,
    assetTransfer: {
      assetId: params.assetId,
      amount: params.amount,
      receiver: params.receiver.toString(),
      assetSender: params.clawbackTarget?.toString(),
      closeRemainderTo: params.closeAssetTo?.toString(),
    },
  }
}

export const buildAssetOptIn = (params: AssetOptInParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    type: TransactionType.AssetTransfer,
    assetTransfer: {
      assetId: params.assetId,
      amount: 0n,
      receiver: header.sender,
    },
  }
}

export const buildAssetOptOut = (params: AssetOptOutParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    type: TransactionType.AssetTransfer,
    assetTransfer: {
      assetId: params.assetId,
      amount: 0n,
      receiver: header.sender,
      closeRemainderTo: params.creator?.toString(),
    },
  }
}
