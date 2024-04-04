[@algorandfoundation/algokit-utils](../README.md) / [types/composer](../modules/types_composer.md) / default

# Class: default

[types/composer](../modules/types_composer.md).default

AlgoKit Composer helps you compose and execute transactions as a transaction group.

Note: this class is a new Beta feature and may be subject to change.

## Table of contents

### Constructors

- [constructor](types_composer.default.md#constructor)

### Properties

- [algod](types_composer.default.md#algod)
- [defaultValidityWindow](types_composer.default.md#defaultvaliditywindow)
- [getSigner](types_composer.default.md#getsigner)
- [getSuggestedParams](types_composer.default.md#getsuggestedparams)
- [txnMethodMap](types_composer.default.md#txnmethodmap)
- [txns](types_composer.default.md#txns)

### Methods

- [addAppCall](types_composer.default.md#addappcall)
- [addAssetConfig](types_composer.default.md#addassetconfig)
- [addAssetCreate](types_composer.default.md#addassetcreate)
- [addAssetDestroy](types_composer.default.md#addassetdestroy)
- [addAssetFreeze](types_composer.default.md#addassetfreeze)
- [addAssetOptIn](types_composer.default.md#addassetoptin)
- [addAssetTransfer](types_composer.default.md#addassettransfer)
- [addAtc](types_composer.default.md#addatc)
- [addMethodCall](types_composer.default.md#addmethodcall)
- [addOnlineKeyRegistration](types_composer.default.md#addonlinekeyregistration)
- [addPayment](types_composer.default.md#addpayment)
- [build](types_composer.default.md#build)
- [buildAppCall](types_composer.default.md#buildappcall)
- [buildAssetConfig](types_composer.default.md#buildassetconfig)
- [buildAssetCreate](types_composer.default.md#buildassetcreate)
- [buildAssetDestroy](types_composer.default.md#buildassetdestroy)
- [buildAssetFreeze](types_composer.default.md#buildassetfreeze)
- [buildAssetTransfer](types_composer.default.md#buildassettransfer)
- [buildAtc](types_composer.default.md#buildatc)
- [buildGroup](types_composer.default.md#buildgroup)
- [buildKeyReg](types_composer.default.md#buildkeyreg)
- [buildMethodCall](types_composer.default.md#buildmethodcall)
- [buildPayment](types_composer.default.md#buildpayment)
- [buildTxn](types_composer.default.md#buildtxn)
- [commonTxnBuildStep](types_composer.default.md#commontxnbuildstep)
- [execute](types_composer.default.md#execute)

## Constructors

### constructor

• **new default**(`params`): [`default`](types_composer.default.md)

Create an `AlgoKitComposer`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AlgokitComposerParams`](../modules/types_composer.md#algokitcomposerparams) | The configuration for this composer |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/composer.ts:277](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L277)

## Properties

### algod

• `Private` **algod**: `default`

The algod client used by the composer.

#### Defined in

[src/types/composer.ts:262](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L262)

___

### defaultValidityWindow

• `Private` **defaultValidityWindow**: `number` = `10`

The default transaction validity window

#### Defined in

[src/types/composer.ts:271](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L271)

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

[src/types/composer.ts:268](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L268)

___

### getSuggestedParams

• `Private` **getSuggestedParams**: () => `Promise`\<`SuggestedParams`\>

An async function that will return suggestedParams.

#### Type declaration

▸ (): `Promise`\<`SuggestedParams`\>

##### Returns

`Promise`\<`SuggestedParams`\>

#### Defined in

[src/types/composer.ts:265](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L265)

___

### txnMethodMap

• `Private` **txnMethodMap**: `Map`\<`string`, `ABIMethod`\>

Map of txid to ABI method

#### Defined in

[src/types/composer.ts:256](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L256)

___

### txns

• `Private` **txns**: `Txn`[] = `[]`

Transactions that have not yet been composed

#### Defined in

[src/types/composer.ts:259](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L259)

## Methods

### addAppCall

▸ **addAppCall**(`params`): [`default`](types_composer.default.md)

Add an application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppCallParams`](../modules/types_composer.md#appcallparams) | The application call transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:369](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L369)

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

[src/types/composer.ts:312](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L312)

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

[src/types/composer.ts:301](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L301)

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

[src/types/composer.ts:334](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L334)

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

[src/types/composer.ts:323](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L323)

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

[src/types/composer.ts:356](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L356)

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

[src/types/composer.ts:345](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L345)

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

[src/types/composer.ts:403](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L403)

___

### addMethodCall

▸ **addMethodCall**(`params`): [`default`](types_composer.default.md)

Add an ABI method application call transaction to the transaction group.

Note: we recommend using app clients to make it easier to make app calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`MethodCallParams`](../modules/types_composer.md#methodcallparams) | The ABI method application call transaction parameters |

#### Returns

[`default`](types_composer.default.md)

The composer so you can chain method calls

#### Defined in

[src/types/composer.ts:382](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L382)

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

[src/types/composer.ts:392](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L392)

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

[src/types/composer.ts:290](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L290)

___

### build

▸ **build**(): `Promise`\<\{ `atc`: `AtomicTransactionComposer` ; `transactions`: `TransactionWithSigner`[]  }\>

Compose all of the transactions in a single atomic transaction group and an atomic transaction composer.

You can then use the transactions standalone, or use the composer to execute or simulate the transactions.

#### Returns

`Promise`\<\{ `atc`: `AtomicTransactionComposer` ; `transactions`: `TransactionWithSigner`[]  }\>

The (new) built atomic transaction composer and the transactions

#### Defined in

[src/types/composer.ts:715](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L715)

___

### buildAppCall

▸ **buildAppCall**(`params`, `suggestedParams`): `Transaction`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AppCallParams`](../modules/types_composer.md#appcallparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Transaction`

#### Defined in

[src/types/composer.ts:594](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L594)

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

[src/types/composer.ts:543](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L543)

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

[src/types/composer.ts:523](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L523)

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

[src/types/composer.ts:558](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L558)

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

[src/types/composer.ts:568](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L568)

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

[src/types/composer.ts:580](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L580)

___

### buildAtc

▸ **buildAtc**(`atc`): `TransactionWithSigner`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `atc` | `AtomicTransactionComposer` |

#### Returns

`TransactionWithSigner`[]

#### Defined in

[src/types/composer.ts:408](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L408)

___

### buildGroup

▸ **buildGroup**(): `Promise`\<`TransactionWithSigner`[]\>

Compose all of the transactions in a single atomic transaction group.

#### Returns

`Promise`\<`TransactionWithSigner`[]\>

The transactions with signers

#### Defined in

[src/types/composer.ts:749](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L749)

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

[src/types/composer.ts:634](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L634)

___

### buildMethodCall

▸ **buildMethodCall**(`params`, `suggestedParams`): `Promise`\<`TransactionWithSigner`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`MethodCallParams`](../modules/types_composer.md#methodcallparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Promise`\<`TransactionWithSigner`[]\>

#### Defined in

[src/types/composer.ts:456](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L456)

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

[src/types/composer.ts:511](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L511)

___

### buildTxn

▸ **buildTxn**(`txn`, `suggestedParams`): `Promise`\<`TransactionWithSigner`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txn` | `Txn` |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Promise`\<`TransactionWithSigner`[]\>

#### Defined in

[src/types/composer.ts:652](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L652)

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

[src/types/composer.ts:422](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L422)

___

### execute

▸ **execute**(`params?`): `Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md)\>

Compose the atomic transaction group and send it to the network

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params?` | [`ExecuteParams`](../interfaces/types_composer.ExecuteParams.md) | The parameters to control execution with |

#### Returns

`Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md)\>

The execution result

#### Defined in

[src/types/composer.ts:758](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L758)
