[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-deployer](../README.md) / AppMetadata

# Interface: AppMetadata

Defined in: [src/types/app-deployer.ts:74](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L74)

The metadata that can be collected about a deployed app

## Extends

- [`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md)

## Properties

### appAddress

> **appAddress**: `Address`

Defined in: [src/types/app-deployer.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L78)

The Algorand address of the account associated with the app

***

### appId

> **appId**: `bigint`

Defined in: [src/types/app-deployer.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L76)

The id of the app

***

### createdMetadata

> **createdMetadata**: [`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md)

Defined in: [src/types/app-deployer.ts:84](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L84)

The metadata when the app was created

***

### createdRound

> **createdRound**: `bigint`

Defined in: [src/types/app-deployer.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L80)

The round the app was created

***

### deletable?

> `optional` **deletable**: `boolean`

Defined in: [src/types/app.ts:253](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L253)

Whether or not the app is deletable / permanent / unspecified

#### Inherited from

[`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md).[`deletable`](../../app/interfaces/AppDeployMetadata.md#deletable)

***

### deleted

> **deleted**: `boolean`

Defined in: [src/types/app-deployer.ts:86](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L86)

Whether or not the app is deleted

***

### name

> **name**: `string`

Defined in: [src/types/app.ts:249](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L249)

The unique name identifier of the app within the creator account

#### Inherited from

[`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md).[`name`](../../app/interfaces/AppDeployMetadata.md#name)

***

### updatable?

> `optional` **updatable**: `boolean`

Defined in: [src/types/app.ts:255](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L255)

Whether or not the app is updatable / immutable / unspecified

#### Inherited from

[`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md).[`updatable`](../../app/interfaces/AppDeployMetadata.md#updatable)

***

### updatedRound

> **updatedRound**: `bigint`

Defined in: [src/types/app-deployer.ts:82](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L82)

The last round that the app was updated

***

### version

> **version**: `string`

Defined in: [src/types/app.ts:251](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L251)

The version of app that is / will be deployed

#### Inherited from

[`AppDeployMetadata`](../../app/interfaces/AppDeployMetadata.md).[`version`](../../app/interfaces/AppDeployMetadata.md#version)
