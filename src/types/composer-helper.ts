import { ABIValue, Address, TransactionSigner, TransactionWithSigner } from '@algorandfoundation/sdk'
import {
  AppCallMethodCall,
  AppCreateMethodCall,
  AppCreateParams,
  AppMethodCall,
  AppMethodCallParams,
  AppUpdateMethodCall,
  AppUpdateParams,
} from './composer'

type AppMethodCallArgs = AppMethodCall<unknown>['args']
type AppMethodCallArg = NonNullable<AppMethodCallArgs>[number]

type ExtractedMethodCallTransactionArg =
  | (TransactionWithSigner & { type: 'txnWithSigner' })
  | ((AppCallMethodCall | AppCreateMethodCall | AppUpdateMethodCall) & { type: 'methodCall' })

export async function extractComposerTransactionsFromAppMethodCallParams(
  methodCallArgs: AppMethodCallArgs,
  getSigner: (address: string | Address) => TransactionSigner,
): Promise<ExtractedMethodCallTransactionArg[]> {
  const composerTransactions = new Array<ExtractedMethodCallTransactionArg>()
  if (!methodCallArgs) return []

  for (let i = 0; i < methodCallArgs.length; i++) {
    const arg = methodCallArgs[i]

    if (arg === undefined) {
      // is a transaction or default value placeholder, do nothing
      continue
    }
    if (isAbiValue(arg)) {
      // if is ABI value, also ignore
      continue
    }

    if (isTransactionWithSignerArg(arg)) {
      composerTransactions.push({
        txn: arg.txn,
        signer: arg.signer,
        type: 'txnWithSigner',
      })

      // TODO: PD - review this way of marking args as undefined
      // Is it possible to replace them with an indicator that the arg was converted into a txn in the group
      methodCallArgs[i] = undefined
      continue
    }
    if (isAppCallMethodCallArg(arg)) {
      const nestedComposerTransactions = await extractComposerTransactionsFromAppMethodCallParams(arg.args, getSigner)
      composerTransactions.push(...nestedComposerTransactions)
      composerTransactions.push({
        ...arg,
        type: 'methodCall',
      })

      methodCallArgs[i] = undefined
      continue
    }

    const txn = await arg
    composerTransactions.push({
      txn: txn,
      signer: getSigner(txn.sender),
      type: 'txnWithSigner',
    })
    methodCallArgs[i] = undefined
  }

  return composerTransactions
}

function isTransactionWithSignerArg(arg: AppMethodCallArg): arg is TransactionWithSigner {
  return typeof arg === 'object' && arg !== undefined && 'transaction' in arg && 'signer' in arg
}

function isAppCallMethodCallArg(
  arg: AppMethodCallArg,
): arg is AppMethodCall<AppCreateParams> | AppMethodCall<AppUpdateParams> | AppMethodCall<AppMethodCallParams> {
  return typeof arg === 'object' && arg !== undefined && 'method' in arg
}

const isAbiValue = (x: unknown): x is ABIValue => {
  if (Array.isArray(x)) return x.length == 0 || x.every(isAbiValue)

  return (
    typeof x === 'bigint' ||
    typeof x === 'boolean' ||
    typeof x === 'number' ||
    typeof x === 'string' ||
    x instanceof Uint8Array ||
    x instanceof Address
  )
}
