[@algorandfoundation/algokit-utils](../README.md) / types/app-factory

# Module: types/app-factory

## Table of contents

### Classes

- [AppFactory](../classes/types_app_factory.AppFactory.md)

### Interfaces

- [AppFactoryParams](../interfaces/types_app_factory.AppFactoryParams.md)

### Type Aliases

- [AppFactoryAppClientParams](types_app_factory.md#appfactoryappclientparams)
- [AppFactoryCreateMethodCallParams](types_app_factory.md#appfactorycreatemethodcallparams)
- [AppFactoryCreateParams](types_app_factory.md#appfactorycreateparams)
- [AppFactoryDeployParams](types_app_factory.md#appfactorydeployparams)
- [AppFactoryResolveAppClientByCreatorAndNameParams](types_app_factory.md#appfactoryresolveappclientbycreatorandnameparams)
- [CreateOnComplete](types_app_factory.md#createoncomplete)
- [CreateSchema](types_app_factory.md#createschema)

## Type Aliases

### AppFactoryAppClientParams

Ƭ **AppFactoryAppClientParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppClientParams`](../interfaces/types_app_client.AppClientParams.md), ``"algorand"`` \| ``"appSpec"``\>\>

Params to get an app client by ID from an app factory.

#### Defined in

[src/types/app-factory.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L132)

___

### AppFactoryCreateMethodCallParams

Ƭ **AppFactoryCreateMethodCallParams**: [`Expand`](types_expand.md#expand)\<[`AppClientMethodCallParams`](types_app_client.md#appclientmethodcallparams) & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`CreateOnComplete`](types_app_factory.md#createoncomplete) & [`CreateSchema`](types_app_factory.md#createschema)\>

Params to specify a create method call for an app

#### Defined in

[src/types/app-factory.ts:127](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L127)

___

### AppFactoryCreateParams

Ƭ **AppFactoryCreateParams**: [`Expand`](types_expand.md#expand)\<[`AppClientBareCallParams`](types_app_client.md#appclientbarecallparams) & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`CreateOnComplete`](types_app_factory.md#createoncomplete) & [`CreateSchema`](types_app_factory.md#createschema)\>

Params to specify a bare (raw) create call for an app

#### Defined in

[src/types/app-factory.ts:124](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L124)

___

### AppFactoryDeployParams

Ƭ **AppFactoryDeployParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppDeployParams`](types_app_deployer.md#appdeployparams), ``"createParams"`` \| ``"updateParams"`` \| ``"deleteParams"`` \| ``"metadata"``\> & \{ `appName?`: `string` ; `createParams?`: [`Expand`](types_expand.md#expand)\<[`AppClientMethodCallParams`](types_app_client.md#appclientmethodcallparams) & [`CreateOnComplete`](types_app_factory.md#createoncomplete) & [`CreateSchema`](types_app_factory.md#createschema)\> \| [`Expand`](types_expand.md#expand)\<[`AppClientBareCallParams`](types_app_client.md#appclientbarecallparams) & [`CreateOnComplete`](types_app_factory.md#createoncomplete) & [`CreateSchema`](types_app_factory.md#createschema)\> ; `deletable?`: `boolean` ; `deleteParams?`: [`AppClientMethodCallParams`](types_app_client.md#appclientmethodcallparams) \| [`AppClientBareCallParams`](types_app_client.md#appclientbarecallparams) ; `updatable?`: `boolean` ; `updateParams?`: [`AppClientMethodCallParams`](types_app_client.md#appclientmethodcallparams) \| [`AppClientBareCallParams`](types_app_client.md#appclientbarecallparams)  }\>

Parameters to define a deployment for an `AppFactory`

#### Defined in

[src/types/app-factory.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L138)

___

### AppFactoryResolveAppClientByCreatorAndNameParams

Ƭ **AppFactoryResolveAppClientByCreatorAndNameParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`ResolveAppClientByCreatorAndName`](types_app_client.md#resolveappclientbycreatorandname), ``"algorand"`` \| ``"appSpec"``\>\>

Params to get an app client by creator address and name from an app factory.

#### Defined in

[src/types/app-factory.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L135)

___

### CreateOnComplete

Ƭ **CreateOnComplete**: `Object`

onComplete parameter for a create app call

#### Type declaration

| Name | Type |
| :------ | :------ |
| `onComplete?` | `Exclude`\<`OnApplicationComplete`, `OnApplicationComplete.ClearState`\> |

#### Defined in

[src/types/app-factory.ts:100](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L100)

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

[src/types/app-factory.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L105)
