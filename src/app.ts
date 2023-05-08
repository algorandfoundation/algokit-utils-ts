import algosdk, {
  ABIMethod,
  ABIMethodParams,
  ABIResult,
  ABIValue,
  Algodv2,
  AtomicTransactionComposer,
  OnApplicationComplete,
  SourceMap,
  Transaction,
} from 'algosdk'
import { Buffer } from 'buffer'
import { Config } from './'
import {
  controlFees,
  encodeTransactionNote,
  getAtomicTransactionComposerTransactions,
  getSenderAddress,
  getSenderTransactionSigner,
  getTransactionParams,
  sendAtomicTransactionComposer,
  sendTransaction,
} from './transaction'
import { ApplicationResponse, EvalDelta, PendingTransactionResponse, TealValue } from './types/algod'
import {
  ABIAppCallArgs,
  ABIReturn,
  APP_PAGE_MAX_SIZE,
  AppCallArgs,
  AppCallParams,
  AppCallTransactionResult,
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
import { SendTransactionFrom, SendTransactionParams } from './types/transaction'

/**
 * Creates a smart contract app, returns the details of the created app.
 * @param create The parameters to create the app with
 * @param algod An algod client
 * @returns The details of the created app, or the transaction to create it if `skipSending`
 */
export async function createApp(
  create: CreateAppParams,
  algod: Algodv2,
): Promise<Partial<AppCompilationResult> & AppCallTransactionResult & AppReference> {
  const { from, approvalProgram: approval, clearStateProgram: clear, schema, note, transactionParams, args, ...sendParams } = create

  const compiledApproval = typeof approval === 'string' ? await compileTeal(approval, algod) : undefined
  const approvalProgram = compiledApproval ? compiledApproval.compiledBase64ToBytes : approval
  const compiledClear = typeof clear === 'string' ? await compileTeal(clear, algod) : undefined
  const clearProgram = compiledClear ? compiledClear.compiledBase64ToBytes : clear

  if (args && args.method) {
    const atc = attachATC(sendParams)

    const before = getAtomicTransactionComposerTransactions(atc)

    atc.addMethodCall({
      appID: 0,
      approvalProgram: approvalProgram as Uint8Array,
      clearProgram: clearProgram as Uint8Array,
      numLocalInts: schema.localInts,
      numLocalByteSlices: schema.localByteSlices,
      numGlobalInts: schema.globalInts,
      numGlobalByteSlices: schema.globalByteSlices,
      extraPages: schema.extraPages ?? Math.floor((approvalProgram.length + clearProgram.length) / APP_PAGE_MAX_SIZE),
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      suggestedParams: controlFees(await getTransactionParams(transactionParams, algod), sendParams),
      note: encodeTransactionNote(note),
      ...(await getAppArgsForABICall(args, from)),
    })

    if (sendParams.skipSending) {
      const after = atc.clone().buildGroup()
      return {
        transaction: after[after.length - 1].txn,
        transactions: after.slice(before.length).map((t) => t.txn),
        appId: 0,
        appAddress: '',
        compiledApproval,
        compiledClear,
      }
    }

    const result = await sendAtomicTransactionComposer({ atc, sendParams }, algod)
    const confirmation = result.confirmations ? result.confirmations[result.confirmations?.length - 1] : undefined
    if (confirmation) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const appId = confirmation['application-index']!

      Config.getLogger(sendParams.suppressLog).debug(`Created app ${appId} from creator ${getSenderAddress(from)}`)

      return {
        transactions: result.transactions,
        confirmations: result.confirmations,
        return: confirmation ? getABIReturn(args, confirmation) : undefined,
        transaction: result.transactions[result.transactions.length - 1],
        confirmation: confirmation,
        appId,
        appAddress: algosdk.getApplicationAddress(appId),
        compiledApproval,
        compiledClear,
      }
    } else {
      return {
        transactions: result.transactions,
        confirmations: result.confirmations,
        return: confirmation ? getABIReturn(args, confirmation) : undefined,
        transaction: result.transactions[result.transactions.length - 1],
        confirmation: confirmation,
        appId: 0,
        appAddress: '',
        compiledApproval,
        compiledClear,
      }
    }
  } else {
    const transaction = algosdk.makeApplicationCreateTxnFromObject({
      approvalProgram: approvalProgram as Uint8Array,
      clearProgram: clearProgram as Uint8Array,
      numLocalInts: schema.localInts,
      numLocalByteSlices: schema.localByteSlices,
      numGlobalInts: schema.globalInts,
      numGlobalByteSlices: schema.globalByteSlices,
      extraPages: schema.extraPages ?? Math.floor((approvalProgram.length + clearProgram.length) / APP_PAGE_MAX_SIZE),
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      suggestedParams: await getTransactionParams(transactionParams, algod),
      from: getSenderAddress(from),
      note: encodeTransactionNote(note),
      ...getAppArgsForTransaction(args),
      rekeyTo: undefined,
    })

    const { confirmation } = await sendTransaction({ transaction, from, sendParams }, algod)
    if (confirmation) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const appId = confirmation['application-index']!

      Config.getLogger(sendParams.suppressLog).debug(`Created app ${appId} from creator ${getSenderAddress(from)}`)

      return {
        transaction,
        transactions: [transaction],
        confirmation,
        confirmations: confirmation ? [confirmation] : undefined,
        appId,
        appAddress: algosdk.getApplicationAddress(appId),
        return: getABIReturn(args, confirmation),
        compiledApproval,
        compiledClear,
      }
    } else {
      return { transaction, transactions: [transaction], appId: 0, appAddress: '', compiledApproval, compiledClear }
    }
  }
}

