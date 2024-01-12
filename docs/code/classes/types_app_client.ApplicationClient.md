[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / ApplicationClient

# Class: ApplicationClient

[types/app-client](../modules/types_app_client.md).ApplicationClient

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

Create a new ApplicationClient instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appDetails` | [`AppSpecAppDetails`](../modules/types_app_client.md#appspecappdetails) | The details of the app |
| `algod` | `default` | An algod instance |

#### Returns

[`ApplicationClient`](types_app_client.ApplicationClient.md)

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:288](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L288)
=======
[src/types/app-client.ts:291](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L291)
>>>>>>> origin/main

## Properties

### \_appAddress

• `Private` **\_appAddress**: `string`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:271](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L271)
=======
[src/types/app-client.ts:274](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L274)
>>>>>>> origin/main

___

### \_appId

• `Private` **\_appId**: `number` \| `bigint`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:270](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L270)
=======
[src/types/app-client.ts:273](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L273)
>>>>>>> origin/main

___

### \_appName

• `Private` **\_appName**: `string`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:273](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L273)
=======
[src/types/app-client.ts:276](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L276)
>>>>>>> origin/main

___

### \_approvalSourceMap

• `Private` **\_approvalSourceMap**: `undefined` \| `SourceMap`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:275](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L275)
=======
[src/types/app-client.ts:278](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L278)
>>>>>>> origin/main

___

### \_clearSourceMap

• `Private` **\_clearSourceMap**: `undefined` \| `SourceMap`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:276](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L276)
=======
[src/types/app-client.ts:279](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L279)
>>>>>>> origin/main

___

### \_creator

• `Private` **\_creator**: `undefined` \| `string`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:272](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L272)
=======
[src/types/app-client.ts:275](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L275)
>>>>>>> origin/main

___

### algod

• `Private` **algod**: `default`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:262](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L262)
=======
[src/types/app-client.ts:265](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L265)
>>>>>>> origin/main

___

### appSpec

• `Private` **appSpec**: [`AppSpec`](../interfaces/types_app_spec.AppSpec.md)

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:264](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L264)
=======
[src/types/app-client.ts:267](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L267)
>>>>>>> origin/main

___

### deployTimeParams

• `Private` `Optional` **deployTimeParams**: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md)

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:268](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L268)
=======
[src/types/app-client.ts:271](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L271)
>>>>>>> origin/main

___

### existingDeployments

• `Private` **existingDeployments**: `undefined` \| [`AppLookup`](../interfaces/types_app.AppLookup.md)

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:267](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L267)
=======
[src/types/app-client.ts:270](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L270)
>>>>>>> origin/main

___

### indexer

• `Private` `Optional` **indexer**: `default`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:263](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L263)
=======
[src/types/app-client.ts:266](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L266)
>>>>>>> origin/main

___

### params

• `Private` **params**: `undefined` \| `SuggestedParams`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:266](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L266)
=======
[src/types/app-client.ts:269](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L269)
>>>>>>> origin/main

___

### sender

• `Private` **sender**: `undefined` \| [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:265](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L265)
=======
[src/types/app-client.ts:268](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L268)
>>>>>>> origin/main

## Methods

### call

▸ **call**(`call?`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

Issues a no_op (normal) call to the app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:581](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L581)
=======
[src/types/app-client.ts:596](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L596)
>>>>>>> origin/main

___

### callOfType

▸ **callOfType**(`call?`, `callType`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

Issues a call to the app with the given call type.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |
| `callType` | ``"no_op"`` \| ``"opt_in"`` \| ``"close_out"`` \| ``"clear_state"`` \| ``"delete_application"`` \| `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `ClearStateOC` \| `DeleteApplicationOC` | The call type |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:654](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L654)
=======
[src/types/app-client.ts:669](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L669)
>>>>>>> origin/main

___

### clearState

▸ **clearState**(`call?`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

Issues a clear_state call to the app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientClearStateParams`](../modules/types_app_client.md#appclientclearstateparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:635](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L635)
=======
[src/types/app-client.ts:650](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L650)
>>>>>>> origin/main

___

### closeOut

▸ **closeOut**(`call?`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

Issues a close_out call to the app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:626](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L626)
=======
[src/types/app-client.ts:641](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L641)
>>>>>>> origin/main

___

### compile

▸ **compile**(`compilation?`): `Promise`\<\{ `approvalCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `clearCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)  }\>

Compiles the approval and clear programs and sets up the source map.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compilation?` | [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) | The deploy-time parameters for the compilation |

#### Returns

`Promise`\<\{ `approvalCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `clearCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)  }\>

The compiled approval and clear programs

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:325](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L325)
=======
[src/types/app-client.ts:328](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L328)
>>>>>>> origin/main

___

### create

▸ **create**(`create?`): `Promise`\<\{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[]  }\>

Creates a smart contract app, returns the details of the created app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `create?` | [`AppClientCreateParams`](../modules/types_app_client.md#appclientcreateparams) | The parameters to create the app with |

#### Returns

`Promise`\<\{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[]  }\>

The details of the created app, or the transaction to create it if `skipSending` and the compilation result

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:490](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L490)
=======
[src/types/app-client.ts:505](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L505)
>>>>>>> origin/main

___

### delete

▸ **delete**(`call?`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

Issues a delete_application call to the app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:644](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L644)
=======
[src/types/app-client.ts:659](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L659)
>>>>>>> origin/main

___

### deploy

