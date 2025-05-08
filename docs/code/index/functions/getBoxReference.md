[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getBoxReference

# Function: ~~getBoxReference()~~

> **getBoxReference**(`box`): `BoxReference`

Defined in: [src/app.ts:389](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L389)

## Parameters

### box

The box to return a reference for

[`BoxReference`](../../types/app/interfaces/BoxReference.md) | [`BoxIdentifier`](../../types/app/type-aliases/BoxIdentifier.md) | `BoxReference`

## Returns

`BoxReference`

The box reference ready to pass into a `Transaction`

## Deprecated

Use `AppManager.getBoxReference()` instead.

Returns a `algosdk.BoxReference` given a `BoxIdentifier` or `BoxReference`.
