[@algorandfoundation/algokit-utils-debug](../README.md) / [types/debugging](../modules/types_debugging.md) / AVMDebuggerSourceMapEntry

# Class: AVMDebuggerSourceMapEntry

[types/debugging](../modules/types_debugging.md).AVMDebuggerSourceMapEntry

AVM debugger source map entry class.

## Table of contents

### Constructors

- [constructor](types_debugging.AVMDebuggerSourceMapEntry.md#constructor)

### Properties

- [location](types_debugging.AVMDebuggerSourceMapEntry.md#location)
- [programHash](types_debugging.AVMDebuggerSourceMapEntry.md#programhash)

### Methods

- [equals](types_debugging.AVMDebuggerSourceMapEntry.md#equals)
- [toString](types_debugging.AVMDebuggerSourceMapEntry.md#tostring)

## Constructors

### constructor

• **new AVMDebuggerSourceMapEntry**(`location`, `programHash`): [`AVMDebuggerSourceMapEntry`](types_debugging.AVMDebuggerSourceMapEntry.md)

Create an AVM debugger source map entry.

#### Parameters

| Name          | Type     | Description                                     |
| :------------ | :------- | :---------------------------------------------- |
| `location`    | `string` | The location of the file the source map is for. |
| `programHash` | `string` | The hash of the TEAL binary.                    |

#### Returns

[`AVMDebuggerSourceMapEntry`](types_debugging.AVMDebuggerSourceMapEntry.md)

#### Defined in

[types/debugging.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L36)

## Properties

### location

• **location**: `string`

The location of the file the source map is for.

#### Defined in

[types/debugging.ts:37](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L37)

---

### programHash

• **programHash**: `string`

The hash of the TEAL binary.

#### Defined in

[types/debugging.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L38)

## Methods

### equals

▸ **equals**(`other`): `boolean`

#### Parameters

| Name    | Type                                                                        |
| :------ | :-------------------------------------------------------------------------- |
| `other` | [`AVMDebuggerSourceMapEntry`](types_debugging.AVMDebuggerSourceMapEntry.md) |

#### Returns

`boolean`

#### Defined in

[types/debugging.ts:41](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L41)

---

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[types/debugging.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L45)
