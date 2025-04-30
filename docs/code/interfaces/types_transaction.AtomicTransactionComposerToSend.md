[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / AtomicTransactionComposerToSend

# Interface: AtomicTransactionComposerToSend

[types/transaction](../modules/types_transaction.md).AtomicTransactionComposerToSend

An `AtomicTransactionComposer` with transactions to send.

## Hierarchy

- [`SendParams`](types_transaction.SendParams.md)

  ↳ **`AtomicTransactionComposerToSend`**

## Table of contents

### Properties

- [additionalAtcContext](types_transaction.AtomicTransactionComposerToSend.md#additionalatccontext)
- [atc](types_transaction.AtomicTransactionComposerToSend.md#atc)
- [coverAppCallInnerTransactionFees](types_transaction.AtomicTransactionComposerToSend.md#coverappcallinnertransactionfees)
- [maxRoundsToWaitForConfirmation](types_transaction.AtomicTransactionComposerToSend.md#maxroundstowaitforconfirmation)
- [populateAppCallResources](types_transaction.AtomicTransactionComposerToSend.md#populateappcallresources)
- [sendParams](types_transaction.AtomicTransactionComposerToSend.md#sendparams)
- [suppressLog](types_transaction.AtomicTransactionComposerToSend.md#suppresslog)

## Properties

### additionalAtcContext

• `Optional` **additionalAtcContext**: [`AdditionalAtomicTransactionComposerContext`](types_transaction.AdditionalAtomicTransactionComposerContext.md)

Additional `AtomicTransactionComposer` context used when building the transaction group that is sent.
This additional context is used and must be supplied when coverAppCallInnerTransactionFees is set to true.

#### Defined in

[src/types/transaction.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L171)

___

### atc

• **atc**: `AtomicTransactionComposer`

The `AtomicTransactionComposer` with transactions loaded to send

#### Defined in

[src/types/transaction.ts:161](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L161)

___

### coverAppCallInnerTransactionFees

• `Optional` **coverAppCallInnerTransactionFees**: `boolean`

Whether to use simulate to automatically calculate required app call inner transaction fees and cover them in the parent app call transaction fee

#### Inherited from

[SendParams](types_transaction.SendParams.md).[coverAppCallInnerTransactionFees](types_transaction.SendParams.md#coverappcallinnertransactionfees)

#### Defined in

[src/types/transaction.ts:146](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L146)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The number of rounds to wait for confirmation. By default until the latest lastValid has past.

#### Inherited from

[SendParams](types_transaction.SendParams.md).[maxRoundsToWaitForConfirmation](types_transaction.SendParams.md#maxroundstowaitforconfirmation)

#### Defined in

[src/types/transaction.ts:140](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L140)

___

### populateAppCallResources

• `Optional` **populateAppCallResources**: `boolean`

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`.

#### Inherited from

[SendParams](types_transaction.SendParams.md).[populateAppCallResources](types_transaction.SendParams.md#populateappcallresources)

#### Defined in

[src/types/transaction.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L144)

___

### sendParams

• `Optional` **sendParams**: `Omit`\<[`SendTransactionParams`](types_transaction.SendTransactionParams.md), ``"fee"`` \| ``"maxFee"`` \| ``"skipSending"`` \| ``"atc"``\>

**`Deprecated`**

- set the parameters at the top level instead
Any parameters to control the semantics of the send to the network

#### Defined in

[src/types/transaction.ts:165](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L165)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress.

#### Inherited from

[SendParams](types_transaction.SendParams.md).[suppressLog](types_transaction.SendParams.md#suppresslog)

#### Defined in

[src/types/transaction.ts:142](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L142)
