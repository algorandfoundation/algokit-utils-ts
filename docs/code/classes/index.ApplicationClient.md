[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / ApplicationClient

# Class: ApplicationClient

[index](../modules/index.md).ApplicationClient

## Table of contents

### Constructors

- [constructor](index.ApplicationClient.md#constructor)

### Properties

- [\_appAddress](index.ApplicationClient.md#_appaddress)
- [\_appIndex](index.ApplicationClient.md#_appindex)
- [\_creator](index.ApplicationClient.md#_creator)
- [algod](index.ApplicationClient.md#algod)
- [appSpec](index.ApplicationClient.md#appspec)
- [existingDeployments](index.ApplicationClient.md#existingdeployments)
- [indexer](index.ApplicationClient.md#indexer)
- [params](index.ApplicationClient.md#params)
- [sender](index.ApplicationClient.md#sender)

### Methods

- [call](index.ApplicationClient.md#call)
- [create](index.ApplicationClient.md#create)
- [deploy](index.ApplicationClient.md#deploy)
- [getABIMethod](index.ApplicationClient.md#getabimethod)
- [loadAppReference](index.ApplicationClient.md#loadappreference)
- [update](index.ApplicationClient.md#update)

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

[application-client.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L29)

## Properties

### \_appAddress

• `Private` **\_appAddress**: `string`

#### Defined in

[application-client.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L26)

___

### \_appIndex

• `Private` **\_appIndex**: `number`

#### Defined in

[application-client.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L25)

___

### \_creator

• `Private` **\_creator**: `undefined` \| `string`

#### Defined in

[application-client.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L27)

___

### algod

• `Private` **algod**: `default`

#### Defined in

[application-client.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L18)

___

### appSpec

• `Private` **appSpec**: [`AppSpec`](../interfaces/types_appspec.AppSpec.md)

#### Defined in

[application-client.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L20)

___

### existingDeployments

• `Private` **existingDeployments**: `undefined` \| [`AppLookup`](../interfaces/index.AppLookup.md)

#### Defined in

[application-client.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L23)

___

### indexer

• `Private` **indexer**: `default`

#### Defined in

[application-client.ts:19](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L19)

___

### params

• `Private` **params**: `undefined` \| `SuggestedParams`

#### Defined in

[application-client.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L22)

___

### sender

• `Private` **sender**: `undefined` \| [`SendTransactionFrom`](../modules/index.md#sendtransactionfrom)

#### Defined in

[application-client.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L21)

## Methods

### call

▸ **call**(`call`): `Promise`<[`AppCallTransactionResult`](../interfaces/index.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `call` | `Object` |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/index.AppCallTransactionResult.md)\>

#### Defined in

[application-client.ts:296](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L296)

___

### create

▸ **create**(`create?`): `Promise`<[`AppCallTransactionResult`](../interfaces/index.AppCallTransactionResult.md) & [`AppReference`](../interfaces/index.AppReference.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `create?` | `Object` |
| `create.args?` | [`AppCallArgs`](../modules/index.md#appcallargs) |
| `create.deployTimeParameters?` | [`TealTemplateParameters`](../interfaces/index.TealTemplateParameters.md) |
| `create.note?` | [`TransactionNote`](../modules/index.md#transactionnote) |
| `create.sendParams?` | [`SendTransactionParams`](../interfaces/index.SendTransactionParams.md) |
| `create.sender?` | [`SendTransactionFrom`](../modules/index.md#sendtransactionfrom) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/index.AppCallTransactionResult.md) & [`AppReference`](../interfaces/index.AppReference.md)\>

#### Defined in

[application-client.ts:207](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L207)

___

### deploy

▸ **deploy**(`deploy`): `Promise`<[`SendTransactionResult`](../interfaces/index.SendTransactionResult.md) & [`AppMetadata`](../interfaces/index.AppMetadata.md) & { `operationPerformed`: ``"update"`` \| ``"create"``  } \| [`SendTransactionResult`](../interfaces/index.SendTransactionResult.md) & [`AppMetadata`](../interfaces/index.AppMetadata.md) & { `deleteResult?`: [`SendTransactionResult`](../interfaces/index.SendTransactionResult.md) ; `operationPerformed`: ``"replace"``  } \| [`AppMetadata`](../interfaces/index.AppMetadata.md) & { `operationPerformed`: ``"none"``  }\>

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
| `deploy.createArgs?` | [`AppCallArgs`](../modules/index.md#appcallargs) | Any args to pass to any create transaction that is issued as part of deployment |
| `deploy.deleteArgs?` | [`AppCallArgs`](../modules/index.md#appcallargs) | Any args to pass to any delete transaction that is issued as part of deployment |
| `deploy.deployTimeParameters?` | [`TealTemplateParameters`](../interfaces/index.TealTemplateParameters.md) | Any deploy-time parameters to replace in the TEAL code |
| `deploy.onSchemaBreak?` | [`OnSchemaBreak`](../enums/index.OnSchemaBreak.md) \| ``"replace"`` \| ``"fail"`` | What action to perform if a schema break is detected |
| `deploy.onUpdate?` | ``"replace"`` \| ``"fail"`` \| [`OnUpdate`](../enums/index.OnUpdate.md) \| ``"update"`` | What action to perform if a TEAL update is detected |
| `deploy.sendParams?` | `Omit`<[`SendTransactionParams`](../interfaces/index.SendTransactionParams.md), ``"skipSending"`` \| ``"skipWaiting"`` \| ``"args"``\> | Parameters to control transaction sending |
| `deploy.sender?` | [`SendTransactionFrom`](../modules/index.md#sendtransactionfrom) | The optional sender to send the transaction from, will use the application client's default sender by default if specified |
| `deploy.updateArgs?` | [`AppCallArgs`](../modules/index.md#appcallargs) | Any args to pass to any update transaction that is issued as part of deployment |
| `deploy.version` | `string` | The version of the contract, e.g. "1.0" |

#### Returns

`Promise`<[`SendTransactionResult`](../interfaces/index.SendTransactionResult.md) & [`AppMetadata`](../interfaces/index.AppMetadata.md) & { `operationPerformed`: ``"update"`` \| ``"create"``  } \| [`SendTransactionResult`](../interfaces/index.SendTransactionResult.md) & [`AppMetadata`](../interfaces/index.AppMetadata.md) & { `deleteResult?`: [`SendTransactionResult`](../interfaces/index.SendTransactionResult.md) ; `operationPerformed`: ``"replace"``  } \| [`AppMetadata`](../interfaces/index.AppMetadata.md) & { `operationPerformed`: ``"none"``  }\>

The metadata and transaction result(s) of the deployment, or just the metadata if it didn't need to issue transactions

#### Defined in

[application-client.ts:94](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L94)

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

[application-client.ts:362](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L362)

___

### loadAppReference

▸ `Private` **loadAppReference**(): `Promise`<[`AppReference`](../interfaces/index.AppReference.md) \| [`AppMetadata`](../interfaces/index.AppMetadata.md)\>

#### Returns

`Promise`<[`AppReference`](../interfaces/index.AppReference.md) \| [`AppMetadata`](../interfaces/index.AppMetadata.md)\>

#### Defined in

[application-client.ts:377](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L377)

___

### update

▸ **update**(`update?`): `Promise`<[`AppCallTransactionResult`](../interfaces/index.AppCallTransactionResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `update?` | `Object` |
| `update.args?` | [`AppCallArgs`](../modules/index.md#appcallargs) |
| `update.deployTimeParameters?` | [`TealTemplateParameters`](../interfaces/index.TealTemplateParameters.md) |
| `update.note?` | [`TransactionNote`](../modules/index.md#transactionnote) |
| `update.sendParams?` | [`SendTransactionParams`](../interfaces/index.SendTransactionParams.md) |
| `update.sender?` | [`SendTransactionFrom`](../modules/index.md#sendtransactionfrom) |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/index.AppCallTransactionResult.md)\>

#### Defined in

[application-client.ts:258](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/application-client.ts#L258)
