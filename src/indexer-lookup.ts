import { Address } from '@algorandfoundation/algokit-common'
import {
  Application,
  ApplicationsResponse,
  AssetBalancesResponse,
  IndexerClient,
  MiniAssetHolding,
  TransactionsResponse,
} from '@algorandfoundation/algokit-indexer-client'
import { LookupAssetHoldingsOptions } from './types/indexer'
export type SearchForTransactionsCriteria = Omit<NonNullable<Parameters<IndexerClient['searchForTransactions']>[0]>, 'limit' | 'next'>

const DEFAULT_INDEXER_MAX_API_RESOURCES_PER_ACCOUNT = 1000 //MaxAPIResourcesPerAccount: This is the default maximum, though may be provider specific

/**
 * Looks up applications that were created by the given address; will automatically paginate through all data.
 * @param indexer An indexer instance
 * @param address The address of the creator to look up
 * @param getAll Whether or not to include deleted applications. Default true.
 * @param paginationLimit The number of records to return per paginated request, default 1000
 * @returns The list of application results
 */
export async function lookupAccountCreatedApplicationByAddress(
  indexer: IndexerClient,
  address: string | Address,
  getAll: boolean = true,
  paginationLimit?: number,
): Promise<Application[]> {
  return await executePaginatedRequest(
    (response: ApplicationsResponse | { message: string }) => {
      if ('message' in response) {
        throw { status: 404, ...response }
      }
      return response.applications
    },
    (nextToken) => {
      return indexer.lookupAccountCreatedApplications(address, {
        includeAll: getAll,
        limit: paginationLimit ?? DEFAULT_INDEXER_MAX_API_RESOURCES_PER_ACCOUNT,
        ...(nextToken && { next: nextToken }),
      })
    },
  )
}

/**
 * Looks up asset holdings for the given asset; will automatically paginate through all data.
 * @param indexer An indexer instance
 * @param assetId The ID of the asset to look up holdings for
 * @param options Optional options to control the lookup
 * @param paginationLimit The number of records to return per paginated request, default 1000
 * @returns The list of application results
 */
export async function lookupAssetHoldings(
  indexer: IndexerClient,
  assetId: number | bigint,
  options?: LookupAssetHoldingsOptions,
  paginationLimit?: number,
): Promise<MiniAssetHolding[]> {
  return await executePaginatedRequest(
    (response: AssetBalancesResponse | { message: string }) => {
      if ('message' in response) {
        throw { status: 404, ...response }
      }
      return response.balances
    },
    (nextToken) => {
      return indexer.lookupAssetBalances(assetId, {
        limit: paginationLimit ?? DEFAULT_INDEXER_MAX_API_RESOURCES_PER_ACCOUNT,
        ...(options?.currencyGreaterThan !== undefined && { currencyGreaterThan: options.currencyGreaterThan }),
        ...(options?.currencyLessThan !== undefined && { currencyLessThan: options.currencyLessThan }),
        ...(options?.includeAll !== undefined && { includeAll: options.includeAll }),
        ...(nextToken && { next: nextToken }),
      })
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
  indexer: IndexerClient,
  searchCriteria: SearchForTransactionsCriteria,
  paginationLimit?: number,
): Promise<TransactionsResponse> {
  let currentRound = 0n
  const transactions = await executePaginatedRequest(
    (response: TransactionsResponse | { message: string }) => {
      if ('message' in response) {
        throw { status: 404, ...response }
      }
      if (response.currentRound > currentRound) {
        currentRound = response.currentRound
      }
      return response.transactions
    },
    (nextToken) => {
      return indexer.searchForTransactions({
        ...searchCriteria,
        limit: paginationLimit ?? DEFAULT_INDEXER_MAX_API_RESOURCES_PER_ACCOUNT,
        next: nextToken,
      })
    },
  )

  return {
    currentRound,
    nextToken: undefined,
    transactions,
  } satisfies TransactionsResponse
}

// https://dev.algorand.co/reference/rest-apis/indexer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function executePaginatedRequest<TResult, TRequest extends Promise<any>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extractItems: (response: any) => TResult[],
  buildRequest: (nextToken?: string) => TRequest,
): Promise<TResult[]> {
  const results = []

  let nextToken: string | undefined = undefined
  while (true) {
    const request = buildRequest(nextToken)
    const response = await request
    const items = extractItems(response)
    if (items == null || items.length === 0) {
      break
    }
    results.push(...items)
    nextToken = response['nextToken']
    if (!nextToken) {
      break
    }
  }

  return results
}
