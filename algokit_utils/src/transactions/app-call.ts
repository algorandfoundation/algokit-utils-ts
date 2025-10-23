import {
  ABIMethod,
  ABIValue,
  getABIMethodSelector,
  ABIReferenceType,
  abiTypeIsReference,
  abiTypeIsTransaction,
  ABIType,
  ABITypeName,
  encodeABIValue,
  ABIReferenceValue,
} from '@algorandfoundation/algokit-abi'
import { ABITupleType, ABIUintType, encodeTuple } from '@algorandfoundation/algokit-abi'
import { BoxReference, OnApplicationComplete, StateSchema, TransactionType, Transaction } from '@algorandfoundation/algokit-transact'

import {
  AbstractedComposerTransaction,
  CommonTransactionParams,
  ComposerTransactionType,
  MethodCallComposerTransaction,
  ProcessedMethodCallComposerTransaction,
  TransactionHeader,
  TransactionWithSigner,
} from './common'

export type AppCallComposerTransaction = { type: ComposerTransactionType.AppCall; data: AppCallParams }
export type AppCreateCallComposerTransaction = { type: ComposerTransactionType.AppCreateCall; data: AppCreateParams }
export type AppUpdateCallComposerTransaction = { type: ComposerTransactionType.AppUpdateCall; data: AppUpdateParams }
export type AppDeleteCallComposerTransaction = { type: ComposerTransactionType.AppDeleteCall; data: AppDeleteParams }

export type AppCallMethodCallComposerTransaction = {
  type: ComposerTransactionType.AppCallMethodCall
  data: AppCallMethodCallParams
}
export type ProcessedAppCallMethodCallComposerTransaction = {
  type: ComposerTransactionType.AppCallMethodCall
  data: ProcessedAppCallMethodCallParams
}

export type AppCreateMethodCallComposerTransaction = {
  type: ComposerTransactionType.AppCreateMethodCall
  data: AppCreateMethodCallParams
}
export type ProcessedAppCreateMethodCallComposerTransaction = {
  type: ComposerTransactionType.AppCreateMethodCall
  data: ProcessedAppCreateMethodCallParams
}

export type AppUpdateMethodCallComposerTransaction = {
  type: ComposerTransactionType.AppUpdateMethodCall
  data: AppUpdateMethodCallParams
}
export type ProcessedAppUpdateMethodCallComposerTransaction = {
  type: ComposerTransactionType.AppUpdateMethodCall
  data: ProcessedAppUpdateMethodCallParams
}

export type AppDeleteMethodCallComposerTransaction = {
  type: ComposerTransactionType.AppDeleteMethodCall
  data: AppDeleteMethodCallParams
}
export type ProcessedAppDeleteMethodCallComposerTransaction = {
  type: ComposerTransactionType.AppDeleteMethodCall
  data: ProcessedAppDeleteMethodCallParams
}

export type ProcessedAppMethodCallArg = ABIValue | ABIReferenceValue | TransactionOrDefaultValuePlaceholder

const ARGS_TUPLE_PACKING_THRESHOLD = 14 // 14+ args trigger tuple packing, excluding the method selector

type TransactionOrDefaultValuePlaceholder = undefined

export type AppMethodCallArg =
  | ABIValue
  | ABIReferenceValue
  | TransactionOrDefaultValuePlaceholder
  | Transaction
  | TransactionWithSigner
  | AbstractedComposerTransaction

/** Parameters for creating an app method call transaction. */
export type AppCallMethodCallParams = CommonTransactionParams & {
  /** ID of the app being called. */
  appId: bigint
  /** The ABI method to call. */
  method: ABIMethod
  /** Transaction specific arguments available in the app's
   * approval program and clear state program.
   */
  args: AppMethodCallArg[]
  /** List of accounts in addition to the sender that may be accessed
   * from the app's approval program and clear state program.
   */
  accountReferences?: string[]
  /** List of apps in addition to the current app that may be called
   * from the app's approval program and clear state program.
   */
  appReferences?: bigint[]
  /** Lists the assets whose parameters may be accessed by this app's
   * approval program and clear state program.
   *
   * The access is read-only.
   */
  assetReferences?: bigint[]
  /** The boxes that should be made available for the runtime of the program. */
  boxReferences?: BoxReference[]
  /** Defines what additional actions occur with the transaction. */
  onComplete?: OnApplicationComplete
}
export type ProcessedAppCallMethodCallParams = Omit<AppCallMethodCallParams, 'args'> & {
  args: ProcessedAppMethodCallArg[]
}

