[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/transfer](../README.md) / AlgoRekeyParams

# Interface: ~~AlgoRekeyParams~~

Defined in: [src/types/transfer.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L24)

## Deprecated

Parameters for `rekeyAccount` call.

## Extends

- [`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md)

## Properties

### ~~atc?~~

> `optional` **atc**: `AtomicTransactionComposer`

Defined in: [src/types/transaction.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L36)

An optional `AtomicTransactionComposer` to add the transaction to, if specified then `skipSending: undefined` has the same effect as `skipSending: true`

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`atc`](../../transaction/interfaces/SendTransactionParams.md#atc)

***

### ~~fee?~~

> `optional` **fee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/transaction.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L40)

The flat fee you want to pay, useful for covering extra fees in a transaction group or app call

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`fee`](../../transaction/interfaces/SendTransactionParams.md#fee)

***

### ~~from~~

> **from**: [`SendTransactionFrom`](../../transaction/type-aliases/SendTransactionFrom.md)

Defined in: [src/types/transfer.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L26)

The account that will be rekeyed

***

### ~~lease?~~

> `optional` **lease**: `string` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [src/types/transfer.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L34)

An (optional) [transaction lease](https://dev.algorand.co/concepts/transactions/leases) to apply

***

### ~~maxFee?~~

> `optional` **maxFee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/transaction.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L42)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`maxFee`](../../transaction/interfaces/SendTransactionParams.md#maxfee)

***

### ~~maxRoundsToWaitForConfirmation?~~

> `optional` **maxRoundsToWaitForConfirmation**: `number`

Defined in: [src/types/transaction.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L44)

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`maxRoundsToWaitForConfirmation`](../../transaction/interfaces/SendTransactionParams.md#maxroundstowaitforconfirmation)

***

### ~~note?~~

> `optional` **note**: [`TransactionNote`](../../transaction/type-aliases/TransactionNote.md)

Defined in: [src/types/transfer.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L32)

The (optional) transaction note

***

### ~~populateAppCallResources?~~

> `optional` **populateAppCallResources**: `boolean`

Defined in: [src/types/transaction.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L46)

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to true when there are app calls in the group.

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`populateAppCallResources`](../../transaction/interfaces/SendTransactionParams.md#populateappcallresources)

***

### ~~rekeyTo~~

> **rekeyTo**: `string` \| [`SendTransactionFrom`](../../transaction/type-aliases/SendTransactionFrom.md)

Defined in: [src/types/transfer.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L28)

The account / account address that will have the private key that is authorised to transact on behalf of the from account from now on

***

### ~~skipSending?~~

> `optional` **skipSending**: `boolean`

Defined in: [src/types/transaction.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L32)

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain, unless `atc` specified)
and instead just return the raw transaction, e.g. so you can add it to a group of transactions

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`skipSending`](../../transaction/interfaces/SendTransactionParams.md#skipsending)

***

### ~~skipWaiting?~~

> `optional` **skipWaiting**: `boolean`

Defined in: [src/types/transaction.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L34)

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`skipWaiting`](../../transaction/interfaces/SendTransactionParams.md#skipwaiting)

***

### ~~suppressLog?~~

> `optional` **suppressLog**: `boolean`

Defined in: [src/types/transaction.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L38)

Whether to suppress log messages from transaction send, default: do not suppress

#### Inherited from

[`SendTransactionParams`](../../transaction/interfaces/SendTransactionParams.md).[`suppressLog`](../../transaction/interfaces/SendTransactionParams.md#suppresslog)

***

### ~~transactionParams?~~

> `optional` **transactionParams**: `SuggestedParams`

Defined in: [src/types/transfer.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transfer.ts#L30)

Optional transaction parameters
