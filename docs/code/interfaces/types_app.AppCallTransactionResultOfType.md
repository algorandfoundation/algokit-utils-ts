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

• `Optional` **confirmation**: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)

The response if the transaction was sent and waited for

#### Inherited from

[SendTransactionResult](types_transaction.SendTransactionResult.md).[confirmation](types_transaction.SendTransactionResult.md#confirmation)

#### Defined in

[src/types/transaction.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L70)

___

### confirmations

• `Optional` **confirmations**: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[]

The responses if the transactions were sent and waited for,
the index of the confirmation will match the index of the underlying transaction

#### Inherited from

[SendTransactionResults](types_transaction.SendTransactionResults.md).[confirmations](types_transaction.SendTransactionResults.md#confirmations)

#### Defined in

[src/types/transaction.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L80)

___

### return

• `Optional` **return**: `T`

If an ABI method was called the processed return value

#### Defined in

[src/types/app.ts:143](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L143)

___

### transaction

• **transaction**: [`TransactionWrapper`](../classes/types_transaction.TransactionWrapper.md)

The transaction

#### Inherited from

[SendTransactionResult](types_transaction.SendTransactionResult.md).[transaction](types_transaction.SendTransactionResult.md#transaction)

#### Defined in

[src/types/transaction.ts:68](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L68)

___

### transactions

• **transactions**: [`TransactionWrapper`](../classes/types_transaction.TransactionWrapper.md)[]

The transactions that have been prepared and/or sent

#### Inherited from

[SendTransactionResults](types_transaction.SendTransactionResults.md).[transactions](types_transaction.SendTransactionResults.md#transactions)

#### Defined in

[src/types/transaction.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L76)
