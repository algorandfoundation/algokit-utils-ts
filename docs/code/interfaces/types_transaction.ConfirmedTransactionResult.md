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

• **confirmation**: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)

The response from sending and waiting for the transaction

#### Overrides

[SendTransactionResult](types_transaction.SendTransactionResult.md).[confirmation](types_transaction.SendTransactionResult.md#confirmation)

#### Defined in

[src/types/transaction.ts:100](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L100)

___

### transaction

• **transaction**: [`TransactionWrapper`](../classes/types_transaction.TransactionWrapper.md)

The transaction

#### Inherited from

[SendTransactionResult](types_transaction.SendTransactionResult.md).[transaction](types_transaction.SendTransactionResult.md#transaction)

#### Defined in

[src/types/transaction.ts:68](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L68)
