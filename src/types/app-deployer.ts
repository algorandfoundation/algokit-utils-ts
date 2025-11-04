import { TransactionType, getTransactionId } from '@algorandfoundation/algokit-transact'
import * as algosdk from '@algorandfoundation/sdk'
import { Address } from '@algorandfoundation/sdk'
import { Config } from '../config'
import * as indexer from '../indexer-lookup'
import { calculateExtraProgramPages } from '../util'
import { AlgorandClientTransactionSender } from './algorand-client-transaction-sender'
import {
  APP_DEPLOY_NOTE_DAPP,
  OnSchemaBreak,
  OnUpdate,
  type ABIReturn,
  type AppDeployMetadata,
  type SendAppCreateTransactionResult,
  type SendAppUpdateTransactionResult,
  type TealTemplateParams,
} from './app'
import { AppManager } from './app-manager'
import {
  AppCreateMethodCall,
  AppCreateParams,
  AppDeleteMethodCall,
  AppDeleteParams,
  AppUpdateMethodCall,
  AppUpdateParams,
  TransactionComposer,
} from './composer'
import { Expand } from './expand'
import { ConfirmedTransactionResult, SendParams } from './transaction'

/** Params to specify an update transaction for an app deployment */
export type DeployAppUpdateParams = Expand<Omit<AppUpdateParams, 'appId' | 'approvalProgram' | 'clearStateProgram'>>
/** Params to specify an update method call for an app deployment */
export type DeployAppUpdateMethodCall = Expand<Omit<AppUpdateMethodCall, 'appId' | 'approvalProgram' | 'clearStateProgram'>>
/** Params to specify a transaction for an app deployment */
export type DeployAppDeleteParams = Expand<Omit<AppDeleteParams, 'appId'>>
/** Params to specify a delete method call for an app deployment */
export type DeployAppDeleteMethodCall = Expand<Omit<AppDeleteMethodCall, 'appId'>>

/** The parameters to idempotently deploy an app */
export type AppDeployParams = Expand<
  SendParams & {
    /** The deployment metadata */
    metadata: AppDeployMetadata
    /** Any deploy-time parameters to replace in the TEAL code before compiling it (used if teal code is passed in as a string) */
    deployTimeParams?: TealTemplateParams
    /** What action to perform if a schema break (storage schema or extra pages change) is detected:
     *
     * * `fail` - Fail the deployment (throw an error, **default**)
     * * `replace` - Delete the old app and create a new one
     * * `append` - Deploy a new app and leave the old one as is
     */
    onSchemaBreak?: 'replace' | 'fail' | 'append' | OnSchemaBreak
    /** What action to perform if a TEAL code update is detected:
     *
     * * `fail` - Fail the deployment (throw an error, **default**)
     * * `update` - Update the app with the new TEAL code
     * * `replace` - Delete the old app and create a new one
     * * `append` - Deploy a new app and leave the old one as is
     */
    onUpdate?: 'update' | 'replace' | 'fail' | 'append' | OnUpdate
    /** Create transaction parameters to use if a create needs to be issued as part of deployment */
    createParams: AppCreateParams | AppCreateMethodCall
    /** Update transaction parameters to use if an update needs to be issued as part of deployment */
    updateParams: DeployAppUpdateParams | DeployAppUpdateMethodCall
    /** Delete transaction parameters to use if a delete needs to be issued as part of deployment */
    deleteParams: DeployAppDeleteParams | DeployAppDeleteMethodCall
    /** Optional cached value of the existing apps for the given creator; use this to avoid an indexer lookup */
    existingDeployments?: AppLookup
    /** Whether or not to ignore the app metadata cache and force a lookup, default: use the cache **/
    ignoreCache?: boolean
  }
>

/** The metadata that can be collected about a deployed app */
export interface AppMetadata extends AppDeployMetadata {
  /** The id of the app */
  appId: bigint
  /** The Algorand address of the account associated with the app */
  appAddress: Address
  /** The round the app was created */
  createdRound: bigint
  /** The last round that the app was updated */
  updatedRound: bigint
  /** The metadata when the app was created */
  createdMetadata: AppDeployMetadata
  /** Whether or not the app is deleted */
  deleted: boolean
}

