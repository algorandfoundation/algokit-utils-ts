[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-deployer](../README.md) / AppMetadata

# Interface: AppMetadata

Defined in: [src/types/app-deployer.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L75)

The metadata that can be collected about a deployed app

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md)

## Properties

### appAddress

> **appAddress**: [`Address`](../../../Algokit-Utils-API/classes/Address.md)

Defined in: [src/types/app-deployer.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L79)

The Algorand address of the account associated with the app

***

### appId

> **appId**: `bigint`

Defined in: [src/types/app-deployer.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L77)

The id of the app

***

### createdMetadata

> **createdMetadata**: [`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md)

Defined in: [src/types/app-deployer.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L85)

The metadata when the app was created

***

### createdRound

> **createdRound**: `bigint`

Defined in: [src/types/app-deployer.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L81)

The round the app was created

***

### deletable?

> `optional` **deletable**: `boolean`

Defined in: [src/types/app.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L157)

Whether or not the app is deletable / permanent / unspecified

#### Inherited from

[`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md).[`deletable`](../../app/interfaces/AppDeployMetadata.md#deletable)

***

### deleted

> **deleted**: `boolean`

Defined in: [src/types/app-deployer.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L87)

Whether or not the app is deleted

***

### name

> **name**: `string`

Defined in: [src/types/app.ts:153](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L153)

The unique name identifier of the app within the creator account

#### Inherited from

[`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md).[`name`](../../app/interfaces/AppDeployMetadata.md#name)

***

### updatable?

> `optional` **updatable**: `boolean`

Defined in: [src/types/app.ts:159](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L159)

Whether or not the app is updatable / immutable / unspecified

#### Inherited from

[`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md).[`updatable`](../../app/interfaces/AppDeployMetadata.md#updatable)

***

### updatedRound

> **updatedRound**: `bigint`

Defined in: [src/types/app-deployer.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L83)

The last round that the app was updated

***

### version

> **version**: `string`

Defined in: [src/types/app.ts:155](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L155)

The version of app that is / will be deployed

#### Inherited from

[`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md).[`version`](../../app/interfaces/AppDeployMetadata.md#version)