/** Parameters for creating an app create method call transaction. */
export type AppCreateMethodCallParams = CommonTransactionParams & {
  /** Defines what additional actions occur with the transaction. */
  onComplete?: OnApplicationComplete
  /** Logic executed for every app call transaction, except when
   * on-completion is set to "clear".
   *
   * Approval programs may reject the transaction.
   */
  approvalProgram: Uint8Array
  /** Logic executed for app call transactions with on-completion set to "clear".
   *
   * Clear state programs cannot reject the transaction.
   */
  clearStateProgram: Uint8Array
  /** Holds the maximum number of global state values.
   *
   * This cannot be changed after creation.
   */
  globalStateSchema?: StateSchema
  /** Holds the maximum number of local state values.
   *
   * This cannot be changed after creation.
   */
  localStateSchema?: StateSchema
  /** Number of additional pages allocated to the app's approval
   * and clear state programs.
   *
   * Each extra program page is 2048 bytes. The sum of approval program
   * and clear state program may not exceed 2048*(1+extra_program_pages) bytes.
   * Currently, the maximum value is 3.
   * This cannot be changed after creation.
   */
  extraProgramPages?: number
  /** The ABI method to call. */
  method: ABIMethod
  /** Transaction specific arguments available in the app's
   * approval program and clear state program.
   */
  args: AppMethodCallArg[]
  /** List of accounts in addition to the sender that may be accessed
   * from the app's approval program and clear state program.
   */
  accountReferences?: string[]
  /** List of apps in addition to the current app that may be called
   * from the app's approval program and clear state program.
   */
  appReferences?: bigint[]
  /** Lists the assets whose parameters may be accessed by this app's
   * approval program and clear state program.
   *
   * The access is read-only.
   */
  assetReferences?: bigint[]
  /** The boxes that should be made available for the runtime of the program. */
  boxReferences?: BoxReference[]
}
export type ProcessedAppCreateMethodCallParams = Omit<AppCreateMethodCallParams, 'args'> & {
  args: ProcessedAppMethodCallArg[]
}

/** Parameters for creating an app update method call transaction. */
export type AppUpdateMethodCallParams = CommonTransactionParams & {
  /** ID of the app being updated. */
  appId: bigint
  /** Logic executed for every app call transaction, except when
   * on-completion is set to "clear".
   *
   * Approval programs may reject the transaction.
   */
  approvalProgram: Uint8Array
  /** Logic executed for app call transactions with on-completion set to "clear".
   *
   * Clear state programs cannot reject the transaction.
   */
  clearStateProgram: Uint8Array
  /** The ABI method to call. */
  method: ABIMethod
  /** Transaction specific arguments available in the app's
   * approval program and clear state program.
   */
  args: AppMethodCallArg[]
  /** List of accounts in addition to the sender that may be accessed
   * from the app's approval program and clear state program.
   */
  accountReferences?: string[]
  /** List of apps in addition to the current app that may be called
   * from the app's approval program and clear state program.
   */
  appReferences?: bigint[]
  /** Lists the assets whose parameters may be accessed by this app's
   * approval program and clear state program.
   *
   * The access is read-only.
   */
  assetReferences?: bigint[]
  /** The boxes that should be made available for the runtime of the program. */
  boxReferences?: BoxReference[]
}
export type ProcessedAppUpdateMethodCallParams = Omit<AppUpdateMethodCallParams, 'args'> & {
  args: ProcessedAppMethodCallArg[]
}

