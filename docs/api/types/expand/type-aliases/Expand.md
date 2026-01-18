[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/expand](../README.md) / Expand

# Type Alias: Expand\<T\>

> **Expand**\<`T`\> = `T` *extends* (...`args`) => infer R ? (...`args`) => `Expand`\<`R`\> : `T` *extends* infer O ? `{ [K in keyof O]: O[K] }` : `never`

Defined in: [packages/common/src/expand.ts:5](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/common/src/expand.ts#L5)

Expands types for IntelliSense so they are more human readable
See https://stackoverflow.com/a/69288824

## Type Parameters

### T

`T`
