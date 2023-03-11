import { getApplicationAddress, Indexer, TransactionType } from 'algosdk'
import { AppReference, AppStorageSchema } from './app'
import { AlgoKitConfig } from './config'
import { lookupAccountCreatedApplicationByAddress, searchTransactions } from './indexer-lookup'
import { getSenderAddress, SendTransactionFrom } from './transaction'

export const UPDATABLE_TEMPLATE_NAME = 'TMPL_UPDATABLE'
export const DELETABLE_TEMPLATE_NAME = 'TMPL_DELETABLE'
export const APP_DEPLOY_NOTE_PREFIX = 'APP_DEPLOY:'

/**
 * The payload of the metadata to add to the transaction note when deploying an app, noting it will be prefixed with @see {APP_DEPLOY_NOTE_PREFIX}.
 */
export interface AppDeployMetadata {
  name: string
  version: string
  deletable: boolean
  updatable: boolean
}

/** The metadata that can be collected about a deployed app */
export interface AppMetadata extends AppReference, AppDeployMetadata {
  createdRound: number
  updatedRound: number
  createdMetadata: AppDeployMetadata
  deleted: boolean
}

/** A lookup of name -> Algorand app */
export interface AppLookup {
  [name: string]: AppMetadata
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
  const appLookup: AppLookup = {}

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

  return appLookup
}

export function replaceDeployTimeControlParameters(tealCode: string, parameters: { updatable: boolean; deletable: boolean }) {
  return tealCode
    .replace(UPDATABLE_TEMPLATE_NAME, (parameters.updatable ? 1 : 0).toString())
    .replace(DELETABLE_TEMPLATE_NAME, (parameters.deletable ? 1 : 0).toString())
}

export function getStorageSchemaFromAppSpec(appSpec: any): AppStorageSchema {
  return {
    globalByteSlices: appSpec.state.global.num_byte_slices,
    globalInts: appSpec.state.global.num_uints,
    localByteSlices: appSpec.state.local.num_byte_slices,
    localInts: appSpec.state.local.num_byte_slices,
  }
}
