[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAppArgsForTransaction

# Function: ~~getAppArgsForTransaction()~~

> **getAppArgsForTransaction**(`args?`): `undefined` \| \{ `accounts`: `undefined` \| `string`[]; `appArgs`: `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>[]; `boxes`: `undefined` \| `BoxReference`[]; `foreignApps`: `undefined` \| `number`[]; `foreignAssets`: `undefined` \| `number`[]; `lease`: `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>; \}

Defined in: [src/app.ts:356](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L356)

## Parameters

### args?

[`RawAppCallArgs`](../../types/app/interfaces/RawAppCallArgs.md)

The app call args

## Returns

`undefined` \| \{ `accounts`: `undefined` \| `string`[]; `appArgs`: `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>[]; `boxes`: `undefined` \| `BoxReference`[]; `foreignApps`: `undefined` \| `number`[]; `foreignAssets`: `undefined` \| `number`[]; `lease`: `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>; \}

The args ready to load into a `Transaction`

## Deprecated

Use `TransactionComposer` methods to construct transactions instead.

Returns the app args ready to load onto an app `Transaction` object
