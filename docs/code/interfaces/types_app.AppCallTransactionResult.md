[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / AppCallTransactionResult

# Interface: AppCallTransactionResult

[types/app](../modules/types_app.md).AppCallTransactionResult

Result from calling an app

## Hierarchy

- [`SendTransactionResults`](types_transaction.SendTransactionResults.md)

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

[src/types/transaction.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L47)

___

### confirmations

• `Optional` **confirmations**: [`PendingTransactionResponse`](types_algod.PendingTransactionResponse.md)[]

The responses if the transactions were sent and waited for,
the index of the confirmation will match the index of the underlying transaction

#### Inherited from

[SendTransactionResults](types_transaction.SendTransactionResults.md).[confirmations](types_transaction.SendTransactionResults.md#confirmations)

#### Defined in

[src/types/transaction.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L57)

___

### return

• `Optional` **return**: [`ABIReturn`](../modules/types_app.md#abireturn)

If an ABI method was called the processed return value

#### Defined in

[src/types/app.ts:175](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L175)

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Inherited from

[SendTransactionResult](types_transaction.SendTransactionResult.md).[transaction](types_transaction.SendTransactionResult.md#transaction)

#### Defined in

[src/types/transaction.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L45)

___

### transactions

• **transactions**: `Transaction`[]

The transactions that have been prepared and/or sent

#### Inherited from

[SendTransactionResults](types_transaction.SendTransactionResults.md).[transactions](types_transaction.SendTransactionResults.md#transactions)

#### Defined in

[src/types/transaction.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L53)
