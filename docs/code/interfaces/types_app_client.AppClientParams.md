[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / AppClientParams

# Interface: AppClientParams

[types/app-client](../modules/types_app_client.md).AppClientParams

Parameters to create an app client

## Table of contents

### Properties

- [algorand](types_app_client.AppClientParams.md#algorand)
- [appId](types_app_client.AppClientParams.md#appid)
<<<<<<< HEAD
<<<<<<< HEAD
- [appName](types_app_client.AppClientParams.md#appname)
=======
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
- [appName](types_app_client.AppClientParams.md#appname)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
- [appSpec](types_app_client.AppClientParams.md#appspec)
- [approvalSourceMap](types_app_client.AppClientParams.md#approvalsourcemap)
- [clearSourceMap](types_app_client.AppClientParams.md#clearsourcemap)
- [defaultSender](types_app_client.AppClientParams.md#defaultsender)

## Properties

### algorand

• **algorand**: [`AlgorandClientInterface`](types_algorand_client_interface.AlgorandClientInterface.md)

<<<<<<< HEAD
<<<<<<< HEAD
An `AlgorandClient` instance

#### Defined in

[src/types/app-client.ts:315](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L315)
=======
#### Defined in

[src/types/app-client.ts:301](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L301)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
An `AlgorandClient` instance

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:302](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L302)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:316](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L316)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### appId

• **appId**: `bigint`

The ID of the app instance this client should make calls against.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:305](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L305)

___

### appName

• `Optional` **appName**: `string`

Optional override for the app name; used for on-chain metadata and lookups.
Defaults to the ARC-32/ARC-56 app spec name

#### Defined in

[src/types/app-client.ts:321](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L321)
=======
[src/types/app-client.ts:292](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L292)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:306](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L306)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### appName

• `Optional` **appName**: `string`

Optional override for the app name; used for on-chain metadata and lookups.
Defaults to the ARC-32/ARC-56 app spec name

#### Defined in

[src/types/app-client.ts:322](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L322)

___

### appSpec

• **appSpec**: `string` \| [`Arc56Contract`](types_app_arc56.Arc56Contract.md) \| [`AppSpec`](types_app_spec.AppSpec.md)

The ARC-56 or ARC-32 application spec as either:
 * Parsed JSON ARC-56 `Contract`
 * Parsed JSON ARC-32 `AppSpec`
 * Raw JSON string (in either ARC-56 or ARC-32 format)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:312](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L312)
=======
[src/types/app-client.ts:299](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L299)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:313](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L313)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### approvalSourceMap

• `Optional` **approvalSourceMap**: `SourceMap`

Optional source map for the approval program

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:325](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L325)
=======
[src/types/app-client.ts:306](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L306)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:312](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L312)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:326](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L326)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### clearSourceMap

• `Optional` **clearSourceMap**: `SourceMap`

Optional source map for the clear state program

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:327](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L327)
=======
[src/types/app-client.ts:308](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L308)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:314](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L314)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:328](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L328)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### defaultSender

• `Optional` **defaultSender**: `string`

Optional address to use for the account to use as the default sender for calls.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:323](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L323)
=======
[src/types/app-client.ts:304](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L304)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:310](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L310)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:324](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L324)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