▸ **deploy**(`deploy?`): `Promise`\<`Partial`\<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & \{ `operationPerformed`: ``"nothing"``  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"update"`` \| ``"create"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `deleteReturn?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"replace"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  }\>

Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.

To understand the architecture decisions behind this functionality please see https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md

**Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.

**Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deploy?` | [`AppClientDeployParams`](../interfaces/types_app_client.AppClientDeployParams.md) | Deployment details |

#### Returns

`Promise`\<`Partial`\<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & \{ `operationPerformed`: ``"nothing"``  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"update"`` \| ``"create"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `deleteReturn?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"replace"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  }\>

The metadata and transaction result(s) of the deployment, or just the metadata if it didn't need to issue transactions

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:382](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L382)
=======
[src/types/app-client.ts:397](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L397)
>>>>>>> origin/main

___

### exportSourceMaps

▸ **exportSourceMaps**(): [`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

Export the current source maps for the app.

#### Returns

[`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

The source maps

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:349](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L349)
=======
[src/types/app-client.ts:364](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L364)
>>>>>>> origin/main

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
[src/types/app-client.ts:970](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L970)
=======
[src/types/app-client.ts:985](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L985)
>>>>>>> origin/main

___

### fundAppAccount

▸ **fundAppAccount**(`fund`): `Promise`\<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md)\>

Funds ALGOs into the app account for this app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fund` | [`AlgoAmount`](types_amount.AlgoAmount.md) \| [`FundAppAccountParams`](../interfaces/types_app_client.FundAppAccountParams.md) | The parameters for the funding or the funding amount |

#### Returns

`Promise`\<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md)\>

The result of the funding

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:694](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L694)
=======
[src/types/app-client.ts:709](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L709)
>>>>>>> origin/main

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
[src/types/app-client.ts:929](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L929)
=======
[src/types/app-client.ts:944](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L944)
>>>>>>> origin/main

___

### getABIMethodParams

▸ **getABIMethodParams**(`method`): `undefined` \| `ABIMethodParams`

Returns the ABI Method parameters for the given method name string for the app represented by this application client instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | Either the name of the method or the ABI method spec definition string |

#### Returns

`undefined` \| `ABIMethodParams`

The ABI method params for the given method

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:907](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L907)
=======
[src/types/app-client.ts:922](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L922)
>>>>>>> origin/main

___

### getAppReference

▸ **getAppReference**(): `Promise`\<[`AppReference`](../interfaces/types_app.AppReference.md) \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md)\>

Gets the reference information for the current application instance.
`appId` will be 0 if it can't find an app.

#### Returns

`Promise`\<[`AppReference`](../interfaces/types_app.AppReference.md) \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md)\>

The app reference, or if deployed using the `deploy` method, the app metadata too

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:939](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L939)
=======
[src/types/app-client.ts:954](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L954)
>>>>>>> origin/main

___

### getBoxNames

▸ **getBoxNames**(): `Promise`\<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

Returns the names of all current boxes for the current app.

#### Returns

`Promise`\<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

The names of the boxes

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:748](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L748)
=======
[src/types/app-client.ts:763](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L763)
>>>>>>> origin/main

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
[src/types/app-client.ts:763](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L763)
=======
[src/types/app-client.ts:778](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L778)
>>>>>>> origin/main

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
[src/types/app-client.ts:779](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L779)
=======
[src/types/app-client.ts:794](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L794)
>>>>>>> origin/main

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
[src/types/app-client.ts:795](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L795)
=======
[src/types/app-client.ts:810](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L810)
>>>>>>> origin/main

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
[src/types/app-client.ts:817](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L817)
=======
[src/types/app-client.ts:832](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L832)
>>>>>>> origin/main

___

### getCallArgs

▸ **getCallArgs**(`args`, `sender`): `Promise`\<`undefined` \| [`AppCallArgs`](../modules/types_app.md#appcallargs)\>

Returns the arguments for an app call for the given ABI method or raw method specification.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `undefined` \| [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs) | The call args specific to this application client |
| `sender` | [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom) | The sender of this call. Will be used to fetch any default argument values if applicable |

#### Returns

`Promise`\<`undefined` \| [`AppCallArgs`](../modules/types_app.md#appcallargs)\>

The call args ready to pass into an app call

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:839](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L839)
=======
[src/types/app-client.ts:854](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L854)
>>>>>>> origin/main

___

### getGlobalState

▸ **getGlobalState**(): `Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns global state for the current app.

#### Returns

`Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

The global state

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:720](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L720)
=======
[src/types/app-client.ts:735](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L735)
>>>>>>> origin/main

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
[src/types/app-client.ts:734](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L734)
=======
[src/types/app-client.ts:749](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L749)
>>>>>>> origin/main

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
[src/types/app-client.ts:366](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L366)
=======
[src/types/app-client.ts:381](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L381)
>>>>>>> origin/main

___

### optIn

▸ **optIn**(`call?`): `Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

Issues a opt_in call to the app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

The result of the call

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:617](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L617)
=======
[src/types/app-client.ts:632](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L632)
>>>>>>> origin/main

___

### update

▸ **update**(`update?`): `Promise`\<\{ `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[]  }\>

Updates the smart contract app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `update?` | [`AppClientUpdateParams`](../modules/types_app_client.md#appclientupdateparams) | The parameters to update the app with |

#### Returns

`Promise`\<\{ `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: `PendingTransactionResponse` ; `confirmations?`: `PendingTransactionResponse`[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: `Transaction` ; `transactions`: `Transaction`[]  }\>

The transaction send result and the compilation result

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:542](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L542)
=======
[src/types/app-client.ts:557](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L557)
>>>>>>> origin/main
