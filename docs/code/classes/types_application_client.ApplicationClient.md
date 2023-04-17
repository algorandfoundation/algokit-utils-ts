[@algorandfoundation/algokit-utils](../README.md) / [types/application-client](../modules/types_application_client.md) / ApplicationClient

# Class: ApplicationClient

[types/application-client](../modules/types_application_client.md).ApplicationClient

Application client - a class that wraps an ARC-0032 app spec and provides high productivity methods to deploy and call the app

## Table of contents

### Constructors

- [constructor](types_application_client.ApplicationClient.md#constructor)

### Properties

- [\_appAddress](types_application_client.ApplicationClient.md#_appaddress)
- [\_appId](types_application_client.ApplicationClient.md#_appid)
- [\_appName](types_application_client.ApplicationClient.md#_appname)
- [\_approvalSourceMap](types_application_client.ApplicationClient.md#_approvalsourcemap)
- [\_clearSourceMap](types_application_client.ApplicationClient.md#_clearsourcemap)
- [\_creator](types_application_client.ApplicationClient.md#_creator)
- [algod](types_application_client.ApplicationClient.md#algod)
- [appSpec](types_application_client.ApplicationClient.md#appspec)
- [existingDeployments](types_application_client.ApplicationClient.md#existingdeployments)
- [indexer](types_application_client.ApplicationClient.md#indexer)
- [params](types_application_client.ApplicationClient.md#params)
- [sender](types_application_client.ApplicationClient.md#sender)

### Methods

- [\_call](types_application_client.ApplicationClient.md#_call)
- [call](types_application_client.ApplicationClient.md#call)
- [clearState](types_application_client.ApplicationClient.md#clearstate)
- [closeOut](types_application_client.ApplicationClient.md#closeout)
- [create](types_application_client.ApplicationClient.md#create)
- [delete](types_application_client.ApplicationClient.md#delete)
- [deploy](types_application_client.ApplicationClient.md#deploy)
- [exposeLogicError](types_application_client.ApplicationClient.md#exposelogicerror)
- [fundAppAccount](types_application_client.ApplicationClient.md#fundappaccount)
- [getABIMethod](types_application_client.ApplicationClient.md#getabimethod)
- [getABIMethodParams](types_application_client.ApplicationClient.md#getabimethodparams)
- [getAppReference](types_application_client.ApplicationClient.md#getappreference)
- [getBoxNames](types_application_client.ApplicationClient.md#getboxnames)
- [getBoxValue](types_application_client.ApplicationClient.md#getboxvalue)
- [getBoxValueAsABIType](types_application_client.ApplicationClient.md#getboxvalueasabitype)
- [getBoxValues](types_application_client.ApplicationClient.md#getboxvalues)
- [getBoxValuesAsABIType](types_application_client.ApplicationClient.md#getboxvaluesasabitype)
- [getCallArgs](types_application_client.ApplicationClient.md#getcallargs)
- [getGlobalState](types_application_client.ApplicationClient.md#getglobalstate)
- [getLocalState](types_application_client.ApplicationClient.md#getlocalstate)
- [optIn](types_application_client.ApplicationClient.md#optin)
- [update](types_application_client.ApplicationClient.md#update)

## Constructors

### constructor

• **new ApplicationClient**(`appDetails`, `algod`)

Create a new ApplicationClient instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appDetails` | [`AppSpecAppDetails`](../modules/types_application_client.md#appspecappdetails) | The details of the app |
| `algod` | `default` | An algod instance |

#### Defined in

[src/types/application-client.ts:193](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L193)

## Properties

### \_appAddress

• `Private` **\_appAddress**: `string`

#### Defined in

[src/types/application-client.ts:173](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L173)

___

### \_appId

• `Private` **\_appId**: `number`

#### Defined in

[src/types/application-client.ts:172](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L172)

___

### \_appName

• `Private` **\_appName**: `string`

#### Defined in

[src/types/application-client.ts:175](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L175)

___

### \_approvalSourceMap

• `Private` **\_approvalSourceMap**: `undefined` \| `SourceMap`

#### Defined in

[src/types/application-client.ts:177](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L177)

___

### \_clearSourceMap

• `Private` **\_clearSourceMap**: `undefined` \| `SourceMap`

#### Defined in

[src/types/application-client.ts:178](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L178)

___

### \_creator

• `Private` **\_creator**: `undefined` \| `string`

#### Defined in

[src/types/application-client.ts:174](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L174)

___

### algod

• `Private` **algod**: `default`

#### Defined in

[src/types/application-client.ts:165](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L165)

___

### appSpec

• `Private` **appSpec**: [`AppSpec`](../interfaces/types_appspec.AppSpec.md)

#### Defined in

[src/types/application-client.ts:167](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L167)

___

### existingDeployments

• `Private` **existingDeployments**: `undefined` \| [`AppLookup`](../interfaces/types_app.AppLookup.md)

#### Defined in

[src/types/application-client.ts:170](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L170)

___

### indexer

• `Private` `Optional` **indexer**: `default`

#### Defined in

[src/types/application-client.ts:166](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L166)

___

### params

• `Private` **params**: `undefined` \| `SuggestedParams`

#### Defined in

[src/types/application-client.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L169)

___

### sender

• `Private` **sender**: `undefined` \| [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

#### Defined in

[src/types/application-client.ts:168](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L168)

## Methods

### \_call

▸ `Private` **_call**(`call`, `callType`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `call` | [`AppClientCallParams`](../modules/types_application_client.md#appclientcallparams) |
| `callType` | ``"optin"`` \| ``"closeout"`` \| ``"clearstate"`` \| ``"delete"`` \| ``"normal"`` |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[src/types/application-client.ts:447](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L447)

___

### call

▸ **call**(`call`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `call` | [`AppClientCallParams`](../modules/types_application_client.md#appclientcallparams) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[src/types/application-client.ts:427](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L427)

___

### clearState

▸ **clearState**(`call`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `call` | [`AppClientCallParams`](../modules/types_application_client.md#appclientcallparams) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[src/types/application-client.ts:439](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L439)

___

### closeOut

▸ **closeOut**(`call`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `call` | [`AppClientCallParams`](../modules/types_application_client.md#appclientcallparams) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[src/types/application-client.ts:435](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L435)

___

### create

▸ **create**(`create?`): `Promise`<`Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md) & [`AppReference`](../interfaces/types_app.AppReference.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `create?` | [`AppClientCreateParams`](../modules/types_application_client.md#appclientcreateparams) |

#### Returns

`Promise`<`Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md) & [`AppReference`](../interfaces/types_app.AppReference.md)\>

#### Defined in

[src/types/application-client.ts:332](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L332)

___

### delete

▸ **delete**(`call`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `call` | [`AppClientCallParams`](../modules/types_application_client.md#appclientcallparams) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[src/types/application-client.ts:443](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L443)

___

### deploy

▸ **deploy**(`deploy?`): `Promise`<`Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`ConfirmedTransactionResults`](../interfaces/types_transaction.ConfirmedTransactionResults.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"update"`` \| ``"create"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn)  } \| `Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`ConfirmedTransactionResults`](../interfaces/types_transaction.ConfirmedTransactionResults.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `deleteReturn?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `operationPerformed`: ``"replace"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn)  } \| `Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"nothing"``  }\>

Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.

To understand the architecture decisions behind this functionality please

**`See`**

https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md

**Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.

**Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deploy?` | [`AppClientDeployParams`](../interfaces/types_application_client.AppClientDeployParams.md) | Deployment details |

#### Returns

`Promise`<`Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`ConfirmedTransactionResults`](../interfaces/types_transaction.ConfirmedTransactionResults.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"update"`` \| ``"create"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn)  } \| `Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`ConfirmedTransactionResults`](../interfaces/types_transaction.ConfirmedTransactionResults.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `deleteReturn?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `operationPerformed`: ``"replace"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn)  } \| `Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"nothing"``  }\>

The metadata and transaction result(s) of the deployment, or just the metadata if it didn't need to issue transactions

#### Defined in

[src/types/application-client.ts:235](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L235)

___

### exposeLogicError

▸ **exposeLogicError**(`e`, `isClear?`): `Error`

Takes an error that may include a logic error from a smart contract call and re-exposes the error to include source code information via the source map.
This is automatically used within

**`See`**

ApplicationClient but if you pass `skipSending: true` e.g. if doing a group transaction
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

[src/types/application-client.ts:722](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L722)

___

### fundAppAccount

▸ **fundAppAccount**(`fund`): `Promise`<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md)\>

Funds ALGOs into the app account for this app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fund` | [`AlgoAmount`](types_amount.AlgoAmount.md) \| [`FundAppAccountParams`](../interfaces/types_application_client.FundAppAccountParams.md) | The parameters for the funding or the funding amount |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md)\>

The result of the funding

#### Defined in

[src/types/application-client.ts:483](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L483)

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

[src/types/application-client.ts:680](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L680)

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

[src/types/application-client.ts:658](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L658)

___

### getAppReference

▸ **getAppReference**(): `Promise`<[`AppReference`](../interfaces/types_app.AppReference.md) \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md)\>

Gets the reference information for the current application instance.
`appId` will be 0 if it can't find an app.

#### Returns

`Promise`<[`AppReference`](../interfaces/types_app.AppReference.md) \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md)\>

The app reference, or if deployed using the `deploy` method, the app metadata too

#### Defined in

[src/types/application-client.ts:690](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L690)

___

### getBoxNames

▸ **getBoxNames**(): `Promise`<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

Returns the names of all current boxes for the current app.

#### Returns

`Promise`<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

The names of the boxes

#### Defined in

[src/types/application-client.ts:537](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L537)

___

### getBoxValue

▸ **getBoxValue**(`name`): `Promise`<`Uint8Array`\>

Returns the value of the given box for the current app.

**`See`**

BoxName

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` \| `Uint8Array` \| [`BoxName`](../interfaces/types_app.BoxName.md) | The name of the box to return either as a string, binary array or |

#### Returns

`Promise`<`Uint8Array`\>

The current box value as a byte array

#### Defined in

[src/types/application-client.ts:552](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L552)

___

### getBoxValueAsABIType

▸ **getBoxValueAsABIType**(`name`, `type`): `Promise`<`ABIValue`\>

Returns the value of the given box for the current app.

**`See`**

BoxName

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` \| `Uint8Array` \| [`BoxName`](../interfaces/types_app.BoxName.md) | The name of the box to return either as a string, binary array or |
| `type` | `ABIType` | - |

#### Returns

`Promise`<`ABIValue`\>

The current box value as a byte array

#### Defined in

[src/types/application-client.ts:567](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L567)

___

### getBoxValues

▸ **getBoxValues**(`filter?`): `Promise`<{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `Uint8Array`  }[]\>

Returns the values of all current boxes for the current app.
Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filter?` | (`name`: [`BoxName`](../interfaces/types_app.BoxName.md)) => `boolean` | Optional filter to filter which boxes' values are returned |

#### Returns

`Promise`<{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `Uint8Array`  }[]\>

The (name, value) pair of the boxes with values as raw byte arrays

#### Defined in

[src/types/application-client.ts:583](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L583)

___

### getBoxValuesAsABIType

▸ **getBoxValuesAsABIType**(`type`, `filter?`): `Promise`<{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `ABIValue`  }[]\>

Returns the values of all current boxes for the current app decoded using an ABI Type.
Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `ABIType` | The ABI type to decode the values with |
| `filter?` | (`name`: [`BoxName`](../interfaces/types_app.BoxName.md)) => `boolean` | Optional filter to filter which boxes' values are returned |

#### Returns

`Promise`<{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `ABIValue`  }[]\>

The (name, value) pair of the boxes with values as the ABI Value

#### Defined in

[src/types/application-client.ts:605](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L605)

___

### getCallArgs

▸ **getCallArgs**(`args?`): `undefined` \| [`AppCallArgs`](../modules/types_app.md#appcallargs)

Returns the arguments for an app call for the given ABI method or raw method specification.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args?` | [`AppClientCallArgs`](../modules/types_application_client.md#appclientcallargs) | The call args specific to this application client |

#### Returns

`undefined` \| [`AppCallArgs`](../modules/types_app.md#appcallargs)

The call args ready to pass into an app call

#### Defined in

[src/types/application-client.ts:626](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L626)

___

### getGlobalState

▸ **getGlobalState**(): `Promise`<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns global state for the current app.

#### Returns

`Promise`<[`AppState`](../interfaces/types_app.AppState.md)\>

The global state

#### Defined in

[src/types/application-client.ts:509](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L509)

___

### getLocalState

▸ **getLocalState**(`account`): `Promise`<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns local state for the given account / account address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `string` \| [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom) |

#### Returns

`Promise`<[`AppState`](../interfaces/types_app.AppState.md)\>

The global state

#### Defined in

[src/types/application-client.ts:523](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L523)

___

### optIn

▸ **optIn**(`call`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `call` | [`AppClientCallParams`](../modules/types_application_client.md#appclientcallparams) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[src/types/application-client.ts:431](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L431)

___

### update

▸ **update**(`update?`): `Promise`<`Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `update?` | [`AppClientCreateParams`](../modules/types_application_client.md#appclientcreateparams) |

#### Returns

`Promise`<`Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[src/types/application-client.ts:385](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L385)
