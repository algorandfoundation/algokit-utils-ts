[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Packages/Indexer Client](../README.md) / IndexerApi

# Class: IndexerApi

Defined in: [packages/indexer\_client/src/apis/api-service.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L43)

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extended by

- [`IndexerClient`](IndexerClient.md)

## Constructors

### Constructor

> **new IndexerApi**(`httpRequest`): `IndexerApi`

Defined in: [packages/indexer\_client/src/apis/api-service.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L44)

#### Parameters

##### httpRequest

[`BaseHttpRequest`](BaseHttpRequest.md)

#### Returns

`IndexerApi`

## Properties

### httpRequest

> `readonly` **httpRequest**: [`BaseHttpRequest`](BaseHttpRequest.md)

Defined in: [packages/indexer\_client/src/apis/api-service.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L44)

## Methods

### healthCheck()

> **healthCheck**(): `Promise`\<[`HealthCheck`](../type-aliases/HealthCheck.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L50)

#### Returns

`Promise`\<[`HealthCheck`](../type-aliases/HealthCheck.md)\>

***

### lookupAccountAppLocalStates()

> **lookupAccountAppLocalStates**(`account`, `params?`): `Promise`\<[`ApplicationLocalStatesResponse`](../type-aliases/ApplicationLocalStatesResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L70)

Lookup an account's asset holdings, optionally for a specific ID.

#### Parameters

##### account

[`ReadableAddress`](../../../Algokit-Utils-API/type-aliases/ReadableAddress.md)

##### params?

###### applicationId?

`number` \| `bigint`

###### includeAll?

`boolean`

###### limit?

`number`

###### next?

`string`

#### Returns

`Promise`\<[`ApplicationLocalStatesResponse`](../type-aliases/ApplicationLocalStatesResponse.md)\>

***

### lookupAccountAssets()

> **lookupAccountAssets**(`account`, `params?`): `Promise`\<[`AssetHoldingsResponse`](../type-aliases/AssetHoldingsResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L93)

Lookup an account's asset holdings, optionally for a specific ID.

#### Parameters

##### account

[`ReadableAddress`](../../../Algokit-Utils-API/type-aliases/ReadableAddress.md)

##### params?

###### assetId?

`number` \| `bigint`

###### includeAll?

`boolean`

###### limit?

`number`

###### next?

`string`

#### Returns

`Promise`\<[`AssetHoldingsResponse`](../type-aliases/AssetHoldingsResponse.md)\>

***

### lookupAccountById()

> **lookupAccountById**(`account`, `params?`): `Promise`\<[`AccountResponse`](../type-aliases/AccountResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:116](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L116)

Lookup account information.

#### Parameters

##### account

[`ReadableAddress`](../../../Algokit-Utils-API/type-aliases/ReadableAddress.md)

##### params?

###### exclude?

`"apps-local-state"` \| `"assets"` \| `"created-apps"` \| `"created-assets"` \| `"all"` \| `"none"`[]

###### includeAll?

`boolean`

###### round?

`number` \| `bigint`

#### Returns

`Promise`\<[`AccountResponse`](../type-aliases/AccountResponse.md)\>

***

### lookupAccountCreatedApplications()

> **lookupAccountCreatedApplications**(`account`, `params?`): `Promise`\<[`ApplicationsResponse`](../type-aliases/ApplicationsResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:143](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L143)

Lookup an account's created application parameters, optionally for a specific ID.

#### Parameters

##### account

[`ReadableAddress`](../../../Algokit-Utils-API/type-aliases/ReadableAddress.md)

##### params?

###### applicationId?

`number` \| `bigint`

###### includeAll?

`boolean`

###### limit?

`number`

###### next?

`string`

#### Returns

`Promise`\<[`ApplicationsResponse`](../type-aliases/ApplicationsResponse.md)\>

***

### lookupAccountCreatedAssets()

> **lookupAccountCreatedAssets**(`account`, `params?`): `Promise`\<[`AssetsResponse`](../type-aliases/AssetsResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:166](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L166)

