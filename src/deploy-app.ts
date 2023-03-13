import { Algodv2, getApplicationAddress, Indexer, TransactionType } from 'algosdk'
import { AppCallArgs, AppReference, callApp, CompiledTeal, createApp, CreateAppParams, getAppByIndex, updateApp } from './app'
import { AlgoKitConfig } from './config'
import { lookupAccountCreatedApplicationByAddress, searchTransactions } from './indexer-lookup'
import { getSenderAddress, sendGroupOfTransactions, SendTransactionFrom, SendTransactionResult } from './transaction'
import { ApplicationStateSchema } from './types/algod'

export const UPDATABLE_TEMPLATE_NAME = 'TMPL_UPDATABLE'
export const DELETABLE_TEMPLATE_NAME = 'TMPL_DELETABLE'
export const APP_DEPLOY_NOTE_PREFIX = 'APP_DEPLOY::'

/**
 * The payload of the metadata to add to the transaction note when deploying an app, noting it will be prefixed with @see {APP_DEPLOY_NOTE_PREFIX}.
 */
export interface AppDeployMetadata {
  /** The unique name identifier of the app within the creator account */
  name: string
  /** The version of app that is / will be deployed */
  version: string
  /** Whether or not the app is deletable / permanent */
  deletable: boolean
  /** Whether or not the app is updatable / immutable */
  updatable: boolean
}

/** The metadata that can be collected about a deployed app */
export interface AppMetadata extends AppReference, AppDeployMetadata {
  /** The round the app was created */
  createdRound: number
  /** The last round that the app was updated */
  updatedRound: number
  /** The metadata when the app was created */
  createdMetadata: AppDeployMetadata
  /** Whether or not the app is deleted */
  deleted: boolean
}

/** A lookup of name -> Algorand app for a creator */
export interface AppLookup {
  creator: Readonly<string>
  apps: Readonly<{
    [name: string]: AppMetadata
  }>
}

/** Dictionary of deploy-time parameters to replace in a teal template.
 *
 * Note: Looks for `TMPL_{parameter}` for template replacements i.e. you can leave out the `TMPL_`.
 *
 */
export interface TealTemplateParameters {
  [key: string]: string | bigint | number | Uint8Array
}

/** What action to perform when deploying an app and an update is detected in the TEAL code */
export enum OnUpdate {
  /** Fail the deployment */
  Fail,
  /** Update the app */
  UpdateApp,
  /** Delete the app and create a new one in its place */
  ReplaceApp,
}

/** What action to perform when deploying an app and a breaking schema change is detected */
export enum OnSchemaBreak {
  /** Fail the deployment */
  Fail,
  /** Delete the app and create a new one in its place */
  ReplaceApp,
}

/** The parameters to deploy an app */
export interface AppDeploymentParams extends Omit<CreateAppParams, 'args' | 'note' | 'skipSending' | 'skipWaiting'> {
  /** The deployment metadata */
  metadata: AppDeployMetadata
  /** Any deploy-time parameters to replace in the TEAL code */
  deployTimeParameters?: TealTemplateParameters
  /** What action to perform if a schema break is detected */
  onSchemaBreak?: 'replace' | 'fail' | OnSchemaBreak
  /** What action to perform if a TEAL update is detected */
  onUpdate?: 'update' | 'replace' | 'fail' | OnUpdate
  /** Optional cached value of the existing apps for the given creator */
  existingDeployments?: AppLookup
  /** Any args to pass to any create transaction that is issued as part of deployment */
  createArgs?: AppCallArgs
  /** Any args to pass to any update transaction that is issued as part of deployment */
  updateArgs?: AppCallArgs
  /** Any args to pass to any delete transaction that is issued as part of deployment */
  deleteArgs?: AppCallArgs
}

/**
 * Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.
 *
 * To understand the architecture decisions behind this functionality please @see https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md
 *
 * **Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'delete'`) the existing app will be deleted and re-created.
 *
 * **Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'delete'`) the existing app will be deleted and re-created.
 * @param deployment The arguments to control the app deployment, including:
 * @param algod An algod client
 * @param indexer An indexer client
 * @returns The app reference of the new/existing app
 */
