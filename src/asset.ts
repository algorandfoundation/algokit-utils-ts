import algosdk, { Algodv2 } from 'algosdk'
import {
  Config,
  MAX_TRANSACTION_GROUP_SIZE,
  encodeLease,
  encodeTransactionNote,
  getSenderAddress,
  getTransactionParams,
  sendGroupOfTransactions,
  sendTransaction,
} from '.'
import { AssetBulkOptInOutParams, AssetOptInParams, AssetOptOutParams } from './types/asset'
import { SendTransactionFrom, SendTransactionResult, TransactionGroupToSend, TransactionToSign } from './types/transaction'

enum ValidationType {
  OptIn,
  OptOut,
}

function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) yield arr.slice(i, i + n)
}

async function ensureAssetBalanceConditions(
  account: SendTransactionFrom,
  assetIds: number[],
  validationType: ValidationType,
  algod: algosdk.Algodv2,
) {
  const accountAddress = getSenderAddress(account)
  const accountInfo = await algod.accountInformation(accountAddress).do()
  const assetPromises = assetIds.map(async (assetId) => {
    if (validationType === ValidationType.OptIn) {
      if (accountInfo.assets.find((a: Record<string, number>) => a['asset-id'] === assetId)) {
        Config.logger.debug(`Account ${accountAddress} has already opted-in to asset ${assetId}`)
        return assetId
      }
    } else if (validationType === ValidationType.OptOut) {
      try {
        const accountAssetInfo = await algod.accountAssetInformation(accountAddress, assetId).do()
        if (accountAssetInfo['asset-holding']['amount'] !== 0) {
          Config.logger.debug(`Asset ${assetId} is not with zero balance`)
          return assetId
        }
      } catch (e) {
        Config.logger.debug(`Account ${accountAddress} does not have asset ${assetId}`)
        return assetId
      }
    }
    return null
  })

  const invalidAssets = (await Promise.all(assetPromises)).filter((assetId) => assetId !== null)
  if (invalidAssets.length > 0) {
    let errorMessage = ''
    if (validationType === ValidationType.OptIn) {
      errorMessage = `Asset${invalidAssets.length === 1 ? '' : 's'} ${invalidAssets.join(
        ', ',
      )} cannot be opted in. Ensure that they are valid and that the account has not previously opted into them.`
    } else if (validationType === ValidationType.OptOut) {
      errorMessage = `Asset${invalidAssets.length === 1 ? '' : 's'} ${invalidAssets.join(
        ', ',
      )} cannot be opted out. Ensure that they are valid and that the account has previously opted into them and holds zero balance.`
    }
    throw new Error(errorMessage)
  }
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
  const { account, assetId, note, transactionParams, lease, ...sendParams } = optIn

  const transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: getSenderAddress(account),
    to: getSenderAddress(account),
    assetIndex: assetId,
    amount: 0,
    rekeyTo: undefined,
    revocationTarget: undefined,
    closeRemainderTo: undefined,
    suggestedParams: await getTransactionParams(transactionParams, algod),
    note: encodeTransactionNote(note),
  })

  const encodedLease = encodeLease(lease)
  if (encodedLease) {
    transaction.addLease(encodedLease)
  }

  if (!sendParams.skipSending) {
    Config.getLogger(sendParams.suppressLog).debug(`Opted-in ${getSenderAddress(account)} to asset ${assetId}`)
  }

  return sendTransaction({ transaction, from: account, sendParams }, algod)
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
  const {
    account,
    assetId,
    note,
    transactionParams,
    lease,
    assetCreatorAddress: _assetCreatorAddress,
    ensureZeroBalance,
    ...sendParams
  } = optOut

  if (ensureZeroBalance === undefined || ensureZeroBalance) {
    await ensureAssetBalanceConditions(account, [assetId], ValidationType.OptOut, algod)
  }

  const assetCreatorAddress = _assetCreatorAddress ?? (await algod.getAssetByID(assetId).do()).params.creator

  const transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: getSenderAddress(account),
    to: getSenderAddress(account),
    assetIndex: assetId,
    amount: 0,
    rekeyTo: undefined,
    revocationTarget: undefined,
    closeRemainderTo: assetCreatorAddress,
    suggestedParams: await getTransactionParams(transactionParams, algod),
    note: encodeTransactionNote(note),
  })

  const encodedLease = encodeLease(lease)
  if (encodedLease) {
    transaction.addLease(encodedLease)
  }

  if (!sendParams.skipSending) {
    Config.getLogger(sendParams.suppressLog).debug(`Opted-out ${getSenderAddress(account)} from asset ${assetId}`)
  }

  return sendTransaction({ transaction, from: account, sendParams }, algod)
}

