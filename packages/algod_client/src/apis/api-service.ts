import type { BaseHttpRequest } from '../core/base-http-request'
import { encodeMsgpack, decodeJson, decodeMsgpack } from '../core/model-runtime'
import { ReadableAddress, type EncodingFormat } from '@algorandfoundation/algokit-common'
import { concatArrays } from '@algorandfoundation/algokit-common'
import { decodeSignedTransaction } from '@algorandfoundation/algokit-transact'
import type {
  Account,
  AccountApplicationResponse,
  AccountAssetResponse,
  Application,
  Asset,
  BlockHashResponse,
  BlockResponse,
  BlockTxidsResponse,
  Box,
  BoxesResponse,
  CompileResponse,
  DisassembleResponse,
  Genesis,
  GetBlockTimeStampOffsetResponse,
  GetSyncRoundResponse,
  LedgerStateDelta,
  LightBlockHeaderProof,
  NodeStatusResponse,
  PendingTransactionResponse,
  PendingTransactionsResponse,
  PostTransactionsResponse,
  SimulateRequest,
  SimulateResponse,
  StateProof,
  SuggestedParams,
  SupplyResponse,
  TransactionGroupLedgerStateDeltasForRoundResponse,
  TransactionParametersResponse,
  TransactionProof,
  Version,
} from '../models/index'
import {
  AccountMeta,
  AccountApplicationResponseMeta,
  AccountAssetResponseMeta,
  ApplicationMeta,
  AssetMeta,
  BlockHashResponseMeta,
  BlockResponseMeta,
  BlockTxidsResponseMeta,
  BoxMeta,
  BoxesResponseMeta,
  CompileResponseMeta,
  DisassembleResponseMeta,
  GenesisMeta,
  GetBlockTimeStampOffsetResponseMeta,
  GetSyncRoundResponseMeta,
  LedgerStateDeltaMeta,
  LightBlockHeaderProofMeta,
  NodeStatusResponseMeta,
  PendingTransactionResponseMeta,
  PendingTransactionsResponseMeta,
  PostTransactionsResponseMeta,
  SimulateRequestMeta,
  SimulateResponseMeta,
  StateProofMeta,
  SupplyResponseMeta,
  TransactionGroupLedgerStateDeltasForRoundResponseMeta,
  TransactionParametersResponseMeta,
  TransactionProofMeta,
  VersionMeta,
} from '../models/index'

export class AlgodApi {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  private mimeTypeFor(format: EncodingFormat | 'text'): string {
    return format === 'json' ? 'application/json' : format === 'msgpack' ? 'application/msgpack' : 'text/plain'
  }

