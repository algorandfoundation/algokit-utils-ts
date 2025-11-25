import type { BaseHttpRequest } from '../core/base-http-request'
import { AlgorandSerializer } from '../core/model-runtime'
import type { EncodingFormat } from '@algorandfoundation/algokit-common'
import type {
  CreateWalletRequest,
  DeleteKeyRequest,
  DeleteKeyResponse,
  DeleteMultisigRequest,
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
  DeleteKeyRequestMeta,
  DeleteKeyResponseMeta,
  DeleteMultisigRequestMeta,
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

  private static acceptFor(format: EncodingFormat): string {
    return format === 'json' ? 'application/json' : 'application/msgpack'
  }

  private static mediaFor(format: EncodingFormat): string {
    return format === 'json' ? 'application/json' : 'application/msgpack'
  }

  /**
   * Create a new wallet (collection of keys) with the given parameters.
   */
  async createWallet(body: CreateWalletRequest): Promise<PostWalletResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = CreateWalletRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/wallet',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostWalletResponseMeta, responseFormat)
  }

  /**
   * Deletes the key with the passed public key from the wallet.
   */
  async deleteKey(body: DeleteKeyRequest): Promise<DeleteKeyResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = DeleteKeyRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'DELETE',
      url: '/v1/key',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, DeleteKeyResponseMeta, responseFormat)
  }

  /**
   * Deletes multisig preimage information for the passed address from the wallet.
   */
  async deleteMultisig(body: DeleteMultisigRequest): Promise<DeleteMultisigResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = DeleteMultisigRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'DELETE',
      url: '/v1/multisig',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, DeleteMultisigResponseMeta, responseFormat)
  }

  /**
   * Export the secret key associated with the passed public key.
   */
  async exportKey(body: ExportKeyRequest): Promise<PostKeyExportResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ExportKeyRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/key/export',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostKeyExportResponseMeta, responseFormat)
  }

  /**
   * Export the master derivation key from the wallet. This key is a master "backup" key for the underlying wallet. With it, you can regenerate all of the wallets that have been generated with this wallet's `POST /v1/key` endpoint. This key will not allow you to recover keys imported from other wallets, however.
   */
  async exportMasterKey(body: ExportMasterKeyRequest): Promise<PostMasterKeyExportResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ExportMasterKeyRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/master-key/export',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostMasterKeyExportResponseMeta, responseFormat)
  }

  /**
   * Given a multisig address whose preimage this wallet stores, returns the information used to generate the address, including public keys, threshold, and multisig version.
   */
  async exportMultisig(body: ExportMultisigRequest): Promise<PostMultisigExportResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ExportMultisigRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/multisig/export',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostMultisigExportResponseMeta, responseFormat)
  }

  /**
   * Generates the next key in the deterministic key sequence (as determined by the master derivation key) and adds it to the wallet, returning the public key.
   */
  async generateKey(body: GenerateKeyRequest): Promise<PostKeyResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = GenerateKeyRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/key',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostKeyResponseMeta, responseFormat)
  }

  async getVersion(): Promise<VersionsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/versions',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, VersionsResponseMeta, responseFormat)
  }

  /**
   * Returns information about the wallet associated with the passed wallet handle token. Additionally returns expiration information about the token itself.
   */
  async getWalletInfo(body: WalletInfoRequest): Promise<PostWalletInfoResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = WalletInfoRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/wallet/info',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostWalletInfoResponseMeta, responseFormat)
  }

  /**
   * Import an externally generated key into the wallet. Note that if you wish to back up the imported key, you must do so by backing up the entire wallet database, because imported keys were not derived from the wallet's master derivation key.
   */
  async importKey(body: ImportKeyRequest): Promise<PostKeyImportResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ImportKeyRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/key/import',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostKeyImportResponseMeta, responseFormat)
  }

  /**
   * Generates a multisig account from the passed public keys array and multisig metadata, and stores all of this in the wallet.
   */
  async importMultisig(body: ImportMultisigRequest): Promise<PostMultisigImportResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ImportMultisigRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/multisig/import',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostMultisigImportResponseMeta, responseFormat)
  }

  /**
   * Unlock the wallet and return a wallet handle token that can be used for subsequent operations. These tokens expire periodically and must be renewed. You can `POST` the token to `/v1/wallet/info` to see how much time remains until expiration, and renew it with `/v1/wallet/renew`. When you're done, you can invalidate the token with `/v1/wallet/release`.
   */
  async initWalletHandleToken(body: InitWalletHandleTokenRequest): Promise<PostWalletInitResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = InitWalletHandleTokenRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/wallet/init',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostWalletInitResponseMeta, responseFormat)
  }

  /**
   * Lists all of the public keys in this wallet. All of them have a stored private key.
   */
  async listKeysInWallet(body: ListKeysRequest): Promise<PostKeyListResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ListKeysRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/key/list',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostKeyListResponseMeta, responseFormat)
  }

  /**
   * Lists all of the multisig accounts whose preimages this wallet stores
   */
  async listMultisig(body: ListMultisigRequest): Promise<PostMultisigListResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ListMultisigRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/multisig/list',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostMultisigListResponseMeta, responseFormat)
  }

  /**
   * Lists all of the wallets that kmd is aware of.
   */
  async listWallets(): Promise<GetWalletsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/v1/wallets',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return AlgorandSerializer.decode(payload, GetWalletsResponseMeta, responseFormat)
  }

  /**
   * Invalidate the passed wallet handle token, making it invalid for use in subsequent requests.
   */
  async releaseWalletHandleToken(body: ReleaseWalletHandleTokenRequest): Promise<PostWalletReleaseResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = ReleaseWalletHandleTokenRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/wallet/release',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostWalletReleaseResponseMeta, responseFormat)
  }

  /**
   * Rename the underlying wallet to something else
   */
  async renameWallet(body: RenameWalletRequest): Promise<PostWalletRenameResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = RenameWalletRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/wallet/rename',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostWalletRenameResponseMeta, responseFormat)
  }

  /**
   * Renew a wallet handle token, increasing its expiration duration to its initial value
   */
  async renewWalletHandleToken(body: RenewWalletHandleTokenRequest): Promise<PostWalletRenewResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = RenewWalletHandleTokenRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/wallet/renew',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostWalletRenewResponseMeta, responseFormat)
  }

  /**
   * Start a multisig signature, or add a signature to a partially completed multisig signature object.
   */
  async signMultisigProgram(body: SignProgramMultisigRequest): Promise<PostMultisigProgramSignResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = SignProgramMultisigRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/multisig/signprogram',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostMultisigProgramSignResponseMeta, responseFormat)
  }

  /**
   * Start a multisig signature, or add a signature to a partially completed multisig signature object.
   */
  async signMultisigTransaction(body: SignMultisigRequest): Promise<PostMultisigTransactionSignResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = SignMultisigRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/multisig/sign',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostMultisigTransactionSignResponseMeta, responseFormat)
  }

  /**
   * Signs the passed program with a key from the wallet, determined by the account named in the request.
   */
  async signProgram(body: SignProgramRequest): Promise<PostProgramSignResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = SignProgramRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/program/sign',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostProgramSignResponseMeta, responseFormat)
  }

  /**
   * Signs the passed transaction with a key from the wallet, determined by the sender encoded in the transaction.
   */
  async signTransaction(body: SignTransactionRequest): Promise<PostTransactionSignResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const bodyMeta = SignTransactionRequestMeta
    const mediaType = bodyMeta ? KmdApi.mediaFor(responseFormat) : undefined
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? AlgorandSerializer.encode(body, bodyMeta, responseFormat) : undefined

    const payload = await this.httpRequest.request<string>({
      method: 'POST',
      url: '/v1/transaction/sign',
      path: {},
      query: {},
      headers,
      body: serializedBody,
      mediaType: mediaType,
    })

    return AlgorandSerializer.decode(payload, PostTransactionSignResponseMeta, responseFormat)
  }

  /**
   * Returns the entire swagger spec in json.
   */
  async swaggerHandler(): Promise<string> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = KmdApi.acceptFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/swagger.json',
      path: {},
      query: {},
      headers,
      body: undefined,
      mediaType: undefined,
    })

    return payload
  }
}
