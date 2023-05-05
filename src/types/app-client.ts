import algosdk, {
  ABIMethod,
  ABIMethodParams,
  ABIType,
  ABIValue,
  Algodv2,
  getApplicationAddress,
  Indexer,
  SourceMap,
  SuggestedParams,
} from 'algosdk'
import { Buffer } from 'buffer'
import {
  callApp,
  compileTeal,
  createApp,
  getABIMethodSignature,
  getAppBoxNames,
  getAppBoxValue,
  getAppBoxValueFromABIType,
  getAppGlobalState,
  getAppLocalState,
  updateApp,
} from '../app'
import { deployApp, getCreatorAppsByName, performTemplateSubstitution, replaceDeployTimeControlParams } from '../app-deploy'
import { getSenderAddress } from '../transaction'
import { transferAlgos } from '../transfer'
import { AlgoAmount } from './amount'
import {
  ABIAppCallArg,
  ABIAppCallArgs,
  AppCallArgs,
  AppLookup,
  AppMetadata,
  AppReference,
  AppState,
  BoxName,
  CoreAppCallArgs,
  DELETABLE_TEMPLATE_NAME,
  OnSchemaBreak,
  OnUpdate,
  RawAppCallArgs,
  TealTemplateParams,
  UPDATABLE_TEMPLATE_NAME,
} from './app'
import { AppSpec } from './app-spec'
import { LogicError } from './logic-error'
import { SendTransactionFrom, SendTransactionParams, TransactionNote } from './transaction'

export type ResolveAppByCreatorAndNameWithIndexer = {
  /** The address of the app creator account to resolve the app by */
  creatorAddress: string
  /** The optional name to resolve the app by within the creator account (default: uses the name in the ABI contract) */
  name?: string
  /** An indexer instance to search the creator account apps */
  indexer: Indexer
}

export type ResolveAppByCreatorAndNameWithoutIndexer = {
  /** The address of the app creator account to resolve the app by */
  creatorAddress: string
  /** The optional name to resolve the app by within the creator account (default: uses the name in the ABI contract) */
  name?: string
  /** Cached value of the existing apps for the given creator, `getCreatorAppsByName` */
  existingDeployments: AppLookup
}

/** Configuration to resolve app by creator and name `getCreatorAppsByName` */
export type ResolveAppByCreatorAndName = ResolveAppByCreatorAndNameWithIndexer | ResolveAppByCreatorAndNameWithoutIndexer

/** Configuration to resolve app by ID */
export interface ResolveAppById {
  /** The id of an existing app to call using this client, or 0 if the app hasn't been created yet */
  id: number
  /** The optional name to use to mark the app when deploying `ApplicationClient.deploy` (default: uses the name in the ABI contract) */
  name?: string
}

/** The details of an AlgoKit Utils deployed app */
export type AppDetails = {
  /** Default sender to use for transactions issued by this application client */
  sender?: SendTransactionFrom
  /** Default suggested params object to use */
  params?: SuggestedParams
} & (ResolveAppById | ResolveAppByCreatorAndName)

/** The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app */
export type AppSpecAppDetails = AppDetails & {
  /** The ARC-0032 application spec as either:
   *  * Parsed JSON `AppSpec`
   *  * Raw JSON string
   */
  app: AppSpec | string
}

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
  onSchemaBreak?: 'replace' | 'fail' | OnSchemaBreak
  /** What action to perform if a TEAL update is detected */
  onUpdate?: 'update' | 'replace' | 'fail' | OnUpdate
}

/** Call interface parameters to pass into ApplicationClient.deploy */
export interface AppClientDeployCallInterfaceParams {
  /** Any deploy-time parameters to replace in the TEAL code */
  deployTimeParams?: TealTemplateParams
  /** Any args to pass to any create transaction that is issued as part of deployment */
  createArgs?: AppClientCallArgs
  /** Any args to pass to any update transaction that is issued as part of deployment */
  updateArgs?: AppClientCallArgs
  /** Any args to pass to any delete transaction that is issued as part of deployment */
  deleteArgs?: AppClientCallArgs
}

/** Parameters to pass into ApplicationClient.deploy */
export interface AppClientDeployParams extends AppClientDeployCoreParams, AppClientDeployCallInterfaceParams {}

/** The arguments to pass to an Application Client smart contract call */
export type AppClientCallArgs =
  | {
      /** Raw argument values to pass to the smart contract call */
      args?: RawAppCallArgs
    }
  | {
      /** If calling an ABI method then either the name of the method, or the ABI signature */
      method: string
      /** An object with the ABI arguments and other parameters like boxes */
      methodArgs: Omit<ABIAppCallArgs, 'method'> | ABIAppCallArg[]
    }
  | (CoreAppCallArgs & {
      /** If calling an ABI method then either the name of the method, or the ABI signature */
      method: string
      /** The ABI arguments */
      methodArgs: ABIAppCallArg[]
    })

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

