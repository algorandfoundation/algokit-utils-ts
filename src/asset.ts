import algosdk from 'algosdk'
import { encodeTransactionNote, getSenderAddress } from './transaction'
import { legacySendTransactionBridge } from './transaction/legacy-bridge'
import { AlgorandClient } from './types/algorand-client'
import { AssetBulkOptInOutParams, AssetOptInParams, AssetOptOutParams, CreateAssetParams } from './types/asset'
import { AssetCreateParams, AssetOptInParams as NewAssetOptInParams, AssetOptOutParams as NewAssetOptOutParams } from './types/composer'
import { SendTransactionResult } from './types/transaction'
import Algodv2 = algosdk.Algodv2

/**
 * @deprecated use `algorand.send.assetCreate()` / `algorand.transactions.assetCreate()` instead
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
  algod: Algodv2,
): Promise<SendTransactionResult & { confirmation?: { assetIndex: number | bigint } }> {
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
  )) as SendTransactionResult & { confirmation: { assetIndex: number | bigint } }
}

/**
 * @deprecated use `algorand.send.assetOptIn()` / `algorand.transactions.assetOptIn()` instead
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
export async function assetOptIn(optIn: AssetOptInParams, algod: Algodv2): Promise<SendTransactionResult> {
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
 * @deprecated use `algorand.send.assetOptOut()` / `algorand.transactions.assetOptOut()` instead
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
export async function assetOptOut(optOut: AssetOptOutParams, algod: Algodv2): Promise<SendTransactionResult> {
  const assetCreatorAddress = optOut.assetCreatorAddress ?? (await algod.getAssetByID(optOut.assetId).do()).params.creator

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
    (c) => (params: NewAssetOptOutParams) => c.assetOptOut({ ...params, ensureZeroBalance: optOut.ensureZeroBalance ?? true }),
  )
}

/**
 * @deprecated use `algorand.asset.bulkOptIn()` instead
 *
 * Opt in to a list of assets on the Algorand blockchain.
 *
 * @param optIn - The bulk opt-in request.
 * @param algod - An instance of the Algodv2 class from the `algosdk` library.
 * @returns A record object where the keys are the asset IDs and the values are the corresponding transaction IDs for successful opt-ins.
 * @throws If there is an error during the opt-in process.
 * @example algokit.bulkOptIn({ account: account, assetIds: [12345, 67890] }, algod)
 */
export async function assetBulkOptIn(optIn: AssetBulkOptInOutParams, algod: Algodv2): Promise<Record<number, string>> {
  const result = await AlgorandClient.fromClients({ algod })
    .setSignerFromAccount(optIn.account)
    .asset.bulkOptIn(getSenderAddress(optIn.account), optIn.assetIds.map(BigInt), {
      note: encodeTransactionNote(optIn.note),
      maxFee: optIn.maxFee,
      suppressLog: optIn.suppressLog,
    })

  const returnResult: Record<number, string> = {}
  for (const r of result) {
    returnResult[Number(r.assetId)] = r.transactionId
  }
  return returnResult
}

/**
 * @deprecated use `algorand.asset.bulkOptOut()` instead
 *
 * Opt out of multiple assets in Algorand blockchain.
 *
 * @param optOut The bulk opt-out request.
 * @param algod - An instance of the Algodv2 client used to interact with the Algorand blockchain.
 * @returns A record object containing asset IDs as keys and their corresponding transaction IDs as values.
 * @throws If there is an error during the opt-out process.
 * @example algokit.bulkOptOut({ account: account, assetIds: [12345, 67890] }, algod)
 */
export async function assetBulkOptOut(optOut: AssetBulkOptInOutParams, algod: Algodv2): Promise<Record<number, string>> {
  const result = await AlgorandClient.fromClients({ algod })
    .setSignerFromAccount(optOut.account)
    .asset.bulkOptOut(getSenderAddress(optOut.account), optOut.assetIds.map(BigInt), {
      ensureZeroBalance: optOut.validateBalances ?? true,
      note: encodeTransactionNote(optOut.note),
      maxFee: optOut.maxFee,
      suppressLog: optOut.suppressLog,
    })

  const returnResult: Record<number, string> = {}
  for (const r of result) {
    returnResult[Number(r.assetId)] = r.transactionId
  }
  return returnResult
}
