[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / decodeSignedTransaction

# Function: decodeSignedTransaction()

> **decodeSignedTransaction**(`encodedSignedTransaction`): [`SignedTransaction`](../type-aliases/SignedTransaction.md)

Defined in: [packages/transact/src/transactions/signed-transaction.ts:138](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/transactions/signed-transaction.ts#L138)

Decodes MsgPack bytes into a signed transaction.

## Parameters

### encodedSignedTransaction

`Uint8Array`

The MsgPack encoded signed transaction bytes

## Returns

[`SignedTransaction`](../type-aliases/SignedTransaction.md)

The decoded SignedTransaction or an error if decoding fails.
