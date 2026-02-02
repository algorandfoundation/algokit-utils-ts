[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/algod-client](../README.md) / SimulateResponse

# Type Alias: SimulateResponse

> **SimulateResponse** = `object`

Defined in: [packages/algod\_client/src/models/simulate-response.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/simulate-response.ts#L13)

## Properties

### evalOverrides?

> `optional` **evalOverrides**: [`SimulationEvalOverrides`](SimulationEvalOverrides.md)

Defined in: [packages/algod\_client/src/models/simulate-response.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/simulate-response.ts#L28)

***

### execTraceConfig?

> `optional` **execTraceConfig**: [`SimulateTraceConfig`](SimulateTraceConfig.md)

Defined in: [packages/algod\_client/src/models/simulate-response.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/simulate-response.ts#L29)

***

### initialStates?

> `optional` **initialStates**: [`SimulateInitialStates`](SimulateInitialStates.md)

Defined in: [packages/algod\_client/src/models/simulate-response.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/simulate-response.ts#L30)

***

### lastRound

> **lastRound**: `bigint`

Defined in: [packages/algod\_client/src/models/simulate-response.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/simulate-response.ts#L22)

The round immediately preceding this simulation. State changes through this round were used to run this simulation.

***

### txnGroups

> **txnGroups**: [`SimulateTransactionGroupResult`](SimulateTransactionGroupResult.md)[]

Defined in: [packages/algod\_client/src/models/simulate-response.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/simulate-response.ts#L27)

A result object for each transaction group that was simulated.

***

### version

> **version**: `number`

Defined in: [packages/algod\_client/src/models/simulate-response.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/simulate-response.ts#L17)

The version of this response object.
