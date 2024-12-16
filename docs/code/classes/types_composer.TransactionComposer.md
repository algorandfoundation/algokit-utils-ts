[@algorandfoundation/algokit-utils](../README.md) / [types/composer](../modules/types_composer.md) / TransactionComposer

# Class: TransactionComposer

[types/composer](../modules/types_composer.md).TransactionComposer

TransactionComposer helps you compose and execute transactions as a transaction group.

## Table of contents

### Constructors

- [constructor](types_composer.TransactionComposer.md#constructor)

### Properties

- [algod](types_composer.TransactionComposer.md#algod)
- [appManager](types_composer.TransactionComposer.md#appmanager)
- [atc](types_composer.TransactionComposer.md#atc)
- [defaultValidityWindow](types_composer.TransactionComposer.md#defaultvaliditywindow)
- [defaultValidityWindowIsExplicit](types_composer.TransactionComposer.md#defaultvaliditywindowisexplicit)
- [getSigner](types_composer.TransactionComposer.md#getsigner)
- [getSuggestedParams](types_composer.TransactionComposer.md#getsuggestedparams)
- [txnMaxFees](types_composer.TransactionComposer.md#txnmaxfees)
- [txns](types_composer.TransactionComposer.md#txns)
- [NULL\_SIGNER](types_composer.TransactionComposer.md#null_signer)

### Methods

- [addAppCall](types_composer.TransactionComposer.md#addappcall)
- [addAppCallMethodCall](types_composer.TransactionComposer.md#addappcallmethodcall)
- [addAppCreate](types_composer.TransactionComposer.md#addappcreate)
- [addAppCreateMethodCall](types_composer.TransactionComposer.md#addappcreatemethodcall)
- [addAppDelete](types_composer.TransactionComposer.md#addappdelete)
- [addAppDeleteMethodCall](types_composer.TransactionComposer.md#addappdeletemethodcall)
- [addAppUpdate](types_composer.TransactionComposer.md#addappupdate)
- [addAppUpdateMethodCall](types_composer.TransactionComposer.md#addappupdatemethodcall)
- [addAssetConfig](types_composer.TransactionComposer.md#addassetconfig)
- [addAssetCreate](types_composer.TransactionComposer.md#addassetcreate)
- [addAssetDestroy](types_composer.TransactionComposer.md#addassetdestroy)
- [addAssetFreeze](types_composer.TransactionComposer.md#addassetfreeze)
- [addAssetOptIn](types_composer.TransactionComposer.md#addassetoptin)
- [addAssetOptOut](types_composer.TransactionComposer.md#addassetoptout)
- [addAssetTransfer](types_composer.TransactionComposer.md#addassettransfer)
- [addAtc](types_composer.TransactionComposer.md#addatc)
- [addOfflineKeyRegistration](types_composer.TransactionComposer.md#addofflinekeyregistration)
- [addOnlineKeyRegistration](types_composer.TransactionComposer.md#addonlinekeyregistration)
- [addPayment](types_composer.TransactionComposer.md#addpayment)
- [addTransaction](types_composer.TransactionComposer.md#addtransaction)
- [build](types_composer.TransactionComposer.md#build)
- [buildAppCall](types_composer.TransactionComposer.md#buildappcall)
- [buildAssetConfig](types_composer.TransactionComposer.md#buildassetconfig)
- [buildAssetCreate](types_composer.TransactionComposer.md#buildassetcreate)
- [buildAssetDestroy](types_composer.TransactionComposer.md#buildassetdestroy)
- [buildAssetFreeze](types_composer.TransactionComposer.md#buildassetfreeze)
- [buildAssetTransfer](types_composer.TransactionComposer.md#buildassettransfer)
- [buildAtc](types_composer.TransactionComposer.md#buildatc)
- [buildKeyReg](types_composer.TransactionComposer.md#buildkeyreg)
- [buildMethodCall](types_composer.TransactionComposer.md#buildmethodcall)
- [buildPayment](types_composer.TransactionComposer.md#buildpayment)
- [buildTransactions](types_composer.TransactionComposer.md#buildtransactions)
- [buildTxn](types_composer.TransactionComposer.md#buildtxn)
- [buildTxnWithSigner](types_composer.TransactionComposer.md#buildtxnwithsigner)
- [commonTxnBuildStep](types_composer.TransactionComposer.md#commontxnbuildstep)
- [count](types_composer.TransactionComposer.md#count)
- [execute](types_composer.TransactionComposer.md#execute)
- [rebuild](types_composer.TransactionComposer.md#rebuild)
- [send](types_composer.TransactionComposer.md#send)
- [simulate](types_composer.TransactionComposer.md#simulate)
- [arc2Note](types_composer.TransactionComposer.md#arc2note)

## Constructors

### constructor

• **new TransactionComposer**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Create a `TransactionComposer`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`TransactionComposerParams`](../modules/types_composer.md#transactioncomposerparams) | The configuration for this composer |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

#### Defined in

[src/types/composer.ts:559](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L559)

## Properties

### algod

• `Private` **algod**: `AlgodClient`

The algod client used by the composer.

#### Defined in

[src/types/composer.ts:539](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L539)

___

### appManager

• `Private` **appManager**: [`AppManager`](types_app_manager.AppManager.md)

#### Defined in

[src/types/composer.ts:553](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L553)

___

### atc

• `Private` **atc**: `AtomicTransactionComposer`

The ATC used to compose the group

#### Defined in

[src/types/composer.ts:528](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L528)

___

### defaultValidityWindow

• `Private` **defaultValidityWindow**: `bigint`

The default transaction validity window

#### Defined in

[src/types/composer.ts:548](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L548)

___

### defaultValidityWindowIsExplicit

• `Private` **defaultValidityWindowIsExplicit**: `boolean` = `false`

Whether the validity window was explicitly set on construction

#### Defined in

[src/types/composer.ts:551](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L551)

___

### getSigner

• `Private` **getSigner**: (`address`: `string` \| `Address`) => `TransactionSigner`

A function that takes in an address and return a signer function for that address.

#### Type declaration

▸ (`address`): `TransactionSigner`

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` \| `Address` |

##### Returns

`TransactionSigner`

#### Defined in

[src/types/composer.ts:545](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L545)

___

### getSuggestedParams

• `Private` **getSuggestedParams**: () => `Promise`\<`SuggestedParams`\>

An async function that will return suggested params for the transaction.

#### Type declaration

▸ (): `Promise`\<`SuggestedParams`\>

##### Returns

`Promise`\<`SuggestedParams`\>

#### Defined in

[src/types/composer.ts:542](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L542)

___

### txnMaxFees

• `Private` **txnMaxFees**: `Map`\<`number`, [`AlgoAmount`](types_amount.AlgoAmount.md)\>

Map of transaction index in the atc to a max logical fee.
This is set using the value of either maxFee or staticFee.

#### Defined in

[src/types/composer.ts:533](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L533)

___

### txns

• `Private` **txns**: [`Txn`](../modules/types_composer.md#txn)[] = `[]`

Transactions that have not yet been composed

#### Defined in

[src/types/composer.ts:536](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L536)

___

### NULL\_SIGNER

▪ `Static` `Private` **NULL\_SIGNER**: `TransactionSigner`

Signer used to represent a lack of signer

#### Defined in

[src/types/composer.ts:525](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L525)

## Methods

### addAppCall

▸ **addAppCall**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an application call transaction to the transaction group.

If you want to create or update an app use `addAppCreate` or `addAppUpdate`.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppCallParams`](../modules/types_composer.md#appcallparams) | The application call transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:721](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L721)

___

### addAppCallMethodCall

▸ **addAppCallMethodCall**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add a non-create/non-update ABI method application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) | The ABI method application call transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:770](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L770)

___

### addAppCreate

▸ **addAppCreate**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an application create transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The application create transaction parameters |
| `params.accountReferences?` | (`string` \| `Address`)[] | Any account addresses to add to the [accounts array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). |
| `params.appReferences?` | `bigint`[] | The ID of any apps to load to the [foreign apps array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). |
| `params.approvalProgram` | `string` \| `Uint8Array` | The program to execute for all OnCompletes other than ClearState as raw teal that will be compiled (string) or compiled teal (encoded as a byte array (Uint8Array)). |
| `params.args?` | `Uint8Array`[] | Any [arguments to pass to the smart contract call](https://developer.algorand.org/docs/get-details/dapps/avm/teal/#argument-passing). |
| `params.assetReferences?` | `bigint`[] | The ID of any assets to load to the [foreign assets array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). |
| `params.boxReferences?` | ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] | Any boxes to load to the [boxes array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). Either the name identifier (which will be set against app ID of `0` i.e. the current app), or a box identifier with the name identifier and app ID. |
| `params.clearStateProgram` | `string` \| `Uint8Array` | The program to execute for ClearState OnComplete as raw teal that will be compiled (string) or compiled teal (encoded as a byte array (Uint8Array)). |
| `params.extraFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees. |
| `params.extraProgramPages?` | `number` | Number of extra pages required for the programs. Defaults to the number needed for the programs in this call if not specified. This is immutable once the app is created. |
| `params.firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. We recommend you only set this when you intentionally want this to be some time in the future. |
| `params.lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use `validityWindow` instead. |
| `params.lease?` | `string` \| `Uint8Array` | Prevent multiple transactions with the same lease being included within the validity window. A [lease](https://developer.algorand.org/articles/leased-transactions-securing-advanced-smart-contract-design/) enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios). |
| `params.maxFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. |
| `params.note?` | `string` \| `Uint8Array` | Note to attach to the transaction. Max of 1000 bytes. |
| `params.onComplete?` | `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC` | The [on-complete](https://developer.algorand.org/docs/get-details/dapps/avm/teal/specification/#oncomplete) action of the call; defaults to no-op. |
| `params.rekeyTo?` | `string` \| `Address` | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://developer.algorand.org/docs/get-details/accounts/rekey/). |
| `params.schema?` | `Object` | The state schema for the app. This is immutable once the app is created. |
| `params.schema.globalByteSlices` | `number` | The number of byte slices saved in global state. |
| `params.schema.globalInts` | `number` | The number of integers saved in global state. |
| `params.schema.localByteSlices` | `number` | The number of byte slices saved in local state. |
| `params.schema.localInts` | `number` | The number of integers saved in local state. |
| `params.sender` | `string` \| `Address` | The address of the account sending the transaction. |
| `params.signer?` | `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:680](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L680)

___

### addAppCreateMethodCall

▸ **addAppCreateMethodCall**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an ABI method create application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppCreateMethodCall`](../modules/types_composer.md#appcreatemethodcall) | The ABI create method application call transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:734](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L734)

___

### addAppDelete

▸ **addAppDelete**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an application delete transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppDeleteParams`](../modules/types_composer.md#appdeleteparams) | The application delete transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:706](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L706)

___

### addAppDeleteMethodCall

▸ **addAppDeleteMethodCall**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an ABI method delete application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppDeleteMethodCall`](../modules/types_composer.md#appdeletemethodcall) | The ABI delete method application call transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:758](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L758)

___

### addAppUpdate

▸ **addAppUpdate**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an application update transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The application update transaction parameters |
| `params.accountReferences?` | (`string` \| `Address`)[] | Any account addresses to add to the [accounts array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). |
| `params.appId` | `bigint` | ID of the application; 0 if the application is being created. |
| `params.appReferences?` | `bigint`[] | The ID of any apps to load to the [foreign apps array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). |
| `params.approvalProgram` | `string` \| `Uint8Array` | The program to execute for all OnCompletes other than ClearState as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) |
| `params.args?` | `Uint8Array`[] | Any [arguments to pass to the smart contract call](https://developer.algorand.org/docs/get-details/dapps/avm/teal/#argument-passing). |
| `params.assetReferences?` | `bigint`[] | The ID of any assets to load to the [foreign assets array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). |
| `params.boxReferences?` | ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] | Any boxes to load to the [boxes array](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#reference-arrays). Either the name identifier (which will be set against app ID of `0` i.e. the current app), or a box identifier with the name identifier and app ID. |
| `params.clearStateProgram` | `string` \| `Uint8Array` | The program to execute for ClearState OnComplete as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) |
| `params.extraFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees. |
| `params.firstValidRound?` | `bigint` | Set the first round this transaction is valid. If left undefined, the value from algod will be used. We recommend you only set this when you intentionally want this to be some time in the future. |
| `params.lastValidRound?` | `bigint` | The last round this transaction is valid. It is recommended to use `validityWindow` instead. |
| `params.lease?` | `string` \| `Uint8Array` | Prevent multiple transactions with the same lease being included within the validity window. A [lease](https://developer.algorand.org/articles/leased-transactions-securing-advanced-smart-contract-design/) enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios). |
| `params.maxFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. |
| `params.note?` | `string` \| `Uint8Array` | Note to attach to the transaction. Max of 1000 bytes. |
| `params.onComplete?` | `UpdateApplicationOC` | The [on-complete](https://developer.algorand.org/docs/get-details/dapps/avm/teal/specification/#oncomplete) action of the call; defaults to no-op. |
| `params.rekeyTo?` | `string` \| `Address` | Change the signing key of the sender to the given address. **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://developer.algorand.org/docs/get-details/accounts/rekey/). |
| `params.sender` | `string` \| `Address` | The address of the account sending the transaction. |
| `params.signer?` | `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) | The function used to sign transaction(s); if not specified then an attempt will be made to find a registered signer for the given `sender` or use a default signer (if configured). |
| `params.staticFee?` | [`AlgoAmount`](types_amount.AlgoAmount.md) | The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. |
| `params.validityWindow?` | `number` \| `bigint` | How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:693](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L693)

___

### addAppUpdateMethodCall

▸ **addAppUpdateMethodCall**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an ABI method update application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppUpdateMethodCall`](../modules/types_composer.md#appupdatemethodcall) | The ABI update method application call transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:746](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L746)

___

### addAssetConfig

▸ **addAssetConfig**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an asset config transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetConfigParams`](../modules/types_composer.md#assetconfigparams) | The asset config transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:612](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L612)

___

### addAssetCreate

▸ **addAssetCreate**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an asset create transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetCreateParams`](../modules/types_composer.md#assetcreateparams) | The asset create transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:601](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L601)

___

### addAssetDestroy

▸ **addAssetDestroy**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an asset destroy transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetDestroyParams`](../modules/types_composer.md#assetdestroyparams) | The asset destroy transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:634](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L634)

___

### addAssetFreeze

▸ **addAssetFreeze**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an asset freeze transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetFreezeParams`](../modules/types_composer.md#assetfreezeparams) | The asset freeze transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:623](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L623)

___

### addAssetOptIn

▸ **addAssetOptIn**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an asset opt-in transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetOptInParams`](../modules/types_composer.md#assetoptinparams) | The asset opt-in transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:656](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L656)

___

### addAssetOptOut

▸ **addAssetOptOut**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an asset opt-out transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetOptOutParams`](../modules/types_composer.md#assetoptoutparams) | The asset opt-out transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:667](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L667)

___

### addAssetTransfer

▸ **addAssetTransfer**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an asset transfer transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AssetTransferParams`](../modules/types_composer.md#assettransferparams) | The asset transfer transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:645](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L645)

___

### addAtc

▸ **addAtc**(`atc`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add the transactions within an `AtomicTransactionComposer` to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `atc` | `AtomicTransactionComposer` | The `AtomicTransactionComposer` to build transactions from and add to the group |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:802](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L802)

___

### addOfflineKeyRegistration

▸ **addOfflineKeyRegistration**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an offline key registration transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`OfflineKeyRegistrationParams`](../modules/types_composer.md#offlinekeyregistrationparams) | The offline key registration transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:791](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L791)

___

### addOnlineKeyRegistration

▸ **addOnlineKeyRegistration**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add an online key registration transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`OnlineKeyRegistrationParams`](../modules/types_composer.md#onlinekeyregistrationparams) | The online key registration transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:780](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L780)

___

### addPayment

▸ **addPayment**(`params`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add a payment transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`PaymentParams`](../modules/types_composer.md#paymentparams) | The payment transaction parameters |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:590](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L590)

___

### addTransaction

▸ **addTransaction**(`transaction`, `signer?`): [`TransactionComposer`](types_composer.TransactionComposer.md)

Add a pre-built transaction to the transaction group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `Transaction` | The pre-built transaction |
| `signer?` | `TransactionSigner` | Optional signer override for the transaction |

#### Returns

[`TransactionComposer`](types_composer.TransactionComposer.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:575](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L575)

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

[src/types/composer.ts:1322](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1322)

___

### buildAppCall

▸ **buildAppCall**(`params`, `suggestedParams`): `Promise`\<`TransactionWithContext`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | \{ `accountReferences?`: (`string` \| `Address`)[] ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `extraProgramPages?`: `number` ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `NoOpOC` \| `OptInOC` \| `CloseOutOC` \| `UpdateApplicationOC` \| `DeleteApplicationOC` ; `rekeyTo?`: `string` \| `Address` ; `schema?`: \{ `globalByteSlices`: `number` ; `globalInts`: `number` ; `localByteSlices`: `number` ; `localInts`: `number`  } ; `sender`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } \| \{ `accountReferences?`: (`string` \| `Address`)[] ; `appId`: `bigint` ; `appReferences?`: `bigint`[] ; `approvalProgram`: `string` \| `Uint8Array` ; `args?`: `Uint8Array`[] ; `assetReferences?`: `bigint`[] ; `boxReferences?`: ([`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](../interfaces/types_app_manager.BoxReference.md))[] ; `clearStateProgram`: `string` \| `Uint8Array` ; `extraFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `firstValidRound?`: `bigint` ; `lastValidRound?`: `bigint` ; `lease?`: `string` \| `Uint8Array` ; `maxFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `note?`: `string` \| `Uint8Array` ; `onComplete?`: `UpdateApplicationOC` ; `rekeyTo?`: `string` \| `Address` ; `sender`: `string` \| `Address` ; `signer?`: `TransactionSigner` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md) ; `staticFee?`: [`AlgoAmount`](types_amount.AlgoAmount.md) ; `validityWindow?`: `number` \| `bigint`  } \| [`AppCallParams`](../modules/types_composer.md#appcallparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Promise`\<`TransactionWithContext`\>

#### Defined in

[src/types/composer.ts:1141](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1141)

___

### buildAssetConfig

▸ **buildAssetConfig**(`params`, `suggestedParams`): `TransactionWithContext`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetConfigParams`](../modules/types_composer.md#assetconfigparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`TransactionWithContext`

#### Defined in

[src/types/composer.ts:1098](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1098)

___

### buildAssetCreate

▸ **buildAssetCreate**(`params`, `suggestedParams`): `TransactionWithContext`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetCreateParams`](../modules/types_composer.md#assetcreateparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`TransactionWithContext`

#### Defined in

[src/types/composer.ts:1080](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1080)

___

### buildAssetDestroy

▸ **buildAssetDestroy**(`params`, `suggestedParams`): `TransactionWithContext`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetDestroyParams`](../modules/types_composer.md#assetdestroyparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`TransactionWithContext`

#### Defined in

[src/types/composer.ts:1111](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1111)

___

### buildAssetFreeze

▸ **buildAssetFreeze**(`params`, `suggestedParams`): `TransactionWithContext`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetFreezeParams`](../modules/types_composer.md#assetfreezeparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`TransactionWithContext`

#### Defined in

[src/types/composer.ts:1119](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1119)

___

### buildAssetTransfer

▸ **buildAssetTransfer**(`params`, `suggestedParams`): `TransactionWithContext`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetTransferParams`](../modules/types_composer.md#assettransferparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`TransactionWithContext`

#### Defined in

[src/types/composer.ts:1129](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1129)

___

### buildAtc

▸ **buildAtc**(`atc`): `TransactionWithSignerAndContext`[]

Build an ATC and return transactions ready to be incorporated into a broader set of transactions this composer is composing

#### Parameters

| Name | Type |
| :------ | :------ |
| `atc` | `AtomicTransactionComposer` |

#### Returns

`TransactionWithSignerAndContext`[]

#### Defined in

[src/types/composer.ts:808](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L808)

___

### buildKeyReg

▸ **buildKeyReg**(`params`, `suggestedParams`): `TransactionWithContext`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`OnlineKeyRegistrationParams`](../modules/types_composer.md#onlinekeyregistrationparams) \| [`OfflineKeyRegistrationParams`](../modules/types_composer.md#offlinekeyregistrationparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`TransactionWithContext`

#### Defined in

[src/types/composer.ts:1192](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1192)

___

### buildMethodCall

▸ **buildMethodCall**(`params`, `suggestedParams`, `includeSigner`): `Promise`\<`TransactionWithSignerAndContext`[]\>

Builds an ABI method call transaction and any other associated transactions represented in the ABI args.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppCreateMethodCall`](../modules/types_composer.md#appcreatemethodcall) \| [`AppUpdateMethodCall`](../modules/types_composer.md#appupdatemethodcall) \| [`AppCallMethodCall`](../modules/types_composer.md#appcallmethodcall) | - |
| `suggestedParams` | `SuggestedParams` | - |
| `includeSigner` | `boolean` | Whether to include the actual signer for the transactions. If you are just building transactions without signers yet then set this to `false`. |

#### Returns

`Promise`\<`TransactionWithSignerAndContext`[]\>

#### Defined in

[src/types/composer.ts:888](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L888)

___

### buildPayment

▸ **buildPayment**(`params`, `suggestedParams`): `TransactionWithContext`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`PaymentParams`](../modules/types_composer.md#paymentparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`TransactionWithContext`

#### Defined in

[src/types/composer.ts:1070](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1070)

___

### buildTransactions

▸ **buildTransactions**(): `Promise`\<[`BuiltTransactions`](../interfaces/types_composer.BuiltTransactions.md)\>

Compose all of the transactions without signers and return the transaction objects directly along with any ABI method calls.

#### Returns

`Promise`\<[`BuiltTransactions`](../interfaces/types_composer.BuiltTransactions.md)\>

The array of built transactions and any corresponding method calls

#### Defined in

[src/types/composer.ts:1270](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1270)

___

### buildTxn

▸ **buildTxn**(`txn`, `suggestedParams`): `Promise`\<`TransactionWithContext`[]\>

Builds all transaction types apart from `txnWithSigner`, `atc` and `methodCall` since those ones can have custom signers that need to be retrieved.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txn` | [`Txn`](../modules/types_composer.md#txn) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Promise`\<`TransactionWithContext`[]\>

#### Defined in

[src/types/composer.ts:1215](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1215)

___

### buildTxnWithSigner

▸ **buildTxnWithSigner**(`txn`, `suggestedParams`): `Promise`\<`TransactionWithSignerAndContext`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txn` | [`Txn`](../modules/types_composer.md#txn) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Promise`\<`TransactionWithSignerAndContext`[]\>

#### Defined in

[src/types/composer.ts:1242](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1242)

___

### commonTxnBuildStep

▸ **commonTxnBuildStep**\<`TParams`\>(`buildTxn`, `params`, `txnParams`): `TransactionWithContext`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `CommonTransactionParams` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `buildTxn` | (`params`: `TParams`) => `Transaction` |
| `params` | [`CommonTransactionParams`](../modules/types_composer.md#commontransactionparams) |
| `txnParams` | `TParams` |

#### Returns

`TransactionWithContext`

#### Defined in

[src/types/composer.ts:830](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L830)

___

### count

▸ **count**(): `Promise`\<`number`\>

Get the number of transactions currently added to this composer.

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/types/composer.ts:1309](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1309)

___

### execute

▸ **execute**(`params?`): `Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params?` | [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters to control execution with |

#### Returns

`Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md)\>

The execution result

**`Deprecated`**

Use `send` instead.

Compose the atomic transaction group and send it to the network

An alias for `composer.send(params)`.

#### Defined in

[src/types/composer.ts:1408](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1408)

___

### rebuild

▸ **rebuild**(): `Promise`\<\{ `atc`: `AtomicTransactionComposer` ; `methodCalls`: `any` ; `transactions`: `TransactionWithSigner`[]  }\>

Rebuild the group, discarding any previously built transactions.
This will potentially cause new signers and suggested params to be used if the callbacks return a new value compared to the first build.

#### Returns

`Promise`\<\{ `atc`: `AtomicTransactionComposer` ; `methodCalls`: `any` ; `transactions`: `TransactionWithSigner`[]  }\>

The newly built atomic transaction composer and the transactions

#### Defined in

[src/types/composer.ts:1357](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1357)

___

### send

▸ **send**(`params?`): `Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md)\>

Compose the atomic transaction group and send it to the network.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params?` | [`SendParams`](../interfaces/types_transaction.SendParams.md) | The parameters to control execution with |

#### Returns

`Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md)\>

The execution result

#### Defined in

[src/types/composer.ts:1367](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1367)

___

### simulate

▸ **simulate**(): `Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & \{ `simulateResponse`: `SimulateResponse`  }\>

Compose the atomic transaction group and simulate sending it to the network

#### Returns

`Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & \{ `simulateResponse`: `SimulateResponse`  }\>

The simulation result

#### Defined in

[src/types/composer.ts:1416](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1416)

▸ **simulate**(`options`): `Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & \{ `simulateResponse`: `SimulateResponse`  }\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.allowMoreLogging?` | `boolean` | - |
| `options.allowUnnamedResources?` | `boolean` | - |
| `options.execTraceConfig?` | `SimulateTraceConfig` | - |
| `options.extraOpcodeBudget?` | `number` \| `bigint` | - |
| `options.round?` | `number` \| `bigint` | - |
| `options.skipSignatures` | `boolean` | Whether or not to skip signatures for all built transactions and use an empty signer instead. This will set `fixSigners` and `allowEmptySignatures` when sending the request to the algod API. |

#### Returns

`Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & \{ `simulateResponse`: `SimulateResponse`  }\>

#### Defined in

[src/types/composer.ts:1417](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1417)

▸ **simulate**(`options`): `Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & \{ `simulateResponse`: `SimulateResponse`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.allowEmptySignatures?` | `boolean` |
| `options.allowMoreLogging?` | `boolean` |
| `options.allowUnnamedResources?` | `boolean` |
| `options.execTraceConfig?` | `SimulateTraceConfig` |
| `options.extraOpcodeBudget?` | `number` \| `bigint` |
| `options.fixSigners?` | `boolean` |
| `options.round?` | `number` \| `bigint` |

#### Returns

`Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md) & \{ `simulateResponse`: `SimulateResponse`  }\>

#### Defined in

[src/types/composer.ts:1420](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1420)

___

### arc2Note

▸ **arc2Note**(`note`): `Uint8Array`

Create an encoded transaction note that follows the ARC-2 spec.

https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `note` | [`Arc2TransactionNote`](../modules/types_transaction.md#arc2transactionnote) | The ARC-2 transaction note data |

#### Returns

`Uint8Array`

The binary encoded transaction note

#### Defined in

[src/types/composer.ts:1497](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1497)
