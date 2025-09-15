import type { BaseHttpRequest, ApiRequestOptions } from "../core/BaseHttpRequest";
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
} from "../models/index";

export class AlgodApi {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Given a catchpoint, it aborts catching up to this catchpoint
   */
  abortCatchup(catchpoint: string, requestOptions?: ApiRequestOptions): Promise<AbortCatchup> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "DELETE",
      url: "/v2/catchup/{catchpoint}",
      path: { catchpoint: catchpoint },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Given a specific account public key and application ID, this call returns the account's application local state and global state (AppLocalState and AppParams, if either exists). Global state will only be returned if the provided address is the application's creator.
   */
  accountApplicationInformation(
    address: string,
    applicationId: number | bigint,
    params?: { format?: "json" | "msgpack" },
    requestOptions?: ApiRequestOptions,
  ): Promise<AccountApplicationInformation> {
    const headers: Record<string, string> = {};
    // Content negotiation (aligned with Rust behavior):
    // - Default to msgpack when available (better performance, smaller payload)
    // - Only use JSON if explicitly requested via format=json
    const useJson = params?.format === "json";
    headers["Accept"] = useJson ? "application/json" : "application/msgpack";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/accounts/{address}/applications/{application-id}",
      path: { address: address, "application-id": typeof applicationId === "bigint" ? applicationId.toString() : applicationId },
      query: { format: params?.format },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Given a specific account public key and asset ID, this call returns the account's asset holding and asset parameters (if either exist). Asset parameters will only be returned if the provided address is the asset's creator.
   */
  accountAssetInformation(
    address: string,
    assetId: number | bigint,
    params?: { format?: "json" | "msgpack" },
    requestOptions?: ApiRequestOptions,
  ): Promise<AccountAssetInformation> {
    const headers: Record<string, string> = {};
    // Content negotiation (aligned with Rust behavior):
    // - Default to msgpack when available (better performance, smaller payload)
    // - Only use JSON if explicitly requested via format=json
    const useJson = params?.format === "json";
    headers["Accept"] = useJson ? "application/json" : "application/msgpack";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/accounts/{address}/assets/{asset-id}",
      path: { address: address, "asset-id": typeof assetId === "bigint" ? assetId.toString() : assetId },
      query: { format: params?.format },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Lookup an account's asset holdings.
   */
  accountAssetsInformation(
    address: string,
    params?: { limit?: number | bigint; next?: string },
    requestOptions?: ApiRequestOptions,
  ): Promise<AccountAssetsInformation> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/accounts/{address}/assets",
      path: { address: address },
      query: { limit: typeof params?.limit === "bigint" ? (params!.limit as bigint).toString() : params?.limit, next: params?.next },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Given a specific account public key, this call returns the account's status, balance and spendable amounts
   */
  accountInformation(
    address: string,
    params?: { exclude?: "all" | "none"; format?: "json" | "msgpack" },
    requestOptions?: ApiRequestOptions,
  ): Promise<Account> {
    const headers: Record<string, string> = {};
    // Content negotiation (aligned with Rust behavior):
    // - Default to msgpack when available (better performance, smaller payload)
    // - Only use JSON if explicitly requested via format=json
    const useJson = params?.format === "json";
    headers["Accept"] = useJson ? "application/json" : "application/msgpack";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/accounts/{address}",
      path: { address: address },
      query: { exclude: params?.exclude, format: params?.format },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  addParticipationKey(params?: { body: string }, requestOptions?: ApiRequestOptions): Promise<AddParticipationKey> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";
    headers["Content-Type"] = "application/msgpack";

    // Header parameters

    return this.httpRequest.request({
      method: "POST",
      url: "/v2/participation",
      path: {},
      query: {},
      headers,
      body: params?.body,
      // Only msgpack supported for request body
      mediaType: "application/msgpack",
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Given a participation ID, append state proof keys to a particular set of participation keys
   */
  appendKeys(participationId: string, params?: { body: string }, requestOptions?: ApiRequestOptions): Promise<ParticipationKey> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";
    headers["Content-Type"] = "application/msgpack";

    // Header parameters

    return this.httpRequest.request({
      method: "POST",
      url: "/v2/participation/{participation-id}",
      path: { "participation-id": participationId },
      query: {},
      headers,
      body: params?.body,
      // Only msgpack supported for request body
      mediaType: "application/msgpack",
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Delete a given participation key by ID
   */
  deleteParticipationKeyById(participationId: string, requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "DELETE",
      url: "/v2/participation/{participation-id}",
      path: { "participation-id": participationId },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  experimentalCheck(requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/experimental",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  generateParticipationKeys(
    address: string,
    params?: { dilution?: number | bigint; first: number | bigint; last: number | bigint },
    requestOptions?: ApiRequestOptions,
  ): Promise<string> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "POST",
      url: "/v2/participation/generate/{address}",
      path: { address: address },
      query: {
        dilution: typeof params?.dilution === "bigint" ? (params!.dilution as bigint).toString() : params?.dilution,
        first: typeof params?.first === "bigint" ? (params!.first as bigint).toString() : params?.first,
        last: typeof params?.last === "bigint" ? (params!.last as bigint).toString() : params?.last,
      },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Given an application ID and box name, it returns the round, box name, and value (each base64 encoded). Box names must be in the goal app call arg encoding form 'encoding:value'. For ints, use the form 'int:1234'. For raw bytes, use the form 'b64:A=='. For printable strings, use the form 'str:hello'. For addresses, use the form 'addr:XYZ...'.
   */
  getApplicationBoxByName(applicationId: number | bigint, params?: { name: string }, requestOptions?: ApiRequestOptions): Promise<Box> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/applications/{application-id}/box",
      path: { "application-id": typeof applicationId === "bigint" ? applicationId.toString() : applicationId },
      query: { name: params?.name },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Given an application ID, return all Box names. No particular ordering is guaranteed. Request fails when client or server-side configured limits prevent returning all Box names.
   */
  getApplicationBoxes(
    applicationId: number | bigint,
    params?: { max?: number | bigint },
    requestOptions?: ApiRequestOptions,
  ): Promise<GetApplicationBoxes> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/applications/{application-id}/boxes",
      path: { "application-id": typeof applicationId === "bigint" ? applicationId.toString() : applicationId },
      query: { max: typeof params?.max === "bigint" ? (params!.max as bigint).toString() : params?.max },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Given a application ID, it returns application information including creator, approval and clear programs, global and local schemas, and global state.
   */
  getApplicationById(applicationId: number | bigint, requestOptions?: ApiRequestOptions): Promise<Application> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/applications/{application-id}",
      path: { "application-id": typeof applicationId === "bigint" ? applicationId.toString() : applicationId },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Given a asset ID, it returns asset information including creator, name, total supply and special addresses.
   */
  getAssetById(assetId: number | bigint, requestOptions?: ApiRequestOptions): Promise<Asset> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/assets/{asset-id}",
      path: { "asset-id": typeof assetId === "bigint" ? assetId.toString() : assetId },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  getBlock(
    round: number | bigint,
    params?: { headerOnly?: boolean; format?: "json" | "msgpack" },
    requestOptions?: ApiRequestOptions,
  ): Promise<GetBlock> {
    const headers: Record<string, string> = {};
    // Content negotiation (aligned with Rust behavior):
    // - Default to msgpack when available (better performance, smaller payload)
    // - Only use JSON if explicitly requested via format=json
    const useJson = params?.format === "json";
    headers["Accept"] = useJson ? "application/json" : "application/msgpack";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/blocks/{round}",
      path: { round: typeof round === "bigint" ? round.toString() : round },
      query: { "header-only": params?.headerOnly, format: params?.format },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  getBlockHash(round: number | bigint, requestOptions?: ApiRequestOptions): Promise<GetBlockHash> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/blocks/{round}/hash",
      path: { round: typeof round === "bigint" ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Get all of the logs from outer and inner app calls in the given round
   */
  getBlockLogs(round: number | bigint, requestOptions?: ApiRequestOptions): Promise<GetBlockLogs> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/blocks/{round}/logs",
      path: { round: typeof round === "bigint" ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Gets the current timestamp offset.
   */
  getBlockTimeStampOffset(requestOptions?: ApiRequestOptions): Promise<GetBlockTimeStampOffset> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/devmode/blocks/offset",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  getBlockTxids(round: number | bigint, requestOptions?: ApiRequestOptions): Promise<GetBlockTxids> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/blocks/{round}/txids",
      path: { round: typeof round === "bigint" ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Returns the merged (defaults + overrides) config file in json.
   */
  getConfig(requestOptions?: ApiRequestOptions): Promise<string> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/debug/settings/config",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Retrieves the current settings for blocking and mutex profiles
   */
  getDebugSettingsProf(requestOptions?: ApiRequestOptions): Promise<DebugSettingsProf> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/debug/settings/pprof",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Returns the entire genesis file in json.
   */
  getGenesis(requestOptions?: ApiRequestOptions): Promise<Genesis> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/genesis",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Get ledger deltas for a round.
   */
  getLedgerStateDelta(
    round: number | bigint,
    params?: { format?: "json" | "msgpack" },
    requestOptions?: ApiRequestOptions,
  ): Promise<LedgerStateDelta> {
    const headers: Record<string, string> = {};
    // Content negotiation (aligned with Rust behavior):
    // - Default to msgpack when available (better performance, smaller payload)
    // - Only use JSON if explicitly requested via format=json
    const useJson = params?.format === "json";
    headers["Accept"] = useJson ? "application/json" : "application/msgpack";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/deltas/{round}",
      path: { round: typeof round === "bigint" ? round.toString() : round },
      query: { format: params?.format },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Get a ledger delta for a given transaction group.
   */
  getLedgerStateDeltaForTransactionGroup(
    id: string,
    params?: { format?: "json" | "msgpack" },
    requestOptions?: ApiRequestOptions,
  ): Promise<LedgerStateDelta> {
    const headers: Record<string, string> = {};
    // Content negotiation (aligned with Rust behavior):
    // - Default to msgpack when available (better performance, smaller payload)
    // - Only use JSON if explicitly requested via format=json
    const useJson = params?.format === "json";
    headers["Accept"] = useJson ? "application/json" : "application/msgpack";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/deltas/txn/group/{id}",
      path: { id: id },
      query: { format: params?.format },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  getLightBlockHeaderProof(round: number | bigint, requestOptions?: ApiRequestOptions): Promise<LightBlockHeaderProof> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/blocks/{round}/lightheader/proof",
      path: { round: typeof round === "bigint" ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Given a participation ID, return information about that participation key
   */
  getParticipationKeyById(participationId: string, requestOptions?: ApiRequestOptions): Promise<ParticipationKey> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/participation/{participation-id}",
      path: { "participation-id": participationId },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Return a list of participation keys
   */
  getParticipationKeys(requestOptions?: ApiRequestOptions): Promise<ParticipationKey[]> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/participation",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Get the list of pending transactions, sorted by priority, in decreasing order, truncated at the end at MAX. If MAX = 0, returns all pending transactions.
   */
  getPendingTransactions(
    params?: { max?: number | bigint; format?: "json" | "msgpack" },
    requestOptions?: ApiRequestOptions,
  ): Promise<GetPendingTransactions> {
    const headers: Record<string, string> = {};
    // Content negotiation (aligned with Rust behavior):
    // - Default to msgpack when available (better performance, smaller payload)
    // - Only use JSON if explicitly requested via format=json
    const useJson = params?.format === "json";
    headers["Accept"] = useJson ? "application/json" : "application/msgpack";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/transactions/pending",
      path: {},
      query: { max: typeof params?.max === "bigint" ? (params!.max as bigint).toString() : params?.max, format: params?.format },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Get the list of pending transactions by address, sorted by priority, in decreasing order, truncated at the end at MAX. If MAX = 0, returns all pending transactions.
   */
  getPendingTransactionsByAddress(
    address: string,
    params?: { max?: number | bigint; format?: "json" | "msgpack" },
    requestOptions?: ApiRequestOptions,
  ): Promise<GetPendingTransactionsByAddress> {
    const headers: Record<string, string> = {};
    // Content negotiation (aligned with Rust behavior):
    // - Default to msgpack when available (better performance, smaller payload)
    // - Only use JSON if explicitly requested via format=json
    const useJson = params?.format === "json";
    headers["Accept"] = useJson ? "application/json" : "application/msgpack";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/accounts/{address}/transactions/pending",
      path: { address: address },
      query: { max: typeof params?.max === "bigint" ? (params!.max as bigint).toString() : params?.max, format: params?.format },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  getReady(requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/ready",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  getStateProof(round: number | bigint, requestOptions?: ApiRequestOptions): Promise<StateProof> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/stateproofs/{round}",
      path: { round: typeof round === "bigint" ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  getStatus(requestOptions?: ApiRequestOptions): Promise<GetStatus> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/status",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  getSupply(requestOptions?: ApiRequestOptions): Promise<GetSupply> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/ledger/supply",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Gets the minimum sync round for the ledger.
   */
  getSyncRound(requestOptions?: ApiRequestOptions): Promise<GetSyncRound> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/ledger/sync",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Get ledger deltas for transaction groups in a given round.
   */
  getTransactionGroupLedgerStateDeltasForRound(
    round: number | bigint,
    params?: { format?: "json" | "msgpack" },
    requestOptions?: ApiRequestOptions,
  ): Promise<GetTransactionGroupLedgerStateDeltasForRound> {
    const headers: Record<string, string> = {};
    // Content negotiation (aligned with Rust behavior):
    // - Default to msgpack when available (better performance, smaller payload)
    // - Only use JSON if explicitly requested via format=json
    const useJson = params?.format === "json";
    headers["Accept"] = useJson ? "application/json" : "application/msgpack";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/deltas/{round}/txn/group",
      path: { round: typeof round === "bigint" ? round.toString() : round },
      query: { format: params?.format },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  getTransactionProof(
    round: number | bigint,
    txid: string,
    params?: { hashtype?: "sha512_256" | "sha256"; format?: "json" | "msgpack" },
    requestOptions?: ApiRequestOptions,
  ): Promise<TransactionProof> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/blocks/{round}/transactions/{txid}/proof",
      path: { round: typeof round === "bigint" ? round.toString() : round, txid: txid },
      query: { hashtype: params?.hashtype, format: params?.format },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Retrieves the supported API versions, binary build versions, and genesis information.
   */
  getVersion(requestOptions?: ApiRequestOptions): Promise<Version> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/versions",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  healthCheck(requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/health",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  metrics(requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/metrics",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Given a transaction ID of a recently submitted transaction, it returns information about it.  There are several cases when this might succeed:
   * - transaction committed (committed round > 0)
   * - transaction still in the pool (committed round = 0, pool error = "")
   * - transaction removed from pool due to error (committed round = 0, pool error != "")
   * Or the transaction may have happened sufficiently long ago that the node no longer remembers it, and this will return an error.
   */
  pendingTransactionInformation(
    txid: string,
    params?: { format?: "json" | "msgpack" },
    requestOptions?: ApiRequestOptions,
  ): Promise<PendingTransactionResponse> {
    const headers: Record<string, string> = {};
    // Content negotiation (aligned with Rust behavior):
    // - Default to msgpack when available (better performance, smaller payload)
    // - Only use JSON if explicitly requested via format=json
    const useJson = params?.format === "json";
    headers["Accept"] = useJson ? "application/json" : "application/msgpack";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/transactions/pending/{txid}",
      path: { txid: txid },
      query: { format: params?.format },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Enables blocking and mutex profiles, and returns the old settings
   */
  putDebugSettingsProf(requestOptions?: ApiRequestOptions): Promise<DebugSettingsProf> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "PUT",
      url: "/debug/settings/pprof",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  rawTransaction(params?: { body: Uint8Array }, requestOptions?: ApiRequestOptions): Promise<RawTransaction> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";
    headers["Content-Type"] = "application/x-binary";

    // Header parameters

    return this.httpRequest.request({
      method: "POST",
      url: "/v2/transactions",
      path: {},
      query: {},
      headers,
      body: params?.body,
      mediaType: "application/x-binary",
      ...(requestOptions ?? {}),
    });
  }

  rawTransactionAsync(params?: { body: Uint8Array }, requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";
    headers["Content-Type"] = "application/x-binary";

    // Header parameters

    return this.httpRequest.request({
      method: "POST",
      url: "/v2/transactions/async",
      path: {},
      query: {},
      headers,
      body: params?.body,
      mediaType: "application/x-binary",
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Sets the timestamp offset (seconds) for blocks in dev mode. Providing an offset of 0 will unset this value and try to use the real clock for the timestamp.
   */
  setBlockTimeStampOffset(offset: number | bigint, requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "POST",
      url: "/v2/devmode/blocks/offset/{offset}",
      path: { offset: typeof offset === "bigint" ? offset.toString() : offset },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Sets the minimum sync round on the ledger.
   */
  setSyncRound(round: number | bigint, requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "POST",
      url: "/v2/ledger/sync/{round}",
      path: { round: typeof round === "bigint" ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Special management endpoint to shutdown the node. Optionally provide a timeout parameter to indicate that the node should begin shutting down after a number of seconds.
   */
  shutdownNode(params?: { timeout?: number | bigint }, requestOptions?: ApiRequestOptions): Promise<ShutdownNode> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "POST",
      url: "/v2/shutdown",
      path: {},
      query: { timeout: typeof params?.timeout === "bigint" ? (params!.timeout as bigint).toString() : params?.timeout },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  simulateTransaction(
    params?: { format?: "json" | "msgpack"; body: SimulateRequest },
    requestOptions?: ApiRequestOptions,
  ): Promise<SimulateTransaction> {
    const headers: Record<string, string> = {};
    // Content negotiation (aligned with Rust behavior):
    // - Default to msgpack when available (better performance, smaller payload)
    // - Only use JSON if explicitly requested via format=json
    const useJson = params?.format === "json";
    headers["Accept"] = useJson ? "application/json" : "application/msgpack";
    headers["Content-Type"] = params?.format === "json" ? "application/json" : "application/msgpack";

    // Header parameters

    return this.httpRequest.request({
      method: "POST",
      url: "/v2/transactions/simulate",
      path: {},
      query: { format: params?.format },
      headers,
      body: params?.body,
      // Dynamic mediaType based on format parameter (prefer msgpack by default)
      mediaType: params?.format === "json" ? "application/json" : "application/msgpack",
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Given a catchpoint, it starts catching up to this catchpoint
   */
  startCatchup(catchpoint: string, params?: { min?: number | bigint }, requestOptions?: ApiRequestOptions): Promise<StartCatchup> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "POST",
      url: "/v2/catchup/{catchpoint}",
      path: { catchpoint: catchpoint },
      query: { min: typeof params?.min === "bigint" ? (params!.min as bigint).toString() : params?.min },
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Returns the entire swagger spec in json.
   */
  swaggerJson(requestOptions?: ApiRequestOptions): Promise<string> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/swagger.json",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Given TEAL source code in plain text, return base64 encoded program bytes and base32 SHA512_256 hash of program bytes (Address style). This endpoint is only enabled when a node's configuration file sets EnableDeveloperAPI to true.
   */
  tealCompile(params?: { sourcemap?: boolean; body: string }, requestOptions?: ApiRequestOptions): Promise<TealCompile> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";
    headers["Content-Type"] = "text/plain";

    // Header parameters

    return this.httpRequest.request({
      method: "POST",
      url: "/v2/teal/compile",
      path: {},
      query: { sourcemap: params?.sourcemap },
      headers,
      body: params?.body,
      mediaType: "text/plain",
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Given the program bytes, return the TEAL source code in plain text. This endpoint is only enabled when a node's configuration file sets EnableDeveloperAPI to true.
   */
  tealDisassemble(params?: { body: Uint8Array }, requestOptions?: ApiRequestOptions): Promise<TealDisassemble> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";
    headers["Content-Type"] = "application/x-binary";

    // Header parameters

    return this.httpRequest.request({
      method: "POST",
      url: "/v2/teal/disassemble",
      path: {},
      query: {},
      headers,
      body: params?.body,
      mediaType: "application/x-binary",
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Executes TEAL program(s) in context and returns debugging information about the execution. This endpoint is only enabled when a node's configuration file sets EnableDeveloperAPI to true.
   */
  tealDryrun(params?: { body?: DryrunRequest }, requestOptions?: ApiRequestOptions): Promise<TealDryrun> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";
    headers["Content-Type"] = "application/msgpack";

    // Header parameters

    return this.httpRequest.request({
      method: "POST",
      url: "/v2/teal/dryrun",
      path: {},
      query: {},
      headers,
      body: params?.body,
      // Both supported, prefer msgpack for better performance
      mediaType: "application/msgpack",
      ...(requestOptions ?? {}),
    });
  }

  transactionParams(requestOptions?: ApiRequestOptions): Promise<TransactionParams> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/transactions/params",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Unset the ledger sync round.
   */
  unsetSyncRound(requestOptions?: ApiRequestOptions): Promise<void> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "DELETE",
      url: "/v2/ledger/sync",
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }

  /**
   * Waits for a block to appear after round {round} and returns the node's status at the time. There is a 1 minute timeout, when reached the current status is returned regardless of whether or not it is the round after the given round.
   */
  waitForBlock(round: number | bigint, requestOptions?: ApiRequestOptions): Promise<WaitForBlock> {
    const headers: Record<string, string> = {};
    headers["Accept"] = "application/json";

    // Header parameters

    return this.httpRequest.request({
      method: "GET",
      url: "/v2/status/wait-for-block-after/{round}",
      path: { round: typeof round === "bigint" ? round.toString() : round },
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    });
  }
}
