import { TransactionParams } from '@algorandfoundation/algokit-algod-client'
import { OnApplicationComplete, Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
import { ABIValue, Address, TransactionSigner, TransactionWithSigner } from '@algorandfoundation/sdk'
import { encodeLease } from 'src/transaction'
import { calculateExtraProgramPages } from 'src/util'
import { AppManager, getAccessReference } from './app-manager'
import {
  AppCallMethodCall,
  AppCallParams,
  AppCreateMethodCall,
  AppCreateParams,
  AppMethodCall,
  AppMethodCallParams,
  AppUpdateMethodCall,
  AppUpdateParams,
  AssetConfigParams,
  AssetCreateParams,
  AssetDestroyParams,
  AssetFreezeParams,
  AssetOptInParams,
  AssetOptOutParams,
  AssetTransferParams,
  CommonTransactionParams,
  PaymentParams,
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

const ensureString = (data?: string | Uint8Array) => {
  if (data === undefined) return undefined
  const encoder = new TextEncoder()
  return typeof data === 'string' ? encoder.encode(data) : data
}

const buildTransactionHeader = (
  commonParams: CommonTransactionParams,
  transactionParams: TransactionParams,
  defaultValidityWindow: number,
) => {
  const firstValid = commonParams.firstValidRound ?? transactionParams.lastRound
  const lease = commonParams.lease === undefined ? undefined : encodeLease(commonParams.lease)
  const note = ensureString(commonParams.note)

  return {
    sender: commonParams.sender.toString(),
    rekeyTo: commonParams.rekeyTo?.toString(),
    note: note,
    lease: lease,
    fee: commonParams.staticFee?.microAlgos,
    genesisId: transactionParams.genesisId,
    genesisHash: transactionParams.genesisHash,
    firstValid,
    lastValid:
      commonParams.lastValidRound ??
      (commonParams.validityWindow !== undefined
        ? firstValid + BigInt(commonParams.validityWindow)
        : firstValid + BigInt(defaultValidityWindow)),
    group: undefined,
  } satisfies TransactionHeader
}

export type TransactionHeader = {
  sender: string
  fee?: bigint
  firstValid: bigint
  lastValid: bigint
  genesisHash?: Uint8Array
  genesisId?: string
  note?: Uint8Array
  rekeyTo?: string
  lease?: Uint8Array
  group?: Uint8Array
}

export const buildPayment = (params: PaymentParams, transactionParams: TransactionParams, defaultValidityWindow: number): Transaction => {
  const header = buildTransactionHeader(params, transactionParams, defaultValidityWindow)

  return {
    ...header,
    type: TransactionType.pay,
    payment: {
      receiver: params.receiver.toString(),
      amount: params.amount.microAlgos,
    },
  }
}

export const buildAssetCreate = (
  params: AssetCreateParams,
  transactionParams: TransactionParams,
  defaultValidityWindow: number,
): Transaction => {
  const header = buildTransactionHeader(params, transactionParams, defaultValidityWindow)

  return {
    ...header,
    type: TransactionType.acfg,
    assetConfig: {
      assetId: 0n, // Asset creation always uses ID 0
      total: params.total,
      decimals: params.decimals,
      defaultFrozen: params.defaultFrozen,
      assetName: params.assetName,
      unitName: params.unitName,
      url: params.url,
      metadataHash: ensureString(params.metadataHash),
      manager: params.manager?.toString(),
      reserve: params.reserve?.toString(),
      freeze: params.freeze?.toString(),
      clawback: params.clawback?.toString(),
    },
  }
}

export const buildAssetConfig = (
  params: AssetConfigParams,
  transactionParams: TransactionParams,
  defaultValidityWindow: number,
): Transaction => {
  const header = buildTransactionHeader(params, transactionParams, defaultValidityWindow)

  return {
    ...header,
    type: TransactionType.acfg,
    assetConfig: {
      assetId: params.assetId,
      manager: params.manager?.toString(),
      reserve: params.reserve?.toString(),
      freeze: params.freeze?.toString(),
      clawback: params.clawback?.toString(),
    },
  }
}

export const buildAssetFreeze = (
  params: AssetFreezeParams,
  transactionParams: TransactionParams,
  defaultValidityWindow: number,
): Transaction => {
  const header = buildTransactionHeader(params, transactionParams, defaultValidityWindow)

  return {
    ...header,
    type: TransactionType.afrz,
    assetFreeze: {
      assetId: params.assetId,
      freezeTarget: params.account.toString(),
      frozen: params.frozen,
    },
  }
}

export const buildAssetDestroy = (
  params: AssetDestroyParams,
  transactionParams: TransactionParams,
  defaultValidityWindow: number,
): Transaction => {
  const header = buildTransactionHeader(params, transactionParams, defaultValidityWindow)

  return {
    ...header,
    type: TransactionType.acfg,
    assetConfig: {
      assetId: params.assetId,
    },
  }
}

export const buildAssetTransfer = (
  params: AssetTransferParams,
  transactionParams: TransactionParams,
  defaultValidityWindow: number,
): Transaction => {
  const header = buildTransactionHeader(params, transactionParams, defaultValidityWindow)

  return {
    ...header,
    type: TransactionType.axfer,
    assetTransfer: {
      assetId: params.assetId,
      amount: params.amount,
      receiver: params.receiver.toString(),
      assetSender: params.clawbackTarget?.toString(),
      closeRemainderTo: params.closeAssetTo?.toString(),
    },
  }
}

export const buildAssetOptIn = (
  params: AssetOptInParams,
  transactionParams: TransactionParams,
  defaultValidityWindow: number,
): Transaction => {
  const header = buildTransactionHeader(params, transactionParams, defaultValidityWindow)

  return {
    ...header,
    type: TransactionType.axfer,
    assetTransfer: {
      assetId: params.assetId,
      amount: 0n,
      receiver: header.sender,
    },
  }
}

export const buildAssetOptOut = (
  params: AssetOptOutParams,
  transactionParams: TransactionParams,
  defaultValidityWindow: number,
): Transaction => {
  const header = buildTransactionHeader(params, transactionParams, defaultValidityWindow)

  return {
    ...header,
    type: TransactionType.axfer,
    assetTransfer: {
      assetId: params.assetId,
      amount: 0n,
      receiver: header.sender,
      closeRemainderTo: params.creator?.toString(),
    },
  }
}

export const buildAppCall = async (
  params: AppCallParams | AppUpdateParams | AppCreateParams,
  appManager: AppManager,
  transactionParams: TransactionParams,
  defaultValidityWindow: number,
): Promise<Transaction> => {
  // TODO: PD - find out about rejectVersion

  const header = buildTransactionHeader(params, transactionParams, defaultValidityWindow)

  const appId = 'appId' in params ? params.appId : 0n
  const approvalProgram =
    'approvalProgram' in params
      ? typeof params.approvalProgram === 'string'
        ? (await appManager.compileTeal(params.approvalProgram)).compiledBase64ToBytes
        : params.approvalProgram
      : undefined
  const clearStateProgram =
    'clearStateProgram' in params
      ? typeof params.clearStateProgram === 'string'
        ? (await appManager.compileTeal(params.clearStateProgram)).compiledBase64ToBytes
        : params.clearStateProgram
      : undefined

  // If accessReferences is provided, we should not pass legacy foreign arrays
  const hasAccessReferences = params.accessReferences && params.accessReferences.length > 0

  if (appId === 0n) {
    if (!approvalProgram || !clearStateProgram) {
      throw Error('approvalProgram and clearProgram must be provided')
    }
  }

  return {
    ...header,
    type: TransactionType.appl,
    applicationCall: {
      appId: 0n, // App creation always uses ID 0
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
      approvalProgram: approvalProgram,
      clearStateProgram: clearStateProgram,
      globalStateSchema: params.globalStateSchema,
      localStateSchema: params.localStateSchema,
      extraProgramPages:
        'extraProgramPages' in params && params.extraProgramPages !== undefined
          ? params.extraProgramPages
          : calculateExtraProgramPages(approvalProgram!, clearStateProgram!),
      args: params.args,
      ...(hasAccessReferences
        ? { access: params.accessReferences?.map(getAccessReference) }
        : {
            accounts: params.accountReferences?.map((a) => a.toString()),
            foreignApps: params.appReferences,
            foreignAssets: params.assetReferences,
            boxes: params.boxReferences?.map(AppManager.getBoxReference),
          }),
    },
  }

  // TODO: PD - review both makeApplicationCallTxnFromObject and makeApplicationCreateTxnFromObject
  // to make sure we capture all the logic
  return {
    ...header,
    type: TransactionType.appl,
  }
}
