[@algorandfoundation/algokit-utils](../README.md) / [types/debugging](../modules/types_debugging.md) / AVMDebuggerSourceMap

# Class: AVMDebuggerSourceMap

[types/debugging](../modules/types_debugging.md).AVMDebuggerSourceMap

AVM debugger source map class.

## Table of contents

### Constructors

- [constructor](types_debugging.AVMDebuggerSourceMap.md#constructor)

### Properties

- [txnGroupSources](types_debugging.AVMDebuggerSourceMap.md#txngroupsources)

### Methods

- [toDict](types_debugging.AVMDebuggerSourceMap.md#todict)
- [fromDict](types_debugging.AVMDebuggerSourceMap.md#fromdict)

## Constructors

### constructor

• **new AVMDebuggerSourceMap**(`txnGroupSources`): [`AVMDebuggerSourceMap`](types_debugging.AVMDebuggerSourceMap.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `txnGroupSources` | [`AVMDebuggerSourceMapEntry`](types_debugging.AVMDebuggerSourceMapEntry.md)[] |

#### Returns

[`AVMDebuggerSourceMap`](types_debugging.AVMDebuggerSourceMap.md)

#### Defined in

[src/types/debugging.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L48)

## Properties

### txnGroupSources

• **txnGroupSources**: [`AVMDebuggerSourceMapEntry`](types_debugging.AVMDebuggerSourceMapEntry.md)[]

#### Defined in

[src/types/debugging.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L42)

## Methods

### toDict

▸ **toDict**(): [`AVMDebuggerSourceMapDict`](../interfaces/types_debugging.AVMDebuggerSourceMapDict.md)

Converts the source map to a dictionary that can be passed around and then parsed back using `AVMDebuggerSourceMap.fromDict`.

#### Returns

[`AVMDebuggerSourceMapDict`](../interfaces/types_debugging.AVMDebuggerSourceMapDict.md)

The dictionary

#### Defined in

[src/types/debugging.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L67)

___

### fromDict

▸ **fromDict**(`data`): [`AVMDebuggerSourceMap`](types_debugging.AVMDebuggerSourceMap.md)

Creates a source map from a dictionary of source map data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`AVMDebuggerSourceMapDict`](../interfaces/types_debugging.AVMDebuggerSourceMapDict.md) | The data |

#### Returns

[`AVMDebuggerSourceMap`](types_debugging.AVMDebuggerSourceMap.md)

The source map

#### Defined in

[src/types/debugging.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L57)
