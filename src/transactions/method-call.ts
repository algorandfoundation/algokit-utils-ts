import {
  ABIMethod,
  ABITupleType,
  ABIType,
  ABIUintType,
  ABIValue,
  argTypeIsReference,
  argTypeIsTransaction,
} from '@algorandfoundation/algokit-abi'
import { SuggestedParams } from '@algorandfoundation/algokit-algod-client'
import { Address, getAddress } from '@algorandfoundation/algokit-common'
import { OnApplicationComplete, Transaction, TransactionSigner, TransactionType } from '@algorandfoundation/algokit-transact'
import { TransactionWithSigner } from '../transaction'
import { AlgoAmount } from '../types/amount'
import { AppManager } from '../types/app-manager'
import { Expand } from '../types/expand'
import { calculateExtraProgramPages } from '../util'
import { AppCreateParams, AppDeleteParams, AppMethodCallParams, AppUpdateParams } from './app-call'
import { buildTransactionCommonData } from './common'

const ARGS_TUPLE_PACKING_THRESHOLD = 14 // 14+ args trigger tuple packing, excluding the method selector

/** Parameters to define an ABI method call create transaction. */
export type AppCreateMethodCall = Expand<AppMethodCall<AppCreateParams>>
/** Parameters to define an ABI method call update transaction. */
export type AppUpdateMethodCall = Expand<AppMethodCall<AppUpdateParams>>
/** Parameters to define an ABI method call delete transaction. */
export type AppDeleteMethodCall = Expand<AppMethodCall<AppDeleteParams>>
/** Parameters to define an ABI method call transaction. */
export type AppCallMethodCall = Expand<AppMethodCall<AppMethodCallParams>>

export type ProcessedAppCreateMethodCall = Expand<
  Omit<AppCreateMethodCall, 'args'> & {
    args?: (ABIValue | undefined)[]
  }
>

export type ProcessedAppUpdateMethodCall = Expand<
  Omit<AppUpdateMethodCall, 'args'> & {
    args?: (ABIValue | undefined)[]
  }
>

export type ProcessedAppCallMethodCall = Expand<
  Omit<AppCallMethodCall, 'args'> & {
    args?: (ABIValue | undefined)[]
  }
>

/** Types that can be used to define a transaction argument for an ABI call transaction. */
export type AppMethodCallTransactionArgument =
  // The following should match the partial `args` types from `AppMethodCall<T>` below
  | TransactionWithSigner
  | Transaction
  | Promise<Transaction>
  | AppMethodCall<AppCreateParams>
  | AppMethodCall<AppUpdateParams>
  | AppMethodCall<AppMethodCallParams>

/** Parameters to define an ABI method call. */
export type AppMethodCall<T> = Expand<Omit<T, 'args'>> & {
  /** The ABI method to call */
  method: ABIMethod
  /** Arguments to the ABI method, either:
   * * An ABI value
   * * A transaction with explicit signer
   * * A transaction (where the signer will be automatically assigned)
   * * An unawaited transaction (e.g. from algorand.createTransaction.{transactionType}())
   * * Another method call (via method call params object)
   * * undefined (this represents a placeholder transaction argument that is fulfilled by another method call argument)
   */
  args?: (
    | ABIValue
    // The following should match the above `AppMethodCallTransactionArgument` type above
    | TransactionWithSigner
    | Transaction
    | Promise<Transaction>
    | AppMethodCall<AppCreateParams>
    | AppMethodCall<AppUpdateParams>
    | AppMethodCall<AppMethodCallParams>
    | undefined
  )[]
}

type AppMethodCallArgs = AppMethodCall<unknown>['args']
type AppMethodCallArg = NonNullable<AppMethodCallArgs>[number]

export type AsyncTransactionParams = {
  txn: Promise<Transaction>
  signer?: TransactionSigner
  maxFee?: AlgoAmount
}

export type TransactionParams = {
  txn: Transaction
  signer?: TransactionSigner
  maxFee?: AlgoAmount
}

