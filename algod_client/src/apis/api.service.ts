import type { BaseHttpRequest, ApiRequestOptions } from '../core/base-http-request'
import { AlgorandSerializer } from '../core/model-runtime'
import type { BodyFormat } from '../core/model-runtime'
import type {
  AbortCatchup,
  Account,
  AccountApplicationInformation,
  AccountAssetInformation,
  AccountAssetsInformation,
  AddParticipationKey,
  Application,
  Asset,
  Box,
  DebugSettingsProf,
  DryrunRequest,
  Genesis,
  GetApplicationBoxes,
  GetBlock,
  GetBlockHash,
  GetBlockLogs,
  GetBlockTimeStampOffset,
  GetBlockTxids,
  GetPendingTransactions,
  GetPendingTransactionsByAddress,
  GetStatus,
  GetSupply,
  GetSyncRound,
  GetTransactionGroupLedgerStateDeltasForRound,
  LedgerStateDelta,
  LightBlockHeaderProof,
  ParticipationKey,
  PendingTransactionResponse,
  RawTransaction,
  ShutdownNode,
  SimulateRequest,
  SimulateTransaction,
  StartCatchup,
  StateProof,
  TealCompile,
  TealDisassemble,
  TealDryrun,
  TransactionParams,
  TransactionProof,
  Version,
  WaitForBlock,
} from '../models/index'
import {
  AbortCatchupMeta,
  AccountMeta,
  AccountApplicationInformationMeta,
  AccountAssetInformationMeta,
  AccountAssetsInformationMeta,
  AddParticipationKeyMeta,
  ApplicationMeta,
  AssetMeta,
  BoxMeta,
  DebugSettingsProfMeta,
  DryrunRequestMeta,
  GenesisMeta,
  GetApplicationBoxesMeta,
  GetBlockMeta,
  GetBlockHashMeta,
  GetBlockLogsMeta,
  GetBlockTimeStampOffsetMeta,
  GetBlockTxidsMeta,
  GetPendingTransactionsMeta,
  GetPendingTransactionsByAddressMeta,
  GetStatusMeta,
  GetSupplyMeta,
  GetSyncRoundMeta,
  GetTransactionGroupLedgerStateDeltasForRoundMeta,
  LedgerStateDeltaMeta,
  LightBlockHeaderProofMeta,
  ParticipationKeyMeta,
  PendingTransactionResponseMeta,
  RawTransactionMeta,
  ShutdownNodeMeta,
  SimulateRequestMeta,
  SimulateTransactionMeta,
  StartCatchupMeta,
  StateProofMeta,
  TealCompileMeta,
  TealDisassembleMeta,
  TealDryrunMeta,
  TransactionParamsMeta,
  TransactionProofMeta,
  VersionMeta,
  WaitForBlockMeta,
} from '../models/index'

export class AlgodApi {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  private static acceptFor(format: BodyFormat): string {
    return format === 'json' ? 'application/json' : 'application/msgpack'
  }

  private static mediaFor(format: BodyFormat): string {
    return format === 'json' ? 'application/json' : 'application/msgpack'
  }

