[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app](../README.md) / AppCallTransactionResultOfType

# Interface: AppCallTransactionResultOfType\<T\>

Defined in: [src/types/app.ts:226](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L226)

The result of preparing and/or sending multiple transactions

## Extends

- [`SendTransactionResults`](../../transaction/interfaces/SendTransactionResults.md).[`SendTransactionResult`](../../transaction/interfaces/SendTransactionResult.md)

## Type Parameters

### T

`T`

## Properties

### confirmation?

> `optional` **confirmation**: `PendingTransactionResponse`

Defined in: [src/types/transaction.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L57)

The response if the transaction was sent and waited for

#### Inherited from

[`SendTransactionResult`](../../transaction/interfaces/SendTransactionResult.md).[`confirmation`](../../transaction/interfaces/SendTransactionResult.md#confirmation)

***

### confirmations?

> `optional` **confirmations**: `PendingTransactionResponse`[]

Defined in: [src/types/transaction.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L67)

The responses if the transactions were sent and waited for,
the index of the confirmation will match the index of the underlying transaction

#### Inherited from

[`SendTransactionResults`](../../transaction/interfaces/SendTransactionResults.md).[`confirmations`](../../transaction/interfaces/SendTransactionResults.md#confirmations)

***

### return?

> `optional` **return**: `T`

Defined in: [src/types/app.ts:228](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L228)

If an ABI method was called the processed return value

***

### transaction

> **transaction**: `Transaction`

Defined in: [src/types/transaction.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L55)

The transaction

#### Inherited from

[`SendTransactionResult`](../../transaction/interfaces/SendTransactionResult.md).[`transaction`](../../transaction/interfaces/SendTransactionResult.md#transaction)

***

### transactions

> **transactions**: `Transaction`[]

Defined in: [src/types/transaction.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L63)

The transactions that have been prepared and/or sent

#### Inherited from

[`SendTransactionResults`](../../transaction/interfaces/SendTransactionResults.md).[`transactions`](../../transaction/interfaces/SendTransactionResults.md#transactions)
