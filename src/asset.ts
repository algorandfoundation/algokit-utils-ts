import algosdk, { Account, Algodv2 } from 'algosdk'
import { Config, sendGroupOfTransactions } from '.'
import { transferAsset } from './transfer'
import { TransactionGroupToSend, TransactionToSign } from './types/transaction'

const MaxTxGroupSize = 16

export async function optIn(client: Algodv2, account: Account, assetId: number) {
  const accountInfo = await client.accountInformation(account.addr).do()
  if (accountInfo.assets.find((a: Record<string, number>) => a['asset-id'] === assetId)) {
    throw new Error(`Account ${account.addr} have already opt-in to asset ${assetId}`)
  }
  await transferAsset(
    {
      from: account,
      to: account.addr,
      assetId,
      amount: 0,
      note: `Opt in asset id ${assetId}`,
    },
    client,
  )
}

function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}
async function ensureAssetBalance(account: Account, assetIds: number[], client: Algodv2) {
  const assetPromises = assetIds.map(async (assetId) => {
    try {
      const accountAssetInfo = await client.accountAssetInformation(account.addr, assetId).do()
      if (accountAssetInfo['asset-holding']['amount'] !== 0) {
        Config.logger.error(`asset ${assetId} is not with zero balance`)
        return assetId
      }
    } catch (e) {
      Config.logger.error(`Account ${account.addr} does not have asset ${assetId}`)
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

export async function optOut(client: Algodv2, optoutAccount: Account, assetIds: number[]): Promise<Record<number, string>> {
  const result: Record<number, string> = {}

  // Verify assets
  await ensureAssetBalance(optoutAccount, assetIds, client)

  const assets = await Promise.all(assetIds.map((aid) => client.getAssetByID(aid).do()))
  const suggestedParams = await client.getTransactionParams().do()

  for (const assetGroup of chunks(assets, MaxTxGroupSize)) {
    try {
      const transactionToSign: TransactionToSign[] = assetGroup.flatMap((asset) => [
        {
          transaction: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            assetIndex: asset.index,
            amount: 0,
            from: optoutAccount.addr,
            to: optoutAccount.addr,
            rekeyTo: undefined,
            revocationTarget: undefined,
            suggestedParams,
            closeRemainderTo: asset.params.creator,
          }),
          signer: optoutAccount,
        },
      ])
      const txnGrp: TransactionGroupToSend = {
        transactions: transactionToSign,
        signer: optoutAccount,
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
