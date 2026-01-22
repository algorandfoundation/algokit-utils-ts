[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / SendTransactionParams

# Interface: SendTransactionParams

[index](../modules/index.md).SendTransactionParams

The sending configuration for a transaction

## Table of contents

### Properties

- [fee](index.SendTransactionParams.md#fee)
- [maxFee](index.SendTransactionParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](index.SendTransactionParams.md#maxroundstowaitforconfirmation)
- [populateAppCallResources](index.SendTransactionParams.md#populateappcallresources)
- [skipSending](index.SendTransactionParams.md#skipsending)
- [skipWaiting](index.SendTransactionParams.md#skipwaiting)
- [suppressLog](index.SendTransactionParams.md#suppresslog)
- [transactionComposer](index.SendTransactionParams.md#transactioncomposer)

## Properties

### fee

• `Optional` **fee**: [`AlgoAmount`](../classes/index.AlgoAmount.md)

The flat fee you want to pay, useful for covering extra fees in a transaction group or app call

#### Defined in

[src/transaction/types.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L36)

___

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/index.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Defined in

[src/transaction/types.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L38)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Defined in

[src/transaction/types.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L40)

___

### populateAppCallResources

• `Optional` **populateAppCallResources**: `boolean`

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to true when there are app calls in the group.

#### Defined in

[src/transaction/types.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L42)

___

### skipSending

• `Optional` **skipSending**: `boolean`

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain, unless `atc` specified)
and instead just return the raw transaction, e.g. so you can add it to a group of transactions

#### Defined in

[src/transaction/types.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L28)

___

### skipWaiting

• `Optional` **skipWaiting**: `boolean`

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Defined in

[src/transaction/types.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L30)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Defined in

[src/transaction/types.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L34)

___

### transactionComposer

• `Optional` **transactionComposer**: `TransactionComposer`

An optional `TransactionComposer` to add the transaction to, if specified then `skipSending: undefined` has the same effect as `skipSending: true`

#### Defined in

[src/transaction/types.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/types.ts#L32)
