[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppClientParams

# Interface: AppClientParams

Defined in: [src/types/app-client.ts:272](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L272)

Parameters to create an app client

## Properties

### algorand

> **algorand**: [`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

Defined in: [src/types/app-client.ts:284](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L284)

An `AlgorandClient` instance

***

### appId

> **appId**: `bigint`

Defined in: [src/types/app-client.ts:274](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L274)

The ID of the app instance this client should make calls against.

***

### appName?

> `optional` **appName**: `string`

Defined in: [src/types/app-client.ts:290](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L290)

Optional override for the app name; used for on-chain metadata and lookups.
Defaults to the ARC-32/ARC-56 app spec name

***

### approvalSourceMap?

> `optional` **approvalSourceMap**: `ProgramSourceMap`

Defined in: [src/types/app-client.ts:296](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L296)

Optional source map for the approval program

***

### appSpec

> **appSpec**: `string` \| [`Arc56Contract`](../../../Subpaths/abi/type-aliases/Arc56Contract.md) \| [`AppSpec`](../../app-spec/interfaces/AppSpec.md)

Defined in: [src/types/app-client.ts:281](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L281)

The ARC-56 or ARC-32 application spec as either:
 * Parsed JSON ARC-56 `Contract`
 * Parsed JSON ARC-32 `AppSpec`
 * Raw JSON string (in either ARC-56 or ARC-32 format)

***

### clearSourceMap?

> `optional` **clearSourceMap**: `ProgramSourceMap`

Defined in: [src/types/app-client.ts:298](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L298)

Optional source map for the clear state program

***

### defaultSender?

> `optional` **defaultSender**: [`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

Defined in: [src/types/app-client.ts:292](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L292)

Optional address to use for the account to use as the default sender for calls.

***

### defaultSigner?

> `optional` **defaultSigner**: [`TransactionSigner`](../../../Subpaths/transact/type-aliases/TransactionSigner.md)

Defined in: [src/types/app-client.ts:294](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L294)

Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`).
