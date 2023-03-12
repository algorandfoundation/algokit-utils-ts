import algosdk, { Algodv2, SuggestedParams, Transaction } from 'algosdk'
import { Buffer } from 'buffer'
import { ApplicationResponse } from './algod-type'
import { AlgoKitConfig } from './config'
import {
  encodeTransactionNote,
  getSenderAddress,
  getTransactionParams,
  sendTransaction,
  SendTransactionFrom,
  SendTransactionParams,
  SendTransactionResult,
  TransactionNote,
} from './transaction'

export const APP_PAGE_MAX_SIZE = 2048

/** Information about an Algorand app */
export interface AppReference {
  /** The index of the app */
  appIndex: number
  /** The Algorand address of the account associated with the app */
  appAddress: string
}

/**
 * A grouping of the app ID and name of the box in an Uint8Array
 */
export interface BoxReference {
  /**
   * A unique application index
   */
  appIndex: number
  /**
   * Name of box to reference
   */
  name: Uint8Array | string
}

/** Arguments to pass to an app call */
export interface AppCallArgs {
  /** The address of any accounts to load in */
  accounts?: string[]
  /** Any application arguments to pass through */
  appArgs?: (Uint8Array | string)[]
  /** Any box references to load */
  boxes?: BoxReference[]
  /** IDs of any apps to load into the foreignApps array */
  apps?: number[]
  /** IDs of any assets to load into the foreignAssets array */
  assets?: number[]
  /** The optional lease for the transaction */
  lease?: string | Uint8Array
}

/** Base interface for common data passed to an app create or update. */
interface CreateOrUpdateAppParams extends SendTransactionParams {
  /** The account (with private key loaded) that will send the µALGOs */
  from: SendTransactionFrom
  /** The approval program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array) */
  approvalProgram: Uint8Array | string
  /** The clear program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array) */
  clearProgram: Uint8Array | string
  /** Optional transaction parameters */
  transactionParams?: SuggestedParams
  /** The (optional) transaction note */
  note?: TransactionNote
  /** The arguments passed in to the app call */
  args?: AppCallArgs
}

/** Parameters that are passed in when creating an app. */
export interface CreateAppParams extends CreateOrUpdateAppParams {
  /** The storage schema to request for the created app */
  schema: AppStorageSchema
}

/** Parameters that are passed in when updating an app. */
export interface UpdateAppParams extends CreateOrUpdateAppParams {
  /** The index of the app to update */
  appIndex: number
}

export interface AppCallParams extends SendTransactionParams {
  /** The index of the app to call */
  appIndex: number
  /** The type of call, everything except create (@see {createApp} ) and update (@see {updateApp} ) */
  callType: 'optin' | 'closeout' | 'clearstate' | 'delete' | 'normal'
  /** The account to make the call from */
  from: SendTransactionFrom
  /** Optional transaction parameters */
  transactionParams?: SuggestedParams
  /** The (optional) transaction note */
  note?: TransactionNote
  /** The arguments passed in to the app call */
  args?: AppCallArgs
}

/** Parameters representing the storage schema of an app. */
export interface AppStorageSchema {
  /** Restricts number of ints in per-user local state */
  localInts: number
  /** Restricts number of byte slices in per-user local state */
  localByteSlices: number
  /** Restricts number of ints in global state */
  globalInts: number
  /** Restricts number of byte slices in global state */
  globalByteSlices: number
  /** Any extra pages that are needed for the smart contract; if left blank then the right number of pages will be calculated based on the teal code size */
  extraPages?: number
}

/** Information about a compiled teal program */
export interface CompiledTeal {
  /** Original TEAL code */
  teal: string
  /** The compiled code */
  compiled: string
  /** The has returned by the compiler */
  compiledHash: string
  /** The base64 encoded code as a byte array */
  compiledBase64ToBytes: Uint8Array
}

/**
 * Creates a smart contract app, returns the details of the created app.
 * @param create The parameters to create the app with
 * @param client An algod client
 * @returns The details of the created app, or the transaction to create it if `skipSending`
 */
export async function createApp(create: CreateAppParams, client: Algodv2): Promise<SendTransactionResult & AppReference> {
  const { from, approvalProgram: approval, clearProgram: clear, schema, note, transactionParams, args, ...sendParams } = create

  const approvalProgram = typeof approval === 'string' ? (await compileTeal(approval, client)).compiledBase64ToBytes : approval
  const clearProgram = typeof clear === 'string' ? (await compileTeal(clear, client)).compiledBase64ToBytes : clear

  const transaction = algosdk.makeApplicationCreateTxnFromObject({
    approvalProgram: approvalProgram,
    clearProgram: clearProgram,
    numLocalInts: schema.localInts,
    numLocalByteSlices: schema.localByteSlices,
    numGlobalInts: schema.globalInts,
    numGlobalByteSlices: schema.globalByteSlices,
    extraPages: schema.extraPages ?? Math.floor((approvalProgram.length + clearProgram.length) / APP_PAGE_MAX_SIZE),
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams: await getTransactionParams(transactionParams, client),
    from: getSenderAddress(from),
    note: encodeTransactionNote(note),
    ...getAppArgsForTransaction(args),
    rekeyTo: undefined,
  })

  const { confirmation } = await sendTransaction(client, transaction, from, sendParams)
  if (confirmation) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const appIndex = confirmation['application-index']!

    if (!sendParams.suppressLog) {
      AlgoKitConfig.logger.debug(`Created app ${appIndex} from creator ${getSenderAddress(from)}`)
    }

    return { transaction, confirmation, appIndex, appAddress: algosdk.getApplicationAddress(appIndex) }
  } else {
    return { transaction, appIndex: 0, appAddress: '' }
  }
}