/** Parameters for creating an app delete method call transaction. */
export type AppDeleteMethodCallParams = CommonTransactionParams & {
  /** ID of the app being deleted. */
  appId: bigint
  /** The ABI method to call. */
  method: ABIMethod
  /** Transaction specific arguments available in the app's
   * approval program and clear state program.
   */
  args: AppMethodCallArg[]
  /** List of accounts in addition to the sender that may be accessed
   * from the app's approval program and clear state program.
   */
  accountReferences?: string[]
  /** List of apps in addition to the current app that may be called
   * from the app's approval program and clear state program.
   */
  appReferences?: bigint[]
  /** Lists the assets whose parameters may be accessed by this app's
   * approval program and clear state program.
   *
   * The access is read-only.
   */
  assetReferences?: bigint[]
  /** The boxes that should be made available for the runtime of the program. */
  boxReferences?: BoxReference[]
}
export type ProcessedAppDeleteMethodCallParams = Omit<AppDeleteMethodCallParams, 'args'> & {
  args: ProcessedAppMethodCallArg[]
}

/** Parameters for creating an app call transaction. */
export type AppCallParams = CommonTransactionParams & {
  /** ID of the app being called. */
  appId: bigint
  /** Defines what additional actions occur with the transaction. */
  onComplete?: OnApplicationComplete
  /** Transaction specific arguments available in the app's
   * approval program and clear state program.
   */
  args?: Uint8Array[]
  /** List of accounts in addition to the sender that may be accessed
   * from the app's approval program and clear state program.
   */
  accountReferences?: string[]
  /** List of apps in addition to the current app that may be called
   * from the app's approval program and clear state program.
   */
  appReferences?: bigint[]
  /** Lists the assets whose parameters may be accessed by this app's
   * approval program and clear state program.
   *
   * The access is read-only.
   */
  assetReferences?: bigint[]
  /** The boxes that should be made available for the runtime of the program. */
  boxReferences?: BoxReference[]
}

/** Parameters for creating an app create transaction. */
export type AppCreateParams = CommonTransactionParams & {
  /** Defines what additional actions occur with the transaction. */
  onComplete?: OnApplicationComplete
  /** Logic executed for every app call transaction, except when
   * on-completion is set to "clear".
   *
   * Approval programs may reject the transaction.
   */
  approvalProgram: Uint8Array
  /** Logic executed for app call transactions with on-completion set to "clear".
   *
   * Clear state programs cannot reject the transaction.
   */
  clearStateProgram: Uint8Array
  /** Holds the maximum number of global state values.
   *
   * This cannot be changed after creation.
   */
  globalStateSchema?: StateSchema
  /** Holds the maximum number of local state values.
   *
   * This cannot be changed after creation.
   */
  localStateSchema?: StateSchema
  /** Number of additional pages allocated to the app's approval
   * and clear state programs.
   *
   * Each extra program page is 2048 bytes. The sum of approval program
   * and clear state program may not exceed 2048*(1+extra_program_pages) bytes.
   * Currently, the maximum value is 3.
   * This cannot be changed after creation.
   */
  extraProgramPages?: number
  /** Transaction specific arguments available in the app's
   * approval program and clear state program.
   */
  args?: Uint8Array[]
  /** List of accounts in addition to the sender that may be accessed
   * from the app's approval program and clear state program.
   */
  accountReferences?: string[]
  /** List of apps in addition to the current app that may be called
   * from the app's approval program and clear state program.
   */
  appReferences?: bigint[]
  /** Lists the assets whose parameters may be accessed by this app's
   * approval program and clear state program.
   *
   * The access is read-only.
   */
  assetReferences?: bigint[]
  /** The boxes that should be made available for the runtime of the program. */
  boxReferences?: BoxReference[]
}

