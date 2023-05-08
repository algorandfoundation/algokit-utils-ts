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
- [existingDeployments](types_app_client.ApplicationClient.md#existingdeployments)
- [indexer](types_app_client.ApplicationClient.md#indexer)
- [params](types_app_client.ApplicationClient.md#params)
- [sender](types_app_client.ApplicationClient.md#sender)

### Methods

- [\_call](types_app_client.ApplicationClient.md#_call)
- [call](types_app_client.ApplicationClient.md#call)
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
- [getBoxValuesAsABIType](types_app_client.ApplicationClient.md#getboxvaluesasabitype)
- [getBoxValuesFromABIType](types_app_client.ApplicationClient.md#getboxvaluesfromabitype)
- [getCallArgs](types_app_client.ApplicationClient.md#getcallargs)
- [getGlobalState](types_app_client.ApplicationClient.md#getglobalstate)
- [getLocalState](types_app_client.ApplicationClient.md#getlocalstate)
- [importSourceMaps](types_app_client.ApplicationClient.md#importsourcemaps)
- [optIn](types_app_client.ApplicationClient.md#optin)
- [update](types_app_client.ApplicationClient.md#update)

## Constructors

### constructor

• **new ApplicationClient**(`appDetails`, `algod`)

Create a new ApplicationClient instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appDetails` | [`AppSpecAppDetails`](../modules/types_app_client.md#appspecappdetails) | The details of the app |
| `algod` | `default` | An algod instance |

#### Defined in

[src/types/app-client.ts:249](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L249)

## Properties

### \_appAddress

• `Private` **\_appAddress**: `string`

#### Defined in

[src/types/app-client.ts:230](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L230)

___

### \_appId

• `Private` **\_appId**: `number`

#### Defined in

[src/types/app-client.ts:229](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L229)

___

### \_appName

• `Private` **\_appName**: `string`

#### Defined in

[src/types/app-client.ts:232](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L232)

___

### \_approvalSourceMap

• `Private` **\_approvalSourceMap**: `undefined` \| `SourceMap`

#### Defined in

[src/types/app-client.ts:234](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L234)

___

### \_clearSourceMap

• `Private` **\_clearSourceMap**: `undefined` \| `SourceMap`

#### Defined in

[src/types/app-client.ts:235](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L235)

___

### \_creator

• `Private` **\_creator**: `undefined` \| `string`

#### Defined in

[src/types/app-client.ts:231](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L231)

___

### algod

• `Private` **algod**: `default`

#### Defined in

[src/types/app-client.ts:222](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L222)

___

### appSpec

• `Private` **appSpec**: [`AppSpec`](../interfaces/types_app_spec.AppSpec.md)

#### Defined in

[src/types/app-client.ts:224](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L224)

___

### existingDeployments

• `Private` **existingDeployments**: `undefined` \| [`AppLookup`](../interfaces/types_app.AppLookup.md)

#### Defined in

[src/types/app-client.ts:227](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L227)

___

### indexer

• `Private` `Optional` **indexer**: `default`

#### Defined in

[src/types/app-client.ts:223](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L223)

___

### params

• `Private` **params**: `undefined` \| `SuggestedParams`

#### Defined in

[src/types/app-client.ts:226](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L226)

___

### sender

• `Private` **sender**: `undefined` \| [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

#### Defined in

[src/types/app-client.ts:225](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L225)

## Methods

### \_call

▸ `Private` **_call**(`call`, `callType`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `call` | `undefined` \| [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) |
| `callType` | ``"optin"`` \| ``"closeout"`` \| ``"clearstate"`` \| ``"delete"`` \| ``"normal"`` |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[src/types/app-client.ts:534](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L534)

___

### call

▸ **call**(`call?`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[src/types/app-client.ts:514](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L514)

___

### clearState

▸ **clearState**(`call?`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[src/types/app-client.ts:526](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L526)

___

### closeOut

▸ **closeOut**(`call?`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[src/types/app-client.ts:522](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L522)

___

### compile

▸ **compile**(`compilation?`): `Promise`<{ `approvalCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `clearCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)  }\>

Compiles the approval and clear programs and sets up the source map.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compilation?` | [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) | The deploy-time parameters for the compilation |

#### Returns

`Promise`<{ `approvalCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `clearCompiled`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)  }\>

The compiled approval and clear programs

#### Defined in

[src/types/app-client.ts:285](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L285)

___

### create

▸ **create**(`create?`): `Promise`<`Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md) & [`AppReference`](../interfaces/types_app.AppReference.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `create?` | [`AppClientCreateParams`](../modules/types_app_client.md#appclientcreateparams) |

#### Returns

`Promise`<`Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md) & [`AppReference`](../interfaces/types_app.AppReference.md)\>

#### Defined in

[src/types/app-client.ts:430](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L430)

___

### delete

▸ **delete**(`call?`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[src/types/app-client.ts:530](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L530)

___

### deploy

▸ **deploy**(`deploy?`): `Promise`<`Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`ConfirmedTransactionResults`](../interfaces/types_transaction.ConfirmedTransactionResults.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"update"`` \| ``"create"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn)  } \| `Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`ConfirmedTransactionResults`](../interfaces/types_transaction.ConfirmedTransactionResults.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `deleteReturn?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `operationPerformed`: ``"replace"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn)  } \| `Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"nothing"``  }\>

Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.

To understand the architecture decisions behind this functionality please see https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md

**Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.

**Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deploy?` | [`AppClientDeployParams`](../interfaces/types_app_client.AppClientDeployParams.md) | Deployment details |

#### Returns

`Promise`<`Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`ConfirmedTransactionResults`](../interfaces/types_transaction.ConfirmedTransactionResults.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"update"`` \| ``"create"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn)  } \| `Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`ConfirmedTransactionResults`](../interfaces/types_transaction.ConfirmedTransactionResults.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `deleteReturn?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `operationPerformed`: ``"replace"`` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn)  } \| `Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"nothing"``  }\>

The metadata and transaction result(s) of the deployment, or just the metadata if it didn't need to issue transactions

#### Defined in

[src/types/app-client.ts:339](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L339)

___

### exportSourceMaps

▸ **exportSourceMaps**(): [`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

Export the current source maps for the app.

#### Returns

[`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

The source maps

#### Defined in

[src/types/app-client.ts:306](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L306)

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

[src/types/app-client.ts:806](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L806)

___

### fundAppAccount

▸ **fundAppAccount**(`fund`): `Promise`<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md)\>

Funds ALGOs into the app account for this app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fund` | [`AlgoAmount`](types_amount.AlgoAmount.md) \| [`FundAppAccountParams`](../interfaces/types_app_client.FundAppAccountParams.md) | The parameters for the funding or the funding amount |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/types_transaction.SendTransactionResult.md)\>

The result of the funding

#### Defined in

[src/types/app-client.ts:570](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L570)

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

[src/types/app-client.ts:765](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L765)

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

[src/types/app-client.ts:743](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L743)

___

### getAppReference

▸ **getAppReference**(): `Promise`<[`AppReference`](../interfaces/types_app.AppReference.md) \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md)\>

Gets the reference information for the current application instance.
`appId` will be 0 if it can't find an app.

#### Returns

`Promise`<[`AppReference`](../interfaces/types_app.AppReference.md) \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md)\>

The app reference, or if deployed using the `deploy` method, the app metadata too

#### Defined in

[src/types/app-client.ts:775](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L775)

___

### getBoxNames

▸ **getBoxNames**(): `Promise`<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

Returns the names of all current boxes for the current app.

#### Returns

`Promise`<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

The names of the boxes

#### Defined in

[src/types/app-client.ts:624](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L624)

___

### getBoxValue

▸ **getBoxValue**(`name`): `Promise`<`Uint8Array`\>

Returns the value of the given box for the current app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` \| `Uint8Array` \| [`BoxName`](../interfaces/types_app.BoxName.md) | The name of the box to return either as a string, binary array or `BoxName` |

#### Returns

`Promise`<`Uint8Array`\>

The current box value as a byte array

#### Defined in

[src/types/app-client.ts:639](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L639)

___

### getBoxValueFromABIType

▸ **getBoxValueFromABIType**(`name`, `type`): `Promise`<`ABIValue`\>

Returns the value of the given box for the current app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` \| `Uint8Array` \| [`BoxName`](../interfaces/types_app.BoxName.md) | The name of the box to return either as a string, binary array or `BoxName` |
| `type` | `ABIType` | - |

#### Returns

`Promise`<`ABIValue`\>

The current box value as a byte array

#### Defined in

[src/types/app-client.ts:654](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L654)

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

[src/types/app-client.ts:670](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L670)

___

### getBoxValuesAsABIType

▸ **getBoxValuesAsABIType**(`type`, `filter?`): `Promise`<{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `ABIValue`  }[]\>

**`Deprecated`**

Use `getBoxValuesFromABIType` instead

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `ABIType` |
| `filter?` | (`name`: [`BoxName`](../interfaces/types_app.BoxName.md)) => `boolean` |

#### Returns

`Promise`<{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `ABIValue`  }[]\>

#### Defined in

[src/types/app-client.ts:709](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L709)

___

### getBoxValuesFromABIType

▸ **getBoxValuesFromABIType**(`type`, `filter?`): `Promise`<{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `ABIValue`  }[]\>

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

[src/types/app-client.ts:692](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L692)

___

### getCallArgs

▸ **getCallArgs**(`args?`): `undefined` \| [`AppCallArgs`](../modules/types_app.md#appcallargs)

Returns the arguments for an app call for the given ABI method or raw method specification.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args?` | [`AppClientCallArgs`](../modules/types_app_client.md#appclientcallargs) | The call args specific to this application client |

#### Returns

`undefined` \| [`AppCallArgs`](../modules/types_app.md#appcallargs)

The call args ready to pass into an app call

#### Defined in

[src/types/app-client.ts:718](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L718)

___

### getGlobalState

▸ **getGlobalState**(): `Promise`<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns global state for the current app.

#### Returns

`Promise`<[`AppState`](../interfaces/types_app.AppState.md)\>

The global state

#### Defined in

[src/types/app-client.ts:596](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L596)

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

[src/types/app-client.ts:610](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L610)

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

[src/types/app-client.ts:323](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L323)

___

### optIn

▸ **optIn**(`call?`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `call?` | [`AppClientCallParams`](../modules/types_app_client.md#appclientcallparams) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[src/types/app-client.ts:518](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L518)

___

### update

▸ **update**(`update?`): `Promise`<`Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `update?` | [`AppClientCreateParams`](../modules/types_app_client.md#appclientcreateparams) |

#### Returns

`Promise`<`Partial`<[`AppCompilationResult`](../interfaces/types_app.AppCompilationResult.md)\> & [`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[src/types/app-client.ts:476](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L476)
