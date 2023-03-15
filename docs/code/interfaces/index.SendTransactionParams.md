[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / SendTransactionParams

# Interface: SendTransactionParams

[index](../modules/index.md).SendTransactionParams

The sending configuration for a transaction

## Hierarchy

- **`SendTransactionParams`**

  ↳ [`AppCallParams`](index.AppCallParams.md)

## Table of contents

### Properties

- [maxFee](index.SendTransactionParams.md#maxfee)
- [maxRoundsToWaitForConfirmation](index.SendTransactionParams.md#maxroundstowaitforconfirmation)
- [skipSending](index.SendTransactionParams.md#skipsending)
- [skipWaiting](index.SendTransactionParams.md#skipwaiting)
- [suppressLog](index.SendTransactionParams.md#suppresslog)

## Properties

### maxFee

• `Optional` **maxFee**: [`AlgoAmount`](../classes/index.AlgoAmount.md)

The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion

#### Defined in

[transaction.ts:141](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L141)

___

### maxRoundsToWaitForConfirmation

• `Optional` **maxRoundsToWaitForConfirmation**: `number`

The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds

#### Defined in

[transaction.ts:143](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L143)

___

### skipSending

• `Optional` **skipSending**: `boolean`

Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain)
  (and instead just return the raw transaction, e.g. so you can add it to a group of transactions)

#### Defined in

[transaction.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L135)

___

### skipWaiting

• `Optional` **skipWaiting**: `boolean`

Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset)

#### Defined in

[transaction.ts:137](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L137)

___

### suppressLog

• `Optional` **suppressLog**: `boolean`

Whether to suppress log messages from transaction send, default: do not suppress

#### Defined in

[transaction.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction.ts#L139)
