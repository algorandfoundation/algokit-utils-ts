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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:513](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L513)
=======
[src/types/composer.ts:488](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L488)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:491](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L491)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:493](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L493)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:509](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L509)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

## Properties

### algod

• `Private` **algod**: `default`

The algod client used by the composer.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:493](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L493)
=======
[src/types/composer.ts:468](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L468)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:471](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L471)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:473](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L473)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:489](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L489)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### appManager

• `Private` **appManager**: [`AppManager`](types_app_manager.AppManager.md)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:507](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L507)
=======
[src/types/composer.ts:482](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L482)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:485](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L485)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:487](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L487)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:503](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L503)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### atc

• `Private` **atc**: `AtomicTransactionComposer`

The ATC used to compose the group

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:484](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L484)
=======
[src/types/composer.ts:459](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L459)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:462](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L462)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:464](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L464)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:480](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L480)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### defaultValidityWindow

• `Private` **defaultValidityWindow**: `number` = `10`

The default transaction validity window

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:502](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L502)
=======
[src/types/composer.ts:477](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L477)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:480](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L480)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:482](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L482)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:498](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L498)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### defaultValidityWindowIsExplicit

• `Private` **defaultValidityWindowIsExplicit**: `boolean` = `false`

Whether the validity window was explicitly set on construction

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:505](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L505)
=======
[src/types/composer.ts:480](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L480)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:483](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L483)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:485](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L485)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:501](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L501)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:499](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L499)
=======
[src/types/composer.ts:474](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L474)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:477](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L477)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:479](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L479)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:495](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L495)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:496](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L496)
=======
[src/types/composer.ts:471](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L471)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:474](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L474)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:476](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L476)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:492](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L492)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### txnMethodMap

• `Private` **txnMethodMap**: `Map`\<`string`, `ABIMethod`\>

Map of txid to ABI method

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:487](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L487)
=======
[src/types/composer.ts:462](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L462)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:465](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L465)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:467](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L467)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:483](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L483)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### txns

• `Private` **txns**: `Txn`[] = `[]`

Transactions that have not yet been composed

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:490](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L490)
=======
[src/types/composer.ts:465](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L465)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:468](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L468)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:470](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L470)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:486](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L486)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### NULL\_SIGNER

▪ `Static` `Private` **NULL\_SIGNER**: `TransactionSigner`

