[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/algod-client](../README.md) / SimulateTraceConfig

# Type Alias: SimulateTraceConfig

> **SimulateTraceConfig** = `object`

Defined in: [packages/algod\_client/src/models/simulate-trace-config.ts:7](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/models/simulate-trace-config.ts#L7)

An object that configures simulation execution trace.

## Properties

### enable?

> `optional` **enable**: `boolean`

Defined in: [packages/algod\_client/src/models/simulate-trace-config.ts:11](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/models/simulate-trace-config.ts#L11)

A boolean option for opting in execution trace features simulation endpoint.

***

### scratchChange?

> `optional` **scratchChange**: `boolean`

Defined in: [packages/algod\_client/src/models/simulate-trace-config.ts:21](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/models/simulate-trace-config.ts#L21)

A boolean option enabling returning scratch slot changes together with execution trace during simulation.

***

### stackChange?

> `optional` **stackChange**: `boolean`

Defined in: [packages/algod\_client/src/models/simulate-trace-config.ts:16](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/models/simulate-trace-config.ts#L16)

A boolean option enabling returning stack changes together with execution trace during simulation.

***

### stateChange?

> `optional` **stateChange**: `boolean`

Defined in: [packages/algod\_client/src/models/simulate-trace-config.ts:26](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/models/simulate-trace-config.ts#L26)

A boolean option enabling returning application state changes (global, local, and box changes) with the execution trace during simulation.
