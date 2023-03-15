[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / AppMetadata

# Interface: AppMetadata

[index](../modules/index.md).AppMetadata

The metadata that can be collected about a deployed app

## Hierarchy

- [`AppReference`](index.AppReference.md)

- [`AppDeployMetadata`](index.AppDeployMetadata.md)

  ↳ **`AppMetadata`**

## Table of contents

### Properties

- [appAddress](index.AppMetadata.md#appaddress)
- [appIndex](index.AppMetadata.md#appindex)
- [createdMetadata](index.AppMetadata.md#createdmetadata)
- [createdRound](index.AppMetadata.md#createdround)
- [deletable](index.AppMetadata.md#deletable)
- [deleted](index.AppMetadata.md#deleted)
- [name](index.AppMetadata.md#name)
- [updatable](index.AppMetadata.md#updatable)
- [updatedRound](index.AppMetadata.md#updatedround)
- [version](index.AppMetadata.md#version)

## Properties

### appAddress

• **appAddress**: `string`

The Algorand address of the account associated with the app

#### Inherited from

[AppReference](index.AppReference.md).[appAddress](index.AppReference.md#appaddress)

#### Defined in

[app.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L38)

___

### appIndex

• **appIndex**: `number`

The index of the app

#### Inherited from

[AppReference](index.AppReference.md).[appIndex](index.AppReference.md#appindex)

#### Defined in

[app.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L36)

___

### createdMetadata

• **createdMetadata**: [`AppDeployMetadata`](index.AppDeployMetadata.md)

The metadata when the app was created

#### Defined in

[deploy-app.ts:33](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L33)

___

### createdRound

• **createdRound**: `number`

The round the app was created

#### Defined in

[deploy-app.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L29)

___

### deletable

• `Optional` **deletable**: `boolean`

Whether or not the app is deletable / permanent / unspecified

#### Inherited from

[AppDeployMetadata](index.AppDeployMetadata.md).[deletable](index.AppDeployMetadata.md#deletable)

#### Defined in

[deploy-app.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L21)

___

### deleted

• **deleted**: `boolean`

Whether or not the app is deleted

#### Defined in

[deploy-app.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L35)

___

### name

• **name**: `string`

The unique name identifier of the app within the creator account

#### Inherited from

[AppDeployMetadata](index.AppDeployMetadata.md).[name](index.AppDeployMetadata.md#name)

#### Defined in

[deploy-app.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L17)

___

### updatable

• `Optional` **updatable**: `boolean`

Whether or not the app is updatable / immutable / unspecified

#### Inherited from

[AppDeployMetadata](index.AppDeployMetadata.md).[updatable](index.AppDeployMetadata.md#updatable)

#### Defined in

[deploy-app.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L23)

___

### updatedRound

• **updatedRound**: `number`

The last round that the app was updated

#### Defined in

[deploy-app.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L31)

___

### version

• **version**: `string`

The version of app that is / will be deployed

#### Inherited from

[AppDeployMetadata](index.AppDeployMetadata.md).[version](index.AppDeployMetadata.md#version)

#### Defined in

[deploy-app.ts:19](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/deploy-app.ts#L19)
