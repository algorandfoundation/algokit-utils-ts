[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / prepareGroupForSending

# ~~Function: prepareGroupForSending()~~

> **prepareGroupForSending**(`composer`, `sendParams`, `additionalContext?`): `Promise`\<[`TransactionComposer`](../../types/composer/classes/TransactionComposer.md)\>

Defined in: [src/transaction/transaction.ts:94](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/transaction/transaction.ts#L94)

## Parameters

### composer

[`TransactionComposer`](../../types/composer/classes/TransactionComposer.md)

The Transaction Composer containing the txn group

### sendParams

[`SendParams`](../../types/transaction/interfaces/SendParams.md)

The send params for the transaction group

### additionalContext?

[`AdditionalTransactionComposerContext`](../../types/transaction/interfaces/AdditionalTransactionComposerContext.md)

Additional context used to determine how best to change the transactions in the group

## Returns

`Promise`\<[`TransactionComposer`](../../types/composer/classes/TransactionComposer.md)\>

A new Transaction Composer with the changes applied

## Deprecated

Use `composer.setMaxFees()` instead if you need to set max fees for transactions.
Use `composer.build()` instead if you need to build transactions with resource population.

Take an existing Transaction Composer and return a new one with changes applied to the transactions
based on the supplied sendParams to prepare it for sending.
