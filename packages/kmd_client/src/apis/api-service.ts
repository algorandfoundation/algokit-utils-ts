import type { BaseHttpRequest } from '../core/base-http-request'
import { encodeJson, decodeJson } from '../core/model-runtime'
import { type EncodingFormat } from '@algorandfoundation/algokit-common'
import type {
  CreateWalletRequest,
  CreateWalletResponse,
  DeleteKeyRequest,
  DeleteMultisigRequest,
  ExportKeyRequest,
  ExportKeyResponse,
  ExportMasterKeyRequest,
  ExportMasterKeyResponse,
  ExportMultisigRequest,
  ExportMultisigResponse,
  GenerateKeyRequest,
  GenerateKeyResponse,
  ImportKeyRequest,
  ImportKeyResponse,
  ImportMultisigRequest,
  ImportMultisigResponse,
  InitWalletHandleTokenRequest,
  InitWalletHandleTokenResponse,
  ListKeysRequest,
  ListKeysResponse,
  ListMultisigRequest,
  ListMultisigResponse,
  ListWalletsResponse,
  ReleaseWalletHandleTokenRequest,
  RenameWalletRequest,
  RenameWalletResponse,
  RenewWalletHandleTokenRequest,
  RenewWalletHandleTokenResponse,
  SignMultisigRequest,
  SignMultisigResponse,
  SignProgramMultisigRequest,
  SignProgramMultisigResponse,
  SignProgramRequest,
  SignProgramResponse,
  SignTransactionRequest,
  SignTransactionResponse,
  VersionsResponse,
  WalletInfoRequest,
  WalletInfoResponse,
} from '../models/index'
import {
  CreateWalletRequestMeta,
  CreateWalletResponseMeta,
  DeleteKeyRequestMeta,
  DeleteMultisigRequestMeta,
  ExportKeyRequestMeta,
  ExportKeyResponseMeta,
  ExportMasterKeyRequestMeta,
  ExportMasterKeyResponseMeta,
  ExportMultisigRequestMeta,
  ExportMultisigResponseMeta,
  GenerateKeyRequestMeta,
  GenerateKeyResponseMeta,
  ImportKeyRequestMeta,
  ImportKeyResponseMeta,
  ImportMultisigRequestMeta,
  ImportMultisigResponseMeta,
  InitWalletHandleTokenRequestMeta,
  InitWalletHandleTokenResponseMeta,
  ListKeysRequestMeta,
  ListKeysResponseMeta,
  ListMultisigRequestMeta,
  ListMultisigResponseMeta,
  ListWalletsResponseMeta,
  ReleaseWalletHandleTokenRequestMeta,
  RenameWalletRequestMeta,
  RenameWalletResponseMeta,
  RenewWalletHandleTokenRequestMeta,
  RenewWalletHandleTokenResponseMeta,
  SignMultisigRequestMeta,
  SignMultisigResponseMeta,
  SignProgramMultisigRequestMeta,
  SignProgramMultisigResponseMeta,
  SignProgramRequestMeta,
  SignProgramResponseMeta,
  SignTransactionRequestMeta,
  SignTransactionResponseMeta,
  VersionsResponseMeta,
  WalletInfoRequestMeta,
  WalletInfoResponseMeta,
} from '../models/index'

export class KmdApi {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  private mimeTypeFor(format: EncodingFormat | 'text'): string {
    return format === 'json' ? 'application/json' : format === 'msgpack' ? 'application/msgpack' : 'text/plain'
  }

  /**
   * Create a new wallet (collection of keys) with the given parameters.
   */
  private async _createWallet(body: CreateWalletRequest): Promise<CreateWalletResponse> {
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

    return decodeJson(payload, CreateWalletResponseMeta)
  }

