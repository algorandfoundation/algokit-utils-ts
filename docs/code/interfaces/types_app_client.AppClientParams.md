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
- [newGroup](types_app_client.AppClientParams.md#newgroup)

## Properties

### algorand

• **algorand**: [`AlgorandClient`](../classes/types_algorand_client.AlgorandClient.md)

An `AlgorandClient` instance

#### Defined in

[src/types/app-client.ts:332](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L332)

___

### appId

• **appId**: `bigint`

The ID of the app instance this client should make calls against.

#### Defined in

[src/types/app-client.ts:322](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L322)

___

### appName

• `Optional` **appName**: `string`

Optional override for the app name; used for on-chain metadata and lookups.
Defaults to the ARC-32/ARC-56 app spec name

#### Defined in

[src/types/app-client.ts:338](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L338)

___

### appSpec

• **appSpec**: `string` \| [`Arc56Contract`](types_app_arc56.Arc56Contract.md) \| [`AppSpec`](types_app_spec.AppSpec.md)

The ARC-56 or ARC-32 application spec as either:
 * Parsed JSON ARC-56 `Contract`
 * Parsed JSON ARC-32 `AppSpec`
 * Raw JSON string (in either ARC-56 or ARC-32 format)

#### Defined in

[src/types/app-client.ts:329](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L329)

___

### approvalSourceMap

• `Optional` **approvalSourceMap**: `ProgramSourceMap`

Optional source map for the approval program

#### Defined in

[src/types/app-client.ts:344](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L344)

___

### clearSourceMap

• `Optional` **clearSourceMap**: `ProgramSourceMap`

Optional source map for the clear state program

#### Defined in

[src/types/app-client.ts:346](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L346)

___

### defaultSender

• `Optional` **defaultSender**: `string` \| `Address`

Optional address to use for the account to use as the default sender for calls.

#### Defined in

[src/types/app-client.ts:340](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L340)

___

### defaultSigner

• `Optional` **defaultSigner**: `TransactionSigner`

Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`).

#### Defined in

[src/types/app-client.ts:342](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L342)

___

### newGroup

• **newGroup**: () => [`TransactionComposer`](../classes/types_composer.TransactionComposer.md)

#### Type declaration

▸ (): [`TransactionComposer`](../classes/types_composer.TransactionComposer.md)

##### Returns

[`TransactionComposer`](../classes/types_composer.TransactionComposer.md)

#### Defined in

[src/types/app-client.ts:347](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L347)
