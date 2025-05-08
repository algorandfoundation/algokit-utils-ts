[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / createApp

# Function: ~~createApp()~~

> **createApp**(`create`, `algod`): `Promise`\<`Partial`\<[`AppCompilationResult`](../../types/app/interfaces/AppCompilationResult.md)\> & [`AppCallTransactionResult`](../../types/app/type-aliases/AppCallTransactionResult.md) & [`AppReference`](../../types/app/interfaces/AppReference.md)\>

Defined in: [src/app.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L44)

## Parameters

### create

[`CreateAppParams`](../../types/app/interfaces/CreateAppParams.md)

The parameters to create the app with

### algod

`AlgodClient`

An algod client

## Returns

`Promise`\<`Partial`\<[`AppCompilationResult`](../../types/app/interfaces/AppCompilationResult.md)\> & [`AppCallTransactionResult`](../../types/app/type-aliases/AppCallTransactionResult.md) & [`AppReference`](../../types/app/interfaces/AppReference.md)\>

The details of the created app, or the transaction to create it if `skipSending` and the compilation result

## Deprecated

Use `algorand.send.appCreate()` / `algorand.createTransaction.appCreate()` / `algorand.send.appCreateMethodCall()`
/ `algorand.createTransaction.appCreateMethodCall()` instead

Creates a smart contract app, returns the details of the created app.
