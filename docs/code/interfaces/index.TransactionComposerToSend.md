[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / TransactionComposerToSend

# Interface: TransactionComposerToSend

[index](../modules/index.md).TransactionComposerToSend

An `TransactionComposer` with transactions to send.

## Hierarchy

- [`SendParams`](index.SendParams.md)

  ↳ **`TransactionComposerToSend`**

## Table of contents

### Properties

- [coverAppCallInnerTransactionFees](index.TransactionComposerToSend.md#coverappcallinnertransactionfees)
- [maxRoundsToWaitForConfirmation](index.TransactionComposerToSend.md#maxroundstowaitforconfirmation)
- [populateAppCallResources](index.TransactionComposerToSend.md#populateappcallresources)
- [suppressLog](index.TransactionComposerToSend.md#suppresslog)
- [transactionComposer](index.TransactionComposerToSend.md#transactioncomposer)

## Properties

### coverAppCallInnerTransactionFees

• `Optional` **coverAppCallInnerTransactionFees**: `boolean`

Whether to use simulate to automatically calculate required app call inner transaction fees and cover them in the parent app call transaction fee

#### Inherited from

[SendParams](index.SendParams.md).[coverAppCallInnerTransactionFees](index.SendParams.md#coverappcallinnertransactionfees)

#### Defined in

[src/transaction/types.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L132)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The number of rounds to wait for confirmation. By default until the latest lastValid has past.

#### Inherited from

[SendParams](index.SendParams.md).[maxRoundsToWaitForConfirmation](index.SendParams.md#maxroundstowaitforconfirmation)

#### Defined in

[src/transaction/types.ts:126](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L126)

___

### populateAppCallResources

• `Optional` **populateAppCallResources**: `boolean`

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`.

#### Inherited from

[SendParams](index.SendParams.md).[populateAppCallResources](index.SendParams.md#populateappcallresources)

#### Defined in

[src/transaction/types.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L130)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress.

#### Inherited from

[SendParams](index.SendParams.md).[suppressLog](index.SendParams.md#suppresslog)

#### Defined in

[src/transaction/types.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L128)

___

### transactionComposer

• **transactionComposer**: `TransactionComposer`

The `TransactionComposer` with transactions loaded to send

#### Defined in

[src/transaction/types.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L144)
