import algosdk from 'algosdk'
import { _getAppArgsForABICall, _getBoxReference, legacySendAppTransactionBridge } from './transaction/legacy-bridge'
import { encodeLease, getSenderAddress } from './transaction/transaction'
import {
  ABIAppCallArgs,
  ABIReturn,
  AppCallArgs,
  AppCallParams,
  AppCallTransactionResult,
  AppCallType,
  AppCompilationResult,
  AppReference,
  AppState,
  BoxIdentifier,
  BoxName,
  BoxReference,
  BoxValueRequestParams,
  BoxValuesRequestParams,
  CompiledTeal,
  CreateAppParams,
  RawAppCallArgs,
  UpdateAppParams,
} from './types/app'
import { AppManager } from './types/app-manager'
import { SendTransactionFrom } from './types/transaction'
import { toNumber } from './util'
import ABIMethod = algosdk.ABIMethod
import ABIMethodParams = algosdk.ABIMethodParams
import ABIValue = algosdk.ABIValue
import Address = algosdk.Address
import Algodv2 = algosdk.Algodv2
import AtomicTransactionComposer = algosdk.AtomicTransactionComposer
import modelsv2 = algosdk.modelsv2
import OnApplicationComplete = algosdk.OnApplicationComplete
import Transaction = algosdk.Transaction

/**
 * @deprecated Use `algorand.send.appCreate()` / `algorand.transactions.appCreate()` / `algorand.send.appCreateMethodCall()`
 * / `algorand.transactions.appCreateMethodCall()` instead
 *
 * Creates a smart contract app, returns the details of the created app.
 * @param create The parameters to create the app with
 * @param algod An algod client
 * @returns The details of the created app, or the transaction to create it if `skipSending` and the compilation result
 */
export async function createApp(
  create: CreateAppParams,
  algod: Algodv2,
): Promise<Partial<AppCompilationResult> & AppCallTransactionResult & AppReference> {
  const onComplete = getAppOnCompleteAction(create.onCompleteAction)
  if (onComplete === algosdk.OnApplicationComplete.ClearStateOC) {
    throw new Error('Cannot create an app with on-complete action of ClearState')
  }

  const result = create.args?.method
    ? await legacySendAppTransactionBridge(
        algod,
        create.from,
        create.args,
        create,
        {
          sender: getSenderAddress(create.from),
          onComplete,
          approvalProgram: create.approvalProgram,
          clearStateProgram: create.clearStateProgram,
          method: create.args.method instanceof ABIMethod ? create.args.method : new ABIMethod(create.args.method),
          extraProgramPages: create.schema.extraPages,
          schema: create.schema,
        },
        (c) => c.appCreateMethodCall,
        (c) => c.appCreateMethodCall,
      )
    : await legacySendAppTransactionBridge(
        algod,
        create.from,
        create.args,
        create,
        {
          sender: getSenderAddress(create.from),
          onComplete,
          approvalProgram: create.approvalProgram,
          clearStateProgram: create.clearStateProgram,
          extraProgramPages: create.schema.extraPages,
          schema: create.schema,
        },
        (c) => c.appCreate,
        (c) => c.appCreate,
      )

  return { ...result, appId: 'appId' in result ? Number(result.appId) : 0, appAddress: 'appAddress' in result ? result.appAddress : '' }
}

/**
 * @deprecated Use `algorand.send.appUpdate()` / `algorand.transactions.appUpdate()` / `algorand.send.appUpdateMethodCall()`
 * / `algorand.transactions.appUpdateMethodCall()` instead
 *
 * Updates a smart contract app.
 * @param update The parameters to update the app with
 * @param algod An algod client
 * @returns The transaction send result and the compilation result
 */
