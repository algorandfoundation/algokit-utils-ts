[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/asset](../README.md) / AssetOptOutParams

# Interface: ~~AssetOptOutParams~~

Defined in: [src/types/asset.ts:84](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L84)

## Deprecated

Parameters for `assetOptOut` call.

## Extends

- [`AssetOptInParams`](AssetOptInParams.md)

## Properties

### ~~account~~

> **account**: [`SendTransactionFrom`](../../transaction/type-aliases/SendTransactionFrom.md)

Defined in: [src/types/asset.ts:72](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L72)

The account to opt in/out for

#### Inherited from

[`AssetOptInParams`](AssetOptInParams.md).[`account`](AssetOptInParams.md#account)

***

### ~~assetCreatorAddress?~~

> `optional` **assetCreatorAddress**: `string`

Defined in: [src/types/asset.ts:86](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L86)

The address of the creator account for the asset; if unspecified then it looks it up using algod

***

### ~~assetId~~

> **assetId**: `number`

Defined in: [src/types/asset.ts:74](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L74)

The ID of the assets to opt in for / out of

#### Inherited from

[`AssetOptInParams`](AssetOptInParams.md).[`assetId`](AssetOptInParams.md#assetid)

***

### ~~atc?~~

> `optional` **atc**: `AtomicTransactionComposer`

Defined in: [src/types/transaction.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L36)

An optional `AtomicTransactionComposer` to add the transaction to, if specified then `skipSending: undefined` has the same effect as `skipSending: true`

#### Inherited from

[`AssetOptInParams`](AssetOptInParams.md).[`atc`](AssetOptInParams.md#atc)

***

### ~~ensureZeroBalance?~~

> `optional` **ensureZeroBalance**: `boolean`

Defined in: [src/types/asset.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L88)

Whether or not to validate the account has a zero-balance before issuing the opt-out; default = true

***

### ~~fee?~~

> `optional` **fee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/transaction.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L40)

The flat fee you want to pay, useful for covering extra fees in a transaction group or app call

#### Inherited from

[`AssetOptInParams`](AssetOptInParams.md).[`fee`](AssetOptInParams.md#fee)

***

### ~~lease?~~

> `optional` **lease**: `string` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [src/types/asset.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L80)

An (optional) [transaction lease](https://dev.algorand.co/concepts/transactions/leases) to apply

#### Inherited from

[`AssetOptInParams`](AssetOptInParams.md).[`lease`](AssetOptInParams.md#lease)

***

### ~~maxFee?~~

> `optional` **maxFee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/transaction.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L42)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

[`AssetOptInParams`](AssetOptInParams.md).[`maxFee`](AssetOptInParams.md#maxfee)

***

### ~~maxRoundsToWaitForConfirmation?~~

> `optional` **maxRoundsToWaitForConfirmation**: `number`

Defined in: [src/types/transaction.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L44)

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

[`AssetOptInParams`](AssetOptInParams.md).[`maxRoundsToWaitForConfirmation`](AssetOptInParams.md#maxroundstowaitforconfirmation)

***

### ~~note?~~

> `optional` **note**: [`TransactionNote`](../../transaction/type-aliases/TransactionNote.md)

Defined in: [src/types/asset.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L78)

The (optional) transaction note

#### Inherited from

[`AssetOptInParams`](AssetOptInParams.md).[`note`](AssetOptInParams.md#note)

***

### ~~populateAppCallResources?~~

> `optional` **populateAppCallResources**: `boolean`

Defined in: [src/types/transaction.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L46)

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to true when there are app calls in the group.

#### Inherited from

[`AssetOptInParams`](AssetOptInParams.md).[`populateAppCallResources`](AssetOptInParams.md#populateappcallresources)

***

### ~~skipSending?~~

> `optional` **skipSending**: `boolean`

Defined in: [src/types/transaction.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L32)

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain, unless `atc` specified)
and instead just return the raw transaction, e.g. so you can add it to a group of transactions

#### Inherited from

[`AssetOptInParams`](AssetOptInParams.md).[`skipSending`](AssetOptInParams.md#skipsending)

***

### ~~skipWaiting?~~

> `optional` **skipWaiting**: `boolean`

Defined in: [src/types/transaction.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L34)

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Inherited from

[`AssetOptInParams`](AssetOptInParams.md).[`skipWaiting`](AssetOptInParams.md#skipwaiting)

***

### ~~suppressLog?~~

> `optional` **suppressLog**: `boolean`

Defined in: [src/types/transaction.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L38)

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

[`AssetOptInParams`](AssetOptInParams.md).[`suppressLog`](AssetOptInParams.md#suppresslog)

***

### ~~transactionParams?~~

> `optional` **transactionParams**: `SuggestedParams`

Defined in: [src/types/asset.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset.ts#L76)

Optional transaction parameters

#### Inherited from

[`AssetOptInParams`](AssetOptInParams.md).[`transactionParams`](AssetOptInParams.md#transactionparams)
