[@algorandfoundation/algokit-utils](../README.md) / [types/algo-http-client-with-retry](../modules/types_algo_http_client_with_retry.md) / AlgoHttpClientWithRetry

# Class: AlgoHttpClientWithRetry

[types/algo-http-client-with-retry](../modules/types_algo_http_client_with_retry.md).AlgoHttpClientWithRetry

A HTTP Client that wraps the Algorand SDK HTTP Client with retries

## Hierarchy

- `URLTokenBaseHTTPClient`

  ↳ **`AlgoHttpClientWithRetry`**

## Table of contents

### Constructors

- [constructor](types_algo_http_client_with_retry.AlgoHttpClientWithRetry.md#constructor)

### Properties

- [\_algoKitCoreAlgod](types_algo_http_client_with_retry.AlgoHttpClientWithRetry.md#_algokitcorealgod)
- [MAX\_BACKOFF\_MS](types_algo_http_client_with_retry.AlgoHttpClientWithRetry.md#max_backoff_ms)
- [MAX\_TRIES](types_algo_http_client_with_retry.AlgoHttpClientWithRetry.md#max_tries)
- [RETRY\_ERROR\_CODES](types_algo_http_client_with_retry.AlgoHttpClientWithRetry.md#retry_error_codes)
- [RETRY\_STATUS\_CODES](types_algo_http_client_with_retry.AlgoHttpClientWithRetry.md#retry_status_codes)

### Methods

- [buildBaseServerUrl](types_algo_http_client_with_retry.AlgoHttpClientWithRetry.md#buildbaseserverurl)
- [callWithRetry](types_algo_http_client_with_retry.AlgoHttpClientWithRetry.md#callwithretry)
- [delete](types_algo_http_client_with_retry.AlgoHttpClientWithRetry.md#delete)
- [get](types_algo_http_client_with_retry.AlgoHttpClientWithRetry.md#get)
- [post](types_algo_http_client_with_retry.AlgoHttpClientWithRetry.md#post)

## Constructors

### constructor

• **new AlgoHttpClientWithRetry**(`tokenHeader`, `baseServer`, `port?`, `defaultHeaders?`): [`AlgoHttpClientWithRetry`](types_algo_http_client_with_retry.AlgoHttpClientWithRetry.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenHeader` | `TokenHeader` |
| `baseServer` | `string` |
| `port?` | `string` \| `number` |
| `defaultHeaders?` | `Record`\<`string`, `any`\> |

#### Returns

[`AlgoHttpClientWithRetry`](types_algo_http_client_with_retry.AlgoHttpClientWithRetry.md)

#### Overrides

URLTokenBaseHTTPClient.constructor

#### Defined in

[src/types/algo-http-client-with-retry.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algo-http-client-with-retry.ts#L21)

## Properties

### \_algoKitCoreAlgod

• `Private` **\_algoKitCoreAlgod**: `PromiseAlgodApi`

#### Defined in

[src/types/algo-http-client-with-retry.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algo-http-client-with-retry.ts#L18)

___

### MAX\_BACKOFF\_MS

▪ `Static` `Private` `Readonly` **MAX\_BACKOFF\_MS**: ``10000``

#### Defined in

[src/types/algo-http-client-with-retry.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algo-http-client-with-retry.ts#L28)

___

### MAX\_TRIES

▪ `Static` `Private` `Readonly` **MAX\_TRIES**: ``5``

#### Defined in

[src/types/algo-http-client-with-retry.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algo-http-client-with-retry.ts#L27)

___

### RETRY\_ERROR\_CODES

▪ `Static` `Private` `Readonly` **RETRY\_ERROR\_CODES**: `string`[]

#### Defined in

[src/types/algo-http-client-with-retry.ts:33](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algo-http-client-with-retry.ts#L33)

___

### RETRY\_STATUS\_CODES

▪ `Static` `Private` `Readonly` **RETRY\_STATUS\_CODES**: `number`[]

#### Defined in

[src/types/algo-http-client-with-retry.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algo-http-client-with-retry.ts#L32)

## Methods

### buildBaseServerUrl

▸ **buildBaseServerUrl**(`baseServer`, `port?`): `URL`

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseServer` | `string` |
| `port?` | `string` \| `number` |

#### Returns

`URL`

#### Defined in

[src/types/algo-http-client-with-retry.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algo-http-client-with-retry.ts#L45)

___

### callWithRetry

▸ **callWithRetry**(`func`): `Promise`\<`BaseHTTPClientResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `func` | () => `Promise`\<`BaseHTTPClientResponse`\> |

#### Returns

`Promise`\<`BaseHTTPClientResponse`\>

#### Defined in

[src/types/algo-http-client-with-retry.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algo-http-client-with-retry.ts#L60)

___

### delete

▸ **delete**(`relativePath`, `data`, `query?`, `requestHeaders?`): `Promise`\<`BaseHTTPClientResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativePath` | `string` |
| `data` | `Uint8Array` |
| `query?` | `Query`\<`string`\> |
| `requestHeaders` | `Record`\<`string`, `string`\> |

#### Returns

`Promise`\<`BaseHTTPClientResponse`\>

#### Overrides

URLTokenBaseHTTPClient.delete

#### Defined in

[src/types/algo-http-client-with-retry.ts:218](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algo-http-client-with-retry.ts#L218)

___

### get

▸ **get**(`relativePath`, `query?`, `requestHeaders?`): `Promise`\<`BaseHTTPClientResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativePath` | `string` |
| `query?` | `Query`\<`string`\> |
| `requestHeaders` | `Record`\<`string`, `string`\> |

#### Returns

`Promise`\<`BaseHTTPClientResponse`\>

#### Overrides

URLTokenBaseHTTPClient.get

#### Defined in

[src/types/algo-http-client-with-retry.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algo-http-client-with-retry.ts#L93)

___

### post

▸ **post**(`relativePath`, `data`, `query?`, `requestHeaders?`): `Promise`\<`BaseHTTPClientResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativePath` | `string` |
| `data` | `Uint8Array` |
| `query?` | `Query`\<`string`\> |
| `requestHeaders` | `Record`\<`string`, `string`\> |

#### Returns

`Promise`\<`BaseHTTPClientResponse`\>

#### Overrides

URLTokenBaseHTTPClient.post

#### Defined in

[src/types/algo-http-client-with-retry.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algo-http-client-with-retry.ts#L157)
