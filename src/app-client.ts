import algosdk from 'algosdk'
import { AppSpecAppDetails, AppSpecAppDetailsByCreatorAndName, AppSpecAppDetailsById, ApplicationClient } from './types/app-client'
import Algodv2 = algosdk.Algodv2

/**
 * @deprecated Use `AppClient` instead e.g. via `algorand.client.getAppClientById` or
 * `algorand.client.getAppClientByCreatorAndName`.
 * If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
 * which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.
 *
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
 * @deprecated Use `AppClient` instead e.g. via `algorand.client.getAppClientById`.
 * If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
 * which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.
 *
 *
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
 * @deprecated Use `AppClient` instead e.g. via `algorand.client.getAppClientByCreatorAndName`.
 * If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
 * which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.
 *
 *
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
