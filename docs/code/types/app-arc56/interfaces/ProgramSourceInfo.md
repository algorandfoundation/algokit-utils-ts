[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-arc56](../README.md) / ProgramSourceInfo

# Interface: ProgramSourceInfo

Defined in: [src/types/app-arc56.ts:508](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L508)

## Properties

### pcOffsetMethod

> **pcOffsetMethod**: `"none"` \| `"cblocks"`

Defined in: [src/types/app-arc56.ts:515](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L515)

How the program counter offset is calculated
- none: The pc values in sourceInfo are not offset
- cblocks: The pc values in sourceInfo are offset by the PC of the first op following the last cblock at the top of the program

***

### sourceInfo

> **sourceInfo**: `SourceInfo`[]

Defined in: [src/types/app-arc56.ts:510](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L510)

The source information for the program
