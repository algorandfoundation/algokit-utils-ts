import { Algodv2, Indexer, SuggestedParams } from 'algosdk'
import { AppLookup, TealTemplateParams } from './types/app'
import { AppSpecAppDetails, ApplicationClient } from './types/app-client'
import { AppSpec } from './types/app-spec'
import { SendTransactionFrom } from './types/transaction'

/**
 * Create a new ApplicationClient instance
 * @param appDetails The details of the app
 * @param algod An algod instance
 * @returns The application client
 */
export function getAppClient(appDetails: AppSpecAppDetails, algod: Algodv2) {
  return new ApplicationClient(appDetails, algod)
}

/**
 * Create a new ApplicationClient instance by id
 * @param app The ARC-0032 application spec as either:
 *  * Parsed JSON `AppSpec`
 *  * Raw JSON string
 * @param id The id of an existing app to call using this client, or 0 if the app hasn't been created yet
 * @param algod An algod instance
 * @param sender Default sender to use for transactions issued by this application client
 * @param params Default suggested params object to use
 * @param deployTimeParams Optionally provide any deploy-time parameters to replace in the TEAL code; if specified here will get used in calls to `deploy`, `create` and `update` unless overridden in those calls
 * @param name The optional name to use to mark the app when deploying `ApplicationClient.deploy` (default: uses the name in the ABI contract)
 *
 * @returns The application client
 */
export function getAppClientById(
  app: AppSpec | string,
  id: number | bigint,
  algod: Algodv2,
  sender?: SendTransactionFrom,
  params?: SuggestedParams,
  deployTimeParams?: TealTemplateParams,
  name?: string,
) {
  const appDetails: AppSpecAppDetails = { app, sender, params, deployTimeParams, resolveBy: 'id', id, name }
  return new ApplicationClient(appDetails, algod)
}

/**
 * Create a new ApplicationClient instance by creator and name
 * @param app The ARC-0032 application spec as either:
 *  * Parsed JSON `AppSpec`
 *  * Raw JSON string
 * @param creatorAddress The address of the app creator account to resolve the app by
 * @param findExistingUsing The mechanism to find an existing app instance metadata for the given creator and name; either:
 * An indexer instance to search the creator account apps; or
 *  * The cached value of the existing apps for the given creator from `getCreatorAppsByName`
 * @param algod An algod instance
 * @param sender Default sender to use for transactions issued by this application client
 * @param params Default suggested params object to use
 * @param deployTimeParams Optionally provide any deploy-time parameters to replace in the TEAL code; if specified here will get used in calls to `deploy`, `create` and `update` unless overridden in those calls
 * @param name The optional name override to resolve the app by within the creator account (default: uses the name in the ABI contract)
 *
 * @returns The application client
 */
export function getAppClientByCreatorAndName(
  app: AppSpec | string,
  creatorAddress: string,
  findExistingUsing: Indexer | AppLookup,
  algod: Algodv2,
  sender?: SendTransactionFrom,
  params?: SuggestedParams,
  deployTimeParams?: TealTemplateParams,
  name?: string,
) {
  const appDetails: AppSpecAppDetails = {
    app,
    sender,
    params,
    deployTimeParams,
    resolveBy: 'creatorAndName',
    creatorAddress,
    name,
    findExistingUsing,
  }
  return new ApplicationClient(appDetails, algod)
}