/**
 * Updates a smart contract app.
 * @param update The parameters to update the app with
 * @param algod An algod client
 * @returns The transaction
 */
export async function updateApp(
  update: UpdateAppParams,
  algod: Algodv2,
): Promise<Partial<AppCompilationResult> & AppCallTransactionResult> {
  const { appId, from, approvalProgram: approval, clearStateProgram: clear, note, transactionParams, args, ...sendParams } = update

  const compiledApproval = typeof approval === 'string' ? await compileTeal(approval, algod) : undefined
  const approvalProgram = compiledApproval ? compiledApproval.compiledBase64ToBytes : approval
  const compiledClear = typeof clear === 'string' ? await compileTeal(clear, algod) : undefined
  const clearProgram = compiledClear ? compiledClear.compiledBase64ToBytes : clear

  Config.getLogger(sendParams.suppressLog).debug(`Updating app ${appId}`)

  if (args && args.method) {
    const atc = attachATC(sendParams)

    const before = getAtomicTransactionComposerTransactions(atc)

    atc.addMethodCall({
      appID: appId,
      onComplete: OnApplicationComplete.UpdateApplicationOC,
      approvalProgram: approvalProgram as Uint8Array,
      clearProgram: clearProgram as Uint8Array,
      suggestedParams: controlFees(await getTransactionParams(transactionParams, algod), sendParams),
      note: encodeTransactionNote(note),
      ...(await getAppArgsForABICall(args, from)),
    })

    if (sendParams.skipSending) {
      const after = atc.clone().buildGroup()
      return {
        transaction: after[after.length - 1].txn,
        transactions: after.slice(before.length).map((t) => t.txn),
      }
    }

    const result = await sendAtomicTransactionComposer({ atc, sendParams }, algod)
    const confirmation = result.confirmations ? result.confirmations[result.confirmations?.length - 1] : undefined
    return {
      transactions: result.transactions,
      confirmations: result.confirmations,
      return: confirmation ? getABIReturn(args, confirmation) : undefined,
      transaction: result.transactions[result.transactions.length - 1],
      confirmation: confirmation,
    }
  } else {
    const transaction = algosdk.makeApplicationUpdateTxnFromObject({
      appIndex: appId,
      approvalProgram: approvalProgram as Uint8Array,
      clearProgram: clearProgram as Uint8Array,
      suggestedParams: await getTransactionParams(transactionParams, algod),
      from: getSenderAddress(from),
      note: encodeTransactionNote(note),
      ...getAppArgsForTransaction(args),
      rekeyTo: undefined,
    })

    const result = await sendTransaction({ transaction, from, sendParams }, algod)

    return {
      ...result,
      transactions: [result.transaction],
      confirmations: result.confirmation ? [result.confirmation] : undefined,
      return: getABIReturn(args, result.confirmation),
      compiledApproval,
      compiledClear,
    }
  }
}

function attachATC(sendParams: SendTransactionParams) {
  if (sendParams.atc) {
    sendParams.skipSending = true
  }
  sendParams.atc = sendParams.atc ?? new AtomicTransactionComposer()
  return sendParams.atc
}

/**
 * Issues a call to a given app.
 * @param call The call details.
 * @param algod An algod client
 * @returns The result of the call
 */
