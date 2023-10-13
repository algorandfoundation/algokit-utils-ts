import algosdk, { Account, Algodv2 } from 'algosdk'
import { Config, sendGroupOfTransactions } from '.'
import { TransactionGroupToSend, TransactionToSign } from './types/transaction'

const MaxTxGroupSize = 16

function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) yield arr.slice(i, i + n)
}

async function ensureAccountIsValid(client: algosdk.Algodv2, account: algosdk.Account) {
  try {
    await client.accountInformation(account.addr).do()
  } catch (error) {
    throw new Error(`Account address ${account.addr} does not exist`)
  }
}

async function ensureAssetFirstOptIn(client: algosdk.Algodv2, account: algosdk.Account, assetIds: number[]) {
  const accountInfo = await client.accountInformation(account.addr).do()
  const assetPromises = assetIds.map(async (assetId) => {
    if (accountInfo.assets.find((a: Record<string, number>) => a['asset-id'] === assetId)) {
      Config.logger.debug(`Account ${account.addr} has already opted-in to asset ${assetId}`)
      return assetId
    }
    return null
  })
  const invalidAssetsForOptIn = (await Promise.all(assetPromises)).filter((assetId) => assetId !== null)
  if (invalidAssetsForOptIn.length > 0) {
    throw new Error(
      `Assets ${invalidAssetsForOptIn.join(
        ', ',
      )} cannot be opted in. Ensure that they are valid and that the account has not previously opted into them.`,
    )
  }
}

async function ensureAssetBalance(account: Account, assetIds: number[], client: Algodv2) {
  const assetPromises = assetIds.map(async (assetId) => {
    try {
      const accountAssetInfo = await client.accountAssetInformation(account.addr, assetId).do()
      if (accountAssetInfo['asset-holding']['amount'] !== 0) {
        Config.logger.debug(`asset ${assetId} is not with zero balance`)
        return assetId
      }
    } catch (e) {
      Config.logger.debug(`Account ${account.addr} does not have asset ${assetId}`)
      return assetId
    }
    return null
  })

  const invalidAssets = (await Promise.all(assetPromises)).filter((assetId) => assetId !== null)
  if (invalidAssets.length > 0) {
    throw new Error(
      `Assets ${invalidAssets.join(
        ', ',
      )} cannot be opted out. Ensure that they are valid and that the account has previously opted into them.`,
    )
  }
}

/**
 * Opt in to a list of assets on the Algorand blockchain.
 *
 * @param client - An instance of the Algodv2 class from the `algosdk` library.
 * @param account - An instance of the Account class from the `algosdk` library representing the account that wants to opt in to the assets.
 * @param assetIds - An array of asset IDs that the account wants to opt in to.
 * @returns A record object where the keys are the asset IDs and the values are the corresponding transaction IDs for successful opt-ins.
 * @throws If there is an error during the opt-in process.
 */
export async function optIn(client: Algodv2, account: Account, assetIds: number[]) {
  const result: Record<number, string> = {}
  await ensureAccountIsValid(client, account)
  await ensureAssetFirstOptIn(client, account, assetIds)

  const assets = await Promise.all(assetIds.map((aid) => client.getAssetByID(aid).do()))
  const suggestedParams = await client.getTransactionParams().do()

  for (const assetGroup of chunks(assets, MaxTxGroupSize)) {
    try {
      const transactionToSign: TransactionToSign[] = assetGroup.flatMap((asset) => [
        {
          transaction: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: account.addr,
            to: account.addr,
            assetIndex: asset.index,
            amount: 0,
            rekeyTo: undefined,
            revocationTarget: undefined,
            closeRemainderTo: undefined,
            suggestedParams,
          }),
          signer: account,
        },
      ])
      const txnGrp: TransactionGroupToSend = {
        transactions: transactionToSign,
        signer: account,
      }
      const sendGroupOfTransactionsResult = await sendGroupOfTransactions(txnGrp, client)
      assetGroup.map((asset, index) => {
        result[asset.index] = sendGroupOfTransactionsResult.txIds[index]

        Config.logger.info(
          `Successfully opted in of asset ${asset.index} with transaction ID ${sendGroupOfTransactionsResult.txIds[index]},
          grouped under ${sendGroupOfTransactionsResult.groupId} round ${sendGroupOfTransactionsResult.confirmations}.`,
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
 * @param {Algodv2} client - An instance of the Algodv2 client used to interact with the Algorand blockchain.
 * @param {Account} account - The Algorand account that wants to opt out of the assets.
 * @param {number[]} assetIds - An array of asset IDs representing the assets to opt out of.
 * @returns {Promise<Record<number, string>>} - A record object containing asset IDs as keys and their corresponding transaction IDs as values.
 */
export async function optOut(client: Algodv2, account: Account, assetIds: number[]): Promise<Record<number, string>> {
  const result: Record<number, string> = {}

  // Verify assets
  await ensureAssetBalance(account, assetIds, client)

  const assets = await Promise.all(assetIds.map((aid) => client.getAssetByID(aid).do()))
  const suggestedParams = await client.getTransactionParams().do()

  for (const assetGroup of chunks(assets, MaxTxGroupSize)) {
    try {
      const transactionToSign: TransactionToSign[] = assetGroup.flatMap((asset) => [
        {
          transaction: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            assetIndex: asset.index,
            amount: 0,
            from: account.addr,
            to: account.addr,
            rekeyTo: undefined,
            revocationTarget: undefined,
            suggestedParams,
            closeRemainderTo: asset.params.creator,
          }),
          signer: account,
        },
      ])
      const txnGrp: TransactionGroupToSend = {
        transactions: transactionToSign,
        signer: account,
      }
      const sendGroupOfTransactionsResult = await sendGroupOfTransactions(txnGrp, client)
      assetGroup.map((asset, index) => {
        result[asset.index] = sendGroupOfTransactionsResult.txIds[index]

        Config.logger.info(
          `Successfully opted out of asset ${asset.index} with transaction ID ${sendGroupOfTransactionsResult.txIds[index]},
          grouped under ${sendGroupOfTransactionsResult.groupId} round ${sendGroupOfTransactionsResult.confirmations}.`,
        )
      })
    } catch (e) {
      throw new Error(`Received error trying to opt out ${e}`)
    }
  }
  return result
}
