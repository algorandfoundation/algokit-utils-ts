[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / ConfirmedTransactionResult

# Interface: ConfirmedTransactionResult

[index](../modules/index.md).ConfirmedTransactionResult

The result of sending and confirming a transaction

## Hierarchy

- [`SendTransactionResult`](index.SendTransactionResult.md)

  ↳ **`ConfirmedTransactionResult`**

## Table of contents

### Properties

- [confirmation](index.ConfirmedTransactionResult.md#confirmation)
- [transaction](index.ConfirmedTransactionResult.md#transaction)

## Properties

### confirmation

• **confirmation**: `PendingTransactionResponse`

The response from sending and waiting for the transaction

#### Overrides

[SendTransactionResult](index.SendTransactionResult.md).[confirmation](index.SendTransactionResult.md#confirmation)

#### Defined in

[src/transaction/types.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L83)

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Inherited from

[SendTransactionResult](index.SendTransactionResult.md).[transaction](index.SendTransactionResult.md#transaction)

#### Defined in

[src/transaction/types.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L51)
