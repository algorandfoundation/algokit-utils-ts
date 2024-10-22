import algosdk from 'algosdk'
import { Buffer } from 'buffer'
import {
  callApp,
  compileTeal,
  createApp,
  getAppBoxNames,
  getAppBoxValue,
  getAppBoxValueFromABIType,
  getAppGlobalState,
  getAppLocalState,
  updateApp,
} from '../app'
import { deployApp, getCreatorAppsByName, performTemplateSubstitution, replaceDeployTimeControlParams } from '../app-deploy'
import { Config } from '../config'
import { legacySendTransactionBridge } from '../transaction/legacy-bridge'
import { encodeTransactionNote, getSenderAddress } from '../transaction/transaction'
import { binaryStartsWith } from '../util'
import { TransactionSignerAccount } from './account'
import { AlgorandClientInterface } from './algorand-client-interface'
import { AlgoAmount } from './amount'
import {
  ABIAppCallArg,
  ABIAppCallArgs,
  ABIReturn,
  AppCallArgs,
  AppCallTransactionResult,
  AppCallType,
  AppCompilationResult,
  AppMetadata,
  AppReference,
  AppReturn,
  AppState,
  AppStorageSchema,
  BoxName,
  DELETABLE_TEMPLATE_NAME,
  AppLookup as LegacyAppLookup,
  OnSchemaBreak,
  OnUpdate,
  RawAppCallArgs,
  SendAppTransactionResult,
  TealTemplateParams,
  UPDATABLE_TEMPLATE_NAME,
} from './app'
import {
  ABIStruct,
  Arc56Contract,
  Arc56Method,
  StorageKey,
  StorageMap,
  getABIDecodedValue,
  getABIEncodedValue,
  getABITupleFromABIStruct,
  getArc56Method,
  getArc56ReturnValue,
} from './app-arc56'
import { AppLookup } from './app-deployer'
import { AppManager, BoxIdentifier } from './app-manager'
import { AppSpec, arc32ToArc56 } from './app-spec'
import AlgoKitComposer, {
  AppCallMethodCall,
  AppCallParams,
  AppDeleteMethodCall,
  AppDeleteParams,
  AppMethodCall,
  AppMethodCallTransactionArgument,
  AppUpdateMethodCall,
  AppUpdateParams,
  CommonAppCallParams,
  PaymentParams,
} from './composer'
import { Expand } from './expand'
import { EventType } from './lifecycle-events'
import { LogicError } from './logic-error'
import { SendParams, SendTransactionFrom, SendTransactionParams, TransactionNote } from './transaction'
import ABIMethod = algosdk.ABIMethod
import ABIMethodParams = algosdk.ABIMethodParams
import ABIType = algosdk.ABIType
import ABIValue = algosdk.ABIValue
import Algodv2 = algosdk.Algodv2
import AtomicTransactionComposer = algosdk.AtomicTransactionComposer
import getApplicationAddress = algosdk.getApplicationAddress
import Indexer = algosdk.Indexer
import OnApplicationComplete = algosdk.OnApplicationComplete
import SourceMap = algosdk.SourceMap
import SuggestedParams = algosdk.SuggestedParams
import TransactionSigner = algosdk.TransactionSigner

/** Configuration to resolve app by creator and name `getCreatorAppsByName` */
export type ResolveAppByCreatorAndNameBase = {
  /** The address of the app creator account to resolve the app by */
  creatorAddress: string
  /** The optional name override to resolve the app by within the creator account (default: uses the name in the ABI contract) */
  name?: string
  /** The mechanism to find an existing app instance metadata for the given creator and name; either:
   *  * An indexer instance to search the creator account apps; or
   *  * The cached value of the existing apps for the given creator from `getCreatorAppsByName`
   */
  findExistingUsing: Indexer | LegacyAppLookup
}

/** Configuration to resolve app by creator and name `getCreatorAppsByName` */
export type ResolveAppByCreatorAndName = ResolveAppByCreatorAndNameBase & {
  /** How the app ID is resolved, either by `'id'` or `'creatorAndName'`; must be `'creatorAndName'` if you want to use `deploy` */
  resolveBy: 'creatorAndName'
}

/** Configuration to resolve app by ID */
export interface ResolveAppByIdBase {
  /** The id of an existing app to call using this client, or 0 if the app hasn't been created yet */
  id: number | bigint
  /** The optional name to use to mark the app when deploying `ApplicationClient.deploy` (default: uses the name in the ABI contract) */
  name?: string
}

export interface ResolveAppById extends ResolveAppByIdBase {
  /** How the app ID is resolved, either by `'id'` or `'creatorAndName'`; must be `'creatorAndName'` if you want to use `deploy` */
  resolveBy: 'id'
}

/** The details of an AlgoKit Utils deployed app */
export type AppDetailsBase = {
  /** Default sender to use for transactions issued by this application client */
  sender?: SendTransactionFrom
  /** Default suggested params object to use */
  params?: SuggestedParams
  /** Optionally provide any deploy-time parameters to replace in the TEAL code; if specified here will get
   * used in calls to `deploy`, `create` and `update` unless overridden in those calls
   */
  deployTimeParams?: TealTemplateParams
}

/** The details of an AlgoKit Utils deployed app */
export type AppDetails = AppDetailsBase & (ResolveAppById | ResolveAppByCreatorAndName)

/** The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app */
export type AppSpecAppDetailsBase = {
  /** The ARC-0032 application spec as either:
   *  * Parsed JSON `AppSpec`
   *  * Raw JSON string
   */
  app: AppSpec | string
}

/** The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app by id*/
export type AppSpecAppDetailsById = AppSpecAppDetailsBase & AppDetailsBase & ResolveAppByIdBase

/** The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app by creator and name*/
export type AppSpecAppDetailsByCreatorAndName = AppSpecAppDetailsBase & AppDetailsBase & ResolveAppByCreatorAndNameBase

/** The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app */
export type AppSpecAppDetails = AppSpecAppDetailsBase & AppDetails

/** Core parameters to pass into ApplicationClient.deploy */
export interface AppClientDeployCoreParams {
  /** The version of the contract, uses "1.0" by default */
  version?: string
  /** The optional sender to send the transaction from, will use the application client's default sender by default if specified */
  sender?: SendTransactionFrom
  /** Parameters to control transaction sending */
  sendParams?: Omit<SendTransactionParams, 'skipSending' | 'skipWaiting'>
  /** Whether or not to allow updates in the contract using the deploy-time updatability control if present in your contract.
   * If this is not specified then it will automatically be determined based on the AppSpec definition
   **/
  allowUpdate?: boolean
  /** Whether or not to allow deletes in the contract using the deploy-time deletability control if present in your contract.
   * If this is not specified then it will automatically be determined based on the AppSpec definition
   **/
  allowDelete?: boolean
  /** What action to perform if a schema break is detected */
  onSchemaBreak?: 'replace' | 'fail' | 'append' | OnSchemaBreak
  /** What action to perform if a TEAL update is detected */
  onUpdate?: 'update' | 'replace' | 'append' | 'fail' | OnUpdate
}

/** Call interface parameters to pass into ApplicationClient.deploy */
export interface AppClientDeployCallInterfaceParams {
  /** Any deploy-time parameters to replace in the TEAL code */
  deployTimeParams?: TealTemplateParams
  /** Any args to pass to any create transaction that is issued as part of deployment */
  createArgs?: AppClientCallArgs
  /** Override the on-completion action for the create call; defaults to NoOp */
  createOnCompleteAction?: Exclude<AppCallType, 'clear_state'> | Exclude<OnApplicationComplete, OnApplicationComplete.ClearStateOC>
  /** Any args to pass to any update transaction that is issued as part of deployment */
  updateArgs?: AppClientCallArgs
  /** Any args to pass to any delete transaction that is issued as part of deployment */
  deleteArgs?: AppClientCallArgs
}

/** Parameters to pass into ApplicationClient.deploy */
export interface AppClientDeployParams extends AppClientDeployCoreParams, AppClientDeployCallInterfaceParams {
  /** Any overrides for the storage schema to request for the created app; by default the schema indicated by the app spec is used. */
  schema?: Partial<AppStorageSchema>
}

export interface AppClientCallRawArgs extends RawAppCallArgs {}

export interface AppClientCallABIArgs extends Omit<ABIAppCallArgs, 'method'> {
  /** If calling an ABI method then either the name of the method, or the ABI signature */
  method: string
}

/** The arguments to pass to an Application Client smart contract call */
export type AppClientCallArgs = AppClientCallRawArgs | AppClientCallABIArgs

/** Common (core) parameters to construct a ApplicationClient contract call */
export interface AppClientCallCoreParams {
  /** The optional sender to send the transaction from, will use the application client's default sender by default if specified */
  sender?: SendTransactionFrom
  /** The transaction note for the smart contract call */
  note?: TransactionNote
  /** Parameters to control transaction sending */
  sendParams?: SendTransactionParams
}

/** Parameters to construct a ApplicationClient contract call */
export type AppClientCallParams = AppClientCallArgs & AppClientCallCoreParams

/** Parameters to construct a ApplicationClient clear state contract call */
export type AppClientClearStateParams = AppClientCallRawArgs & AppClientCallCoreParams

export interface AppClientCompilationParams {
  /** Any deploy-time parameters to replace in the TEAL code */
  deployTimeParams?: TealTemplateParams
  /** Whether or not the contract should have deploy-time immutability control set, undefined = ignore */
  updatable?: boolean
  /** Whether or not the contract should have deploy-time permanence control set, undefined = ignore */
  deletable?: boolean
}

/** On-complete action parameter for creating a contract using ApplicationClient */
export type AppClientCreateOnComplete = {
  /** Override the on-completion action for the create call; defaults to NoOp */
  onCompleteAction?: Exclude<AppCallType, 'clear_state'> | Exclude<OnApplicationComplete, OnApplicationComplete.ClearStateOC>
}

/** Parameters for creating a contract using ApplicationClient */
export type AppClientCreateParams = AppClientCallParams &
  AppClientCompilationParams &
  AppClientCreateOnComplete & {
    /** Any overrides for the storage schema to request for the created app; by default the schema indicated by the app spec is used. */
    schema?: Partial<AppStorageSchema>
  }

/** Parameters for updating a contract using ApplicationClient */
export type AppClientUpdateParams = AppClientCallParams & AppClientCompilationParams

