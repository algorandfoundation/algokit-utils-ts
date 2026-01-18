[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/kmd-client](../README.md) / BaseHttpRequest

# Abstract Class: BaseHttpRequest

Defined in: [packages/kmd\_client/src/core/base-http-request.ts:19](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/kmd_client/src/core/base-http-request.ts#L19)

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extended by

- [`FetchHttpRequest`](FetchHttpRequest.md)

## Constructors

### Constructor

> **new BaseHttpRequest**(`config`): `BaseHttpRequest`

Defined in: [packages/kmd\_client/src/core/base-http-request.ts:20](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/kmd_client/src/core/base-http-request.ts#L20)

#### Parameters

##### config

[`ClientConfig`](../interfaces/ClientConfig.md)

#### Returns

`BaseHttpRequest`

## Properties

### config

> `readonly` **config**: [`ClientConfig`](../interfaces/ClientConfig.md)

Defined in: [packages/kmd\_client/src/core/base-http-request.ts:20](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/kmd_client/src/core/base-http-request.ts#L20)

## Methods

### request()

> `abstract` **request**\<`T`\>(`options`): `Promise`\<`T`\>

Defined in: [packages/kmd\_client/src/core/base-http-request.ts:21](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/kmd_client/src/core/base-http-request.ts#L21)

#### Type Parameters

##### T

`T`

#### Parameters

##### options

[`ApiRequestOptions`](../interfaces/ApiRequestOptions.md)

#### Returns

`Promise`\<`T`\>
