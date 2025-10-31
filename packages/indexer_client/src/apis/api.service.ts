import type { BaseHttpRequest, ApiRequestOptions } from '../core/base-http-request'
import { AlgorandSerializer } from '../core/model-runtime'
import type { BodyFormat } from '../core/model-runtime'
import type {
  Block,
  Box,
  HealthCheck,
  LookupAccountAppLocalStates,
  LookupAccountAssets,
  LookupAccountById,
  LookupAccountCreatedApplications,
  LookupAccountCreatedAssets,
  LookupAccountTransactions,
  LookupApplicationById,
  LookupApplicationLogsById,
  LookupAssetBalances,
  LookupAssetById,
  LookupAssetTransactions,
  LookupTransaction,
  SearchForAccounts,
  SearchForApplicationBoxes,
  SearchForApplications,
  SearchForAssets,
  SearchForBlockHeaders,
  SearchForTransactions,
} from '../models/index'
import {
  BlockMeta,
  BoxMeta,
  HealthCheckMeta,
  LookupAccountAppLocalStatesMeta,
  LookupAccountAssetsMeta,
  LookupAccountByIdMeta,
  LookupAccountCreatedApplicationsMeta,
  LookupAccountCreatedAssetsMeta,
  LookupAccountTransactionsMeta,
  LookupApplicationByIdMeta,
  LookupApplicationLogsByIdMeta,
  LookupAssetBalancesMeta,
  LookupAssetByIdMeta,
  LookupAssetTransactionsMeta,
  LookupTransactionMeta,
  SearchForAccountsMeta,
  SearchForApplicationBoxesMeta,
  SearchForApplicationsMeta,
  SearchForAssetsMeta,
  SearchForBlockHeadersMeta,
  SearchForTransactionsMeta,
} from '../models/index'

export class IndexerApi {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  private static acceptFor(format: BodyFormat): string {
    return format === 'json' ? 'application/json' : 'application/msgpack'
  }

  private static mediaFor(format: BodyFormat): string {
    return format === 'json' ? 'application/json' : 'application/msgpack'
  }

  /**
   * Lookup an account's asset holdings, optionally for a specific ID.
   */
  async lookupAccountAppLocalStates(
    accountId: string,
    params?: { applicationId?: number | bigint; includeAll?: boolean; limit?: number | bigint; next?: string },
    requestOptions?: ApiRequestOptions,
  ): Promise<LookupAccountAppLocalStates> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/accounts/{account-id}/apps-local-state',
      path: { 'account-id': accountId },
      query: {
        'application-id': typeof params?.applicationId === 'bigint' ? (params!.applicationId as bigint).toString() : params?.applicationId,
        'include-all': params?.includeAll,
        limit: typeof params?.limit === 'bigint' ? (params!.limit as bigint).toString() : params?.limit,
        next: params?.next,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = LookupAccountAppLocalStatesMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LookupAccountAppLocalStates
  }

  /**
   * Lookup an account's asset holdings, optionally for a specific ID.
   */
  async lookupAccountAssets(
    accountId: string,
    params?: { assetId?: number | bigint; includeAll?: boolean; limit?: number | bigint; next?: string },
    requestOptions?: ApiRequestOptions,
  ): Promise<LookupAccountAssets> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/accounts/{account-id}/assets',
      path: { 'account-id': accountId },
      query: {
        'asset-id': typeof params?.assetId === 'bigint' ? (params!.assetId as bigint).toString() : params?.assetId,
        'include-all': params?.includeAll,
        limit: typeof params?.limit === 'bigint' ? (params!.limit as bigint).toString() : params?.limit,
        next: params?.next,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = LookupAccountAssetsMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LookupAccountAssets
  }

  /**
   * Lookup account information.
   */
  async lookupAccountById(
    accountId: string,
    params?: {
      round?: number | bigint
      includeAll?: boolean
      exclude?: 'all' | 'assets' | 'created-assets' | 'apps-local-state' | 'created-apps' | 'none'[]
    },
    requestOptions?: ApiRequestOptions,
  ): Promise<LookupAccountById> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/accounts/{account-id}',
      path: { 'account-id': accountId },
      query: {
        round: typeof params?.round === 'bigint' ? (params!.round as bigint).toString() : params?.round,
        'include-all': params?.includeAll,
        exclude: params?.exclude,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = LookupAccountByIdMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LookupAccountById
  }

