[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-factory](../README.md) / AppFactoryParams

# Interface: AppFactoryParams

Defined in: [src/types/app-factory.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L28)

Parameters to create an app client

## Properties

### algorand

> **algorand**: [`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

Defined in: [src/types/app-factory.ts:37](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L37)

`AlgorandClient` instance

***

### appName?

> `optional` **appName**: `string`

Defined in: [src/types/app-factory.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L43)

Optional override for the app name; used for on-chain metadata and lookups.
Defaults to the ARC-32/ARC-56 app spec name.

***

### appSpec

> **appSpec**: `string` \| [`Arc56Contract`](../../../Subpaths/abi/type-aliases/Arc56Contract.md) \| [`AppSpec`](../../app-spec/interfaces/AppSpec.md)

Defined in: [src/types/app-factory.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L34)

The ARC-56 or ARC-32 application spec as either:
 * Parsed JSON ARC-56 `Contract`
 * Parsed JSON ARC-32 `AppSpec`
 * Raw JSON string (in either ARC-56 or ARC-32 format)

***

### defaultSender?

> `optional` **defaultSender**: [`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

Defined in: [src/types/app-factory.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L46)

Optional address to use for the account to use as the default sender for calls.

***

### defaultSigner?

> `optional` **defaultSigner**: [`TransactionSigner`](../../../Subpaths/transact/type-aliases/TransactionSigner.md)

Defined in: [src/types/app-factory.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L49)

Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`).

***

### deletable?

> `optional` **deletable**: `boolean`

Defined in: [src/types/app-factory.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L70)

Whether or not the contract should have deploy-time permanence control set, undefined = ignore.
If specified here will get used in calls to `deploy` and `create` calls unless overridden in those calls.

Useful if you want to vend multiple contracts from the same factory without specifying this value
for each call.

***

### deployTimeParams?

> `optional` **deployTimeParams**: [`TealTemplateParams`](../../app/interfaces/TealTemplateParams.md)

Defined in: [src/types/app-factory.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L79)

Optional deploy-time TEAL template replacement parameters.
If specified here will get used in calls to `deploy` and `create` calls unless overridden in those calls.

Useful if you want to vend multiple contracts from the same factory without specifying this value
for each call.

***

### updatable?

> `optional` **updatable**: `boolean`

Defined in: [src/types/app-factory.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L61)

Whether or not the contract should have deploy-time immutability control set, undefined = ignore.
If specified here will get used in calls to `deploy` and `create` calls unless overridden in those calls.

Useful if you want to vend multiple contracts from the same factory without specifying this value
for each call.

***

### version?

> `optional` **version**: `string`

Defined in: [src/types/app-factory.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L52)

The version of app that is / will be deployed; defaults to 1.0
