import algosdk, { Address } from 'algosdk'
import { type AlgorandClient } from './algorand-client'
import { AppCompilationResult, DELETABLE_TEMPLATE_NAME, TealTemplateParams, UPDATABLE_TEMPLATE_NAME } from './app'
import { Arc56Contract, getArc56Method, getArc56ReturnValue } from './app-arc56'
import {
  AppClient,
  AppClientBareCallParams,
  AppClientCompilationParams,
  AppClientMethodCallParams,
  AppSourceMaps,
  CloneAppClientParams,
  ResolveAppClientByCreatorAndName,
} from './app-client'
import { AppDeployParams } from './app-deployer'
import { AppSpec } from './app-spec'
import { Expand } from './expand'
import OnApplicationComplete = algosdk.OnApplicationComplete
import TransactionSigner = algosdk.TransactionSigner

/** Parameters to create an app client */
export interface AppFactoryParams {
  /** The ARC-56 or ARC-32 application spec as either:
   *  * Parsed JSON ARC-56 `Contract`
   *  * Parsed JSON ARC-32 `AppSpec`
   *  * Raw JSON string (in either ARC-56 or ARC-32 format)
   */
  appSpec: Arc56Contract | AppSpec | string

  /** `AlgorandClient` instance */
  algorand: AlgorandClient

  /**
   * Optional override for the app name; used for on-chain metadata and lookups.
   * Defaults to the ARC-32/ARC-56 app spec name.
   */
  appName?: string

  /** Optional address to use for the account to use as the default sender for calls. */
  defaultSender?: Address | string

  /** Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`). */
  defaultSigner?: TransactionSigner

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
    /** Override the app name for this deployment */
    appName?: string
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
  private _algorand: AlgorandClient
  private _version: string
  private _defaultSender?: Address
  private _defaultSigner?: TransactionSigner
  private _deployTimeParams?: TealTemplateParams
  private _updatable?: boolean
  private _deletable?: boolean

  private _appClient: AppClient

  /**
   * Create a new app factory.
   * @param params The parameters to create the app factory
   * @returns The `AppFactory` instance
   * @example
   * ```typescript
   * const appFactory = new AppFactory({
   *   appSpec: appSpec,
   *   algorand: AlgorandClient.mainNet(),
   * })
   */
  constructor(params: AppFactoryParams) {
    this._appSpec = AppClient.normaliseAppSpec(params.appSpec)
    this._appName = params.appName ?? this._appSpec.name
    this._algorand = params.algorand
    this._version = params.version ?? '1.0'
    this._defaultSender = typeof params.defaultSender === 'string' ? Address.fromString(params.defaultSender) : params.defaultSender
    this._defaultSigner = params.defaultSigner
    this._deployTimeParams = params.deployTimeParams
    this._updatable = params.updatable
    this._deletable = params.deletable
    this._appClient = new AppClient({
      appId: 0n,
      appSpec: this._appSpec,
      algorand: this._algorand,
      defaultSender: this._defaultSender,
      defaultSigner: this._defaultSigner,
    })
  }

  /** The name of the app (from the ARC-32 / ARC-56 app spec or override). */
  public get appName() {
    return this._appName
  }

  /** The ARC-56 app spec being used */
  get appSpec() {
    return this._appSpec
  }

  /** Return the algorand client this factory is using. */
  get algorand() {
    return this._algorand
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
    return {
      create: this._appClient.params.create,
      deployUpdate: this._appClient.params.update,
      deployDelete: this._appClient.params.delete,
      bare: {
        create: this._appClient.params.bare.create,
        deployUpdate: this._appClient.params.bare.update,
        deployDelete: this._appClient.params.bare.delete,
      },
    }
  }

  /** Create transactions for the current app */
  readonly createTransaction = {
    /** Create bare (raw) transactions for the current app */
    bare: {
      /**
       * Create a create app call transaction using a bare (raw) create call.
       *
       * Performs deploy-time TEAL template placeholder substitutions (if specified).
       * @param params The parameters to create the create call transaction
       * @returns The create call transaction
       */
      create: async (params?: Parameters<typeof AppClient.prototype.params.bare.create>[0]) => {
        return this._algorand.createTransaction.appCreate(await this.params.bare.create(params))
      },
    },

    /**
     * Create a create app call transaction using an ABI create call.
     *
     * Performs deploy-time TEAL template placeholder substitutions (if specified).
     * @param params The parameters to create the create call transaction
     * @returns The create call transaction
     */
    create: async (params: Parameters<typeof AppClient.prototype.params.create>[0]) => {
      return this._algorand.createTransaction.appCreateMethodCall(await this.params.create(params))
    },
  }

  private defaultCreateParams() {
    return {
      deployTimeParams: this._deployTimeParams,
      schema: {
        globalByteSlices: this._appSpec.state.schema.global.bytes,
        globalInts: this._appSpec.state.schema.global.ints,
        localByteSlices: this._appSpec.state.schema.local.bytes,
        localInts: this._appSpec.state.schema.local.ints,
      },
    }
  }

