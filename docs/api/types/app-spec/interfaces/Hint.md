[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-spec](../README.md) / Hint

# Interface: Hint

Defined in: [src/types/app-spec.ts:267](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L267)

Hint information for a given method call to allow client generation

## Properties

### call\_config

> **call\_config**: [`CallConfig`](CallConfig.md)

Defined in: [src/types/app-spec.ts:272](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L272)

***

### default\_arguments?

> `optional` **default\_arguments**: `Record`\<`string`, [`DefaultArgument`](../type-aliases/DefaultArgument.md)\>

Defined in: [src/types/app-spec.ts:271](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L271)

***

### read\_only?

> `optional` **read\_only**: `boolean`

Defined in: [src/types/app-spec.ts:270](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L270)

***

### structs?

> `optional` **structs**: `Record`\<`string`, [`Struct`](Struct.md)\>

Defined in: [src/types/app-spec.ts:269](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L269)

Any user-defined struct/tuple types used in the method call, keyed by parameter name or `output` for return type