export async function deployApp(
  deployment: AppDeploymentParams,
  algod: Algodv2,
  indexer: Indexer,
  // todo: confirmation is required return not optional
): Promise<(SendTransactionResult & AppMetadata & { deleteResult?: SendTransactionResult }) | AppMetadata> {
  const { metadata, deployTimeParameters, onSchemaBreak, onUpdate, existingDeployments, createArgs, updateArgs, deleteArgs, ...appParams } =
    deployment

  if (existingDeployments && existingDeployments.creator !== getSenderAddress(appParams.from)) {
    throw new Error(
      `Received invalid existingDeployments value for creator ${existingDeployments.creator} when attempting to deploy for creator ${appParams.from}`,
    )
  }

  AlgoKitConfig.getLogger(appParams.suppressLog).info(
    `Idempotently deploying app "${metadata.name}" from creator ${getSenderAddress(appParams.from)} using ${
      appParams.approvalProgram.length
    } bytes of teal code and ${appParams.clearStateProgram.length} bytes of teal code`,
  )

  appParams.approvalProgram =
    typeof appParams.approvalProgram === 'string'
      ? (await performTemplateSubstitutionAndCompile(appParams.approvalProgram, algod, deployTimeParameters, metadata))
          .compiledBase64ToBytes
      : appParams.approvalProgram
  appParams.clearStateProgram =
    typeof appParams.clearStateProgram === 'string'
      ? (await performTemplateSubstitutionAndCompile(appParams.clearStateProgram, algod, deployTimeParameters)).compiledBase64ToBytes
      : appParams.clearStateProgram

  const apps = existingDeployments ?? (await getCreatorAppsByName(indexer, appParams.from))

  const create = async (skipSending?: boolean): Promise<SendTransactionResult & AppMetadata> => {
    const result = await createApp(
      {
        ...appParams,
        args: createArgs,
        note: getAppDeploymentTransactionNote(metadata),
        skipSending: skipSending ?? false,
        skipWaiting: false,
      },
      algod,
    )

    return {
      transaction: result.transaction,
      confirmation: result.confirmation,
      appIndex: result.appIndex,
      appAddress: result.appAddress,
      createdMetadata: metadata,
      createdRound: Number(result.confirmation?.['confirmed-round']),
      updatedRound: Number(result.confirmation?.['confirmed-round']),
      ...metadata,
      deleted: false,
    }
  }

  const existingApp = apps.apps[metadata.name]

  if (!existingApp) {
    AlgoKitConfig.getLogger(appParams.suppressLog).info(
      `App ${metadata.name} not found in apps created by ${getSenderAddress(appParams.from)}; deploying app with version ${
        metadata.version
      }.`,
    )

    return await create()
  }

  AlgoKitConfig.getLogger(appParams.suppressLog).info(
    `Existing app ${metadata.name} found by creator ${getSenderAddress(appParams.from)}, with app index ${
      existingApp.appIndex
    } and version ${existingApp.version}.`,
  )

  const existingAppRecord = await getAppByIndex(existingApp.appIndex, algod)
  const existingApproval = existingAppRecord.params['approval-program']
  const existingClear = existingAppRecord.params['clear-state-program']
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const existingGlobalSchema = existingAppRecord.params['global-state-schema']!
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const existingLocalSchema = existingAppRecord.params['local-state-schema']!

  const newGlobalSchema: ApplicationStateSchema = {
    'num-byte-slice': appParams.schema.globalByteSlices,
    'num-uint': appParams.schema.globalInts,
  }
  const newLocalSchema: ApplicationStateSchema = {
    'num-byte-slice': appParams.schema.localByteSlices,
    'num-uint': appParams.schema.localInts,
  }
  const newApproval = Buffer.from(appParams.approvalProgram).toString('base64')
  const newClear = Buffer.from(appParams.clearStateProgram).toString('base64')

  const isUpdate = newApproval !== existingApproval || newClear !== existingClear
  const isSchemaBreak = schemaIsBroken(existingGlobalSchema, newGlobalSchema) || schemaIsBroken(existingLocalSchema, newLocalSchema)

  const replace = async (): Promise<SendTransactionResult & AppMetadata> => {
    // Create

    AlgoKitConfig.getLogger(appParams.suppressLog).info(
      `Deploying a new ${metadata.name} app for ${getSenderAddress(appParams.from)}; deploying app with version ${metadata.version}.`,
    )

    const { transaction: createTransaction, ...newApp } = await create(true)

    // Delete

    AlgoKitConfig.getLogger(appParams.suppressLog).warn(
      `Deleting existing ${metadata.name} app with index ${existingApp.appIndex} from ${getSenderAddress(appParams.from)} account.`,
    )

    const { transaction: deleteTransaction } = await callApp(
      {
        appIndex: existingApp.appIndex,
        callType: 'delete',
        from: appParams.from,
        args: deleteArgs,
        transactionParams: appParams.transactionParams,
        suppressLog: appParams.suppressLog,
        skipSending: true,
      },
      algod,
    )

    // Ensure create and delete happen atomically
    const { confirmations } = await sendGroupOfTransactions(
      {
        transactions: [
          {
            transaction: createTransaction,
            signer: appParams.from,
          },
          {
            transaction: deleteTransaction,
            signer: appParams.from,
          },
        ],
        sendParams: {
          maxRoundsToWaitForConfirmation: appParams.maxRoundsToWaitForConfirmation,
          skipWaiting: false,
          suppressLog: true,
        },
      },
      algod,
    )

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const createConfirmation = confirmations![0]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const deleteConfirmation = confirmations![1]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newAppIndex = createConfirmation['application-index']!

    AlgoKitConfig.getLogger(appParams.suppressLog).warn(
      `Sent transactions ${createTransaction.txID()} to create app with index ${newAppIndex} and ${deleteTransaction.txID()} to delete app with index ${
        existingApp.appIndex
      } from ${getSenderAddress(appParams.from)} account.`,
    )

    return {
      transaction: createTransaction,
      confirmation: createConfirmation,
      appIndex: newAppIndex,
      appAddress: getApplicationAddress(newAppIndex),
      createdMetadata: metadata,
      createdRound: Number(createConfirmation['confirmed-round']),
      updatedRound: Number(createConfirmation['confirmed-round']),
      ...metadata,
      deleted: false,
      deleteResult: { transaction: deleteTransaction, confirmation: deleteConfirmation },
    } as SendTransactionResult & AppMetadata & { deleteResult?: SendTransactionResult }
  }

  const update = async (): Promise<SendTransactionResult & AppMetadata> => {
    AlgoKitConfig.getLogger(appParams.suppressLog).info(
      `Updating existing ${metadata.name} app for ${getSenderAddress(appParams.from)} to version ${metadata.version}.`,
    )

    const result = await updateApp(
      {
        appIndex: existingApp.appIndex,
        from: appParams.from,
        args: updateArgs,
        note: getAppDeploymentTransactionNote(metadata),
        approvalProgram: appParams.approvalProgram,
        clearStateProgram: appParams.clearStateProgram,
        transactionParams: appParams.transactionParams,
        suppressLog: appParams.suppressLog,
        skipSending: false,
        skipWaiting: false,
      },
      algod,
    )

    return {
      transaction: result.transaction,
      confirmation: result.confirmation,
      appIndex: existingApp.appIndex,
      appAddress: existingApp.appAddress,
      createdMetadata: existingApp.createdMetadata,
      createdRound: existingApp.createdRound,
      updatedRound: Number(result.confirmation?.['confirmed-round']),
      ...metadata,
      deleted: false,
    }
  }

  if (isSchemaBreak) {
    AlgoKitConfig.getLogger(appParams.suppressLog).warn(`Detected a breaking app schema change in app ${existingApp.appIndex}:`, {
      from: {
        global: existingGlobalSchema,
        local: existingLocalSchema,
      },
      to: {
        global: newGlobalSchema,
        local: newLocalSchema,
      },
    })

    if (onSchemaBreak === undefined || onSchemaBreak === 'fail' || onSchemaBreak === OnSchemaBreak.Fail) {
      throw new Error(
        'Schema break detected and onSchemaBreak=OnSchemaBreak.Fail, stopping deployment. ' +
          'If you want to try deleting and recreating the app then ' +
          're-run with onSchemaBreak=OnSchemaBreak.ReplaceApp',
      )
    }

    if (existingApp.deletable) {
      AlgoKitConfig.getLogger(appParams.suppressLog).info(
        'App is deletable and onSchemaBreak=ReplaceApp, will attempt to create new app and delete old app',
      )
    } else {
      AlgoKitConfig.getLogger(appParams.suppressLog).info(
        'App is not deletable but onSchemaBreak=ReplaceApp, will attempt to delete app, delete will most likely fail',
      )
    }

    return await replace()
  }

  if (isUpdate) {
    AlgoKitConfig.getLogger(appParams.suppressLog).info(
      `Detected a TEAL update in app ${existingApp.appIndex} for creator ${getSenderAddress(appParams.from)}`,
    )

    if (onUpdate === undefined || onUpdate === 'fail' || onUpdate === OnUpdate.Fail) {
      throw new Error(
        'Update detected and onUpdate=Fail, stopping deployment. ' +
          'If you want to try deleting and recreating the app then ' +
          're-run with onUpdate=UpdateApp',
      )
    }

    if (onUpdate === 'update' || onUpdate === OnUpdate.UpdateApp) {
      if (existingApp.updatable) {
        AlgoKitConfig.getLogger(appParams.suppressLog).info(`App is updatable and onUpdate=UpdateApp, updating app...`)
      } else {
        AlgoKitConfig.getLogger(appParams.suppressLog).warn(
          `App is not updatable but onUpdate=UpdateApp, will attempt to update app, update will most likely fail`,
        )
      }

      return await update()
    }

    if (onUpdate === 'replace' || onUpdate === OnUpdate.ReplaceApp) {
      if (existingApp.deletable) {
        AlgoKitConfig.getLogger(appParams.suppressLog).warn(
          'App is deletable and onUpdate=ReplaceApp, creating new app and deleting old app...',
        )
      } else {
        AlgoKitConfig.getLogger(appParams.suppressLog).warn(
          'App is not deletable and onUpdate=ReplaceApp, will attempt to create new app and delete old app, delete will most likely fail',
        )
      }

      return await replace()
    }
  }

  AlgoKitConfig.getLogger(appParams.suppressLog).debug('No detected changes in app, nothing to do.')

  return existingApp
}

