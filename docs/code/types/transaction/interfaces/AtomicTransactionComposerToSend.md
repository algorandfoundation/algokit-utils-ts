[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/transaction](../README.md) / AtomicTransactionComposerToSend

# Interface: AtomicTransactionComposerToSend

Defined in: [src/types/transaction.ts:155](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L155)

An `AtomicTransactionComposer` with transactions to send.

## Extends

- [`SendParams`](SendParams.md)

## Properties

### additionalAtcContext?

> `optional` **additionalAtcContext**: [`AdditionalAtomicTransactionComposerContext`](AdditionalAtomicTransactionComposerContext.md)

Defined in: [src/types/transaction.ts:167](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L167)

Additional `AtomicTransactionComposer` context used when building the transaction group that is sent.
This additional context is used and must be supplied when coverAppCallInnerTransactionFees is set to true.

***

### atc

> **atc**: `AtomicTransactionComposer`

Defined in: [src/types/transaction.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L157)

The `AtomicTransactionComposer` with transactions loaded to send

***

### coverAppCallInnerTransactionFees?

> `optional` **coverAppCallInnerTransactionFees**: `boolean`

Defined in: [src/types/transaction.ts:142](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L142)

Whether to use simulate to automatically calculate required app call inner transaction fees and cover them in the parent app call transaction fee

#### Inherited from

[`SendParams`](SendParams.md).[`coverAppCallInnerTransactionFees`](SendParams.md#coverappcallinnertransactionfees)

***

### maxRoundsToWaitForConfirmation?

> `optional` **maxRoundsToWaitForConfirmation**: `number`

Defined in: [src/types/transaction.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L136)

The number of rounds to wait for confirmation. By default until the latest lastValid has past.

#### Inherited from

[`SendParams`](SendParams.md).[`maxRoundsToWaitForConfirmation`](SendParams.md#maxroundstowaitforconfirmation)

***

### populateAppCallResources?

> `optional` **populateAppCallResources**: `boolean`

Defined in: [src/types/transaction.ts:140](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L140)

Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`.

#### Inherited from

[`SendParams`](SendParams.md).[`populateAppCallResources`](SendParams.md#populateappcallresources)

***

### ~~sendParams?~~

> `optional` **sendParams**: `Omit`\<[`SendTransactionParams`](SendTransactionParams.md), `"fee"` \| `"maxFee"` \| `"skipSending"` \| `"atc"`\>

Defined in: [src/types/transaction.ts:161](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L161)

#### Deprecated

- set the parameters at the top level instead
Any parameters to control the semantics of the send to the network

***

### suppressLog?

> `optional` **suppressLog**: `boolean`

Defined in: [src/types/transaction.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L138)

Whether to suppress log messages from transaction send, default: do not suppress.

#### Inherited from

[`SendParams`](SendParams.md).[`suppressLog`](SendParams.md#suppresslog)