Lookup an account's created asset parameters, optionally for a specific ID.

#### Parameters

##### account

[`ReadableAddress`](../../../Algokit-Utils-API/type-aliases/ReadableAddress.md)

##### params?

###### assetId?

`number` \| `bigint`

###### includeAll?

`boolean`

###### limit?

`number`

###### next?

`string`

#### Returns

`Promise`\<[`AssetsResponse`](../type-aliases/AssetsResponse.md)\>

***

### lookupAccountTransactions()

> **lookupAccountTransactions**(`account`, `params?`): `Promise`\<[`TransactionsResponse`](../type-aliases/TransactionsResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:189](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L189)

Lookup account transactions. Transactions are returned newest to oldest.

#### Parameters

##### account

[`ReadableAddress`](../../../Algokit-Utils-API/type-aliases/ReadableAddress.md)

##### params?

###### afterTime?

`string`

###### assetId?

`number` \| `bigint`

###### beforeTime?

`string`

###### currencyGreaterThan?

`number` \| `bigint`

###### currencyLessThan?

`number` \| `bigint`

###### limit?

`number`

###### maxRound?

`number` \| `bigint`

###### minRound?

`number` \| `bigint`

###### next?

`string`

###### notePrefix?

`string`

###### rekeyTo?

`boolean`

###### round?

`number` \| `bigint`

###### sigType?

`"sig"` \| `"msig"` \| `"lsig"`

###### txId?

`string`

###### txType?

`"pay"` \| `"keyreg"` \| `"acfg"` \| `"axfer"` \| `"afrz"` \| `"appl"` \| `"stpf"` \| `"hb"`

#### Returns

`Promise`\<[`TransactionsResponse`](../type-aliases/TransactionsResponse.md)\>

***

### lookupApplicationBoxByIdAndName()

> **lookupApplicationBoxByIdAndName**(`applicationId`, `boxName`): `Promise`\<[`Box`](../type-aliases/Box.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:709](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L709)

Given an application ID and box name, it returns the round, box name, and value.

#### Parameters

##### applicationId

`number` | `bigint`

##### boxName

`Uint8Array`

#### Returns

`Promise`\<[`Box`](../type-aliases/Box.md)\>

***

### lookupApplicationById()

> **lookupApplicationById**(`applicationId`, `params?`): `Promise`\<[`ApplicationResponse`](../type-aliases/ApplicationResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:264](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L264)

Lookup application.

#### Parameters

##### applicationId

`number` | `bigint`

##### params?

###### includeAll?

`boolean`

#### Returns

`Promise`\<[`ApplicationResponse`](../type-aliases/ApplicationResponse.md)\>

***

### lookupApplicationLogsById()

> **lookupApplicationLogsById**(`applicationId`, `params?`): `Promise`\<[`ApplicationLogsResponse`](../type-aliases/ApplicationLogsResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:284](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L284)

Lookup application logs.

#### Parameters

##### applicationId

`number` | `bigint`

##### params?

###### limit?

`number`

###### maxRound?

`number` \| `bigint`

###### minRound?

`number` \| `bigint`

###### next?

`string`

###### senderAddress?

[`ReadableAddress`](../../../Algokit-Utils-API/type-aliases/ReadableAddress.md)

###### txId?

`string`

#### Returns

`Promise`\<[`ApplicationLogsResponse`](../type-aliases/ApplicationLogsResponse.md)\>

***

### lookupAssetBalances()

> **lookupAssetBalances**(`assetId`, `params?`): `Promise`\<[`AssetBalancesResponse`](../type-aliases/AssetBalancesResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:321](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L321)

Lookup the list of accounts who hold this asset

#### Parameters

##### assetId

`number` | `bigint`

##### params?

###### currencyGreaterThan?

`number` \| `bigint`

###### currencyLessThan?

`number` \| `bigint`

###### includeAll?

`boolean`

###### limit?

`number`

###### next?

