[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/transaction](../README.md) / SendTransactionResults

# Interface: SendTransactionResults

Defined in: [src/types/transaction.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L57)

The result of preparing and/or sending multiple transactions

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extended by

- [`AppCallTransactionResultOfType`](../../app/interfaces/AppCallTransactionResultOfType.md)
- [`ConfirmedTransactionResults`](ConfirmedTransactionResults.md)

## Properties

### confirmations?

> `optional` **confirmations**: [`PendingTransactionResponse`](../../../Packages/Algod-Client/type-aliases/PendingTransactionResponse.md)[]

Defined in: [src/types/transaction.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L63)

The responses if the transactions were sent and waited for,
the index of the confirmation will match the index of the underlying transaction

***

### transactions

> **transactions**: [`Transaction`](../../../Packages/Transact/classes/Transaction.md)[]

Defined in: [src/types/transaction.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L59)

The transactions that have been prepared and/or sent
