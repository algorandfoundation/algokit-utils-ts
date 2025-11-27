[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / TransactionComposerToSend

# Interface: TransactionComposerToSend

[types/transaction](../modules/types_transaction.md).TransactionComposerToSend

An `TransactionComposer` with transactions to send.

## Hierarchy

- [`SendParams`](types_transaction.SendParams.md)

  ↳ **`TransactionComposerToSend`**

## Table of contents

### Properties

- [coverAppCallInnerTransactionFees](types_transaction.TransactionComposerToSend.md#coverappcallinnertransactionfees)
- [maxRoundsToWaitForConfirmation](types_transaction.TransactionComposerToSend.md#maxroundstowaitforconfirmation)
- [populateAppCallResources](types_transaction.TransactionComposerToSend.md#populateappcallresources)
- [suppressLog](types_transaction.TransactionComposerToSend.md#suppresslog)
- [transactionComposer](types_transaction.TransactionComposerToSend.md#transactioncomposer)

## Properties

### coverAppCallInnerTransactionFees

• `Optional` **coverAppCallInnerTransactionFees**: `boolean`

Whether to use simulate to automatically calculate required app call inner transaction fees and cover them in the parent app call transaction fee

#### Inherited from

[SendParams](types_transaction.SendParams.md).[coverAppCallInnerTransactionFees](types_transaction.SendParams.md#coverappcallinnertransactionfees)

#### Defined in

[src/types/transaction.ts:149](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L149)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The number of rounds to wait for confirmation. By default until the latest lastValid has past.

#### Inherited from

[SendParams](types_transaction.SendParams.md).[maxRoundsToWaitForConfirmation](types_transaction.SendParams.md#maxroundstowaitforconfirmation)

#### Defined in

[src/types/transaction.ts:143](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L143)

___

### populateAppCallResources

• `Optional` **populateAppCallResources**: `boolean`

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`.

#### Inherited from

[SendParams](types_transaction.SendParams.md).[populateAppCallResources](types_transaction.SendParams.md#populateappcallresources)

#### Defined in

[src/types/transaction.ts:147](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L147)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress.

#### Inherited from

[SendParams](types_transaction.SendParams.md).[suppressLog](types_transaction.SendParams.md#suppresslog)

#### Defined in

[src/types/transaction.ts:145](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L145)

___

### transactionComposer

• **transactionComposer**: [`TransactionComposer`](../classes/types_composer.TransactionComposer.md)

The `TransactionComposer` with transactions loaded to send

#### Defined in

[src/types/transaction.ts:161](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L161)
