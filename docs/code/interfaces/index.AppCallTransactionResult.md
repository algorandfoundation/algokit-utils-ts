[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / AppCallTransactionResult

# Interface: AppCallTransactionResult

[index](../modules/index.md).AppCallTransactionResult

Result from calling an app

## Hierarchy

- [`SendTransactionResult`](index.SendTransactionResult.md)

  ↳ **`AppCallTransactionResult`**

## Table of contents

### Properties

- [confirmation](index.AppCallTransactionResult.md#confirmation)
- [return](index.AppCallTransactionResult.md#return)
- [transaction](index.AppCallTransactionResult.md#transaction)

## Properties

### confirmation

• `Optional` **confirmation**: [`PendingTransactionResponse`](types_algod.PendingTransactionResponse.md)

The response if the transaction was sent and waited for

#### Inherited from

[SendTransactionResult](index.SendTransactionResult.md).[confirmation](index.SendTransactionResult.md#confirmation)

#### Defined in

[transaction.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L151)

___

### return

• `Optional` **return**: [`ABIReturn`](../modules/index.md#abireturn)

If an ABI method was called the processed return value

#### Defined in

[app.ts:165](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L165)

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Inherited from

[SendTransactionResult](index.SendTransactionResult.md).[transaction](index.SendTransactionResult.md#transaction)

#### Defined in

[transaction.ts:149](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L149)