  /**
   * Given a specific account public key and application ID, this call returns the account's application local state and global state (AppLocalState and AppParams, if either exists). Global state will only be returned if the provided address is the application's creator.
   */
  async accountApplicationInformation(address: ReadableAddress, applicationId: number | bigint): Promise<AccountApplicationResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/accounts/{address}/applications/{application-id}',
      path: { address: address, 'application-id': applicationId },
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, AccountApplicationResponseMeta)
  }

  /**
   * Given a specific account public key and asset ID, this call returns the account's asset holding and asset parameters (if either exist). Asset parameters will only be returned if the provided address is the asset's creator.
   */
  async accountAssetInformation(address: ReadableAddress, assetId: number | bigint): Promise<AccountAssetResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/accounts/{address}/assets/{asset-id}',
      path: { address: address, 'asset-id': assetId },
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, AccountAssetResponseMeta)
  }

  /**
   * Given a specific account public key, this call returns the account's status, balance and spendable amounts
   */
  async accountInformation(address: ReadableAddress, params?: { exclude?: 'all' | 'none' }): Promise<Account> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/accounts/{address}',
      path: { address: address },
      query: { exclude: params?.exclude },
      headers,
      body: undefined,
    })

    return decodeJson(payload, AccountMeta)
  }

  /**
   * Given an application ID and box name, it returns the round, box name, and value (each base64 encoded). Box names must be in the goal app call arg encoding form 'encoding:value'. For ints, use the form 'int:1234'. For raw bytes, use the form 'b64:A=='. For printable strings, use the form 'str:hello'. For addresses, use the form 'addr:XYZ...'.
   */
  private async _getApplicationBoxByName(applicationId: number | bigint, params?: { name: string }): Promise<Box> {
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
   * Given an application ID, return all Box names. No particular ordering is guaranteed. Request fails when client or server-side configured limits prevent returning all Box names.
   */
  async getApplicationBoxes(applicationId: number | bigint, params?: { max?: number }): Promise<BoxesResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/applications/{application-id}/boxes',
      path: { 'application-id': applicationId },
      query: { max: params?.max },
      headers,
      body: undefined,
    })

    return decodeJson(payload, BoxesResponseMeta)
  }

  /**
   * Given a application ID, it returns application information including creator, approval and clear programs, global and local schemas, and global state.
   */
  async getApplicationById(applicationId: number | bigint): Promise<Application> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/applications/{application-id}',
      path: { 'application-id': applicationId },
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, ApplicationMeta)
  }

  /**
   * Given a asset ID, it returns asset information including creator, name, total supply and special addresses.
   */
  async getAssetById(assetId: number | bigint): Promise<Asset> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/assets/{asset-id}',
      path: { 'asset-id': assetId },
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, AssetMeta)
  }

  async getBlock(round: number | bigint, params?: { headerOnly?: boolean }): Promise<BlockResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'msgpack'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'GET',
      url: '/v2/blocks/{round}',
      path: { round: round },
      query: { 'header-only': params?.headerOnly, format: 'msgpack' },
      headers,
      body: undefined,
    })

    return decodeMsgpack(payload, BlockResponseMeta)
  }

  async getBlockHash(round: number | bigint): Promise<BlockHashResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/blocks/{round}/hash',
      path: { round: round },
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, BlockHashResponseMeta)
  }

  /**
   * Gets the current timestamp offset.
   */
  async getBlockTimeStampOffset(): Promise<GetBlockTimeStampOffsetResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/devmode/blocks/offset',
      path: {},
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, GetBlockTimeStampOffsetResponseMeta)
  }

  async getBlockTxIds(round: number | bigint): Promise<BlockTxidsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/blocks/{round}/txids',
      path: { round: round },
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, BlockTxidsResponseMeta)
  }

  /**
   * Returns the entire genesis file in json.
   */
  async getGenesis(): Promise<Genesis> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/genesis',
      path: {},
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, GenesisMeta)
  }

  /**
   * Get ledger deltas for a round.
   */
  async getLedgerStateDelta(round: number | bigint): Promise<LedgerStateDelta> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'msgpack'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'GET',
      url: '/v2/deltas/{round}',
      path: { round: round },
      query: { format: 'msgpack' },
      headers,
      body: undefined,
    })

    return decodeMsgpack(payload, LedgerStateDeltaMeta)
  }

  /**
   * Get a ledger delta for a given transaction group.
   */
  async getLedgerStateDeltaForTransactionGroup(id: string): Promise<LedgerStateDelta> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'msgpack'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'GET',
      url: '/v2/deltas/txn/group/{id}',
      path: { id: id },
      query: { format: 'msgpack' },
      headers,
      body: undefined,
    })

    return decodeMsgpack(payload, LedgerStateDeltaMeta)
  }

  async getLightBlockHeaderProof(round: number | bigint): Promise<LightBlockHeaderProof> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/blocks/{round}/lightheader/proof',
      path: { round: round },
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, LightBlockHeaderProofMeta)
  }

  /**
   * Get the list of pending transactions, sorted by priority, in decreasing order, truncated at the end at MAX. If MAX = 0, returns all pending transactions.
   */
  async getPendingTransactions(params?: { max?: number }): Promise<PendingTransactionsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'msgpack'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'GET',
      url: '/v2/transactions/pending',
      path: {},
      query: { max: params?.max, format: 'msgpack' },
      headers,
      body: undefined,
    })

    return decodeMsgpack(payload, PendingTransactionsResponseMeta)
  }

  /**
   * Get the list of pending transactions by address, sorted by priority, in decreasing order, truncated at the end at MAX. If MAX = 0, returns all pending transactions.
   */
  async getPendingTransactionsByAddress(address: ReadableAddress, params?: { max?: number }): Promise<PendingTransactionsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'msgpack'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'GET',
      url: '/v2/accounts/{address}/transactions/pending',
      path: { address: address },
      query: { max: params?.max, format: 'msgpack' },
      headers,
      body: undefined,
    })

    return decodeMsgpack(payload, PendingTransactionsResponseMeta)
  }

  async getReady(): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    await this.httpRequest.request<void>({
      method: 'GET',
      url: '/ready',
      path: {},
      query: {},
      headers,
      body: undefined,
    })
  }

  async getStateProof(round: number | bigint): Promise<StateProof> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/stateproofs/{round}',
      path: { round: round },
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, StateProofMeta)
  }

  async getStatus(): Promise<NodeStatusResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/status',
      path: {},
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, NodeStatusResponseMeta)
  }

  async getSupply(): Promise<SupplyResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/ledger/supply',
      path: {},
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, SupplyResponseMeta)
  }

  /**
   * Gets the minimum sync round for the ledger.
   */
  async getSyncRound(): Promise<GetSyncRoundResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/ledger/sync',
      path: {},
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, GetSyncRoundResponseMeta)
  }

  /**
   * Get ledger deltas for transaction groups in a given round.
   */
  async getTransactionGroupLedgerStateDeltasForRound(round: number | bigint): Promise<TransactionGroupLedgerStateDeltasForRoundResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'msgpack'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'GET',
      url: '/v2/deltas/{round}/txn/group',
      path: { round: round },
      query: { format: 'msgpack' },
      headers,
      body: undefined,
    })

    return decodeMsgpack(payload, TransactionGroupLedgerStateDeltasForRoundResponseMeta)
  }

  async getTransactionProof(
    round: number | bigint,
    txId: string,
    params?: { hashtype?: 'sha512_256' | 'sha256' },
  ): Promise<TransactionProof> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/blocks/{round}/transactions/{txid}/proof',
      path: { round: round, txid: txId },
      query: { hashtype: params?.hashtype },
      headers,
      body: undefined,
    })

    return decodeJson(payload, TransactionProofMeta)
  }

  /**
   * Retrieves the supported API versions, binary build versions, and genesis information.
   */
  async getVersion(): Promise<Version> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/versions',
      path: {},
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, VersionMeta)
  }

  async healthCheck(): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    await this.httpRequest.request<void>({
      method: 'GET',
      url: '/health',
      path: {},
      query: {},
      headers,
      body: undefined,
    })
  }

  /**
   * Given a transaction ID of a recently submitted transaction, it returns information about it.  There are several cases when this might succeed:
   * - transaction committed (committed round > 0)
   * - transaction still in the pool (committed round = 0, pool error = "")
   * - transaction removed from pool due to error (committed round = 0, pool error != "")
   * Or the transaction may have happened sufficiently long ago that the node no longer remembers it, and this will return an error.
   */
  async pendingTransactionInformation(txId: string): Promise<PendingTransactionResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'msgpack'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'GET',
      url: '/v2/transactions/pending/{txid}',
      path: { txid: txId },
      query: { format: 'msgpack' },
      headers,
      body: undefined,
    })

    return decodeMsgpack(payload, PendingTransactionResponseMeta)
  }

  private async _rawTransaction(body: Uint8Array): Promise<PostTransactionsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const serializedBody = body ?? undefined
    const mediaType = 'application/x-binary'
    headers['Content-Type'] = mediaType

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v2/transactions',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostTransactionsResponseMeta)
  }

  /**
   * Sets the timestamp offset (seconds) for blocks in dev mode. Providing an offset of 0 will unset this value and try to use the real clock for the timestamp.
   */
  async setBlockTimeStampOffset(offset: number): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    await this.httpRequest.request<void>({
      method: 'POST',
      url: '/v2/devmode/blocks/offset/{offset}',
      path: { offset: offset },
      query: {},
      headers,
      body: undefined,
    })
  }

  /**
   * Sets the minimum sync round on the ledger.
   */
  async setSyncRound(round: number | bigint): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    await this.httpRequest.request<void>({
      method: 'POST',
      url: '/v2/ledger/sync/{round}',
      path: { round: round },
      query: {},
      headers,
      body: undefined,
    })
  }

  async simulateTransactions(body: SimulateRequest): Promise<SimulateResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'msgpack'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = SimulateRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeMsgpack(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Uint8Array>({
      method: 'POST',
      url: '/v2/transactions/simulate',
      path: {},
      query: { format: 'msgpack' },
      headers,
      body: serializedBody,
    })

    return decodeMsgpack(payload, SimulateResponseMeta)
  }

  /**
   * Waits for a block to appear after round {round} and returns the node's status at the time. There is a 1 minute timeout, when reached the current status is returned regardless of whether or not it is the round after the given round.
   */
  async statusAfterBlock(round: number | bigint): Promise<NodeStatusResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/status/wait-for-block-after/{round}',
      path: { round: round },
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, NodeStatusResponseMeta)
  }

  /**
   * Given TEAL source code in plain text, return base64 encoded program bytes and base32 SHA512_256 hash of program bytes (Address style). This endpoint is only enabled when a node's configuration file sets EnableDeveloperAPI to true.
   */
  async tealCompile(body: string, params?: { sourcemap?: boolean }): Promise<CompileResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = undefined
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v2/teal/compile',
      path: {},
      query: { sourcemap: params?.sourcemap },
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, CompileResponseMeta)
  }

  /**
   * Given the program bytes, return the TEAL source code in plain text. This endpoint is only enabled when a node's configuration file sets EnableDeveloperAPI to true.
   */
  async tealDisassemble(body: Uint8Array): Promise<DisassembleResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const serializedBody = body ?? undefined
    const mediaType = 'application/x-binary'
    headers['Content-Type'] = mediaType

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v2/teal/disassemble',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, DisassembleResponseMeta)
  }

  private async _transactionParams(): Promise<TransactionParametersResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v2/transactions/params',
      path: {},
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, TransactionParametersResponseMeta)
  }

  /**
   * Unset the ledger sync round.
   */
  async unsetSyncRound(): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    await this.httpRequest.request<void>({
      method: 'DELETE',
      url: '/v2/ledger/sync',
      path: {},
      query: {},
      headers,
      body: undefined,
    })
  }

  /**
   * Send a signed transaction or array of signed transactions to the network.
   */
  async sendRawTransaction(stxOrStxs: Uint8Array | Uint8Array[]): Promise<PostTransactionsResponse> {
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

  /**
   * Simulate an encoded signed transaction or array of encoded signed transactions.
   */
  async simulateRawTransactions(stxOrStxs: Uint8Array | Uint8Array[]): Promise<SimulateResponse> {
    const txns = Array.isArray(stxOrStxs) ? stxOrStxs.map((stxn) => decodeSignedTransaction(stxn)) : [decodeSignedTransaction(stxOrStxs)]
    return this.simulateTransactions({
      txnGroups: [
        {
          txns,
        },
      ],
    })
  }
}
