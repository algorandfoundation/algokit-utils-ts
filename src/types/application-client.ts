import algosdk, { ABIArgument, ABIMethodParams, Algodv2, getApplicationAddress, Indexer, SuggestedParams } from 'algosdk'
import { Buffer } from 'buffer'
import { callApp, createApp, updateApp } from '../app'
import { deployApp, getCreatorAppsByName, performTemplateSubstitution, replaceDeployTimeControlParams } from '../deploy-app'
import { getSenderAddress } from '../transaction'
import {
  ABIAppCallArgs,
  AppCallArgs,
  AppLookup,
  AppMetadata,
  AppReference,
  DELETABLE_TEMPLATE_NAME,
  OnSchemaBreak,
  OnUpdate,
  RawAppCallArgs,
  TealTemplateParameters,
  UPDATABLE_TEMPLATE_NAME,
} from './app'
import { AppSpec, getABISignature } from './appspec'
import { SendTransactionFrom, SendTransactionParams, TransactionNote } from './transaction'

/** Configuration to resolve app by creator and name @see getCreatorAppsByName */
export type ResolveAppByCreatorAndName = {
  /** The address of the app creator account to resolve the app by */
  creatorAddress: string
  /** The optional name to resolve the app by within the creator account (default: uses the name in the ABI contract) */
  name?: string
} & (
  | {
      /** indexer An indexer instance to search the creator account apps */
      indexer: Indexer
    }
  | {
      /** Optional cached value of the existing apps for the given creator, @see getCreatorAppsByName */
      existingDeployments: AppLookup
    }
)

/** Configuration to resolve app by ID */
export interface ResolveAppById {
  /** The id of an existing app to call using this client, or 0 if the app hasn't been created yet */
  id: number
  /** The optional name to use to mark the app when deploying @see ApplicationClient.deploy (default: uses the name in the ABI contract) */
  name?: string
}

/** The details of an ARC-0032 app spec specified app */
export type AppSpecAppDetails = {
  /** The ARC-0032 application spec as either:
   *  * Parsed JSON @see {AppSpec}
   *  * Raw JSON string
   */
  app: AppSpec | string
  /** Default sender to use for transactions issued by this application client */
  sender?: SendTransactionFrom
  /** Default suggested params object to use */
  params?: SuggestedParams
} & (ResolveAppById | ResolveAppByCreatorAndName)

/** Parameters to pass into ApplicationClient.deploy */
export interface AppClientDeployParams {
  /** The version of the contract, uses "1.0" by default */
  version?: string
  /** The optional sender to send the transaction from, will use the application client's default sender by default if specified */
  sender?: SendTransactionFrom
  /** Whether or not to allow updates in the contract using the deploy-time updatability control if present in your contract.
   * If this is not specified then it will automatically be determined based on the AppSpec definition
   **/
  allowUpdate?: boolean
  /** Whether or not to allow deletes in the contract using the deploy-time deletability control if present in your contract.
   * If this is not specified then it will automatically be determined based on the AppSpec definition
   **/
  allowDelete?: boolean
  /** Parameters to control transaction sending */
  sendParams?: Omit<SendTransactionParams, 'args' | 'skipSending' | 'skipWaiting'>
  /** Any deploy-time parameters to replace in the TEAL code */
  deployTimeParameters?: TealTemplateParameters
  /** What action to perform if a schema break is detected */
  onSchemaBreak?: 'replace' | 'fail' | OnSchemaBreak
  /** What action to perform if a TEAL update is detected */
  onUpdate?: 'update' | 'replace' | 'fail' | OnUpdate
  /** Any args to pass to any create transaction that is issued as part of deployment */
  createArgs?: AppClientCallArgs
  /** Any args to pass to any update transaction that is issued as part of deployment */
  updateArgs?: AppClientCallArgs
  /** Any args to pass to any delete transaction that is issued as part of deployment */
  deleteArgs?: AppClientCallArgs
}

