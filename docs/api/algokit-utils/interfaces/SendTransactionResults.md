[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / SendTransactionResults

# Interface: SendTransactionResults

Defined in: [src/transaction/types.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L57)

The result of preparing and/or sending multiple transactions

## Hierarchy

[View Summary](../../hierarchy.md)

### Extended by

- [`ConfirmedTransactionResults`](ConfirmedTransactionResults.md)

## Properties

### confirmations?

> `optional` **confirmations**: [`PendingTransactionResponse`](../../Subpaths/algod-client/type-aliases/PendingTransactionResponse.md)[]

Defined in: [src/transaction/types.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L63)

The responses if the transactions were sent and waited for,
the index of the confirmation will match the index of the underlying transaction

***

### transactions

> **transactions**: [`Transaction`](../../Subpaths/transact/classes/Transaction.md)[]

Defined in: [src/transaction/types.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L59)

The transactions that have been prepared and/or sent
