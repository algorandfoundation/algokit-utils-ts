[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-arc56](../README.md) / Method

# Interface: Method

Defined in: [src/types/app-arc56.ts:341](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L341)

Describes a method in the contract. This interface is an extension of the interface described in ARC-4

## Properties

### actions

> **actions**: `object`

Defined in: [src/types/app-arc56.ts:382](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L382)

an action is a combination of call/create and an OnComplete

#### call

> **call**: (`"NoOp"` \| `"OptIn"` \| `"DeleteApplication"` \| `"CloseOut"` \| `"ClearState"` \| `"UpdateApplication"`)[]

OnCompletes this method allows when appID !== 0

#### create

> **create**: (`"NoOp"` \| `"OptIn"` \| `"DeleteApplication"`)[]

OnCompletes this method allows when appID === 0

***

### args

> **args**: `object`[]

Defined in: [src/types/app-arc56.ts:347](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L347)

The arguments of the method, in order

#### defaultValue?

> `optional` **defaultValue**: `object`

The default value that clients should use.

##### defaultValue.data

> **data**: `string`

Base64 encoded bytes, base64 ARC4 encoded uint64, or UTF-8 method selector

##### defaultValue.source

> **source**: `"method"` \| `"box"` \| `"global"` \| `"local"` \| `"literal"`

Where the default value is coming from
- box: The data key signifies the box key to read the value from
- global: The data key signifies the global state key to read the value from
- local: The data key signifies the local state key to read the value from (for the sender)
- literal: the value is a literal and should be passed directly as the argument
- method: The utf8 signature of the method in this contract to call to get the default value. If the method has arguments, they all must have default values. The method **MUST** be readonly so simulate can be used to get the default value

##### defaultValue.type?

> `optional` **type**: `string`

How the data is encoded. This is the encoding for the data provided here, not the arg type

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

Defined in: [src/types/app-arc56.ts:345](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L345)

Optional, user-friendly description for the method

***

### events?

> `optional` **events**: [`Event`](Event.md)[]

Defined in: [src/types/app-arc56.ts:391](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L391)

ARC-28 events that MAY be emitted by this method

***

### name

> **name**: `string`

Defined in: [src/types/app-arc56.ts:343](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L343)

The name of the method

***

### readonly?

> `optional` **readonly**: `boolean`

Defined in: [src/types/app-arc56.ts:389](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L389)

If this method does not write anything to the ledger (ARC-22)

***

### recommendations?

> `optional` **recommendations**: `object`

Defined in: [src/types/app-arc56.ts:393](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L393)

Information that clients can use when calling the method

#### accounts?

> `optional` **accounts**: `string`[]

Recommended foreign accounts

#### apps?

> `optional` **apps**: `number`[]

Recommended foreign apps

#### assets?

> `optional` **assets**: `number`[]

Recommended foreign assets

#### boxes?

> `optional` **boxes**: `object`

Recommended box references to include

##### boxes.app?

> `optional` **app**: `number`

The app ID for the box

##### boxes.key

> **key**: `string`

The base64 encoded box key

##### boxes.readBytes

> **readBytes**: `number`

The number of bytes being read from the box

##### boxes.writeBytes

> **writeBytes**: `number`

The number of bytes being written to the box

#### innerTransactionCount?

> `optional` **innerTransactionCount**: `number`

The number of inner transactions the caller should cover the fees for

***

### returns

> **returns**: `object`

Defined in: [src/types/app-arc56.ts:373](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L373)

Information about the method's return value

#### desc?

> `optional` **desc**: `string`

Optional, user-friendly description for the return value

#### struct?

> `optional` **struct**: `string`

If the type is a struct, the name of the struct

#### type

> **type**: `string`

The type of the return value, or "void" to indicate no return value. The `struct` field should also be checked to determine if this return value is a struct.