/** Parameters for funding an app account */
export interface FundAppAccountParams {
  amount: AlgoAmount
  /** The optional sender to send the transaction from, will use the application client's default sender by default if specified */
  sender?: SendTransactionFrom
  /** The transaction note for the smart contract call */
  note?: TransactionNote
  /** Parameters to control transaction sending */
  sendParams?: SendTransactionParams
}

/** Source maps for an Algorand app */
export interface AppSourceMaps {
  /** The source map of the approval program */
  approvalSourceMap: SourceMapExport
  /** The source map of the clear program */
  clearSourceMap: SourceMapExport
}

export interface SourceMapExport {
  version: number
  sources: string[]
  names: string[]
  mappings: string
}

/**
 * The result of asking an `AppClient` to compile a program.
 *
 * Always contains the compiled bytecode, and may contain the result of compiling TEAL (including sourcemap) if it was available.
 */
export interface AppClientCompilationResult extends Partial<AppCompilationResult> {
  /** The compiled bytecode of the approval program, ready to deploy to algod */
  approvalProgram: Uint8Array
  /** The compiled bytecode of the clear state program, ready to deploy to algod */
  clearStateProgram: Uint8Array
}

/**
 * Determines deploy time control (UPDATABLE, DELETABLE) value by inspecting application specification
 * @param approval TEAL Approval program, not the base64 version found on the appSpec
 * @param appSpec Application Specification
 * @param templateVariableName Template variable
 * @param callConfigKey Call config type
 * @returns true if applicable call config is found, false if not found or undefined if variable not present
 */
function getDeployTimeControl(
  approval: string,
  appSpec: AppSpec,
  templateVariableName: string,
  callConfigKey: 'update_application' | 'delete_application',
): boolean | undefined {
  // variable not present, so unknown control value
  if (!approval.includes(templateVariableName)) return undefined

  // a bare call for specified CallConfig is present and configured
  const bareCallConfig = appSpec.bare_call_config[callConfigKey]
  if (!!bareCallConfig && bareCallConfig !== 'NEVER') return true

  // an ABI call for specified CallConfig is present and configured
  return Object.values(appSpec.hints).some((h) => {
    const abiCallConfig = h.call_config[callConfigKey]
    return !!abiCallConfig && abiCallConfig !== 'NEVER'
  })
}

/** Parameters to create an app client */
export interface AppClientParams {
  /** The ID of the app instance this client should make calls against. */
  appId: bigint

  /** The ARC-56 or ARC-32 application spec as either:
   *  * Parsed JSON ARC-56 `Contract`
   *  * Parsed JSON ARC-32 `AppSpec`
   *  * Raw JSON string (in either ARC-56 or ARC-32 format)
   */
  appSpec: Arc56Contract | AppSpec | string

  /** An `AlgorandClient` instance */
  algorand: AlgorandClientInterface

  /**
   * Optional override for the app name; used for on-chain metadata and lookups.
   * Defaults to the ARC-32/ARC-56 app spec name
   */
  appName?: string
  /** Optional address to use for the account to use as the default sender for calls. */
  defaultSender?: string
  /** Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`). */
  defaultSigner?: TransactionSigner
  /** Optional source map for the approval program */
  approvalSourceMap?: SourceMap
  /** Optional source map for the clear state program */
  clearSourceMap?: SourceMap
}

/** onComplete parameter for a non-update app call */
export type CallOnComplete = {
  /** On-complete of the call; defaults to no-op */
  onComplete?: Exclude<OnApplicationComplete, OnApplicationComplete.UpdateApplicationOC>
}

/** AppClient common parameters for a bare app call */
export type AppClientBareCallParams = Expand<
  Omit<CommonAppCallParams, 'appId' | 'sender' | 'onComplete'> & {
    /** The address of the account sending the transaction, if undefined then the app client's defaultSender is used. */
    sender?: string
  }
>

/** AppClient common parameters for an ABI method call */
export type AppClientMethodCallParams = Expand<
  Omit<CommonAppCallParams, 'appId' | 'sender' | 'method' | 'args'> & {
    /** The address of the account sending the transaction, if undefined then the app client's defaultSender is used. */
    sender?: string
    /** The method name or method signature to call if an ABI call is being emitted
     * @example Method name
     * `my_method`
     * @example Method signature
     * `my_method(unit64,string)bytes`
     */
    method: string
    /** Arguments to the ABI method, either:
     * * An ABI value
     * * An ARC-56 struct
     * * A transaction with explicit signer
     * * A transaction (where the signer will be automatically assigned)
     * * An unawaited transaction (e.g. from algorand.createTransaction.transactionType())
     * * Another method call (via method call params object)
     * * undefined (this represents a placeholder for either a default argument or a transaction argument that is fulfilled by another method call argument)
     */
    args?: (ABIValue | ABIStruct | AppMethodCallTransactionArgument | undefined)[]
  }
>

/** Parameters for funding an app account */
export type FundAppParams = Expand<
  Omit<PaymentParams, 'receiver' | 'sender'> &
    SendParams & {
      /** The optional sender to send the transaction from, will use the application client's default sender by default if specified */
      sender?: string
    }
>

/** Resolve an app client instance by looking up an app created by the given creator with the given name */
export type ResolveAppClientByCreatorAndName = Expand<
  Omit<AppClientParams, 'appId'> & {
    /** The address of the creator account for the app */
    creatorAddress: string
    /** An optional cached app lookup that matches a name to on-chain details;
     * either this is needed or indexer is required to be passed in to this `ClientManager` on construction.
     */
    appLookupCache?: AppLookup
    /** Whether or not to ignore the `AppDeployer` lookup cache and force an on-chain lookup, default: use any cached value */
    ignoreCache?: boolean
  }
>

/** Resolve an app client instance by looking up the current network. */
export type ResolveAppClientByNetwork = Expand<Omit<AppClientParams, 'appId'>>

const BYTE_CBLOCK = 38
const INT_CBLOCK = 32

function getConstantBlockOffsets(program: Uint8Array) {
  const bytes = [...program]

  const programSize = bytes.length
  bytes.shift() // remove version
  const offsets: { bytecblockOffset?: number; intcblockOffset?: number; cblocksOffset: number } = { cblocksOffset: 0 }

  while (bytes.length > 0) {
    const byte = bytes.shift()!

    if (byte === BYTE_CBLOCK || byte === INT_CBLOCK) {
      const isBytecblock = byte === BYTE_CBLOCK
      const valuesRemaining = bytes.shift()!

      for (let i = 0; i < valuesRemaining; i++) {
        if (isBytecblock) {
          // byte is the length of the next element
          bytes.splice(0, bytes.shift()!)
        } else {
          // intcblock is a uvarint, so we need to keep reading until we find the end (MSB is not set)
          while ((bytes.shift()! & 0x80) !== 0) {}
        }
      }

      offsets[isBytecblock ? 'bytecblockOffset' : 'intcblockOffset'] = programSize - bytes.length - 1

      if (bytes[0] !== BYTE_CBLOCK && bytes[0] !== INT_CBLOCK) {
        // if the next opcode isn't a constant block, we're done
        break
      }
    }
  }

  offsets.cblocksOffset = Math.max(...Object.values(offsets))
  return offsets
}

/** ARC-56/ARC-32 application client that allows you to manage calls and
 * state for a specific deployed instance of an app (with a known app ID). */
export class AppClient {
  private _appId: bigint
  private _appAddress: string
  private _appName: string
  private _appSpec: Arc56Contract
  private _algorand: AlgorandClientInterface
  private _defaultSender?: string
  private _defaultSigner?: TransactionSigner

  private _approvalSourceMap: SourceMap | undefined
  private _clearSourceMap: SourceMap | undefined

  private _localStateMethods: (address: string) => ReturnType<AppClient['getStateMethods']>
  private _globalStateMethods: ReturnType<AppClient['getStateMethods']>
  private _boxStateMethods: ReturnType<AppClient['getBoxMethods']>

  private _paramsMethods: ReturnType<AppClient['getMethodCallParamsMethods']> & {
    /** Interact with bare (raw) call parameters */ bare: ReturnType<AppClient['getBareParamsMethods']>
  }
  private _createTransactionsMethods: ReturnType<AppClient['getMethodCallCreateTransactionMethods']> & {
    /** Interact with bare (raw) call transactions */ bare: ReturnType<AppClient['getBareCreateTransactionMethods']>
  }
  private _sendMethods: ReturnType<AppClient['getMethodCallSendMethods']> & {
    /** Interact with bare (raw) calls */ bare: ReturnType<AppClient['getBareSendMethods']>
  }

  constructor(params: AppClientParams) {
    this._appId = params.appId
    this._appAddress = algosdk.getApplicationAddress(this._appId)
    this._appSpec = AppClient.normaliseAppSpec(params.appSpec)
    this._appName = params.appName ?? this._appSpec.name
    this._algorand = params.algorand
    this._defaultSender = params.defaultSender
    this._defaultSigner = params.defaultSigner

    this._approvalSourceMap = params.approvalSourceMap
    this._clearSourceMap = params.clearSourceMap
    this._localStateMethods = (address: string) =>
      this.getStateMethods(
        () => this.getLocalState(address),
        () => this._appSpec.state.keys.local,
        () => this._appSpec.state.maps.local,
      )
    this._globalStateMethods = this.getStateMethods(
      () => this.getGlobalState(),
      () => this._appSpec.state.keys.global,
      () => this._appSpec.state.maps.global,
    )
    this._boxStateMethods = this.getBoxMethods()

    this._paramsMethods = {
      ...this.getMethodCallParamsMethods(),
      /** Get parameters to define bare (raw) transactions to the current app */
      bare: this.getBareParamsMethods(),
    }
    this._createTransactionsMethods = {
      ...this.getMethodCallCreateTransactionMethods(),

      /** Get transactions for bare (raw) calls to the current app */
      bare: this.getBareCreateTransactionMethods(),
    }
    this._sendMethods = {
      ...this.getMethodCallSendMethods(),

      /** Send bare (raw) transactions to the current app */
      bare: this.getBareSendMethods(),
    }
  }

  /** Start a new `AlgoKitComposer` transaction group */
  public newGroup(): AlgoKitComposer {
    return this._algorand.newGroup()
  }

  /**
   * Returns a new `AppClient` client, resolving the app by creator address and name
   * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
   * @param params The parameters to create the app client
   */
  public static async fromCreatorAndName(params: ResolveAppClientByCreatorAndName) {
    const appSpec = AppClient.normaliseAppSpec(params.appSpec)
    const appLookup =
      params.appLookupCache ?? (await params.algorand.appDeployer.getCreatorAppsByName(params.creatorAddress, params.ignoreCache))
    const appMetadata = appLookup.apps[params.appName ?? appSpec.name]
    if (!appMetadata) {
      throw new Error(`App not found for creator ${params.creatorAddress} and name ${params.appName ?? appSpec.name}`)
    }
    return new AppClient({
      ...params,
      algorand: params.algorand,
      appId: appMetadata.appId,
    })
  }

