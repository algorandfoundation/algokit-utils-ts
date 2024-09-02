[@algorandfoundation/algokit-utils](../README.md) / [types/app-deployer](../modules/types_app_deployer.md) / AppMetadata

# Interface: AppMetadata

[types/app-deployer](../modules/types_app_deployer.md).AppMetadata

The metadata that can be collected about a deployed app

## Hierarchy

- [`AppDeployMetadata`](types_app.AppDeployMetadata.md)

  ↳ **`AppMetadata`**

## Table of contents

### Properties

- [appAddress](types_app_deployer.AppMetadata.md#appaddress)
- [appId](types_app_deployer.AppMetadata.md#appid)
- [createdMetadata](types_app_deployer.AppMetadata.md#createdmetadata)
- [createdRound](types_app_deployer.AppMetadata.md#createdround)
- [deletable](types_app_deployer.AppMetadata.md#deletable)
- [deleted](types_app_deployer.AppMetadata.md#deleted)
- [name](types_app_deployer.AppMetadata.md#name)
- [updatable](types_app_deployer.AppMetadata.md#updatable)
- [updatedRound](types_app_deployer.AppMetadata.md#updatedround)
- [version](types_app_deployer.AppMetadata.md#version)

## Properties

### appAddress

• **appAddress**: `string`

The Algorand address of the account associated with the app

#### Defined in

[src/types/app-deployer.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L69)

___

### appId

• **appId**: `bigint`

The id of the app

#### Defined in

[src/types/app-deployer.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L67)

___

### createdMetadata

• **createdMetadata**: [`AppDeployMetadata`](types_app.AppDeployMetadata.md)

The metadata when the app was created

#### Defined in

[src/types/app-deployer.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L75)

___

### createdRound

• **createdRound**: `bigint`

The round the app was created

#### Defined in

[src/types/app-deployer.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L71)

___

### deletable

• `Optional` **deletable**: `boolean`

Whether or not the app is deletable / permanent / unspecified

#### Inherited from

[AppDeployMetadata](types_app.AppDeployMetadata.md).[deletable](types_app.AppDeployMetadata.md#deletable)

#### Defined in

[src/types/app.ts:253](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L253)

___

### deleted

• **deleted**: `boolean`

Whether or not the app is deleted

#### Defined in

[src/types/app-deployer.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L77)

___

### name

• **name**: `string`

The unique name identifier of the app within the creator account

#### Inherited from

[AppDeployMetadata](types_app.AppDeployMetadata.md).[name](types_app.AppDeployMetadata.md#name)

#### Defined in

[src/types/app.ts:249](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L249)

___

### updatable

• `Optional` **updatable**: `boolean`

Whether or not the app is updatable / immutable / unspecified

#### Inherited from

[AppDeployMetadata](types_app.AppDeployMetadata.md).[updatable](types_app.AppDeployMetadata.md#updatable)

#### Defined in

[src/types/app.ts:255](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L255)

___

### updatedRound

• **updatedRound**: `bigint`

The last round that the app was updated

#### Defined in

[src/types/app-deployer.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L73)

___

### version

• **version**: `string`

The version of app that is / will be deployed

#### Inherited from

[AppDeployMetadata](types_app.AppDeployMetadata.md).[version](types_app.AppDeployMetadata.md#version)

#### Defined in

[src/types/app.ts:251](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L251)
