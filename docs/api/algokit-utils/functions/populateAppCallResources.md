[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / populateAppCallResources

# ~~Function: populateAppCallResources()~~

> **populateAppCallResources**(`composer`): `Promise`\<[`TransactionComposer`](../../types/composer/classes/TransactionComposer.md)\>

Defined in: [src/transaction/transaction.ts:74](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L74)

## Parameters

### composer

[`TransactionComposer`](../../types/composer/classes/TransactionComposer.md)

The composer containing the txn group

## Returns

`Promise`\<[`TransactionComposer`](../../types/composer/classes/TransactionComposer.md)\>

A new composer with the resources populated into the transactions

## Deprecated

Use `composer.build()` directly
Take an existing Transaction Composer and return a new one with the required
app call resources populated into it
