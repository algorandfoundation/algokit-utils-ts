[@algorandfoundation/algokit-utils](../README.md) / types/application-client

# Module: types/application-client

## Table of contents

### Classes

- [ApplicationClient](../classes/types_application_client.ApplicationClient.md)

### Interfaces

- [AppClientCompilationParams](../interfaces/types_application_client.AppClientCompilationParams.md)
- [AppClientDeployParams](../interfaces/types_application_client.AppClientDeployParams.md)
- [AppSourceMaps](../interfaces/types_application_client.AppSourceMaps.md)
- [FundAppAccountParams](../interfaces/types_application_client.FundAppAccountParams.md)
- [ResolveAppById](../interfaces/types_application_client.ResolveAppById.md)
- [SourceMapExport](../interfaces/types_application_client.SourceMapExport.md)

### Type Aliases

- [AppClientCallArgs](types_application_client.md#appclientcallargs)
- [AppClientCallParams](types_application_client.md#appclientcallparams)
- [AppClientCreateParams](types_application_client.md#appclientcreateparams)
- [AppClientUpdateParams](types_application_client.md#appclientupdateparams)
- [AppSpecAppDetails](types_application_client.md#appspecappdetails)
- [ResolveAppByCreatorAndName](types_application_client.md#resolveappbycreatorandname)

## Type Aliases

### AppClientCallArgs

Ƭ **AppClientCallArgs**: { `args?`: [`RawAppCallArgs`](../interfaces/types_app.RawAppCallArgs.md)  } \| { `method`: `string` ; `methodArgs`: `Omit`<[`ABIAppCallArgs`](../interfaces/types_app.ABIAppCallArgs.md), ``"method"``\> \| [`ABIAppCallArg`](types_app.md#abiappcallarg)[]  }

The arguments to pass to an Application Client smart contract call

#### Defined in

[src/types/application-client.ts:118](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L118)

___

### AppClientCallParams

Ƭ **AppClientCallParams**: [`AppClientCallArgs`](types_application_client.md#appclientcallargs) & { `note?`: [`TransactionNote`](types_transaction.md#transactionnote) ; `sendParams?`: [`SendTransactionParams`](../interfaces/types_transaction.SendTransactionParams.md) ; `sender?`: [`SendTransactionFrom`](types_transaction.md#sendtransactionfrom)  }

Parameters to construct a ApplicationClient contract call

#### Defined in

[src/types/application-client.ts:131](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L131)

___

### AppClientCreateParams

Ƭ **AppClientCreateParams**: [`AppClientCallParams`](types_application_client.md#appclientcallparams) & [`AppClientCompilationParams`](../interfaces/types_application_client.AppClientCompilationParams.md)

Parameters for creating a contract using ApplicationClient

#### Defined in

[src/types/application-client.ts:150](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L150)

___

### AppClientUpdateParams

Ƭ **AppClientUpdateParams**: [`AppClientCreateParams`](types_application_client.md#appclientcreateparams)

Parameters for updating a contract using ApplicationClient

#### Defined in

[src/types/application-client.ts:153](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L153)

___

### AppSpecAppDetails

Ƭ **AppSpecAppDetails**: { `app`: [`AppSpec`](../interfaces/types_appspec.AppSpec.md) \| `string` ; `params?`: `SuggestedParams` ; `sender?`: [`SendTransactionFrom`](types_transaction.md#sendtransactionfrom)  } & [`ResolveAppById`](../interfaces/types_application_client.ResolveAppById.md) \| [`ResolveAppByCreatorAndName`](types_application_client.md#resolveappbycreatorandname)

The details of an ARC-0032 app spec specified app

#### Defined in

[src/types/application-client.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L75)

___

### ResolveAppByCreatorAndName

Ƭ **ResolveAppByCreatorAndName**: { `creatorAddress`: `string` ; `name?`: `string`  } & { `indexer`: `Indexer`  } \| { `existingDeployments`: [`AppLookup`](../interfaces/types_app.AppLookup.md)  }

Configuration to resolve app by creator and name

**`See`**

getCreatorAppsByName

#### Defined in

[src/types/application-client.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L50)
