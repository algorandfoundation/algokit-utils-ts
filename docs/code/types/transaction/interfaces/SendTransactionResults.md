[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/transaction](../README.md) / SendTransactionResults

# Interface: SendTransactionResults

Defined in: [src/types/transaction.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L61)

The result of preparing and/or sending multiple transactions

## Extended by

- [`AppCallTransactionResultOfType`](../../app/interfaces/AppCallTransactionResultOfType.md)
- [`SendAtomicTransactionComposerResults`](SendAtomicTransactionComposerResults.md)
- [`ConfirmedTransactionResults`](ConfirmedTransactionResults.md)

## Properties

### confirmations?

> `optional` **confirmations**: `PendingTransactionResponse`[]

Defined in: [src/types/transaction.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L67)

The responses if the transactions were sent and waited for,
the index of the confirmation will match the index of the underlying transaction

***

### transactions

> **transactions**: `Transaction`[]

Defined in: [src/types/transaction.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L63)

The transactions that have been prepared and/or sent
