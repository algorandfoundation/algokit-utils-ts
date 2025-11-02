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
  AppDeleteParams,
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
  OfflineKeyRegistrationParams,
  OnlineKeyRegistrationParams,
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

export const buildTransactionHeader = (
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

export const buildPayment = (params: PaymentParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    type: TransactionType.pay,
    payment: {
      receiver: params.receiver.toString(),
      amount: params.amount.microAlgos,
    },
  }
}

export const buildAssetCreate = (params: AssetCreateParams, header: TransactionHeader): Transaction => {
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

export const buildAssetConfig = (params: AssetConfigParams, header: TransactionHeader): Transaction => {
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

export const buildAssetFreeze = (params: AssetFreezeParams, header: TransactionHeader): Transaction => {
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

export const buildAssetDestroy = (params: AssetDestroyParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    type: TransactionType.acfg,
    assetConfig: {
      assetId: params.assetId,
    },
  }
}

export const buildAssetTransfer = (params: AssetTransferParams, header: TransactionHeader): Transaction => {
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

export const buildAssetOptIn = (params: AssetOptInParams, header: TransactionHeader): Transaction => {
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

export const buildAssetOptOut = (params: AssetOptOutParams, header: TransactionHeader): Transaction => {
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

export const buildAppCreate = async (params: AppCreateParams, appManager: AppManager, header: TransactionHeader): Promise<Transaction> => {
  // TODO: PD - find out about rejectVersion

  const approvalProgram =
    typeof params.approvalProgram === 'string'
      ? (await appManager.compileTeal(params.approvalProgram)).compiledBase64ToBytes
      : params.approvalProgram
  const clearStateProgram =
    typeof params.clearStateProgram === 'string'
      ? (await appManager.compileTeal(params.clearStateProgram)).compiledBase64ToBytes
      : params.clearStateProgram

  // If accessReferences is provided, we should not pass legacy foreign arrays
  const hasAccessReferences = params.accessReferences && params.accessReferences.length > 0

  return {
    ...header,
    type: TransactionType.appl,
    applicationCall: {
      appId: 0n, // App creation always uses ID 0
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
      approvalProgram: approvalProgram,
      clearStateProgram: clearStateProgram,
      globalStateSchema:
        params.schema?.globalByteSlices !== undefined || params.schema?.globalInts !== undefined
          ? {
              numByteSlices: params.schema?.globalByteSlices ?? 0,
              numUints: params.schema?.globalInts ?? 0,
            }
          : undefined,
      localStateSchema:
        params.schema?.localByteSlices !== undefined || params.schema?.localInts !== undefined
          ? {
              numByteSlices: params.schema?.localByteSlices ?? 0,
              numUints: params.schema?.localInts ?? 0,
            }
          : undefined,
      extraProgramPages:
        params.extraProgramPages !== undefined
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
}

export const buildAppUpdate = async (params: AppUpdateParams, appManager: AppManager, header: TransactionHeader): Promise<Transaction> => {
  // TODO: PD - find out about rejectVersion

  const approvalProgram =
    typeof params.approvalProgram === 'string'
      ? (await appManager.compileTeal(params.approvalProgram)).compiledBase64ToBytes
      : params.approvalProgram
  const clearStateProgram =
    typeof params.clearStateProgram === 'string'
      ? (await appManager.compileTeal(params.clearStateProgram)).compiledBase64ToBytes
      : params.clearStateProgram

  // If accessReferences is provided, we should not pass legacy foreign arrays
  const hasAccessReferences = params.accessReferences && params.accessReferences.length > 0

  return {
    ...header,
    type: TransactionType.appl,
    applicationCall: {
      appId: params.appId,
      onComplete: OnApplicationComplete.UpdateApplication,
      approvalProgram: approvalProgram,
      clearStateProgram: clearStateProgram,
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
}

export const buildAppCall = (params: AppCallParams | AppDeleteParams, header: TransactionHeader): Transaction => {
  // TODO: PD - find out about rejectVersion

  // If accessReferences is provided, we should not pass legacy foreign arrays
  const hasAccessReferences = params.accessReferences && params.accessReferences.length > 0

  return {
    ...header,
    type: TransactionType.appl,
    applicationCall: {
      appId: params.appId,
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
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
}

export const buildKeyReg = (params: OnlineKeyRegistrationParams | OfflineKeyRegistrationParams, header: TransactionHeader): Transaction => {
  if ('voteKey' in params) {
    return {
      ...header,
      type: TransactionType.keyreg,
      keyRegistration: {
        voteKey: params.voteKey,
        selectionKey: params.selectionKey,
        voteFirst: params.voteFirst,
        voteLast: params.voteLast,
        voteKeyDilution: params.voteKeyDilution,
        nonParticipation: false,
        stateProofKey: params.stateProofKey,
      },
    }
  } else {
    return {
      ...header,
      type: TransactionType.keyreg,
      keyRegistration: {
        nonParticipation: params.preventAccountFromEverParticipatingAgain,
      },
    }
  }
}
