[@algorandfoundation/algokit-utils-debug](../README.md) / [types/debugging](../modules/types_debugging.md) / SimulateAndPersistResponseParams

# Interface: SimulateAndPersistResponseParams

[types/debugging](../modules/types_debugging.md).SimulateAndPersistResponseParams

Parameters to a call that simulates a transaction and persists the response.

## Table of contents

### Properties

- [algod](types_debugging.SimulateAndPersistResponseParams.md#algod)
- [atc](types_debugging.SimulateAndPersistResponseParams.md#atc)
- [bufferSizeMb](types_debugging.SimulateAndPersistResponseParams.md#buffersizemb)
- [projectRoot](types_debugging.SimulateAndPersistResponseParams.md#projectroot)

## Properties

### algod

• **algod**: `default`

algod An Algodv2 client to perform the simulation.

#### Defined in

[types/debugging.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L171)

---

### atc

• **atc**: `AtomicTransactionComposer`

The AtomicTransactionComposer with transaction(s) loaded.

#### Defined in

[types/debugging.ts:173](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L173)

---

### bufferSizeMb

• **bufferSizeMb**: `number`

bufferSizeMb The buffer size in megabytes.

#### Defined in

[types/debugging.ts:177](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L177)

---

### projectRoot

• **projectRoot**: `string`

projectRoot The root directory of the project.

#### Defined in

[types/debugging.ts:175](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L175)
