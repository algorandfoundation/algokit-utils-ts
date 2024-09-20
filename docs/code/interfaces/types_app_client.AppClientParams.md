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

## Properties

### algorand

• **algorand**: [`AlgorandClientInterface`](types_algorand_client_interface.AlgorandClientInterface.md)

An `AlgorandClient` instance

#### Defined in

[src/types/app-client.ts:315](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L315)

___

### appId

• **appId**: `bigint`

The ID of the app instance this client should make calls against.

#### Defined in

[src/types/app-client.ts:305](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L305)

___

### appName

• `Optional` **appName**: `string`

Optional override for the app name; used for on-chain metadata and lookups.
Defaults to the ARC-32/ARC-56 app spec name

#### Defined in

[src/types/app-client.ts:321](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L321)

___

### appSpec

• **appSpec**: `string` \| [`Arc56Contract`](types_app_arc56.Arc56Contract.md) \| [`AppSpec`](types_app_spec.AppSpec.md)

The ARC-56 or ARC-32 application spec as either:
 * Parsed JSON ARC-56 `Contract`
 * Parsed JSON ARC-32 `AppSpec`
 * Raw JSON string (in either ARC-56 or ARC-32 format)

#### Defined in

[src/types/app-client.ts:312](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L312)

___

### approvalSourceMap

• `Optional` **approvalSourceMap**: `SourceMap`

Optional source map for the approval program

#### Defined in

[src/types/app-client.ts:325](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L325)

___

### clearSourceMap

• `Optional` **clearSourceMap**: `SourceMap`

Optional source map for the clear state program

#### Defined in

[src/types/app-client.ts:327](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L327)

___

### defaultSender

• `Optional` **defaultSender**: `string`

Optional address to use for the account to use as the default sender for calls.

#### Defined in

[src/types/app-client.ts:323](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L323)