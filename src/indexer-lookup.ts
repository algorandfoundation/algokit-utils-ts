import algosdk, { Address } from 'algosdk'
import { LookupAssetHoldingsOptions } from './types/indexer'
import Indexer = algosdk.Indexer
export type SearchForTransactions = ReturnType<Indexer['searchForTransactions']>

const DEFAULT_INDEXER_MAX_API_RESOURCES_PER_ACCOUNT = 1000 //MaxAPIResourcesPerAccount: This is the default maximum, though may be provider specific

/**
 * @deprecated Use `indexer.lookupTransactionByID(transactionId).do()`.
 * Looks up a transaction by ID using Indexer.
 * @param transactionId The ID of the transaction to look up
 * @param indexer An indexer client
 * @returns The result of the look-up
 */
export async function lookupTransactionById(transactionId: string, indexer: Indexer) {
  return await indexer.lookupTransactionByID(transactionId).do()
}

/**
 * @deprecated Use `indexer.lookupAccountByID(accountAddress).do()`.
 * Looks up an account by address using Indexer.
 * @param accountAddress The address of the account to look up
 * @param indexer An indexer client
 * @returns The result of the look-up
 */
export async function lookupAccountByAddress(accountAddress: string | Address, indexer: Indexer) {
  return await indexer.lookupAccountByID(accountAddress).do()
}

/**
 * Looks up applications that were created by the given address; will automatically paginate through all data.
 * @param indexer An indexer instance
 * @param address The address of the creator to look up
 * @param getAll Whether or not to include deleted applications
 * @param paginationLimit The number of records to return per paginated request, default 1000
 * @returns The list of application results
 */
export async function lookupAccountCreatedApplicationByAddress(
  indexer: Indexer,
  address: string | Address,
  getAll: boolean | undefined = undefined,
  paginationLimit?: number,
): Promise<algosdk.indexerModels.Application[]> {
  return await executePaginatedRequest(
    (response: algosdk.indexerModels.ApplicationsResponse | { message: string }) => {
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
 * Looks up asset holdings for the given asset; will automatically paginate through all data.
 * @param indexer An indexer instance
 * @param assetId The ID of the asset to look up holdings for
 * @param options Optional options to control the lookup
 * @param paginationLimit The number of records to return per paginated request, default 1000
 * @returns The list of application results
 */
export async function lookupAssetHoldings(
  indexer: Indexer,
  assetId: number | bigint,
  options?: LookupAssetHoldingsOptions,
  paginationLimit?: number,
): Promise<algosdk.indexerModels.MiniAssetHolding[]> {
  return await executePaginatedRequest(
    (response: algosdk.indexerModels.AssetBalancesResponse | { message: string }) => {
      if ('message' in response) {
        throw { status: 404, ...response }
      }
      return response.balances
    },
    (nextToken) => {
      let s = indexer.lookupAssetBalances(Number(assetId)).limit(paginationLimit ?? DEFAULT_INDEXER_MAX_API_RESOURCES_PER_ACCOUNT)
      if (options?.currencyGreaterThan !== undefined) {
        s = s.currencyGreaterThan(options.currencyGreaterThan)
      }
      if (options?.currencyLessThan !== undefined) {
        s = s.currencyLessThan(options.currencyLessThan)
      }
      if (options?.includeAll !== undefined) {
        s = s.includeAll(options.includeAll)
      }
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
): Promise<algosdk.indexerModels.TransactionsResponse> {
  let currentRound = 0n
  const transactions = await executePaginatedRequest(
    (response: algosdk.indexerModels.TransactionsResponse | { message: string }) => {
      if ('message' in response) {
        throw { status: 404, ...response }
      }
      if (response.currentRound > currentRound) {
        currentRound = response.currentRound
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

  return new algosdk.indexerModels.TransactionsResponse({
    currentRound,
    nextToken: undefined,
    transactions: transactions,
  })
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
  while (true) {
    const request = buildRequest(nextToken)
    const response = await request.do()
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
