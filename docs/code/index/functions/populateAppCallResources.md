[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / populateAppCallResources

# Function: populateAppCallResources()

> **populateAppCallResources**(`atc`, `algod`): `Promise`\<`AtomicTransactionComposer`\>

Defined in: [src/transaction/transaction.ts:382](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L382)

Take an existing Atomic Transaction Composer and return a new one with the required
app call resources populated into it

## Parameters

### atc

`AtomicTransactionComposer`

The ATC containing the txn group

### algod

`AlgodClient`

The algod client to use for the simulation

## Returns

`Promise`\<`AtomicTransactionComposer`\>

A new ATC with the resources populated into the transactions
