[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / SendTransactionResult

# Interface: SendTransactionResult

[types/transaction](../modules/types_transaction.md).SendTransactionResult

The result of sending a transaction

## Hierarchy

- **`SendTransactionResult`**

  ↳ [`AppCallTransactionResultOfType`](types_app.AppCallTransactionResultOfType.md)

  ↳ [`ConfirmedTransactionResult`](types_transaction.ConfirmedTransactionResult.md)

  ↳ [`ConfirmedTransactionResults`](types_transaction.ConfirmedTransactionResults.md)

## Table of contents

### Properties

- [confirmation](types_transaction.SendTransactionResult.md#confirmation)
- [transaction](types_transaction.SendTransactionResult.md#transaction)

## Properties

### confirmation

• `Optional` **confirmation**: [`PendingTransactionResponse`](types_algod.PendingTransactionResponse.md)

The response if the transaction was sent and waited for

#### Defined in

[src/types/transaction.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L47)

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Defined in

[src/types/transaction.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L45)