/**
 * Opt in to a list of assets on the Algorand blockchain.
 *
 * @param optIn - The bulk opt-in request.
 * @param algod - An instance of the Algodv2 class from the `algosdk` library.
 * @returns A record object where the keys are the asset IDs and the values are the corresponding transaction IDs for successful opt-ins.
 * @throws If there is an error during the opt-in process.
 * @example `algokit.bulkOptIn({ account: account, assetIds: [12345, 67890] }, algod)`
 */
export async function assetBulkOptIn(optIn: AssetBulkOptInOutParams, algod: Algodv2) {
  const { account, assetIds, validateBalances, transactionParams, note, maxFee, suppressLog } = optIn
  const result: Record<number, string> = {}

  if (validateBalances === undefined || validateBalances) {
    await ensureAssetBalanceConditions(account, assetIds, ValidationType.OptIn, algod)
  }

  const suggestedParams = await getTransactionParams(transactionParams, algod)

  for (const assetGroup of chunks(assetIds, MAX_TRANSACTION_GROUP_SIZE)) {
    try {
      const transactionsToSign: TransactionToSign[] = await Promise.all(
        assetGroup.map(async (assetId) => ({
          transaction: (
            await assetOptIn(
              {
                account,
                assetId,
                transactionParams: suggestedParams,
                note,
                maxFee,
                skipSending: true,
                suppressLog: true,
              },
              algod,
            )
          ).transaction,
          signer: account,
        })),
      )
      const txnGrp: TransactionGroupToSend = {
        transactions: transactionsToSign,
        signer: account,
        sendParams: {
          suppressLog: true,
        },
      }
      const sendGroupOfTransactionsResult = await sendGroupOfTransactions(txnGrp, algod)
      assetGroup.map((assetId, index) => {
        result[assetId] = sendGroupOfTransactionsResult.txIds[index]

        Config.getLogger(suppressLog).info(
          `Successfully opted in ${getSenderAddress(account)} for asset ${assetId} with transaction ID ${
            sendGroupOfTransactionsResult.txIds[index]
          },
          grouped under ${sendGroupOfTransactionsResult.groupId} round ${sendGroupOfTransactionsResult.confirmations?.[0]
            ?.confirmedRound}.`,
        )
      })
    } catch (e) {
      throw new Error(`Received error trying to opt in ${e}`)
    }
  }
  return result
}

/**
 * Opt out of multiple assets in Algorand blockchain.
 *
 * @param optOut The bulk opt-out request.
 * @param algod - An instance of the Algodv2 client used to interact with the Algorand blockchain.
 * @returns A record object containing asset IDs as keys and their corresponding transaction IDs as values.
 * @throws If there is an error during the opt-out process.
 * @example `algokit.bulkOptOut({ account: account, assetIds: [12345, 67890] }, algod)`
 */
export async function assetBulkOptOut(optOut: AssetBulkOptInOutParams, algod: Algodv2): Promise<Record<number, string>> {
  const { account, validateBalances, transactionParams, note, assetIds, maxFee, suppressLog } = optOut
  const result: Record<number, string> = {}

  if (validateBalances === undefined || validateBalances) {
    await ensureAssetBalanceConditions(account, assetIds, ValidationType.OptOut, algod)
  }

  const suggestedParams = await getTransactionParams(transactionParams, algod)

  const assetDetails = await Promise.all(assetIds.map((assetId) => algod.getAssetByID(assetId).do()))

  for (const assetGroup of chunks(assetDetails, MAX_TRANSACTION_GROUP_SIZE)) {
    try {
      const transactionToSign: TransactionToSign[] = await Promise.all(
        assetGroup.map(async (asset) => ({
          transaction: (
            await assetOptOut(
              {
                account,
                assetId: asset.index,
                assetCreatorAddress: asset.params.creator,
                transactionParams: suggestedParams,
                note,
                maxFee,
                skipSending: true,
                suppressLog: true,
              },
              algod,
            )
          ).transaction,
          signer: account,
        })),
      )
      const txnGrp: TransactionGroupToSend = {
        transactions: transactionToSign,
        signer: account,
        sendParams: {
          suppressLog: true,
        },
      }
      const sendGroupOfTransactionsResult = await sendGroupOfTransactions(txnGrp, algod)
      assetGroup.map((asset, index) => {
        result[asset.index] = sendGroupOfTransactionsResult.txIds[index]

        Config.getLogger(suppressLog).info(
          `Successfully opted out ${getSenderAddress(account)} from asset ${asset.index} with transaction ID ${
            sendGroupOfTransactionsResult.txIds[index]
          },
          grouped under ${sendGroupOfTransactionsResult.groupId} round ${sendGroupOfTransactionsResult.confirmations?.[0]
            ?.confirmedRound}.`,
        )
      })
    } catch (e) {
      throw new Error(`Received error trying to opt out ${e}`)
    }
  }
  return result
}