  /** Send transactions to the current app */
  readonly send = {
    /** Send bare (raw) transactions for the current app */
    bare: {
      /**
       * Creates an instance of the app using a bare (raw) create call and returns the result
       * of the creation transaction and an app client to interact with that app instance.
       *
       * Performs deploy-time TEAL template placeholder substitutions (if specified).
       * @param params The parameters to create the app
       * @returns The app client and the result of the creation transaction
       */
      create: async (params?: Parameters<typeof AppClient.prototype.send.bare.create>[0]) => {
        const appClient = this._appClient.clone({})
        return {
          result: await appClient.send.bare.create({ ...this.defaultCreateParams(), ...params }),
          appClient,
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
    create: async (params: Parameters<typeof AppClient.prototype.send.create>[0]) => {
      const appClient = this._appClient.clone({})
      return {
        result: await appClient.send.create({ ...this.defaultCreateParams(), ...params }),
        appClient,
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
   * @example
   * ```ts
   * const { appClient, result } = await factory.deploy({
   *   createParams: {
   *     sender: 'SENDER_ADDRESS',
   *     approvalProgram: 'APPROVAL PROGRAM',
   *     clearStateProgram: 'CLEAR PROGRAM',
   *     schema: {
   *       globalByteSlices: 0,
   *       globalInts: 0,
   *       localByteSlices: 0,
   *       localInts: 0
   *     }
   *   },
   *   updateParams: {
   *     sender: 'SENDER_ADDRESS'
   *   },
   *   deleteParams: {
   *     sender: 'SENDER_ADDRESS'
   *   },
   *   metadata: { name: 'my_app', version: '2.0', updatable: false, deletable: false },
   *   onSchemaBreak: 'append',
   *   onUpdate: 'append'
   *  })
   * ```
   */
  public async deploy(params: AppFactoryDeployParams) {
    const updatable = params.updatable ?? this._updatable ?? this.getDeployTimeControl('updatable')
    const deletable = params.deletable ?? this._deletable ?? this.getDeployTimeControl('deletable')
    const deployTimeParams = { ...(params.deployTimeParams ?? this._deployTimeParams) }

    const compiled = await this._appClient.compile({ deployTimeParams, updatable, deletable })

    const deployResult = await this._algorand.appDeployer.deploy({
      ...params,
      createParams: await (params.createParams && 'method' in params.createParams
        ? this.params.create({ ...this.defaultCreateParams(), ...params.createParams, updatable, deletable, deployTimeParams })
        : this.params.bare.create({ ...this.defaultCreateParams(), ...params.createParams, updatable, deletable, deployTimeParams })),
      updateParams: await (params.updateParams && 'method' in params.updateParams
        ? this.params.deployUpdate({ ...params.updateParams, updatable, deletable, deployTimeParams })
        : this.params.bare.deployUpdate({ ...params.updateParams, updatable, deletable, deployTimeParams })),
      deleteParams: await (params.deleteParams && 'method' in params.deleteParams
        ? this.params.deployDelete(params.deleteParams)
        : this.params.bare.deployDelete(params.deleteParams)),
      metadata: {
        name: params.appName ?? this._appName,
        version: this._version,
        updatable,
        deletable,
      },
    })
    const appClient = this._appClient.clone({
      appId: deployResult.appId,
      appName: params.appName,
    })
    const result = {
      ...deployResult,
      ...(compiled as Partial<AppCompilationResult>),
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
   * @returns The `AppClient` instance
   * @example
   * ```typescript
   * const appClient = factory.getAppClientById({ appId: 12345n })
   * ```
   */
  public getAppClientById(params: CloneAppClientParams & Required<Pick<CloneAppClientParams, 'appId'>>) {
    return this._appClient.clone(params)
  }

  /**
   * Returns a new `AppClient` client, resolving the app by creator address and name
   * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
   *
   * Automatically populates appName, defaultSender and source maps from the factory
   * if not specified in the params.
   * @param params The parameters to create the app client
   * @returns The `AppClient` instance
   * @example
   * ```typescript
   * const appClient = factory.getAppClientByCreatorAndName({ creatorAddress: 'CREATOR_ADDRESS', appName: 'my_app' })
   * ```
   */
  public getAppClientByCreatorAndName(params: AppFactoryResolveAppClientByCreatorAndNameParams) {
    return AppClient.fromCreatorAndName({
      ...params,
      algorand: this._algorand,
      appSpec: this._appSpec,
      appName: params.appName ?? this._appName,
      defaultSender: params.defaultSender ?? this._defaultSender,
      approvalSourceMap: params.approvalSourceMap ?? this._appClient.exportSourceMaps().approvalSourceMap,
      clearSourceMap: params.clearSourceMap ?? this._appClient.exportSourceMaps().clearSourceMap,
    })
  }

  /**
   * Takes an error that may include a logic error from a call to the current app and re-exposes the
   * error to include source code information via the source map and ARC-56 spec.
   * @param e The error to parse
   * @param isClearStateProgram Whether or not the code was running the clear state program (defaults to approval program)
   * @returns The new error, or if there was no logic error or source map then the wrapped error with source details
   */
  async exposeLogicError(e: Error, isClearStateProgram?: boolean): Promise<Error> {
    return await this._appClient.exposeLogicError(e, isClearStateProgram)
  }

  /**
   * Export the current source maps for the app.
   * @returns The source maps
   */
  exportSourceMaps(): AppSourceMaps {
    return this._appClient.exportSourceMaps()
  }

  /**
   * Import source maps for the app.
   * @param sourceMaps The source maps to import
   */
  importSourceMaps(sourceMaps: AppSourceMaps) {
    this._appClient.importSourceMaps(sourceMaps)
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

  /**
   * Compiles the approval and clear state programs (if TEAL templates provided),
   * performing any provided deploy-time parameter replacement and stores
   * the source maps.
   *
   * If no TEAL templates provided it will use any byte code provided in the app spec.
   *
   * Will store any generated source maps for later use in debugging.
   * @param compilation Optional compilation parameters to use for the compilation
   * @returns The compilation result
   * @example
   * ```typescript
   * const result = await factory.compile()
   * ```
   */
  public async compile(compilation?: AppClientCompilationParams) {
    return this._appClient.compile(compilation)
  }
}
