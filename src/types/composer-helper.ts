import { TransactionParams } from '@algorandfoundation/algokit-algod-client'
import { OnApplicationComplete, Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
import {
  ABIMethod,
  ABIReferenceType,
  ABITupleType,
  ABIType,
  ABIUintType,
  ABIValue,
  Address,
  TransactionSigner,
  TransactionWithSigner,
  abiTypeIsReference,
  abiTypeIsTransaction,
} from '@algorandfoundation/sdk'
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

const ARGS_TUPLE_PACKING_THRESHOLD = 14 // 14+ args trigger tuple packing, excluding the method selector

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

/**
 * Populate reference arrays from processed ABI method call arguments
 */
function populateMethodArgsIntoReferenceArrays(
  sender: string,
  appId: bigint,
  method: ABIMethod,
  methodArgs: AppMethodCallArg[],
  accountReferences?: string[],
  appReferences?: bigint[],
  assetReferences?: bigint[],
): { accountReferences: string[]; appReferences: bigint[]; assetReferences: bigint[] } {
  const accounts = accountReferences ?? []
  const assets = assetReferences ?? []
  const apps = appReferences ?? []

  methodArgs.forEach((arg, i) => {
    const argType = method.args[i].type
    if (abiTypeIsReference(argType)) {
      switch (argType) {
        case 'account':
          if (typeof arg === 'string' && arg !== sender && !accounts.includes(arg)) {
            accounts.push(arg)
          }
          break
        case 'asset':
          if (typeof arg === 'bigint' && !assets.includes(arg)) {
            assets.push(arg)
          }
          break
        case 'application':
          if (typeof arg === 'bigint' && arg !== appId && !apps.includes(arg)) {
            apps.push(arg)
          }
          break
      }
    }
  })

  return { accountReferences: accounts, appReferences: apps, assetReferences: assets }
}

/**
 * Calculate array index for ABI reference values
 */
function calculateMethodArgReferenceArrayIndex(
  refValue: string | bigint,
  referenceType: ABIReferenceType,
  sender: string,
  appId: bigint,
  accountReferences: string[],
  appReferences: bigint[],
  assetReferences: bigint[],
): number {
  switch (referenceType) {
    case 'account':
      if (typeof refValue === 'string') {
        // If address is the same as sender, use index 0
        if (refValue === sender) return 0
        const index = accountReferences.indexOf(refValue)
        if (index === -1) throw new Error(`Account ${refValue} not found in reference array`)
        return index + 1
      }
      throw new Error('Account reference must be a string')
    case 'asset':
      if (typeof refValue === 'bigint') {
        const index = assetReferences.indexOf(refValue)
        if (index === -1) throw new Error(`Asset ${refValue} not found in reference array`)
        return index
      }
      throw new Error('Asset reference must be a bigint')
    case 'application':
      if (typeof refValue === 'bigint') {
        // If app ID is the same as the current app, use index 0
        if (refValue === appId) return 0
        const index = appReferences.indexOf(refValue)
        if (index === -1) throw new Error(`Application ${refValue} not found in reference array`)
        return index + 1
      }
      throw new Error('Application reference must be a bigint')
    default:
      throw new Error(`Unknown reference type: ${referenceType}`)
  }
}

/**
 * Encode ABI method arguments with tuple packing support
 * Ports the logic from the Rust encode_method_arguments function
 */
function encodeMethodArguments(
  method: ABIMethod,
  args: AppMethodCallArg[],
  sender: string,
  appId: bigint,
  accountReferences: string[],
  appReferences: bigint[],
  assetReferences: bigint[],
): Uint8Array[] {
  const encodedArgs = new Array<Uint8Array>()

  // Insert method selector at the front
  encodedArgs.push(method.getSelector())

  // Get ABI types for non-transaction arguments
  const abiTypes = new Array<ABIType>()
  const abiValues = new Array<ABIValue>()

  // Process each method argument
  for (let i = 0; i < method.args.length; i++) {
    const methodArg = method.args[i]
    const argValue = args[i]

    if (abiTypeIsTransaction(methodArg.type)) {
      // Transaction arguments are not ABI encoded - they're handled separately
    } else if (abiTypeIsReference(methodArg.type)) {
      // Reference types are encoded as uint8 indexes
      const referenceType = methodArg.type
      if (typeof argValue === 'string' || typeof argValue === 'bigint') {
        const foreignIndex = calculateMethodArgReferenceArrayIndex(
          argValue,
          referenceType,
          sender,
          appId,
          accountReferences,
          appReferences,
          assetReferences,
        )

        abiTypes.push(new ABIUintType(8))
        abiValues.push(foreignIndex)
      } else {
        throw new Error(`Invalid reference value for ${referenceType}: ${argValue}`)
      }
    } else if (argValue !== undefined) {
      // Regular ABI value
      abiTypes.push(methodArg.type)
      // it's safe to cast to ABIValue here because the abiType must be ABIValue
      abiValues.push(argValue as ABIValue)
    }

    // Skip undefined values (transaction placeholders)
  }

  if (abiValues.length !== abiTypes.length) {
    throw new Error('Mismatch in length of non-transaction arguments')
  }

  // Apply ARC-4 tuple packing for methods with more than 14 arguments
  // 14 instead of 15 in the ARC-4 because the first argument (method selector) is added separately
  if (abiTypes.length > ARGS_TUPLE_PACKING_THRESHOLD) {
    encodedArgs.push(...encodeArgsWithTuplePacking(abiTypes, abiValues))
  } else {
    encodedArgs.push(...encodeArgsIndividually(abiTypes, abiValues))
  }

  return encodedArgs
}

/**
 * Encode individual ABI values
 */
function encodeArgsIndividually(abiTypes: ABIType[], abiValues: ABIValue[]): Uint8Array[] {
  const encodedArgs: Uint8Array[] = []

  for (let i = 0; i < abiTypes.length; i++) {
    const abiType = abiTypes[i]
    const abiValue = abiValues[i]
    const encoded = abiType.encode(abiValue)
    encodedArgs.push(encoded)
  }

  return encodedArgs
}

/**
 * Encode ABI values with tuple packing for methods with many arguments
 */
function encodeArgsWithTuplePacking(abiTypes: ABIType[], abiValues: ABIValue[]): Uint8Array[] {
  const encodedArgs: Uint8Array[] = []

  // Encode first 14 arguments individually
  const first14AbiTypes = abiTypes.slice(0, ARGS_TUPLE_PACKING_THRESHOLD)
  const first14AbiValues = abiValues.slice(0, ARGS_TUPLE_PACKING_THRESHOLD)
  encodedArgs.push(...encodeArgsIndividually(first14AbiTypes, first14AbiValues))

  // Pack remaining arguments into tuple at position 15
  const remainingAbiTypes = abiTypes.slice(ARGS_TUPLE_PACKING_THRESHOLD)
  const remainingAbiValues = abiValues.slice(ARGS_TUPLE_PACKING_THRESHOLD)

  if (remainingAbiTypes.length > 0) {
    const tupleType = new ABITupleType(remainingAbiTypes)
    const tupleValue = remainingAbiValues
    const tupleEncoded = tupleType.encode(tupleValue)
    encodedArgs.push(tupleEncoded)
  }

  return encodedArgs
}

/**
 * Common method call building logic
 */
function buildMethodCallCommon(
  params: {
    appId: bigint
    method: ABIMethod
    args: AppMethodCallArg[]
    accountReferences?: string[]
    appReferences?: bigint[]
    assetReferences?: bigint[]
    // TODO: PD - access list references
  },
  header: TransactionHeader,
): { args: Uint8Array[]; accountReferences: string[]; appReferences: bigint[]; assetReferences: bigint[] } {
  const { accountReferences, appReferences, assetReferences } = populateMethodArgsIntoReferenceArrays(
    header.sender,
    params.appId,
    params.method,
    params.args,
    params.accountReferences,
    params.appReferences,
    params.assetReferences,
  )

  const encodedArgs = encodeMethodArguments(
    params.method,
    params.args,
    header.sender,
    params.appId,
    accountReferences,
    appReferences,
    assetReferences,
  )

  return {
    args: encodedArgs,
    accountReferences,
    appReferences,
    assetReferences,
  }
}

// TODO: PD - we should make a new type for AppCreateMethodCall to capture that the params don't have nested transactions anymore
export const buildAppCreateMethodCall = (params: AppCreateMethodCall, header: TransactionHeader): Transaction => {
  const common = buildMethodCallCommon(
    {
      appId: 0n,
      method: params.method,
      args: params.args,
      accountReferences: params.accountReferences,
      appReferences: params.appReferences,
      assetReferences: params.assetReferences,
      // TODO: PD - access list references
    },
    header,
  )

  return {
    ...header,
    transactionType: TransactionType.AppCall,
    appCall: {
      appId: 0n,
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
      approvalProgram: params.approvalProgram,
      clearStateProgram: params.clearStateProgram,
      globalStateSchema: params.globalStateSchema,
      localStateSchema: params.localStateSchema,
      extraProgramPages: params.extraProgramPages,
      args: common.args,
      accountReferences: common.accountReferences,
      appReferences: common.appReferences,
      assetReferences: common.assetReferences,
      boxReferences: params.boxReferences,
    },
  }
}
