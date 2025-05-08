[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAppLocalState

# Function: ~~getAppLocalState()~~

> **getAppLocalState**(`appId`, `account`, `algod`): `Promise`\<[`AppState`](../../types/app/interfaces/AppState.md)\>

Defined in: [src/app.ts:265](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L265)

## Parameters

### appId

The ID of the app return global state for

`number` | `bigint`

### account

Either the string address of an account or an account object for the account to get local state for the given app

`string` | [`SendTransactionFrom`](../../types/transaction/type-aliases/SendTransactionFrom.md)

### algod

`AlgodClient`

An algod client instance

## Returns

`Promise`\<[`AppState`](../../types/app/interfaces/AppState.md)\>

The current local state for the given (app, account) combination

## Deprecated

Use `algorand.app.getLocalState` instead.

Returns the current global state values for the given app ID and account
