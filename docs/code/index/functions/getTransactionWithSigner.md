[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getTransactionWithSigner

# Function: ~~getTransactionWithSigner()~~

> **getTransactionWithSigner**(`transaction`, `defaultSender?`): `Promise`\<`TransactionWithSigner`\>

Defined in: [src/transaction/transaction.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L135)

## Parameters

### transaction

One of: A TransactionWithSigner object (returned as is), a TransactionToSign object (signer is obtained from the
signer property), a Transaction object (signer is extracted from the defaultSender parameter), an async SendTransactionResult returned by
one of algokit utils' helpers (signer is obtained from the defaultSender parameter)

`Transaction` | [`TransactionToSign`](../../types/transaction/interfaces/TransactionToSign.md) | `Promise`\<[`SendTransactionResult`](../../types/transaction/interfaces/SendTransactionResult.md)\> | `TransactionWithSigner`

### defaultSender?

[`SendTransactionFrom`](../../types/transaction/type-aliases/SendTransactionFrom.md)

The default sender to be used to obtain a signer where the object provided to the transaction parameter does not
include a signer.

## Returns

`Promise`\<`TransactionWithSigner`\>

A TransactionWithSigner object.

## Deprecated

Use `AlgorandClient` / `TransactionComposer` to construct transactions instead or
construct an `algosdk.TransactionWithSigner` manually instead.

Given a transaction in a variety of supported formats, returns a TransactionWithSigner object ready to be passed to an
AtomicTransactionComposer's addTransaction method.
