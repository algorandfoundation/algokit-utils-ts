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
import { persistSourceMaps } from '../debugging/debugging'
import { legacySendTransactionBridge } from '../transaction/legacy-bridge'
import { encodeTransactionNote, getSenderAddress } from '../transaction/transaction'
import { DeepReadonly, binaryStartsWith } from '../util'
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
  AppLookup,
  AppMetadata,
  AppReference,
  AppState,
  AppStorageSchema,
  BoxName,
  DELETABLE_TEMPLATE_NAME,
  OnSchemaBreak,
  OnUpdate,
  RawAppCallArgs,
  TealTemplateParams,
  UPDATABLE_TEMPLATE_NAME,
} from './app'
import { Arc56Contract, Method, StorageKey, StorageMap, StructFields } from './app-arc56'
import { BoxIdentifier } from './app-manager'
import { AppSpec, arc32ToArc56 } from './app-spec'
import {
  AppCallMethodCall,
  AppCallParams,
  AppDeleteMethodCall,
  AppDeleteParams,
  AppMethodCall,
  AppUpdateMethodCall,
  AppUpdateParams,
  CommonAppCallParams,
  PaymentParams,
} from './composer'
import { PersistSourceMapInput } from './debugging'
import { Expand } from './expand'
import { LogicError } from './logic-error'
import { NetworkDetails } from './network-client'
import { ExecuteParams, SendTransactionFrom, SendTransactionParams, TransactionNote } from './transaction'
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
import ABITupleType = algosdk.ABITupleType

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
  findExistingUsing: Indexer | AppLookup
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
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
  /* Whether or not the contract should have deploy-time immutability control set, undefined = ignore */
  updatable?: boolean
  /* Whether or not the contract should have deploy-time permanence control set, undefined = ignore */
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

  algorand: AlgorandClientInterface

  /** Optional address to use for the account to use as the default sender for calls. */
  defaultSender?: string
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

/** AppClient parameters for a bare app call */
export type AppClientBareCallParams = Expand<
  Omit<CommonAppCallParams, 'appId' | 'sender' | 'onComplete'> & {
    /** The address of the account sending the transaction, if undefined then the app client's defaultSender is used. */
    sender?: string
  }
>

/** AppClient parameters for an ABI method call */
export type AppClientMethodCallParams = Expand<
  Omit<AppMethodCall<CommonAppCallParams>, 'appId' | 'sender' | 'method'> & {
    /** The address of the account sending the transaction, if undefined then the app client's defaultSender is used. */
    sender?: string
    /** The method name or method signature to call if an ABI call is being emitted
     * @example Method name
     * `my_method`
     * @example Method signature
     * `my_method(unit64,string)bytes`
     */
    method: string
  }
>

/** Parameters for funding an app account */
export type FundAppParams = Expand<
  Omit<PaymentParams, 'receiver' | 'sender'> &
    ExecuteParams & {
      /** The optional sender to send the transaction from, will use the application client's default sender by default if specified */
      sender?: string
    }
>

/** ARC-56/ARC-32 application client that allows you to manage calls and state for a given instance of an app. */
export class AppClient {
  private _appId: bigint
  private _appAddress: string
  private _appName: string
  private _appSpec: Arc56Contract
  private _algorand: AlgorandClientInterface
  private _defaultSender?: string

  private _approvalSourceMap: SourceMap | undefined
  private _clearSourceMap: SourceMap | undefined

  private _localStateMethods: (address: string) => ReturnType<AppClient['getStateMethods']>
  private _globalStateMethods: ReturnType<AppClient['getStateMethods']>
  private _boxStateMethods: ReturnType<AppClient['getBoxMethods']>

  constructor(params: AppClientParams) {
    this._appId = params.appId
    this._appAddress = algosdk.getApplicationAddress(this._appId)
    this._appSpec = AppClient.normaliseAppSpec(params.appSpec)
    this._appName = this._appSpec.name
    this._algorand = params.algorand
    this._defaultSender = params.defaultSender

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
  }

  /**
   * Returns an `AppClient` instance for the current network based on
   * pre-determined network-specific app IDs specified in the ARC-56 app spec.
   *
   * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
   * @param params The parameters to create the app client
   */
  static async fromNetwork(
    params: Expand<Omit<AppClientParams, 'algorand' | 'appId'>>,
    algorand: AlgorandClientInterface,
    network: NetworkDetails,
  ): Promise<AppClient> {
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
    return new AppClient({ ...params, appId, algorand, appSpec })
  }

