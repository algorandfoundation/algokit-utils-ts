import {
  ABIDefaultValue,
  ABIStorageKey,
  ABIStorageMap,
  ABIType,
  ABIValue,
  Arc56Contract,
  ProgramSourceInfo,
  argTypeIsTransaction,
  getABIDecodedValue,
  getABIEncodedValue,
  getABIMethod,
  getBoxABIStorageKey,
  getBoxABIStorageKeys,
  getBoxABIStorageMap,
  getGlobalABIStorageKeys,
  getGlobalABIStorageMaps,
  getLocalABIStorageKeys,
  getLocalABIStorageMaps,
} from '@algorandfoundation/algokit-abi'
import { SuggestedParams } from '@algorandfoundation/algokit-algod-client'
import { Address, ReadableAddress, getAddress, getApplicationAddress, getOptionalAddress } from '@algorandfoundation/algokit-common'
import { IndexerClient } from '@algorandfoundation/algokit-indexer-client'
import { AddressWithSigner, OnApplicationComplete, Transaction } from '@algorandfoundation/algokit-transact'
import { ProgramSourceMap, TransactionSigner } from '@algorandfoundation/sdk'
import { Buffer } from 'buffer'
import { Config } from '../config'
import { asJson, binaryStartsWith } from '../util'
import { type AlgorandClient } from './algorand-client'
import { AlgoAmount } from './amount'
import {
  ABIAppCallArgs,
  AppCompilationResult,
  AppReturn,
  AppState,
  AppStorageSchema,
  BoxName,
  AppLookup as LegacyAppLookup,
  OnSchemaBreak,
  OnUpdate,
  RawAppCallArgs,
  SendAppTransactionResult,
  TealTemplateParams,
} from './app'
import { AppLookup } from './app-deployer'
import { AppManager, BoxIdentifier } from './app-manager'
import { AppSpec, arc32ToArc56 } from './app-spec'
import {
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

/** The maximum opcode budget for a simulate call as per https://github.com/algorand/go-algorand/blob/807b29a91c371d225e12b9287c5d56e9b33c4e4c/ledger/simulation/trace.go#L104 */
const MAX_SIMULATE_OPCODE_BUDGET = 20_000 * 16

/** Configuration to resolve app by creator and name `getCreatorAppsByName` */
export type ResolveAppByCreatorAndNameBase = {
  /** The address of the app creator account to resolve the app by */
  creatorAddress: ReadableAddress
  /** The optional name override to resolve the app by within the creator account (default: uses the name in the ABI contract) */
  name?: string
  /** The mechanism to find an existing app instance metadata for the given creator and name; either:
   *  * An indexer instance to search the creator account apps; or
   *  * The cached value of the existing apps for the given creator from `getCreatorAppsByName`
   */
  findExistingUsing: IndexerClient | LegacyAppLookup
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
  createOnCompleteAction?: Exclude<OnApplicationComplete, OnApplicationComplete.ClearState>
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

export type AppClientCallRawArgs = RawAppCallArgs

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
  onCompleteAction?: Exclude<OnApplicationComplete, OnApplicationComplete.ClearState>
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
  algorand: AlgorandClient

  /**
   * Optional override for the app name; used for on-chain metadata and lookups.
   * Defaults to the ARC-32/ARC-56 app spec name
   */
  appName?: string
  /** Optional address to use for the account to use as the default sender for calls. */
  defaultSender?: ReadableAddress
  /** Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`). */
  defaultSigner?: TransactionSigner
  /** Optional source map for the approval program */
  approvalSourceMap?: ProgramSourceMap
  /** Optional source map for the clear state program */
  clearSourceMap?: ProgramSourceMap
}

/** Parameters to clone an app client */
export type CloneAppClientParams = Expand<Partial<Omit<AppClientParams, 'algorand' | 'appSpec'>>>

/** onComplete parameter for a non-update app call */
export type CallOnComplete = {
  /** On-complete of the call; defaults to no-op */
  onComplete?: Exclude<OnApplicationComplete, OnApplicationComplete.UpdateApplication>
}

/** AppClient common parameters for a bare app call */
export type AppClientBareCallParams = Expand<
  Omit<CommonAppCallParams, 'appId' | 'sender' | 'onComplete'> & {
    /** The address of the account sending the transaction, if undefined then the app client's defaultSender is used. */
    sender?: ReadableAddress
  }
>

/** AppClient common parameters for an ABI method call */
export type AppClientMethodCallParams = Expand<
  Omit<CommonAppCallParams, 'appId' | 'sender' | 'method' | 'args'> & {
    /** The address of the account sending the transaction, if undefined then the app client's defaultSender is used. */
    sender?: ReadableAddress
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
    args?: (ABIValue | AppMethodCallTransactionArgument | undefined)[]
  }
>

/** Parameters for funding an app account */
export type FundAppParams = Expand<
  Omit<PaymentParams, 'receiver' | 'sender'> &
    SendParams & {
      /** The optional sender to send the transaction from, will use the application client's default sender by default if specified */
      sender?: ReadableAddress
    }
>

/** Resolve an app client instance by looking up an app created by the given creator with the given name */
export type ResolveAppClientByCreatorAndName = Expand<
  Omit<AppClientParams, 'appId'> & {
    /** The address of the creator account for the app */
    creatorAddress: ReadableAddress
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

/**
 * Get the offset of the last constant block at the beginning of the program
 * This value is used to calculate the program counter for an ARC56 program that has a pcOffsetMethod of "cblocks"
 *
 * @param program The program to parse
 * @returns The PC value of the opcode after the last constant block
 */
function getConstantBlockOffset(program: Uint8Array) {
  const bytes = [...program]

  const programSize = bytes.length
  bytes.shift() // remove version

  /** The PC of the opcode after the bytecblock */
  let bytecblockOffset: number | undefined

  /** The PC of the opcode after the intcblock */
  let intcblockOffset: number | undefined

  while (bytes.length > 0) {
    /** The current byte from the beginning of the byte array */
    const byte = bytes.shift()!

    // If the byte is a constant block...
    if (byte === BYTE_CBLOCK || byte === INT_CBLOCK) {
      const isBytecblock = byte === BYTE_CBLOCK

      /** The byte following the opcode is the number of values in the constant block */
      const valuesRemaining = bytes.shift()!

      // Iterate over all the values in the constant block
      for (let i = 0; i < valuesRemaining; i++) {
        if (isBytecblock) {
          /** The byte following the opcode is the length of the next element */
          const length = bytes.shift()!
          bytes.splice(0, length)
        } else {
          // intcblock is a uvarint, so we need to keep reading until we find the end (MSB is not set)
          while ((bytes.shift()! & 0x80) !== 0) {
            // Do nothing...
          }
        }
      }

      if (isBytecblock) bytecblockOffset = programSize - bytes.length - 1
      else intcblockOffset = programSize - bytes.length - 1

      if (bytes[0] !== BYTE_CBLOCK && bytes[0] !== INT_CBLOCK) {
        // if the next opcode isn't a constant block, we're done
        break
      }
    }
  }

  return Math.max(bytecblockOffset ?? 0, intcblockOffset ?? 0)
}

/** ARC-56/ARC-32 application client that allows you to manage calls and
 * state for a specific deployed instance of an app (with a known app ID). */
export class AppClient {
  private _appId: bigint
  private _appAddress: Address
  private _appName: string
  private _appSpec: Arc56Contract
  private _algorand: AlgorandClient
  private _defaultSender?: Address
  private _defaultSigner?: TransactionSigner

  private _approvalSourceMap: ProgramSourceMap | undefined
  private _clearSourceMap: ProgramSourceMap | undefined

  private _localStateMethods: (address: ReadableAddress) => ReturnType<AppClient['getStateMethods']>
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
  private _lastCompiled: { clear?: Uint8Array; approval?: Uint8Array }

  /**
   * Create a new app client.
   * @param params The parameters to create the app client
   * @returns The `AppClient` instance
   * @example
   * ```typescript
   * const appClient = new AppClient({
   *   appId: 12345678n,
   *   appSpec: appSpec,
   *   algorand: AlgorandClient.mainNet(),
   * })
   */
  constructor(params: AppClientParams) {
    this._appId = params.appId
    this._appAddress = getApplicationAddress(this._appId)
    this._appSpec = AppClient.normaliseAppSpec(params.appSpec)
    this._appName = params.appName ?? this._appSpec.name
    this._algorand = params.algorand
    this._algorand.registerErrorTransformer!(this.handleCallErrors)
    this._defaultSender = getOptionalAddress(params.defaultSender)
    this._defaultSigner = params.defaultSigner
    this._lastCompiled = {}

    this._approvalSourceMap = params.approvalSourceMap
    this._clearSourceMap = params.clearSourceMap
    this._localStateMethods = (address: ReadableAddress) =>
      this.getStateMethods(
        () => this.getLocalState(address),
        () => getLocalABIStorageKeys(this._appSpec),
        () => getLocalABIStorageMaps(this._appSpec),
      )
    this._globalStateMethods = this.getStateMethods(
      () => this.getGlobalState(),
      () => getGlobalABIStorageKeys(this._appSpec),
      () => getGlobalABIStorageMaps(this._appSpec),
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

  /**
   * Clone this app client with different params
   *
   * @param params The params to use for the the cloned app client. Omit a param to keep the original value. Set a param to override the original value. Setting to undefined will clear the original value.
   * @returns A new app client with the altered params
   * @example
   * ```typescript
   * const appClient2 = appClient.clone({ defaultSender: 'NEW_SENDER_ADDRESS' })
   * ```
   */
  public clone(params: CloneAppClientParams) {
    return new AppClient({
      appId: this._appId,
      appSpec: this._appSpec,
      algorand: this._algorand,
      appName: this._appName,
      defaultSender: this._defaultSender,
      defaultSigner: this._defaultSigner,
      approvalSourceMap: this._approvalSourceMap,
      clearSourceMap: this._clearSourceMap,
      ...params,
    })
  }

  /**
   * Returns a new `AppClient` client, resolving the app by creator address and name
   * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
   * @param params The parameters to create the app client
   * @returns The `AppClient` instance
   * @example
   * ```typescript
   * const appClient = await AppClient.fromCreatorAndName({
   *   creatorAddress: 'CREATOR_ADDRESS',
   *   name: 'APP_NAME',
   *   appSpec: appSpec,
   *   algorand: AlgorandClient.mainNet(),
   * })
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
   * @returns The `AppClient` instance
   * @example
   * ```typescript
   * const appClient = await AppClient.fromNetwork({
   *   appSpec: appSpec,
   *   algorand: AlgorandClient.mainNet(),
   * })
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
      throw new Error(`No app ID found for network ${asJson(networkNames)} in the app spec`)
    }

    const appId = BigInt(appSpec.networks![networkIndex].appID)
    return new AppClient({ ...params, appId, appSpec })
  }

  /**
   * Takes a string or parsed JSON object that could be ARC-32 or ARC-56 format and
   * normalises it into a parsed ARC-56 contract object.
   * @param spec The spec to normalise
   * @returns The normalised ARC-56 contract object
   * @example
   * ```typescript
   * const arc56AppSpec = AppClient.normaliseAppSpec(appSpec)
   * ```
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

  /** The name of the app (from the ARC-32 / ARC-56 app spec or override). */
  public get appName() {
    return this._appName
  }

  /** The ARC-56 app spec being used */
  public get appSpec(): Arc56Contract {
    return this._appSpec
  }

  /** A reference to the underlying `AlgorandClient` this app client is using. */
  public get algorand(): AlgorandClient {
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
   * @example
   * ```typescript
   * await appClient.fundAppAccount({ amount: algo(1) })
   * ```
   */
  public async fundAppAccount(params: FundAppParams) {
    return this.send.fundAppAccount(params)
  }

  /**
   * Returns raw global state for the current app.
   * @returns The global state
   * @example
   * ```typescript
   * const globalState = await appClient.getGlobalState()
   * ```
   */
  public async getGlobalState(): Promise<AppState> {
    return await this._algorand.app.getGlobalState(this.appId)
  }

  /**
   * Returns raw local state for the given account address.
   * @param address The address of the account to get the local state for
   * @returns The local state
   * @example
   * ```typescript
   * const localState = await appClient.getLocalState('ACCOUNT_ADDRESS')
   * ```
   */
  public async getLocalState(address: ReadableAddress): Promise<AppState> {
    return await this._algorand.app.getLocalState(this.appId, getAddress(address))
  }

  /**
   * Returns the names of all current boxes for the current app.
   * @returns The names of the boxes
   * @example
   * ```typescript
   * const boxNames = await appClient.getBoxNames()
   * ```
   */
  public async getBoxNames(): Promise<BoxName[]> {
    return await this._algorand.app.getBoxNames(this.appId)
  }

  /**
   * Returns the value of the given box for the current app.
   * @param name The identifier of the box to return
   * @returns The current box value as a byte array
   * @example
   * ```typescript
   * const boxValue = await appClient.getBoxValue('boxName')
   * ```
   */
  public async getBoxValue(name: BoxIdentifier): Promise<Uint8Array> {
    return await this._algorand.app.getBoxValue(this.appId, name)
  }

  /**
   * Returns the value of the given box for the current app.
   * @param name The identifier of the box to return
   * @param type
   * @returns The current box value as a byte array
   * @example
   * ```typescript
   * const boxValue = await appClient.getBoxValueFromABIType('boxName', new ABIUintType(32))
   * ```
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
   * @example
   * ```typescript
   * const boxValues = await appClient.getBoxValues()
   * ```
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
   * @example
   * ```typescript
   * const boxValues = await appClient.getBoxValuesFromABIType(new ABIUintType(32))
   * ```
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
    this._approvalSourceMap = new ProgramSourceMap(sourceMaps.approvalSourceMap)
    this._clearSourceMap = new ProgramSourceMap(sourceMaps.clearSourceMap)
  }

  /**
   * Returns the ABI Method spec for the given method string for the app represented by this application client instance
   * @param methodNameOrSignature The method name or method signature to call if an ABI call is being emitted.
   * e.g. `my_method` or `my_method(unit64,string)bytes`
   * @returns A tuple with: [ARC-56 `Method`, algosdk `ABIMethod`]
   */
  public getABIMethod(methodNameOrSignature: string) {
    return getABIMethod(methodNameOrSignature, this._appSpec)
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
    TReturn extends ABIValue | undefined,
    TResult extends SendAppTransactionResult = SendAppTransactionResult,
  >(result: Promise<TResult> | TResult): Promise<Omit<TResult, 'return'> & AppReturn<TReturn>> {
    const resultValue = await result
    return { ...resultValue, return: resultValue.return?.returnValue as TReturn }
  }

  /**
   * Compiles the approval and clear state programs (if TEAL templates provided),
   * performing any provided deploy-time parameter replacement and stores
   * the source maps.
   *
   * If no TEAL templates provided it will use any byte code provided in the app spec.
   *
   * Will store any generated source maps for later use in debugging.
   * @param compilation Any compilation parameters to use
   * @returns The compiled code and any compilation results (including source maps)
   */
  public async compile(compilation?: AppClientCompilationParams) {
    const result = await AppClient.compile(this._appSpec, this._algorand.app, compilation)

    if (result.compiledApproval) {
      this._approvalSourceMap = result.compiledApproval.sourceMap

      this._lastCompiled.approval = result.compiledApproval.compiledBase64ToBytes
    }
    if (result.compiledClear) {
      this._clearSourceMap = result.compiledClear.sourceMap
      this._lastCompiled.clear = result.compiledClear.compiledBase64ToBytes
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
      /** Approval program source map */ approvalSourceMap?: ProgramSourceMap
      /** Clear state program source map */ clearSourceMap?: ProgramSourceMap
      /** program bytes */ program?: Uint8Array
      /** ARC56 approval source info */ approvalSourceInfo?: ProgramSourceInfo
      /** ARC56 clear source info */ clearSourceInfo?: ProgramSourceInfo
    },
  ): Error {
    const { isClearStateProgram, approvalSourceMap, clearSourceMap, program } = details
    const sourceMap = isClearStateProgram ? clearSourceMap : approvalSourceMap

    const errorDetails = LogicError.parseLogicError(e)

    // Return the error if we don't have a PC
    if (errorDetails === undefined || errorDetails?.pc === undefined) return e

    /** The PC value to find in the ARC56 SourceInfo */
    let arc56Pc = errorDetails?.pc

    const programSourceInfo = isClearStateProgram ? appSpec.sourceInfo?.clear : appSpec.sourceInfo?.approval

    /** The offset to apply to the PC if using the cblocks pc offset method */
    let cblocksOffset = 0

    // If the program uses cblocks offset, then we need to adjust the PC accordingly
    if (programSourceInfo?.pcOffsetMethod === 'cblocks') {
      if (program === undefined) throw new Error('Program bytes are required to calculate the ARC56 cblocks PC offset')
      cblocksOffset = getConstantBlockOffset(program)
      arc56Pc = errorDetails.pc - cblocksOffset
    }

    // Find the source info for this PC and get the error message
    const sourceInfo = programSourceInfo?.sourceInfo.find((s) => s.pc.includes(arc56Pc))
    const errorMessage = sourceInfo?.errorMessage

    // If we have the source we can display the TEAL in the error message
    if (appSpec.source) {
      let getLineForPc = (inputPc: number) => sourceMap?.getLocationForPc?.(inputPc)?.line

      // If the SourceMap is not defined, we need to provide our own function for going from a PC to TEAL based on ARC56 SourceInfo[]
      if (sourceMap === undefined) {
        getLineForPc = (inputPc: number) => {
          const teal = programSourceInfo?.sourceInfo.find((s) => s.pc.includes(inputPc - cblocksOffset))?.teal
          if (teal === undefined) return undefined
          return teal - 1
        }
      }
      e = new LogicError(
        errorDetails,
        Buffer.from(isClearStateProgram ? appSpec.source.clear : appSpec.source.approval, 'base64')
          .toString()
          .split('\n'),
        getLineForPc,
      )
    }
    if (errorMessage) {
      const appId = asJson(e).match(/(?<=app=)\d+/)?.[0] || ''
      const txId = asJson(e).match(/(?<=transaction )\S+(?=:)/)?.[0]
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
   * @param appManager The app manager to use for compilation
   * @param compilation Any compilation parameters to use
   * @returns The compiled code and any compilation results (including source maps)
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
    sender: ReadableAddress,
  ): Promise<AppMethodCall<CommonAppCallParams>['args']> {
    const m = getABIMethod(methodNameOrSignature, this._appSpec)
    return await Promise.all(
      args?.map(async (arg, i) => {
        const methodArg = m.args[i]
        if (!methodArg) {
          throw new Error(`Unexpected arg at position ${i}. ${m.name} only expects ${m.args.length} args`)
        }
        if (argTypeIsTransaction(methodArg.type)) {
          return arg
        }
        if (arg !== undefined) {
          return arg
        }
        const defaultValue = methodArg.defaultValue
        if (defaultValue) {
          switch (defaultValue.source) {
            case 'literal': {
              const bytes = Buffer.from(defaultValue.data, 'base64')
              const value_type = defaultValue.type ?? methodArg.type
              return getABIDecodedValue(value_type, bytes)
            }
            case 'method': {
              const method = this.getABIMethod(defaultValue.data)
              const result = await this.send.call({
                method: defaultValue.data,
                args: method.args.map(() => undefined),
                sender,
              })

              if (result.return === undefined) {
                throw new Error('Default value method call did not return a value')
              }
              return result.return
            }
            case 'local':
            case 'global':
            case 'box': {
              return await this.getDefaultValueFromStorage(
                { data: defaultValue.data, source: defaultValue.source },
                methodArg.name ?? `arg${i + 1}`,
                sender,
              )
            }
          }
        }
      }) ?? [],
    )
  }

  private async getDefaultValueFromStorage(defaultValue: ABIDefaultValue, argName: string, sender: ReadableAddress): Promise<ABIValue> {
    const keys =
      defaultValue.source === 'box'
        ? getBoxABIStorageKeys(this.appSpec)
        : defaultValue.source === 'global'
          ? getGlobalABIStorageKeys(this.appSpec)
          : getLocalABIStorageKeys(this.appSpec)

    const key = Object.values(keys).find((s) => s.key === defaultValue.data)
    if (!key) {
      throw new Error(
        `Unable to find default value for argument '${argName}': The storage key (base64: '${defaultValue.data}') is not defined in the contract's ${defaultValue.source} storage schema`,
      )
    }

    if (defaultValue.source === 'box') {
      const value = await this.getBoxValue(Buffer.from(defaultValue.data, 'base64'))
      return getABIDecodedValue(key.valueType, value)
    }

    const state = defaultValue.source === 'global' ? await this.getGlobalState() : await this.getLocalState(sender)
    const value = Object.values(state).find((s) => s.keyBase64 === defaultValue.data)
    if (!value) {
      throw new Error(
        `Unable to find default value for argument '${argName}': No value exists in ${defaultValue.source} storage for key (base64: '${defaultValue.data}')`,
      )
    }

    return 'valueRaw' in value ? getABIDecodedValue(key.valueType, value.valueRaw) : value.value
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
          OnApplicationComplete.UpdateApplication,
        ) as AppUpdateParams
      },
      /** Return params for an opt-in call */
      optIn: (params?: AppClientBareCallParams) => {
        return this.getBareParams(params, OnApplicationComplete.OptIn) as AppCallParams
      },
      /** Return params for a delete call */
      delete: (params?: AppClientBareCallParams) => {
        return this.getBareParams(params, OnApplicationComplete.DeleteApplication) as AppDeleteParams
      },
      /** Return params for a clear state call */
      clearState: (params?: AppClientBareCallParams) => {
        return this.getBareParams(params, OnApplicationComplete.ClearState) as AppCallParams
      },
      /** Return params for a close out call */
      closeOut: (params?: AppClientBareCallParams) => {
        return this.getBareParams(params, OnApplicationComplete.CloseOut) as AppCallParams
      },
      /** Return params for a call (defaults to no-op) */
      call: (params?: AppClientBareCallParams & CallOnComplete) => {
        return this.getBareParams(params, params?.onComplete ?? OnApplicationComplete.NoOp) as AppCallParams
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
          ...(await this._algorand.send.appUpdate(await this.params.bare.update(params))),
          ...(compiled as Partial<AppCompilationResult>),
        }
      },
      /** Signs and sends an opt-in call */
      optIn: (params?: AppClientBareCallParams & SendParams) => {
        return this._algorand.send.appCall(this.params.bare.optIn(params))
      },
      /** Signs and sends a delete call */
      delete: (params?: AppClientBareCallParams & SendParams) => {
        return this._algorand.send.appDelete(this.params.bare.delete(params))
      },
      /** Signs and sends a clear state call */
      clearState: (params?: AppClientBareCallParams & SendParams) => {
        return this._algorand.send.appCall(this.params.bare.clearState(params))
      },
      /** Signs and sends a close out call */
      closeOut: (params?: AppClientBareCallParams & SendParams) => {
        return this._algorand.send.appCall(this.params.bare.closeOut(params))
      },
      /** Signs and sends a call (defaults to no-op) */
      call: (params?: AppClientBareCallParams & CallOnComplete & SendParams) => {
        return this._algorand.send.appCall(this.params.bare.call(params))
      },
    }
  }

  private getMethodCallParamsMethods() {
    return {
      /**
       * Return params for a payment transaction to fund the app account
       * @param params The parameters for the fund app accont payment transaction
       * @returns The parameters which can be used to create a fund app account payment transaction
       */
      fundAppAccount: (params: FundAppParams) => {
        return {
          ...params,
          sender: this.getSender(params.sender),
          signer: this.getSigner(params.sender, params.signer),
          receiver: this.appAddress,
        } satisfies PaymentParams
      },
      /**
       * Return params for an update ABI call, including deploy-time TEAL template replacements and compilation if provided
       * @param params The parameters for the update ABI method call
       * @returns The parameters which can be used to create an update ABI method call
       */
      update: async (params: AppClientMethodCallParams & AppClientCompilationParams) => {
        return (await this.getABIParams(
          {
            ...params,
            ...(await this.compile(params)),
          },
          OnApplicationComplete.UpdateApplication,
        )) satisfies AppUpdateMethodCall
      },
      /**
       * Return params for an opt-in ABI call
       * @param params The parameters for the opt-in ABI method call
       * @returns The parameters which can be used to create an opt-in ABI method call
       */
      optIn: async (params: AppClientMethodCallParams) => {
        return (await this.getABIParams(params, OnApplicationComplete.OptIn)) as AppCallMethodCall
      },
      /**
       * Return params for an delete ABI call
       * @param params The parameters for the delete ABI method call
       * @returns The parameters which can be used to create a delete ABI method call
       */
      delete: async (params: AppClientMethodCallParams) => {
        return (await this.getABIParams(params, OnApplicationComplete.DeleteApplication)) as AppDeleteMethodCall
      },
      /** Return params for an close out ABI call
       * @param params The parameters for the close out ABI method call
       * @returns The parameters which can be used to create a close out ABI method call
       */
      closeOut: async (params: AppClientMethodCallParams) => {
        return (await this.getABIParams(params, OnApplicationComplete.CloseOut)) as AppCallMethodCall
      },
      /** Return params for an ABI call
       * @param params The parameters for the ABI method call
       * @returns The parameters which can be used to create an ABI method call
       */
      call: async (params: AppClientMethodCallParams & CallOnComplete) => {
        return (await this.getABIParams(params, params.onComplete ?? OnApplicationComplete.NoOp)) as AppCallMethodCall
      },
    }
  }

  private getMethodCallSendMethods() {
    return {
      /** Sign and send transactions for a payment transaction to fund the app account
       * @param params The parameters for the fund app account payment transaction
       * @returns The result of send the fund app account payment transaction
       */
      fundAppAccount: (params: FundAppParams & SendParams) => {
        return this._algorand.send.payment(this.params.fundAppAccount(params))
      },
      /**
       * Sign and send transactions for an update ABI call, including deploy-time TEAL template replacements and compilation if provided
       * @param params The parameters for the update ABI method call
       * @returns The result of sending the update ABI method call
       */
      update: async (params: AppClientMethodCallParams & AppClientCompilationParams & SendParams) => {
        const compiled = await this.compile(params)
        return {
          ...(await this.processMethodCallReturn(this._algorand.send.appUpdateMethodCall(await this.params.update({ ...params })))),
          ...(compiled as Partial<AppCompilationResult>),
        }
      },
      /**
       * Sign and send transactions for an opt-in ABI call
       * @param params The parameters for the opt-in ABI method call
       * @returns The result of sending the opt-in ABI method call
       */
      optIn: async (params: AppClientMethodCallParams & SendParams) => {
        return this.processMethodCallReturn(this._algorand.send.appCallMethodCall(await this.params.optIn(params)))
      },
      /**
       * Sign and send transactions for a delete ABI call
       * @param params The parameters for the delete ABI method call
       * @returns The result of sending the delete ABI method call
       */
      delete: async (params: AppClientMethodCallParams & SendParams) => {
        return this.processMethodCallReturn(this._algorand.send.appDeleteMethodCall(await this.params.delete(params)))
      },
      /**
       * Sign and send transactions for a close out ABI call
       * @param params The parameters for the close out ABI method call
       * @returns The result of sending the close out ABI method call
       */
      closeOut: async (params: AppClientMethodCallParams & SendParams) => {
        return this.processMethodCallReturn(this._algorand.send.appCallMethodCall(await this.params.closeOut(params)))
      },
      /**
       * Sign and send transactions for a call (defaults to no-op)
       * @param params The parameters for the ABI method call
       * @returns The result of sending the ABI method call
       */
      call: async (params: AppClientMethodCallParams & CallOnComplete & SendParams) => {
        // Read-only call - do it via simulate
        if (
          (params.onComplete === OnApplicationComplete.NoOp || !params.onComplete) &&
          getABIMethod(params.method, this._appSpec).readonly
        ) {
          const readonlyParams = {
            ...params,
          }

          // Read-only calls do not require fees to be paid, as they are only simulated on the network.
          // With maximum opcode budget provided, ensure_budget (and similar op-up utilities) won't need to create inner transactions,
          // so fee coverage for op-up inner transactions does not need to be accounted for in readonly calls.
          // If max_fee is provided, use it as static_fee, as there may still be inner transactions sent which need to be covered by the outermost transaction,
          // even though ARC-22 specifies that readonly methods should not send inner transactions.
          if (params.coverAppCallInnerTransactionFees && params.maxFee) {
            readonlyParams.staticFee = params.maxFee
            readonlyParams.extraFee = undefined
          }

          try {
            const result = await this._algorand
              .newGroup()
              .addAppCallMethodCall(await this.params.call(readonlyParams))
              .simulate({
                allowUnnamedResources: params.populateAppCallResources ?? true,
                // Simulate calls for a readonly method shouldn't invoke signing
                skipSignatures: true,
                // Simulate calls for a readonly method can use the max opcode budget
                extraOpcodeBudget: MAX_SIMULATE_OPCODE_BUDGET,
              })
            return this.processMethodCallReturn({
              ...result,
              transaction: result.transactions.at(-1)!,
              confirmation: result.confirmations.at(-1)!,
              return: result.returns && result.returns.length > 0 ? result.returns.at(-1)! : undefined,
            })
          } catch (e) {
            const error = e as Error
            // For read-only calls with max opcode budget, fee issues should be rare
            // but we can still provide helpful error message if they occur
            if (params.coverAppCallInnerTransactionFees && error && error.message && error.message.match(/fee too small/)) {
              throw Error(`Fees were too small. You may need to increase the transaction maxFee.`)
            }
            throw e
          }
        }
        return this.processMethodCallReturn(this._algorand.send.appCallMethodCall(await this.params.call(params)))
      },
    }
  }

  private getMethodCallCreateTransactionMethods() {
    return {
      /** Return transaction for a payment transaction to fund the app account
       * @param params The parameters for the fund app account payment transaction
       * @returns A transaction which can be used to fund the app account
       */
      fundAppAccount: (params: FundAppParams) => {
        return this._algorand.createTransaction.payment(this.params.fundAppAccount(params))
      },
      /**
       * Return transactions for an update ABI call, including deploy-time TEAL template replacements and compilation if provided
       * @param params The parameters for the update ABI method call
       * @returns The transactions which can be used to create an update ABI method call
       */
      update: async (params: AppClientMethodCallParams & AppClientCompilationParams) => {
        return this._algorand.createTransaction.appUpdateMethodCall(await this.params.update(params))
      },
      /**
       * Return transactions for an opt-in ABI call
       * @param params The parameters for the opt-in ABI method call
       * @returns The transactions which can be used to create an opt-in ABI method call
       */
      optIn: async (params: AppClientMethodCallParams) => {
        return this._algorand.createTransaction.appCallMethodCall(await this.params.optIn(params))
      },
      /**
       * Return transactions for a delete ABI call
       * @param params The parameters for the delete ABI method call
       * @returns The transactions which can be used to create a delete ABI method call
       */
      delete: async (params: AppClientMethodCallParams) => {
        return this._algorand.createTransaction.appDeleteMethodCall(await this.params.delete(params))
      },
      /**
       * Return transactions for a close out ABI call
       * @param params The parameters for the close out ABI method call
       * @returns The transactions which can be used to create a close out ABI method call
       */
      closeOut: async (params: AppClientMethodCallParams) => {
        return this._algorand.createTransaction.appCallMethodCall(await this.params.closeOut(params))
      },
      /**
       * Return transactions for an ABI call (defaults to no-op)
       * @param params The parameters for the ABI method call
       * @returns The transactions which can be used to create an ABI method call
       */
      call: async (params: AppClientMethodCallParams & CallOnComplete) => {
        return this._algorand.createTransaction.appCallMethodCall(await this.params.call(params))
      },
    }
  }

  /** Returns the sender for a call, using the provided sender or using the `defaultSender`
   * if none provided and throws an error if neither provided */
  private getSender(sender: ReadableAddress | undefined): Address {
    if (!sender && !this._defaultSender) {
      throw new Error(`No sender provided and no default sender present in app client for call to app ${this._appName}`)
    }
    return getAddress(sender ?? this._defaultSender!)
  }

  /** Returns the signer for a call, using the provided signer or the `defaultSigner`
   * if no signer was provided and the sender resolves to the default sender, the call will use default signer
   * or `undefined` otherwise (so the signer is resolved from `AlgorandClient`) */
  private getSigner(
    sender: ReadableAddress | undefined,
    signer: TransactionSigner | AddressWithSigner | undefined,
  ): TransactionSigner | AddressWithSigner | undefined {
    return signer ?? (!sender || sender === this._defaultSender ? this._defaultSigner : undefined)
  }

  private getBareParams<
    TParams extends { sender?: ReadableAddress; signer?: TransactionSigner | AddressWithSigner } | undefined,
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
      sender?: ReadableAddress
      signer?: TransactionSigner | AddressWithSigner
      args?: AppClientMethodCallParams['args']
    },
    TOnComplete extends OnApplicationComplete,
  >(params: TParams, onComplete: TOnComplete) {
    const sender = this.getSender(params.sender)
    const method = getABIMethod(params.method, this._appSpec)
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
  private handleCallErrors = async (e: Error & { sentTransactions?: Transaction[] }) => {
    // We can't use the app ID in an error to identify new apps, so instead we check the programs
    // to identify if this is the correct app
    if (this.appId === 0n) {
      if (e.sentTransactions === undefined) return e

      const txns = e.sentTransactions

      const txn = txns.find((t) => e.message.includes(t.txID()))

      const programsDefinedAndEqual = (a: Uint8Array | undefined, b: Uint8Array | undefined) => {
        if (a === undefined || b === undefined) return false
        if (a.length !== b.length) return false

        for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) return false
        }

        return true
      }

      if (
        !programsDefinedAndEqual(txn?.appCall?.clearStateProgram, this._lastCompiled.clear) ||
        !programsDefinedAndEqual(txn?.appCall?.approvalProgram, this._lastCompiled?.approval)
      ) {
        return e
      }
    } else {
      // Only handle errors for this app.
      const appIdString = `app=${this._appId.toString()}`
      if (!e.message.includes(appIdString)) return e
    }

    const logicError = await this.exposeLogicError(e)
    if (logicError instanceof LogicError) {
      let currentLine = logicError.teal_line - logicError.lines - 1
      const stackWithLines = logicError.stack
        ?.split('\n')
        .map((line) => `${(currentLine += 1)}: ${line}`)
        .join('\n')
      Config.logger.error(`${logicError.message}\n\n${stackWithLines}`)
    }

    return logicError
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
        const metadata = getBoxABIStorageKey(that._appSpec, name)
        const value = await that.getBoxValue(Buffer.from(metadata.key, 'base64'))
        return getABIDecodedValue(metadata.valueType, value)
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
        const metadata = getBoxABIStorageMap(that._appSpec, mapName)
        const prefix = Buffer.from(metadata.prefix ?? '', 'base64')
        const encodedKey = Buffer.concat([prefix, getABIEncodedValue(metadata.keyType, key)])
        const base64Key = Buffer.from(encodedKey).toString('base64')
        const value = await that.getBoxValue(Buffer.from(base64Key, 'base64'))
        return getABIDecodedValue(metadata.valueType, value)
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
        const metadata = getBoxABIStorageMap(that._appSpec, mapName)
        const prefix = Buffer.from(metadata.prefix ?? '', 'base64')
        const boxNames = await that.getBoxNames()

        return new Map(
          await Promise.all(
            boxNames
              .filter((b) => binaryStartsWith(b.nameRaw, prefix))
              .map(async (b) => {
                return [
                  getABIDecodedValue(metadata.keyType, b.nameRaw.slice(prefix.length)),
                  getABIDecodedValue(metadata.valueType, await that.getBoxValue(b.nameRaw)),
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
      [name: string]: ABIStorageKey
    },
    mapGetter: () => {
      [name: string]: ABIStorageMap
    },
  ) {
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

        if (metadata === undefined) throw new Error(`Attempted to get state value ${name}, but it does not exist`)
        const value = state.find((s) => s.keyBase64 === metadata.key)

        if (value && 'valueRaw' in value) {
          return getABIDecodedValue(metadata.valueType, value.valueRaw)
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
        const encodedKey = Buffer.concat([prefix, getABIEncodedValue(metadata.keyType, key)])
        const base64Key = Buffer.from(encodedKey).toString('base64')
        const value = state.find((s) => s.keyBase64 === base64Key)

        if (value && 'valueRaw' in value) {
          return getABIDecodedValue(metadata.valueType, value.valueRaw)
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
                getABIDecodedValue(metadata.keyType, key),
                'valueRaw' in s ? getABIDecodedValue(metadata.valueType, s.valueRaw) : s.value,
              ] as const
            }),
        )
      },
    }
    return stateMethods
  }
}
