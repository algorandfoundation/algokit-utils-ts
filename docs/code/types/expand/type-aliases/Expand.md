[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/expand](../README.md) / Expand

# Type Alias: Expand\<T\>

> **Expand**\<`T`\> = `T` *extends* (...`args`) => infer R ? (...`args`) => `Expand`\<`R`\> : `T` *extends* infer O ? `{ [K in keyof O]: O[K] }` : `never`

Defined in: [src/types/expand.ts:5](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/expand.ts#L5)

Expands types for IntelliSense so they are more human readable
See https://stackoverflow.com/a/69288824

## Type Parameters

### T

`T`
