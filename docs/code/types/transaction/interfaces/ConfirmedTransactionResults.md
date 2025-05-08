[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/transaction](../README.md) / ConfirmedTransactionResults

# Interface: ConfirmedTransactionResults

Defined in: [src/types/transaction.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L91)

The result of sending and confirming one or more transactions, but where there is a primary transaction of interest

## Extends

- [`SendTransactionResult`](SendTransactionResult.md).[`SendTransactionResults`](SendTransactionResults.md)

## Properties

### confirmation

> **confirmation**: `PendingTransactionResponse`

Defined in: [src/types/transaction.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L93)

The response from sending and waiting for the primary transaction

#### Overrides

[`SendTransactionResult`](SendTransactionResult.md).[`confirmation`](SendTransactionResult.md#confirmation)

***

### confirmations

> **confirmations**: `PendingTransactionResponse`[]

Defined in: [src/types/transaction.ts:95](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L95)

The response from sending and waiting for the transactions

#### Overrides

[`SendTransactionResults`](SendTransactionResults.md).[`confirmations`](SendTransactionResults.md#confirmations)

***

### transaction

> **transaction**: `Transaction`

Defined in: [src/types/transaction.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L55)

The transaction

#### Inherited from

[`SendTransactionResult`](SendTransactionResult.md).[`transaction`](SendTransactionResult.md#transaction)

***

### transactions

> **transactions**: `Transaction`[]

Defined in: [src/types/transaction.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L63)

The transactions that have been prepared and/or sent

#### Inherited from

[`SendTransactionResults`](SendTransactionResults.md).[`transactions`](SendTransactionResults.md#transactions)