`string`

#### Returns

`Promise`\<[`AssetBalancesResponse`](../type-aliases/AssetBalancesResponse.md)\>

***

### lookupAssetById()

> **lookupAssetById**(`assetId`, `params?`): `Promise`\<[`AssetResponse`](../type-aliases/AssetResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:356](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L356)

Lookup asset information.

#### Parameters

##### assetId

`number` | `bigint`

##### params?

###### includeAll?

`boolean`

#### Returns

`Promise`\<[`AssetResponse`](../type-aliases/AssetResponse.md)\>

***

### lookupAssetTransactions()

> **lookupAssetTransactions**(`assetId`, `params?`): `Promise`\<[`TransactionsResponse`](../type-aliases/TransactionsResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:376](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L376)

Lookup transactions for an asset. Transactions are returned oldest to newest.

#### Parameters

##### assetId

`number` | `bigint`

##### params?

###### address?

[`ReadableAddress`](../../../Algokit-Utils-API/type-aliases/ReadableAddress.md)

###### addressRole?

`"receiver"` \| `"sender"` \| `"freeze-target"`

###### afterTime?

`string`

###### beforeTime?

`string`

###### currencyGreaterThan?

`number` \| `bigint`

###### currencyLessThan?

`number` \| `bigint`

###### excludeCloseTo?

`boolean`

###### limit?

`number`

###### maxRound?

`number` \| `bigint`

###### minRound?

`number` \| `bigint`

###### next?

`string`

###### notePrefix?

`string`

###### rekeyTo?

`boolean`

###### round?

`number` \| `bigint`

###### sigType?

`"sig"` \| `"msig"` \| `"lsig"`

###### txId?

`string`

###### txType?

`"pay"` \| `"keyreg"` \| `"acfg"` \| `"axfer"` \| `"afrz"` \| `"appl"` \| `"stpf"` \| `"hb"`

#### Returns

`Promise`\<[`TransactionsResponse`](../type-aliases/TransactionsResponse.md)\>

***

### lookupBlock()

> **lookupBlock**(`roundNumber`, `params?`): `Promise`\<[`Block`](../type-aliases/Block.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:435](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L435)

Lookup block.

#### Parameters

##### roundNumber

`number` | `bigint`

##### params?

###### headerOnly?

`boolean`

#### Returns

`Promise`\<[`Block`](../type-aliases/Block.md)\>

***

### lookupTransactionById()

> **lookupTransactionById**(`txId`): `Promise`\<[`TransactionResponse`](../type-aliases/TransactionResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:455](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L455)

Lookup a single transaction.

#### Parameters

##### txId

`string`

#### Returns

`Promise`\<[`TransactionResponse`](../type-aliases/TransactionResponse.md)\>

***

### searchForAccounts()

> **searchForAccounts**(`params?`): `Promise`\<[`AccountsResponse`](../type-aliases/AccountsResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:475](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L475)

Search for accounts.

#### Parameters

##### params?

###### applicationId?

`number` \| `bigint`

###### assetId?

`number` \| `bigint`

###### authAddr?

[`ReadableAddress`](../../../Algokit-Utils-API/type-aliases/ReadableAddress.md)

###### currencyGreaterThan?

`number` \| `bigint`

###### currencyLessThan?

`number` \| `bigint`

###### exclude?

`"apps-local-state"` \| `"assets"` \| `"created-apps"` \| `"created-assets"` \| `"all"` \| `"none"`[]

###### includeAll?

`boolean`

###### limit?

`number`

###### next?

`string`

###### onlineOnly?

`boolean`

###### round?

`number` \| `bigint`

#### Returns

`Promise`\<[`AccountsResponse`](../type-aliases/AccountsResponse.md)\>

***

### searchForApplicationBoxes()

> **searchForApplicationBoxes**(`applicationId`, `params?`): `Promise`\<[`BoxesResponse`](../type-aliases/BoxesResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:519](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L519)

Given an application ID, returns the box names of that application sorted lexicographically.

