[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / sendTransaction

# Function: ~~sendTransaction()~~

> **sendTransaction**(`send`, `algod`): `Promise`\<[`SendTransactionResult`](../../types/transaction/interfaces/SendTransactionResult.md)\>

Defined in: [src/transaction/transaction.ts:217](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L217)

## Parameters

### send

The details for the transaction to prepare/send, including:
  * `transaction`: The unsigned transaction
  * `from`: The account to sign the transaction with: either an account with private key loaded or a logic signature account
  * `config`: The sending configuration for this transaction

#### from

[`SendTransactionFrom`](../../types/transaction/type-aliases/SendTransactionFrom.md)

#### sendParams?

[`SendTransactionParams`](../../types/transaction/interfaces/SendTransactionParams.md)

#### transaction

`Transaction`

### algod

`AlgodClient`

An algod client

## Returns

`Promise`\<[`SendTransactionResult`](../../types/transaction/interfaces/SendTransactionResult.md)\>

An object with transaction (`transaction`) and (if `skipWaiting` is `false` or `undefined`) confirmation (`confirmation`)

## Deprecated

Use `AlgorandClient` / `TransactionComposer` to send transactions.

Prepares a transaction for sending and then (if instructed) signs and sends the given transaction to the chain.