  /**
   * Takes a string or parsed JSON object that could be ARC-32 or ARC-56 format and
   * normalises it into a parsed ARC-56 contract object.
   * @param spec The spec to normalise
   * @returns The normalised ARC-56 contract object
   */
  static normaliseAppSpec(spec: Arc56Contract | AppSpec | string): Arc56Contract {
    const parsedSpec = typeof spec === 'string' ? (JSON.parse(spec) as AppSpec | Arc56Contract) : spec
    const appSpec = 'hints' in parsedSpec ? arc32ToArc56(parsedSpec) : parsedSpec
    return appSpec
  }

  /** The ID of the app instance this client is linked to. */
  get appId() {
    return this._appId
  }

  /** The app address of the app instance this client is linked to. */
  get appAddress() {
    return this._appAddress
  }

  /** The name of the app (from the ARC-32 / ARC-56 app spec). */
  get appName() {
    return this._appName
  }

  /** The ARC-56 app spec being used */
  get appSpec(): DeepReadonly<Arc56Contract> {
    return this._appSpec
  }

  /** Interact with bare (non-ABI) call parameters, transactions and calls */
  get bare() {
    const that = this
    return {
      /** Get parameters to define an app transaction to the current app */
      get params() {
        return {
          /** Return params for an update call, including deploy-time TEAL template replacements and compilation if provided */
          update: async (params?: AppClientBareCallParams & AppClientCompilationParams) => {
            return that.getParams(
              {
                ...params,
                ...(await that.compile(params)),
              },
              OnApplicationComplete.UpdateApplicationOC,
            ) as AppUpdateParams
          },
          /** Return params for an opt-in call */
          optIn: (params?: AppClientBareCallParams) => {
            return that.getParams(params, OnApplicationComplete.OptInOC) as AppCallParams
          },
          /** Return params for a delete call */
          delete: (params?: AppClientBareCallParams) => {
            return that.getParams(params, OnApplicationComplete.DeleteApplicationOC) as AppDeleteParams
          },
          /** Return params for a clear state call */
          clearState: (params?: AppClientBareCallParams) => {
            return that.getParams(params, OnApplicationComplete.ClearStateOC) as AppCallParams
          },
          /** Return params for a close out call */
          closeOut: (params?: AppClientBareCallParams) => {
            return that.getParams(params, OnApplicationComplete.CloseOutOC) as AppCallParams
          },
          /** Return params for a call (defaults to no-op) */
          call: (params?: AppClientBareCallParams & CallOnComplete) => {
            return that.getParams(params, params?.onComplete ?? OnApplicationComplete.NoOpOC) as AppCallParams
          },
        }
      },

      /** Get an app transaction to the current app */
      get transactions() {
        return {
          /** Returns a transaction for an update call, including deploy-time TEAL template replacements and compilation if provided */
          update: async (params?: AppClientBareCallParams & AppClientCompilationParams) => {
            return that._algorand.transactions.appUpdate(await this.params.update(params))
          },
          /** Returns a transaction for an opt-in call */
          optIn: (params?: AppClientBareCallParams) => {
            return that._algorand.transactions.appCall(this.params.optIn(params))
          },
          /** Returns a transaction for a delete call */
          delete: (params?: AppClientBareCallParams) => {
            return that._algorand.transactions.appDelete(this.params.delete(params))
          },
          /** Returns a transaction for a clear state call */
          clearState: (params?: AppClientBareCallParams) => {
            return that._algorand.transactions.appCall(this.params.clearState(params))
          },
          /** Returns a transaction for a close out call */
          closeOut: (params?: AppClientBareCallParams) => {
            return that._algorand.transactions.appCall(this.params.closeOut(params))
          },
          /** Returns a transaction for a call (defaults to no-op) */
          call: (params?: AppClientBareCallParams & CallOnComplete) => {
            return that._algorand.transactions.appCall(this.params.call(params))
          },
        }
      },

      /** Send an app transaction to the current app */
      get send() {
        return {
          /** Signs and sends an update call, including deploy-time TEAL template replacements and compilation if provided */
          update: async (params?: AppClientBareCallParams & AppClientCompilationParams & ExecuteParams) => {
            return await that.handleCallErrors(async () => that._algorand.send.appUpdate(await this.params.update(params)))
          },
          /** Signs and sends an opt-in call */
          optIn: (params?: AppClientBareCallParams & ExecuteParams) => {
            return that.handleCallErrors(() => that._algorand.send.appCall(this.params.optIn(params)))
          },
          /** Signs and sends a delete call */
          delete: (params?: AppClientBareCallParams & ExecuteParams) => {
            return that.handleCallErrors(() => that._algorand.send.appDelete(this.params.delete(params)))
          },
          /** Signs and sends a clear state call */
          clearState: (params?: AppClientBareCallParams & ExecuteParams) => {
            return that.handleCallErrors(() => that._algorand.send.appCall(this.params.clearState(params)))
          },
          /** Signs and sends a close out call */
          closeOut: (params?: AppClientBareCallParams & ExecuteParams) => {
            return that.handleCallErrors(() => that._algorand.send.appCall(this.params.closeOut(params)))
          },
          /** Signs and sends a call (defaults to no-op) */
          call: (params?: AppClientBareCallParams & CallOnComplete & ExecuteParams) => {
            return that.handleCallErrors(() => that._algorand.send.appCall(this.params.call(params)))
          },
        }
      },
    }
  }

