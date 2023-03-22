import { Algodv2 } from 'algosdk'
import { ApplicationClient, AppSpecAppDetails } from './types/application-client'

/**
 * Create a new ApplicationClient instance
 * @param appDetails The details of the app
 * @param algod An algod instance
 * @returns The application client
 */
export function getApplicationClient(appDetails: AppSpecAppDetails, algod: Algodv2) {
  return new ApplicationClient(appDetails, algod)
}
