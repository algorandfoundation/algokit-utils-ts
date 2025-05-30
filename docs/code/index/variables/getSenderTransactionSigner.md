[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getSenderTransactionSigner

# Variable: ~~getSenderTransactionSigner()~~

> `const` **getSenderTransactionSigner**: (`val`) => `TransactionSigner`

Defined in: [src/transaction/transaction.ts:176](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L176)

## Parameters

### val

[`SendTransactionFrom`](../../types/transaction/type-aliases/SendTransactionFrom.md)

## Returns

`TransactionSigner`

A transaction signer

## Deprecated

Use `TransactionSignerAccount` instead of `SendTransactionFrom` or use
`algosdk.makeBasicAccountTransactionSigner` / `algosdk.makeLogicSigAccountTransactionSigner`.

Returns a `TransactionSigner` for the given transaction sender.
This function has memoization, so will return the same transaction signer for a given sender.
