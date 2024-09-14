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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:337](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L337)
=======
[src/types/app-client.ts:318](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L318)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:324](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L324)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:338](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L338)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:336](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L336)
>>>>>>> de5873b (chore: draft tests)

___

### AppClientCallArgs

Ƭ **AppClientCallArgs**: [`AppClientCallRawArgs`](../interfaces/types_app_client.AppClientCallRawArgs.md) \| [`AppClientCallABIArgs`](../interfaces/types_app_client.AppClientCallABIArgs.md)

The arguments to pass to an Application Client smart contract call

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:204](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L204)
=======
[src/types/app-client.ts:191](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L191)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:205](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L205)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:203](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L203)
>>>>>>> de5873b (chore: draft tests)

___

### AppClientCallParams

Ƭ **AppClientCallParams**: [`AppClientCallArgs`](types_app_client.md#appclientcallargs) & [`AppClientCallCoreParams`](../interfaces/types_app_client.AppClientCallCoreParams.md)

Parameters to construct a ApplicationClient contract call

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:217](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L217)
=======
[src/types/app-client.ts:204](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L204)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:218](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L218)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:216](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L216)
>>>>>>> de5873b (chore: draft tests)

___

### AppClientClearStateParams

Ƭ **AppClientClearStateParams**: [`AppClientCallRawArgs`](../interfaces/types_app_client.AppClientCallRawArgs.md) & [`AppClientCallCoreParams`](../interfaces/types_app_client.AppClientCallCoreParams.md)

Parameters to construct a ApplicationClient clear state contract call

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:220](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L220)
=======
[src/types/app-client.ts:207](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L207)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:221](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L221)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:219](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L219)
>>>>>>> de5873b (chore: draft tests)

___

### AppClientCreateOnComplete

Ƭ **AppClientCreateOnComplete**: `Object`

On-complete action parameter for creating a contract using ApplicationClient

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `onCompleteAction?` | `Exclude`\<[`AppCallType`](types_app.md#appcalltype), ``"clear_state"``\> \| `Exclude`\<`OnApplicationComplete`, `OnApplicationComplete.ClearStateOC`\> | Override the on-completion action for the create call; defaults to NoOp |

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:232](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L232)
=======
[src/types/app-client.ts:219](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L219)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:233](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L233)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:231](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L231)
>>>>>>> de5873b (chore: draft tests)

___

### AppClientCreateParams

Ƭ **AppClientCreateParams**: [`AppClientCallParams`](types_app_client.md#appclientcallparams) & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`AppClientCreateOnComplete`](types_app_client.md#appclientcreateoncomplete) & \{ `schema?`: `Partial`\<[`AppStorageSchema`](../interfaces/types_app.AppStorageSchema.md)\>  }

Parameters for creating a contract using ApplicationClient

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:238](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L238)
=======
[src/types/app-client.ts:225](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L225)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:239](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L239)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:237](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L237)
>>>>>>> de5873b (chore: draft tests)

___

### AppClientMethodCallParams

