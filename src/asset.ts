import algosdk from 'algosdk'
import { encodeTransactionNote, getSenderAddress } from './transaction'
import { legacySendTransactionBridge } from './transaction/legacy-bridge'
import { AccountManager } from './types/account-manager'
import { AssetBulkOptInOutParams, AssetOptInParams, AssetOptOutParams, CreateAssetParams } from './types/asset'
import { ClientManager } from './types/client-manager'
import { AssetCreateParams, AssetOptInParams as NewAssetOptInParams, AssetOptOutParams as NewAssetOptOutParams } from './types/composer'
import { SendTransactionResult } from './types/transaction'
import Algodv2 = algosdk.Algodv2

/**
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
    (client) => client.transactions.assetCreate,
    (client) => client.send.assetCreate,
  )) as SendTransactionResult & { confirmation: { assetIndex: number | bigint } }
}

/**
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
    (c) => c.transactions.assetOptIn,
    (c) => c.send.assetOptIn,
  )
}

/**
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
    (c) => c.transactions.assetOptOut,
    (c) => (params: NewAssetOptOutParams) => c.send.assetOptOut({ ...params, ensureZeroBalance: optOut.ensureZeroBalance ?? true }),
  )
}

/**
 * Opt in to a list of assets on the Algorand blockchain.
 *
 * @param optIn - The bulk opt-in request.
 * @param algod - An instance of the Algodv2 class from the `algosdk` library.
 * @returns A record object where the keys are the asset IDs and the values are the corresponding transaction IDs for successful opt-ins.
 * @throws If there is an error during the opt-in process.
 * @example algokit.bulkOptIn({ account: account, assetIds: [12345, 67890] }, algod)
 */
export async function assetBulkOptIn(optIn: AssetBulkOptInOutParams, algod: Algodv2): Promise<Record<number, string>> {
  const result = await new AccountManager(new ClientManager({ algod }))
    .setSignerFromAccount(optIn.account)
    .assetBulkOptIn(getSenderAddress(optIn.account), optIn.assetIds, {
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
 * Opt out of multiple assets in Algorand blockchain.
 *
 * @param optOut The bulk opt-out request.
 * @param algod - An instance of the Algodv2 client used to interact with the Algorand blockchain.
 * @returns A record object containing asset IDs as keys and their corresponding transaction IDs as values.
 * @throws If there is an error during the opt-out process.
 * @example algokit.bulkOptOut({ account: account, assetIds: [12345, 67890] }, algod)
 */
export async function assetBulkOptOut(optOut: AssetBulkOptInOutParams, algod: Algodv2): Promise<Record<number, string>> {
  const result = await new AccountManager(new ClientManager({ algod }))
    .setSignerFromAccount(optOut.account)
    .assetBulkOptOut(getSenderAddress(optOut.account), optOut.assetIds, {
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
