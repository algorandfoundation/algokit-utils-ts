[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app](../README.md) / AppMetadata

# Interface: AppMetadata

Defined in: [src/types/app.ts:163](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L163)

The metadata that can be collected about a deployed app

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`AppReference`](AppReference.md).[`AppDeployMetadata`](AppDeployMetadata.md)

## Properties

### appAddress

> **appAddress**: `string`

Defined in: [src/types/app.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L38)

The Algorand address of the account associated with the app

#### Inherited from

[`AppReference`](AppReference.md).[`appAddress`](AppReference.md#appaddress)

***

### appId

> **appId**: `number` \| `bigint`

Defined in: [src/types/app.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L36)

The id of the app

#### Inherited from

[`AppReference`](AppReference.md).[`appId`](AppReference.md#appid)

***

### createdMetadata

> **createdMetadata**: [`AppDeployMetadata`](AppDeployMetadata.md)

Defined in: [src/types/app.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L169)

The metadata when the app was created

***

### createdRound

> **createdRound**: `number`

Defined in: [src/types/app.ts:165](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L165)

The round the app was created

***

### deletable?

> `optional` **deletable**: `boolean`

Defined in: [src/types/app.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L157)

Whether or not the app is deletable / permanent / unspecified

#### Inherited from

[`AppDeployMetadata`](AppDeployMetadata.md).[`deletable`](AppDeployMetadata.md#deletable)

***

### deleted

> **deleted**: `boolean`

Defined in: [src/types/app.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L171)

Whether or not the app is deleted

***

### name

> **name**: `string`

Defined in: [src/types/app.ts:153](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L153)

The unique name identifier of the app within the creator account

#### Inherited from

[`AppDeployMetadata`](AppDeployMetadata.md).[`name`](AppDeployMetadata.md#name)

***

### updatable?

> `optional` **updatable**: `boolean`

Defined in: [src/types/app.ts:159](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L159)

Whether or not the app is updatable / immutable / unspecified

#### Inherited from

[`AppDeployMetadata`](AppDeployMetadata.md).[`updatable`](AppDeployMetadata.md#updatable)

***

### updatedRound

> **updatedRound**: `number`

Defined in: [src/types/app.ts:167](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L167)

The last round that the app was updated

***

### version

> **version**: `string`

Defined in: [src/types/app.ts:155](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L155)

The version of app that is / will be deployed

#### Inherited from

[`AppDeployMetadata`](AppDeployMetadata.md).[`version`](AppDeployMetadata.md#version)
