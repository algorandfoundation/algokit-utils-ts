import { AlgodClient } from '@algorandfoundation/algokit-algod-client'
import { Address, MAX_TRANSACTION_GROUP_SIZE } from '@algorandfoundation/algokit-common'
import { Config } from '../config'
import { chunkArray } from '../util'
import { AccountAssetInformation } from './account'
import { CommonTransactionParams, TransactionComposer, TransactionComposerConfig } from './composer'
import { SendParams } from './transaction'

/** Individual result from performing a bulk opt-in or bulk opt-out for an account against a series of assets. */
export interface BulkAssetOptInOutResult {
  /** The ID of the asset opted into / out of */
  assetId: bigint
  /** The transaction ID of the resulting opt in / out */
  transactionId: string
}

/** Information about an asset. */
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
  private _algod: AlgodClient
  private _newGroup: () => TransactionComposer

  /**
   * Create a new asset manager.
   * @param algod An algod client
   * @param newGroup A function that creates a new `TransactionComposer` transaction group
   * @example Create a new asset manager
   * ```typescript
   * const assetManager = new AssetManager(algod, () => new TransactionComposer({algod, () => signer, () => suggestedParams}))
   * ```
   */
  constructor(algod: AlgodClient, newGroup: (config?: TransactionComposerConfig) => TransactionComposer) {
    this._algod = algod
    this._newGroup = newGroup
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
    const asset = await this._algod.assetById(assetId)

    return {
      assetId: BigInt(asset.id),
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

  /**
   * Returns the given sender account's asset holding for a given asset.
   *
   * @example
   * ```typescript
   * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const assetId = 123345n;
   * const accountInfo = await assetManager.getAccountInformation(address, assetId);
   * ```
   *
   * [Response data schema details](https://dev.algorand.co/reference/rest-apis/algod/#accountassetinformation)
   * @param sender The address of the sender/account to look up
   * @param assetId The ID of the asset to return a holding for
   * @returns The account asset holding information
   */
  public async getAccountInformation(sender: string | Address, assetId: bigint): Promise<AccountAssetInformation> {
    const info = await this._algod.accountAssetInformation(sender.toString(), assetId)

    return {
      assetId: BigInt(assetId),
      balance: BigInt(info.assetHolding?.amount ?? 0),
      frozen: info.assetHolding?.isFrozen === true,
      round: BigInt(info['round']),
    }
  }

  /**
   * Opt an account in to a list of Algorand Standard Assets.
   *
   * Transactions will be sent in batches of 16 as transaction groups.
   *
   * @param account The account to opt-in
   * @param assetIds The list of asset IDs to opt-in to
   * @param options Any parameters to control the transaction or execution of the transaction
   * @example Example using AlgorandClient
   * ```typescript
   * // Basic example
   * assetManager.bulkOptIn("ACCOUNTADDRESS", [12345n, 67890n])
   * // With configuration
   * assetManager.bulkOptIn("ACCOUNTADDRESS", [12345n, 67890n], { maxFee: (1000).microAlgo(), suppressLog: true })
   * ```
   * @returns An array of records matching asset ID to transaction ID of the opt in
   */
  async bulkOptIn(
    account: string | Address,
    assetIds: bigint[],
    options?: Omit<CommonTransactionParams, 'sender'> & SendParams,
  ): Promise<BulkAssetOptInOutResult[]> {
    const results: BulkAssetOptInOutResult[] = []

    for (const assetGroup of chunkArray(assetIds, MAX_TRANSACTION_GROUP_SIZE)) {
      const composer = this._newGroup()

      for (const assetId of assetGroup) {
        composer.addAssetOptIn({
          ...options,
          sender: account,
          assetId: BigInt(assetId),
        })
      }

      const result = await composer.send(options)

      Config.getLogger(options?.suppressLog).info(
        `Successfully opted in ${account} for assets ${assetGroup.join(', ')} with transaction IDs ${result.txIds.join(', ')}` +
          `\n  Grouped under ${result.groupId} in round ${result.confirmations?.[0]?.confirmedRound}.`,
      )

      assetGroup.forEach((assetId, index) => {
        results.push({ assetId: BigInt(assetId), transactionId: result.txIds[index] })
      })
    }

    return results
  }

  /**
   * Opt an account out of a list of Algorand Standard Assets.
   *
   * Transactions will be sent in batches of 16 as transaction groups.
   *
   * @param account The account to opt-in
   * @param assetIds The list of asset IDs to opt-out of
   * @param options Any parameters to control the transaction or execution of the transaction
   * @example Example using AlgorandClient
   * ```typescript
   * // Basic example
   * assetManager.bulkOptOut("ACCOUNTADDRESS", [12345n, 67890n])
   * // With configuration
   * assetManager.bulkOptOut("ACCOUNTADDRESS", [12345n, 67890n], { ensureZeroBalance: true, maxFee: (1000).microAlgo(), suppressLog: true })
   * ```
   * @returns An array of records matching asset ID to transaction ID of the opt in
   */
  async bulkOptOut(
    account: string | Address,
    assetIds: bigint[],
    options?: Omit<CommonTransactionParams, 'sender'> &
      SendParams & {
        /** Whether or not to check if the account has a zero balance for each asset first or not.
         *
         * Defaults to `true`.
         *
         * If this is set to `true` and the account has an asset balance it will throw an error.
         *
         * If this is set to `false` and the account has an asset balance it will lose those assets to the asset creator.
         */
        ensureZeroBalance?: boolean
      },
  ): Promise<BulkAssetOptInOutResult[]> {
    const results: BulkAssetOptInOutResult[] = []

    for (const assetGroup of chunkArray(assetIds, MAX_TRANSACTION_GROUP_SIZE)) {
      const composer = this._newGroup()

      const notOptedInAssetIds: bigint[] = []
      const nonZeroBalanceAssetIds: bigint[] = []
      for (const assetId of assetGroup) {
        if (options?.ensureZeroBalance !== false) {
          try {
            const accountAssetInfo = await this.getAccountInformation(account, assetId)
            if (accountAssetInfo.balance !== 0n) {
              nonZeroBalanceAssetIds.push(BigInt(assetId))
            }
          } catch {
            notOptedInAssetIds.push(BigInt(assetId))
          }
        }
      }

      if (notOptedInAssetIds.length > 0 || nonZeroBalanceAssetIds.length > 0) {
        throw new Error(
          `Account ${account}${notOptedInAssetIds.length > 0 ? ` is not opted-in to Asset${notOptedInAssetIds.length > 1 ? 's' : ''} ${notOptedInAssetIds.join(', ')}` : ''}${
            nonZeroBalanceAssetIds.length > 0
              ? ` has non-zero balance for Asset${nonZeroBalanceAssetIds.length > 1 ? 's' : ''} ${nonZeroBalanceAssetIds.join(', ')}`
              : ''
          }; can't opt-out.`,
        )
      }

      for (const assetId of assetGroup) {
        composer.addAssetOptOut({
          ...options,
          creator: (await this.getById(BigInt(assetId))).creator,
          sender: account,
          assetId: BigInt(assetId),
        })
      }

      const result = await composer.send(options)

      Config.getLogger(options?.suppressLog).info(
        `Successfully opted ${account} out of assets ${assetGroup.join(', ')} with transaction IDs ${result.txIds.join(', ')}` +
          `\n  Grouped under ${result.groupId} in round ${result.confirmations?.[0]?.confirmedRound}.`,
      )

      assetGroup.forEach((assetId, index) => {
        results.push({ assetId: BigInt(assetId), transactionId: result.txIds[index] })
      })
    }

    return results
  }
}