/** Returns true is there is a breaking change in the application state schema from before to after.
 *  i.e. if the schema becomes larger, since applications can't ask for more schema after creation.
 *  Otherwise, there is no error, the app just doesn't store data in the extra schema :(
 *
 * @param before The existing schema
 * @param after The new schema
 * @returns Whether or not there is a breaking change
 */
export function schemaIsBroken(before: ApplicationStateSchema, after: ApplicationStateSchema) {
  return before['num-byte-slice'] < after['num-byte-slice'] || before['num-uint'] < after['num-uint']
}

/**
 * Returns a lookup of name => app metadata (id, address, ...metadata) for all apps created by the given account that have an @see {AppDeployNote} in the transaction note of the creation transaction.
 *
 * **Note:** It's recommended this is only called once and then stored since it's a somewhat expensive operation (multiple indexer calls).
 *
 * @param indexer An indexer client
 * @param creatorAccount The account (with private key loaded) or string address of an account that is the creator of the apps you want to search for
 * @returns A name-based lookup of the app information (id, address)
 */
export async function getCreatorAppsByName(indexer: Indexer, creatorAccount: SendTransactionFrom | string): Promise<AppLookup> {
  const appLookup: Record<string, AppMetadata> = {}

  const creatorAddress = typeof creatorAccount !== 'string' ? getSenderAddress(creatorAccount) : creatorAccount

  // Extract all apps that account created
  const createdApps = (await lookupAccountCreatedApplicationByAddress(indexer, creatorAddress)).map((a) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { id: a.id, createdAtRound: a['created-at-round']!, deleted: a.deleted }
  })

  // For each app that account created (in parallel)...
  await Promise.all(
    createdApps.map(async (createdApp) => {
      // Find any app transactions for that app in the round it was created (should always just be a single creation transaction)
      const appTransactions = await searchTransactions(indexer, (s) =>
        s
          .minRound(createdApp.createdAtRound)
          .txType(TransactionType.appl)
          .applicationID(createdApp.id)
          .address(creatorAddress)
          .addressRole('sender')
          .notePrefix(Buffer.from(APP_DEPLOY_NOTE_PREFIX).toString('base64')),
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
        return

      const parseNote = (note?: string) => {
        if (!note) {
          // No note; ignoring...
          return
        }

        const decoder = new TextDecoder()
        const noteAsBase64 = decoder.decode(Buffer.from(note))
        const noteAsString = Buffer.from(noteAsBase64, 'base64').toString('utf-8')

        if (!noteAsString.startsWith(`${APP_DEPLOY_NOTE_PREFIX}{`))
          // Clearly not APP_DEPLOY JSON; ignoring...
          return

        return JSON.parse(noteAsString.substring(APP_DEPLOY_NOTE_PREFIX.length)) as AppDeployMetadata
      }

      try {
        const creationNote = parseNote(appCreationTransaction.note)
        const updateNote = parseNote(latestAppUpdateTransaction.note)
        if (creationNote?.name) {
          appLookup[creationNote.name] = {
            appIndex: createdApp.id,
            appAddress: getApplicationAddress(createdApp.id),
            createdMetadata: creationNote,
            createdRound: Number(appCreationTransaction['confirmed-round']),
            ...(updateNote ?? creationNote),
            updatedRound: Number(latestAppUpdateTransaction?.['confirmed-round']),
            deleted: createdApp.deleted ?? false,
          }
        }
      } catch (e) {
        AlgoKitConfig.logger.warn(
          `Received error trying to retrieve app with ${createdApp.id} for creator ${creatorAddress}; failing silently`,
          e,
        )
        return
      }
    }),
  )

  return {
    creator: creatorAddress,
    apps: appLookup,
  }
}