/** Parameters for creating an app update transaction. */
export type AppUpdateParams = CommonTransactionParams & {
  /** ID of the app being updated. */
  appId: bigint
  /** Logic executed for every app call transaction, except when
   * on-completion is set to "clear".
   *
   * Approval programs may reject the transaction.
   */
  approvalProgram: Uint8Array
  /** Logic executed for app call transactions with on-completion set to "clear".
   *
   * Clear state programs cannot reject the transaction.
   */
  clearStateProgram: Uint8Array
  /** Transaction specific arguments available in the app's
   * approval program and clear state program.
   */
  args?: Uint8Array[]
  /** List of accounts in addition to the sender that may be accessed
   * from the app's approval program and clear state program.
   */
  accountReferences?: string[]
  /** List of apps in addition to the current app that may be called
   * from the app's approval program and clear state program.
   */
  appReferences?: bigint[]
  /** Lists the assets whose parameters may be accessed by this app's
   * approval program and clear state program.
   *
   * The access is read-only.
   */
  assetReferences?: bigint[]
  /** The boxes that should be made available for the runtime of the program. */
  boxReferences?: BoxReference[]
}

/** Parameters for creating an app delete transaction. */
export type AppDeleteParams = CommonTransactionParams & {
  /** ID of the app being deleted. */
  appId: bigint
  /** Transaction specific arguments available in the app's
   * approval program and clear state program.
   */
  args?: Uint8Array[]
  /** List of accounts in addition to the sender that may be accessed
   * from the app's approval program and clear state program.
   */
  accountReferences?: string[]
  /** List of apps in addition to the current app that may be called
   * from the app's approval program and clear state program.
   */
  appReferences?: bigint[]
  /** Lists the assets whose parameters may be accessed by this app's
   * approval program and clear state program.
   *
   * The access is read-only.
   */
  assetReferences?: bigint[]
  /** The boxes that should be made available for the runtime of the program. */
  boxReferences?: BoxReference[]
}

export const buildAppCall = (params: AppCallParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    transactionType: TransactionType.AppCall,
    appCall: {
      appId: params.appId,
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
      args: params.args,
      accountReferences: params.accountReferences,
      appReferences: params.appReferences,
      assetReferences: params.assetReferences,
      boxReferences: params.boxReferences,
    },
  }
}

export const buildAppCreate = (params: AppCreateParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    transactionType: TransactionType.AppCall,
    appCall: {
      appId: 0n, // App creation always uses ID 0
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
      approvalProgram: params.approvalProgram,
      clearStateProgram: params.clearStateProgram,
      globalStateSchema: params.globalStateSchema,
      localStateSchema: params.localStateSchema,
      extraProgramPages: params.extraProgramPages,
      args: params.args,
      accountReferences: params.accountReferences,
      appReferences: params.appReferences,
      assetReferences: params.assetReferences,
      boxReferences: params.boxReferences,
    },
  }
}

export const buildAppUpdate = (params: AppUpdateParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    transactionType: TransactionType.AppCall,
    appCall: {
      appId: params.appId,
      onComplete: OnApplicationComplete.UpdateApplication,
      approvalProgram: params.approvalProgram,
      clearStateProgram: params.clearStateProgram,
      args: params.args,
      accountReferences: params.accountReferences,
      appReferences: params.appReferences,
      assetReferences: params.assetReferences,
      boxReferences: params.boxReferences,
    },
  }
}

export const buildAppDelete = (params: AppDeleteParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    transactionType: TransactionType.AppCall,
    appCall: {
      appId: params.appId,
      onComplete: OnApplicationComplete.DeleteApplication,
      args: params.args,
      accountReferences: params.accountReferences,
      appReferences: params.appReferences,
      assetReferences: params.assetReferences,
      boxReferences: params.boxReferences,
    },
  }
}

/**
 * Calculate array index for ABI reference values
 */
