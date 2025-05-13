[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / callApp

# Function: ~~callApp()~~

> **callApp**(`call`, `algod`): `Promise`\<[`AppCallTransactionResult`](../../types/app/type-aliases/AppCallTransactionResult.md)\>

Defined in: [src/app.ts:187](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L187)

## Parameters

### call

[`AppCallParams`](../../types/app/interfaces/AppCallParams.md)

The call details.

### algod

`AlgodClient`

An algod client

## Returns

`Promise`\<[`AppCallTransactionResult`](../../types/app/type-aliases/AppCallTransactionResult.md)\>

The result of the call

## Deprecated

Use `algorand.send.appUpdate()` / `algorand.createTransaction.appUpdate()` / `algorand.send.appUpdateMethodCall()`
/ `algorand.createTransaction.appUpdateMethodCall()` instead

Issues a call to a given app.
