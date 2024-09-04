[@algorandfoundation/algokit-utils](../README.md) / [types/app-deployer](../modules/types_app_deployer.md) / AppDeployer

# Class: AppDeployer

[types/app-deployer](../modules/types_app_deployer.md).AppDeployer

Allows management of deployment and deployment metadata of applications.

## Table of contents

### Constructors

- [constructor](types_app_deployer.AppDeployer.md#constructor)

### Properties

- [\_appLookups](types_app_deployer.AppDeployer.md#_applookups)
- [\_appManager](types_app_deployer.AppDeployer.md#_appmanager)
- [\_indexer](types_app_deployer.AppDeployer.md#_indexer)
- [\_transactionSender](types_app_deployer.AppDeployer.md#_transactionsender)

### Methods

- [deploy](types_app_deployer.AppDeployer.md#deploy)
- [getCreatorAppsByName](types_app_deployer.AppDeployer.md#getcreatorappsbyname)
- [updateAppLookup](types_app_deployer.AppDeployer.md#updateapplookup)

## Constructors

### constructor

• **new AppDeployer**(`appManager`, `transactionSender`, `indexer?`): [`AppDeployer`](types_app_deployer.AppDeployer.md)

Creates an `AppManager`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appManager` | [`AppManager`](types_app_manager.AppManager.md) | An `AppManager` instance |
| `transactionSender` | [`AlgorandClientTransactionSender`](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md) | An `AlgorandClientTransactionSender` instance |
| `indexer?` | `default` | An optional indexer instance; supply if you want to indexer to look up app metadata |

#### Returns

[`AppDeployer`](types_app_deployer.AppDeployer.md)

#### Defined in

[src/types/app-deployer.ts:116](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L116)

## Properties

### \_appLookups

• `Private` **\_appLookups**: `Map`\<`string`, [`AppLookup`](../interfaces/types_app_deployer.AppLookup.md)\>

#### Defined in

[src/types/app-deployer.ts:108](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L108)

___

### \_appManager

• `Private` **\_appManager**: [`AppManager`](types_app_manager.AppManager.md)

#### Defined in

[src/types/app-deployer.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L105)

___

### \_indexer

• `Private` `Optional` **\_indexer**: `default`

#### Defined in

[src/types/app-deployer.ts:107](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L107)

___

### \_transactionSender

• `Private` **\_transactionSender**: [`AlgorandClientTransactionSender`](types_algorand_client_transaction_sender.AlgorandClientTransactionSender.md)

#### Defined in

[src/types/app-deployer.ts:106](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L106)

## Methods

### deploy

▸ **deploy**(`deployment`): `Promise`\<[`AppDeployResult`](../modules/types_app_deployer.md#appdeployresult)\>

Idempotently deploy (create if not exists, update if changed) an app against the given name for the given creator account, including deploy-time TEAL template placeholder substitutions (if specified).

To understand the architecture decisions behind this functionality please see https://github.com/algorandfoundation/algokit-cli/blob/main/docs/architecture-decisions/2023-01-12_smart-contract-deployment.md

**Note:** When using the return from this function be sure to check `operationPerformed` to get access to various return properties like `transaction`, `confirmation` and `deleteResult`.

**Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.

**Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deployment` | [`AppDeployParams`](../interfaces/types_app_deployer.AppDeployParams.md) | The arguments to control the app deployment |

#### Returns

`Promise`\<[`AppDeployResult`](../modules/types_app_deployer.md#appdeployresult)\>

The app reference of the new/existing app

#### Defined in

[src/types/app-deployer.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L135)

___

### getCreatorAppsByName

▸ **getCreatorAppsByName**(`creatorAddress`, `ignoreCache?`): `Promise`\<[`AppLookup`](../interfaces/types_app_deployer.AppLookup.md)\>

Returns a lookup of name => app metadata (id, address, ...metadata) for all apps created by the given account that have
an [ARC-2](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md) `AppDeployNote` as the transaction
note of the app creation transaction.

This function caches the result for the given creator account so that subsequent calls will not require an indexer lookup.

If the `AppManager` instance wasn't created with an indexer client, this function will throw an error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `creatorAddress` | `string` | The address of the account that is the creator of the apps you want to search for |
| `ignoreCache?` | `boolean` | Whether ot not to ignore the cache and force a lookup, default: use the cache |

#### Returns

`Promise`\<[`AppLookup`](../interfaces/types_app_deployer.AppLookup.md)\>

A name-based lookup of the app metadata

#### Defined in

[src/types/app-deployer.ts:448](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L448)

___

### updateAppLookup

▸ **updateAppLookup**(`sender`, `appMetadata`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sender` | `string` |
| `appMetadata` | [`AppMetadata`](../interfaces/types_app_deployer.AppMetadata.md) |

#### Returns

`void`

#### Defined in

[src/types/app-deployer.ts:426](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L426)
