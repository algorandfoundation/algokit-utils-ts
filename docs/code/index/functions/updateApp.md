[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / updateApp

# Function: ~~updateApp()~~

> **updateApp**(`update`, `algod`): `Promise`\<`Partial`\<[`AppCompilationResult`](../../types/app/interfaces/AppCompilationResult.md)\> & [`AppCallTransactionResult`](../../types/app/type-aliases/AppCallTransactionResult.md)\>

Defined in: [src/app.ts:104](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L104)

## Parameters

### update

[`UpdateAppParams`](../../types/app/interfaces/UpdateAppParams.md)

The parameters to update the app with

### algod

`AlgodClient`

An algod client

## Returns

`Promise`\<`Partial`\<[`AppCompilationResult`](../../types/app/interfaces/AppCompilationResult.md)\> & [`AppCallTransactionResult`](../../types/app/type-aliases/AppCallTransactionResult.md)\>

The transaction send result and the compilation result

## Deprecated

Use `algorand.send.appUpdate()` / `algorand.createTransaction.appUpdate()` / `algorand.send.appUpdateMethodCall()`
/ `algorand.createTransaction.appUpdateMethodCall()` instead

Updates a smart contract app.
