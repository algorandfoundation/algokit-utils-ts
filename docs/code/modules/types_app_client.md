[@algorandfoundation/algokit-utils](../README.md) / types/app-client

# Module: types/app-client

## Table of contents

### Classes

- [AppClient](../classes/types_app_client.AppClient.md)
- [ApplicationClient](../classes/types_app_client.ApplicationClient.md)

### Interfaces

- [AppClientCallABIArgs](../interfaces/types_app_client.AppClientCallABIArgs.md)
- [AppClientCallCoreParams](../interfaces/types_app_client.AppClientCallCoreParams.md)
- [AppClientCallRawArgs](../interfaces/types_app_client.AppClientCallRawArgs.md)
- [AppClientCompilationParams](../interfaces/types_app_client.AppClientCompilationParams.md)
- [AppClientDeployCallInterfaceParams](../interfaces/types_app_client.AppClientDeployCallInterfaceParams.md)
- [AppClientDeployCoreParams](../interfaces/types_app_client.AppClientDeployCoreParams.md)
- [AppClientDeployParams](../interfaces/types_app_client.AppClientDeployParams.md)
- [AppClientParams](../interfaces/types_app_client.AppClientParams.md)
- [AppSourceMaps](../interfaces/types_app_client.AppSourceMaps.md)
- [FundAppAccountParams](../interfaces/types_app_client.FundAppAccountParams.md)
- [ResolveAppById](../interfaces/types_app_client.ResolveAppById.md)
- [ResolveAppByIdBase](../interfaces/types_app_client.ResolveAppByIdBase.md)
- [SourceMapExport](../interfaces/types_app_client.SourceMapExport.md)

### Type Aliases