type ExtractedMethodCallTransactionArg =
  | { data: TransactionParams; type: 'txn' }
  | {
      data: AsyncTransactionParams
      type: 'asyncTxn'
    }
  | { data: ProcessedAppCallMethodCall | ProcessedAppCreateMethodCall | ProcessedAppUpdateMethodCall; type: 'methodCall' }

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
        type: 'txn',
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
      // If the arg is not an ABIValue, it's must be a transaction, set to undefined
      // transaction arguments should be flattened out and added into the composer during the add process
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

  // If x is a POJO literal
  if (Object.getPrototypeOf(x) === Object.getPrototypeOf({})) {
    return Object.values(x as object).every(isAbiValue)
  }

  return (
    typeof x === 'bigint' ||
    typeof x === 'boolean' ||
    typeof x === 'number' ||
    typeof x === 'string' ||
    x instanceof Uint8Array ||
    x instanceof Address
  )
}

/**
 * Prepares method arguments for ABI encoding by building reference arrays and
 * replacing reference-type arguments (account, asset, application) with their indices.
 */
function prepareArgsForEncoding(
  sender: Address,
  appId: bigint,
  method: ABIMethod,
  methodArgs: (ABIValue | undefined)[],
  accountReferences?: Address[],
  appReferences?: bigint[],
  assetReferences?: bigint[],
): { accountReferences: Address[]; appReferences: bigint[]; assetReferences: bigint[]; updatedArgs: (ABIValue | undefined)[] } {
  const accounts = [...(accountReferences ?? [])]
  const assets = [...(assetReferences ?? [])]
  const apps = [...(appReferences ?? [])]

  const updatedArgs = methodArgs.map((arg, i) => {
    const argType = method.args[i].type
    if (!argTypeIsReference(argType)) {
      return arg
    }
    switch (argType) {
      case 'account': {
        let addr: Address
        if (typeof arg === 'string') {
          addr = getAddress(arg)
        } else if (arg instanceof Uint8Array) {
          addr = new Address(arg)
        } else {
          throw new Error('Invalid value for account')
        }

        if (sender.equals(addr)) {
          return 0
        }

        const existing = accounts.findIndex((a) => a.equals(addr)) + 1
        if (existing) return existing

        accounts.push(addr)
        return accounts.length
      }
      case 'asset': {
        if (typeof arg !== 'bigint') {
          throw new Error('Invalid value for asset')
        }

        const existing = assets.findIndex((a) => a === arg)
        if (existing === -1) {
          assets.push(arg)
          return assets.length - 1
        }

        return existing
      }
      case 'application': {
        if (typeof arg !== 'bigint') {
          throw new Error('Invalid value for application')
        }

        if (arg === appId) return 0

        const existing = apps.findIndex((a) => a === arg) + 1
        if (existing) return existing

        apps.push(arg)
        return apps.length
      }
    }
  })

  return { accountReferences: accounts, appReferences: apps, assetReferences: assets, updatedArgs }
}

/**
 * Encode ABI method arguments with tuple packing support
 * Ports the logic from the Rust encode_method_arguments function
 */
