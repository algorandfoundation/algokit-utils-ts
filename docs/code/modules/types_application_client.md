[@algorandfoundation/algokit-utils](../README.md) / types/application-client

# Module: types/application-client

## Table of contents

### Classes

- [ApplicationClient](../classes/types_application_client.ApplicationClient.md)

### Interfaces

- [AppClientDeployParams](../interfaces/types_application_client.AppClientDeployParams.md)
- [ResolveAppById](../interfaces/types_application_client.ResolveAppById.md)

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

[src/types/application-client.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L93)

___

### AppClientCallParams

Ƭ **AppClientCallParams**: [`AppClientCallArgs`](types_application_client.md#appclientcallargs) & { `note?`: [`TransactionNote`](types_transaction.md#transactionnote) ; `sendParams?`: [`SendTransactionParams`](../interfaces/types_transaction.SendTransactionParams.md) ; `sender?`: [`SendTransactionFrom`](types_transaction.md#sendtransactionfrom)  }

Parameters to construct a ApplicationClient contract call

#### Defined in

[src/types/application-client.ts:106](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L106)

___

### AppClientCreateParams

Ƭ **AppClientCreateParams**: [`AppClientCallParams`](types_application_client.md#appclientcallparams) & { `deletable?`: `boolean` ; `deployTimeParameters?`: [`TealTemplateParameters`](../interfaces/types_app.TealTemplateParameters.md) ; `updatable?`: `boolean`  }

Parameters for creating a contract using ApplicationClient

#### Defined in

[src/types/application-client.ts:116](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L116)

___

### AppClientUpdateParams

Ƭ **AppClientUpdateParams**: [`AppClientCreateParams`](types_application_client.md#appclientcreateparams)

Parameters for updating a contract using ApplicationClient

#### Defined in

[src/types/application-client.ts:126](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L126)

___

### AppSpecAppDetails

Ƭ **AppSpecAppDetails**: { `app`: [`AppSpec`](../interfaces/types_appspec.AppSpec.md) \| `string` ; `params?`: `SuggestedParams` ; `sender?`: [`SendTransactionFrom`](types_transaction.md#sendtransactionfrom)  } & [`ResolveAppById`](../interfaces/types_application_client.ResolveAppById.md) \| [`ResolveAppByCreatorAndName`](types_application_client.md#resolveappbycreatorandname)

The details of an ARC-0032 app spec specified app

#### Defined in

[src/types/application-client.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L50)

___

### ResolveAppByCreatorAndName

Ƭ **ResolveAppByCreatorAndName**: { `creatorAddress`: `string` ; `name?`: `string`  } & { `indexer`: `Indexer`  } \| { `existingDeployments`: [`AppLookup`](../interfaces/types_app.AppLookup.md)  }

Configuration to resolve app by creator and name

**`See`**

getCreatorAppsByName

#### Defined in

[src/types/application-client.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L25)
