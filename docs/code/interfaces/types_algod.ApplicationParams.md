[@algorandfoundation/algokit-utils](../README.md) / [types/algod](../modules/types_algod.md) / ApplicationParams

# Interface: ApplicationParams

[types/algod](../modules/types_algod.md).ApplicationParams

Stores the global information associated with an application

**`See`**

https://developer.algorand.org/docs/rest-apis/algod/v2/#applicationparams

## Table of contents

### Properties

- [approval-program](types_algod.ApplicationParams.md#approval-program)
- [clear-state-program](types_algod.ApplicationParams.md#clear-state-program)
- [creator](types_algod.ApplicationParams.md#creator)
- [extra-program-pages](types_algod.ApplicationParams.md#extra-program-pages)
- [global-state](types_algod.ApplicationParams.md#global-state)
- [global-state-schema](types_algod.ApplicationParams.md#global-state-schema)
- [local-state-schema](types_algod.ApplicationParams.md#local-state-schema)

## Properties

### approval-program

• **approval-program**: `string`

Base64 encoded TEAL approval program

#### Defined in

[src/types/algod.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L83)

___

### clear-state-program

• **clear-state-program**: `string`

Base64 encoded TEAL clear state program

#### Defined in

[src/types/algod.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L85)

___

### creator

• **creator**: `string`

Address of the account that created the app

#### Defined in

[src/types/algod.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L81)

___

### extra-program-pages

• `Optional` **extra-program-pages**: `number`

The amount of extra program pages available to this app.

#### Defined in

[src/types/algod.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L87)

___

### global-state

• `Optional` **global-state**: { `key`: `string` ; `value`: [`TealValue`](../modules/types_algod.md#tealvalue)  }[]

Current global state values

#### Defined in

[src/types/algod.ts:89](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L89)

___

### global-state-schema

• `Optional` **global-state-schema**: [`ApplicationStateSchema`](types_algod.ApplicationStateSchema.md)

Global state schema

#### Defined in

[src/types/algod.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L91)

___

### local-state-schema

• `Optional` **local-state-schema**: [`ApplicationStateSchema`](types_algod.ApplicationStateSchema.md)

Local state schema

#### Defined in

[src/types/algod.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/algod.ts#L93)