export interface AppClientCompilationParams {
  /** Any deploy-time parameters to replace in the TEAL code */
  deployTimeParams?: TealTemplateParams
  /* Whether or not the contract should have deploy-time immutability control set, undefined = ignore */
  updatable?: boolean
  /* Whether or not the contract should have deploy-time permanence control set, undefined = ignore */
  deletable?: boolean
}

/** Parameters for creating a contract using ApplicationClient */
export type AppClientCreateParams = AppClientCallParams & AppClientCompilationParams

/** Parameters for updating a contract using ApplicationClient */
export type AppClientUpdateParams = AppClientCreateParams

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

/** Application client - a class that wraps an ARC-0032 app spec and provides high productivity methods to deploy and call the app */
export class ApplicationClient {
  private algod: Algodv2
  private indexer?: algosdk.Indexer
  private appSpec: AppSpec
  private sender: SendTransactionFrom | undefined
  private params: SuggestedParams | undefined
  private existingDeployments: AppLookup | undefined

  private _appId: number
  private _appAddress: string
  private _creator: string | undefined
  private _appName: string

  private _approvalSourceMap: SourceMap | undefined
  private _clearSourceMap: SourceMap | undefined

  // todo: process ABI args as needed to make them nicer to deal with like beaker-ts
  // todo: support readonly, noop method calls
  // todo: support different oncomplete for create
  // todo: find create, update, delete, etc. methods from app spec and call them by default
  // todo: intelligent version management when deploying