- [AppClientBareCallParams](types_app_client.md#appclientbarecallparams)
- [AppClientCallArgs](types_app_client.md#appclientcallargs)
- [AppClientCallParams](types_app_client.md#appclientcallparams)
- [AppClientClearStateParams](types_app_client.md#appclientclearstateparams)
- [AppClientCreateOnComplete](types_app_client.md#appclientcreateoncomplete)
- [AppClientCreateParams](types_app_client.md#appclientcreateparams)
- [AppClientMethodCallParams](types_app_client.md#appclientmethodcallparams)
- [AppClientUpdateParams](types_app_client.md#appclientupdateparams)
- [AppDetails](types_app_client.md#appdetails)
- [AppDetailsBase](types_app_client.md#appdetailsbase)
- [AppSpecAppDetails](types_app_client.md#appspecappdetails)
- [AppSpecAppDetailsBase](types_app_client.md#appspecappdetailsbase)
- [AppSpecAppDetailsByCreatorAndName](types_app_client.md#appspecappdetailsbycreatorandname)
- [AppSpecAppDetailsById](types_app_client.md#appspecappdetailsbyid)
- [CallOnComplete](types_app_client.md#calloncomplete)
- [FundAppParams](types_app_client.md#fundappparams)
- [ResolveAppByCreatorAndName](types_app_client.md#resolveappbycreatorandname)
- [ResolveAppByCreatorAndNameBase](types_app_client.md#resolveappbycreatorandnamebase)
- [ResolveAppClientByCreatorAndName](types_app_client.md#resolveappclientbycreatorandname)

## Type Aliases

### AppClientBareCallParams

Ƭ **AppClientBareCallParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`CommonAppCallParams`](types_composer.md#commonappcallparams), ``"appId"`` \| ``"sender"`` \| ``"onComplete"``\> & \{ `sender?`: `string`  }\>

AppClient parameters for a bare app call

#### Defined in

[src/types/app-client.ts:335](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L335)

___

### AppClientCallArgs

Ƭ **AppClientCallArgs**: [`AppClientCallRawArgs`](../interfaces/types_app_client.AppClientCallRawArgs.md) \| [`AppClientCallABIArgs`](../interfaces/types_app_client.AppClientCallABIArgs.md)

The arguments to pass to an Application Client smart contract call

#### Defined in

[src/types/app-client.ts:202](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L202)

___

### AppClientCallParams

Ƭ **AppClientCallParams**: [`AppClientCallArgs`](types_app_client.md#appclientcallargs) & [`AppClientCallCoreParams`](../interfaces/types_app_client.AppClientCallCoreParams.md)

Parameters to construct a ApplicationClient contract call

#### Defined in

[src/types/app-client.ts:215](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L215)

___

### AppClientClearStateParams

Ƭ **AppClientClearStateParams**: [`AppClientCallRawArgs`](../interfaces/types_app_client.AppClientCallRawArgs.md) & [`AppClientCallCoreParams`](../interfaces/types_app_client.AppClientCallCoreParams.md)

Parameters to construct a ApplicationClient clear state contract call

#### Defined in

[src/types/app-client.ts:218](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L218)

___

### AppClientCreateOnComplete

Ƭ **AppClientCreateOnComplete**: `Object`

On-complete action parameter for creating a contract using ApplicationClient

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `onCompleteAction?` | `Exclude`\<[`AppCallType`](types_app.md#appcalltype), ``"clear_state"``\> \| `Exclude`\<`OnApplicationComplete`, `OnApplicationComplete.ClearStateOC`\> | Override the on-completion action for the create call; defaults to NoOp |

#### Defined in

[src/types/app-client.ts:230](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L230)

___

### AppClientCreateParams

Ƭ **AppClientCreateParams**: [`AppClientCallParams`](types_app_client.md#appclientcallparams) & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`AppClientCreateOnComplete`](types_app_client.md#appclientcreateoncomplete) & \{ `schema?`: `Partial`\<[`AppStorageSchema`](../interfaces/types_app.AppStorageSchema.md)\>  }

Parameters for creating a contract using ApplicationClient

#### Defined in

[src/types/app-client.ts:236](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L236)

___

### AppClientMethodCallParams

Ƭ **AppClientMethodCallParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`CommonAppCallParams`](types_composer.md#commonappcallparams), ``"appId"`` \| ``"sender"`` \| ``"method"`` \| ``"args"``\> & \{ `args?`: (`ABIValue` \| [`ABIStruct`](types_app_arc56.md#abistruct) \| [`AppMethodCallTransactionArgument`](types_composer.md#appmethodcalltransactionargument) \| `undefined`)[] ; `method`: `string` ; `sender?`: `string`  }\>

AppClient parameters for an ABI method call

#### Defined in

[src/types/app-client.ts:343](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L343)

___

### AppClientUpdateParams

Ƭ **AppClientUpdateParams**: [`AppClientCallParams`](types_app_client.md#appclientcallparams) & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)

Parameters for updating a contract using ApplicationClient

#### Defined in

[src/types/app-client.ts:244](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L244)

___

### AppDetails

Ƭ **AppDetails**: [`AppDetailsBase`](types_app_client.md#appdetailsbase) & [`ResolveAppById`](../interfaces/types_app_client.ResolveAppById.md) \| [`ResolveAppByCreatorAndName`](types_app_client.md#resolveappbycreatorandname)

The details of an AlgoKit Utils deployed app

#### Defined in

[src/types/app-client.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L132)

___

### AppDetailsBase

Ƭ **AppDetailsBase**: `Object`

The details of an AlgoKit Utils deployed app

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `deployTimeParams?` | [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) | Optionally provide any deploy-time parameters to replace in the TEAL code; if specified here will get used in calls to `deploy`, `create` and `update` unless overridden in those calls |
| `params?` | `SuggestedParams` | Default suggested params object to use |
| `sender?` | [`SendTransactionFrom`](types_transaction.md#sendtransactionfrom) | Default sender to use for transactions issued by this application client |

#### Defined in

[src/types/app-client.ts:120](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L120)

___

### AppSpecAppDetails

Ƭ **AppSpecAppDetails**: [`AppSpecAppDetailsBase`](types_app_client.md#appspecappdetailsbase) & [`AppDetails`](types_app_client.md#appdetails)

The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app

#### Defined in

[src/types/app-client.ts:150](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L150)

___

### AppSpecAppDetailsBase

Ƭ **AppSpecAppDetailsBase**: `Object`

The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `app` | [`AppSpec`](../interfaces/types_app_spec.AppSpec.md) \| `string` | The ARC-0032 application spec as either: * Parsed JSON `AppSpec` * Raw JSON string |

#### Defined in

[src/types/app-client.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L135)

___

### AppSpecAppDetailsByCreatorAndName

Ƭ **AppSpecAppDetailsByCreatorAndName**: [`AppSpecAppDetailsBase`](types_app_client.md#appspecappdetailsbase) & [`AppDetailsBase`](types_app_client.md#appdetailsbase) & [`ResolveAppByCreatorAndNameBase`](types_app_client.md#resolveappbycreatorandnamebase)

The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app by creator and name

#### Defined in

[src/types/app-client.ts:147](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L147)

___

### AppSpecAppDetailsById

Ƭ **AppSpecAppDetailsById**: [`AppSpecAppDetailsBase`](types_app_client.md#appspecappdetailsbase) & [`AppDetailsBase`](types_app_client.md#appdetailsbase) & [`ResolveAppByIdBase`](../interfaces/types_app_client.ResolveAppByIdBase.md)

The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app by id

#### Defined in

[src/types/app-client.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L144)

___

### CallOnComplete

Ƭ **CallOnComplete**: `Object`

onComplete parameter for a non-update app call

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `onComplete?` | `Exclude`\<`OnApplicationComplete`, `OnApplicationComplete.UpdateApplicationOC`\> | On-complete of the call; defaults to no-op |

#### Defined in

[src/types/app-client.ts:329](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L329)

___

### FundAppParams

Ƭ **FundAppParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`PaymentParams`](types_composer.md#paymentparams), ``"receiver"`` \| ``"sender"``\> & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md) & \{ `sender?`: `string`  }\>

Parameters for funding an app account

#### Defined in

[src/types/app-client.ts:367](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L367)

___

### ResolveAppByCreatorAndName

Ƭ **ResolveAppByCreatorAndName**: [`ResolveAppByCreatorAndNameBase`](types_app_client.md#resolveappbycreatorandnamebase) & \{ `resolveBy`: ``"creatorAndName"``  }

Configuration to resolve app by creator and name `getCreatorAppsByName`

#### Defined in

[src/types/app-client.ts:101](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L101)

___

### ResolveAppByCreatorAndNameBase

Ƭ **ResolveAppByCreatorAndNameBase**: `Object`

Configuration to resolve app by creator and name `getCreatorAppsByName`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `creatorAddress` | `string` | The address of the app creator account to resolve the app by |
| `findExistingUsing` | `Indexer` \| [`AppLookup`](../interfaces/types_app.AppLookup.md) | The mechanism to find an existing app instance metadata for the given creator and name; either: * An indexer instance to search the creator account apps; or * The cached value of the existing apps for the given creator from `getCreatorAppsByName` |
| `name?` | `string` | The optional name override to resolve the app by within the creator account (default: uses the name in the ABI contract) |

#### Defined in

[src/types/app-client.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L88)

___

### ResolveAppClientByCreatorAndName

Ƭ **ResolveAppClientByCreatorAndName**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppClientParams`](../interfaces/types_app_client.AppClientParams.md), ``"appId"``\> & \{ `appLookupCache?`: [`AppLookup`](../interfaces/types_app_deployer.AppLookup.md) ; `creatorAddress`: `string` ; `ignoreCache?`: `boolean`  }\>

Resolve an app client instance by looking up an app created by the given creator with the given name

#### Defined in

[src/types/app-client.ts:376](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L376)