/**
 * Updates a smart contract app.
 * @param update The parameters to update the app with
 * @param client An algod client
 * @returns The transaction
 */
export async function updateApp(update: UpdateAppParams, client: Algodv2): Promise<SendTransactionResult> {
  const { appIndex, from, approvalProgram: approval, clearProgram: clear, note, transactionParams, args, ...sendParams } = update

  const approvalProgram = typeof approval === 'string' ? (await compileTeal(approval, client)).compiledBase64ToBytes : approval
  const clearProgram = typeof clear === 'string' ? (await compileTeal(clear, client)).compiledBase64ToBytes : clear

  const transaction = algosdk.makeApplicationUpdateTxnFromObject({
    appIndex,
    approvalProgram: approvalProgram,
    clearProgram: clearProgram,
    suggestedParams: await getTransactionParams(transactionParams, client),
    from: getSenderAddress(from),
    note: encodeTransactionNote(note),
    ...getAppArgsForTransaction(args),
    rekeyTo: undefined,
  })

  if (!sendParams.suppressLog) {
    AlgoKitConfig.logger.debug(`Updating app ${appIndex}`)
  }

  return await sendTransaction(client, transaction, from, sendParams)
}

/**
 * Issues a call to a given app.
 * @param call The call details.
 * @param client An algod client
 * @returns The result of the call
 */
export async function callApp(call: AppCallParams, client: Algodv2): Promise<SendTransactionResult> {
  const { appIndex, callType, from, args, note, transactionParams, ...sendParams } = call

  const appCallParameters = {
    appIndex: appIndex,
    from: getSenderAddress(from),
    suggestedParams: await getTransactionParams(transactionParams, client),
    ...getAppArgsForTransaction(args),
    note: encodeTransactionNote(note),
    rekeyTo: undefined,
  }

  let transaction: Transaction
  switch (callType) {
    case 'optin':
      transaction = algosdk.makeApplicationOptInTxnFromObject(appCallParameters)
      break
    case 'clearstate':
      transaction = algosdk.makeApplicationClearStateTxnFromObject(appCallParameters)
      break
    case 'closeout':
      transaction = algosdk.makeApplicationCloseOutTxnFromObject(appCallParameters)
      break
    case 'delete':
      transaction = algosdk.makeApplicationDeleteTxnFromObject(appCallParameters)
      break
    case 'normal':
      transaction = algosdk.makeApplicationNoOpTxnFromObject(appCallParameters)
      break
  }

  return await sendTransaction(client, transaction, from, sendParams)
}

/** Returns the app args ready to load onto an app @see {Transaction} object */
export function getAppArgsForTransaction(args?: AppCallArgs) {
  if (!args) return undefined
  const encoder = new TextEncoder()
  return {
    accounts: args?.accounts,
    appArgs: args?.appArgs?.map((a) => (typeof a === 'string' ? encoder.encode(a) : a)),
    boxes: args?.boxes?.map(
      (ref) =>
        ({
          appIndex: ref.appIndex,
          name: typeof ref.name === 'string' ? encoder.encode(ref.name) : ref.name,
        } as algosdk.BoxReference),
    ),
    foreignApps: args?.apps,
    foreignAssets: args?.assets,
    lease: typeof args?.lease === 'string' ? encoder.encode(args?.lease) : args?.lease,
  }
}

/**
 * Gets the current data for the given app from algod.
 *
 * @param appIndex The index of the app
 * @param client An algod client
 * @returns The data about the app
 */
export async function getAppByIndex(appIndex: number, client: Algodv2) {
  return (await client.getApplicationByID(appIndex).do()) as ApplicationResponse
}

/**
 * Compiles the given TEAL using algod and returns the result.
 *
 * @param client An algod client
 * @param tealCode The TEAL code
 * @returns The information about the compiled file
 */
export async function compileTeal(tealCode: string, client: Algodv2): Promise<CompiledTeal> {
  const compiled = await client.compile(tealCode).do()
  return {
    teal: tealCode,
    compiled: compiled.result,
    compiledHash: compiled.hash,
    compiledBase64ToBytes: new Uint8Array(Buffer.from(compiled.result, 'base64')),
  }
}
