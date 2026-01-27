[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-spec](../README.md) / ABIMethodParams

# Interface: ABIMethodParams

Defined in: [src/types/app-spec.ts:209](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L209)

ABI method parameters

## Properties

### args

> **args**: [`ABIMethodArgParams`](ABIMethodArgParams.md)[]

Defined in: [src/types/app-spec.ts:212](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L212)

***

### desc?

> `optional` **desc**: `string`

Defined in: [src/types/app-spec.ts:211](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L211)

***

### events?

> `optional` **events**: [`ARC28Event`](../../../Subpaths/abi/type-aliases/ARC28Event.md)[]

Defined in: [src/types/app-spec.ts:217](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L217)

[ARC-28](https://arc.algorand.foundation/ARCs/arc-0028) events that MAY be emitted by this method

***

### name

> **name**: `string`

Defined in: [src/types/app-spec.ts:210](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L210)

***

### readonly?

> `optional` **readonly**: `boolean`

Defined in: [src/types/app-spec.ts:215](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L215)

Optional, is it a read-only method (according to [ARC-22](https://arc.algorand.foundation/ARCs/arc-0022))

***

### returns

> **returns**: [`ABIMethodReturnParams`](ABIMethodReturnParams.md)

Defined in: [src/types/app-spec.ts:213](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L213)
