[@algorandfoundation/algokit-utils](../README.md) / types/logging

# Module: types/logging

## Table of contents

### Type Aliases

- [Logger](types_logging.md#logger)

### Variables

- [consoleLogger](types_logging.md#consolelogger)
- [nullLogger](types_logging.md#nulllogger)

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

types/logging.ts:5

## Variables

### consoleLogger

• `Const` **consoleLogger**: [`Logger`](types_logging.md#logger)

A logger implementation that writes to console

#### Defined in

types/logging.ts:14

___

### nullLogger

• `Const` **nullLogger**: [`Logger`](types_logging.md#logger)

A logger implementation that does nothing

#### Defined in

types/logging.ts:23
