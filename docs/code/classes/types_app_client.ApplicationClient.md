[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / ApplicationClient

# Class: ApplicationClient

[types/app-client](../modules/types_app_client.md).ApplicationClient

**`Deprecated`**

Use `AppClient` instead e.g. via `algorand.client.getAppClientById` or
`algorand.client.getAppClientByCreatorAndName`.
If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.

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
| `algod` | `AlgodClient` | An algod instance |

#### Returns

[`ApplicationClient`](types_app_client.ApplicationClient.md)

**`Deprecated`**

Use `AppClient` instead e.g. via `algorand.client.getAppClientById` or
`algorand.client.getAppClientByCreatorAndName`.
If you want to `create` or `deploy` then use `AppFactory` e.g. via `algorand.client.getAppFactory`,
which will in turn give you an `AppClient` instance against the created/deployed app to make other calls.

Create a new ApplicationClient instance

#### Defined in

[src/types/app-client.ts:1836](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1836)

## Properties

### \_appAddress

• `Private` **\_appAddress**: `string`

#### Defined in

[src/types/app-client.ts:1819](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1819)

___

### \_appId

• `Private` **\_appId**: `number` \| `bigint`

#### Defined in

[src/types/app-client.ts:1818](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1818)

___

### \_appName

• `Private` **\_appName**: `string`

#### Defined in

[src/types/app-client.ts:1821](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1821)

___

### \_approvalSourceMap

• `Private` **\_approvalSourceMap**: `undefined` \| `ProgramSourceMap`

#### Defined in

[src/types/app-client.ts:1823](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1823)

___

### \_clearSourceMap

• `Private` **\_clearSourceMap**: `undefined` \| `ProgramSourceMap`

#### Defined in

[src/types/app-client.ts:1824](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1824)

___

### \_creator

• `Private` **\_creator**: `undefined` \| `string`

#### Defined in

[src/types/app-client.ts:1820](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1820)

___

### algod

• `Private` **algod**: `AlgodClient`

#### Defined in

[src/types/app-client.ts:1810](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1810)

___

### appSpec

• `Private` **appSpec**: [`AppSpec`](../interfaces/types_app_spec.AppSpec.md)

#### Defined in

[src/types/app-client.ts:1812](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1812)

___

### deployTimeParams

• `Private` `Optional` **deployTimeParams**: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md)

#### Defined in

[src/types/app-client.ts:1816](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1816)

___

### existingDeployments

• `Private` **existingDeployments**: `undefined` \| [`AppLookup`](../interfaces/types_app.AppLookup.md)

#### Defined in

[src/types/app-client.ts:1815](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1815)

___

### indexer

• `Private` `Optional` **indexer**: `IndexerClient`

#### Defined in

[src/types/app-client.ts:1811](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1811)

___

### params

• `Private` **params**: `undefined` \| \{ `consensusVersion`: `string` ; `fee`: `bigint` ; `firstValid`: `bigint` ; `flatFee`: `boolean` ; `genesisHash`: `Uint8Array` ; `genesisId`: `string` ; `lastValid`: `bigint` ; `minFee`: `bigint`  }

#### Defined in

[src/types/app-client.ts:1814](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1814)

___

### sender

• `Private` **sender**: `undefined` \| `AddressWithSigner`

#### Defined in

[src/types/app-client.ts:1813](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1813)

## Methods

### call

