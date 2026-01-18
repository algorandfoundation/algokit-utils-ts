[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-spec](../README.md) / ABIMethodParams

# Interface: ABIMethodParams

Defined in: [src/types/app-spec.ts:205](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-spec.ts#L205)

## Properties

### args

> **args**: [`ABIMethodArgParams`](ABIMethodArgParams.md)[]

Defined in: [src/types/app-spec.ts:208](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-spec.ts#L208)

***

### desc?

> `optional` **desc**: `string`

Defined in: [src/types/app-spec.ts:207](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-spec.ts#L207)

***

### events?

> `optional` **events**: [`ARC28Event`](../../../Subpaths/abi/type-aliases/ARC28Event.md)[]

Defined in: [src/types/app-spec.ts:213](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-spec.ts#L213)

[ARC-28](https://arc.algorand.foundation/ARCs/arc-0028) events that MAY be emitted by this method

***

### name

> **name**: `string`

Defined in: [src/types/app-spec.ts:206](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-spec.ts#L206)

***

### readonly?

> `optional` **readonly**: `boolean`

Defined in: [src/types/app-spec.ts:211](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-spec.ts#L211)

Optional, is it a read-only method (according to [ARC-22](https://arc.algorand.foundation/ARCs/arc-0022))

***

### returns

> **returns**: [`ABIMethodReturnParams`](ABIMethodReturnParams.md)

Defined in: [src/types/app-spec.ts:209](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-spec.ts#L209)
