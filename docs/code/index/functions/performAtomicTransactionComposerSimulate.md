[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / performAtomicTransactionComposerSimulate

# Function: performAtomicTransactionComposerSimulate()

> **performAtomicTransactionComposerSimulate**(`atc`, `algod`, `options?`): `Promise`\<`SimulateResponse`\>

Defined in: [src/transaction/perform-atomic-transaction-composer-simulate.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/perform-atomic-transaction-composer-simulate.ts#L14)

Performs a simulation of the transactions loaded into the given AtomicTransactionComposer.
Uses empty transaction signers for all transactions.

## Parameters

### atc

`AtomicTransactionComposer`

The AtomicTransactionComposer with transaction(s) loaded.

### algod

`AlgodClient`

An Algod client to perform the simulation.

### options?

`Omit`\<\{ `allowEmptySignatures?`: `boolean`; `allowMoreLogging?`: `boolean`; `allowUnnamedResources?`: `boolean`; `execTraceConfig?`: `SimulateTraceConfig`; `extraOpcodeBudget?`: `number` \| `bigint`; `fixSigners?`: `boolean`; `round?`: `number` \| `bigint`; `txnGroups`: `SimulateRequestTransactionGroup`[]; \}, `"txnGroups"`\>

## Returns

`Promise`\<`SimulateResponse`\>

The simulation result, which includes various details about how the transactions would be processed.
