import { Algodv2, Indexer } from 'algosdk'
import { ApplicationClient, AppSpecAppDetails } from './types/application-client'

/**
 * Create a new ApplicationClient instance
 * @param appDetails The details of the app
 * @param algod An algod instance
 * @param indexer An indexer instance
 * @returns The application client
 */
export function getApplicationClient(appDetails: AppSpecAppDetails, algod: Algodv2, indexer: Indexer) {
  return new ApplicationClient(appDetails, algod, indexer)
}