export async function callApp(call: AppCallParams, algod: Algodv2): Promise<AppCallTransactionResult> {
  const { appId, callType, from, args, note, transactionParams, ...sendParams } = call

  if (args && args.method) {
    const atc = attachATC(sendParams)

    const before = getAtomicTransactionComposerTransactions(atc)

    atc.addMethodCall({
      appID: appId,
      suggestedParams: controlFees(await getTransactionParams(transactionParams, algod), sendParams),
      note: encodeTransactionNote(note),
      onComplete:
        callType === 'normal'
          ? OnApplicationComplete.NoOpOC
          : callType === 'clearstate'
          ? OnApplicationComplete.ClearStateOC
          : callType === 'closeout'
          ? OnApplicationComplete.CloseOutOC
          : callType === 'delete'
          ? OnApplicationComplete.DeleteApplicationOC
          : OnApplicationComplete.OptInOC,
      ...(await getAppArgsForABICall(args, from)),
    })

    if (sendParams.skipSending) {
      const after = atc.clone().buildGroup()
      return {
        transaction: after[after.length - 1].txn,
        transactions: after.slice(before.length).map((t) => t.txn),
      }
    }

    const result = await sendAtomicTransactionComposer({ atc, sendParams }, algod)
    const confirmation = result.confirmations ? result.confirmations[result.confirmations?.length - 1] : undefined
    return {
      transactions: result.transactions,
      confirmations: result.confirmations,
      return: confirmation ? getABIReturn(args, confirmation) : undefined,
      transaction: result.transactions[result.transactions.length - 1],
      confirmation: confirmation,
    }
  }

  const appCallParams = {
    appIndex: appId,
    from: getSenderAddress(from),
    suggestedParams: await getTransactionParams(transactionParams, algod),
    ...getAppArgsForTransaction(args),
    note: encodeTransactionNote(note),
    rekeyTo: undefined,
  }

  let transaction: Transaction
  switch (callType) {
    case 'optin':
      transaction = algosdk.makeApplicationOptInTxnFromObject(appCallParams)
      break
    case 'clearstate':
      transaction = algosdk.makeApplicationClearStateTxnFromObject(appCallParams)
      break
    case 'closeout':
      transaction = algosdk.makeApplicationCloseOutTxnFromObject(appCallParams)
      break
    case 'delete':
      transaction = algosdk.makeApplicationDeleteTxnFromObject(appCallParams)
      break
    case 'normal':
      transaction = algosdk.makeApplicationNoOpTxnFromObject(appCallParams)
      break
  }

  const result = await sendTransaction({ transaction, from, sendParams }, algod)

  return {
    ...result,
    transactions: [result.transaction],
    confirmations: result.confirmation ? [result.confirmation] : undefined,
    return: getABIReturn(args, result.confirmation),
  }
}

/**
 * Returns any ABI return values for the given app call arguments and transaction confirmation.
 * @param args The arguments that were used for the call
 * @param confirmation The transaction confirmation from algod
 * @returns The return value for the method call
 */
export function getABIReturn(args?: AppCallArgs, confirmation?: PendingTransactionResponse): ABIReturn | undefined {
  if (!args || !args.method) {
    return undefined
  }
  const method = 'txnCount' in args.method ? args.method : new ABIMethod(args.method)

  if (method.returns.type !== 'void' && confirmation) {
    // The parseMethodResponse method mutates the second parameter :(
    const resultDummy: ABIResult = {
      txID: '',
      method,
      rawReturnValue: new Uint8Array(),
    }
    const response = AtomicTransactionComposer.parseMethodResponse(method, resultDummy, confirmation)
    return !response.decodeError
      ? {
          rawReturnValue: response.rawReturnValue,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          returnValue: response.returnValue!,
          decodeError: undefined,
        }
      : {
          rawReturnValue: undefined,
          returnValue: undefined,
          decodeError: response.decodeError,
        }
  }
  return undefined
}

/**
 * Returns the current global state values for the given app ID
 * @param appId The ID of the app return global state for
 * @param algod An algod client instance
 * @returns The current global state
 */
export async function getAppGlobalState(appId: number, algod: Algodv2) {
  const appInfo = await getAppById(appId, algod)

  if (!appInfo.params || !appInfo.params['global-state']) {
    throw new Error("Couldn't find global state")
  }

  return decodeAppState(appInfo.params['global-state'])
}

/**
 * Returns the current global state values for the given app ID and account
 * @param appId The ID of the app return global state for
 * @param account Either the string address of an account or an account object for the account to get local state for the given app
 * @param algod An algod client instance
 * @returns The current local state for the given (app, account) combination
 */
