[@algorandfoundation/algokit-utils](../README.md) / types/debugging

# Module: types/debugging

## Table of contents

### Type Aliases

- [AVMTracesEventData](types_debugging.md#avmtraceseventdata)
- [TealSourceDebugEventData](types_debugging.md#tealsourcedebugeventdata)
- [TealSourcesDebugEventData](types_debugging.md#tealsourcesdebugeventdata)

### Variables

- [ALGOKIT\_DIR](types_debugging.md#algokit_dir)
- [DEFAULT\_MAX\_SEARCH\_DEPTH](types_debugging.md#default_max_search_depth)
- [SOURCES\_DIR](types_debugging.md#sources_dir)
- [TEAL\_FILE\_EXT](types_debugging.md#teal_file_ext)
- [TEAL\_SOURCEMAP\_EXT](types_debugging.md#teal_sourcemap_ext)

## Type Aliases

### AVMTracesEventData

Ƭ **AVMTracesEventData**: `Object`

Represents the data for AVM traces debug events emitted whenever a transaction is simulated in debug mode

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `simulateResponse` | `SimulateResponse` | The simulation response from Algod |

#### Defined in

[src/types/debugging.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L47)

___

### TealSourceDebugEventData

Ƭ **TealSourceDebugEventData**: `Object`

Represents the data for a single TEAL source

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `appName` | `string` | The name of the application |
| `compiledTeal` | `Expand`\<`Omit`\<[`CompiledTeal`](../interfaces/types_app.CompiledTeal.md), ``"sourceMap"``\> & \{ `sourceMap`: `SourceMap`  }\> | The compiled TEAL code |
| `fileName` | `string` | The name of the file |

#### Defined in

[src/types/debugging.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L27)

___

### TealSourcesDebugEventData

Ƭ **TealSourcesDebugEventData**: `Object`

Represents the data for multiple TEAL sources debug events emitted whenever an app is compiled as part of a deploy in debug mode

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `sources` | [`TealSourceDebugEventData`](types_debugging.md#tealsourcedebugeventdata)[] | An array of TEAL source debug event data |

#### Defined in

[src/types/debugging.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L39)

## Variables

### ALGOKIT\_DIR

• `Const` **ALGOKIT\_DIR**: ``".algokit"``

The directory name for AlgoKit project related files

#### Defined in

[src/types/debugging.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L10)

___

### DEFAULT\_MAX\_SEARCH\_DEPTH

• `Const` **DEFAULT\_MAX\_SEARCH\_DEPTH**: ``10``

The default maximum search depth for file operations

#### Defined in

[src/types/debugging.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L22)

___

### SOURCES\_DIR

• `Const` **SOURCES\_DIR**: ``"sources"``

The directory name for debug source files

#### Defined in

[src/types/debugging.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L13)

___

### TEAL\_FILE\_EXT

• `Const` **TEAL\_FILE\_EXT**: ``".teal"``

The file extension for TEAL files

#### Defined in

[src/types/debugging.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L16)

___

### TEAL\_SOURCEMAP\_EXT

• `Const` **TEAL\_SOURCEMAP\_EXT**: ``".teal.map"``

The file extension for TEAL source map files

#### Defined in

[src/types/debugging.ts:19](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L19)
