[@algorandfoundation/algokit-utils](../README.md) / types/debug-utils

# Module: types/debug-utils

## Table of contents

### Classes

- [AVMDebuggerSourceMap](../classes/types_debug_utils.AVMDebuggerSourceMap.md)
- [AVMDebuggerSourceMapEntry](../classes/types_debug_utils.AVMDebuggerSourceMapEntry.md)
- [PersistSourceMapInput](../classes/types_debug_utils.PersistSourceMapInput.md)

### Interfaces

- [AVMDebuggerSourceMapDict](../interfaces/types_debug_utils.AVMDebuggerSourceMapDict.md)
- [ErrnoException](../interfaces/types_debug_utils.ErrnoException.md)

### Variables

- [ALGOKIT\_DIR](types_debug_utils.md#algokit_dir)
- [DEBUG\_TRACES\_DIR](types_debug_utils.md#debug_traces_dir)
- [SOURCES\_DIR](types_debug_utils.md#sources_dir)
- [SOURCES\_FILE](types_debug_utils.md#sources_file)
- [TEAL\_FILE\_EXT](types_debug_utils.md#teal_file_ext)
- [TEAL\_SOURCEMAP\_EXT](types_debug_utils.md#teal_sourcemap_ext)
- [TRACES\_FILE\_EXT](types_debug_utils.md#traces_file_ext)

### Functions

- [buildAVMSourcemap](types_debug_utils.md#buildavmsourcemap)
- [isNode](types_debug_utils.md#isnode)
- [loadOrCreateSources](types_debug_utils.md#loadorcreatesources)
- [upsertDebugSourcemaps](types_debug_utils.md#upsertdebugsourcemaps)
- [writeToFile](types_debug_utils.md#writetofile)

## Variables

### ALGOKIT\_DIR

• `Const` **ALGOKIT\_DIR**: ``".algokit"``

#### Defined in

[src/types/debug-utils.ts:6](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L6)

___

### DEBUG\_TRACES\_DIR

• `Const` **DEBUG\_TRACES\_DIR**: ``"debug_traces"``

#### Defined in

[src/types/debug-utils.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L10)

___

### SOURCES\_DIR

• `Const` **SOURCES\_DIR**: ``"sources"``

#### Defined in

[src/types/debug-utils.ts:7](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L7)

___

### SOURCES\_FILE

• `Const` **SOURCES\_FILE**: ``"sources.avm.json"``

#### Defined in

[src/types/debug-utils.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L8)

___

### TEAL\_FILE\_EXT

• `Const` **TEAL\_FILE\_EXT**: ``".teal"``

#### Defined in

[src/types/debug-utils.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L11)

___

### TEAL\_SOURCEMAP\_EXT

• `Const` **TEAL\_SOURCEMAP\_EXT**: ``".teal.tok.map"``

#### Defined in

[src/types/debug-utils.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L12)

___

### TRACES\_FILE\_EXT

• `Const` **TRACES\_FILE\_EXT**: ``".trace.avm.json"``

#### Defined in

[src/types/debug-utils.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L9)

## Functions

### buildAVMSourcemap

▸ **buildAVMSourcemap**(`«destructured»`): `Promise`<[`AVMDebuggerSourceMapEntry`](../classes/types_debug_utils.AVMDebuggerSourceMapEntry.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `appName` | `string` |
| › `client` | `default` |
| › `fileName` | `string` |
| › `outputPath` | `string` |
| › `tealContent` | `string` |
| › `withSources?` | `boolean` |

#### Returns

`Promise`<[`AVMDebuggerSourceMapEntry`](../classes/types_debug_utils.AVMDebuggerSourceMapEntry.md)\>

#### Defined in

[src/types/debug-utils.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L136)

___

### isNode

▸ **isNode**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/types/debug-utils.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L169)

___

### loadOrCreateSources

▸ **loadOrCreateSources**(`sourcesPath`): `Promise`<[`AVMDebuggerSourceMap`](../classes/types_debug_utils.AVMDebuggerSourceMap.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourcesPath` | `string` |

#### Returns

`Promise`<[`AVMDebuggerSourceMap`](../classes/types_debug_utils.AVMDebuggerSourceMap.md)\>

#### Defined in

[src/types/debug-utils.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L85)

___

### upsertDebugSourcemaps

▸ **upsertDebugSourcemaps**(`sourcemaps`, `projectRoot`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourcemaps` | [`AVMDebuggerSourceMapEntry`](../classes/types_debug_utils.AVMDebuggerSourceMapEntry.md)[] |
| `projectRoot` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/types/debug-utils.ts:100](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L100)

___

### writeToFile

▸ **writeToFile**(`filePath`, `content`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `content` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/types/debug-utils.ts:131](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L131)
