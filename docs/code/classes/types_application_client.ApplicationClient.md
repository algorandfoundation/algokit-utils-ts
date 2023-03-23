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
- [getABIMethod](types_application_client.ApplicationClient.md#getabimethod)
- [getAppReference](types_application_client.ApplicationClient.md#getappreference)
- [getCallArgs](types_application_client.ApplicationClient.md#getcallargs)
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

[types/application-client.ts:147](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L147)

## Properties

### \_appAddress

• `Private` **\_appAddress**: `string`

#### Defined in

[types/application-client.ts:137](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L137)

___

### \_appId

• `Private` **\_appId**: `number`

#### Defined in

[types/application-client.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L136)

___

### \_appName

• `Private` **\_appName**: `string`

#### Defined in

[types/application-client.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L139)

___

### \_creator

• `Private` **\_creator**: `undefined` \| `string`

#### Defined in

[types/application-client.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L138)

___

### algod

• `Private` **algod**: `default`

#### Defined in

[types/application-client.ts:129](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L129)

___

### appSpec

• `Private` **appSpec**: [`AppSpec`](../interfaces/types_appspec.AppSpec.md)

#### Defined in

[types/application-client.ts:131](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L131)

___

### existingDeployments

• `Private` **existingDeployments**: `undefined` \| [`AppLookup`](../interfaces/types_app.AppLookup.md)

#### Defined in

[types/application-client.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L134)

___

### indexer

• `Private` `Optional` **indexer**: `default`

#### Defined in

[types/application-client.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L130)

___

### params

• `Private` **params**: `undefined` \| `SuggestedParams`

#### Defined in

[types/application-client.ts:133](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L133)

___

### sender

• `Private` **sender**: `undefined` \| [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

#### Defined in

[types/application-client.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L132)

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

[types/application-client.ts:383](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L383)

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

[types/application-client.ts:363](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L363)

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

[types/application-client.ts:375](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L375)

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

[types/application-client.ts:371](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L371)

___

### create

▸ **create**(`create?`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md) & [`AppReference`](../interfaces/types_app.AppReference.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `create?` | [`AppClientCreateParams`](../modules/types_application_client.md#appclientcreateparams) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md) & [`AppReference`](../interfaces/types_app.AppReference.md)\>

#### Defined in

[types/application-client.ts:282](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L282)

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

[types/application-client.ts:379](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L379)

___

### deploy

▸ **deploy**(`deploy`): `Promise`<[`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"update"`` \| ``"create"``  } \| [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `operationPerformed`: ``"replace"``  } \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"nothing"``  }\>

Idempotently deploy (create, update/delete if changed) an app against the given name via the given creator account, including deploy-time template placeholder substitutions.

To understand the architecture decisions behind this functionality please

**`See`**

https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md

**Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.

**Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deploy` | [`AppClientDeployParams`](../interfaces/types_application_client.AppClientDeployParams.md) | Deployment details |

#### Returns

`Promise`<[`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"update"`` \| ``"create"``  } \| [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `operationPerformed`: ``"replace"``  } \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"nothing"``  }\>

The metadata and transaction result(s) of the deployment, or just the metadata if it didn't need to issue transactions

#### Defined in

[types/application-client.ts:191](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L191)

___

### getABIMethod

▸ **getABIMethod**(`method`): `undefined` \| `ABIMethodParams`

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |

#### Returns

`undefined` \| `ABIMethodParams`

#### Defined in

[types/application-client.ts:434](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L434)

___

### getAppReference

▸ **getAppReference**(): `Promise`<[`AppReference`](../interfaces/types_app.AppReference.md) \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md)\>

#### Returns

`Promise`<[`AppReference`](../interfaces/types_app.AppReference.md) \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md)\>

#### Defined in

[types/application-client.ts:449](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L449)

___

### getCallArgs

▸ **getCallArgs**(`args?`): `undefined` \| [`AppCallArgs`](../modules/types_app.md#appcallargs)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | [`AppClientCallArgs`](../modules/types_application_client.md#appclientcallargs) |

#### Returns

`undefined` \| [`AppCallArgs`](../modules/types_app.md#appcallargs)

#### Defined in

[types/application-client.ts:414](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L414)

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

[types/application-client.ts:367](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L367)

___

### update

▸ **update**(`update?`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `update?` | [`AppClientCreateParams`](../modules/types_application_client.md#appclientcreateparams) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[types/application-client.ts:328](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L328)
