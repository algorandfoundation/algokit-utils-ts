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

### Methods

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

[src/types/algo-http-client-with-retry.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algo-http-client-with-retry.ts#L9)

## Methods

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

[src/types/algo-http-client-with-retry.ts:56](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algo-http-client-with-retry.ts#L56)

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

[src/types/algo-http-client-with-retry.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algo-http-client-with-retry.ts#L13)

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

[src/types/algo-http-client-with-retry.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algo-http-client-with-retry.ts#L47)
