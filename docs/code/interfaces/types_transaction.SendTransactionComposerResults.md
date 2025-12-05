[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / SendTransactionComposerResults

# Interface: SendTransactionComposerResults

[types/transaction](../modules/types_transaction.md).SendTransactionComposerResults

The result of preparing and/or sending multiple transactions using an `TransactionComposer`

## Hierarchy

- `Omit`\<[`SendTransactionResults`](types_transaction.SendTransactionResults.md), ``"confirmations"``\>

  ↳ **`SendTransactionComposerResults`**

## Table of contents

### Properties

- [confirmations](types_transaction.SendTransactionComposerResults.md#confirmations)
- [groupId](types_transaction.SendTransactionComposerResults.md#groupid)
- [returns](types_transaction.SendTransactionComposerResults.md#returns)
- [transactions](types_transaction.SendTransactionComposerResults.md#transactions)
- [txIds](types_transaction.SendTransactionComposerResults.md#txids)

## Properties

### confirmations

• **confirmations**: `PendingTransactionResponse`[]

The responses if the transactions were sent and waited for,
the index of the confirmation will match the index of the underlying transaction

#### Defined in

[src/types/transaction.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L77)

___

### groupId

• **groupId**: `undefined` \| `string`

base64 encoded representation of the group ID of the group

#### Defined in

[src/types/transaction.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L69)

___

### returns

• `Optional` **returns**: `ABIReturn`[]

If ABI method(s) were called the processed return values

#### Defined in

[src/types/transaction.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L73)

___

### transactions

• **transactions**: `Transaction`[]

The transactions that have been prepared and/or sent

#### Inherited from

Omit.transactions

#### Defined in

[src/types/transaction.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L59)

___

### txIds

• **txIds**: `string`[]

The transaction IDs that have been prepared and/or sent

#### Defined in

[src/types/transaction.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L71)
