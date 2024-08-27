import algosdk from 'algosdk'
import { AlgorandClient, SendSingleTransactionResult } from '../types/algorand-client'
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
  txn: (c: AlgorandClient) => (params: T) => Promise<Transaction>,
  send: (c: AlgorandClient) => (params: T & ExecuteParams) => Promise<SendSingleTransactionResult>,
): Promise<SendTransactionResult> {
  const client = AlgorandClient.fromClients({ algod }).setSignerFromAccount(from)

  if (sendParams.fee) {
    params.staticFee = sendParams.fee
  }
  if (sendParams.maxFee) {
    params.maxFee = sendParams.maxFee
  }

  if (sendParams.atc || sendParams.skipSending) {
    const transaction = await txn(client)(params)
    if (sendParams.atc) {
      sendParams.atc.addTransaction(await { txn: transaction, signer: getSenderTransactionSigner(from) })
    }
    return { transaction }
  }

  return await send(client)({ ...sendParams, ...params })
}

/** Bridges between legacy `sendTransaction` behaviour and new `AlgoKitComposer` behaviour. */
export async function legacySendTransactionBridgeComposer<T extends CommonTransactionParams>(
  algod: Algodv2,
  from: SendTransactionFrom,
  params: T,
  compose: (c: AlgoKitComposer) => (params: T) => AlgoKitComposer,
  sendParams?: SendTransactionParams,
  suggestedParams?: algosdk.SuggestedParams,
): Promise<SendTransactionResult> {
  const composer = new AlgoKitComposer({
    algod,
    getSigner: (address) => getSenderTransactionSigner(from),
    getSuggestedParams: async () => await getTransactionParams(suggestedParams, algod),
  })
  sendParams = sendParams ?? {}

  if (sendParams.fee) {
    params.staticFee = sendParams.fee
  }
  if (sendParams.maxFee) {
    params.maxFee = sendParams.maxFee
  }

  if (sendParams.atc || sendParams.skipSending) {
    await compose(composer).apply(composer, [params])
    const transactions = await composer.build()
    if (sendParams.atc) {
      transactions.transactions.forEach((txn) => sendParams!.atc!.addTransaction(txn))
    }
    return { transaction: transactions.transactions[transactions.transactions.length - 1].txn }
  }

  const result = await compose(composer).apply(composer, [params]).execute(sendParams)
  return {
    ...result,
    transaction: result.transactions[result.transactions.length - 1],
    confirmation: result.confirmations[result.confirmations.length - 1],
  }
}
