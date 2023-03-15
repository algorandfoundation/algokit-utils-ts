[@algorandfoundation/algokit-utils](../README.md) / [app](../modules/app.md) / AppCallTransactionResult

# Interface: AppCallTransactionResult

[app](../modules/app.md).AppCallTransactionResult

Result from calling an app

## Hierarchy

- [`SendTransactionResult`](transaction.SendTransactionResult.md)

  ↳ **`AppCallTransactionResult`**

## Table of contents

### Properties

- [confirmation](app.AppCallTransactionResult.md#confirmation)
- [return](app.AppCallTransactionResult.md#return)
- [transaction](app.AppCallTransactionResult.md#transaction)

## Properties

### confirmation

• `Optional` **confirmation**: [`PendingTransactionResponse`](types_algod.PendingTransactionResponse.md)

The response if the transaction was sent and waited for

#### Inherited from

[SendTransactionResult](transaction.SendTransactionResult.md).[confirmation](transaction.SendTransactionResult.md#confirmation)

#### Defined in

[transaction.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L151)

___

### return

• `Optional` **return**: [`ABIReturn`](../modules/app.md#abireturn)

If an ABI method was called the processed return value

#### Defined in

[app.ts:165](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L165)

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Inherited from

[SendTransactionResult](transaction.SendTransactionResult.md).[transaction](transaction.SendTransactionResult.md#transaction)

#### Defined in

[transaction.ts:149](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/transaction.ts#L149)
