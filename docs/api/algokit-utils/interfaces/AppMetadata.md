[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / AppMetadata

# Interface: AppMetadata

Defined in: [src/app-deployer.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-deployer.ts#L75)

The metadata that can be collected about a deployed app

## Hierarchy

[View Summary](../../hierarchy.md)

### Extends

- [`AppDeployMetadata`](AppDeployMetadata.md)

## Properties

### appAddress

> **appAddress**: [`Address`](../classes/Address.md)

Defined in: [src/app-deployer.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-deployer.ts#L79)

The Algorand address of the account associated with the app

***

### appId

> **appId**: `bigint`

Defined in: [src/app-deployer.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-deployer.ts#L77)

The id of the app

***

### createdMetadata

> **createdMetadata**: [`AppDeployMetadata`](AppDeployMetadata.md)

Defined in: [src/app-deployer.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-deployer.ts#L85)

The metadata when the app was created

***

### createdRound

> **createdRound**: `bigint`

Defined in: [src/app-deployer.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-deployer.ts#L81)

The round the app was created

***

### deletable?

> `optional` **deletable**: `boolean`

Defined in: [src/app.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L157)

Whether or not the app is deletable / permanent / unspecified

#### Inherited from

[`AppDeployMetadata`](AppDeployMetadata.md).[`deletable`](AppDeployMetadata.md#deletable)

***

### deleted

> **deleted**: `boolean`

Defined in: [src/app-deployer.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-deployer.ts#L87)

Whether or not the app is deleted

***

### name

> **name**: `string`

Defined in: [src/app.ts:153](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L153)

The unique name identifier of the app within the creator account

#### Inherited from

[`AppDeployMetadata`](AppDeployMetadata.md).[`name`](AppDeployMetadata.md#name)

***

### updatable?

> `optional` **updatable**: `boolean`

Defined in: [src/app.ts:159](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L159)

Whether or not the app is updatable / immutable / unspecified

#### Inherited from

[`AppDeployMetadata`](AppDeployMetadata.md).[`updatable`](AppDeployMetadata.md#updatable)

***

### updatedRound

> **updatedRound**: `bigint`

Defined in: [src/app-deployer.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-deployer.ts#L83)

The last round that the app was updated

***

### version

> **version**: `string`

Defined in: [src/app.ts:155](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L155)

The version of app that is / will be deployed

#### Inherited from

[`AppDeployMetadata`](AppDeployMetadata.md).[`version`](AppDeployMetadata.md#version)
