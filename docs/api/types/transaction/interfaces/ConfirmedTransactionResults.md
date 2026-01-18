[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/transaction](../README.md) / ConfirmedTransactionResults

# Interface: ConfirmedTransactionResults

Defined in: [src/types/transaction.ts:87](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L87)

The result of sending and confirming one or more transactions, but where there is a primary transaction of interest

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`SendTransactionResult`](SendTransactionResult.md).[`SendTransactionResults`](SendTransactionResults.md)

## Properties

### confirmation

> **confirmation**: [`PendingTransactionResponse`](../../../Subpaths/algod-client/type-aliases/PendingTransactionResponse.md)

Defined in: [src/types/transaction.ts:89](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L89)

The response from sending and waiting for the primary transaction

#### Overrides

[`SendTransactionResult`](SendTransactionResult.md).[`confirmation`](SendTransactionResult.md#confirmation)

***

### confirmations

> **confirmations**: [`PendingTransactionResponse`](../../../Subpaths/algod-client/type-aliases/PendingTransactionResponse.md)[]

Defined in: [src/types/transaction.ts:91](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L91)

The response from sending and waiting for the transactions

#### Overrides

[`SendTransactionResults`](SendTransactionResults.md).[`confirmations`](SendTransactionResults.md#confirmations)

***

### transaction

> **transaction**: [`Transaction`](../../../Subpaths/transact/classes/Transaction.md)

Defined in: [src/types/transaction.ts:51](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L51)

The transaction

#### Inherited from

[`SendTransactionResult`](SendTransactionResult.md).[`transaction`](SendTransactionResult.md#transaction)

***

### transactions

> **transactions**: [`Transaction`](../../../Subpaths/transact/classes/Transaction.md)[]

Defined in: [src/types/transaction.ts:59](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/transaction.ts#L59)

The transactions that have been prepared and/or sent

#### Inherited from

[`SendTransactionResults`](SendTransactionResults.md).[`transactions`](SendTransactionResults.md#transactions)
