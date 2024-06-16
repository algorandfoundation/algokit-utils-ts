import algosdk from 'algosdk'
import { ClientManager } from './client-manager'
import AssetModel = algosdk.modelsv2.Asset

export interface AssetInformation {
  /** The ID of the asset. */
  assetId: bigint

  /** The address of the account that created the asset.
   *
   * This is the address where the parameters for this asset can be found,
   * and also the address where unwanted asset units can be sent when
   * closing out an asset position and opting-out of the asset.
   */
  creator: string

  /** The total amount of the smallest divisible (decimal) units that were created of the asset.
   *
   * For example, if `decimals` is, say, 2, then for every 100 `total` there is 1 whole unit.
   */
  total: bigint

  /** The amount of decimal places the asset was created with.
   *
   * * If 0, the asset is not divisible;
   * * If 1, the base unit of the asset is in tenths;
   * * If 2, the base unit of the asset is in hundredths;
   * * If 3, the base unit of the asset is in thousandths;
   * * and so on up to 19 decimal places.
   */
  decimals: number

  /** Whether the asset was frozen by default for all accounts.
   *
   * If `true` then for anyone apart from the creator to hold the
   * asset it needs to be unfrozen per account using an asset freeze
   * transaction from the `freeze` account.
   */
  defaultFrozen?: boolean

  /** The address of the optional account that can manage the configuration of the asset and destroy it.
   *
   * If not set the asset is permanently immutable.
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
   * If not set the field is permanently empty.
   */
  reserve?: string

  /**
   * The address of the optional account that can be used to freeze or unfreeze holdings of this asset for any account.
   *
   * If empty, freezing is not permitted.
   *
   * If not set the field is permanently empty.
   */
  freeze?: string

  /**
   * The address of the optional account that can clawback holdings of this asset from any account.
   *
   * The clawback account has the ability to **unconditionally take assets from any account**.
   *
   * If empty, clawback is not permitted.
   *
   * If not set the field is permanently empty.
   */
  clawback?: string

  /** The optional name of the unit of this asset (e.g. ticker name).
   *
   * Max size is 8 bytes.
   */
  unitName?: string

  /** The optional name of the unit of this asset (e.g. ticker name).
   *
   * Max size is 8 bytes.
   */
  unitNameAsBytes?: Uint8Array

  /** The optional name of the asset.
   *
   * Max size is 32 bytes.
   */
  assetName?: string

  /** The optional name of the asset.
   *
   * Max size is 32 bytes.
   */
  assetNameAsBytes?: Uint8Array

  /** Optional URL where more information about the asset can be retrieved (e.g. metadata).
   *
   * Max size is 96 bytes.
   */
  url?: string

  /** Optional URL where more information about the asset can be retrieved (e.g. metadata).
   *
   * Max size is 96 bytes.
   */
  urlAsBytes?: Uint8Array

  /** 32-byte hash of some metadata that is relevant to the asset and/or asset holders.
   *
   * The format of this metadata is up to the application.
   */
  metadataHash?: Uint8Array
}

/** Allows management of asset information. */
export class AssetManager {
  private _clientManager: ClientManager

  /**
   * Create a new asset manager.
   * @param clientManager The ClientManager client to use for algod client
   * @example Create a new asset manager
   * ```typescript
   * const assetManager = new AssetManager(clientManager)
   * ```
   */
  constructor(clientManager: ClientManager) {
    this._clientManager = clientManager
  }

  /**
   * Returns the current asset information for the asset with the given ID.
   *
   * @example
   * ```typescript
   * const assetInfo = await assetManager.getById(12353n);
   * ```
   *
   * @param assetId The ID of the asset
   * @returns The asset information
   */
  public async getById(assetId: bigint): Promise<AssetInformation> {
    const asset = AssetModel.from_obj_for_encoding(await this._clientManager.algod.getAssetByID(Number(assetId)).do())

    return {
      assetId: BigInt(asset.index),
      total: BigInt(asset.params.total),
      decimals: Number(asset.params.decimals),
      assetName: asset.params.name,
      assetNameAsBytes: asset.params.nameB64,
      unitName: asset.params.unitName,
      unitNameAsBytes: asset.params.unitNameB64,
      url: asset.params.url,
      urlAsBytes: asset.params.urlB64,
      creator: asset.params.creator,
      manager: asset.params.manager,
      clawback: asset.params.clawback,
      freeze: asset.params.freeze,
      reserve: asset.params.reserve,
      defaultFrozen: asset.params.defaultFrozen,
      metadataHash: asset.params.metadataHash,
    }
  }
}
