[@algorandfoundation/algokit-utils](../README.md) / [types/application-client](../modules/types_application_client.md) / ApplicationClient

# Class: ApplicationClient

[types/application-client](../modules/types_application_client.md).ApplicationClient

## Table of contents

### Constructors

- [constructor](types_application_client.ApplicationClient.md#constructor)

### Properties

- [\_appAddress](types_application_client.ApplicationClient.md#_appaddress)
- [\_appId](types_application_client.ApplicationClient.md#_appid)
- [\_creator](types_application_client.ApplicationClient.md#_creator)
- [algod](types_application_client.ApplicationClient.md#algod)
- [appSpec](types_application_client.ApplicationClient.md#appspec)
- [existingDeployments](types_application_client.ApplicationClient.md#existingdeployments)
- [indexer](types_application_client.ApplicationClient.md#indexer)
- [params](types_application_client.ApplicationClient.md#params)
- [sender](types_application_client.ApplicationClient.md#sender)

### Methods

- [call](types_application_client.ApplicationClient.md#call)
- [create](types_application_client.ApplicationClient.md#create)
- [deploy](types_application_client.ApplicationClient.md#deploy)
- [getABIMethod](types_application_client.ApplicationClient.md#getabimethod)
- [loadAppReference](types_application_client.ApplicationClient.md#loadappreference)
- [update](types_application_client.ApplicationClient.md#update)

## Constructors

### constructor

• **new ApplicationClient**(`appDetails`, `algod`, `indexer`)

Create a new ApplicationClient instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appDetails` | [`AppSpecAppDetails`](../modules/types_application_client.md#appspecappdetails) | The details of the app |
| `algod` | `default` | An algod instance |
| `indexer` | `default` | An indexer instance |

#### Defined in

[types/application-client.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L52)

## Properties

### \_appAddress

• `Private` **\_appAddress**: `string`

#### Defined in

[types/application-client.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L43)

___

### \_appId

• `Private` **\_appId**: `number`

#### Defined in

[types/application-client.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L42)

___

### \_creator

• `Private` **\_creator**: `undefined` \| `string`

#### Defined in

[types/application-client.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L44)

___

### algod

• `Private` **algod**: `default`

#### Defined in

[types/application-client.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L35)

___

### appSpec

• `Private` **appSpec**: [`AppSpec`](../interfaces/types_appspec.AppSpec.md)

#### Defined in

[types/application-client.ts:37](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L37)

___

### existingDeployments

• `Private` **existingDeployments**: `undefined` \| [`AppLookup`](../interfaces/types_app.AppLookup.md)

#### Defined in

[types/application-client.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L40)

___

### indexer

• `Private` **indexer**: `default`

#### Defined in

[types/application-client.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L36)

___

### params

• `Private` **params**: `undefined` \| `SuggestedParams`

#### Defined in

[types/application-client.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L39)

___

### sender

• `Private` **sender**: `undefined` \| [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom)

#### Defined in

[types/application-client.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L38)

## Methods

### call

▸ **call**(`call`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `call` | `Object` |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[types/application-client.ts:295](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L295)

___

### create

▸ **create**(`create?`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md) & [`AppReference`](../interfaces/types_app.AppReference.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `create?` | `Object` |
| `create.args?` | [`AppCallArgs`](../modules/types_app.md#appcallargs) |
| `create.deployTimeParameters?` | [`TealTemplateParameters`](../interfaces/types_app.TealTemplateParameters.md) |
| `create.note?` | [`TransactionNote`](../modules/types_transaction.md#transactionnote) |
| `create.sendParams?` | [`SendTransactionParams`](../interfaces/types_transaction.SendTransactionParams.md) |
| `create.sender?` | [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md) & [`AppReference`](../interfaces/types_app.AppReference.md)\>

#### Defined in

[types/application-client.ts:206](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L206)

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
| `deploy` | `Object` | Deployment details |
| `deploy.allowDelete?` | `boolean` | Whether or not to allow deletes in the contract using the deploy-time deletability control if present in your contract. If this is not specified then it will automatically be determined based on the AppSpec definition |
| `deploy.allowUpdate?` | `boolean` | Whether or not to allow updates in the contract using the deploy-time updatability control if present in your contract. If this is not specified then it will automatically be determined based on the AppSpec definition |
| `deploy.createArgs?` | [`AppCallArgs`](../modules/types_app.md#appcallargs) | Any args to pass to any create transaction that is issued as part of deployment |
| `deploy.deleteArgs?` | [`AppCallArgs`](../modules/types_app.md#appcallargs) | Any args to pass to any delete transaction that is issued as part of deployment |
| `deploy.deployTimeParameters?` | [`TealTemplateParameters`](../interfaces/types_app.TealTemplateParameters.md) | Any deploy-time parameters to replace in the TEAL code |
| `deploy.onSchemaBreak?` | [`OnSchemaBreak`](../enums/types_app.OnSchemaBreak.md) \| ``"replace"`` \| ``"fail"`` | What action to perform if a schema break is detected |
| `deploy.onUpdate?` | ``"replace"`` \| ``"fail"`` \| [`OnUpdate`](../enums/types_app.OnUpdate.md) \| ``"update"`` | What action to perform if a TEAL update is detected |
| `deploy.sendParams?` | `Omit`<[`SendTransactionParams`](../interfaces/types_transaction.SendTransactionParams.md), ``"skipSending"`` \| ``"skipWaiting"`` \| ``"args"``\> | Parameters to control transaction sending |
| `deploy.sender?` | [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom) | The optional sender to send the transaction from, will use the application client's default sender by default if specified |
| `deploy.updateArgs?` | [`AppCallArgs`](../modules/types_app.md#appcallargs) | Any args to pass to any update transaction that is issued as part of deployment |
| `deploy.version?` | `string` | The version of the contract, uses "1.0" by default |

#### Returns

`Promise`<[`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"update"`` \| ``"create"``  } \| [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) & [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `operationPerformed`: ``"replace"``  } \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md) & { `operationPerformed`: ``"nothing"``  }\>

The metadata and transaction result(s) of the deployment, or just the metadata if it didn't need to issue transactions

#### Defined in

[types/application-client.ts:92](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L92)

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

[types/application-client.ts:362](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L362)

___

### loadAppReference

▸ `Private` **loadAppReference**(): `Promise`<[`AppReference`](../interfaces/types_app.AppReference.md) \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md)\>

#### Returns

`Promise`<[`AppReference`](../interfaces/types_app.AppReference.md) \| [`AppMetadata`](../interfaces/types_app.AppMetadata.md)\>

#### Defined in

[types/application-client.ts:377](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L377)

___

### update

▸ **update**(`update?`): `Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `update?` | `Object` |
| `update.args?` | [`AppCallArgs`](../modules/types_app.md#appcallargs) |
| `update.deployTimeParameters?` | [`TealTemplateParameters`](../interfaces/types_app.TealTemplateParameters.md) |
| `update.note?` | [`TransactionNote`](../modules/types_transaction.md#transactionnote) |
| `update.sendParams?` | [`SendTransactionParams`](../interfaces/types_transaction.SendTransactionParams.md) |
| `update.sender?` | [`SendTransactionFrom`](../modules/types_transaction.md#sendtransactionfrom) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/types_app.AppCallTransactionResult.md)\>

#### Defined in

[types/application-client.ts:257](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L257)
