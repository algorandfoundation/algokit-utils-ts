import { type AccountAssetInformation, AlgodClient } from '@algorandfoundation/algod-client'
import { AssetOptInParams, AssetOptOutParams } from '../transactions/asset-transfer'
import { TransactionComposer } from '../transactions/composer'
import { Buffer } from 'buffer'

/** Individual result from performing a bulk opt-in or bulk opt-out for an account against a series of assets. */
export interface BulkAssetOptInOutResult {
  /** The ID of the asset opted into / out of */
  assetId: bigint
  /** The transaction ID of the resulting opt in / out */
  transactionId: string
}

/** Information about an Algorand Standard Asset (ASA).
 *
 * This type provides a flattened, developer-friendly interface to asset information
 * that aligns with TypeScript and Python implementations.
 */
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

  /** The address of the optional account that holds the reserve (uncirculated supply) units of the asset.
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

  /** The address of the optional account that can be used to freeze or unfreeze holdings of this asset for any account.
   *
   * If empty, freezing is not permitted.
   *
   * If not set the field is permanently empty.
   */
  freeze?: string

  /** The address of the optional account that can clawback holdings of this asset from any account.
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

  /** The optional name of the unit of this asset as bytes.
   *
   * Max size is 8 bytes.
   */
  unitNameB64?: Uint8Array

  /** The optional name of the asset.
   *
   * Max size is 32 bytes.
   */
  assetName?: string

  /** The optional name of the asset as bytes.
   *
   * Max size is 32 bytes.
   */
  assetNameB64?: Uint8Array

  /** Optional URL where more information about the asset can be retrieved (e.g. metadata).
   *
   * Max size is 96 bytes.
   */
  url?: string

  /** Optional URL where more information about the asset can be retrieved as bytes.
   *
   * Max size is 96 bytes.
   */
  urlB64?: Uint8Array

  /** 32-byte hash of some metadata that is relevant to the asset and/or asset holders.
   *
   * The format of this metadata is up to the application.
   */
  metadataHash?: Uint8Array
}

/** Manages Algorand Standard Assets. */
export class AssetManager {
  private algodClient: AlgodClient
  private newComposer: () => TransactionComposer

  constructor(algodClient: AlgodClient, newComposer: () => TransactionComposer) {
    this.algodClient = algodClient
    this.newComposer = newComposer
  }

  /** Get asset information by asset ID
   * Returns a convenient, flattened view of the asset information.
   */
  async getById(assetId: bigint): Promise<AssetInformation> {
    const asset = await this.algodClient.getAssetById(Number(assetId))

    return {
      assetId: asset.index,
      creator: asset.params.creator,
      total: asset.params.total,
      decimals: Number(asset.params.decimals), // TODO: this should be number in algod client
      defaultFrozen: asset.params.defaultFrozen,
      manager: asset.params.manager,
      reserve: asset.params.reserve,
      freeze: asset.params.freeze,
      clawback: asset.params.clawback,
      unitName: asset.params.unitName,
      // TODO: update algod client to make base64 string uint8array
      unitNameB64: asset.params.unitNameB64 ? new Uint8Array(Buffer.from(asset.params.unitNameB64, 'base64')) : undefined,
      assetName: asset.params.name,
      assetNameB64: asset.params.nameB64 ? new Uint8Array(Buffer.from(asset.params.nameB64, 'base64')) : undefined,
      url: asset.params.url,
      urlB64: asset.params.urlB64 ? new Uint8Array(Buffer.from(asset.params.urlB64, 'base64')) : undefined,
      metadataHash: asset.params.metadataHash ? new Uint8Array(Buffer.from(asset.params.metadataHash, 'base64')) : undefined,
    }
  }

  /** Get account's asset information.
   * Returns the raw algod AccountAssetInformation type.
   * Access asset holding via `account_info.asset_holding` and asset params via `account_info.asset_params`.
   */
  async getAccountInformation(sender: string, assetId: bigint): Promise<AccountAssetInformation> {
    return await this.algodClient.accountAssetInformation(sender, Number(assetId))
  }

  async bulkOptIn(account: string, assetIds: bigint[]): Promise<BulkAssetOptInOutResult[]> {
    if (assetIds.length === 0) {
      return []
    }

    const composer = this.newComposer()

    // Add asset opt-in transactions for each asset
    for (const assetId of assetIds) {
      const optInParams: AssetOptInParams = {
        sender: account,
        assetId,
      }

      composer.addAssetOptIn(optInParams)
    }

    // Send the transaction group
    const composerResults = await composer.send()

    // Map transaction IDs back to assets
    const results: BulkAssetOptInOutResult[] = assetIds.map((assetId, index) => ({
      assetId,
      transactionId: composerResults.transactionIds[index],
    }))

    return results
  }

  async bulkOptOut(account: string, assetIds: bigint[], ensureZeroBalance?: boolean): Promise<BulkAssetOptInOutResult[]> {
    if (assetIds.length === 0) {
      return []
    }

    const shouldCheckBalance = ensureZeroBalance ?? false

    // If we need to check balances, verify they are all zero
    if (shouldCheckBalance) {
      for (const assetId of assetIds) {
        const accountInfo = await this.getAccountInformation(account, assetId)
        const balance = accountInfo.assetHolding?.amount ?? 0
        if (balance > 0) {
          throw new Error(`Account ${account} has non-zero balance ${balance} for asset ${assetId}`)
        }
      }
    }

    // Fetch asset information to get creators
    const assetCreators: string[] = []
    for (const assetId of assetIds) {
      try {
        const assetInfo = await this.getById(assetId)
        assetCreators.push(assetInfo.creator)
      } catch {
        throw new Error(`Asset not found: ${assetId}`)
      }
    }

    const composer = this.newComposer()

    // Add asset opt-out transactions for each asset
    assetIds.forEach((assetId, index) => {
      const creator = assetCreators[index]

      const optOutParams: AssetOptOutParams = {
        sender: account,
        assetId,
        closeRemainderTo: creator,
      }

      composer.addAssetOptOut(optOutParams)
    })

    // Send the transaction group
    const composerResults = await composer.send()

    // Map transaction IDs back to assets
    const results: BulkAssetOptInOutResult[] = assetIds.map((assetId, index) => ({
      assetId,
      transactionId: composerResults.transactionIds[index],
    }))

    return results
  }
}
