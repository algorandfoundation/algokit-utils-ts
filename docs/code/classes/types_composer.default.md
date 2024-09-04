[@algorandfoundation/algokit-utils](../README.md) / [types/composer](../modules/types_composer.md) / default

# Class: default

[types/composer](../modules/types_composer.md).default

AlgoKit Composer helps you compose and execute transactions as a transaction group.

## Table of contents

### Constructors

- [constructor](types_composer.default.md#constructor)

### Properties

- [algod](types_composer.default.md#algod)
- [appManager](types_composer.default.md#appmanager)
- [atc](types_composer.default.md#atc)
- [defaultValidityWindow](types_composer.default.md#defaultvaliditywindow)
- [defaultValidityWindowIsExplicit](types_composer.default.md#defaultvaliditywindowisexplicit)
- [getSigner](types_composer.default.md#getsigner)
- [getSuggestedParams](types_composer.default.md#getsuggestedparams)
- [txnMethodMap](types_composer.default.md#txnmethodmap)
- [txns](types_composer.default.md#txns)
- [NULL\_SIGNER](types_composer.default.md#null_signer)

### Methods

- [addAppCall](types_composer.default.md#addappcall)
- [addAppCallMethodCall](types_composer.default.md#addappcallmethodcall)
- [addAppCreate](types_composer.default.md#addappcreate)
- [addAppCreateMethodCall](types_composer.default.md#addappcreatemethodcall)
- [addAppDelete](types_composer.default.md#addappdelete)
- [addAppDeleteMethodCall](types_composer.default.md#addappdeletemethodcall)
- [addAppUpdate](types_composer.default.md#addappupdate)
- [addAppUpdateMethodCall](types_composer.default.md#addappupdatemethodcall)
- [addAssetConfig](types_composer.default.md#addassetconfig)
- [addAssetCreate](types_composer.default.md#addassetcreate)
- [addAssetDestroy](types_composer.default.md#addassetdestroy)
- [addAssetFreeze](types_composer.default.md#addassetfreeze)
- [addAssetOptIn](types_composer.default.md#addassetoptin)
- [addAssetOptOut](types_composer.default.md#addassetoptout)
- [addAssetTransfer](types_composer.default.md#addassettransfer)
- [addAtc](types_composer.default.md#addatc)
- [addOnlineKeyRegistration](types_composer.default.md#addonlinekeyregistration)
- [addPayment](types_composer.default.md#addpayment)
- [addTransaction](types_composer.default.md#addtransaction)
- [build](types_composer.default.md#build)
- [buildAppCall](types_composer.default.md#buildappcall)
- [buildAssetConfig](types_composer.default.md#buildassetconfig)
- [buildAssetCreate](types_composer.default.md#buildassetcreate)
- [buildAssetDestroy](types_composer.default.md#buildassetdestroy)
- [buildAssetFreeze](types_composer.default.md#buildassetfreeze)
- [buildAssetTransfer](types_composer.default.md#buildassettransfer)
- [buildAtc](types_composer.default.md#buildatc)
- [buildKeyReg](types_composer.default.md#buildkeyreg)
- [buildMethodCall](types_composer.default.md#buildmethodcall)
- [buildPayment](types_composer.default.md#buildpayment)
- [buildTransactions](types_composer.default.md#buildtransactions)
- [buildTxn](types_composer.default.md#buildtxn)
- [buildTxnWithSigner](types_composer.default.md#buildtxnwithsigner)
- [commonTxnBuildStep](types_composer.default.md#commontxnbuildstep)
- [count](types_composer.default.md#count)
- [execute](types_composer.default.md#execute)
- [rebuild](types_composer.default.md#rebuild)
- [simulate](types_composer.default.md#simulate)
- [arc2Note](types_composer.default.md#arc2note)

## Constructors

### constructor

• **new default**(`params`): [`default`](types_composer.default.md)

Create an `AlgoKitComposer`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AlgoKitComposerParams`](../modules/types_composer.md#algokitcomposerparams) | The configuration for this composer |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:513](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L513)
=======
[src/types/composer.ts:488](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L488)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

## Properties

### algod

• `Private` **algod**: `default`

The algod client used by the composer.

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:493](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L493)
=======
[src/types/composer.ts:468](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L468)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### appManager

• `Private` **appManager**: [`AppManager`](types_app_manager.AppManager.md)

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:507](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L507)
=======
[src/types/composer.ts:482](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L482)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### atc

• `Private` **atc**: `AtomicTransactionComposer`

The ATC used to compose the group

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:484](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L484)
=======
[src/types/composer.ts:459](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L459)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### defaultValidityWindow

• `Private` **defaultValidityWindow**: `number` = `10`

The default transaction validity window

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:502](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L502)
=======
[src/types/composer.ts:477](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L477)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### defaultValidityWindowIsExplicit

• `Private` **defaultValidityWindowIsExplicit**: `boolean` = `false`

Whether the validity window was explicitly set on construction

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:505](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L505)
=======
[src/types/composer.ts:480](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L480)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### getSigner

• `Private` **getSigner**: (`address`: `string`) => `TransactionSigner`

A function that takes in an address and return a signer function for that address.

#### Type declaration

▸ (`address`): `TransactionSigner`

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

##### Returns

`TransactionSigner`

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:499](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L499)
=======
[src/types/composer.ts:474](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L474)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### getSuggestedParams

• `Private` **getSuggestedParams**: () => `Promise`\<`SuggestedParams`\>

An async function that will return suggested params for the transaction.

#### Type declaration

▸ (): `Promise`\<`SuggestedParams`\>

##### Returns

`Promise`\<`SuggestedParams`\>

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:496](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L496)
=======
[src/types/composer.ts:471](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L471)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### txnMethodMap

• `Private` **txnMethodMap**: `Map`\<`string`, `ABIMethod`\>

Map of txid to ABI method

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:487](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L487)
=======
[src/types/composer.ts:462](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L462)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### txns

• `Private` **txns**: `Txn`[] = `[]`

Transactions that have not yet been composed

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:490](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L490)
=======
[src/types/composer.ts:465](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L465)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### NULL\_SIGNER

▪ `Static` `Private` **NULL\_SIGNER**: `TransactionSigner`

Signer used to represent a lack of signer

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:481](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L481)
=======
[src/types/composer.ts:456](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L456)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

## Methods

### addAppCall

▸ **addAppCall**(`params`): [`default`](types_composer.default.md)

Add an application call transaction to the transaction group.

If you want to create or update an app use `addAppCreate` or `addAppUpdate`.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppCallParams`](../modules/types_composer.md#appcallparams) | The application call transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:675](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L675)
=======
[src/types/composer.ts:634](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L634)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addAppCallMethodCall

▸ **addAppCallMethodCall**(`params`): [`default`](types_composer.default.md)

Add a non-create/non-update ABI method application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) | The ABI method application call transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:724](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L724)
=======
[src/types/composer.ts:683](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L683)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addAppCreate

▸ **addAppCreate**(`params`): [`default`](types_composer.default.md)

Add an application create transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The application create transaction parameters |
| `params.accountReferences?` | `string`[] | Any account addresses to add to the [accounts array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). |
| `params.appReferences?` | `bigint`[] | The ID of any apps to load to the [foreign apps array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). |
| `params.approvalProgram` | `string` \| `Uint8Array` | The program to execute for all OnCompletes other than ClearState as raw teal that will be compiled (string) or compiled teal (encoded as a byte array (Uint8Array)). |
| `params.args?` | `Uint8Array`[] | Any [arguments to pass to the smart contract call](https://developer.algorand.org/docs/get-details/dapps/avm/teal/#argument-passing). |
| `params.assetReferences?` | `bigint`[] | The ID of any assets to load to the [foreign assets array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). |
| `params.boxReferences?` | ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] | Any boxes to load to the [boxes array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). Either the name identifier (which will be set against app ID of `0` i.e. the current app), or a box identifier with the name identifier and app ID. |
| `params.clearStateProgram` | `string` \| `Uint8Array` | The program to execute for ClearState OnComplete as raw teal that will be compiled (string) or compiled teal (encoded as a byte array (Uint8Array)). |
| `params.extraFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for covering inner transaction fees. |
| `params.extraProgramPages?` | `number` | Number of extra pages required for the programs. Defaults to the number needed for the programs in this call if not specified. This is immutable once the app is created. |
| `params.firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. We recommend you only set this when you intentionally want this to be some time in the future. |
| `params.lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use `validityWindow` instead. |
| `params.lease?` | `string` \| `Uint8Array` | Prevent multiple transactions with the same lease being included within the validity window. A [lease](https://developer.algorand.org/articles/leased-transactions-securing-advanced-smart-contract-design/) enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios). |
| `params.maxFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. |
| `params.note?` | `string` \| `Uint8Array` | Note to attach to the transaction. Max of 1000 bytes. |
| `params.onComplete?` | `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC` | The [on-complete](https://developer.algorand.org/docs/get-details/dapps/avm/teal/specification/#oncomplete) action of the call; defaults to no-op. |
| `params.rekeyTo?` | `string` | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://developer.algorand.org/docs/get-details/accounts/rekey/). |
| `params.schema?` | `Object` | The state schema for the app. This is immutable once the app is created. |
| `params.schema.globalByteSlices` | `number` | The number of byte slices saved in global state. |
| `params.schema.globalInts` | `number` | The number of integers saved in global state. |
| `params.schema.localByteSlices` | `number` | The number of byte slices saved in local state. |
| `params.schema.localInts` | `number` | The number of integers saved in local state. |
| `params.sender` | `string` | The address of the account sending the transaction. |
| `params.signer?` | `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:634](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L634)
=======
[src/types/composer.ts:593](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L593)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addAppCreateMethodCall

▸ **addAppCreateMethodCall**(`params`): [`default`](types_composer.default.md)

Add an ABI method create application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppCreateMethodCall`](../modules/types_composer.md#appcreatemethodcall) | The ABI create method application call transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:688](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L688)
=======
[src/types/composer.ts:647](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L647)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addAppDelete

▸ **addAppDelete**(`params`): [`default`](types_composer.default.md)

Add an application delete transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppDeleteParams`](../modules/types_composer.md#appdeleteparams) | The application delete transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:660](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L660)
=======
[src/types/composer.ts:619](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L619)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addAppDeleteMethodCall

▸ **addAppDeleteMethodCall**(`params`): [`default`](types_composer.default.md)

Add an ABI method delete application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppDeleteMethodCall`](../modules/types_composer.md#appdeletemethodcall) | The ABI delete method application call transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:712](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L712)
=======
[src/types/composer.ts:671](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L671)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addAppUpdate

▸ **addAppUpdate**(`params`): [`default`](types_composer.default.md)

Add an application update transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The application update transaction parameters |
| `params.accountReferences?` | `string`[] | Any account addresses to add to the [accounts array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). |
| `params.appId` | `bigint` | ID of the application; 0 if the application is being created. |
| `params.appReferences?` | `bigint`[] | The ID of any apps to load to the [foreign apps array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). |
| `params.approvalProgram` | `string` \| `Uint8Array` | The program to execute for all OnCompletes other than ClearState as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) |
| `params.args?` | `Uint8Array`[] | Any [arguments to pass to the smart contract call](https://developer.algorand.org/docs/get-details/dapps/avm/teal/#argument-passing). |
| `params.assetReferences?` | `bigint`[] | The ID of any assets to load to the [foreign assets array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). |
| `params.boxReferences?` | ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] | Any boxes to load to the [boxes array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). Either the name identifier (which will be set against app ID of `0` i.e. the current app), or a box identifier with the name identifier and app ID. |
| `params.clearStateProgram` | `string` \| `Uint8Array` | The program to execute for ClearState OnComplete as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) |
| `params.extraFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for covering inner transaction fees. |
| `params.firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. We recommend you only set this when you intentionally want this to be some time in the future. |
| `params.lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use `validityWindow` instead. |
| `params.lease?` | `string` \| `Uint8Array` | Prevent multiple transactions with the same lease being included within the validity window. A [lease](https://developer.algorand.org/articles/leased-transactions-securing-advanced-smart-contract-design/) enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios). |
| `params.maxFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. |
| `params.note?` | `string` \| `Uint8Array` | Note to attach to the transaction. Max of 1000 bytes. |
| `params.onComplete?` | `UpdateApplicationOC` | The [on-complete](https://developer.algorand.org/docs/get-details/dapps/avm/teal/specification/#oncomplete) action of the call; defaults to no-op. |
| `params.rekeyTo?` | `string` | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://developer.algorand.org/docs/get-details/accounts/rekey/). |
| `params.sender` | `string` | The address of the account sending the transaction. |
| `params.signer?` | `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:647](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L647)
=======
[src/types/composer.ts:606](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L606)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addAppUpdateMethodCall

▸ **addAppUpdateMethodCall**(`params`): [`default`](types_composer.default.md)

Add an ABI method update application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppUpdateMethodCall`](../modules/types_composer.md#appupdatemethodcall) | The ABI update method application call transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:700](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L700)
=======
[src/types/composer.ts:659](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L659)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addAssetConfig

▸ **addAssetConfig**(`params`): [`default`](types_composer.default.md)

Add an asset config transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetConfigParams`](../modules/types_composer.md#assetconfigparams) | The asset config transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:566](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L566)
=======
[src/types/composer.ts:525](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L525)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addAssetCreate

▸ **addAssetCreate**(`params`): [`default`](types_composer.default.md)

Add an asset create transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetCreateParams`](../modules/types_composer.md#assetcreateparams) | The asset create transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:555](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L555)
=======
[src/types/composer.ts:514](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L514)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addAssetDestroy

▸ **addAssetDestroy**(`params`): [`default`](types_composer.default.md)

Add an asset destroy transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetDestroyParams`](../modules/types_composer.md#assetdestroyparams) | The asset destroy transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:588](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L588)
=======
[src/types/composer.ts:547](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L547)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addAssetFreeze

▸ **addAssetFreeze**(`params`): [`default`](types_composer.default.md)

Add an asset freeze transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetFreezeParams`](../modules/types_composer.md#assetfreezeparams) | The asset freeze transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:577](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L577)
=======
[src/types/composer.ts:536](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L536)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addAssetOptIn

▸ **addAssetOptIn**(`params`): [`default`](types_composer.default.md)

Add an asset opt-in transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetOptInParams`](../modules/types_composer.md#assetoptinparams) | The asset opt-in transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:610](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L610)
=======
[src/types/composer.ts:569](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L569)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addAssetOptOut

▸ **addAssetOptOut**(`params`): [`default`](types_composer.default.md)

Add an asset opt-out transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetOptOutParams`](../modules/types_composer.md#assetoptoutparams) | The asset opt-out transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:621](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L621)
=======
[src/types/composer.ts:580](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L580)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addAssetTransfer

▸ **addAssetTransfer**(`params`): [`default`](types_composer.default.md)

Add an asset transfer transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetTransferParams`](../modules/types_composer.md#assettransferparams) | The asset transfer transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:599](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L599)
=======
[src/types/composer.ts:558](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L558)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addAtc

▸ **addAtc**(`atc`): [`default`](types_composer.default.md)

Add the transactions within an `AtomicTransactionComposer` to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `atc` | `AtomicTransactionComposer` | The `AtomicTransactionComposer` to build transactions from and add to the group |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:745](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L745)
=======
[src/types/composer.ts:704](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L704)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addOnlineKeyRegistration

▸ **addOnlineKeyRegistration**(`params`): [`default`](types_composer.default.md)

Add an online key registration transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`OnlineKeyRegistrationParams`](../modules/types_composer.md#onlinekeyregistrationparams) | The online key registration transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:734](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L734)
=======
[src/types/composer.ts:693](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L693)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### addPayment

▸ **addPayment**(`params`): [`default`](types_composer.default.md)

Add a payment transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`PaymentParams`](../modules/types_composer.md#paymentparams) | The payment transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:544](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L544)

___

### addTransaction

▸ **addTransaction**(`transaction`, `signer?`): [`default`](types_composer.default.md)

Add a pre-built transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `Transaction` | The pre-built transaction |
| `signer?` | `TransactionSigner` | Optional signer override for the transaction |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:529](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L529)
=======
[src/types/composer.ts:503](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L503)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### build

▸ **build**(): `Promise`\<\{ `atc`: `AtomicTransactionComposer` ; `methodCalls`: `any` ; `transactions`: `TransactionWithSigner`[]  }\>

Compose all of the transactions in a single atomic transaction group and an atomic transaction composer.

You can then use the transactions standalone, or use the composer to execute or simulate the transactions.

Once this method is called, no further transactions will be able to be added.
You can safely call this method multiple times to get the same result.

#### Returns

`Promise`\<\{ `atc`: `AtomicTransactionComposer` ; `methodCalls`: `any` ; `transactions`: `TransactionWithSigner`[]  }\>

The built atomic transaction composer and the transactions

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:1185](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1185)
=======
[src/types/composer.ts:1139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1139)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### buildAppCall

▸ **buildAppCall**(`params`, `suggestedParams`): `Promise`\<`Transaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | \{ `accountReferences?`: `string`[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC` ; `rekeyTo?`: `string` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } \| \{ `accountReferences?`: `string`[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` ; `sender`: `string` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number`  } \| [`AppCallParams`](../modules/types_composer.md#appcallparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Promise`\<`Transaction`\>

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:1008](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1008)
=======
[src/types/composer.ts:962](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L962)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### buildAssetConfig

▸ **buildAssetConfig**(`params`, `suggestedParams`): `Transaction`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetConfigParams`](../modules/types_composer.md#assetconfigparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Transaction`

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:957](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L957)
=======
[src/types/composer.ts:911](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L911)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### buildAssetCreate

▸ **buildAssetCreate**(`params`, `suggestedParams`): `Transaction`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetCreateParams`](../modules/types_composer.md#assetcreateparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Transaction`

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:937](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L937)
=======
[src/types/composer.ts:891](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L891)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### buildAssetDestroy

▸ **buildAssetDestroy**(`params`, `suggestedParams`): `Transaction`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetDestroyParams`](../modules/types_composer.md#assetdestroyparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Transaction`

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:972](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L972)
=======
[src/types/composer.ts:926](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L926)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### buildAssetFreeze

▸ **buildAssetFreeze**(`params`, `suggestedParams`): `Transaction`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetFreezeParams`](../modules/types_composer.md#assetfreezeparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Transaction`

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:982](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L982)
=======
[src/types/composer.ts:936](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L936)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### buildAssetTransfer

▸ **buildAssetTransfer**(`params`, `suggestedParams`): `Transaction`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetTransferParams`](../modules/types_composer.md#assettransferparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Transaction`

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:994](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L994)
=======
[src/types/composer.ts:948](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L948)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### buildAtc

▸ **buildAtc**(`atc`, `processTransaction?`): `TransactionWithSigner`[]

Build an ATC and return transactions ready to be incorporated into a broader set of transactions this composer is composing

#### Parameters

| Name | Type |
| :------ | :------ |
| `atc` | `AtomicTransactionComposer` |
| `processTransaction?` | (`txn`: `Transaction`, `index`: `number`) => `Transaction` |

#### Returns

`TransactionWithSigner`[]

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:751](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L751)
=======
[src/types/composer.ts:710](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L710)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### buildKeyReg

▸ **buildKeyReg**(`params`, `suggestedParams`): `Transaction`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`OnlineKeyRegistrationParams`](../modules/types_composer.md#onlinekeyregistrationparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Transaction`

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:1063](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1063)
=======
[src/types/composer.ts:1017](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1017)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### buildMethodCall

▸ **buildMethodCall**(`params`, `suggestedParams`, `includeSigner`): `Promise`\<`TransactionWithSigner`[]\>

Builds an ABI method call transaction and any other associated transactions represented in the ABI args.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppCreateMethodCall`](../modules/types_composer.md#appcreatemethodcall) \| [`AppUpdateMethodCall`](../modules/types_composer.md#appupdatemethodcall) \| [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) | - |
| `suggestedParams` | `SuggestedParams` | - |
| `includeSigner` | `boolean` | Whether to include the actual signer for the transactions. If you are just building transactions without signers yet then set this to `false`. |

#### Returns

`Promise`\<`TransactionWithSigner`[]\>

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:817](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L817)
=======
[src/types/composer.ts:776](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L776)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### buildPayment

▸ **buildPayment**(`params`, `suggestedParams`): `Transaction`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`PaymentParams`](../modules/types_composer.md#paymentparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Transaction`

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:925](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L925)
=======
[src/types/composer.ts:879](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L879)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### buildTransactions

▸ **buildTransactions**(): `Promise`\<[`BuiltTransactions`](../interfaces/types_composer.BuiltTransactions.md)\>

Compose all of the transactions without signers and return the transaction objects directly along with any ABI method calls.

#### Returns

`Promise`\<[`BuiltTransactions`](../interfaces/types_composer.BuiltTransactions.md)\>

The array of built transactions and any corresponding method calls

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:1132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1132)
=======
[src/types/composer.ts:1086](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1086)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### buildTxn

▸ **buildTxn**(`txn`, `suggestedParams`): `Promise`\<`Transaction`[]\>

Builds all transaction types apart from `txnWithSigner`, `atc` and `methodCall` since those ones can have custom signers that need to be retrieved.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txn` | `Txn` |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Promise`\<`Transaction`[]\>

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:1082](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1082)
=======
[src/types/composer.ts:1036](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1036)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### buildTxnWithSigner

▸ **buildTxnWithSigner**(`txn`, `suggestedParams`): `Promise`\<`TransactionWithSigner`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txn` | `Txn` |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Promise`\<`TransactionWithSigner`[]\>

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:1109](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1109)
=======
[src/types/composer.ts:1063](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1063)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### commonTxnBuildStep

▸ **commonTxnBuildStep**(`params`, `txn`, `suggestedParams`): `Transaction`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) |
| `txn` | `Transaction` |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Transaction`

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:772](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L772)
=======
[src/types/composer.ts:731](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L731)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### count

▸ **count**(): `Promise`\<`number`\>

Get the number of transactions currently added to this composer.

#### Returns

`Promise`\<`number`\>

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:1172](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1172)
=======
[src/types/composer.ts:1126](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1126)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### execute

▸ **execute**(`params?`): `Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md)\>

Compose the atomic transaction group and send it to the network

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params?` | [`ExecuteParams`](../interfaces/types_transaction.ExecuteParams.md) | The parameters to control execution with |

#### Returns

`Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md)\>

The execution result

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:1224](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1224)
=======
[src/types/composer.ts:1178](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1178)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### rebuild

▸ **rebuild**(): `Promise`\<\{ `atc`: `AtomicTransactionComposer` ; `methodCalls`: `any` ; `transactions`: `TransactionWithSigner`[]  }\>

Rebuild the group, discarding any previously built transactions.
This will potentially cause new signers and suggested params to be used if the callbacks return a new value compared to the first build.

#### Returns

`Promise`\<\{ `atc`: `AtomicTransactionComposer` ; `methodCalls`: `any` ; `transactions`: `TransactionWithSigner`[]  }\>

The newly built atomic transaction composer and the transactions

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:1214](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1214)
=======
[src/types/composer.ts:1168](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1168)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### simulate

<<<<<<< HEAD
▸ **simulate**(`options?`): `Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & \{ `simulateResponse`: `SimulateResponse`  }\>

Compose the atomic transaction group and simulate sending it to the network

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.allowEmptySignatures?` | `boolean` |
| `options.allowMoreLogging?` | `boolean` |
| `options.allowUnnamedResources?` | `boolean` |
| `options.execTraceConfig?` | `SimulateTraceConfig` |
| `options.extraOpcodeBudget?` | `number` \| `bigint` |
| `options.round?` | `number` \| `bigint` |

=======
▸ **simulate**(): `Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & \{ `simulateResponse`: `SimulateResponse`  }\>

Compose the atomic transaction group and simulate sending it to the network

>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
#### Returns

`Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & \{ `simulateResponse`: `SimulateResponse`  }\>

The simulation result

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:1251](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1251)
=======
[src/types/composer.ts:1205](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1205)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)

___

### arc2Note

▸ **arc2Note**(`note`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `note` | [`Arc2TransactionNote`](../modules/types_transaction.md#arc2transactionnote) |

#### Returns

`Uint8Array`

#### Defined in

<<<<<<< HEAD
[src/types/composer.ts:1291](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1291)
=======
[src/types/composer.ts:1241](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1241)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