<<<<<<< HEAD
<<<<<<< HEAD
Ƭ **AppClientMethodCallParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`CommonAppCallParams`](types_composer.md#commonappcallparams), ``"appId"`` \| ``"sender"`` \| ``"method"`` \| ``"args"``\> & \{ `args?`: (`ABIValue` \| [`ABIStruct`](types_app_arc56.md#abistruct) \| [`AppMethodCallTransactionArgument`](types_composer.md#appmethodcalltransactionargument) \| `undefined`)[] ; `method`: `string` ; `sender?`: `string`  }\>
=======
Ƭ **AppClientMethodCallParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppMethodCall`](types_composer.md#appmethodcall)\<[`CommonAppCallParams`](types_composer.md#commonappcallparams)\>, ``"appId"`` \| ``"sender"`` \| ``"method"``\> & \{ `method`: `string` ; `sender?`: `string`  }\>
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
Ƭ **AppClientMethodCallParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`CommonAppCallParams`](types_composer.md#commonappcallparams), ``"appId"`` \| ``"sender"`` \| ``"method"`` \| ``"args"``\> & \{ `args?`: (`ABIValue` \| [`ABIStruct`](types_app_arc56.md#abistruct) \| [`AppMethodCallTransactionArgument`](types_composer.md#appmethodcalltransactionargument) \| `undefined`)[] ; `method`: `string` ; `sender?`: `string`  }\>
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

AppClient parameters for an ABI method call

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:345](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L345)
=======
[src/types/app-client.ts:326](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L326)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:332](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L332)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:346](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L346)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:344](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L344)
>>>>>>> de5873b (chore: draft tests)

___

### AppClientUpdateParams

Ƭ **AppClientUpdateParams**: [`AppClientCallParams`](types_app_client.md#appclientcallparams) & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)

Parameters for updating a contract using ApplicationClient

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:246](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L246)
=======
[src/types/app-client.ts:233](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L233)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:247](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L247)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:245](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L245)
>>>>>>> de5873b (chore: draft tests)

___

### AppDetails

Ƭ **AppDetails**: [`AppDetailsBase`](types_app_client.md#appdetailsbase) & [`ResolveAppById`](../interfaces/types_app_client.ResolveAppById.md) \| [`ResolveAppByCreatorAndName`](types_app_client.md#resolveappbycreatorandname)

The details of an AlgoKit Utils deployed app

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:133](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L133)
=======
[src/types/app-client.ts:120](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L120)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L134)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L132)
>>>>>>> de5873b (chore: draft tests)

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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:121](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L121)
=======
[src/types/app-client.ts:108](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L108)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:122](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L122)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:120](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L120)
>>>>>>> de5873b (chore: draft tests)

___

### AppSpecAppDetails

Ƭ **AppSpecAppDetails**: [`AppSpecAppDetailsBase`](types_app_client.md#appspecappdetailsbase) & [`AppDetails`](types_app_client.md#appdetails)

The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L151)
=======
[src/types/app-client.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L138)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:152](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L152)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:150](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L150)
>>>>>>> de5873b (chore: draft tests)

___

### AppSpecAppDetailsBase

Ƭ **AppSpecAppDetailsBase**: `Object`

The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `app` | [`AppSpec`](../interfaces/types_app_spec.AppSpec.md) \| `string` | The ARC-0032 application spec as either: * Parsed JSON `AppSpec` * Raw JSON string |

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L136)
=======
[src/types/app-client.ts:123](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L123)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:137](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L137)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L135)
>>>>>>> de5873b (chore: draft tests)

___

### AppSpecAppDetailsByCreatorAndName

Ƭ **AppSpecAppDetailsByCreatorAndName**: [`AppSpecAppDetailsBase`](types_app_client.md#appspecappdetailsbase) & [`AppDetailsBase`](types_app_client.md#appdetailsbase) & [`ResolveAppByCreatorAndNameBase`](types_app_client.md#resolveappbycreatorandnamebase)

The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app by creator and name

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:148](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L148)
=======
[src/types/app-client.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L135)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:149](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L149)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:147](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L147)
>>>>>>> de5873b (chore: draft tests)

___

### AppSpecAppDetailsById

Ƭ **AppSpecAppDetailsById**: [`AppSpecAppDetailsBase`](types_app_client.md#appspecappdetailsbase) & [`AppDetailsBase`](types_app_client.md#appdetailsbase) & [`ResolveAppByIdBase`](../interfaces/types_app_client.ResolveAppByIdBase.md)

The details of an ARC-0032 app spec specified, AlgoKit Utils deployed app by id

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:145](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L145)
=======
[src/types/app-client.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L132)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:146](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L146)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L144)
>>>>>>> de5873b (chore: draft tests)

___

### CallOnComplete

Ƭ **CallOnComplete**: `Object`

onComplete parameter for a non-update app call

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `onComplete?` | `Exclude`\<`OnApplicationComplete`, `OnApplicationComplete.UpdateApplicationOC`\> | On-complete of the call; defaults to no-op |

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:331](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L331)
=======
[src/types/app-client.ts:312](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L312)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:318](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L318)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:332](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L332)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:330](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L330)
>>>>>>> de5873b (chore: draft tests)

___

### FundAppParams

Ƭ **FundAppParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`PaymentParams`](types_composer.md#paymentparams), ``"receiver"`` \| ``"sender"``\> & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md) & \{ `sender?`: `string`  }\>

Parameters for funding an app account

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:369](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L369)
=======
[src/types/app-client.ts:341](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L341)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:347](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L347)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:370](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L370)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:368](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L368)
>>>>>>> de5873b (chore: draft tests)

___

### ResolveAppByCreatorAndName

Ƭ **ResolveAppByCreatorAndName**: [`ResolveAppByCreatorAndNameBase`](types_app_client.md#resolveappbycreatorandnamebase) & \{ `resolveBy`: ``"creatorAndName"``  }

Configuration to resolve app by creator and name `getCreatorAppsByName`

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:102](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L102)
=======
[src/types/app-client.ts:89](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L89)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:103](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L103)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:101](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L101)
>>>>>>> de5873b (chore: draft tests)

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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:89](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L89)
=======
[src/types/app-client.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L88)
>>>>>>> de5873b (chore: draft tests)

___

### ResolveAppClientByCreatorAndName

Ƭ **ResolveAppClientByCreatorAndName**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppClientParams`](../interfaces/types_app_client.AppClientParams.md), ``"appId"``\> & \{ `appLookupCache?`: [`AppLookup`](../interfaces/types_app_deployer.AppLookup.md) ; `creatorAddress`: `string` ; `ignoreCache?`: `boolean`  }\>

Resolve an app client instance by looking up an app created by the given creator with the given name

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:378](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L378)
=======
[src/types/app-client.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L76)
<<<<<<< HEAD
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
=======
[src/types/app-client.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L90)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### ResolveAppClientByCreatorAndName

Ƭ **ResolveAppClientByCreatorAndName**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppClientParams`](../interfaces/types_app_client.AppClientParams.md), ``"appId"``\> & \{ `appLookupCache?`: [`AppLookup`](../interfaces/types_app_deployer.AppLookup.md) ; `creatorAddress`: `string` ; `ignoreCache?`: `boolean`  }\>

Resolve an app client instance by looking up an app created by the given creator with the given name

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:356](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L356)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-client.ts:379](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L379)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:377](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L377)
>>>>>>> de5873b (chore: draft tests)
