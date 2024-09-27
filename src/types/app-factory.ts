import algosdk from 'algosdk'
import { AlgorandClientInterface } from './algorand-client-interface'
import {
  AppCompilationResult,
  AppReturn,
  DELETABLE_TEMPLATE_NAME,
  SendAppTransactionResult,
  TealTemplateParams,
  UPDATABLE_TEMPLATE_NAME,
} from './app'
import { ABIStruct, Arc56Contract, Arc56Method, getArc56Method, getArc56ReturnValue } from './app-arc56'
import {
  AppClient,
  AppClientBareCallParams,
  AppClientCompilationParams,
  AppClientMethodCallParams,
  AppClientParams,
  AppSourceMaps,
  ResolveAppClientByCreatorAndName,
} from './app-client'
import {
  AppDeployParams,
  DeployAppDeleteMethodCall,
  DeployAppDeleteParams,
  DeployAppUpdateMethodCall,
  DeployAppUpdateParams,
} from './app-deployer'
import { AppSpec } from './app-spec'
import { AppCreateMethodCall, AppCreateParams } from './composer'
import { Expand } from './expand'
import { SendParams } from './transaction'
import SourceMap = algosdk.SourceMap
import OnApplicationComplete = algosdk.OnApplicationComplete
import ABIValue = algosdk.ABIValue

/** Parameters to create an app client */
export interface AppFactoryParams {
  /** The ARC-56 or ARC-32 application spec as either:
   *  * Parsed JSON ARC-56 `Contract`
   *  * Parsed JSON ARC-32 `AppSpec`
   *  * Raw JSON string (in either ARC-56 or ARC-32 format)
   */
  appSpec: Arc56Contract | AppSpec | string

  /** `AlgorandClient` instance */
  algorand: AlgorandClientInterface

  /**
   * Optional override for the app name; used for on-chain metadata and lookups.
   * Defaults to the ARC-32/ARC-56 app spec name.
   */
  appName?: string

  /** Optional address to use for the account to use as the default sender for calls. */
  defaultSender?: string

  /** The version of app that is / will be deployed; defaults to 1.0 */
  version?: string

  /**
   * Whether or not the contract should have deploy-time immutability control set, undefined = ignore.
   * If specified here will get used in calls to `deploy` and `create` calls unless overridden in those calls.
   *
   * Useful if you want to vend multiple contracts from the same factory without specifying this value
   * for each call.
   */
  updatable?: boolean

  /**
   * Whether or not the contract should have deploy-time permanence control set, undefined = ignore.
   * If specified here will get used in calls to `deploy` and `create` calls unless overridden in those calls.
   *
   * Useful if you want to vend multiple contracts from the same factory without specifying this value
   * for each call.
   */
  deletable?: boolean

  /**
   * Optional deploy-time TEAL template replacement parameters.
   * If specified here will get used in calls to `deploy` and `create` calls unless overridden in those calls.
   *
   * Useful if you want to vend multiple contracts from the same factory without specifying this value
   * for each call.
   */
  deployTimeParams?: TealTemplateParams
}

/** onComplete parameter for a create app call */
export type CreateOnComplete = {
  onComplete?: Exclude<OnApplicationComplete, OnApplicationComplete.ClearStateOC>
}

/** Specifies a schema used for creating an app */
export type CreateSchema = {
  /** The state schema for the app. This is immutable once the app is created. By default uses the ARC32/ARC-56 spec. */
  schema?: {
    /** The number of integers saved in global state. */
    globalInts: number
    /** The number of byte slices saved in global state. */
    globalByteSlices: number
    /** The number of integers saved in local state. */
    localInts: number
    /** The number of byte slices saved in local state. */
    localByteSlices: number
  }
  /** Number of extra pages required for the programs.
   * Defaults to the number needed for the programs in this call if not specified.
   * This is immutable once the app is created. */
  extraProgramPages?: number
}

/** Params to specify a bare (raw) create call for an app */
export type AppFactoryCreateParams = Expand<AppClientBareCallParams & AppClientCompilationParams & CreateOnComplete & CreateSchema>