export async function getAppLocalState(appId: number, account: string | SendTransactionFrom, algod: Algodv2) {
  const accountAddress = typeof account === 'string' ? account : getSenderAddress(account)
  const appInfo = await algod.accountApplicationInformation(accountAddress, appId).do()

  if (!appInfo['app-local-state'] || !appInfo['app-local-state']['key-value']) {
    throw new Error("Couldn't find local state")
  }

  return decodeAppState(appInfo['app-local-state']['key-value'])
}

/**
 * Returns the names of the boxes for the given app.
 * @param appId The ID of the app return box names for
 * @param algod An algod client instance
 * @returns The current box names
 */
export async function getAppBoxNames(appId: number, algod: Algodv2): Promise<BoxName[]> {
  const boxResult = await algod.getApplicationBoxes(appId).do()
  return boxResult.boxes.map((b) => {
    return {
      nameRaw: b.name,
      nameBase64: Buffer.from(b.name).toString('base64'),
      name: Buffer.from(b.name).toString('utf-8'),
    }
  })
}

/**
 * Returns the value of the given box name for the given app.
 * @param appId The ID of the app return box names for
 * @param boxName The name of the box to return either as a string, binary array or `BoxName`
 * @param algod An algod client instance
 * @returns The current box value as a byte array
 */
export async function getAppBoxValue(appId: number, boxName: string | Uint8Array | BoxName, algod: Algodv2): Promise<Uint8Array> {
  const name = typeof boxName === 'string' ? new Uint8Array(Buffer.from(boxName, 'utf-8')) : 'name' in boxName ? boxName.nameRaw : boxName
  const boxResult = await algod.getApplicationBoxByName(appId, name).do()
  return boxResult.value
}

/**
 * Returns the value of the given box names for the given app.
 * @param appId The ID of the app return box names for
 * @param boxNames The names of the boxes to return either as a string, binary array or `BoxName`
 * @param algod An algod client instance
 * @returns The current box values as a byte array in the same order as the passed in box names
 */
export async function getAppBoxValues(appId: number, boxNames: (string | Uint8Array | BoxName)[], algod: Algodv2): Promise<Uint8Array[]> {
  return await Promise.all(boxNames.map(async (boxName) => await getAppBoxValue(appId, boxName, algod)))
}

/**
 * Returns the value of the given box name for the given app decoded based on the given ABI type.
 * @param request The parameters for the box value request
 * @param algod An algod client instance
 * @returns The current box value as an ABI value
 */
export async function getAppBoxValueFromABIType(request: BoxValueRequestParams, algod: Algodv2): Promise<ABIValue> {
  const { appId, boxName, type } = request
  const value = await getAppBoxValue(appId, boxName, algod)
  return type.decode(value)
}

/**
 * Returns the value of the given box names for the given app decoded based on the given ABI type.
 * @param request The parameters for the box value request
 * @param algod An algod client instance
 * @returns The current box values as an ABI value in the same order as the passed in box names
 */
export async function getAppBoxValuesFromABIType(request: BoxValuesRequestParams, algod: Algodv2): Promise<ABIValue[]> {
  const { appId, boxNames, type } = request
  return await Promise.all(boxNames.map(async (boxName) => await getAppBoxValueFromABIType({ appId, boxName, type }, algod)))
}

/**
 * Converts an array of global/local state values from the algod api to a more friendly
 * generic object keyed by the UTF-8 value of the key.
 * @param state A `global-state`, `local-state`, `global-state-deltas` or `local-state-deltas`
 * @returns An object keyeed by the UTF-8 representation of the key with various parsings of the values
 */
export function decodeAppState(state: { key: string; value: TealValue | EvalDelta }[]): AppState {
  const stateValues = {} as AppState

  // Start with empty set
  for (const stateVal of state) {
    const keyBase64 = stateVal.key
    const keyRaw = Buffer.from(keyBase64, 'base64')
    const key = keyRaw.toString('utf-8')
    const tealValue = stateVal.value

    const dataTypeFlag = 'action' in tealValue ? tealValue.action : tealValue.type
    let valueBase64: string
    let valueRaw: Buffer
    switch (dataTypeFlag) {
      case 1:
        valueBase64 = 'bytes' in tealValue ? tealValue.bytes : ''
        valueRaw = Buffer.from(valueBase64, 'base64')
        stateValues[key] = {
          keyRaw,
          keyBase64,
          valueRaw: new Uint8Array(valueRaw),
          valueBase64: valueBase64,
          value: valueRaw.toString('utf-8'),
        }
        break
      case 2:
        // eslint-disable-next-line no-case-declarations
        const value = 'uint' in tealValue ? tealValue.uint : 0
        stateValues[key] = {
          keyRaw,
          keyBase64,
          value,
        }
        break
      default:
        throw new Error(`Received unknown state data type of ${dataTypeFlag}`)
    }
  }

  return stateValues
}

