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

• **algorand**: [`AlgorandClientInterface`](types_algorand_client_interface.AlgorandClientInterface.md)

An `AlgorandClient` instance

#### Defined in

[src/types/app-client.ts:329](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L329)

___

### appId

• **appId**: `bigint`

The ID of the app instance this client should make calls against.

#### Defined in

[src/types/app-client.ts:319](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L319)

___

### appName

• `Optional` **appName**: `string`

Optional override for the app name; used for on-chain metadata and lookups.
Defaults to the ARC-32/ARC-56 app spec name

#### Defined in

[src/types/app-client.ts:335](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L335)

___

### appSpec

• **appSpec**: `string` \| [`Arc56Contract`](types_app_arc56.Arc56Contract.md) \| [`AppSpec`](types_app_spec.AppSpec.md)

The ARC-56 or ARC-32 application spec as either:
 * Parsed JSON ARC-56 `Contract`
 * Parsed JSON ARC-32 `AppSpec`
 * Raw JSON string (in either ARC-56 or ARC-32 format)

#### Defined in

[src/types/app-client.ts:326](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L326)

___

### approvalSourceMap

• `Optional` **approvalSourceMap**: `SourceMap`

Optional source map for the approval program

#### Defined in

[src/types/app-client.ts:341](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L341)

___

### clearSourceMap

• `Optional` **clearSourceMap**: `SourceMap`

Optional source map for the clear state program

#### Defined in

[src/types/app-client.ts:343](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L343)

___

### defaultSender

• `Optional` **defaultSender**: `string`

Optional address to use for the account to use as the default sender for calls.

#### Defined in

[src/types/app-client.ts:337](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L337)

___

### defaultSigner

• `Optional` **defaultSigner**: `TransactionSigner`

Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`).

#### Defined in

[src/types/app-client.ts:339](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L339)
