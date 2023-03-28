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

[src/types/transaction.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L44)

___

### return

• `Optional` **return**: [`ABIReturn`](../modules/types_app.md#abireturn)

If an ABI method was called the processed return value

#### Defined in

[src/types/app.ts:158](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L158)

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Inherited from

[SendTransactionResult](types_transaction.SendTransactionResult.md).[transaction](types_transaction.SendTransactionResult.md#transaction)

#### Defined in

[src/types/transaction.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L42)
