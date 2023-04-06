[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / ConfirmedTransactionResults

# Interface: ConfirmedTransactionResults

[types/transaction](../modules/types_transaction.md).ConfirmedTransactionResults

The result of sending and confirming one or more transactions, but where there is a primary transaction of interest

## Hierarchy

- [`SendTransactionResult`](types_transaction.SendTransactionResult.md)

  ↳ **`ConfirmedTransactionResults`**

## Table of contents

### Properties

- [confirmation](types_transaction.ConfirmedTransactionResults.md#confirmation)
- [confirmations](types_transaction.ConfirmedTransactionResults.md#confirmations)
- [transaction](types_transaction.ConfirmedTransactionResults.md#transaction)
- [transactions](types_transaction.ConfirmedTransactionResults.md#transactions)

## Properties

### confirmation

• **confirmation**: [`PendingTransactionResponse`](types_algod.PendingTransactionResponse.md)

The response from sending and waiting for the primary transaction

#### Overrides

[SendTransactionResult](types_transaction.SendTransactionResult.md).[confirmation](types_transaction.SendTransactionResult.md#confirmation)

#### Defined in

[src/types/transaction.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L60)

___

### confirmations

• **confirmations**: [`PendingTransactionResponse`](types_algod.PendingTransactionResponse.md)[]

The response from sending and waiting for the transactions

#### Defined in

[src/types/transaction.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L62)

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Inherited from

[SendTransactionResult](types_transaction.SendTransactionResult.md).[transaction](types_transaction.SendTransactionResult.md#transaction)

#### Defined in

[src/types/transaction.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L44)

___

### transactions

• **transactions**: `Transaction`[]

The transactions

#### Defined in

[src/types/transaction.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L58)
