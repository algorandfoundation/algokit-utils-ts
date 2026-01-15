[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/transaction](../README.md) / TransactionComposerToSend

# Interface: TransactionComposerToSend

Defined in: [src/types/transaction.ts:142](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L142)

An `TransactionComposer` with transactions to send.

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`SendParams`](SendParams.md)

## Properties

### coverAppCallInnerTransactionFees?

> `optional` **coverAppCallInnerTransactionFees**: `boolean`

Defined in: [src/types/transaction.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L132)

Whether to use simulate to automatically calculate required app call inner transaction fees and cover them in the parent app call transaction fee

#### Inherited from

[`SendParams`](SendParams.md).[`coverAppCallInnerTransactionFees`](SendParams.md#coverappcallinnertransactionfees)

***

### maxRoundsToWaitForConfirmation?

> `optional` **maxRoundsToWaitForConfirmation**: `number`

Defined in: [src/types/transaction.ts:126](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L126)

The number of rounds to wait for confirmation. By default until the latest lastValid has past.

#### Inherited from

[`SendParams`](SendParams.md).[`maxRoundsToWaitForConfirmation`](SendParams.md#maxroundstowaitforconfirmation)

***

### populateAppCallResources?

> `optional` **populateAppCallResources**: `boolean`

Defined in: [src/types/transaction.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L130)

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`.

#### Inherited from

[`SendParams`](SendParams.md).[`populateAppCallResources`](SendParams.md#populateappcallresources)

***

### suppressLog?

> `optional` **suppressLog**: `boolean`

Defined in: [src/types/transaction.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L128)

Whether to suppress log messages from transaction send, default: do not suppress.

#### Inherited from

[`SendParams`](SendParams.md).[`suppressLog`](SendParams.md#suppresslog)

***

### transactionComposer

> **transactionComposer**: [`TransactionComposer`](../../composer/classes/TransactionComposer.md)

Defined in: [src/types/transaction.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L144)

The `TransactionComposer` with transactions loaded to send