function calculateMethodArgReferenceArrayIndex(
  refValue: ABIReferenceValue,
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
 * Encode individual ABI values
 */
function encodeArgsIndividually(abiTypes: ABIType[], abiValues: ABIValue[]): Uint8Array[] {
  const encodedArgs: Uint8Array[] = []

  for (let i = 0; i < abiTypes.length; i++) {
    const abiType = abiTypes[i]
    const abiValue = abiValues[i]
    const encoded = encodeABIValue(abiType, abiValue)
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
    const tupleType = { name: ABITypeName.Tuple, childTypes: remainingAbiTypes } satisfies ABITupleType
    const tupleValue = remainingAbiValues
    const tupleEncoded = encodeTuple(tupleType, tupleValue)
    encodedArgs.push(tupleEncoded)
  }

  return encodedArgs
}

/**
 * Populate reference arrays from processed ABI method call arguments
 */
function populateMethodArgsIntoReferenceArrays(
  sender: string,
  appId: bigint,
  method: ABIMethod,
  methodArgs: ProcessedAppMethodCallArg[],
  accountReferences?: string[],
  appReferences?: bigint[],
  assetReferences?: bigint[],
): { accountReferences: string[]; appReferences: bigint[]; assetReferences: bigint[] } {
  const accounts = accountReferences ?? []
  const assets = assetReferences ?? []
  const apps = appReferences ?? []

  methodArgs.forEach((arg, i) => {
    const argType = method.args[i].argType
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
 * Encode ABI method arguments with tuple packing support
 * Ports the logic from the Rust encode_method_arguments function
 */
function encodeMethodArguments(
  method: ABIMethod,
  args: ProcessedAppMethodCallArg[],
  sender: string,
  appId: bigint,
  accountReferences: string[],
  appReferences: bigint[],
  assetReferences: bigint[],
): Uint8Array[] {
  const encodedArgs = new Array<Uint8Array>()

  // Insert method selector at the front
  encodedArgs.push(getABIMethodSelector(method))

  // Get ABI types for non-transaction arguments
  const abiTypes = new Array<ABIType>()
  const abiValues = new Array<ABIValue>()

  // Process each method argument
  for (let i = 0; i < method.args.length; i++) {
    const methodArg = method.args[i]
    const argValue = args[i]

    if (abiTypeIsTransaction(methodArg.argType)) {
      // Transaction arguments are not ABI encoded - they're handled separately
      continue
    }

    if (abiTypeIsReference(methodArg.argType)) {
      // Reference types are encoded as uint8 indexes
      const referenceType = methodArg.argType
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

        abiTypes.push({
          name: ABITypeName.Uint,
          bitSize: 8,
        } satisfies ABIUintType)
        abiValues.push(foreignIndex)
      } else {
        throw new Error(`Invalid reference value for ${referenceType}: ${argValue}`)
      }
    } else if (argValue !== undefined) {
      // Regular ABI value
      abiTypes.push(methodArg.argType)
      abiValues.push(argValue)
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

export function isComposerTransactionParamsArg(arg: AppMethodCallArg): arg is AbstractedComposerTransaction {
  return typeof arg === 'object' && arg !== undefined && 'type' in arg && 'data' in arg
}

const methodCallAbstractedComposerTransactionTypes = [
  ComposerTransactionType.AppCallMethodCall,
  ComposerTransactionType.AppCreateMethodCall,
  ComposerTransactionType.AppUpdateMethodCall,
  ComposerTransactionType.AppDeleteMethodCall,
]

export function isMethodCallComposerTransactionParamsArg(arg: AbstractedComposerTransaction): arg is MethodCallComposerTransaction {
  return methodCallAbstractedComposerTransactionTypes.includes(arg.type)
}

export function isTransactionArg(arg: AppMethodCallArg): arg is Transaction {
  return typeof arg === 'object' && arg !== undefined && 'transactionType' in arg && 'sender' in arg && !('data' in arg)
}

export function isTransactionWithSignerArg(arg: AppMethodCallArg): arg is TransactionWithSigner {
  return typeof arg === 'object' && arg !== undefined && 'transaction' in arg && 'signer' in arg
}

export function processAppMethodCallArgs(args: AppMethodCallArg[]): ProcessedAppMethodCallArg[] {
  return args.map((arg) => {
    if (arg === undefined) {
      // Handle explicit placeholders (either transaction or default value)
      return undefined
    } else if (isComposerTransactionParamsArg(arg) || isTransactionArg(arg) || isTransactionWithSignerArg(arg)) {
      // Handle Transactions by replacing with the transaction placeholder
      return undefined
    }
    return arg
  })
}

export function asProcessedAppCallMethodCallParams(
  composerTransaction: MethodCallComposerTransaction,
): ProcessedMethodCallComposerTransaction {
  if (composerTransaction.type === ComposerTransactionType.AppCallMethodCall) {
    return {
      ...composerTransaction,
      data: {
        ...composerTransaction.data,
        args: processAppMethodCallArgs(composerTransaction.data.args),
      },
    } satisfies ProcessedAppCallMethodCallComposerTransaction
  }

  if (composerTransaction.type === ComposerTransactionType.AppCreateMethodCall) {
    return {
      ...composerTransaction,
      data: {
        ...composerTransaction.data,
        args: processAppMethodCallArgs(composerTransaction.data.args),
      },
    } satisfies ProcessedAppCreateMethodCallComposerTransaction
  }

  if (composerTransaction.type === ComposerTransactionType.AppUpdateMethodCall) {
    return {
      ...composerTransaction,
      data: {
        ...composerTransaction.data,
        args: processAppMethodCallArgs(composerTransaction.data.args),
      },
    } satisfies ProcessedAppUpdateMethodCallComposerTransaction
  }

  if (composerTransaction.type === ComposerTransactionType.AppDeleteMethodCall) {
    return {
      ...composerTransaction,
      data: {
        ...composerTransaction.data,
        args: processAppMethodCallArgs(composerTransaction.data.args),
      },
    } satisfies ProcessedAppDeleteMethodCallComposerTransaction
  }

  // This should never happen if all cases are covered
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  throw new Error(`Unsupported method call transaction type: ${(composerTransaction as any).type}`)
}

/**
 * Common method call building logic
 */
function buildMethodCallCommon(
  params: {
    appId: bigint
    method: ABIMethod
    args: ProcessedAppMethodCallArg[]
    accountReferences?: string[]
    appReferences?: bigint[]
    assetReferences?: bigint[]
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

export const buildAppCallMethodCall = (params: ProcessedAppCallMethodCallParams, header: TransactionHeader): Transaction => {
  const common = buildMethodCallCommon(params, header)

  return {
    ...header,
    transactionType: TransactionType.AppCall,
    appCall: {
      appId: params.appId,
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
      args: common.args,
      accountReferences: common.accountReferences,
      appReferences: common.appReferences,
      assetReferences: common.assetReferences,
      boxReferences: params.boxReferences,
    },
  }
}

export const buildAppCreateMethodCall = (params: ProcessedAppCreateMethodCallParams, header: TransactionHeader): Transaction => {
  const common = buildMethodCallCommon({ ...params, appId: 0n }, header)

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

export const buildAppUpdateMethodCall = (params: ProcessedAppUpdateMethodCallParams, header: TransactionHeader): Transaction => {
  const common = buildMethodCallCommon(params, header)

  return {
    ...header,
    transactionType: TransactionType.AppCall,
    appCall: {
      appId: params.appId,
      onComplete: OnApplicationComplete.UpdateApplication,
      approvalProgram: params.approvalProgram,
      clearStateProgram: params.clearStateProgram,
      args: common.args,
      accountReferences: common.accountReferences,
      appReferences: common.appReferences,
      assetReferences: common.assetReferences,
      boxReferences: params.boxReferences,
    },
  }
}

export const buildAppDeleteMethodCall = (params: ProcessedAppDeleteMethodCallParams, header: TransactionHeader): Transaction => {
  const common = buildMethodCallCommon(params, header)

  return {
    ...header,
    transactionType: TransactionType.AppCall,
    appCall: {
      appId: params.appId,
      onComplete: OnApplicationComplete.DeleteApplication,
      args: common.args,
      accountReferences: common.accountReferences,
      appReferences: common.appReferences,
      assetReferences: common.assetReferences,
      boxReferences: params.boxReferences,
    },
  }
}
