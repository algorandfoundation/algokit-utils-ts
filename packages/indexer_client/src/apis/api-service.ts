import type { BaseHttpRequest } from '../core/base-http-request'
import { decodeJson } from '../core/model-runtime'
import { ReadableAddress, type EncodingFormat } from '@algorandfoundation/algokit-common'
import type {
  AccountResponse,
  AccountsResponse,
  ApplicationLocalStatesResponse,
  ApplicationLogsResponse,
  ApplicationResponse,
  ApplicationsResponse,
  AssetBalancesResponse,
  AssetHoldingsResponse,
  AssetResponse,
  AssetsResponse,
  Block,
  BlockHeadersResponse,
  Box,
  BoxesResponse,
  HealthCheck,
  TransactionResponse,
  TransactionsResponse,
} from '../models/index'
import {
  AccountResponseMeta,
  AccountsResponseMeta,
  ApplicationLocalStatesResponseMeta,
  ApplicationLogsResponseMeta,
  ApplicationResponseMeta,
  ApplicationsResponseMeta,
  AssetBalancesResponseMeta,
  AssetHoldingsResponseMeta,
  AssetResponseMeta,
  AssetsResponseMeta,
  BlockMeta,
  BlockHeadersResponseMeta,
  BoxMeta,
  BoxesResponseMeta,
  HealthCheckMeta,
  TransactionResponseMeta,
  TransactionsResponseMeta,
} from '../models/model-meta'

export class IndexerApi {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  private mimeTypeFor(format: EncodingFormat | 'text'): string {
    return format === 'json' ? 'application/json' : format === 'msgpack' ? 'application/msgpack' : 'text/plain'
  }

