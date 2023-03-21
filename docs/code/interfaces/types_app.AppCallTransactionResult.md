[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / AppCallTransactionResult

# Interface: AppCallTransactionResult

[types/app](../modules/types_app.md).AppCallTransactionResult

Result from calling an app

## Hierarchy

- [`SendTransactionResult`](types_transaction.SendTransactionResult.md)

  ↳ **`AppCallTransactionResult`**

## Table of contents

### Properties

- [confirmation](types_app.AppCallTransactionResult.md#confirmation)
- [return](types_app.AppCallTransactionResult.md#return)
- [transaction](types_app.AppCallTransactionResult.md#transaction)

## Properties

### confirmation

• `Optional` **confirmation**: [`PendingTransactionResponse`](types_algod.PendingTransactionResponse.md)

The response if the transaction was sent and waited for

#### Inherited from

[SendTransactionResult](types_transaction.SendTransactionResult.md).[confirmation](types_transaction.SendTransactionResult.md#confirmation)

#### Defined in

types/transaction.ts:42

___

### return

• `Optional` **return**: [`ABIReturn`](../modules/types_app.md#abireturn)

If an ABI method was called the processed return value

#### Defined in

types/app.ts:152

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Inherited from

[SendTransactionResult](types_transaction.SendTransactionResult.md).[transaction](types_transaction.SendTransactionResult.md#transaction)

#### Defined in

types/transaction.ts:40
