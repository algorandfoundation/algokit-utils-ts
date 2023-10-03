import algosdk, { Account, Algodv2, LogicSigAccount } from 'algosdk'
import { PendingTransactionResponse } from 'algosdk/dist/types/client/v2/algod/models/types'
import { Config } from '.'
import { waitForConfirmation } from './transaction'
import { transferAsset } from './transfer'
import { TransactionToSign } from './types/transaction'

const MaxTxGroupSize = 16

export async function optIn(algod: Algodv2, account: Account, assetId: number) {
  await transferAsset(
    {
      from: account,
      to: account.addr,
      assetId,
      amount: 0,
      note: `Opt in asset id ${assetId}`,
    },
    algod,
  )
}

function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}

export const sendGroupOfTransactions = async function (client: Algodv2, transactions: TransactionToSign[], skipWaiting = false) {
  const transactionsToSend = transactions.map((t) => t.transaction)
  const signedTransactions = algosdk.assignGroupID(transactionsToSend).map((groupedTransaction, index) => {
    const signer = transactions[index].signer
    const lsig = signer as LogicSigAccount
    return 'sk' in signer ? groupedTransaction.signTxn(signer.sk) : algosdk.signLogicSigTransactionObject(groupedTransaction, lsig).blob
  })
  const { txId } = (await client.sendRawTransaction(signedTransactions).do()) as { txId: string }

  let confirmation: PendingTransactionResponse | undefined = undefined
  if (!skipWaiting) {
    confirmation = await waitForConfirmation(txId, 5, client)
  }

  return { txId, confirmation }
}

export async function OptOut(client: Algodv2, optoutAccount: Account, assetIds: number[]) {
  const assets = await Promise.all(assetIds.map((aid) => client.getAssetByID(aid).do()))
  const suggestedParams = await client.getTransactionParams().do()

  for (const assetGroup of chunks(assets, Math.floor(MaxTxGroupSize / 2))) {
    try {
      const txnGrp: TransactionToSign[] = assetGroup.flatMap((asset) => [
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
      const { txId, confirmation } = await sendGroupOfTransactions(client, txnGrp)

      Config.logger.info(
        `Successfully opted out of assets ${assetGroup.map((asset) => asset.index).join(', ')} with transaction ${txId} round ${
          confirmation ? confirmation.confirmedRound : 'unknown'
        }.`,
      )
    } catch (e) {
      Config.logger.warn('Received error trying to', e)
    }
  }
}
