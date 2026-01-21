[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / waitForConfirmation

# Function: waitForConfirmation()

> **waitForConfirmation**(`transactionId`, `maxRoundsToWait`, `algod`): `Promise`\<[`PendingTransactionResponse`](../../Subpaths/algod-client/type-aliases/PendingTransactionResponse.md)\>

Defined in: [src/transaction/transaction.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L138)

Wait until the transaction is confirmed or rejected, or until `timeout`
number of rounds have passed.

## Parameters

### transactionId

`string`

The transaction ID to wait for

### maxRoundsToWait

Maximum number of rounds to wait

`number` | `bigint`

### algod

[`AlgodClient`](../../Subpaths/algod-client/classes/AlgodClient.md)

An algod client

## Returns

`Promise`\<[`PendingTransactionResponse`](../../Subpaths/algod-client/type-aliases/PendingTransactionResponse.md)\>

Pending transaction information

## Throws

Throws an error if the transaction is not confirmed or rejected in the next `timeout` rounds
