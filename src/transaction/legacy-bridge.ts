import { ABIValue, abiTypeIsTransaction } from '@algorandfoundation/algokit-abi'
import { AlgodClient, SuggestedParams } from '@algorandfoundation/algokit-algod-client'
import { BoxReference as TransactBoxReference, Transaction } from '@algorandfoundation/algokit-transact'
import * as algosdk from '@algorandfoundation/sdk'
import { AlgorandClientTransactionCreator } from '../types/algorand-client-transaction-creator'
import { AlgorandClientTransactionSender } from '../types/algorand-client-transaction-sender'
import { ABIAppCallArgs, BoxIdentifier as LegacyBoxIdentifier, BoxReference as LegacyBoxReference, RawAppCallArgs } from '../types/app'
import { AppManager, BoxReference } from '../types/app-manager'
import { AssetManager } from '../types/asset-manager'
import {
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
  TransactionComposer,
} from '../types/composer'
import {
  SendParams,
  SendSingleTransactionResult,
  SendTransactionFrom,
  SendTransactionParams,
  SendTransactionResult,
  TransactionNote,
  TransactionToSign,
  TransactionWrapper,
} from '../types/transaction'
import { TransactionWithSigner, encodeLease, encodeTransactionNote, getSenderAddress, getSenderTransactionSigner } from './transaction'

/** @deprecated Bridges between legacy `sendTransaction` behaviour and new `AlgorandClient` behaviour. */
export async function legacySendTransactionBridge<T extends CommonTransactionParams, TResult extends SendSingleTransactionResult>(
  algod: AlgodClient,
  from: SendTransactionFrom,
  sendParams: SendTransactionParams,
  params: T,
  txn:
    | ((c: AlgorandClientTransactionCreator) => (params: T) => Promise<Transaction>)
    | ((c: AlgorandClientTransactionCreator) => (params: T) => Promise<BuiltTransactions>),
  send: (c: AlgorandClientTransactionSender) => (params: T & SendParams) => Promise<TResult>,
  suggestedParams?: SuggestedParams,
): Promise<(SendTransactionResult | TResult) & { transactions: TransactionWrapper[] }> {
  const appManager = new AppManager(algod)
  const newGroup = () =>
    new TransactionComposer({
      algod,
      getSigner: () => getSenderTransactionSigner(from),
      getSuggestedParams: async () => (suggestedParams ? { ...suggestedParams } : await algod.suggestedParams()),
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

  if (sendParams.transactionComposer || sendParams.skipSending) {
    const transaction = await txn(transactionCreator)(params)
    const txns = 'transactions' in transaction ? transaction.transactions : [transaction]
    if (sendParams.transactionComposer) {
      const baseIndex = sendParams.transactionComposer.count()
      txns
        .map((txn, i) => ({
          txn,
          signer:
            'signers' in transaction ? (transaction.signers.get(i) ?? getSenderTransactionSigner(from)) : getSenderTransactionSigner(from),
        }))
        .forEach((t) => sendParams.transactionComposer!.addTransaction(t.txn, t.signer))
      // Populate the composer with method calls
      if ('transactions' in transaction) {
        transaction.methodCalls.forEach((m, i) => sendParams.transactionComposer!['methodCalls'].set(i + baseIndex, m))
      }
    }
    return { transaction: new TransactionWrapper(txns.at(-1)!), transactions: txns.map((t) => new TransactionWrapper(t)) }
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
  algod: AlgodClient,
  from: SendTransactionFrom,
  appArgs: RawAppCallArgs | ABIAppCallArgs | undefined,
  sendParams: SendTransactionParams & { note?: TransactionNote },
  params: Omit<T, 'accountReferences' | 'appReferences' | 'assetReferences' | 'boxReferences' | 'args' | 'lease' | 'rekeyTo' | 'note'>,
  txn:
    | ((c: AlgorandClientTransactionCreator) => (params: T) => Promise<Transaction>)
    | ((c: AlgorandClientTransactionCreator) => (params: T) => Promise<BuiltTransactions>),
  send: (c: AlgorandClientTransactionSender) => (params: T & SendParams) => Promise<TResult>,
  suggestedParams?: SuggestedParams,
): Promise<(SendTransactionResult | TResult) & { transactions: TransactionWrapper[] }> {
  const encoder = new TextEncoder()

  const paramsWithAppArgs = {
    ...params,
    accountReferences: appArgs?.accounts?.map((a) => (typeof a === 'string' ? a : algosdk.encodeAddress(a.publicKey))),
    appReferences: appArgs?.apps?.map((a) => BigInt(a)),
    assetReferences: appArgs?.assets?.map((a) => BigInt(a)),
    boxReferences: appArgs?.boxes?.map(_getBoxReference)?.map((r) => ({ appId: BigInt(r.appId), name: r.name }) satisfies BoxReference),
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
    args.methodArgs.map(async (a, index) => {
      if (a === undefined) {
        throw new Error(`Argument at position ${index} does not have a value`)
      }
      if (typeof a !== 'object') {
        return a
      }

      // Handle transaction args separately to avoid conflicts with ABIStructValue
      const abiArgumentType = args.method.args.at(index)!.argType
      if (abiTypeIsTransaction(abiArgumentType)) {
        const t = a as TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult> | SendTransactionResult
        return 'txn' in t
          ? t
          : t instanceof Promise
            ? { txn: (await t).transaction, signer }
            : 'transaction' in t
              ? { txn: t.transaction, signer: 'signer' in t ? getSenderTransactionSigner(t.signer) : signer }
              : { txn: t, signer }
      }

      return a as ABIValue
    }),
  )
  return {
    method: args.method,
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
export function _getBoxReference(box: LegacyBoxIdentifier | LegacyBoxReference | TransactBoxReference): TransactBoxReference {
  const encoder = new TextEncoder()

  const toBytes = (boxIdentifier: string | Uint8Array | SendTransactionFrom): Uint8Array => {
    return typeof boxIdentifier === 'string'
      ? encoder.encode(boxIdentifier)
      : 'length' in boxIdentifier
        ? boxIdentifier
        : algosdk.decodeAddress(getSenderAddress(boxIdentifier)).publicKey
  }

  if (typeof box === 'object' && 'appId' in box) {
    return {
      appId: BigInt(box.appId),
      name: toBytes(box.name),
    }
  }

  return { appId: 0n, name: toBytes(box) }
}