/** Params to specify a create method call for an app */
export type AppFactoryCreateMethodCallParams = Expand<
  AppClientMethodCallParams & AppClientCompilationParams & CreateOnComplete & CreateSchema
>

/** Params to get an app client by ID from an app factory. */
export type AppFactoryAppClientParams = Expand<Omit<AppClientParams, 'algorand' | 'appSpec'>>

/** Params to get an app client by creator address and name from an app factory. */
export type AppFactoryResolveAppClientByCreatorAndNameParams = Expand<Omit<ResolveAppClientByCreatorAndName, 'algorand' | 'appSpec'>>

/** Parameters to define a deployment for an `AppFactory` */
export type AppFactoryDeployParams = Expand<
  Omit<AppDeployParams, 'createParams' | 'updateParams' | 'deleteParams' | 'metadata'> & {
    /** Create transaction parameters to use if a create needs to be issued as part of deployment */
    createParams?:
      | Expand<AppClientMethodCallParams & CreateOnComplete & CreateSchema>
      | Expand<AppClientBareCallParams & CreateOnComplete & CreateSchema>
    /** Update transaction parameters to use if a create needs to be issued as part of deployment */
    updateParams?: AppClientMethodCallParams | AppClientBareCallParams
    /** Delete transaction parameters to use if a create needs to be issued as part of deployment */
    deleteParams?: AppClientMethodCallParams | AppClientBareCallParams
    /**
     * Whether or not the contract should have deploy-time immutability control set.
     * `undefined` = use AppFactory constructor value if set or base it on the app spec.
     */
    updatable?: boolean
    /**
     * Whether or not the contract should have deploy-time permanence control set.
     * `undefined` = use AppFactory constructor value if set or base it on the app spec.
     */
    deletable?: boolean
  }
>

/**
 * ARC-56/ARC-32 app factory that, for a given app spec, allows you to create
 * and deploy one or more app instances and to create one or more app clients
 * to interact with those (or other) app instances.
 */
export class AppFactory {
  private _appSpec: Arc56Contract
  private _appName: string
  private _algorand: AlgorandClientInterface
  private _version: string
  private _defaultSender?: string
  private _deployTimeParams?: TealTemplateParams
  private _updatable?: boolean
  private _deletable?: boolean

  private _approvalSourceMap: SourceMap | undefined
  private _clearSourceMap: SourceMap | undefined

  private _paramsMethods: ReturnType<AppFactory['getParamsMethods']>

  constructor(params: AppFactoryParams) {
    this._appSpec = AppClient.normaliseAppSpec(params.appSpec)
    this._appName = params.appName ?? this._appSpec.name
    this._algorand = params.algorand
    this._version = params.version ?? '1.0'
    this._defaultSender = params.defaultSender
    this._deployTimeParams = params.deployTimeParams
    this._updatable = params.updatable
    this._deletable = params.deletable
    this._paramsMethods = this.getParamsMethods()
  }

  /** Get parameters to create transactions (create and deploy related calls) for the current app.
   *
   * A good mental model for this is that these parameters represent a deferred transaction creation.
   * @example Create a transaction in the future using Algorand Client
   * ```typescript
   * const createAppParams = appFactory.params.create({method: 'create_method', args: [123, 'hello']})
   * // ...
   * await algorand.send.AppCreateMethodCall(createAppParams)
   * ```
   * @example Define a nested transaction as an ABI argument
   * ```typescript
   * const createAppParams = appFactory.params.create({method: 'create_method', args: [123, 'hello']})
   * await appClient.send.call({method: 'my_method', args: [createAppParams]})
   * ```
   */
  get params() {
    return this._paramsMethods
  }

  /** Create transactions for the current app */
  readonly createTransaction = {
    /** Create bare (raw) transactions for the current app */
    bare: {
      /** Create a create call transaction, including deploy-time TEAL template replacements and compilation if provided */
      create: async (params?: AppFactoryCreateParams) => {
        return this._algorand.createTransaction.appCreate(await this.params.bare.create(params))
      },
    },

    /** Create a create ABI call transaction, including deploy-time TEAL template replacements and compilation if provided */
    create: async (params: AppFactoryCreateMethodCallParams) => {
      return this._algorand.createTransaction.appCreateMethodCall(await this.params.create(params))
    },
  }

