import { AlgodClient } from '@algorandfoundation/algokit-algod-client'
import { encodeTransactionNote, getSenderAddress } from './transaction'
import { legacySendTransactionBridge } from './transaction/legacy-bridge'
import { AssetOptInParams, AssetOptOutParams, CreateAssetParams } from './types/asset'
import { AssetCreateParams, AssetOptInParams as NewAssetOptInParams, AssetOptOutParams as NewAssetOptOutParams } from './types/composer'
import { SendTransactionResult } from './types/transaction'
import { getOptionalAddress } from '@algorandfoundation/algokit-common'

/**
 * @deprecated use `algorand.send.assetCreate()` / `algorand.createTransaction.assetCreate()` instead
 *
 * Create an Algorand Standard Asset (ASA).
 * @param create The asset creation definition
 * @param algod An algod client
 * @returns The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)
 *
 * @example Usage example
 * ```typescript
 * await algokit.createAsset({ creator: account, total: 1, decimals: 0, name: 'My asset' }, algod)
 * ```
 */
export async function createAsset(
  create: CreateAssetParams,
  algod: AlgodClient,
): Promise<SendTransactionResult & { confirmation?: { assetId: number | bigint } }> {
  const params: AssetCreateParams = {
    sender: getSenderAddress(create.creator),
    total: BigInt(create.total),
    decimals: create.decimals,
    assetName: create.name,
    unitName: create.unit,
    manager: create.manager ? getSenderAddress(create.manager) : undefined,
    clawback: create.clawbackAccount ? getSenderAddress(create.clawbackAccount) : undefined,
    freeze: create.freezeAccount ? getSenderAddress(create.freezeAccount) : undefined,
    reserve: create.reserveAccount ? getSenderAddress(create.reserveAccount) : undefined,
    defaultFrozen: create.frozenByDefault,
    lease: create.lease,
    metadataHash: create.metadataHash,
    note: encodeTransactionNote(create.note),
    url: create.url,
  }

  return (await legacySendTransactionBridge(
    algod,
    create.creator,
    create,
    params,
    (client) => client.assetCreate,
    (client) => client.assetCreate,
  )) as SendTransactionResult & { confirmation: { assetId: number | bigint } }
}

/**
 * @deprecated use `algorand.send.assetOptIn()` / `algorand.createTransaction.assetOptIn()` instead
 *
 * Opt-in an account to an asset.
 * @param optIn The opt-in definition
 * @param algod An algod client
 * @returns The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)
 *
 * @example Usage example
 * ```typescript
 * await algokit.assetOptIn({ account, assetId }, algod)
 * ```
 */
export async function assetOptIn(optIn: AssetOptInParams, algod: AlgodClient): Promise<SendTransactionResult> {
  const params: NewAssetOptInParams = {
    assetId: BigInt(optIn.assetId),
    sender: getSenderAddress(optIn.account),
    note: encodeTransactionNote(optIn.note),
    lease: optIn.lease,
  }

  return legacySendTransactionBridge(
    algod,
    optIn.account,
    optIn,
    params,
    (c) => c.assetOptIn,
    (c) => c.assetOptIn,
  )
}

/**
 * @deprecated use `algorand.send.assetOptOut()` / `algorand.createTransaction.assetOptOut()` instead
 *
 * Opt-out an account from an asset.
 * @param optOut The opt-in definition
 * @param algod An algod client
 * @returns The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)
 *
 * @example Usage example
 * ```typescript
 * await algokit.assetOptOut({ account, assetId, assetCreatorAddress }, algod)
 * ```
 */
export async function assetOptOut(optOut: AssetOptOutParams, algod: AlgodClient): Promise<SendTransactionResult> {
  const assetCreatorAddress = optOut.assetCreatorAddress ?? (await algod.getAssetById(optOut.assetId)).params.creator

  const params: NewAssetOptOutParams = {
    assetId: BigInt(optOut.assetId),
    creator: assetCreatorAddress,
    sender: getSenderAddress(optOut.account),
    note: encodeTransactionNote(optOut.note),
    lease: optOut.lease,
  }

  return legacySendTransactionBridge(
    algod,
    optOut.account,
    optOut,
    params,
    (c) => c.assetOptOut,
    (c) => (params: NewAssetOptOutParams) =>
      c.assetOptOut({ ...params, creator: getOptionalAddress(params.creator), ensureZeroBalance: optOut.ensureZeroBalance ?? true }),
  )
}