export async function updateApp(
  update: UpdateAppParams,
  algod: Algodv2,
): Promise<Partial<AppCompilationResult> & AppCallTransactionResult> {
  return update.args?.method
    ? await legacySendAppTransactionBridge(
        algod,
        update.from,
        update.args,
        update,
        {
          appId: BigInt(update.appId),
          sender: getSenderAddress(update.from),
          onComplete: algosdk.OnApplicationComplete.UpdateApplicationOC,
          approvalProgram: update.approvalProgram,
          clearStateProgram: update.clearStateProgram,
          method: update.args.method instanceof ABIMethod ? update.args.method : new ABIMethod(update.args.method),
        },
        (c) => c.appUpdateMethodCall,
        (c) => c.appUpdateMethodCall,
      )
    : await legacySendAppTransactionBridge(
        algod,
        update.from,
        update.args,
        update,
        {
          appId: BigInt(update.appId),
          sender: getSenderAddress(update.from),
          onComplete: algosdk.OnApplicationComplete.UpdateApplicationOC,
          approvalProgram: update.approvalProgram,
          clearStateProgram: update.clearStateProgram,
        },
        (c) => c.appUpdate,
        (c) => c.appUpdate,
      )
}

/**
 * @deprecated Use `algosdk.OnApplicationComplete` directly instead.
 *
 * Returns an `algosdk.OnApplicationComplete` for the given onCompleteAction.
 *
 * If given `undefined` will return `OnApplicationComplete.NoOpOC`.
 *
 * If given an `AppCallType` will convert the string enum to the correct underlying `algosdk.OnApplicationComplete`.
 *
 * @param onCompletionAction The on completion action
 * @returns The `algosdk.OnApplicationComplete`
 */
export function getAppOnCompleteAction(onCompletionAction?: AppCallType | OnApplicationComplete) {
  switch (onCompletionAction) {
    case undefined:
    case 'no_op':
    case OnApplicationComplete.NoOpOC:
      return OnApplicationComplete.NoOpOC
    case 'opt_in':
    case OnApplicationComplete.OptInOC:
      return OnApplicationComplete.OptInOC
    case 'close_out':
    case OnApplicationComplete.CloseOutOC:
      return OnApplicationComplete.CloseOutOC
    case 'clear_state':
    case OnApplicationComplete.ClearStateOC:
      return OnApplicationComplete.ClearStateOC
    case 'update_application':
    case OnApplicationComplete.UpdateApplicationOC:
      return OnApplicationComplete.UpdateApplicationOC
    case 'delete_application':
    case OnApplicationComplete.DeleteApplicationOC:
      return OnApplicationComplete.DeleteApplicationOC
  }
}

/**
 * @deprecated Use `algorand.send.appUpdate()` / `algorand.transactions.appUpdate()` / `algorand.send.appUpdateMethodCall()`
 * / `algorand.transactions.appUpdateMethodCall()` instead
 *
 * Issues a call to a given app.
 * @param call The call details.
 * @param algod An algod client
 * @returns The result of the call
 */
export async function callApp(call: AppCallParams, algod: Algodv2): Promise<AppCallTransactionResult> {
  const onComplete = getAppOnCompleteAction(call.callType)
  if (onComplete === algosdk.OnApplicationComplete.UpdateApplicationOC) {
    throw new Error('Cannot execute an app call with on-complete action of Update')
  }

  return call.args?.method
    ? await legacySendAppTransactionBridge(
        algod,
        call.from,
        call.args,
        call,
        {
          appId: BigInt(call.appId),
          sender: getSenderAddress(call.from),
          onComplete,
          method: call.args.method instanceof ABIMethod ? call.args.method : new ABIMethod(call.args.method),
        },
        (c) => c.appCallMethodCall,
        (c) => c.appCallMethodCall,
      )
    : await legacySendAppTransactionBridge(
        algod,
        call.from,
        call.args,
        call,
        {
          appId: BigInt(call.appId),
          sender: getSenderAddress(call.from),
          onComplete,
        },
        (c) => c.appCall,
        (c) => c.appCall,
      )
}

/**
 * @deprecated Use `AppManager.getABIReturn` instead.
 *
 * Returns any ABI return values for the given app call arguments and transaction confirmation.
 * @param args The arguments that were used for the call
 * @param confirmation The transaction confirmation from algod
 * @returns The return value for the method call
 */
