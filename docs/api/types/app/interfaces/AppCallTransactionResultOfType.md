[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app](../README.md) / AppCallTransactionResultOfType

# Interface: AppCallTransactionResultOfType\<T\>

Defined in: [src/types/app.ts:140](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L140)

The result of preparing and/or sending multiple transactions

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`SendTransactionResults`](../../transaction/interfaces/SendTransactionResults.md).[`SendTransactionResult`](../../transaction/interfaces/SendTransactionResult.md)

## Type Parameters

### T

`T`

## Properties

### confirmation?

> `optional` **confirmation**: [`PendingTransactionResponse`](../../../Subpaths/algod-client/type-aliases/PendingTransactionResponse.md)

Defined in: [src/types/transaction.ts:53](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L53)

The response if the transaction was sent and waited for

#### Inherited from

[`SendTransactionResult`](../../transaction/interfaces/SendTransactionResult.md).[`confirmation`](../../transaction/interfaces/SendTransactionResult.md#confirmation)

***

### confirmations?

> `optional` **confirmations**: [`PendingTransactionResponse`](../../../Subpaths/algod-client/type-aliases/PendingTransactionResponse.md)[]

Defined in: [src/types/transaction.ts:63](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L63)

The responses if the transactions were sent and waited for,
the index of the confirmation will match the index of the underlying transaction

#### Inherited from

[`SendTransactionResults`](../../transaction/interfaces/SendTransactionResults.md).[`confirmations`](../../transaction/interfaces/SendTransactionResults.md#confirmations)

***

### return?

> `optional` **return**: `T`

Defined in: [src/types/app.ts:142](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L142)

If an ABI method was called the processed return value

***

### transaction

> **transaction**: [`Transaction`](../../../Subpaths/transact/classes/Transaction.md)

Defined in: [src/types/transaction.ts:51](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L51)

The transaction

#### Inherited from

[`SendTransactionResult`](../../transaction/interfaces/SendTransactionResult.md).[`transaction`](../../transaction/interfaces/SendTransactionResult.md#transaction)

***

### transactions

> **transactions**: [`Transaction`](../../../Subpaths/transact/classes/Transaction.md)[]

Defined in: [src/types/transaction.ts:59](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L59)

The transactions that have been prepared and/or sent

#### Inherited from

[`SendTransactionResults`](../../transaction/interfaces/SendTransactionResults.md).[`transactions`](../../transaction/interfaces/SendTransactionResults.md#transactions)
