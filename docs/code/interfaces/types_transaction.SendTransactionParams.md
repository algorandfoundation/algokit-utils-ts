[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / SendTransactionParams

# Interface: SendTransactionParams

[types/transaction](../modules/types_transaction.md).SendTransactionParams

The sending configuration for a transaction

## Hierarchy

- **`SendTransactionParams`**

  ↳ [`AppCallParams`](types_app.AppCallParams.md)

## Table of contents

### Properties

- [fee](types_transaction.SendTransactionParams.md#fee)
- [maxFee](types_transaction.SendTransactionParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](types_transaction.SendTransactionParams.md#maxroundstowaitforconfirmation)
- [populateAppCallResources](types_transaction.SendTransactionParams.md#populateappcallresources)
- [skipSending](types_transaction.SendTransactionParams.md#skipsending)
- [skipWaiting](types_transaction.SendTransactionParams.md#skipwaiting)
- [suppressLog](types_transaction.SendTransactionParams.md#suppresslog)
- [transactionComposer](types_transaction.SendTransactionParams.md#transactioncomposer)

## Properties

### fee

• `Optional` **fee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The flat fee you want to pay, useful for covering extra fees in a transaction group or app call

#### Defined in

[src/types/transaction.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L53)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Defined in

[src/types/transaction.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L55)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Defined in

[src/types/transaction.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L57)

___

### populateAppCallResources

• `Optional` **populateAppCallResources**: `boolean`

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to true when there are app calls in the group.

#### Defined in

[src/types/transaction.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L59)

___

### skipSending

• `Optional` **skipSending**: `boolean`

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain, unless `atc` specified)
and instead just return the raw transaction, e.g. so you can add it to a group of transactions

#### Defined in

[src/types/transaction.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L45)

___

### skipWaiting

• `Optional` **skipWaiting**: `boolean`

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Defined in

[src/types/transaction.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L47)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Defined in

[src/types/transaction.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L51)

___

### transactionComposer

• `Optional` **transactionComposer**: [`TransactionComposer`](../classes/types_composer.TransactionComposer.md)

An optional `TransactionComposer` to add the transaction to, if specified then `skipSending: undefined` has the same effect as `skipSending: true`

#### Defined in

[src/types/transaction.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L49)
