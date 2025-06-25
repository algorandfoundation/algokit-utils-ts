[@algorandfoundation/algokit-utils](../README.md) / [types/app-arc56](../modules/types_app_arc56.md) / ProgramSourceInfo

# Interface: ProgramSourceInfo

[types/app-arc56](../modules/types_app_arc56.md).ProgramSourceInfo

## Table of contents

### Properties

- [pcOffsetMethod](types_app_arc56.ProgramSourceInfo.md#pcoffsetmethod)
- [sourceInfo](types_app_arc56.ProgramSourceInfo.md#sourceinfo)

## Properties

### pcOffsetMethod

• **pcOffsetMethod**: ``"none"`` \| ``"cblocks"``

How the program counter offset is calculated
- none: The pc values in sourceInfo are not offset
- cblocks: The pc values in sourceInfo are offset by the PC of the first op following the last cblock at the top of the program

#### Defined in

[src/types/app-arc56.ts:519](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L519)

___

### sourceInfo

• **sourceInfo**: `SourceInfo`[]

The source information for the program

#### Defined in

[src/types/app-arc56.ts:514](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L514)
