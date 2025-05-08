[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / compileTeal

# Function: ~~compileTeal()~~

> **compileTeal**(`tealCode`, `algod`): `Promise`\<[`CompiledTeal`](../../types/app/interfaces/CompiledTeal.md)\>

Defined in: [src/app.ts:419](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L419)

## Parameters

### tealCode

`string`

The TEAL code

### algod

`AlgodClient`

An algod client

## Returns

`Promise`\<[`CompiledTeal`](../../types/app/interfaces/CompiledTeal.md)\>

The information about the compiled file

## Deprecated

Use `algorand.app.compileTeal` instead.

Compiles the given TEAL using algod and returns the result, including source map.