  /** Send transactions to the current app */
  readonly send = {
    /** Send bare (raw) transactions for the current app */
    bare: {
      create: async (params?: AppFactoryCreateParams & SendParams) => {
        const updatable = params?.updatable ?? this._updatable
        const deletable = params?.deletable ?? this._deletable
        const deployTimeParams = params?.deployTimeParams ?? this._deployTimeParams
        const compiled = await this.compile({ deployTimeParams, updatable, deletable })
        const result = await this.handleCallErrors(async () => ({
          ...(await this._algorand.send.appCreate(await this.params.bare.create({ ...params, updatable, deletable, deployTimeParams }))),
          return: undefined,
        }))
        return {
          appClient: this.getAppClientById({
            appId: result.appId,
          }),
          result: {
            ...result,
            ...(compiled as Partial<AppCompilationResult>),
          },
        }
      },
    },

    /**
     * Creates an instance of the app and returns the result of the creation
     * transaction and an app client to interact with that app instance.
     *
     * Performs deploy-time TEAL template placeholder substitutions (if specified).
     * @param params The parameters to create the app
     * @returns The app client and the result of the creation transaction
     */
    create: async (params: AppFactoryCreateMethodCallParams & SendParams) => {
      const updatable = params?.updatable ?? this._updatable
      const deletable = params?.deletable ?? this._deletable
      const deployTimeParams = params?.deployTimeParams ?? this._deployTimeParams
      const compiled = await this.compile({ deployTimeParams, updatable, deletable })
      const result = await this.handleCallErrors(async () =>
        this.parseMethodCallReturn(
          this._algorand.send.appCreateMethodCall(await this.params.create({ ...params, updatable, deletable, deployTimeParams })),
          getArc56Method(params.method, this._appSpec),
        ),
      )
      return {
        appClient: this.getAppClientById({
          appId: result.appId,
        }),
        result: {
          ...result,
          ...(compiled as Partial<AppCompilationResult>),
        },
      }
    },
  }

  /**
   * Idempotently deploy (create if not exists, update if changed) an app against the given name for the given creator account, including deploy-time TEAL template placeholder substitutions (if specified).
   *
   * **Note:** When using the return from this function be sure to check `operationPerformed` to get access to various return properties like `transaction`, `confirmation` and `deleteResult`.
   *
   * **Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.
   *
   * **Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.
   * @param params The arguments to control the app deployment
   * @returns The app client and the result of the deployment
   */
  public async deploy(params: AppFactoryDeployParams) {
    const updatable = params.updatable ?? this._updatable ?? this.getDeployTimeControl('updatable')
    const deletable = params.deletable ?? this._deletable ?? this.getDeployTimeControl('deletable')
    const deployTimeParams = params.deployTimeParams ?? this._deployTimeParams
    const compiled = await this.compile({ deployTimeParams, updatable, deletable })
    const deployResult = await this._algorand.appDeployer.deploy({
      ...params,
      createParams: await (params.createParams && 'method' in params.createParams
        ? this.params.create({ ...params.createParams, updatable, deletable, deployTimeParams })
        : this.params.bare.create({ ...params.createParams, updatable, deletable, deployTimeParams })),
      updateParams:
        params.updateParams && 'method' in params.updateParams
          ? this.params.deployUpdate(params.updateParams)
          : this.params.bare.deployUpdate(params.updateParams),
      deleteParams:
        params.deleteParams && 'method' in params.deleteParams
          ? this.params.deployDelete(params.deleteParams)
          : this.params.bare.deployDelete(params.deleteParams),
      metadata: {
        name: this._appName,
        version: this._version,
        updatable,
        deletable,
      },
    })
    const appClient = this.getAppClientById({
      appId: deployResult.appId,
    })
    const result = {
      ...deployResult,
      ...compiled,
    }
    return {
      appClient,
      result: {
        ...result,
        return:
          'return' in result
            ? result.operationPerformed === 'update'
              ? params.updateParams && 'method' in params.updateParams
                ? getArc56ReturnValue(result.return, getArc56Method(params.updateParams.method, this._appSpec), this._appSpec.structs)
                : undefined
              : params.createParams && 'method' in params.createParams
                ? getArc56ReturnValue(result.return, getArc56Method(params.createParams.method, this._appSpec), this._appSpec.structs)
                : undefined
            : undefined,
        deleteReturn:
          'deleteReturn' in result && params.deleteParams && 'method' in params.deleteParams
            ? getArc56ReturnValue(result.deleteReturn, getArc56Method(params.deleteParams.method, this._appSpec), this._appSpec.structs)
            : undefined,
      },
    }
  }