  /**
   * Lookup an account's created application parameters, optionally for a specific ID.
   */
  async lookupAccountCreatedApplications(
    accountId: string,
    params?: { applicationId?: number | bigint; includeAll?: boolean; limit?: number | bigint; next?: string },
    requestOptions?: ApiRequestOptions,
  ): Promise<LookupAccountCreatedApplications> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/accounts/{account-id}/created-applications',
      path: { 'account-id': accountId },
      query: {
        'application-id': typeof params?.applicationId === 'bigint' ? (params!.applicationId as bigint).toString() : params?.applicationId,
        'include-all': params?.includeAll,
        limit: typeof params?.limit === 'bigint' ? (params!.limit as bigint).toString() : params?.limit,
        next: params?.next,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = LookupAccountCreatedApplicationsMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LookupAccountCreatedApplications
  }

  /**
   * Lookup an account's created asset parameters, optionally for a specific ID.
   */
  async lookupAccountCreatedAssets(
    accountId: string,
    params?: { assetId?: number | bigint; includeAll?: boolean; limit?: number | bigint; next?: string },
    requestOptions?: ApiRequestOptions,
  ): Promise<LookupAccountCreatedAssets> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/accounts/{account-id}/created-assets',
      path: { 'account-id': accountId },
      query: {
        'asset-id': typeof params?.assetId === 'bigint' ? (params!.assetId as bigint).toString() : params?.assetId,
        'include-all': params?.includeAll,
        limit: typeof params?.limit === 'bigint' ? (params!.limit as bigint).toString() : params?.limit,
        next: params?.next,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = LookupAccountCreatedAssetsMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LookupAccountCreatedAssets
  }

  /**
   * Lookup account transactions. Transactions are returned newest to oldest.
   */
  async lookupAccountTransactions(
    accountId: string,
    params?: {
      limit?: number | bigint
      next?: string
      notePrefix?: string
      txType?: 'pay' | 'keyreg' | 'acfg' | 'axfer' | 'afrz' | 'appl' | 'stpf' | 'hb'
      sigType?: 'sig' | 'msig' | 'lsig'
      txid?: string
      round?: number | bigint
      minRound?: number | bigint
      maxRound?: number | bigint
      assetId?: number | bigint
      beforeTime?: string
      afterTime?: string
      currencyGreaterThan?: number | bigint
      currencyLessThan?: number | bigint
      rekeyTo?: boolean
    },
    requestOptions?: ApiRequestOptions,
  ): Promise<LookupAccountTransactions> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/accounts/{account-id}/transactions',
      path: { 'account-id': accountId },
      query: {
        limit: typeof params?.limit === 'bigint' ? (params!.limit as bigint).toString() : params?.limit,
        next: params?.next,
        'note-prefix': params?.notePrefix,
        'tx-type': params?.txType,
        'sig-type': params?.sigType,
        txid: params?.txid,
        round: typeof params?.round === 'bigint' ? (params!.round as bigint).toString() : params?.round,
        'min-round': typeof params?.minRound === 'bigint' ? (params!.minRound as bigint).toString() : params?.minRound,
        'max-round': typeof params?.maxRound === 'bigint' ? (params!.maxRound as bigint).toString() : params?.maxRound,
        'asset-id': typeof params?.assetId === 'bigint' ? (params!.assetId as bigint).toString() : params?.assetId,
        'before-time': params?.beforeTime,
        'after-time': params?.afterTime,
        'currency-greater-than':
          typeof params?.currencyGreaterThan === 'bigint'
            ? (params!.currencyGreaterThan as bigint).toString()
            : params?.currencyGreaterThan,
        'currency-less-than':
          typeof params?.currencyLessThan === 'bigint' ? (params!.currencyLessThan as bigint).toString() : params?.currencyLessThan,
        'rekey-to': params?.rekeyTo,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = LookupAccountTransactionsMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LookupAccountTransactions
  }

