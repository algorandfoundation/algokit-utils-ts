[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAtomicTransactionComposerTransactions

# Function: ~~getAtomicTransactionComposerTransactions()~~

> **getAtomicTransactionComposerTransactions**(`atc`): `TransactionWithSigner`[]

Defined in: [src/transaction/transaction.ts:1133](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L1133)

## Parameters

### atc

`AtomicTransactionComposer`

The atomic transaction composer

## Returns

`TransactionWithSigner`[]

The array of transactions with signers

## Deprecated

Use `atc.clone().buildGroup()` instead.

Returns the array of transactions currently present in the given `AtomicTransactionComposer`