  /**
   * Returns a new `AppClient` client for an app instance of the given ID.
   *
   * Automatically populates appName, defaultSender and source maps from the factory
   * if not specified in the params.
   * @param params The parameters to create the app client
   * @returns The `AppClient`
   */
  public getAppClientById(params: AppFactoryAppClientParams) {
    return new AppClient({
      ...params,
      algorand: this._algorand,
      appSpec: this._appSpec,
      appName: params.appName ?? this._appName,
      defaultSender: params.defaultSender ?? this._defaultSender,
      approvalSourceMap: params.approvalSourceMap ?? this._approvalSourceMap,
      clearSourceMap: params.clearSourceMap ?? this._clearSourceMap,
    })
  }

  /**
   * Returns a new `AppClient` client, resolving the app by creator address and name
   * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
   *
   * Automatically populates appName, defaultSender and source maps from the factory
   * if not specified in the params.
   * @param params The parameters to create the app client
   * @returns The `AppClient`
   */
  public getAppClientByCreatorAndName(params: AppFactoryResolveAppClientByCreatorAndNameParams) {
    return AppClient.fromCreatorAndName({
      ...params,
      algorand: this._algorand,
      appSpec: this._appSpec,
      appName: params.appName ?? this._appName,
      defaultSender: params.defaultSender ?? this._defaultSender,
      approvalSourceMap: params.approvalSourceMap ?? this._approvalSourceMap,
      clearSourceMap: params.clearSourceMap ?? this._clearSourceMap,
    })
  }

