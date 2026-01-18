[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/debugging](../README.md) / TealSourceDebugEventData

# Type Alias: TealSourceDebugEventData

> **TealSourceDebugEventData** = `object`

Defined in: [src/types/debugging.ts:27](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/debugging.ts#L27)

Represents the data for a single TEAL source

## Properties

### appName

> **appName**: `string`

Defined in: [src/types/debugging.ts:29](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/debugging.ts#L29)

The name of the application

***

### compiledTeal

> **compiledTeal**: [`Expand`](../../expand/type-aliases/Expand.md)\<`Omit`\<[`CompiledTeal`](../../app/interfaces/CompiledTeal.md), `"sourceMap"`\> & `object`\>

Defined in: [src/types/debugging.ts:33](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/debugging.ts#L33)

The compiled TEAL code

***

### fileName

> **fileName**: `string`

Defined in: [src/types/debugging.ts:31](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/debugging.ts#L31)

The name of the file
