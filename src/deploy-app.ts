import { Algodv2, getApplicationAddress, Indexer, TransactionType } from 'algosdk'
import { Config } from './'
import { callApp, createApp, getAppByIndex, updateApp } from './app'
import { lookupAccountCreatedApplicationByAddress, searchTransactions } from './indexer-lookup'
import { getSenderAddress, sendGroupOfTransactions } from './transaction'
import { ApplicationStateSchema } from './types/algod'
import {
  AppDeploymentParams,
  AppDeployMetadata,
  AppLookup,
  AppMetadata,
  APP_DEPLOY_NOTE_DAPP,
  CompiledTeal,
  DELETABLE_TEMPLATE_NAME,
  OnSchemaBreak,
  OnUpdate,
  TealTemplateParameters,
  UPDATABLE_TEMPLATE_NAME,
} from './types/app'
import { ConfirmedTransactionResult, SendTransactionFrom } from './types/transaction'

/**
 * Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.
 *
 * To understand the architecture decisions behind this functionality please @see https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md
 *
 * **Note:** When using the return from this function be sure to check `operationPerformed` to get access to various return properties like `transaction`, `confirmation` and `deleteResult`.
 *
 * **Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.
 *
 * **Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.
 * @param deployment The arguments to control the app deployment
 * @param algod An algod client
 * @param indexer An indexer client, needed if `existingDeployments` not passed in
 * @returns The app reference of the new/existing app
 */
export async function deployApp(
  deployment: AppDeploymentParams,
  algod: Algodv2,
  indexer?: Indexer,
): Promise<
  | (ConfirmedTransactionResult & AppMetadata & { operationPerformed: 'create' | 'update' })
  | (ConfirmedTransactionResult & AppMetadata & { deleteResult: ConfirmedTransactionResult; operationPerformed: 'replace' })
  | (AppMetadata & { operationPerformed: 'nothing' })
