[@algorandfoundation/algokit-utils](../README.md) / types/app-factory

# Module: types/app-factory

## Table of contents

### Classes

- [AppFactory](../classes/types_app_factory.AppFactory.md)

### Interfaces

- [AppFactoryParams](../interfaces/types_app_factory.AppFactoryParams.md)

### Type Aliases

- [AppFactoryCreateParams](types_app_factory.md#appfactorycreateparams)
- [AppFactoryDeployParams](types_app_factory.md#appfactorydeployparams)
- [CreateOnComplete](types_app_factory.md#createoncomplete)
- [CreateSchema](types_app_factory.md#createschema)

## Type Aliases

### AppFactoryCreateParams

Ƭ **AppFactoryCreateParams**: [`Expand`](types_expand.md#expand)\<[`AppClientMethodCallParams`](types_app_client.md#appclientmethodcallparams) & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`CreateOnComplete`](types_app_factory.md#createoncomplete) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md) & [`CreateSchema`](types_app_factory.md#createschema)\> \| [`Expand`](types_expand.md#expand)\<[`AppClientBareCallParams`](types_app_client.md#appclientbarecallparams) & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`CreateOnComplete`](types_app_factory.md#createoncomplete) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md) & [`CreateSchema`](types_app_factory.md#createschema)\>

Parameters to define a create call for an `AppFactory`

#### Defined in

<<<<<<< HEAD
[src/types/app-factory.ts:113](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L113)
=======
[src/types/app-factory.ts:100](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L100)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### AppFactoryDeployParams

Ƭ **AppFactoryDeployParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppDeployParams`](types_app_deployer.md#appdeployparams), ``"createParams"`` \| ``"updateParams"`` \| ``"deleteParams"`` \| ``"metadata"``\> & \{ `createParams?`: [`Expand`](types_expand.md#expand)\<[`AppClientMethodCallParams`](types_app_client.md#appclientmethodcallparams) & [`CreateOnComplete`](types_app_factory.md#createoncomplete) & [`CreateSchema`](types_app_factory.md#createschema)\> \| [`Expand`](types_expand.md#expand)\<[`AppClientBareCallParams`](types_app_client.md#appclientbarecallparams) & [`CreateOnComplete`](types_app_factory.md#createoncomplete) & [`CreateSchema`](types_app_factory.md#createschema)\> ; `deletable?`: `boolean` ; `deleteParams?`: [`AppClientMethodCallParams`](types_app_client.md#appclientmethodcallparams) \| [`AppClientBareCallParams`](types_app_client.md#appclientbarecallparams) ; `updatable?`: `boolean` ; `updateParams?`: [`AppClientMethodCallParams`](types_app_client.md#appclientmethodcallparams) \| [`AppClientBareCallParams`](types_app_client.md#appclientbarecallparams)  }\>

Parameters to define a deployment for an `AppFactory`

#### Defined in

<<<<<<< HEAD
[src/types/app-factory.ts:118](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L118)
=======
[src/types/app-factory.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L105)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### CreateOnComplete

Ƭ **CreateOnComplete**: `Object`

<<<<<<< HEAD
onComplete parameter for a create app call
=======
onComplete parameter for a non-update app call
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `onComplete?` | `Exclude`\<`OnApplicationComplete`, `OnApplicationComplete.ClearStateOC`\> |

#### Defined in

<<<<<<< HEAD
[src/types/app-factory.ts:89](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L89)
=======
[src/types/app-factory.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L81)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### CreateSchema

Ƭ **CreateSchema**: `Object`

<<<<<<< HEAD
Specifies a schema used for creating an app

=======
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
<<<<<<< HEAD
| `extraProgramPages?` | `number` | Number of extra pages required for the programs. Defaults to the number needed for the programs in this call if not specified. This is immutable once the app is created. |
=======
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
| `schema?` | \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } | The state schema for the app. This is immutable once the app is created. By default uses the ARC32/ARC-56 spec. |
| `schema.globalByteSlices` | `number` | The number of byte slices saved in global state. |
| `schema.globalInts` | `number` | The number of integers saved in global state. |
| `schema.localByteSlices` | `number` | The number of byte slices saved in local state. |
| `schema.localInts` | `number` | The number of integers saved in local state. |

#### Defined in

<<<<<<< HEAD
[src/types/app-factory.ts:94](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L94)
=======
[src/types/app-factory.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L85)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
