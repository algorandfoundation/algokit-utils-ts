[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/kmd-client](../README.md) / KmdClient

# Class: KmdClient

Defined in: [packages/kmd\_client/src/client.ts:5](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/client.ts#L5)

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`KmdApi`](KmdApi.md)

## Constructors

### Constructor

> **new KmdClient**(`config`): `KmdClient`

Defined in: [packages/kmd\_client/src/client.ts:6](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/client.ts#L6)

#### Parameters

##### config

[`ClientConfig`](../interfaces/ClientConfig.md)

#### Returns

`KmdClient`

#### Overrides

[`KmdApi`](KmdApi.md).[`constructor`](KmdApi.md#constructor)

## Properties

### httpRequest

> `readonly` **httpRequest**: [`BaseHttpRequest`](BaseHttpRequest.md)

Defined in: [packages/kmd\_client/src/apis/api-service.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L90)

#### Inherited from

[`KmdApi`](KmdApi.md).[`httpRequest`](KmdApi.md#httprequest)

## Methods

### createWallet()

> **createWallet**(`body`): `Promise`\<[`CreateWalletResponse`](../type-aliases/CreateWalletResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:630](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L630)

Create a new wallet (collection of keys) with the given parameters.

#### Parameters

##### body

[`CreateWalletRequest`](../type-aliases/CreateWalletRequest.md)

#### Returns

`Promise`\<[`CreateWalletResponse`](../type-aliases/CreateWalletResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`createWallet`](KmdApi.md#createwallet)

***

### deleteKey()

> **deleteKey**(`body`): `Promise`\<`void`\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:124](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L124)

Deletes the key with the passed public key from the wallet.

#### Parameters

##### body

[`DeleteKeyRequest`](../type-aliases/DeleteKeyRequest.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`deleteKey`](KmdApi.md#deletekey)

***

### deleteMultisig()

> **deleteMultisig**(`body`): `Promise`\<`void`\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:147](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L147)

Deletes multisig preimage information for the passed address from the wallet.

#### Parameters

##### body

[`DeleteMultisigRequest`](../type-aliases/DeleteMultisigRequest.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`deleteMultisig`](KmdApi.md#deletemultisig)

***

### exportKey()

> **exportKey**(`body`): `Promise`\<[`ExportKeyResponse`](../type-aliases/ExportKeyResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:170](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L170)

Export the secret key associated with the passed public key.

#### Parameters

##### body

[`ExportKeyRequest`](../type-aliases/ExportKeyRequest.md)

#### Returns

`Promise`\<[`ExportKeyResponse`](../type-aliases/ExportKeyResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`exportKey`](KmdApi.md#exportkey)

***

### exportMasterKey()

> **exportMasterKey**(`body`): `Promise`\<[`ExportMasterKeyResponse`](../type-aliases/ExportMasterKeyResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:195](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L195)

Export the master derivation key from the wallet. This key is a master "backup" key for the underlying wallet. With it, you can regenerate all of the wallets that have been generated with this wallet's `POST /v1/key` endpoint. This key will not allow you to recover keys imported from other wallets, however.

#### Parameters

##### body

[`ExportMasterKeyRequest`](../type-aliases/ExportMasterKeyRequest.md)

#### Returns

`Promise`\<[`ExportMasterKeyResponse`](../type-aliases/ExportMasterKeyResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`exportMasterKey`](KmdApi.md#exportmasterkey)

***

### exportMultisig()

> **exportMultisig**(`body`): `Promise`\<[`ExportMultisigResponse`](../type-aliases/ExportMultisigResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:220](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L220)

Given a multisig address whose preimage this wallet stores, returns the information used to generate the address, including public keys, threshold, and multisig version.

#### Parameters

##### body

[`ExportMultisigRequest`](../type-aliases/ExportMultisigRequest.md)

#### Returns

`Promise`\<[`ExportMultisigResponse`](../type-aliases/ExportMultisigResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`exportMultisig`](KmdApi.md#exportmultisig)

***

### generateKey()

> **generateKey**(`body`): `Promise`\<[`GenerateKeyResponse`](../type-aliases/GenerateKeyResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:245](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L245)

Generates the next key in the deterministic key sequence (as determined by the master derivation key) and adds it to the wallet, returning the public key.

#### Parameters

##### body

[`GenerateKeyRequest`](../type-aliases/GenerateKeyRequest.md)

#### Returns

`Promise`\<[`GenerateKeyResponse`](../type-aliases/GenerateKeyResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`generateKey`](KmdApi.md#generatekey)

***

### importKey()

> **importKey**(`body`): `Promise`\<[`ImportKeyResponse`](../type-aliases/ImportKeyResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:270](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L270)

Import an externally generated key into the wallet. Note that if you wish to back up the imported key, you must do so by backing up the entire wallet database, because imported keys were not derived from the wallet's master derivation key.

#### Parameters

##### body

[`ImportKeyRequest`](../type-aliases/ImportKeyRequest.md)

#### Returns

`Promise`\<[`ImportKeyResponse`](../type-aliases/ImportKeyResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`importKey`](KmdApi.md#importkey)

***

### importMultisig()

> **importMultisig**(`body`): `Promise`\<[`ImportMultisigResponse`](../type-aliases/ImportMultisigResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:295](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L295)

Generates a multisig account from the passed public keys array and multisig metadata, and stores all of this in the wallet.

#### Parameters

##### body

[`ImportMultisigRequest`](../type-aliases/ImportMultisigRequest.md)

#### Returns

`Promise`\<[`ImportMultisigResponse`](../type-aliases/ImportMultisigResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`importMultisig`](KmdApi.md#importmultisig)

***

### initWalletHandle()

> **initWalletHandle**(`body`): `Promise`\<[`InitWalletHandleTokenResponse`](../type-aliases/InitWalletHandleTokenResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:320](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L320)

Unlock the wallet and return a wallet handle token that can be used for subsequent operations. These tokens expire periodically and must be renewed. You can `POST` the token to `/v1/wallet/info` to see how much time remains until expiration, and renew it with `/v1/wallet/renew`. When you're done, you can invalidate the token with `/v1/wallet/release`.

#### Parameters

##### body

[`InitWalletHandleTokenRequest`](../type-aliases/InitWalletHandleTokenRequest.md)

#### Returns

`Promise`\<[`InitWalletHandleTokenResponse`](../type-aliases/InitWalletHandleTokenResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`initWalletHandle`](KmdApi.md#initwallethandle)

***

### listKeysInWallet()

> **listKeysInWallet**(`body`): `Promise`\<[`ListKeysResponse`](../type-aliases/ListKeysResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:345](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L345)

Lists all of the public keys in this wallet. All of them have a stored private key.

#### Parameters

##### body

[`ListKeysRequest`](../type-aliases/ListKeysRequest.md)

#### Returns

`Promise`\<[`ListKeysResponse`](../type-aliases/ListKeysResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`listKeysInWallet`](KmdApi.md#listkeysinwallet)

***

### listMultisig()

> **listMultisig**(`body`): `Promise`\<[`ListMultisigResponse`](../type-aliases/ListMultisigResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:370](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L370)

Lists all of the multisig accounts whose preimages this wallet stores

#### Parameters

##### body

[`ListMultisigRequest`](../type-aliases/ListMultisigRequest.md)

#### Returns

`Promise`\<[`ListMultisigResponse`](../type-aliases/ListMultisigResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`listMultisig`](KmdApi.md#listmultisig)

***

### listWallets()

> **listWallets**(): `Promise`\<[`ListWalletsResponse`](../type-aliases/ListWalletsResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:395](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L395)

Lists all of the wallets that kmd is aware of.

#### Returns

`Promise`\<[`ListWalletsResponse`](../type-aliases/ListWalletsResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`listWallets`](KmdApi.md#listwallets)

***

### releaseWalletHandleToken()

> **releaseWalletHandleToken**(`body`): `Promise`\<`void`\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:415](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L415)

Invalidate the passed wallet handle token, making it invalid for use in subsequent requests.

#### Parameters

##### body

[`ReleaseWalletHandleTokenRequest`](../type-aliases/ReleaseWalletHandleTokenRequest.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`releaseWalletHandleToken`](KmdApi.md#releasewallethandletoken)

***

### renameWallet()

> **renameWallet**(`body`): `Promise`\<[`RenameWalletResponse`](../type-aliases/RenameWalletResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:438](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L438)

Rename the underlying wallet to something else

#### Parameters

##### body

[`RenameWalletRequest`](../type-aliases/RenameWalletRequest.md)

#### Returns

`Promise`\<[`RenameWalletResponse`](../type-aliases/RenameWalletResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`renameWallet`](KmdApi.md#renamewallet)

***

### renewWalletHandleToken()

> **renewWalletHandleToken**(`body`): `Promise`\<[`RenewWalletHandleTokenResponse`](../type-aliases/RenewWalletHandleTokenResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:463](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L463)

Renew a wallet handle token, increasing its expiration duration to its initial value

#### Parameters

##### body

[`RenewWalletHandleTokenRequest`](../type-aliases/RenewWalletHandleTokenRequest.md)

#### Returns

`Promise`\<[`RenewWalletHandleTokenResponse`](../type-aliases/RenewWalletHandleTokenResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`renewWalletHandleToken`](KmdApi.md#renewwallethandletoken)

***

### signMultisigProgram()

> **signMultisigProgram**(`body`): `Promise`\<[`SignProgramMultisigResponse`](../type-aliases/SignProgramMultisigResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:488](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L488)

Start a multisig signature, or add a signature to a partially completed multisig signature object.

#### Parameters

##### body

[`SignProgramMultisigRequest`](../type-aliases/SignProgramMultisigRequest.md)

#### Returns

`Promise`\<[`SignProgramMultisigResponse`](../type-aliases/SignProgramMultisigResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`signMultisigProgram`](KmdApi.md#signmultisigprogram)

***

### signMultisigTransaction()

> **signMultisigTransaction**(`body`): `Promise`\<[`SignMultisigResponse`](../type-aliases/SignMultisigResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:644](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L644)

Enables the signing of a transaction using the provided wallet and multisig info.
The public key is used to identify which multisig account key to use for signing.
When a signer is provided it is used to resolve the private key and sign the transaction, enabling rekeyed account signing.

#### Parameters

##### body

###### partialMultisig?

[`MultisigSig`](../type-aliases/MultisigSig.md)

###### publicKey

`Uint8Array`

###### signer?

`Uint8Array`

###### transaction

[`Transaction`](../../transact/classes/Transaction.md)

###### walletHandleToken

`string`

###### walletPassword?

`string`

#### Returns

`Promise`\<[`SignMultisigResponse`](../type-aliases/SignMultisigResponse.md)\>

A multisig signature or partial signature, which can be used to form a signed transaction.

#### Inherited from

[`KmdApi`](KmdApi.md).[`signMultisigTransaction`](KmdApi.md#signmultisigtransaction)

***

### signProgram()

> **signProgram**(`body`): `Promise`\<[`SignProgramResponse`](../type-aliases/SignProgramResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:538](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L538)

Signs the passed program with a key from the wallet, determined by the account named in the request.

#### Parameters

##### body

[`SignProgramRequest`](../type-aliases/SignProgramRequest.md)

#### Returns

`Promise`\<[`SignProgramResponse`](../type-aliases/SignProgramResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`signProgram`](KmdApi.md#signprogram)

***

### signTransaction()

> **signTransaction**(`body`): `Promise`\<[`SignTransactionResponse`](../type-aliases/SignTransactionResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:657](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L657)

Enables the signing of a transaction using the provided wallet info.
When a public key is provided it is used to resolve the private key and sign the transaction, enabling rekeyed account signing.

#### Parameters

##### body

###### publicKey?

`Uint8Array`

###### transaction

[`Transaction`](../../transact/classes/Transaction.md)

###### walletHandleToken

`string`

###### walletPassword?

`string`

#### Returns

`Promise`\<[`SignTransactionResponse`](../type-aliases/SignTransactionResponse.md)\>

An encoded, signed transaction.

#### Inherited from

[`KmdApi`](KmdApi.md).[`signTransaction`](KmdApi.md#signtransaction)

***

### version()

> **version**(): `Promise`\<[`VersionsResponse`](../type-aliases/VersionsResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:585](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L585)

#### Returns

`Promise`\<[`VersionsResponse`](../type-aliases/VersionsResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`version`](KmdApi.md#version)

***

### walletInfo()

> **walletInfo**(`body`): `Promise`\<[`WalletInfoResponse`](../type-aliases/WalletInfoResponse.md)\>

Defined in: [packages/kmd\_client/src/apis/api-service.ts:605](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/apis/api-service.ts#L605)

Returns information about the wallet associated with the passed wallet handle token. Additionally returns expiration information about the token itself.

#### Parameters

##### body

[`WalletInfoRequest`](../type-aliases/WalletInfoRequest.md)

#### Returns

`Promise`\<[`WalletInfoResponse`](../type-aliases/WalletInfoResponse.md)\>

#### Inherited from

[`KmdApi`](KmdApi.md).[`walletInfo`](KmdApi.md#walletinfo)
