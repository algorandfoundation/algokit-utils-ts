[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getSenderAddress

# Function: ~~getSenderAddress()~~

> **getSenderAddress**(`sender`): `string`

Defined in: [src/transaction/transaction.ts:110](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L110)

## Parameters

### sender

A transaction sender

`string` | [`SendTransactionFrom`](../../types/transaction/type-aliases/SendTransactionFrom.md)

## Returns

`string`

The public address

## Deprecated

Use `algorand.client` to interact with accounts, and use `.addr` to get the address
and/or move from using `SendTransactionFrom` to `TransactionSignerAccount` and use `.addr` instead.

Returns the public address of the given transaction sender.
