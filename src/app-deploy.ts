import { AlgodClient, ApplicationStateSchema } from '@algorandfoundation/algokit-algod-client'
import { OnApplicationComplete } from '@algorandfoundation/algokit-transact'
import * as algosdk from '@algorandfoundation/sdk'
import { Address, Indexer } from '@algorandfoundation/sdk'
import { compileTeal, getAppOnCompleteAction } from './app'
import { _getAppArgsForABICall, _getBoxReference } from './transaction/legacy-bridge'
import { getSenderAddress, getSenderTransactionSigner } from './transaction/transaction'
import { AlgorandClientTransactionSender } from './types/algorand-client-transaction-sender'
import {
  ABIReturn,
  APP_DEPLOY_NOTE_DAPP,
  AppCompilationResult,
  AppDeployMetadata,
  AppDeploymentParams,
  AppLookup,
  AppMetadata,
  CompiledTeal,
  TealTemplateParams,
} from './types/app'
import { AppDeployer } from './types/app-deployer'
import { AppManager, BoxReference } from './types/app-manager'
import { AssetManager } from './types/asset-manager'
import {
  AppCreateMethodCall,
  AppCreateParams,
  AppDeleteMethodCall,
  AppDeleteParams,
  AppUpdateMethodCall,
  AppUpdateParams,
  TransactionComposer,
} from './types/composer'
import { Arc2TransactionNote, ConfirmedTransactionResult, ConfirmedTransactionResults, SendTransactionFrom } from './types/transaction'

