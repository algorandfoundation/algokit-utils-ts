[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / decodeAppState

# Function: ~~decodeAppState()~~

> **decodeAppState**(`state`): [`AppState`](../../types/app/interfaces/AppState.md)

Defined in: [src/app.ts:345](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L345)

## Parameters

### state

`object`[]

A `global-state`, `local-state`, `global-state-deltas` or `local-state-deltas`

## Returns

[`AppState`](../../types/app/interfaces/AppState.md)

An object keyeed by the UTF-8 representation of the key with various parsings of the values

## Deprecated

Use `AppManager.decodeAppState` instead.

Converts an array of global/local state values from the algod api to a more friendly
generic object keyed by the UTF-8 value of the key.
