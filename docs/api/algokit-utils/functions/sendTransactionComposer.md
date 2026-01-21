[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / sendTransactionComposer

# ~~Function: sendTransactionComposer()~~

> **sendTransactionComposer**(`atcSend`): `Promise`\<[`SendTransactionComposerResults`](../../types/transaction/interfaces/SendTransactionComposerResults.md)\>

Defined in: [src/transaction/transaction.ts:119](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L119)

## Parameters

### atcSend

[`TransactionComposerToSend`](../../types/transaction/interfaces/TransactionComposerToSend.md)

The parameters controlling the send, including `atc` The `TransactionComposer` and params to control send behaviour

## Returns

`Promise`\<[`SendTransactionComposerResults`](../../types/transaction/interfaces/SendTransactionComposerResults.md)\>

An object with transaction IDs, transactions, group transaction ID (`groupTransactionId`) if more than 1 transaction sent, and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)

## Deprecated

Use `composer.send()` directly
Signs and sends transactions that have been collected by an `TransactionComposer`.