/**
 * @deprecated Use `algorand.appDeployer.deploy` instead.
 *
 * Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.
 *
 * To understand the architecture decisions behind this functionality please see https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md
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
  algod: AlgodClient,
  indexer?: Indexer,
): Promise<
  Partial<AppCompilationResult> &
    (
      | (ConfirmedTransactionResults & AppMetadata & { return?: ABIReturn; operationPerformed: 'create' | 'update' })
      | (ConfirmedTransactionResults &
          AppMetadata & {
            return?: ABIReturn
            deleteReturn?: ABIReturn
            deleteResult: ConfirmedTransactionResult
            operationPerformed: 'replace'
          })
      | (AppMetadata & { operationPerformed: 'nothing' })
    )
> {
  const appManager = new AppManager(algod)
  const newGroup = () =>
    new TransactionComposer({
      algod,
      getSigner: () => getSenderTransactionSigner(deployment.from),
      getSuggestedParams: async () => (deployment.transactionParams ? { ...deployment.transactionParams } : await algod.suggestedParams()),
      appManager,
    })
  const deployer = new AppDeployer(
    appManager,
    new AlgorandClientTransactionSender(newGroup, new AssetManager(algod, newGroup), appManager),
    indexer,
  )

  const createParams = {
    approvalProgram: deployment.approvalProgram,
    clearStateProgram: deployment.clearStateProgram,
    sender: getSenderAddress(deployment.from),
    accountReferences: deployment.createArgs?.accounts?.map((a) => (typeof a === 'string' ? a : algosdk.encodeAddress(a.publicKey))),
    appReferences: deployment.createArgs?.apps?.map((a) => BigInt(a)),
    assetReferences: deployment.createArgs?.assets?.map((a) => BigInt(a)),
    boxReferences: deployment.createArgs?.boxes
      ?.map(_getBoxReference)
      ?.map((r) => ({ appId: BigInt(r.appId), name: r.name }) satisfies BoxReference),
    lease: deployment.createArgs?.lease,
    rekeyTo: deployment.createArgs?.rekeyTo ? getSenderAddress(deployment.createArgs?.rekeyTo) : undefined,
    staticFee: deployment.fee,
    maxFee: deployment.maxFee,
    extraProgramPages: deployment.schema.extraPages,
    onComplete: getAppOnCompleteAction(deployment.createOnCompleteAction) as Exclude<
      OnApplicationComplete,
      OnApplicationComplete.ClearState
    >,
    schema: deployment.schema,
  } satisfies Partial<AppCreateParams>

  const updateParams = {
    approvalProgram: deployment.approvalProgram,
    clearStateProgram: deployment.clearStateProgram,
    sender: getSenderAddress(deployment.from),
    accountReferences: deployment.updateArgs?.accounts?.map((a) => (typeof a === 'string' ? a : algosdk.encodeAddress(a.publicKey))),
    appReferences: deployment.updateArgs?.apps?.map((a) => BigInt(a)),
    assetReferences: deployment.updateArgs?.assets?.map((a) => BigInt(a)),
    boxReferences: deployment.updateArgs?.boxes
      ?.map(_getBoxReference)
      ?.map((r) => ({ appId: BigInt(r.appId), name: r.name }) satisfies BoxReference),
    lease: deployment.updateArgs?.lease,
    rekeyTo: deployment.updateArgs?.rekeyTo ? getSenderAddress(deployment.updateArgs?.rekeyTo) : undefined,
    staticFee: deployment.fee,
    maxFee: deployment.maxFee,
    onComplete: OnApplicationComplete.UpdateApplication,
  } satisfies Partial<AppUpdateParams>

  const deleteParams = {
    sender: getSenderAddress(deployment.from),
    accountReferences: deployment.deleteArgs?.accounts?.map((a) => (typeof a === 'string' ? a : algosdk.encodeAddress(a.publicKey))),
    appReferences: deployment.deleteArgs?.apps?.map((a) => BigInt(a)),
    assetReferences: deployment.deleteArgs?.assets?.map((a) => BigInt(a)),
    boxReferences: deployment.deleteArgs?.boxes
      ?.map(_getBoxReference)
      ?.map((r) => ({ appId: BigInt(r.appId), name: r.name }) satisfies BoxReference),
    lease: deployment.deleteArgs?.lease,
    rekeyTo: deployment.deleteArgs?.rekeyTo ? getSenderAddress(deployment.deleteArgs?.rekeyTo) : undefined,
    staticFee: deployment.fee,
    maxFee: deployment.maxFee,
    onComplete: OnApplicationComplete.DeleteApplication,
  } satisfies Partial<AppDeleteParams>

  const encoder = new TextEncoder()

  const result = await deployer.deploy({
    createParams: deployment.createArgs?.method
      ? ({
          ...createParams,
          method:
            'txnCount' in deployment.createArgs.method ? deployment.createArgs.method : new algosdk.ABIMethod(deployment.createArgs.method),
          args: (await _getAppArgsForABICall(deployment.createArgs, deployment.from)).methodArgs,
        } satisfies AppCreateMethodCall)
      : ({
          ...createParams,
          args:
            'appArgs' in (deployment?.createArgs ?? {})
              ? deployment.createArgs?.appArgs?.map((a) => (typeof a === 'string' ? encoder.encode(a) : a))
              : undefined,
        } satisfies AppCreateParams),
    updateParams: deployment.updateArgs?.method
      ? ({
          ...updateParams,
          method:
            'txnCount' in deployment.updateArgs.method ? deployment.updateArgs.method : new algosdk.ABIMethod(deployment.updateArgs.method),
          args: (await _getAppArgsForABICall(deployment.updateArgs, deployment.from)).methodArgs,
        } satisfies Omit<AppUpdateMethodCall, 'appId'>)
      : ({
          ...updateParams,
          args:
            'appArgs' in (deployment?.updateArgs ?? {})
              ? deployment.updateArgs?.appArgs?.map((a) => (typeof a === 'string' ? encoder.encode(a) : a))
              : undefined,
        } satisfies Omit<AppUpdateParams, 'appId'>),
    deleteParams: deployment.deleteArgs?.method
      ? ({
          ...deleteParams,
          method:
            'txnCount' in deployment.deleteArgs.method ? deployment.deleteArgs.method : new algosdk.ABIMethod(deployment.deleteArgs.method),
          args: (await _getAppArgsForABICall(deployment.deleteArgs, deployment.from)).methodArgs,
        } satisfies Omit<AppDeleteMethodCall, 'appId'>)
      : ({
          ...deleteParams,
          args:
            'appArgs' in (deployment?.deleteArgs ?? {})
              ? deployment.deleteArgs?.appArgs?.map((a) => (typeof a === 'string' ? encoder.encode(a) : a))
              : undefined,
        } satisfies Omit<AppDeleteParams, 'appId'>),
    metadata: deployment.metadata,
    deployTimeParams: deployment.deployTimeParams,
    onSchemaBreak: deployment.onSchemaBreak,
    onUpdate: deployment.onUpdate,
    existingDeployments: deployment.existingDeployments
      ? {
          creator: Address.fromString(deployment.existingDeployments.creator),
          apps: Object.fromEntries(
            Object.entries(deployment.existingDeployments.apps).map(([name, app]) => [
              name,
              {
                ...app,
                appAddress: Address.fromString(app.appAddress),
                appId: BigInt(app.appId),
                createdRound: BigInt(app.createdRound),
                updatedRound: BigInt(app.updatedRound),
              },
            ]),
          ),
        }
      : undefined,
    maxRoundsToWaitForConfirmation: deployment.maxRoundsToWaitForConfirmation,
    populateAppCallResources: deployment.populateAppCallResources,
    suppressLog: deployment.suppressLog,
  })

  return {
    ...result,
    appAddress: result.appAddress.toString(),
    appId: Number(result.appId),
    createdRound: Number(result.createdRound),
    updatedRound: Number(result.updatedRound),
  }
}

/**
 * @deprecated Use `before.numByteSlice < after.numByteSlice || before.numUint < after.numUint` instead.
 *
 * Returns true is there is a breaking change in the application state schema from before to after.
 *  i.e. if the schema becomes larger, since applications can't ask for more schema after creation.
 *  Otherwise, there is no error, the app just doesn't store data in the extra schema :(
 *
 * @param before The existing schema
 * @param after The new schema
 * @returns Whether or not there is a breaking change
 */
