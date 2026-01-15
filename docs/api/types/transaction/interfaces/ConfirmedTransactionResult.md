[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/transaction](../README.md) / ConfirmedTransactionResult

# Interface: ConfirmedTransactionResult

Defined in: [src/types/transaction.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L81)

The result of sending and confirming a transaction

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`SendTransactionResult`](SendTransactionResult.md)

## Properties

### confirmation

> **confirmation**: [`PendingTransactionResponse`](../../../Packages/Algod-Client/type-aliases/PendingTransactionResponse.md)

Defined in: [src/types/transaction.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L83)

The response from sending and waiting for the transaction

#### Overrides

[`SendTransactionResult`](SendTransactionResult.md).[`confirmation`](SendTransactionResult.md#confirmation)

***

### transaction

> **transaction**: [`Transaction`](../../../Packages/Transact/classes/Transaction.md)

Defined in: [src/types/transaction.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L51)

The transaction

#### Inherited from

[`SendTransactionResult`](SendTransactionResult.md).[`transaction`](SendTransactionResult.md#transaction)
