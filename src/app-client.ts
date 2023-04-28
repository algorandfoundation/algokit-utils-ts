import { Algodv2 } from 'algosdk'
import { ApplicationClient, AppSpecAppDetails } from './types/app-client'

/**
 * @deprecated Use `algokit.getAppClient`
 */
export const getApplicationClient = getAppClient

/**
 * Create a new ApplicationClient instance
 * @param appDetails The details of the app
 * @param algod An algod instance
 * @returns The application client
 */
export function getAppClient(appDetails: AppSpecAppDetails, algod: Algodv2) {
  return new ApplicationClient(appDetails, algod)
}
