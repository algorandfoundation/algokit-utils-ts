[@algorandfoundation/algokit-utils](../README.md) / types/logging

# Module: types/logging

## Table of contents

### Type Aliases

- [Logger](types_logging.md#logger)

### Variables

- [consoleLogger](types_logging.md#consolelogger)
- [infoConsoleLogger](types_logging.md#infoconsolelogger)
- [nullLogger](types_logging.md#nulllogger)
- [verboseConsoleLogger](types_logging.md#verboseconsolelogger)
- [warningConsoleLogger](types_logging.md#warningconsolelogger)

## Type Aliases

### Logger

Ƭ **Logger**: `Object`

General purpose logger type, compatible with Winston and others.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `debug` | (`message`: `string`, ...`optionalParams`: `unknown`[]) => `void` |
| `error` | (`message`: `string`, ...`optionalParams`: `unknown`[]) => `void` |
| `info` | (`message`: `string`, ...`optionalParams`: `unknown`[]) => `void` |
| `verbose` | (`message`: `string`, ...`optionalParams`: `unknown`[]) => `void` |
| `warn` | (`message`: `string`, ...`optionalParams`: `unknown`[]) => `void` |

#### Defined in

[src/types/logging.ts:4](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logging.ts#L4)

## Variables

### consoleLogger

• `Const` **consoleLogger**: [`Logger`](types_logging.md#logger)

A logger implementation that writes to console

#### Defined in

[src/types/logging.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logging.ts#L13)

___

### infoConsoleLogger

• `Const` **infoConsoleLogger**: [`Logger`](types_logging.md#logger)

#### Defined in

[src/types/logging.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logging.ts#L21)

___

### nullLogger

• `Const` **nullLogger**: [`Logger`](types_logging.md#logger)

A logger implementation that does nothing

#### Defined in

[src/types/logging.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logging.ts#L46)

___

### verboseConsoleLogger

• `Const` **verboseConsoleLogger**: [`Logger`](types_logging.md#logger)

#### Defined in

[src/types/logging.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logging.ts#L29)

___

### warningConsoleLogger

• `Const` **warningConsoleLogger**: [`Logger`](types_logging.md#logger)

#### Defined in

[src/types/logging.ts:37](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logging.ts#L37)
