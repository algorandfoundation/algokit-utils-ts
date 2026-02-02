[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / ConfirmedTransactionResult

# Interface: ConfirmedTransactionResult

Defined in: [src/transaction/types.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L81)

The result of sending and confirming a transaction

## Hierarchy

[View Summary](../../hierarchy.md)

### Extends

- [`SendTransactionResult`](SendTransactionResult.md)

## Properties

### confirmation

> **confirmation**: [`PendingTransactionResponse`](../../Subpaths/algod-client/type-aliases/PendingTransactionResponse.md)

Defined in: [src/transaction/types.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L83)

The response from sending and waiting for the transaction

#### Overrides

[`SendTransactionResult`](SendTransactionResult.md).[`confirmation`](SendTransactionResult.md#confirmation)

***

### transaction

> **transaction**: [`Transaction`](../../Subpaths/transact/classes/Transaction.md)

Defined in: [src/transaction/types.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L51)

The transaction

#### Inherited from

[`SendTransactionResult`](SendTransactionResult.md).[`transaction`](SendTransactionResult.md#transaction)
