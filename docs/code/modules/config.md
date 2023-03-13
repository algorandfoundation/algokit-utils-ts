[algotstest](../README.md) / config

# Module: config

## Table of contents

### Interfaces

- [Config](../interfaces/config.Config.md)

### Type Aliases

- [Logger](config.md#logger)

### Variables

- [AlgoKitConfig](config.md#algokitconfig)
- [consoleLogger](config.md#consolelogger)

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

[config.ts:3](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/config.ts#L3)

## Variables

### AlgoKitConfig

• `Const` **AlgoKitConfig**: `UpdatableConfig`

The AlgoKit config. To update it use the configure method.

#### Defined in

[config.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/config.ts#L45)

___

### consoleLogger

• `Const` **consoleLogger**: [`Logger`](config.md#logger)

A logger implementation that writes to console

#### Defined in

[config.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/config.ts#L12)
