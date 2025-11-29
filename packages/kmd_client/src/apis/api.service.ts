import type { BaseHttpRequest } from '../core/base-http-request'
import { encodeJson, decodeJson } from '../core/model-runtime'
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

  private mimeTypeFor(format: EncodingFormat | 'text'): string {
    return format === 'json' ? 'application/json' : format === 'msgpack' ? 'application/msgpack' : 'text/plain'
  }

  /**
   * Create a new wallet (collection of keys) with the given parameters.
   */
  async createWallet(body: CreateWalletRequest): Promise<PostWalletResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = CreateWalletRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/wallet',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostWalletResponseMeta)
  }

  /**
   * Deletes the key with the passed public key from the wallet.
   */
  async deleteKey(body: DeleteKeyRequest): Promise<DeleteKeyResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = DeleteKeyRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'DELETE',
      url: '/v1/key',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, DeleteKeyResponseMeta)
  }

  /**
   * Deletes multisig preimage information for the passed address from the wallet.
   */
  async deleteMultisig(body: DeleteMultisigRequest): Promise<DeleteMultisigResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = DeleteMultisigRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'DELETE',
      url: '/v1/multisig',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, DeleteMultisigResponseMeta)
  }

  /**
   * Export the secret key associated with the passed public key.
   */
  async exportKey(body: ExportKeyRequest): Promise<PostKeyExportResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = ExportKeyRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/key/export',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostKeyExportResponseMeta)
  }

  /**
   * Export the master derivation key from the wallet. This key is a master "backup" key for the underlying wallet. With it, you can regenerate all of the wallets that have been generated with this wallet's `POST /v1/key` endpoint. This key will not allow you to recover keys imported from other wallets, however.
   */
  async exportMasterKey(body: ExportMasterKeyRequest): Promise<PostMasterKeyExportResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = ExportMasterKeyRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/master-key/export',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostMasterKeyExportResponseMeta)
  }

  /**
   * Given a multisig address whose preimage this wallet stores, returns the information used to generate the address, including public keys, threshold, and multisig version.
   */
  async exportMultisig(body: ExportMultisigRequest): Promise<PostMultisigExportResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = ExportMultisigRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/multisig/export',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostMultisigExportResponseMeta)
  }

  /**
   * Generates the next key in the deterministic key sequence (as determined by the master derivation key) and adds it to the wallet, returning the public key.
   */
  async generateKey(body: GenerateKeyRequest): Promise<PostKeyResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = GenerateKeyRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/key',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostKeyResponseMeta)
  }

  async getVersion(): Promise<VersionsResponse> {
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

    return decodeJson(payload, VersionsResponseMeta)
  }

  /**
   * Returns information about the wallet associated with the passed wallet handle token. Additionally returns expiration information about the token itself.
   */
  async getWalletInfo(body: WalletInfoRequest): Promise<PostWalletInfoResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = WalletInfoRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/wallet/info',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostWalletInfoResponseMeta)
  }

  /**
   * Import an externally generated key into the wallet. Note that if you wish to back up the imported key, you must do so by backing up the entire wallet database, because imported keys were not derived from the wallet's master derivation key.
   */
  async importKey(body: ImportKeyRequest): Promise<PostKeyImportResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = ImportKeyRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/key/import',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostKeyImportResponseMeta)
  }

  /**
   * Generates a multisig account from the passed public keys array and multisig metadata, and stores all of this in the wallet.
   */
  async importMultisig(body: ImportMultisigRequest): Promise<PostMultisigImportResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = ImportMultisigRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/multisig/import',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostMultisigImportResponseMeta)
  }

  /**
   * Unlock the wallet and return a wallet handle token that can be used for subsequent operations. These tokens expire periodically and must be renewed. You can `POST` the token to `/v1/wallet/info` to see how much time remains until expiration, and renew it with `/v1/wallet/renew`. When you're done, you can invalidate the token with `/v1/wallet/release`.
   */
  async initWalletHandleToken(body: InitWalletHandleTokenRequest): Promise<PostWalletInitResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = InitWalletHandleTokenRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/wallet/init',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostWalletInitResponseMeta)
  }

  /**
   * Lists all of the public keys in this wallet. All of them have a stored private key.
   */
  async listKeysInWallet(body: ListKeysRequest): Promise<PostKeyListResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = ListKeysRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/key/list',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostKeyListResponseMeta)
  }

  /**
   * Lists all of the multisig accounts whose preimages this wallet stores
   */
  async listMultisig(body: ListMultisigRequest): Promise<PostMultisigListResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = ListMultisigRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/multisig/list',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostMultisigListResponseMeta)
  }

  /**
   * Lists all of the wallets that kmd is aware of.
   */
  async listWallets(): Promise<GetWalletsResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'GET',
      url: '/v1/wallets',
      path: {},
      query: {},
      headers,
      body: undefined,
    })

    return decodeJson(payload, GetWalletsResponseMeta)
  }

  /**
   * Invalidate the passed wallet handle token, making it invalid for use in subsequent requests.
   */
  async releaseWalletHandleToken(body: ReleaseWalletHandleTokenRequest): Promise<PostWalletReleaseResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = ReleaseWalletHandleTokenRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/wallet/release',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostWalletReleaseResponseMeta)
  }

  /**
   * Rename the underlying wallet to something else
   */
  async renameWallet(body: RenameWalletRequest): Promise<PostWalletRenameResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = RenameWalletRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/wallet/rename',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostWalletRenameResponseMeta)
  }

  /**
   * Renew a wallet handle token, increasing its expiration duration to its initial value
   */
  async renewWalletHandleToken(body: RenewWalletHandleTokenRequest): Promise<PostWalletRenewResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = RenewWalletHandleTokenRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/wallet/renew',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostWalletRenewResponseMeta)
  }

  /**
   * Start a multisig signature, or add a signature to a partially completed multisig signature object.
   */
  async signMultisigProgram(body: SignProgramMultisigRequest): Promise<PostMultisigProgramSignResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = SignProgramMultisigRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/multisig/signprogram',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostMultisigProgramSignResponseMeta)
  }

  /**
   * Start a multisig signature, or add a signature to a partially completed multisig signature object.
   */
  async signMultisigTransaction(body: SignMultisigRequest): Promise<PostMultisigTransactionSignResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = SignMultisigRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/multisig/sign',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostMultisigTransactionSignResponseMeta)
  }

  /**
   * Signs the passed program with a key from the wallet, determined by the account named in the request.
   */
  async signProgram(body: SignProgramRequest): Promise<PostProgramSignResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = SignProgramRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/program/sign',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostProgramSignResponseMeta)
  }

  /**
   * Signs the passed transaction with a key from the wallet, determined by the sender encoded in the transaction.
   */
  async signTransaction(body: SignTransactionRequest): Promise<PostTransactionSignResponse> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = SignTransactionRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    const payload = await this.httpRequest.request<Record<string, unknown>>({
      method: 'POST',
      url: '/v1/transaction/sign',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })

    return decodeJson(payload, PostTransactionSignResponseMeta)
  }

  /**
   * Returns the entire swagger spec in json.
   */
  async swaggerHandler(): Promise<string> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const payload = await this.httpRequest.request<string>({
      method: 'GET',
      url: '/swagger.json',
      path: {},
      query: {},
      headers,
      body: undefined,
    })

    return payload
  }
}
