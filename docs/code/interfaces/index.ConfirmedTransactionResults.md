[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / ConfirmedTransactionResults

# Interface: ConfirmedTransactionResults

[index](../modules/index.md).ConfirmedTransactionResults

The result of sending and confirming one or more transactions, but where there is a primary transaction of interest

## Hierarchy

- [`SendTransactionResult`](index.SendTransactionResult.md)

- [`SendTransactionResults`](index.SendTransactionResults.md)

  ↳ **`ConfirmedTransactionResults`**

## Table of contents

### Properties

- [confirmation](index.ConfirmedTransactionResults.md#confirmation)
- [confirmations](index.ConfirmedTransactionResults.md#confirmations)
- [transaction](index.ConfirmedTransactionResults.md#transaction)
- [transactions](index.ConfirmedTransactionResults.md#transactions)

## Properties

### confirmation

• **confirmation**: `PendingTransactionResponse`

The response from sending and waiting for the primary transaction

#### Overrides

[SendTransactionResult](index.SendTransactionResult.md).[confirmation](index.SendTransactionResult.md#confirmation)

#### Defined in

[src/transaction/types.ts:89](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L89)

___

### confirmations

• **confirmations**: `PendingTransactionResponse`[]

The response from sending and waiting for the transactions

#### Overrides

[SendTransactionResults](index.SendTransactionResults.md).[confirmations](index.SendTransactionResults.md#confirmations)

#### Defined in

[src/transaction/types.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L91)

___

### transaction

• **transaction**: `Transaction`

The transaction

#### Inherited from

[SendTransactionResult](index.SendTransactionResult.md).[transaction](index.SendTransactionResult.md#transaction)

#### Defined in

[src/transaction/types.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L51)

___

### transactions

• **transactions**: `Transaction`[]

The transactions that have been prepared and/or sent

#### Inherited from

[SendTransactionResults](index.SendTransactionResults.md).[transactions](index.SendTransactionResults.md#transactions)

#### Defined in

[src/transaction/types.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L59)
