import algosdk from 'algosdk'
import { AlgorandClient, SendSingleTransactionResult } from '../types/algorand-client'
import { CommonTransactionParams, ExecuteParams } from '../types/composer'
import { SendTransactionFrom, SendTransactionParams, SendTransactionResult } from '../types/transaction'
import { getSenderTransactionSigner } from './transaction'
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