  /** Get parameters to define an ABI call transaction to the current app */
  get params() {
    return {
      /** Return params for an update ABI call, including deploy-time TEAL template replacements and compilation if provided */
      update: async (params: AppClientMethodCallParams & AppClientCompilationParams) => {
        return this.getABIParams(
          {
            ...params,
            ...(await this.compile(params)),
          },
          OnApplicationComplete.UpdateApplicationOC,
        ) satisfies AppUpdateMethodCall
      },
      /** Return params for an opt-in ABI call */
      optIn: (params: AppClientMethodCallParams) => {
        return this.getABIParams(params, OnApplicationComplete.OptInOC) as AppCallMethodCall
      },
      /** Return params for an delete ABI call */
      delete: (params: AppClientMethodCallParams) => {
        return this.getABIParams(params, OnApplicationComplete.DeleteApplicationOC) as AppDeleteMethodCall
      },
      /** Return params for an clear state ABI call */
      clearState: (params: AppClientMethodCallParams) => {
        return this.getABIParams(params, OnApplicationComplete.ClearStateOC) as AppCallMethodCall
      },
      /** Return params for an close out ABI call */
      closeOut: (params: AppClientMethodCallParams) => {
        return this.getABIParams(params, OnApplicationComplete.CloseOutOC) as AppCallMethodCall
      },
      /** Return params for an ABI call */
      call: (params: AppClientMethodCallParams & CallOnComplete) => {
        return this.getABIParams(params, params.onComplete ?? OnApplicationComplete.NoOpOC) as AppCallMethodCall
      },
    }
  }

  /** Get ABI transactions to the current app */
  get transactions() {
    return {
      /**
       * Return transactions for an update ABI call, including deploy-time TEAL template replacements and compilation if provided
       */
      update: async (params: AppClientMethodCallParams & AppClientCompilationParams) => {
        return this._algorand.transactions.appUpdateMethodCall(await this.params.update(params))
      },
      /**
       * Return transactions for an opt-in ABI call
       */
      optIn: (params: AppClientMethodCallParams) => {
        return this._algorand.transactions.appCallMethodCall(this.params.optIn(params))
      },
      /**
       * Return transactions for a delete ABI call
       */
      delete: (params: AppClientMethodCallParams) => {
        return this._algorand.transactions.appDeleteMethodCall(this.params.delete(params))
      },
      /**
       * Return transactions for a clear state ABI call
       */
      clearState: (params: AppClientMethodCallParams) => {
        return this._algorand.transactions.appCallMethodCall(this.params.clearState(params))
      },
      /**
       * Return transactions for a close out ABI call
       */
      closeOut: (params: AppClientMethodCallParams) => {
        return this._algorand.transactions.appCallMethodCall(this.params.closeOut(params))
      },
      /**
       * Return transactions for an ABI call (defaults to no-op)
       */
      call: (params: AppClientMethodCallParams & CallOnComplete) => {
        return this._algorand.transactions.appCallMethodCall(this.params.call(params))
      },
    }
  }

