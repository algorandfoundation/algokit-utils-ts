import type { BaseHttpRequest, ApiRequestOptions } from '../core/base-http-request'
import { AlgorandSerializer } from '../core/model-runtime'
import type { BodyFormat } from '../core/model-runtime'
import type {
  CreateWalletRequest,
  DeleteKeyResponse,
  DeleteMultisigResponse,
  ExportKeyRequest,
  ExportMasterKeyRequest,
  ExportMultisigRequest,
  GenerateKeyRequest,
  GetWalletsResponse,
  ImportKeyRequest,
  ImportMultisigRequest,
  InitWalletHandleTokenRequest,
  ListKeysRequest,
  ListMultisigRequest,
  PostKeyExportResponse,
  PostKeyImportResponse,
  PostKeyListResponse,
  PostKeyResponse,
  PostMasterKeyExportResponse,
  PostMultisigExportResponse,
  PostMultisigImportResponse,
  PostMultisigListResponse,
  PostMultisigProgramSignResponse,
  PostMultisigTransactionSignResponse,
  PostProgramSignResponse,
  PostTransactionSignResponse,
  PostWalletInfoResponse,
  PostWalletInitResponse,
  PostWalletReleaseResponse,
  PostWalletRenameResponse,
  PostWalletRenewResponse,
  PostWalletResponse,
  ReleaseWalletHandleTokenRequest,
  RenameWalletRequest,
  RenewWalletHandleTokenRequest,
  SignMultisigRequest,
  SignProgramMultisigRequest,
  SignProgramRequest,
  SignTransactionRequest,
  VersionsResponse,
  WalletInfoRequest,
} from '../models/index'
import {
  CreateWalletRequestMeta,
  DeleteKeyResponseMeta,
  DeleteMultisigResponseMeta,
  ExportKeyRequestMeta,
  ExportMasterKeyRequestMeta,
  ExportMultisigRequestMeta,
  GenerateKeyRequestMeta,
  GetWalletsResponseMeta,
  ImportKeyRequestMeta,
  ImportMultisigRequestMeta,
  InitWalletHandleTokenRequestMeta,
  ListKeysRequestMeta,
  ListMultisigRequestMeta,
  PostKeyExportResponseMeta,
  PostKeyImportResponseMeta,
  PostKeyListResponseMeta,
  PostKeyResponseMeta,
  PostMasterKeyExportResponseMeta,
  PostMultisigExportResponseMeta,
  PostMultisigImportResponseMeta,
  PostMultisigListResponseMeta,
  PostMultisigProgramSignResponseMeta,
  PostMultisigTransactionSignResponseMeta,
  PostProgramSignResponseMeta,
  PostTransactionSignResponseMeta,
  PostWalletInfoResponseMeta,
  PostWalletInitResponseMeta,
  PostWalletReleaseResponseMeta,
  PostWalletRenameResponseMeta,
  PostWalletRenewResponseMeta,
  PostWalletResponseMeta,
  ReleaseWalletHandleTokenRequestMeta,
  RenameWalletRequestMeta,
  RenewWalletHandleTokenRequestMeta,
  SignMultisigRequestMeta,
  SignProgramMultisigRequestMeta,
  SignProgramRequestMeta,
  SignTransactionRequestMeta,
  VersionsResponseMeta,
  WalletInfoRequestMeta,
} from '../models/index'

export class KmdApi {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  private static acceptFor(format: BodyFormat): string {
    return format === 'json' ? 'application/json' : 'application/msgpack'
  }

  private static mediaFor(format: BodyFormat): string {
    return format === 'json' ? 'application/json' : 'application/msgpack'
  }

