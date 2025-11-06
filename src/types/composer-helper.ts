import {
  AlgodClient,
  ApiError,
  ApplicationLocalReference,
  AssetHoldingReference,
  PendingTransactionResponse,
  SimulateUnnamedResourcesAccessed,
  TransactionParams,
} from '@algorandfoundation/algokit-algod-client'
import { MAX_ACCOUNT_REFERENCES, MAX_OVERALL_REFERENCES, getAppAddress } from '@algorandfoundation/algokit-common'
import { BoxReference, OnApplicationComplete, Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
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
import { encodeLease } from '../transaction'
import { calculateExtraProgramPages } from '../util'
import { AppManager } from './app-manager'
import {
  AppCallMethodCall,
  AppCallParams,
  AppCreateMethodCall,
  AppCreateParams,
  AppDeleteMethodCall,
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
  AsyncTransactionWithSigner,
  CommonTransactionParams,
  OfflineKeyRegistrationParams,
  OnlineKeyRegistrationParams,
  PaymentParams,
  ProcessedAppCallMethodCall,
  ProcessedAppCreateMethodCall,
  ProcessedAppUpdateMethodCall,
} from './composer'
import { FeeDelta } from './fee-coverage'
import { genesisIdIsLocalNet } from './network-client'

type AppMethodCallArgs = AppMethodCall<unknown>['args']
type AppMethodCallArg = NonNullable<AppMethodCallArgs>[number]

// TODO: PD - match this with the type from composer
type ExtractedMethodCallTransactionArg =
  | { data: TransactionWithSigner; type: 'txnWithSigner' }
  | { data: AsyncTransactionWithSigner; type: 'asyncTxn' }
  | { data: ProcessedAppCallMethodCall | ProcessedAppCreateMethodCall | ProcessedAppUpdateMethodCall; type: 'methodCall' }

const ARGS_TUPLE_PACKING_THRESHOLD = 14 // 14+ args trigger tuple packing, excluding the method selector

export function extractComposerTransactionsFromAppMethodCallParams(
  params: AppCallMethodCall | AppCreateMethodCall | AppUpdateMethodCall | AppDeleteMethodCall,
  parentSigner?: TransactionSigner,
): ExtractedMethodCallTransactionArg[] {
  const composerTransactions = new Array<ExtractedMethodCallTransactionArg>()
  const methodCallArgs = params.args
  if (!methodCallArgs) return []

  // Extract signer from params, falling back to parentSigner
  const currentSigner = params.signer ? ('signer' in params.signer ? params.signer.signer : params.signer) : parentSigner

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
        data: {
          txn: arg.txn,
          signer: arg.signer,
        },
        type: 'txnWithSigner',
      })

      continue
    }
    if (isAppCallMethodCallArg(arg)) {
      // Recursively extract nested method call transactions, passing the nested call itself and current signer as parent
      const nestedComposerTransactions = extractComposerTransactionsFromAppMethodCallParams(arg, currentSigner)
      composerTransactions.push(...nestedComposerTransactions)
      composerTransactions.push({
        data: {
          ...arg,
          signer: arg.signer ?? currentSigner,
          args: processAppMethodCallArgs(arg.args),
        },
        type: 'methodCall',
      } satisfies ExtractedMethodCallTransactionArg)

      continue
    }
    if (arg instanceof Promise) {
      composerTransactions.push({
        data: {
          txn: arg,
          signer: currentSigner,
        },
        type: 'asyncTxn',
      })
      continue
    }

    composerTransactions.push({
      data: {
        txn: Promise.resolve(arg),
        signer: currentSigner,
      },
      type: 'asyncTxn',
    })
  }

  return composerTransactions
}

export function processAppMethodCallArgs(args: AppMethodCallArg[] | undefined): (ABIValue | undefined)[] | undefined {
  if (args === undefined) return undefined

  return args.map((arg) => {
    if (arg === undefined) {
      // Handle explicit placeholders (either transaction or default value)
      return undefined
    } else if (!isAbiValue(arg)) {
      // Handle Transactions by replacing with the transaction placeholder
      // If the arg is not an ABIValue, it's must be a transaction
      return undefined
    }
    return arg
  })
}