export function getABIReturn(args?: AppCallArgs, confirmation?: modelsv2.PendingTransactionResponse): ABIReturn | undefined {
  if (!args || !args.method) {
    return undefined
  }
  const method = 'txnCount' in args.method ? args.method : new ABIMethod(args.method)

  return AppManager.getABIReturn(confirmation, method)
}

/**
 * @deprecated Use `(await appManager.getById(appId)).globalState` instead.
 *
 * Returns the current global state values for the given app ID
 * @param appId The ID of the app return global state for
 * @param algod An algod client instance
 * @returns The current global state
 */
export async function getAppGlobalState(appId: number | bigint, algod: Algodv2) {
  return (await new AppManager(algod).getById(BigInt(appId))).globalState
}

/**
 * @deprecated Use `appManager.getLocalState` instead.
 *
 * Returns the current global state values for the given app ID and account
 * @param appId The ID of the app return global state for
 * @param account Either the string address of an account or an account object for the account to get local state for the given app
 * @param algod An algod client instance
 * @returns The current local state for the given (app, account) combination
 */
export async function getAppLocalState(appId: number | bigint, account: string | SendTransactionFrom, algod: Algodv2) {
  return new AppManager(algod).getLocalState(BigInt(appId), getSenderAddress(account))
}

/**
 * @deprecated Use `appManager.getBoxNames` instead.
 * Returns the names of the boxes for the given app.
 * @param appId The ID of the app return box names for
 * @param algod An algod client instance
 * @returns The current box names
 */
export async function getAppBoxNames(appId: number | bigint, algod: Algodv2): Promise<BoxName[]> {
  return new AppManager(algod).getBoxNames(BigInt(appId))
}

/**
 * @deprecated Use `appManager.getBoxValue` instead.
 * Returns the value of the given box name for the given app.
 * @param appId The ID of the app return box names for
 * @param boxName The name of the box to return either as a string, binary array or `BoxName`
 * @param algod An algod client instance
 * @returns The current box value as a byte array
 */
export async function getAppBoxValue(appId: number | bigint, boxName: string | Uint8Array | BoxName, algod: Algodv2): Promise<Uint8Array> {
  return new AppManager(algod).getBoxValue(BigInt(appId), typeof boxName !== 'string' && 'name' in boxName ? boxName.nameRaw : boxName)
}

/**
 * @deprecated Use `appManager.getBoxValues` instead.
 * Returns the value of the given box names for the given app.
 * @param appId The ID of the app return box names for
 * @param boxNames The names of the boxes to return either as a string, binary array or `BoxName`
 * @param algod An algod client instance
 * @returns The current box values as a byte array in the same order as the passed in box names
 */
export async function getAppBoxValues(appId: number, boxNames: (string | Uint8Array | BoxName)[], algod: Algodv2): Promise<Uint8Array[]> {
  return new AppManager(algod).getBoxValues(
    BigInt(appId),
    boxNames.map((b) => (typeof b !== 'string' && 'name' in b ? b.nameRaw : b)),
  )
}

/**
 * @deprecated Use `appManager.getBoxValueFromABIType` instead.
 * Returns the value of the given box name for the given app decoded based on the given ABI type.
 * @param request The parameters for the box value request
 * @param algod An algod client instance
 * @returns The current box value as an ABI value
 */
export async function getAppBoxValueFromABIType(request: BoxValueRequestParams, algod: Algodv2): Promise<ABIValue> {
  return new AppManager(algod).getBoxValueFromABIType({
    appId: BigInt(request.appId),
    boxName: typeof request.boxName !== 'string' && 'name' in request.boxName ? request.boxName.nameRaw : request.boxName,
    type: request.type,
  })
}

/**
 * @deprecated Use `appManager.getBoxValuesFromABIType` instead.
 * Returns the value of the given box names for the given app decoded based on the given ABI type.
 * @param request The parameters for the box value request
 * @param algod An algod client instance
 * @returns The current box values as an ABI value in the same order as the passed in box names
 */