/** The arguments to pass to an Application Client smart contract call */
export type AppClientCallArgs =
  | {
      /** Raw argument values to pass to the smart contract call */
      args?: RawAppCallArgs
    }
  | {
      /** If calling an ABI method then either the name of the method, or the ABI signature */
      method: string
      /** Either the ABI arguments or an object with the ABI arguments and other parameters like boxes */
      methodArgs: Omit<ABIAppCallArgs, 'method'> | ABIArgument[]
    }

/** Parameters to construct a ApplicationClient contract call */
export type AppClientCallParams = AppClientCallArgs & {
  /** The optional sender to send the transaction from, will use the application client's default sender by default if specified */
  sender?: SendTransactionFrom
  /** The transaction note for the smart contract call */
  note?: TransactionNote
  /** Parameters to control transaction sending */
  sendParams?: Omit<SendTransactionParams, 'args' | 'skipSending' | 'skipWaiting'>
}

/** Parameters for creating a contract using ApplicationClient */
export type AppClientCreateParams = AppClientCallParams & {
  /** Any deploy-time parameters to replace in the TEAL code */
  deployTimeParameters?: TealTemplateParameters
  /* Whether or not the contract should have deploy-time immutability control set, undefined = ignore */
  updatable?: boolean
  /* Whether or not the contract should have deploy-time permanence control set, undefined = ignore */
  deletable?: boolean
}