function isTransactionWithSignerArg(arg: AppMethodCallArg): arg is TransactionWithSigner {
  return typeof arg === 'object' && arg !== undefined && 'txn' in arg && 'signer' in arg
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
    type: TransactionType.Payment,
    payment: {
      receiver: params.receiver.toString(),
      amount: params.amount.microAlgos,
    },
  }
}

export const buildAssetCreate = (params: AssetCreateParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    type: TransactionType.AssetConfig,
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
    type: TransactionType.AssetConfig,
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
    type: TransactionType.AssetFreeze,
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
    type: TransactionType.AssetConfig,
    assetConfig: {
      assetId: params.assetId,
    },
  }
}

export const buildAssetTransfer = (params: AssetTransferParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    type: TransactionType.AssetTransfer,
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
    type: TransactionType.AssetTransfer,
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
    type: TransactionType.AssetTransfer,
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
  const globalStateSchema =
    params.schema?.globalByteSlices !== undefined || params.schema?.globalInts !== undefined
      ? {
          numByteSlices: params.schema?.globalByteSlices ?? 0,
          numUints: params.schema?.globalInts ?? 0,
        }
      : undefined
  const localStateSchema =
    params.schema?.localByteSlices !== undefined || params.schema?.localInts !== undefined
      ? {
          numByteSlices: params.schema?.localByteSlices ?? 0,
          numUints: params.schema?.localInts ?? 0,
        }
      : undefined
  const extraProgramPages =
    params.extraProgramPages !== undefined ? params.extraProgramPages : calculateExtraProgramPages(approvalProgram!, clearStateProgram!)

  // If accessReferences is provided, we should not pass legacy foreign arrays
  const hasAccessReferences = params.accessReferences && params.accessReferences.length > 0

  return {
    ...header,
    type: TransactionType.AppCall,
    appCall: {
      appId: 0n, // App creation always uses ID 0
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
      approvalProgram: approvalProgram,
      clearStateProgram: clearStateProgram,
      globalStateSchema: globalStateSchema,
      localStateSchema: localStateSchema,
      extraProgramPages: extraProgramPages,
      args: params.args,
      ...(hasAccessReferences
        ? { access: params.accessReferences }
        : {
            accountReferences: params.accountReferences?.map((a) => a.toString()),
            appReferences: params.appReferences,
            assetReferences: params.assetReferences,
            boxReferences: params.boxReferences?.map(AppManager.getBoxReference),
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
    type: TransactionType.AppCall,
    appCall: {
      appId: params.appId,
      onComplete: OnApplicationComplete.UpdateApplication,
      approvalProgram: approvalProgram,
      clearStateProgram: clearStateProgram,
      args: params.args,
      ...(hasAccessReferences
        ? { access: params.accessReferences }
        : {
            accountReferences: params.accountReferences?.map((a) => a.toString()),
            appReferences: params.appReferences,
            assetReferences: params.assetReferences,
            boxReferences: params.boxReferences?.map(AppManager.getBoxReference),
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
    type: TransactionType.AppCall,
    appCall: {
      appId: params.appId,
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
      args: params.args,
      ...(hasAccessReferences
        ? { access: params.accessReferences }
        : {
            accountReferences: params.accountReferences?.map((a) => a.toString()),
            appReferences: params.appReferences,
            assetReferences: params.assetReferences,
            boxReferences: params.boxReferences?.map(AppManager.getBoxReference),
          }),
    },
  }
}

export const buildKeyReg = (params: OnlineKeyRegistrationParams | OfflineKeyRegistrationParams, header: TransactionHeader): Transaction => {
  if ('voteKey' in params) {
    return {
      ...header,
      type: TransactionType.KeyRegistration,
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
      type: TransactionType.KeyRegistration,
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
  args: (ABIValue | undefined)[],
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
    args: (ABIValue | undefined)[]
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
    params.args ?? [],
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

export const buildAppCreateMethodCall = async (
  params: ProcessedAppCreateMethodCall,
  appManager: AppManager,
  header: TransactionHeader,
): Promise<Transaction> => {
  const approvalProgram =
    typeof params.approvalProgram === 'string'
      ? (await appManager.compileTeal(params.approvalProgram)).compiledBase64ToBytes
      : params.approvalProgram
  const clearStateProgram =
    typeof params.clearStateProgram === 'string'
      ? (await appManager.compileTeal(params.clearStateProgram)).compiledBase64ToBytes
      : params.clearStateProgram
  const globalStateSchema =
    params.schema?.globalByteSlices !== undefined || params.schema?.globalInts !== undefined
      ? {
          numByteSlices: params.schema?.globalByteSlices ?? 0,
          numUints: params.schema?.globalInts ?? 0,
        }
      : undefined
  const localStateSchema =
    params.schema?.localByteSlices !== undefined || params.schema?.localInts !== undefined
      ? {
          numByteSlices: params.schema?.localByteSlices ?? 0,
          numUints: params.schema?.localInts ?? 0,
        }
      : undefined
  const extraProgramPages =
    params.extraProgramPages !== undefined ? params.extraProgramPages : calculateExtraProgramPages(approvalProgram!, clearStateProgram!)
  const accountReferences = params.accountReferences?.map((a) => a.toString())
  const common = buildMethodCallCommon(
    {
      appId: 0n,
      method: params.method,
      args: params.args ?? [],
      accountReferences: accountReferences,
      appReferences: params.appReferences,
      assetReferences: params.assetReferences,
      // TODO: PD - access list references
    },
    header,
  )
  return {
    ...header,
    type: TransactionType.AppCall,
    appCall: {
      appId: 0n,
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
      approvalProgram: approvalProgram,
      clearStateProgram: clearStateProgram,
      globalStateSchema: globalStateSchema,
      localStateSchema: localStateSchema,
      extraProgramPages: extraProgramPages,
      args: common.args,
      accountReferences: common.accountReferences,
      appReferences: common.appReferences,
      assetReferences: common.assetReferences,
      boxReferences: params.boxReferences?.map(AppManager.getBoxReference),
    },
  }
}

export const buildAppUpdateMethodCall = async (
  params: ProcessedAppUpdateMethodCall,
  appManager: AppManager,
  header: TransactionHeader,
): Promise<Transaction> => {
  const approvalProgram =
    typeof params.approvalProgram === 'string'
      ? (await appManager.compileTeal(params.approvalProgram)).compiledBase64ToBytes
      : params.approvalProgram
  const clearStateProgram =
    typeof params.clearStateProgram === 'string'
      ? (await appManager.compileTeal(params.clearStateProgram)).compiledBase64ToBytes
      : params.clearStateProgram
  const accountReferences = params.accountReferences?.map((a) => a.toString())
  const common = buildMethodCallCommon(
    {
      appId: 0n,
      method: params.method,
      args: params.args ?? [],
      accountReferences: accountReferences,
      appReferences: params.appReferences,
      assetReferences: params.assetReferences,
      // TODO: PD - access list references
    },
    header,
  )
  return {
    ...header,
    type: TransactionType.AppCall,
    appCall: {
      appId: params.appId,
      onComplete: OnApplicationComplete.UpdateApplication,
      approvalProgram: approvalProgram,
      clearStateProgram: clearStateProgram,
      args: common.args,
      accountReferences: common.accountReferences,
      appReferences: common.appReferences,
      assetReferences: common.assetReferences,
      boxReferences: params.boxReferences?.map(AppManager.getBoxReference),
    },
  }
}

export const buildAppCallMethodCall = async (params: ProcessedAppCallMethodCall, header: TransactionHeader): Promise<Transaction> => {
  const accountReferences = params.accountReferences?.map((a) => a.toString())
  const common = buildMethodCallCommon(
    {
      appId: 0n,
      method: params.method,
      args: params.args ?? [],
      accountReferences: accountReferences,
      appReferences: params.appReferences,
      assetReferences: params.assetReferences,
      // TODO: PD - access list references
    },
    header,
  )
  return {
    ...header,
    type: TransactionType.AppCall,
    appCall: {
      appId: params.appId,
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
      args: common.args,
      accountReferences: common.accountReferences,
      appReferences: common.appReferences,
      assetReferences: common.assetReferences,
      boxReferences: params.boxReferences?.map(AppManager.getBoxReference),
    },
  }
}

/**
 * Populate transaction-level resources for app call transactions
 */
export function populateTransactionResources(
  transaction: Transaction, // NOTE: transaction is mutated in place
  resourcesAccessed: SimulateUnnamedResourcesAccessed,
  groupIndex: number,
): void {
  if (transaction.type !== TransactionType.AppCall || transaction.appCall === undefined) {
    return
  }

  // Check for unexpected resources at transaction level
  if (resourcesAccessed.boxes || resourcesAccessed.extraBoxRefs) {
    throw new Error('Unexpected boxes at the transaction level')
  }
  if (resourcesAccessed.appLocals) {
    throw new Error('Unexpected app locals at the transaction level')
  }
  if (resourcesAccessed.assetHoldings) {
    throw new Error('Unexpected asset holdings at the transaction level')
  }

  let accountsCount = 0
  let appsCount = 0
  let assetsCount = 0
  const boxesCount = transaction.appCall.boxReferences?.length ?? 0

  // Populate accounts
  if (resourcesAccessed.accounts) {
    transaction.appCall.accountReferences = transaction.appCall.accountReferences ?? []
    for (const account of resourcesAccessed.accounts) {
      if (!transaction.appCall.accountReferences.includes(account)) {
        transaction.appCall.accountReferences.push(account)
      }
    }
    accountsCount = transaction.appCall.accountReferences.length
  }

  // Populate apps
  if (resourcesAccessed.apps) {
    transaction.appCall.appReferences = transaction.appCall.appReferences ?? []
    for (const appId of resourcesAccessed.apps) {
      if (!transaction.appCall.appReferences.includes(appId)) {
        transaction.appCall.appReferences.push(appId)
      }
    }
    appsCount = transaction.appCall.appReferences.length
  }

  // Populate assets
  if (resourcesAccessed.assets) {
    transaction.appCall.assetReferences = transaction.appCall.assetReferences ?? []
    for (const assetId of resourcesAccessed.assets) {
      if (!transaction.appCall.assetReferences.includes(assetId)) {
        transaction.appCall.assetReferences.push(assetId)
      }
    }
    assetsCount = transaction.appCall.assetReferences.length
  }

  // Validate reference limits
  if (accountsCount > MAX_ACCOUNT_REFERENCES) {
    throw new Error(`Account reference limit of ${MAX_ACCOUNT_REFERENCES} exceeded in transaction ${groupIndex}`)
  }

  if (accountsCount + assetsCount + appsCount + boxesCount > MAX_OVERALL_REFERENCES) {
    throw new Error(`Resource reference limit of ${MAX_OVERALL_REFERENCES} exceeded in transaction ${groupIndex}`)
  }
}

enum GroupResourceType {
  Account,
  App,
  Asset,
  Box,
  ExtraBoxRef,
  AssetHolding,
  AppLocal,
}

/**
 * Populate group-level resources for app call transactions
 */
export function populateGroupResources(
  transactions: Transaction[], // NOTE: transactions are mutated in place
  groupResources: SimulateUnnamedResourcesAccessed,
): void {
  let remainingAccounts = [...(groupResources.accounts ?? [])]
  let remainingApps = [...(groupResources.apps ?? [])]
  let remainingAssets = [...(groupResources.assets ?? [])]
  const remainingBoxes = [...(groupResources.boxes ?? [])]

  // Process cross-reference resources first (app locals and asset holdings) as they are most restrictive
  if (groupResources.appLocals) {
    groupResources.appLocals.forEach((appLocal) => {
      populateGroupResource(transactions, { type: GroupResourceType.AppLocal, data: appLocal })
      // Remove resources from remaining if we're adding them here
      remainingAccounts = remainingAccounts.filter((acc) => acc !== appLocal.account)
      remainingApps = remainingApps.filter((app) => app !== appLocal.app)
    })
  }

  if (groupResources.assetHoldings) {
    groupResources.assetHoldings.forEach((assetHolding) => {
      populateGroupResource(transactions, { type: GroupResourceType.AssetHolding, data: assetHolding })
      // Remove resources from remaining if we're adding them here
      remainingAccounts = remainingAccounts.filter((acc) => acc !== assetHolding.account)
      remainingAssets = remainingAssets.filter((asset) => asset !== assetHolding.asset)
    })
  }

  // Process accounts next because account limit is 4
  remainingAccounts.forEach((account) => {
    populateGroupResource(transactions, { type: GroupResourceType.Account, data: account })
  })

  // Process boxes
  remainingBoxes.forEach((boxRef) => {
    populateGroupResource(transactions, {
      type: GroupResourceType.Box,
      data: {
        appId: boxRef.app,
        name: boxRef.name,
      },
    })
    // Remove apps as resource if we're adding it here
    remainingApps = remainingApps.filter((app) => app !== boxRef.app)
  })

  // Process assets
  remainingAssets.forEach((asset) => {
    populateGroupResource(transactions, { type: GroupResourceType.Asset, data: asset })
  })

  // Process remaining apps
  remainingApps.forEach((app) => {
    populateGroupResource(transactions, { type: GroupResourceType.App, data: app })
  })

  // Handle extra box refs
  if (groupResources.extraBoxRefs) {
    for (let i = 0; i < groupResources.extraBoxRefs; i++) {
      populateGroupResource(transactions, { type: GroupResourceType.ExtraBoxRef })
    }
  }
}

/**
 * Helper function to check if an app call transaction is below resource limit
 */
function isAppCallBelowResourceLimit(txn: Transaction): boolean {
  if (txn.type !== TransactionType.AppCall) {
    return false
  }

  const accountsCount = txn.appCall?.accountReferences?.length || 0
  const assetsCount = txn.appCall?.assetReferences?.length || 0
  const appsCount = txn.appCall?.appReferences?.length || 0
  const boxesCount = txn.appCall?.boxReferences?.length || 0

  return accountsCount + assetsCount + appsCount + boxesCount < MAX_OVERALL_REFERENCES
}

type GroupResourceToPopulate =
  | { type: GroupResourceType.Account; data: string }
  | { type: GroupResourceType.App; data: bigint }
  | { type: GroupResourceType.Asset; data: bigint }
  | { type: GroupResourceType.Box; data: BoxReference }
  | { type: GroupResourceType.ExtraBoxRef }
  | { type: GroupResourceType.AssetHolding; data: AssetHoldingReference }
  | { type: GroupResourceType.AppLocal; data: ApplicationLocalReference }

/**
 * Helper function to populate a specific resource into a transaction group
 */
function populateGroupResource(
  transactions: Transaction[], // NOTE: transactions are mutated in place
  resource: GroupResourceToPopulate,
): void {
  // For asset holdings and app locals, first try to find a transaction that already has the account available
  if (resource.type === GroupResourceType.AssetHolding || resource.type === GroupResourceType.AppLocal) {
    const account = resource.data.account

    // Try to find a transaction that already has the account available
    const groupIndex1 = transactions.findIndex((txn) => {
      if (!isAppCallBelowResourceLimit(txn)) {
        return false
      }

      const appCall = txn.appCall!

      // Check if account is in foreign accounts array
      if (appCall.accountReferences?.includes(account)) {
        return true
      }

      // Check if account is available as an app account
      if (appCall.appReferences) {
        for (const appId of appCall.appReferences) {
          if (account === getAppAddress(appId)) {
            return true
          }
        }
      }

      // Check if account appears in any app call transaction fields
      if (txn.sender === account) {
        return true
      }

      return false
    })

    if (groupIndex1 !== -1) {
      const appCall = transactions[groupIndex1].appCall!
      if (resource.type === GroupResourceType.AssetHolding) {
        appCall.assetReferences = appCall.assetReferences ?? []
        if (!appCall.assetReferences.includes(resource.data.asset)) {
          appCall.assetReferences.push(resource.data.asset)
        }
      } else {
        appCall.appReferences = appCall.appReferences ?? []
        if (!appCall.appReferences.includes(resource.data.app)) {
          appCall.appReferences.push(resource.data.app)
        }
      }
      return
    }

    // Try to find a transaction that has the asset/app available and space for account
    const groupIndex2 = transactions.findIndex((txn) => {
      if (!isAppCallBelowResourceLimit(txn)) {
        return false
      }

      const appCall = txn.appCall!
      if ((appCall.accountReferences?.length ?? 0) >= MAX_ACCOUNT_REFERENCES) {
        return false
      }

      if (resource.type === GroupResourceType.AssetHolding) {
        return appCall.assetReferences?.includes(resource.data.asset) || false
      } else {
        return appCall.appReferences?.includes(resource.data.app) || appCall.appId === resource.data.app
      }
    })

    if (groupIndex2 !== -1) {
      const appCall = transactions[groupIndex2].appCall!
      appCall.accountReferences = appCall.accountReferences ?? []
      if (!appCall.accountReferences.includes(account)) {
        appCall.accountReferences.push(account)
      }
      return
    }
  }

  // For boxes, first try to find a transaction that already has the app available
  if (resource.type === GroupResourceType.Box) {
    const groupIndex = transactions.findIndex((txn) => {
      if (!isAppCallBelowResourceLimit(txn)) {
        return false
      }

      const appCall = txn.appCall!
      return appCall.appReferences?.includes(resource.data.appId) || appCall.appId === resource.data.appId
    })

    if (groupIndex !== -1) {
      const appCall = transactions[groupIndex].appCall!
      appCall.boxReferences = appCall.boxReferences ?? []
      const exists = appCall.boxReferences.some(
        (b) =>
          b.appId === resource.data.appId &&
          b.name.length === resource.data.name.length &&
          b.name.every((byte, i) => byte === resource.data.name[i]),
      )
      if (!exists) {
        appCall.boxReferences.push({ appId: resource.data.appId, name: resource.data.name })
      }
      return
    }
  }

  // Find the first transaction that can accommodate the resource
  const groupIndex = transactions.findIndex((txn) => {
    if (txn.type !== TransactionType.AppCall) {
      return false
    }

    const appCall = txn.appCall!
    const accountsCount = appCall.accountReferences?.length ?? 0
    const assetsCount = appCall.assetReferences?.length ?? 0
    const appsCount = appCall.appReferences?.length ?? 0
    const boxesCount = appCall.boxReferences?.length ?? 0

    switch (resource.type) {
      case GroupResourceType.Account:
        return accountsCount < MAX_ACCOUNT_REFERENCES
      case GroupResourceType.AssetHolding:
      case GroupResourceType.AppLocal:
        return accountsCount + assetsCount + appsCount + boxesCount < MAX_OVERALL_REFERENCES - 1 && accountsCount < MAX_ACCOUNT_REFERENCES
      case GroupResourceType.Box:
        if (resource.data.appId !== 0n) {
          return accountsCount + assetsCount + appsCount + boxesCount < MAX_OVERALL_REFERENCES - 1
        } else {
          return accountsCount + assetsCount + appsCount + boxesCount < MAX_OVERALL_REFERENCES
        }
      default:
        return accountsCount + assetsCount + appsCount + boxesCount < MAX_OVERALL_REFERENCES
    }
  })

  if (groupIndex === -1) {
    throw new Error('No more transactions below reference limit. Add another app call to the group.')
  }

  const appCall = transactions[groupIndex].appCall!

  switch (resource.type) {
    case GroupResourceType.Account:
      appCall.accountReferences = appCall.accountReferences ?? []
      if (!appCall.accountReferences.includes(resource.data)) {
        appCall.accountReferences.push(resource.data)
      }
      break
    case GroupResourceType.App:
      appCall.appReferences = appCall.appReferences ?? []
      if (!appCall.appReferences.includes(resource.data)) {
        appCall.appReferences.push(resource.data)
      }
      break
    case GroupResourceType.Box: {
      appCall.boxReferences = appCall.boxReferences ?? []
      const exists = appCall.boxReferences.some(
        (b) =>
          b.appId === resource.data.appId &&
          b.name.length === resource.data.name.length &&
          b.name.every((byte, i) => byte === resource.data.name[i]),
      )
      if (!exists) {
        appCall.boxReferences.push({ appId: resource.data.appId, name: resource.data.name })
      }
      if (resource.data.appId !== 0n) {
        appCall.appReferences = appCall.appReferences ?? []
        if (!appCall.appReferences.includes(resource.data.appId)) {
          appCall.appReferences.push(resource.data.appId)
        }
      }
      break
    }
    case GroupResourceType.ExtraBoxRef:
      appCall.boxReferences = appCall.boxReferences ?? []
      appCall.boxReferences.push({ appId: 0n, name: new Uint8Array(0) })
      break
    case GroupResourceType.AssetHolding:
      appCall.assetReferences = appCall.assetReferences ?? []
      if (!appCall.assetReferences.includes(resource.data.asset)) {
        appCall.assetReferences.push(resource.data.asset)
      }
      appCall.accountReferences = appCall.accountReferences ?? []
      if (!appCall.accountReferences.includes(resource.data.account)) {
        appCall.accountReferences.push(resource.data.account)
      }
      break
    case GroupResourceType.AppLocal:
      appCall.appReferences = appCall.appReferences ?? []
      if (!appCall.appReferences.includes(resource.data.app)) {
        appCall.appReferences.push(resource.data.app)
      }
      appCall.accountReferences = appCall.accountReferences ?? []
      if (!appCall.accountReferences.includes(resource.data.account)) {
        appCall.accountReferences.push(resource.data.account)
      }
      break
    case GroupResourceType.Asset:
      appCall.assetReferences = appCall.assetReferences ?? []
      if (!appCall.assetReferences.includes(resource.data)) {
        appCall.assetReferences.push(resource.data)
      }
      break
  }
}

export function calculateInnerFeeDelta(
  innerTransactions?: PendingTransactionResponse[],
  minTransactionFee: bigint = 1000n,
  acc?: FeeDelta,
): FeeDelta | undefined {
  if (!innerTransactions) {
    return acc
  }

  // Surplus inner transaction fees do not pool up to the parent transaction.
  // Additionally surplus inner transaction fees only pool from sibling transactions
  // that are sent prior to a given inner transaction, hence why we iterate in reverse order.
  return innerTransactions.reduceRight((acc, innerTxn) => {
    const recursiveDelta = calculateInnerFeeDelta(innerTxn.innerTxns, minTransactionFee, acc)

    // Inner transactions don't require per byte fees
    const txnFeeDelta = FeeDelta.fromBigInt(minTransactionFee - (innerTxn.txn.txn.fee ?? 0n))

    const currentFeeDelta = FeeDelta.fromBigInt(
      (recursiveDelta ? FeeDelta.toBigInt(recursiveDelta) : 0n) + (txnFeeDelta ? FeeDelta.toBigInt(txnFeeDelta) : 0n),
    )

    // If after the recursive inner fee calculations we have a surplus,
    // return undefined to avoid pooling up surplus fees, which is not allowed.
    if (currentFeeDelta && FeeDelta.isSurplus(currentFeeDelta)) {
      return undefined
    }

    return currentFeeDelta
  }, acc)
}

export function getDefaultValidityWindow(genesisId: string): number {
  const isLocalNet = genesisIdIsLocalNet(genesisId)
  if (isLocalNet) {
    return 1000 // LocalNet gets bigger window to avoid dead transactions
  } else {
    return 10 // Standard default validity window
  }
}

export async function waitForConfirmation(
  algodClient: AlgodClient,
  txId: string,
  maxRoundsToWait: number,
): Promise<PendingTransactionResponse> {
  const status = await algodClient.getStatus()
  const startRound = status.lastRound + 1n
  let currentRound = startRound
  while (currentRound < startRound + BigInt(maxRoundsToWait)) {
    try {
      const pendingInfo = await algodClient.pendingTransactionInformation(txId)
      const confirmedRound = pendingInfo.confirmedRound
      if (confirmedRound !== undefined && confirmedRound > 0n) {
        return pendingInfo
      } else {
        const poolError = pendingInfo.poolError
        if (poolError !== undefined && poolError.length > 0) {
          // If there was a pool error, then the transaction has been rejected!
          throw new Error(`Transaction ${txId} was rejected; pool error: ${poolError}`)
        }
      }
    } catch (e: unknown) {
      if (e instanceof ApiError && e.status === 404) {
        // Transaction not yet in pool, wait for next block
        await algodClient.waitForBlock(currentRound)
        currentRound++
        continue
      } else {
        throw e
      }
    }

    await algodClient.waitForBlock(currentRound)
    currentRound++
  }

  throw new Error(`Transaction ${txId} unconfirmed after ${maxRoundsToWait} rounds`)
}