  /**
   * Returns an `AppClient` instance for the current network based on
   * pre-determined network-specific app IDs specified in the ARC-56 app spec.
   *
   * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
   * @param params The parameters to create the app client
   */
  public static async fromNetwork(params: ResolveAppClientByNetwork): Promise<AppClient> {
    const network = await params.algorand.client.network()
    const appSpec = AppClient.normaliseAppSpec(params.appSpec)
    const networkNames = [network.genesisHash]
    if (network.isLocalNet) networkNames.push('localnet')
    if (network.isTestNet) networkNames.push('testnet')
    if (network.isMainNet) networkNames.push('mainnet')
    const availableAppSpecNetworks = Object.keys(appSpec.networks ?? {})
    const networkIndex = availableAppSpecNetworks.findIndex((n) => networkNames.includes(n))

    if (networkIndex === -1) {
      throw new Error(`No app ID found for network ${JSON.stringify(networkNames)} in the app spec`)
    }

    const appId = BigInt(appSpec.networks![networkIndex].appID)
    return new AppClient({ ...params, appId, appSpec })
  }

  /**
   * Takes a string or parsed JSON object that could be ARC-32 or ARC-56 format and
   * normalises it into a parsed ARC-56 contract object.
   * @param spec The spec to normalise
   * @returns The normalised ARC-56 contract object
   */
  public static normaliseAppSpec(spec: Arc56Contract | AppSpec | string): Arc56Contract {
    const parsedSpec = typeof spec === 'string' ? (JSON.parse(spec) as AppSpec | Arc56Contract) : spec
    const appSpec = 'hints' in parsedSpec ? arc32ToArc56(parsedSpec) : parsedSpec
    return appSpec
  }

  /** The ID of the app instance this client is linked to. */
  public get appId() {
    return this._appId
  }

  /** The app address of the app instance this client is linked to. */
  public get appAddress() {
    return this._appAddress
  }

  /** The name of the app (from the ARC-32 / ARC-56 app spec). */
  public get appName() {
    return this._appName
  }

  /** The ARC-56 app spec being used */
  public get appSpec(): Arc56Contract {
    return this._appSpec
  }

  /** A reference to the underlying `AlgorandClient` this app client is using. */
  public get algorand(): AlgorandClientInterface {
    return this._algorand
  }

  /** Get parameters to create transactions for the current app.
   *
   * A good mental model for this is that these parameters represent a deferred transaction creation.
   * @example Create a transaction in the future using Algorand Client
   * ```typescript
   * const myMethodCall = appClient.params.call({method: 'my_method', args: [123, 'hello']})
   * // ...
   * await algorand.send.AppMethodCall(myMethodCall)
   * ```
   * @example Define a nested transaction as an ABI argument
   * ```typescript
   * const myMethodCall = appClient.params.call({method: 'my_method', args: [123, 'hello']})
   * await appClient.send.call({method: 'my_method2', args: [myMethodCall]})
   * ```
   */
  public get params() {
    return this._paramsMethods
  }

  /** Create transactions for the current app */
  public get createTransaction() {
    return this._createTransactionsMethods
  }

  /** Send transactions to the current app */
  public get send() {
    return this._sendMethods
  }

  /** Get state (local, global, box) from the current app */
  public get state() {
    return {
      /**
       * Methods to access local state for the current app
       * @param address The address of the account to get the local state for
       */
      local: this._localStateMethods,
      /**
       * Methods to access global state for the current app
       */
      global: this._globalStateMethods,
      /**
       * Methods to access box storage for the current app
       */
      box: this._boxStateMethods,
    }
  }

  /**
   * Funds Algo into the app account for this app.
   *
   * An alias for `appClient.send.fundAppAccount(params)`.
   * @param params The parameters for the funding transaction
   * @returns The result of the funding
   */
  public async fundAppAccount(params: FundAppParams) {
    return this.send.fundAppAccount(params)
  }

  /**
   * Returns raw global state for the current app.
   * @returns The global state
   */
  public async getGlobalState(): Promise<AppState> {
    return await this._algorand.app.getGlobalState(this.appId)
  }

  /**
   * Returns raw local state for the given account address.
   * @param address The address of the account to get the local state for
   * @returns The local state
   */
  public async getLocalState(address: string): Promise<AppState> {
    return await this._algorand.app.getLocalState(this.appId, address)
  }

  /**
   * Returns the names of all current boxes for the current app.
   * @returns The names of the boxes
   */
  public async getBoxNames(): Promise<BoxName[]> {
    return await this._algorand.app.getBoxNames(this.appId)
  }

  /**
   * Returns the value of the given box for the current app.
   * @param name The identifier of the box to return
   * @returns The current box value as a byte array
   */
  public async getBoxValue(name: BoxIdentifier): Promise<Uint8Array> {
    return await this._algorand.app.getBoxValue(this.appId, name)
  }

  /**
   * Returns the value of the given box for the current app.
   * @param name The identifier of the box to return
   * @param type
   * @returns The current box value as a byte array
   */
  public async getBoxValueFromABIType(name: BoxIdentifier, type: ABIType): Promise<ABIValue> {
    return await this._algorand.app.getBoxValueFromABIType({
      appId: this.appId,
      boxName: name,
      type,
    })
  }

  /**
   * Returns the values of all current boxes for the current app.
   * Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.
   * @param filter Optional filter to filter which boxes' values are returned
   * @returns The (name, value) pair of the boxes with values as raw byte arrays
   */
  public async getBoxValues(filter?: (name: BoxName) => boolean): Promise<{ name: BoxName; value: Uint8Array }[]> {
    const names = (await this.getBoxNames()).filter(filter ?? ((_) => true))
    const values = await this._algorand.app.getBoxValues(
      this.appId,
      names.map((name) => name.nameRaw),
    )
    return names.map((name, i) => ({ name, value: values[i] }))
  }

  /**
   * Returns the values of all current boxes for the current app decoded using an ABI Type.
   * Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.
   * @param type The ABI type to decode the values with
   * @param filter Optional filter to filter which boxes' values are returned
   * @returns The (name, value) pair of the boxes with values as the ABI Value
   */
  public async getBoxValuesFromABIType(type: ABIType, filter?: (name: BoxName) => boolean): Promise<{ name: BoxName; value: ABIValue }[]> {
    const names = (await this.getBoxNames()).filter(filter ?? ((_) => true))
    const values = await this._algorand.app.getBoxValuesFromABIType({
      appId: this.appId,
      boxNames: names.map((name) => name.nameRaw),
      type,
    })
    return names.map((name, i) => ({ name, value: values[i] }))
  }

  /**
   * Takes an error that may include a logic error from a call to the current app and re-exposes the
   * error to include source code information via the source map and ARC-56 spec.
   * @param e The error to parse
   * @param isClearStateProgram Whether or not the code was running the clear state program (defaults to approval program)
   * @returns The new error, or if there was no logic error or source map then the wrapped error with source details
   */
  public async exposeLogicError(e: Error, isClearStateProgram?: boolean): Promise<Error> {
    const pcOffsetMethod = this._appSpec.sourceInfo?.[isClearStateProgram ? 'clear' : 'approval']?.pcOffsetMethod

    let program: Uint8Array | undefined
    if (pcOffsetMethod === 'cblocks') {
      // TODO: Cache this if we deploy the app and it's not updateable
      const appInfo = await this._algorand.app.getById(this.appId)
      program = isClearStateProgram ? appInfo.clearStateProgram : appInfo.approvalProgram
    }

    return AppClient.exposeLogicError(e, this._appSpec, {
      isClearStateProgram,
      approvalSourceMap: this._approvalSourceMap,
      clearSourceMap: this._clearSourceMap,
      program,
    })
  }

  /**
   * Export the current source maps for the app.
   * @returns The source maps
   */
  public exportSourceMaps(): AppSourceMaps {
    if (!this._approvalSourceMap || !this._clearSourceMap) {
      throw new Error(
        "Unable to export source maps; they haven't been loaded into this client - you need to call create, update, or deploy first",
      )
    }

    return {
      approvalSourceMap: this._approvalSourceMap,
      clearSourceMap: this._clearSourceMap,
    }
  }

  /**
   * Import source maps for the app.
   * @param sourceMaps The source maps to import
   */
  public importSourceMaps(sourceMaps: AppSourceMaps) {
    this._approvalSourceMap = new SourceMap(sourceMaps.approvalSourceMap)
    this._clearSourceMap = new SourceMap(sourceMaps.clearSourceMap)
  }

  /**
   * Returns the ABI Method spec for the given method string for the app represented by this application client instance
   * @param methodNameOrSignature The method name or method signature to call if an ABI call is being emitted.
   * e.g. `my_method` or `my_method(unit64,string)bytes`
   * @returns A tuple with: [ARC-56 `Method`, algosdk `ABIMethod`]
   */
  public getABIMethod(methodNameOrSignature: string) {
    return getArc56Method(methodNameOrSignature, this._appSpec)
  }

  /**
   * Checks for decode errors on the SendAppTransactionResult and maps the return value to the specified type
   * on the ARC-56 method, replacing the `return` property with the decoded type.
   *
   * If the return type is an ARC-56 struct then the struct will be returned.
   *
   * @param result The SendAppTransactionResult to be mapped
   * @param method The method that was called
   * @returns The smart contract response with an updated return value
   */
  public async processMethodCallReturn<
    TReturn extends Uint8Array | ABIValue | ABIStruct | undefined,
    TResult extends SendAppTransactionResult = SendAppTransactionResult,
  >(result: Promise<TResult> | TResult, method: Arc56Method): Promise<Omit<TResult, 'return'> & AppReturn<TReturn>> {
    const resultValue = await result
    return { ...resultValue, return: getArc56ReturnValue(resultValue.return, method, this._appSpec.structs) }
  }

  /**
   * Compiles the approval and clear state programs (if TEAL templates provided),
   * performing any provided deploy-time parameter replacement and stores
   * the source maps.
   *
   * If no TEAL templates provided it will use any byte code provided in the app spec.
   *
   * Will store any generated source maps for later use in debugging.
   */
  public async compile(compilation?: AppClientCompilationParams) {
    const result = await AppClient.compile(this._appSpec, this._algorand.app, compilation)

    if (result.compiledApproval) {
      this._approvalSourceMap = result.compiledApproval.sourceMap
    }
    if (result.compiledClear) {
      this._clearSourceMap = result.compiledClear.sourceMap
    }

    return result
  }

