[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [Algokit Utils API](../README.md) / waitForConfirmation

# Function: waitForConfirmation()

> **waitForConfirmation**(`transactionId`, `maxRoundsToWait`, `algod`): `Promise`\<[`PendingTransactionResponse`](../../Packages/Algod-Client/type-aliases/PendingTransactionResponse.md)\>

Defined in: [src/transaction/transaction.ts:140](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L140)

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

[`AlgodClient`](../../Packages/Algod-Client/classes/AlgodClient.md)

An algod client

## Returns

`Promise`\<[`PendingTransactionResponse`](../../Packages/Algod-Client/type-aliases/PendingTransactionResponse.md)\>

Pending transaction information

## Throws

Throws an error if the transaction is not confirmed or rejected in the next `timeout` rounds
