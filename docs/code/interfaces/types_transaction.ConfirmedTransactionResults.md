[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / ConfirmedTransactionResults

# Interface: ConfirmedTransactionResults

[types/transaction](../modules/types_transaction.md).ConfirmedTransactionResults

The result of sending and confirming one or more transactions, but where there is a primary transaction of interest

## Hierarchy

- [`SendTransactionResult`](types_transaction.SendTransactionResult.md)

- [`SendTransactionResults`](types_transaction.SendTransactionResults.md)

  ↳ **`ConfirmedTransactionResults`**

## Table of contents

### Properties

- [confirmation](types_transaction.ConfirmedTransactionResults.md#confirmation)
- [confirmations](types_transaction.ConfirmedTransactionResults.md#confirmations)
- [transaction](types_transaction.ConfirmedTransactionResults.md#transaction)
- [transactions](types_transaction.ConfirmedTransactionResults.md#transactions)

## Properties

### confirmation

• **confirmation**: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)

The response from sending and waiting for the primary transaction

#### Overrides

[SendTransactionResult](types_transaction.SendTransactionResult.md).[confirmation](types_transaction.SendTransactionResult.md#confirmation)

#### Defined in

[src/types/transaction.ts:103](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L103)

___

### confirmations

• **confirmations**: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[]

The response from sending and waiting for the transactions

#### Overrides

[SendTransactionResults](types_transaction.SendTransactionResults.md).[confirmations](types_transaction.SendTransactionResults.md#confirmations)

#### Defined in

[src/types/transaction.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L105)

___

### transaction

• **transaction**: [`TransactionWrapper`](../classes/types_transaction.TransactionWrapper.md)

The transaction

#### Inherited from

[SendTransactionResult](types_transaction.SendTransactionResult.md).[transaction](types_transaction.SendTransactionResult.md#transaction)

#### Defined in

[src/types/transaction.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L65)

___

### transactions

• **transactions**: [`TransactionWrapper`](../classes/types_transaction.TransactionWrapper.md)[]

The transactions that have been prepared and/or sent

#### Inherited from

[SendTransactionResults](types_transaction.SendTransactionResults.md).[transactions](types_transaction.SendTransactionResults.md#transactions)

#### Defined in

[src/types/transaction.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L73)
