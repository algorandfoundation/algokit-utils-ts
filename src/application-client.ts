import algosdk, { ABIArgument, Algodv2, getApplicationAddress, Indexer, SuggestedParams } from 'algosdk'
import { Buffer } from 'buffer'
import { AppCallArgs, AppReference, callApp, createApp, RawAppCallArgs, updateApp } from './app'
import {
  AppLookup,
  AppMetadata,
  deployApp,
  getCreatorAppsByName,
  OnSchemaBreak,
  OnUpdate,
  performTemplateSubstitution,
  TealTemplateParameters,
} from './deploy-app'
import { getSenderAddress, SendTransactionFrom, SendTransactionParams, TransactionNote } from './transaction'
import { AppSpec, getABISignature } from './types/appspec'

export class ApplicationClient {
  private algod: Algodv2
  private indexer: algosdk.Indexer
  private appSpec: AppSpec
  private sender: SendTransactionFrom | undefined
  private params: SuggestedParams | undefined
  private existingDeployments: AppLookup | undefined

  private _appIndex: number
  private _appAddress: string
  private _creator: string | undefined

  constructor(
    appDetails: {
      /** The ARC-0032 application spec as either:
       *  * Parsed JSON @see {AppSpec}
       *  * Raw JSON string
       */
      app: AppSpec | string
      /** Default sender to use for transactions issued by this application client */
      sender?: SendTransactionFrom
      /** Default suggested params object to use */
      params?: SuggestedParams
    } & (
      | {
          /** The index of an existing app to call using this client */
          index: number
        }
      | {
          /** The address of the app creator account */
          creatorAddress: string
          /** Optional cached value of the existing apps for the given creator */
          existingDeployments?: AppLookup
        }
    ),
    algod: Algodv2,
    indexer: Indexer,
  ) {
    const { app, sender, params, ...appIdentifier } = appDetails
    this.algod = algod
    this.indexer = indexer
    this.appSpec = typeof app == 'string' ? (JSON.parse(app) as AppSpec) : app

    if ('creatorAddress' in appIdentifier) {
      this._creator = appIdentifier.creatorAddress
      if (appIdentifier.existingDeployments && appIdentifier.existingDeployments.creator !== this._creator) {
        throw new Error(
          `Attempt to create application client with invalid existingDeployments against a different creator (${appIdentifier.existingDeployments.creator}) instead of expected creator ${this._creator}`,
        )
      }
      this.existingDeployments = appIdentifier.existingDeployments
      this._appIndex = 0
    } else {
      if (appIdentifier.index < 0) {
        throw new Error(`Attempt to create application client with invalid app index of ${appIdentifier.index}`)
      }
      this._appIndex = appIdentifier.index
    }

    this._appAddress = algosdk.getApplicationAddress(this._appIndex)
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
  async deploy(deploy: {
    /** The version of the contract, e.g. "1.0" */
    version: string
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
    createArgs?: AppCallArgs
    /** Any args to pass to any update transaction that is issued as part of deployment */
    updateArgs?: AppCallArgs
    /** Any args to pass to any delete transaction that is issued as part of deployment */
    deleteArgs?: AppCallArgs
  }) {
    const { sender, version, allowUpdate, allowDelete, sendParams, ...deployArgs } = deploy

    if (this._appIndex !== 0) {
      throw new Error(`Attempt to deploy app which already has an app index of ${this._appIndex}`)
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
          name: this.appSpec.contract.name,
          version: version,
          updatable:
            allowUpdate ??
            ((!this.appSpec.bare_call_config.update_application && this.appSpec.bare_call_config.update_application !== 'NEVER') ||
              !!Object.keys(this.appSpec.hints).filter(
                (h) =>
                  !this.appSpec.hints[h].call_config.update_application && this.appSpec.hints[h].call_config.update_application !== 'NEVER',
              )[0]),
          deletable:
            allowDelete ??
            ((!this.appSpec.bare_call_config.delete_application && this.appSpec.bare_call_config.delete_application !== 'NEVER') ||
              !!Object.keys(this.appSpec.hints).filter(
                (h) =>
                  !this.appSpec.hints[h].call_config.delete_application && this.appSpec.hints[h].call_config.delete_application !== 'NEVER',
              )[0]),
        },
        schema: {
          globalByteSlices: this.appSpec.state.global.num_byte_slices,
          globalInts: this.appSpec.state.global.num_uints,
          localByteSlices: this.appSpec.state.local.num_byte_slices,
          localInts: this.appSpec.state.local.num_uints,
        },
        transactionParams: this.params,
        ...(sendParams ?? {}),
        ...deployArgs,
        existingDeployments: this.existingDeployments,
      },
      this.algod,
      this.indexer,
    )

    // Nothing needed to happen
    if (!('transaction' in result)) {
      return result
    }

    if (!this.existingDeployments) {
      throw new Error('Expected existingDeployments to be present')
    }
    const { transaction, confirmation, deleteResult, ...appMetadata } = result
    this.existingDeployments = {
      creator: this.existingDeployments.creator,
      apps: { ...this.existingDeployments.apps, [this.appSpec.contract.name]: appMetadata },
    }