  /**
   * Given an application ID and box name, returns base64 encoded box name and value. Box names must be in the goal app call arg form 'encoding:value'. For ints, use the form 'int:1234'. For raw bytes, encode base 64 and use 'b64' prefix as in 'b64:A=='. For printable strings, use the form 'str:hello'. For addresses, use the form 'addr:XYZ...'.
   */
  async lookupApplicationBoxByIdAndName(
    applicationId: number | bigint,
    params?: { name: string },
    requestOptions?: ApiRequestOptions,
  ): Promise<Box> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/applications/{application-id}/box',
      path: { 'application-id': typeof applicationId === 'bigint' ? applicationId.toString() : applicationId },
      query: { name: params?.name },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = BoxMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as Box
  }

  /**
   * Lookup application.
   */
  async lookupApplicationById(
    applicationId: number | bigint,
    params?: { includeAll?: boolean },
    requestOptions?: ApiRequestOptions,
  ): Promise<LookupApplicationById> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/applications/{application-id}',
      path: { 'application-id': typeof applicationId === 'bigint' ? applicationId.toString() : applicationId },
      query: { 'include-all': params?.includeAll },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = LookupApplicationByIdMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LookupApplicationById
  }

  /**
   * Lookup application logs.
   */
  async lookupApplicationLogsById(
    applicationId: number | bigint,
    params?: {
      limit?: number | bigint
      next?: string
      txid?: string
      minRound?: number | bigint
      maxRound?: number | bigint
      senderAddress?: string
    },
    requestOptions?: ApiRequestOptions,
  ): Promise<LookupApplicationLogsById> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/applications/{application-id}/logs',
      path: { 'application-id': typeof applicationId === 'bigint' ? applicationId.toString() : applicationId },
      query: {
        limit: typeof params?.limit === 'bigint' ? (params!.limit as bigint).toString() : params?.limit,
        next: params?.next,
        txid: params?.txid,
        'min-round': typeof params?.minRound === 'bigint' ? (params!.minRound as bigint).toString() : params?.minRound,
        'max-round': typeof params?.maxRound === 'bigint' ? (params!.maxRound as bigint).toString() : params?.maxRound,
        'sender-address': params?.senderAddress,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = LookupApplicationLogsByIdMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LookupApplicationLogsById
  }

  /**
   * Lookup the list of accounts who hold this asset
   */
  async lookupAssetBalances(
    assetId: number | bigint,
    params?: {
      includeAll?: boolean
      limit?: number | bigint
      next?: string
      currencyGreaterThan?: number | bigint
      currencyLessThan?: number | bigint
    },
    requestOptions?: ApiRequestOptions,
  ): Promise<LookupAssetBalances> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/assets/{asset-id}/balances',
      path: { 'asset-id': typeof assetId === 'bigint' ? assetId.toString() : assetId },
      query: {
        'include-all': params?.includeAll,
        limit: typeof params?.limit === 'bigint' ? (params!.limit as bigint).toString() : params?.limit,
        next: params?.next,
        'currency-greater-than':
          typeof params?.currencyGreaterThan === 'bigint'
            ? (params!.currencyGreaterThan as bigint).toString()
            : params?.currencyGreaterThan,
        'currency-less-than':
          typeof params?.currencyLessThan === 'bigint' ? (params!.currencyLessThan as bigint).toString() : params?.currencyLessThan,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = LookupAssetBalancesMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LookupAssetBalances
  }

  /**
   * Lookup asset information.
   */
  async lookupAssetById(
    assetId: number | bigint,
    params?: { includeAll?: boolean },
    requestOptions?: ApiRequestOptions,
  ): Promise<LookupAssetById> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/assets/{asset-id}',
      path: { 'asset-id': typeof assetId === 'bigint' ? assetId.toString() : assetId },
      query: { 'include-all': params?.includeAll },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = LookupAssetByIdMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LookupAssetById
  }

  /**
   * Lookup transactions for an asset. Transactions are returned oldest to newest.
   */
  async lookupAssetTransactions(
    assetId: number | bigint,
    params?: {
      limit?: number | bigint
      next?: string
      notePrefix?: string
      txType?: 'pay' | 'keyreg' | 'acfg' | 'axfer' | 'afrz' | 'appl' | 'stpf' | 'hb'
      sigType?: 'sig' | 'msig' | 'lsig'
      txid?: string
      round?: number | bigint
      minRound?: number | bigint
      maxRound?: number | bigint
      beforeTime?: string
      afterTime?: string
      currencyGreaterThan?: number | bigint
      currencyLessThan?: number | bigint
      address?: string
      addressRole?: 'sender' | 'receiver' | 'freeze-target'
      excludeCloseTo?: boolean
      rekeyTo?: boolean
    },
    requestOptions?: ApiRequestOptions,
  ): Promise<LookupAssetTransactions> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/assets/{asset-id}/transactions',
      path: { 'asset-id': typeof assetId === 'bigint' ? assetId.toString() : assetId },
      query: {
        limit: typeof params?.limit === 'bigint' ? (params!.limit as bigint).toString() : params?.limit,
        next: params?.next,
        'note-prefix': params?.notePrefix,
        'tx-type': params?.txType,
        'sig-type': params?.sigType,
        txid: params?.txid,
        round: typeof params?.round === 'bigint' ? (params!.round as bigint).toString() : params?.round,
        'min-round': typeof params?.minRound === 'bigint' ? (params!.minRound as bigint).toString() : params?.minRound,
        'max-round': typeof params?.maxRound === 'bigint' ? (params!.maxRound as bigint).toString() : params?.maxRound,
        'before-time': params?.beforeTime,
        'after-time': params?.afterTime,
        'currency-greater-than':
          typeof params?.currencyGreaterThan === 'bigint'
            ? (params!.currencyGreaterThan as bigint).toString()
            : params?.currencyGreaterThan,
        'currency-less-than':
          typeof params?.currencyLessThan === 'bigint' ? (params!.currencyLessThan as bigint).toString() : params?.currencyLessThan,
        address: params?.address,
        'address-role': params?.addressRole,
        'exclude-close-to': params?.excludeCloseTo,
        'rekey-to': params?.rekeyTo,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = LookupAssetTransactionsMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LookupAssetTransactions
  }

  /**
   * Lookup block.
   */
  async lookupBlock(roundNumber: number | bigint, params?: { headerOnly?: boolean }, requestOptions?: ApiRequestOptions): Promise<Block> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/blocks/{round-number}',
      path: { 'round-number': typeof roundNumber === 'bigint' ? roundNumber.toString() : roundNumber },
      query: { 'header-only': params?.headerOnly },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = BlockMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as Block
  }

  /**
   * Lookup a single transaction.
   */
  async lookupTransaction(txid: string, requestOptions?: ApiRequestOptions): Promise<LookupTransaction> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/transactions/{txid}',
      path: { txid: txid },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = LookupTransactionMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LookupTransaction
  }

  async makeHealthCheck(requestOptions?: ApiRequestOptions): Promise<HealthCheck> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/health',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = HealthCheckMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as HealthCheck
  }

  /**
   * Search for accounts.
   */
  async searchForAccounts(
    params?: {
      assetId?: number | bigint
      limit?: number | bigint
      next?: string
      currencyGreaterThan?: number | bigint
      includeAll?: boolean
      exclude?: 'all' | 'assets' | 'created-assets' | 'apps-local-state' | 'created-apps' | 'none'[]
      currencyLessThan?: number | bigint
      authAddr?: string
      round?: number | bigint
      applicationId?: number | bigint
      onlineOnly?: boolean
    },
    requestOptions?: ApiRequestOptions,
  ): Promise<SearchForAccounts> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/accounts',
      path: {},
      query: {
        'asset-id': typeof params?.assetId === 'bigint' ? (params!.assetId as bigint).toString() : params?.assetId,
        limit: typeof params?.limit === 'bigint' ? (params!.limit as bigint).toString() : params?.limit,
        next: params?.next,
        'currency-greater-than':
          typeof params?.currencyGreaterThan === 'bigint'
            ? (params!.currencyGreaterThan as bigint).toString()
            : params?.currencyGreaterThan,
        'include-all': params?.includeAll,
        exclude: params?.exclude,
        'currency-less-than':
          typeof params?.currencyLessThan === 'bigint' ? (params!.currencyLessThan as bigint).toString() : params?.currencyLessThan,
        'auth-addr': params?.authAddr,
        round: typeof params?.round === 'bigint' ? (params!.round as bigint).toString() : params?.round,
        'application-id': typeof params?.applicationId === 'bigint' ? (params!.applicationId as bigint).toString() : params?.applicationId,
        'online-only': params?.onlineOnly,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = SearchForAccountsMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as SearchForAccounts
  }

  /**
   * Given an application ID, returns the box names of that application sorted lexicographically.
   */
  async searchForApplicationBoxes(
    applicationId: number | bigint,
    params?: { limit?: number | bigint; next?: string },
    requestOptions?: ApiRequestOptions,
  ): Promise<SearchForApplicationBoxes> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/applications/{application-id}/boxes',
      path: { 'application-id': typeof applicationId === 'bigint' ? applicationId.toString() : applicationId },
      query: { limit: typeof params?.limit === 'bigint' ? (params!.limit as bigint).toString() : params?.limit, next: params?.next },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = SearchForApplicationBoxesMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as SearchForApplicationBoxes
  }

  /**
   * Search for applications
   */
  async searchForApplications(
    params?: { applicationId?: number | bigint; creator?: string; includeAll?: boolean; limit?: number | bigint; next?: string },
    requestOptions?: ApiRequestOptions,
  ): Promise<SearchForApplications> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/applications',
      path: {},
      query: {
        'application-id': typeof params?.applicationId === 'bigint' ? (params!.applicationId as bigint).toString() : params?.applicationId,
        creator: params?.creator,
        'include-all': params?.includeAll,
        limit: typeof params?.limit === 'bigint' ? (params!.limit as bigint).toString() : params?.limit,
        next: params?.next,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = SearchForApplicationsMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as SearchForApplications
  }

  /**
   * Search for assets.
   */
  async searchForAssets(
    params?: {
      includeAll?: boolean
      limit?: number | bigint
      next?: string
      creator?: string
      name?: string
      unit?: string
      assetId?: number | bigint
    },
    requestOptions?: ApiRequestOptions,
  ): Promise<SearchForAssets> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/assets',
      path: {},
      query: {
        'include-all': params?.includeAll,
        limit: typeof params?.limit === 'bigint' ? (params!.limit as bigint).toString() : params?.limit,
        next: params?.next,
        creator: params?.creator,
        name: params?.name,
        unit: params?.unit,
        'asset-id': typeof params?.assetId === 'bigint' ? (params!.assetId as bigint).toString() : params?.assetId,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = SearchForAssetsMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as SearchForAssets
  }

  /**
   * Search for block headers. Block headers are returned in ascending round order. Transactions are not included in the output.
   */
  async searchForBlockHeaders(
    params?: {
      limit?: number | bigint
      next?: string
      minRound?: number | bigint
      maxRound?: number | bigint
      beforeTime?: string
      afterTime?: string
      proposers?: string[]
      expired?: string[]
      absent?: string[]
    },
    requestOptions?: ApiRequestOptions,
  ): Promise<SearchForBlockHeaders> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/block-headers',
      path: {},
      query: {
        limit: typeof params?.limit === 'bigint' ? (params!.limit as bigint).toString() : params?.limit,
        next: params?.next,
        'min-round': typeof params?.minRound === 'bigint' ? (params!.minRound as bigint).toString() : params?.minRound,
        'max-round': typeof params?.maxRound === 'bigint' ? (params!.maxRound as bigint).toString() : params?.maxRound,
        'before-time': params?.beforeTime,
        'after-time': params?.afterTime,
        proposers: params?.proposers,
        expired: params?.expired,
        absent: params?.absent,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = SearchForBlockHeadersMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as SearchForBlockHeaders
  }

  /**
   * Search for transactions. Transactions are returned oldest to newest unless the address parameter is used, in which case results are returned newest to oldest.
   */
  async searchForTransactions(
    params?: {
      limit?: number | bigint
      next?: string
      notePrefix?: string
      txType?: 'pay' | 'keyreg' | 'acfg' | 'axfer' | 'afrz' | 'appl' | 'stpf' | 'hb'
      sigType?: 'sig' | 'msig' | 'lsig'
      groupId?: string
      txid?: string
      round?: number | bigint
      minRound?: number | bigint
      maxRound?: number | bigint
      assetId?: number | bigint
      beforeTime?: string
      afterTime?: string
      currencyGreaterThan?: number | bigint
      currencyLessThan?: number | bigint
      address?: string
      addressRole?: 'sender' | 'receiver' | 'freeze-target'
      excludeCloseTo?: boolean
      rekeyTo?: boolean
      applicationId?: number | bigint
    },
    requestOptions?: ApiRequestOptions,
  ): Promise<SearchForTransactions> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = IndexerApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/transactions',
      path: {},
      query: {
        limit: typeof params?.limit === 'bigint' ? (params!.limit as bigint).toString() : params?.limit,
        next: params?.next,
        'note-prefix': params?.notePrefix,
        'tx-type': params?.txType,
        'sig-type': params?.sigType,
        'group-id': params?.groupId,
        txid: params?.txid,
        round: typeof params?.round === 'bigint' ? (params!.round as bigint).toString() : params?.round,
        'min-round': typeof params?.minRound === 'bigint' ? (params!.minRound as bigint).toString() : params?.minRound,
        'max-round': typeof params?.maxRound === 'bigint' ? (params!.maxRound as bigint).toString() : params?.maxRound,
        'asset-id': typeof params?.assetId === 'bigint' ? (params!.assetId as bigint).toString() : params?.assetId,
        'before-time': params?.beforeTime,
        'after-time': params?.afterTime,
        'currency-greater-than':
          typeof params?.currencyGreaterThan === 'bigint'
            ? (params!.currencyGreaterThan as bigint).toString()
            : params?.currencyGreaterThan,
        'currency-less-than':
          typeof params?.currencyLessThan === 'bigint' ? (params!.currencyLessThan as bigint).toString() : params?.currencyLessThan,
        address: params?.address,
        'address-role': params?.addressRole,
        'exclude-close-to': params?.excludeCloseTo,
        'rekey-to': params?.rekeyTo,
        'application-id': typeof params?.applicationId === 'bigint' ? (params!.applicationId as bigint).toString() : params?.applicationId,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = SearchForTransactionsMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as SearchForTransactions
  }
}
