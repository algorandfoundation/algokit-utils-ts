[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / sendGroupOfTransactions

# Function: ~~sendGroupOfTransactions()~~

> **sendGroupOfTransactions**(`groupSend`, `algod`): `Promise`\<`Omit`\<[`SendAtomicTransactionComposerResults`](../../types/transaction/interfaces/SendAtomicTransactionComposerResults.md), `"returns"`\>\>

Defined in: [src/transaction/transaction.ts:959](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L959)

## Parameters

### groupSend

[`TransactionGroupToSend`](../../types/transaction/interfaces/TransactionGroupToSend.md)

The group details to send, with:
  * `transactions`: The array of transactions to send along with their signing account
  * `sendParams`: The parameters to dictate how the group is sent

### algod

`AlgodClient`

An algod client

## Returns

`Promise`\<`Omit`\<[`SendAtomicTransactionComposerResults`](../../types/transaction/interfaces/SendAtomicTransactionComposerResults.md), `"returns"`\>\>

An object with transaction IDs, transactions, group transaction ID (`groupTransactionId`) if more than 1 transaction sent, and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)

## Deprecated

Use `TransactionComposer` (`algorand.newGroup()`) or `AtomicTransactionComposer` to construct and send group transactions instead.

Signs and sends a group of [up to 16](https://dev.algorand.co/concepts/transactions/atomic-txn-groups/#create-transactions) transactions to the chain