/** A lookup of name -> Algorand app for a creator */
export interface AppLookup {
  /** The address of the creator associated with this lookup */
  creator: Readonly<Address>
  /** A hash map of app name to app metadata */
  apps: {
    [name: string]: AppMetadata
  }
}

export type AppDeployResult =
  | Expand<{ operationPerformed: 'create' } & Omit<AppMetadata, 'appId' | 'appAddress'> & SendAppCreateTransactionResult>
  | Expand<{ operationPerformed: 'update' } & AppMetadata & SendAppUpdateTransactionResult>
  | Expand<
      { operationPerformed: 'replace' } & Omit<AppMetadata, 'appId' | 'appAddress'> &
        SendAppCreateTransactionResult & {
          deleteReturn?: ABIReturn
          deleteResult: ConfirmedTransactionResult
        }
    >
  | Expand<{ operationPerformed: 'nothing' } & AppMetadata>

/** Allows management of deployment and deployment metadata of applications. */
export class AppDeployer {
  private _appManager: AppManager
  private _transactionSender: AlgorandClientTransactionSender
  private _indexer?: algosdk.Indexer
  private _appLookups = new Map<string, AppLookup>()

  /**
   * Creates an `AppManager`
   * @param appManager An `AppManager` instance
   * @param transactionSender An `AlgorandClientTransactionSender` instance
   * @param indexer An optional indexer instance; supply if you want to indexer to look up app metadata
   * @example
   * ```ts
   * const deployer = new AppDeployer(appManager, transactionSender, indexer)
   * ```
   */
  constructor(appManager: AppManager, transactionSender: AlgorandClientTransactionSender, indexer?: algosdk.Indexer) {
    this._appManager = appManager
    this._transactionSender = transactionSender
    this._indexer = indexer
  }

