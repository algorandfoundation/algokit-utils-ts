[@algorandfoundation/algokit-utils](../README.md) / [types/app-deployer](../modules/types_app_deployer.md) / AppDeployParams

# Interface: AppDeployParams

[types/app-deployer](../modules/types_app_deployer.md).AppDeployParams

The parameters to idempotently deploy an app

## Table of contents

### Properties

- [createParams](types_app_deployer.AppDeployParams.md#createparams)
- [deleteParams](types_app_deployer.AppDeployParams.md#deleteparams)
- [deployTimeParams](types_app_deployer.AppDeployParams.md#deploytimeparams)
- [executeParams](types_app_deployer.AppDeployParams.md#executeparams)
- [existingDeployments](types_app_deployer.AppDeployParams.md#existingdeployments)
- [ignoreCache](types_app_deployer.AppDeployParams.md#ignorecache)
- [metadata](types_app_deployer.AppDeployParams.md#metadata)
- [onSchemaBreak](types_app_deployer.AppDeployParams.md#onschemabreak)
- [onUpdate](types_app_deployer.AppDeployParams.md#onupdate)
- [updateParams](types_app_deployer.AppDeployParams.md#updateparams)

## Properties

### createParams

• **createParams**: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC` ; `rekeyTo?`: `string` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } \| [`AppCreateMethodCall`](../modules/types_composer.md#appcreatemethodcall)

Create transaction parameters to use if a create needs to be issued as part of deployment

#### Defined in

[src/types/app-deployer.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L49)

___

### deleteParams

• **deleteParams**: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `DeleteApplicationOC` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } \| \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`TransactionWithSigner` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC` ; `rekeyTo?`: `string` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accountReferences?`: `string`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppCallParams`](../modules/types_composer.md#appcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `DeleteApplicationOC` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }

Delete transaction parameters to use if a delete needs to be issued as part of deployment

#### Defined in

[src/types/app-deployer.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L55)

___

### deployTimeParams

• `Optional` **deployTimeParams**: [`TealTemplateParams`](types_app.TealTemplateParams.md)

Any deploy-time parameters to replace in the TEAL code before compiling it (used if teal code is passed in as a string)

#### Defined in

[src/types/app-deployer.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L32)

___

### executeParams

• `Optional` **executeParams**: [`ExecuteParams`](types_transaction.ExecuteParams.md)

Parameters to use for transaction execution

#### Defined in

[src/types/app-deployer.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L57)

___

### existingDeployments

• `Optional` **existingDeployments**: [`AppLookup`](types_app_deployer.AppLookup.md)

Optional cached value of the existing apps for the given creator; use this to avoid an indexer lookup

#### Defined in

[src/types/app-deployer.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L59)

___

### ignoreCache

• `Optional` **ignoreCache**: `boolean`

Whether or not to ignore the app metadata cache and force a lookup, default: use the cache *

#### Defined in

[src/types/app-deployer.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L61)

___

### metadata

• **metadata**: [`AppDeployMetadata`](types_app.AppDeployMetadata.md)

The deployment metadata

#### Defined in

[src/types/app-deployer.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L30)

___

### onSchemaBreak

• `Optional` **onSchemaBreak**: [`OnSchemaBreak`](../enums/types_app.OnSchemaBreak.md) \| ``"replace"`` \| ``"fail"`` \| ``"append"``

What action to perform if a schema break (storage schema or extra pages change) is detected:

* `replace` - Delete the old app and create a new one
* `fail` - Fail the deployment (throw an error)
* `append` - Deploy a new app and leave the old one as is

#### Defined in

[src/types/app-deployer.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L39)

___

### onUpdate

• `Optional` **onUpdate**: ``"replace"`` \| ``"fail"`` \| ``"append"`` \| [`OnUpdate`](../enums/types_app.OnUpdate.md) \| ``"update"``

What action to perform if a TEAL code update is detected:

* `update` - Update the app with the new TEAL code
* `replace` - Delete the old app and create a new one
* `fail` - Fail the deployment (throw an error)
* `append` - Deploy a new app and leave the old one as is

#### Defined in

[src/types/app-deployer.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L47)

___

### updateParams

• **updateParams**: \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } \| \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `args?`: (`TransactionWithSigner` \| `Transaction` \| `ABIValue` \| `Promise`\<`Transaction`\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC` ; `rekeyTo?`: `string` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<\{ `accountReferences?`: `string`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: BoxIdentifier \| BoxReference[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }\> \| [`AppMethodCall`](../modules/types_composer.md#appmethodcall)\<[`AppCallParams`](../modules/types_composer.md#appcallparams)\>)[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](types_app_manager.BoxReference.md))[] ; `extraFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `method`: `ABIMethod` ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  }

Update transaction parameters to use if an update needs to be issued as part of deployment

#### Defined in

[src/types/app-deployer.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-deployer.ts#L51)
