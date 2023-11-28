[@algorandfoundation/algokit-utils](../README.md) / [types/debug-utils](../modules/types_debug_utils.md) / AVMDebuggerSourceMap

# Class: AVMDebuggerSourceMap

[types/debug-utils](../modules/types_debug_utils.md).AVMDebuggerSourceMap

## Table of contents

### Constructors

- [constructor](types_debug_utils.AVMDebuggerSourceMap.md#constructor)

### Properties

- [txnGroupSources](types_debug_utils.AVMDebuggerSourceMap.md#txngroupsources)

### Methods

- [toDict](types_debug_utils.AVMDebuggerSourceMap.md#todict)
- [fromDict](types_debug_utils.AVMDebuggerSourceMap.md#fromdict)

## Constructors

### constructor

• **new AVMDebuggerSourceMap**(`txnGroupSources`): [`AVMDebuggerSourceMap`](types_debug_utils.AVMDebuggerSourceMap.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `txnGroupSources` | [`AVMDebuggerSourceMapEntry`](types_debug_utils.AVMDebuggerSourceMapEntry.md)[] |

#### Returns

[`AVMDebuggerSourceMap`](types_debug_utils.AVMDebuggerSourceMap.md)

#### Defined in

[src/types/debug-utils.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L46)

## Properties

### txnGroupSources

• **txnGroupSources**: [`AVMDebuggerSourceMapEntry`](types_debug_utils.AVMDebuggerSourceMapEntry.md)[]

#### Defined in

[src/types/debug-utils.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L44)

## Methods

### toDict

▸ **toDict**(): [`AVMDebuggerSourceMapDict`](../interfaces/types_debug_utils.AVMDebuggerSourceMapDict.md)

#### Returns

[`AVMDebuggerSourceMapDict`](../interfaces/types_debug_utils.AVMDebuggerSourceMapDict.md)

#### Defined in

[src/types/debug-utils.ts:56](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L56)

___

### fromDict

▸ **fromDict**(`data`): [`AVMDebuggerSourceMap`](types_debug_utils.AVMDebuggerSourceMap.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`AVMDebuggerSourceMapDict`](../interfaces/types_debug_utils.AVMDebuggerSourceMapDict.md) |

#### Returns

[`AVMDebuggerSourceMap`](types_debug_utils.AVMDebuggerSourceMap.md)

#### Defined in

[src/types/debug-utils.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L50)