  /**
   * Create a new ApplicationClient instance
   * @param appDetails The details of the app
   * @param algod An algod instance
   * @param indexer An indexer instance
   */
  constructor(appDetails: AppSpecAppDetails, algod: Algodv2) {
    const { app, sender, params, ...appIdentifier } = appDetails
    this.algod = algod
    this.appSpec = typeof app == 'string' ? (JSON.parse(app) as AppSpec) : app
    this._appName = appIdentifier.name ?? this.appSpec.contract.name

    if ('id' in appIdentifier) {
      if (appIdentifier.id < 0) {
        throw new Error(`Attempt to create application client with invalid app id of ${appIdentifier.id}`)
      }
      this._appId = appIdentifier.id
    } else {
      this._appId = 0
      this._creator = appIdentifier.creatorAddress
      if ('indexer' in appIdentifier) {
        this.indexer = appIdentifier.indexer
      } else {
        if (appIdentifier.existingDeployments.creator !== this._creator) {
          throw new Error(
            `Attempt to create application client with invalid existingDeployments against a different creator (${appIdentifier.existingDeployments.creator}) instead of expected creator ${this._creator}`,
          )
        }
        this.existingDeployments = appIdentifier.existingDeployments
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
    const approval = replaceDeployTimeControlParams(performTemplateSubstitution(approvalTemplate, deployTimeParams), {
      updatable,
      deletable,
    })
    const approvalCompiled = await compileTeal(approval, this.algod)
    this._approvalSourceMap = approvalCompiled?.sourceMap
    const clearTemplate = Buffer.from(this.appSpec.source.clear, 'base64').toString('utf-8')
    const clear = performTemplateSubstitution(clearTemplate, deployTimeParams)
    const clearCompiled = await compileTeal(clear, this.algod)
    this._clearSourceMap = clearCompiled?.sourceMap

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
    const { sender, version, allowUpdate, allowDelete, sendParams, createArgs, updateArgs, deleteArgs, ...deployArgs } = deploy ?? {}

    if (this._appId !== 0) {
      throw new Error(`Attempt to deploy app which already has an app id of ${this._appId}`)
    }
    if (!sender && !this.sender) {
      throw new Error('No sender provided, unable to deploy app')
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const from = sender ?? this.sender!

    if (!this._creator) {
      throw new Error('Attempt to deploy a contract without having specified a creator')
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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          from,
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
          },
          transactionParams: this.params,
          ...(sendParams ?? {}),
          existingDeployments: this.existingDeployments,
          createArgs: this.getCallArgs(createArgs),
          updateArgs: this.getCallArgs(updateArgs),
          deleteArgs: this.getCallArgs(deleteArgs),
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

      return result
    } catch (e) {
      throw this.exposeLogicError(e as Error)
    }
  }

  async create(create?: AppClientCreateParams) {
    const { sender, note, sendParams, deployTimeParams, updatable, deletable, ...args } = create ?? {}

    if (this._appId !== 0) {
      throw new Error(`Attempt to create app which already has an app id of ${this._appId}`)
    }

    if (!sender && !this.sender) {
      throw new Error('No sender provided, unable to create app')
    }

    const { approvalCompiled, clearCompiled } = await this.compile(create)

    try {
      const result = await createApp(
        {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          from: sender ?? this.sender!,
          approvalProgram: approvalCompiled.compiledBase64ToBytes,
          clearStateProgram: clearCompiled.compiledBase64ToBytes,
          schema: {
            globalByteSlices: this.appSpec.state.global.num_byte_slices,
            globalInts: this.appSpec.state.global.num_uints,
            localByteSlices: this.appSpec.state.local.num_byte_slices,
            localInts: this.appSpec.state.local.num_uints,
          },
          args: this.getCallArgs(args),
          note: note,
          transactionParams: this.params,
          ...(sendParams ?? {}),
        },
        this.algod,
      )

      if (result.confirmation) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this._appId = result.confirmation['application-index']!
        this._appAddress = getApplicationAddress(this._appId)
      }

      return result
    } catch (e) {
      throw this.exposeLogicError(e as Error)
    }
  }

  async update(update?: AppClientUpdateParams) {
    const { sender, note, sendParams, deployTimeParams, updatable, deletable, ...args } = update ?? {}

    if (this._appId === 0) {
      throw new Error(`Attempt to update app which doesn't have an app id defined`)
    }

    if (!sender && !this.sender) {
      throw new Error('No sender provided, unable to create app')
    }

    const { approvalCompiled, clearCompiled } = await this.compile(update)

    try {
      const result = await updateApp(
        {
          appId: this._appId,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          from: sender ?? this.sender!,
          approvalProgram: approvalCompiled.compiledBase64ToBytes,
          clearStateProgram: clearCompiled.compiledBase64ToBytes,
          args: this.getCallArgs(args),
          note: note,
          transactionParams: this.params,
          ...(sendParams ?? {}),
        },
        this.algod,
      )

      this._approvalSourceMap = result.compiledApproval?.sourceMap
      this._clearSourceMap = result.compiledClear?.sourceMap

      return result
    } catch (e) {
      throw this.exposeLogicError(e as Error)
    }
  }

  async call(call?: AppClientCallParams) {
    return await this._call(call, 'normal')
  }

  async optIn(call?: AppClientCallParams) {
    return await this._call(call, 'optin')
  }

  async closeOut(call?: AppClientCallParams) {
    return await this._call(call, 'closeout')
  }

  async clearState(call?: AppClientCallParams) {
    return await this._call(call, 'clearstate')
  }

  async delete(call?: AppClientCallParams) {
    return await this._call(call, 'delete')
  }

  private async _call(call: AppClientCallParams | undefined, callType: 'optin' | 'closeout' | 'clearstate' | 'delete' | 'normal') {
    const { sender, note, sendParams, ...args } = call ?? {}

    if (!sender && !this.sender) {
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
          from: sender ?? this.sender!,
          args: this.getCallArgs(args),
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
   * Funds ALGOs into the app account for this app.
   * @param fund The parameters for the funding or the funding amount
   * @returns The result of the funding
   */
  async fundAppAccount(fund: FundAppAccountParams | AlgoAmount) {
    const { amount, sender, note, sendParams } = 'microAlgos' in fund ? ({ amount: fund } as FundAppAccountParams) : fund

    if (!sender && !this.sender) {
      throw new Error('No sender provided, unable to call app')
    }

    const ref = await this.getAppReference()
    return await transferAlgos(
      {
        to: ref.appAddress,
        amount: amount,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from: sender ?? this.sender!,
        note: note,
        transactionParams: this.params,
        ...(sendParams ?? {}),
      },
      this.algod,
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

  /** @deprecated Use `getBoxValuesFromABIType` instead */
  async getBoxValuesAsABIType(type: ABIType, filter?: (name: BoxName) => boolean): Promise<{ name: BoxName; value: ABIValue }[]> {
    return this.getBoxValuesFromABIType(type, filter)
  }

  /**
   * Returns the arguments for an app call for the given ABI method or raw method specification.
   * @param args The call args specific to this application client
   * @returns The call args ready to pass into an app call
   */
  getCallArgs(args?: AppClientCallArgs): AppCallArgs | undefined {
    if (!args) {
      return undefined
    }

    if ('method' in args) {
      const abiMethod = this.getABIMethodParams(args.method)
      if (!abiMethod) {
        throw new Error(`Attempt to call ABI method ${args.method}, but it wasn't found`)
      }

      if (Array.isArray(args.methodArgs)) {
        return {
          method: abiMethod,
          args: args.methodArgs,
          boxes: 'boxes' in args ? args.boxes : undefined,
          lease: 'lease' in args ? args.lease : undefined,
        } as ABIAppCallArgs
      } else {
        return {
          method: abiMethod,
          ...args.methodArgs,
        } as ABIAppCallArgs
      }
    } else {
      return args.args
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
            .map(getABIMethodSignature)
            .join(', ')}`,
        )
      }
      return methods[0]
    }
    return this.appSpec.contract.methods.find((m) => getABIMethodSignature(m) === method)
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
}
