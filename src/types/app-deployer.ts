import algosdk from 'algosdk'
import { Config } from '../config'
import * as indexer from '../indexer-lookup'
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
import AlgoKitComposer, {
  AppCreateMethodCall,
  AppCreateParams,
  AppDeleteMethodCall,
  AppDeleteParams,
  AppUpdateMethodCall,
  AppUpdateParams,
  ExecuteParams,
} from './composer'
import { Expand } from './expand'
import { ConfirmedTransactionResult } from './transaction'

/** The parameters to idempotently deploy an app */
export interface AppDeployParams {
  /** The deployment metadata */
  metadata: AppDeployMetadata
  /** Any deploy-time parameters to replace in the TEAL code before compiling it (used if teal code is passed in as a string) */
  deployTimeParams?: TealTemplateParams
  /** What action to perform if a schema break (storage schema or extra pages change) is detected:
   *
   * * `replace` - Delete the old app and create a new one
   * * `fail` - Fail the deployment (throw an error)
   * * `append` - Deploy a new app and leave the old one as is
   */
  onSchemaBreak?: 'replace' | 'fail' | 'append' | OnSchemaBreak
  /** What action to perform if a TEAL code update is detected:
   *
   * * `update` - Update the app with the new TEAL code
   * * `replace` - Delete the old app and create a new one
   * * `fail` - Fail the deployment (throw an error)
   * * `append` - Deploy a new app and leave the old one as is
   */
  onUpdate?: 'update' | 'replace' | 'fail' | 'append' | OnUpdate
  /** Create transaction parameters to use if a create needs to be issued as part of deployment */
  createParams: AppCreateParams | AppCreateMethodCall
  /** Update transaction parameters to use if an update needs to be issued as part of deployment */
  updateParams:
    | Expand<Omit<AppUpdateParams, 'appId' | 'approvalProgram' | 'clearStateProgram'>>
    | Expand<Omit<AppUpdateMethodCall, 'appId' | 'approvalProgram' | 'clearStateProgram'>>
  /** Delete transaction parameters to use if a delete needs to be issued as part of deployment */
  deleteParams: Expand<Omit<AppDeleteParams, 'appId'>> | Expand<Omit<AppDeleteMethodCall, 'appId'>>
  /** Parameters to use for transaction execution */
  executeParams?: ExecuteParams
  /** Optional cached value of the existing apps for the given creator; use this to avoid an indexer lookup */
  existingDeployments?: AppLookup
  /** Whether or not to ignore the app metadata cache and force a lookup, default: use the cache **/
  ignoreCache?: boolean
}

/** The metadata that can be collected about a deployed app */
export interface AppMetadata extends AppDeployMetadata {
  /** The id of the app */
  appId: bigint
  /** The Algorand address of the account associated with the app */
  appAddress: string
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
  creator: Readonly<string>
  /** A hash map of app name to app metadata */
  apps: {
    [name: string]: AppMetadata
  }
}