export function isSchemaIsBroken(before: ApplicationStateSchema, after: ApplicationStateSchema) {
  return before.numByteSlice < after.numByteSlice || before.numUint < after.numUint
}

/**
 * @deprecated Use `algorand.appDeployer.getCreatorAppsByName` instead.
 *
 * Returns a lookup of name => app metadata (id, address, ...metadata) for all apps created by the given account that have an `AppDeployNote` in the transaction note of the creation transaction.
 *
 * **Note:** It's recommended this is only called once and then stored since it's a somewhat expensive operation (multiple indexer calls).
 *
 * @param creatorAccount The account (with private key loaded) or string address of an account that is the creator of the apps you want to search for
 * @param indexer An indexer client
 * @returns A name-based lookup of the app information (id, address)
 */
export async function getCreatorAppsByName(creatorAccount: SendTransactionFrom | string, indexer: Indexer): Promise<AppLookup> {
  const lookup = await new AppDeployer(undefined!, undefined!, indexer).getCreatorAppsByName(getSenderAddress(creatorAccount))

  return {
    creator: lookup.creator.toString(),
    apps: Object.fromEntries(
      Object.entries(lookup.apps).map(([name, app]) => [
        name,
        {
          ...app,
          appAddress: app.appAddress.toString(),
          appId: Number(app.appId),
          createdRound: Number(app.createdRound),
          updatedRound: Number(app.updatedRound),
        },
      ]),
    ),
  }
}

/**
 * @deprecated Use `{ dAppName: APP_DEPLOY_NOTE_DAPP, data: metadata, format: 'j' }` instead.
 *
 * Return the transaction note for an app deployment.
 * @param metadata The metadata of the deployment
 * @returns The transaction note as a utf-8 string
 */
export function getAppDeploymentTransactionNote(metadata: AppDeployMetadata): Arc2TransactionNote {
  return {
    dAppName: APP_DEPLOY_NOTE_DAPP,
    data: metadata,
    format: 'j',
  }
}

/**
 * @deprecated Use `AppManager.replaceTealTemplateDeployTimeControlParams` instead
 *
 * Replaces deploy-time deployment control parameters within the given teal code.
 *
 * * `TMPL_UPDATABLE` for updatability / immutability control
 * * `TMPL_DELETABLE` for deletability / permanence control
 *
 * Note: If these values are not undefined, but the corresponding `TMPL_*` value
 *  isn't in the teal code it will throw an exception.
 *
 * @param tealCode The TEAL code to substitute
 * @param params The deploy-time deployment control parameter value to replace
 * @returns The replaced TEAL code
 */
export function replaceDeployTimeControlParams(tealCode: string, params: { updatable?: boolean; deletable?: boolean }) {
  return AppManager.replaceTealTemplateDeployTimeControlParams(tealCode, params)
}

/**
 * @deprecated Use `AppManager.replaceTealTemplateParams` instead
 *
 * Performs template substitution of a teal file.
 *
 * Looks for `TMPL_{parameter}` for template replacements.
 *
 * @param tealCode The TEAL logic to compile
 * @param templateParams Any parameters to replace in the .teal file before compiling
 * @returns The TEAL code with replacements
 */
export function performTemplateSubstitution(tealCode: string, templateParams?: TealTemplateParams) {
  return AppManager.replaceTealTemplateParams(tealCode, templateParams)
}

/**
 * @deprecated Use `algorand.appManager.compileTealTemplate` instead.
 *
 * Performs template substitution of a teal file and compiles it, returning the compiled result.
 *
 * Looks for `TMPL_{parameter}` for template replacements.
 *
 * @param tealCode The TEAL logic to compile
 * @param algod An algod client
 * @param templateParams Any parameters to replace in the .teal file before compiling
 * @param deploymentMetadata The deployment metadata the app will be deployed with
 * @returns The information about the compiled code
 */
export async function performTemplateSubstitutionAndCompile(
  tealCode: string,
  algod: AlgodClient,
  templateParams?: TealTemplateParams,
  deploymentMetadata?: AppDeployMetadata,
): Promise<CompiledTeal> {
  tealCode = stripTealComments(tealCode)

  tealCode = performTemplateSubstitution(tealCode, templateParams)

  if (deploymentMetadata) {
    tealCode = replaceDeployTimeControlParams(tealCode, deploymentMetadata)
  }

  return await compileTeal(tealCode, algod)
}

/**
 * @deprecated Use `AppManager.stripTealComments` instead.
 *
 * Remove comments from TEAL Code
 *
 * @param tealCode The TEAL logic to compile
 * @returns The TEAL without comments
 */
export function stripTealComments(tealCode: string) {
  return AppManager.stripTealComments(tealCode)
}
