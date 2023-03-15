[@algorandfoundation/algokit-utils](../README.md) / [application-client](../modules/application_client.md) / ApplicationClient

# Class: ApplicationClient

[application-client](../modules/application_client.md).ApplicationClient

## Table of contents

### Constructors

- [constructor](application_client.ApplicationClient.md#constructor)

### Properties

- [\_appAddress](application_client.ApplicationClient.md#_appaddress)
- [\_appIndex](application_client.ApplicationClient.md#_appindex)
- [\_creator](application_client.ApplicationClient.md#_creator)
- [algod](application_client.ApplicationClient.md#algod)
- [appSpec](application_client.ApplicationClient.md#appspec)
- [existingDeployments](application_client.ApplicationClient.md#existingdeployments)
- [indexer](application_client.ApplicationClient.md#indexer)
- [params](application_client.ApplicationClient.md#params)
- [sender](application_client.ApplicationClient.md#sender)

### Methods

- [call](application_client.ApplicationClient.md#call)
- [create](application_client.ApplicationClient.md#create)
- [deploy](application_client.ApplicationClient.md#deploy)
- [getABIMethod](application_client.ApplicationClient.md#getabimethod)
- [loadAppReference](application_client.ApplicationClient.md#loadappreference)
- [update](application_client.ApplicationClient.md#update)

## Constructors

### constructor

• **new ApplicationClient**(`appDetails`, `algod`, `indexer`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `appDetails` | `Object` |
| `algod` | `default` |
| `indexer` | `default` |

#### Defined in

[application-client.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L29)

## Properties

### \_appAddress

• `Private` **\_appAddress**: `string`

#### Defined in

[application-client.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L26)

___

### \_appIndex

• `Private` **\_appIndex**: `number`

#### Defined in

[application-client.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L25)

___

### \_creator

• `Private` **\_creator**: `undefined` \| `string`

#### Defined in

[application-client.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L27)

___

### algod

• `Private` **algod**: `default`

#### Defined in

[application-client.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L18)

___

### appSpec

• `Private` **appSpec**: [`AppSpec`](../interfaces/types_appspec.AppSpec.md)

#### Defined in

[application-client.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L20)

___

### existingDeployments

• `Private` **existingDeployments**: `undefined` \| [`AppLookup`](../interfaces/deploy_app.AppLookup.md)

#### Defined in

[application-client.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L23)

___

### indexer

• `Private` **indexer**: `default`

#### Defined in

[application-client.ts:19](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L19)

___

### params

• `Private` **params**: `undefined` \| `SuggestedParams`

#### Defined in

[application-client.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L22)

___

### sender

• `Private` **sender**: `undefined` \| [`SendTransactionFrom`](../modules/transaction.md#sendtransactionfrom)

#### Defined in

[application-client.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L21)

## Methods

### call

▸ **call**(`call`): `Promise`<[`AppCallTransactionResult`](../interfaces/app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `call` | `Object` |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/app.AppCallTransactionResult.md)\>

#### Defined in

[application-client.ts:291](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L291)

___

### create

▸ **create**(`create?`): `Promise`<[`AppCallTransactionResult`](../interfaces/app.AppCallTransactionResult.md) & [`AppReference`](../interfaces/app.AppReference.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `create?` | `Object` |
| `create.args?` | [`AppCallArgs`](../modules/app.md#appcallargs) |
| `create.deployTimeParameters?` | [`TealTemplateParameters`](../interfaces/deploy_app.TealTemplateParameters.md) |
| `create.note?` | [`TransactionNote`](../modules/transaction.md#transactionnote) |
| `create.sendParams?` | [`SendTransactionParams`](../interfaces/transaction.SendTransactionParams.md) |
| `create.sender?` | [`SendTransactionFrom`](../modules/transaction.md#sendtransactionfrom) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/app.AppCallTransactionResult.md) & [`AppReference`](../interfaces/app.AppReference.md)\>

#### Defined in

[application-client.ts:202](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L202)

___

### deploy

▸ **deploy**(`deploy`): `Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md) & [`AppMetadata`](../interfaces/deploy_app.AppMetadata.md) & { `deleteResult?`: [`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md)  }\>

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
| `deploy.createArgs?` | [`AppCallArgs`](../modules/app.md#appcallargs) | Any args to pass to any create transaction that is issued as part of deployment |
| `deploy.deleteArgs?` | [`AppCallArgs`](../modules/app.md#appcallargs) | Any args to pass to any delete transaction that is issued as part of deployment |
| `deploy.deployTimeParameters?` | [`TealTemplateParameters`](../interfaces/deploy_app.TealTemplateParameters.md) | Any deploy-time parameters to replace in the TEAL code |
| `deploy.onSchemaBreak?` | [`OnSchemaBreak`](../enums/deploy_app.OnSchemaBreak.md) \| ``"replace"`` \| ``"fail"`` | What action to perform if a schema break is detected |
| `deploy.onUpdate?` | ``"replace"`` \| ``"fail"`` \| [`OnUpdate`](../enums/deploy_app.OnUpdate.md) \| ``"update"`` | What action to perform if a TEAL update is detected |
| `deploy.sendParams?` | `Omit`<[`SendTransactionParams`](../interfaces/transaction.SendTransactionParams.md), ``"skipSending"`` \| ``"skipWaiting"`` \| ``"args"``\> | Parameters to control transaction sending |
| `deploy.sender?` | [`SendTransactionFrom`](../modules/transaction.md#sendtransactionfrom) | The optional sender to send the transaction from, will use the application client's default sender by default if specified |
| `deploy.updateArgs?` | [`AppCallArgs`](../modules/app.md#appcallargs) | Any args to pass to any update transaction that is issued as part of deployment |
| `deploy.version` | `string` | The version of the contract, e.g. "1.0" |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md) & [`AppMetadata`](../interfaces/deploy_app.AppMetadata.md) & { `deleteResult?`: [`SendTransactionResult`](../interfaces/transaction.SendTransactionResult.md)  }\>

The metadata and transaction result(s) of the deployment, or just the metadata if it didn't need to issue transactions

#### Defined in

[application-client.ts:94](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L94)

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

[application-client.ts:357](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L357)

___

### loadAppReference

▸ `Private` **loadAppReference**(): `Promise`<[`AppReference`](../interfaces/app.AppReference.md) \| [`AppMetadata`](../interfaces/deploy_app.AppMetadata.md)\>

#### Returns

`Promise`<[`AppReference`](../interfaces/app.AppReference.md) \| [`AppMetadata`](../interfaces/deploy_app.AppMetadata.md)\>

#### Defined in

[application-client.ts:372](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L372)

___

### update

▸ **update**(`update?`): `Promise`<[`AppCallTransactionResult`](../interfaces/app.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `update?` | `Object` |
| `update.args?` | [`AppCallArgs`](../modules/app.md#appcallargs) |
| `update.deployTimeParameters?` | [`TealTemplateParameters`](../interfaces/deploy_app.TealTemplateParameters.md) |
| `update.note?` | [`TransactionNote`](../modules/transaction.md#transactionnote) |
| `update.sendParams?` | [`SendTransactionParams`](../interfaces/transaction.SendTransactionParams.md) |
| `update.sender?` | [`SendTransactionFrom`](../modules/transaction.md#sendtransactionfrom) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/app.AppCallTransactionResult.md)\>

#### Defined in

[application-client.ts:253](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/application-client.ts#L253)
