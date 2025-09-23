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
- [\_createTransactionsMethods](types_app_client.AppClient.md#_createtransactionsmethods)
- [\_defaultSender](types_app_client.AppClient.md#_defaultsender)
- [\_defaultSigner](types_app_client.AppClient.md#_defaultsigner)
- [\_globalStateMethods](types_app_client.AppClient.md#_globalstatemethods)
- [\_lastCompiled](types_app_client.AppClient.md#_lastcompiled)
- [\_localStateMethods](types_app_client.AppClient.md#_localstatemethods)
- [\_paramsMethods](types_app_client.AppClient.md#_paramsmethods)
- [\_sendMethods](types_app_client.AppClient.md#_sendmethods)

### Accessors

- [algorand](types_app_client.AppClient.md#algorand)
- [appAddress](types_app_client.AppClient.md#appaddress)
- [appId](types_app_client.AppClient.md#appid)
- [appName](types_app_client.AppClient.md#appname)
- [appSpec](types_app_client.AppClient.md#appspec)
- [createTransaction](types_app_client.AppClient.md#createtransaction)
- [params](types_app_client.AppClient.md#params)
- [send](types_app_client.AppClient.md#send)
- [state](types_app_client.AppClient.md#state)

### Methods

- [clone](types_app_client.AppClient.md#clone)
- [compile](types_app_client.AppClient.md#compile)
- [exportSourceMaps](types_app_client.AppClient.md#exportsourcemaps)
- [exposeLogicError](types_app_client.AppClient.md#exposelogicerror)
- [fundAppAccount](types_app_client.AppClient.md#fundappaccount)
- [getABIArgsWithDefaultValues](types_app_client.AppClient.md#getabiargswithdefaultvalues)
- [getABIMethod](types_app_client.AppClient.md#getabimethod)
- [getABIParams](types_app_client.AppClient.md#getabiparams)
- [getBareCreateTransactionMethods](types_app_client.AppClient.md#getbarecreatetransactionmethods)
- [getBareParams](types_app_client.AppClient.md#getbareparams)
- [getBareParamsMethods](types_app_client.AppClient.md#getbareparamsmethods)
- [getBareSendMethods](types_app_client.AppClient.md#getbaresendmethods)
- [getBoxMethods](types_app_client.AppClient.md#getboxmethods)
- [getBoxNames](types_app_client.AppClient.md#getboxnames)
- [getBoxValue](types_app_client.AppClient.md#getboxvalue)
- [getBoxValueFromABIType](types_app_client.AppClient.md#getboxvaluefromabitype)
- [getBoxValues](types_app_client.AppClient.md#getboxvalues)
- [getBoxValuesFromABIType](types_app_client.AppClient.md#getboxvaluesfromabitype)
- [getGlobalState](types_app_client.AppClient.md#getglobalstate)
- [getLocalState](types_app_client.AppClient.md#getlocalstate)
- [getMethodCallCreateTransactionMethods](types_app_client.AppClient.md#getmethodcallcreatetransactionmethods)
- [getMethodCallParamsMethods](types_app_client.AppClient.md#getmethodcallparamsmethods)
- [getMethodCallSendMethods](types_app_client.AppClient.md#getmethodcallsendmethods)
- [getSender](types_app_client.AppClient.md#getsender)
- [getSigner](types_app_client.AppClient.md#getsigner)
- [getStateMethods](types_app_client.AppClient.md#getstatemethods)
- [handleCallErrors](types_app_client.AppClient.md#handlecallerrors)
- [importSourceMaps](types_app_client.AppClient.md#importsourcemaps)
- [processMethodCallReturn](types_app_client.AppClient.md#processmethodcallreturn)
- [compile](types_app_client.AppClient.md#compile-1)
- [exposeLogicError](types_app_client.AppClient.md#exposelogicerror-1)
- [fromCreatorAndName](types_app_client.AppClient.md#fromcreatorandname)
- [fromNetwork](types_app_client.AppClient.md#fromnetwork)
- [normaliseAppSpec](types_app_client.AppClient.md#normaliseappspec)

## Constructors

### constructor

• **new AppClient**(`params`): [`AppClient`](types_app_client.AppClient.md)

Create a new app client.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppClientParams`](../interfaces/types_app_client.AppClientParams.md) | The parameters to create the app client |

#### Returns

[`AppClient`](types_app_client.AppClient.md)

The `AppClient` instance

**`Example`**

```typescript
const appClient = new AppClient({
  appId: 12345678n,
  appSpec: appSpec,
  algorand: AlgorandClient.mainNet(),
})

#### Defined in

[src/types/app-client.ts:517](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L517)

## Properties

### \_algorand

• `Private` **\_algorand**: [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

#### Defined in

[src/types/app-client.ts:483](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L483)

___

### \_appAddress

• `Private` **\_appAddress**: `Address`

#### Defined in

[src/types/app-client.ts:480](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L480)

___

### \_appId

• `Private` **\_appId**: `bigint`

#### Defined in

[src/types/app-client.ts:479](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L479)

___

### \_appName

• `Private` **\_appName**: `string`

#### Defined in

[src/types/app-client.ts:481](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L481)

___

### \_appSpec

• `Private` **\_appSpec**: [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md)

#### Defined in

[src/types/app-client.ts:482](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L482)

___

### \_approvalSourceMap

• `Private` **\_approvalSourceMap**: `undefined` \| `ProgramSourceMap`

#### Defined in

[src/types/app-client.ts:487](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L487)

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

[src/types/app-client.ts:492](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L492)

___

### \_clearSourceMap

• `Private` **\_clearSourceMap**: `undefined` \| `ProgramSourceMap`

#### Defined in

[src/types/app-client.ts:488](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L488)

___

### \_createTransactionsMethods

• `Private` **\_createTransactionsMethods**: \{ `call`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `closeOut`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `delete`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> ; `optIn`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `update`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<`Transaction`\> ; `clearState`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> ; `closeOut`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> ; `delete`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> ; `optIn`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> ; `update`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<`Transaction`\>  }  }

#### Defined in

[src/types/app-client.ts:497](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L497)

___

### \_defaultSender

• `Private` `Optional` **\_defaultSender**: `Address`

#### Defined in

[src/types/app-client.ts:484](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L484)

___

### \_defaultSigner

• `Private` `Optional` **\_defaultSigner**: `TransactionSigner`

#### Defined in

[src/types/app-client.ts:485](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L485)

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

[src/types/app-client.ts:491](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L491)

___

### \_lastCompiled

• `Private` **\_lastCompiled**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `approval?` | `Uint8Array` |
| `clear?` | `Uint8Array` |

#### Defined in

[src/types/app-client.ts:503](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L503)

___

### \_localStateMethods

• `Private` **\_localStateMethods**: (`address`: `string` \| `Address`) => \{ `getAll`: () => `Promise`\<`Record`\<`string`, `any`\>\> ; `getMap`: (`mapName`: `string`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct), `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `getMapValue`: (`mapName`: `string`, `key`: `any`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> ; `getValue`: (`name`: `string`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>  }

#### Type declaration

▸ (`address`): `Object`

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` \| `Address` |

##### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `getAll` | () => `Promise`\<`Record`\<`string`, `any`\>\> | - |
| `getMap` | (`mapName`: `string`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct), `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> | - |
| `getMapValue` | (`mapName`: `string`, `key`: `any`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |
| `getValue` | (`name`: `string`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> | - |

#### Defined in

[src/types/app-client.ts:490](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L490)

___

### \_paramsMethods

• `Private` **\_paramsMethods**: \{ `call`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<[`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall)\> ; `closeOut`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<[`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall)\> ; `delete`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<[`AppDeleteMethodCall`](../modules/types_composer.md#appdeletemethodcall)\> ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `receiver`: `Address` ; `rekeyTo?`: `string` \| `Address` ; `sender`: `Address` ; `signer`: `undefined` \| `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } ; `optIn`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<[`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall)\> ; `update`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `Uint8Array` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & \{ `appId`: `bigint` ; `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `TransactionWithSigner` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ... ; `accountReferences?`: ... ; `appReferences?`: ... ; `approvalProgram`: ... ; `args?`: ... ; `assetReferences?`: ... ; `boxReferences?`: ... ; `clearStateProgram`: ... ; `extraFee?`: ... ; `extraProgramPages?`: ... ; `firstValidRound?`: ... ; `lastValidRound?`: ... ; `lease?`: ... ; `maxFee?`: ... ; `note?`: ... ; `onComplete?`: ... ; `rekeyTo?`: ... ; `schema?`: ... ; `sender`: ... ; `signer?`: ... ; `staticFee?`: ... ; `validityWindow?`: ...  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ... ; `accountReferences?`: ... ; `appId`: ... ; `appReferences?`: ... ; `approvalProgram`: ... ; `args?`: ... ; `assetReferences?`: ... ; `boxReferences?`: ... ; `clearStateProgram`: ... ; `extraFee?`: ... ; `firstValidRound?`: ... ; `lastValidRound?`: ... ; `lease?`: ... ; `maxFee?`: ... ; `note?`: ... ; `onComplete?`: ... ; `rekeyTo?`: ... ; `sender`: ... ; `signer?`: ... ; `staticFee?`: ... ; `validityWindow?`: ...  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: [`Arc56Method`](types_app_arc56.Arc56Method.md) ; `onComplete`: `UpdateApplicationOC` ; `sender`: `Address` = sender; `signer`: `undefined` \| `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `clearState`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `closeOut`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `delete`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppDeleteParams`](../modules/types_composer.md#appdeleteparams) ; `optIn`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `update`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` \| `Address` ; `sender`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\>  }  }

#### Defined in

[src/types/app-client.ts:494](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L494)

___

### \_sendMethods

• `Private` **\_sendMethods**: \{ `call`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `closeOut`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `delete`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `optIn`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `update`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `clearState`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `closeOut`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `delete`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `optIn`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `update`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>  }  }

#### Defined in

[src/types/app-client.ts:500](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L500)

## Accessors

### algorand

• `get` **algorand**(): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

A reference to the underlying `AlgorandClient` this app client is using.

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

#### Defined in

[src/types/app-client.ts:684](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L684)

___

### appAddress

• `get` **appAddress**(): `Address`

The app address of the app instance this client is linked to.

#### Returns

`Address`

#### Defined in

[src/types/app-client.ts:669](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L669)

___

### appId

• `get` **appId**(): `bigint`

The ID of the app instance this client is linked to.

#### Returns

`bigint`

#### Defined in

[src/types/app-client.ts:664](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L664)

___

### appName

• `get` **appName**(): `string`

The name of the app (from the ARC-32 / ARC-56 app spec or override).

#### Returns

`string`

#### Defined in

[src/types/app-client.ts:674](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L674)

___

### appSpec

• `get` **appSpec**(): [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md)

The ARC-56 app spec being used

#### Returns

[`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md)

#### Defined in

[src/types/app-client.ts:679](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L679)

___

### createTransaction

• `get` **createTransaction**(): \{ `call`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `closeOut`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `delete`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> ; `optIn`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `update`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<`Transaction`\> ; `clearState`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> ; `closeOut`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> ; `delete`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> ; `optIn`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> ; `update`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<`Transaction`\>  }  }

Create transactions for the current app

#### Returns

\{ `call`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `closeOut`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `delete`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> ; `optIn`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> ; `update`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<`Transaction`\> ; `clearState`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> ; `closeOut`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> ; `delete`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> ; `optIn`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> ; `update`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<`Transaction`\>  }  }

#### Defined in

[src/types/app-client.ts:708](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L708)

___

### params

• `get` **params**(): \{ `call`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<[`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall)\> ; `closeOut`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<[`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall)\> ; `delete`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<[`AppDeleteMethodCall`](../modules/types_composer.md#appdeletemethodcall)\> ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `receiver`: `Address` ; `rekeyTo?`: `string` \| `Address` ; `sender`: `Address` ; `signer`: `undefined` \| `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } ; `optIn`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<[`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall)\> ; `update`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `Uint8Array` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & \{ `appId`: `bigint` ; `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `TransactionWithSigner` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ... ; `accountReferences?`: ... ; `appReferences?`: ... ; `approvalProgram`: ... ; `args?`: ... ; `assetReferences?`: ... ; `boxReferences?`: ... ; `clearStateProgram`: ... ; `extraFee?`: ... ; `extraProgramPages?`: ... ; `firstValidRound?`: ... ; `lastValidRound?`: ... ; `lease?`: ... ; `maxFee?`: ... ; `note?`: ... ; `onComplete?`: ... ; `rekeyTo?`: ... ; `schema?`: ... ; `sender`: ... ; `signer?`: ... ; `staticFee?`: ... ; `validityWindow?`: ...  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ... ; `accountReferences?`: ... ; `appId`: ... ; `appReferences?`: ... ; `approvalProgram`: ... ; `args?`: ... ; `assetReferences?`: ... ; `boxReferences?`: ... ; `clearStateProgram`: ... ; `extraFee?`: ... ; `firstValidRound?`: ... ; `lastValidRound?`: ... ; `lease?`: ... ; `maxFee?`: ... ; `note?`: ... ; `onComplete?`: ... ; `rekeyTo?`: ... ; `sender`: ... ; `signer?`: ... ; `staticFee?`: ... ; `validityWindow?`: ...  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: [`Arc56Method`](types_app_arc56.Arc56Method.md) ; `onComplete`: `UpdateApplicationOC` ; `sender`: `Address` = sender; `signer`: `undefined` \| `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `clearState`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `closeOut`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `delete`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppDeleteParams`](../modules/types_composer.md#appdeleteparams) ; `optIn`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `update`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` \| `Address` ; `sender`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\>  }  }

Get parameters to create transactions for the current app.

A good mental model for this is that these parameters represent a deferred transaction creation.

#### Returns

\{ `call`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<[`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall)\> ; `closeOut`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<[`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall)\> ; `delete`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<[`AppDeleteMethodCall`](../modules/types_composer.md#appdeletemethodcall)\> ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `receiver`: `Address` ; `rekeyTo?`: `string` \| `Address` ; `sender`: `Address` ; `signer`: `undefined` \| `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } ; `optIn`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<[`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall)\> ; `update`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `Uint8Array` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & \{ `appId`: `bigint` ; `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `TransactionWithSigner` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ... ; `accountReferences?`: ... ; `appReferences?`: ... ; `approvalProgram`: ... ; `args?`: ... ; `assetReferences?`: ... ; `boxReferences?`: ... ; `clearStateProgram`: ... ; `extraFee?`: ... ; `extraProgramPages?`: ... ; `firstValidRound?`: ... ; `lastValidRound?`: ... ; `lease?`: ... ; `maxFee?`: ... ; `note?`: ... ; `onComplete?`: ... ; `rekeyTo?`: ... ; `schema?`: ... ; `sender`: ... ; `signer?`: ... ; `staticFee?`: ... ; `validityWindow?`: ...  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ... ; `accountReferences?`: ... ; `appId`: ... ; `appReferences?`: ... ; `approvalProgram`: ... ; `args?`: ... ; `assetReferences?`: ... ; `boxReferences?`: ... ; `clearStateProgram`: ... ; `extraFee?`: ... ; `firstValidRound?`: ... ; `lastValidRound?`: ... ; `lease?`: ... ; `maxFee?`: ... ; `note?`: ... ; `onComplete?`: ... ; `rekeyTo?`: ... ; `sender`: ... ; `signer?`: ... ; `staticFee?`: ... ; `validityWindow?`: ...  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: [`Arc56Method`](types_app_arc56.Arc56Method.md) ; `onComplete`: `UpdateApplicationOC` ; `sender`: `Address` = sender; `signer`: `undefined` \| `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `clearState`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `closeOut`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `delete`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppDeleteParams`](../modules/types_composer.md#appdeleteparams) ; `optIn`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) ; `update`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` \| `Address` ; `sender`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\>  }  }

**`Example`**

```typescript
const myMethodCall = appClient.params.call({method: 'my_method', args: [123, 'hello']})
// ...
await algorand.send.AppMethodCall(myMethodCall)
```

**`Example`**

```typescript
const myMethodCall = appClient.params.call({method: 'my_method', args: [123, 'hello']})
await appClient.send.call({method: 'my_method2', args: [myMethodCall]})
```

#### Defined in

[src/types/app-client.ts:703](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L703)

___

### send

• `get` **send**(): \{ `call`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `closeOut`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `delete`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `optIn`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `update`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `clearState`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `closeOut`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `delete`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `optIn`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `update`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>  }  }

Send transactions to the current app

#### Returns

\{ `call`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `closeOut`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `delete`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `fundAppAccount`: (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `optIn`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `update`: (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>  } & \{ `bare`: \{ `call`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `clearState`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `closeOut`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `delete`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `optIn`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> ; `update`: (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>  }  }

#### Defined in

[src/types/app-client.ts:713](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L713)

___

### state

• `get` **state**(): `Object`

Get state (local, global, box) from the current app

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
| `local` | (`address`: `string` \| `Address`) => \{ `getAll`: () => `Promise`\<`Record`\<`string`, `any`\>\> ; `getMap`: (`mapName`: `string`) => `Promise`\<`Map`\<`ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct), `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> ; `getMapValue`: (`mapName`: `string`, `key`: `any`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\> ; `getValue`: (`name`: `string`, `appState?`: [`AppState`](../interfaces/types_app.AppState.md)) => `Promise`\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>  } | - |

#### Defined in

[src/types/app-client.ts:718](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L718)

## Methods

### clone

▸ **clone**(`params`): [`AppClient`](types_app_client.AppClient.md)

Clone this app client with different params

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The params to use for the the cloned app client. Omit a param to keep the original value. Set a param to override the original value. Setting to undefined will clear the original value. |
| `params.appId?` | `bigint` | The ID of the app instance this client should make calls against. |
| `params.appName?` | `string` | Optional override for the app name; used for on-chain metadata and lookups. Defaults to the ARC-32/ARC-56 app spec name |
| `params.approvalSourceMap?` | `ProgramSourceMap` | Optional source map for the approval program |
| `params.clearSourceMap?` | `ProgramSourceMap` | Optional source map for the clear state program |
| `params.defaultSender?` | `string` \| `Address` | Optional address to use for the account to use as the default sender for calls. |
| `params.defaultSigner?` | `TransactionSigner` | Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`). |

#### Returns

[`AppClient`](types_app_client.AppClient.md)

A new app client with the altered params

**`Example`**

```typescript
const appClient2 = appClient.clone({ defaultSender: 'NEW_SENDER_ADDRESS' })
```

#### Defined in

[src/types/app-client.ts:572](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L572)

___

### compile

▸ **compile**(`compilation?`): `Promise`\<[`AppClientCompilationResult`](../interfaces/types_app_client.AppClientCompilationResult.md)\>

Compiles the approval and clear state programs (if TEAL templates provided),
performing any provided deploy-time parameter replacement and stores
the source maps.

If no TEAL templates provided it will use any byte code provided in the app spec.

Will store any generated source maps for later use in debugging.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compilation?` | [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) | Any compilation parameters to use |

#### Returns

`Promise`\<[`AppClientCompilationResult`](../interfaces/types_app_client.AppClientCompilationResult.md)\>

The compiled code and any compilation results (including source maps)

#### Defined in

[src/types/app-client.ts:949](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L949)

___

### exportSourceMaps

▸ **exportSourceMaps**(): [`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

Export the current source maps for the app.

#### Returns

[`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

The source maps

#### Defined in

[src/types/app-client.ts:888](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L888)

___

### exposeLogicError

▸ **exposeLogicError**(`e`, `isClearStateProgram?`): `Promise`\<`Error`\>

Takes an error that may include a logic error from a call to the current app and re-exposes the
error to include source code information via the source map and ARC-56 spec.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `e` | `Error` | The error to parse |
| `isClearStateProgram?` | `boolean` | Whether or not the code was running the clear state program (defaults to approval program) |

#### Returns

`Promise`\<`Error`\>

The new error, or if there was no logic error or source map then the wrapped error with source details

#### Defined in

[src/types/app-client.ts:866](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L866)

___

### fundAppAccount

▸ **fundAppAccount**(`params`): `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>

Funds Algo into the app account for this app.

An alias for `appClient.send.fundAppAccount(params)`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters for the funding transaction |
| `params.amount` | [`AlgoAmount`](types_amount.AlgoAmount.md) | Amount to send |
| `params.closeRemainderTo?` | `string` \| `Address` | If given, close the sender account and send the remaining balance to this address *Warning:* Be careful with this parameter as it can lead to loss of funds if not used correctly. |
| `params.coverAppCallInnerTransactionFees?` | `boolean` | Whether to use simulate to automatically calculate required app call inner transaction fees and cover them in the parent app call transaction fee |
| `params.extraFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees. |
| `params.firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. We recommend you only set this when you intentionally want this to be some time in the future. |
| `params.lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use `validityWindow` instead. |
| `params.lease?` | `string` \| `Uint8Array` | Prevent multiple transactions with the same lease being included within the validity window. A [lease](https://dev.algorand.co/concepts/transactions/leases) enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios). |
| `params.maxFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. |
| `params.maxRoundsToWaitForConfirmation?` | `number` | The number of rounds to wait for confirmation. By default until the latest lastValid has past. |
| `params.note?` | `string` \| `Uint8Array` | Note to attach to the transaction. Max of 1000 bytes. |
| `params.populateAppCallResources?` | `boolean` | Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`. |
| `params.rekeyTo?` | `string` \| `Address` | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying). |
| `params.sender?` | `string` \| `Address` | The optional sender to send the transaction from, will use the application client's default sender by default if specified |
| `params.signer?` | `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.suppressLog?` | `boolean` | Whether to suppress log messages from transaction send, default: do not suppress. |
| `params.validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

#### Returns

`Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\>

The result of the funding

**`Example`**

```typescript
await appClient.fundAppAccount({ amount: algo(1) })
```

#### Defined in

[src/types/app-client.ts:747](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L747)

___

### getABIArgsWithDefaultValues

▸ **getABIArgsWithDefaultValues**(`methodNameOrSignature`, `args`, `sender`): `Promise`\<`undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `TransactionWithSigner` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC` ; `rekeyTo?`: `string` \| `Address` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` \| `Address` ; `sender`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[]\>

Returns ABI method arguments ready for a method call params object with default values populated
and structs replaced with tuples.

It does this by replacing any `undefined` values with the equivalent default value from the given ARC-56 app spec.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `methodNameOrSignature` | `string` | The method name or method signature to call if an ABI call is being emitted. e.g. `my_method` or `my_method(unit64,string)bytes` |
| `args` | `undefined` \| (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] | The arguments to the method with `undefined` for any that should be populated with a default value |
| `sender` | `string` \| `Address` | - |

#### Returns

`Promise`\<`undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `TransactionWithSigner` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC` ; `rekeyTo?`: `string` \| `Address` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` \| `Address` ; `sender`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[]\>

#### Defined in

[src/types/app-client.ts:1110](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1110)

___

### getABIMethod

▸ **getABIMethod**(`methodNameOrSignature`): [`Arc56Method`](types_app_arc56.Arc56Method.md)

Returns the ABI Method spec for the given method string for the app represented by this application client instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `methodNameOrSignature` | `string` | The method name or method signature to call if an ABI call is being emitted. e.g. `my_method` or `my_method(unit64,string)bytes` |

#### Returns

[`Arc56Method`](types_app_arc56.Arc56Method.md)

A tuple with: [ARC-56 `Method`, algosdk `ABIMethod`]

#### Defined in

[src/types/app-client.ts:916](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L916)

___

### getABIParams

▸ **getABIParams**\<`TParams`, `TOnComplete`\>(`params`, `onComplete`): `Promise`\<`TParams` & \{ `appId`: `bigint` ; `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `TransactionWithSigner` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (... \| ...)[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC` ; `rekeyTo?`: `string` \| `Address` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (... \| ...)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` \| `Address` ; `sender`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: [`Arc56Method`](types_app_arc56.Arc56Method.md) ; `onComplete`: `TOnComplete` ; `sender`: `Address` = sender; `signer`: `undefined` \| `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)  }\>

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

`Promise`\<`TParams` & \{ `appId`: `bigint` ; `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `TransactionWithSigner` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (... \| ...)[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC` ; `rekeyTo?`: `string` \| `Address` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (... \| ...)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` \| `Address` ; `sender`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: [`Arc56Method`](types_app_arc56.Arc56Method.md) ; `onComplete`: `TOnComplete` ; `sender`: `Address` = sender; `signer`: `undefined` \| `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)  }\>

#### Defined in

[src/types/app-client.ts:1557](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1557)

___

### getBareCreateTransactionMethods

▸ **getBareCreateTransactionMethods**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<`Transaction`\> | - |
| `clearState` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> | - |
| `closeOut` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> | - |
| `delete` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> | - |
| `optIn` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> | - |
| `update` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<`Transaction`\> | - |

#### Defined in

[src/types/app-client.ts:1227](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1227)

___

### getBareParams

▸ **getBareParams**\<`TParams`, `TOnComplete`\>(`params`, `onComplete`): `TParams` & \{ `appId`: `bigint` ; `onComplete`: `TOnComplete` ; `sender`: `Address` ; `signer`: `undefined` \| `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `undefined` \| \{ `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)  } |
| `TOnComplete` | extends `OnApplicationComplete` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `TParams` |
| `onComplete` | `TOnComplete` |

#### Returns

`TParams` & \{ `appId`: `bigint` ; `onComplete`: `TOnComplete` ; `sender`: `Address` ; `signer`: `undefined` \| `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)  }

#### Defined in

[src/types/app-client.ts:1544](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1544)

___

### getBareParamsMethods

▸ **getBareParamsMethods**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => [`AppCallParams`](../modules/types_composer.md#appcallparams) | - |
| `clearState` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) | - |
| `closeOut` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) | - |
| `delete` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppDeleteParams`](../modules/types_composer.md#appdeleteparams) | - |
| `optIn` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => [`AppCallParams`](../modules/types_composer.md#appcallparams) | - |
| `update` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` \| `Address` ; `sender`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> | - |

#### Defined in

[src/types/app-client.ts:1192](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1192)

___

### getBareSendMethods

▸ **getBareSendMethods**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `clearState` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `closeOut` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `delete` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `optIn` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `update` | (`params?`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |

#### Defined in

[src/types/app-client.ts:1256](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1256)

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

[src/types/app-client.ts:1627](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1627)

___

### getBoxNames

▸ **getBoxNames**(): `Promise`\<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

Returns the names of all current boxes for the current app.

#### Returns

`Promise`\<[`BoxName`](../interfaces/types_app.BoxName.md)[]\>

The names of the boxes

**`Example`**

```typescript
const boxNames = await appClient.getBoxNames()
```

#### Defined in

[src/types/app-client.ts:784](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L784)

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

**`Example`**

```typescript
const boxValue = await appClient.getBoxValue('boxName')
```

#### Defined in

[src/types/app-client.ts:797](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L797)

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

**`Example`**

```typescript
const boxValue = await appClient.getBoxValueFromABIType('boxName', new ABIUintType(32))
```

#### Defined in

[src/types/app-client.ts:811](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L811)

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

**`Example`**

```typescript
const boxValues = await appClient.getBoxValues()
```

#### Defined in

[src/types/app-client.ts:829](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L829)

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

**`Example`**

```typescript
const boxValues = await appClient.getBoxValuesFromABIType(new ABIUintType(32))
```

#### Defined in

[src/types/app-client.ts:849](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L849)

___

### getGlobalState

▸ **getGlobalState**(): `Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns raw global state for the current app.

#### Returns

`Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

The global state

**`Example`**

```typescript
const globalState = await appClient.getGlobalState()
```

#### Defined in

[src/types/app-client.ts:759](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L759)

___

### getLocalState

▸ **getLocalState**(`address`): `Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

Returns raw local state for the given account address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` \| `Address` | The address of the account to get the local state for |

#### Returns

`Promise`\<[`AppState`](../interfaces/types_app.AppState.md)\>

The local state

**`Example`**

```typescript
const localState = await appClient.getLocalState('ACCOUNT_ADDRESS')
```

#### Defined in

[src/types/app-client.ts:772](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L772)

___

### getMethodCallCreateTransactionMethods

▸ **getMethodCallCreateTransactionMethods**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> | - |
| `closeOut` | (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> | - |
| `delete` | (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> | - |
| `fundAppAccount` | (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> | - |
| `optIn` | (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> | - |
| `update` | (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> | - |

#### Defined in

[src/types/app-client.ts:1473](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1473)

___

### getMethodCallParamsMethods

▸ **getMethodCallParamsMethods**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete)) => `Promise`\<[`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall)\> | - |
| `closeOut` | (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<[`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall)\> | - |
| `delete` | (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<[`AppDeleteMethodCall`](../modules/types_composer.md#appdeletemethodcall)\> | - |
| `fundAppAccount` | (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `receiver`: `Address` ; `rekeyTo?`: `string` \| `Address` ; `sender`: `Address` ; `signer`: `undefined` \| `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } | - |
| `optIn` | (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<[`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall)\> | - |
| `update` | (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md)) => `Promise`\<\{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `Uint8Array` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & \{ `appId`: `bigint` ; `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `TransactionWithSigner` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ... \| ... ; `accountReferences?`: ... \| ... ; `appReferences?`: ... \| ... ; `approvalProgram`: ... \| ... ; `args?`: ... \| ... ; `assetReferences?`: ... \| ... ; `boxReferences?`: ... \| ... ; `clearStateProgram`: ... \| ... ; `extraFee?`: ... \| ... ; `extraProgramPages?`: ... \| ... ; `firstValidRound?`: ... \| ... ; `lastValidRound?`: ... \| ... ; `lease?`: ... \| ... \| ... ; `maxFee?`: ... \| ... ; `note?`: ... \| ... \| ... ; `onComplete?`: ... \| ... \| ... \| ... \| ... \| ... ; `rekeyTo?`: ... \| ... \| ... ; `schema?`: ... \| ... ; `sender`: ... \| ... ; `signer?`: ... \| ... \| ... ; `staticFee?`: ... \| ... ; `validityWindow?`: ... \| ... \| ...  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ... \| ... ; `accountReferences?`: ... \| ... ; `appId`: `bigint` ; `appReferences?`: ... \| ... ; `approvalProgram`: ... \| ... ; `args?`: ... \| ... ; `assetReferences?`: ... \| ... ; `boxReferences?`: ... \| ... ; `clearStateProgram`: ... \| ... ; `extraFee?`: ... \| ... ; `firstValidRound?`: ... \| ... ; `lastValidRound?`: ... \| ... ; `lease?`: ... \| ... \| ... ; `maxFee?`: ... \| ... ; `note?`: ... \| ... \| ... ; `onComplete?`: ... \| ... ; `rekeyTo?`: ... \| ... \| ... ; `sender`: ... \| ... ; `signer?`: ... \| ... \| ... ; `staticFee?`: ... \| ... ; `validityWindow?`: ... \| ... \| ...  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: [`Arc56Method`](types_app_arc56.Arc56Method.md) ; `onComplete`: `UpdateApplicationOC` ; `sender`: `Address` = sender; `signer`: `undefined` \| `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)  }\> | - |

#### Defined in

[src/types/app-client.ts:1289](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1289)

___

### getMethodCallSendMethods

▸ **getMethodCallSendMethods**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`CallOnComplete`](../modules/types_app_client.md#calloncomplete) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> | - |
| `closeOut` | (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> | - |
| `delete` | (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> | - |
| `fundAppAccount` | (`params`: \{ `amount`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `closeRemainderTo?`: `string` \| `Address` ; `coverAppCallInnerTransactionFees?`: `boolean` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `maxRoundsToWaitForConfirmation?`: `number` ; `note?`: `string` \| `Uint8Array` ; `populateAppCallResources?`: `boolean` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `suppressLog?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |
| `optIn` | (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<`Omit`\<\{ `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: [`ABIReturn`](../modules/types_app.md#abireturn) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`undefined` \| `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct)\>\> | - |
| `update` | (`params`: \{ `accessReferences?`: [`AccessReference`](../interfaces/types_app_manager.AccessReference.md)[] ; `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument) \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rekeyTo?`: `string` \| `Address` ; `sender?`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `string` ; `return?`: `ABIValue` \| [`ABIStruct`](../modules/types_app_arc56.md#abistruct) ; `returns?`: [`ABIReturn`](../modules/types_app.md#abireturn)[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }\> | - |

#### Defined in

[src/types/app-client.ts:1351](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1351)

___

### getSender

▸ **getSender**(`sender`): `Address`

Returns the sender for a call, using the provided sender or using the `defaultSender`
if none provided and throws an error if neither provided

#### Parameters

| Name | Type |
| :------ | :------ |
| `sender` | `undefined` \| `string` \| `Address` |

#### Returns

`Address`

#### Defined in

[src/types/app-client.ts:1527](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1527)

___

### getSigner

▸ **getSigner**(`sender`, `signer`): `undefined` \| `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

Returns the signer for a call, using the provided signer or the `defaultSigner`
if no signer was provided and the sender resolves to the default sender, the call will use default signer
or `undefined` otherwise (so the signer is resolved from `AlgorandClient`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `sender` | `undefined` \| `string` \| `Address` |
| `signer` | `undefined` \| `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) |

#### Returns

`undefined` \| `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

#### Defined in

[src/types/app-client.ts:1537](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1537)

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

[src/types/app-client.ts:1697](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1697)

___

### handleCallErrors

▸ **handleCallErrors**(`e`): `Promise`\<`Error`\>

Make the given call and catch any errors, augmenting with debugging information before re-throwing.

#### Parameters

| Name | Type |
| :------ | :------ |
| `e` | `Error` & \{ `sentTransactions?`: `Transaction`[]  } |

#### Returns

`Promise`\<`Error`\>

#### Defined in

[src/types/app-client.ts:1581](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1581)

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

[src/types/app-client.ts:905](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L905)

___

### processMethodCallReturn

▸ **processMethodCallReturn**\<`TReturn`, `TResult`\>(`result`, `method`): `Promise`\<`Omit`\<`TResult`, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`TReturn`\>\>

Checks for decode errors on the SendAppTransactionResult and maps the return value to the specified type
on the ARC-56 method, replacing the `return` property with the decoded type.

If the return type is an ARC-56 struct then the struct will be returned.

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

`Promise`\<`Omit`\<`TResult`, ``"return"``\> & [`AppReturn`](../modules/types_app.md#appreturn)\<`TReturn`\>\>

The smart contract response with an updated return value

#### Defined in

[src/types/app-client.ts:930](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L930)

___

### compile

▸ **compile**(`appSpec`, `appManager`, `compilation?`): `Promise`\<[`AppClientCompilationResult`](../interfaces/types_app_client.AppClientCompilationResult.md)\>

Compiles the approval and clear state programs (if TEAL templates provided),
performing any provided deploy-time parameter replacement and returns
the compiled code and any compilation results (including source maps).

If no TEAL templates provided it will use any byte code provided in the app spec.

Will store any generated source maps for later use in debugging.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appSpec` | [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md) | The app spec for the app |
| `appManager` | [`AppManager`](types_app_manager.AppManager.md) | The app manager to use for compilation |
| `compilation?` | [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) | Any compilation parameters to use |

#### Returns

`Promise`\<[`AppClientCompilationResult`](../interfaces/types_app_client.AppClientCompilationResult.md)\>

The compiled code and any compilation results (including source maps)

#### Defined in

[src/types/app-client.ts:1057](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L1057)

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
| `details.approvalSourceInfo?` | [`ProgramSourceInfo`](../interfaces/types_app_arc56.ProgramSourceInfo.md) | ARC56 approval source info |
| `details.approvalSourceMap?` | `ProgramSourceMap` | Approval program source map |
| `details.clearSourceInfo?` | [`ProgramSourceInfo`](../interfaces/types_app_arc56.ProgramSourceInfo.md) | ARC56 clear source info |
| `details.clearSourceMap?` | `ProgramSourceMap` | Clear state program source map |
| `details.isClearStateProgram?` | `boolean` | Whether or not the code was running the clear state program (defaults to approval program) |
| `details.program?` | `Uint8Array` | program bytes |

#### Returns

`Error`

The new error, or if there was no logic error or source map then the wrapped error with source details

#### Defined in

[src/types/app-client.ts:973](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L973)

___

### fromCreatorAndName

▸ **fromCreatorAndName**(`params`): `Promise`\<[`AppClient`](types_app_client.AppClient.md)\>

Returns a new `AppClient` client, resolving the app by creator address and name
using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters to create the app client |
| `params.algorand` | [`AlgorandClient`](types_algorand_client.AlgorandClient.md) | An `AlgorandClient` instance |
| `params.appLookupCache?` | [`AppLookup`](../interfaces/types_app_deployer.AppLookup.md) | An optional cached app lookup that matches a name to on-chain details; either this is needed or indexer is required to be passed in to this `ClientManager` on construction. |
| `params.appName?` | `string` | Optional override for the app name; used for on-chain metadata and lookups. Defaults to the ARC-32/ARC-56 app spec name |
| `params.appSpec` | `string` \| [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md) \| [`AppSpec`](../interfaces/types_app_spec.AppSpec.md) | The ARC-56 or ARC-32 application spec as either: * Parsed JSON ARC-56 `Contract` * Parsed JSON ARC-32 `AppSpec` * Raw JSON string (in either ARC-56 or ARC-32 format) |
| `params.approvalSourceMap?` | `ProgramSourceMap` | Optional source map for the approval program |
| `params.clearSourceMap?` | `ProgramSourceMap` | Optional source map for the clear state program |
| `params.creatorAddress` | `string` \| `Address` | The address of the creator account for the app |
| `params.defaultSender?` | `string` \| `Address` | Optional address to use for the account to use as the default sender for calls. |
| `params.defaultSigner?` | `TransactionSigner` | Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`). |
| `params.ignoreCache?` | `boolean` | Whether or not to ignore the `AppDeployer` lookup cache and force an on-chain lookup, default: use any cached value |

#### Returns

`Promise`\<[`AppClient`](types_app_client.AppClient.md)\>

The `AppClient` instance

**`Example`**

```typescript
const appClient = await AppClient.fromCreatorAndName({
  creatorAddress: 'CREATOR_ADDRESS',
  name: 'APP_NAME',
  appSpec: appSpec,
  algorand: AlgorandClient.mainNet(),
})

#### Defined in

[src/types/app-client.ts:600](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L600)

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
| `params.algorand` | [`AlgorandClient`](types_algorand_client.AlgorandClient.md) | An `AlgorandClient` instance |
| `params.appName?` | `string` | Optional override for the app name; used for on-chain metadata and lookups. Defaults to the ARC-32/ARC-56 app spec name |
| `params.appSpec` | `string` \| [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md) \| [`AppSpec`](../interfaces/types_app_spec.AppSpec.md) | The ARC-56 or ARC-32 application spec as either: * Parsed JSON ARC-56 `Contract` * Parsed JSON ARC-32 `AppSpec` * Raw JSON string (in either ARC-56 or ARC-32 format) |
| `params.approvalSourceMap?` | `ProgramSourceMap` | Optional source map for the approval program |
| `params.clearSourceMap?` | `ProgramSourceMap` | Optional source map for the clear state program |
| `params.defaultSender?` | `string` \| `Address` | Optional address to use for the account to use as the default sender for calls. |
| `params.defaultSigner?` | `TransactionSigner` | Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`). |

#### Returns

`Promise`\<[`AppClient`](types_app_client.AppClient.md)\>

The `AppClient` instance

**`Example`**

```typescript
const appClient = await AppClient.fromNetwork({
  appSpec: appSpec,
  algorand: AlgorandClient.mainNet(),
})

#### Defined in

[src/types/app-client.ts:629](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L629)

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

**`Example`**

```typescript
const arc56AppSpec = AppClient.normaliseAppSpec(appSpec)
```

#### Defined in

[src/types/app-client.ts:657](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L657)
