[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/kmd-client](../README.md) / FetchHttpRequest

# Class: FetchHttpRequest

Defined in: [packages/kmd\_client/src/core/fetch-http-request.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/core/fetch-http-request.ts#L61)

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`BaseHttpRequest`](BaseHttpRequest.md)

## Constructors

### Constructor

> **new FetchHttpRequest**(`config`): `FetchHttpRequest`

Defined in: [packages/kmd\_client/src/core/base-http-request.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/core/base-http-request.ts#L20)

#### Parameters

##### config

[`ClientConfig`](../interfaces/ClientConfig.md)

#### Returns

`FetchHttpRequest`

#### Inherited from

[`BaseHttpRequest`](BaseHttpRequest.md).[`constructor`](BaseHttpRequest.md#constructor)

## Properties

### config

> `readonly` **config**: [`ClientConfig`](../interfaces/ClientConfig.md)

Defined in: [packages/kmd\_client/src/core/base-http-request.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/core/base-http-request.ts#L20)

#### Inherited from

[`BaseHttpRequest`](BaseHttpRequest.md).[`config`](BaseHttpRequest.md#config)

## Methods

### request()

> **request**\<`T`\>(`options`): `Promise`\<`T`\>

Defined in: [packages/kmd\_client/src/core/fetch-http-request.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/kmd_client/src/core/fetch-http-request.ts#L62)

#### Type Parameters

##### T

`T`

#### Parameters

##### options

[`ApiRequestOptions`](../interfaces/ApiRequestOptions.md)

#### Returns

`Promise`\<`T`\>

#### Overrides

[`BaseHttpRequest`](BaseHttpRequest.md).[`request`](BaseHttpRequest.md#request)
