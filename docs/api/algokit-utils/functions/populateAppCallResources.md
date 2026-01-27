[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / populateAppCallResources

# ~~Function: populateAppCallResources()~~

> **populateAppCallResources**(`composer`): `Promise`\<`TransactionComposer`\>

Defined in: [src/transaction/transaction.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L69)

## Parameters

### composer

`TransactionComposer`

The composer containing the txn group

## Returns

`Promise`\<`TransactionComposer`\>

A new composer with the resources populated into the transactions

## Deprecated

Use `composer.build()` directly
Take an existing Transaction Composer and return a new one with the required
app call resources populated into it
