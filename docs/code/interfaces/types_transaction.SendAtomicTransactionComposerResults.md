[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / SendAtomicTransactionComposerResults

# Interface: SendAtomicTransactionComposerResults

[types/transaction](../modules/types_transaction.md).SendAtomicTransactionComposerResults

The result of preparing and/or sending multiple transactions using an `AtomicTransactionComposer`

## Hierarchy

- `Omit`\<[`SendTransactionResults`](types_transaction.SendTransactionResults.md), ``"confirmations"``\>

  ↳ **`SendAtomicTransactionComposerResults`**

## Table of contents

### Properties

- [confirmations](types_transaction.SendAtomicTransactionComposerResults.md#confirmations)
- [groupId](types_transaction.SendAtomicTransactionComposerResults.md#groupid)
- [returns](types_transaction.SendAtomicTransactionComposerResults.md#returns)
- [transactions](types_transaction.SendAtomicTransactionComposerResults.md#transactions)
- [txIds](types_transaction.SendAtomicTransactionComposerResults.md#txids)

## Properties

### confirmations

• **confirmations**: [`PendingTransactionResponseWrapper`](../modules/types_transaction.md#pendingtransactionresponsewrapper)[]

The responses if the transactions were sent and waited for,
the index of the confirmation will match the index of the underlying transaction

#### Defined in

[src/types/transaction.ts:94](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L94)

___

### groupId

• **groupId**: `string`

base64 encoded representation of the group ID of the atomic group

#### Defined in

[src/types/transaction.ts:86](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L86)

___

### returns

• `Optional` **returns**: [`ABIReturn`](../modules/types_app.md#abireturn)[]

If ABI method(s) were called the processed return values

#### Defined in

[src/types/transaction.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L90)

___

### transactions

• **transactions**: [`TransactionWrapper`](../classes/types_transaction.TransactionWrapper.md)[]

The transactions that have been prepared and/or sent

#### Inherited from

Omit.transactions

#### Defined in

[src/types/transaction.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L76)

___

### txIds

• **txIds**: `string`[]

The transaction IDs that have been prepared and/or sent

#### Defined in

[src/types/transaction.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L88)