  /**
   * Takes an error that may include a logic error from a call to the current app and re-exposes the
   * error to include source code information via the source map and ARC-56 spec.
   * @param e The error to parse
   * @param appSpec The app spec for the app
   * @param details Additional information to inform the error
   * @returns The new error, or if there was no logic error or source map then the wrapped error with source details
   */
  public static exposeLogicError(
    e: Error,
    appSpec: Arc56Contract,
    details: {
      /** Whether or not the code was running the clear state program (defaults to approval program) */ isClearStateProgram?: boolean
      /** Approval program source map */ approvalSourceMap?: SourceMap
      /** Clear state program source map */ clearSourceMap?: SourceMap
      /** program bytes */ program?: Uint8Array
    },
  ): Error {
    const { isClearStateProgram, approvalSourceMap, clearSourceMap, program } = details
    if ((!isClearStateProgram && approvalSourceMap == undefined) || (isClearStateProgram && clearSourceMap == undefined)) return e

    const errorDetails = LogicError.parseLogicError(e)

    const programSourceInfo = isClearStateProgram ? appSpec.sourceInfo?.clear : appSpec.sourceInfo?.approval

    let errorMessage: string | undefined

    if (programSourceInfo?.pcOffsetMethod === 'none') {
      errorMessage = programSourceInfo.sourceInfo.find((s) => s.pc.includes(errorDetails?.pc ?? -1))?.errorMessage
    } else if (programSourceInfo?.pcOffsetMethod === 'cblocks' && program !== undefined && errorDetails?.pc !== undefined) {
      const { cblocksOffset } = getConstantBlockOffsets(program)
      const offsetPc = errorDetails.pc - cblocksOffset

      errorMessage = programSourceInfo.sourceInfo.find((s) => s.pc.includes(offsetPc))?.errorMessage
    }

    if (errorDetails !== undefined && appSpec.source)
      e = new LogicError(
        errorDetails,
        Buffer.from(isClearStateProgram ? appSpec.source.clear : appSpec.source.approval, 'base64')
          .toString()
          .split('\n'),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        isClearStateProgram ? clearSourceMap! : approvalSourceMap!,
      )
    if (errorMessage) {
      const appId = JSON.stringify(e).match(/(?<=app=)\d+/)?.[0] || ''
      const txId = JSON.stringify(e).match(/(?<=transaction )\S+(?=:)/)?.[0]
      const error = new Error(`Runtime error when executing ${appSpec.name} (appId: ${appId}) in transaction ${txId}: ${errorMessage}`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(error as any).cause = e
      return error
    }

    return e
  }

  /**
   * Compiles the approval and clear state programs (if TEAL templates provided),
   * performing any provided deploy-time parameter replacement and returns
   * the compiled code and any compilation results (including source maps).
   *
   * If no TEAL templates provided it will use any byte code provided in the app spec.
   *
   * Will store any generated source maps for later use in debugging.
   * @param appSpec The app spec for the app
   * @param compilation Any compilation parameters to use
   */
  public static async compile(
    appSpec: Arc56Contract,
    appManager: AppManager,
    compilation?: AppClientCompilationParams,
  ): Promise<AppClientCompilationResult> {
    const { deployTimeParams, updatable, deletable } = compilation ?? {}

    if (!appSpec.source) {
      if (!appSpec.byteCode?.approval || !appSpec.byteCode?.clear) {
        throw new Error(`Attempt to compile app ${appSpec.name} without source or byteCode`)
      }

      return {
        approvalProgram: Buffer.from(appSpec.byteCode.approval, 'base64') as Uint8Array,
        clearStateProgram: Buffer.from(appSpec.byteCode.clear, 'base64') as Uint8Array,
      }
    }

    const approvalTemplate = Buffer.from(appSpec.source.approval, 'base64').toString('utf-8')
    const compiledApproval = await appManager.compileTealTemplate(approvalTemplate, deployTimeParams, {
      updatable,
      deletable,
    })

    const clearTemplate = Buffer.from(appSpec.source.clear, 'base64').toString('utf-8')
    const compiledClear = await appManager.compileTealTemplate(clearTemplate, deployTimeParams)

    if (Config.debug) {
      await Config.events.emitAsync(EventType.AppCompiled, {
        sources: [
          { compiledTeal: compiledApproval, appName: appSpec.name, fileName: 'approval' },
          { compiledTeal: compiledClear, appName: appSpec.name, fileName: 'clear' },
        ],
      })
    }

    return {
      approvalProgram: compiledApproval.compiledBase64ToBytes,
      compiledApproval,
      clearStateProgram: compiledClear.compiledBase64ToBytes,
      compiledClear,
    }
  }

  /**
   * Returns ABI method arguments ready for a method call params object with default values populated
   * and structs replaced with tuples.
   *
   * It does this by replacing any `undefined` values with the equivalent default value from the given ARC-56 app spec.
   * @param methodNameOrSignature The method name or method signature to call if an ABI call is being emitted.
   * e.g. `my_method` or `my_method(unit64,string)bytes`
   * @param args The arguments to the method with `undefined` for any that should be populated with a default value
   */
  private async getABIArgsWithDefaultValues(
    methodNameOrSignature: string,
    args: AppClientMethodCallParams['args'] | undefined,
    sender: string,
  ): Promise<AppMethodCall<CommonAppCallParams>['args']> {
    const m = getArc56Method(methodNameOrSignature, this._appSpec)
    return await Promise.all(
      args?.map(async (a, i) => {
        const arg = m.args[i]
        if (a !== undefined) {
          // If a struct then convert to tuple for the underlying call
          return arg.struct && typeof a === 'object' && !Array.isArray(a)
            ? getABITupleFromABIStruct(a as ABIStruct, this._appSpec.structs[arg.struct], this._appSpec.structs)
            : (a as ABIValue | AppMethodCallTransactionArgument)
        }
        const defaultValue = arg.defaultValue
        if (defaultValue) {
          switch (defaultValue.source) {
            case 'literal':
              if (typeof defaultValue.data === 'number') return defaultValue.data
              return getABIDecodedValue(
                Buffer.from(defaultValue.data, 'base64'),
                m.method.args[i].defaultValue?.type ?? m.method.args[i].type,
                this._appSpec.structs,
              ) as ABIValue
            // todo: When ARC-56 supports ABI calls as default args
            // case 'abi': {
            //   const method = this.getABIMethod(defaultValue.data as string)
            //   const result = await this.send.call({
            //     method: defaultValue.data as string,
            //     methodArgs: method.args.map(() => undefined),
            //     sender,
            //   })
            //   return result.return!
            // }
            case 'local':
            case 'global': {
              const state = defaultValue.source === 'global' ? await this.getGlobalState() : await this.getLocalState(sender)
              const value = Object.values(state).find((s) => s.keyBase64 === (defaultValue.data as string))
              if (!value) {
                throw new Error(
                  `Preparing default value for argument ${arg.name ?? `arg${i + 1}`} resulted in the failure: The key '${defaultValue.data}' could not be found in ${defaultValue.source} storage`,
                )
              }
              return 'valueRaw' in value
                ? (getABIDecodedValue(
                    value.valueRaw,
                    m.method.args[i].defaultValue?.type ?? m.method.args[i].type,
                    this._appSpec.structs,
                  ) as ABIValue)
                : value.value
            }
            case 'box': {
              const value = await this.getBoxValue(Buffer.from(defaultValue.data as string, 'base64'))
              return getABIDecodedValue(
                value,
                m.method.args[i].defaultValue?.type ?? m.method.args[i].type,
                this._appSpec.structs,
              ) as ABIValue
            }
          }
        }
        if (!algosdk.abiTypeIsTransaction(arg.type)) {
          throw new Error(`No value provided for required argument ${arg.name ?? `arg${i + 1}`} in call to method ${m.name}`)
        }
      }) ?? [],
    )
  }

  private getBareParamsMethods() {
    return {
      /** Return params for an update call, including deploy-time TEAL template replacements and compilation if provided */
      update: async (params?: AppClientBareCallParams & AppClientCompilationParams) => {
        return this.getBareParams(
          {
            ...params,
            ...(await this.compile(params)),
          },
          OnApplicationComplete.UpdateApplicationOC,
        ) as AppUpdateParams
      },
      /** Return params for an opt-in call */
      optIn: (params?: AppClientBareCallParams) => {
        return this.getBareParams(params, OnApplicationComplete.OptInOC) as AppCallParams
      },
      /** Return params for a delete call */
      delete: (params?: AppClientBareCallParams) => {
        return this.getBareParams(params, OnApplicationComplete.DeleteApplicationOC) as AppDeleteParams
      },
      /** Return params for a clear state call */
      clearState: (params?: AppClientBareCallParams) => {
        return this.getBareParams(params, OnApplicationComplete.ClearStateOC) as AppCallParams
      },
      /** Return params for a close out call */
      closeOut: (params?: AppClientBareCallParams) => {
        return this.getBareParams(params, OnApplicationComplete.CloseOutOC) as AppCallParams
      },
      /** Return params for a call (defaults to no-op) */
      call: (params?: AppClientBareCallParams & CallOnComplete) => {
        return this.getBareParams(params, params?.onComplete ?? OnApplicationComplete.NoOpOC) as AppCallParams
      },
    }
  }

  private getBareCreateTransactionMethods() {
    return {
      /** Returns a transaction for an update call, including deploy-time TEAL template replacements and compilation if provided */
      update: async (params?: AppClientBareCallParams & AppClientCompilationParams) => {
        return this._algorand.createTransaction.appUpdate(await this.params.bare.update(params))
      },
      /** Returns a transaction for an opt-in call */
      optIn: (params?: AppClientBareCallParams) => {
        return this._algorand.createTransaction.appCall(this.params.bare.optIn(params))
      },
      /** Returns a transaction for a delete call */
      delete: (params?: AppClientBareCallParams) => {
        return this._algorand.createTransaction.appDelete(this.params.bare.delete(params))
      },
      /** Returns a transaction for a clear state call */
      clearState: (params?: AppClientBareCallParams) => {
        return this._algorand.createTransaction.appCall(this.params.bare.clearState(params))
      },
      /** Returns a transaction for a close out call */
      closeOut: (params?: AppClientBareCallParams) => {
        return this._algorand.createTransaction.appCall(this.params.bare.closeOut(params))
      },
      /** Returns a transaction for a call (defaults to no-op) */
      call: (params?: AppClientBareCallParams & CallOnComplete) => {
        return this._algorand.createTransaction.appCall(this.params.bare.call(params))
      },
    }
  }

  private getBareSendMethods() {
    return {
      /** Signs and sends an update call, including deploy-time TEAL template replacements and compilation if provided */
      update: async (params?: AppClientBareCallParams & AppClientCompilationParams & SendParams) => {
        const compiled = await this.compile(params)
        return {
          ...(await this.handleCallErrors(async () => this._algorand.send.appUpdate(await this.params.bare.update(params)))),
          ...(compiled as Partial<AppCompilationResult>),
        }
      },
      /** Signs and sends an opt-in call */
      optIn: (params?: AppClientBareCallParams & SendParams) => {
        return this.handleCallErrors(() => this._algorand.send.appCall(this.params.bare.optIn(params)))
      },
      /** Signs and sends a delete call */
      delete: (params?: AppClientBareCallParams & SendParams) => {
        return this.handleCallErrors(() => this._algorand.send.appDelete(this.params.bare.delete(params)))
      },
      /** Signs and sends a clear state call */
      clearState: (params?: AppClientBareCallParams & SendParams) => {
        return this.handleCallErrors(() => this._algorand.send.appCall(this.params.bare.clearState(params)))
      },
      /** Signs and sends a close out call */
      closeOut: (params?: AppClientBareCallParams & SendParams) => {
        return this.handleCallErrors(() => this._algorand.send.appCall(this.params.bare.closeOut(params)))
      },
      /** Signs and sends a call (defaults to no-op) */
      call: (params?: AppClientBareCallParams & CallOnComplete & SendParams) => {
        return this.handleCallErrors(() => this._algorand.send.appCall(this.params.bare.call(params)))
      },
    }
  }

  private getMethodCallParamsMethods() {
    return {
      /** Return params for a payment transaction to fund the app account */
      fundAppAccount: (params: FundAppParams) => {
        return {
          ...params,
          sender: this.getSender(params.sender),
          signer: this.getSigner(params.sender, params.signer),
          receiver: this.appAddress,
        } satisfies PaymentParams
      },
      /** Return params for an update ABI call, including deploy-time TEAL template replacements and compilation if provided */
      update: async (params: AppClientMethodCallParams & AppClientCompilationParams) => {
        return (await this.getABIParams(
          {
            ...params,
            ...(await this.compile(params)),
          },
          OnApplicationComplete.UpdateApplicationOC,
        )) satisfies AppUpdateMethodCall
      },
      /** Return params for an opt-in ABI call */
      optIn: async (params: AppClientMethodCallParams) => {
        return (await this.getABIParams(params, OnApplicationComplete.OptInOC)) as AppCallMethodCall
      },
      /** Return params for an delete ABI call */
      delete: async (params: AppClientMethodCallParams) => {
        return (await this.getABIParams(params, OnApplicationComplete.DeleteApplicationOC)) as AppDeleteMethodCall
      },
      /** Return params for an close out ABI call */
      closeOut: async (params: AppClientMethodCallParams) => {
        return (await this.getABIParams(params, OnApplicationComplete.CloseOutOC)) as AppCallMethodCall
      },
      /** Return params for an ABI call */
      call: async (params: AppClientMethodCallParams & CallOnComplete) => {
        return (await this.getABIParams(params, params.onComplete ?? OnApplicationComplete.NoOpOC)) as AppCallMethodCall
      },
    }
  }

  private getMethodCallSendMethods() {
    return {
      /** Sign and send transactions for a payment transaction to fund the app account */
      fundAppAccount: (params: FundAppParams & SendParams) => {
        return this._algorand.send.payment(this.params.fundAppAccount(params))
      },
      /**
       * Sign and send transactions for an update ABI call, including deploy-time TEAL template replacements and compilation if provided
       */
      update: async (params: AppClientMethodCallParams & AppClientCompilationParams & SendParams) => {
        const compiled = await this.compile(params)
        return {
          ...(await this.handleCallErrors(async () =>
            this.processMethodCallReturn(
              this._algorand.send.appUpdateMethodCall(await this.params.update({ ...params })),
              getArc56Method(params.method, this._appSpec),
            ),
          )),
          ...(compiled as Partial<AppCompilationResult>),
        }
      },
      /**
       * Sign and send transactions for an opt-in ABI call
       */
      optIn: (params: AppClientMethodCallParams & SendParams) => {
        return this.handleCallErrors(async () =>
          this.processMethodCallReturn(
            this._algorand.send.appCallMethodCall(await this.params.optIn(params)),
            getArc56Method(params.method, this._appSpec),
          ),
        )
      },
      /**
       * Sign and send transactions for a delete ABI call
       */
      delete: (params: AppClientMethodCallParams & SendParams) => {
        return this.handleCallErrors(async () =>
          this.processMethodCallReturn(
            this._algorand.send.appDeleteMethodCall(await this.params.delete(params)),
            getArc56Method(params.method, this._appSpec),
          ),
        )
      },
      /**
       * Sign and send transactions for a close out ABI call
       */
      closeOut: (params: AppClientMethodCallParams & SendParams) => {
        return this.handleCallErrors(async () =>
          this.processMethodCallReturn(
            this._algorand.send.appCallMethodCall(await this.params.closeOut(params)),
            getArc56Method(params.method, this._appSpec),
          ),
        )
      },
      /**
       * Sign and send transactions for a call (defaults to no-op)
       */
      call: async (params: AppClientMethodCallParams & CallOnComplete & SendParams) => {
        // Read-only call - do it via simulate
        if (
          params.onComplete === OnApplicationComplete.NoOpOC ||
          (!params.onComplete && getArc56Method(params.method, this._appSpec).method.readonly)
        ) {
          const result = await this._algorand
            .newGroup()
            .addAppCallMethodCall(await this.params.call(params))
            .simulate({
              allowUnnamedResources: params.populateAppCallResources ?? true,
              // Simulate calls for a readonly method shouldn't invoke signing
              skipSignatures: true,
            })
          return this.processMethodCallReturn(
            {
              ...result,
              transaction: result.transactions.at(-1)!,
              confirmation: result.confirmations.at(-1)!,
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              return: result.returns?.length ?? 0 > 0 ? result.returns?.at(-1)! : undefined,
            } satisfies SendAppTransactionResult,
            getArc56Method(params.method, this._appSpec),
          )
        }

        return this.handleCallErrors(async () =>
          this.processMethodCallReturn(
            this._algorand.send.appCallMethodCall(await this.params.call(params)),
            getArc56Method(params.method, this._appSpec),
          ),
        )
      },
    }
  }

  private getMethodCallCreateTransactionMethods() {
    return {
      /** Return transaction for a payment transaction to fund the app account */
      fundAppAccount: (params: FundAppParams) => {
        return this._algorand.createTransaction.payment(this.params.fundAppAccount(params))
      },
      /**
       * Return transactions for an update ABI call, including deploy-time TEAL template replacements and compilation if provided
       */
      update: async (params: AppClientMethodCallParams & AppClientCompilationParams) => {
        return this._algorand.createTransaction.appUpdateMethodCall(await this.params.update(params))
      },
      /**
       * Return transactions for an opt-in ABI call
       */
      optIn: async (params: AppClientMethodCallParams) => {
        return this._algorand.createTransaction.appCallMethodCall(await this.params.optIn(params))
      },
      /**
       * Return transactions for a delete ABI call
       */
      delete: async (params: AppClientMethodCallParams) => {
        return this._algorand.createTransaction.appDeleteMethodCall(await this.params.delete(params))
      },
      /**
       * Return transactions for a close out ABI call
       */
      closeOut: async (params: AppClientMethodCallParams) => {
        return this._algorand.createTransaction.appCallMethodCall(await this.params.closeOut(params))
      },
      /**
       * Return transactions for an ABI call (defaults to no-op)
       */
      call: async (params: AppClientMethodCallParams & CallOnComplete) => {
        return this._algorand.createTransaction.appCallMethodCall(await this.params.call(params))
      },
    }
  }

  /** Returns the sender for a call, using the provided sender or using the `defaultSender`
   * if none provided and throws an error if neither provided */
  private getSender(sender: string | undefined): string {
    if (!sender && !this._defaultSender) {
      throw new Error(`No sender provided and no default sender present in app client for call to app ${this._appName}`)
    }
    return sender ?? this._defaultSender!
  }

  /** Returns the signer for a call, using the provided signer or the `defaultSigner`
   * if no signer was provided and the call will use default sender
   * or `undefined` otherwise (so the signer is resolved from `AlgorandClient`) */
  private getSigner(
    sender: string | undefined,
    signer: TransactionSigner | TransactionSignerAccount | undefined,
  ): TransactionSigner | TransactionSignerAccount | undefined {
    return signer ?? (!sender ? this._defaultSigner : undefined)
  }

  private getBareParams<
    TParams extends { sender?: string; signer?: TransactionSigner | TransactionSignerAccount } | undefined,
    TOnComplete extends OnApplicationComplete,
  >(params: TParams, onComplete: TOnComplete) {
    return {
      ...params,
      appId: this._appId,
      sender: this.getSender(params?.sender),
      signer: this.getSigner(params?.sender, params?.signer),
      onComplete,
    }
  }

  private async getABIParams<
    TParams extends {
      method: string
      sender?: string
      signer?: TransactionSigner | TransactionSignerAccount
      args?: AppClientMethodCallParams['args']
    },
    TOnComplete extends OnApplicationComplete,
  >(params: TParams, onComplete: TOnComplete) {
    const sender = this.getSender(params.sender)
    const method = getArc56Method(params.method, this._appSpec)
    const args = await this.getABIArgsWithDefaultValues(params.method, params.args, sender)
    return {
      ...params,
      appId: this._appId,
      sender: sender,
      signer: this.getSigner(params.sender, params.signer),
      method,
      onComplete,
      args,
    }
  }

  /** Make the given call and catch any errors, augmenting with debugging information before re-throwing. */
  private async handleCallErrors<TResult>(call: () => Promise<TResult>) {
    try {
      return await call()
    } catch (e) {
      throw await this.exposeLogicError(e as Error)
    }
  }

  private getBoxMethods() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const stateMethods = {
      /**
       * Returns all single-key state values in a record keyed by the key name and the value a decoded ABI value.
       */
      getAll: async () => {
        return Object.fromEntries(
          await Promise.all(Object.keys(that._appSpec.state.keys.box).map(async (key) => [key, await stateMethods.getValue(key)])),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as Record<string, any>
      },
      /**
       * Returns a single state value for the current app with the value a decoded ABI value.
       * @param name The name of the state value to retrieve the value for
       * @returns
       */
      getValue: async (name: string) => {
        const metadata = that._appSpec.state.keys.box[name]
        const value = await that.getBoxValue(Buffer.from(metadata.key, 'base64'))
        return getABIDecodedValue(value, metadata.valueType, that._appSpec.structs)
      },
      /**
       *
       * @param mapName The name of the map to read from
       * @param key The key within the map (without any map prefix) as either a Buffer with the bytes or a value
       *  that will be converted to bytes by encoding it using the specified ABI key type
       *  in the ARC-56 spec
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getMapValue: async (mapName: string, key: Uint8Array | any) => {
        const metadata = that._appSpec.state.maps.box[mapName]
        const prefix = Buffer.from(metadata.prefix ?? '', 'base64')
        const encodedKey = Buffer.concat([prefix, getABIEncodedValue(key, metadata.keyType, that._appSpec.structs)])
        const base64Key = Buffer.from(encodedKey).toString('base64')
        const value = await that.getBoxValue(Buffer.from(base64Key, 'base64'))
        return getABIDecodedValue(value, metadata.valueType, that._appSpec.structs)
      },

      /**
       *
       * @param mapName The name of the map to read from
       * @param key The key within the map as either a Buffer with the bytes or a value
       *  that will be converted to bytes by encoding it using the specified ABI key type
       *  in the ARC-56 spec
       * @param appState
       */
      getMap: async (mapName: string) => {
        const metadata = that._appSpec.state.maps.box[mapName]
        const prefix = Buffer.from(metadata.prefix ?? '', 'base64')
        const boxNames = await that.getBoxNames()

        return new Map(
          await Promise.all(
            boxNames
              .filter((b) => binaryStartsWith(b.nameRaw, prefix))
              .map(async (b) => {
                const encodedKey = Buffer.concat([prefix, b.nameRaw])
                const base64Key = Buffer.from(encodedKey).toString('base64')
                return [
                  getABIDecodedValue(b.nameRaw.slice(prefix.length), metadata.keyType, that._appSpec.structs),
                  getABIDecodedValue(await that.getBoxValue(Buffer.from(base64Key, 'base64')), metadata.valueType, that._appSpec.structs),
                ] as const
              }),
          ),
        )
      },
    }
    return stateMethods
  }

  private getStateMethods(
    stateGetter: () => Promise<AppState>,
    keyGetter: () => {
      [name: string]: StorageKey
    },
    mapGetter: () => {
      [name: string]: StorageMap
    },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const stateMethods = {
      /**
       * Returns all single-key state values in a record keyed by the key name and the value a decoded ABI value.
       */
      getAll: async () => {
        const appState = await stateGetter()
        return Object.fromEntries(
          await Promise.all(Object.keys(keyGetter()).map(async (key) => [key, await stateMethods.getValue(key, appState)])),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as Record<string, any>
      },
      /**
       * Returns a single state value for the current app with the value a decoded ABI value.
       * @param name The name of the state value to retrieve the value for
       * @param appState Optional cached value of the current state
       * @returns
       */
      getValue: async (name: string, appState?: AppState) => {
        const state = Object.values(appState ?? (await stateGetter()))
        const metadata = keyGetter()[name]
        const value = state.find((s) => s.keyBase64 === metadata.key)

        if (value && 'valueRaw' in value) {
          return getABIDecodedValue(value.valueRaw, metadata.valueType, that._appSpec.structs)
        }

        return value?.value
      },
      /**
       * Returns a single value from the given map for the current app with the value a decoded ABI value.
       * @param mapName The name of the map to read from
       * @param key The key within the map (without any map prefix) as either a Buffer with the bytes or a value
       *  that will be converted to bytes by encoding it using the specified ABI key type
       *  in the ARC-56 spec
       * @param appState Optional cached value of the current state
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getMapValue: async (mapName: string, key: Uint8Array | any, appState?: AppState) => {
        const state = Object.values(appState ?? (await stateGetter()))
        const metadata = mapGetter()[mapName]

        const prefix = Buffer.from(metadata.prefix ?? '', 'base64')
        const encodedKey = Buffer.concat([prefix, getABIEncodedValue(key, metadata.keyType, that._appSpec.structs)])
        const base64Key = Buffer.from(encodedKey).toString('base64')
        const value = state.find((s) => s.keyBase64 === base64Key)

        if (value && 'valueRaw' in value) {
          return getABIDecodedValue(value.valueRaw, metadata.valueType, that._appSpec.structs)
        }

        return value?.value
      },

      /**
       * Returns all map values for the given map.
       * @param mapName The name of the map to read from
       * @param appState Optional cached value of the current state
       * @returns A map of all key-value pairs in the map as a `Record<string, ABIValue>`
       */
      getMap: async (mapName: string) => {
        const state = Object.values(await stateGetter())
        const metadata = mapGetter()[mapName]

        const prefix = Buffer.from(metadata.prefix ?? '', 'base64')

        return new Map(
          state
            .filter((s) => binaryStartsWith(s.keyRaw, prefix))
            .map((s) => {
              const key = s.keyRaw.slice(prefix.length)
              return [
                getABIDecodedValue(key, metadata.keyType, this._appSpec.structs),
                getABIDecodedValue('valueRaw' in s ? s.valueRaw : s.value, metadata.valueType, this._appSpec.structs),
              ] as const
            }),
        )
      },
    }
    return stateMethods
  }
}

/**
 * @deprecated Use `AppClient` instead e.g. via `algorand.client.getAppClientById` or
 * `algorand.client.getAppClientByCreatorAndName`.
 * If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
 * which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.
 *
 * Application client - a class that wraps an ARC-0032 app spec and provides high productivity methods to deploy and call the app */
export class ApplicationClient {
  private algod: Algodv2
  private indexer?: algosdk.Indexer
  private appSpec: AppSpec
  private sender: SendTransactionFrom | undefined
  private params: SuggestedParams | undefined
  private existingDeployments: LegacyAppLookup | undefined
  private deployTimeParams?: TealTemplateParams

  private _appId: number | bigint
  private _appAddress: string
  private _creator: string | undefined
  private _appName: string

  private _approvalSourceMap: SourceMap | undefined
  private _clearSourceMap: SourceMap | undefined

  /**
   * @deprecated Use `AppClient` instead e.g. via `algorand.client.getAppClientById` or
   * `algorand.client.getAppClientByCreatorAndName`.
   * If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
   * which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.
   *
   * Create a new ApplicationClient instance
   * @param appDetails The details of the app
   * @param algod An algod instance
   */
  constructor(appDetails: AppSpecAppDetails, algod: Algodv2) {
    const { app, sender, params, deployTimeParams, ...appIdentifier } = appDetails
    this.algod = algod
    this.appSpec = typeof app == 'string' ? (JSON.parse(app) as AppSpec) : app
    this._appName = appIdentifier.name ?? this.appSpec.contract.name
    this.deployTimeParams = deployTimeParams

    if (appIdentifier.resolveBy === 'id') {
      if (appIdentifier.id < 0) {
        throw new Error(`Attempt to create application client with invalid app id of ${appIdentifier.id}`)
      }
      this._appId = appIdentifier.id
    } else {
      this._appId = 0
      this._creator = appIdentifier.creatorAddress
      if (appIdentifier.findExistingUsing instanceof Indexer) {
        this.indexer = appIdentifier.findExistingUsing
      } else {
        if (appIdentifier.findExistingUsing.creator !== this._creator) {
          throw new Error(
            `Attempt to create application client with invalid existingDeployments against a different creator (${appIdentifier.findExistingUsing.creator}) instead of expected creator ${this._creator}`,
          )
        }
        this.existingDeployments = appIdentifier.findExistingUsing
      }
    }

    this._appAddress = algosdk.getApplicationAddress(this._appId)
    this.sender = sender
    this.params = params
  }

  /**
   * @deprecated Use `AppClient.compile()` instead.
   *
   * Compiles the approval and clear state programs and sets up the source map.
   * @param compilation The deploy-time parameters for the compilation
   * @returns The compiled approval and clear state programs
   */
  async compile(compilation?: AppClientCompilationParams) {
    const { deployTimeParams, updatable, deletable } = compilation ?? {}
    const approvalTemplate = Buffer.from(this.appSpec.source.approval, 'base64').toString('utf-8')
    const approval = replaceDeployTimeControlParams(
      performTemplateSubstitution(approvalTemplate, deployTimeParams ?? this.deployTimeParams),
      {
        updatable,
        deletable,
      },
    )
    const approvalCompiled = await compileTeal(approval, this.algod)
    this._approvalSourceMap = approvalCompiled?.sourceMap
    const clearTemplate = Buffer.from(this.appSpec.source.clear, 'base64').toString('utf-8')
    const clear = performTemplateSubstitution(clearTemplate, deployTimeParams ?? this.deployTimeParams)
    const clearCompiled = await compileTeal(clear, this.algod)
    this._clearSourceMap = clearCompiled?.sourceMap

    if (Config.debug) {
      await Config.events.emitAsync(EventType.AppCompiled, {
        sources: [
          { compiledTeal: approvalCompiled, appName: this._appName, fileName: 'approval' },
          { compiledTeal: clearCompiled, appName: this._appName, fileName: 'clear' },
        ],
      })
    }

    return { approvalCompiled, clearCompiled }
  }

  /**
   * Export the current source maps for the app.
   * @returns The source maps
   */
  exportSourceMaps(): AppSourceMaps {
    if (!this._approvalSourceMap || !this._clearSourceMap) {
      throw new Error(
        "Unable to export source maps; they haven't been loaded into this client - you need to call create, update, or deploy first",
      )
    }

    return {
      approvalSourceMap: this._approvalSourceMap,
      clearSourceMap: this._clearSourceMap,
    }
  }

  /**
   * Import source maps for the app.
   * @param sourceMaps The source maps to import
   */
  importSourceMaps(sourceMaps: AppSourceMaps) {
    this._approvalSourceMap = new SourceMap(sourceMaps.approvalSourceMap)
    this._clearSourceMap = new SourceMap(sourceMaps.clearSourceMap)
  }

  /**
   * @deprecated Use `deploy` from an `AppFactory` instance instead.
   *
   * Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.
   *
   * To understand the architecture decisions behind this functionality please see https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md
   *
   * **Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.
   *
   * **Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.
   * @param deploy Deployment details
   * @returns The metadata and transaction result(s) of the deployment, or just the metadata if it didn't need to issue transactions
   */
  async deploy(deploy?: AppClientDeployParams) {
    const {
      schema,
      sender: deploySender,
      version,
      allowUpdate,
      allowDelete,
      sendParams,
      createArgs,
      createOnCompleteAction,
      updateArgs,
      deleteArgs,
      ...deployArgs
    } = deploy ?? {}

    if (this._appId !== 0) {
      throw new Error(`Attempt to deploy app which already has an app id of ${this._appId}`)
    }
    const sender = deploySender ?? this.sender
    if (!sender) {
      throw new Error('No sender provided, unable to deploy app')
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const from = sender ?? this.sender!

    if (!this._creator) {
      throw new Error("Attempt to `deploy` a contract without specifying `resolveBy: 'creatorAndName'` in the constructor")
    }
    if (this._creator !== getSenderAddress(from)) {
      throw new Error(
        `Attempt to deploy contract with a sender address (${getSenderAddress(
          from,
        )}) that differs from the given creator address for this application client: ${this._creator}`,
      )
    }

    const approval = Buffer.from(this.appSpec.source.approval, 'base64').toString('utf-8')

    const compilation = {
      deployTimeParams: deployArgs.deployTimeParams,
      updatable:
        allowUpdate !== undefined
          ? allowUpdate
          : getDeployTimeControl(approval, this.appSpec, UPDATABLE_TEMPLATE_NAME, 'update_application'),
      deletable:
        allowDelete !== undefined
          ? allowDelete
          : getDeployTimeControl(approval, this.appSpec, DELETABLE_TEMPLATE_NAME, 'delete_application'),
    }

    const { approvalCompiled, clearCompiled } = await this.compile(compilation)

    try {
      await this.getAppReference()
      const result = await deployApp(
        {
          from: sender,
          approvalProgram: approvalCompiled.compiledBase64ToBytes,
          clearStateProgram: clearCompiled.compiledBase64ToBytes,
          metadata: {
            name: this._appName,
            version: version ?? '1.0',
            updatable: compilation.updatable,
            deletable: compilation.deletable,
          },
          schema: {
            globalByteSlices: this.appSpec.state.global.num_byte_slices,
            globalInts: this.appSpec.state.global.num_uints,
            localByteSlices: this.appSpec.state.local.num_byte_slices,
            localInts: this.appSpec.state.local.num_uints,
            ...schema,
          },
          transactionParams: this.params,
          ...(sendParams ?? {}),
          existingDeployments: this.existingDeployments,
          createArgs: await this.getCallArgs(createArgs, sender),
          createOnCompleteAction: createOnCompleteAction,
          updateArgs: await this.getCallArgs(updateArgs, sender),
          deleteArgs: await this.getCallArgs(deleteArgs, sender),
          ...deployArgs,
        },
        this.algod,
        this.indexer,
      )

      // Nothing needed to happen
      if (result.operationPerformed === 'nothing') {
        return result
      }

      if (!this.existingDeployments) {
        throw new Error('Expected existingDeployments to be present')
      }
      const { transaction, confirmation, operationPerformed, ...appMetadata } = result
      this.existingDeployments = {
        creator: this.existingDeployments.creator,
        apps: { ...this.existingDeployments.apps, [this._appName]: appMetadata },
      }

      return { ...result, ...({ compiledApproval: approvalCompiled, compiledClear: clearCompiled } as AppCompilationResult) }
    } catch (e) {
      throw this.exposeLogicError(e as Error)
    }
  }

  /**
   * @deprecated Use `create` from an `AppFactory` instance instead.
   *
   * Creates a smart contract app, returns the details of the created app.
   * @param create The parameters to create the app with
   * @returns The details of the created app, or the transaction to create it if `skipSending` and the compilation result
   */
  async create(create?: AppClientCreateParams) {
    const {
      sender: createSender,
      note,
      sendParams,
      deployTimeParams,
      updatable,
      deletable,
      onCompleteAction,
      schema,
      ...args
    } = create ?? {}

    if (this._appId !== 0) {
      throw new Error(`Attempt to create app which already has an app id of ${this._appId}`)
    }

    const sender = createSender ?? this.sender
    if (!sender) {
      throw new Error('No sender provided, unable to create app')
    }

    const { approvalCompiled, clearCompiled } = await this.compile(create)

    try {
      const result = await createApp(
        {
          from: sender,
          approvalProgram: approvalCompiled.compiledBase64ToBytes,
          clearStateProgram: clearCompiled.compiledBase64ToBytes,
          schema: {
            globalByteSlices: this.appSpec.state.global.num_byte_slices,
            globalInts: this.appSpec.state.global.num_uints,
            localByteSlices: this.appSpec.state.local.num_byte_slices,
            localInts: this.appSpec.state.local.num_uints,
            ...schema,
          },
          onCompleteAction,
          args: await this.getCallArgs(args, sender),
          note: note,
          transactionParams: this.params,
          ...(sendParams ?? {}),
        },
        this.algod,
      )

      if (result.confirmation) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this._appId = result.confirmation.applicationIndex!
        this._appAddress = getApplicationAddress(this._appId)
      }

      return { ...result, ...({ compiledApproval: approvalCompiled, compiledClear: clearCompiled } as AppCompilationResult) }
    } catch (e) {
      throw await this.exposeLogicError(e as Error)
    }
  }

  /**
   * @deprecated Use `appClient.send.update` or `appClient.createTransaction.update` from an `AppClient` instance instead.
   *
   * Updates the smart contract app.
   * @param update The parameters to update the app with
   * @returns The transaction send result and the compilation result
   */
  async update(update?: AppClientUpdateParams) {
    const { sender: updateSender, note, sendParams, deployTimeParams, updatable, deletable, ...args } = update ?? {}

    if (this._appId === 0) {
      throw new Error(`Attempt to update app which doesn't have an app id defined`)
    }
    const sender = updateSender ?? this.sender
    if (!sender) {
      throw new Error('No sender provided, unable to create app')
    }

    const { approvalCompiled, clearCompiled } = await this.compile(update)

    try {
      const result = await updateApp(
        {
          appId: this._appId,
          from: sender,
          approvalProgram: approvalCompiled.compiledBase64ToBytes,
          clearStateProgram: clearCompiled.compiledBase64ToBytes,
          args: await this.getCallArgs(args, sender),
          note: note,
          transactionParams: this.params,
          ...(sendParams ?? {}),
        },
        this.algod,
      )

      return { ...result, ...({ compiledApproval: approvalCompiled, compiledClear: clearCompiled } as AppCompilationResult) }
    } catch (e) {
      throw await this.exposeLogicError(e as Error)
    }
  }

  /**
   * @deprecated Use `appClient.send.call` or `appClient.createTransaction.call` from an `AppClient` instance instead.
   *
   * Issues a no_op (normal) call to the app.
   * @param call The call details.
   * @returns The result of the call
   */
  async call(call?: AppClientCallParams) {
    if (
      // ABI call
      call?.method &&
      // We aren't skipping the send
      !call.sendParams?.skipSending &&
      // There isn't an ATC passed in
      !call.sendParams?.atc &&
      // The method is readonly
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.appSpec.hints[this.getABIMethodSignature(this.getABIMethod(call.method)!)].read_only
    ) {
      const atc = new AtomicTransactionComposer()
      await this.callOfType({ ...call, sendParams: { ...call.sendParams, atc } }, 'no_op')
      const result = await atc.simulate(this.algod)
      if (result.simulateResponse.txnGroups.some((group) => group.failureMessage)) {
        throw new Error(result.simulateResponse.txnGroups.find((x) => x.failureMessage)?.failureMessage)
      }
      const txns = atc.buildGroup()
      return {
        transaction: txns[txns.length - 1].txn,
        confirmation: result.simulateResponse.txnGroups[0].txnResults.at(-1)?.txnResult,
        confirmations: result.simulateResponse.txnGroups[0].txnResults.map((t) => t.txnResult),
        transactions: txns.map((t) => t.txn),
        return: result.methodResults?.length ?? 0 > 0 ? (result.methodResults[result.methodResults.length - 1] as ABIReturn) : undefined,
      } satisfies AppCallTransactionResult
    }

    return await this.callOfType(call, 'no_op')
  }

  /**
   * @deprecated Use `appClient.send.optIn` or `appClient.createTransaction.optIn` from an `AppClient` instance instead.
   *
   * Issues a opt_in call to the app.
   * @param call The call details.
   * @returns The result of the call
   */
  async optIn(call?: AppClientCallParams) {
    return await this.callOfType(call, 'opt_in')
  }

  /**
   * @deprecated Use `appClient.send.closeOut` or `appClient.createTransaction.closeOut` from an `AppClient` instance instead.
   *
   * Issues a close_out call to the app.
   * @param call The call details.
   * @returns The result of the call
   */
  async closeOut(call?: AppClientCallParams) {
    return await this.callOfType(call, 'close_out')
  }

  /**
   * @deprecated Use `appClient.send.clearState` or `appClient.createTransaction.clearState` from an `AppClient` instance instead.
   *
   * Issues a clear_state call to the app.
   * @param call The call details.
   * @returns The result of the call
   */
  async clearState(call?: AppClientClearStateParams) {
    return await this.callOfType(call, 'clear_state')
  }

  /**
   * @deprecated Use `appClient.send.delete` or `appClient.createTransaction.delete` from an `AppClient` instance instead.
   *
   * Issues a delete_application call to the app.
   * @param call The call details.
   * @returns The result of the call
   */
  async delete(call?: AppClientCallParams) {
    return await this.callOfType(call, 'delete_application')
  }

  /**
   * @deprecated Use `appClient.send.call` or `appClient.createTransaction.call` from an `AppClient` instance instead.
   *
   * Issues a call to the app with the given call type.
   * @param call The call details.
   * @param callType The call type
   * @returns The result of the call
   */
  async callOfType(
    call: AppClientCallParams = {},
    callType: Exclude<AppCallType, 'update_application'> | Exclude<OnApplicationComplete, OnApplicationComplete.UpdateApplicationOC>,
  ) {
    const { sender: callSender, note, sendParams, ...args } = call

    const sender = callSender ?? this.sender
    if (!sender) {
      throw new Error('No sender provided, unable to call app')
    }

    const appMetadata = await this.getAppReference()
    if (appMetadata.appId === 0) {
      throw new Error(`Attempt to call an app that can't be found '${this._appName}' for creator '${this._creator}'.`)
    }

    try {
      return await callApp(
        {
          appId: appMetadata.appId,
          callType: callType,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          from: sender,
          args: await this.getCallArgs(args, sender),
          note: note,
          transactionParams: this.params,
          ...(sendParams ?? {}),
        },
        this.algod,
      )
    } catch (e) {
      throw this.exposeLogicError(e as Error)
    }
  }

  /**
   * Funds Algo into the app account for this app.
   * @param fund The parameters for the funding or the funding amount
   * @returns The result of the funding
   */
  async fundAppAccount(fund: FundAppAccountParams | AlgoAmount) {
    const { amount, sender, note, sendParams } = 'microAlgos' in fund ? ({ amount: fund } as FundAppAccountParams) : fund

    if (!sender && !this.sender) {
      throw new Error('No sender provided, unable to call app')
    }

    const ref = await this.getAppReference()
    return legacySendTransactionBridge(
      this.algod,
      sender ?? this.sender!,
      sendParams ?? {},
      {
        receiver: ref.appAddress,
        sender: getSenderAddress(sender ?? this.sender!),
        amount: amount,
        note: encodeTransactionNote(note),
      },
      (c) => c.payment,
      (c) => c.payment,
      this.params,
    )
  }

  /**
   * Returns global state for the current app.
   * @returns The global state
   */
  async getGlobalState(): Promise<AppState> {
    const appRef = await this.getAppReference()

    if (appRef.appId === 0) {
      throw new Error('No app has been created yet, unable to get global state')
    }

    return getAppGlobalState(appRef.appId, this.algod)
  }

  /**
   * Returns local state for the given account / account address.
   * @returns The global state
   */
  async getLocalState(account: string | SendTransactionFrom): Promise<AppState> {
    const appRef = await this.getAppReference()

    if (appRef.appId === 0) {
      throw new Error('No app has been created yet, unable to get global state')
    }

    return getAppLocalState(appRef.appId, account, this.algod)
  }

  /**
   * Returns the names of all current boxes for the current app.
   * @returns The names of the boxes
   */
  async getBoxNames(): Promise<BoxName[]> {
    const appRef = await this.getAppReference()

    if (appRef.appId === 0) {
      throw new Error('No app has been created yet, unable to get global state')
    }

    return await getAppBoxNames(appRef.appId, this.algod)
  }

  /**
   * Returns the value of the given box for the current app.
   * @param name The name of the box to return either as a string, binary array or `BoxName`
   * @returns The current box value as a byte array
   */
  async getBoxValue(name: BoxName | string | Uint8Array): Promise<Uint8Array> {
    const appRef = await this.getAppReference()

    if (appRef.appId === 0) {
      throw new Error('No app has been created yet, unable to get global state')
    }

    return await getAppBoxValue(appRef.appId, name, this.algod)
  }

  /**
   * Returns the value of the given box for the current app.
   * @param name The name of the box to return either as a string, binary array or `BoxName`
   * @param type
   * @returns The current box value as a byte array
   */
  async getBoxValueFromABIType(name: BoxName | string | Uint8Array, type: ABIType): Promise<ABIValue> {
    const appRef = await this.getAppReference()

    if (appRef.appId === 0) {
      throw new Error('No app has been created yet, unable to get global state')
    }

    return await getAppBoxValueFromABIType({ appId: appRef.appId, boxName: name, type }, this.algod)
  }

  /**
   * Returns the values of all current boxes for the current app.
   * Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.
   * @param filter Optional filter to filter which boxes' values are returned
   * @returns The (name, value) pair of the boxes with values as raw byte arrays
   */
  async getBoxValues(filter?: (name: BoxName) => boolean): Promise<{ name: BoxName; value: Uint8Array }[]> {
    const appRef = await this.getAppReference()

    if (appRef.appId === 0) {
      throw new Error('No app has been created yet, unable to get global state')
    }

    const names = await this.getBoxNames()
    return await Promise.all(
      names
        .filter(filter ?? ((_) => true))
        .map(async (boxName) => ({ name: boxName, value: await getAppBoxValue(appRef.appId, boxName, this.algod) })),
    )
  }

  /**
   * Returns the values of all current boxes for the current app decoded using an ABI Type.
   * Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.
   * @param type The ABI type to decode the values with
   * @param filter Optional filter to filter which boxes' values are returned
   * @returns The (name, value) pair of the boxes with values as the ABI Value
   */
  async getBoxValuesFromABIType(type: ABIType, filter?: (name: BoxName) => boolean): Promise<{ name: BoxName; value: ABIValue }[]> {
    const appRef = await this.getAppReference()

    if (appRef.appId === 0) {
      throw new Error('No app has been created yet, unable to get global state')
    }

    const names = await this.getBoxNames()
    return await Promise.all(
      names.filter(filter ?? ((_) => true)).map(async (boxName) => ({
        name: boxName,
        value: await getAppBoxValueFromABIType({ appId: appRef.appId, boxName, type }, this.algod),
      })),
    )
  }

  /**
   * @deprecated Use `appClient.params.*` from an `AppClient` instance instead.
   *
   * Returns the arguments for an app call for the given ABI method or raw method specification.
   * @param args The call args specific to this application client
   * @param sender The sender of this call. Will be used to fetch any default argument values if applicable
   * @returns The call args ready to pass into an app call
   */
  async getCallArgs(args: AppClientCallArgs | undefined, sender: SendTransactionFrom): Promise<AppCallArgs | undefined> {
    if (!args) {
      return undefined
    }

    if (args.method) {
      const abiMethod = this.getABIMethodParams(args.method)
      if (!abiMethod) {
        throw new Error(`Attempt to call ABI method ${args.method}, but it wasn't found`)
      }

      const methodSignature = this.getABIMethodSignature(abiMethod)

      return {
        ...args,
        method: abiMethod,
        methodArgs: await Promise.all(
          args.methodArgs.map(async (arg, index): Promise<ABIAppCallArg> => {
            if (arg !== undefined) return arg
            const argName = abiMethod.args[index].name
            const defaultValueStrategy = argName && this.appSpec.hints?.[methodSignature]?.default_arguments?.[argName]
            if (!defaultValueStrategy)
              throw new Error(
                `Argument at position ${index} with the name ${argName} is undefined and does not have a default value strategy`,
              )

            switch (defaultValueStrategy.source) {
              case 'constant':
                return defaultValueStrategy.data
              case 'abi-method': {
                const method = defaultValueStrategy.data as ABIMethodParams
                const result = await this.callOfType(
                  {
                    method: this.getABIMethodSignature(method),
                    methodArgs: method.args.map(() => undefined),
                    sender,
                  },
                  'no_op',
                )
                return result.return?.returnValue
              }
              case 'local-state':
              case 'global-state': {
                const state =
                  defaultValueStrategy.source === 'global-state' ? await this.getGlobalState() : await this.getLocalState(sender)
                const key = defaultValueStrategy.data
                if (key in state) {
                  return state[key].value
                } else {
                  throw new Error(
                    `Preparing default value for argument at position ${index} with the name ${argName} resulted in the failure: The key '${key}' could not be found in ${defaultValueStrategy.source}`,
                  )
                }
              }
            }
          }),
        ),
      }
    } else {
      return args as RawAppCallArgs
    }
  }

  /**
   * @deprecated Use `appClient.getABIMethod` instead.
   *
   * Returns the ABI Method parameters for the given method name string for the app represented by this application client instance
   * @param method Either the name of the method or the ABI method spec definition string
   * @returns The ABI method params for the given method
   */
  getABIMethodParams(method: string): ABIMethodParams | undefined {
    if (!method.includes('(')) {
      const methods = this.appSpec.contract.methods.filter((m) => m.name === method)
      if (methods.length > 1) {
        throw new Error(
          `Received a call to method ${method} in contract ${
            this._appName
          }, but this resolved to multiple methods; please pass in an ABI signature instead: ${methods
            .map(this.getABIMethodSignature)
            .join(', ')}`,
        )
      }
      return methods[0]
    }
    return this.appSpec.contract.methods.find((m) => this.getABIMethodSignature(m) === method)
  }

  /**
   * Returns the ABI Method for the given method name string for the app represented by this application client instance
   * @param method Either the name of the method or the ABI method spec definition string
   * @returns The ABI method for the given method
   */
  getABIMethod(method: string): ABIMethod | undefined {
    const methodParams = this.getABIMethodParams(method)
    return methodParams ? new ABIMethod(methodParams) : undefined
  }

  /**
   * @deprecated Use `appClient.appId` and `appClient.appAddress` from an `AppClient` instance instead.
   *
   * Gets the reference information for the current application instance.
   * `appId` will be 0 if it can't find an app.
   * @returns The app reference, or if deployed using the `deploy` method, the app metadata too
   */
  async getAppReference(): Promise<AppMetadata | AppReference> {
    if (!this.existingDeployments && this._creator) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.existingDeployments = await getCreatorAppsByName(this._creator, this.indexer!)
    }

    if (this.existingDeployments && this._appId === 0) {
      const app = this.existingDeployments.apps[this._appName]
      if (!app) {
        return {
          appId: 0,
          appAddress: getApplicationAddress(0),
        }
      }
      return app
    }

    return {
      appId: this._appId,
      appAddress: this._appAddress,
    } as AppReference
  }

  /**
   * Takes an error that may include a logic error from a smart contract call and re-exposes the error to include source code information via the source map.
   * This is automatically used within `ApplicationClient` but if you pass `skipSending: true` e.g. if doing a group transaction
   *  then you can use this in a try/catch block to get better debugging information.
   * @param e The error to parse
   * @param isClear Whether or not the code was running the clear state program
   * @returns The new error, or if there was no logic error or source map then the wrapped error with source details
   */
  exposeLogicError(e: Error, isClear?: boolean): Error {
    if ((!isClear && this._approvalSourceMap == undefined) || (isClear && this._clearSourceMap == undefined)) return e

    const errorDetails = LogicError.parseLogicError(e)

    if (errorDetails !== undefined)
      return new LogicError(
        errorDetails,
        Buffer.from(isClear ? this.appSpec.source.clear : this.appSpec.source.approval, 'base64')
          .toString()
          .split('\n'),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        isClear ? this._clearSourceMap! : this._approvalSourceMap!,
      )
    else return e
  }

  private getABIMethodSignature(method: ABIMethodParams | ABIMethod) {
    return 'getSignature' in method ? method.getSignature() : new ABIMethod(method).getSignature()
  }
}
