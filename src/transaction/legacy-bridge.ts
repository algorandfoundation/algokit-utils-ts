import algosdk from 'algosdk'
import { AlgorandClientTransactionCreator } from '../types/algorand-client-transaction-creator'
import { AlgorandClientTransactionSender } from '../types/algorand-client-transaction-sender'
import { ABIAppCallArgs, BoxIdentifier as LegacyBoxIdentifier, BoxReference as LegacyBoxReference, RawAppCallArgs } from '../types/app'
import { AppManager, BoxReference } from '../types/app-manager'
import { AssetManager } from '../types/asset-manager'
import {
  TransactionComposer,
  AppCallMethodCall,
  AppCallParams,
  AppCreateMethodCall,
  AppCreateParams,
  AppDeleteMethodCall,
  AppDeleteParams,
  AppUpdateMethodCall,
  AppUpdateParams,
  BuiltTransactions,
  CommonTransactionParams,
} from '../types/composer'
import {
  SendParams,
  SendSingleTransactionResult,
  SendTransactionFrom,
  SendTransactionParams,
  SendTransactionResult,
  TransactionNote,
} from '../types/transaction'
import { encodeLease, encodeTransactionNote, getSenderAddress, getSenderTransactionSigner } from './transaction'
import Algodv2 = algosdk.Algodv2
import Transaction = algosdk.Transaction
import ABIMethod = algosdk.ABIMethod

/** @deprecated Bridges between legacy `sendTransaction` behaviour and new `AlgorandClient` behaviour. */
export async function legacySendTransactionBridge<T extends CommonTransactionParams, TResult extends SendSingleTransactionResult>(
  algod: Algodv2,
  from: SendTransactionFrom,
  sendParams: SendTransactionParams,
  params: T,
  txn:
    | ((c: AlgorandClientTransactionCreator) => (params: T) => Promise<Transaction>)
    | ((c: AlgorandClientTransactionCreator) => (params: T) => Promise<BuiltTransactions>),
  send: (c: AlgorandClientTransactionSender) => (params: T & SendParams) => Promise<TResult>,
  suggestedParams?: algosdk.SuggestedParams,
): Promise<(SendTransactionResult | TResult) & { transactions: Transaction[] }> {
  const appManager = new AppManager(algod)
  const newGroup = () =>
    new TransactionComposer({
      algod,
      getSigner: () => getSenderTransactionSigner(from),
      getSuggestedParams: async () => (suggestedParams ? { ...suggestedParams } : await algod.getTransactionParams().do()),
      appManager,
    })
  const transactionSender = new AlgorandClientTransactionSender(newGroup, new AssetManager(algod, newGroup), appManager)
  const transactionCreator = new AlgorandClientTransactionCreator(newGroup)

  if (sendParams.fee) {
    params.staticFee = sendParams.fee
  }

  if (sendParams.maxFee) {
    params.maxFee = sendParams.maxFee
  }

  if (sendParams.atc || sendParams.skipSending) {
    const transaction = await txn(transactionCreator)(params)
    const txns = 'transactions' in transaction ? transaction.transactions : [transaction]
    if (sendParams.atc) {
      const baseIndex = sendParams.atc.count()
      txns
        .map((txn, i) => ({
          txn,
          signer:
            'signers' in transaction ? (transaction.signers.get(i) ?? getSenderTransactionSigner(from)) : getSenderTransactionSigner(from),
        }))
        .forEach((t) => sendParams.atc!.addTransaction(t))
      // Populate ATC with method calls
      if ('transactions' in transaction) {
        transaction.methodCalls.forEach((m, i) => sendParams.atc!['methodCalls'].set(i + baseIndex, m))
      }
    }
    return { transaction: txns.at(-1)!, transactions: txns }
  }

  return { ...(await send(transactionSender)({ ...sendParams, ...params })) }
}

/** @deprecated Bridges between legacy `sendTransaction` behaviour for app transactions and new `AlgorandClient` behaviour. */
export async function legacySendAppTransactionBridge<
  T extends
    | AppCreateParams
    | AppUpdateParams
    | AppDeleteParams
    | AppCallParams
    | AppCreateMethodCall
    | AppUpdateMethodCall
    | AppDeleteMethodCall
    | AppCallMethodCall,
  TResult extends SendSingleTransactionResult,
