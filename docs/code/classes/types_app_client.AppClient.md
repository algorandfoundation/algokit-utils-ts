[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / AppClient

# Class: AppClient

[types/app-client](../modules/types_app_client.md).AppClient

ARC-56/ARC-32 application client that allows you to manage calls and
state for a specific deployed instance of an app (with a known app ID).

## Table of contents

### Constructors

- [constructor](types_app_client.AppClient.md#constructor)

### Properties

- [\_algorand](types_app_client.AppClient.md#_algorand)
- [\_appAddress](types_app_client.AppClient.md#_appaddress)
- [\_appId](types_app_client.AppClient.md#_appid)
- [\_appName](types_app_client.AppClient.md#_appname)
- [\_appSpec](types_app_client.AppClient.md#_appspec)
- [\_approvalSourceMap](types_app_client.AppClient.md#_approvalsourcemap)
- [\_boxStateMethods](types_app_client.AppClient.md#_boxstatemethods)
- [\_clearSourceMap](types_app_client.AppClient.md#_clearsourcemap)
- [\_defaultSender](types_app_client.AppClient.md#_defaultsender)
- [\_globalStateMethods](types_app_client.AppClient.md#_globalstatemethods)
- [\_localStateMethods](types_app_client.AppClient.md#_localstatemethods)
- [\_paramsMethods](types_app_client.AppClient.md#_paramsmethods)
- [\_sendMethods](types_app_client.AppClient.md#_sendmethods)
- [\_transactionsMethods](types_app_client.AppClient.md#_transactionsmethods)

### Accessors

- [appAddress](types_app_client.AppClient.md#appaddress)
- [appId](types_app_client.AppClient.md#appid)
- [appName](types_app_client.AppClient.md#appname)
- [appSpec](types_app_client.AppClient.md#appspec)
- [params](types_app_client.AppClient.md#params)
- [send](types_app_client.AppClient.md#send)
- [state](types_app_client.AppClient.md#state)
- [transactions](types_app_client.AppClient.md#transactions)

### Methods

- [compile](types_app_client.AppClient.md#compile)
- [exportSourceMaps](types_app_client.AppClient.md#exportsourcemaps)
- [exposeLogicError](types_app_client.AppClient.md#exposelogicerror)
- [fundAppAccount](types_app_client.AppClient.md#fundappaccount)
- [getABIMethod](types_app_client.AppClient.md#getabimethod)
- [getABIParams](types_app_client.AppClient.md#getabiparams)
- [getBareParams](types_app_client.AppClient.md#getbareparams)
- [getBareParamsMethods](types_app_client.AppClient.md#getbareparamsmethods)
- [getBareSendMethods](types_app_client.AppClient.md#getbaresendmethods)
- [getBareTransactionsMethods](types_app_client.AppClient.md#getbaretransactionsmethods)
- [getBoxMethods](types_app_client.AppClient.md#getboxmethods)
- [getBoxNames](types_app_client.AppClient.md#getboxnames)
- [getBoxValue](types_app_client.AppClient.md#getboxvalue)
- [getBoxValueFromABIType](types_app_client.AppClient.md#getboxvaluefromabitype)
- [getBoxValues](types_app_client.AppClient.md#getboxvalues)
- [getBoxValuesFromABIType](types_app_client.AppClient.md#getboxvaluesfromabitype)
- [getGlobalState](types_app_client.AppClient.md#getglobalstate)
- [getLocalState](types_app_client.AppClient.md#getlocalstate)
- [getMethodCallParamsMethods](types_app_client.AppClient.md#getmethodcallparamsmethods)
- [getMethodCallSendMethods](types_app_client.AppClient.md#getmethodcallsendmethods)
- [getMethodCallTransactionsMethods](types_app_client.AppClient.md#getmethodcalltransactionsmethods)
- [getSender](types_app_client.AppClient.md#getsender)
- [getStateMethods](types_app_client.AppClient.md#getstatemethods)
- [handleCallErrors](types_app_client.AppClient.md#handlecallerrors)
- [importSourceMaps](types_app_client.AppClient.md#importsourcemaps)
- [newGroup](types_app_client.AppClient.md#newgroup)
- [parseMethodCallReturn](types_app_client.AppClient.md#parsemethodcallreturn)
- [compile](types_app_client.AppClient.md#compile-1)
- [exposeLogicError](types_app_client.AppClient.md#exposelogicerror-1)
- [fromCreatorAndName](types_app_client.AppClient.md#fromcreatorandname)
- [fromNetwork](types_app_client.AppClient.md#fromnetwork)
- [getABIArgsWithDefaultValues](types_app_client.AppClient.md#getabiargswithdefaultvalues)
- [normaliseAppSpec](types_app_client.AppClient.md#normaliseappspec)

## Constructors

### constructor

• **new AppClient**(`params`): [`AppClient`](types_app_client.AppClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AppClientParams`](../interfaces/types_app_client.AppClientParams.md) |

#### Returns

[`AppClient`](types_app_client.AppClient.md)

#### Defined in

[src/types/app-client.ts:418](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L418)

## Properties

### \_algorand

• `Private` **\_algorand**: [`AlgorandClientInterface`](../interfaces/types_algorand_client_interface.AlgorandClientInterface.md)

#### Defined in

[src/types/app-client.ts:398](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L398)

___

### \_appAddress

• `Private` **\_appAddress**: `string`

#### Defined in

[src/types/app-client.ts:395](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L395)

___

### \_appId

• `Private` **\_appId**: `bigint`

#### Defined in

[src/types/app-client.ts:394](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L394)

___

### \_appName

• `Private` **\_appName**: `string`

#### Defined in

[src/types/app-client.ts:396](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L396)

___

### \_appSpec

• `Private` **\_appSpec**: [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md)

#### Defined in

[src/types/app-client.ts:397](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L397)

___

### \_approvalSourceMap

• `Private` **\_approvalSourceMap**: `undefined` \| `SourceMap`

#### Defined in

[src/types/app-client.ts:401](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L401)

___

### \_boxStateMethods

• `Private` **\_boxStateMethods**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `getAll` | () => `Promise`\<`Record`\<`string`, `any`\>\> | - |
| `getMap` | (`mapName`: `string`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct), `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> | - |
| `getMapValue` | (`mapName`: `string`, `key`: `any`) => `Promise`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |
| `getValue` | (`name`: `string`) => `Promise`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |

#### Defined in

[src/types/app-client.ts:406](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L406)

___

### \_clearSourceMap

• `Private` **\_clearSourceMap**: `undefined` \| `SourceMap`

#### Defined in

[src/types/app-client.ts:402](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L402)

___

### \_defaultSender

• `Private` `Optional` **\_defaultSender**: `string`

#### Defined in

[src/types/app-client.ts:399](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L399)

___

### \_globalStateMethods

• `Private` **\_globalStateMethods**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `getAll` | () => `Promise`\<`Record`\<`string`, `any`\>\> | - |
| `getMap` | (`mapName`: `string`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct), `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> | - |
| `getMapValue` | (`mapName`: `string`, `key`: `any`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |
| `getValue` | (`name`: `string`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |

#### Defined in

[src/types/app-client.ts:405](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L405)

___

### \_localStateMethods

• `Private` **\_localStateMethods**: (`address`: `string`) => \{ `getAll`: () => `Promise`\<`Record`\<`string`, `any`\>\> ; `getMap`: (`mapName`: `string`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct), `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `getMapValue`: (`mapName`: `string`, `key`: `any`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> ; `getValue`: (`name`: `string`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>  }

#### Type declaration

▸ (`address`): `Object`

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

##### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `getAll` | () => `Promise`\<`Record`\<`string`, `any`\>\> | - |
| `getMap` | (`mapName`: `string`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct), `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> | - |
| `getMapValue` | (`mapName`: `string`, `key`: `any`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |
| `getValue` | (`name`: `string`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |

#### Defined in

[src/types/app-client.ts:404](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L404)

___

### \_paramsMethods

• `Private` **\_paramsMethods**: \{ `call`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) ; `closeOut`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) ; `delete`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppDeleteMethodCall`](../modules/types_composer.md#appdeletemethodcall) ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  }) => \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `receiver`: `string` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  } ; `optIn`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) ; `update`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Buffer` ; `args?`: ABIValue \| AppMethodCallTransactionArgument \| ABIStruct \| undefined[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `Buffer` ; `compiledApproval`: `undefined` ; `compiledClear`: `undefined` ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: OnApplicationComplete \| undefined ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number`  } \| \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` = compiledApproval.compiledBase64ToBytes; `args?`: ABIValue \| AppMethodCallTransactionArgument \| ABIStruct \| undefined[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `Uint8Array` = compiledClear.compiledBase64ToBytes; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: OnApplicationComplete \| undefined ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number`  } & \{ `appId`: `bigint` ; `args`: `undefined` \| Transaction \| ABIValue \| TransactionWithSigner \| Promise\<Transaction\> \| AppMethodCall\<\{ lease?: string \| Uint8Array \| undefined; ... 19 more ...; extraProgramPages?: number \| undefined; }\> \| AppMethodCall\<...\> \| AppMethodCall\<...\>[] ; `method`: [`Arc56Method`](types_app_arc56.Arc56Method.md) ; `onComplete`: `UpdateApplicationOC` ; `sender`: `string`  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `clearState`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `closeOut`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `delete`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppDeleteParams`](../modules/types_composer.md#appdeleteparams) ; `optIn`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `update`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accountReferences?`: `string`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\>  }  }

#### Defined in

[src/types/app-client.ts:408](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L408)

___

### \_sendMethods

• `Private` **\_sendMethods**: \{ `call`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `closeOut`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `delete`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `optIn`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `update`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `clearState`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `closeOut`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `delete`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `optIn`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `update`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>  }  }

#### Defined in

[src/types/app-client.ts:414](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L414)

___

### \_transactionsMethods

• `Private` **\_transactionsMethods**: \{ `call`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `closeOut`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `delete`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> ; `optIn`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `update`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<`Transaction`\> ; `clearState`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> ; `closeOut`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> ; `delete`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> ; `optIn`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> ; `update`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<`Transaction`\>  }  }

#### Defined in

[src/types/app-client.ts:411](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L411)

## Accessors

### appAddress

• `get` **appAddress**(): `string`

The app address of the app instance this client is linked to.

#### Returns

`string`

#### Defined in

[src/types/app-client.ts:518](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L518)

___

### appId

• `get` **appId**(): `bigint`

The ID of the app instance this client is linked to.

#### Returns

`bigint`

#### Defined in

[src/types/app-client.ts:513](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L513)

___

### appName

• `get` **appName**(): `string`

The name of the app (from the ARC-32 / ARC-56 app spec).

#### Returns

`string`

#### Defined in

[src/types/app-client.ts:523](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L523)

___

### appSpec

• `get` **appSpec**(): [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md)

The ARC-56 app spec being used

#### Returns

[`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md)

#### Defined in

[src/types/app-client.ts:528](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L528)

___

### params

• `get` **params**(): \{ `call`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) ; `closeOut`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) ; `delete`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppDeleteMethodCall`](../modules/types_composer.md#appdeletemethodcall) ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  }) => \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `receiver`: `string` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  } ; `optIn`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) ; `update`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Buffer` ; `args?`: ABIValue \| AppMethodCallTransactionArgument \| ABIStruct \| undefined[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `Buffer` ; `compiledApproval`: `undefined` ; `compiledClear`: `undefined` ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: OnApplicationComplete \| undefined ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number`  } \| \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` = compiledApproval.compiledBase64ToBytes; `args?`: ABIValue \| AppMethodCallTransactionArgument \| ABIStruct \| undefined[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `Uint8Array` = compiledClear.compiledBase64ToBytes; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: OnApplicationComplete \| undefined ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number`  } & \{ `appId`: `bigint` ; `args`: `undefined` \| Transaction \| ABIValue \| TransactionWithSigner \| Promise\<Transaction\> \| AppMethodCall\<\{ lease?: string \| Uint8Array \| undefined; ... 19 more ...; extraProgramPages?: number \| undefined; }\> \| AppMethodCall\<...\> \| AppMethodCall\<...\>[] ; `method`: [`Arc56Method`](types_app_arc56.Arc56Method.md) ; `onComplete`: `UpdateApplicationOC` ; `sender`: `string`  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `clearState`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `closeOut`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `delete`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppDeleteParams`](../modules/types_composer.md#appdeleteparams) ; `optIn`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `update`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accountReferences?`: `string`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\>  }  }

Get parameters to define transactions to the current app

#### Returns

\{ `call`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) ; `closeOut`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) ; `delete`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppDeleteMethodCall`](../modules/types_composer.md#appdeletemethodcall) ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  }) => \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `receiver`: `string` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  } ; `optIn`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) ; `update`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Buffer` ; `args?`: ABIValue \| AppMethodCallTransactionArgument \| ABIStruct \| undefined[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `Buffer` ; `compiledApproval`: `undefined` ; `compiledClear`: `undefined` ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: OnApplicationComplete \| undefined ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number`  } \| \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` = compiledApproval.compiledBase64ToBytes; `args?`: ABIValue \| AppMethodCallTransactionArgument \| ABIStruct \| undefined[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `Uint8Array` = compiledClear.compiledBase64ToBytes; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: OnApplicationComplete \| undefined ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number`  } & \{ `appId`: `bigint` ; `args`: `undefined` \| Transaction \| ABIValue \| TransactionWithSigner \| Promise\<Transaction\> \| AppMethodCall\<\{ lease?: string \| Uint8Array \| undefined; ... 19 more ...; extraProgramPages?: number \| undefined; }\> \| AppMethodCall\<...\> \| AppMethodCall\<...\>[] ; `method`: [`Arc56Method`](types_app_arc56.Arc56Method.md) ; `onComplete`: `UpdateApplicationOC` ; `sender`: `string`  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `clearState`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `closeOut`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `delete`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppDeleteParams`](../modules/types_composer.md#appdeleteparams) ; `optIn`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `update`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accountReferences?`: `string`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\>  }  }

#### Defined in

[src/types/app-client.ts:533](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L533)

___

### send

• `get` **send**(): \{ `call`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `closeOut`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `delete`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `optIn`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `update`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `clearState`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `closeOut`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `delete`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `optIn`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `update`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>  }  }

Send calls to the current app

#### Returns

\{ `call`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `closeOut`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `delete`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `optIn`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `update`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `clearState`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `closeOut`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `delete`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `optIn`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `update`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>  }  }

#### Defined in

[src/types/app-client.ts:543](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L543)

___

### state

• `get` **state**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `box` | \{ `getAll`: () => `Promise`\<`Record`\<`string`, `any`\>\> ; `getMap`: (`mapName`: `string`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct), `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `getMapValue`: (`mapName`: `string`, `key`: `any`) => `Promise`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> ; `getValue`: (`name`: `string`) => `Promise`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>  } | Methods to access box storage for the current app |
| `box.getAll` | () => `Promise`\<`Record`\<`string`, `any`\>\> | - |
| `box.getMap` | (`mapName`: `string`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct), `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> | - |
| `box.getMapValue` | (`mapName`: `string`, `key`: `any`) => `Promise`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |
| `box.getValue` | (`name`: `string`) => `Promise`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |
| `global` | \{ `getAll`: () => `Promise`\<`Record`\<`string`, `any`\>\> ; `getMap`: (`mapName`: `string`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct), `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `getMapValue`: (`mapName`: `string`, `key`: `any`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> ; `getValue`: (`name`: `string`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>  } | Methods to access global state for the current app |
| `global.getAll` | () => `Promise`\<`Record`\<`string`, `any`\>\> | - |
| `global.getMap` | (`mapName`: `string`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct), `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> | - |
| `global.getMapValue` | (`mapName`: `string`, `key`: `any`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |
| `global.getValue` | (`name`: `string`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |
| `local` | (`address`: `string`) => \{ `getAll`: () => `Promise`\<`Record`\<`string`, `any`\>\> ; `getMap`: (`mapName`: `string`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct), `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `getMapValue`: (`mapName`: `string`, `key`: `any`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> ; `getValue`: (`name`: `string`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>  } | - |

#### Defined in

[src/types/app-client.ts:547](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L547)

___

### transactions

• `get` **transactions**(): \{ `call`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `closeOut`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `delete`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> ; `optIn`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `update`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<`Transaction`\> ; `clearState`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> ; `closeOut`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> ; `delete`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> ; `optIn`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> ; `update`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<`Transaction`\>  }  }

Get transactions for the current app

#### Returns

\{ `call`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `closeOut`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `delete`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> ; `optIn`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `update`: (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<`Transaction`\> ; `clearState`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> ; `closeOut`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> ; `delete`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> ; `optIn`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> ; `update`: (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<`Transaction`\>  }  }

#### Defined in

[src/types/app-client.ts:538](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L538)

## Methods

### compile

▸ **compile**(`compilation?`): `Promise`\<\{ `approvalProgram`: `Buffer` ; `clearStateProgram`: `Buffer` ; `compiledApproval`: `undefined` ; `compiledClear`: `undefined`  } \| \{ `approvalProgram`: `Uint8Array` = compiledApproval.compiledBase64ToBytes; `clearStateProgram`: `Uint8Array` = compiledClear.compiledBase64ToBytes; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)  }\>

Compiles the approval and clear state programs (if TEAL templates provided),
performing any provided deploy-time parameter replacement and stores
the source maps.

If no TEAL templates provided it will use any byte code provided in the app spec.

Will store any generated source maps for later use in debugging.

#### Parameters

| Name | Type |
| :------ | :------ |
| `compilation?` | [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) |

#### Returns

`Promise`\<\{ `approvalProgram`: `Buffer` ; `clearStateProgram`: `Buffer` ; `compiledApproval`: `undefined` ; `compiledClear`: `undefined`  } \| \{ `approvalProgram`: `Uint8Array` = compiledApproval.compiledBase64ToBytes; `clearStateProgram`: `Uint8Array` = compiledClear.compiledBase64ToBytes; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)  }\>

#### Defined in

[src/types/app-client.ts:1123](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1123)

___

### exportSourceMaps

▸ **exportSourceMaps**(): [`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

Export the current source maps for the app.

#### Returns

[`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

The source maps

#### Defined in

[src/types/app-client.ts:673](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L673)

___

### exposeLogicError

▸ **exposeLogicError**(`e`, `isClearStateProgram?`): `Error`

Takes an error that may include a logic error from a call to the current app and re-exposes the
error to include source code information via the source map and ARC-56 spec.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `e` | `Error` | The error to parse |
| `isClearStateProgram?` | `boolean` | Whether or not the code was running the clear state program (defaults to approval program) |

#### Returns

`Error`

The new error, or if there was no logic error or source map then the wrapped error with source details

#### Defined in

[src/types/app-client.ts:661](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L661)

___

### fundAppAccount

▸ **fundAppAccount**(`params`): `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>

Funds Algo into the app account for this app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters for the funding transaction |
| `params.amount` | [`AlgoAmount`](types_amount.AlgoAmount.md) | Amount to send |
| `params.closeRemainderTo?` | `string` | If given, close the sender account and send the remaining balance to this address *Warning:* Be careful with this parameter as it can lead to loss of funds if not used correctly. |
| `params.extraFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for covering inner transaction fees. |
| `params.firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. We recommend you only set this when you intentionally want this to be some time in the future. |
| `params.lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use `validityWindow` instead. |
| `params.lease?` | `string` \| `Uint8Array` | Prevent multiple transactions with the same lease being included within the validity window. A [lease](https://developer.algorand.org/articles/leased-transactions-securing-advanced-smart-contract-design/) enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios). |
| `params.maxFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. |
| `params.maxRoundsToWaitForConfirmation?` | `number` | The number of rounds to wait for confirmation. By default until the latest lastValid has past. |
| `params.note?` | `string` \| `Uint8Array` | Note to attach to the transaction. Max of 1000 bytes. |
| `params.populateAppCallResources?` | `boolean` | Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`. |
| `params.rekeyTo?` | `string` | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://developer.algorand.org/docs/get-details/accounts/rekey/). |
| `params.sender?` | `string` | The optional sender to send the transaction from, will use the application client's default sender by default if specified |
| `params.signer?` | `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.suppressLog?` | `boolean` | Whether to suppress log messages from transaction send, default: do not suppress. |
| `params.validityWindow?` | `number` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

#### Returns

`Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>

The result of the funding

#### Defined in

[src/types/app-client.ts:570](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L570)

___

### getABIMethod

▸ **getABIMethod**(`methodNameOrSignature`): [`Arc56Method`](types_app_arc56.Arc56Method.md)

Returns the ABI Method for the given method name string for the app represented by this application client instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `methodNameOrSignature` | `string` | The method name or method signature to call if an ABI call is being emitted. e.g. `my_method` or `my_method(unit64,string)bytes` |

#### Returns

[`Arc56Method`](types_app_arc56.Arc56Method.md)

A tuple with: [ARC-56 `Method`, algosdk `ABIMethod`]

#### Defined in

[src/types/app-client.ts:701](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L701)

___

### getABIParams

▸ **getABIParams**\<`TParams`, `TOnComplete`\>(`params`, `onComplete`): `TParams` & \{ `appId`: `bigint` ; `args`: `undefined` \| (`Transaction` \| `ABIValue` \| `TransactionWithSigner` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC` ; `rekeyTo?`: `string` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accountReferences?`: `string`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: [`Arc56Method`](types_app_arc56.Arc56Method.md) ; `onComplete`: `TOnComplete` ; `sender`: `string`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `Object` |
| `TOnComplete` | extends `OnApplicationComplete` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `TParams` |
| `onComplete` | `TOnComplete` |

#### Returns

`TParams` & \{ `appId`: `bigint` ; `args`: `undefined` \| (`Transaction` \| `ABIValue` \| `TransactionWithSigner` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC` ; `rekeyTo?`: `string` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accountReferences?`: `string`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: [`Arc56Method`](types_app_arc56.Arc56Method.md) ; `onComplete`: `TOnComplete` ; `sender`: `string`  }

#### Defined in

[src/types/app-client.ts:1157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1157)

___

### getBareParams

▸ **getBareParams**\<`TParams`, `TOnComplete`\>(`params`, `onComplete`): `TParams` & \{ `appId`: `bigint` ; `onComplete`: `TOnComplete` ; `sender`: `string`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `undefined` \| \{ `sender?`: `string`  } |
| `TOnComplete` | extends `OnApplicationComplete` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `TParams` |
| `onComplete` | `TOnComplete` |

#### Returns

`TParams` & \{ `appId`: `bigint` ; `onComplete`: `TOnComplete` ; `sender`: `string`  }

#### Defined in

[src/types/app-client.ts:1145](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1145)

___

### getBareParamsMethods

▸ **getBareParamsMethods**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => [`AppCallParams`](../modules/types_composer.md#appcallparams) | - |
| `clearState` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) | - |
| `closeOut` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) | - |
| `delete` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppDeleteParams`](../modules/types_composer.md#appdeleteparams) | - |
| `optIn` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) | - |
| `update` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accountReferences?`: `string`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\> | - |

#### Defined in

[src/types/app-client.ts:857](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L857)

___

### getBareSendMethods

▸ **getBareSendMethods**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `clearState` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `closeOut` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `delete` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `optIn` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `update` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |

#### Defined in

[src/types/app-client.ts:921](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L921)

___

### getBareTransactionsMethods

▸ **getBareTransactionsMethods**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<`Transaction`\> | - |
| `clearState` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> | - |
| `closeOut` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> | - |
| `delete` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> | - |
| `optIn` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> | - |
| `update` | (`params?`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<`Transaction`\> | - |

#### Defined in

[src/types/app-client.ts:892](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L892)

___

### getBoxMethods

▸ **getBoxMethods**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `getAll` | () => `Promise`\<`Record`\<`string`, `any`\>\> | - |
| `getMap` | (`mapName`: `string`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct), `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> | - |
| `getMapValue` | (`mapName`: `string`, `key`: `any`) => `Promise`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |
| `getValue` | (`name`: `string`) => `Promise`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |

#### Defined in

[src/types/app-client.ts:1182](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1182)

___

### getBoxNames

▸ **getBoxNames**(): `Promise`\<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

Returns the names of all current boxes for the current app.

#### Returns

`Promise`\<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

The names of the boxes

#### Defined in

[src/types/app-client.ts:595](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L595)

___

### getBoxValue

▸ **getBoxValue**(`name`): `Promise`\<`Uint8Array`\>

Returns the value of the given box for the current app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | [`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) | The identifier of the box to return |

#### Returns

`Promise`\<`Uint8Array`\>

The current box value as a byte array

#### Defined in

[src/types/app-client.ts:604](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L604)

___

### getBoxValueFromABIType

▸ **getBoxValueFromABIType**(`name`, `type`): `Promise`\<`ABIValue`\>

Returns the value of the given box for the current app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | [`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) | The identifier of the box to return |
| `type` | `ABIType` |  |

#### Returns

`Promise`\<`ABIValue`\>

The current box value as a byte array

#### Defined in

[src/types/app-client.ts:614](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L614)

___

### getBoxValues

▸ **getBoxValues**(`filter?`): `Promise`\<\{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `Uint8Array`  }[]\>

Returns the values of all current boxes for the current app.
Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filter?` | (`name`: [`BoxName`](../interfaces/types_app.BoxName.md)) => `boolean` | Optional filter to filter which boxes' values are returned |

#### Returns

`Promise`\<\{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `Uint8Array`  }[]\>

The (name, value) pair of the boxes with values as raw byte arrays

#### Defined in

[src/types/app-client.ts:628](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L628)

___

### getBoxValuesFromABIType

▸ **getBoxValuesFromABIType**(`type`, `filter?`): `Promise`\<\{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `ABIValue`  }[]\>

Returns the values of all current boxes for the current app decoded using an ABI Type.
Note: This will issue multiple HTTP requests (one per box) and it's not an atomic operation so values may be out of sync.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `ABIType` | The ABI type to decode the values with |
| `filter?` | (`name`: [`BoxName`](../interfaces/types_app.BoxName.md)) => `boolean` | Optional filter to filter which boxes' values are returned |

#### Returns

`Promise`\<\{ `name`: [`BoxName`](../interfaces/types_app.BoxName.md) ; `value`: `ABIValue`  }[]\>

The (name, value) pair of the boxes with values as the ABI Value

#### Defined in

[src/types/app-client.ts:644](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L644)

___

### getGlobalState

▸ **getGlobalState**(): `Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns raw global state for the current app.

#### Returns

`Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

The global state

#### Defined in

[src/types/app-client.ts:578](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L578)

___

### getLocalState

▸ **getLocalState**(`address`): `Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns raw local state for the given account address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address of the account to get the local state for |

#### Returns

`Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

The local state

#### Defined in

[src/types/app-client.ts:587](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L587)

___

### getMethodCallParamsMethods

▸ **getMethodCallParamsMethods**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) | - |
| `closeOut` | (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) | - |
| `delete` | (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppDeleteMethodCall`](../modules/types_composer.md#appdeletemethodcall) | - |
| `fundAppAccount` | (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  }) => \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `receiver`: `string` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  } | - |
| `optIn` | (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) | - |
| `update` | (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Buffer` ; `args?`: ABIValue \| AppMethodCallTransactionArgument \| ABIStruct \| undefined[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `Buffer` ; `compiledApproval`: `undefined` ; `compiledClear`: `undefined` ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: OnApplicationComplete \| undefined ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number`  } \| \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` = compiledApproval.compiledBase64ToBytes; `args?`: ABIValue \| AppMethodCallTransactionArgument \| ABIStruct \| undefined[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `Uint8Array` = compiledClear.compiledBase64ToBytes; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: OnApplicationComplete \| undefined ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number`  } & \{ `appId`: `bigint` ; `args`: `undefined` \| Transaction \| ABIValue \| TransactionWithSigner \| Promise\<Transaction\> \| AppMethodCall\<\{ lease?: string \| Uint8Array \| undefined; ... 19 more ...; extraProgramPages?: number \| undefined; }\> \| AppMethodCall\<...\> \| AppMethodCall\<...\>[] ; `method`: [`Arc56Method`](types_app_arc56.Arc56Method.md) ; `onComplete`: `UpdateApplicationOC` ; `sender`: `string`  }\> | - |

#### Defined in

[src/types/app-client.ts:950](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L950)

___

### getMethodCallSendMethods

▸ **getMethodCallSendMethods**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `closeOut` | (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `delete` | (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `fundAppAccount` | (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `optIn` | (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `update` | (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |

#### Defined in

[src/types/app-client.ts:989](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L989)

___

### getMethodCallTransactionsMethods

▸ **getMethodCallTransactionsMethods**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> | - |
| `closeOut` | (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> | - |
| `delete` | (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> | - |
| `fundAppAccount` | (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number`  }) => `Promise`\<`Transaction`\> | - |
| `optIn` | (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> | - |
| `update` | (`params`: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` ; `sender?`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> | - |

#### Defined in

[src/types/app-client.ts:1075](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1075)

___

### getSender

▸ **getSender**(`sender`): `string`

Returns the sender for a call, using the `defaultSender`
if none provided and throws an error if neither provided

#### Parameters

| Name | Type |
| :------ | :------ |
| `sender` | `undefined` \| `string` |

#### Returns

`string`

#### Defined in

[src/types/app-client.ts:1138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1138)

___

### getStateMethods

▸ **getStateMethods**(`stateGetter`, `keyGetter`, `mapGetter`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateGetter` | () => `Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\> |
| `keyGetter` | () => \{ `[name: string]`: [`StorageKey`](../interfaces/types_app_arc56.StorageKey.md);  } |
| `mapGetter` | () => \{ `[name: string]`: [`StorageMap`](../interfaces/types_app_arc56.StorageMap.md);  } |

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `getAll` | () => `Promise`\<`Record`\<`string`, `any`\>\> | - |
| `getMap` | (`mapName`: `string`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct), `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> | - |
| `getMapValue` | (`mapName`: `string`, `key`: `any`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |
| `getValue` | (`name`: `string`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |

#### Defined in

[src/types/app-client.ts:1254](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1254)

___

### handleCallErrors

▸ **handleCallErrors**\<`TResult`\>(`call`): `Promise`\<`TResult`\>

Make the given call and catch any errors, augmenting with debugging information before re-throwing.

#### Type parameters

| Name |
| :------ |
| `TResult` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `call` | () => `Promise`\<`TResult`\> |

#### Returns

`Promise`\<`TResult`\>

#### Defined in

[src/types/app-client.ts:1174](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1174)

___

### importSourceMaps

▸ **importSourceMaps**(`sourceMaps`): `void`

Import source maps for the app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sourceMaps` | [`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md) | The source maps to import |

#### Returns

`void`

#### Defined in

[src/types/app-client.ts:690](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L690)

___

### newGroup

▸ **newGroup**(): [`default`](types_composer.default.md)

Start a new `AlgoKitComposer` transaction group

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/app-client.ts:451](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L451)

___

### parseMethodCallReturn

▸ **parseMethodCallReturn**\<`TReturn`, `TResult`\>(`result`, `method`): `Promise`\<[`Expand`](../modules/types_expand.md#expand)\<`Omit`\<`TResult`, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`TReturn`\>\>\>

Checks for decode errors on the SendAppTransactionResult and maps the return value to the specified type
on the ARC-56 method.

If the return type is a struct then the struct will be returned.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TReturn` | extends `undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) |
| `TResult` | extends `Object` = \{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `result` | `TResult` \| `Promise`\<`TResult`\> | The SendAppTransactionResult to be mapped |
| `method` | [`Arc56Method`](types_app_arc56.Arc56Method.md) | The method that was called |

#### Returns

`Promise`\<[`Expand`](../modules/types_expand.md#expand)\<`Omit`\<`TResult`, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`TReturn`\>\>\>

The smart contract response with an updated return value

#### Defined in

[src/types/app-client.ts:715](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L715)

___

### compile

▸ **compile**(`appSpec`, `appManager`, `compilation?`): `Promise`\<\{ `approvalProgram`: `Buffer` ; `clearStateProgram`: `Buffer` ; `compiledApproval`: `undefined` ; `compiledClear`: `undefined`  } \| \{ `approvalProgram`: `Uint8Array` = compiledApproval.compiledBase64ToBytes; `clearStateProgram`: `Uint8Array` = compiledClear.compiledBase64ToBytes; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)  }\>

Compiles the approval and clear state programs (if TEAL templates provided),
performing any provided deploy-time parameter replacement and returns
the compiled code and any compilation results (including source maps).

If no TEAL templates provided it will use any byte code provided in the app spec.

Will store any generated source maps for later use in debugging.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appSpec` | [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md) | The app spec for the app |
| `appManager` | [`AppManager`](types_app_manager.AppManager.md) | - |
| `compilation?` | [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) | Any compilation parameters to use |

#### Returns

`Promise`\<\{ `approvalProgram`: `Buffer` ; `clearStateProgram`: `Buffer` ; `compiledApproval`: `undefined` ; `compiledClear`: `undefined`  } \| \{ `approvalProgram`: `Uint8Array` = compiledApproval.compiledBase64ToBytes; `clearStateProgram`: `Uint8Array` = compiledClear.compiledBase64ToBytes; `compiledApproval`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)  }\>

#### Defined in

[src/types/app-client.ts:783](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L783)

___

### exposeLogicError

▸ **exposeLogicError**(`e`, `appSpec`, `details`): `Error`

Takes an error that may include a logic error from a call to the current app and re-exposes the
error to include source code information via the source map and ARC-56 spec.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `e` | `Error` | The error to parse |
| `appSpec` | [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md) | The app spec for the app |
| `details` | `Object` | Additional information to inform the error |
| `details.approvalSourceMap?` | `SourceMap` | Approval program source map |
| `details.clearSourceMap?` | `SourceMap` | Clear state program source map |
| `details.isClearStateProgram?` | `boolean` | Whether or not the code was running the clear state program (defaults to approval program) |

#### Returns

`Error`

The new error, or if there was no logic error or source map then the wrapped error with source details

#### Defined in

[src/types/app-client.ts:733](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L733)

___

### fromCreatorAndName

▸ **fromCreatorAndName**(`params`): `Promise`\<[`AppClient`](types_app_client.AppClient.md)\>

Returns a new `AppClient` client, resolving the app by creator address and name
using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters to create the app client |
| `params.algorand` | [`AlgorandClientInterface`](../interfaces/types_algorand_client_interface.AlgorandClientInterface.md) | An `AlgorandClient` instance |
| `params.appLookupCache?` | [`AppLookup`](../interfaces/types_app_deployer.AppLookup.md) | An optional cached app lookup that matches a name to on-chain details; either this is needed or indexer is required to be passed in to this `ClientManager` on construction. |
| `params.appName?` | `string` | Optional override for the app name; used for on-chain metadata and lookups. Defaults to the ARC-32/ARC-56 app spec name |
| `params.appSpec` | `string` \| [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md) \| [`AppSpec`](../interfaces/types_app_spec.AppSpec.md) | The ARC-56 or ARC-32 application spec as either: * Parsed JSON ARC-56 `Contract` * Parsed JSON ARC-32 `AppSpec` * Raw JSON string (in either ARC-56 or ARC-32 format) |
| `params.approvalSourceMap?` | `SourceMap` | Optional source map for the approval program |
| `params.clearSourceMap?` | `SourceMap` | Optional source map for the clear state program |
| `params.creatorAddress` | `string` | The address of the creator account for the app |
| `params.defaultSender?` | `string` | Optional address to use for the account to use as the default sender for calls. |
| `params.ignoreCache?` | `boolean` | Whether or not to ignore the `AppDeployer` lookup cache and force an on-chain lookup, default: use any cached value |

#### Returns

`Promise`\<[`AppClient`](types_app_client.AppClient.md)\>

#### Defined in

[src/types/app-client.ts:460](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L460)

___

### fromNetwork

▸ **fromNetwork**(`params`): `Promise`\<[`AppClient`](types_app_client.AppClient.md)\>

Returns an `AppClient` instance for the current network based on
pre-determined network-specific app IDs specified in the ARC-56 app spec.

If no IDs are in the app spec or the network isn't recognised, an error is thrown.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters to create the app client |
| `params.algorand` | [`AlgorandClientInterface`](../interfaces/types_algorand_client_interface.AlgorandClientInterface.md) | An `AlgorandClient` instance |
| `params.appName?` | `string` | Optional override for the app name; used for on-chain metadata and lookups. Defaults to the ARC-32/ARC-56 app spec name |
| `params.appSpec` | `string` \| [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md) \| [`AppSpec`](../interfaces/types_app_spec.AppSpec.md) | The ARC-56 or ARC-32 application spec as either: * Parsed JSON ARC-56 `Contract` * Parsed JSON ARC-32 `AppSpec` * Raw JSON string (in either ARC-56 or ARC-32 format) |
| `params.approvalSourceMap?` | `SourceMap` | Optional source map for the approval program |
| `params.clearSourceMap?` | `SourceMap` | Optional source map for the clear state program |
| `params.defaultSender?` | `string` | Optional address to use for the account to use as the default sender for calls. |

#### Returns

`Promise`\<[`AppClient`](types_app_client.AppClient.md)\>

#### Defined in

[src/types/app-client.ts:482](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L482)

___

### getABIArgsWithDefaultValues

▸ **getABIArgsWithDefaultValues**(`methodNameOrSignature`, `args`, `appSpec`): `undefined` \| (`Transaction` \| `ABIValue` \| `TransactionWithSigner` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC` ; `rekeyTo?`: `string` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accountReferences?`: `string`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[]

Returns ABI method arguments ready for a method call params object with default values populated
and structs replaced with tuples.

It does this by replacing any `undefined` values with the equivalent default value from the given ARC-56 app spec.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `methodNameOrSignature` | `string` | The method name or method signature to call if an ABI call is being emitted. e.g. `my_method` or `my_method(unit64,string)bytes` |
| `args` | `undefined` \| (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] | The arguments to the method with `undefined` for any that should be populated with a default value |
| `appSpec` | [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md) | The app spec for the app |

#### Returns

`undefined` \| (`Transaction` \| `ABIValue` \| `TransactionWithSigner` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC` ; `rekeyTo?`: `string` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accountReferences?`: `string`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[]

#### Defined in

[src/types/app-client.ts:836](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L836)

___

### normaliseAppSpec

▸ **normaliseAppSpec**(`spec`): [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md)

Takes a string or parsed JSON object that could be ARC-32 or ARC-56 format and
normalises it into a parsed ARC-56 contract object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `spec` | `string` \| [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md) \| [`AppSpec`](../interfaces/types_app_spec.AppSpec.md) | The spec to normalise |

#### Returns

[`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md)

The normalised ARC-56 contract object

#### Defined in

[src/types/app-client.ts:506](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L506)