/** Parameters for updating a contract using ApplicationClient */
export type AppClientUpdateParams = AppClientCreateParams

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

    if ('creatorAddress' in appIdentifier) {
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
    } else {
      if (appIdentifier.id < 0) {
        throw new Error(`Attempt to create application client with invalid app id of ${appIdentifier.id}`)
      }
      this._appId = appIdentifier.id
    }

    this._appAddress = algosdk.getApplicationAddress(this._appId)
    this.sender = sender
    this.params = params

    // todo: find create, update, delete, etc. methods from app spec
  }

  /**
   * Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.
   *
   * To understand the architecture decisions behind this functionality please @see https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md
   *
   * **Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.
   *
   * **Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.
   * @param deploy Deployment details
   * @returns The metadata and transaction result(s) of the deployment, or just the metadata if it didn't need to issue transactions
   */
  async deploy(deploy: AppClientDeployParams) {
    const { sender, version, allowUpdate, allowDelete, sendParams, createArgs, updateArgs, deleteArgs, ...deployArgs } = deploy

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
    const clear = Buffer.from(this.appSpec.source.clear, 'base64').toString('utf-8')

    await this.loadAppReference()
    const result = await deployApp(
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from,
        approvalProgram: approval,
        clearStateProgram: clear,
        metadata: {
          name: this._appName,
          // todo: intelligent version management
          version: version ?? '1.0',
          updatable:
            allowUpdate ?? approval.includes(UPDATABLE_TEMPLATE_NAME)
              ? (!this.appSpec.bare_call_config.update_application && this.appSpec.bare_call_config.update_application !== 'NEVER') ||
                !!Object.keys(this.appSpec.hints).filter(
                  (h) =>
                    !this.appSpec.hints[h].call_config.update_application &&
                    this.appSpec.hints[h].call_config.update_application !== 'NEVER',
                )[0]
              : undefined,
          deletable:
            allowDelete ?? approval.includes(DELETABLE_TEMPLATE_NAME)
              ? (!this.appSpec.bare_call_config.delete_application && this.appSpec.bare_call_config.delete_application !== 'NEVER') ||
                !!Object.keys(this.appSpec.hints).filter(
                  (h) =>
                    !this.appSpec.hints[h].call_config.delete_application &&
                    this.appSpec.hints[h].call_config.delete_application !== 'NEVER',
                )[0]
              : undefined,
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
  }

  async create(create?: AppClientCreateParams) {
    const { sender, note, sendParams, deployTimeParameters, updatable, deletable, ...args } = create ?? {}

    if (this._appId !== 0) {
      throw new Error(`Attempt to create app which already has an app id of ${this._appId}`)
    }

    if (!sender && !this.sender) {
      throw new Error('No sender provided, unable to create app')
    }

    const approval = Buffer.from(this.appSpec.source.approval, 'base64').toString('utf-8')
    const clear = Buffer.from(this.appSpec.source.clear, 'base64').toString('utf-8')

    const result = await createApp(
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from: sender ?? this.sender!,
        approvalProgram: replaceDeployTimeControlParams(performTemplateSubstitution(approval, deployTimeParameters), {
          updatable,
          deletable,
        }),
        clearStateProgram: performTemplateSubstitution(clear, deployTimeParameters),
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
  }

  async update(update?: AppClientUpdateParams) {
    const { sender, note, sendParams, deployTimeParameters, updatable, deletable, ...args } = update ?? {}

    if (this._appId === 0) {
      throw new Error(`Attempt to update app which doesn't have an app id defined`)
    }

    if (!sender && !this.sender) {
      throw new Error('No sender provided, unable to create app')
    }

    const approval = Buffer.from(this.appSpec.source.approval, 'base64').toString('utf-8')
    const clear = Buffer.from(this.appSpec.source.clear, 'base64').toString('utf-8')

    const result = await updateApp(
      {
        appId: this._appId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from: sender ?? this.sender!,
        approvalProgram: replaceDeployTimeControlParams(performTemplateSubstitution(approval, deployTimeParameters), {
          updatable,
          deletable,
        }),
        clearStateProgram: performTemplateSubstitution(clear, deployTimeParameters),
        args: this.getCallArgs(args),
        note: note,
        transactionParams: this.params,
        ...(sendParams ?? {}),
      },
      this.algod,
    )

    return result
  }

  async call(call: AppClientCallParams) {
    return await this._call(call, 'normal')
  }

  async optIn(call: AppClientCallParams) {
    return await this._call(call, 'optin')
  }

  async closeOut(call: AppClientCallParams) {
    return await this._call(call, 'optin')
  }

  async clearState(call: AppClientCallParams) {
    return await this._call(call, 'optin')
  }

  async delete(call: AppClientCallParams) {
    return await this._call(call, 'optin')
  }

  private async _call(call: AppClientCallParams, callType: 'optin' | 'closeout' | 'clearstate' | 'delete' | 'normal') {
    const { sender, note, sendParams, ...args } = call

    if (!sender && !this.sender) {
      throw new Error('No sender provided, unable to call app')
    }

    const appMetadata = await this.loadAppReference()
    if (appMetadata.appId === 0) {
      throw new Error(`Attempt to call an app that can't be found '${this._appName}' for creator '${this._creator}'.`)
    }

    // todo: process ABI args as needed to make them nicer to deal with like beaker-ts
    // todo: support unwrapping a logic error and source map.
    // todo: support readonly method calls

    return callApp(
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
  }

  getCallArgs(args?: AppClientCallArgs): AppCallArgs | undefined {
    if (!args) {
      return undefined
    }

    if ('method' in args) {
      const abiMethod = this.getABIMethod(args.method)
      if (!abiMethod) {
        throw new Error(`Attempt to call ABI method ${args.method}, but it wasn't found`)
      }

      return {
        method: abiMethod,
        ...(Array.isArray(args.methodArgs) ? { args: args.methodArgs } : args.methodArgs),
      } as ABIAppCallArgs
    } else {
      return args.args
    }
  }

  getABIMethod(method: string): ABIMethodParams | undefined {
    if (!method.includes('(')) {
      const methods = this.appSpec.contract.methods.filter((m) => m.name === method)
      if (methods.length > 1) {
        throw new Error(
          `Received a call to method ${method} in contract ${
            this._appName
          }, but this resolved to multiple methods; please pass in an ABI signature instead: ${methods.map(getABISignature).join(', ')}`,
        )
      }
      return methods[0]
    }
    return this.appSpec.contract.methods.find((m) => getABISignature(m) === method)
  }

  private async loadAppReference(): Promise<AppMetadata | AppReference> {
    if (!this.existingDeployments && this._creator) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.existingDeployments = await getCreatorAppsByName(this._creator, this.indexer!)
    }

    if (this.existingDeployments && this._appId === 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const app = this.existingDeployments.apps[this._appName!]
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
}