>(
  algod: Algodv2,
  from: SendTransactionFrom,
  appArgs: RawAppCallArgs | ABIAppCallArgs | undefined,
  sendParams: SendTransactionParams & { note?: TransactionNote },
  params: Omit<T, 'accountReferences' | 'appReferences' | 'assetReferences' | 'boxReferences' | 'args' | 'lease' | 'rekeyTo' | 'note'>,
  txn:
    | ((c: AlgorandClientTransactionCreator) => (params: T) => Promise<Transaction>)
    | ((c: AlgorandClientTransactionCreator) => (params: T) => Promise<BuiltTransactions>),
  send: (c: AlgorandClientTransactionSender) => (params: T & SendParams) => Promise<TResult>,
  suggestedParams?: algosdk.SuggestedParams,
): Promise<(SendTransactionResult | TResult) & { transactions: Transaction[] }> {
  const encoder = new TextEncoder()

  const paramsWithAppArgs = {
    ...params,
    accountReferences: appArgs?.accounts?.map((a) => (typeof a === 'string' ? a : algosdk.encodeAddress(a.publicKey))),
    appReferences: appArgs?.apps?.map((a) => BigInt(a)),
    assetReferences: appArgs?.assets?.map((a) => BigInt(a)),
    boxReferences: appArgs?.boxes?.map(_getBoxReference)?.map((r) => ({ appId: BigInt(r.appIndex), name: r.name }) satisfies BoxReference),
    lease: appArgs?.lease,
    rekeyTo: appArgs?.rekeyTo ? getSenderAddress(appArgs?.rekeyTo) : undefined,
    args: appArgs
      ? 'methodArgs' in appArgs
        ? (await _getAppArgsForABICall(appArgs, from)).methodArgs
        : appArgs?.appArgs?.map((a) => (typeof a === 'string' ? encoder.encode(a) : a))
      : undefined,
    note: encodeTransactionNote(sendParams?.note),
  } as T

  return await legacySendTransactionBridge(algod, from, sendParams, paramsWithAppArgs, txn, send, suggestedParams)
}

/**
 * @deprecated
 */
export async function _getAppArgsForABICall(args: ABIAppCallArgs, from: SendTransactionFrom) {
  const signer = getSenderTransactionSigner(from)
  const methodArgs = await Promise.all(
    ('methodArgs' in args ? args.methodArgs : args)?.map(async (a, index) => {
      if (a === undefined) {
        throw new Error(`Argument at position ${index} does not have a value`)
      }
      if (typeof a !== 'object') {
        return a
      }
      // Handle the various forms of transactions to wrangle them for ATC
      return 'txn' in a
        ? a
        : a instanceof Promise
          ? { txn: (await a).transaction, signer }
          : 'transaction' in a
            ? { txn: a.transaction, signer: 'signer' in a ? getSenderTransactionSigner(a.signer) : signer }
            : 'txID' in a
              ? { txn: a, signer }
              : a
    }),
  )
  return {
    method: 'txnCount' in args.method ? args.method : new ABIMethod(args.method),
    sender: getSenderAddress(from),
    signer: signer,
    boxes: args.boxes?.map(_getBoxReference),
    lease: encodeLease(args.lease),
    appForeignApps: args.apps,
    appForeignAssets: args.assets,
    appAccounts: args.accounts?.map(_getAccountAddress),
    methodArgs: methodArgs,
    rekeyTo: args?.rekeyTo ? (typeof args.rekeyTo === 'string' ? args.rekeyTo : getSenderAddress(args.rekeyTo)) : undefined,
  }
}

function _getAccountAddress(account: string | algosdk.Address) {
  return typeof account === 'string' ? account : algosdk.encodeAddress(account.publicKey)
}

/** @deprecated */
export function _getBoxReference(box: LegacyBoxIdentifier | LegacyBoxReference | algosdk.BoxReference): algosdk.BoxReference {
  const encoder = new TextEncoder()

  if (typeof box === 'object' && 'appIndex' in box) {
    return box
  }

  const ref = typeof box === 'object' && 'appId' in box ? box : { appId: 0, name: box }
  return {
    appIndex: ref.appId,
    name:
      typeof ref.name === 'string'
        ? encoder.encode(ref.name)
        : 'length' in ref.name
          ? ref.name
          : algosdk.decodeAddress(getSenderAddress(ref.name)).publicKey,
  } as algosdk.BoxReference
}
