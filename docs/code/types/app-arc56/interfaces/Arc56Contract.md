[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-arc56](../README.md) / Arc56Contract

# Interface: Arc56Contract

Defined in: [src/types/app-arc56.ts:231](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L231)

Describes the entire contract. This interface is an extension of the interface described in ARC-4

## Properties

### arcs

> **arcs**: `number`[]

Defined in: [src/types/app-arc56.ts:233](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L233)

The ARCs used and/or supported by this contract. All contracts implicitly support ARC4 and ARC56

***

### bareActions

> **bareActions**: `object`

Defined in: [src/types/app-arc56.ts:281](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L281)

Supported bare actions for the contract. An action is a combination of call/create and an OnComplete

#### call

> **call**: (`"NoOp"` \| `"OptIn"` \| `"DeleteApplication"` \| `"CloseOut"` \| `"ClearState"` \| `"UpdateApplication"`)[]

OnCompletes this method allows when appID !== 0

#### create

> **create**: (`"NoOp"` \| `"OptIn"` \| `"DeleteApplication"`)[]

OnCompletes this method allows when appID === 0

***

### byteCode?

> `optional` **byteCode**: `object`

Defined in: [src/types/app-arc56.ts:302](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L302)

The compiled bytecode for the application. MUST be omitted if included as part of ARC23

#### approval

> **approval**: `string`

The approval program

#### clear

> **clear**: `string`

The clear program

***

### compilerInfo?

> `optional` **compilerInfo**: `object`

Defined in: [src/types/app-arc56.ts:309](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L309)

Information used to get the given byteCode and/or PC values in sourceInfo. MUST be given if byteCode or PC values are present

#### compiler

> **compiler**: `"algod"` \| `"puya"`

The name of the compiler

#### compilerVersion

> **compilerVersion**: `object`

Compiler version information

##### compilerVersion.commitHash?

> `optional` **commitHash**: `string`

##### compilerVersion.major

> **major**: `number`

##### compilerVersion.minor

> **minor**: `number`

##### compilerVersion.patch

> **patch**: `number`

***

### desc?

> `optional` **desc**: `string`

Defined in: [src/types/app-arc56.ts:237](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L237)

Optional, user-friendly description for the interface

***

### events?

> `optional` **events**: [`Event`](Event.md)[]

Defined in: [src/types/app-arc56.ts:321](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L321)

ARC-28 events that MAY be emitted by this contract

***

### methods

> **methods**: [`Method`](Method.md)[]

Defined in: [src/types/app-arc56.ts:254](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L254)

All of the methods that the contract implements

***

### name

> **name**: `string`

Defined in: [src/types/app-arc56.ts:235](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L235)

A user-friendly name for the contract

***

### networks?

> `optional` **networks**: `object`

Defined in: [src/types/app-arc56.ts:245](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L245)

Optional object listing the contract instances across different networks.
The key is the base64 genesis hash of the network, and the value contains
information about the deployed contract in the network indicated by the
key. A key containing the human-readable name of the network MAY be
included, but the corresponding genesis hash key MUST also be defined

#### Index Signature

\[`network`: `string`\]: `object`

***

### scratchVariables?

> `optional` **scratchVariables**: `object`

Defined in: [src/types/app-arc56.ts:332](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L332)

The scratch variables used during runtime

#### Index Signature

\[`name`: `string`\]: `object`

***

### source?

> `optional` **source**: `object`

Defined in: [src/types/app-arc56.ts:295](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L295)

The pre-compiled TEAL that may contain template variables. MUST be omitted if included as part of ARC23

#### approval

> **approval**: `string`

The approval program

#### clear

> **clear**: `string`

The clear program

***

### sourceInfo?

> `optional` **sourceInfo**: `object`

Defined in: [src/types/app-arc56.ts:288](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L288)

Information about the TEAL programs

#### approval

> **approval**: [`ProgramSourceInfo`](ProgramSourceInfo.md)

Approval program information

#### clear

> **clear**: [`ProgramSourceInfo`](ProgramSourceInfo.md)

Clear program information

***

### state

> **state**: `object`

Defined in: [src/types/app-arc56.ts:255](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L255)

#### keys

> **keys**: `object`

Mapping of human-readable names to StorageKey objects

##### keys.box

> **box**: `object`

###### Index Signature

\[`name`: `string`\]: [`StorageKey`](StorageKey.md)

##### keys.global

> **global**: `object`

###### Index Signature

\[`name`: `string`\]: [`StorageKey`](StorageKey.md)

##### keys.local

> **local**: `object`

###### Index Signature

\[`name`: `string`\]: [`StorageKey`](StorageKey.md)

#### maps

> **maps**: `object`

Mapping of human-readable names to StorageMap objects

##### maps.box

> **box**: `object`

###### Index Signature

\[`name`: `string`\]: [`StorageMap`](StorageMap.md)

##### maps.global

> **global**: `object`

###### Index Signature

\[`name`: `string`\]: [`StorageMap`](StorageMap.md)

##### maps.local

> **local**: `object`

###### Index Signature

\[`name`: `string`\]: [`StorageMap`](StorageMap.md)

#### schema

> **schema**: `object`

Defines the values that should be used for GlobalNumUint, GlobalNumByteSlice, LocalNumUint, and LocalNumByteSlice when creating the application

##### schema.global

> **global**: `object`

##### schema.global.bytes

> **bytes**: `number`

##### schema.global.ints

> **ints**: `number`

##### schema.local

> **local**: `object`

##### schema.local.bytes

> **bytes**: `number`

##### schema.local.ints

> **ints**: `number`

***

### structs

> **structs**: `object`

Defined in: [src/types/app-arc56.ts:252](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L252)

Named structs used by the application. Each struct field appears in the same order as ABI encoding.

#### Index Signature

\[`structName`: `string`\]: [`StructField`](StructField.md)[]

***

### templateVariables?

> `optional` **templateVariables**: `object`

Defined in: [src/types/app-arc56.ts:323](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L323)

A mapping of template variable names as they appear in the TEAL (not including TMPL_ prefix) to their respective types and values (if applicable)

#### Index Signature

\[`name`: `string`\]: `object`