#### Parameters

##### applicationId

`number` | `bigint`

##### params?

###### limit?

`number`

###### next?

`string`

#### Returns

`Promise`\<[`BoxesResponse`](../type-aliases/BoxesResponse.md)\>

***

### searchForApplications()

> **searchForApplications**(`params?`): `Promise`\<[`ApplicationsResponse`](../type-aliases/ApplicationsResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:539](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L539)

Search for applications

#### Parameters

##### params?

###### applicationId?

`number` \| `bigint`

###### creator?

`string`

###### includeAll?

`boolean`

###### limit?

`number`

###### next?

`string`

#### Returns

`Promise`\<[`ApplicationsResponse`](../type-aliases/ApplicationsResponse.md)\>

***

### searchForAssets()

> **searchForAssets**(`params?`): `Promise`\<[`AssetsResponse`](../type-aliases/AssetsResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:571](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L571)

Search for assets.

#### Parameters

##### params?

###### assetId?

`number` \| `bigint`

###### creator?

`string`

###### includeAll?

`boolean`

###### limit?

`number`

###### name?

`string`

###### next?

`string`

###### unit?

`string`

#### Returns

`Promise`\<[`AssetsResponse`](../type-aliases/AssetsResponse.md)\>

***

### searchForBlockHeaders()

> **searchForBlockHeaders**(`params?`): `Promise`\<[`BlockHeadersResponse`](../type-aliases/BlockHeadersResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:607](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L607)

Search for block headers. Block headers are returned in ascending round order. Transactions are not included in the output.

#### Parameters

##### params?

###### absent?

[`ReadableAddress`](../../../Algokit-Utils-API/type-aliases/ReadableAddress.md)[]

###### afterTime?

`string`

###### beforeTime?

`string`

###### expired?

[`ReadableAddress`](../../../Algokit-Utils-API/type-aliases/ReadableAddress.md)[]

###### limit?

`number`

###### maxRound?

`number` \| `bigint`

###### minRound?

`number` \| `bigint`

###### next?

`string`

###### proposers?

[`ReadableAddress`](../../../Algokit-Utils-API/type-aliases/ReadableAddress.md)[]

#### Returns

`Promise`\<[`BlockHeadersResponse`](../type-aliases/BlockHeadersResponse.md)\>

***

### searchForTransactions()

> **searchForTransactions**(`params?`): `Promise`\<[`TransactionsResponse`](../type-aliases/TransactionsResponse.md)\>

Defined in: [packages/indexer\_client/src/apis/api-service.ts:647](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/indexer_client/src/apis/api-service.ts#L647)

Search for transactions. Transactions are returned oldest to newest unless the address parameter is used, in which case results are returned newest to oldest.

#### Parameters

##### params?

###### address?

[`ReadableAddress`](../../../Algokit-Utils-API/type-aliases/ReadableAddress.md)

###### addressRole?

`"receiver"` \| `"sender"` \| `"freeze-target"`

###### afterTime?

`string`

###### applicationId?

`number` \| `bigint`

###### assetId?

`number` \| `bigint`

###### beforeTime?

`string`

###### currencyGreaterThan?

`number` \| `bigint`

###### currencyLessThan?

`number` \| `bigint`

###### excludeCloseTo?

`boolean`

###### groupId?

`string`

###### limit?

`number`

###### maxRound?

`number` \| `bigint`

###### minRound?

`number` \| `bigint`

###### next?

`string`

###### notePrefix?

`string`

###### rekeyTo?

`boolean`

###### round?

`number` \| `bigint`

###### sigType?

`"sig"` \| `"msig"` \| `"lsig"`

###### txId?

`string`

###### txType?

`"pay"` \| `"keyreg"` \| `"acfg"` \| `"axfer"` \| `"afrz"` \| `"appl"` \| `"stpf"` \| `"hb"`

#### Returns

`Promise`\<[`TransactionsResponse`](../type-aliases/TransactionsResponse.md)\>
