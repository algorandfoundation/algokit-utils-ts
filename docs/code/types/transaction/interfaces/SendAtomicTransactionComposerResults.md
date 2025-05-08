[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/transaction](../README.md) / SendAtomicTransactionComposerResults

# Interface: SendAtomicTransactionComposerResults

Defined in: [src/types/transaction.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L71)

The result of preparing and/or sending multiple transactions using an `AtomicTransactionComposer`

## Extends

- [`SendTransactionResults`](SendTransactionResults.md)

## Properties

### confirmations

> **confirmations**: `PendingTransactionResponse`[]

Defined in: [src/types/transaction.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L81)

The responses if the transactions were sent and waited for,
the index of the confirmation will match the index of the underlying transaction

#### Overrides

[`SendTransactionResults`](SendTransactionResults.md).[`confirmations`](SendTransactionResults.md#confirmations)

***

### groupId

> **groupId**: `string`

Defined in: [src/types/transaction.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L73)

base64 encoded representation of the group ID of the atomic group

***

### returns?

> `optional` **returns**: [`ABIReturn`](../../app/type-aliases/ABIReturn.md)[]

Defined in: [src/types/transaction.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L77)

If ABI method(s) were called the processed return values

***

### transactions

> **transactions**: `Transaction`[]

Defined in: [src/types/transaction.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L63)

The transactions that have been prepared and/or sent

#### Inherited from

[`SendTransactionResults`](SendTransactionResults.md).[`transactions`](SendTransactionResults.md#transactions)

***

### txIds

> **txIds**: `string`[]

Defined in: [src/types/transaction.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L75)

The transaction IDs that have been prepared and/or sent
