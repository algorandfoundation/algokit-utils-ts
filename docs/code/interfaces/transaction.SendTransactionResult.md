[algotstest](../README.md) / [transaction](../modules/transaction.md) / SendTransactionResult

# Interface: SendTransactionResult

[transaction](../modules/transaction.md).SendTransactionResult

The result of sending a transaction

## Table of contents

### Properties

- [confirmation](transaction.SendTransactionResult.md#confirmation)
- [transaction](transaction.SendTransactionResult.md#transaction)

## Properties

### confirmation

• `Optional` **confirmation**: [`PendingTransactionResponse`](algod_type.PendingTransactionResponse.md)

The response if the transaction was sent and waited for

#### Defined in

[transaction.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/transaction.ts#L144)

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Defined in

[transaction.ts:142](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/transaction.ts#L142)