/**
 * Return the transaction note for an app deployment.
 * @param metadata The metadata of the deployment
 * @returns The transaction note as a utf-8 string
 */
export function getAppDeploymentTransactionNote(metadata: AppDeployMetadata) {
  return `${APP_DEPLOY_NOTE_PREFIX}${JSON.stringify(metadata)}`
}

/**
 * Replaces deploy-time deployment control parameters within the given teal code.
 *
 * @see {UPDATABLE_TEMPLATE_NAME}
 * @see {DELETABLE_TEMPLATE_NAME}
 *
 * @param tealCode The TEAL code to substitute
 * @param params The deploy-time deployment control parameter value to replace
 * @returns The replaced TEAL code
 */
export function replaceDeployTimeControlParams(tealCode: string, params: { updatable: boolean; deletable: boolean }) {
  return tealCode
    .replace(UPDATABLE_TEMPLATE_NAME, (params.updatable ? 1 : 0).toString())
    .replace(DELETABLE_TEMPLATE_NAME, (params.deletable ? 1 : 0).toString())
}

/**
 * Performs template substitution of a teal file and compiles it, returning the compiled result and optionally caching on the file system.
 *
 * Looks for `TMPL_{parameter}` for template replacements.
 *
 * @param tealCode The TEAL logic to compile
 * @param algod An algod client
 * @param templateParameters Any parameters to replace in the .teal file before compiling
 * @param deploymentMetadata The deployment metadata the app will be deployed with
 * @returns The information about the compiled code
 */
export async function performTemplateSubstitutionAndCompile(
  tealCode: string,
  algod: Algodv2,
  templateParameters?: TealTemplateParameters,
  deploymentMetadata?: AppDeployMetadata,
): Promise<CompiledTeal> {
  if (templateParameters !== undefined) {
    for (const key in templateParameters) {
      const value = templateParameters[key]
      const token = `TMPL_${key}`
      // todo: handle uint8array
      tealCode = tealCode.replace(
        new RegExp(token, 'g'),
        typeof value === 'string'
          ? `0x${Buffer.from(value, 'utf-8').toString('hex')}`
          : ArrayBuffer.isView(value)
          ? `0x${Buffer.from(value).toString('hex')}`
          : value.toString(),
      )
    }
  }

  if (deploymentMetadata) {
    tealCode = replaceDeployTimeControlParams(tealCode, deploymentMetadata)
  }

  const compiled = await algod.compile(tealCode).do()
  return {
    teal: tealCode,
    compiled: compiled.result,
    compiledHash: compiled.hash,
    compiledBase64ToBytes: new Uint8Array(Buffer.from(compiled.result, 'base64')),
  }
}