  /**
   * Takes an error that may include a logic error from a call to the current app and re-exposes the
   * error to include source code information via the source map and ARC-56 spec.
   * @param e The error to parse
   * @param isClearStateProgram Whether or not the code was running the clear state program (defaults to approval program)
   * @returns The new error, or if there was no logic error or source map then the wrapped error with source details
   */
  exposeLogicError(e: Error, isClearStateProgram?: boolean): Error {
    return AppClient.exposeLogicError(e, this._appSpec, {
      isClearStateProgram,
      approvalSourceMap: this._approvalSourceMap,
      clearSourceMap: this._clearSourceMap,
    })
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

  private getDeployTimeControl(control: 'updatable' | 'deletable'): boolean | undefined {
    const approval = this._appSpec.source?.approval ? Buffer.from(this._appSpec.source.approval, 'base64').toString('utf-8') : undefined
    // variable not present, so unknown control value
    if (!approval || !approval.includes(control === 'updatable' ? UPDATABLE_TEMPLATE_NAME : DELETABLE_TEMPLATE_NAME)) return undefined

    // A call is present and configured
    return (
      this._appSpec.bareActions.call.includes(control === 'updatable' ? 'UpdateApplication' : 'DeleteApplication') ||
      Object.values(this._appSpec.methods).some((c) =>
        c.actions.call.includes(control === 'updatable' ? 'UpdateApplication' : 'DeleteApplication'),
      )
    )
  }

  private getParamsMethods() {
    return {
      /** Return params for a create ABI call, including deploy-time TEAL template replacements and compilation if provided */
      create: async (params: AppFactoryCreateMethodCallParams) => {
        return this.getABIParams(
          {
            ...params,
            deployTimeParams: params.deployTimeParams ?? this._deployTimeParams,
            schema: params.schema ?? {
              globalByteSlices: this._appSpec.state.schema.global.bytes,
              globalInts: this._appSpec.state.schema.global.ints,
              localByteSlices: this._appSpec.state.schema.local.bytes,
              localInts: this._appSpec.state.schema.local.ints,
            },
            ...(await this.compile({ ...params, deployTimeParams: params.deployTimeParams ?? this._deployTimeParams })),
          },
          params.onComplete ?? OnApplicationComplete.NoOpOC,
        ) satisfies AppCreateMethodCall
      },
      /** Return params for a deployment update ABI call */
      deployUpdate: (params: AppClientMethodCallParams) => {
        return this.getABIParams(params, OnApplicationComplete.UpdateApplicationOC) satisfies DeployAppUpdateMethodCall
      },
      /** Return params for a deployment delete ABI call */
      deployDelete: (params: AppClientMethodCallParams) => {
        return this.getABIParams(params, OnApplicationComplete.DeleteApplicationOC) satisfies DeployAppDeleteMethodCall
      },
      bare: {
        /** Return params for a create bare call, including deploy-time TEAL template replacements and compilation if provided */
        create: async (params?: AppFactoryCreateParams) => {
          return this.getBareParams(
            {
              ...params,
              deployTimeParams: params?.deployTimeParams ?? this._deployTimeParams,
              schema: params?.schema ?? {
                globalByteSlices: this._appSpec.state.schema.global.bytes,
                globalInts: this._appSpec.state.schema.global.ints,
                localByteSlices: this._appSpec.state.schema.local.bytes,
                localInts: this._appSpec.state.schema.local.ints,
              },
              ...(await this.compile({ ...params, deployTimeParams: params?.deployTimeParams ?? this._deployTimeParams })),
            },
            params?.onComplete ?? OnApplicationComplete.NoOpOC,
          ) satisfies AppCreateParams
        },
        /** Return params for a deployment update bare call */
        deployUpdate: (params?: AppClientBareCallParams) => {
          return this.getBareParams(params, OnApplicationComplete.UpdateApplicationOC) satisfies DeployAppUpdateParams
        },
        /** Return params for a deployment delete bare call */
        deployDelete: (params?: AppClientBareCallParams) => {
          return this.getBareParams(params, OnApplicationComplete.DeleteApplicationOC) satisfies DeployAppDeleteParams
        },
      },
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

  private getBareParams<TParams extends { sender?: string } | undefined, TOnComplete extends OnApplicationComplete>(
    params: TParams,
    onComplete: TOnComplete,
  ) {
    return {
      ...params,
      sender: this.getSender(params?.sender),
      onComplete,
    }
  }

  private getABIParams<
    TParams extends { method: string; sender?: string; args?: AppClientMethodCallParams['args'] },
    TOnComplete extends OnApplicationComplete,
  >(params: TParams, onComplete: TOnComplete) {
    return {
      ...params,
      sender: this.getSender(params.sender),
      method: getArc56Method(params.method, this._appSpec),
      args: AppClient.getABIArgsWithDefaultValues(params.method, params.args, this._appSpec),
      onComplete,
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

  /**
   * Checks for decode errors on the SendAppTransactionResult and maps the return value to the specified type
   * on the ARC-56 method.
   *
   * If the return type is a struct then the struct will be returned.
   *
   * @param result The SendAppTransactionResult to be mapped
   * @param method The method that was called
   * @returns The smart contract response with an updated return value
   */
  async parseMethodCallReturn<
    TReturn extends Uint8Array | ABIValue | ABIStruct | undefined,
    TResult extends SendAppTransactionResult = SendAppTransactionResult,
  >(result: Promise<TResult> | TResult, method: Arc56Method): Promise<Omit<TResult, 'return'> & AppReturn<TReturn>> {
    const resultValue = await result
    return { ...resultValue, return: getArc56ReturnValue(resultValue.return, method, this._appSpec.structs) }
  }
}
