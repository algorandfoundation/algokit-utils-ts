[@algorandfoundation/algokit-utils](../README.md) / types/app-client

# Module: types/app-client

## Table of contents

### Classes

- [ApplicationClient](../classes/types_app_client.ApplicationClient.md)

### Interfaces

- [AppClientCompilationParams](../interfaces/types_app_client.AppClientCompilationParams.md)
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
- [AppSpecAppDetails](types_app_client.md#appspecappdetails)
- [ResolveAppByCreatorAndName](types_app_client.md#resolveappbycreatorandname)

## Type Aliases

### AppClientCallArgs

Ƭ **AppClientCallArgs**: { `args?`: [`RawAppCallArgs`](../interfaces/types_app.RawAppCallArgs.md)  } \| { `method`: `string` ; `methodArgs`: `Omit`<[`ABIAppCallArgs`](../interfaces/types_app.ABIAppCallArgs.md), ``"method"``\> \| [`ABIAppCallArg`](types_app.md#abiappcallarg)[]  }

The arguments to pass to an Application Client smart contract call

#### Defined in

[src/types/app-client.ts:118](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L118)

___

### AppClientCallParams

Ƭ **AppClientCallParams**: [`AppClientCallArgs`](types_app_client.md#appclientcallargs) & { `note?`: [`TransactionNote`](types_transaction.md#transactionnote) ; `sendParams?`: [`SendTransactionParams`](../interfaces/types_transaction.SendTransactionParams.md) ; `sender?`: [`SendTransactionFrom`](types_transaction.md#sendtransactionfrom)  }

Parameters to construct a ApplicationClient contract call

#### Defined in

[src/types/app-client.ts:131](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L131)

___

### AppClientCreateParams

Ƭ **AppClientCreateParams**: [`AppClientCallParams`](types_app_client.md#appclientcallparams) & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)

Parameters for creating a contract using ApplicationClient

#### Defined in

[src/types/app-client.ts:150](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L150)

___

### AppClientUpdateParams

Ƭ **AppClientUpdateParams**: [`AppClientCreateParams`](types_app_client.md#appclientcreateparams)

Parameters for updating a contract using ApplicationClient

#### Defined in

[src/types/app-client.ts:153](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L153)

___

### AppSpecAppDetails

Ƭ **AppSpecAppDetails**: { `app`: [`AppSpec`](../interfaces/types_app_spec.AppSpec.md) \| `string` ; `params?`: `SuggestedParams` ; `sender?`: [`SendTransactionFrom`](types_transaction.md#sendtransactionfrom)  } & [`ResolveAppById`](../interfaces/types_app_client.ResolveAppById.md) \| [`ResolveAppByCreatorAndName`](types_app_client.md#resolveappbycreatorandname)

The details of an ARC-0032 app spec specified app

#### Defined in

[src/types/app-client.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L75)

___

### ResolveAppByCreatorAndName

Ƭ **ResolveAppByCreatorAndName**: { `creatorAddress`: `string` ; `name?`: `string`  } & { `indexer`: `Indexer`  } \| { `existingDeployments`: [`AppLookup`](../interfaces/types_app.AppLookup.md)  }

Configuration to resolve app by creator and name

**`See`**

getCreatorAppsByName

#### Defined in

[src/types/app-client.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L50)