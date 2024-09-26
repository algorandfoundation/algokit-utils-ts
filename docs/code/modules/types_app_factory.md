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

[src/types/app-factory.ts:115](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L115)

___

### AppFactoryDeployParams

Ƭ **AppFactoryDeployParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppDeployParams`](types_app_deployer.md#appdeployparams), ``"createParams"`` \| ``"updateParams"`` \| ``"deleteParams"`` \| ``"metadata"``\> & \{ `createParams?`: [`Expand`](types_expand.md#expand)\<[`AppClientMethodCallParams`](types_app_client.md#appclientmethodcallparams) & [`CreateOnComplete`](types_app_factory.md#createoncomplete) & [`CreateSchema`](types_app_factory.md#createschema)\> \| [`Expand`](types_expand.md#expand)\<[`AppClientBareCallParams`](types_app_client.md#appclientbarecallparams) & [`CreateOnComplete`](types_app_factory.md#createoncomplete) & [`CreateSchema`](types_app_factory.md#createschema)\> ; `deletable?`: `boolean` ; `deleteParams?`: [`AppClientMethodCallParams`](types_app_client.md#appclientmethodcallparams) \| [`AppClientBareCallParams`](types_app_client.md#appclientbarecallparams) ; `updatable?`: `boolean` ; `updateParams?`: [`AppClientMethodCallParams`](types_app_client.md#appclientmethodcallparams) \| [`AppClientBareCallParams`](types_app_client.md#appclientbarecallparams)  }\>

Parameters to define a deployment for an `AppFactory`

#### Defined in

[src/types/app-factory.ts:120](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L120)

___

### CreateOnComplete

Ƭ **CreateOnComplete**: `Object`

onComplete parameter for a create app call

#### Type declaration

| Name | Type |
| :------ | :------ |
| `onComplete?` | `Exclude`\<`OnApplicationComplete`, `OnApplicationComplete.ClearStateOC`\> |

#### Defined in

[src/types/app-factory.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L91)

___

### CreateSchema

Ƭ **CreateSchema**: `Object`

Specifies a schema used for creating an app

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `extraProgramPages?` | `number` | Number of extra pages required for the programs. Defaults to the number needed for the programs in this call if not specified. This is immutable once the app is created. |
| `schema?` | \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } | The state schema for the app. This is immutable once the app is created. By default uses the ARC32/ARC-56 spec. |
| `schema.globalByteSlices` | `number` | The number of byte slices saved in global state. |
| `schema.globalInts` | `number` | The number of integers saved in global state. |
| `schema.localByteSlices` | `number` | The number of byte slices saved in local state. |
| `schema.localInts` | `number` | The number of integers saved in local state. |

#### Defined in

[src/types/app-factory.ts:96](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L96)
