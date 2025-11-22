import {
  MAX_ASSET_DECIMALS,
  MAX_ASSET_NAME_LENGTH,
  MAX_ASSET_UNIT_NAME_LENGTH,
  MAX_ASSET_URL_LENGTH,
} from '@algorandfoundation/algokit-common'
import { TransactionValidationError, TransactionValidationErrorType } from './common'

/**
 * Represents an asset configuration transaction that creates, reconfigures, or destroys assets.
 */
export type AssetConfigTransactionFields = {
  /**
   * ID of the asset to operate on.
   *
   * For asset creation, this must be 0.
   * For asset reconfiguration this is the ID of the existing asset to be reconfigured,
   * For asset destroy this is the ID of the existing asset to be destroyed.
   */
  assetId: bigint

  /**
   * The total amount of the smallest divisible (decimal) unit to create.
   *
   * Required when creating a new asset.
   * For example, if creating a asset with 2 decimals and wanting a total supply of 100 units, this value should be 10000.
   *
   * This field can only be specified upon asset creation.
   */
  total?: bigint

  /**
   * The amount of decimal places the asset should have.
   *
   * If unspecified then the asset will be in whole units (i.e. `0`).
   * * If 0, the asset is not divisible;
   * * If 1, the base unit of the asset is in tenths;
   * * If 2, the base unit of the asset is in hundredths;
   * * If 3, the base unit of the asset is in thousandths;
   *
   * and so on up to 19 decimal places.
   *
   * This field can only be specified upon asset creation.
   */
  decimals?: number

  /**
   * Whether the asset is frozen by default for all accounts.
   * Defaults to `false`.
   *
   * If `true` then for anyone apart from the creator to hold the
   * asset it needs to be unfrozen per account using an asset freeze
   * transaction from the `freeze` account, which must be set on creation.
   *
   * This field can only be specified upon asset creation.
   */
  defaultFrozen?: boolean

  /**
   * The optional name of the asset.
   *
   * Max size is 32 bytes.
   *
   * This field can only be specified upon asset creation.
   */
  assetName?: string

  /**
   * The optional name of the unit of this asset (e.g. ticker name).
   *
   * Max size is 8 bytes.
   *
   * This field can only be specified upon asset creation.
   */
  unitName?: string

  /**
   * Specifies an optional URL where more information about the asset can be retrieved (e.g. metadata).
   *
   * Max size is 96 bytes.
   *
   * This field can only be specified upon asset creation.
   */
  url?: string

  /**
   * 32-byte hash of some metadata that is relevant to your asset and/or asset holders.
   *
   * The format of this metadata is up to the application.
   *
   * This field can only be specified upon asset creation.
   */
  metadataHash?: Uint8Array

  /**
   * The address of the optional account that can manage the configuration of the asset and destroy it.
   *
   * The configuration fields it can change are `manager`, `reserve`, `clawback`, and `freeze`.
   *
   * If not set or set to the Zero address the asset becomes permanently immutable.
   */
  manager?: string

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
   * If not set or set to the Zero address the field is permanently empty.
   */
  reserve?: string

  /**
   * The address of the optional account that can be used to freeze or unfreeze holdings of this asset for any account.
   *
   * If empty, freezing is not permitted.
   *
   * If not set or set to the Zero address the field is permanently empty.
   */
  freeze?: string

  /**
   * The address of the optional account that can clawback holdings of this asset from any account.
   *
   * **This field should be used with caution** as the clawback account has the ability to **unconditionally take assets from any account**.
   *
   * If empty, clawback is not permitted.
   *
   * If not set or set to the Zero address the field is permanently empty.
   */
  clawback?: string
}

/**
 * Validate asset configuration transaction fields
 */
export function validateAssetConfigTransaction(assetConfig: AssetConfigTransactionFields): TransactionValidationError[] {
  const errors = new Array<TransactionValidationError>()

  if (assetConfig.assetId === 0n) {
    // Asset creation
    errors.push(...validateAssetCreation(assetConfig))
  } else {
    // Asset configuration or destruction
    errors.push(...validateAssetConfiguration(assetConfig))
  }

  return errors
}