  /**
   * Given a catchpoint, it aborts catching up to this catchpoint
   */
  async abortCatchup(catchpoint: string, requestOptions?: ApiRequestOptions): Promise<AbortCatchup> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'DELETE',
      url: '/v2/catchup/{catchpoint}',
      path: { catchpoint: catchpoint },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = AbortCatchupMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as AbortCatchup
  }

  /**
   * Given a specific account public key and application ID, this call returns the account's application local state and global state (AppLocalState and AppParams, if either exists). Global state will only be returned if the provided address is the application's creator.
   */
  async accountApplicationInformation(
    address: string,
    applicationId: number | bigint,
    params?: { format?: 'json' | 'msgpack' },
    requestOptions?: ApiRequestOptions,
  ): Promise<AccountApplicationInformation> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = (params?.format as BodyFormat | undefined) ?? 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/accounts/{address}/applications/{application-id}',
      path: { address: address, 'application-id': typeof applicationId === 'bigint' ? applicationId.toString() : applicationId },
      query: { format: params?.format },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = AccountApplicationInformationMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as AccountApplicationInformation
  }

  /**
   * Given a specific account public key and asset ID, this call returns the account's asset holding and asset parameters (if either exist). Asset parameters will only be returned if the provided address is the asset's creator.
   */
  async accountAssetInformation(
    address: string,
    assetId: number | bigint,
    params?: { format?: 'json' | 'msgpack' },
    requestOptions?: ApiRequestOptions,
  ): Promise<AccountAssetInformation> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = (params?.format as BodyFormat | undefined) ?? 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/accounts/{address}/assets/{asset-id}',
      path: { address: address, 'asset-id': typeof assetId === 'bigint' ? assetId.toString() : assetId },
      query: { format: params?.format },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = AccountAssetInformationMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as AccountAssetInformation
  }

  /**
   * Lookup an account's asset holdings.
   */
  async accountAssetsInformation(
    address: string,
    params?: { limit?: number | bigint; next?: string },
    requestOptions?: ApiRequestOptions,
  ): Promise<AccountAssetsInformation> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/accounts/{address}/assets',
      path: { address: address },
      query: { limit: typeof params?.limit === 'bigint' ? (params!.limit as bigint).toString() : params?.limit, next: params?.next },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = AccountAssetsInformationMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as AccountAssetsInformation
  }

  /**
   * Given a specific account public key, this call returns the account's status, balance and spendable amounts
   */
  async accountInformation(
    address: string,
    params?: { exclude?: 'all' | 'none'; format?: 'json' | 'msgpack' },
    requestOptions?: ApiRequestOptions,
  ): Promise<Account> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = (params?.format as BodyFormat | undefined) ?? 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/accounts/{address}',
      path: { address: address },
      query: { exclude: params?.exclude, format: params?.format },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = AccountMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as Account
  }

  async addParticipationKey(params?: { body: string }, requestOptions?: ApiRequestOptions): Promise<AddParticipationKey> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const bodyMeta = undefined
    const mediaType = bodyMeta ? AlgodApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/participation',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = AddParticipationKeyMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as AddParticipationKey
  }

  /**
   * Given a participation ID, append state proof keys to a particular set of participation keys
   */
  async appendKeys(participationId: string, params?: { body: string }, requestOptions?: ApiRequestOptions): Promise<ParticipationKey> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const bodyMeta = undefined
    const mediaType = bodyMeta ? AlgodApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/participation/{participation-id}',
      path: { 'participation-id': participationId },
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = ParticipationKeyMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as ParticipationKey
  }

  /**
   * Delete a given participation key by ID
   */
  async deleteParticipationKeyById(participationId: string, requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'DELETE',
      url: '/v2/participation/{participation-id}',
      path: { 'participation-id': participationId },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = undefined
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as void
  }

  async experimentalCheck(requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/experimental',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = undefined
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as void
  }

  async generateParticipationKeys(
    address: string,
    params?: { dilution?: number | bigint; first: number | bigint; last: number | bigint },
    requestOptions?: ApiRequestOptions,
  ): Promise<string> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/participation/generate/{address}',
      path: { address: address },
      query: {
        dilution: typeof params?.dilution === 'bigint' ? (params!.dilution as bigint).toString() : params?.dilution,
        first: typeof params?.first === 'bigint' ? (params!.first as bigint).toString() : params?.first,
        last: typeof params?.last === 'bigint' ? (params!.last as bigint).toString() : params?.last,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = undefined
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as string
  }

  /**
   * Given an application ID and box name, it returns the round, box name, and value (each base64 encoded). Box names must be in the goal app call arg encoding form 'encoding:value'. For ints, use the form 'int:1234'. For raw bytes, use the form 'b64:A=='. For printable strings, use the form 'str:hello'. For addresses, use the form 'addr:XYZ...'.
   */
  async getApplicationBoxByName(
    applicationId: number | bigint,
    params?: { name: string },
    requestOptions?: ApiRequestOptions,
  ): Promise<Box> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

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
   * Given an application ID, return all Box names. No particular ordering is guaranteed. Request fails when client or server-side configured limits prevent returning all Box names.
   */
  async getApplicationBoxes(
    applicationId: number | bigint,
    params?: { max?: number | bigint },
    requestOptions?: ApiRequestOptions,
  ): Promise<GetApplicationBoxes> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/applications/{application-id}/boxes',
      path: { 'application-id': typeof applicationId === 'bigint' ? applicationId.toString() : applicationId },
      query: { max: typeof params?.max === 'bigint' ? (params!.max as bigint).toString() : params?.max },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = GetApplicationBoxesMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetApplicationBoxes
  }

  /**
   * Given a application ID, it returns application information including creator, approval and clear programs, global and local schemas, and global state.
   */
  async getApplicationById(applicationId: number | bigint, requestOptions?: ApiRequestOptions): Promise<Application> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/applications/{application-id}',
      path: { 'application-id': typeof applicationId === 'bigint' ? applicationId.toString() : applicationId },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = ApplicationMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as Application
  }

  /**
   * Given a asset ID, it returns asset information including creator, name, total supply and special addresses.
   */
  async getAssetById(assetId: number | bigint, requestOptions?: ApiRequestOptions): Promise<Asset> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/assets/{asset-id}',
      path: { 'asset-id': typeof assetId === 'bigint' ? assetId.toString() : assetId },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = AssetMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as Asset
  }

  async getBlock(round: number | bigint, params?: { headerOnly?: boolean }, requestOptions?: ApiRequestOptions): Promise<GetBlock> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/blocks/{round}',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: { 'header-only': params?.headerOnly, format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = GetBlockMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetBlock
  }

  async getBlockHash(round: number | bigint, requestOptions?: ApiRequestOptions): Promise<GetBlockHash> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/blocks/{round}/hash',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = GetBlockHashMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetBlockHash
  }

  /**
   * Get all of the logs from outer and inner app calls in the given round
   */
  async getBlockLogs(round: number | bigint, requestOptions?: ApiRequestOptions): Promise<GetBlockLogs> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/blocks/{round}/logs',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = GetBlockLogsMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetBlockLogs
  }

  /**
   * Gets the current timestamp offset.
   */
  async getBlockTimeStampOffset(requestOptions?: ApiRequestOptions): Promise<GetBlockTimeStampOffset> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/devmode/blocks/offset',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = GetBlockTimeStampOffsetMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetBlockTimeStampOffset
  }

  async getBlockTxids(round: number | bigint, requestOptions?: ApiRequestOptions): Promise<GetBlockTxids> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/blocks/{round}/txids',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = GetBlockTxidsMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetBlockTxids
  }

  /**
   * Returns the merged (defaults + overrides) config file in json.
   */
  async getConfig(requestOptions?: ApiRequestOptions): Promise<string> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/debug/settings/config',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = undefined
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as string
  }

  /**
   * Retrieves the current settings for blocking and mutex profiles
   */
  async getDebugSettingsProf(requestOptions?: ApiRequestOptions): Promise<DebugSettingsProf> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/debug/settings/pprof',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = DebugSettingsProfMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as DebugSettingsProf
  }

  /**
   * Returns the entire genesis file in json.
   */
  async getGenesis(requestOptions?: ApiRequestOptions): Promise<Genesis> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/genesis',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = GenesisMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as Genesis
  }

  /**
   * Get ledger deltas for a round.
   */
  async getLedgerStateDelta(round: number | bigint, requestOptions?: ApiRequestOptions): Promise<LedgerStateDelta> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/deltas/{round}',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: { format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = LedgerStateDeltaMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LedgerStateDelta
  }

  /**
   * Get a ledger delta for a given transaction group.
   */
  async getLedgerStateDeltaForTransactionGroup(id: string, requestOptions?: ApiRequestOptions): Promise<LedgerStateDelta> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/deltas/txn/group/{id}',
      path: { id: id },
      query: { format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = LedgerStateDeltaMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LedgerStateDelta
  }

  async getLightBlockHeaderProof(round: number | bigint, requestOptions?: ApiRequestOptions): Promise<LightBlockHeaderProof> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/blocks/{round}/lightheader/proof',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = LightBlockHeaderProofMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LightBlockHeaderProof
  }

  /**
   * Given a participation ID, return information about that participation key
   */
  async getParticipationKeyById(participationId: string, requestOptions?: ApiRequestOptions): Promise<ParticipationKey> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/participation/{participation-id}',
      path: { 'participation-id': participationId },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = ParticipationKeyMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as ParticipationKey
  }

  /**
   * Return a list of participation keys
   */
  async getParticipationKeys(requestOptions?: ApiRequestOptions): Promise<ParticipationKey[]> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/participation',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = {
      name: 'ParticipationKey[]',
      kind: 'array',
      arrayItems: { kind: 'model', meta: () => ParticipationKeyMeta } as const,
    } as const
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as ParticipationKey[]
  }

  /**
   * Get the list of pending transactions, sorted by priority, in decreasing order, truncated at the end at MAX. If MAX = 0, returns all pending transactions.
   */
  async getPendingTransactions(params?: { max?: number | bigint }, requestOptions?: ApiRequestOptions): Promise<GetPendingTransactions> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/transactions/pending',
      path: {},
      query: { max: typeof params?.max === 'bigint' ? (params!.max as bigint).toString() : params?.max, format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = GetPendingTransactionsMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetPendingTransactions
  }

  /**
   * Get the list of pending transactions by address, sorted by priority, in decreasing order, truncated at the end at MAX. If MAX = 0, returns all pending transactions.
   */
  async getPendingTransactionsByAddress(
    address: string,
    params?: { max?: number | bigint },
    requestOptions?: ApiRequestOptions,
  ): Promise<GetPendingTransactionsByAddress> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/accounts/{address}/transactions/pending',
      path: { address: address },
      query: { max: typeof params?.max === 'bigint' ? (params!.max as bigint).toString() : params?.max, format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = GetPendingTransactionsByAddressMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetPendingTransactionsByAddress
  }

  async getReady(requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/ready',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = undefined
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as void
  }

  async getStateProof(round: number | bigint, requestOptions?: ApiRequestOptions): Promise<StateProof> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/stateproofs/{round}',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = StateProofMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as StateProof
  }

  async getStatus(requestOptions?: ApiRequestOptions): Promise<GetStatus> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/status',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = GetStatusMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetStatus
  }

  async getSupply(requestOptions?: ApiRequestOptions): Promise<GetSupply> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/ledger/supply',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = GetSupplyMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetSupply
  }

  /**
   * Gets the minimum sync round for the ledger.
   */
  async getSyncRound(requestOptions?: ApiRequestOptions): Promise<GetSyncRound> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/ledger/sync',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = GetSyncRoundMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetSyncRound
  }

  /**
   * Get ledger deltas for transaction groups in a given round.
   */
  async getTransactionGroupLedgerStateDeltasForRound(
    round: number | bigint,
    requestOptions?: ApiRequestOptions,
  ): Promise<GetTransactionGroupLedgerStateDeltasForRound> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/deltas/{round}/txn/group',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: { format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = GetTransactionGroupLedgerStateDeltasForRoundMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetTransactionGroupLedgerStateDeltasForRound
  }

  async getTransactionProof(
    round: number | bigint,
    txid: string,
    params?: { hashtype?: 'sha512_256' | 'sha256'; format?: 'json' | 'msgpack' },
    requestOptions?: ApiRequestOptions,
  ): Promise<TransactionProof> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/blocks/{round}/transactions/{txid}/proof',
      path: { round: typeof round === 'bigint' ? round.toString() : round, txid: txid },
      query: { hashtype: params?.hashtype, format: params?.format },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = TransactionProofMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as TransactionProof
  }

  /**
   * Retrieves the supported API versions, binary build versions, and genesis information.
   */
  async getVersion(requestOptions?: ApiRequestOptions): Promise<Version> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/versions',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = VersionMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as Version
  }

  async healthCheck(requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

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

    const responseMeta = undefined
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as void
  }

  async metrics(requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/metrics',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = undefined
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as void
  }

  /**
   * Given a transaction ID of a recently submitted transaction, it returns information about it.  There are several cases when this might succeed:
   * - transaction committed (committed round > 0)
   * - transaction still in the pool (committed round = 0, pool error = "")
   * - transaction removed from pool due to error (committed round = 0, pool error != "")
   * Or the transaction may have happened sufficiently long ago that the node no longer remembers it, and this will return an error.
   */
  async pendingTransactionInformation(txid: string, requestOptions?: ApiRequestOptions): Promise<PendingTransactionResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/transactions/pending/{txid}',
      path: { txid: txid },
      query: { format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PendingTransactionResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PendingTransactionResponse
  }

  /**
   * Enables blocking and mutex profiles, and returns the old settings
   */
  async putDebugSettingsProf(requestOptions?: ApiRequestOptions): Promise<DebugSettingsProf> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'PUT',
      url: '/debug/settings/pprof',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = DebugSettingsProfMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as DebugSettingsProf
  }

  async rawTransaction(params?: { body: Uint8Array }, requestOptions?: ApiRequestOptions): Promise<RawTransaction> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const serializedBody = params?.body ?? undefined
    const mediaType = 'application/msgpack'
    headers['Content-Type'] = mediaType

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/transactions',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = RawTransactionMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as RawTransaction
  }

  async rawTransactionAsync(params?: { body: Uint8Array }, requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const serializedBody = params?.body ?? undefined
    const mediaType = 'application/msgpack'
    headers['Content-Type'] = mediaType

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/transactions/async',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = undefined
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as void
  }

  /**
   * Sets the timestamp offset (seconds) for blocks in dev mode. Providing an offset of 0 will unset this value and try to use the real clock for the timestamp.
   */
  async setBlockTimeStampOffset(offset: number | bigint, requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/devmode/blocks/offset/{offset}',
      path: { offset: typeof offset === 'bigint' ? offset.toString() : offset },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = undefined
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as void
  }

  /**
   * Sets the minimum sync round on the ledger.
   */
  async setSyncRound(round: number | bigint, requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/ledger/sync/{round}',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = undefined
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as void
  }

  /**
   * Special management endpoint to shutdown the node. Optionally provide a timeout parameter to indicate that the node should begin shutting down after a number of seconds.
   */
  async shutdownNode(params?: { timeout?: number | bigint }, requestOptions?: ApiRequestOptions): Promise<ShutdownNode> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/shutdown',
      path: {},
      query: { timeout: typeof params?.timeout === 'bigint' ? (params!.timeout as bigint).toString() : params?.timeout },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = ShutdownNodeMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as ShutdownNode
  }

  async simulateTransaction(
    params?: { format?: 'json' | 'msgpack'; body: SimulateRequest },
    requestOptions?: ApiRequestOptions,
  ): Promise<SimulateTransaction> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = (params?.format as BodyFormat | undefined) ?? 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const bodyMeta = SimulateRequestMeta
    const mediaType = bodyMeta ? AlgodApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/transactions/simulate',
      path: {},
      query: { format: params?.format },
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = SimulateTransactionMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as SimulateTransaction
  }

  /**
   * Given a catchpoint, it starts catching up to this catchpoint
   */
  async startCatchup(catchpoint: string, params?: { min?: number | bigint }, requestOptions?: ApiRequestOptions): Promise<StartCatchup> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/catchup/{catchpoint}',
      path: { catchpoint: catchpoint },
      query: { min: typeof params?.min === 'bigint' ? (params!.min as bigint).toString() : params?.min },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = StartCatchupMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as StartCatchup
  }

  /**
   * Returns the entire swagger spec in json.
   */
  async swaggerJson(requestOptions?: ApiRequestOptions): Promise<string> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/swagger.json',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = undefined
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as string
  }

  /**
   * Given TEAL source code in plain text, return base64 encoded program bytes and base32 SHA512_256 hash of program bytes (Address style). This endpoint is only enabled when a node's configuration file sets EnableDeveloperAPI to true.
   */
  async tealCompile(params?: { sourcemap?: boolean; body: string }, requestOptions?: ApiRequestOptions): Promise<TealCompile> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const bodyMeta = undefined
    const mediaType = bodyMeta ? AlgodApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/teal/compile',
      path: {},
      query: { sourcemap: params?.sourcemap },
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = TealCompileMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as TealCompile
  }

  /**
   * Given the program bytes, return the TEAL source code in plain text. This endpoint is only enabled when a node's configuration file sets EnableDeveloperAPI to true.
   */
  async tealDisassemble(params?: { body: Uint8Array }, requestOptions?: ApiRequestOptions): Promise<TealDisassemble> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const serializedBody = params?.body ?? undefined
    const mediaType = 'application/msgpack'
    headers['Content-Type'] = mediaType

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/teal/disassemble',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = TealDisassembleMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as TealDisassemble
  }

  /**
   * Executes TEAL program(s) in context and returns debugging information about the execution. This endpoint is only enabled when a node's configuration file sets EnableDeveloperAPI to true.
   */
  async tealDryrun(params?: { body?: DryrunRequest }, requestOptions?: ApiRequestOptions): Promise<TealDryrun> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const bodyMeta = DryrunRequestMeta
    const mediaType = bodyMeta ? AlgodApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/teal/dryrun',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = TealDryrunMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as TealDryrun
  }

  async transactionParams(requestOptions?: ApiRequestOptions): Promise<TransactionParams> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/transactions/params',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = TransactionParamsMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as TransactionParams
  }

  /**
   * Unset the ledger sync round.
   */
  async unsetSyncRound(requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'DELETE',
      url: '/v2/ledger/sync',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = undefined
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as void
  }

  /**
   * Waits for a block to appear after round {round} and returns the node's status at the time. There is a 1 minute timeout, when reached the current status is returned regardless of whether or not it is the round after the given round.
   */
  async waitForBlock(round: number | bigint, requestOptions?: ApiRequestOptions): Promise<WaitForBlock> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/status/wait-for-block-after/{round}',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = WaitForBlockMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as WaitForBlock
  }
}
