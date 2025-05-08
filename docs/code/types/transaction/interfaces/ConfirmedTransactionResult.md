[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/transaction](../README.md) / ConfirmedTransactionResult

# Interface: ConfirmedTransactionResult

Defined in: [src/types/transaction.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L85)

The result of sending and confirming a transaction

## Extends

- [`SendTransactionResult`](SendTransactionResult.md)

## Properties

### confirmation

> **confirmation**: `PendingTransactionResponse`

Defined in: [src/types/transaction.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L87)

The response from sending and waiting for the transaction

#### Overrides

[`SendTransactionResult`](SendTransactionResult.md).[`confirmation`](SendTransactionResult.md#confirmation)

***

### transaction

> **transaction**: `Transaction`

Defined in: [src/types/transaction.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L55)

The transaction

#### Inherited from

[`SendTransactionResult`](SendTransactionResult.md).[`transaction`](SendTransactionResult.md#transaction)