/**
 * Validate asset creation fields
 */
function validateAssetCreation(assetConfig: AssetConfigTransactionFields): TransactionValidationError[] {
  const errors = new Array<TransactionValidationError>()

  if (assetConfig.total === undefined) {
    errors.push({
      type: TransactionValidationErrorType.RequiredField,
      data: 'Total',
    })
  }

  if (assetConfig.decimals !== undefined && assetConfig.decimals > MAX_ASSET_DECIMALS) {
    errors.push({
      type: TransactionValidationErrorType.FieldTooLong,
      data: {
        field: 'Decimals',
        actual: assetConfig.decimals,
        max: MAX_ASSET_DECIMALS,
        unit: 'decimal places',
      },
    })
  }

  if (assetConfig.unitName && assetConfig.unitName.length > MAX_ASSET_UNIT_NAME_LENGTH) {
    errors.push({
      type: TransactionValidationErrorType.FieldTooLong,
      data: {
        field: 'Unit name',
        actual: assetConfig.unitName.length,
        max: MAX_ASSET_UNIT_NAME_LENGTH,
        unit: 'bytes',
      },
    })
  }

  if (assetConfig.assetName && assetConfig.assetName.length > MAX_ASSET_NAME_LENGTH) {
    errors.push({
      type: TransactionValidationErrorType.FieldTooLong,
      data: {
        field: 'Asset name',
        actual: assetConfig.assetName.length,
        max: MAX_ASSET_NAME_LENGTH,
        unit: 'bytes',
      },
    })
  }

  if (assetConfig.url && assetConfig.url.length > MAX_ASSET_URL_LENGTH) {
    errors.push({
      type: TransactionValidationErrorType.FieldTooLong,
      data: {
        field: 'Url',
        actual: assetConfig.url.length,
        max: MAX_ASSET_URL_LENGTH,
        unit: 'bytes',
      },
    })
  }

  return errors
}

/**
 * Validate asset configuration fields
 */
function validateAssetConfiguration(assetConfig: AssetConfigTransactionFields): TransactionValidationError[] {
  const errors = new Array<TransactionValidationError>()

  const hasAssetParams =
    assetConfig.total !== undefined ||
    assetConfig.decimals !== undefined ||
    assetConfig.defaultFrozen !== undefined ||
    assetConfig.assetName !== undefined ||
    assetConfig.unitName !== undefined ||
    assetConfig.url !== undefined ||
    assetConfig.metadataHash !== undefined ||
    assetConfig.manager !== undefined ||
    assetConfig.reserve !== undefined ||
    assetConfig.freeze !== undefined ||
    assetConfig.clawback !== undefined

  if (hasAssetParams) {
    // These fields are immutable after creation
    if (assetConfig.total !== undefined) {
      errors.push({
        type: TransactionValidationErrorType.ImmutableField,
        data: 'Total',
      })
    }
    if (assetConfig.decimals !== undefined) {
      errors.push({
        type: TransactionValidationErrorType.ImmutableField,
        data: 'Decimals',
      })
    }
    if (assetConfig.defaultFrozen !== undefined) {
      errors.push({
        type: TransactionValidationErrorType.ImmutableField,
        data: 'Default frozen',
      })
    }
    if (assetConfig.assetName !== undefined) {
      errors.push({
        type: TransactionValidationErrorType.ImmutableField,
        data: 'Asset name',
      })
    }
    if (assetConfig.unitName !== undefined) {
      errors.push({
        type: TransactionValidationErrorType.ImmutableField,
        data: 'Unit name',
      })
    }
    if (assetConfig.url !== undefined) {
      errors.push({
        type: TransactionValidationErrorType.ImmutableField,
        data: 'Url',
      })
    }
    if (assetConfig.metadataHash !== undefined) {
      errors.push({
        type: TransactionValidationErrorType.ImmutableField,
        data: 'Metadata hash',
      })
    }
  }

  return errors
}
