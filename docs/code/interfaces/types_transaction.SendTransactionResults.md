[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / SendTransactionResults

# Interface: SendTransactionResults

[types/transaction](../modules/types_transaction.md).SendTransactionResults

The result of preparing and/or sending multiple transactions

## Hierarchy

- **`SendTransactionResults`**

  ↳ [`AppCallTransactionResult`](types_app.AppCallTransactionResult.md)

  ↳ [`SendAtomicTransactionComposerResults`](types_transaction.SendAtomicTransactionComposerResults.md)

  ↳ [`ConfirmedTransactionResults`](types_transaction.ConfirmedTransactionResults.md)

## Table of contents

### Properties

- [confirmations](types_transaction.SendTransactionResults.md#confirmations)
- [transactions](types_transaction.SendTransactionResults.md#transactions)

## Properties

### confirmations

• `Optional` **confirmations**: [`PendingTransactionResponse`](types_algod.PendingTransactionResponse.md)[]

The responses if the transactions were sent and waited for,
the index of the confirmation will match the index of the underlying transaction

#### Defined in

[src/types/transaction.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L57)

___

### transactions

• **transactions**: `Transaction`[]

The transactions that have been prepared and/or sent

#### Defined in

[src/types/transaction.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L53)