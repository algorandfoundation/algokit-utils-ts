[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / sendAtomicTransactionComposer

# Function: sendAtomicTransactionComposer()

> **sendAtomicTransactionComposer**(`atcSend`, `algod`): `Promise`\<[`SendAtomicTransactionComposerResults`](../../types/transaction/interfaces/SendAtomicTransactionComposerResults.md)\>

Defined in: [src/transaction/transaction.ts:776](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L776)

Signs and sends transactions that have been collected by an `AtomicTransactionComposer`.

## Parameters

### atcSend

[`AtomicTransactionComposerToSend`](../../types/transaction/interfaces/AtomicTransactionComposerToSend.md)

The parameters controlling the send, including `atc` The `AtomicTransactionComposer` and params to control send behaviour

### algod

`AlgodClient`

An algod client

## Returns

`Promise`\<[`SendAtomicTransactionComposerResults`](../../types/transaction/interfaces/SendAtomicTransactionComposerResults.md)\>

An object with transaction IDs, transactions, group transaction ID (`groupTransactionId`) if more than 1 transaction sent, and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)
