[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-arc56](../README.md) / Event

# Interface: Event

Defined in: [src/types/app-arc56.ts:428](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L428)

ARC-28 event

## Properties

### args

> **args**: `object`[]

Defined in: [src/types/app-arc56.ts:434](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L434)

The arguments of the event, in order

#### desc?

> `optional` **desc**: `string`

Optional, user-friendly description for the argument

#### name?

> `optional` **name**: `string`

Optional, user-friendly name for the argument

#### struct?

> `optional` **struct**: `string`

If the type is a struct, the name of the struct

#### type

> **type**: `string`

The type of the argument. The `struct` field should also be checked to determine if this arg is a struct.

***

### desc?

> `optional` **desc**: `string`

Defined in: [src/types/app-arc56.ts:432](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L432)

Optional, user-friendly description for the event

***

### name

> **name**: `string`

Defined in: [src/types/app-arc56.ts:430](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L430)

The name of the event
