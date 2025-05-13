[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-arc56](../README.md) / ProgramSourceInfo

# Interface: ProgramSourceInfo

Defined in: [src/types/app-arc56.ts:497](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L497)

## Properties

### pcOffsetMethod

> **pcOffsetMethod**: `"none"` \| `"cblocks"`

Defined in: [src/types/app-arc56.ts:504](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L504)

How the program counter offset is calculated
- none: The pc values in sourceInfo are not offset
- cblocks: The pc values in sourceInfo are offset by the PC of the first op following the last cblock at the top of the program

***

### sourceInfo

> **sourceInfo**: `SourceInfo`[]

Defined in: [src/types/app-arc56.ts:499](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L499)

The source information for the program
