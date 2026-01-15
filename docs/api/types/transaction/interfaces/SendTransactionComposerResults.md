[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/transaction](../README.md) / SendTransactionComposerResults

# Interface: SendTransactionComposerResults

Defined in: [src/types/transaction.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L67)

The result of preparing and/or sending multiple transactions using an `TransactionComposer`

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- `Omit`\<[`SendTransactionResults`](SendTransactionResults.md), `"confirmations"`\>

## Properties

### confirmations

> **confirmations**: [`PendingTransactionResponse`](../../../Packages/Algod-Client/type-aliases/PendingTransactionResponse.md)[]

Defined in: [src/types/transaction.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L77)

The responses if the transactions were sent and waited for,
the index of the confirmation will match the index of the underlying transaction

***

### groupId

> **groupId**: `string` \| `undefined`

Defined in: [src/types/transaction.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L69)

base64 encoded representation of the group ID of the group

***

### returns?

> `optional` **returns**: [`ABIReturn`](../../../Packages/ABI/type-aliases/ABIReturn.md)[]

Defined in: [src/types/transaction.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L73)

If ABI method(s) were called the processed return values

***

### transactions

> **transactions**: [`Transaction`](../../../Packages/Transact/classes/Transaction.md)[]

Defined in: [src/types/transaction.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L59)

The transactions that have been prepared and/or sent

#### Inherited from

[`SendTransactionResults`](SendTransactionResults.md).[`transactions`](SendTransactionResults.md#transactions)

***

### txIds

> **txIds**: `string`[]

Defined in: [src/types/transaction.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L71)

The transaction IDs that have been prepared and/or sent