  /**
   * Deletes the key with the passed public key from the wallet.
   */
  async deleteKey(body: DeleteKeyRequest): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = DeleteKeyRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    await this.httpRequest.request<void>({
      method: 'DELETE',
      url: '/v1/key',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })
  }

  /**
   * Deletes multisig preimage information for the passed address from the wallet.
   */
  async deleteMultisig(body: DeleteMultisigRequest): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = DeleteMultisigRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    await this.httpRequest.request<void>({
      method: 'DELETE',
      url: '/v1/multisig',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })
  }

  /**
   * Export the secret key associated with the passed public key.
   */
  async exportKey(body: ExportKeyRequest): Promise<ExportKeyResponse> {
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

    return decodeJson(payload, ExportKeyResponseMeta)
  }

  /**
   * Export the master derivation key from the wallet. This key is a master "backup" key for the underlying wallet. With it, you can regenerate all of the wallets that have been generated with this wallet's `POST /v1/key` endpoint. This key will not allow you to recover keys imported from other wallets, however.
   */
  async exportMasterKey(body: ExportMasterKeyRequest): Promise<ExportMasterKeyResponse> {
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

    return decodeJson(payload, ExportMasterKeyResponseMeta)
  }

  /**
   * Given a multisig address whose preimage this wallet stores, returns the information used to generate the address, including public keys, threshold, and multisig version.
   */
  async exportMultisig(body: ExportMultisigRequest): Promise<ExportMultisigResponse> {
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

    return decodeJson(payload, ExportMultisigResponseMeta)
  }

  /**
   * Generates the next key in the deterministic key sequence (as determined by the master derivation key) and adds it to the wallet, returning the public key.
   */
  async generateKey(body: GenerateKeyRequest): Promise<GenerateKeyResponse> {
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

    return decodeJson(payload, GenerateKeyResponseMeta)
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
  async getWalletInfo(body: WalletInfoRequest): Promise<WalletInfoResponse> {
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

    return decodeJson(payload, WalletInfoResponseMeta)
  }

  /**
   * Import an externally generated key into the wallet. Note that if you wish to back up the imported key, you must do so by backing up the entire wallet database, because imported keys were not derived from the wallet's master derivation key.
   */
  async importKey(body: ImportKeyRequest): Promise<ImportKeyResponse> {
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

    return decodeJson(payload, ImportKeyResponseMeta)
  }

  /**
   * Generates a multisig account from the passed public keys array and multisig metadata, and stores all of this in the wallet.
   */
  async importMultisig(body: ImportMultisigRequest): Promise<ImportMultisigResponse> {
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

    return decodeJson(payload, ImportMultisigResponseMeta)
  }

  /**
   * Unlock the wallet and return a wallet handle token that can be used for subsequent operations. These tokens expire periodically and must be renewed. You can `POST` the token to `/v1/wallet/info` to see how much time remains until expiration, and renew it with `/v1/wallet/renew`. When you're done, you can invalidate the token with `/v1/wallet/release`.
   */
  async initWalletHandle(body: InitWalletHandleTokenRequest): Promise<InitWalletHandleTokenResponse> {
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

    return decodeJson(payload, InitWalletHandleTokenResponseMeta)
  }

  /**
   * Lists all of the public keys in this wallet. All of them have a stored private key.
   */
  async listKeysInWallet(body: ListKeysRequest): Promise<ListKeysResponse> {
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

    return decodeJson(payload, ListKeysResponseMeta)
  }

  /**
   * Lists all of the multisig accounts whose preimages this wallet stores
   */
  async listMultisig(body: ListMultisigRequest): Promise<ListMultisigResponse> {
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

    return decodeJson(payload, ListMultisigResponseMeta)
  }

  /**
   * Lists all of the wallets that kmd is aware of.
   */
  async listWallets(): Promise<ListWalletsResponse> {
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

    return decodeJson(payload, ListWalletsResponseMeta)
  }

  /**
   * Invalidate the passed wallet handle token, making it invalid for use in subsequent requests.
   */
  async releaseWalletHandleToken(body: ReleaseWalletHandleTokenRequest): Promise<void> {
    const headers: Record<string, string> = {}
    const responseFormat: EncodingFormat = 'json'
    headers['Accept'] = this.mimeTypeFor(responseFormat)

    const bodyMeta = ReleaseWalletHandleTokenRequestMeta
    const mediaType = this.mimeTypeFor(!bodyMeta ? 'text' : responseFormat)
    if (mediaType) headers['Content-Type'] = mediaType
    const serializedBody = body ? encodeJson(body, bodyMeta) : undefined

    await this.httpRequest.request<void>({
      method: 'POST',
      url: '/v1/wallet/release',
      path: {},
      query: {},
      headers,
      body: serializedBody,
    })
  }

  /**
   * Rename the underlying wallet to something else
   */
  async renameWallet(body: RenameWalletRequest): Promise<RenameWalletResponse> {
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

    return decodeJson(payload, RenameWalletResponseMeta)
  }

  /**
   * Renew a wallet handle token, increasing its expiration duration to its initial value
   */
  async renewWalletHandleToken(body: RenewWalletHandleTokenRequest): Promise<RenewWalletHandleTokenResponse> {
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

    return decodeJson(payload, RenewWalletHandleTokenResponseMeta)
  }

  /**
   * Start a multisig signature, or add a signature to a partially completed multisig signature object.
   */
  async signMultisigProgram(body: SignProgramMultisigRequest): Promise<SignProgramMultisigResponse> {
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

    return decodeJson(payload, SignProgramMultisigResponseMeta)
  }

  /**
   * Start a multisig signature, or add a signature to a partially completed multisig signature object.
   */
  async signMultisigTransaction(body: SignMultisigRequest): Promise<SignMultisigResponse> {
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

    return decodeJson(payload, SignMultisigResponseMeta)
  }

  /**
   * Signs the passed program with a key from the wallet, determined by the account named in the request.
   */
  async signProgram(body: SignProgramRequest): Promise<SignProgramResponse> {
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

    return decodeJson(payload, SignProgramResponseMeta)
  }

  /**
   * Signs the passed transaction with a key from the wallet, determined by the sender encoded in the transaction.
   */
  async signTransaction(body: SignTransactionRequest): Promise<SignTransactionResponse> {
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

    return decodeJson(payload, SignTransactionResponseMeta)
  }

  /**
   * Create a new wallet (collection of keys) with the given parameters.
   */
  async createWallet(body: CreateWalletRequest): Promise<CreateWalletResponse> {
    const requestBody = {
      ...body,
      walletDriverName: body.walletDriverName ?? 'sqlite',
    }
    return await this._createWallet(requestBody)
  }
}
