import algosdk, {
  ABIArgument,
  ABIMethod,
  ABIMethodParams,
  Address,
  Algodv2,
  AtomicTransactionComposer,
  makeBasicAccountTransactionSigner,
  OnApplicationComplete,
  SuggestedParams,
  Transaction,
} from 'algosdk'
import { Buffer } from 'buffer'
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
import { ApplicationResponse } from './types/algod'

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

/**
 * App call args with raw values (minus some processing like encoding strings as binary)
 */
export interface RawAppCallArgs {
  /** The address of any accounts to load in */
  accounts?: (string | Address)[]
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

/**
 * App call args for an ABI call
 */
export interface ABIAppCallArgs {
  /** The ABI method to call, either:
   *  * {method_name e.g. `hello`}; or
   *  * {method_signature e.g. `hello(string)string`} */
  method: ABIMethodParams | ABIMethod
  /** The ABI args to pass in */
  args: ABIArgument[]
  /** The optional lease for the transaction */
  lease?: string | Uint8Array
}

/** Arguments to pass to an app call either:
 *   * The raw app call values to pass through into the transaction (after processing); or
 *   * An ABI method definition (method and args)
 **/
export type AppCallArgs = RawAppCallArgs | ABIAppCallArgs

/** Base interface for common data passed to an app create or update. */
interface CreateOrUpdateAppParams extends SendTransactionParams {
  /** The account (with private key loaded) that will send the µALGOs */
  from: SendTransactionFrom
  /** The approval program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array) */
  approvalProgram: Uint8Array | string
  /** The clear state program as raw teal (string) or compiled teal, base 64 encoded as a byte array (Uint8Array) */
  clearStateProgram: Uint8Array | string
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
 * @param algod An algod client
 * @returns The details of the created app, or the transaction to create it if `skipSending`
 */
export async function createApp(create: CreateAppParams, algod: Algodv2): Promise<SendTransactionResult & AppReference> {
  const { from, approvalProgram: approval, clearStateProgram: clear, schema, note, transactionParams, args, ...sendParams } = create

  const approvalProgram = typeof approval === 'string' ? (await compileTeal(approval, algod)).compiledBase64ToBytes : approval
  const clearProgram = typeof clear === 'string' ? (await compileTeal(clear, algod)).compiledBase64ToBytes : clear

  const transaction = algosdk.makeApplicationCreateTxnFromObject({
    approvalProgram: approvalProgram,
    clearProgram: clearProgram,
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
    const appIndex = confirmation['application-index']!

    AlgoKitConfig.getLogger(sendParams.suppressLog).debug(`Created app ${appIndex} from creator ${getSenderAddress(from)}`)

    return { transaction, confirmation, appIndex, appAddress: algosdk.getApplicationAddress(appIndex) }
  } else {
    return { transaction, appIndex: 0, appAddress: '' }
  }
}

/**
 * Updates a smart contract app.
 * @param update The parameters to update the app with
 * @param algod An algod client
 * @returns The transaction
 */
export async function updateApp(update: UpdateAppParams, algod: Algodv2): Promise<SendTransactionResult> {
  const { appIndex, from, approvalProgram: approval, clearStateProgram: clear, note, transactionParams, args, ...sendParams } = update

  const approvalProgram = typeof approval === 'string' ? (await compileTeal(approval, algod)).compiledBase64ToBytes : approval
  const clearProgram = typeof clear === 'string' ? (await compileTeal(clear, algod)).compiledBase64ToBytes : clear

  const transaction = algosdk.makeApplicationUpdateTxnFromObject({
    appIndex,
    approvalProgram: approvalProgram,
    clearProgram: clearProgram,
    suggestedParams: await getTransactionParams(transactionParams, algod),
    from: getSenderAddress(from),
    note: encodeTransactionNote(note),
    ...getAppArgsForTransaction(args),
    rekeyTo: undefined,
  })

  AlgoKitConfig.getLogger(sendParams.suppressLog).debug(`Updating app ${appIndex}`)

  return await sendTransaction({ transaction, from, sendParams }, algod)
}

/**
 * Issues a call to a given app.
 * @param call The call details.
 * @param algod An algod client
 * @returns The result of the call
 */
export async function callApp(call: AppCallParams, algod: Algodv2): Promise<SendTransactionResult> {
  const { appIndex, callType, from, args, note, transactionParams, ...sendParams } = call

  const appCallParameters = {
    appIndex: appIndex,
    from: getSenderAddress(from),
    suggestedParams: await getTransactionParams(transactionParams, algod),
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

  return await sendTransaction({ transaction, from, sendParams }, algod)
}

/** Returns the app args ready to load onto an app @see {Transaction} object */
export function getAppArgsForTransaction(args?: AppCallArgs) {
  if (!args) return undefined

  let actualArgs: AppCallArgs
  if ('method' in args) {
    // todo: Land a change to algosdk that extract the logic from ATC, because (fair warning) this is a HACK
    // I don't want to have to rewrite all of the ABI resolution logic so using an ATC temporarily here
    // and passing stuff in to keep it happy like a randomly generated account :O
    // Most of these values aren't being used since the transaction is discarded
    const dummyAtc = new AtomicTransactionComposer()
    const dummyAccount = algosdk.generateAccount()
    const dummyAppId = 1
    const dummyParams = {
      fee: 1,
      firstRound: 1,
      genesisHash: Buffer.from('abcd', 'utf-8').toString('base64'),
      genesisID: 'a',
      lastRound: 1,
    }
    const dummyOnComplete = OnApplicationComplete.NoOpOC
    dummyAtc.addMethodCall({
      method: 'txnCount' in args.method ? args.method : new ABIMethod(args.method),
      methodArgs: args.args,
      // Rest are dummy values
      appID: dummyAppId,
      sender: dummyAccount.addr,
      signer: makeBasicAccountTransactionSigner(dummyAccount),
      suggestedParams: dummyParams,
      onComplete: dummyOnComplete,
    })
    const txn = dummyAtc.buildGroup()[0]
    actualArgs = {
      accounts: txn.txn.appAccounts,
      appArgs: txn.txn.appArgs,
      apps: txn.txn.appForeignApps,
      assets: txn.txn.appForeignAssets,
      boxes: txn.txn.boxes,
      lease: args.lease,
    }
  } else {
    actualArgs = args
  }

  const encoder = new TextEncoder()
  return {
    accounts: actualArgs?.accounts?.map((a) => (typeof a === 'string' ? a : algosdk.encodeAddress(a.publicKey))),
    appArgs: actualArgs?.appArgs?.map((a) => (typeof a === 'string' ? encoder.encode(a) : a)),
    boxes: actualArgs?.boxes?.map(
      (ref) =>
        ({
          appIndex: ref.appIndex,
          name: typeof ref.name === 'string' ? encoder.encode(ref.name) : ref.name,
        } as algosdk.BoxReference),
    ),
    foreignApps: actualArgs?.apps,
    foreignAssets: actualArgs?.assets,
    lease: typeof actualArgs?.lease === 'string' ? encoder.encode(actualArgs?.lease) : actualArgs?.lease,
  }
}

/**
 * Gets the current data for the given app from algod.
 *
 * @param appIndex The index of the app
 * @param algod An algod client
 * @returns The data about the app
 */
export async function getAppByIndex(appIndex: number, algod: Algodv2) {
  return (await algod.getApplicationByID(appIndex).do()) as ApplicationResponse
}

/**
 * Compiles the given TEAL using algod and returns the result.
 *
 * @param algod An algod client
 * @param tealCode The TEAL code
 * @returns The information about the compiled file
 */
export async function compileTeal(tealCode: string, algod: Algodv2): Promise<CompiledTeal> {
  const compiled = await algod.compile(tealCode).do()
  return {
    teal: tealCode,
    compiled: compiled.result,
    compiledHash: compiled.hash,
    compiledBase64ToBytes: new Uint8Array(Buffer.from(compiled.result, 'base64')),
  }
}