> {
  const { metadata, deployTimeParameters, onSchemaBreak, onUpdate, existingDeployments, createArgs, updateArgs, deleteArgs, ...appParams } =
    deployment

  if (existingDeployments && existingDeployments.creator !== getSenderAddress(appParams.from)) {
    throw new Error(
      `Received invalid existingDeployments value for creator ${existingDeployments.creator} when attempting to deploy for creator ${appParams.from}`,
    )
  }
  if (!existingDeployments && !indexer) {
    throw new Error(`Didn't receive an indexer client, but also didn't receive an existingDeployments cache - one of them must be provided`)
  }

  Config.getLogger(appParams.suppressLog).info(
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

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const apps = existingDeployments ?? (await getCreatorAppsByName(appParams.from, indexer!))

  const create = async (skipSending?: boolean): Promise<ConfirmedTransactionResult & AppMetadata & { operationPerformed: 'create' }> => {
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      confirmation: result.confirmation!,
      appId: result.appId,
      appAddress: result.appAddress,
      createdMetadata: metadata,
      createdRound: Number(result.confirmation?.['confirmed-round']),
      updatedRound: Number(result.confirmation?.['confirmed-round']),
      ...metadata,
      deleted: false,
      operationPerformed: 'create',
    }
  }

  const existingApp = apps.apps[metadata.name]

  if (!existingApp || existingApp.deleted) {
    Config.getLogger(appParams.suppressLog).info(
      `App ${metadata.name} not found in apps created by ${getSenderAddress(appParams.from)}; deploying app with version ${
        metadata.version
      }.`,
    )

    return await create()
  }

  Config.getLogger(appParams.suppressLog).info(
    `Existing app ${metadata.name} found by creator ${getSenderAddress(appParams.from)}, with app id ${existingApp.appId} and version ${
      existingApp.version
    }.`,
  )

  const existingAppRecord = await getAppByIndex(existingApp.appId, algod)
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
  const isSchemaBreak = isSchemaIsBroken(existingGlobalSchema, newGlobalSchema) || isSchemaIsBroken(existingLocalSchema, newLocalSchema)

  const replace = async (): Promise<
    ConfirmedTransactionResult & AppMetadata & { deleteResult: ConfirmedTransactionResult; operationPerformed: 'replace' }
  > => {
    // Create

    Config.getLogger(appParams.suppressLog).info(
      `Deploying a new ${metadata.name} app for ${getSenderAddress(appParams.from)}; deploying app with version ${metadata.version}.`,
    )

    const { transaction: createTransaction } = await create(true)

    // Delete

    Config.getLogger(appParams.suppressLog).warn(
      `Deleting existing ${metadata.name} app with id ${existingApp.appId} from ${getSenderAddress(appParams.from)} account.`,
    )

    const { transaction: deleteTransaction } = await callApp(
      {
        appId: existingApp.appId,
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

    Config.getLogger(appParams.suppressLog).warn(
      `Sent transactions ${createTransaction.txID()} to create app with id ${newAppIndex} and ${deleteTransaction.txID()} to delete app with id ${
        existingApp.appId
      } from ${getSenderAddress(appParams.from)} account.`,
    )

    return {
      transaction: createTransaction,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      confirmation: createConfirmation!,
      appId: newAppIndex,
      appAddress: getApplicationAddress(newAppIndex),
      createdMetadata: metadata,
      createdRound: Number(createConfirmation['confirmed-round']),
      updatedRound: Number(createConfirmation['confirmed-round']),
      ...metadata,
      deleted: false,
      deleteResult: { transaction: deleteTransaction, confirmation: deleteConfirmation },
      operationPerformed: 'replace',
    } as ConfirmedTransactionResult & AppMetadata & { deleteResult: ConfirmedTransactionResult; operationPerformed: 'replace' }
  }

  const update = async (): Promise<ConfirmedTransactionResult & AppMetadata & { operationPerformed: 'update' }> => {
    Config.getLogger(appParams.suppressLog).info(
      `Updating existing ${metadata.name} app for ${getSenderAddress(appParams.from)} to version ${metadata.version}.`,
    )

    const result = await updateApp(
      {
        appId: existingApp.appId,
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      confirmation: result.confirmation!,
      appId: existingApp.appId,
      appAddress: existingApp.appAddress,
      createdMetadata: existingApp.createdMetadata,
      createdRound: existingApp.createdRound,
      updatedRound: Number(result.confirmation?.['confirmed-round']),
      ...metadata,
      deleted: false,
      operationPerformed: 'update',
    }
  }

  if (isSchemaBreak) {
    Config.getLogger(appParams.suppressLog).warn(`Detected a breaking app schema change in app ${existingApp.appId}:`, {
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
      Config.getLogger(appParams.suppressLog).info(
        'App is deletable and onSchemaBreak=ReplaceApp, will attempt to create new app and delete old app',
      )
    } else {
      Config.getLogger(appParams.suppressLog).info(
        'App is not deletable but onSchemaBreak=ReplaceApp, will attempt to delete app, delete will most likely fail',
      )
    }

    return await replace()
  }

  if (isUpdate) {
    Config.getLogger(appParams.suppressLog).info(
      `Detected a TEAL update in app ${existingApp.appId} for creator ${getSenderAddress(appParams.from)}`,
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
        Config.getLogger(appParams.suppressLog).info(`App is updatable and onUpdate=UpdateApp, updating app...`)
      } else {
        Config.getLogger(appParams.suppressLog).warn(
          `App is not updatable but onUpdate=UpdateApp, will attempt to update app, update will most likely fail`,
        )
      }

      return await update()
    }

    if (onUpdate === 'replace' || onUpdate === OnUpdate.ReplaceApp) {
      if (existingApp.deletable) {
        Config.getLogger(appParams.suppressLog).warn('App is deletable and onUpdate=ReplaceApp, creating new app and deleting old app...')
      } else {
        Config.getLogger(appParams.suppressLog).warn(
          'App is not deletable and onUpdate=ReplaceApp, will attempt to create new app and delete old app, delete will most likely fail',
        )
      }

      return await replace()
    }
  }

  Config.getLogger(appParams.suppressLog).debug('No detected changes in app, nothing to do.')

  return { ...existingApp, operationPerformed: 'nothing' }
}

/** Returns true is there is a breaking change in the application state schema from before to after.
 *  i.e. if the schema becomes larger, since applications can't ask for more schema after creation.
 *  Otherwise, there is no error, the app just doesn't store data in the extra schema :(
 *
 * @param before The existing schema
 * @param after The new schema
 * @returns Whether or not there is a breaking change
 */
export function isSchemaIsBroken(before: ApplicationStateSchema, after: ApplicationStateSchema) {
  return before['num-byte-slice'] < after['num-byte-slice'] || before['num-uint'] < after['num-uint']
}

/**
 * Returns a lookup of name => app metadata (id, address, ...metadata) for all apps created by the given account that have an @see {AppDeployNote} in the transaction note of the creation transaction.
 *
 * **Note:** It's recommended this is only called once and then stored since it's a somewhat expensive operation (multiple indexer calls).
 *
 * @param creatorAccount The account (with private key loaded) or string address of an account that is the creator of the apps you want to search for
 * @param indexer An indexer client
 * @returns A name-based lookup of the app information (id, address)
 */
export async function getCreatorAppsByName(creatorAccount: SendTransactionFrom | string, indexer: Indexer): Promise<AppLookup> {
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
        return

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
            appAddress: getApplicationAddress(createdApp.id),
            createdMetadata: creationNote,
            createdRound: Number(appCreationTransaction['confirmed-round']),
            ...(updateNote ?? creationNote),
            updatedRound: Number(latestAppUpdateTransaction?.['confirmed-round']),
            deleted: createdApp.deleted ?? false,
          }
        }
      } catch (e) {
        Config.logger.warn(`Received error trying to retrieve app with ${createdApp.id} for creator ${creatorAddress}; failing silently`, e)
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
  return {
    dAppName: APP_DEPLOY_NOTE_DAPP,
    data: metadata,
    format: 'j',
  }
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
export function replaceDeployTimeControlParams(tealCode: string, params: { updatable?: boolean; deletable?: boolean }) {
  if (params.updatable !== undefined) {
    if (!tealCode.includes(UPDATABLE_TEMPLATE_NAME)) {
      throw new Error(
        `Deploy-time updatability control requested for app deployment, but ${UPDATABLE_TEMPLATE_NAME} not present in TEAL code`,
      )
    }
    tealCode = tealCode.replace(new RegExp(UPDATABLE_TEMPLATE_NAME, 'g'), (params.updatable ? 1 : 0).toString())
  }

  if (params.deletable !== undefined) {
    if (!tealCode.includes(DELETABLE_TEMPLATE_NAME)) {
      throw new Error(
        `Deploy-time deletability control requested for app deployment, but ${DELETABLE_TEMPLATE_NAME} not present in TEAL code`,
      )
    }
    tealCode = tealCode.replace(new RegExp(DELETABLE_TEMPLATE_NAME, 'g'), (params.deletable ? 1 : 0).toString())
  }

  return tealCode
}

/**
 * Performs template substitution of a teal file.
 *
 * Looks for `TMPL_{parameter}` for template replacements.
 *
 * @param tealCode The TEAL logic to compile
 * @param templateParameters Any parameters to replace in the .teal file before compiling
 * @returns The TEAL code with replacements
 */
export function performTemplateSubstitution(tealCode: string, templateParameters?: TealTemplateParameters) {
  if (templateParameters !== undefined) {
    for (const key in templateParameters) {
      const value = templateParameters[key]
      const token = `TMPL_${key.replace(/^TMPL_/, '')}`
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

  return tealCode
}

/**
 * Performs template substitution of a teal file and compiles it, returning the compiled result.
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
  tealCode = performTemplateSubstitution(tealCode, templateParameters)

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
