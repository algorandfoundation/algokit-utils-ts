[@algorandfoundation/algokit-utils](../README.md) / [types/app-arc56](../modules/types_app_arc56.md) / SourceInfo

# Interface: SourceInfo

[types/app-arc56](../modules/types_app_arc56.md).SourceInfo

## Table of contents

### Properties

- [disassembledTeal](types_app_arc56.SourceInfo.md#disassembledteal)
- [errorMessage](types_app_arc56.SourceInfo.md#errormessage)
- [pc](types_app_arc56.SourceInfo.md#pc)
- [teal](types_app_arc56.SourceInfo.md#teal)

## Properties

### disassembledTeal

• `Optional` **disassembledTeal**: `number`

The line of the dissasembled TEAL this line of pre-compiled TEAL corresponds to

#### Defined in

[src/types/app-arc56.ts:441](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L441)

___

### errorMessage

• `Optional` **errorMessage**: `string`

A human-readable string that describes the error when the program fails at this given line of TEAL

#### Defined in

[src/types/app-arc56.ts:439](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L439)

___

### pc

• `Optional` **pc**: `number`[]

The program counter offset(s) that correspond to this line of TEAL

#### Defined in

[src/types/app-arc56.ts:437](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L437)

___

### teal

• `Optional` **teal**: `number`

The line of pre-compiled TEAL

#### Defined in

[src/types/app-arc56.ts:435](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L435)
