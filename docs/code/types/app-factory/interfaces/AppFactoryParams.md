[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-factory](../README.md) / AppFactoryParams

# Interface: AppFactoryParams

Defined in: [src/types/app-factory.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L47)

Parameters to create an app client

## Properties

### algorand

> **algorand**: [`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

Defined in: [src/types/app-factory.ts:56](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L56)

`AlgorandClient` instance

***

### appName?

> `optional` **appName**: `string`

Defined in: [src/types/app-factory.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L62)

Optional override for the app name; used for on-chain metadata and lookups.
Defaults to the ARC-32/ARC-56 app spec name.

***

### appSpec

> **appSpec**: `string` \| [`Arc56Contract`](../../app-arc56/interfaces/Arc56Contract.md) \| [`AppSpec`](../../app-spec/interfaces/AppSpec.md)

Defined in: [src/types/app-factory.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L53)

The ARC-56 or ARC-32 application spec as either:
 * Parsed JSON ARC-56 `Contract`
 * Parsed JSON ARC-32 `AppSpec`
 * Raw JSON string (in either ARC-56 or ARC-32 format)

***

### defaultSender?

> `optional` **defaultSender**: `string` \| `Address`

Defined in: [src/types/app-factory.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L65)

Optional address to use for the account to use as the default sender for calls.

***

### defaultSigner?

> `optional` **defaultSigner**: `TransactionSigner`

Defined in: [src/types/app-factory.ts:68](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L68)

Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`).

***

### deletable?

> `optional` **deletable**: `boolean`

Defined in: [src/types/app-factory.ts:89](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L89)

Whether or not the contract should have deploy-time permanence control set, undefined = ignore.
If specified here will get used in calls to `deploy` and `create` calls unless overridden in those calls.

Useful if you want to vend multiple contracts from the same factory without specifying this value
for each call.

***

### deployTimeParams?

> `optional` **deployTimeParams**: [`TealTemplateParams`](../../app/interfaces/TealTemplateParams.md)

Defined in: [src/types/app-factory.ts:98](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L98)

Optional deploy-time TEAL template replacement parameters.
If specified here will get used in calls to `deploy` and `create` calls unless overridden in those calls.

Useful if you want to vend multiple contracts from the same factory without specifying this value
for each call.

***

### updatable?

> `optional` **updatable**: `boolean`

Defined in: [src/types/app-factory.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L80)

Whether or not the contract should have deploy-time immutability control set, undefined = ignore.
If specified here will get used in calls to `deploy` and `create` calls unless overridden in those calls.

Useful if you want to vend multiple contracts from the same factory without specifying this value
for each call.

***

### version?

> `optional` **version**: `string`

Defined in: [src/types/app-factory.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L71)

The version of app that is / will be deployed; defaults to 1.0