    return result
  }

  async create(create?: {
    sender?: SendTransactionFrom
    args?: AppCallArgs
    note?: TransactionNote
    sendParams?: SendTransactionParams
    deployTimeParameters?: TealTemplateParameters
  }) {
    const { sender, args, note, sendParams, deployTimeParameters } = create ?? {}

    // todo: Add deploy-time updatable/etc.

    if (this._appIndex !== 0) {
      throw new Error(`Attempt to create app which already has an app index of ${this._appIndex}`)
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
        approvalProgram: performTemplateSubstitution(approval, deployTimeParameters),
        clearStateProgram: performTemplateSubstitution(clear, deployTimeParameters),
        schema: {
          globalByteSlices: this.appSpec.state.global.num_byte_slices,
          globalInts: this.appSpec.state.global.num_uints,
          localByteSlices: this.appSpec.state.local.num_byte_slices,
          localInts: this.appSpec.state.local.num_uints,
        },
        args: args,
        note: note,
        transactionParams: this.params,
        ...(sendParams ?? {}),
      },
      this.algod,
    )

    if (result.confirmation) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._appIndex = result.confirmation['application-index']!
      this._appAddress = getApplicationAddress(this._appIndex)
    }

    return result
  }

  async update(update?: {
    sender?: SendTransactionFrom
    args?: AppCallArgs
    note?: TransactionNote
    sendParams?: SendTransactionParams
    deployTimeParameters?: TealTemplateParameters
  }) {
    const { sender, args, note, sendParams, deployTimeParameters } = update ?? {}

    if (this._appIndex === 0) {
      throw new Error(`Attempt to update app which doesn't have an app index defined`)
    }

    if (!sender && !this.sender) {
      throw new Error('No sender provided, unable to create app')
    }

    const approval = Buffer.from(this.appSpec.source.approval, 'base64').toString('utf-8')
    const clear = Buffer.from(this.appSpec.source.clear, 'base64').toString('utf-8')

    const result = await updateApp(
      {
        appIndex: this._appIndex,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from: sender ?? this.sender!,
        approvalProgram: performTemplateSubstitution(approval, deployTimeParameters),
        clearStateProgram: performTemplateSubstitution(clear, deployTimeParameters),
        args: args,
        note: note,
        transactionParams: this.params,
        ...(sendParams ?? {}),
      },
      this.algod,
    )

    return result
  }

  async call(
    call: {
      callType: 'optin' | 'closeout' | 'clearstate' | 'delete' | 'normal'
      sender?: SendTransactionFrom
      note?: TransactionNote
      sendParams?: SendTransactionParams
    } & (
      | {
          /** If calling an ABI method then either the name of the method, or the ABI signature, if undefined then a bare call will be made */
          method: string
          /** The ABI args to pass in */
          methodArgs: ABIArgument[]
          /** The optional lease for the transaction */
          lease?: string | Uint8Array
        }
      | {
          args: RawAppCallArgs
        }
    ),
  ) {
    const { sender, callType, note, sendParams, ...args } = call

    if (!sender && !this.sender) {
      throw new Error('No sender provided, unable to call app')
    }

    const appMetadata = await this.loadAppReference()
    if (appMetadata.appIndex === 0) {
      throw new Error(`Attempt to call an app that can't be found '${this.appSpec.contract.name}' for creator '${this._creator}'.`)
    }

    // todo: use this in create et. al. as well
    let callArgs: AppCallArgs
    // ABI call
    if ('method' in args) {
      const abiMethod = this.getABIMethod(args.method)
      if (!abiMethod) {
        throw new Error(`Attempt to call ABI method ${args.method}, but it wasn't found`)
      }
      callArgs = {
        method: abiMethod,
        args: args.methodArgs,
        lease: args.lease,
      }
    } else {
      callArgs = args.args
    }

    // todo: process ABI args as needed to make them nicer to deal with like beaker-ts???
    // todo: support unwrapping a logic error?

    return callApp(
      {
        appIndex: appMetadata.appIndex,
        callType: callType,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from: sender ?? this.sender!,
        args: callArgs,
        note: note,
        transactionParams: this.params,
        ...(sendParams ?? {}),
      },
      this.algod,
    )
  }

  getABIMethod(method: string) {
    if (!method.includes('(')) {
      const methods = this.appSpec.contract.methods.filter((m) => m.name === method)
      if (methods.length > 1) {
        throw new Error(
          `Received a call to method ${method} in contract ${
            this.appSpec.contract.name
          }, but this resolved to multiple methods; please pass in an ABI signature instead: ${methods.map(getABISignature).join(', ')}`,
        )
      }
      return methods[0]
    }
    return this.appSpec.contract.methods.find((m) => getABISignature(m) === method)
  }

  private async loadAppReference(): Promise<AppMetadata | AppReference> {
    if (!this.existingDeployments && this._creator) {
      this.existingDeployments = await getCreatorAppsByName(this._creator, this.indexer)
    }

    if (this.existingDeployments && this._appIndex === 0) {
      const app = this.existingDeployments.apps[this.appSpec.contract.name]
      if (!app) {
        return {
          appIndex: 0,
          appAddress: getApplicationAddress(0),
        }
      }
      return app
    }

    return {
      appIndex: this._appIndex,
      appAddress: this._appAddress,
    } as AppReference
  }
}