function encodeMethodArguments(method: ABIMethod, args: (ABIValue | undefined)[]): Uint8Array[] {
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

    if (argTypeIsTransaction(methodArg.type)) {
      // Transaction arguments are not ABI encoded - they're handled separately
    } else if (argTypeIsReference(methodArg.type)) {
      // Reference types are encoded as uint8 indexes
      const referenceType = methodArg.type
      if (typeof argValue === 'number') {
        abiTypes.push(new ABIUintType(8))
        abiValues.push(argValue)
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
 * Builds encoded ABI method arguments and resolves reference arrays
 */
function buildMethodCallArgsAndReferences(params: {
  sender: Address
  appId: bigint
  method: ABIMethod
  args: (ABIValue | undefined)[]
  accountReferences?: Address[]
  appReferences?: bigint[]
  assetReferences?: bigint[]
}): { args: Uint8Array[]; accountReferences: Address[]; appReferences: bigint[]; assetReferences: bigint[] } {
  const { accountReferences, appReferences, assetReferences, updatedArgs } = prepareArgsForEncoding(
    params.sender,
    params.appId,
    params.method,
    params.args ?? [],
    params.accountReferences,
    params.appReferences,
    params.assetReferences,
  )

  const encodedArgs = encodeMethodArguments(params.method, updatedArgs)

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
  suggestedParams: SuggestedParams,
  defaultValidityWindow: bigint,
): Promise<Transaction> => {
  const commonData = buildTransactionCommonData(params, suggestedParams, defaultValidityWindow)
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
  const accountReferences = params.accountReferences?.map((a) => getAddress(a))
  const argsAndReferences = buildMethodCallArgsAndReferences({
    sender: commonData.sender,
    appId: 0n,
    method: params.method,
    args: params.args ?? [],
    accountReferences: accountReferences,
    appReferences: params.appReferences,
    assetReferences: params.assetReferences,
  })

  // If accessReferences is provided, we should not pass legacy foreign arrays
  const hasAccessReferences = params.accessReferences && params.accessReferences.length > 0

  return new Transaction({
    ...commonData,
    type: TransactionType.AppCall,
    appCall: {
      appId: 0n,
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
      approvalProgram: approvalProgram,
      clearStateProgram: clearStateProgram,
      globalStateSchema: globalStateSchema,
      localStateSchema: localStateSchema,
      extraProgramPages: extraProgramPages,
      args: argsAndReferences.args,
      ...(hasAccessReferences
        ? { accessReferences: params.accessReferences }
        : {
            accountReferences: argsAndReferences.accountReferences,
            appReferences: argsAndReferences.appReferences,
            assetReferences: argsAndReferences.assetReferences,
            boxReferences: params.boxReferences?.map(AppManager.getBoxReference),
          }),
      rejectVersion: params.rejectVersion,
    },
  })
}

export const buildAppUpdateMethodCall = async (
  params: ProcessedAppUpdateMethodCall,
  appManager: AppManager,
  suggestedParams: SuggestedParams,
  defaultValidityWindow: bigint,
): Promise<Transaction> => {
  const commonData = buildTransactionCommonData(params, suggestedParams, defaultValidityWindow)
  const approvalProgram =
    typeof params.approvalProgram === 'string'
      ? (await appManager.compileTeal(params.approvalProgram)).compiledBase64ToBytes
      : params.approvalProgram
  const clearStateProgram =
    typeof params.clearStateProgram === 'string'
      ? (await appManager.compileTeal(params.clearStateProgram)).compiledBase64ToBytes
      : params.clearStateProgram
  const accountReferences = params.accountReferences?.map((a) => getAddress(a))
  const argsAndReferences = buildMethodCallArgsAndReferences({
    sender: commonData.sender,
    appId: params.appId,
    method: params.method,
    args: params.args ?? [],
    accountReferences: accountReferences,
    appReferences: params.appReferences,
    assetReferences: params.assetReferences,
  })

  // If accessReferences is provided, we should not pass legacy foreign arrays
  const hasAccessReferences = params.accessReferences && params.accessReferences.length > 0

  return new Transaction({
    ...commonData,
    type: TransactionType.AppCall,
    appCall: {
      appId: params.appId,
      onComplete: OnApplicationComplete.UpdateApplication,
      approvalProgram: approvalProgram,
      clearStateProgram: clearStateProgram,
      args: argsAndReferences.args,
      ...(hasAccessReferences
        ? { accessReferences: params.accessReferences }
        : {
            accountReferences: argsAndReferences.accountReferences,
            appReferences: argsAndReferences.appReferences,
            assetReferences: argsAndReferences.assetReferences,
            boxReferences: params.boxReferences?.map(AppManager.getBoxReference),
          }),
      rejectVersion: params.rejectVersion,
    },
  })
}

export const buildAppCallMethodCall = async (
  params: ProcessedAppCallMethodCall,
  suggestedParams: SuggestedParams,
  defaultValidityWindow: bigint,
): Promise<Transaction> => {
  const commonData = buildTransactionCommonData(params, suggestedParams, defaultValidityWindow)
  const accountReferences = params.accountReferences?.map((a) => getAddress(a))
  const argsAndReferences = buildMethodCallArgsAndReferences({
    sender: commonData.sender,
    appId: params.appId,
    method: params.method,
    args: params.args ?? [],
    accountReferences: accountReferences,
    appReferences: params.appReferences,
    assetReferences: params.assetReferences,
  })

  // If accessReferences is provided, we should not pass legacy foreign arrays
  const hasAccessReferences = params.accessReferences && params.accessReferences.length > 0

  return new Transaction({
    ...commonData,
    type: TransactionType.AppCall,
    appCall: {
      appId: params.appId,
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
      args: argsAndReferences.args,
      ...(hasAccessReferences
        ? { accessReferences: params.accessReferences }
        : {
            accountReferences: argsAndReferences.accountReferences,
            appReferences: argsAndReferences.appReferences,
            assetReferences: argsAndReferences.assetReferences,
            boxReferences: params.boxReferences?.map(AppManager.getBoxReference),
          }),
      rejectVersion: params.rejectVersion,
    },
  })
}
