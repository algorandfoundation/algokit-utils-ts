[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/transaction](../README.md) / SendTransactionResult

# Interface: SendTransactionResult

Defined in: [src/types/transaction.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L49)

The result of sending a transaction

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extended by

- [`AppCallTransactionResultOfType`](../../app/interfaces/AppCallTransactionResultOfType.md)
- [`ConfirmedTransactionResult`](ConfirmedTransactionResult.md)
- [`ConfirmedTransactionResults`](ConfirmedTransactionResults.md)

## Properties

### confirmation?

> `optional` **confirmation**: [`PendingTransactionResponse`](../../../algod-client/type-aliases/PendingTransactionResponse.md)

Defined in: [src/types/transaction.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L53)

The response if the transaction was sent and waited for

***

### transaction

> **transaction**: [`Transaction`](../../../transact/classes/Transaction.md)

Defined in: [src/types/transaction.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L51)

The transaction
