[@algorandfoundation/algokit-utils](../README.md) / [deploy-app](../modules/deploy_app.md) / AppDeployMetadata

# Interface: AppDeployMetadata

[deploy-app](../modules/deploy_app.md).AppDeployMetadata

The payload of the metadata to add to the transaction note when deploying an app, noting it will be prefixed with

**`See`**

.

## Hierarchy

- **`AppDeployMetadata`**

  ↳ [`AppMetadata`](deploy_app.AppMetadata.md)

## Table of contents

### Properties

- [deletable](deploy_app.AppDeployMetadata.md#deletable)
- [name](deploy_app.AppDeployMetadata.md#name)
- [updatable](deploy_app.AppDeployMetadata.md#updatable)
- [version](deploy_app.AppDeployMetadata.md#version)

## Properties

### deletable

• `Optional` **deletable**: `boolean`

Whether or not the app is deletable / permanent / unspecified

#### Defined in

[deploy-app.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/deploy-app.ts#L21)

___

### name

• **name**: `string`

The unique name identifier of the app within the creator account

#### Defined in

[deploy-app.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/deploy-app.ts#L17)

___

### updatable

• `Optional` **updatable**: `boolean`

Whether or not the app is updatable / immutable / unspecified

#### Defined in

[deploy-app.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/deploy-app.ts#L23)

___

### version

• **version**: `string`

The version of app that is / will be deployed

#### Defined in

[deploy-app.ts:19](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/deploy-app.ts#L19)
