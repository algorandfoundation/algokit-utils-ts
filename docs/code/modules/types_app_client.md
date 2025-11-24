[@algorandfoundation/algokit-utils](../README.md) / types/app-client

# Module: types/app-client

## Table of contents

### Classes

- [AppClient](../classes/types_app_client.AppClient.md)
- [ApplicationClient](../classes/types_app_client.ApplicationClient.md)

### Interfaces

- [AppClientCallABIArgs](../interfaces/types_app_client.AppClientCallABIArgs.md)
- [AppClientCallCoreParams](../interfaces/types_app_client.AppClientCallCoreParams.md)
- [AppClientCompilationParams](../interfaces/types_app_client.AppClientCompilationParams.md)
- [AppClientCompilationResult](../interfaces/types_app_client.AppClientCompilationResult.md)
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
- [AppClientCallRawArgs](types_app_client.md#appclientcallrawargs)
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
- [CloneAppClientParams](types_app_client.md#cloneappclientparams)
- [FundAppParams](types_app_client.md#fundappparams)
- [ResolveAppByCreatorAndName](types_app_client.md#resolveappbycreatorandname)
- [ResolveAppByCreatorAndNameBase](types_app_client.md#resolveappbycreatorandnamebase)
- [ResolveAppClientByCreatorAndName](types_app_client.md#resolveappclientbycreatorandname)
- [ResolveAppClientByNetwork](types_app_client.md#resolveappclientbynetwork)

## Type Aliases

### AppClientBareCallParams

Ƭ **AppClientBareCallParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`CommonAppCallParams`](types_composer.md#commonappcallparams), ``"appId"`` \| ``"sender"`` \| ``"onComplete"``\> & \{ `sender?`: [`ReadableAddress`](types_composer.md#readableaddress)  }\>

AppClient common parameters for a bare app call

#### Defined in

[src/types/app-client.ts:371](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L371)

___

### AppClientCallArgs

Ƭ **AppClientCallArgs**: [`AppClientCallRawArgs`](types_app_client.md#appclientcallrawargs) \| [`AppClientCallABIArgs`](../interfaces/types_app_client.AppClientCallABIArgs.md)

The arguments to pass to an Application Client smart contract call

#### Defined in

[src/types/app-client.ts:221](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L221)

___

### AppClientCallParams

Ƭ **AppClientCallParams**: [`AppClientCallArgs`](types_app_client.md#appclientcallargs) & [`AppClientCallCoreParams`](../interfaces/types_app_client.AppClientCallCoreParams.md)

Parameters to construct a ApplicationClient contract call

#### Defined in

[src/types/app-client.ts:234](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L234)

___

### AppClientCallRawArgs

Ƭ **AppClientCallRawArgs**: [`RawAppCallArgs`](../interfaces/types_app.RawAppCallArgs.md)

#### Defined in

[src/types/app-client.ts:213](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L213)

___

### AppClientClearStateParams

Ƭ **AppClientClearStateParams**: [`AppClientCallRawArgs`](types_app_client.md#appclientcallrawargs) & [`AppClientCallCoreParams`](../interfaces/types_app_client.AppClientCallCoreParams.md)

Parameters to construct a ApplicationClient clear state contract call

#### Defined in

[src/types/app-client.ts:237](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L237)

___

### AppClientCreateOnComplete

Ƭ **AppClientCreateOnComplete**: `Object`

On-complete action parameter for creating a contract using ApplicationClient

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `onCompleteAction?` | `Exclude`\<[`AppCallType`](types_app.md#appcalltype), ``"clear_state"``\> \| `Exclude`\<`OnApplicationComplete`, `OnApplicationComplete.ClearState`\> | Override the on-completion action for the create call; defaults to NoOp |

#### Defined in

[src/types/app-client.ts:249](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L249)

___

### AppClientCreateParams

Ƭ **AppClientCreateParams**: [`AppClientCallParams`](types_app_client.md#appclientcallparams) & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`AppClientCreateOnComplete`](types_app_client.md#appclientcreateoncomplete) & \{ `schema?`: `Partial`\<[`AppStorageSchema`](../interfaces/types_app.AppStorageSchema.md)\>  }

Parameters for creating a contract using ApplicationClient

#### Defined in

[src/types/app-client.ts:255](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L255)

___

### AppClientMethodCallParams

Ƭ **AppClientMethodCallParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`CommonAppCallParams`](types_composer.md#commonappcallparams), ``"appId"`` \| ``"sender"`` \| ``"method"`` \| ``"args"``\> & \{ `args?`: (`ABIValue` \| [`ABIStruct`](types_app_arc56.md#abistruct) \| [`AppMethodCallTransactionArgument`](types_composer.md#appmethodcalltransactionargument) \| `undefined`)[] ; `method`: `string` ; `sender?`: [`ReadableAddress`](types_composer.md#readableaddress)  }\>

AppClient common parameters for an ABI method call

#### Defined in

[src/types/app-client.ts:379](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L379)

___

### AppClientUpdateParams

Ƭ **AppClientUpdateParams**: [`AppClientCallParams`](types_app_client.md#appclientcallparams) & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)

Parameters for updating a contract using ApplicationClient

#### Defined in

[src/types/app-client.ts:263](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L263)

___

### AppDetails

Ƭ **AppDetails**: [`AppDetailsBase`](types_app_client.md#appdetailsbase) & [`ResolveAppById`](../interfaces/types_app_client.ResolveAppById.md) \| [`ResolveAppByCreatorAndName`](types_app_client.md#resolveappbycreatorandname)

The details of an AlgoKit Utils deployed app

#### Defined in

[src/types/app-client.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L151)

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

[src/types/app-client.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L139)

___

### AppSpecAppDetails

Ƭ **AppSpecAppDetails**: [`AppSpecAppDetailsBase`](types_app_client.md#appspecappdetailsbase) & [`AppDetails`](types_app_client.md#appdetails)

The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app

#### Defined in

[src/types/app-client.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L169)

___

### AppSpecAppDetailsBase

Ƭ **AppSpecAppDetailsBase**: `Object`

The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `app` | [`AppSpec`](../interfaces/types_app_spec.AppSpec.md) \| `string` | The ARC-0032 application spec as either: * Parsed JSON `AppSpec` * Raw JSON string |

#### Defined in

[src/types/app-client.ts:154](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L154)

___

### AppSpecAppDetailsByCreatorAndName

Ƭ **AppSpecAppDetailsByCreatorAndName**: [`AppSpecAppDetailsBase`](types_app_client.md#appspecappdetailsbase) & [`AppDetailsBase`](types_app_client.md#appdetailsbase) & [`ResolveAppByCreatorAndNameBase`](types_app_client.md#resolveappbycreatorandnamebase)

The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app by creator and name

#### Defined in

[src/types/app-client.ts:166](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L166)

___

### AppSpecAppDetailsById

Ƭ **AppSpecAppDetailsById**: [`AppSpecAppDetailsBase`](types_app_client.md#appspecappdetailsbase) & [`AppDetailsBase`](types_app_client.md#appdetailsbase) & [`ResolveAppByIdBase`](../interfaces/types_app_client.ResolveAppByIdBase.md)

The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app by id

#### Defined in

[src/types/app-client.ts:163](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L163)

___

### CallOnComplete

Ƭ **CallOnComplete**: `Object`

onComplete parameter for a non-update app call

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `onComplete?` | `Exclude`\<`OnApplicationComplete`, `OnApplicationComplete.UpdateApplication`\> | On-complete of the call; defaults to no-op |

#### Defined in

[src/types/app-client.ts:365](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L365)

___

### CloneAppClientParams

Ƭ **CloneAppClientParams**: [`Expand`](types_expand.md#expand)\<`Partial`\<`Omit`\<[`AppClientParams`](../interfaces/types_app_client.AppClientParams.md), ``"algorand"`` \| ``"appSpec"``\>\>\>

Parameters to clone an app client

#### Defined in

[src/types/app-client.ts:362](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L362)

___

### FundAppParams

Ƭ **FundAppParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`PaymentParams`](types_composer.md#paymentparams), ``"receiver"`` \| ``"sender"``\> & [`SendParams`](../interfaces/types_transaction.SendParams.md) & \{ `sender?`: [`ReadableAddress`](types_composer.md#readableaddress)  }\>

Parameters for funding an app account

#### Defined in

[src/types/app-client.ts:404](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L404)

___

### ResolveAppByCreatorAndName

Ƭ **ResolveAppByCreatorAndName**: [`ResolveAppByCreatorAndNameBase`](types_app_client.md#resolveappbycreatorandnamebase) & \{ `resolveBy`: ``"creatorAndName"``  }

Configuration to resolve app by creator and name `getCreatorAppsByName`

#### Defined in

[src/types/app-client.ts:120](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L120)

___

### ResolveAppByCreatorAndNameBase

Ƭ **ResolveAppByCreatorAndNameBase**: `Object`

Configuration to resolve app by creator and name `getCreatorAppsByName`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `creatorAddress` | [`ReadableAddress`](types_composer.md#readableaddress) | The address of the app creator account to resolve the app by |
| `findExistingUsing` | `Indexer` \| [`AppLookup`](../interfaces/types_app.AppLookup.md) | The mechanism to find an existing app instance metadata for the given creator and name; either: * An indexer instance to search the creator account apps; or * The cached value of the existing apps for the given creator from `getCreatorAppsByName` |
| `name?` | `string` | The optional name override to resolve the app by within the creator account (default: uses the name in the ABI contract) |

#### Defined in

[src/types/app-client.ts:107](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L107)

___

### ResolveAppClientByCreatorAndName

Ƭ **ResolveAppClientByCreatorAndName**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppClientParams`](../interfaces/types_app_client.AppClientParams.md), ``"appId"``\> & \{ `appLookupCache?`: [`AppLookup`](../interfaces/types_app_deployer.AppLookup.md) ; `creatorAddress`: [`ReadableAddress`](types_composer.md#readableaddress) ; `ignoreCache?`: `boolean`  }\>

Resolve an app client instance by looking up an app created by the given creator with the given name

#### Defined in

[src/types/app-client.ts:413](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L413)

___

### ResolveAppClientByNetwork

Ƭ **ResolveAppClientByNetwork**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppClientParams`](../interfaces/types_app_client.AppClientParams.md), ``"appId"``\>\>

Resolve an app client instance by looking up the current network.

#### Defined in

[src/types/app-client.ts:427](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L427)
