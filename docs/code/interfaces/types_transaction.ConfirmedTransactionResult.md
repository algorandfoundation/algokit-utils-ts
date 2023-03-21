[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / ConfirmedTransactionResult

# Interface: ConfirmedTransactionResult

[types/transaction](../modules/types_transaction.md).ConfirmedTransactionResult

The result of sending and confirming a transaction

## Hierarchy

- [`SendTransactionResult`](types_transaction.SendTransactionResult.md)

  ↳ **`ConfirmedTransactionResult`**

## Table of contents

### Properties

- [confirmation](types_transaction.ConfirmedTransactionResult.md#confirmation)
- [transaction](types_transaction.ConfirmedTransactionResult.md#transaction)

## Properties

### confirmation

• **confirmation**: [`PendingTransactionResponse`](types_algod.PendingTransactionResponse.md)

The response if the transaction was sent and waited for

#### Overrides

[SendTransactionResult](types_transaction.SendTransactionResult.md).[confirmation](types_transaction.SendTransactionResult.md#confirmation)

#### Defined in

types/transaction.ts:48

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Inherited from

[SendTransactionResult](types_transaction.SendTransactionResult.md).[transaction](types_transaction.SendTransactionResult.md#transaction)

#### Defined in

types/transaction.ts:40
