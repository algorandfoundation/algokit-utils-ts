[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAppOnCompleteAction

# Function: ~~getAppOnCompleteAction()~~

> **getAppOnCompleteAction**(`onCompletionAction?`): `OnApplicationComplete`

Defined in: [src/app.ts:154](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L154)

## Parameters

### onCompletionAction?

The on completion action

[`AppCallType`](../../types/app/type-aliases/AppCallType.md) | `OnApplicationComplete`

## Returns

`OnApplicationComplete`

The `algosdk.OnApplicationComplete`

## Deprecated

Use `algosdk.OnApplicationComplete` directly instead.

Returns a `algosdk.OnApplicationComplete` for the given onCompleteAction.

If given `undefined` will return `OnApplicationComplete.NoOpOC`.

If given an `AppCallType` will convert the string enum to the correct underlying `algosdk.OnApplicationComplete`.