/**
 * Returns the app args ready to load onto an app `Transaction` object
 * @param args The app call args
 * @returns The args ready to load into a `Transaction`
 */
export function getAppArgsForTransaction(args?: RawAppCallArgs) {
  if (!args) return undefined

  const encoder = new TextEncoder()
  return {
    accounts: args?.accounts?.map((a) => (typeof a === 'string' ? a : algosdk.encodeAddress(a.publicKey))),
    appArgs: args?.appArgs?.map((a) => (typeof a === 'string' ? encoder.encode(a) : a)),
    boxes: args.boxes?.map(getBoxReference),
    foreignApps: args?.apps,
    foreignAssets: args?.assets,
    lease: typeof args?.lease === 'string' ? encoder.encode(args?.lease) : args?.lease,
  }
}

/**
 * Returns the app args ready to load onto an ABI method call in `AtomicTransactionComposer`
 * @param args The ABI app call args
 * @param from The transaction signer
 * @returns The parameters ready to pass into `addMethodCall` within AtomicTransactionComposer
 */
export async function getAppArgsForABICall(args: ABIAppCallArgs, from: SendTransactionFrom) {
  const encoder = new TextEncoder()
  const signer = getSenderTransactionSigner(from)
  const methodArgs = await Promise.all(
    ('methodArgs' in args ? args.methodArgs : args)?.map(async (a) => {
      if (typeof a !== 'object') {
        return a
      }
      // Handle the various forms of transactions to wrangle them for ATC
      return 'txn' in a
        ? a
        : 'then' in a
        ? { txn: (await a).transaction, signer }
        : 'transaction' in a
        ? { txn: a.transaction, signer }
        : 'txID' in a
        ? { txn: a, signer }
        : a
    }),
  )
  return {
    method: 'txnCount' in args.method ? args.method : new ABIMethod(args.method),
    sender: getSenderAddress(from),
    signer: signer,
    boxes: args.boxes?.map(getBoxReference),
    lease: typeof args.lease === 'string' ? encoder.encode(args.lease) : args.lease,
    methodArgs: methodArgs,
    rekeyTo: undefined,
  }
}

/**
 * Returns a `algosdk.BoxReference` given a `BoxIdentifier` or `BoxReference`.
 * @param box The box to return a reference for
 * @returns The box reference ready to pass into a `Transaction`
 */
export function getBoxReference(box: BoxIdentifier | BoxReference | algosdk.BoxReference): algosdk.BoxReference {
  const encoder = new TextEncoder()

  if (typeof box === 'object' && 'appIndex' in box) {
    return box
  }

  const ref = typeof box === 'object' && 'appId' in box ? box : { appId: 0, name: box }
  return {
    appIndex: ref.appId,
    name:
      typeof ref.name === 'string'
        ? encoder.encode(ref.name)
        : 'length' in ref.name
        ? ref.name
        : algosdk.decodeAddress(getSenderAddress(ref.name)).publicKey,
  } as algosdk.BoxReference
}

/**
 * Gets the current data for the given app from algod.
 *
 * @param appId The id of the app
 * @param algod An algod client
 * @returns The data about the app
 */
export async function getAppById(appId: number, algod: Algodv2) {
  return (await algod.getApplicationByID(appId).do()) as ApplicationResponse
}

/**
 * Compiles the given TEAL using algod and returns the result, including source map.
 *
 * @param algod An algod client
 * @param tealCode The TEAL code
 * @returns The information about the compiled file
 */
export async function compileTeal(tealCode: string, algod: Algodv2): Promise<CompiledTeal> {
  const compiled = await algod.compile(tealCode).sourcemap(true).do()
  return {
    teal: tealCode,
    compiled: compiled.result,
    compiledHash: compiled.hash,
    compiledBase64ToBytes: new Uint8Array(Buffer.from(compiled.result, 'base64')),
    sourceMap: new SourceMap(compiled['sourcemap']),
  }
}

/**
 * Returns the encoded ABI spec for a given ABI Method
 * @param method The method to return a signature for
 * @returns The encoded ABI method spec e.g. `method_name(uint64,string)string`
 */
export const getABIMethodSignature = (method: ABIMethodParams | ABIMethod) => {
  return 'getSignature' in method ? method.getSignature() : new ABIMethod(method).getSignature()
}
