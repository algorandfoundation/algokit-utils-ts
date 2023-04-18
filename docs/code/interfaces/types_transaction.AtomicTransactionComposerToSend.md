[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / AtomicTransactionComposerToSend

# Interface: AtomicTransactionComposerToSend

[types/transaction](../modules/types_transaction.md).AtomicTransactionComposerToSend

An

**`See`**

AtomicTransactionComposer with transactions to send.

## Table of contents

### Properties

- [atc](types_transaction.AtomicTransactionComposerToSend.md#atc)
- [sendParams](types_transaction.AtomicTransactionComposerToSend.md#sendparams)

## Properties

### atc

• **atc**: `AtomicTransactionComposer`

The

**`See`**

AtomicTransactionComposer with transactions loaded to send

#### Defined in

[src/types/transaction.ts:103](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L103)

___

### sendParams

• `Optional` **sendParams**: `Omit`<[`SendTransactionParams`](types_transaction.SendTransactionParams.md), ``"fee"`` \| ``"maxFee"`` \| ``"skipSending"`` \| ``"atc"``\>

Any parameters to control the semantics of the send to the network

#### Defined in

[src/types/transaction.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L105)
