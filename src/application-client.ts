import algosdk, { Algodv2, Indexer, SuggestedParams } from 'algosdk'
import { AppCallArgs, AppReference, callApp, createApp } from './app'
import { AppLookup, AppMetadata, deployApp, getCreatorAppsByName, OnSchemaBreak, OnUpdate, TealTemplateParameters } from './deploy-app'
import { SendTransactionFrom, SendTransactionParams, TransactionNote } from './transaction'
import { AppSpec, getABISignature } from './types/appspec'

interface File {
  name: string
  content: string
}

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

  public get appIndex() {
    return this._appIndex
  }

  public get appAddress() {
    return this._appAddress
  }

  constructor(
    appDetails: {
      app: AppSpec | File | string
      sender?: SendTransactionFrom
      params?: SuggestedParams
    } & (
      | {
          index: number
        }
      | { creatorAddress: string /** Optional cached value of the existing apps for the given creator */; existingDeployments?: AppLookup }
    ),
    algod: Algodv2,
    indexer: Indexer,
  ) {
    const { app, sender, params, ...appIdentifier } = appDetails
    this.algod = algod
    this.indexer = indexer
    this.appSpec = typeof app == 'string' ? (JSON.parse(app) as AppSpec) : 'contract' in app ? app : (JSON.parse(app.content) as AppSpec)

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

  async deploy(deploy: {
    sender?: SendTransactionFrom
    version: string
    allowUpdate?: boolean
    allowDelete?: boolean
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

    return deployApp(
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from: sender ?? this.sender!,
        approvalProgram: this.appSpec.source.approval,
        clearStateProgram: this.appSpec.source.clear,
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
      },
      this.algod,
      this.indexer,
    )
  }

  async create(create: { sender?: SendTransactionFrom; args?: AppCallArgs; note: TransactionNote; sendParams?: SendTransactionParams }) {
    const { sender, args, note, sendParams } = create

    if (this._appIndex !== 0) {
      throw new Error(`Attempt to create app which already has an app index of ${this._appIndex}`)
    }

    if (!sender && !this.sender) {
      throw new Error('No sender provided, unable to create app')
    }

    return createApp(
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from: sender ?? this.sender!,
        approvalProgram: this.appSpec.source.approval,
        clearStateProgram: this.appSpec.source.clear,
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
  }

  // todo: update and other method types

  async call(call: {
    method: string
    args: AppCallArgs
    sender?: SendTransactionFrom
    callType: 'optin' | 'closeout' | 'clearstate' | 'delete' | 'normal'
    note: TransactionNote
    sendParams?: SendTransactionParams
  }) {
    const { method, args, sender, callType, note, sendParams } = call

    if (!sender && !this.sender) {
      throw new Error('No sender provided, unable to call app')
    }

    const abiMethod = this.getABIMethod(method)
    if (!abiMethod) {
      throw new Error(`Attempt to call ABI method ${method}, but it wasn't found`)
    }

    const appMetadata = await this.loadAppReference()

    // todo: validate args based on ABI definition

    return callApp(
      {
        appIndex: appMetadata.appIndex,
        callType: callType,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from: sender ?? this.sender!,
        args,
        note: note,
        transactionParams: this.params,
        ...(sendParams ?? {}),
      },
      this.algod,
    )
  }

  getABIMethod(method: string) {
    return this.appSpec.contract.methods.find((m) => (method.includes('(') ? getABISignature(m) === method : m.name === method))
  }

  private async loadAppReference(): Promise<AppMetadata | AppReference> {
    if (!this.existingDeployments && this._creator) {
      this.existingDeployments = await getCreatorAppsByName(this._creator, this.indexer)
    }

    if (this.existingDeployments) {
      const app = this.existingDeployments.apps[this.appSpec.contract.name]
      if (!app) {
        throw new Error(`Attempt to call an app that can't be found '${this.appSpec.contract.name}' for creator '${this._creator}'.`)
      }
      return app
    }

    return {
      appIndex: this._appIndex,
      appAddress: this._appAddress,
    } as AppReference
  }
}