  /** Send ABI method call to the current app */
  get send() {
    return {
      /**
       * Sign and send transactions for an update ABI call, including deploy-time TEAL template replacements and compilation if provided
       */
      update: async (params: AppClientMethodCallParams & AppClientCompilationParams & ExecuteParams) => {
        const compiled = await this.compile(params)
        return {
          ...(await this.handleCallErrors(async () => this._algorand.send.appUpdateMethodCall(await this.params.update({ ...params })))),
          ...(compiled satisfies Partial<AppCompilationResult>),
        } as AppCompilationResult
      },
      /**
       * Sign and send transactions for an opt-in ABI call
       */
      optIn: (params: AppClientMethodCallParams & ExecuteParams) => {
        return this.handleCallErrors(() => this._algorand.send.appCallMethodCall(this.params.optIn(params)))
      },
      /**
       * Sign and send transactions for a delete ABI call
       */
      delete: (params: AppClientMethodCallParams & ExecuteParams) => {
        return this.handleCallErrors(() => this._algorand.send.appDeleteMethodCall(this.params.delete(params)))
      },
      /**
       * Sign and send transactions for a clear state ABI call
       */
      clearState: (params: AppClientMethodCallParams & ExecuteParams) => {
        return this.handleCallErrors(() => this._algorand.send.appCallMethodCall(this.params.clearState(params)))
      },
      /**
       * Sign and send transactions for a close out ABI call
       */
      closeOut: (params: AppClientMethodCallParams & ExecuteParams) => {
        return this.handleCallErrors(() => this._algorand.send.appCallMethodCall(this.params.closeOut(params)))
      },
      /**
       * Sign and send transactions for a call (defaults to no-op)
       */
      call: async (params: AppClientMethodCallParams & CallOnComplete & ExecuteParams) => {
        // Read-only call - do it via simulate
        if (params.onComplete === OnApplicationComplete.NoOpOC || (!params.onComplete && this.getABIMethod(params.method)[0].readonly)) {
          const result = await this._algorand.newGroup().addAppCallMethodCall(this.params.call(params)).simulate()
          return {
            ...result,
            transaction: result.transactions.at(-1)!,
            confirmation: result.confirmations.at(-1)!,
            return: result.returns?.length ?? 0 > 0 ? result.returns?.at(-1)! : undefined,
          } satisfies AppCallTransactionResult
        }

        return this.handleCallErrors(() => this._algorand.send.appCallMethodCall(this.params.call(params)))
      },
    }
  }

  /**
   * Funds Algo into the app account for this app.
   * @param fund The parameters for the funding
   * @returns The result of the funding
   */
  async fundAppAccount(fund: FundAppParams) {
    return this._algorand.send.payment({ ...fund, sender: this.getSender(fund.sender), receiver: this.appAddress })
  }

