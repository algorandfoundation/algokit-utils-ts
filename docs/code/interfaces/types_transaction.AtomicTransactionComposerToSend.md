[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / AtomicTransactionComposerToSend

# Interface: AtomicTransactionComposerToSend

[types/transaction](../modules/types_transaction.md).AtomicTransactionComposerToSend

An `AtomicTransactionComposer` with transactions to send.

## Table of contents

### Properties

- [atc](types_transaction.AtomicTransactionComposerToSend.md#atc)
- [executeParams](types_transaction.AtomicTransactionComposerToSend.md#executeparams)
- [sendParams](types_transaction.AtomicTransactionComposerToSend.md#sendparams)

## Properties

### atc

• **atc**: `AtomicTransactionComposer`

The `AtomicTransactionComposer` with transactions loaded to send

#### Defined in

[src/types/transaction.ts:146](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L146)

___

### executeParams

• `Optional` **executeParams**: [`ExecuteParams`](types_transaction.ExecuteParams.md)

Any parameters to control the semantics of the send to the network

#### Defined in

[src/types/transaction.ts:148](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L148)

___

### sendParams

• `Optional` **sendParams**: `Omit`\<[`SendTransactionParams`](types_transaction.SendTransactionParams.md), ``"fee"`` \| ``"maxFee"`` \| ``"skipSending"`` \| ``"atc"``\>

**`Deprecated`**

- use executeParams instead
Any parameters to control the semantics of the send to the network

#### Defined in

[src/types/transaction.ts:152](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L152)
