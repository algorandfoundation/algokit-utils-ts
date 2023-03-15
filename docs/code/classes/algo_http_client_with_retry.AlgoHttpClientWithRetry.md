[@algorandfoundation/algokit-utils](../README.md) / [algo-http-client-with-retry](../modules/algo_http_client_with_retry.md) / AlgoHttpClientWithRetry

# Class: AlgoHttpClientWithRetry

[algo-http-client-with-retry](../modules/algo_http_client_with_retry.md).AlgoHttpClientWithRetry

A HTTP Client that wraps the Algorand SDK HTTP Client with retries

## Hierarchy

- [`URLTokenBaseHTTPClient`](urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md)

  ↳ **`AlgoHttpClientWithRetry`**

## Table of contents

### Constructors

- [constructor](algo_http_client_with_retry.AlgoHttpClientWithRetry.md#constructor)

### Properties

- [MAX\_BACKOFF\_MS](algo_http_client_with_retry.AlgoHttpClientWithRetry.md#max_backoff_ms)
- [MAX\_TRIES](algo_http_client_with_retry.AlgoHttpClientWithRetry.md#max_tries)
- [RETRY\_ERROR\_CODES](algo_http_client_with_retry.AlgoHttpClientWithRetry.md#retry_error_codes)
- [RETRY\_STATUS\_CODES](algo_http_client_with_retry.AlgoHttpClientWithRetry.md#retry_status_codes)

### Methods

- [callWithRetry](algo_http_client_with_retry.AlgoHttpClientWithRetry.md#callwithretry)
- [delete](algo_http_client_with_retry.AlgoHttpClientWithRetry.md#delete)
- [get](algo_http_client_with_retry.AlgoHttpClientWithRetry.md#get)
- [post](algo_http_client_with_retry.AlgoHttpClientWithRetry.md#post)

## Constructors

### constructor

• **new AlgoHttpClientWithRetry**(`tokenHeader`, `baseServer`, `port?`, `defaultHeaders?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenHeader` | [`TokenHeader`](../modules/urlTokenBaseHTTPClient.md#tokenheader) |
| `baseServer` | `string` |
| `port?` | `string` \| `number` |
| `defaultHeaders` | `Record`<`string`, `any`\> |

#### Inherited from

[URLTokenBaseHTTPClient](urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md).[constructor](urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md#constructor)

#### Defined in

[urlTokenBaseHTTPClient.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/urlTokenBaseHTTPClient.ts#L45)

## Properties

### MAX\_BACKOFF\_MS

▪ `Static` `Private` `Readonly` **MAX\_BACKOFF\_MS**: ``10000``

#### Defined in

[algo-http-client-with-retry.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/algo-http-client-with-retry.ts#L8)

___

### MAX\_TRIES

▪ `Static` `Private` `Readonly` **MAX\_TRIES**: ``5``

#### Defined in

[algo-http-client-with-retry.ts:7](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/algo-http-client-with-retry.ts#L7)

___

### RETRY\_ERROR\_CODES

▪ `Static` `Private` `Readonly` **RETRY\_ERROR\_CODES**: `string`[]

#### Defined in

[algo-http-client-with-retry.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/algo-http-client-with-retry.ts#L13)

___

### RETRY\_STATUS\_CODES

▪ `Static` `Private` `Readonly` **RETRY\_STATUS\_CODES**: `number`[]

#### Defined in

[algo-http-client-with-retry.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/algo-http-client-with-retry.ts#L12)

## Methods

### callWithRetry

▸ `Private` **callWithRetry**(`func`): `Promise`<`BaseHTTPClientResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `func` | () => `Promise`<`BaseHTTPClientResponse`\> |

#### Returns

`Promise`<`BaseHTTPClientResponse`\>

#### Defined in

[algo-http-client-with-retry.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/algo-http-client-with-retry.ts#L25)

___

### delete

▸ **delete**(`relativePath`, `data`, `query?`, `requestHeaders?`): `Promise`<`BaseHTTPClientResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativePath` | `string` |
| `data` | `Uint8Array` |
| `query?` | `Query`<`string`\> |
| `requestHeaders` | `Record`<`string`, `string`\> |

#### Returns

`Promise`<`BaseHTTPClientResponse`\>

#### Overrides

[URLTokenBaseHTTPClient](urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md).[delete](urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md#delete)

#### Defined in

[algo-http-client-with-retry.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/algo-http-client-with-retry.ts#L67)

___

### get

▸ **get**(`relativePath`, `query?`, `requestHeaders?`): `Promise`<`BaseHTTPClientResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativePath` | `string` |
| `query?` | `Query`<`string`\> |
| `requestHeaders` | `Record`<`string`, `string`\> |

#### Returns

`Promise`<`BaseHTTPClientResponse`\>

#### Overrides

[URLTokenBaseHTTPClient](urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md).[get](urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md#get)

#### Defined in

[algo-http-client-with-retry.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/algo-http-client-with-retry.ts#L54)

___

### post

▸ **post**(`relativePath`, `data`, `query?`, `requestHeaders?`): `Promise`<`BaseHTTPClientResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativePath` | `string` |
| `data` | `Uint8Array` |
| `query?` | `Query`<`string`\> |
| `requestHeaders` | `Record`<`string`, `string`\> |

#### Returns

`Promise`<`BaseHTTPClientResponse`\>

#### Overrides

[URLTokenBaseHTTPClient](urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md).[post](urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md#post)

#### Defined in

[algo-http-client-with-retry.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/algo-http-client-with-retry.ts#L58)