  /**
   * Idempotently deploy (create if not exists, update if changed) an app against the given name for the given creator account, including deploy-time TEAL template placeholder substitutions (if specified).
   *
   * To understand the architecture decisions behind this functionality please see https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md
   *
   * **Note:** When using the return from this function be sure to check `operationPerformed` to get access to various return properties like `transaction`, `confirmation` and `deleteResult`.
   *
   * **Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.
   *
   * **Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.
   * @param deployment The arguments to control the app deployment
   * @returns The result of the deployment
   * @example
   * ```ts
   * const deployResult = await deployer.deploy({
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
  async deploy(deployment: AppDeployParams): Promise<AppDeployResult> {
    const {
      metadata,
      deployTimeParams,
      onSchemaBreak,
      onUpdate,
      createParams,
      updateParams,
      deleteParams,
      existingDeployments,
      ignoreCache,
      ...sendParams
    } = deployment

    // Set creation note

    createParams.note = updateParams.note = TransactionComposer.arc2Note({
      dAppName: APP_DEPLOY_NOTE_DAPP,
      data: metadata,
      format: 'j',
    })

    // Check for required fields

    if (existingDeployments && existingDeployments.creator.toString() !== createParams.sender.toString()) {
      throw new Error(
        `Received invalid existingDeployments value for creator ${existingDeployments.creator} when attempting to deploy for creator ${createParams.sender}`,
      )
    }
    if (!existingDeployments && !this._indexer) {
      throw new Error(
        `Didn't receive an indexer client when this AppManager was created, but also didn't receive an existingDeployments cache - one of them must be provided`,
      )
    }

    Config.getLogger(sendParams?.suppressLog).info(
      `Idempotently deploying app "${metadata.name}" from creator ${createParams.sender} using ${createParams.approvalProgram.length} bytes of ${typeof createParams.approvalProgram === 'string' ? 'teal code' : 'AVM bytecode'} and ${createParams.clearStateProgram.length} bytes of ${typeof createParams.approvalProgram === 'string' ? 'teal code' : 'AVM bytecode'}`,
    )

    // Compile code if required

    const compiledApproval =
      typeof createParams.approvalProgram === 'string'
        ? await this._appManager.compileTealTemplate(createParams.approvalProgram, deployTimeParams, metadata)
        : undefined
    const approvalProgram = compiledApproval ? compiledApproval.compiledBase64ToBytes : createParams.approvalProgram

    const compiledClear =
      typeof createParams.clearStateProgram === 'string'
        ? await this._appManager.compileTealTemplate(createParams.clearStateProgram, deployTimeParams)
        : undefined
    const clearStateProgram = compiledClear ? compiledClear.compiledBase64ToBytes : createParams.clearStateProgram

    // Define routines for create, update, and replace

    const createApp = async () => {
      const result = await ('method' in createParams
        ? this._transactionSender.appCreateMethodCall({ ...createParams, approvalProgram, clearStateProgram, ...sendParams })
        : this._transactionSender.appCreate({ ...createParams, approvalProgram, clearStateProgram, ...sendParams }))
      const appMetadata: AppMetadata = {
        appId: result.appId,
        appAddress: result.appAddress,
        ...metadata,
        createdMetadata: metadata,
        createdRound: BigInt(result.confirmation.confirmedRound!),
        updatedRound: BigInt(result.confirmation.confirmedRound!),
        deleted: false,
      }
      this.updateAppLookup(createParams.sender, appMetadata)
      return {
        operationPerformed: 'create',
        compiledApproval,
        compiledClear,
        ...result,
        ...appMetadata,
      } satisfies SendAppCreateTransactionResult & AppMetadata & { operationPerformed: 'create' }
    }
    const updateApp = async (existingApp: AppMetadata) => {
      Config.getLogger(sendParams?.suppressLog).info(
        `Updating existing ${metadata.name} app for ${createParams.sender} to version ${metadata.version}.`,
      )
      const result = await ('method' in updateParams
        ? this._transactionSender.appUpdateMethodCall({
            appId: existingApp.appId,
            approvalProgram,
            clearStateProgram,
            ...updateParams,
            ...sendParams,
          })
        : this._transactionSender.appUpdate({
            appId: existingApp.appId,
            approvalProgram,
            clearStateProgram,
            ...updateParams,
            ...sendParams,
          }))
      const appMetadata: AppMetadata = {
        appId: existingApp.appId,
        appAddress: existingApp.appAddress,
        createdMetadata: existingApp.createdMetadata,
        createdRound: existingApp.createdRound,
        updatedRound: BigInt(result.confirmation.confirmedRound!),
        ...metadata,
        deleted: false,
      }
      this.updateAppLookup(createParams.sender, appMetadata)
      return {
        operationPerformed: 'update',
        compiledApproval,
        compiledClear,
        ...result,
        ...appMetadata,
      } satisfies SendAppUpdateTransactionResult & AppMetadata & { operationPerformed: 'update' }
    }
    const replaceApp = async (existingApp: AppMetadata) => {
      Config.getLogger(sendParams?.suppressLog).info(
        `Deploying a new ${metadata.name} app for ${createParams.sender}; deploying app with version ${metadata.version}.`,
      )

      Config.getLogger(sendParams?.suppressLog).warn(
        `Deleting existing ${metadata.name} app with id ${existingApp.appId} from ${deleteParams.sender} account.`,
      )

      const composer = this._transactionSender.newGroup()
      if ('method' in createParams) {
        composer.addAppCreateMethodCall({ ...createParams, approvalProgram, clearStateProgram })
      } else {
        composer.addAppCreate({ ...createParams, approvalProgram, clearStateProgram })
      }
      const createIndex = await composer.count()
      if ('method' in deleteParams) {
        composer.addAppDeleteMethodCall({ appId: existingApp.appId, ...deleteParams })
      } else {
        composer.addAppDelete({ appId: existingApp.appId, ...deleteParams })
      }
      const result = await composer.send({ ...sendParams })
      const confirmation = result.confirmations.at(createIndex - 1)!
      const transaction = result.transactions.at(createIndex - 1)!
      const deleteTransaction = result.transactions.at(-1)!

      Config.getLogger(sendParams?.suppressLog).warn(
        `Sent transactions ${transaction.txID()} to create app with id ${confirmation.appId} and ${getTransactionId(deleteTransaction)} to delete app with id ${
          existingApp.appId
        } from ${createParams.sender} account.`,
      )

      const appMetadata: AppMetadata = {
        appId: BigInt(confirmation.appId!),
        appAddress: algosdk.getApplicationAddress(confirmation.appId!),
        ...metadata,
        createdMetadata: metadata,
        createdRound: BigInt(confirmation.confirmedRound!),
        updatedRound: BigInt(confirmation.confirmedRound!),
        deleted: false,
      }
      this.updateAppLookup(createParams.sender, appMetadata)

      return {
        operationPerformed: 'replace',
        ...result,
        compiledApproval,
        compiledClear,
        transaction,
        confirmation,
        return: 'method' in createParams ? result.returns?.[0] : undefined,
        deleteReturn: 'method' in deleteParams ? result.returns?.at(-1) : undefined,
        ...appMetadata,
        deleteResult: { transaction: deleteTransaction, confirmation: result.confirmations.at(-1)! },
      } satisfies { operationPerformed: 'replace' } & AppMetadata &
        SendAppCreateTransactionResult & {
          deleteReturn?: ABIReturn
          deleteResult: ConfirmedTransactionResult
        }
    }

    // Lookup existing app metadata

    const apps = existingDeployments ?? (await this.getCreatorAppsByName(createParams.sender, ignoreCache))

    const existingApp = apps.apps[metadata.name]
    if (!existingApp || existingApp.deleted) {
      Config.getLogger(sendParams?.suppressLog).info(
        `App ${metadata.name} not found in apps created by ${createParams.sender}; deploying app with version ${metadata.version}.`,
      )

      return await createApp()
    }

    Config.getLogger(sendParams?.suppressLog).info(
      `Existing app ${metadata.name} found by creator ${createParams.sender}, with app id ${existingApp.appId} and version ${existingApp.version}.`,
    )

    const existingAppRecord = await this._appManager.getById(existingApp.appId)
    const existingApproval = Buffer.from(existingAppRecord.approvalProgram).toString('base64')
    const existingClear = Buffer.from(existingAppRecord.clearStateProgram).toString('base64')
    const existingExtraPages = calculateExtraProgramPages(existingAppRecord.approvalProgram, existingAppRecord.clearStateProgram)

    const newApprovalBytes = Buffer.from(approvalProgram)
    const newClearBytes = Buffer.from(clearStateProgram)
    const newApproval = newApprovalBytes.toString('base64')
    const newClear = newClearBytes.toString('base64')
    const newExtraPages = calculateExtraProgramPages(newApprovalBytes, newClearBytes)

    // Check for changes

    const isUpdate = newApproval !== existingApproval || newClear !== existingClear
    const isSchemaBreak =
      existingAppRecord.localInts < (createParams.schema?.localInts ?? 0) ||
      existingAppRecord.globalInts < (createParams.schema?.globalInts ?? 0) ||
      existingAppRecord.localByteSlices < (createParams.schema?.localByteSlices ?? 0) ||
      existingAppRecord.globalByteSlices < (createParams.schema?.globalByteSlices ?? 0) ||
      existingExtraPages < newExtraPages

    if (isSchemaBreak) {
      Config.getLogger(sendParams?.suppressLog).warn(`Detected a breaking app schema change in app ${existingApp.appId}:`, {
        from: {
          globalInts: existingAppRecord.globalInts,
          globalByteSlices: existingAppRecord.globalByteSlices,
          localInts: existingAppRecord.localInts,
          localByteSlices: existingAppRecord.localByteSlices,
          extraProgramPages: existingExtraPages,
        },
        to: { ...createParams.schema, extraProgramPages: newExtraPages },
      })

      if (onSchemaBreak === undefined || onSchemaBreak === 'fail' || onSchemaBreak === OnSchemaBreak.Fail) {
        throw new Error(
          'Schema break detected and onSchemaBreak=OnSchemaBreak.Fail, stopping deployment. ' +
            'If you want to try deleting and recreating the app then ' +
            're-run with onSchemaBreak=OnSchemaBreak.ReplaceApp',
        )
      }

      if (onSchemaBreak === 'append' || onSchemaBreak === OnSchemaBreak.AppendApp) {
        Config.getLogger(sendParams?.suppressLog).info('onSchemaBreak=AppendApp, will attempt to create a new app')
        return await createApp()
      }

      if (existingApp.deletable) {
        Config.getLogger(sendParams?.suppressLog).info(
          'App is deletable and onSchemaBreak=ReplaceApp, will attempt to create new app and delete old app',
        )
      } else {
        Config.getLogger(sendParams?.suppressLog).info(
          'App is not deletable but onSchemaBreak=ReplaceApp, will attempt to delete app, delete will most likely fail',
        )
      }

      return await replaceApp(existingApp)
    }

    if (isUpdate) {
      Config.getLogger(sendParams?.suppressLog).info(
        `Detected a TEAL update in app ${existingApp.appId} for creator ${createParams.sender}`,
      )

      if (onUpdate === undefined || onUpdate === 'fail' || onUpdate === OnUpdate.Fail) {
        throw new Error('Update detected and onUpdate=Fail, stopping deployment. Try a different onUpdate value to not fail.')
      }

      if (onUpdate === 'append' || onUpdate === OnUpdate.AppendApp) {
        Config.getLogger(sendParams?.suppressLog).info('onUpdate=AppendApp, will attempt to create a new app')
        return await createApp()
      }

      if (onUpdate === 'update' || onUpdate === OnUpdate.UpdateApp) {
        if (existingApp.updatable) {
          Config.getLogger(sendParams?.suppressLog).info(`App is updatable and onUpdate=UpdateApp, updating app...`)
        } else {
          Config.getLogger(sendParams?.suppressLog).warn(
            `App is not updatable but onUpdate=UpdateApp, will attempt to update app, update will most likely fail`,
          )
        }

        return await updateApp(existingApp)
      }

      if (onUpdate === 'replace' || onUpdate === OnUpdate.ReplaceApp) {
        if (existingApp.deletable) {
          Config.getLogger(sendParams?.suppressLog).warn(
            'App is deletable and onUpdate=ReplaceApp, creating new app and deleting old app...',
          )
        } else {
          Config.getLogger(sendParams?.suppressLog).warn(
            'App is not deletable and onUpdate=ReplaceApp, will attempt to create new app and delete old app, delete will most likely fail',
          )
        }

        return await replaceApp(existingApp)
      }
    }

    Config.getLogger(sendParams?.suppressLog).debug('No detected changes in app, nothing to do.')

    return { ...existingApp, operationPerformed: 'nothing' }
  }

  private updateAppLookup(sender: string | Address, appMetadata: AppMetadata) {
    const s = typeof sender === 'string' ? sender : sender.toString()
    const lookup = this._appLookups.get(s)
    if (!lookup) {
      this._appLookups.set(s, { creator: Address.fromString(s), apps: { [appMetadata.name]: appMetadata } })
    } else {
      lookup.apps[appMetadata.name] = appMetadata
    }
  }

  /**
   * Returns a lookup of name => app metadata (id, address, ...metadata) for all apps created by the given account that have
   * an [ARC-2](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md) `AppDeployNote` as the transaction
   * note of the app creation transaction.
   *
   * This function caches the result for the given creator account so that subsequent calls will not require an indexer lookup.
   *
   * If the `AppManager` instance wasn't created with an indexer client, this function will throw an error.
   *
   * @param creatorAddress The address of the account that is the creator of the apps you want to search for
   * @param ignoreCache Whether or not to ignore the cache and force a lookup, default: use the cache
   * @returns A name-based lookup of the app metadata
   * @example
   * ```ts
   * const result = await deployer.getCreatorAppsByName(creator)
   */
  async getCreatorAppsByName(creatorAddress: string | Address, ignoreCache?: boolean): Promise<AppLookup> {
    const appLookup: Record<string, AppMetadata> = {}

    const address = typeof creatorAddress === 'string' ? creatorAddress : creatorAddress.toString()
    if (!ignoreCache && this._appLookups.has(address)) {
      return this._appLookups.get(address)!
    }

    if (!this._indexer) {
      throw new Error(`Didn't receive an indexer client when this AppManager was created, but received a call to getCreatorApps`)
    }

    // Extract all apps that account created
    const createdApps = (await indexer.lookupAccountCreatedApplicationByAddress(this._indexer, creatorAddress))
      .map((a) => {
        return { id: a.id, createdAtRound: a.createdAtRound!, deleted: a.deleted }
      })
      .sort((a, b) => Number(a.createdAtRound - b.createdAtRound))

    // For each app that account created (in parallel)...
    const apps = await Promise.all(
      createdApps.map(async (createdApp) => {
        // Find any app transactions for that app in the round it was created (should always just be a single creation transaction)
        const appTransactions = await indexer.searchTransactions(this._indexer!, (s) =>
          s
            .minRound(createdApp.createdAtRound)
            .txType(TransactionType.AppCall)
            .applicationID(Number(createdApp.id))
            .address(creatorAddress)
            .addressRole('sender')
            .notePrefix(Buffer.from(APP_DEPLOY_NOTE_DAPP).toString('base64')),
        )

        // Triple check the transaction is intact by filtering for the one we want:
        //  * application-id is 0 when the app is first created
        //  * also verify the sender to prevent a potential security risk
        const appCreationTransaction = appTransactions.transactions.filter(
          (t) => t.applicationTransaction?.applicationId === 0n && t.sender.toString() === creatorAddress.toString(),
        )[0]

        const latestAppUpdateTransaction = appTransactions.transactions
          .filter((t) => t.sender.toString() === creatorAddress.toString())
          .sort((a, b) =>
            a.confirmedRound === b.confirmedRound
              ? (b.intraRoundOffset! - a.intraRoundOffset!) / 10
              : Number(b.confirmedRound! - a.confirmedRound!),
          )[0]

        if (!appCreationTransaction?.note)
          // No note; ignoring
          return null

        return { createdApp, appCreationTransaction, latestAppUpdateTransaction }
      }),
    )

    apps
      .filter((a) => a !== null)
      .forEach((a) => {
        const { createdApp, appCreationTransaction, latestAppUpdateTransaction } = a!

        const parseNote = (note?: string) => {
          if (!note) {
            // No note; ignoring...
            return
          }

          if (!note.startsWith(`${APP_DEPLOY_NOTE_DAPP}:j{`))
            // Clearly not APP_DEPLOY JSON; ignoring...
            return

          return JSON.parse(note.substring(APP_DEPLOY_NOTE_DAPP.length + 2)) as AppDeployMetadata
        }

        try {
          const creationNote = parseNote(
            appCreationTransaction.note ? Buffer.from(appCreationTransaction.note).toString('utf-8') : undefined,
          )
          const updateNote = parseNote(
            latestAppUpdateTransaction.note ? Buffer.from(latestAppUpdateTransaction.note).toString('utf-8') : undefined,
          )
          if (creationNote?.name) {
            appLookup[creationNote.name] = {
              appId: createdApp.id,
              appAddress: algosdk.getApplicationAddress(createdApp.id),
              createdMetadata: creationNote,
              createdRound: appCreationTransaction.confirmedRound ?? 0n,
              ...(updateNote ?? creationNote),
              updatedRound: latestAppUpdateTransaction?.confirmedRound ?? 0n,
              deleted: createdApp.deleted ?? false,
            }
          }
        } catch (e) {
          Config.logger.warn(
            `Received error trying to retrieve app with ${createdApp.id} for creator ${creatorAddress}; failing silently`,
            e,
          )
          return
        }
      })

    const lookup = {
      creator: typeof creatorAddress === 'string' ? Address.fromString(creatorAddress) : creatorAddress,
      apps: appLookup,
    }

    this._appLookups.set(creatorAddress.toString(), lookup)

    return lookup
  }
}
