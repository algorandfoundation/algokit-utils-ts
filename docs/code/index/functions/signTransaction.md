[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / signTransaction

# Function: ~~signTransaction()~~

> **signTransaction**(`transaction`, `signer`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [src/transaction/transaction.ts:194](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L194)

## Parameters

### transaction

`Transaction`

The transaction to sign

### signer

[`SendTransactionFrom`](../../types/transaction/type-aliases/SendTransactionFrom.md)

The signer to sign

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

The signed transaction as a `Uint8Array`

## Deprecated

Use `AlgorandClient` / `TransactionComposer` to sign transactions
or use the relevant underlying `account.signTxn` / `algosdk.signLogicSigTransactionObject`
/ `multiSigAccount.sign` / `TransactionSigner` methods directly.

Signs a single transaction by the given signer.