▸ **call**(`call?`): `Promise`\<[`AppCallTransactionResult`](../modules/types_app.md#appcalltransactionresult)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../modules/types_app.md#appcalltransactionresult)\>

The result of the call

**`Deprecated`**

Use `appClient.send.call` or `appClient.createTransaction.call` from an `AppClient` instance instead.

Issues a no_op (normal) call to the app.

#### Defined in

[src/types/app-client.ts:2159](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2159)

___

### callOfType

▸ **callOfType**(`call?`, `callType`): `Promise`\<[`AppCallTransactionResult`](../modules/types_app.md#appcalltransactionresult)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |
| `callType` | `NoOp` \| `OptIn` \| `CloseOut` \| `ClearState` \| `DeleteApplication` \| ``"no_op"`` \| ``"opt_in"`` \| ``"close_out"`` \| ``"clear_state"`` \| ``"delete_application"`` | The call type |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../modules/types_app.md#appcalltransactionresult)\>

The result of the call

**`Deprecated`**

Use `appClient.send.call` or `appClient.createTransaction.call` from an `AppClient` instance instead.

Issues a call to the app with the given call type.

#### Defined in

[src/types/app-client.ts:2241](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2241)

___

### clearState

▸ **clearState**(`call?`): `Promise`\<[`AppCallTransactionResult`](../modules/types_app.md#appcalltransactionresult)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientClearStateParams`](../modules/types_app_client.md#appclientclearstateparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../modules/types_app.md#appcalltransactionresult)\>

The result of the call

**`Deprecated`**

Use `appClient.send.clearState` or `appClient.createTransaction.clearState` from an `AppClient` instance instead.

Issues a clear_state call to the app.

#### Defined in

[src/types/app-client.ts:2218](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2218)

___

### closeOut

▸ **closeOut**(`call?`): `Promise`\<[`AppCallTransactionResult`](../modules/types_app.md#appcalltransactionresult)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../modules/types_app.md#appcalltransactionresult)\>

The result of the call

**`Deprecated`**

Use `appClient.send.closeOut` or `appClient.createTransaction.closeOut` from an `AppClient` instance instead.

Issues a close_out call to the app.

#### Defined in

[src/types/app-client.ts:2207](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2207)

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

[src/types/app-client.ts:1875](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1875)

___

### create

▸ **create**(`create?`): `Promise`\<\{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations?`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[]  }\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `create?` | [`AppClientCreateParams`](../modules/types_app_client.md#appclientcreateparams) | The parameters to create the app with |

#### Returns

`Promise`\<\{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations?`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[]  }\>

The details of the created app, or the transaction to create it if `skipSending` and the compilation result

**`Deprecated`**

Use `create` from an `AppFactory` instance instead.

Creates a smart contract app, returns the details of the created app.

#### Defined in

[src/types/app-client.ts:2054](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2054)

___

### delete

▸ **delete**(`call?`): `Promise`\<[`AppCallTransactionResult`](../modules/types_app.md#appcalltransactionresult)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../modules/types_app.md#appcalltransactionresult)\>

The result of the call

**`Deprecated`**

Use `appClient.send.delete` or `appClient.createTransaction.delete` from an `AppClient` instance instead.

Issues a delete_application call to the app.

#### Defined in

[src/types/app-client.ts:2229](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2229)

___

### deploy

▸ **deploy**(`deploy?`): `Promise`\<`Partial`\<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & \{ `operationPerformed`: ``"nothing"``  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"update"`` \| ``"create"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `deleteReturn?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"replace"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  }\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deploy?` | [`AppClientDeployParams`](../interfaces/types_app_client.AppClientDeployParams.md) | Deployment details |

#### Returns

`Promise`\<`Partial`\<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & \{ `operationPerformed`: ``"nothing"``  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"update"`` \| ``"create"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  } \| \{ `appAddress`: `string` ; `appId`: `number` \| `bigint` ; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `number` ; `deletable?`: `boolean` ; `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `deleteReturn?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"replace"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `updatable?`: `boolean` ; `updatedRound`: `number` ; `version`: `string`  }\>

The metadata and transaction result(s) of the deployment, or just the metadata if it didn't need to issue transactions

**`Deprecated`**

Use `deploy` from an `AppFactory` instance instead.

Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.

To understand the architecture decisions behind this functionality please see https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md

**Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.

**Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.

#### Defined in

[src/types/app-client.ts:1943](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1943)

___

### exportSourceMaps

▸ **exportSourceMaps**(): [`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

Export the current source maps for the app.

#### Returns

[`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

The source maps

#### Defined in

[src/types/app-client.ts:1908](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1908)

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

[src/types/app-client.ts:2563](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2563)

___

### fundAppAccount

▸ **fundAppAccount**(`fund`): `Promise`\<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md) \| \{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  } & \{ `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[]  }\>

Funds Algo into the app account for this app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fund` | [`AlgoAmount`](types_amount.AlgoAmount.md) \| [`FundAppAccountParams`](../interfaces/types_app_client.FundAppAccountParams.md) | The parameters for the funding or the funding amount |

#### Returns

`Promise`\<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md) \| \{ `confirmation`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[] ; `txIds`: `string`[]  } & \{ `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[]  }\>

The result of the funding

#### Defined in

[src/types/app-client.ts:2280](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2280)

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

[src/types/app-client.ts:2521](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2521)

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

[src/types/app-client.ts:2499](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2499)

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

[src/types/app-client.ts:2579](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2579)

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

[src/types/app-client.ts:2533](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2533)

___

### getBoxNames

▸ **getBoxNames**(): `Promise`\<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

Returns the names of all current boxes for the current app.

#### Returns

`Promise`\<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

The names of the boxes

#### Defined in

[src/types/app-client.ts:2336](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2336)

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

[src/types/app-client.ts:2351](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2351)

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

[src/types/app-client.ts:2367](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2367)

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

[src/types/app-client.ts:2383](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2383)

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

[src/types/app-client.ts:2405](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2405)

___

### getCallArgs

▸ **getCallArgs**(`args`, `sender`): `Promise`\<`undefined` \| [`AppCallArgs`](../modules/types_app.md#appcallargs)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `undefined` \| [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs) | The call args specific to this application client |
| `sender` | `AddressWithSigner` | The sender of this call. Will be used to fetch any default argument values if applicable |

#### Returns

`Promise`\<`undefined` \| [`AppCallArgs`](../modules/types_app.md#appcallargs)\>

The call args ready to pass into an app call

**`Deprecated`**

Use `appClient.params.*` from an `AppClient` instance instead.

Returns the arguments for an app call for the given ABI method or raw method specification.

#### Defined in

[src/types/app-client.ts:2429](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2429)

___

### getGlobalState

▸ **getGlobalState**(): `Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns global state for the current app.

#### Returns

`Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

The global state

#### Defined in

[src/types/app-client.ts:2308](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2308)

___

### getLocalState

▸ **getLocalState**(`account`): `Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns local state for the given account / account address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `string` \| `AddressWithSigner` |

#### Returns

`Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

The global state

#### Defined in

[src/types/app-client.ts:2322](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2322)

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

[src/types/app-client.ts:1925](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1925)

___

### optIn

▸ **optIn**(`call?`): `Promise`\<[`AppCallTransactionResult`](../modules/types_app.md#appcalltransactionresult)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) | The call details. |

#### Returns

`Promise`\<[`AppCallTransactionResult`](../modules/types_app.md#appcalltransactionresult)\>

The result of the call

**`Deprecated`**

Use `appClient.send.optIn` or `appClient.createTransaction.optIn` from an `AppClient` instance instead.

Issues a opt_in call to the app.

#### Defined in

[src/types/app-client.ts:2196](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2196)

___

### update

▸ **update**(`update?`): `Promise`\<\{ `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations?`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[]  }\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `update?` | [`AppClientUpdateParams`](../modules/types_app_client.md#appclientupdateparams) | The parameters to update the app with |

#### Returns

`Promise`\<\{ `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation?`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper) ; `confirmations?`: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[] ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `transaction`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md) ; `transactions`: [`TransactionWrapper`](types_transaction.TransactionWrapper.md)[]  }\>

The transaction send result and the compilation result

**`Deprecated`**

Use `appClient.send.update` or `appClient.createTransaction.update` from an `AppClient` instance instead.

Updates the smart contract app.

#### Defined in

[src/types/app-client.ts:2118](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L2118)
