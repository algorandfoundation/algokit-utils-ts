import { Transaction } from '@algorandfoundation/algokit-transact'
import { TransactionWithSigner } from '@algorandfoundation/sdk'
import { AppCreateParams, AppMethodCall, AppMethodCallParams, AppUpdateParams, ComposerTransaction } from './composer'

type AppMethodCallArgs = AppMethodCall<unknown>['args']
type AppMethodCallArg = NonNullable<AppMethodCallArgs>[number]

export async function extractComposerTransactionsFromAppMethodCallParams(
  methodCallArgs: AppMethodCallArgs,
): Promise<
  TransactionWithSigner | Transaction | AppMethodCall<AppCreateParams> | AppMethodCall<AppUpdateParams> | AppMethodCall<AppMethodCallParams>
> {
  const composerTransactions = new Array<ComposerTransaction>()
  if (!methodCallArgs) return []

  for (const arg of methodCallArgs) {
    if (arg === undefined) {
      // is a transaction or default value placeholder, do nothing
    } else if (isTransactionArg(arg)) {
      composerTransactions.push({ type: 'txn', data: arg })
    } else if (isTransactionWithSignerArg(arg)) {
      composerTransactions.push({ type: 'txnWithSigner', data: arg })
    } else if (isAppCallMethodCallArg(arg)) {
      const nestedComposerTransactions = await extractComposerTransactionsFromAppMethodCallParams(arg.args)
      composerTransactions.push(...nestedComposerTransactions)
      composerTransactions.push(asProcessedAppCallMethodCallParams(arg))
    }
  }

  return []
}

function isTransactionArg(arg: AppMethodCallArg): arg is Transaction {
  return typeof arg === 'object' && arg !== undefined && 'type' in arg && 'sender' in arg
}

function isTransactionWithSignerArg(arg: AppMethodCallArg): arg is TransactionWithSigner {
  return typeof arg === 'object' && arg !== undefined && 'transaction' in arg && 'signer' in arg
}

function isAppCallMethodCallArg(
  arg: AppMethodCallArg,
): arg is AppMethodCall<AppCreateParams> | AppMethodCall<AppUpdateParams> | AppMethodCall<AppMethodCallParams> {
  return typeof arg === 'object' && arg !== undefined && 'method' in arg
}