export async function getAppBoxValuesFromABIType(request: BoxValuesRequestParams, algod: Algodv2): Promise<ABIValue[]> {
  return new AppManager(algod).getBoxValuesFromABIType({
    appId: BigInt(request.appId),
    boxNames: request.boxNames.map((b) => (typeof b !== 'string' && 'name' in b ? b.nameRaw : b)),
    type: request.type,
  })
}

/**
 * @deprecated Use `AppManager.decodeAppState` instead.
 *
 * Converts an array of global/local state values from the algod api to a more friendly
 * generic object keyed by the UTF-8 value of the key.
 * @param state A `global-state`, `local-state`, `global-state-deltas` or `local-state-deltas`
 * @returns An object keyeed by the UTF-8 representation of the key with various parsings of the values
 */
export function decodeAppState(state: { key: string; value: modelsv2.TealValue | modelsv2.EvalDelta }[]): AppState {
  return AppManager.decodeAppState(state)
}

/**
 * @deprecated Use `AlgoKitComposer` methods to construct transactions instead.
 *
 * Returns the app args ready to load onto an app `Transaction` object
 * @param args The app call args
 * @returns The args ready to load into a `Transaction`
 */
export function getAppArgsForTransaction(args?: RawAppCallArgs) {
  if (!args) return undefined

  const encoder = new TextEncoder()
  return {
    accounts: args?.accounts?.map(_getAccountAddress),
    appArgs: args?.appArgs?.map((a) => (typeof a === 'string' ? encoder.encode(a) : a)),
    boxes: args.boxes?.map(getBoxReference),
    foreignApps: args?.apps,
    foreignAssets: args?.assets,
    lease: encodeLease(args?.lease),
  }
}

/**
 * @deprecated Use `AlgoKitComposer` methods to construct transactions instead.
 *
 * Returns the app args ready to load onto an ABI method call in `AtomicTransactionComposer`
 * @param args The ABI app call args
 * @param from The transaction signer
 * @returns The parameters ready to pass into `addMethodCall` within AtomicTransactionComposer
 */
export async function getAppArgsForABICall(args: ABIAppCallArgs, from: SendTransactionFrom) {
  return _getAppArgsForABICall(args, from)
}

/**
 * @deprecated Use `AppManager.getBoxReference()` instead.
 *
 * Returns a `algosdk.BoxReference` given a `BoxIdentifier` or `BoxReference`.
 * @param box The box to return a reference for
 * @returns The box reference ready to pass into a `Transaction`
 */
export function getBoxReference(box: BoxIdentifier | BoxReference | algosdk.BoxReference): algosdk.BoxReference {
  return _getBoxReference(box)
}

function _getAccountAddress(account: string | Address) {
  return typeof account === 'string' ? account : algosdk.encodeAddress(account.publicKey)
}

/**
 * @deprecated Use `appManager.getById` instead.
 *
 * Gets the current data for the given app from algod.
 *
 * @param appId The id of the app
 * @param algod An algod client
 * @returns The data about the app
 */
export async function getAppById(appId: number | bigint, algod: Algodv2) {
  return modelsv2.Application.from_obj_for_encoding(await algod.getApplicationByID(toNumber(appId)).do())
}

/**
 * @deprecated Use `appManager.compileTeal` instead.
 *
 * Compiles the given TEAL using algod and returns the result, including source map.
 *
 * @param algod An algod client
 * @param tealCode The TEAL code
 * @returns The information about the compiled file
 */
export async function compileTeal(tealCode: string, algod: Algodv2): Promise<CompiledTeal> {
  return await new AppManager(algod).compileTeal(tealCode)
}

/**
 * @deprecated Use `abiMethod.getSignature()` or `new ABIMethod(abiMethodParams).getSignature()` instead.
 *
 * Returns the encoded ABI spec for a given ABI Method
 * @param method The method to return a signature for
 * @returns The encoded ABI method spec e.g. `method_name(uint64,string)string`
 */
export const getABIMethodSignature = (method: ABIMethodParams | ABIMethod) => {
  return 'getSignature' in method ? method.getSignature() : new ABIMethod(method).getSignature()
}
