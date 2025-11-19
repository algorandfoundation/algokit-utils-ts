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
  async accountApplicationInformation(address: string, applicationId: number | bigint): Promise<AccountApplicationInformation> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/accounts/{address}/applications/{application-id}',
      path: { address: address, 'application-id': typeof applicationId === 'bigint' ? applicationId.toString() : applicationId },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, AccountApplicationInformationMeta, responseFormat)
  }

  /**
   * Given a specific account public key and asset ID, this call returns the account's asset holding and asset parameters (if either exist). Asset parameters will only be returned if the provided address is the asset's creator.
   */
  async accountAssetInformation(address: string, assetId: number | bigint): Promise<AccountAssetInformation> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/accounts/{address}/assets/{asset-id}',
      path: { address: address, 'asset-id': typeof assetId === 'bigint' ? assetId.toString() : assetId },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, AccountAssetInformationMeta, responseFormat)
  }

  /**
   * Given a specific account public key, this call returns the account's status, balance and spendable amounts
   */
  async accountInformation(address: string, params?: { exclude?: 'all' | 'none' }): Promise<Account> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/accounts/{address}',
      path: { address: address },
      query: { exclude: params?.exclude },
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, AccountMeta, responseFormat)
  }

  /**
   * Given an application ID and box name, it returns the round, box name, and value (each base64 encoded). Box names must be in the goal app call arg encoding form 'encoding:value'. For ints, use the form 'int:1234'. For raw bytes, use the form 'b64:A=='. For printable strings, use the form 'str:hello'. For addresses, use the form 'addr:XYZ...'.
   */
  private async _getApplicationBoxByName(applicationId: number | bigint, params?: { name: string }): Promise<Box> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/applications/{application-id}/box',
      path: { 'application-id': typeof applicationId === 'bigint' ? applicationId.toString() : applicationId },
      query: { name: params?.name },
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, BoxMeta, responseFormat)
  }

  /**
   * Given an application ID, return all Box names. No particular ordering is guaranteed. Request fails when client or server-side configured limits prevent returning all Box names.
   */
  async getApplicationBoxes(applicationId: number | bigint, params?: { max?: number }): Promise<GetApplicationBoxes> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/applications/{application-id}/boxes',
      path: { 'application-id': typeof applicationId === 'bigint' ? applicationId.toString() : applicationId },
      query: { max: params?.max },
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, GetApplicationBoxesMeta, responseFormat)
  }

  /**
   * Given a application ID, it returns application information including creator, approval and clear programs, global and local schemas, and global state.
   */
  async getApplicationById(applicationId: number | bigint): Promise<Application> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/applications/{application-id}',
      path: { 'application-id': typeof applicationId === 'bigint' ? applicationId.toString() : applicationId },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, ApplicationMeta, responseFormat)
  }

  /**
   * Given a asset ID, it returns asset information including creator, name, total supply and special addresses.
   */
  async getAssetById(assetId: number | bigint): Promise<Asset> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/assets/{asset-id}',
      path: { 'asset-id': typeof assetId === 'bigint' ? assetId.toString() : assetId },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, AssetMeta, responseFormat)
  }

  async getBlock(round: number | bigint, params?: { headerOnly?: boolean }): Promise<GetBlock> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'GET',
      url: '/v2/blocks/{round}',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: { 'header-only': params?.headerOnly, format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, GetBlockMeta, responseFormat)
  }

  async getBlockHash(round: number | bigint): Promise<GetBlockHash> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/blocks/{round}/hash',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, GetBlockHashMeta, responseFormat)
  }

  /**
   * Gets the current timestamp offset.
   */
  async getBlockTimeStampOffset(): Promise<GetBlockTimeStampOffset> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/devmode/blocks/offset',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, GetBlockTimeStampOffsetMeta, responseFormat)
  }

  async getBlockTxIds(round: number | bigint): Promise<GetBlockTxIds> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/blocks/{round}/txids',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, GetBlockTxIdsMeta, responseFormat)
  }

  /**
   * Returns the entire genesis file in json.
   */
  async getGenesis(): Promise<Genesis> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/genesis',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, GenesisMeta, responseFormat)
  }

  /**
   * Get ledger deltas for a round.
   */
  async getLedgerStateDelta(round: number | bigint): Promise<LedgerStateDelta> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'GET',
      url: '/v2/deltas/{round}',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: { format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, LedgerStateDeltaMeta, responseFormat)
  }

  /**
   * Get a ledger delta for a given transaction group.
   */
  async getLedgerStateDeltaForTransactionGroup(id: string): Promise<LedgerStateDelta> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'GET',
      url: '/v2/deltas/txn/group/{id}',
      path: { id: id },
      query: { format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, LedgerStateDeltaMeta, responseFormat)
  }

  async getLightBlockHeaderProof(round: number | bigint): Promise<LightBlockHeaderProof> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/blocks/{round}/lightheader/proof',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, LightBlockHeaderProofMeta, responseFormat)
  }

  /**
   * Get the list of pending transactions, sorted by priority, in decreasing order, truncated at the end at MAX. If MAX = 0, returns all pending transactions.
   */
  async getPendingTransactions(params?: { max?: number }): Promise<GetPendingTransactions> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'GET',
      url: '/v2/transactions/pending',
      path: {},
      query: { max: params?.max, format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, GetPendingTransactionsMeta, responseFormat)
  }

  /**
   * Get the list of pending transactions by address, sorted by priority, in decreasing order, truncated at the end at MAX. If MAX = 0, returns all pending transactions.
   */
  async getPendingTransactionsByAddress(address: string, params?: { max?: number }): Promise<GetPendingTransactionsByAddress> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'GET',
      url: '/v2/accounts/{address}/transactions/pending',
      path: { address: address },
      query: { max: params?.max, format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, GetPendingTransactionsByAddressMeta, responseFormat)
  }

  async getReady(): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    await this.httpRequest.request<void>({
      method: 'GET',
      url: '/ready',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })
  }

  async getStateProof(round: number | bigint): Promise<StateProof> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/stateproofs/{round}',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, StateProofMeta, responseFormat)
  }

  async getStatus(): Promise<GetStatus> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/status',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, GetStatusMeta, responseFormat)
  }

  async getSupply(): Promise<GetSupply> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/ledger/supply',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, GetSupplyMeta, responseFormat)
  }

  /**
   * Gets the minimum sync round for the ledger.
   */
  async getSyncRound(): Promise<GetSyncRound> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/ledger/sync',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, GetSyncRoundMeta, responseFormat)
  }

  /**
   * Get ledger deltas for transaction groups in a given round.
   */
  async getTransactionGroupLedgerStateDeltasForRound(round: number | bigint): Promise<GetTransactionGroupLedgerStateDeltasForRound> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'GET',
      url: '/v2/deltas/{round}/txn/group',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: { format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, GetTransactionGroupLedgerStateDeltasForRoundMeta, responseFormat)
  }

  async getTransactionProof(
    round: number | bigint,
    txid: string,
    params?: { hashtype?: 'sha512_256' | 'sha256' },
  ): Promise<TransactionProof> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/blocks/{round}/transactions/{txid}/proof',
      path: { round: typeof round === 'bigint' ? round.toString() : round, txid: txid },
      query: { hashtype: params?.hashtype },
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, TransactionProofMeta, responseFormat)
  }

  /**
   * Retrieves the supported API versions, binary build versions, and genesis information.
   */
  async getVersion(): Promise<Version> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/versions',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, VersionMeta, responseFormat)
  }

  async healthCheck(): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    await this.httpRequest.request<void>({
      method: 'GET',
      url: '/health',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })
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

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'GET',
      url: '/v2/transactions/pending/{txid}',
      path: { txid: txid },
      query: { format: 'msgpack' },
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, PendingTransactionResponseMeta, responseFormat)
  }

  private async _rawTransaction(body: Uint8Array): Promise<RawTransaction> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const serializedBody = body ?? undefined
    const mediaType = 'application/msgpack'
    headers['Content-Type'] = mediaType

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v2/transactions',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, RawTransactionMeta, responseFormat)
  }

  /**
   * Sets the timestamp offset (seconds) for blocks in dev mode. Providing an offset of 0 will unset this value and try to use the real clock for the timestamp.
   */
  async setBlockTimeStampOffset(offset: number): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    await this.httpRequest.request<void>({
      method: 'POST',
      url: '/v2/devmode/blocks/offset/{offset}',
      path: { offset: offset },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })
  }

  /**
   * Sets the minimum sync round on the ledger.
   */
  async setSyncRound(round: number | bigint): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    await this.httpRequest.request<void>({
      method: 'POST',
      url: '/v2/ledger/sync/{round}',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })
  }

  async simulateTransaction(body: SimulateRequest): Promise<SimulateTransaction> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'msgpack'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const bodyMeta = SimulateRequestMeta
    const mediaType = bodyMeta ? AlgodApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'POST',
      url: '/v2/transactions/simulate',
      path: {},
      query: { format: 'msgpack' },
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, SimulateTransactionMeta, responseFormat)
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
    const serializedBody = body

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v2/teal/compile',
      path: {},
      query: { sourcemap: params?.sourcemap },
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, TealCompileMeta, responseFormat)
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

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v2/teal/disassemble',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, TealDisassembleMeta, responseFormat)
  }

  /**
   * Executes TEAL program(s) in context and returns debugging information about the execution. This endpoint is only enabled when a node's configuration file sets EnableDeveloperAPI to true.
   */
  async tealDryrun(body?: DryrunRequest): Promise<TealDryrun> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const bodyMeta = DryrunRequestMeta
    const mediaType = bodyMeta ? AlgodApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v2/teal/dryrun',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, TealDryrunMeta, responseFormat)
  }

  private async _transactionParams(): Promise<TransactionParams> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/transactions/params',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, TransactionParamsMeta, responseFormat)
  }

  /**
   * Unset the ledger sync round.
   */
  async unsetSyncRound(): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    await this.httpRequest.request<void>({
      method: 'DELETE',
      url: '/v2/ledger/sync',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })
  }

  /**
   * Waits for a block to appear after round {round} and returns the node's status at the time. There is a 1 minute timeout, when reached the current status is returned regardless of whether or not it is the round after the given round.
   */
  async waitForBlock(round: number | bigint): Promise<WaitForBlock> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = AlgodApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v2/status/wait-for-block-after/{round}',
      path: { round: typeof round === 'bigint' ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, WaitForBlockMeta, responseFormat)
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
