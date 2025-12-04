[@algorandfoundation/algokit-utils](../README.md) / [types/app-factory](../modules/types_app_factory.md) / AppFactory

# Class: AppFactory

[types/app-factory](../modules/types_app_factory.md).AppFactory

ARC-56/ARC-32 app factory that, for a given app spec, allows you to create
and deploy one or more app instances and to create one or more app clients
to interact with those (or other) app instances.

## Table of contents

### Constructors

- [constructor](types_app_factory.AppFactory.md#constructor)

### Properties

- [\_algorand](types_app_factory.AppFactory.md#_algorand)
- [\_appName](types_app_factory.AppFactory.md#_appname)
- [\_appSpec](types_app_factory.AppFactory.md#_appspec)
- [\_approvalSourceMap](types_app_factory.AppFactory.md#_approvalsourcemap)
- [\_clearSourceMap](types_app_factory.AppFactory.md#_clearsourcemap)
- [\_defaultSender](types_app_factory.AppFactory.md#_defaultsender)
- [\_defaultSigner](types_app_factory.AppFactory.md#_defaultsigner)
- [\_deletable](types_app_factory.AppFactory.md#_deletable)
- [\_deployTimeParams](types_app_factory.AppFactory.md#_deploytimeparams)
- [\_paramsMethods](types_app_factory.AppFactory.md#_paramsmethods)
- [\_updatable](types_app_factory.AppFactory.md#_updatable)
- [\_version](types_app_factory.AppFactory.md#_version)
- [createTransaction](types_app_factory.AppFactory.md#createtransaction)
- [send](types_app_factory.AppFactory.md#send)

### Accessors

- [algorand](types_app_factory.AppFactory.md#algorand)
- [appName](types_app_factory.AppFactory.md#appname)
- [appSpec](types_app_factory.AppFactory.md#appspec)
- [params](types_app_factory.AppFactory.md#params)

### Methods

- [compile](types_app_factory.AppFactory.md#compile)
- [deploy](types_app_factory.AppFactory.md#deploy)
- [exportSourceMaps](types_app_factory.AppFactory.md#exportsourcemaps)
- [exposeLogicError](types_app_factory.AppFactory.md#exposelogicerror)
- [getABIParams](types_app_factory.AppFactory.md#getabiparams)
- [getAppClientByCreatorAndName](types_app_factory.AppFactory.md#getappclientbycreatorandname)
- [getAppClientById](types_app_factory.AppFactory.md#getappclientbyid)
- [getBareParams](types_app_factory.AppFactory.md#getbareparams)
- [getCreateABIArgsWithDefaultValues](types_app_factory.AppFactory.md#getcreateabiargswithdefaultvalues)
- [getDeployTimeControl](types_app_factory.AppFactory.md#getdeploytimecontrol)
- [getParamsMethods](types_app_factory.AppFactory.md#getparamsmethods)
- [getSender](types_app_factory.AppFactory.md#getsender)
- [getSigner](types_app_factory.AppFactory.md#getsigner)
- [handleCallErrors](types_app_factory.AppFactory.md#handlecallerrors)
- [importSourceMaps](types_app_factory.AppFactory.md#importsourcemaps)

## Constructors

### constructor

• **new AppFactory**(`params`): [`AppFactory`](types_app_factory.AppFactory.md)

Create a new app factory.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppFactoryParams`](../interfaces/types_app_factory.AppFactoryParams.md) | The parameters to create the app factory |

#### Returns

[`AppFactory`](types_app_factory.AppFactory.md)

The `AppFactory` instance

**`Example`**

```typescript
const appFactory = new AppFactory({
  appSpec: appSpec,
  algorand: AlgorandClient.mainNet(),
})

#### Defined in

[src/types/app-factory.ts:179](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L179)

## Properties

### \_algorand

• `Private` **\_algorand**: [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

#### Defined in

[src/types/app-factory.ts:155](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L155)

___

### \_appName

• `Private` **\_appName**: `string`

#### Defined in

[src/types/app-factory.ts:154](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L154)

___

### \_appSpec

• `Private` **\_appSpec**: `Arc56Contract`

#### Defined in

[src/types/app-factory.ts:153](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L153)

___

### \_approvalSourceMap

• `Private` **\_approvalSourceMap**: `undefined` \| `ProgramSourceMap`

#### Defined in

[src/types/app-factory.ts:163](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L163)

___

### \_clearSourceMap

• `Private` **\_clearSourceMap**: `undefined` \| `ProgramSourceMap`

#### Defined in

[src/types/app-factory.ts:164](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L164)

___

### \_defaultSender

• `Private` `Optional` **\_defaultSender**: `Address`

#### Defined in

[src/types/app-factory.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L157)

___

### \_defaultSigner

• `Private` `Optional` **\_defaultSigner**: `TransactionSigner`

#### Defined in

[src/types/app-factory.ts:158](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L158)

___

### \_deletable

• `Private` `Optional` **\_deletable**: `boolean`

#### Defined in

[src/types/app-factory.ts:161](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L161)

___

### \_deployTimeParams

• `Private` `Optional` **\_deployTimeParams**: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md)

#### Defined in

[src/types/app-factory.ts:159](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L159)

___

### \_paramsMethods

• `Private` **\_paramsMethods**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `bare` | \{ `create`: (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `Uint8Array` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `deletable?`: `boolean` ; `deployTimeParams`: `undefined` \| [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }\> ; `deployDelete`: (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  } ; `deployUpdate`: (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `UpdateApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }  } | - |
| `bare.create` | (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `Uint8Array` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `deletable?`: `boolean` ; `deployTimeParams`: `undefined` \| [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }\> | - |
| `bare.deployDelete` | (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  } | - |
| `bare.deployUpdate` | (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `UpdateApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  } | - |
| `create` | (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` = compiled.approvalProgram; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `Uint8Array` = compiled.clearStateProgram; `deletable?`: `boolean` ; `deployTimeParams`: `undefined` \| [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & \{ `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ... \| ... ; `accountReferences?`: ... \| ... ; `appReferences?`: ... \| ... ; `approvalProgram`: ... \| ... ; `args?`: ... \| ... ; `assetReferences?`: ... \| ... ; `boxReferences?`: ... \| ... ; `clearStateProgram`: ... \| ... ; `extraFee?`: ... \| ... ; `extraProgramPages?`: ... \| ... ; `firstValidRound?`: ... \| ... ; `lastValidRound?`: ... \| ... ; `lease?`: ... \| ... \| ... ; `maxFee?`: ... \| ... ; `note?`: ... \| ... \| ... ; `onComplete?`: ... \| ... \| ... \| ... \| ... \| ... ; `rejectVersion?`: ... \| ... ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: ... \| ... ; `sender`: `ReadableAddress` ; `signer?`: ... \| ... \| ... ; `staticFee?`: ... \| ... ; `validityWindow?`: ... \| ... \| ...  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ... \| ... ; `accountReferences?`: ... \| ... ; `appId`: `bigint` ; `appReferences?`: ... \| ... ; `approvalProgram`: ... \| ... ; `args?`: ... \| ... ; `assetReferences?`: ... \| ... ; `boxReferences?`: ... \| ... ; `clearStateProgram`: ... \| ... ; `extraFee?`: ... \| ... ; `firstValidRound?`: ... \| ... ; `lastValidRound?`: ... \| ... ; `lease?`: ... \| ... \| ... ; `maxFee?`: ... \| ... ; `note?`: ... \| ... \| ... ; `onComplete?`: ... \| ... ; `rejectVersion?`: ... \| ... ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: ... \| ... \| ... ; `staticFee?`: ... \| ... ; `validityWindow?`: ... \| ... \| ...  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: `ABIMethod` ; `onComplete`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }\> | - |
| `deployDelete` | (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ...[] ; `accountReferences?`: ...[] ; `appReferences?`: ...[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: ...[] ; `assetReferences?`: ...[] ; `boxReferences?`: ...[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: ... ; `globalInts`: ... ; `localByteSlices`: ... ; `localInts`: ...  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ...[] ; `accountReferences?`: ...[] ; `appId`: `bigint` ; `appReferences?`: ...[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: ...[] ; `assetReferences?`: ...[] ; `boxReferences?`: ...[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: `ABIMethod` ; `onComplete`: `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  } | - |
| `deployUpdate` | (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ...[] ; `accountReferences?`: ...[] ; `appReferences?`: ...[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: ...[] ; `assetReferences?`: ...[] ; `boxReferences?`: ...[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: ... ; `globalInts`: ... ; `localByteSlices`: ... ; `localInts`: ...  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ...[] ; `accountReferences?`: ...[] ; `appId`: `bigint` ; `appReferences?`: ...[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: ...[] ; `assetReferences?`: ...[] ; `boxReferences?`: ...[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: `ABIMethod` ; `onComplete`: `UpdateApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  } | - |

#### Defined in

[src/types/app-factory.ts:166](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L166)

___

### \_updatable

• `Private` `Optional` **\_updatable**: `boolean`

#### Defined in

[src/types/app-factory.ts:160](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L160)

___

### \_version

• `Private` **\_version**: `string`

#### Defined in

[src/types/app-factory.ts:156](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L156)

___

### createTransaction

• `Readonly` **createTransaction**: `Object`

Create transactions for the current app

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `bare` | \{ `create`: (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\>  } | Create bare (raw) transactions for the current app |
| `bare.create` | (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<`Transaction`\> | - |
| `create` | (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `methodCalls`: `Map`\<`number`, `ABIMethod`\> ; `signers`: `Map`\<`number`, `TransactionSigner`\> ; `transactions`: `Transaction`[]  }\> | - |

#### Defined in

[src/types/app-factory.ts:227](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L227)

___

### send

• `Readonly` **send**: `Object`

Send transactions to the current app

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `bare` | \{ `create`: (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `appClient`: [`AppClient`](types_app_client.AppClient.md) ; `result`: \{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `undefined` \| `string` ; `return`: `undefined` = undefined; `returns?`: `ABIReturn`[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }  }\>  } | Send bare (raw) transactions for the current app |
| `bare.create` | (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `appClient`: [`AppClient`](types_app_client.AppClient.md) ; `result`: \{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `undefined` \| `string` ; `return`: `undefined` = undefined; `returns?`: `ABIReturn`[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }  }\> | - |
| `create` | (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & [`SendParams`](../interfaces/types_transaction.SendParams.md)) => `Promise`\<\{ `appClient`: [`AppClient`](types_app_client.AppClient.md) ; `result`: \{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `groupId`: `undefined` \| `string` ; `return`: `undefined` \| `ABIValue` = result.return.returnValue; `returns?`: `ABIReturn`[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[]  }  }\> | - |

#### Defined in

[src/types/app-factory.ts:255](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L255)

## Accessors

### algorand

• `get` **algorand**(): [`AlgorandClient`](types_algorand_client.AlgorandClient.md)

Return the algorand client this factory is using.

#### Returns

[`AlgorandClient`](types_algorand_client.AlgorandClient.md)

#### Defined in

[src/types/app-factory.ts:203](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L203)

___

### appName

• `get` **appName**(): `string`

The name of the app (from the ARC-32 / ARC-56 app spec or override).

#### Returns

`string`

#### Defined in

[src/types/app-factory.ts:193](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L193)

___

### appSpec

• `get` **appSpec**(): `Arc56Contract`

The ARC-56 app spec being used

#### Returns

`Arc56Contract`

#### Defined in

[src/types/app-factory.ts:198](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L198)

___

### params

• `get` **params**(): `Object`

Get parameters to create transactions (create and deploy related calls) for the current app.

A good mental model for this is that these parameters represent a deferred transaction creation.

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `bare` | \{ `create`: (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `Uint8Array` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `deletable?`: `boolean` ; `deployTimeParams`: `undefined` \| [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }\> ; `deployDelete`: (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  } ; `deployUpdate`: (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `UpdateApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }  } | - |
| `bare.create` | (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `Uint8Array` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `deletable?`: `boolean` ; `deployTimeParams`: `undefined` \| [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }\> | - |
| `bare.deployDelete` | (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  } | - |
| `bare.deployUpdate` | (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `UpdateApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  } | - |
| `create` | (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` = compiled.approvalProgram; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `Uint8Array` = compiled.clearStateProgram; `deletable?`: `boolean` ; `deployTimeParams`: `undefined` \| [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & \{ `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ... \| ... ; `accountReferences?`: ... \| ... ; `appReferences?`: ... \| ... ; `approvalProgram`: ... \| ... ; `args?`: ... \| ... ; `assetReferences?`: ... \| ... ; `boxReferences?`: ... \| ... ; `clearStateProgram`: ... \| ... ; `extraFee?`: ... \| ... ; `extraProgramPages?`: ... \| ... ; `firstValidRound?`: ... \| ... ; `lastValidRound?`: ... \| ... ; `lease?`: ... \| ... \| ... ; `maxFee?`: ... \| ... ; `note?`: ... \| ... \| ... ; `onComplete?`: ... \| ... \| ... \| ... \| ... \| ... ; `rejectVersion?`: ... \| ... ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: ... \| ... ; `sender`: `ReadableAddress` ; `signer?`: ... \| ... \| ... ; `staticFee?`: ... \| ... ; `validityWindow?`: ... \| ... \| ...  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ... \| ... ; `accountReferences?`: ... \| ... ; `appId`: `bigint` ; `appReferences?`: ... \| ... ; `approvalProgram`: ... \| ... ; `args?`: ... \| ... ; `assetReferences?`: ... \| ... ; `boxReferences?`: ... \| ... ; `clearStateProgram`: ... \| ... ; `extraFee?`: ... \| ... ; `firstValidRound?`: ... \| ... ; `lastValidRound?`: ... \| ... ; `lease?`: ... \| ... \| ... ; `maxFee?`: ... \| ... ; `note?`: ... \| ... \| ... ; `onComplete?`: ... \| ... ; `rejectVersion?`: ... \| ... ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: ... \| ... \| ... ; `staticFee?`: ... \| ... ; `validityWindow?`: ... \| ... \| ...  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: `ABIMethod` ; `onComplete`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }\> | - |
| `deployDelete` | (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ...[] ; `accountReferences?`: ...[] ; `appReferences?`: ...[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: ...[] ; `assetReferences?`: ...[] ; `boxReferences?`: ...[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: ... ; `globalInts`: ... ; `localByteSlices`: ... ; `localInts`: ...  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ...[] ; `accountReferences?`: ...[] ; `appId`: `bigint` ; `appReferences?`: ...[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: ...[] ; `assetReferences?`: ...[] ; `boxReferences?`: ...[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: `ABIMethod` ; `onComplete`: `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  } | - |
| `deployUpdate` | (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ...[] ; `accountReferences?`: ...[] ; `appReferences?`: ...[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: ...[] ; `assetReferences?`: ...[] ; `boxReferences?`: ...[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: ... ; `globalInts`: ... ; `localByteSlices`: ... ; `localInts`: ...  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ...[] ; `accountReferences?`: ...[] ; `appId`: `bigint` ; `appReferences?`: ...[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: ...[] ; `assetReferences?`: ...[] ; `boxReferences?`: ...[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: `ABIMethod` ; `onComplete`: `UpdateApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  } | - |

**`Example`**

```typescript
const createAppParams = appFactory.params.create({method: 'create_method', args: [123, 'hello']})
// ...
await algorand.send.AppCreateMethodCall(createAppParams)
```

**`Example`**

```typescript
const createAppParams = appFactory.params.create({method: 'create_method', args: [123, 'hello']})
await appClient.send.call({method: 'my_method', args: [createAppParams]})
```

#### Defined in

[src/types/app-factory.ts:222](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L222)

## Methods

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
| `compilation?` | [`AppClientCompilationParams`](../interfaces/types_app_client.AppClientCompilationParams.md) | Optional compilation parameters to use for the compilation |

#### Returns

`Promise`\<[`AppClientCompilationResult`](../interfaces/types_app_client.AppClientCompilationResult.md)\>

The compilation result

**`Example`**

```typescript
const result = await factory.compile()
```

#### Defined in

[src/types/app-factory.ts:602](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L602)

___

### deploy

▸ **deploy**(`params`): `Promise`\<\{ `appClient`: [`AppClient`](types_app_client.AppClient.md) ; `result`: \{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `bigint` ; `deletable?`: `boolean` ; `deleteReturn`: `undefined` \| `ABIValue` ; `deleted`: `boolean` ; `groupId`: `undefined` \| `string` ; `name`: `string` ; `operationPerformed`: ``"create"`` ; `return`: `undefined` \| `ABIValue` ; `returns?`: `ABIReturn`[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[] ; `updatable?`: `boolean` ; `updatedRound`: `bigint` ; `version`: `string`  } \| \{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `bigint` ; `deletable?`: `boolean` ; `deleteReturn`: `undefined` \| `ABIValue` ; `deleted`: `boolean` ; `groupId`: `undefined` \| `string` ; `name`: `string` ; `operationPerformed`: ``"update"`` ; `return`: `undefined` \| `ABIValue` ; `returns?`: `ABIReturn`[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[] ; `updatable?`: `boolean` ; `updatedRound`: `bigint` ; `version`: `string`  } \| \{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `bigint` ; `deletable?`: `boolean` ; `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `deleteReturn`: `undefined` \| `ABIValue` ; `deleted`: `boolean` ; `groupId`: `undefined` \| `string` ; `name`: `string` ; `operationPerformed`: ``"replace"`` ; `return`: `undefined` \| `ABIValue` ; `returns?`: `ABIReturn`[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[] ; `updatable?`: `boolean` ; `updatedRound`: `bigint` ; `version`: `string`  } \| \{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `bigint` ; `deletable?`: `boolean` ; `deleteReturn`: `undefined` \| `ABIValue` ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"nothing"`` ; `return`: `undefined` \| `ABIValue` ; `updatable?`: `boolean` ; `updatedRound`: `bigint` ; `version`: `string`  }  }\>

Idempotently deploy (create if not exists, update if changed) an app against the given name for the given creator account, including deploy-time TEAL template placeholder substitutions (if specified).

**Note:** When using the return from this function be sure to check `operationPerformed` to get access to various return properties like `transaction`, `confirmation` and `deleteResult`.

**Note:** if there is a breaking state schema change to an existing app (and `onSchemaBreak` is set to `'replace'`) the existing app will be deleted and re-created.

**Note:** if there is an update (different TEAL code) to an existing app (and `onUpdate` is set to `'replace'`) the existing app will be deleted and re-created.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The arguments to control the app deployment |
| `params.appName?` | `string` | Override the app name for this deployment |
| `params.coverAppCallInnerTransactionFees?` | `boolean` | Whether to use simulate to automatically calculate required app call inner transaction fees and cover them in the parent app call transaction fee |
| `params.createParams?` | \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } \| \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } | Create transaction parameters to use if a create needs to be issued as part of deployment |
| `params.deletable?` | `boolean` | Whether or not the contract should have deploy-time permanence control set. `undefined` = use AppFactory constructor value if set or base it on the app spec. |
| `params.deleteParams?` | \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } \| \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } | Delete transaction parameters to use if a create needs to be issued as part of deployment |
| `params.deployTimeParams?` | [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) | Any deploy-time parameters to replace in the TEAL code before compiling it (used if teal code is passed in as a string) |
| `params.existingDeployments?` | [`AppLookup`](../interfaces/types_app_deployer.AppLookup.md) | Optional cached value of the existing apps for the given creator; use this to avoid an indexer lookup |
| `params.ignoreCache?` | `boolean` | Whether or not to ignore the app metadata cache and force a lookup, default: use the cache * |
| `params.maxRoundsToWaitForConfirmation?` | `number` | The number of rounds to wait for confirmation. By default until the latest lastValid has past. |
| `params.onSchemaBreak?` | ``"replace"`` \| [`OnSchemaBreak`](../enums/types_app.OnSchemaBreak.md) \| ``"fail"`` \| ``"append"`` | What action to perform if a schema break (storage schema or extra pages change) is detected: * `fail` - Fail the deployment (throw an error, **default**) * `replace` - Delete the old app and create a new one * `append` - Deploy a new app and leave the old one as is |
| `params.onUpdate?` | ``"replace"`` \| ``"update"`` \| ``"fail"`` \| ``"append"`` \| [`OnUpdate`](../enums/types_app.OnUpdate.md) | What action to perform if a TEAL code update is detected: * `fail` - Fail the deployment (throw an error, **default**) * `update` - Update the app with the new TEAL code * `replace` - Delete the old app and create a new one * `append` - Deploy a new app and leave the old one as is |
| `params.populateAppCallResources?` | `boolean` | Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`. |
| `params.suppressLog?` | `boolean` | Whether to suppress log messages from transaction send, default: do not suppress. |
| `params.updatable?` | `boolean` | Whether or not the contract should have deploy-time immutability control set. `undefined` = use AppFactory constructor value if set or base it on the app spec. |
| `params.updateParams?` | \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } \| \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } | Update transaction parameters to use if a create needs to be issued as part of deployment |

#### Returns

`Promise`\<\{ `appClient`: [`AppClient`](types_app_client.AppClient.md) ; `result`: \{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `bigint` ; `deletable?`: `boolean` ; `deleteReturn`: `undefined` \| `ABIValue` ; `deleted`: `boolean` ; `groupId`: `undefined` \| `string` ; `name`: `string` ; `operationPerformed`: ``"create"`` ; `return`: `undefined` \| `ABIValue` ; `returns?`: `ABIReturn`[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[] ; `updatable?`: `boolean` ; `updatedRound`: `bigint` ; `version`: `string`  } \| \{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `bigint` ; `deletable?`: `boolean` ; `deleteReturn`: `undefined` \| `ABIValue` ; `deleted`: `boolean` ; `groupId`: `undefined` \| `string` ; `name`: `string` ; `operationPerformed`: ``"update"`` ; `return`: `undefined` \| `ABIValue` ; `returns?`: `ABIReturn`[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[] ; `updatable?`: `boolean` ; `updatedRound`: `bigint` ; `version`: `string`  } \| \{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `confirmation`: `PendingTransactionResponse` ; `confirmations`: `PendingTransactionResponse`[] ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `bigint` ; `deletable?`: `boolean` ; `deleteResult`: [`ConfirmedTransactionResult`](../interfaces/types_transaction.ConfirmedTransactionResult.md) ; `deleteReturn`: `undefined` \| `ABIValue` ; `deleted`: `boolean` ; `groupId`: `undefined` \| `string` ; `name`: `string` ; `operationPerformed`: ``"replace"`` ; `return`: `undefined` \| `ABIValue` ; `returns?`: `ABIReturn`[] ; `transaction`: `Transaction` ; `transactions`: `Transaction`[] ; `txIds`: `string`[] ; `updatable?`: `boolean` ; `updatedRound`: `bigint` ; `version`: `string`  } \| \{ `appAddress`: `Address` ; `appId`: `bigint` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `createdMetadata`: [`AppDeployMetadata`](../interfaces/types_app.AppDeployMetadata.md) ; `createdRound`: `bigint` ; `deletable?`: `boolean` ; `deleteReturn`: `undefined` \| `ABIValue` ; `deleted`: `boolean` ; `name`: `string` ; `operationPerformed`: ``"nothing"`` ; `return`: `undefined` \| `ABIValue` ; `updatable?`: `boolean` ; `updatedRound`: `bigint` ; `version`: `string`  }  }\>

The app client and the result of the deployment

**`Example`**

```ts
const { appClient, result } = await factory.deploy({
  createParams: {
    sender: 'SENDER_ADDRESS',
    approvalProgram: 'APPROVAL PROGRAM',
    clearStateProgram: 'CLEAR PROGRAM',
    schema: {
      globalByteSlices: 0,
      globalInts: 0,
      localByteSlices: 0,
      localInts: 0
    }
  },
  updateParams: {
    sender: 'SENDER_ADDRESS'
  },
  deleteParams: {
    sender: 'SENDER_ADDRESS'
  },
  onSchemaBreak: 'append',
  onUpdate: 'append'
 })
```

#### Defined in

[src/types/app-factory.ts:356](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L356)

___

### exportSourceMaps

▸ **exportSourceMaps**(): [`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

Export the current source maps for the app.

#### Returns

[`AppSourceMaps`](../interfaces/types_app_client.AppSourceMaps.md)

The source maps

#### Defined in

[src/types/app-factory.ts:483](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L483)

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

[src/types/app-factory.ts:471](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L471)

___

### getABIParams

▸ **getABIParams**\<`TParams`, `TOnComplete`\>(`params`, `onComplete`): `TParams` & \{ `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: `ABIMethod` ; `onComplete`: `TOnComplete` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }

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

`TParams` & \{ `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: `ABIMethod` ; `onComplete`: `TOnComplete` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }

#### Defined in

[src/types/app-factory.ts:627](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L627)

___

### getAppClientByCreatorAndName

▸ **getAppClientByCreatorAndName**(`params`): `Promise`\<[`AppClient`](types_app_client.AppClient.md)\>

Returns a new `AppClient` client, resolving the app by creator address and name
using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).

Automatically populates appName, defaultSender and source maps from the factory
if not specified in the params.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters to create the app client |
| `params.appLookupCache?` | [`AppLookup`](../interfaces/types_app_deployer.AppLookup.md) | An optional cached app lookup that matches a name to on-chain details; either this is needed or indexer is required to be passed in to this `ClientManager` on construction. |
| `params.appName?` | `string` | Optional override for the app name; used for on-chain metadata and lookups. Defaults to the ARC-32/ARC-56 app spec name |
| `params.approvalSourceMap?` | `ProgramSourceMap` | Optional source map for the approval program |
| `params.clearSourceMap?` | `ProgramSourceMap` | Optional source map for the clear state program |
| `params.creatorAddress` | `ReadableAddress` | The address of the creator account for the app |
| `params.defaultSender?` | `ReadableAddress` | Optional address to use for the account to use as the default sender for calls. |
| `params.defaultSigner?` | `TransactionSigner` | Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`). |
| `params.ignoreCache?` | `boolean` | Whether or not to ignore the `AppDeployer` lookup cache and force an on-chain lookup, default: use any cached value |

#### Returns

`Promise`\<[`AppClient`](types_app_client.AppClient.md)\>

The `AppClient` instance

**`Example`**

```typescript
const appClient = factory.getAppClientByCreatorAndName({ creatorAddress: 'CREATOR_ADDRESS', appName: 'my_app' })
```

#### Defined in

[src/types/app-factory.ts:452](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L452)

___

### getAppClientById

▸ **getAppClientById**(`params`): [`AppClient`](types_app_client.AppClient.md)

Returns a new `AppClient` client for an app instance of the given ID.

Automatically populates appName, defaultSender and source maps from the factory
if not specified in the params.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The parameters to create the app client |
| `params.appId` | `bigint` | The ID of the app instance this client should make calls against. |
| `params.appName?` | `string` | Optional override for the app name; used for on-chain metadata and lookups. Defaults to the ARC-32/ARC-56 app spec name |
| `params.approvalSourceMap?` | `ProgramSourceMap` | Optional source map for the approval program |
| `params.clearSourceMap?` | `ProgramSourceMap` | Optional source map for the clear state program |
| `params.defaultSender?` | `ReadableAddress` | Optional address to use for the account to use as the default sender for calls. |
| `params.defaultSigner?` | `TransactionSigner` | Optional signer to use as the default signer for default sender calls (if not specified then the signer will be resolved from `AlgorandClient`). |

#### Returns

[`AppClient`](types_app_client.AppClient.md)

The `AppClient` instance

**`Example`**

```typescript
const appClient = factory.getAppClientById({ appId: 12345n })
```

#### Defined in

[src/types/app-factory.ts:426](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L426)

___

### getBareParams

▸ **getBareParams**\<`TParams`, `TOnComplete`\>(`params`, `onComplete`): `TParams` & \{ `onComplete`: `TOnComplete` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `undefined` \| \{ `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner`  } |
| `TOnComplete` | extends `OnApplicationComplete` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `TParams` |
| `onComplete` | `TOnComplete` |

#### Returns

`TParams` & \{ `onComplete`: `TOnComplete` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }

#### Defined in

[src/types/app-factory.ts:615](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L615)

___

### getCreateABIArgsWithDefaultValues

▸ **getCreateABIArgsWithDefaultValues**(`methodNameOrSignature`, `args`): `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `methodNameOrSignature` | `string` |
| `args` | `undefined` \| (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] |

#### Returns

`undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[]

#### Defined in

[src/types/app-factory.ts:646](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L646)

___

### getDeployTimeControl

▸ **getDeployTimeControl**(`control`): `undefined` \| `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `control` | ``"deletable"`` \| ``"updatable"`` |

#### Returns

`undefined` \| `boolean`

#### Defined in

[src/types/app-factory.ts:505](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L505)

___

### getParamsMethods

▸ **getParamsMethods**(): `Object`

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `bare` | \{ `create`: (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `Uint8Array` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `deletable?`: `boolean` ; `deployTimeParams`: `undefined` \| [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }\> ; `deployDelete`: (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  } ; `deployUpdate`: (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `UpdateApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }  } | - |
| `bare.create` | (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `Uint8Array` ; `compiledApproval?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `compiledClear?`: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) ; `deletable?`: `boolean` ; `deployTimeParams`: `undefined` \| [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }\> | - |
| `bare.deployDelete` | (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  } | - |
| `bare.deployUpdate` | (`params?`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `onComplete`: `UpdateApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  } | - |
| `create` | (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `deletable?`: `boolean` ; `deployTimeParams?`: [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  }) => `Promise`\<\{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `Uint8Array` = compiled.approvalProgram; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `Uint8Array` = compiled.clearStateProgram; `deletable?`: `boolean` ; `deployTimeParams`: `undefined` \| [`TealTemplateParams`](../interfaces/types_app.TealTemplateParams.md) ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `schema`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `updatable?`: `boolean` ; `validityWindow?`: `number` \| `bigint`  } & \{ `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ... \| ... ; `accountReferences?`: ... \| ... ; `appReferences?`: ... \| ... ; `approvalProgram`: ... \| ... ; `args?`: ... \| ... ; `assetReferences?`: ... \| ... ; `boxReferences?`: ... \| ... ; `clearStateProgram`: ... \| ... ; `extraFee?`: ... \| ... ; `extraProgramPages?`: ... \| ... ; `firstValidRound?`: ... \| ... ; `lastValidRound?`: ... \| ... ; `lease?`: ... \| ... \| ... ; `maxFee?`: ... \| ... ; `note?`: ... \| ... \| ... ; `onComplete?`: ... \| ... \| ... \| ... \| ... \| ... ; `rejectVersion?`: ... \| ... ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: ... \| ... ; `sender`: `ReadableAddress` ; `signer?`: ... \| ... \| ... ; `staticFee?`: ... \| ... ; `validityWindow?`: ... \| ... \| ...  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ... \| ... ; `accountReferences?`: ... \| ... ; `appId`: `bigint` ; `appReferences?`: ... \| ... ; `approvalProgram`: ... \| ... ; `args?`: ... \| ... ; `assetReferences?`: ... \| ... ; `boxReferences?`: ... \| ... ; `clearStateProgram`: ... \| ... ; `extraFee?`: ... \| ... ; `firstValidRound?`: ... \| ... ; `lastValidRound?`: ... \| ... ; `lease?`: ... \| ... \| ... ; `maxFee?`: ... \| ... ; `note?`: ... \| ... \| ... ; `onComplete?`: ... \| ... ; `rejectVersion?`: ... \| ... ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: ... \| ... \| ... ; `staticFee?`: ... \| ... ; `validityWindow?`: ... \| ... \| ...  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: `ABIMethod` ; `onComplete`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  }\> | - |
| `deployDelete` | (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ...[] ; `accountReferences?`: ...[] ; `appReferences?`: ...[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: ...[] ; `assetReferences?`: ...[] ; `boxReferences?`: ...[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: ... ; `globalInts`: ... ; `localByteSlices`: ... ; `localInts`: ...  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ...[] ; `accountReferences?`: ...[] ; `appId`: `bigint` ; `appReferences?`: ...[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: ...[] ; `assetReferences?`: ...[] ; `boxReferences?`: ...[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: `ABIMethod` ; `onComplete`: `DeleteApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  } | - |
| `deployUpdate` | (`params`: \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }) => \{ `accessReferences?`: `AccessReference`[] ; `accountReferences?`: `ReadableAddress`[] ; `appReferences?`: `bigint`[] ; `args?`: (`undefined` \| `ABIValue` \| [`AppMethodCallTransactionArgument`](../modules/types_composer.md#appmethodcalltransactionargument))[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `method`: `string` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `OnApplicationComplete` ; `rejectVersion?`: `number` ; `rekeyTo?`: `ReadableAddress` ; `sender?`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } & \{ `args`: `undefined` \| (`undefined` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`TransactionWithSigner`](../interfaces/index.TransactionWithSigner.md) \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ...[] ; `accountReferences?`: ...[] ; `appReferences?`: ...[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: ...[] ; `assetReferences?`: ...[] ; `boxReferences?`: ...[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOp` \| `OptIn` \| `CloseOut` \| `UpdateApplication` \| `DeleteApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `schema?`: \{ `globalByteSlices`: ... ; `globalInts`: ... ; `localByteSlices`: ... ; `localInts`: ...  } ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accessReferences?`: ...[] ; `accountReferences?`: ...[] ; `appId`: `bigint` ; `appReferences?`: ...[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: ...[] ; `assetReferences?`: ...[] ; `boxReferences?`: ...[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplication` ; `rejectVersion?`: `number` ; `rekeyTo?`: ReadableAddress \| undefined ; `sender`: `ReadableAddress` ; `signer?`: `AddressWithSigner` \| `TransactionSigner` ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppMethodCallParams`](../modules/types_composer.md#appmethodcallparams)\>)[] ; `method`: `ABIMethod` ; `onComplete`: `UpdateApplication` ; `sender`: `Address` ; `signer`: `undefined` \| `AddressWithSigner` \| `TransactionSigner`  } | - |

#### Defined in

[src/types/app-factory.ts:519](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L519)

___

### getSender

▸ **getSender**(`sender`): `Address`

Returns the sender for a call, using the `defaultSender`
if none provided and throws an error if neither provided

#### Parameters

| Name | Type |
| :------ | :------ |
| `sender` | `undefined` \| `ReadableAddress` |

#### Returns

`Address`

#### Defined in

[src/types/app-factory.ts:677](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L677)

___

### getSigner

▸ **getSigner**(`sender`, `signer`): `undefined` \| `AddressWithSigner` \| `TransactionSigner`

Returns the signer for a call, using the provided signer or the `defaultSigner`
if no signer was provided and the sender resolves to the default sender, the call will use default signer
or `undefined` otherwise (so the signer is resolved from `AlgorandClient`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `sender` | `undefined` \| `ReadableAddress` |
| `signer` | `undefined` \| `AddressWithSigner` \| `TransactionSigner` |

#### Returns

`undefined` \| `AddressWithSigner` \| `TransactionSigner`

#### Defined in

[src/types/app-factory.ts:687](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L687)

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

[src/types/app-factory.ts:579](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L579)

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

[src/types/app-factory.ts:500](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-factory.ts#L500)
