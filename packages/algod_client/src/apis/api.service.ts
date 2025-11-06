import type { BaseHttpRequest } from '../core/base-http-request'
import { AlgorandSerializer } from '../core/model-runtime'
import type { BodyFormat } from '../core/model-runtime'
import { concatArrays } from '@algorandfoundation/algokit-common'
import type {
  Account,
  AccountApplicationInformation,
  AccountAssetInformation,
  Application,
  Asset,
  Box,
  DryrunRequest,
  Genesis,
  GetApplicationBoxes,
  GetBlock,
  GetBlockHash,
  GetBlockTimeStampOffset,
  GetBlockTxIds,
  GetPendingTransactions,
  GetPendingTransactionsByAddress,
  GetStatus,
  GetSupply,
  GetSyncRound,
  GetTransactionGroupLedgerStateDeltasForRound,
  LedgerStateDelta,
  LightBlockHeaderProof,
  PendingTransactionResponse,
  RawTransaction,
  SimulateRequest,
  SimulateTransaction,
  StateProof,
  SuggestedParams,
  TealCompile,
  TealDisassemble,
  TealDryrun,
  TransactionParams,
  TransactionProof,
  Version,
  WaitForBlock,
} from '../models/index'
import {
  AccountMeta,
  AccountApplicationInformationMeta,
  AccountAssetInformationMeta,
  ApplicationMeta,
  AssetMeta,
  BoxMeta,
  DryrunRequestMeta,
  GenesisMeta,
  GetApplicationBoxesMeta,
  GetBlockMeta,
  GetBlockHashMeta,
  GetBlockTimeStampOffsetMeta,
  GetBlockTxIdsMeta,
  GetPendingTransactionsMeta,
  GetPendingTransactionsByAddressMeta,
  GetStatusMeta,
  GetSupplyMeta,
  GetSyncRoundMeta,
  GetTransactionGroupLedgerStateDeltasForRoundMeta,
  LedgerStateDeltaMeta,
  LightBlockHeaderProofMeta,
  PendingTransactionResponseMeta,
  RawTransactionMeta,
  SimulateRequestMeta,
  SimulateTransactionMeta,
  StateProofMeta,
  SuggestedParamsMeta,
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
   * Given a specific account public key and application ID, this call returns the account's application local state and global state (AppLocalState and AppParams, if either exists). Global state will only be returned if the provided address is the application's creator.
   */
  async accountApplicationInformation(
    address: string,
    applicationId: number | bigint,
    params?: { format?: 'json' | 'msgpack' },
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
  async accountAssetInformation(address: string, assetId: number | bigint): Promise<AccountAssetInformation> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/accounts/{address}/assets/{asset-id}',
      path: { address: address, 'asset-id': typeof assetId === 'bigint' ? assetId.toString() : assetId },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    const responseMeta = AccountAssetInformationMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as AccountAssetInformation
  }

  /**
   * Given a specific account public key, this call returns the account's status, balance and spendable amounts
   */
  async accountInformation(address: string, params?: { exclude?: 'all' | 'none' }): Promise<Account> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/accounts/{address}',
      path: { address: address },
      query: { exclude: params?.exclude },
      headers,
      body: undefined,
      mediaType: undefined,
    })

    const responseMeta = AccountMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as Account
  }

  /**
   * Given an application ID and box name, it returns the round, box name, and value (each base64 encoded). Box names must be in the goal app call arg encoding form 'encoding:value'. For ints, use the form 'int:1234'. For raw bytes, use the form 'b64:A=='. For printable strings, use the form 'str:hello'. For addresses, use the form 'addr:XYZ...'.
   */
  private async _getApplicationBoxByName(applicationId: number | bigint, params?: { name: string }): Promise<Box> {
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
  async getApplicationBoxes(applicationId: number | bigint, params?: { max?: number }): Promise<GetApplicationBoxes> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/applications/{application-id}/boxes',
      path: { 'application-id': typeof applicationId === 'bigint' ? applicationId.toString() : applicationId },
      query: { max: params?.max },
      headers,
      body: undefined,
      mediaType: undefined,
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
  async getApplicationById(applicationId: number | bigint): Promise<Application> {
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
  async getAssetById(assetId: number | bigint): Promise<Asset> {
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
    })

    const responseMeta = AssetMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as Asset
  }

  async getBlock(round: number | bigint, params?: { headerOnly?: boolean }): Promise<GetBlock> {
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
    })

    const responseMeta = GetBlockMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetBlock
  }

  async getBlockHash(round: number | bigint): Promise<GetBlockHash> {
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
    })

    const responseMeta = GetBlockHashMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetBlockHash
  }

  /**
   * Gets the current timestamp offset.
   */
  async getBlockTimeStampOffset(): Promise<GetBlockTimeStampOffset> {
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
    })

    const responseMeta = GetBlockTimeStampOffsetMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetBlockTimeStampOffset
  }

  async getBlockTxIds(round: number | bigint): Promise<GetBlockTxIds> {
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
    })

    const responseMeta = GetBlockTxIdsMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetBlockTxIds
  }

  /**
   * Returns the entire genesis file in json.
   */
  async getGenesis(): Promise<Genesis> {
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
  async getLedgerStateDelta(round: number | bigint): Promise<LedgerStateDelta> {
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
  async getLedgerStateDeltaForTransactionGroup(id: string): Promise<LedgerStateDelta> {
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
    })

    const responseMeta = LedgerStateDeltaMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LedgerStateDelta
  }

  async getLightBlockHeaderProof(round: number | bigint): Promise<LightBlockHeaderProof> {
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
    })

    const responseMeta = LightBlockHeaderProofMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as LightBlockHeaderProof
  }

  /**
   * Get the list of pending transactions, sorted by priority, in decreasing order, truncated at the end at MAX. If MAX = 0, returns all pending transactions.
   */
  async getPendingTransactions(params?: { max?: number }): Promise<GetPendingTransactions> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/transactions/pending',
      path: {},
      query: { max: params?.max, format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
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
  async getPendingTransactionsByAddress(address: string, params?: { max?: number }): Promise<GetPendingTransactionsByAddress> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v2/accounts/{address}/transactions/pending',
      path: { address: address },
      query: { max: params?.max, format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
    })

    const responseMeta = GetPendingTransactionsByAddressMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetPendingTransactionsByAddress
  }

  async getReady(): Promise<void> {
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
    })

    const responseMeta = undefined
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as void
  }

  async getStateProof(round: number | bigint): Promise<StateProof> {
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
    })

    const responseMeta = StateProofMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as StateProof
  }

  async getStatus(): Promise<GetStatus> {
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
    })

    const responseMeta = GetStatusMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetStatus
  }

  async getSupply(): Promise<GetSupply> {
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
  async getSyncRound(): Promise<GetSyncRound> {
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
  async getTransactionGroupLedgerStateDeltasForRound(round: number | bigint): Promise<GetTransactionGroupLedgerStateDeltasForRound> {
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
  async getVersion(): Promise<Version> {
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
    })

    const responseMeta = VersionMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as Version
  }

  async healthCheck(): Promise<void> {
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
  async pendingTransactionInformation(txid: string): Promise<PendingTransactionResponse> {
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
    })

    const responseMeta = PendingTransactionResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PendingTransactionResponse
  }

  private async _rawTransaction(body: Uint8Array): Promise<RawTransaction> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const serializedBody = body ?? undefined
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
    })

    const responseMeta = RawTransactionMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as RawTransaction
  }

  /**
   * Sets the timestamp offset (seconds) for blocks in dev mode. Providing an offset of 0 will unset this value and try to use the real clock for the timestamp.
   */
  async setBlockTimeStampOffset(offset: number): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/devmode/blocks/offset/{offset}',
      path: { offset: offset },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
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
  async setSyncRound(round: number | bigint): Promise<void> {
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
    })

    const responseMeta = undefined
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as void
  }

  async simulateTransaction(body: SimulateRequest): Promise<SimulateTransaction> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const bodyMeta = SimulateRequestMeta
    const mediaType = bodyMeta ? AlgodApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = bodyMeta && body !== undefined ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/transactions/simulate',
      path: {},
      query: { format: 'msgpack' },
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    const responseMeta = SimulateTransactionMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as SimulateTransaction
  }

  /**
   * Given TEAL source code in plain text, return base64 encoded program bytes and base32 SHA512_256 hash of program bytes (Address style). This endpoint is only enabled when a node's configuration file sets EnableDeveloperAPI to true.
   */
  async tealCompile(body: string, params?: { sourcemap?: boolean }): Promise<TealCompile> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const bodyMeta = undefined
    const mediaType = bodyMeta ? AlgodApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = bodyMeta && body !== undefined ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/teal/compile',
      path: {},
      query: { sourcemap: params?.sourcemap },
      headers,
      body: serializedBody,
      mediaType: mediaType,
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
  async tealDisassemble(body: Uint8Array): Promise<TealDisassemble> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const serializedBody = body ?? undefined
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
  async tealDryrun(body?: DryrunRequest): Promise<TealDryrun> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const bodyMeta = DryrunRequestMeta
    const mediaType = bodyMeta ? AlgodApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = bodyMeta && body !== undefined ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v2/teal/dryrun',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    const responseMeta = TealDryrunMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as TealDryrun
  }

  private async _transactionParams(): Promise<TransactionParams> {
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
  async unsetSyncRound(): Promise<void> {
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
  async waitForBlock(round: number | bigint): Promise<WaitForBlock> {
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
    })

    const responseMeta = WaitForBlockMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as WaitForBlock
  }

  /**
   * Send a signed transaction or array of signed transactions to the network.
   */
  async sendRawTransaction(stxOrStxs: Uint8Array | Uint8Array[]): Promise<RawTransaction> {
    let rawTransactions = stxOrStxs
    if (Array.isArray(stxOrStxs)) {
      if (!stxOrStxs.every((a) => a instanceof Uint8Array)) {
        throw new Error('Array elements must be byte arrays')
      }
      rawTransactions = concatArrays(...stxOrStxs)
    } else if (!(rawTransactions instanceof Uint8Array)) {
      throw new Error('Argument must be byte array')
    }
    return this._rawTransaction(rawTransactions)
  }

  /**
   * Given an application ID and box name, it returns the round, box name, and value.
   */
  async getApplicationBoxByName(applicationId: number | bigint, boxName: Uint8Array): Promise<Box> {
    const name = `b64:${Buffer.from(boxName).toString('base64')}`
    return this._getApplicationBoxByName(applicationId, { name })
  }

  /**
   * Returns the common needed parameters for a new transaction.
   */
  async suggestedParams(): Promise<SuggestedParams> {
    const txnParams = await this._transactionParams()

    return {
      flatFee: false,
      fee: txnParams.fee,
      firstValid: txnParams.lastRound,
      lastValid: txnParams.lastRound + 1000n,
      genesisHash: txnParams.genesisHash,
      genesisId: txnParams.genesisId,
      minFee: txnParams.minFee,
      consensusVersion: txnParams.consensusVersion,
    }
  }

  /**
   * Returns the common needed parameters for a new transaction.
   */
  async getTransactionParams(): Promise<SuggestedParams> {
    return await this.suggestedParams()
  }
}
