import { ABIArgument, ABIMethod, ABIMethodParams, ABIType, ABIValue, Address, SourceMap, SuggestedParams, Transaction } from 'algosdk'
import { PendingTransactionResponse } from './algod'
import { SendTransactionFrom, SendTransactionParams, SendTransactionResult, TransactionNote, TransactionToSign } from './transaction'

/** The name of the TEAL template variable for deploy-time immutability control */
export const UPDATABLE_TEMPLATE_NAME = 'TMPL_UPDATABLE'

/** The name of the TEAL template variable for deploy-time permanence control */
export const DELETABLE_TEMPLATE_NAME = 'TMPL_DELETABLE'

/** The app create/update ARC-2 transaction note prefix */
export const APP_DEPLOY_NOTE_DAPP = 'ALGOKIT_DEPLOYER'

/** The maximum number of bytes in a single app code page */
export const APP_PAGE_MAX_SIZE = 2048

/** First 4 bytes of SHA-512/256 hash of "return" for retrieving ABI return values */
export const ABI_RETURN_PREFIX = new Uint8Array([21, 31, 124, 117])

/** Information about an Algorand app */
export interface AppReference {
  /** The id of the app */
  appId: number
  /** The Algorand address of the account associated with the app */
  appAddress: string
}

/**
 * A grouping of the app ID and name of the box in an Uint8Array
 */
export interface BoxReference {
  /**
   * A unique application id
   */
  appId: number
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

export type ABIAppCallArg = ABIArgument | TransactionToSign | Transaction

/**
 * App call args for an ABI call
 */
export interface ABIAppCallArgs {
  /** The ABI method to call, either:
   *  * `method_name` e.g. `hello`; or
   *  * `method_signature` e.g. `hello(string)string`
   **/
  method: ABIMethodParams | ABIMethod
  /** The ABI args to pass in */
  args: ABIAppCallArg[]
  /** The optional lease for the transaction */
  lease?: string | Uint8Array
  /** Any box references to load either as the box name (if for the current app) or the reference with app id */
  boxes?: (BoxReference | Uint8Array | string)[]
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
  /** The id of the app to update */
  appId: number
}

/** Parameters representing a call to an app. */
export interface AppCallParams extends SendTransactionParams {
  /** The id of the app to call */
  appId: number
  /** The type of call, everything except create (@see createApp ) and update (@see updateApp ) */
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
  /** Source map from the compilation */
  sourceMap: SourceMap
}

/** Result from calling an app */
export interface AppCallTransactionResult extends SendTransactionResult {
  /** All transactions sent as part of the app call (i.e. multiple if an ABI call is made which includes transaction arguments) */
  transactions: Transaction[]
  /** The responses if the transactions are sent and waited for */
  confirmations?: PendingTransactionResponse[]
  /** If an ABI method was called the processed return value */
  return?: ABIReturn
}

/** The return value of an ABI method call */
export type ABIReturn =
  | {
      rawReturnValue: Uint8Array
      returnValue: ABIValue
      decodeError: undefined
    }
  | { rawReturnValue: undefined; returnValue: undefined; decodeError: Error }

/**
 * The payload of the metadata to add to the transaction note when deploying an app, noting it will be prefixed with @see {APP_DEPLOY_NOTE_PREFIX}.
 */
export interface AppDeployMetadata {
  /** The unique name identifier of the app within the creator account */
  name: string
  /** The version of app that is / will be deployed */
  version: string
  /** Whether or not the app is deletable / permanent / unspecified */
  deletable?: boolean
  /** Whether or not the app is updatable / immutable / unspecified */
  updatable?: boolean
}

/** The metadata that can be collected about a deployed app */
export interface AppMetadata extends AppReference, AppDeployMetadata {
  /** The round the app was created */
  createdRound: number
  /** The last round that the app was updated */
  updatedRound: number
  /** The metadata when the app was created */
  createdMetadata: AppDeployMetadata
  /** Whether or not the app is deleted */
  deleted: boolean
}

/** A lookup of name -> Algorand app for a creator */
export interface AppLookup {
  creator: Readonly<string>
  apps: Readonly<{
    [name: string]: AppMetadata
  }>
}

/** Dictionary of deploy-time parameters to replace in a teal template.
 *
 * Note: Looks for `TMPL_{parameter}` for template replacements i.e. you can leave out the `TMPL_`.
 *
 */
export interface TealTemplateParams {
  [key: string]: string | bigint | number | Uint8Array
}

/** What action to perform when deploying an app and an update is detected in the TEAL code */
export enum OnUpdate {
  /** Fail the deployment */
  Fail,
  /** Update the app */
  UpdateApp,
  /** Delete the app and create a new one in its place */
  ReplaceApp,
}

/** What action to perform when deploying an app and a breaking schema change is detected */
export enum OnSchemaBreak {
  /** Fail the deployment */
  Fail,
  /** Delete the app and create a new one in its place */
  ReplaceApp,
}

/** The parameters to deploy an app */
export interface AppDeploymentParams extends Omit<CreateAppParams, 'args' | 'note' | 'skipSending' | 'skipWaiting' | 'atc'> {
  /** The deployment metadata */
  metadata: AppDeployMetadata
  /** Any deploy-time parameters to replace in the TEAL code */
  deployTimeParams?: TealTemplateParams
  /** What action to perform if a schema break is detected */
  onSchemaBreak?: 'replace' | 'fail' | OnSchemaBreak
  /** What action to perform if a TEAL update is detected */
  onUpdate?: 'update' | 'replace' | 'fail' | OnUpdate
  /** Optional cached value of the existing apps for the given creator */
  existingDeployments?: AppLookup
  /** Any args to pass to any create transaction that is issued as part of deployment */
  createArgs?: AppCallArgs
  /** Any args to pass to any update transaction that is issued as part of deployment */
  updateArgs?: AppCallArgs
  /** Any args to pass to any delete transaction that is issued as part of deployment */
  deleteArgs?: AppCallArgs
}

/** The result of compiling the approval and clear TEAL for an app */
export interface AppCompilationResult {
  /** The compilation result of approval */
  compiledApproval: CompiledTeal
  /** The compilation result of clear */
  compiledClear: CompiledTeal
}

/** Object holding app state values */
export interface AppState {
  [key: string]:
    | {
        value: number | bigint
        keyRaw: Uint8Array
        keyBase64: string
      }
    | {
        value: string
        valueRaw: Uint8Array
        valueBase64: string
        keyRaw: Uint8Array
        keyBase64: string
      }
}

/** The name of a box storage box */
export interface BoxName {
  /** Name in UTF-8 */
  name: string
  /** Name in binary bytes */
  nameRaw: Uint8Array
  /** Name in Base64 */
  nameBase64: string
}

/**
 * Parameters to get and decode a box value as an ABI type.
 */
export interface BoxValueRequestParams {
  /** The ID of the app return box names for */
  appId: number
  /** The name of the box to return either as a string, binary array or @see BoxName */
  boxName: string | Uint8Array | BoxName
  /** The ABI type to decode the value using */
  type: ABIType
}

/**
 * Parameters to get and decode a box value as an ABI type.
 */
export interface BoxValuesRequestParams {
  /** The ID of the app return box names for */
  appId: number
  /** The names of the boxes to return either as a string, binary array or @see BoxName */
  boxNames: (string | Uint8Array | BoxName)[]
  /** The ABI type to decode the value using */
  type: ABIType
}
