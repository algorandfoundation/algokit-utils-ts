[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/transaction](../README.md) / SendTransactionResult

# Interface: SendTransactionResult

Defined in: [src/types/transaction.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L53)

The result of sending a transaction

## Extended by

- [`AppCallTransactionResultOfType`](../../app/interfaces/AppCallTransactionResultOfType.md)
- [`ConfirmedTransactionResult`](ConfirmedTransactionResult.md)
- [`ConfirmedTransactionResults`](ConfirmedTransactionResults.md)

## Properties

### confirmation?

> `optional` **confirmation**: `PendingTransactionResponse`

Defined in: [src/types/transaction.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L57)

The response if the transaction was sent and waited for

***

### transaction

> **transaction**: `Transaction`

Defined in: [src/types/transaction.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L55)

The transaction
