import algosdk from 'algosdk'
import { AlgorandClientSender, SendSingleTransactionResult } from '../types/algorand-client-sender'
import { AlgorandClientTransactionCreator } from '../types/algorand-client-transaction-creator'
import { AssetManager } from '../types/asset-manager'
import AlgoKitComposer, { CommonTransactionParams, ExecuteParams } from '../types/composer'
import { SendTransactionFrom, SendTransactionParams, SendTransactionResult } from '../types/transaction'
import { getSenderTransactionSigner, getTransactionParams } from './transaction'
import Algodv2 = algosdk.Algodv2
import Transaction = algosdk.Transaction

/** Bridges between legacy `sendTransaction` behaviour and new `AlgorandClient` behaviour. */
export async function legacySendTransactionBridge<T extends CommonTransactionParams>(
  algod: Algodv2,
  from: SendTransactionFrom,
  sendParams: SendTransactionParams,
  params: T,
  txn: (c: AlgorandClientTransactionCreator) => (params: T) => Promise<Transaction>,
  send: (c: AlgorandClientSender) => (params: T & ExecuteParams) => Promise<SendSingleTransactionResult>,
  suggestedParams?: algosdk.SuggestedParams,
): Promise<SendTransactionResult> {
  const newGroup = () =>
    new AlgoKitComposer({
      algod,
      getSigner: () => getSenderTransactionSigner(from),
      getSuggestedParams: async () => await getTransactionParams(suggestedParams, algod),
    })
  const sender = new AlgorandClientSender(newGroup, new AssetManager(algod, newGroup))
  const transactionCreator = new AlgorandClientTransactionCreator(newGroup)

  if (sendParams.fee) {
    params.staticFee = sendParams.fee
  }
  if (sendParams.maxFee) {
    params.maxFee = sendParams.maxFee
  }

  if (sendParams.atc || sendParams.skipSending) {
    const transaction = await txn(transactionCreator)(params)
    if (sendParams.atc) {
      sendParams.atc.addTransaction(await { txn: transaction, signer: getSenderTransactionSigner(from) })
    }
    return { transaction }
  }

  return await send(sender)({ ...sendParams, ...params })
}
