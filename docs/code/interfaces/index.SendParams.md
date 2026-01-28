[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / SendParams

# Interface: SendParams

[index](../modules/index.md).SendParams

Parameters to configure transaction sending.

## Hierarchy

- **`SendParams`**

  ↳ [`TransactionComposerToSend`](index.TransactionComposerToSend.md)

## Table of contents

### Properties

- [coverAppCallInnerTransactionFees](index.SendParams.md#coverappcallinnertransactionfees)
- [maxRoundsToWaitForConfirmation](index.SendParams.md#maxroundstowaitforconfirmation)
- [populateAppCallResources](index.SendParams.md#populateappcallresources)
- [suppressLog](index.SendParams.md#suppresslog)

## Properties

### coverAppCallInnerTransactionFees

• `Optional` **coverAppCallInnerTransactionFees**: `boolean`

Whether to use simulate to automatically calculate required app call inner transaction fees and cover them in the parent app call transaction fee

#### Defined in

[src/transaction/types.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L132)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The number of rounds to wait for confirmation. By default until the latest lastValid has past.

#### Defined in

[src/transaction/types.ts:126](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L126)

___

### populateAppCallResources

• `Optional` **populateAppCallResources**: `boolean`

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`.

#### Defined in

[src/transaction/types.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L130)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress.

#### Defined in

[src/transaction/types.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L128)
