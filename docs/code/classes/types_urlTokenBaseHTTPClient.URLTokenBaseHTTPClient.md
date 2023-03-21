[@algorandfoundation/algokit-utils](../README.md) / [types/urlTokenBaseHTTPClient](../modules/types_urlTokenBaseHTTPClient.md) / URLTokenBaseHTTPClient

# Class: URLTokenBaseHTTPClient

[types/urlTokenBaseHTTPClient](../modules/types_urlTokenBaseHTTPClient.md).URLTokenBaseHTTPClient

Implementation of BaseHTTPClient that uses a URL and a token
and make the REST queries using fetch.
This is the default implementation of BaseHTTPClient.

## Hierarchy

- **`URLTokenBaseHTTPClient`**

  ↳ [`AlgoHttpClientWithRetry`](types_algo_http_client_with_retry.AlgoHttpClientWithRetry.md)

## Implements

- `BaseHTTPClient`

## Table of contents

### Constructors

- [constructor](types_urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md#constructor)

### Properties

- [baseURL](types_urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md#baseurl)
- [defaultHeaders](types_urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md#defaultheaders)
- [tokenHeader](types_urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md#tokenheader)

### Methods

- [delete](types_urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md#delete)
- [get](types_urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md#get)
- [getURL](types_urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md#geturl)
- [post](types_urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md#post)
- [checkHttpError](types_urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md#checkhttperror)
- [formatFetchResponse](types_urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md#formatfetchresponse)
- [formatFetchResponseHeaders](types_urlTokenBaseHTTPClient.URLTokenBaseHTTPClient.md#formatfetchresponseheaders)

## Constructors

### constructor

• **new URLTokenBaseHTTPClient**(`tokenHeader`, `baseServer`, `port?`, `defaultHeaders?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenHeader` | [`TokenHeader`](../modules/types_urlTokenBaseHTTPClient.md#tokenheader) |
| `baseServer` | `string` |
| `port?` | `string` \| `number` |
| `defaultHeaders` | `Record`<`string`, `any`\> |

#### Defined in

types/urlTokenBaseHTTPClient.ts:45

## Properties

### baseURL

• `Private` `Readonly` **baseURL**: `URL`

#### Defined in

types/urlTokenBaseHTTPClient.ts:41

___

### defaultHeaders

• `Private` **defaultHeaders**: `Record`<`string`, `any`\> = `{}`

#### Defined in

types/urlTokenBaseHTTPClient.ts:45

___

### tokenHeader

• `Private` `Readonly` **tokenHeader**: [`TokenHeader`](../modules/types_urlTokenBaseHTTPClient.md#tokenheader)

#### Defined in

types/urlTokenBaseHTTPClient.ts:42

## Methods

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

#### Implementation of

BaseHTTPClient.delete

#### Defined in

types/urlTokenBaseHTTPClient.ts:176

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

#### Implementation of

BaseHTTPClient.get

#### Defined in

types/urlTokenBaseHTTPClient.ts:137

___

### getURL

▸ `Private` **getURL**(`relativePath`, `query?`): `string`

Compute the URL for a path relative to the instance's address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relativePath` | `string` | A path string |
| `query?` | `Query`<`string`\> | An optional key-value object of query parameters to add to the URL. If the relativePath already has query parameters on it, the additional parameters defined here will be added to the URL without modifying those (unless a key collision occurs). |

#### Returns

`string`

A URL string

#### Defined in

types/urlTokenBaseHTTPClient.ts:71

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

#### Implementation of

BaseHTTPClient.post

#### Defined in

types/urlTokenBaseHTTPClient.ts:153

___

### checkHttpError

▸ `Static` `Private` **checkHttpError**(`res`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `Response` |

#### Returns

`Promise`<`void`\>

#### Defined in

types/urlTokenBaseHTTPClient.ts:97

___

### formatFetchResponse

▸ `Static` `Private` **formatFetchResponse**(`res`): `Promise`<`BaseHTTPClientResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `Response` |

#### Returns

`Promise`<`BaseHTTPClientResponse`\>

#### Defined in

types/urlTokenBaseHTTPClient.ts:128

___

### formatFetchResponseHeaders

▸ `Static` `Private` **formatFetchResponseHeaders**(`headers`): `Record`<`string`, `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `headers` | `Headers` |

#### Returns

`Record`<`string`, `string`\>

#### Defined in

types/urlTokenBaseHTTPClient.ts:89
