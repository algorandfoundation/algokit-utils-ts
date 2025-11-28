[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / AppClientParams

# Interface: AppClientParams

[types/app-client](../modules/types_app_client.md).AppClientParams

Parameters to create an app client

## Table of contents

### Properties

- [algorand](types_app_client.AppClientParams.md#algorand)
- [appId](types_app_client.AppClientParams.md#appid)
- [appName](types_app_client.AppClientParams.md#appname)
- [appSpec](types_app_client.AppClientParams.md#appspec)
- [approvalSourceMap](types_app_client.AppClientParams.md#approvalsourcemap)
- [clearSourceMap](types_app_client.AppClientParams.md#clearsourcemap)
- [defaultSender](types_app_client.AppClientParams.md#defaultsender)
- [defaultSigner](types_app_client.AppClientParams.md#defaultsigner)

## Properties

### algorand

• **algorand**: [`AlgorandClient`](../classes/types_algorand_client.AlgorandClient.md)

An `AlgorandClient` instance

#### Defined in

[src/types/app-client.ts:278](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L278)

___

### appId

• **appId**: `bigint`

The ID of the app instance this client should make calls against.

#### Defined in

[src/types/app-client.ts:268](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L268)

___

### appName

• `Optional` **appName**: `string`

Optional override for the app name; used for on-chain metadata and lookups.
Defaults to the ARC-32/ARC-56 app spec name

#### Defined in

[src/types/app-client.ts:284](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L284)

___

### appSpec

• **appSpec**: `string` \| `Arc56Contract` \| [`AppSpec`](types_app_spec.AppSpec.md)

The ARC-56 or ARC-32 application spec as either:
 * Parsed JSON ARC-56 `Contract`
 * Parsed JSON ARC-32 `AppSpec`
 * Raw JSON string (in either ARC-56 or ARC-32 format)

#### Defined in

[src/types/app-client.ts:275](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L275)

___

### approvalSourceMap

• `Optional` **approvalSourceMap**: `ProgramSourceMap`

Optional source map for the approval program

#### Defined in

[src/types/app-client.ts:290](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L290)

___

### clearSourceMap

• `Optional` **clearSourceMap**: `ProgramSourceMap`

Optional source map for the clear state program

#### Defined in

[src/types/app-client.ts:292](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L292)

___

### defaultSender

• `Optional` **defaultSender**: `ReadableAddress`

Optional address to use for the account to use as the default sender for calls.

#### Defined in

[src/types/app-client.ts:286](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L286)

___

### defaultSigner

• `Optional` **defaultSigner**: `TransactionSigner`

Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`).

#### Defined in

[src/types/app-client.ts:288](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L288)
