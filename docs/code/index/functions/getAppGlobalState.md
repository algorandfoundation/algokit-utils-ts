[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAppGlobalState

# Function: ~~getAppGlobalState()~~

> **getAppGlobalState**(`appId`, `algod`): `Promise`\<[`AppState`](../../types/app/interfaces/AppState.md)\>

Defined in: [src/app.ts:252](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L252)

## Parameters

### appId

The ID of the app return global state for

`number` | `bigint`

### algod

`AlgodClient`

An algod client instance

## Returns

`Promise`\<[`AppState`](../../types/app/interfaces/AppState.md)\>

The current global state

## Deprecated

Use `algorand.app.getGlobalState` instead.

Returns the current global state values for the given app ID
