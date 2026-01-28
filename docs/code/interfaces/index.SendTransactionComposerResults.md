[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / SendTransactionComposerResults

# Interface: SendTransactionComposerResults

[index](../modules/index.md).SendTransactionComposerResults

The result of preparing and/or sending multiple transactions using an `TransactionComposer`

## Hierarchy

- `Omit`\<[`SendTransactionResults`](index.SendTransactionResults.md), ``"confirmations"``\>

  ↳ **`SendTransactionComposerResults`**

## Table of contents

### Properties

- [confirmations](index.SendTransactionComposerResults.md#confirmations)
- [groupId](index.SendTransactionComposerResults.md#groupid)
- [returns](index.SendTransactionComposerResults.md#returns)
- [transactions](index.SendTransactionComposerResults.md#transactions)
- [txIds](index.SendTransactionComposerResults.md#txids)

## Properties

### confirmations

• **confirmations**: `PendingTransactionResponse`[]

The responses if the transactions were sent and waited for,
the index of the confirmation will match the index of the underlying transaction

#### Defined in

[src/transaction/types.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L77)

___

### groupId

• **groupId**: `undefined` \| `string`

base64 encoded representation of the group ID of the group

#### Defined in

[src/transaction/types.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L69)

___

### returns

• `Optional` **returns**: `ABIReturn`[]

If ABI method(s) were called the processed return values

#### Defined in

[src/transaction/types.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L73)

___

### transactions

• **transactions**: `Transaction`[]

The transactions that have been prepared and/or sent

#### Inherited from

Omit.transactions

#### Defined in

[src/transaction/types.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L59)

___

### txIds

• **txIds**: `string`[]

The transaction IDs that have been prepared and/or sent

#### Defined in

[src/transaction/types.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L71)
