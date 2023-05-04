[@algorandfoundation/algokit-utils](../README.md) / types/app-client

# Module: types/app-client

## Table of contents

### Classes

- [ApplicationClient](../classes/types_app_client.ApplicationClient.md)

### Interfaces

- [AppClientCallCoreParams](../interfaces/types_app_client.AppClientCallCoreParams.md)
- [AppClientCompilationParams](../interfaces/types_app_client.AppClientCompilationParams.md)
- [AppClientDeployCallInterfaceParams](../interfaces/types_app_client.AppClientDeployCallInterfaceParams.md)
- [AppClientDeployCoreParams](../interfaces/types_app_client.AppClientDeployCoreParams.md)
- [AppClientDeployParams](../interfaces/types_app_client.AppClientDeployParams.md)
- [AppSourceMaps](../interfaces/types_app_client.AppSourceMaps.md)
- [FundAppAccountParams](../interfaces/types_app_client.FundAppAccountParams.md)
- [ResolveAppById](../interfaces/types_app_client.ResolveAppById.md)
- [SourceMapExport](../interfaces/types_app_client.SourceMapExport.md)

### Type Aliases

- [AppClientCallArgs](types_app_client.md#appclientcallargs)
- [AppClientCallParams](types_app_client.md#appclientcallparams)
- [AppClientCreateParams](types_app_client.md#appclientcreateparams)
- [AppClientUpdateParams](types_app_client.md#appclientupdateparams)
- [AppDetails](types_app_client.md#appdetails)
- [AppSpecAppDetails](types_app_client.md#appspecappdetails)
- [ResolveAppByCreatorAndName](types_app_client.md#resolveappbycreatorandname)
- [ResolveAppByCreatorAndNameWithIndexer](types_app_client.md#resolveappbycreatorandnamewithindexer)
- [ResolveAppByCreatorAndNameWithoutIndexer](types_app_client.md#resolveappbycreatorandnamewithoutindexer)

## Type Aliases

### AppClientCallArgs

Ƭ **AppClientCallArgs**: { `args?`: [`RawAppCallArgs`](../interfaces/types_app.RawAppCallArgs.md)  } \| { `method`: `string` ; `methodArgs`: `Omit`<[`ABIAppCallArgs`](../interfaces/types_app.ABIAppCallArgs.md), ``"method"``\> \| [`ABIAppCallArg`](types_app.md#abiappcallarg)[]  } \| [`CoreAppCallArgs`](../interfaces/types_app.CoreAppCallArgs.md) & { `method`: `string` ; `methodArgs`: [`ABIAppCallArg`](types_app.md#abiappcallarg)[]  }

The arguments to pass to an Application Client smart contract call

#### Defined in

[src/types/app-client.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L134)

___

### AppClientCallParams

Ƭ **AppClientCallParams**: [`AppClientCallArgs`](types_app_client.md#appclientcallargs) & [`AppClientCallCoreParams`](../interfaces/types_app_client.AppClientCallCoreParams.md)

Parameters to construct a ApplicationClient contract call

#### Defined in

[src/types/app-client.ts:163](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L163)

___

### AppClientCreateParams

Ƭ **AppClientCreateParams**: [`AppClientCallParams`](types_app_client.md#appclientcallparams) & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)

Parameters for creating a contract using ApplicationClient

#### Defined in

[src/types/app-client.ts:175](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L175)

___

### AppClientUpdateParams

Ƭ **AppClientUpdateParams**: [`AppClientCreateParams`](types_app_client.md#appclientcreateparams)

Parameters for updating a contract using ApplicationClient

#### Defined in

[src/types/app-client.ts:178](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L178)

___

### AppDetails

Ƭ **AppDetails**: { `params?`: `SuggestedParams` ; `sender?`: [`SendTransactionFrom`](types_transaction.md#sendtransactionfrom)  } & [`ResolveAppById`](../interfaces/types_app_client.ResolveAppById.md) \| [`ResolveAppByCreatorAndName`](types_app_client.md#resolveappbycreatorandname)

The details of an AlgoKit Utils deployed app

#### Defined in

[src/types/app-client.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L80)

___

### AppSpecAppDetails

Ƭ **AppSpecAppDetails**: [`AppDetails`](types_app_client.md#appdetails) & { `app`: [`AppSpec`](../interfaces/types_app_spec.AppSpec.md) \| `string`  }

The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app

#### Defined in

[src/types/app-client.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L88)

___

### ResolveAppByCreatorAndName

Ƭ **ResolveAppByCreatorAndName**: [`ResolveAppByCreatorAndNameWithIndexer`](types_app_client.md#resolveappbycreatorandnamewithindexer) \| [`ResolveAppByCreatorAndNameWithoutIndexer`](types_app_client.md#resolveappbycreatorandnamewithoutindexer)

Configuration to resolve app by creator and name `getCreatorAppsByName`

#### Defined in

[src/types/app-client.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L69)

___

### ResolveAppByCreatorAndNameWithIndexer

Ƭ **ResolveAppByCreatorAndNameWithIndexer**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `creatorAddress` | `string` | The address of the app creator account to resolve the app by |
| `indexer` | `Indexer` | An indexer instance to search the creator account apps |
| `name?` | `string` | The optional name to resolve the app by within the creator account (default: uses the name in the ABI contract) |

#### Defined in

[src/types/app-client.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L50)

___

### ResolveAppByCreatorAndNameWithoutIndexer

Ƭ **ResolveAppByCreatorAndNameWithoutIndexer**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `creatorAddress` | `string` | The address of the app creator account to resolve the app by |
| `existingDeployments` | [`AppLookup`](../interfaces/types_app.AppLookup.md) | Cached value of the existing apps for the given creator, `getCreatorAppsByName` |
| `name?` | `string` | The optional name to resolve the app by within the creator account (default: uses the name in the ABI contract) |

#### Defined in

[src/types/app-client.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L59)
