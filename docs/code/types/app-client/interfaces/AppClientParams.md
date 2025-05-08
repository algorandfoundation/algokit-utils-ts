[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / AppClientParams

# Interface: AppClientParams

Defined in: [src/types/app-client.ts:316](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L316)

Parameters to create an app client

## Properties

### algorand

> **algorand**: [`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

Defined in: [src/types/app-client.ts:328](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L328)

An `AlgorandClient` instance

***

### appId

> **appId**: `bigint`

Defined in: [src/types/app-client.ts:318](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L318)

The ID of the app instance this client should make calls against.

***

### appName?

> `optional` **appName**: `string`

Defined in: [src/types/app-client.ts:334](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L334)

Optional override for the app name; used for on-chain metadata and lookups.
Defaults to the ARC-32/ARC-56 app spec name

***

### approvalSourceMap?

> `optional` **approvalSourceMap**: `ProgramSourceMap`

Defined in: [src/types/app-client.ts:340](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L340)

Optional source map for the approval program

***

### appSpec

> **appSpec**: `string` \| [`Arc56Contract`](../../app-arc56/interfaces/Arc56Contract.md) \| [`AppSpec`](../../app-spec/interfaces/AppSpec.md)

Defined in: [src/types/app-client.ts:325](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L325)

The ARC-56 or ARC-32 application spec as either:
 * Parsed JSON ARC-56 `Contract`
 * Parsed JSON ARC-32 `AppSpec`
 * Raw JSON string (in either ARC-56 or ARC-32 format)

***

### clearSourceMap?

> `optional` **clearSourceMap**: `ProgramSourceMap`

Defined in: [src/types/app-client.ts:342](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L342)

Optional source map for the clear state program

***

### defaultSender?

> `optional` **defaultSender**: `string` \| `Address`

Defined in: [src/types/app-client.ts:336](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L336)

Optional address to use for the account to use as the default sender for calls.

***

### defaultSigner?

> `optional` **defaultSigner**: `TransactionSigner`

Defined in: [src/types/app-client.ts:338](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L338)

Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`).
