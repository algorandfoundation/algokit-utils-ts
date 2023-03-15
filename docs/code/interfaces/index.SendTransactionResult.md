[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / SendTransactionResult

# Interface: SendTransactionResult

[index](../modules/index.md).SendTransactionResult

The result of sending a transaction

## Hierarchy

- **`SendTransactionResult`**

  ↳ [`AppCallTransactionResult`](index.AppCallTransactionResult.md)

## Table of contents

### Properties

- [confirmation](index.SendTransactionResult.md#confirmation)
- [transaction](index.SendTransactionResult.md#transaction)

## Properties

### confirmation

• `Optional` **confirmation**: [`PendingTransactionResponse`](types_algod.PendingTransactionResponse.md)

The response if the transaction was sent and waited for

#### Defined in

[transaction.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/transaction.ts#L151)

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Defined in

[transaction.ts:149](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/transaction.ts#L149)
