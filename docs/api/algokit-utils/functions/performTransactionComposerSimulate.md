[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / performTransactionComposerSimulate

# ~~Function: performTransactionComposerSimulate()~~

> **performTransactionComposerSimulate**(`composer`, `options?`): `Promise`\<[`SimulateResponse`](../../Subpaths/algod-client/type-aliases/SimulateResponse.md)\>

Defined in: [src/transaction/perform-transaction-composer-simulate.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/perform-transaction-composer-simulate.ts#L14)

## Parameters

### composer

[`TransactionComposer`](../classes/TransactionComposer.md)

The TransactionComposer with transaction(s) loaded.

### options?

[`RawSimulateOptions`](../type-aliases/RawSimulateOptions.md)

## Returns

`Promise`\<[`SimulateResponse`](../../Subpaths/algod-client/type-aliases/SimulateResponse.md)\>

The simulation result, which includes various details about how the transactions would be processed.

## Deprecated

Use `composer.simulate` with
 - `allowEmptySignatures` flag set to true
 - `resultOnFailure` flag set to true

Performs a simulation of the transactions loaded into the given TransactionComposer.
Uses empty transaction signers for all transactions.
