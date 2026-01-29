[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / decodeSignedTransactions

# Function: decodeSignedTransactions()

> **decodeSignedTransactions**(`encodedSignedTransactions`): [`SignedTransaction`](../type-aliases/SignedTransaction.md)[]

Defined in: [packages/transact/src/transactions/signed-transaction.ts:149](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/transact/src/transactions/signed-transaction.ts#L149)

Decodes a collection of MsgPack bytes into a signed transaction collection.

## Parameters

### encodedSignedTransactions

`Uint8Array`[]

A collection of MsgPack encoded bytes, each representing a signed transaction.

## Returns

[`SignedTransaction`](../type-aliases/SignedTransaction.md)[]

A collection of decoded signed transactions or an error if decoding fails.