  /**
   * Create a new wallet (collection of keys) with the given parameters.
   */
  async createWallet(params?: { body: CreateWalletRequest }, requestOptions?: ApiRequestOptions): Promise<PostWalletResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = CreateWalletRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/wallet',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostWalletResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostWalletResponse
  }

  /**
   * Deletes the key with the passed public key from the wallet.
   */
  async deleteKey(requestOptions?: ApiRequestOptions): Promise<DeleteKeyResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'DELETE',
      url: '/v1/key',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = DeleteKeyResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as DeleteKeyResponse
  }

  /**
   * Deletes multisig preimage information for the passed address from the wallet.
   */
  async deleteMultisig(requestOptions?: ApiRequestOptions): Promise<DeleteMultisigResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'DELETE',
      url: '/v1/multisig',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = DeleteMultisigResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as DeleteMultisigResponse
  }

  /**
   * Export the secret key associated with the passed public key.
   */
  async exportKey(params?: { body: ExportKeyRequest }, requestOptions?: ApiRequestOptions): Promise<PostKeyExportResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ExportKeyRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/key/export',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostKeyExportResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostKeyExportResponse
  }

  /**
   * Export the master derivation key from the wallet. This key is a master "backup" key for the underlying wallet. With it, you can regenerate all of the wallets that have been generated with this wallet's `POST /v1/key` endpoint. This key will not allow you to recover keys imported from other wallets, however.
   */
  async exportMasterKey(
    params?: { body: ExportMasterKeyRequest },
    requestOptions?: ApiRequestOptions,
  ): Promise<PostMasterKeyExportResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ExportMasterKeyRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/master-key/export',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostMasterKeyExportResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostMasterKeyExportResponse
  }

  /**
   * Given a multisig address whose preimage this wallet stores, returns the information used to generate the address, including public keys, threshold, and multisig version.
   */
  async exportMultisig(params?: { body: ExportMultisigRequest }, requestOptions?: ApiRequestOptions): Promise<PostMultisigExportResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ExportMultisigRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/multisig/export',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostMultisigExportResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostMultisigExportResponse
  }

  /**
   * Generates the next key in the deterministic key sequence (as determined by the master derivation key) and adds it to the wallet, returning the public key.
   */
  async generateKey(params?: { body: GenerateKeyRequest }, requestOptions?: ApiRequestOptions): Promise<PostKeyResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = GenerateKeyRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/key',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostKeyResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostKeyResponse
  }

  async getVersion(requestOptions?: ApiRequestOptions): Promise<VersionsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

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

    const responseMeta = VersionsResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as VersionsResponse
  }

  /**
   * Returns information about the wallet associated with the passed wallet handle token. Additionally returns expiration information about the token itself.
   */
  async getWalletInfo(params?: { body: WalletInfoRequest }, requestOptions?: ApiRequestOptions): Promise<PostWalletInfoResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = WalletInfoRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/wallet/info',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostWalletInfoResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostWalletInfoResponse
  }

  /**
   * Import an externally generated key into the wallet. Note that if you wish to back up the imported key, you must do so by backing up the entire wallet database, because imported keys were not derived from the wallet's master derivation key.
   */
  async importKey(params?: { body: ImportKeyRequest }, requestOptions?: ApiRequestOptions): Promise<PostKeyImportResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ImportKeyRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/key/import',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostKeyImportResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostKeyImportResponse
  }

  /**
   * Generates a multisig account from the passed public keys array and multisig metadata, and stores all of this in the wallet.
   */
  async importMultisig(params?: { body: ImportMultisigRequest }, requestOptions?: ApiRequestOptions): Promise<PostMultisigImportResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ImportMultisigRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/multisig/import',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostMultisigImportResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostMultisigImportResponse
  }

  /**
   * Unlock the wallet and return a wallet handle token that can be used for subsequent operations. These tokens expire periodically and must be renewed. You can `POST` the token to `/v1/wallet/info` to see how much time remains until expiration, and renew it with `/v1/wallet/renew`. When you're done, you can invalidate the token with `/v1/wallet/release`.
   */
  async initWalletHandleToken(
    params?: { body: InitWalletHandleTokenRequest },
    requestOptions?: ApiRequestOptions,
  ): Promise<PostWalletInitResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = InitWalletHandleTokenRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/wallet/init',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostWalletInitResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostWalletInitResponse
  }

  /**
   * Lists all of the public keys in this wallet. All of them have a stored private key.
   */
  async listKeysInWallet(params?: { body: ListKeysRequest }, requestOptions?: ApiRequestOptions): Promise<PostKeyListResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ListKeysRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/key/list',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostKeyListResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostKeyListResponse
  }

  /**
   * Lists all of the multisig accounts whose preimages this wallet stores
   */
  async listMultisg(params?: { body: ListMultisigRequest }, requestOptions?: ApiRequestOptions): Promise<PostMultisigListResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ListMultisigRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/multisig/list',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostMultisigListResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostMultisigListResponse
  }

  /**
   * Lists all of the wallets that kmd is aware of.
   */
  async listWallets(requestOptions?: ApiRequestOptions): Promise<GetWalletsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<unknown>({
      method: 'GET',
      url: '/v1/wallets',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
      ...(requestOptions ?? {}),
    })

    const responseMeta = GetWalletsResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as GetWalletsResponse
  }

  /**
   * Invalidate the passed wallet handle token, making it invalid for use in subsequent requests.
   */
  async releaseWalletHandleToken(
    params?: { body: ReleaseWalletHandleTokenRequest },
    requestOptions?: ApiRequestOptions,
  ): Promise<PostWalletReleaseResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ReleaseWalletHandleTokenRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/wallet/release',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostWalletReleaseResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostWalletReleaseResponse
  }

  /**
   * Rename the underlying wallet to something else
   */
  async renameWallet(params?: { body: RenameWalletRequest }, requestOptions?: ApiRequestOptions): Promise<PostWalletRenameResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = RenameWalletRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/wallet/rename',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostWalletRenameResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostWalletRenameResponse
  }

  /**
   * Renew a wallet handle token, increasing its expiration duration to its initial value
   */
  async renewWalletHandleToken(
    params?: { body: RenewWalletHandleTokenRequest },
    requestOptions?: ApiRequestOptions,
  ): Promise<PostWalletRenewResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = RenewWalletHandleTokenRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/wallet/renew',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostWalletRenewResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostWalletRenewResponse
  }

  /**
   * Start a multisig signature, or add a signature to a partially completed multisig signature object.
   */
  async signMultisigProgram(
    params?: { body: SignProgramMultisigRequest },
    requestOptions?: ApiRequestOptions,
  ): Promise<PostMultisigProgramSignResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = SignProgramMultisigRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/multisig/signprogram',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostMultisigProgramSignResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostMultisigProgramSignResponse
  }

  /**
   * Start a multisig signature, or add a signature to a partially completed multisig signature object.
   */
  async signMultisigTransaction(
    params?: { body: SignMultisigRequest },
    requestOptions?: ApiRequestOptions,
  ): Promise<PostMultisigTransactionSignResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = SignMultisigRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/multisig/sign',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostMultisigTransactionSignResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostMultisigTransactionSignResponse
  }

  /**
   * Signs the passed program with a key from the wallet, determined by the account named in the request.
   */
  async signProgram(params?: { body: SignProgramRequest }, requestOptions?: ApiRequestOptions): Promise<PostProgramSignResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = SignProgramRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/program/sign',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostProgramSignResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostProgramSignResponse
  }

  /**
   * Signs the passed transaction with a key from the wallet, determined by the sender encoded in the transaction.
   */
  async signTransaction(
    params?: { body: SignTransactionRequest },
    requestOptions?: ApiRequestOptions,
  ): Promise<PostTransactionSignResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = SignTransactionRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody =
      bodyMeta && params?.body !== undefined ? AlgorandSerializer.encode(params.body, bodyMeta, responseFormat) : params?.body

    const payload = await this.httpRequest.request<unknown>({
      method: 'POST',
      url: '/v1/transaction/sign',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
      ...(requestOptions ?? {}),
    })

    const responseMeta = PostTransactionSignResponseMeta
    if (responseMeta) {
      return AlgorandSerializer.decode(payload, responseMeta, responseFormat)
    }
    return payload as PostTransactionSignResponse
  }

  /**
   * Returns the entire swagger spec in json.
   */
  async swaggerHandler(requestOptions?: ApiRequestOptions): Promise<string> {
    const headers: Record<string, string> = {}
    const responseFormat: BodyFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

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
}
