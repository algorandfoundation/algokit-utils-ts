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
async function checkAssetBalance(account: Account, assetId: number, client: Algodv2) {
  const accountInfo = await client.accountInformation(account.addr).do()
  if (!accountInfo.assets || !accountInfo.assets.find((a: Record<string, number>) => a['asset-id'] === assetId)) {
    throw new Error(`Account ${account.addr} does not have asset ${assetId}`)
  }
  const accountAssetInfo = await client.accountAssetInformation(account.addr, assetId).do()
  if (accountAssetInfo['asset-holding']['amount'] != 0) {
    throw new Error(`asset ${assetId} is not with zero balance`)
  }
}

export async function OptOut(client: Algodv2, optoutAccount: Account, assetIds: number[]): Promise<Record<number, string>> {
  const result: Record<number, string> = {}

  // Verify assets
  const verifiedAssetIds: number[] = []
  for (const assetId of assetIds) {
    await checkAssetBalance(optoutAccount, assetId, client)
    verifiedAssetIds.push(assetId)
  }
  const assets = await Promise.all(verifiedAssetIds.map((aid) => client.getAssetByID(aid).do()))
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

      assetGroup.forEach((asset) => {
        result[asset.index] = sendGroupOfTransactionsResult.groupId
      })

      Config.logger.info(
        `Successfully opted out of assets ${assetGroup.map((asset) => asset.index).join(', ')} with transaction ${
          sendGroupOfTransactionsResult.txIds
        } round ${sendGroupOfTransactionsResult.confirmations}.`,
      )
    } catch (e) {
      throw new Error(`Received error trying to opt out ${e}`)
    }
  }
  return result
}