Signer used to represent a lack of signer

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:481](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L481)
=======
[src/types/composer.ts:456](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L456)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:459](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L459)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:461](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L461)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:477](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L477)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:675](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L675)
=======
[src/types/composer.ts:634](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L634)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:653](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L653)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:655](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L655)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:671](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L671)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:724](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L724)
=======
[src/types/composer.ts:683](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L683)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:702](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L702)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:704](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L704)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:720](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L720)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:634](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L634)
=======
[src/types/composer.ts:593](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L593)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:612](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L612)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:614](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L614)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:630](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L630)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:688](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L688)
=======
[src/types/composer.ts:647](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L647)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:666](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L666)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:668](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L668)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:684](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L684)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:660](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L660)
=======
[src/types/composer.ts:619](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L619)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:638](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L638)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:640](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L640)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:656](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L656)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:712](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L712)
=======
[src/types/composer.ts:671](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L671)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:690](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L690)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:692](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L692)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:708](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L708)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:647](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L647)
=======
[src/types/composer.ts:606](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L606)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:625](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L625)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:627](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L627)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:643](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L643)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:700](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L700)
=======
[src/types/composer.ts:659](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L659)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:678](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L678)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:680](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L680)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:696](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L696)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:566](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L566)
=======
[src/types/composer.ts:525](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L525)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:544](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L544)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:546](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L546)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:562](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L562)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:555](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L555)
=======
[src/types/composer.ts:514](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L514)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:533](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L533)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:535](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L535)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:551](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L551)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:588](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L588)
=======
[src/types/composer.ts:547](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L547)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:566](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L566)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:568](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L568)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:584](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L584)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:577](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L577)
=======
[src/types/composer.ts:536](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L536)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:555](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L555)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:557](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L557)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:573](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L573)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:610](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L610)
=======
[src/types/composer.ts:569](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L569)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:588](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L588)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:590](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L590)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:606](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L606)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:621](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L621)
=======
[src/types/composer.ts:580](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L580)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:599](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L599)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:601](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L601)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:617](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L617)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:599](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L599)
=======
[src/types/composer.ts:558](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L558)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:577](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L577)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:579](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L579)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:595](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L595)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:745](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L745)
=======
[src/types/composer.ts:704](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L704)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:723](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L723)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:725](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L725)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:741](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L741)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:734](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L734)
=======
[src/types/composer.ts:693](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L693)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:712](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L712)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:714](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L714)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:730](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L730)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:544](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L544)
=======
[src/types/composer.ts:522](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L522)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:524](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L524)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:540](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L540)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:529](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L529)
=======
[src/types/composer.ts:503](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L503)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:507](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L507)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:509](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L509)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:525](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L525)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:1185](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1185)
=======
[src/types/composer.ts:1139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1139)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:1163](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1163)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:1165](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1165)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:1181](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1181)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:1008](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1008)
=======
[src/types/composer.ts:962](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L962)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:986](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L986)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:988](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L988)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:1004](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1004)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:957](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L957)
=======
[src/types/composer.ts:911](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L911)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:935](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L935)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:937](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L937)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:953](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L953)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:937](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L937)
=======
[src/types/composer.ts:891](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L891)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:915](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L915)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:917](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L917)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:933](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L933)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:972](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L972)
=======
[src/types/composer.ts:926](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L926)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:950](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L950)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:952](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L952)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:968](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L968)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:982](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L982)
=======
[src/types/composer.ts:936](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L936)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:960](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L960)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:962](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L962)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:978](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L978)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:994](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L994)
=======
[src/types/composer.ts:948](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L948)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:972](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L972)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:974](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L974)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:990](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L990)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:751](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L751)
=======
[src/types/composer.ts:710](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L710)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:729](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L729)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:731](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L731)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:747](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L747)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:1063](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1063)
=======
[src/types/composer.ts:1017](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1017)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:1041](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1041)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:1043](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1043)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:1059](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1059)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:817](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L817)
=======
[src/types/composer.ts:776](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L776)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:795](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L795)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:797](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L797)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:813](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L813)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:925](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L925)
=======
[src/types/composer.ts:879](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L879)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:903](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L903)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:905](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L905)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:921](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L921)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### buildTransactions

▸ **buildTransactions**(): `Promise`\<[`BuiltTransactions`](../interfaces/types_composer.BuiltTransactions.md)\>

Compose all of the transactions without signers and return the transaction objects directly along with any ABI method calls.

#### Returns

`Promise`\<[`BuiltTransactions`](../interfaces/types_composer.BuiltTransactions.md)\>

The array of built transactions and any corresponding method calls

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:1132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1132)
=======
[src/types/composer.ts:1086](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1086)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:1110](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1110)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:1112](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1112)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:1128](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1128)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:1082](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1082)
=======
[src/types/composer.ts:1036](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1036)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:1060](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1060)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:1062](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1062)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:1078](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1078)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:1109](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1109)
=======
[src/types/composer.ts:1063](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1063)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:1087](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1087)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:1089](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1089)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:1105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1105)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:772](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L772)
=======
[src/types/composer.ts:731](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L731)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:750](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L750)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:752](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L752)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:768](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L768)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### count

▸ **count**(): `Promise`\<`number`\>

Get the number of transactions currently added to this composer.

#### Returns

`Promise`\<`number`\>

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:1172](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1172)
=======
[src/types/composer.ts:1126](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1126)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:1150](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1150)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:1152](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1152)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:1168](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1168)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:1224](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1224)
=======
[src/types/composer.ts:1178](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1178)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:1202](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1202)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:1204](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1204)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:1220](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1220)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:1214](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1214)
=======
[src/types/composer.ts:1168](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1168)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:1192](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1192)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:1194](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1194)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:1210](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1210)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:1251](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1251)
=======
[src/types/composer.ts:1205](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1205)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:1229](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1229)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:1231](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1231)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:1247](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1247)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/composer.ts:1291](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1291)
=======
[src/types/composer.ts:1241](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1241)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/composer.ts:1266](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1266)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/composer.ts:1268](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1268)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/composer.ts:1284](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L1284)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
