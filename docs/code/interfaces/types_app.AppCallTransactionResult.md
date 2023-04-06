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
- [confirmations](types_app.AppCallTransactionResult.md#confirmations)
- [return](types_app.AppCallTransactionResult.md#return)
- [transaction](types_app.AppCallTransactionResult.md#transaction)
- [transactions](types_app.AppCallTransactionResult.md#transactions)

## Properties

### confirmation

• `Optional` **confirmation**: [`PendingTransactionResponse`](types_algod.PendingTransactionResponse.md)

The response if the transaction was sent and waited for

#### Inherited from

[SendTransactionResult](types_transaction.SendTransactionResult.md).[confirmation](types_transaction.SendTransactionResult.md#confirmation)

#### Defined in

[src/types/transaction.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L46)

___

### confirmations

• `Optional` **confirmations**: [`PendingTransactionResponse`](types_algod.PendingTransactionResponse.md)[]

The responses if the transactions are sent and waited for

#### Defined in

[src/types/app.ts:162](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L162)

___

### return

• `Optional` **return**: [`ABIReturn`](../modules/types_app.md#abireturn)

If an ABI method was called the processed return value

#### Defined in

[src/types/app.ts:164](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L164)

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Inherited from

[SendTransactionResult](types_transaction.SendTransactionResult.md).[transaction](types_transaction.SendTransactionResult.md#transaction)

#### Defined in

[src/types/transaction.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L44)

___

### transactions

• **transactions**: `Transaction`[]

All transactions sent as part of the app call (i.e. multiple if an ABI call is made which includes transaction arguments)

#### Defined in

[src/types/app.ts:160](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L160)