  /**
   * Lookup an account's asset holdings, optionally for a specific ID.
   */
  async lookupAccountAppLocalStates(
    account: ReadableAddress,
    params?: { applicationId?: number | bigint; includeAll?: boolean; limit?: number; next?: string },
  ): Promise<ApplicationLocalStatesResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/accounts/{account-id}/apps-local-state',
      path: { 'account-id': account },
      query: { 'application-id': params?.applicationId, 'include-all': params?.includeAll, limit: params?.limit, next: params?.next },
      headers,
      body: undefined,
    })

    return decodeJson(payload, ApplicationLocalStatesResponseMeta)
  }

  /**
   * Lookup an account's asset holdings, optionally for a specific ID.
   */
  async lookupAccountAssets(
    account: ReadableAddress,
    params?: { assetId?: number | bigint; includeAll?: boolean; limit?: number; next?: string },
  ): Promise<AssetHoldingsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/accounts/{account-id}/assets',
      path: { 'account-id': account },
      query: { 'asset-id': params?.assetId, 'include-all': params?.includeAll, limit: params?.limit, next: params?.next },
      headers,
      body: undefined,
    })

    return decodeJson(payload, AssetHoldingsResponseMeta)
  }

  /**
   * Lookup account information.
   */
  async lookupAccountById(
    account: ReadableAddress,
    params?: {
      round?: number | bigint
      includeAll?: boolean
      exclude?: 'all' | 'assets' | 'created-assets' | 'apps-local-state' | 'created-apps' | 'none'[]
    },
  ): Promise<AccountResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/accounts/{account-id}',
      path: { 'account-id': account },
      query: { round: params?.round, 'include-all': params?.includeAll, exclude: params?.exclude },
      headers,
      body: undefined,
    })

    return decodeJson(payload, AccountResponseMeta)
  }

  /**
   * Lookup an account's created application parameters, optionally for a specific ID.
   */
  async lookupAccountCreatedApplications(
    account: ReadableAddress,
    params?: { applicationId?: number | bigint; includeAll?: boolean; limit?: number; next?: string },
  ): Promise<ApplicationsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/accounts/{account-id}/created-applications',
      path: { 'account-id': account },
      query: { 'application-id': params?.applicationId, 'include-all': params?.includeAll, limit: params?.limit, next: params?.next },
      headers,
      body: undefined,
    })

    return decodeJson(payload, ApplicationsResponseMeta)
  }

  /**
   * Lookup an account's created asset parameters, optionally for a specific ID.
   */
  async lookupAccountCreatedAssets(
    account: ReadableAddress,
    params?: { assetId?: number | bigint; includeAll?: boolean; limit?: number; next?: string },
  ): Promise<AssetsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/accounts/{account-id}/created-assets',
      path: { 'account-id': account },
      query: { 'asset-id': params?.assetId, 'include-all': params?.includeAll, limit: params?.limit, next: params?.next },
      headers,
      body: undefined,
    })

    return decodeJson(payload, AssetsResponseMeta)
  }

  /**
   * Lookup account transactions. Transactions are returned newest to oldest.
   */
  async lookupAccountTransactions(
    account: ReadableAddress,
    params?: {
      limit?: number
      next?: string
      notePrefix?: string
      txType?: 'pay' | 'keyreg' | 'acfg' | 'axfer' | 'afrz' | 'appl' | 'stpf' | 'hb'
      sigType?: 'sig' | 'msig' | 'lsig'
      txId?: string
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
  ): Promise<TransactionsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/accounts/{account-id}/transactions',
      path: { 'account-id': account },
      query: {
        limit: params?.limit,
        next: params?.next,
        'note-prefix': params?.notePrefix,
        'tx-type': params?.txType,
        'sig-type': params?.sigType,
        txid: params?.txId,
        round: params?.round,
        'min-round': params?.minRound,
        'max-round': params?.maxRound,
        'asset-id': params?.assetId,
        'before-time': params?.beforeTime,
        'after-time': params?.afterTime,
        'currency-greater-than': params?.currencyGreaterThan,
        'currency-less-than': params?.currencyLessThan,
        'rekey-to': params?.rekeyTo,
      },
      headers,
      body: undefined,
    })

    return decodeJson(payload, TransactionsResponseMeta)
  }

  /**
   * Given an application ID and box name, returns base64 encoded box name and value. Box names must be in the goal app call arg form 'encoding:value'. For ints, use the form 'int:1234'. For raw bytes, encode base 64 and use 'b64' prefix as in 'b64:A=='. For printable strings, use the form 'str:hello'. For addresses, use the form 'addr:XYZ...'.
   */
  private async _lookupApplicationBoxByIdAndName(applicationId: number | bigint, params?: { name: string }): Promise<Box> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/applications/{application-id}/box',
      path: { 'application-id': applicationId },
      query: { name: params?.name },
      headers,
      body: undefined,
    })

    return decodeJson(payload, BoxMeta)
  }

  /**
   * Lookup application.
   */
  async lookupApplicationById(applicationId: number | bigint, params?: { includeAll?: boolean }): Promise<ApplicationResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/applications/{application-id}',
      path: { 'application-id': applicationId },
      query: { 'include-all': params?.includeAll },
      headers,
      body: undefined,
    })

    return decodeJson(payload, ApplicationResponseMeta)
  }

  /**
   * Lookup application logs.
   */
  async lookupApplicationLogsById(
    applicationId: number | bigint,
    params?: {
      limit?: number
      next?: string
      txId?: string
      minRound?: number | bigint
      maxRound?: number | bigint
      senderAddress?: ReadableAddress
    },
  ): Promise<ApplicationLogsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/applications/{application-id}/logs',
      path: { 'application-id': applicationId },
      query: {
        limit: params?.limit,
        next: params?.next,
        txid: params?.txId,
        'min-round': params?.minRound,
        'max-round': params?.maxRound,
        'sender-address': params?.senderAddress,
      },
      headers,
      body: undefined,
    })

    return decodeJson(payload, ApplicationLogsResponseMeta)
  }

  /**
   * Lookup the list of accounts who hold this asset
   */
  async lookupAssetBalances(
    assetId: number | bigint,
    params?: {
      includeAll?: boolean
      limit?: number
      next?: string
      currencyGreaterThan?: number | bigint
      currencyLessThan?: number | bigint
    },
  ): Promise<AssetBalancesResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/assets/{asset-id}/balances',
      path: { 'asset-id': assetId },
      query: {
        'include-all': params?.includeAll,
        limit: params?.limit,
        next: params?.next,
        'currency-greater-than': params?.currencyGreaterThan,
        'currency-less-than': params?.currencyLessThan,
      },
      headers,
      body: undefined,
    })

    return decodeJson(payload, AssetBalancesResponseMeta)
  }

  /**
   * Lookup asset information.
   */
  async lookupAssetById(assetId: number | bigint, params?: { includeAll?: boolean }): Promise<AssetResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/assets/{asset-id}',
      path: { 'asset-id': assetId },
      query: { 'include-all': params?.includeAll },
      headers,
      body: undefined,
    })

    return decodeJson(payload, AssetResponseMeta)
  }

  /**
   * Lookup transactions for an asset. Transactions are returned oldest to newest.
   */
  async lookupAssetTransactions(
    assetId: number | bigint,
    params?: {
      limit?: number
      next?: string
      notePrefix?: string
      txType?: 'pay' | 'keyreg' | 'acfg' | 'axfer' | 'afrz' | 'appl' | 'stpf' | 'hb'
      sigType?: 'sig' | 'msig' | 'lsig'
      txId?: string
      round?: number | bigint
      minRound?: number | bigint
      maxRound?: number | bigint
      beforeTime?: string
      afterTime?: string
      currencyGreaterThan?: number | bigint
      currencyLessThan?: number | bigint
      address?: ReadableAddress
      addressRole?: 'sender' | 'receiver' | 'freeze-target'
      excludeCloseTo?: boolean
      rekeyTo?: boolean
    },
  ): Promise<TransactionsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/assets/{asset-id}/transactions',
      path: { 'asset-id': assetId },
      query: {
        limit: params?.limit,
        next: params?.next,
        'note-prefix': params?.notePrefix,
        'tx-type': params?.txType,
        'sig-type': params?.sigType,
        txid: params?.txId,
        round: params?.round,
        'min-round': params?.minRound,
        'max-round': params?.maxRound,
        'before-time': params?.beforeTime,
        'after-time': params?.afterTime,
        'currency-greater-than': params?.currencyGreaterThan,
        'currency-less-than': params?.currencyLessThan,
        address: params?.address,
        'address-role': params?.addressRole,
        'exclude-close-to': params?.excludeCloseTo,
        'rekey-to': params?.rekeyTo,
      },
      headers,
      body: undefined,
    })

    return decodeJson(payload, TransactionsResponseMeta)
  }

  /**
   * Lookup block.
   */
  async lookupBlock(roundNumber: number | bigint, params?: { headerOnly?: boolean }): Promise<Block> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/blocks/{round-number}',
      path: { 'round-number': roundNumber },
      query: { 'header-only': params?.headerOnly },
      headers,
      body: undefined,
    })

    return decodeJson(payload, BlockMeta)
  }

  /**
   * Lookup a single transaction.
   */
  async lookupTransactionById(txId: string): Promise<TransactionResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/transactions/{txid}',
      path: { txid: txId },
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, TransactionResponseMeta)
  }

  async makeHealthCheck(): Promise<HealthCheck> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/health',
      path: {},
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, HealthCheckMeta)
  }

  /**
   * Search for accounts.
   */
  async searchForAccounts(params?: {
    assetId?: number | bigint
    limit?: number
    next?: string
    currencyGreaterThan?: number | bigint
    includeAll?: boolean
    exclude?: 'all' | 'assets' | 'created-assets' | 'apps-local-state' | 'created-apps' | 'none'[]
    currencyLessThan?: number | bigint
    authAddr?: ReadableAddress
    round?: number | bigint
    applicationId?: number | bigint
    onlineOnly?: boolean
  }): Promise<AccountsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/accounts',
      path: {},
      query: {
        'asset-id': params?.assetId,
        limit: params?.limit,
        next: params?.next,
        'currency-greater-than': params?.currencyGreaterThan,
        'include-all': params?.includeAll,
        exclude: params?.exclude,
        'currency-less-than': params?.currencyLessThan,
        'auth-addr': params?.authAddr,
        round: params?.round,
        'application-id': params?.applicationId,
        'online-only': params?.onlineOnly,
      },
      headers,
      body: undefined,
    })

    return decodeJson(payload, AccountsResponseMeta)
  }

  /**
   * Given an application ID, returns the box names of that application sorted lexicographically.
   */
  async searchForApplicationBoxes(applicationId: number | bigint, params?: { limit?: number; next?: string }): Promise<BoxesResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/applications/{application-id}/boxes',
      path: { 'application-id': applicationId },
      query: { limit: params?.limit, next: params?.next },
      headers,
      body: undefined,
    })

    return decodeJson(payload, BoxesResponseMeta)
  }

  /**
   * Search for applications
   */
  async searchForApplications(params?: {
    applicationId?: number | bigint
    creator?: string
    includeAll?: boolean
    limit?: number
    next?: string
  }): Promise<ApplicationsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/applications',
      path: {},
      query: {
        'application-id': params?.applicationId,
        creator: params?.creator,
        'include-all': params?.includeAll,
        limit: params?.limit,
        next: params?.next,
      },
      headers,
      body: undefined,
    })

    return decodeJson(payload, ApplicationsResponseMeta)
  }

  /**
   * Search for assets.
   */
  async searchForAssets(params?: {
    includeAll?: boolean
    limit?: number
    next?: string
    creator?: string
    name?: string
    unit?: string
    assetId?: number | bigint
  }): Promise<AssetsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/assets',
      path: {},
      query: {
        'include-all': params?.includeAll,
        limit: params?.limit,
        next: params?.next,
        creator: params?.creator,
        name: params?.name,
        unit: params?.unit,
        'asset-id': params?.assetId,
      },
      headers,
      body: undefined,
    })

    return decodeJson(payload, AssetsResponseMeta)
  }

  /**
   * Search for block headers. Block headers are returned in ascending round order. Transactions are not included in the output.
   */
  async searchForBlockHeaders(params?: {
    limit?: number
    next?: string
    minRound?: number | bigint
    maxRound?: number | bigint
    beforeTime?: string
    afterTime?: string
    proposers?: ReadableAddress[]
    expired?: ReadableAddress[]
    absent?: ReadableAddress[]
  }): Promise<BlockHeadersResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/block-headers',
      path: {},
      query: {
        limit: params?.limit,
        next: params?.next,
        'min-round': params?.minRound,
        'max-round': params?.maxRound,
        'before-time': params?.beforeTime,
        'after-time': params?.afterTime,
        proposers: params?.proposers,
        expired: params?.expired,
        absent: params?.absent,
      },
      headers,
      body: undefined,
    })

    return decodeJson(payload, BlockHeadersResponseMeta)
  }

  /**
   * Search for transactions. Transactions are returned oldest to newest unless the address parameter is used, in which case results are returned newest to oldest.
   */
  async searchForTransactions(params?: {
    limit?: number
    next?: string
    notePrefix?: string
    txType?: 'pay' | 'keyreg' | 'acfg' | 'axfer' | 'afrz' | 'appl' | 'stpf' | 'hb'
    sigType?: 'sig' | 'msig' | 'lsig'
    groupId?: string
    txId?: string
    round?: number | bigint
    minRound?: number | bigint
    maxRound?: number | bigint
    assetId?: number | bigint
    beforeTime?: string
    afterTime?: string
    currencyGreaterThan?: number | bigint
    currencyLessThan?: number | bigint
    address?: ReadableAddress
    addressRole?: 'sender' | 'receiver' | 'freeze-target'
    excludeCloseTo?: boolean
    rekeyTo?: boolean
    applicationId?: number | bigint
  }): Promise<TransactionsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/transactions',
      path: {},
      query: {
        limit: params?.limit,
        next: params?.next,
        'note-prefix': params?.notePrefix,
        'tx-type': params?.txType,
        'sig-type': params?.sigType,
        'group-id': params?.groupId,
        txid: params?.txId,
        round: params?.round,
        'min-round': params?.minRound,
        'max-round': params?.maxRound,
        'asset-id': params?.assetId,
        'before-time': params?.beforeTime,
        'after-time': params?.afterTime,
        'currency-greater-than': params?.currencyGreaterThan,
        'currency-less-than': params?.currencyLessThan,
        address: params?.address,
        'address-role': params?.addressRole,
        'exclude-close-to': params?.excludeCloseTo,
        'rekey-to': params?.rekeyTo,
        'application-id': params?.applicationId,
      },
      headers,
      body: undefined,
    })

    return decodeJson(payload, TransactionsResponseMeta)
  }

  /**
   * Given an application ID and box name, it returns the round, box name, and value.
   */
  async lookupApplicationBoxByIdAndName(applicationId: number | bigint, boxName: Uint8Array): Promise<Box> {
    const name = `b64:${Buffer.from(boxName).toString('base64')}`
    return this._lookupApplicationBoxByIdAndName(applicationId, { name })
  }
}
