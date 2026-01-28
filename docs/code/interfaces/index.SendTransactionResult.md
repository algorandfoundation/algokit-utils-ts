[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / SendTransactionResult

# Interface: SendTransactionResult

[index](../modules/index.md).SendTransactionResult

The result of sending a transaction

## Hierarchy

- **`SendTransactionResult`**

  ↳ [`ConfirmedTransactionResult`](index.ConfirmedTransactionResult.md)

  ↳ [`ConfirmedTransactionResults`](index.ConfirmedTransactionResults.md)

## Table of contents

### Properties

- [confirmation](index.SendTransactionResult.md#confirmation)
- [transaction](index.SendTransactionResult.md#transaction)

## Properties

### confirmation

• `Optional` **confirmation**: `PendingTransactionResponse`

The response if the transaction was sent and waited for

#### Defined in

[src/transaction/types.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L53)

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Defined in

[src/transaction/types.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L51)