export type AppDeployResult =
  | Expand<{ operationPerformed: 'create' } & AppMetadata & SendAppCreateTransactionResult>
  | Expand<{ operationPerformed: 'update' } & AppMetadata & SendAppUpdateTransactionResult>
  | Expand<
      { operationPerformed: 'replace' } & AppMetadata &
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
   * @returns The app reference of the new/existing app
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
      executeParams,
      existingDeployments,
      ignoreCache,
    } = deployment

    // Set creation note

    createParams.note = updateParams.note = AlgoKitComposer.arc2Note({
      dAppName: APP_DEPLOY_NOTE_DAPP,
      data: metadata,
      format: 'j',
    })

    // Check for required fields

    if (existingDeployments && existingDeployments.creator !== createParams.sender) {
      throw new Error(
        `Received invalid existingDeployments value for creator ${existingDeployments.creator} when attempting to deploy for creator ${createParams.sender}`,
      )
    }
    if (!existingDeployments && !this._indexer) {
      throw new Error(
        `Didn't receive an indexer client when this AppManager was created, but also didn't receive an existingDeployments cache - one of them must be provided`,
      )
    }

    Config.getLogger(executeParams?.suppressLog).info(
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
        ? this._transactionSender.appCreateMethodCall({ ...createParams, approvalProgram, clearStateProgram, ...executeParams })
        : this._transactionSender.appCreate({ ...createParams, approvalProgram, clearStateProgram, ...executeParams }))
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
      Config.getLogger(executeParams?.suppressLog).info(
        `Updating existing ${metadata.name} app for ${createParams.sender} to version ${metadata.version}.`,
      )
      const result = await ('method' in updateParams
        ? this._transactionSender.appUpdateMethodCall({
            appId: existingApp.appId,
            approvalProgram,
            clearStateProgram,
            ...updateParams,
            ...executeParams,
          })
        : this._transactionSender.appUpdate({
            appId: existingApp.appId,
            approvalProgram,
            clearStateProgram,
            ...updateParams,
            ...executeParams,
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
      Config.getLogger(executeParams?.suppressLog).info(
        `Deploying a new ${metadata.name} app for ${createParams.sender}; deploying app with version ${metadata.version}.`,
      )

      Config.getLogger(executeParams?.suppressLog).warn(
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
      const result = await composer.execute({ ...executeParams, suppressLog: true })
      const confirmation = result.confirmations.at(createIndex - 1)!
      const transaction = result.transactions.at(createIndex - 1)!
      const deleteTransaction = result.transactions.at(-1)!

      Config.getLogger(executeParams?.suppressLog).warn(
        `Sent transactions ${transaction.txID()} to create app with id ${confirmation.applicationIndex} and ${deleteTransaction.txID()} to delete app with id ${
          existingApp.appId
        } from ${createParams.sender} account.`,
      )

      const appMetadata: AppMetadata = {
        appId: BigInt(confirmation.applicationIndex!),
        appAddress: algosdk.getApplicationAddress(confirmation.applicationIndex!),
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
      Config.getLogger(executeParams?.suppressLog).info(
        `App ${metadata.name} not found in apps created by ${createParams.sender}; deploying app with version ${metadata.version}.`,
      )

      return await createApp()
    }

    Config.getLogger(executeParams?.suppressLog).info(
      `Existing app ${metadata.name} found by creator ${createParams.sender}, with app id ${existingApp.appId} and version ${existingApp.version}.`,
    )

    const existingAppRecord = await this._appManager.getById(existingApp.appId)
    const existingApproval = Buffer.from(existingAppRecord.approvalProgram).toString('base64')
    const existingClear = Buffer.from(existingAppRecord.clearStateProgram).toString('base64')

    const newApproval = Buffer.from(approvalProgram).toString('base64')
    const newClear = Buffer.from(clearStateProgram).toString('base64')

    // Check for changes

    const isUpdate = newApproval !== existingApproval || newClear !== existingClear
    const isSchemaBreak =
      existingAppRecord.localInts < (createParams.schema?.localInts ?? 0) ||
      existingAppRecord.globalInts < (createParams.schema?.globalInts ?? 0) ||
      existingAppRecord.localByteSlices < (createParams.schema?.localByteSlices ?? 0) ||
      existingAppRecord.globalByteSlices < (createParams.schema?.globalByteSlices ?? 0)

    if (isSchemaBreak) {
      Config.getLogger(executeParams?.suppressLog).warn(`Detected a breaking app schema change in app ${existingApp.appId}:`, {
        from: {
          globalInts: existingAppRecord.globalInts,
          globalByteSlices: existingAppRecord.globalByteSlices,
          localInts: existingAppRecord.localInts,
          localByteSlices: existingAppRecord.localByteSlices,
        },
        to: createParams.schema,
      })

      if (onSchemaBreak === undefined || onSchemaBreak === 'fail' || onSchemaBreak === OnSchemaBreak.Fail) {
        throw new Error(
          'Schema break detected and onSchemaBreak=OnSchemaBreak.Fail, stopping deployment. ' +
            'If you want to try deleting and recreating the app then ' +
            're-run with onSchemaBreak=OnSchemaBreak.ReplaceApp',
        )
      }

      if (onSchemaBreak === 'append' || onSchemaBreak === OnSchemaBreak.AppendApp) {
        Config.getLogger(executeParams?.suppressLog).info('onSchemaBreak=AppendApp, will attempt to create a new app')
        return await createApp()
      }

      if (existingApp.deletable) {
        Config.getLogger(executeParams?.suppressLog).info(
          'App is deletable and onSchemaBreak=ReplaceApp, will attempt to create new app and delete old app',
        )
      } else {
        Config.getLogger(executeParams?.suppressLog).info(
          'App is not deletable but onSchemaBreak=ReplaceApp, will attempt to delete app, delete will most likely fail',
        )
      }

      return await replaceApp(existingApp)
    }

    if (isUpdate) {
      Config.getLogger(executeParams?.suppressLog).info(
        `Detected a TEAL update in app ${existingApp.appId} for creator ${createParams.sender}`,
      )

      if (onUpdate === undefined || onUpdate === 'fail' || onUpdate === OnUpdate.Fail) {
        throw new Error('Update detected and onUpdate=Fail, stopping deployment. Try a different onUpdate value to not fail.')
      }

      if (onUpdate === 'append' || onUpdate === OnUpdate.AppendApp) {
        Config.getLogger(executeParams?.suppressLog).info('onUpdate=AppendApp, will attempt to create a new app')
        return await createApp()
      }

      if (onUpdate === 'update' || onUpdate === OnUpdate.UpdateApp) {
        if (existingApp.updatable) {
          Config.getLogger(executeParams?.suppressLog).info(`App is updatable and onUpdate=UpdateApp, updating app...`)
        } else {
          Config.getLogger(executeParams?.suppressLog).warn(
            `App is not updatable but onUpdate=UpdateApp, will attempt to update app, update will most likely fail`,
          )
        }

        return await updateApp(existingApp)
      }

      if (onUpdate === 'replace' || onUpdate === OnUpdate.ReplaceApp) {
        if (existingApp.deletable) {
          Config.getLogger(executeParams?.suppressLog).warn(
            'App is deletable and onUpdate=ReplaceApp, creating new app and deleting old app...',
          )
        } else {
          Config.getLogger(executeParams?.suppressLog).warn(
            'App is not deletable and onUpdate=ReplaceApp, will attempt to create new app and delete old app, delete will most likely fail',
          )
        }

        return await replaceApp(existingApp)
      }
    }

    Config.getLogger(executeParams?.suppressLog).debug('No detected changes in app, nothing to do.')

    return { ...existingApp, operationPerformed: 'nothing' }
  }

  private updateAppLookup(sender: string, appMetadata: AppMetadata) {
    const lookup = this._appLookups.get(sender)
    if (!lookup) {
      this._appLookups.set(sender, { creator: sender, apps: { [appMetadata.name]: appMetadata } })
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
   * @param ignoreCache Whether ot not to ignore the cache and force a lookup, default: use the cache
   * @returns A name-based lookup of the app metadata
   */
  async getCreatorAppsByName(creatorAddress: string, ignoreCache?: boolean): Promise<AppLookup> {
    const appLookup: Record<string, AppMetadata> = {}

    if (!ignoreCache && this._appLookups.has(creatorAddress)) {
      return this._appLookups.get(creatorAddress)!
    }

    if (!this._indexer) {
      throw new Error(`Didn't receive an indexer client when this AppManager was created, but received a call to getCreatorApps`)
    }

    // Extract all apps that account created
    const createdApps = (await indexer.lookupAccountCreatedApplicationByAddress(this._indexer, creatorAddress))
      .map((a) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { id: BigInt(a.id), createdAtRound: a['created-at-round']!, deleted: a.deleted }
      })
      .sort((a, b) => a.createdAtRound - b.createdAtRound)

    // For each app that account created (in parallel)...
    const apps = await Promise.all(
      createdApps.map(async (createdApp) => {
        // Find any app transactions for that app in the round it was created (should always just be a single creation transaction)
        const appTransactions = await indexer.searchTransactions(this._indexer!, (s) =>
          s
            .minRound(createdApp.createdAtRound)
            .txType(algosdk.TransactionType.appl)
            .applicationID(Number(createdApp.id))
            .address(creatorAddress)
            .addressRole('sender')
            .notePrefix(Buffer.from(APP_DEPLOY_NOTE_DAPP).toString('base64')),
        )

        // Triple check the transaction is intact by filtering for the one we want:
        //  * application-id is 0 when the app is first created
        //  * also verify the sender to prevent a potential security risk
        const appCreationTransaction = appTransactions.transactions.filter(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (t) => t['application-transaction']!['application-id'] === 0 && t.sender === creatorAddress,
        )[0]

        const latestAppUpdateTransaction = appTransactions.transactions
          .filter((t) => t.sender === creatorAddress)
          .sort((a, b) =>
            a['confirmed-round'] === b['confirmed-round']
              ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                (b['intra-round-offset']! - a['intra-round-offset']!) / 10
              : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                b['confirmed-round']! - a['confirmed-round']!,
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { createdApp, appCreationTransaction, latestAppUpdateTransaction } = a!

        const parseNote = (note?: string) => {
          if (!note) {
            // No note; ignoring...
            return
          }

          const decoder = new TextDecoder()
          const noteAsBase64 = decoder.decode(Buffer.from(note))
          const noteAsString = Buffer.from(noteAsBase64, 'base64').toString('utf-8')

          if (!noteAsString.startsWith(`${APP_DEPLOY_NOTE_DAPP}:j{`))
            // Clearly not APP_DEPLOY JSON; ignoring...
            return

          return JSON.parse(noteAsString.substring(APP_DEPLOY_NOTE_DAPP.length + 2)) as AppDeployMetadata
        }

        try {
          const creationNote = parseNote(appCreationTransaction.note)
          const updateNote = parseNote(latestAppUpdateTransaction.note)
          if (creationNote?.name) {
            appLookup[creationNote.name] = {
              appId: createdApp.id,
              appAddress: algosdk.getApplicationAddress(createdApp.id),
              createdMetadata: creationNote,
              createdRound: BigInt(appCreationTransaction['confirmed-round'] ?? 0),
              ...(updateNote ?? creationNote),
              updatedRound: BigInt(latestAppUpdateTransaction?.['confirmed-round'] ?? 0),
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
      creator: creatorAddress,
      apps: appLookup,
    }

    this._appLookups.set(creatorAddress, lookup)

    return lookup
  }
}
