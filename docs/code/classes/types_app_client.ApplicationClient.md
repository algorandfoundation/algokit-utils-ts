[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / ApplicationClient

# Class: ApplicationClient

[types/app-client](../modules/types_app_client.md).ApplicationClient

**`Deprecated`**

<<<<<<< HEAD
Use `AppClient` instead e.g. via `algorand.client.getAppClientById` or
`algorand.client.getAppClientByCreatorAndName`.
If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.
=======
Use `AppClient` instead.
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

Application client - a class that wraps an ARC-0032 app spec and provides high productivity methods to deploy and call the app

## Table of contents

### Constructors

- [constructor](types_app_client.ApplicationClient.md#constructor)

### Properties

- [\_appAddress](types_app_client.ApplicationClient.md#_appaddress)
- [\_appId](types_app_client.ApplicationClient.md#_appid)
- [\_appName](types_app_client.ApplicationClient.md#_appname)
- [\_approvalSourceMap](types_app_client.ApplicationClient.md#_approvalsourcemap)
- [\_clearSourceMap](types_app_client.ApplicationClient.md#_clearsourcemap)
- [\_creator](types_app_client.ApplicationClient.md#_creator)
- [algod](types_app_client.ApplicationClient.md#algod)
- [appSpec](types_app_client.ApplicationClient.md#appspec)
- [deployTimeParams](types_app_client.ApplicationClient.md#deploytimeparams)
- [existingDeployments](types_app_client.ApplicationClient.md#existingdeployments)
- [indexer](types_app_client.ApplicationClient.md#indexer)
- [params](types_app_client.ApplicationClient.md#params)
- [sender](types_app_client.ApplicationClient.md#sender)

### Methods

- [call](types_app_client.ApplicationClient.md#call)
- [callOfType](types_app_client.ApplicationClient.md#calloftype)
- [clearState](types_app_client.ApplicationClient.md#clearstate)
- [closeOut](types_app_client.ApplicationClient.md#closeout)
- [compile](types_app_client.ApplicationClient.md#compile)
- [create](types_app_client.ApplicationClient.md#create)
- [delete](types_app_client.ApplicationClient.md#delete)
- [deploy](types_app_client.ApplicationClient.md#deploy)
- [exportSourceMaps](types_app_client.ApplicationClient.md#exportsourcemaps)
- [exposeLogicError](types_app_client.ApplicationClient.md#exposelogicerror)
- [fundAppAccount](types_app_client.ApplicationClient.md#fundappaccount)
- [getABIMethod](types_app_client.ApplicationClient.md#getabimethod)
- [getABIMethodParams](types_app_client.ApplicationClient.md#getabimethodparams)
- [getABIMethodSignature](types_app_client.ApplicationClient.md#getabimethodsignature)
- [getAppReference](types_app_client.ApplicationClient.md#getappreference)
- [getBoxNames](types_app_client.ApplicationClient.md#getboxnames)
- [getBoxValue](types_app_client.ApplicationClient.md#getboxvalue)
- [getBoxValueFromABIType](types_app_client.ApplicationClient.md#getboxvaluefromabitype)
- [getBoxValues](types_app_client.ApplicationClient.md#getboxvalues)
- [getBoxValuesFromABIType](types_app_client.ApplicationClient.md#getboxvaluesfromabitype)
- [getCallArgs](types_app_client.ApplicationClient.md#getcallargs)
- [getGlobalState](types_app_client.ApplicationClient.md#getglobalstate)
- [getLocalState](types_app_client.ApplicationClient.md#getlocalstate)
- [importSourceMaps](types_app_client.ApplicationClient.md#importsourcemaps)
- [optIn](types_app_client.ApplicationClient.md#optin)
- [update](types_app_client.ApplicationClient.md#update)

## Constructors

### constructor

• **new ApplicationClient**(`appDetails`, `algod`): [`ApplicationClient`](types_app_client.ApplicationClient.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appDetails` | [`AppSpecAppDetails`](../modules/types_app_client.md#appspecappdetails) | The details of the app |
| `algod` | `default` | An algod instance |

#### Returns

[`ApplicationClient`](types_app_client.ApplicationClient.md)

**`Deprecated`**

Use `AppClient` instead e.g. via `algorand.client.getAppClientById` or
`algorand.client.getAppClientByCreatorAndName`.
If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.

Create a new ApplicationClient instance

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1381](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1381)
=======
[src/types/app-client.ts:1166](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1166)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

## Properties

### \_appAddress

• `Private` **\_appAddress**: `string`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1364](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1364)
=======
[src/types/app-client.ts:1154](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1154)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### \_appId

• `Private` **\_appId**: `number` \| `bigint`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1363](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1363)
=======
[src/types/app-client.ts:1153](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1153)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### \_appName

• `Private` **\_appName**: `string`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1366](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1366)
=======
[src/types/app-client.ts:1156](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1156)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### \_approvalSourceMap

• `Private` **\_approvalSourceMap**: `undefined` \| `SourceMap`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1368](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1368)
=======
[src/types/app-client.ts:1158](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1158)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### \_clearSourceMap

• `Private` **\_clearSourceMap**: `undefined` \| `SourceMap`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1369](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1369)
=======
[src/types/app-client.ts:1159](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1159)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### \_creator

• `Private` **\_creator**: `undefined` \| `string`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1365](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1365)
=======
[src/types/app-client.ts:1155](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1155)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### algod

• `Private` **algod**: `default`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1355](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1355)
=======
[src/types/app-client.ts:1145](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1145)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### appSpec

• `Private` **appSpec**: [`AppSpec`](../interfaces/types_app_spec.AppSpec.md)

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1357](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1357)
=======
[src/types/app-client.ts:1147](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1147)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### deployTimeParams

• `Private` `Optional` **deployTimeParams**: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md)

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1361](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1361)
=======
[src/types/app-client.ts:1151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1151)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### existingDeployments

• `Private` **existingDeployments**: `undefined` \| [`AppLookup`](../interfaces/types_app.AppLookup.md)

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1360](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1360)
=======
[src/types/app-client.ts:1150](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1150)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### indexer

• `Private` `Optional` **indexer**: `default`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1356](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1356)
=======
[src/types/app-client.ts:1146](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1146)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### params

• `Private` **params**: `undefined` \| `SuggestedParams`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1359](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1359)
=======
[src/types/app-client.ts:1149](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1149)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### sender

• `Private` **sender**: `undefined` \| [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1358](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1358)
=======
[src/types/app-client.ts:1148](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1148)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

## Methods

### call

▸ **call**(`call?`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

**`Deprecated`**

Use `appClient.send.call` or `appClient.transactions.call` from an `AppClient` instance instead.

Issues a no_op (normal) call to the app.

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1709](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1709)
=======
[src/types/app-client.ts:1484](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1484)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### callOfType

▸ **callOfType**(`call?`, `callType`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |
| `callType` | ``"no_op"`` \| ``"opt_in"`` \| ``"close_out"`` \| ``"clear_state"`` \| ``"delete_application"`` \| `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `ClearStateOC` \| `DeleteApplicationOC` | The call type |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

**`Deprecated`**

Use `appClient.send.call` or `appClient.transactions.call` from an `AppClient` instance instead.

Issues a call to the app with the given call type.

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1792](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1792)
=======
[src/types/app-client.ts:1557](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1557)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### clearState

▸ **clearState**(`call?`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientClearStateParams`](../modules/types_app_client.md#appclientclearstateparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

**`Deprecated`**

Use `appClient.send.clearState` or `appClient.transactions.clearState` from an `AppClient` instance instead.

Issues a clear_state call to the app.

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1769](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1769)
=======
[src/types/app-client.ts:1538](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1538)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### closeOut

▸ **closeOut**(`call?`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

**`Deprecated`**

Use `appClient.send.closeOut` or `appClient.transactions.closeOut` from an `AppClient` instance instead.

Issues a close_out call to the app.

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1758](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1758)
=======
[src/types/app-client.ts:1529](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1529)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### compile

▸ **compile**(`compilation?`): `Promise`\<\{ `approvalCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `clearCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)  }\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compilation?` | [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) | The deploy-time parameters for the compilation |

#### Returns

`Promise`\<\{ `approvalCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `clearCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)  }\>

The compiled approval and clear state programs

**`Deprecated`**

Use `AppClient.compile()` instead.

Compiles the approval and clear state programs and sets up the source map.

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1420](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1420)
=======
[src/types/app-client.ts:1203](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1203)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### create

▸ **create**(`create?`): `Promise`\<\{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[]  }\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `create?` | [`AppClientCreateParams`](../modules/types_app_client.md#appclientcreateparams) | The parameters to create the app with |

#### Returns

`Promise`\<\{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[]  }\>

The details of the created app, or the transaction to create it if `skipSending` and the compilation result

**`Deprecated`**

Use `create` from an `AppFactory` instance instead.

Creates a smart contract app, returns the details of the created app.

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1603](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1603)
=======
[src/types/app-client.ts:1382](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1382)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### delete

▸ **delete**(`call?`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

**`Deprecated`**

Use `appClient.send.delete` or `appClient.transactions.delete` from an `AppClient` instance instead.

Issues a delete_application call to the app.

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1780](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1780)
=======
[src/types/app-client.ts:1547](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1547)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### deploy

▸ **deploy**(`deploy?`): `Promise`\<`Partial`\<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & \{ `operationPerformed`: ``"nothing"``  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"update"`` \| ``"create"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `deleteReturn?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"replace"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  }\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deploy?` | [`AppClientDeployParams`](../interfaces/types_app_client.AppClientDeployParams.md) | Deployment details |

#### Returns

`Promise`\<`Partial`\<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & \{ `operationPerformed`: ``"nothing"``  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"update"`` \| ``"create"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `deleteReturn?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"replace"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  }\>

The metadata and transaction result(s) of the deployment, or just the metadata if it didn't need to issue transactions

**`Deprecated`**

Use `deploy` from an `AppFactory` instance instead.

Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.

To understand the architecture decisions behind this functionality please see https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md

**Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.

**Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1491](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1491)
=======
[src/types/app-client.ts:1272](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1272)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### exportSourceMaps

▸ **exportSourceMaps**(): [`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

Export the current source maps for the app.

#### Returns

[`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

The source maps

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1456](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1456)
=======
[src/types/app-client.ts:1239](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1239)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### exposeLogicError

▸ **exposeLogicError**(`e`, `isClear?`): `Error`

Takes an error that may include a logic error from a smart contract call and re-exposes the error to include source code information via the source map.
This is automatically used within `ApplicationClient` but if you pass `skipSending: true` e.g. if doing a group transaction
 then you can use this in a try/catch block to get better debugging information.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `e` | `Error` | The error to parse |
| `isClear?` | `boolean` | Whether or not the code was running the clear state program |

#### Returns

`Error`

The new error, or if there was no logic error or source map then the wrapped error with source details

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:2116](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2116)
=======
[src/types/app-client.ts:1875](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1875)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### fundAppAccount

▸ **fundAppAccount**(`fund`): `Promise`\<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md) \| \{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  } & \{ `transactions`: `Transaction`[]  }\>

Funds Algo into the app account for this app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fund` | [`AlgoAmount`](types_amount.AlgoAmount.md) \| [`FundAppAccountParams`](../interfaces/types_app_client.FundAppAccountParams.md) | The parameters for the funding or the funding amount |

#### Returns

`Promise`\<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md) \| \{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  } & \{ `transactions`: `Transaction`[]  }\>

The result of the funding

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1832](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1832)
=======
[src/types/app-client.ts:1597](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1597)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### getABIMethod

▸ **getABIMethod**(`method`): `undefined` \| `ABIMethod`

Returns the ABI Method for the given method name string for the app represented by this application client instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | Either the name of the method or the ABI method spec definition string |

#### Returns

`undefined` \| `ABIMethod`

The ABI method for the given method

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:2073](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2073)
=======
[src/types/app-client.ts:1834](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1834)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### getABIMethodParams

▸ **getABIMethodParams**(`method`): `undefined` \| `ABIMethodParams`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | Either the name of the method or the ABI method spec definition string |

#### Returns

`undefined` \| `ABIMethodParams`

The ABI method params for the given method

**`Deprecated`**

Use `appClient.getABIMethod` instead.

Returns the ABI Method parameters for the given method name string for the app represented by this application client instance

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:2051](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2051)
=======
[src/types/app-client.ts:1812](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1812)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### getABIMethodSignature

▸ **getABIMethodSignature**(`method`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `ABIMethodParams` \| `ABIMethod` |

#### Returns

`string`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:2133](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2133)
=======
[src/types/app-client.ts:1892](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1892)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### getAppReference

▸ **getAppReference**(): `Promise`\<[`AppReference`](../interfaces/types_app.AppReference.md) \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md)\>

#### Returns

`Promise`\<[`AppReference`](../interfaces/types_app.AppReference.md) \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md)\>

The app reference, or if deployed using the `deploy` method, the app metadata too

**`Deprecated`**

Use `appClient.appId` and `appClient.appAddress` from an `AppClient` instance instead.

Gets the reference information for the current application instance.
`appId` will be 0 if it can't find an app.

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:2085](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2085)
=======
[src/types/app-client.ts:1844](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1844)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### getBoxNames

▸ **getBoxNames**(): `Promise`\<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

Returns the names of all current boxes for the current app.

#### Returns

`Promise`\<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

The names of the boxes

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1888](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1888)
=======
[src/types/app-client.ts:1653](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1653)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### getBoxValue

▸ **getBoxValue**(`name`): `Promise`\<`Uint8Array`\>

Returns the value of the given box for the current app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` \| `Uint8Array` \| [`BoxName`](../interfaces/types_app.BoxName.md) | The name of the box to return either as a string, binary array or `BoxName` |

#### Returns

`Promise`\<`Uint8Array`\>

The current box value as a byte array

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1903](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1903)
=======
[src/types/app-client.ts:1668](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1668)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### getBoxValueFromABIType

▸ **getBoxValueFromABIType**(`name`, `type`): `Promise`\<`ABIValue`\>

Returns the value of the given box for the current app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` \| `Uint8Array` \| [`BoxName`](../interfaces/types_app.BoxName.md) | The name of the box to return either as a string, binary array or `BoxName` |
| `type` | `ABIType` |  |

#### Returns

`Promise`\<`ABIValue`\>

The current box value as a byte array

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1919](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1919)
=======
[src/types/app-client.ts:1684](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1684)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### getBoxValues

▸ **getBoxValues**(`filter?`): `Promise`\<\{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `Uint8Array`  }[]\>

Returns the values of all current boxes for the current app.
Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filter?` | (`name`: [`BoxName`](../interfaces/types_app.BoxName.md)) => `boolean` | Optional filter to filter which boxes' values are returned |

#### Returns

`Promise`\<\{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `Uint8Array`  }[]\>

The (name, value) pair of the boxes with values as raw byte arrays

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1935](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1935)
=======
[src/types/app-client.ts:1700](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1700)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### getBoxValuesFromABIType

▸ **getBoxValuesFromABIType**(`type`, `filter?`): `Promise`\<\{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `ABIValue`  }[]\>

Returns the values of all current boxes for the current app decoded using an ABI Type.
Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `ABIType` | The ABI type to decode the values with |
| `filter?` | (`name`: [`BoxName`](../interfaces/types_app.BoxName.md)) => `boolean` | Optional filter to filter which boxes' values are returned |

#### Returns

`Promise`\<\{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `ABIValue`  }[]\>

The (name, value) pair of the boxes with values as the ABI Value

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1957](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1957)
=======
[src/types/app-client.ts:1722](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1722)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### getCallArgs

▸ **getCallArgs**(`args`, `sender`): `Promise`\<`undefined` \| [`AppCallArgs`](../modules/types_app.md#appcallargs)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `undefined` \| [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs) | The call args specific to this application client |
| `sender` | [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom) | The sender of this call. Will be used to fetch any default argument values if applicable |

#### Returns

`Promise`\<`undefined` \| [`AppCallArgs`](../modules/types_app.md#appcallargs)\>

The call args ready to pass into an app call

**`Deprecated`**

Use `appClient.params.*` from an `AppClient` instance instead.

Returns the arguments for an app call for the given ABI method or raw method specification.

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1981](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1981)
=======
[src/types/app-client.ts:1744](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1744)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### getGlobalState

▸ **getGlobalState**(): `Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns global state for the current app.

#### Returns

`Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

The global state

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1860](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1860)
=======
[src/types/app-client.ts:1625](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1625)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### getLocalState

▸ **getLocalState**(`account`): `Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns local state for the given account / account address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `string` \| [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom) |

#### Returns

`Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

The global state

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1874](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1874)
=======
[src/types/app-client.ts:1639](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1639)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### importSourceMaps

▸ **importSourceMaps**(`sourceMaps`): `void`

Import source maps for the app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sourceMaps` | [`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md) | The source maps to import |

#### Returns

`void`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1473](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1473)
=======
[src/types/app-client.ts:1256](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1256)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### optIn

▸ **optIn**(`call?`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

**`Deprecated`**

Use `appClient.send.optIn` or `appClient.transactions.optIn` from an `AppClient` instance instead.

Issues a opt_in call to the app.

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1747](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1747)
=======
[src/types/app-client.ts:1520](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1520)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### update

▸ **update**(`update?`): `Promise`\<\{ `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[]  }\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `update?` | [`AppClientUpdateParams`](../modules/types_app_client.md#appclientupdateparams) | The parameters to update the app with |

#### Returns

`Promise`\<\{ `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[]  }\>

The transaction send result and the compilation result

**`Deprecated`**

Use `appClient.send.update` or `appClient.transactions.update` from an `AppClient` instance instead.

Updates the smart contract app.

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:1668](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1668)
=======
[src/types/app-client.ts:1445](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1445)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
