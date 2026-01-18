[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/transaction](../README.md) / SendTransactionParams

# Interface: SendTransactionParams

Defined in: [src/types/transaction.ts:25](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L25)

The sending configuration for a transaction

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extended by

- [`AppCallParams`](../../app/interfaces/AppCallParams.md)

## Properties

### fee?

> `optional` **fee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/transaction.ts:36](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L36)

The flat fee you want to pay, useful for covering extra fees in a transaction group or app call

***

### maxFee?

> `optional` **maxFee**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/transaction.ts:38](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L38)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

***

### maxRoundsToWaitForConfirmation?

> `optional` **maxRoundsToWaitForConfirmation**: `number`

Defined in: [src/types/transaction.ts:40](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L40)

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

***

### populateAppCallResources?

> `optional` **populateAppCallResources**: `boolean`

Defined in: [src/types/transaction.ts:42](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L42)

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to true when there are app calls in the group.

***

### skipSending?

> `optional` **skipSending**: `boolean`

Defined in: [src/types/transaction.ts:28](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L28)

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain, unless `atc` specified)
and instead just return the raw transaction, e.g. so you can add it to a group of transactions

***

### skipWaiting?

> `optional` **skipWaiting**: `boolean`

Defined in: [src/types/transaction.ts:30](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L30)

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

***

### suppressLog?

> `optional` **suppressLog**: `boolean`

Defined in: [src/types/transaction.ts:34](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L34)

Whether to suppress log messages from transaction send, default: do not suppress

***

### transactionComposer?

> `optional` **transactionComposer**: [`TransactionComposer`](../../composer/classes/TransactionComposer.md)

Defined in: [src/types/transaction.ts:32](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L32)

An optional `TransactionComposer` to add the transaction to, if specified then `skipSending: undefined` has the same effect as `skipSending: true`
