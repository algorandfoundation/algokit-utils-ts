[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [Algokit Utils API](../README.md) / performTransactionComposerSimulate

# ~~Function: performTransactionComposerSimulate()~~

> **performTransactionComposerSimulate**(`composer`, `options?`): `Promise`\<[`SimulateResponse`](../../Packages/Algod-Client/type-aliases/SimulateResponse.md)\>

Defined in: [src/transaction/perform-transaction-composer-simulate.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/perform-transaction-composer-simulate.ts#L14)

## Parameters

### composer

[`TransactionComposer`](../../types/composer/classes/TransactionComposer.md)

The TransactionComposer with transaction(s) loaded.

### options?

[`RawSimulateOptions`](../../types/composer/type-aliases/RawSimulateOptions.md)

## Returns

`Promise`\<[`SimulateResponse`](../../Packages/Algod-Client/type-aliases/SimulateResponse.md)\>

The simulation result, which includes various details about how the transactions would be processed.

## Deprecated

Use `composer.simulate` with
 - `allowEmptySignatures` flag set to true
 - `resultOnFailure` flag set to true

Performs a simulation of the transactions loaded into the given TransactionComposer.
Uses empty transaction signers for all transactions.
