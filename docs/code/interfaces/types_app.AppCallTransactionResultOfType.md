[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / AppCallTransactionResultOfType

# Interface: AppCallTransactionResultOfType\<T\>

[types/app](../modules/types_app.md).AppCallTransactionResultOfType

The result of preparing and/or sending multiple transactions

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`SendTransactionResults`](types_transaction.SendTransactionResults.md)

- [`SendTransactionResult`](types_transaction.SendTransactionResult.md)

  ↳ **`AppCallTransactionResultOfType`**

## Table of contents

### Properties

- [confirmation](types_app.AppCallTransactionResultOfType.md#confirmation)
- [confirmations](types_app.AppCallTransactionResultOfType.md#confirmations)
- [return](types_app.AppCallTransactionResultOfType.md#return)
- [transaction](types_app.AppCallTransactionResultOfType.md#transaction)
- [transactions](types_app.AppCallTransactionResultOfType.md#transactions)

## Properties

### confirmation

• `Optional` **confirmation**: `PendingTransactionResponse`

The response if the transaction was sent and waited for

#### Inherited from

[SendTransactionResult](types_transaction.SendTransactionResult.md).[confirmation](types_transaction.SendTransactionResult.md#confirmation)

#### Defined in

[src/types/transaction.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L57)

___

### confirmations

• `Optional` **confirmations**: `PendingTransactionResponse`[]

The responses if the transactions were sent and waited for,
the index of the confirmation will match the index of the underlying transaction

#### Inherited from

[SendTransactionResults](types_transaction.SendTransactionResults.md).[confirmations](types_transaction.SendTransactionResults.md#confirmations)

#### Defined in

[src/types/transaction.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L67)

___

### return

• `Optional` **return**: `T`

If an ABI method was called the processed return value

#### Defined in

[src/types/app.ts:228](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L228)

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Inherited from

[SendTransactionResult](types_transaction.SendTransactionResult.md).[transaction](types_transaction.SendTransactionResult.md#transaction)

#### Defined in

[src/types/transaction.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L55)

___

### transactions

• **transactions**: `Transaction`[]

The transactions that have been prepared and/or sent

#### Inherited from

[SendTransactionResults](types_transaction.SendTransactionResults.md).[transactions](types_transaction.SendTransactionResults.md#transactions)

#### Defined in

[src/types/transaction.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L63)
