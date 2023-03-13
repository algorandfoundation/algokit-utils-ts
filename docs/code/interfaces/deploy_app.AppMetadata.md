[algotstest](../README.md) / [deploy-app](../modules/deploy_app.md) / AppMetadata

# Interface: AppMetadata

[deploy-app](../modules/deploy_app.md).AppMetadata

The metadata that can be collected about a deployed app

## Hierarchy

- [`AppReference`](app.AppReference.md)

- [`AppDeployMetadata`](deploy_app.AppDeployMetadata.md)

  ↳ **`AppMetadata`**

## Table of contents

### Properties

- [appAddress](deploy_app.AppMetadata.md#appaddress)
- [appIndex](deploy_app.AppMetadata.md#appindex)
- [createdMetadata](deploy_app.AppMetadata.md#createdmetadata)
- [createdRound](deploy_app.AppMetadata.md#createdround)
- [deletable](deploy_app.AppMetadata.md#deletable)
- [deleted](deploy_app.AppMetadata.md#deleted)
- [name](deploy_app.AppMetadata.md#name)
- [updatable](deploy_app.AppMetadata.md#updatable)
- [updatedRound](deploy_app.AppMetadata.md#updatedround)
- [version](deploy_app.AppMetadata.md#version)

## Properties

### appAddress

• **appAddress**: `string`

The Algorand address of the account associated with the app

#### Inherited from

[AppReference](app.AppReference.md).[appAddress](app.AppReference.md#appaddress)

#### Defined in

[app.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/app.ts#L23)

___

### appIndex

• **appIndex**: `number`

The index of the app

#### Inherited from

[AppReference](app.AppReference.md).[appIndex](app.AppReference.md#appindex)

#### Defined in

[app.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/app.ts#L21)

___

### createdMetadata

• **createdMetadata**: [`AppDeployMetadata`](deploy_app.AppDeployMetadata.md)

The metadata when the app was created

#### Defined in

[deploy-app.ts:33](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/deploy-app.ts#L33)

___

### createdRound

• **createdRound**: `number`

The round the app was created

#### Defined in

[deploy-app.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/deploy-app.ts#L29)

___

### deletable

• **deletable**: `boolean`

Whether or not the app is deletable / permanent

#### Inherited from

[AppDeployMetadata](deploy_app.AppDeployMetadata.md).[deletable](deploy_app.AppDeployMetadata.md#deletable)

#### Defined in

[deploy-app.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/deploy-app.ts#L21)

___

### deleted

• **deleted**: `boolean`

Whether or not the app is deleted

#### Defined in

[deploy-app.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/deploy-app.ts#L35)

___

### name

• **name**: `string`

The unique name identifier of the app within the creator account

#### Inherited from

[AppDeployMetadata](deploy_app.AppDeployMetadata.md).[name](deploy_app.AppDeployMetadata.md#name)

#### Defined in

[deploy-app.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/deploy-app.ts#L17)

___

### updatable

• **updatable**: `boolean`

Whether or not the app is updatable / immutable

#### Inherited from

[AppDeployMetadata](deploy_app.AppDeployMetadata.md).[updatable](deploy_app.AppDeployMetadata.md#updatable)

#### Defined in

[deploy-app.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/deploy-app.ts#L23)

___

### updatedRound

• **updatedRound**: `number`

The last round that the app was updated

#### Defined in

[deploy-app.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/deploy-app.ts#L31)

___

### version

• **version**: `string`

The version of app that is / will be deployed

#### Inherited from

[AppDeployMetadata](deploy_app.AppDeployMetadata.md).[version](deploy_app.AppDeployMetadata.md#version)

#### Defined in

[deploy-app.ts:19](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/deploy-app.ts#L19)
