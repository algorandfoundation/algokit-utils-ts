[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / AppDeployMetadata

# Interface: AppDeployMetadata

[index](../modules/index.md).AppDeployMetadata

The payload of the metadata to add to the transaction note when deploying an app, noting it will be prefixed with

**`See`**

.

## Hierarchy

- **`AppDeployMetadata`**

  ↳ [`AppMetadata`](index.AppMetadata.md)

## Table of contents

### Properties

- [deletable](index.AppDeployMetadata.md#deletable)
- [name](index.AppDeployMetadata.md#name)
- [updatable](index.AppDeployMetadata.md#updatable)
- [version](index.AppDeployMetadata.md#version)

## Properties

### deletable

• `Optional` **deletable**: `boolean`

Whether or not the app is deletable / permanent / unspecified

#### Defined in

[deploy-app.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/deploy-app.ts#L21)

___

### name

• **name**: `string`

The unique name identifier of the app within the creator account

#### Defined in

[deploy-app.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/deploy-app.ts#L17)

___

### updatable

• `Optional` **updatable**: `boolean`

Whether or not the app is updatable / immutable / unspecified

#### Defined in

[deploy-app.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/deploy-app.ts#L23)

___

### version

• **version**: `string`

The version of app that is / will be deployed

#### Defined in

[deploy-app.ts:19](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/deploy-app.ts#L19)
