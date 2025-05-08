[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app](../README.md) / AppMetadata

# Interface: AppMetadata

Defined in: [src/types/app.ts:259](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L259)

The metadata that can be collected about a deployed app

## Extends

- [`AppReference`](AppReference.md).[`AppDeployMetadata`](AppDeployMetadata.md)

## Properties

### appAddress

> **appAddress**: `string`

Defined in: [src/types/app.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L43)

The Algorand address of the account associated with the app

#### Inherited from

[`AppReference`](AppReference.md).[`appAddress`](AppReference.md#appaddress)

***

### appId

> **appId**: `number` \| `bigint`

Defined in: [src/types/app.ts:41](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L41)

The id of the app

#### Inherited from

[`AppReference`](AppReference.md).[`appId`](AppReference.md#appid)

***

### createdMetadata

> **createdMetadata**: [`AppDeployMetadata`](AppDeployMetadata.md)

Defined in: [src/types/app.ts:265](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L265)

The metadata when the app was created

***

### createdRound

> **createdRound**: `number`

Defined in: [src/types/app.ts:261](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L261)

The round the app was created

***

### deletable?

> `optional` **deletable**: `boolean`

Defined in: [src/types/app.ts:253](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L253)

Whether or not the app is deletable / permanent / unspecified

#### Inherited from

[`AppDeployMetadata`](AppDeployMetadata.md).[`deletable`](AppDeployMetadata.md#deletable)

***

### deleted

> **deleted**: `boolean`

Defined in: [src/types/app.ts:267](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L267)

Whether or not the app is deleted

***

### name

> **name**: `string`

Defined in: [src/types/app.ts:249](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L249)

The unique name identifier of the app within the creator account

#### Inherited from

[`AppDeployMetadata`](AppDeployMetadata.md).[`name`](AppDeployMetadata.md#name)

***

### updatable?

> `optional` **updatable**: `boolean`

Defined in: [src/types/app.ts:255](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L255)

Whether or not the app is updatable / immutable / unspecified

#### Inherited from

[`AppDeployMetadata`](AppDeployMetadata.md).[`updatable`](AppDeployMetadata.md#updatable)

***

### updatedRound

> **updatedRound**: `number`

Defined in: [src/types/app.ts:263](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L263)

The last round that the app was updated

***

### version

> **version**: `string`

Defined in: [src/types/app.ts:251](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L251)

The version of app that is / will be deployed

#### Inherited from

[`AppDeployMetadata`](AppDeployMetadata.md).[`version`](AppDeployMetadata.md#version)
