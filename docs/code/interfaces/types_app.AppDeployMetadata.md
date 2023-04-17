[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / AppDeployMetadata

# Interface: AppDeployMetadata

[types/app](../modules/types_app.md).AppDeployMetadata

The payload of the metadata to add to the transaction note when deploying an app, noting it will be prefixed with

**`See`**

.

## Hierarchy

- **`AppDeployMetadata`**

  ↳ [`AppMetadata`](types_app.AppMetadata.md)

## Table of contents

### Properties

- [deletable](types_app.AppDeployMetadata.md#deletable)
- [name](types_app.AppDeployMetadata.md#name)
- [updatable](types_app.AppDeployMetadata.md#updatable)
- [version](types_app.AppDeployMetadata.md#version)

## Properties

### deletable

• `Optional` **deletable**: `boolean`

Whether or not the app is deletable / permanent / unspecified

#### Defined in

[src/types/app.ts:194](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L194)

___

### name

• **name**: `string`

The unique name identifier of the app within the creator account

#### Defined in

[src/types/app.ts:190](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L190)

___

### updatable

• `Optional` **updatable**: `boolean`

Whether or not the app is updatable / immutable / unspecified

#### Defined in

[src/types/app.ts:196](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L196)

___

### version

• **version**: `string`

The version of app that is / will be deployed

#### Defined in

[src/types/app.ts:192](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L192)