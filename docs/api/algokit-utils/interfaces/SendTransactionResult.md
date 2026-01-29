[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / SendTransactionResult

# Interface: SendTransactionResult

Defined in: [src/transaction/types.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L49)

The result of sending a transaction

## Hierarchy

[View Summary](../../hierarchy.md)

### Extended by

- [`ConfirmedTransactionResult`](ConfirmedTransactionResult.md)
- [`ConfirmedTransactionResults`](ConfirmedTransactionResults.md)

## Properties

### confirmation?

> `optional` **confirmation**: [`PendingTransactionResponse`](../../Subpaths/algod-client/type-aliases/PendingTransactionResponse.md)

Defined in: [src/transaction/types.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L53)

The response if the transaction was sent and waited for

***

### transaction

> **transaction**: [`Transaction`](../../Subpaths/transact/classes/Transaction.md)

Defined in: [src/transaction/types.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L51)

The transaction
