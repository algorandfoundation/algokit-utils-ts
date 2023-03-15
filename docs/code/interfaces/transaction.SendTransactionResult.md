[@algorandfoundation/algokit-utils](../README.md) / [transaction](../modules/transaction.md) / SendTransactionResult

# Interface: SendTransactionResult

[transaction](../modules/transaction.md).SendTransactionResult

The result of sending a transaction

## Hierarchy

- **`SendTransactionResult`**

  ↳ [`AppCallTransactionResult`](app.AppCallTransactionResult.md)

## Table of contents

### Properties

- [confirmation](transaction.SendTransactionResult.md#confirmation)
- [transaction](transaction.SendTransactionResult.md#transaction)

## Properties

### confirmation

• `Optional` **confirmation**: [`PendingTransactionResponse`](types_algod.PendingTransactionResponse.md)

The response if the transaction was sent and waited for

#### Defined in

[transaction.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L151)

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Defined in

[transaction.ts:149](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L149)
