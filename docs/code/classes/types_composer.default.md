[@algorandfoundation/algokit-utils](../README.md) / [types/composer](../modules/types_composer.md) / default

# Class: default

[types/composer](../modules/types_composer.md).default

## Table of contents

### Constructors

- [constructor](types_composer.default.md#constructor)

### Properties

- [algod](types_composer.default.md#algod)
- [atc](types_composer.default.md#atc)
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
- [addOnlineKeyReg](types_composer.default.md#addonlinekeyreg)
- [addPayment](types_composer.default.md#addpayment)
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

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AlgokitComposerParams`](../modules/types_composer.md#algokitcomposerparams) |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/composer.ts:226](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L226)

## Properties

### algod

• **algod**: `default`

The algod client used by the composer for suggestedParams

#### Defined in

[src/types/composer.ts:215](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L215)

___

### atc

• **atc**: `AtomicTransactionComposer`

The underlying AtomicTransactionComposer

#### Defined in

[src/types/composer.ts:212](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L212)

___

### defaultValidityWindow

• **defaultValidityWindow**: `number` = `10`

The default transaction validity window

#### Defined in

[src/types/composer.ts:224](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L224)

___

### getSigner

• **getSigner**: (`address`: `string`) => `TransactionSigner`

A function that takes in an address and return a signer function for that address

#### Type declaration

▸ (`address`): `TransactionSigner`

A function that takes in an address and return a signer function for that address

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

##### Returns

`TransactionSigner`

#### Defined in

[src/types/composer.ts:221](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L221)

___

### getSuggestedParams

• **getSuggestedParams**: () => `Promise`\<`SuggestedParams`\>

An async function that will return suggestedParams

#### Type declaration

▸ (): `Promise`\<`SuggestedParams`\>

An async function that will return suggestedParams

##### Returns

`Promise`\<`SuggestedParams`\>

#### Defined in

[src/types/composer.ts:218](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L218)

___

### txnMethodMap

• `Private` **txnMethodMap**: `Map`\<`string`, `ABIMethod`\>

Map of txid to ABI method

#### Defined in

[src/types/composer.ts:206](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L206)

___

### txns

• `Private` **txns**: `Txn`[] = `[]`

Transactions that have not yet been composed

#### Defined in

[src/types/composer.ts:209](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L209)

## Methods

### addAppCall

▸ **addAppCall**(`params`): [`default`](types_composer.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AppCallParams`](../modules/types_composer.md#appcallparams) |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/composer.ts:277](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L277)

___

### addAssetConfig

▸ **addAssetConfig**(`params`): [`default`](types_composer.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetConfigParams`](../modules/types_composer.md#assetconfigparams) |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/composer.ts:247](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L247)

___

### addAssetCreate

▸ **addAssetCreate**(`params`): [`default`](types_composer.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetCreateParams`](../modules/types_composer.md#assetcreateparams) |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/composer.ts:241](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L241)

___

### addAssetDestroy

▸ **addAssetDestroy**(`params`): [`default`](types_composer.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetDestroyParams`](../modules/types_composer.md#assetdestroyparams) |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/composer.ts:259](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L259)

___

### addAssetFreeze

▸ **addAssetFreeze**(`params`): [`default`](types_composer.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetFreezeParams`](../modules/types_composer.md#assetfreezeparams) |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/composer.ts:253](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L253)

___

### addAssetOptIn

▸ **addAssetOptIn**(`params`): [`default`](types_composer.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetOptInParams`](../modules/types_composer.md#assetoptinparams) |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/composer.ts:271](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L271)

___

### addAssetTransfer

▸ **addAssetTransfer**(`params`): [`default`](types_composer.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AssetTransferParams`](../modules/types_composer.md#assettransferparams) |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/composer.ts:265](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L265)

___

### addAtc

▸ **addAtc**(`atc`): [`default`](types_composer.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `atc` | `AtomicTransactionComposer` |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/composer.ts:289](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L289)

___

### addMethodCall

▸ **addMethodCall**(`params`): [`default`](types_composer.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`MethodCallParams`](../modules/types_composer.md#methodcallparams) |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/composer.ts:294](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L294)

___

### addOnlineKeyReg

▸ **addOnlineKeyReg**(`params`): [`default`](types_composer.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`OnlineKeyRegParams`](../modules/types_composer.md#onlinekeyregparams) |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/composer.ts:283](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L283)

___

### addPayment

▸ **addPayment**(`params`): [`default`](types_composer.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`PayTxnParams`](../modules/types_composer.md#paytxnparams) |

#### Returns

[`default`](types_composer.default.md)

#### Defined in

[src/types/composer.ts:235](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L235)

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

[src/types/composer.ts:452](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L452)

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

[src/types/composer.ts:492](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L492)

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

[src/types/composer.ts:440](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L440)

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

[src/types/composer.ts:507](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L507)

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

[src/types/composer.ts:517](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L517)

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

[src/types/composer.ts:529](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L529)

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

[src/types/composer.ts:299](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L299)

___

### buildGroup

▸ **buildGroup**(): `Promise`\<`TransactionWithSigner`[]\>

Compose all of the transactions in a single atomic transaction group

#### Returns

`Promise`\<`TransactionWithSigner`[]\>

#### Defined in

[src/types/composer.ts:619](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L619)

___

### buildKeyReg

▸ **buildKeyReg**(`params`, `suggestedParams`): `Transaction`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`OnlineKeyRegParams`](../modules/types_composer.md#onlinekeyregparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Transaction`

#### Defined in

[src/types/composer.ts:543](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L543)

___

### buildMethodCall

▸ **buildMethodCall**(`params`, `suggestedParams`): `TransactionWithSigner`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`MethodCallParams`](../modules/types_composer.md#methodcallparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`TransactionWithSigner`[]

#### Defined in

[src/types/composer.ts:346](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L346)

___

### buildPayment

▸ **buildPayment**(`params`, `suggestedParams`): `Transaction`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`PayTxnParams`](../modules/types_composer.md#paytxnparams) |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Transaction`

#### Defined in

[src/types/composer.ts:428](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L428)

___

### buildTxn

▸ **buildTxn**(`txn`, `suggestedParams`): `TransactionWithSigner`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `txn` | `Txn` |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`TransactionWithSigner`[]

#### Defined in

[src/types/composer.ts:561](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L561)

___

### commonTxnBuildStep

▸ **commonTxnBuildStep**(`params`, `txn`, `suggestedParams`): `Transaction`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`CommonTxnParams`](../modules/types_composer.md#commontxnparams) |
| `txn` | `Transaction` |
| `suggestedParams` | `SuggestedParams` |

#### Returns

`Transaction`

#### Defined in

[src/types/composer.ts:313](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L313)

___

### execute

▸ **execute**(`params?`): `Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md)\>

Compose the atomic transaction group and send it to the network

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params?` | `Object` | - |
| `params.maxRoundsToWaitForConfirmation?` | `number` | The number of rounds to wait for confirmation. By default until the latest lastValid has past. |

#### Returns

`Promise`\<[`SendAtomicTransactionComposerResults`](../interfaces/types_transaction.SendAtomicTransactionComposerResults.md)\>

#### Defined in

[src/types/composer.ts:645](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L645)
