import algosdk from 'algosdk'
import type SearchForTransactions from 'algosdk/dist/types/client/v2/indexer/searchForTransactions'
import {
  AccountLookupResult,
  ApplicationCreatedLookupResult,
  ApplicationResult,
  TransactionLookupResult,
  TransactionSearchResults,
} from './types/indexer'
import Indexer = algosdk.Indexer

const DEFAULT_INDEXER_MAX_API_RESOURCES_PER_ACCOUNT = 1000 //MaxAPIResourcesPerAccount: This is the default maximum, though may be provider specific

/**
 * Looks up a transaction by ID using Indexer.
 * @param transactionId The ID of the transaction to look up
 * @param indexer An indexer client
 * @returns The result of the look-up
 */
export async function lookupTransactionById(transactionId: string, indexer: Indexer): Promise<TransactionLookupResult> {
  return (await indexer.lookupTransactionByID(transactionId).do()) as TransactionLookupResult
}

/**
 * Looks up an account by address using Indexer.
 * @param transactionId The address of the account to look up
 * @param indexer An indexer client
 * @returns The result of the look-up
 */
export async function lookupAccountByAddress(accountAddress: string, indexer: Indexer): Promise<AccountLookupResult> {
  return (await indexer.lookupAccountByID(accountAddress).do()) as AccountLookupResult
}

/**
 * Looks up applications that were created by the given address.
 * @param indexer An indexer instance
 * @param address The address of the creator to look up
 * @param getAll Whether or not to include deleted applications
 * @param paginationLimit The number of records to return per paginated request, default 1000
 * @returns The list of application results
 */
export async function lookupAccountCreatedApplicationByAddress(
  indexer: Indexer,
  address: string,
  getAll: boolean | undefined = undefined,
  paginationLimit?: number,
): Promise<ApplicationResult[]> {
  return await executePaginatedRequest(
    (response: ApplicationCreatedLookupResult | { message: string }) => {
      if ('message' in response) {
        throw { status: 404, ...response }
      }
      return response.applications
    },
    (nextToken) => {
      let s = indexer
        .lookupAccountCreatedApplications(address)
        .includeAll(getAll)
        .limit(paginationLimit ?? DEFAULT_INDEXER_MAX_API_RESOURCES_PER_ACCOUNT)
      if (nextToken) {
        s = s.nextToken(nextToken)
      }
      return s
    },
  )
}

/**
 * Allows transactions to be searched for the given criteria.
 * @param indexer An indexer client
 * @param searchCriteria The criteria to search for
 * @param paginationLimit The number of records to return per paginated request, default 1000
 * @returns The search results
 */
export async function searchTransactions(
  indexer: Indexer,
  searchCriteria: (s: SearchForTransactions) => SearchForTransactions,
  paginationLimit?: number,
): Promise<TransactionSearchResults> {
  let currentRound = 0
  const transactions = await executePaginatedRequest(
    (response: TransactionSearchResults | { message: string }) => {
      if ('message' in response) {
        throw { status: 404, ...response }
      }
      if (response['current-round'] > currentRound) {
        currentRound = response['current-round']
      }
      return response.transactions
    },
    (nextToken) => {
      let s = searchCriteria(indexer.searchForTransactions()).limit(paginationLimit ?? DEFAULT_INDEXER_MAX_API_RESOURCES_PER_ACCOUNT)
      if (nextToken) {
        s = s.nextToken(nextToken)
      }
      return s
    },
  )

  return {
    'current-round': currentRound,
    'next-token': '',
    transactions: transactions,
  }
}

// https://developer.algorand.org/docs/get-details/indexer/#paginated-results
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function executePaginatedRequest<TResult, TRequest extends { do: () => Promise<any> }>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extractItems: (response: any) => TResult[],
  buildRequest: (nextToken?: string) => TRequest,
): Promise<TResult[]> {
  const results = []

  let nextToken: string | undefined = undefined
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const request = buildRequest(nextToken)
    const response = await request.do()
    const items = extractItems(response)
    if (items == null || items.length === 0) {
      break
    }
    results.push(...items)
    nextToken = response['next-token']
    if (!nextToken) {
      break
    }
  }

  return results
}