  get state() {
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
   * Returns raw global state for the current app.
   * @returns The global state
   */
  async getGlobalState(): Promise<AppState> {
    return (await this._algorand.app.getById(this.appId)).globalState
  }

  /**
   * Returns raw local state for the given account address.
   * @param address The address of the account to get the local state for
   * @returns The local state
   */
  async getLocalState(address: string): Promise<AppState> {
    return await this._algorand.app.getLocalState(this.appId, address)
  }

  /**
   * Returns the names of all current boxes for the current app.
   * @returns The names of the boxes
   */
  async getBoxNames(): Promise<BoxName[]> {
    return await this._algorand.app.getBoxNames(this.appId)
  }

  /**
   * Returns the value of the given box for the current app.
   * @param name The identifier of the box to return
   * @returns The current box value as a byte array
   */
  async getBoxValue(name: BoxIdentifier): Promise<Uint8Array> {
    return await this._algorand.app.getBoxValue(this.appId, name)
  }

  /**
   * Returns the value of the given box for the current app.
   * @param name The identifier of the box to return
   * @param type
   * @returns The current box value as a byte array
   */
  async getBoxValueFromABIType(name: BoxIdentifier, type: ABIType): Promise<ABIValue> {
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
  async getBoxValues(filter?: (name: BoxName) => boolean): Promise<{ name: BoxName; value: Uint8Array }[]> {
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
  async getBoxValuesFromABIType(type: ABIType, filter?: (name: BoxName) => boolean): Promise<{ name: BoxName; value: ABIValue }[]> {
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
  exposeLogicError(e: Error, isClearStateProgram?: boolean): Error {
    if ((!isClearStateProgram && this._approvalSourceMap == undefined) || (isClearStateProgram && this._clearSourceMap == undefined))
      return e

    const errorDetails = LogicError.parseLogicError(e)

    const errorMessage = (isClearStateProgram ? this._appSpec.sourceInfo?.clear : this._appSpec.sourceInfo?.approval)?.find((s) =>
      s?.pc?.includes(errorDetails?.pc ?? -1),
    )?.errorMessage

    if (errorDetails !== undefined && this.appSpec.source)
      e = new LogicError(
        errorDetails,
        Buffer.from(isClearStateProgram ? this.appSpec.source.clear : this.appSpec.source.approval, 'base64')
          .toString()
          .split('\n'),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        isClearStateProgram ? this._clearSourceMap! : this._approvalSourceMap!,
      )
    if (errorMessage) {
      const txId = JSON.stringify(e).match(/(?<=transaction )S+(?=:)/)?.[0]
      const error = new Error(
        `Runtime error when executing ${this._appName} (appId: ${this._appId}) in transaction ${txId}: ${errorMessage}`,
      )
      ;(error as any).cause = e
      return error
    }

    return e
  }

  /**
   * Compiles the approval and clear programs (if TEAL templates provided),
   * performing any provided deploy-time parameter replacement and stores
   * the source maps.
   *
   * If no TEAL templates provided it will use any byte code provided in the app spec.
   *
   * Will store any generated source maps for later use in debugging.
   */
  private async compile(compilation?: AppClientCompilationParams) {
    const { deployTimeParams, updatable, deletable } = compilation ?? {}

    if (!this._appSpec.source) {
      if (!this._appSpec.byteCode?.approval || !this._appSpec.byteCode?.clear) {
        throw new Error(`Attempt to compile app ${this._appName} without source or byteCode`)
      }

      return {
        approvalProgram: Buffer.from(this._appSpec.byteCode.approval, 'base64'),
        clearStateProgram: Buffer.from(this._appSpec.byteCode.clear, 'base64'),
      }
    }

    const approvalTemplate = Buffer.from(this._appSpec.source.approval, 'base64').toString('utf-8')
    const compiledApproval = await this._algorand.app.compileTealTemplate(approvalTemplate, deployTimeParams, {
      updatable,
      deletable,
    })
    this._approvalSourceMap = compiledApproval.sourceMap

    const clearTemplate = Buffer.from(this._appSpec.source.clear, 'base64').toString('utf-8')
    const compiledClear = await this._algorand.app.compileTealTemplate(clearTemplate, deployTimeParams, {
      updatable,
      deletable,
    })
    this._clearSourceMap = compiledClear.sourceMap

    if (Config.debug && Config.projectRoot) {
      persistSourceMaps({
        sources: [
          PersistSourceMapInput.fromCompiledTeal(compiledApproval, this._appName, 'approval.teal'),
          PersistSourceMapInput.fromCompiledTeal(compiledClear, this._appName, 'clear.teal'),
        ],
        projectRoot: Config.projectRoot,
        client: this._algorand.client.algod,
        withSources: true,
      })
    }

    return {
      approvalProgram: compiledApproval.compiledBase64ToBytes,
      compiledApproval,
      clearStateProgram: compiledClear.compiledBase64ToBytes,
      compiledClear,
    }
  }

  /** Returns the sender for a call, using the `defaultSender`
   * if none provided and throws an error if neither provided */
  private getSender(sender: string | undefined): string {
    if (!sender && !this._defaultSender) {
      throw new Error(`No sender provided and no default sender present in app client for call to app ${this._appName}`)
    }
    return sender ?? this._defaultSender!
  }

  private getParams<TParams extends { sender?: string } | undefined, TOnComplete extends OnApplicationComplete>(
    params: TParams,
    onComplete: TOnComplete,
  ) {
    return {
      ...params,
      appId: this._appId,
      sender: this.getSender(params?.sender),
      onComplete,
    }
  }

  private getABIParams<TParams extends { method: string; sender?: string }, TOnComplete extends OnApplicationComplete>(
    params: TParams,
    onComplete: TOnComplete,
  ) {
    return {
      ...params,
      appId: this._appId,
      sender: this.getSender(params.sender),
      method: this.getABIMethod(params.method)[1],
      onComplete,
    }
  }

  /** Make the given call and catch any errors, augmenting with debugging information before re-throwing. */
  private async handleCallErrors<TResult>(call: () => Promise<TResult>) {
    try {
      return await call()
    } catch (e) {
      throw this.exposeLogicError(e as Error)
    }
  }

  private getABIMethod(methodNameOrSignature: string) {
    let method: Method
    if (!methodNameOrSignature.includes('(')) {
      const methods = this._appSpec.methods.filter((m) => m.name === methodNameOrSignature)
      if (methods.length === 0) throw new Error(`Unable to find method ${methodNameOrSignature} in ${this._appName} app.`)
      if (methods.length > 1) {
        throw new Error(
          `Received a call to method ${methodNameOrSignature} in contract ${
            this._appName
          }, but this resolved to multiple methods; please pass in an ABI signature instead: ${this._appSpec.methods
            .map((m) => new ABIMethod(m).getSignature())
            .join(', ')}`,
        )
      }
      method = methods[0]
    } else {
      const m = this._appSpec.methods.find((m) => new ABIMethod(m).getSignature() === methodNameOrSignature)
      if (!m) throw new Error(`Unable to find method ${methodNameOrSignature} in ${this._appName} app.`)
      method = m
    }
    return [method, new algosdk.ABIMethod(method)] as const
  }

  private getTupleType(struct: StructFields): ABITupleType {
    return new ABITupleType(Object.values(struct).map((v) => (typeof v === 'string' ? ABIType.from(v) : (this.getTupleType(v) as ABIType))))
  }

  private getABIDecodedValue(value: Uint8Array | number | bigint, type: string): ABIValue {
    if (type === 'bytes' || typeof value !== 'object') return value
    if (this._appSpec.structs[type]) {
      return this.getTupleType(this._appSpec.structs[type]).decode(value)
    }
    return ABIType.from(type).decode(value)
  }

  private getABIEncodedValue(value: Uint8Array | ABIValue, type: string): Uint8Array {
    if (typeof value === 'object' && value instanceof Uint8Array) return value
    if (type === 'bytes') {
      if (typeof value !== 'object' || !(value instanceof Uint8Array)) throw new Error(`Expected bytes value for ${type}, but got ${value}`)
      return value
    }
    if (this._appSpec.structs[type]) {
      return this.getTupleType(this._appSpec.structs[type]).encode(value)
    }
    return ABIType.from(type).encode(value)
  }

  private getBoxMethods() {
    const that = this
    const stateMethods = {
      /**
       * Returns all single-key state values in a record keyed by the key name and the value a decoded ABI value.
       */
      getAll: async () => {
        return Object.fromEntries(
          await Promise.all(Object.keys(that._appSpec.state.keys.box).map(async (key) => [key, await stateMethods.getValue(key)])),
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
        return that.getABIDecodedValue(value, metadata.valueType)
      },
      /**
       *
       * @param mapName The name of the map to read from
       * @param key The key within the map (without any map prefix) as either a Buffer with the bytes or a value
       *  that will be converted to bytes by encoding it using the specified ABI key type
       *  in the ARC-56 spec
       */
      getMapValue: async (mapName: string, key: Buffer | any, appState?: AppState) => {
        const metadata = that._appSpec.state.maps.box[mapName]
        const prefix = Buffer.from(metadata.prefix ?? '', 'base64')
        const encodedKey = Buffer.concat([prefix, that.getABIEncodedValue(key, metadata.keyType)])
        const base64Key = Buffer.from(encodedKey).toString('base64')
        const value = await that.getBoxValue(Buffer.from(base64Key, 'base64'))
        return that.getABIDecodedValue(value, metadata.valueType)
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
                  that.getABIDecodedValue(b.nameRaw.slice(prefix.length), metadata.keyType),
                  that.getABIDecodedValue(await that.getBoxValue(Buffer.from(base64Key, 'base64')), metadata.valueType),
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
    const that = this
    const stateMethods = {
      /**
       * Returns all single-key state values in a record keyed by the key name and the value a decoded ABI value.
       */
      getAll: async () => {
        const appState = await stateGetter()
        return Object.fromEntries(
          await Promise.all(Object.keys(keyGetter()).map(async (key) => [key, await stateMethods.getValue(key, appState)])),
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
          return that.getABIDecodedValue(value.valueRaw, metadata.valueType)
        }

        return value?.value
      },
      /**
       *
       * @param mapName The name of the map to read from
       * @param key The key within the map (without any map prefix) as either a Buffer with the bytes or a value
       *  that will be converted to bytes by encoding it using the specified ABI key type
       *  in the ARC-56 spec
       * @param appState Optional cached value of the current state
       */
      getMapValue: async (mapName: string, key: Buffer | any, appState?: AppState) => {
        const state = Object.values(appState ?? (await stateGetter()))
        const metadata = mapGetter()[mapName]

        const prefix = Buffer.from(metadata.prefix ?? '', 'base64')
        const encodedKey = Buffer.concat([prefix, that.getABIEncodedValue(key, metadata.keyType)])
        const base64Key = Buffer.from(encodedKey).toString('base64')
        const value = state.find((s) => s.keyBase64 === base64Key)

        if (value && 'valueRaw' in value) {
          return that.getABIDecodedValue(value.valueRaw, metadata.valueType)
        }

        return value?.value
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
        const state = Object.values(await stateGetter())
        const metadata = mapGetter()[mapName]

        const prefix = Buffer.from(metadata.prefix ?? '', 'base64')

        return new Map(
          state
            .filter((s) => binaryStartsWith(s.keyRaw, prefix))
            .map((s) => {
              const key = s.keyRaw.slice(prefix.length)
              return [
                that.getABIDecodedValue(key, metadata.keyType),
                that.getABIDecodedValue('valueRaw' in s ? s.valueRaw : s.value, metadata.valueType),
              ]
            }),
        )
      },
    }
    return stateMethods
  }
}

/**
 * @deprecated Use `AppClient` instead.
 *
 * Application client - a class that wraps an ARC-0032 app spec and provides high productivity methods to deploy and call the app */
export class ApplicationClient {
  private algod: Algodv2
  private indexer?: algosdk.Indexer
  private appSpec: AppSpec
  private sender: SendTransactionFrom | undefined
  private params: SuggestedParams | undefined
  private existingDeployments: AppLookup | undefined
  private deployTimeParams?: TealTemplateParams

  private _appId: number | bigint
  private _appAddress: string
  private _creator: string | undefined
  private _appName: string

  private _approvalSourceMap: SourceMap | undefined
  private _clearSourceMap: SourceMap | undefined

  /**
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
   * Compiles the approval and clear programs and sets up the source map.
   * @param compilation The deploy-time parameters for the compilation
   * @returns The compiled approval and clear programs
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

    if (Config.debug && Config.projectRoot) {
      persistSourceMaps({
        sources: [
          PersistSourceMapInput.fromCompiledTeal(approvalCompiled, this._appName, 'approval.teal'),
          PersistSourceMapInput.fromCompiledTeal(clearCompiled, this._appName, 'clear.teal'),
        ],
        projectRoot: Config.projectRoot,
        client: this.algod,
        withSources: true,
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
      throw this.exposeLogicError(e as Error)
    }
  }

  /**
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
      throw this.exposeLogicError(e as Error)
    }
  }

  /**
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
   * Issues a opt_in call to the app.
   * @param call The call details.
   * @returns The result of the call
   */
  async optIn(call?: AppClientCallParams) {
    return await this.callOfType(call, 'opt_in')
  }

  /**
   * Issues a close_out call to the app.
   * @param call The call details.
   * @returns The result of the call
   */
  async closeOut(call?: AppClientCallParams) {
    return await this.callOfType(call, 'close_out')
  }

  /**
   * Issues a clear_state call to the app.
   * @param call The call details.
   * @returns The result of the call
   */
  async clearState(call?: AppClientClearStateParams) {
    return await this.callOfType(call, 'clear_state')
  }

  /**
   * Issues a delete_application call to the app.
   * @param call The call details.
   * @returns The result of the call
   */
  async delete(call?: AppClientCallParams) {
    return await this.callOfType(call, 'delete_application')
  }

  /**
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
