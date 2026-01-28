[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / SendTransactionResults

# Interface: SendTransactionResults

[index](../modules/index.md).SendTransactionResults

The result of preparing and/or sending multiple transactions

## Hierarchy

- **`SendTransactionResults`**

  ↳ [`ConfirmedTransactionResults`](index.ConfirmedTransactionResults.md)

## Table of contents

### Properties

- [confirmations](index.SendTransactionResults.md#confirmations)
- [transactions](index.SendTransactionResults.md#transactions)

## Properties

### confirmations

• `Optional` **confirmations**: `PendingTransactionResponse`[]

The responses if the transactions were sent and waited for,
the index of the confirmation will match the index of the underlying transaction

#### Defined in

[src/transaction/types.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L63)

___

### transactions

• **transactions**: `Transaction`[]

The transactions that have been prepared and/or sent

#### Defined in

[src/transaction/types.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L59)
