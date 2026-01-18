[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app](../README.md) / AppDeployMetadata

# Interface: AppDeployMetadata

Defined in: [src/types/app.ts:151](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L151)

The payload of the metadata to add to the transaction note when deploying an app, noting it will be prefixed with `APP_DEPLOY_NOTE_PREFIX`.

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extended by

- [`AppMetadata`](../../app-deployer/interfaces/AppMetadata.md)
- [`AppMetadata`](AppMetadata.md)

## Properties

### deletable?

> `optional` **deletable**: `boolean`

Defined in: [src/types/app.ts:157](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L157)

Whether or not the app is deletable / permanent / unspecified

***

### name

> **name**: `string`

Defined in: [src/types/app.ts:153](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L153)

The unique name identifier of the app within the creator account

***

### updatable?

> `optional` **updatable**: `boolean`

Defined in: [src/types/app.ts:159](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L159)

Whether or not the app is updatable / immutable / unspecified

***

### version

> **version**: `string`

Defined in: [src/types/app.ts:155](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L155)

The version of app that is / will be deployed
