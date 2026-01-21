[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppClientParams

# Interface: AppClientParams

Defined in: [src/types/app-client.ts:273](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L273)

Parameters to create an app client

## Properties

### algorand

> **algorand**: [`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

Defined in: [src/types/app-client.ts:285](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L285)

An `AlgorandClient` instance

***

### appId

> **appId**: `bigint`

Defined in: [src/types/app-client.ts:275](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L275)

The ID of the app instance this client should make calls against.

***

### appName?

> `optional` **appName**: `string`

Defined in: [src/types/app-client.ts:291](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L291)

Optional override for the app name; used for on-chain metadata and lookups.
Defaults to the ARC-32/ARC-56 app spec name

***

### approvalSourceMap?

> `optional` **approvalSourceMap**: `ProgramSourceMap`

Defined in: [src/types/app-client.ts:297](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L297)

Optional source map for the approval program

***

### appSpec

> **appSpec**: `string` \| [`Arc56Contract`](../../../Subpaths/abi/type-aliases/Arc56Contract.md) \| [`AppSpec`](../../app-spec/interfaces/AppSpec.md)

Defined in: [src/types/app-client.ts:282](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L282)

The ARC-56 or ARC-32 application spec as either:
 * Parsed JSON ARC-56 `Contract`
 * Parsed JSON ARC-32 `AppSpec`
 * Raw JSON string (in either ARC-56 or ARC-32 format)

***

### clearSourceMap?

> `optional` **clearSourceMap**: `ProgramSourceMap`

Defined in: [src/types/app-client.ts:299](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L299)

Optional source map for the clear state program

***

### defaultSender?

> `optional` **defaultSender**: [`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

Defined in: [src/types/app-client.ts:293](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L293)

Optional address to use for the account to use as the default sender for calls.

***

### defaultSigner?

> `optional` **defaultSigner**: [`TransactionSigner`](../../../Subpaths/transact/type-aliases/TransactionSigner.md)

Defined in: [src/types/app-client.ts:295](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L295)

Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`).
