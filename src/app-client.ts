import { Algodv2 } from 'algosdk'
import { AppSpecAppDetails, AppSpecAppDetailsByCreatorAndName, AppSpecAppDetailsById, ApplicationClient } from './types/app-client'

/**
 * Create a new ApplicationClient instance
 * @param appDetails The details of the app
 * @param algod An algod instance
 *
 * @example Resolve by creator and name
 * const client = algokit.getAppClient(
 *     {
 *       resolveBy: 'creatorAndName',
 *       app: {appSpec},
 *       sender: {account},
 *       creatorAddress: {creator},
 *       findExistingUsing: indexerClient,
 *     },
 *     algodClient,
 *   )
 *
 * @example Resolve by id:
 * const client = algokit.getAppClient(
 *     {
 *       resolveBy: 'id',
 *       app: {appSpec},
 *       sender: {account},
 *       id: {id},
 *     },
 *    algodClient,
 * )
 *
 * @returns The application client
 */
export function getAppClient(appDetails: AppSpecAppDetails, algod: Algodv2) {
  return new ApplicationClient(appDetails, algod)
}

/**
 * Create a new ApplicationClient instance by id
 * @param appDetails The details of the app
 * @param algod An algod instance
 *
 * @example
 * const client = algokit.getAppClientById(
 *     {
 *       app: {appSpec},
 *       sender: {account},
 *       id: {id},
 *     },
 *     algodClient,
 *   )
 *
 * @returns The application client
 */
export function getAppClientById(appDetails: AppSpecAppDetailsById, algod: Algodv2) {
  return new ApplicationClient({ ...appDetails, resolveBy: 'id' }, algod)
}

/**
 * Create a new ApplicationClient instance by creator and name
 * @param appDetails The details of the app by creator and name
 * @param algod An algod instance
 *
 * @example
 * const client = algokit.getAppClientByCreatorAndName(
 *     {
 *       app: {appSpec},
 *       sender: {account},
 *       creatorAddress: {account.addr},
 *       findExistingUsing: {indexerClient},
 *     },
 *     algodClient,
 *   )
 *
 * @returns The application client
 */
export function getAppClientByCreatorAndName(appDetails: AppSpecAppDetailsByCreatorAndName, algod: Algodv2) {
  return new ApplicationClient({ ...appDetails, resolveBy: 'creatorAndName' }, algod)
}
