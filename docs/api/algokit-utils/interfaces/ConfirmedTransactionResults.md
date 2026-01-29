[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / ConfirmedTransactionResults

# Interface: ConfirmedTransactionResults

Defined in: [src/transaction/types.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L87)

The result of sending and confirming one or more transactions, but where there is a primary transaction of interest

## Hierarchy

[View Summary](../../hierarchy.md)

### Extends

- [`SendTransactionResult`](SendTransactionResult.md).[`SendTransactionResults`](SendTransactionResults.md)

## Properties

### confirmation

> **confirmation**: [`PendingTransactionResponse`](../../Subpaths/algod-client/type-aliases/PendingTransactionResponse.md)

Defined in: [src/transaction/types.ts:89](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L89)

The response from sending and waiting for the primary transaction

#### Overrides

[`SendTransactionResult`](SendTransactionResult.md).[`confirmation`](SendTransactionResult.md#confirmation)

***

### confirmations

> **confirmations**: [`PendingTransactionResponse`](../../Subpaths/algod-client/type-aliases/PendingTransactionResponse.md)[]

Defined in: [src/transaction/types.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L91)

The response from sending and waiting for the transactions

#### Overrides

[`SendTransactionResults`](SendTransactionResults.md).[`confirmations`](SendTransactionResults.md#confirmations)

***

### transaction

> **transaction**: [`Transaction`](../../Subpaths/transact/classes/Transaction.md)

Defined in: [src/transaction/types.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L51)

The transaction

#### Inherited from

[`SendTransactionResult`](SendTransactionResult.md).[`transaction`](SendTransactionResult.md#transaction)

***

### transactions

> **transactions**: [`Transaction`](../../Subpaths/transact/classes/Transaction.md)[]

Defined in: [src/transaction/types.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L59)

The transactions that have been prepared and/or sent

#### Inherited from

[`SendTransactionResults`](SendTransactionResults.md).[`transactions`](SendTransactionResults.md#transactions)
